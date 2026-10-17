import { NextResponse } from "next/server";
import { getClicksToday } from "@/lib/engagement";
import { getVisitorsToday, visitorDisplayThreshold } from "@/lib/visitors";

/**
 * Public, real-time-ish counters for the site. Each figure is null unless
 * it's measured and above the display threshold, so the UI never shows
 * a made-up or embarrassingly small number.
 */
export async function GET() {
  const [visitors, clicks] = await Promise.all([getVisitorsToday(), getClicksToday()]);
  const min = visitorDisplayThreshold();
  return NextResponse.json(
    {
      visitorsToday: visitors !== null && visitors >= min ? visitors : null,
      dealsOpenedToday: clicks !== null && visitors !== null && visitors >= min ? clicks : null,
    },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  );
}
