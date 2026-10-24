import { products, providers } from "@/content/products";
import { addTo, annualized, formatMoney, intervalLabel, isRecurring, monthlyEquivalent, normalizeName, type CurrencyTotals } from "@/lib/business/calc";
import { categoryLabels, type SoftwareCategory } from "@/lib/business/constants";
import { catalogProduct } from "@/lib/server/business/catalog-match";
import { BizError, type BizContext } from "@/lib/server/business/context";
import { getSoftwareList, getSubscriptions } from "@/lib/server/business/data";
import { categoryTagsFor, liveDealsForProduct, pricedListingsForProduct, type DealSummary } from "@/lib/server/business/deals";
import { formatDate, formatPeriodPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

/**
 * Alternatives to a tool a workspace pays for, from the Saver Option catalog.
 * Functional notes are the catalog's own description and tags; prices appear
 * only where a published listing states them, with the listing as the source.
 * No cost difference is computed unless both prices are known on the same
 * basis, and migration notes are general guidance, not product claims.
 */

/** Tags too broad to say two products do the same job. */
const GENERIC_TAGS = new Set(["ai", "cloud", "self-hosted", "collaboration", "productivity", "privacy", "developer tools", "macos", "mac", "small business", "integrations", "video", "enterprise", "teams", "students", "education", "creators", "templates", "api"]);

export interface PricingEvidence {
  listingTitle: string;
  listingSlug: string;
  /** As the listing states it, e.g. "$8/mo"; null when only another figure is given. */
  price: string | null;
  regularPrice: string | null;
  currency: string;
  /** "month", "year" or "one-time", when stated. */
  period: string | null;
  verifiedOn: string | null;
  sourceUrl: string;
}

export interface AlternativeOption {
  productId: string;
  name: string;
  slug: string;
  providerName: string;
  website: string;
  tagline: string;
  /** Catalog tags shared with the current tool — why it's suggested. */
  sharedTags: string[];
  openSource: { license: string; repoUrl: string } | null;
  /** From the catalog's own description; nothing beyond what it states. */
  functionalNotes: string[];
  pricingEvidence: PricingEvidence[];
  estimatedCostDifference: { monthly: CurrencyTotals; basis: "normalized_estimate" } | null;
  costDifferenceReason: string;
  deals: DealSummary[];
}

export interface AlternativesComparison {
  current: {
    softwareId: string;
    name: string;
    category: SoftwareCategory;
    categoryLabel: string;
    catalogProduct: { id: string; name: string; slug: string; tags: string[] } | null;
    /** What the workspace pays for it: monthly/annual equivalents of live recurring subscriptions with a price, per currency. */
    workspaceCost: {
      basis: "normalized_estimate";
      monthly: CurrencyTotals;
      annual: CurrencyTotals;
      subscriptions: { id: string; plan: string | null; price: string | null; billing: string; seats: number | null; pricingModel: string }[];
      withoutPrice: number;
    };
  };
  alternatives: AlternativeOption[];
  /** Applies to any switch; not specific to the products above. */
  migrationConsiderations: { guidance: "general"; items: string[] };
  notes: string[];
}

const providerName = new Map(providers.map((p) => [p.id, p.name]));

function candidateTags(category: SoftwareCategory, own: Product | null): Set<string> {
  const tags = new Set(categoryTagsFor(category));
  for (const t of own?.tags ?? []) if (!GENERIC_TAGS.has(t.toLowerCase())) tags.add(t.toLowerCase());
  return tags;
}

export async function compareAlternatives(ctx: BizContext, opts: { subscriptionId?: string; softwareId?: string; limit?: number }): Promise<AlternativesComparison> {
  const ws = ctx.workspace.id;
  const limit = Math.min(Math.max(Math.trunc(opts.limit ?? 5), 1), 10);
  const [software, subs] = await Promise.all([getSoftwareList(ws), getSubscriptions(ws)]);
  let softwareId = opts.softwareId ?? null;
  if (opts.subscriptionId) {
    const sub = subs.find((s) => s.id === opts.subscriptionId);
    if (!sub) throw new BizError("not_found", "That subscription isn't in this workspace.");
    if (softwareId && softwareId !== sub.softwareId) throw new BizError("invalid", "The subscription and software don't match.");
    softwareId = sub.softwareId;
  }
  if (!softwareId) throw new BizError("invalid", "Give a subscription or software record to compare.");
  const sw = software.find((s) => s.id === softwareId);
  if (!sw) throw new BizError("not_found", "That software isn't in this workspace.");

  const own = catalogProduct(sw.catalogProductId);
  const mySubs = subs.filter((s) => s.softwareId === sw.id && isRecurring(s));
  const monthly: CurrencyTotals = {};
  const annual: CurrencyTotals = {};
  let withoutPrice = 0;
  for (const s of mySubs) {
    const m = monthlyEquivalent(s);
    if (m === null) {
      withoutPrice++;
      continue;
    }
    addTo(monthly, s.currency, m);
    addTo(annual, s.currency, annualized(s)!);
  }

  const wanted = candidateTags(sw.category, own);
  const scored: { p: Product; shared: string[] }[] = [];
  if (wanted.size > 0) {
    for (const p of products) {
      if (p.id === own?.id || normalizeName(p.name) === normalizeName(sw.name)) continue;
      const shared = p.tags.filter((t) => wanted.has(t.toLowerCase()));
      if (shared.length) scored.push({ p, shared });
    }
  }
  // Most shared jobs first; among equals, products with a live listing, then open source.
  const withListings = new Set<string>();
  for (const { p } of scored) if ((await liveDealsForProduct(p.id, "alternative")).length) withListings.add(p.id);
  scored.sort((a, b) => b.shared.length - a.shared.length || Number(withListings.has(b.p.id)) - Number(withListings.has(a.p.id)) || Number(Boolean(b.p.openSource)) - Number(Boolean(a.p.openSource)) || a.p.name.localeCompare(b.p.name));

  const alternatives: AlternativeOption[] = [];
  for (const { p, shared } of scored.slice(0, limit)) {
    const priced = await pricedListingsForProduct(p.id);
    const evidence: PricingEvidence[] = priced.map((o) => {
      const pr = o.pricing!;
      return {
        listingTitle: o.title,
        listingSlug: o.slug,
        price: pr.dealPrice !== undefined ? (pr.dealPrice === 0 ? "Free" : formatPeriodPrice(pr.dealPrice, pr.currency, pr.period)) : null,
        regularPrice: pr.regularPrice !== undefined ? formatPeriodPrice(pr.regularPrice, pr.currency, pr.regularPeriod ?? pr.period) : null,
        currency: pr.currency,
        period: pr.period ?? null,
        verifiedOn: o.verification.status === "verified" && o.verification.checkedAt ? formatDate(o.verification.checkedAt) : null,
        sourceUrl: o.links.officialUrl,
      };
    });
    alternatives.push({
      productId: p.id,
      name: p.name,
      slug: p.slug,
      providerName: providerName.get(p.providerId) ?? p.name,
      website: p.website,
      tagline: p.tagline,
      sharedTags: shared,
      openSource: p.openSource ? { license: p.openSource.license, repoUrl: p.openSource.repoUrl } : null,
      functionalNotes: [p.tagline, ...(p.description && p.description !== p.tagline ? [p.description] : [])],
      pricingEvidence: evidence,
      // Listing prices are offer prices for an unstated plan and seat count; comparing them to what this workspace pays would be a guess.
      estimatedCostDifference: null,
      costDifferenceReason: evidence.length
        ? `Not calculated: the listed price${evidence.length === 1 ? " is" : "s are"} for a specific offer, not stated for the same plan, seat count and billing period as your ${sw.name} subscription${mySubs.length === 1 ? "" : "s"}. Get a quote for your team size to compare.`
        : `Not calculated: the Saver Option catalog doesn't list a price for ${p.name}. Check the provider's pricing for your team size.`,
      deals: await liveDealsForProduct(p.id, "alternative"),
    });
  }

  const notes: string[] = [];
  if (wanted.size === 0) notes.push(`No alternatives suggested: "${categoryLabels[sw.category]}" is too broad to match products by the job they do. Set a more specific category on ${sw.name}.`);
  else if (alternatives.length === 0) notes.push(`The Saver Option catalog has no other product listed for the same job as ${sw.name}.`);
  if (withoutPrice) notes.push(`${withoutPrice} of ${sw.name}'s subscriptions ha${withoutPrice === 1 ? "s" : "ve"} no price, so they're left out of the cost.`);
  notes.push("Suggestions come from the catalog's product tags, not from a review of your requirements. Check each one against how your team uses the tool.");

  return {
    current: {
      softwareId: sw.id,
      name: sw.name,
      category: sw.category,
      categoryLabel: categoryLabels[sw.category],
      catalogProduct: own ? { id: own.id, name: own.name, slug: own.slug, tags: own.tags } : null,
      workspaceCost: {
        basis: "normalized_estimate",
        monthly,
        annual,
        subscriptions: mySubs.map((s) => ({
          id: s.id,
          plan: s.planName,
          price: s.priceMinor !== null ? formatMoney(s.priceMinor, s.currency) : null,
          billing: intervalLabel(s),
          seats: s.purchasedSeats,
          pricingModel: s.pricingModel,
        })),
        withoutPrice,
      },
    },
    alternatives,
    migrationConsiderations: {
      guidance: "general",
      items: [
        "Data: what can be exported from the current tool and imported into the new one (formats, history, attachments).",
        "Access: single sign-on, user provisioning and permission models on both sides.",
        "Integrations: which other tools connect to the current one and whether the alternative supports them.",
        "People: training time and a period of running both tools in parallel.",
        "Contract: the current plan's renewal date and notice period, so a switch doesn't overlap a renewal.",
      ],
    },
    notes,
  };
}
