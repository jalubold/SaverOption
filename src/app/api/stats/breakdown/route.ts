import { NextResponse, type NextRequest } from "next/server";
import { getLazyBreakdown } from "@/lib/server/traffic-stats";
import { LAZY_DIMENSIONS, panelRows, parseStatsQuery, type Dimension } from "@/lib/web-analytics";

/**
 * Rows for a /stats tab that loads when it's opened (UTM sources, browsers, OS),
 * so the page itself needs fewer analytics API calls. Only those dimensions.
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const dim = sp.get("dim") as Dimension | null;
  if (!dim || !(LAZY_DIMENSIONS as readonly string[]).includes(dim)) return NextResponse.json({ ok: false, reason: "unknown breakdown" }, { status: 400 });
  const q = parseStatsQuery(Object.fromEntries(sp));
  const result = await getLazyBreakdown(q, dim);
  if (!result.ok) return NextResponse.json(result, { status: 503, headers: { "Cache-Control": "no-store" } });
  return NextResponse.json({ ok: true, rows: panelRows(q, dim, result.rows) }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } });
}
