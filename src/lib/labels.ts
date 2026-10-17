import type { ClaimMethod, OfferRegions, OfferRequirements, OfferSource, OfferType, PriceFilter, SortKey } from "@/lib/types";

export const offerTypeLabels: Record<OfferType, string> = {
  discount: "Discount",
  lifetime: "Lifetime deal",
  "free-credits": "Free credits",
  "free-trial": "Free trial",
  "free-plan": "Free plan",
  student: "Student offer",
  startup: "Startup perk",
  "open-source": "Open source",
};

export const offerSourceLabels: Record<OfferSource, { label: string; description: string }> = {
  official: {
    label: "Official offer",
    description: "Published by the software provider on its own website.",
  },
  partner: {
    label: "Partner offer",
    description: "Arranged between the provider and this site. Any commercial relationship is disclosed.",
  },
  "third-party": {
    label: "Third-party offer",
    description: "Sold or run by a reseller or marketplace, not by the software provider directly.",
  },
};

export const claimMethodLabels: Record<ClaimMethod, { label: string; description: string }> = {
  automatic: { label: "Applied automatically", description: "Sign up through the provider's offer page and it's applied for you." },
  code: { label: "Promo code", description: "Enter the code at checkout on the provider's site." },
  link: { label: "Special sign-up link", description: "Use the provider's offer page to sign up." },
  application: { label: "Apply to the program", description: "Submit an application. The provider reviews it before granting the offer." },
  verification: { label: "Verify eligibility", description: "Confirm your status (for example as a student) before the offer is unlocked." },
};

export interface ConditionLabel {
  label: string;
  /** true = good news for the reader, false = a restriction. */
  positive: boolean;
}

/** Human labels for the structured conditions that are known. Unknown keys produce nothing. */
export function conditionLabels(req?: OfferRequirements, regions?: OfferRegions): ConditionLabel[] {
  const out: ConditionLabel[] = [];
  if (req?.cardRequired === false) out.push({ label: "No credit card", positive: true });
  if (req?.cardRequired === true) out.push({ label: "Card required", positive: false });
  if (regions?.scope === "global") out.push({ label: "Available worldwide", positive: true });
  if (regions?.scope === "limited") out.push({ label: "Limited regions", positive: false });
  if (req?.studentVerification) out.push({ label: "Student verification", positive: false });
  if (req?.approvalRequired) out.push({ label: "Approval needed", positive: false });
  if (req?.newCustomersOnly === true) out.push({ label: "New customers only", positive: false });
  if (req?.newCustomersOnly === false) out.push({ label: "Existing customers too", positive: true });
  return out;
}

export const sortLabels: Record<SortKey, string> = {
  relevance: "Most relevant",
  newest: "Newest",
  "ending-soon": "Ending soon",
};

export const priceFilterLabels: Record<PriceFilter, string> = {
  all: "Free & paid",
  free: "Free only",
  paid: "Paid discounts",
};
