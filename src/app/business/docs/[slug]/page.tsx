import { notFound } from "next/navigation";
import { DocArticle } from "@/components/business/docs/doc-blocks";
import { guideBySlug, guides } from "@/content/business-docs";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const g = guideBySlug.get(slug);
  if (!g) return {};
  return pageMetadata({ title: `${g.title} — Business docs`, description: g.description, path: `/business/docs/${g.slug}` });
}

export default async function GuidePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const g = guideBySlug.get(slug);
  if (!g) notFound();
  return <DocArticle page={g} href={`/business/docs/${g.slug}`} />;
}
