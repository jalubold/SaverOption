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
  /** The page has its own opengraph-image file; otherwise the site image is used. */
  ownImage?: boolean;
}

export function pageMetadata({ title, description, path, noIndex, ownImage = false }: PageMetaInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_US",
      // Setting images here would hide a page's own opengraph-image file.
      ...(!ownImage && { images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: siteConfig.name }] }),
    },
    twitter: { card: "summary_large_image", title, description },
    robots: noIndex ? { index: false, follow: true } : undefined,
  };
}

/** "October 2026" for the most recent of some dates: how fresh a list is, for titles. */
export function freshnessLabel(dates: string[]): string | null {
  const latest = dates.filter(Boolean).sort().at(-1);
  if (!latest) return null;
  return new Date(`${latest.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

/** Trims a description to what search results show, at a word boundary. */
export function clampDescription(text: string, max = 160): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.—-]+$/, "")}…`;
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

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/apple-icon"),
    description: siteConfig.description,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en",
    publisher: { "@id": `${siteConfig.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteConfig.url}/deals?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

/** A list of deals, for category, collection and product pages. */
export function collectionJsonLd({ name, description, path, offers }: { name: string; description: string; path: string; offers: OfferView[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    ...(offers.length && { dateModified: offers.map((o) => o.updatedAt).sort().at(-1) }),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: offers.length,
      itemListElement: offers.slice(0, 50).map((o, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/deals/${o.slug}`),
        name: o.title,
      })),
    },
  };
}

/** The deal page itself: what it's about and when it was published and last updated. */
export function dealPageJsonLd(offer: OfferView) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: offer.title,
    description: offer.summary,
    url: absoluteUrl(`/deals/${offer.slug}`),
    datePublished: offer.publishedAt,
    dateModified: offer.updatedAt,
    inLanguage: "en",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    publisher: { "@id": `${siteConfig.url}/#organization` },
    about: { "@type": "SoftwareApplication", name: offer.product.name, url: offer.product.website, applicationCategory: "BusinessApplication" },
    ...(offer.verification.checkedAt && { lastReviewed: offer.verification.checkedAt }),
  };
}

/** Questions and answers shown on the page (the same text, so it matches what people see). */
export function faqJsonLd(items: { q: string; a: string }[]) {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
}
