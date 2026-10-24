import { siteConfig } from "@/config/site";
import { PLAN_INTERVALS, PLANS, type PlanId, type PlanInterval } from "@/lib/business/billing";

/**
 * Plan configuration — the one place prices, Creem product IDs and plan limits
 * come from, all overridable with environment variables (see .env.example).
 *
 * The price someone is charged is always the Creem product's own price, read
 * from Creem's API before checkout; the list prices here are only what the
 * pricing page shows while a plan has no Creem product (checkout is then
 * unavailable for it). Plans differ only in limits on features that exist.
 */

export interface PlanOffer {
  plan: PlanId;
  interval: PlanInterval;
  /** Creem product ID (prod_…) from CREEM_PRODUCT_*, or null (then it's looked up in Creem by name). */
  productId: string | null;
  /** List price in cents (USD) shown when there's no Creem product to read. */
  listPriceMinor: number | null;
}

/**
 * Defaults from the business model: Pro $29/month, Business $49/month, and
 * yearly at ten months' price (two months free). Only shown while a plan has no
 * Creem product to read; set BILLING_PRICE_* to change them.
 */
const DEFAULT_LIST_PRICE: Record<PlanId, Record<PlanInterval, number | null>> = {
  pro: { month: 29_00, year: 290_00 },
  business: { month: 49_00, year: 490_00 },
};

const DEFAULT_MEMBER_LIMIT: Record<PlanId, number | null> = { pro: 5, business: null };

const envKey = (plan: PlanId, interval: PlanInterval) => `${plan.toUpperCase()}_${interval === "month" ? "MONTHLY" : "YEARLY"}`;

function env(name: string): string | null {
  const v = process.env[name]?.trim();
  return v ? v : null;
}

/** "29", "29.00" or "290" → cents; blank or invalid → null. */
function priceEnv(name: string): number | null | undefined {
  const v = env(name);
  if (v === null) return undefined;
  if (!/^\d{1,6}(\.\d{1,2})?$/.test(v)) {
    console.warn(`[billing] ${name} isn't a price like 29 or 29.00; ignoring it`);
    return undefined;
  }
  return Math.round(Number(v) * 100);
}

function productEnv(name: string): string | null {
  const v = env(name);
  if (v === null) return null;
  if (!/^[A-Za-z0-9_-]{3,100}$/.test(v)) {
    console.warn(`[billing] ${name} doesn't look like a Creem product ID; ignoring it`);
    return null;
  }
  return v;
}

export function planOffers(): PlanOffer[] {
  const out: PlanOffer[] = [];
  for (const plan of PLANS) {
    for (const interval of PLAN_INTERVALS) {
      const key = envKey(plan, interval);
      const price = priceEnv(`BILLING_PRICE_${key}`);
      out.push({ plan, interval, productId: productEnv(`CREEM_PRODUCT_${key}`), listPriceMinor: price === undefined ? DEFAULT_LIST_PRICE[plan][interval] : price });
    }
  }
  return out;
}

export function planOffer(plan: PlanId, interval: PlanInterval): PlanOffer {
  return planOffers().find((o) => o.plan === plan && o.interval === interval)!;
}

/** The plan and interval a product ID set in CREEM_PRODUCT_* is for, or null. */
export function offerForProduct(productId: string | null | undefined): PlanOffer | null {
  if (!productId) return null;
  return planOffers().find((o) => o.productId === productId) ?? null;
}

/** Members (people who can sign in) each plan allows; null means no limit. */
export function memberLimit(plan: PlanId): number | null {
  const v = env(`BILLING_${plan.toUpperCase()}_MEMBER_LIMIT`);
  if (v === null) return DEFAULT_MEMBER_LIMIT[plan];
  if (/^(unlimited|none)$/i.test(v)) return null;
  const n = Number(v);
  return Number.isInteger(n) && n >= 1 && n <= 10_000 ? n : DEFAULT_MEMBER_LIMIT[plan];
}

/** Where Self-Hosted and White-Label inquiries go. */
export function businessContactEmail(): string {
  const v = env("BUSINESS_CONTACT_EMAIL");
  return v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? v : siteConfig.contactEmail;
}

/** What each plan includes — only features the product has; plans differ only in member limits. */
export function planFeatures(plan: PlanId, opts: { assistant: boolean }): string[] {
  const limit = memberLimit(plan);
  const members = limit === null ? "Unlimited members" : `Up to ${limit} member${limit === 1 ? "" : "s"} (people who sign in)`;
  if (plan === "business") return ["Everything in Pro", members];
  return [
    "Software inventory, subscriptions, licenses and seats",
    "Renewal calendar and reminders",
    "Spend analytics, reports and exports",
    "Savings opportunities and matching Saver Option deals",
    "CSV import",
    "AI clients over MCP (Claude, ChatGPT and others)",
    ...(opts.assistant ? ["AI Savings Assistant"] : []),
    members,
  ];
}
