import { getAudiences, getCategories, getProductBySlug, getAllProductSlugs, getOffersForProduct, queryOffers } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/seo";

/** Every public, indexable URL with when it last changed: the sitemap, and what IndexNow is told about. */
export interface SiteUrl {
  url: string;
  lastModified?: string;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
}

const latest = (dates: (string | undefined)[]) => dates.filter((d): d is string => Boolean(d)).sort().at(-1);

export async function siteUrls(): Promise<SiteUrl[]> {
  const [{ offers }, categories, audiences, productSlugs] = await Promise.all([
    queryOffers({ includeExpired: true, sort: "newest" }),
    getCategories(),
    getAudiences(),
    getAllProductSlugs(),
  ]);
  const live = offers.filter((o) => !o.isExpired);
  const newest = latest(live.map((o) => o.updatedAt));

  const products = await Promise.all(
    productSlugs.map(async (slug) => {
      const product = await getProductBySlug(slug);
      const list = product ? await getOffersForProduct(product.id) : [];
      return { slug, lastModified: latest(list.map((o) => o.updatedAt)) };
    }),
  );

  return [
    { url: absoluteUrl("/"), lastModified: newest, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/deals"), lastModified: newest, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/categories"), lastModified: newest, changeFrequency: "weekly", priority: 0.6 },
    ...categories.map((c) => ({
      url: absoluteUrl(`/categories/${c.slug}`),
      lastModified: latest(live.filter((o) => o.categories.includes(c.slug)).map((o) => o.updatedAt)),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...audiences.map((a) => ({
      url: absoluteUrl(`/for/${a.slug}`),
      lastModified: latest(live.filter((o) => o.audiences?.includes(a.slug)).map((o) => o.updatedAt)),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...offers.map((o) => ({
      url: absoluteUrl(`/deals/${o.slug}`),
      lastModified: o.updatedAt,
      changeFrequency: "weekly" as const,
      priority: o.isExpired ? 0.3 : 0.7,
    })),
    ...products.map((p) => ({ url: absoluteUrl(`/products/${p.slug}`), lastModified: p.lastModified, changeFrequency: "weekly" as const, priority: 0.5 })),
    { url: absoluteUrl("/about"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/partnerships"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/promote"), changeFrequency: "monthly", priority: 0.4 },
    { url: absoluteUrl("/listings"), changeFrequency: "daily", priority: 0.4 },
    { url: absoluteUrl("/stats"), changeFrequency: "daily", priority: 0.3 },
    { url: absoluteUrl("/disclosure"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.2 },
  ];
}
