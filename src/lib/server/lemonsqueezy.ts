import { createHmac, timingSafeEqual } from "node:crypto";
import { getPlan, listingPlans, type ListingPlan, type ListingPlanId } from "@/config/listing-plans";
import { getSettings } from "@/lib/server/settings";

/**
 * Lemon Squeezy integration, isolated behind three functions (checkoutMode,
 * createCheckout, parseOrderWebhook) so another provider can replace it without
 * touching the advertiser flow.
 *
 * Live payments stay off until LEMONSQUEEZY_LIVE_CHECKOUT_ENABLED=true is set,
 * which must only happen once Lemon Squeezy has approved paid directory listings
 * in writing (their prohibited-products list includes website advertising).
 */

export const LS_API = (process.env.LEMONSQUEEZY_API_URL?.replace(/\/$/, "") || "https://api.lemonsqueezy.com/v1") as string;

export interface LsCatalog {
  storeId: string | null;
  variants: Record<ListingPlanId, string | null>;
}
export interface LsConfig {
  apiKey: string;
  storeId: string;
  variants: Record<ListingPlanId, string>;
}

/**
 * Store and variant IDs: from env vars when set, otherwise from what the admin
 * "Connect Lemon Squeezy" button found and saved (see lemonsqueezy-setup.ts).
 */
export async function lsCatalog(): Promise<LsCatalog> {
  const saved = await getSettings();
  return {
    storeId: process.env.LEMONSQUEEZY_STORE_ID?.trim() || saved.get("ls_store_id") || null,
    variants: Object.fromEntries(
      listingPlans.map((p) => [p.id, process.env[p.variantEnv]?.trim() || saved.get(`ls_variant_${p.id}`) || null]),
    ) as Record<ListingPlanId, string | null>,
  };
}

export function lsApiKey(): string | null {
  return process.env.LEMONSQUEEZY_API_KEY?.trim() || null;
}

/** Everything needed to create a checkout, or null if anything is missing. */
export async function lsConfig(): Promise<LsConfig | null> {
  const apiKey = lsApiKey();
  if (!apiKey) return null;
  const { storeId, variants } = await lsCatalog();
  if (!storeId || Object.values(variants).some((v) => !v)) return null;
  return { apiKey, storeId, variants: variants as Record<ListingPlanId, string> };
}

export async function webhookSecret(): Promise<string | null> {
  return process.env.LEMONSQUEEZY_WEBHOOK_SECRET?.trim() || (await getSettings()).get("ls_webhook_secret") || null;
}

export function liveCheckoutEnabled(): boolean {
  return process.env.LEMONSQUEEZY_LIVE_CHECKOUT_ENABLED === "true";
}

export type CheckoutMode = "live" | "test" | "disabled" | "unconfigured";

/**
 * Whether a visitor can be sent to checkout right now.
 *  - live: approved for real payments (explicit env flag)
 *  - test: Lemon Squeezy test mode — preview/development deployments, or admins on production
 *  - disabled: configured but not approved; the flow saves the submission and offers email instead
 */
export async function checkoutMode({ admin = false }: { admin?: boolean } = {}): Promise<CheckoutMode> {
  if (!(await lsConfig())) return "unconfigured";
  if (liveCheckoutEnabled()) return "live";
  if (process.env.VERCEL_ENV !== "production" || admin) return "test";
  return "disabled";
}

export function planForVariant(catalog: LsCatalog, variantId: string): ListingPlan | undefined {
  const id = (Object.keys(catalog.variants) as ListingPlanId[]).find((k) => catalog.variants[k] === variantId);
  return getPlan(id);
}

export class LemonSqueezyError extends Error {}

/** Creates a hosted checkout for one plan and returns its URL. */
export async function createCheckout(opts: {
  plan: ListingPlan;
  submissionId: string;
  email: string;
  testMode: boolean;
  redirectUrl: string;
  receiptLinkUrl: string;
}): Promise<{ id: string; url: string; expiresAt: string }> {
  const cfg = await lsConfig();
  if (!cfg) throw new LemonSqueezyError("Lemon Squeezy is not configured");
  const variantId = cfg.variants[opts.plan.id];
  const expiresAt = new Date(Date.now() + 24 * 3600_000).toISOString();

  const res = await fetch(`${LS_API}/checkouts`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          product_options: {
            enabled_variants: [Number(variantId)],
            redirect_url: opts.redirectUrl,
            receipt_link_url: opts.receiptLinkUrl,
            receipt_button_text: "Manage your listing",
            receipt_thank_you_note: "Thanks! Create your Saver Option account from the button below to manage your listing.",
          },
          checkout_data: {
            email: opts.email,
            // Correlates the order with our submission in webhooks (strings only).
            custom: { submission_id: opts.submissionId },
          },
          expires_at: expiresAt,
          test_mode: opts.testMode,
        },
        relationships: {
          store: { data: { type: "stores", id: cfg.storeId } },
          variant: { data: { type: "variants", id: variantId } },
        },
      },
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    // Log the status and error titles only — never the request (it carries the API key header).
    const body = (await res.json().catch(() => null)) as { errors?: { title?: string; detail?: string }[] } | null;
    const reason = body?.errors?.map((e) => e.detail || e.title).join("; ") || res.statusText;
    throw new LemonSqueezyError(`Checkout creation failed (${res.status}): ${reason}`);
  }
  const json = (await res.json()) as { data?: { id?: string; attributes?: { url?: string } } };
  const url = json.data?.attributes?.url;
  if (!json.data?.id || !url || !url.startsWith("https://")) throw new LemonSqueezyError("Checkout response had no URL");
  return { id: json.data.id, url, expiresAt };
}

/** Constant-time check of the X-Signature header (HMAC-SHA256 hex of the raw body). */
export function verifyWebhookSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature || !/^[0-9a-f]{64}$/i.test(signature)) return false;
  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest();
  const given = Buffer.from(signature, "hex");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export type OrderStatus = "pending" | "paid" | "failed" | "refunded" | "partially_refunded";

export interface OrderEvent {
  eventName: string;
  submissionId: string | null;
  orderId: string;
  storeId: string;
  identifier: string | null;
  orderNumber: number | null;
  variantId: string;
  status: OrderStatus;
  currency: string;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  refundedCents: number;
  testMode: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  refundedAt: string | null;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const int = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.round(v) : 0);
const str = (v: unknown) => (typeof v === "string" && v ? v : null);

/** Maps Lemon Squeezy's order status to ours ("fraudulent" orders count as failed). */
function mapStatus(s: unknown): OrderStatus | null {
  switch (s) {
    case "pending":
      return "pending";
    case "paid":
      return "paid";
    case "failed":
    case "fraudulent":
      return "failed";
    case "refunded":
      return "refunded";
    case "partial_refund":
      return "partially_refunded";
    default:
      return null;
  }
}

/** Extracts the fields we use from an order webhook body, or null if it isn't a usable order event. */
export function parseOrderWebhook(body: unknown, headerEventName: string | null): OrderEvent | null {
  const b = body as {
    meta?: { event_name?: string; test_mode?: boolean; custom_data?: Record<string, unknown> };
    data?: { type?: string; id?: string | number; attributes?: Record<string, unknown> };
  };
  const eventName = headerEventName || b?.meta?.event_name || "";
  if (b?.data?.type !== "orders" || b.data.id === undefined || !b.data.attributes) return null;
  const a = b.data.attributes;
  const item = (a.first_order_item ?? {}) as Record<string, unknown>;
  const status = mapStatus(a.status);
  const variantId = item.variant_id !== undefined ? String(item.variant_id) : null;
  if (!status || !variantId || a.store_id === undefined) return null;
  const custom = b.meta?.custom_data?.submission_id;
  return {
    eventName,
    submissionId: typeof custom === "string" && UUID.test(custom) ? custom.toLowerCase() : null,
    orderId: String(b.data.id),
    storeId: String(a.store_id),
    identifier: str(a.identifier),
    orderNumber: typeof a.order_number === "number" ? a.order_number : null,
    variantId,
    status,
    currency: str(a.currency) ?? "USD",
    subtotalCents: int(a.subtotal),
    taxCents: int(a.tax),
    totalCents: int(a.total),
    refundedCents: int(a.refunded_amount),
    testMode: Boolean(a.test_mode ?? b.meta?.test_mode),
    createdAt: str(a.created_at),
    updatedAt: str(a.updated_at),
    refundedAt: str(a.refunded_at),
  };
}
