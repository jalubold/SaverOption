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
  /** What people search for, used in the page title, e.g. "Free cloud, API and AI credits". */
  seoTitle?: string;
  icon: IconName;
  /** Gradient for the icon tile and hover glow. */
  color: { from: string; to: string };
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
  | "star"
  | "briefcase"
  | "video"
  | "pen"
  | "user"
  | "file"
  | "megaphone";

/** Who an offer is for. Drives the "Explore Deals" collections on the homepage and /for/[slug]. */
export type AudienceSlug =
  | "ai-tools"
  | "startups"
  | "businesses"
  | "developers"
  | "creators"
  | "designers"
  | "freelancers"
  | "office-tools"
  | "students"
  | "marketing-tools";

export interface Audience {
  slug: AudienceSlug;
  /** Shown after the brand name, e.g. "AI Tools" in "Saver Option for AI Tools". */
  name: string;
  /** One line for cards and metadata. */
  description: string;
  /** Intro at the top of the collection page. */
  intro: string;
  icon: IconName;
  /** Gradient for the icon tile and hover glow, so each collection is recognisable at a glance. */
  color: { from: string; to: string };
  order: number;
}

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
  /** How many months the offer price applies before it renews (e.g. 12 for "first year"). */
  durationMonths?: number;
  /** Price once the offer period ends, if stated. */
  renewalPrice?: number;
  renewalPeriod?: BillingPeriod;
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
  /** How it was checked, shown to readers, e.g. "Checked against the provider's official program page". */
  method?: string;
  note?: string;
  /** Verbatim quotes from the source backing each fact. Kept for editors; not rendered. */
  evidence?: { claim: string; quote: string }[];
}

/**
 * How the offer is claimed.
 *  - automatic:    applied when you sign up through the provider's page
 *  - code:         a public promo code entered at checkout
 *  - link:         a special sign-up link or page
 *  - application:  apply to a program and wait for approval
 *  - verification: prove eligibility (e.g. student status) first
 */
export type ClaimMethod = "automatic" | "code" | "link" | "application" | "verification";

export interface OfferClaim {
  method: ClaimMethod;
  code?: string;
  note?: string;
}

/** Key conditions as structured flags. Leave a key out when the source doesn't say. */
export interface OfferRequirements {
  cardRequired?: boolean;
  newCustomersOnly?: boolean;
  approvalRequired?: boolean;
  studentVerification?: boolean;
}

export interface OfferRegions {
  scope: "global" | "limited";
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
  /** Who the offer is for; an offer can appear in several collections. */
  audiences?: AudienceSlug[];
  source: OfferSource;
  /** Third-party publisher name when source is "third-party". */
  sourceName?: string;
  pricing?: OfferPricing;
  claim: OfferClaim;
  requirements?: OfferRequirements;
  regions?: OfferRegions;
  /** One-time licences: what the purchase covers and the refund policy, when stated. */
  lifetime?: { licenceCovers?: string; refundPolicy?: string };
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
  audience?: AudienceSlug;
  type?: OfferType;
  price?: PriceFilter;
  /** Only offers that state no credit card is needed. */
  noCard?: boolean;
  /** Only offers stated to be available worldwide. */
  worldwide?: boolean;
  sort?: SortKey;
  includeExpired?: boolean;
}
