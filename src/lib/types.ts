/**
 * Core content model. Mirrors what a future database/CMS schema will hold,
 * so the admin interface can be added without reshaping the public site.
 *
 *   Provider 1─* Product 1─* Offer *─* Category
 */

export type ISODate = string; // "2026-10-17" or full ISO timestamp

export type CategorySlug =
  | "software-deals"
  | "ai-tools"
  | "saas-discounts"
  | "lifetime-deals"
  | "free-credits"
  | "free-trials"
  | "student-discounts"
  | "startup-perks"
  | "open-source"
  | "exclusive";

export interface Category {
  slug: CategorySlug;
  name: string;
  /** One-line description used on cards and in metadata. */
  description: string;
  /** Longer intro shown at the top of the category page (SEO copy). */
  intro: string;
  icon: IconName;
  order: number;
}

export type IconName =
  | "tag"
  | "sparkles"
  | "cloud"
  | "infinity"
  | "coins"
  | "clock"
  | "graduation"
  | "rocket"
  | "code"
  | "star";

export interface Provider {
  id: string;
  name: string;
  website: string;
  /** Short note on who the provider is, shown on product pages. */
  about?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  providerId: string;
  tagline: string;
  description: string;
  website: string;
  /** Functional tags ("Analytics", "Email API") — used by search and related offers. */
  tags: string[];
  logo?: { src: string; alt?: string };
  /** Used for the generated monogram when no logo image is available. */
  brandColor?: string;
  openSource?: { license: string; repoUrl: string };
}

export type OfferType =
  | "discount"
  | "lifetime"
  | "free-credits"
  | "free-trial"
  | "free-plan"
  | "student"
  | "startup"
  | "open-source";

/**
 * Who publishes the offer.
 *  - official:    run by the software provider itself, on its own site
 *  - partner:     negotiated between the provider and this platform
 *  - third-party: run by a reseller, marketplace or other intermediary
 */
export type OfferSource = "official" | "partner" | "third-party";

export type BillingPeriod = "month" | "year" | "one-time";

export interface OfferPricing {
  currency: string; // ISO 4217
  /** Regular list price before the offer, if verified. */
  regularPrice?: number;
  /** Billing period of the regular price when it differs from `period` (e.g. $19/month vs. $69 one-time). */
  regularPeriod?: BillingPeriod;
  /** Price under the offer, if verified. 0 means free. */
  dealPrice?: number;
  period?: BillingPeriod;
  /** Value of credits granted (free-credits offers). */
  creditValue?: number;
  /** Human summary of the saving, exactly as the provider states it. e.g. "40% off the first year". */
  savingsLabel?: string;
}

/**
 * Verification is explicit. Nothing is shown as verified unless an editor
 * checked it against the provider's own page on `checkedAt`.
 *  - verified:   checked by an editor against the official source
 *  - unverified: submitted or scraped, not yet checked
 *  - demo:       sample content for development; never a live offer
 */
export interface OfferVerification {
  status: "verified" | "unverified" | "demo";
  checkedAt?: ISODate;
  note?: string;
}

export interface OfferLinks {
  /** Provider's own page describing the offer (always shown as the source). */
  officialUrl: string;
  /** Where the user redeems the offer, if different from officialUrl. */
  redeemUrl?: string;
  /** Tracked affiliate URL. Only set when an affiliate agreement actually exists. */
  affiliateUrl?: string;
}

export interface OfferPlacement {
  /** Editorially chosen for the homepage — not paid. */
  featured?: boolean;
  featuredRank?: number;
  /** Paid placement. Always rendered with a visible "Sponsored" label. */
  sponsored?: { sponsor: string; startsAt?: ISODate; endsAt?: ISODate };
  /** Negotiated specifically for this platform's audience. */
  exclusive?: boolean;
}

export type OfferStatus = "draft" | "published" | "archived";

export interface Offer {
  id: string;
  slug: string;
  productId: string;
  title: string;
  /** One or two sentences for cards and meta descriptions. */
  summary: string;
  /** Full description for the detail page. Paragraphs separated by blank lines. */
  description: string;
  type: OfferType;
  categories: CategorySlug[];
  source: OfferSource;
  /** Third-party publisher name when source is "third-party". */
  sourceName?: string;
  pricing?: OfferPricing;
  eligibility: string[];
  redemption: string[];
  terms: string[];
  /** Only set when the provider states an end date. */
  expiresAt?: ISODate;
  publishedAt: ISODate;
  updatedAt: ISODate;
  status: OfferStatus;
  verification: OfferVerification;
  links: OfferLinks;
  placement?: OfferPlacement;
}

/** Offer joined with its product, provider and categories — what the UI renders. */
export interface OfferView extends Offer {
  product: Product;
  provider: Provider;
  categoryList: Category[];
  isFree: boolean;
  isExpired: boolean;
  /** Days until expiry (0 = today), undefined when no end date. */
  daysLeft?: number;
  isSponsored: boolean;
}

export type SortKey = "relevance" | "newest" | "ending-soon";
export type PriceFilter = "all" | "free" | "paid";

export interface OfferQuery {
  q?: string;
  category?: CategorySlug;
  type?: OfferType;
  price?: PriceFilter;
  sort?: SortKey;
  includeExpired?: boolean;
}
