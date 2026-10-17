import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { OfferView } from "@/lib/types";

export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}

export function pageMetadata({ title, description, path, noIndex }: PageMetaInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: siteConfig.name, type: "website" },
    twitter: { card: "summary_large_image", title, description },
    robots: noIndex ? { index: false, follow: true } : undefined,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/**
 * Product + Offer structured data. Only emitted for editor-verified offers
 * with a verified price — search engines should never see demo or
 * unverified pricing as fact.
 */
export function offerJsonLd(offer: OfferView) {
  if (offer.verification.status !== "verified") return null;
  const price = offer.pricing?.dealPrice;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: offer.product.name,
    description: offer.product.description,
    url: offer.product.website,
    applicationCategory: "BusinessApplication",
    publisher: { "@type": "Organization", name: offer.provider.name, url: offer.provider.website },
    ...(price !== undefined && {
      offers: {
        "@type": "Offer",
        price,
        priceCurrency: offer.pricing!.currency,
        url: absoluteUrl(`/deals/${offer.slug}`),
        ...(offer.expiresAt && { priceValidUntil: offer.expiresAt }),
        availability: offer.isExpired ? "https://schema.org/Discontinued" : "https://schema.org/InStock",
      },
    }),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteConfig.url}/deals?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}
