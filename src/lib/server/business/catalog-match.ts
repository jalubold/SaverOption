import { normalizeName } from "@/lib/business/calc";
import type { SoftwareCategory } from "@/lib/business/constants";
import type { CatalogAlternative, CatalogDeal } from "@/lib/business/savings";
import { getOffersForProduct } from "@/lib/catalog";
import { products, providers } from "@/content/products";
import { formatDate } from "@/lib/format";
import { offerTypeLabels } from "@/lib/labels";
import type { OfferView, Product } from "@/lib/types";

/**
 * Links business software records to the Saver Option deals catalog, so the
 * savings center and detail pages can show real listings (never invented
 * offers). Matching is by product name or website domain.
 */

const providerName = new Map(providers.map((p) => [p.id, p.name]));
const byName = new Map<string, Product>();
const byHost = new Map<string, Product>();
for (const p of products) {
  byName.set(normalizeName(p.name), p);
  const host = hostOf(p.website);
  if (host && !byHost.has(host)) byHost.set(host, p);
}

function hostOf(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** The catalog product for a software record, by exact (normalised) name or website. */
export function matchCatalogProduct(name: string, website?: string | null): Product | null {
  const exact = byName.get(normalizeName(name));
  if (exact) return exact;
  const host = hostOf(website);
  return host ? (byHost.get(host) ?? null) : null;
}

export function catalogProduct(id: string | null): Product | null {
  return id ? (products.find((p) => p.id === id) ?? null) : null;
}

export function catalogProviderName(product: Product): string {
  return providerName.get(product.providerId) ?? product.name;
}

/** Live (published, not expired) listings for a catalog product. */
export async function liveOffersFor(productId: string | null): Promise<OfferView[]> {
  if (!productId) return [];
  return (await getOffersForProduct(productId)).filter((o) => !o.isExpired);
}

export function verificationLabel(o: OfferView): string {
  return o.verification.status === "verified" && o.verification.checkedAt ? `Verified on ${formatDate(o.verification.checkedAt)}` : "Unverified";
}

/**
 * Offer types that can save a company money on a tool it already uses. Student
 * and teacher offers, free trials and open-source listings don't apply to a
 * paying business, so they aren't suggested as savings.
 */
const BUSINESS_OFFER_TYPES = new Set(["discount", "free-credits", "startup", "lifetime", "free-plan"]);

/** Deals for each software record that matches a catalog product (verified listings first). */
export async function dealsForSoftware(software: { id: string; catalogProductId: string | null }[]): Promise<CatalogDeal[]> {
  const out: CatalogDeal[] = [];
  for (const sw of software) {
    const offers = (await liveOffersFor(sw.catalogProductId))
      .filter((o) => BUSINESS_OFFER_TYPES.has(o.type))
      .sort((a, b) => Number(b.verification.status === "verified") - Number(a.verification.status === "verified"));
    for (const o of offers) {
      out.push({
        softwareId: sw.id,
        slug: o.slug,
        title: o.title,
        summary: o.summary,
        typeLabel: offerTypeLabels[o.type],
        verification: verificationLabel(o),
        eligibility: o.eligibility[0] ?? null,
      });
    }
  }
  return out;
}

/**
 * Catalog tags that name a job specific enough to suggest an alternative.
 * Broad tags ("AI", "Cloud", "Self-hosted", "Collaboration") are left out.
 */
const categoryTags: Partial<Record<SoftwareCategory, string[]>> = {
  communication: ["Team chat"],
  design: ["Design", "Prototyping"],
  analytics: ["Analytics", "Product Analytics"],
  crm_sales: ["CRM"],
  storage: ["File sync"],
  documentation: ["Docs"],
  project_management: ["Project management", "Project Management"],
};
const GENERIC_TAGS = new Set(["AI", "Cloud", "Self-hosted", "Collaboration", "Productivity", "Privacy", "Developer tools", "Developer Tools", "macOS", "Small business", "Integrations", "Video"]);

/** Open-source catalog products that do the same job as a software record. */
export function alternativesFor(sw: { id: string; name: string; category: SoftwareCategory; catalogProductId: string | null }): CatalogAlternative[] {
  const own = catalogProduct(sw.catalogProductId);
  if (own?.openSource) return [];
  const wanted = new Set([...(categoryTags[sw.category] ?? []), ...(own?.tags.filter((t) => !GENERIC_TAGS.has(t)) ?? [])]);
  if (wanted.size === 0) return [];
  const out: CatalogAlternative[] = [];
  for (const p of products) {
    if (!p.openSource || p.id === own?.id || normalizeName(p.name) === normalizeName(sw.name)) continue;
    const shared = p.tags.find((t) => wanted.has(t));
    if (!shared) continue;
    out.push({ softwareId: sw.id, productName: p.name, productSlug: p.slug, tagline: p.tagline.endsWith(".") ? p.tagline : `${p.tagline}.`, license: p.openSource.license, sharedTag: shared });
  }
  return out.slice(0, 2);
}
