import { siteConfig } from "@/config/site";
import { getAudiences } from "@/lib/catalog";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = `${siteConfig.name} collection`;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const audience = (await getAudiences()).find((a) => a.slug === slug);
  if (!audience) return ogImage({ title: siteConfig.tagline });
  return ogImage({
    eyebrow: `${audience.count} current offer${audience.count === 1 ? "" : "s"}`,
    title: `Software deals for ${audience.name}`,
    detail: audience.description,
    colors: audience.color,
  });
}
