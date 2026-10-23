import { siteConfig } from "@/config/site";
import { getCategories } from "@/lib/catalog";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = `${siteConfig.name} category`;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = (await getCategories()).find((c) => c.slug === slug);
  if (!category) return ogImage({ title: siteConfig.tagline });
  return ogImage({
    eyebrow: `${category.count} current offer${category.count === 1 ? "" : "s"}`,
    title: category.name,
    detail: category.description,
    colors: category.color,
  });
}
