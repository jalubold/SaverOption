import { Webhook } from "standardwebhooks";
import { listingPlans, type ListingPlan, type ListingPlanId } from "@/config/listing-plans";
import type { SubscriptionStatus } from "@/lib/listing-status";
import type { CheckoutMode, OrderStatus } from "@/lib/server/lemonsqueezy";

/**
 * Dodo Payments for listing subscriptions. Endpoints and fields follow Dodo's official
 * SDK (the dodopayments npm package): POST /checkouts, GET /products/{id} and
 * POST /customers/{id}/customer-portal/session, with Bearer API keys; webhooks are
 * signed per the Standard Webhooks spec (webhook-id, webhook-timestamp, webhook-signature).
 *
 * Configured entirely by env vars (server only):
 *  - DODO_PAYMENTS_API_KEY: a restricted key (checkout sessions write, customers write,
 *    products, subscriptions and payments read). Test or live is read from its prefix
 *    (dodo_test_ / dodo_live_), or from DODO_PAYMENTS_ENVIRONMENT=test_mode|live_mode.
 *  - DODO_PAYMENTS_WEBHOOK_KEY: the webhook endpoint's signing secret.
 *  - DODO_PRODUCT_ID_MONTHLY / _QUARTERLY / _YEARLY: the three subscription products.
 *
 * A live key means live payments: Dodo only allows those once the business is verified.
 */

const HOSTS = { test_mode: "https://test.dodopayments.com", live_mode: "https://live.dodopayments.com" } as const;
export type DodoEnvironment = keyof typeof HOSTS;

/** Server env var holding each plan's Dodo product id. */
export const DODO_PRODUCT_ENV: Record<ListingPlanId, string> = {
  "1m": "DODO_PRODUCT_ID_MONTHLY",
  "3m": "DODO_PRODUCT_ID_QUARTERLY",
  "1y": "DODO_PRODUCT_ID_YEARLY",
};

export interface DodoConfig {
  apiKey: string;
  environment: DodoEnvironment;
  baseUrl: string;
  products: Record<ListingPlanId, string>;
}

export class DodoError extends Error {}

export function dodoApiKey(): string | null {
  return process.env.DODO_PAYMENTS_API_KEY?.trim() || null;
}

export function dodoWebhookKey(): string | null {
  return process.env.DODO_PAYMENTS_WEBHOOK_KEY?.trim() || null;
}

export function dodoProducts(): Record<ListingPlanId, string | null> {
  return Object.fromEntries(listingPlans.map((p) => [p.id, process.env[DODO_PRODUCT_ENV[p.id]]?.trim() || null])) as Record<ListingPlanId, string | null>;
}

/** Overridable for local testing against a mock. */
function baseUrl(environment: DodoEnvironment): string {
  return process.env.DODO_PAYMENTS_BASE_URL?.trim().replace(/\/$/, "") || HOSTS[environment];
}

/** Test or live from DODO_PAYMENTS_ENVIRONMENT or the key's prefix; null when neither says. */
export function declaredEnvironment(apiKey = dodoApiKey()): DodoEnvironment | null {
  const env = process.env.DODO_PAYMENTS_ENVIRONMENT?.trim();
  if (env === "test_mode" || env === "live_mode") return env;
  if (apiKey?.startsWith("dodo_test_")) return "test_mode";
  if (apiKey?.startsWith("dodo_live_")) return "live_mode";
  return null;
}

// A key whose prefix doesn't say is tried against the test host, then the live one (keys only work on their own).
// A failed try is repeated after a minute, so a product fixed in Dodo is picked up without a redeploy.
let probed: { key: string; environment: DodoEnvironment | null; at: number } | null = null;

async function resolveEnvironment(apiKey: string, productId: string): Promise<DodoEnvironment | null> {
  const declared = declaredEnvironment(apiKey);
  if (declared) return declared;
  if (probed?.key === apiKey && (probed.environment || Date.now() - probed.at < 60_000)) return probed.environment;
  let environment: DodoEnvironment | null = null;
  for (const env of ["test_mode", "live_mode"] as const) {
    try {
      const res = await fetch(`${baseUrl(env)}/products/${encodeURIComponent(productId)}`, {
        headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(8_000),
      });
      if (res.ok) {
        environment = env;
        break;
      }
    } catch {
      // Unreachable: try the other one.
    }
  }
  probed = { key: apiKey, environment, at: Date.now() };
  return environment;
}

/** Everything needed to sell through Dodo, or null if anything is missing. */
export async function dodoConfig(): Promise<DodoConfig | null> {
  const apiKey = dodoApiKey();
  const products = dodoProducts();
  if (!apiKey || Object.values(products).some((p) => !p)) return null;
  const environment = await resolveEnvironment(apiKey, products["1m"]!);
  if (!environment) return null;
  return { apiKey, environment, baseUrl: baseUrl(environment), products: products as Record<ListingPlanId, string> };
}

/**
 * Whether a visitor can be sent to a Dodo checkout: a live key sells for real; a test key
 * sells test payments on preview/development deployments and to admins on production
 * (other visitors on production get "disabled": the form saves the submission and offers email).
 */
export async function dodoCheckoutMode({ admin = false }: { admin?: boolean } = {}): Promise<CheckoutMode> {
  const cfg = await dodoConfig();
  // Only sell when every product can be read and bills like its plan, so the price shown is the price charged.
  if (!cfg || Object.keys(await pricesFor(cfg)).length !== listingPlans.length) return "unconfigured";
  if (cfg.environment === "live_mode") return "live";
  return process.env.VERCEL_ENV !== "production" || admin ? "test" : "disabled";
}

async function call<T>(cfg: DodoConfig, method: "GET" | "POST", path: string, opts: { body?: unknown; query?: Record<string, string> } = {}): Promise<T> {
  const url = new URL(cfg.baseUrl + path);
  for (const [k, v] of Object.entries(opts.query ?? {})) url.searchParams.set(k, v);
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${cfg.apiKey}`,
      Accept: "application/json",
      ...(opts.body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    // Log the status and Dodo's message only — never the request (it carries the API key).
    const body = (await res.json().catch(() => null)) as { message?: unknown; code?: unknown } | null;
    const reason = [body?.code, body?.message].filter((x) => typeof x === "string").join(": ") || res.statusText;
    throw new DodoError(`${method} ${path.split("/")[1]} failed (${res.status}): ${reason.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

/** Creates a hosted checkout session for one plan and returns its id and URL. */
export async function createDodoCheckout(opts: {
  plan: ListingPlan;
  submissionId: string;
  email: string;
  returnUrl: string;
  cancelUrl: string;
}): Promise<{ id: string; url: string }> {
  const cfg = await dodoConfig();
  if (!cfg) throw new DodoError("Dodo Payments is not configured");
  const session = await call<{ session_id?: unknown; checkout_url?: unknown }>(cfg, "POST", "/checkouts", {
    body: {
      product_cart: [{ product_id: cfg.products[opts.plan.id], quantity: 1 }],
      customer: { email: opts.email },
      return_url: opts.returnUrl,
      cancel_url: opts.cancelUrl,
      // Correlates the payment and subscription with our submission in webhooks.
      metadata: { submission_id: opts.submissionId },
    },
  });
  const id = typeof session.session_id === "string" ? session.session_id : null;
  const url = typeof session.checkout_url === "string" ? session.checkout_url : null;
  if (!id || !url || !url.startsWith("https://")) throw new DodoError("Checkout response had no URL");
  return { id, url };
}

export interface DodoProductInfo {
  productId: string;
  name: string | null;
  recurring: boolean;
  priceCents: number | null;
  currency: string | null;
  /** e.g. { count: 3, interval: "Month" } */
  every: { count: number; interval: string } | null;
}

/** A product's price and billing period (cached for 15 minutes), or an error message. */
export async function dodoProduct(cfg: DodoConfig, productId: string): Promise<DodoProductInfo | { error: string }> {
  try {
    const res = await fetch(`${cfg.baseUrl}/products/${encodeURIComponent(productId)}`, {
      headers: { Authorization: `Bearer ${cfg.apiKey}`, Accept: "application/json" },
      next: { revalidate: 900, tags: ["dodo-products"] },
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) return { error: res.status === 404 ? "not found in this mode" : `couldn't be read (${res.status})` };
    const p = (await res.json()) as {
      name?: unknown;
      is_recurring?: unknown;
      price?: { type?: unknown; price?: unknown; currency?: unknown; payment_frequency_count?: unknown; payment_frequency_interval?: unknown };
    };
    const price = p.price ?? {};
    const recurring = price.type === "recurring_price";
    return {
      productId,
      name: typeof p.name === "string" ? p.name : null,
      recurring,
      priceCents: typeof price.price === "number" && Number.isInteger(price.price) && price.price > 0 ? price.price : null,
      currency: typeof price.currency === "string" ? price.currency : null,
      every:
        recurring && typeof price.payment_frequency_count === "number" && typeof price.payment_frequency_interval === "string"
          ? { count: price.payment_frequency_count, interval: price.payment_frequency_interval }
          : null,
    };
  } catch {
    return { error: "couldn't be reached" };
  }
}

/** Whether a product bills the way a plan says (every month, every 3 months, every year). */
export function matchesPlan(info: DodoProductInfo, plan: ListingPlan): boolean {
  const want = plan.interval === "year" ? { count: 1, interval: "Year" } : { count: plan.intervalCount, interval: "Month" };
  return info.recurring && info.every?.count === want.count && info.every.interval === want.interval && (info.currency ?? "USD") === plan.currency;
}

/** Prices (cents) of the configured products that bill the way their plan says. */
export async function dodoPrices(): Promise<Partial<Record<ListingPlanId, number>>> {
  const cfg = await dodoConfig();
  return cfg ? pricesFor(cfg) : {};
}

async function pricesFor(cfg: DodoConfig): Promise<Partial<Record<ListingPlanId, number>>> {
  const prices: Partial<Record<ListingPlanId, number>> = {};
  await Promise.all(
    listingPlans.map(async (plan) => {
      const info = await dodoProduct(cfg, cfg.products[plan.id]);
      if (!("error" in info) && info.priceCents && matchesPlan(info, plan)) prices[plan.id] = info.priceCents;
    }),
  );
  return prices;
}

const describe = (every: { count: number; interval: string } | null) =>
  every ? (every.count === 1 ? `every ${every.interval.toLowerCase()}` : `every ${every.count} ${every.interval.toLowerCase()}s`) : "once";

export interface DodoSetupStatus {
  apiKey: boolean;
  environment: DodoEnvironment | null;
  webhookKey: boolean;
  plans: { plan: ListingPlan; productId: string | null; info: DodoProductInfo | null; problem: string | null }[];
}

/** For the admin setup page: what's configured, and whether each product bills like its plan. */
export async function dodoSetupStatus(): Promise<DodoSetupStatus> {
  const apiKey = dodoApiKey();
  const products = dodoProducts();
  const cfg = await dodoConfig();
  const plans = await Promise.all(
    listingPlans.map(async (plan) => {
      const productId = products[plan.id];
      if (!productId) return { plan, productId, info: null, problem: `Add ${DODO_PRODUCT_ENV[plan.id]} in Vercel.` };
      if (!cfg) {
        const problem = !apiKey
          ? "Needs the API key."
          : Object.values(products).some((p) => !p)
            ? "Checked once every product id is set."
            : "The API key works with neither test nor live mode.";
        return { plan, productId, info: null, problem };
      }
      const info = await dodoProduct(cfg, productId);
      if ("error" in info) return { plan, productId, info: null, problem: `Product ${info.error}.` };
      if (!matchesPlan(info, plan)) {
        const want = plan.interval === "year" ? { count: 1, interval: "Year" } : { count: plan.intervalCount, interval: "Month" };
        const problem = !info.recurring
          ? "It's a one-time product; it must be a subscription."
          : `It bills ${describe(info.every)}${info.currency && info.currency !== plan.currency ? ` in ${info.currency}` : ""}; this plan needs ${describe(want)} in ${plan.currency}.`;
        return { plan, productId, info, problem };
      }
      return { plan, productId, info, problem: null };
    }),
  );
  return { apiKey: Boolean(apiKey), environment: cfg?.environment ?? declaredEnvironment(apiKey), webhookKey: Boolean(dodoWebhookKey()), plans };
}

/**
 * A link to Dodo's customer portal, where the advertiser updates their card or cancels.
 * Made fresh each time; null if it can't be had.
 */
export async function dodoPortalUrl(customerId: string, returnUrl: string): Promise<string | null> {
  const cfg = await dodoConfig();
  if (!cfg || !/^[A-Za-z0-9_-]{1,100}$/.test(customerId)) return null;
  try {
    const session = await call<{ link?: unknown }>(cfg, "POST", `/customers/${encodeURIComponent(customerId)}/customer-portal/session`, {
      query: { return_url: returnUrl },
    });
    return typeof session.link === "string" && session.link.startsWith("https://") ? session.link : null;
  } catch (err) {
    console.error("[dodo] customer portal failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

export function planForProduct(products: Record<ListingPlanId, string | null>, productId: string | null): ListingPlanId | null {
  if (!productId) return null;
  return (Object.keys(products) as ListingPlanId[]).find((k) => products[k] === productId) ?? null;
}

// ─── Webhooks ────────────────────────────────────────────────────────────────

/** Checks the Standard Webhooks signature (and timestamp) of a delivery against its raw body. */
export function verifyDodoWebhook(raw: string, headers: Headers, secret: string): boolean {
  const id = headers.get("webhook-id");
  const timestamp = headers.get("webhook-timestamp");
  const signature = headers.get("webhook-signature");
  if (!id || !timestamp || !signature) return false;
  try {
    new Webhook(secret).verify(raw, { "webhook-id": id, "webhook-timestamp": timestamp, "webhook-signature": signature });
    return true;
  } catch {
    return false;
  }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const str = (v: unknown) => (typeof v === "string" && v ? v : null);
const int = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.round(v) : 0);
const date = (v: unknown) => {
  const d = typeof v === "string" && v ? new Date(v) : null;
  return d && !Number.isNaN(d.getTime()) ? d : null;
};
type Obj = Record<string, unknown>;
const obj = (v: unknown): Obj => (v && typeof v === "object" ? (v as Obj) : {});

function submissionIdFrom(metadata: unknown): string | null {
  const id = obj(metadata).submission_id;
  return typeof id === "string" && UUID.test(id) ? id.toLowerCase() : null;
}

interface Envelope {
  type: string;
  /** When Dodo sent the event, which orders the events of one object. */
  at: Date;
  data: Obj;
}

export interface DodoPaymentEvent {
  kind: "payment";
  type: string;
  paymentId: string;
  status: OrderStatus;
  submissionId: string | null;
  checkoutSessionId: string | null;
  subscriptionId: string | null;
  customerId: string | null;
  productId: string | null;
  currency: string;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  createdAt: Date | null;
  at: Date;
}

export interface DodoSubscriptionEvent {
  kind: "subscription";
  type: string;
  subscriptionId: string;
  status: SubscriptionStatus;
  submissionId: string | null;
  /** The payment that started it, when Dodo says. */
  paymentId: string | null;
  customerId: string | null;
  productId: string | null;
  renewsAt: Date | null;
  endsAt: Date | null;
  at: Date;
}

export interface DodoRefundEvent {
  kind: "refund";
  type: string;
  refundId: string;
  paymentId: string;
  amountCents: number;
  partial: boolean;
  at: Date;
}

export type DodoEvent = DodoPaymentEvent | DodoSubscriptionEvent | DodoRefundEvent;

const PAYMENT_STATUS: Record<string, OrderStatus> = {
  "payment.succeeded": "paid",
  "payment.failed": "failed",
  "payment.cancelled": "failed",
  "payment.processing": "pending",
};

/** Dodo's subscription status in the vocabulary the listing pages use. Null for "pending" (not started). */
function subscriptionStatus(data: Obj): SubscriptionStatus | null {
  switch (data.status) {
    case "active":
      // Cancelled by the customer: it runs to the end of the paid period.
      return data.cancel_at_next_billing_date === true ? "cancelled" : "active";
    case "on_hold":
    case "past_due":
      return "past_due";
    case "paused":
      return "paused";
    case "cancelled":
      return "cancelled";
    case "expired":
      return "expired";
    case "failed":
      return "unpaid";
    default:
      return null;
  }
}

/** Extracts the fields we use from a verified webhook body, or null if it's an event we don't use. */
export function parseDodoWebhook(body: unknown): DodoEvent | null {
  const b = obj(body);
  const type = str(b.type);
  const at = date(b.timestamp) ?? new Date();
  const data = obj(b.data);
  if (!type) return null;
  const env: Envelope = { type, at, data };

  if (type in PAYMENT_STATUS) {
    const paymentId = str(data.payment_id);
    if (!paymentId) return null;
    const total = int(data.total_amount);
    const tax = int(data.tax);
    const cart = Array.isArray(data.product_cart) ? data.product_cart : [];
    return {
      kind: "payment",
      type,
      paymentId,
      status: PAYMENT_STATUS[type],
      submissionId: submissionIdFrom(data.metadata),
      checkoutSessionId: str(data.checkout_session_id),
      subscriptionId: str(data.subscription_id),
      customerId: str(obj(data.customer).customer_id),
      productId: str(obj(cart[0]).product_id),
      currency: str(data.currency) ?? "USD",
      subtotalCents: Math.max(0, total - tax),
      taxCents: tax,
      totalCents: total,
      createdAt: date(data.created_at),
      at: env.at,
    };
  }

  if (type.startsWith("subscription.")) {
    const subscriptionId = str(data.subscription_id);
    const status = subscriptionStatus(data);
    if (!subscriptionId || !status) return null;
    const next = date(data.next_billing_date);
    return {
      kind: "subscription",
      type,
      subscriptionId,
      status,
      submissionId: submissionIdFrom(data.metadata),
      paymentId: str(data.payment_id),
      customerId: str(obj(data.customer).customer_id),
      productId: str(data.product_id),
      renewsAt: status === "active" ? next : null,
      endsAt:
        status === "cancelled"
          ? data.status === "active"
            ? next // scheduled: at the end of the paid period
            : (date(data.expires_at) ?? date(data.cancelled_at) ?? at)
          : status === "expired"
            ? (date(data.expires_at) ?? at)
            : null,
      at,
    };
  }

  if (type === "refund.succeeded") {
    const refundId = str(data.refund_id);
    const paymentId = str(data.payment_id);
    if (!refundId || !paymentId) return null;
    return { kind: "refund", type, refundId, paymentId, amountCents: int(data.amount), partial: data.is_partial === true, at };
  }
  return null;
}
