import { siteConfig } from "@/config/site";
import { getOffersForProduct, getProductBySlug } from "@/lib/catalog";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = `${siteConfig.name} product deals`;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return ogImage({ title: siteConfig.tagline });
  const live = (await getOffersForProduct(product.id)).filter((o) => !o.isExpired).length;
  return ogImage({
    eyebrow: `${live} current offer${live === 1 ? "" : "s"}`,
    title: `${product.name} deals and offers`,
    detail: product.tagline,
  });
}
