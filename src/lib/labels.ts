import type { OfferSource, OfferType, PriceFilter, SortKey } from "@/lib/types";

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
