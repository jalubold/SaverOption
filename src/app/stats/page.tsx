import { parseStatsQuery } from "@/lib/web-analytics";
import { statsMetadata, StatsView } from "./stats-view";

export const metadata = statsMetadata;

// The default view (last 7 days, no filters) is prerendered and served from the CDN so opening
// /stats is instant; it refreshes every 15 minutes, like the analytics data behind it. Other ranges
// and filters live at /stats/view?…, rendered per request.
export const dynamic = "force-static";
export const revalidate = 900;

export default function StatsPage() {
  return <StatsView q={parseStatsQuery({})} />;
}
