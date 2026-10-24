import { categoryLabels, SOFTWARE_CATEGORIES, type SoftwareCategory } from "@/lib/business/constants";
import { getCategories, getOfferBySlug, isCategorySlug, queryOffers } from "@/lib/catalog";
import { catalogProduct } from "@/lib/server/business/catalog-match";
import type { BizContext } from "@/lib/server/business/context";
import { getSoftwareList, getSubscriptions } from "@/lib/server/business/data";
import { estimatedSavings, expiryLabel, formatDate, headlineValue, renewalLabel, summarizePrice } from "@/lib/format";
import { offerSourceLabels, offerTypeLabels } from "@/lib/labels";
import { destinationUrl, outboundHref } from "@/lib/outbound";
import { absoluteUrl } from "@/lib/seo";
import type { CategorySlug, OfferType, OfferView } from "@/lib/types";

/**
 * Saver Option Deals, as Business sees it: search, details and the listings
 * that match a workspace's own tools. Everything comes from the published
 * deals catalog (the same data and visibility rules as /deals). Fields the
 * catalog doesn't state — a price, a discount, an end date — are null, never
 * filled in. Results are plain JSON so MCP tools can return them as-is.
 */

const OFFER_TYPES = Object.keys(offerTypeLabels) as OfferType[];

/** Offer types that can lower what a company pays for a tool it already uses. */
const SAVING_TYPES: ReadonlySet<OfferType> = new Set(["discount", "free-credits", "startup", "lifetime", "free-plan"]);
/** For tools in the same job (possible alternatives) trials and open-source options are relevant too; student offers never are. */
const ALTERNATIVE_TYPES: ReadonlySet<OfferType> = new Set(["discount", "free-credits", "startup", "lifetime", "free-plan", "free-trial", "open-source"]);

/**
 * Catalog product tags that describe each business software category, for
 * "same kind of tool" matches. Compared case-insensitively. "Other" has none.
 */
const categoryTags: Record<SoftwareCategory, string[]> = {
  communication: ["team chat", "messaging", "communication"],
  video_meetings: ["video meetings"],
  project_management: ["project management", "task management", "kanban", "work management"],
  documentation: ["docs", "markdown", "writing", "whiteboard"],
  design: ["design", "ui design", "prototyping", "graphic design"],
  development: ["developer tools", "ide", "code editor", "git", "ai coding", "code assistant", "cloud ide", "devops", "error tracking", "observability", "monitoring"],
  cloud_hosting: ["cloud", "hosting", "infrastructure", "serverless", "cdn", "postgres", "paas", "web hosting", "cloud hosting"],
  ai: ["llm api", "ai assistant", "assistant", "ai models", "chatbot"],
  crm_sales: ["crm", "sales"],
  marketing: ["marketing", "email marketing", "marketing automation", "social media", "seo", "newsletters"],
  customer_support: ["customer support", "help desk", "ticketing"],
  analytics: ["analytics", "product analytics"],
  finance_accounting: ["accounting", "invoicing", "billing", "payments"],
  hr_people: ["time tracking", "timesheets"],
  security: ["security", "password manager", "authentication", "identity"],
  storage: ["file sync"],
  productivity: ["productivity", "office suite", "business suite", "calendar", "scheduling", "esignature", "e-signatures"],
  other: [],
};

export interface DealSummary {
  id: string;
  slug: string;
  title: string;
  summary: string;
  product: { id: string; slug: string; name: string; logo: string | null; website: string };
  providerName: string;
  offerType: OfferType;
  offerTypeLabel: string;
  /** The headline figure exactly as the listing states it ("40% off the first year", "$300 credit", "Free"), or null. */
  headline: string | null;
  /** The provider's own description of the saving, only when the listing has one. */
  discountText: string | null;
  /** Prices only when the listing states them. */
  price: { current: string | null; regular: string | null; note: string | null; renewal: string | null } | null;
  /** End date only when the provider states one. */
  expiresAt: string | null;
  expiryLabel: string | null;
  verification: { status: "verified" | "unverified"; checkedAt: string | null; label: string };
  sponsored: { sponsor: string } | null;
  categories: { slug: CategorySlug; name: string }[];
  /** The Saver Option deal page. */
  dealPageUrl: string;
  /** The tracked "View deal" link (counts the click, then redirects to the provider or the disclosed affiliate link). */
  outboundUrl: string;
}

export interface DealDetail extends DealSummary {
  active: boolean;
  isExpired: boolean;
  description: string;
  eligibility: string[];
  redemption: string[];
  terms: string[];
  claim: { method: string; code: string | null; note: string | null };
  requirements: { cardRequired: boolean | null; newCustomersOnly: boolean | null; approvalRequired: boolean | null; studentVerification: boolean | null };
  regions: { scope: "global" | "limited"; note: string | null } | null;
  publisher: { kind: string; label: string; name: string | null };
  /** Computed only from stated figures (regular and offer price on the same basis plus a duration). */
  estimatedSavings: string | null;
  /** The provider's own page for the offer: the source of every fact above. */
  sourceUrl: string;
  /** Whether "View deal" goes to an affiliate link (disclosed on the deal page) or the provider's page. */
  destinationKind: "affiliate" | "official";
  verificationMethod: string | null;
  publishedAt: string;
  updatedAt: string;
}

export interface DealSearchResult {
  total: number;
  limit: number;
  offset: number;
  deals: DealSummary[];
  filters: { query: string | null; category: string | null; offerType: OfferType | null };
}

export class DealsInputError extends Error {}

function summaryOf(o: OfferView): DealSummary {
  const price = summarizePrice(o.pricing);
  const renewal = renewalLabel(o.pricing);
  return {
    id: o.id,
    slug: o.slug,
    title: o.title,
    summary: o.summary,
    product: { id: o.product.id, slug: o.product.slug, name: o.product.name, logo: o.product.logo?.src ?? null, website: o.product.website },
    providerName: o.provider.name,
    offerType: o.type,
    offerTypeLabel: offerTypeLabels[o.type],
    headline: headlineValue(o),
    discountText: o.pricing?.savingsLabel ?? null,
    price: price || renewal ? { current: price?.current ?? null, regular: price?.was ?? null, note: price?.note ?? null, renewal } : null,
    expiresAt: o.expiresAt ?? null,
    expiryLabel: expiryLabel(o),
    verification: {
      status: o.verification.status === "verified" ? "verified" : "unverified",
      checkedAt: o.verification.status === "verified" ? (o.verification.checkedAt ?? null) : null,
      label: o.verification.status === "verified" && o.verification.checkedAt ? `Verified on ${formatDate(o.verification.checkedAt)}` : "Unverified",
    },
    sponsored: o.isSponsored ? { sponsor: o.placement?.sponsored?.sponsor ?? "Sponsor" } : null,
    categories: o.categoryList.map((c) => ({ slug: c.slug, name: c.name })),
    dealPageUrl: absoluteUrl(`/deals/${o.slug}`),
    outboundUrl: absoluteUrl(outboundHref(o)),
  };
}

function detailOf(o: OfferView): DealDetail {
  const r = o.requirements ?? {};
  return {
    ...summaryOf(o),
    active: !o.isExpired,
    isExpired: o.isExpired,
    description: o.description,
    eligibility: o.eligibility,
    redemption: o.redemption,
    terms: o.terms,
    claim: { method: o.claim.method, code: o.claim.code ?? null, note: o.claim.note ?? null },
    requirements: {
      cardRequired: r.cardRequired ?? null,
      newCustomersOnly: r.newCustomersOnly ?? null,
      approvalRequired: r.approvalRequired ?? null,
      studentVerification: r.studentVerification ?? null,
    },
    regions: o.regions ? { scope: o.regions.scope, note: o.regions.note ?? null } : null,
    publisher: { kind: o.source, label: offerSourceLabels[o.source].label, name: o.sourceName ?? null },
    estimatedSavings: estimatedSavings(o.pricing),
    sourceUrl: o.links.officialUrl,
    destinationKind: destinationUrl(o).kind,
    verificationMethod: o.verification.status === "verified" ? (o.verification.method ?? null) : null,
    publishedAt: o.publishedAt,
    updatedAt: o.updatedAt,
  };
}

const tagsOf = (o: OfferView) => o.product.tags.map((t) => t.toLowerCase());

function inBusinessCategory(o: OfferView, category: SoftwareCategory): boolean {
  const wanted = categoryTags[category];
  if (wanted.length === 0) return false;
  return tagsOf(o).some((t) => wanted.includes(t));
}

export function isBusinessCategory(v: string): v is SoftwareCategory {
  return (SOFTWARE_CATEGORIES as readonly string[]).includes(v);
}

/** Valid `category` values: a deals-catalog category (e.g. "saas-discounts") or a business software category (e.g. "design"). */
export async function dealCategoryOptions(): Promise<{ catalog: { value: string; label: string }[]; business: { value: SoftwareCategory; label: string }[] }> {
  const cats = await getCategories();
  return {
    catalog: cats.map((c) => ({ value: c.slug, label: c.name })),
    business: SOFTWARE_CATEGORIES.filter((c) => categoryTags[c].length > 0).map((c) => ({ value: c, label: categoryLabels[c] })),
  };
}

export const DEAL_OFFER_TYPES = OFFER_TYPES;

/**
 * Searches live listings (published and not expired) in the deals catalog, with
 * the same keyword matching as /deals. `category` accepts a catalog category
 * slug or a business software category; `offerType` an offer type.
 */
export async function searchDeals(opts: { query?: string; category?: string; offerType?: string; limit?: number; offset?: number } = {}): Promise<DealSearchResult> {
  const query = opts.query?.trim().slice(0, 200) || null;
  const limit = Math.min(Math.max(Math.trunc(opts.limit ?? 10), 1), 50);
  const offset = Math.max(Math.trunc(opts.offset ?? 0), 0);
  const category = opts.category?.trim() || null;
  const offerType = opts.offerType?.trim() || null;
  if (offerType && !OFFER_TYPES.includes(offerType as OfferType)) throw new DealsInputError(`Unknown offer type "${offerType}". Use one of: ${OFFER_TYPES.join(", ")}.`);
  if (category && !isCategorySlug(category) && !isBusinessCategory(category)) {
    const o = await dealCategoryOptions();
    throw new DealsInputError(`Unknown category "${category}". Use a deals category (${o.catalog.map((c) => c.value).join(", ")}) or a software category (${o.business.map((c) => c.value).join(", ")}).`);
  }
  const { offers } = await queryOffers({
    q: query ?? undefined,
    category: category && isCategorySlug(category) ? category : undefined,
    type: (offerType as OfferType | null) ?? undefined,
  });
  const pool = category && isBusinessCategory(category) ? offers.filter((o) => inBusinessCategory(o, category)) : offers;
  return {
    total: pool.length,
    limit,
    offset,
    deals: pool.slice(offset, offset + limit).map(summaryOf),
    filters: { query, category, offerType: (offerType as OfferType | null) ?? null },
  };
}

/** One listing by id or slug, including expired ones (marked inactive), or null when it isn't published. */
export async function getDealDetails(idOrSlug: string): Promise<DealDetail | null> {
  const key = idOrSlug.trim();
  if (!key || key.length > 200) return null;
  const bySlug = await getOfferBySlug(key);
  if (bySlug) return detailOf(bySlug);
  const { offers } = await queryOffers({ includeExpired: true });
  const byId = offers.find((o) => o.id === key);
  return byId ? detailOf(byId) : null;
}

export interface WorkspaceTool {
  softwareId: string;
  name: string;
  logoSrc: string | null;
  category: SoftwareCategory;
  categoryLabel: string;
  /** Live (active or trial) subscriptions for the tool. */
  subscriptionIds: string[];
  catalogProduct: { id: string; name: string; slug: string } | null;
}

export interface WorkspaceDeals {
  /** Listings for the exact product a tool is, grouped by tool. */
  matched: { tool: WorkspaceTool; deals: (DealSummary & { matchReason: string })[] }[];
  /** Tools with no matching listing right now (said plainly, nothing invented). */
  unmatched: { tool: WorkspaceTool; reason: string }[];
  /** Listings for other products doing the same job, grouped by category. */
  related: { category: SoftwareCategory; categoryLabel: string; tools: string[]; deals: (DealSummary & { matchReason: string })[] }[];
}

/**
 * Deals relevant to the tools a workspace records: first listings for the same
 * product (savings on what the team already pays for), then listings for other
 * products in the same category (possible alternatives). Any member can view.
 */
export async function dealsForWorkspace(ctx: BizContext, opts: { relatedPerCategory?: number } = {}): Promise<WorkspaceDeals> {
  const ws = ctx.workspace.id;
  const [software, subs, { offers }] = await Promise.all([getSoftwareList(ws), getSubscriptions(ws), queryOffers({})]);
  const liveSubs = subs.filter((s) => !s.archived && (s.status === "active" || s.status === "trial"));
  const tools: WorkspaceTool[] = software
    .filter((s) => s.status !== "archived")
    .map((s) => {
      const product = catalogProduct(s.catalogProductId);
      return {
        softwareId: s.id,
        name: s.name,
        logoSrc: s.logoSrc,
        category: s.category,
        categoryLabel: categoryLabels[s.category],
        subscriptionIds: liveSubs.filter((x) => x.softwareId === s.id).map((x) => x.id),
        catalogProduct: product ? { id: product.id, name: product.name, slug: product.slug } : null,
      };
    })
    // Tools the company pays for first, then the rest of the inventory, alphabetically.
    .sort((a, b) => Number(b.subscriptionIds.length > 0) - Number(a.subscriptionIds.length > 0) || a.name.localeCompare(b.name));

  const verifiedFirst = (a: OfferView, b: OfferView) => Number(b.verification.status === "verified") - Number(a.verification.status === "verified");
  const matched: WorkspaceDeals["matched"] = [];
  const unmatched: WorkspaceDeals["unmatched"] = [];
  const ownProducts = new Set<string>();
  for (const tool of tools) {
    const sw = software.find((s) => s.id === tool.softwareId)!;
    if (sw.catalogProductId) ownProducts.add(sw.catalogProductId);
    const list = sw.catalogProductId ? offers.filter((o) => o.productId === sw.catalogProductId && SAVING_TYPES.has(o.type)).sort(verifiedFirst) : [];
    if (list.length) matched.push({ tool, deals: list.map((o) => ({ ...summaryOf(o), matchReason: `Listed for ${o.product.name}, which your workspace records as ${tool.name}.` })) });
    else
      unmatched.push({
        tool,
        reason: sw.catalogProductId
          ? `No business-relevant offer is currently listed for ${tool.name} (student offers and trials aren't counted).`
          : `${tool.name} isn't in the Saver Option deals catalog, so no matching offer is currently listed.`,
      });
  }

  const per = Math.min(Math.max(opts.relatedPerCategory ?? 4, 1), 12);
  const related: WorkspaceDeals["related"] = [];
  const categories = [...new Set(tools.map((t) => t.category))];
  for (const category of categories) {
    if (categoryTags[category].length === 0) continue;
    const inCat = tools.filter((t) => t.category === category);
    // One listing per product (verified first), so a product with several offers doesn't crowd the row.
    const seen = new Set<string>();
    const list = offers
      .filter((o) => !ownProducts.has(o.productId) && ALTERNATIVE_TYPES.has(o.type) && inBusinessCategory(o, category))
      .sort(verifiedFirst)
      .filter((o) => (seen.has(o.productId) ? false : (seen.add(o.productId), true)))
      .slice(0, per);
    if (list.length === 0) continue;
    related.push({
      category,
      categoryLabel: categoryLabels[category],
      tools: inCat.map((t) => t.name),
      deals: list.map((o) => ({ ...summaryOf(o), matchReason: `${o.product.name} is listed as ${o.product.tags.filter((t) => categoryTags[category].includes(t.toLowerCase())).join(", ") || categoryLabels[category]} — the same kind of tool as ${inCat.map((t) => t.name).join(", ")}.` })),
    });
  }
  return { matched, unmatched, related };
}

/** Catalog product tags that describe a business software category (lower case). */
export function categoryTagsFor(category: SoftwareCategory): readonly string[] {
  return categoryTags[category];
}

/** Live listings for one catalog product, verified first. `kind` limits them to offer types that save money on that tool, or that help evaluate it as an alternative. */
export async function liveDealsForProduct(productId: string, kind: "saving" | "alternative" = "saving"): Promise<DealSummary[]> {
  const types = kind === "saving" ? SAVING_TYPES : ALTERNATIVE_TYPES;
  const { offers } = await queryOffers({});
  return offers
    .filter((o) => o.productId === productId && types.has(o.type))
    .sort((a, b) => Number(b.verification.status === "verified") - Number(a.verification.status === "verified"))
    .map(summaryOf);
}

/** Live listings (any type) for a product with their stated pricing, for price evidence. */
export async function pricedListingsForProduct(productId: string): Promise<OfferView[]> {
  const { offers } = await queryOffers({});
  return offers.filter((o) => o.productId === productId && o.pricing && (o.pricing.regularPrice !== undefined || o.pricing.dealPrice !== undefined));
}
