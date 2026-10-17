import type { OfferView } from "@/lib/types";

/** All outbound offer links go through the redirect so destinations can change without re-publishing pages. */
export function outboundHref(offer: Pick<OfferView, "slug">): string {
  return `/go/${offer.slug}`;
}

/** `sponsored` is required by search engines for paid and affiliate links. */
export function outboundRel(offer: OfferView): string {
  return offer.links.affiliateUrl || offer.isSponsored ? "sponsored nofollow noopener" : "nofollow noopener";
}

export function destinationUrl(offer: OfferView): { url: string; kind: "affiliate" | "official" } {
  if (offer.links.affiliateUrl) return { url: offer.links.affiliateUrl, kind: "affiliate" };
  return { url: offer.links.redeemUrl ?? offer.links.officialUrl, kind: "official" };
}

export function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
