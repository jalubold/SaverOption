import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Creem (https://creem.io) — the payment provider for Saver Option Business
 * plans. Endpoints, fields, statuses and the webhook signature schemes follow
 * Creem's official TypeScript SDK (npm "creem", v1.13) and Next.js adapter:
 *
 *   POST /v1/checkouts                       create a checkout session
 *   GET  /v1/checkouts?checkout_id=…         read one back
 *   GET  /v1/products/{id}                   price, currency, billing period, trial
 *   GET  /v1/subscriptions?subscription_id=… current state of a subscription
 *   POST /v1/subscriptions/{id}/cancel       { mode: "scheduled" } = at period end
 *   POST /v1/customers/billing               { customer_id } → customer portal link
 *
 * Authentication is the x-api-key header, against api.creem.io, or
 * test-api.creem.io when CREEM_TEST_MODE=true. The key never leaves the server.
 */

export class CreemError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function creemApiKey(): string | null {
  return process.env.CREEM_API_KEY?.trim() || null;
}

export function creemWebhookSecret(): string | null {
  return process.env.CREEM_WEBHOOK_SECRET?.trim() || null;
}

export function creemTestMode(): boolean {
  return process.env.CREEM_TEST_MODE?.trim() === "true";
}

/** Which Creem environment events and objects must come from. */
export function creemMode(): "test" | "prod" {
  return creemTestMode() ? "test" : "prod";
}

export function creemApiBase(): string {
  // CREEM_API_URL only exists to point tests at a local mock.
  const override = process.env.CREEM_API_URL?.trim().replace(/\/$/, "");
  if (override) return override;
  return creemTestMode() ? "https://test-api.creem.io" : "https://api.creem.io";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = any;

async function creemFetch(path: string, init: { method?: "GET" | "POST"; body?: unknown } = {}): Promise<Json> {
  const key = creemApiKey();
  if (!key) throw new CreemError(0, "Creem isn't configured (CREEM_API_KEY is missing).");
  let res: Response;
  try {
    res = await fetch(`${creemApiBase()}${path}`, {
      method: init.method ?? "GET",
      headers: { "x-api-key": key, accept: "application/json", ...(init.body ? { "content-type": "application/json" } : {}) },
      body: init.body ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch (err) {
    throw new CreemError(0, `Creem couldn't be reached: ${err instanceof Error ? err.message : String(err)}`);
  }
  const text = await res.text();
  let body: Json = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }
  if (!res.ok) {
    const detail = body && typeof body === "object" ? (Array.isArray(body.message) ? body.message.join("; ") : (body.message ?? body.error)) : null;
    throw new CreemError(res.status, `Creem ${init.method ?? "GET"} ${path.split("?")[0]} failed (${res.status})${detail ? `: ${String(detail).slice(0, 200)}` : ""}`);
  }
  if (!body || typeof body !== "object") throw new CreemError(res.status, `Creem ${path.split("?")[0]} returned no JSON.`);
  return body;
}

// ─── Objects ─────────────────────────────────────────────────────────────────

export interface CreemProduct {
  id: string;
  name: string;
  mode: string | null;
  /** Cents in `currency`. */
  price: number;
  currency: string;
  billingType: string | null;
  /** every-month, every-year, … */
  billingPeriod: string | null;
  /** A Creem-side trial configured on the product (card collected at checkout). */
  trialPeriodDays: number | null;
  /** Cents charged for that trial; null or 0 means a free trial. */
  trialPrice: number | null;
  /** "inclusive": tax is included in the price; "exclusive": added on top. */
  taxMode: string | null;
  status: string | null;
}

export interface CreemSubscription {
  id: string;
  status: string;
  mode: string | null;
  productId: string | null;
  /** From the expanded product, when the payload includes it (used to tell which plan it is). */
  productName: string | null;
  productBillingType: string | null;
  productBillingPeriod: string | null;
  price: number | null;
  currency: string | null;
  customerId: string | null;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  canceledAt: Date | null;
  updatedAt: Date | null;
  metadata: Record<string, unknown>;
}

export interface CreemCheckout {
  id: string;
  status: string;
  mode: string | null;
  requestId: string | null;
  checkoutUrl: string | null;
  productId: string | null;
  customerId: string | null;
  subscriptionId: string | null;
  /** Present when Creem expanded the subscription in the response or event. */
  subscription: CreemSubscription | null;
  metadata: Record<string, unknown>;
}

export interface CreemRefund {
  id: string;
  mode: string | null;
  subscriptionId: string | null;
  customerId: string | null;
  checkoutId: string | null;
  metadata: Record<string, unknown>;
  createdAt: Date | null;
}

const str = (v: unknown): string | null => (typeof v === "string" && v.length > 0 && v.length <= 200 ? v : null);
const num = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);
const obj = (v: unknown): Record<string, unknown> | null => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null);

/** A field in snake_case (the API) or camelCase (some SDK-normalised payloads). */
function field(o: Record<string, unknown>, snake: string): unknown {
  if (snake in o) return o[snake];
  return o[snake.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())];
}

function date(v: unknown): Date | null {
  if (typeof v === "number" && Number.isFinite(v)) return new Date(v < 1e12 ? v * 1000 : v);
  if (typeof v !== "string" || v.length > 40) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

const idOf = (v: unknown): string | null => str(v) ?? str(obj(v)?.id);

/** A link Creem returned: https only (http just for the local test mock). */
function link(v: unknown): string | null {
  if (typeof v !== "string" || v.length > 2000) return null;
  return /^https:\/\//.test(v) || (process.env.CREEM_API_URL && /^http:\/\/(localhost|127\.0\.0\.1)[:/]/.test(v)) ? v : null;
}

export function parseProduct(raw: unknown): CreemProduct | null {
  const o = obj(raw);
  const id = str(o?.id);
  const price = num(o && o.price);
  const currency = str(o?.currency)?.toUpperCase();
  if (!o || !id || price === null || !currency || !/^[A-Z]{3}$/.test(currency)) return null;
  return {
    id,
    name: str(o.name) ?? id,
    mode: str(o.mode),
    price,
    currency,
    billingType: str(field(o, "billing_type")),
    billingPeriod: str(field(o, "billing_period")),
    trialPeriodDays: num(field(o, "trial_period_days")),
    trialPrice: num(field(o, "trial_price")),
    taxMode: str(field(o, "tax_mode")),
    status: str(o.status),
  };
}

export function parseSubscription(raw: unknown): CreemSubscription | null {
  const o = obj(raw);
  const id = str(o?.id);
  const status = str(o?.status);
  if (!o || !id || !status || (o.object !== undefined && o.object !== "subscription")) return null;
  const product = obj(o.product);
  const meta = obj(o.metadata) ?? {};
  return {
    id,
    status,
    mode: str(o.mode),
    productId: idOf(o.product),
    productName: product ? str(product.name) : null,
    productBillingType: product ? str(field(product, "billing_type")) : null,
    productBillingPeriod: product ? str(field(product, "billing_period")) : null,
    price: num(product?.price),
    currency: str(product?.currency)?.toUpperCase() ?? null,
    customerId: idOf(o.customer),
    currentPeriodStart: date(field(o, "current_period_start_date")),
    currentPeriodEnd: date(field(o, "current_period_end_date")),
    canceledAt: date(field(o, "canceled_at")),
    updatedAt: date(field(o, "updated_at")),
    metadata: meta,
  };
}

export function parseCheckout(raw: unknown): CreemCheckout | null {
  const o = obj(raw);
  const id = str(o?.id);
  const status = str(o?.status);
  if (!o || !id || !status || (o.object !== undefined && o.object !== "checkout")) return null;
  const sub = obj(o.subscription) ? parseSubscription(o.subscription) : null;
  return {
    id,
    status,
    mode: str(o.mode),
    requestId: str(field(o, "request_id")),
    checkoutUrl: link(field(o, "checkout_url")),
    productId: idOf(o.product),
    customerId: idOf(o.customer),
    subscriptionId: idOf(o.subscription),
    subscription: sub,
    metadata: obj(o.metadata) ?? {},
  };
}

export function parseRefund(raw: unknown): CreemRefund | null {
  const o = obj(raw);
  const id = str(o?.id);
  if (!o || !id || (o.object !== undefined && o.object !== "refund")) return null;
  return {
    id,
    mode: str(o.mode),
    subscriptionId: idOf(o.subscription),
    customerId: idOf(o.customer),
    checkoutId: idOf(o.checkout),
    metadata: obj(o.metadata) ?? obj(obj(o.subscription)?.metadata) ?? {},
    createdAt: date(field(o, "created_at")),
  };
}

// ─── API calls ───────────────────────────────────────────────────────────────

export async function getProduct(id: string): Promise<CreemProduct> {
  const p = parseProduct(await creemFetch(`/v1/products/${encodeURIComponent(id)}`));
  if (!p) throw new CreemError(200, "Creem returned a product without a price or currency.");
  return p;
}

/** Active products in the Creem account (up to 500), for matching plans by name and billing period. */
export async function searchProducts(): Promise<CreemProduct[]> {
  const out: CreemProduct[] = [];
  for (let page = 1; page <= 5; page++) {
    const body = await creemFetch(`/v1/products/search?page_number=${page}&page_size=100&status=active`);
    const items: unknown[] = Array.isArray(body?.items) ? body.items : [];
    for (const it of items) {
      const p = parseProduct(it);
      if (p) out.push(p);
    }
    const next = body?.pagination?.next_page ?? body?.pagination?.nextPage ?? null;
    if (!next || items.length === 0) break;
  }
  return out;
}

export async function createCheckout(input: {
  requestId: string;
  productId: string;
  successUrl: string;
  email: string;
  name: string | null;
  metadata: Record<string, string>;
}): Promise<CreemCheckout> {
  const body = {
    request_id: input.requestId,
    product_id: input.productId,
    units: 1,
    success_url: input.successUrl,
    customer: { email: input.email, ...(input.name ? { name: input.name } : {}) },
    metadata: input.metadata,
  };
  const c = parseCheckout(await creemFetch("/v1/checkouts", { method: "POST", body }));
  if (!c?.checkoutUrl) throw new CreemError(200, "Creem didn't return a checkout link.");
  return c;
}

export async function getCheckout(id: string): Promise<CreemCheckout> {
  const c = parseCheckout(await creemFetch(`/v1/checkouts?checkout_id=${encodeURIComponent(id)}`));
  if (!c) throw new CreemError(200, "Creem returned an unreadable checkout.");
  return c;
}

export async function getSubscription(id: string): Promise<CreemSubscription> {
  const s = parseSubscription(await creemFetch(`/v1/subscriptions?subscription_id=${encodeURIComponent(id)}`));
  if (!s) throw new CreemError(200, "Creem returned an unreadable subscription.");
  return s;
}

/** Cancels at the end of the paid period (Creem's "scheduled" mode); access continues until then. */
export async function cancelSubscriptionAtPeriodEnd(id: string): Promise<CreemSubscription> {
  const s = parseSubscription(await creemFetch(`/v1/subscriptions/${encodeURIComponent(id)}/cancel`, { method: "POST", body: { mode: "scheduled" } }));
  if (!s) throw new CreemError(200, "Creem returned an unreadable subscription.");
  return s;
}

export async function customerPortalLink(customerId: string): Promise<string> {
  const body = await creemFetch("/v1/customers/billing", { method: "POST", body: { customer_id: customerId } });
  const url = link(field(body, "customer_portal_link"));
  if (!url) throw new CreemError(200, "Creem didn't return a customer portal link.");
  return url;
}

// ─── Webhooks ────────────────────────────────────────────────────────────────

/** How far a "standard webhooks" timestamp may be from now (the SDK's default). */
const TOLERANCE_SECONDS = 300;

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/**
 * Verifies a delivery the way Creem's SDK does: the Standard Webhooks scheme
 * (webhook-id, webhook-timestamp and webhook-signature headers; base64
 * HMAC-SHA256 of "id.timestamp.body" with the whsec_ secret) when those headers
 * are present, otherwise the creem-signature header (hex HMAC-SHA256 of the raw
 * body with the secret).
 */
export function verifyCreemSignature(raw: string, headers: Headers, secret: string, now = Date.now()): boolean {
  const id = headers.get("webhook-id");
  const ts = headers.get("webhook-timestamp");
  const sig = headers.get("webhook-signature");
  if (id || ts || sig) {
    if (!id || !ts || !sig || !/^\d{1,12}$/.test(ts)) return false;
    if (Math.abs(now / 1000 - Number(ts)) > TOLERANCE_SECONDS) return false;
    const key = Buffer.from(secret.startsWith("whsec_") ? secret.slice(6) : secret, "base64");
    const expected = createHmac("sha256", key).update(`${id}.${ts}.${raw}`).digest("base64");
    return sig.split(" ").some((part) => {
      const [version, value] = part.split(",");
      return version === "v1" && Boolean(value) && safeEqual(value, expected);
    });
  }
  const legacy = headers.get("creem-signature") ?? headers.get("x-creem-signature");
  if (!legacy) return false;
  const normalized = legacy.trim().toLowerCase().replace(/^sha256=/, "");
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  return safeEqual(normalized, expected);
}

export interface CreemEvent {
  id: string;
  type: string;
  createdAt: Date | null;
  object: unknown;
}

/** { id, eventType, created_at, object } — the delivery envelope (data/type are accepted too, as the SDK does). */
export function parseCreemEvent(raw: string): CreemEvent | null {
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return null;
  }
  const o = obj(body);
  const id = str(o?.id);
  const type = str(o?.eventType) ?? str(o?.type);
  if (!o || !id || !type) return null;
  return { id, type, createdAt: date(o.created_at), object: o.object ?? o.data ?? null };
}
