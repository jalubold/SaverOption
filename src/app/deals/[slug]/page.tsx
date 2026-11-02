import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DealDetail } from "@/components/deals/deal-detail";
import { getOfferBySlug } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

/**
 * Pages are built on their first visit and then served from the cache, not all at build time:
 * prerendering every one made each deployment hundreds of MB and filled the Hobby storage.
 * The catalog only changes with a deploy; the 12-hour refresh keeps "ends in" and ended labels
 * current without rewriting the cache every hour.
 */
export const revalidate = 43200;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata(props: PageProps<"/deals/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const offer = await getOfferBySlug(slug);
  if (!offer) return {};
  return pageMetadata({
    title: `${offer.title}${offer.isExpired ? " (ended)" : ""}`,
    description: offer.summary,
    path: `/deals/${offer.slug}`,
    ownImage: true,
  });
}

export default async function DealPage(props: PageProps<"/deals/[slug]">) {
  const { slug } = await props.params;
  const offer = await getOfferBySlug(slug);
  if (!offer) notFound();
  return <DealDetail offer={offer} base="/deals" />;
}
