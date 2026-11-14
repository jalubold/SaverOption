import { siteConfig } from "@/config/site";
import { getAudiences } from "@/lib/catalog";
import { ogContentType, ogImage, ogNotFound, ogSize } from "@/lib/og";

export const alt = `${siteConfig.name} collection`;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const audience = (await getAudiences()).find((a) => a.slug === slug);
  // Not in the catalog: a 404 like the page itself, not a generic image drawn for any URL.
  if (!audience) return ogNotFound();
  return ogImage({
    eyebrow: `${audience.count} current offer${audience.count === 1 ? "" : "s"}`,
    title: `Software deals for ${audience.name}`,
    detail: audience.description,
    colors: audience.color,
  });
}
