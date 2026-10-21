/**
 * Paid deal-listing plans shown in the "Promote your SaaS" modal.
 * Each plan is one deal listing. Edit prices and lengths here.
 */
export interface ListingPlan {
  id: "1m" | "3m" | "1y";
  name: string;
  /** Price in whole units of `currency`. */
  price: number;
  currency: "USD";
  days: number;
  badge?: string;
}

export const listingPlans: ListingPlan[] = [
  { id: "1m", name: "1 Month", price: 9, currency: "USD", days: 30 },
  { id: "3m", name: "3 Months", price: 19, currency: "USD", days: 90, badge: "Most Popular" },
  { id: "1y", name: "1 Year", price: 49, currency: "USD", days: 365, badge: "Best Value" },
];
