import { randomBytes } from "node:crypto";
import { listingPlans, type ListingPlan, type ListingPlanId } from "@/config/listing-plans";
import { siteConfig } from "@/config/site";
import { db, dbConfigured } from "@/lib/server/db";
import { CATALOG_VERSION, isLegacyCatalog, liveCheckoutEnabled, lsApiKey, LS_API } from "@/lib/server/lemonsqueezy";
import { getSettings, saveSettings } from "@/lib/server/settings";

/**
 * One-click Lemon Squeezy setup for admins. With only LEMONSQUEEZY_API_KEY set,
 * it finds the store, matches the three subscription variants to the plans by
 * billing interval (every month, 3 months, year), saves their prices, and creates
 * (or updates) the webhook with a generated signing secret. The results are
 * saved in app_settings; env vars, when set, still win.
 *
 * Products and variants can't be created through the Lemon Squeezy API, so those
 * must exist first (one subscription product with the three billing intervals).
 */

type Resource<A> = { id: string; attributes: A };
type StoreAttrs = { name: string; domain?: string; currency?: string };
type ProductAttrs = { name: string; status: string; store_id: number };
type VariantAttrs = {
  name: string;
  price: number;
  is_subscription: boolean;
  interval?: string | null;
  interval_count?: number | null;
  status: string;
  product_id: number;
};
type WebhookAttrs = { url: string; events: string[]; test_mode: boolean; store_id: number };

/** Orders (first payment, refunds), subscription changes and renewal payments. */
export const WEBHOOK_EVENTS = [
  "order_created",
  "order_refunded",
  "subscription_created",
  "subscription_updated",
  "subscription_cancelled",
  "subscription_resumed",
  "subscription_expired",
  "subscription_paused",
  "subscription_unpaused",
  "subscription_payment_success",
  "subscription_payment_failed",
  "subscription_payment_recovered",
  "subscription_payment_refunded",
];
/** The events that matter most, if Lemon Squeezy rejects the full list. */
const CORE_WEBHOOK_EVENTS = ["order_created", "order_refunded", "subscription_created", "subscription_updated", "subscription_payment_success"];

const CADENCES = listingPlans.map((p) => `every ${p.intervalCount === 1 ? p.interval : p.period}`).join(", ").replace(/, ([^,]*)$/, " and $1");

/** Whether a variant bills at this plan's interval (a year may also be set up as 12 months). */
function billsLike(plan: ListingPlan, v: VariantAttrs): boolean {
  const count = v.interval_count || 1;
  if (v.interval === plan.interval && count === plan.intervalCount) return true;
  return plan.interval === "year" && plan.intervalCount === 1 && v.interval === "month" && count === 12;
}

function describeInterval(v: VariantAttrs): string {
  if (!v.is_subscription) return "one-time";
  const count = v.interval_count || 1;
  return v.interval ? `every ${count === 1 ? v.interval : `${count} ${v.interval}s`}` : "subscription";
}

export type SetupResult =
  | {
      ok: true;
      store: { id: string; name: string };
      variants: Record<ListingPlanId, { id: string; name: string; product: string; price: number }>;
      /** The full event list was refused and only the core events were registered. */
      coreEventsOnly?: boolean;
      webhook: { id: string; url: string; created: boolean; testMode: boolean };
    }
  /** `details` lists what was found in Lemon Squeezy (names and prices only), to show what's missing. */
  | { ok: false; error: string; details?: string[] };

class SetupError extends Error {
  constructor(
    message: string,
    readonly details?: string[],
  ) {
    super(message);
  }
}

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
    // Never leave the admin waiting on a hung request.
    signal: AbortSignal.timeout(15_000),
  }).catch((err: unknown) => {
    if (err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError")) {
      throw new SetupError("Lemon Squeezy took too long to respond. Please try again in a moment.");
    }
    throw err;
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

    // 2. Variants: subscriptions billed every month, 3 months and year.
    const currency = store.attributes.currency || "USD";
    const money = (cents: number) => {
      try {
        return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
      } catch {
        return `${cents / 100} ${currency}`;
      }
    };
    const products = await list<ProductAttrs>(apiKey, `/products?filter[store_id]=${store.id}`);
    const inventory: string[] = [];
    const drafts: string[] = []; // unpublished products that carry subscription variants
    const candidates: { id: string; name: string; product: string; price: number; attrs: VariantAttrs; published: boolean; preferred: number }[] = [];
    const variantsByProduct = await Promise.all(products.map((p) => list<VariantAttrs>(apiKey, `/variants?filter[product_id]=${p.id}`)));
    for (const [i, product] of products.entries()) {
      const variants = variantsByProduct[i];
      const shown = variants.filter((v) => v.attributes.status !== "pending" || variants.length === 1);
      inventory.push(
        `"${product.attributes.name}" (${product.attributes.status}): ${
          shown
            .map((v) => `${v.attributes.name} ${money(v.attributes.price)} ${describeInterval(v.attributes)}${v.attributes.status === "draft" ? " (draft)" : ""}`)
            .join(", ") || "no variants"
        }`,
      );
      if (product.attributes.status !== "published") {
        if (variants.some((v) => v.attributes.is_subscription)) drafts.push(product.attributes.name);
        continue;
      }
      for (const v of variants) {
        if (!v.attributes.is_subscription || v.attributes.status === "draft") continue;
        candidates.push({
          id: v.id,
          name: v.attributes.name,
          product: product.attributes.name,
          price: v.attributes.price,
          attrs: v.attributes,
          published: v.attributes.status === "published",
          preferred: /subscri/i.test(product.attributes.name) ? 2 : /listing|saver|promot|sponsor/i.test(product.attributes.name) ? 1 : 0,
        });
      }
    }
    // A product named like "Subscription" is the one to sell: all three plans come from it,
    // never from another product (such as an older listing product that also has subscriptions).
    const named = candidates.filter((c) => c.preferred === 2);
    const pool = named.length ? named : candidates;
    // Otherwise take all three from one product when one has them all.
    const coverage = new Map<string, number>();
    for (const plan of listingPlans) {
      for (const product of new Set(pool.filter((c) => billsLike(plan, c.attrs)).map((c) => c.product))) {
        coverage.set(product, (coverage.get(product) ?? 0) + 1);
      }
    }
    const variants = {} as Record<ListingPlanId, { id: string; name: string; product: string; price: number }>;
    const missing: string[] = [];
    for (const plan of listingPlans) {
      const match = pool
        .filter((c) => billsLike(plan, c.attrs) && c.price > 0)
        .sort(
          (a, b) =>
            (coverage.get(b.product) ?? 0) - (coverage.get(a.product) ?? 0) ||
            b.preferred - a.preferred ||
            Number(b.published) - Number(a.published),
        )[0];
      if (match) variants[plan.id] = { id: match.id, name: match.name, product: match.product, price: match.price };
      else missing.push(`${plan.name} (every ${plan.intervalCount === 1 ? plan.interval : plan.period})`);
    }
    // A "Subscription" product that's still a draft must be published, not replaced by another product.
    const draftOnly = !named.length && drafts.some((d) => /subscri/i.test(d));
    if (currency !== "USD" || missing.length || draftOnly) {
      const details = [`Store "${store.attributes.name}", currency ${currency}`, ...(inventory.length ? inventory.slice(0, 12) : ["No products"])];
      let hint: string;
      if (currency !== "USD") {
        hint = `Your Lemon Squeezy store is priced in ${currency}, but the site sells in USD. Change the store currency to USD in Lemon Squeezy (Settings → Stores), then try again.`;
      } else if (products.length === 0) {
        hint =
          "This API key can't see any products in your store. Lemon Squeezy keeps Test mode and live mode separate: create the product while Test mode is ON (or use an API key from the same mode as your products), then try again.";
      } else if (draftOnly || drafts.length) {
        hint = `"${drafts.join('", "')}" is still a draft. Publish it in Lemon Squeezy, then try again.`;
      } else {
        const where = named.length ? `"${[...new Set(named.map((c) => c.product))].join('", "')}" has` : "Couldn't find";
        hint = `${where} no published subscription variant for: ${missing.join(", ")}. Give your subscription product three variants billed ${CADENCES} (Pricing → Subscription, "Repeat payment every"), then try again.`;
      }
      throw new SetupError(hint, details);
    }

    // 3. Webhook: reuse the saved secret so earlier (test or live) webhooks keep working.
    const saved = await getSettings();
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET?.trim() || saved.get("ls_webhook_secret") || randomBytes(16).toString("hex");
    const url = `${origin}/api/webhooks/lemonsqueezy`;
    const testMode = !liveCheckoutEnabled();
    const hooks = await list<WebhookAttrs>(apiKey, `/webhooks?filter[store_id]=${store.id}`);
    const existing = hooks.find((h) => h.attributes.url === url && Boolean(h.attributes.test_mode) === testMode);
    const saveHook = async (events: string[]): Promise<string> => {
      if (existing) {
        await api(apiKey, `/webhooks/${existing.id}`, {
          method: "PATCH",
          body: { data: { type: "webhooks", id: existing.id, attributes: { url, events, secret } } },
        });
        return existing.id;
      }
      const created: { data: { id: string } } = await api(apiKey, "/webhooks", {
        method: "POST",
        body: {
          data: {
            type: "webhooks",
            attributes: { url, events, secret, test_mode: testMode },
            relationships: { store: { data: { type: "stores", id: store.id } } },
          },
        },
      });
      return created.data.id;
    };
    let webhookId: string;
    let coreEventsOnly = false;
    try {
      webhookId = await saveHook(WEBHOOK_EVENTS);
    } catch (err) {
      // An event name this account doesn't offer: keep the ones the listing flow can't work without.
      if (!(err instanceof SetupError && /error 422/.test(err.message))) throw err;
      webhookId = await saveHook(CORE_WEBHOOK_EVENTS);
      coreEventsOnly = true;
    }

    await saveSettings({
      ls_store_id: store.id,
      ls_store_name: store.attributes.name,
      ls_variant_1m: variants["1m"].id,
      ls_variant_3m: variants["3m"].id,
      ls_variant_1y: variants["1y"].id,
      ls_price_1m: String(variants["1m"].price),
      ls_price_3m: String(variants["3m"].price),
      ls_price_1y: String(variants["1y"].price),
      ls_product_name: variants["1m"].product,
      ls_catalog: CATALOG_VERSION,
      ls_webhook_secret: secret,
      ls_webhook_id: webhookId,
      ls_webhook_url: url,
      ls_webhook_test_mode: String(testMode),
      ls_setup_at: new Date().toISOString(),
    });
    return { ok: true, store: { id: store.id, name: store.attributes.name }, variants, webhook: { id: webhookId, url, created: !existing, testMode }, coreEventsOnly };
  } catch (err) {
    if (err instanceof SetupError) return { ok: false, error: err.message, details: err.details };
    console.error("[ls-setup]", err instanceof Error ? err.message : err);
    return { ok: false, error: "Couldn't reach Lemon Squeezy. Please try again." };
  }
}

const UPGRADE_RETRY_MS = 10 * 60_000;

/**
 * Sites connected by an older version of Connect (e.g. to the old one-time
 * product) have a catalog that isn't sold any more. Production reconnects itself once
 * (when a server starts, or before a checkout) so nobody has to press Connect
 * again: same store, same webhook URL and secret, now with the subscription
 * variants and their prices. One server at a time; a failure is saved for
 * /admin/setup and retried after 10 minutes. Returns true if it reconnected.
 */
export async function upgradeLegacyCatalog(): Promise<boolean> {
  if (process.env.VERCEL_ENV !== "production" || !dbConfigured() || !lsApiKey()) return false;
  const saved = await getSettings();
  if (!isLegacyCatalog(saved)) return false;
  // After a failed attempt, wait before asking Lemon Squeezy again.
  if (saved.get("ls_upgrade_error") && Date.now() - Number(saved.get("ls_upgrade_tried_at") ?? 0) < UPGRADE_RETRY_MS) return false;

  return db().begin(async (tx) => {
    const [{ locked }] = await tx<{ locked: boolean }[]>`select pg_try_advisory_xact_lock(hashtext('saveroption:ls-upgrade')) as locked`;
    if (!locked) return false;
    // Another server may have just finished (this one's settings are cached).
    const done = await tx`select 1 from app_settings where key = 'ls_catalog' and value = ${CATALOG_VERSION}`;
    if (done.length) return false;
    await saveSettings({ ls_upgrade_tried_at: String(Date.now()) });

    const hook = saved.get("ls_webhook_url");
    const origin = hook ? new URL(hook).origin : siteConfig.url;
    const result = await setupLemonSqueezy(origin);
    await saveSettings({ ls_upgrade_error: result.ok ? null : result.error });
    if (result.ok) console.log(`[ls-setup] reconnected to the subscription plans in ${result.store.name}`);
    else console.error(`[ls-setup] automatic reconnect failed: ${result.error}`);
    return result.ok;
  });
}
