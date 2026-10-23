import { siteConfig } from "@/config/site";
import { getOfferBySlug } from "@/lib/catalog";
import { headlineValue } from "@/lib/format";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = `${siteConfig.name} deal`;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const offer = await getOfferBySlug(slug);
  if (!offer) return ogImage({ title: siteConfig.tagline });
  const value = headlineValue(offer);
  return ogImage({
    eyebrow: `${offer.product.name}${offer.categoryList[0] ? ` · ${offer.categoryList[0].name}` : ""}`,
    title: offer.title,
    // The value line only when it adds something the title doesn't already say.
    detail: offer.isExpired ? "This offer has ended" : value && !offer.title.includes(value) ? value : offer.summary,
    colors: offer.categoryList[0]?.color,
  });
}
