import type { Metadata } from "next";
import { DealsListing } from "@/components/deals/deals-listing";
import { BUSINESS_DEALS } from "@/lib/deals-paths";
import { hasActiveFilters, parseDealsParams } from "@/lib/query-params";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(props: PageProps<"/business/software-deals">): Promise<Metadata> {
  const params = parseDealsParams(await props.searchParams);
  return pageMetadata({
    title: params.q ? `Deals matching “${params.q}”` : "Software deals",
    description:
      "Software deals, free credits, startup programs and discounts on the tools businesses pay for — searchable by product, category and price.",
    // The same catalog as /deals, which is the page search engines should show.
    path: "/deals",
    noIndex: hasActiveFilters(params) || params.page > 1 || Boolean(params.sort),
  });
}

export default async function BusinessDealsPage(props: PageProps<"/business/software-deals">) {
  return <DealsListing params={parseDealsParams(await props.searchParams)} base={BUSINESS_DEALS} />;
}
