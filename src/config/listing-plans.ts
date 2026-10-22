/**
 * Listing plans: subscriptions that keep one sponsored listing live while they're
 * paid up. Each plan maps to a Lemon Squeezy subscription variant with the same
 * billing interval (env var named in `variantEnv`, or found by the admin
 * "Connect" button). The prices here are defaults: once connected, the site
 * shows and records the prices set on those variants in Lemon Squeezy.
 */
export type ListingPlanId = "1m" | "3m" | "1y";

export interface ListingPlan {
  id: ListingPlanId;
  name: string;
  /** Price per billing period, in cents of `currency`. */
  priceCents: number;
  currency: "USD";
  /** Billing interval, as Lemon Squeezy describes it on the variant. */
  interval: "month" | "year";
  intervalCount: number;
  /** "month", "3 months", "year" — for "per month", "/3 months". */
  period: string;
  /** Length of one billing period; also the listing length for older one-time listings. */
  days: number;
  badge?: string;
  /** Server env var holding this plan's Lemon Squeezy variant ID. */
  variantEnv: "LEMONSQUEEZY_VARIANT_ID_MONTHLY" | "LEMONSQUEEZY_VARIANT_ID_QUARTERLY" | "LEMONSQUEEZY_VARIANT_ID_YEARLY";
}

export const listingPlans: ListingPlan[] = [
  { id: "1m", name: "Monthly", priceCents: 999, currency: "USD", interval: "month", intervalCount: 1, period: "month", days: 30, variantEnv: "LEMONSQUEEZY_VARIANT_ID_MONTHLY" },
  { id: "3m", name: "Quarterly", priceCents: 1999, currency: "USD", interval: "month", intervalCount: 3, period: "3 months", days: 91, badge: "Most Popular", variantEnv: "LEMONSQUEEZY_VARIANT_ID_QUARTERLY" },
  { id: "1y", name: "Yearly", priceCents: 4999, currency: "USD", interval: "year", intervalCount: 1, period: "year", days: 365, badge: "Best Value", variantEnv: "LEMONSQUEEZY_VARIANT_ID_YEARLY" },
];

/** What every plan includes — only things the site actually does. No traffic is guaranteed. */
export const listingBenefits = [
  "A listing page on Saver Option that links to your website",
  "Shown on the Sponsored listings page and in the homepage Sponsored section",
  "Clearly labelled as Sponsored, next to our editorial deals",
  "Listing views and outbound clicks in your dashboard",
  "Reviewed by our team before it goes live",
  "Cancel anytime; your listing stays live until the end of the paid period",
];

export function getPlan(id: string | null | undefined, plans: ListingPlan[] = listingPlans): ListingPlan | undefined {
  return plans.find((p) => p.id === id);
}

/** The plans with the prices found in Lemon Squeezy (by plan id), where known. */
export function withPrices(prices: Partial<Record<ListingPlanId, number>>): ListingPlan[] {
  return listingPlans.map((p) => (prices[p.id] ? { ...p, priceCents: prices[p.id]! } : p));
}

export function planPriceCents(plan: ListingPlan): number {
  return plan.priceCents;
}

/** "$9.99" */
export function formatPlanPrice(plan: Pick<ListingPlan, "priceCents" | "currency">): string {
  return formatCents(plan.priceCents, plan.currency);
}

/** "$9.99/month", "$19.99/3 months" */
export function formatPlanRate(plan: Pick<ListingPlan, "priceCents" | "currency" | "period">, cents = plan.priceCents): string {
  return `${formatCents(cents, plan.currency)}/${plan.period}`;
}

export function formatCents(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100);
}
