import type { Metadata } from "next";
import { DealsListing } from "@/components/deals/deals-listing";
import { hasActiveFilters, parseDealsParams } from "@/lib/query-params";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(props: PageProps<"/deals">): Promise<Metadata> {
  const params = parseDealsParams(await props.searchParams);
  const meta = pageMetadata({
    title: params.q ? `Deals matching “${params.q}”` : "All software deals",
    description:
      "Search and filter software deals, free credits, startup perks, student discounts and lifetime deals — sorted by newest, ending soon or relevance.",
    path: "/deals",
    // Filtered and searched variants are useful to people, not to search indexes.
    noIndex: hasActiveFilters(params) || params.page > 1 || Boolean(params.sort),
  });
  return meta;
}

export default async function DealsPage(props: PageProps<"/deals">) {
  return <DealsListing params={parseDealsParams(await props.searchParams)} base="/deals" />;
}
