import { NextResponse, type NextRequest } from "next/server";
import { getOfferBySlug } from "@/lib/catalog";
import { recordOutboundClick } from "@/lib/engagement";
import { destinationUrl } from "@/lib/outbound";

/**
 * Outbound redirect for every "View deal" link.
 *  - Picks the affiliate URL when one exists, otherwise the provider URL.
 *  - Is the single place to record clicks (feeds "Popular" rankings).
 *  - Only redirects to URLs stored in the catalog, so it can't be used as an open redirect.
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/go/[slug]">) {
  const { slug } = await ctx.params;
  const offer = await getOfferBySlug(slug);

  if (!offer) {
    return NextResponse.redirect(new URL("/deals", request.url), 302);
  }
  if (offer.isExpired) {
    return NextResponse.redirect(new URL(`/deals/${offer.slug}`, request.url), 302);
  }

  const { url, kind } = destinationUrl(offer);
  // Never block the redirect on analytics.
  recordOutboundClick({ offerId: offer.id, destination: kind, referrer: request.headers.get("referer") }).catch(() => {});

  const res = NextResponse.redirect(url, 302);
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return res;
}
