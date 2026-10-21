import { NextResponse } from "next/server";
import { getClicksToday } from "@/lib/engagement";
import { getVisitorsToday, visitorDisplayThreshold } from "@/lib/visitors";
import { getVisitorsTodayFromVercel } from "@/lib/web-analytics";

/**
 * Public, real-time-ish counters for the site. Each figure is null unless
 * it's actually measured (and at least VISITORS_MIN_TO_SHOW, 0 by default),
 * so the UI shows the real number or nothing — never a made-up one. Visitors
 * come from Vercel Web Analytics (the same source as /stats), falling back to
 * our own counter.
 */
export async function GET() {
  const [vercelVisitors, ownVisitors, clicks] = await Promise.all([getVisitorsTodayFromVercel(), getVisitorsToday(), getClicksToday()]);
  const visitors = vercelVisitors ?? ownVisitors;
  const min = visitorDisplayThreshold();
  return NextResponse.json(
    {
      visitorsToday: visitors !== null && visitors >= min ? visitors : null,
      dealsOpenedToday: clicks !== null && visitors !== null && visitors >= min ? clicks : null,
    },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  );
}
