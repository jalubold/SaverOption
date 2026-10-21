import type { MetadataRoute } from "next";
import { getAllProductSlugs, getAudiences, getCategories, queryOffers } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ offers }, categories, audiences, products] = await Promise.all([
    queryOffers({ includeExpired: true, sort: "newest" }),
    getCategories(),
    getAudiences(),
    getAllProductSlugs(),
  ]);

  return [
    { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/deals"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/categories"), changeFrequency: "weekly", priority: 0.6 },
    ...categories.map((c) => ({ url: absoluteUrl(`/categories/${c.slug}`), changeFrequency: "daily" as const, priority: 0.8 })),
    ...audiences.map((a) => ({ url: absoluteUrl(`/for/${a.slug}`), changeFrequency: "daily" as const, priority: 0.8 })),
    ...offers.map((o) => ({
      url: absoluteUrl(`/deals/${o.slug}`),
      lastModified: o.updatedAt,
      changeFrequency: "weekly" as const,
      priority: o.isExpired ? 0.3 : 0.7,
    })),
    ...products.map((slug) => ({ url: absoluteUrl(`/products/${slug}`), changeFrequency: "weekly" as const, priority: 0.5 })),
    { url: absoluteUrl("/about"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/partnerships"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/stats"), changeFrequency: "daily", priority: 0.3 },
    { url: absoluteUrl("/disclosure"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.2 },
  ];
}
