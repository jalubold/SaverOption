import { randomBytes } from "node:crypto";
import { listingPlans, type ListingPlanId } from "@/config/listing-plans";
import { liveCheckoutEnabled, lsApiKey, LS_API } from "@/lib/server/lemonsqueezy";
import { getSettings, saveSettings } from "@/lib/server/settings";

/**
 * One-click Lemon Squeezy setup for admins. With only LEMONSQUEEZY_API_KEY set,
 * it finds the store, matches the three one-time variants to the plans by price,
 * and creates (or updates) the webhook with a generated signing secret. The
 * results are saved in app_settings; env vars, when set, still win.
 *
 * Products and variants can't be created through the Lemon Squeezy API, so those
 * must exist first (one product with $9 / $19 / $49 single-payment variants).
 */

type Resource<A> = { id: string; attributes: A };
type StoreAttrs = { name: string; domain?: string; currency?: string };
type ProductAttrs = { name: string; status: string; store_id: number };
type VariantAttrs = { name: string; price: number; is_subscription: boolean; status: string; product_id: number };
type WebhookAttrs = { url: string; events: string[]; test_mode: boolean; store_id: number };

export const WEBHOOK_EVENTS = ["order_created", "order_refunded"];

export type SetupResult =
  | {
      ok: true;
      store: { id: string; name: string };
      variants: Record<ListingPlanId, { id: string; name: string; product: string; price: number }>;
      webhook: { id: string; url: string; created: boolean; testMode: boolean };
    }
  | { ok: false; error: string };

class SetupError extends Error {}

async function api<T>(apiKey: string, path: string, init?: { method: string; body: unknown }): Promise<T> {
  const res = await fetch(path.startsWith("http") ? path : `${LS_API}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: init ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  if (res.status === 401) throw new SetupError("Lemon Squeezy rejected the API key. Check LEMONSQUEEZY_API_KEY in Vercel.");
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { errors?: { detail?: string; title?: string }[] } | null;
    throw new SetupError(`Lemon Squeezy error ${res.status}: ${body?.errors?.map((e) => e.detail || e.title).join("; ") || res.statusText}`);
  }
  return (await res.json()) as T;
}

/** Follows JSON:API pagination (up to 10 pages of 100). */
async function list<A>(apiKey: string, path: string): Promise<Resource<A>[]> {
  const out: Resource<A>[] = [];
  let next: string | null = `${path}${path.includes("?") ? "&" : "?"}page[size]=100`;
  for (let i = 0; next && i < 10; i++) {
    const page: { data: Resource<A>[]; links?: { next?: string | null } } = await api(apiKey, next);
    out.push(...page.data);
    next = page.links?.next ?? null;
  }
  return out;
}

export async function setupLemonSqueezy(origin: string): Promise<SetupResult> {
  const apiKey = lsApiKey();
  if (!apiKey) return { ok: false, error: "Add LEMONSQUEEZY_API_KEY in Vercel → Settings → Environment Variables, redeploy, then try again." };
  try {
    // 1. Store
    const stores = await list<StoreAttrs>(apiKey, "/stores");
    const envStore = process.env.LEMONSQUEEZY_STORE_ID?.trim();
    const store = envStore ? stores.find((s) => s.id === envStore) : stores.length === 1 ? stores[0] : undefined;
    if (!store) {
      if (stores.length === 0) throw new SetupError("No store found for this API key. Create a store in Lemon Squeezy first.");
      throw new SetupError(`This API key can see ${stores.length} stores (${stores.map((s) => `${s.attributes.name} #${s.id}`).join(", ")}). Set LEMONSQUEEZY_STORE_ID to the one to use.`);
    }

    // 2. Variants: one-time, priced exactly like each plan.
    const products = (await list<ProductAttrs>(apiKey, `/products?filter[store_id]=${store.id}`)).filter((p) => p.attributes.status === "published");
    const candidates: { id: string; name: string; product: string; price: number; published: boolean; preferred: boolean }[] = [];
    for (const product of products) {
      const variants = await list<VariantAttrs>(apiKey, `/variants?filter[product_id]=${product.id}`);
      for (const v of variants) {
        if (v.attributes.is_subscription || v.attributes.status === "draft") continue;
        candidates.push({
          id: v.id,
          name: v.attributes.name,
          product: product.attributes.name,
          price: v.attributes.price,
          published: v.attributes.status === "published",
          preferred: /listing|saver|promot|sponsor/i.test(product.attributes.name),
        });
      }
    }
    const variants = {} as Record<ListingPlanId, { id: string; name: string; product: string; price: number }>;
    const missing: string[] = [];
    for (const plan of listingPlans) {
      const match = candidates
        .filter((c) => c.price === plan.price * 100)
        .sort((a, b) => Number(b.preferred) - Number(a.preferred) || Number(b.published) - Number(a.published))[0];
      if (match) variants[plan.id] = { id: match.id, name: match.name, product: match.product, price: match.price };
      else missing.push(`${plan.name} ($${plan.price})`);
    }
    if (missing.length) {
      throw new SetupError(
        `No published one-time variant priced for: ${missing.join(", ")}. In Lemon Squeezy, create a product (e.g. "Saver Option listing") with single-payment variants $9, $19 and $49, publish it, then try again.`,
      );
    }

    // 3. Webhook: reuse the saved secret so earlier (test or live) webhooks keep working.
    const saved = await getSettings();
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET?.trim() || saved.get("ls_webhook_secret") || randomBytes(16).toString("hex");
    const url = `${origin}/api/webhooks/lemonsqueezy`;
    const testMode = !liveCheckoutEnabled();
    const hooks = await list<WebhookAttrs>(apiKey, `/webhooks?filter[store_id]=${store.id}`);
    const existing = hooks.find((h) => h.attributes.url === url && Boolean(h.attributes.test_mode) === testMode);
    let webhookId: string;
    if (existing) {
      await api(apiKey, `/webhooks/${existing.id}`, {
        method: "PATCH",
        body: { data: { type: "webhooks", id: existing.id, attributes: { url, events: WEBHOOK_EVENTS, secret } } },
      });
      webhookId = existing.id;
    } else {
      const created: { data: { id: string } } = await api(apiKey, "/webhooks", {
        method: "POST",
        body: {
          data: {
            type: "webhooks",
            attributes: { url, events: WEBHOOK_EVENTS, secret, test_mode: testMode },
            relationships: { store: { data: { type: "stores", id: store.id } } },
          },
        },
      });
      webhookId = created.data.id;
    }

    await saveSettings({
      ls_store_id: store.id,
      ls_store_name: store.attributes.name,
      ls_variant_1m: variants["1m"].id,
      ls_variant_3m: variants["3m"].id,
      ls_variant_1y: variants["1y"].id,
      ls_webhook_secret: secret,
      ls_webhook_id: webhookId,
      ls_webhook_url: url,
      ls_webhook_test_mode: String(testMode),
      ls_setup_at: new Date().toISOString(),
    });
    return { ok: true, store: { id: store.id, name: store.attributes.name }, variants, webhook: { id: webhookId, url, created: !existing, testMode } };
  } catch (err) {
    if (err instanceof SetupError) return { ok: false, error: err.message };
    console.error("[ls-setup]", err instanceof Error ? err.message : err);
    return { ok: false, error: "Couldn't reach Lemon Squeezy. Please try again." };
  }
}
