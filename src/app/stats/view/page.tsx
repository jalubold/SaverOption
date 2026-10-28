import { parseStatsQuery } from "@/lib/web-analytics";
import { statsMetadata, StatsView } from "../stats-view";

// Stats for a range or filters, rendered per request. Its own address (not /stats?…) so the router never
// reuses the prerendered /stats for it; old /stats?range=… links are redirected here by the proxy.
// Every range and filter combination is a URL; crawling them all would only spend the analytics API quota.
export const metadata = { ...statsMetadata, robots: { index: false, follow: false } };

export default async function StatsViewPage(props: PageProps<"/stats/view">) {
  return <StatsView q={parseStatsQuery(await props.searchParams)} />;
}
