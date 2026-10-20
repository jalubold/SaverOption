/**
 * Catalog data access. Every page reads content through these functions —
 * never from `src/content/*` directly — so moving to a database or CMS
 * only means re-implementing this module. Functions are async for that reason.
 */
import { audiences } from "@/content/audiences";
import { categories } from "@/content/categories";
import { offers } from "@/content/offers";
import { products, providers } from "@/content/products";
import { MIN_POPULAR_OFFERS, getTopOffersByEngagement } from "@/lib/engagement";
import { daysUntil, parseDate } from "@/lib/format";
import { scoreOffer, tokenize } from "@/lib/search";
import type {
  Audience,
  AudienceSlug,
  Category,
  CategorySlug,
  Offer,
  OfferQuery,
  OfferType,
  OfferView,
  PriceFilter,
  Product,
  Provider,
  SortKey,
} from "@/lib/types";

const productById = new Map(products.map((p) => [p.id, p]));
const productBySlug = new Map(products.map((p) => [p.slug, p]));
const providerById = new Map(providers.map((p) => [p.id, p]));
const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));
const audienceBySlug = new Map(audiences.map((a) => [a.slug, a]));

const FREE_TYPES: ReadonlySet<OfferType> = new Set(["free-credits", "free-trial", "free-plan", "open-source"]);

function isSponsorshipActive(offer: Offer, now: Date): boolean {
  const s = offer.placement?.sponsored;
  if (!s) return false;
  if (s.startsAt && parseDate(s.startsAt) > now) return false;
  if (s.endsAt && daysUntil(s.endsAt, now) < 0) return false;
  return true;
}

function toView(offer: Offer, now: Date): OfferView | null {
  const product = productById.get(offer.productId);
  const provider = product && providerById.get(product.providerId);
  if (!product || !provider) return null;
  const daysLeft = offer.expiresAt ? daysUntil(offer.expiresAt, now) : undefined;
  return {
    ...offer,
    product,
    provider,
    categoryList: offer.categories
      .map((slug) => categoryBySlug.get(slug))
      .filter((c): c is Category => Boolean(c))
      .sort((a, b) => a.order - b.order),
    isFree: offer.pricing?.dealPrice === 0 || FREE_TYPES.has(offer.type),
    isExpired: daysLeft !== undefined && daysLeft < 0,
    daysLeft,
    isSponsored: isSponsorshipActive(offer, now),
  };
}

/** Published offers joined with their relations. Archived and draft offers never leave this module. */
function publishedViews(now = new Date()): OfferView[] {
  return offers
    .filter((o) => o.status === "published")
    .map((o) => toView(o, now))
    .filter((o): o is OfferView => o !== null);
}

const byNewest = (a: OfferView, b: OfferView) => b.publishedAt.localeCompare(a.publishedAt);

function byEndingSoon(a: OfferView, b: OfferView) {
  if (a.daysLeft === undefined && b.daysLeft === undefined) return byNewest(a, b);
  if (a.daysLeft === undefined) return 1;
  if (b.daysLeft === undefined) return -1;
  return a.daysLeft - b.daysLeft;
}

function byEditorial(a: OfferView, b: OfferView) {
  const ra = a.placement?.featuredRank ?? Number.POSITIVE_INFINITY;
  const rb = b.placement?.featuredRank ?? Number.POSITIVE_INFINITY;
  return ra - rb || byNewest(a, b);
}

// ─── Queries ────────────────────────────────────────────────────────────────

export interface OfferQueryResult {
  offers: OfferView[];
  total: number;
  /** Result counts per category and per type, for filter UIs. */
  facets: { categories: Partial<Record<CategorySlug, number>>; types: Partial<Record<OfferType, number>> };
}

export async function queryOffers(query: OfferQuery = {}): Promise<OfferQueryResult> {
  const terms = tokenize(query.q ?? "");
  const sort: SortKey = query.sort ?? "relevance";
  const price: PriceFilter = query.price ?? "all";

  let pool = publishedViews();
  if (!query.includeExpired) pool = pool.filter((o) => !o.isExpired);

  const scores = new Map<string, number>();
  if (terms.length) {
    pool = pool.filter((o) => {
      const score = scoreOffer(o, terms);
      if (score > 0) scores.set(o.id, score);
      return score > 0;
    });
  }
  if (price === "free") pool = pool.filter((o) => o.isFree);
  if (price === "paid") pool = pool.filter((o) => !o.isFree);
  if (query.noCard) pool = pool.filter((o) => o.requirements?.cardRequired === false);
  if (query.worldwide) pool = pool.filter((o) => o.regions?.scope === "global");
  const audience = query.audience;
  if (audience) pool = pool.filter((o) => o.audiences?.includes(audience));

  const inCategory = (o: OfferView) => !query.category || o.categories.includes(query.category);
  const ofType = (o: OfferView) => !query.type || o.type === query.type;

  // Each facet counts results with every *other* filter applied, so counts match what a click would show.
  const facets: OfferQueryResult["facets"] = { categories: {}, types: {} };
  for (const o of pool) {
    if (ofType(o)) for (const c of o.categories) facets.categories[c] = (facets.categories[c] ?? 0) + 1;
    if (inCategory(o)) facets.types[o.type] = (facets.types[o.type] ?? 0) + 1;
  }

  const results = pool.filter((o) => inCategory(o) && ofType(o));

  if (sort === "newest") results.sort(byNewest);
  else if (sort === "ending-soon") results.sort(byEndingSoon);
  else if (terms.length) results.sort((a, b) => (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0) || byEditorial(a, b));
  else results.sort(byEditorial);

  return { offers: results, total: results.length, facets };
}

/** Editorially featured offers (not paid placements). */
export async function getFeaturedOffers(limit = 6): Promise<OfferView[]> {
  return publishedViews()
    .filter((o) => o.placement?.featured && !o.isExpired && !o.isSponsored)
    .sort(byEditorial)
    .slice(0, limit);
}

export async function getRecentOffers(limit = 6): Promise<OfferView[]> {
  return publishedViews()
    .filter((o) => !o.isExpired)
    .sort(byNewest)
    .slice(0, limit);
}

/**
 * Offers ranked by measured engagement. Returns an empty list when there
 * isn't enough real data — callers should hide the section in that case.
 */
export async function getPopularOffers(limit = 6): Promise<OfferView[]> {
  const records = await getTopOffersByEngagement();
  const live = new Map(publishedViews().filter((o) => !o.isExpired).map((o) => [o.id, o]));
  const ranked = records
    .map((r) => live.get(r.offerId))
    .filter((o): o is OfferView => Boolean(o))
    .slice(0, limit);
  return ranked.length >= MIN_POPULAR_OFFERS ? ranked : [];
}

/** Active paid placements, optionally limited to a category. */
export async function getSponsoredOffers(category?: CategorySlug, limit = 1): Promise<OfferView[]> {
  return publishedViews()
    .filter((o) => o.isSponsored && !o.isExpired && (!category || o.categories.includes(category)))
    .slice(0, limit);
}

export async function getOfferBySlug(slug: string): Promise<OfferView | null> {
  return publishedViews().find((o) => o.slug === slug) ?? null;
}

export async function getAllOfferSlugs(): Promise<string[]> {
  return publishedViews().map((o) => o.slug);
}

/** Offers sharing a product, category or tags — never expired, never the offer itself. */
export async function getRelatedOffers(offer: OfferView, limit = 3): Promise<OfferView[]> {
  const tags = new Set(offer.product.tags);
  return publishedViews()
    .filter((o) => o.id !== offer.id && !o.isExpired)
    .map((o) => {
      let score = 0;
      if (o.productId === offer.productId) score += 5;
      score += o.categories.filter((c) => offer.categories.includes(c)).length * 2;
      score += o.product.tags.filter((t) => tags.has(t)).length;
      return { o, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || byNewest(a.o, b.o))
    .slice(0, limit)
    .map((x) => x.o);
}

export async function getOffersForProduct(productId: string): Promise<OfferView[]> {
  return publishedViews()
    .filter((o) => o.productId === productId)
    .sort((a, b) => Number(a.isExpired) - Number(b.isExpired) || byNewest(a, b));
}

export async function getCategories(): Promise<(Category & { count: number })[]> {
  const live = publishedViews().filter((o) => !o.isExpired);
  return [...categories]
    .sort((a, b) => a.order - b.order)
    .map((c) => ({ ...c, count: live.filter((o) => o.categories.includes(c.slug)).length }));
}

export async function getCategory(slug: string): Promise<Category | null> {
  return categoryBySlug.get(slug as CategorySlug) ?? null;
}

export async function getAudiences(): Promise<(Audience & { count: number })[]> {
  const live = publishedViews().filter((o) => !o.isExpired);
  return [...audiences]
    .sort((a, b) => a.order - b.order)
    .map((a) => ({ ...a, count: live.filter((o) => o.audiences?.includes(a.slug)).length }));
}

export async function getAudience(slug: string): Promise<Audience | null> {
  return audienceBySlug.get(slug as AudienceSlug) ?? null;
}

export async function getProductBySlug(slug: string): Promise<(Product & { provider: Provider }) | null> {
  const product = productBySlug.get(slug);
  const provider = product && providerById.get(product.providerId);
  return product && provider ? { ...product, provider } : null;
}

/** Products that have at least one published offer. */
export async function getAllProductSlugs(): Promise<string[]> {
  const withOffers = new Set(publishedViews().map((o) => o.productId));
  return products.filter((p) => withOffers.has(p.id)).map((p) => p.slug);
}

export function isCategorySlug(value: string | undefined): value is CategorySlug {
  return Boolean(value && categoryBySlug.has(value as CategorySlug));
}

export async function getCatalogStats() {
  const live = publishedViews().filter((o) => !o.isExpired);
  return {
    offers: live.length,
    products: new Set(live.map((o) => o.productId)).size,
    lastUpdated: live.map((o) => o.updatedAt).sort().at(-1),
    /** Most recent date an editor checked an offer against its source. */
    lastChecked: live
      .map((o) => o.verification.checkedAt)
      .filter((d): d is string => Boolean(d))
      .sort()
      .at(-1),
  };
}
