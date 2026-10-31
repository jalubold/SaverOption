import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DealDetail } from "@/components/deals/deal-detail";
import { getAllOfferSlugs, getOfferBySlug } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getAllOfferSlugs()).map((slug) => ({ slug }));
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
