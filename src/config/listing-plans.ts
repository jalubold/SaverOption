/**
 * Paid listing plans. One-time payments for a fixed-length listing, not subscriptions.
 * Each plan is one deal listing. This file is the trusted price list: the server
 * stores these prices on a submission and maps each plan to its Lemon Squeezy
 * variant (env var named in `variantEnv`). Edit prices and lengths here, and keep
 * the matching variant prices in Lemon Squeezy identical.
 */
export type ListingPlanId = "1m" | "3m" | "1y";

export interface ListingPlan {
  id: ListingPlanId;
  name: string;
  /** Price in cents of `currency`; must equal the Lemon Squeezy variant price exactly. */
  priceCents: number;
  currency: "USD";
  days: number;
  badge?: string;
  /** Server env var holding this plan's Lemon Squeezy variant ID. */
  variantEnv: "LEMONSQUEEZY_VARIANT_ID_MONTHLY" | "LEMONSQUEEZY_VARIANT_ID_QUARTERLY" | "LEMONSQUEEZY_VARIANT_ID_YEARLY";
}

export const listingPlans: ListingPlan[] = [
  { id: "1m", name: "1 Month", priceCents: 999, currency: "USD", days: 30, variantEnv: "LEMONSQUEEZY_VARIANT_ID_MONTHLY" },
  { id: "3m", name: "3 Months", priceCents: 1999, currency: "USD", days: 90, badge: "Most Popular", variantEnv: "LEMONSQUEEZY_VARIANT_ID_QUARTERLY" },
  { id: "1y", name: "1 Year", priceCents: 4999, currency: "USD", days: 365, badge: "Best Value", variantEnv: "LEMONSQUEEZY_VARIANT_ID_YEARLY" },
];

/** What every plan includes — only things the site actually does. No traffic is guaranteed. */
export const listingBenefits = [
  "A listing page on Saver Option that links to your website",
  "Shown on the Sponsored listings page and in the homepage Sponsored section",
  "Clearly labelled as Sponsored, next to our editorial deals",
  "Listing views and outbound clicks in your dashboard",
  "Reviewed by our team before it goes live",
];

export function getPlan(id: string | null | undefined): ListingPlan | undefined {
  return listingPlans.find((p) => p.id === id);
}

export function planPriceCents(plan: ListingPlan): number {
  return plan.priceCents;
}

export function formatPlanPrice(plan: Pick<ListingPlan, "priceCents" | "currency">): string {
  return formatCents(plan.priceCents, plan.currency);
}

export function formatCents(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100);
}
