import { NextResponse, type NextRequest } from "next/server";
import { dbConfigured } from "@/lib/server/db";
import { getPublishedBySlug } from "@/lib/server/submissions";
import { recordListingEvent } from "@/lib/server/tracking";
import { requestVisitor } from "@/lib/server/visitor";
import { isLikelyBot } from "@/lib/visitors";

/**
 * Outbound click from a sponsored listing to the advertiser's website. Counts
 * once per visitor per day while the listing is live, then redirects.
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/listings/[slug]/visit">) {
  const { slug } = await ctx.params;
  const listing = dbConfigured() ? await getPublishedBySlug(slug).catch(() => null) : null;
  if (!listing) return NextResponse.redirect(new URL("/listings", request.nextUrl.origin));

  const visitor = requestVisitor(request);
  const prefetch = request.headers.get("purpose") === "prefetch" || request.headers.get("sec-purpose")?.includes("prefetch");
  if (!prefetch && !isLikelyBot(visitor.userAgent)) {
    await recordListingEvent(listing.id, "click", visitor).catch((err) => console.error("[listing click]", err instanceof Error ? err.message : err));
  }
  const res = NextResponse.redirect(listing.website, 302);
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}
