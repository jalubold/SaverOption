import { NextResponse, type NextRequest } from "next/server";
import { FIRST_CARDS, getAudience, getAudienceGrid, getCategory, getCategoryGrid, isCategorySlug } from "@/lib/catalog";

/**
 * The cards a category or collection page leaves for "Show all" (everything after the first
 * FIRST_CARDS, in the page's own order): GET /api/offers?category=ai-tools or ?audience=startups.
 * The catalog only changes with a deploy, so Vercel's CDN keeps each answer for the same 12 hours
 * the pages keep, and the function runs about once per list instead of once per click.
 */
const CACHED = "public, max-age=0, s-maxage=43200, stale-while-revalidate=86400";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const category = params.get("category") ?? undefined;
  const audience = params.get("audience") ?? undefined;

  let grid = null;
  if (category && !audience && isCategorySlug(category) && (await getCategory(category))) grid = await getCategoryGrid(category);
  else if (audience && !category) {
    const found = await getAudience(audience);
    if (found) grid = await getAudienceGrid(found.slug);
  }
  if (!grid) {
    return NextResponse.json({ error: "Unknown category or collection" }, { status: 404, headers: { "Cache-Control": "public, max-age=0, s-maxage=3600" } });
  }
  return NextResponse.json({ offers: grid.slice(FIRST_CARDS) }, { headers: { "Cache-Control": CACHED } });
}
