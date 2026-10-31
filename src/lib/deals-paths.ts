/**
 * Where deal pages live. The catalog has two homes: /deals on the Saver Option site, and
 * /business/software-deals, the same pages inside Saver Option Business's navigation for
 * visitors who come from Business. Links on a deal page stay in the home it was opened from;
 * the Business copies name the /deals pages as canonical.
 */
export const BUSINESS_DEALS = "/business/software-deals";
export type DealsBase = "/deals" | typeof BUSINESS_DEALS;

export const isBusinessDeals = (base: DealsBase) => base === BUSINESS_DEALS;

export const dealPath = (slug: string, base: DealsBase = "/deals") => `${base}/${slug}`;

/** A category: its own page on the site, the filtered list in Business. */
export const categoryPath = (slug: string, base: DealsBase = "/deals") =>
  base === "/deals" ? `/categories/${slug}` : `${base}?category=${encodeURIComponent(slug)}`;

/** A product's offers: its own page on the site, a search for it in Business. */
export const productPath = (product: { slug: string; name: string }, base: DealsBase = "/deals") =>
  base === "/deals" ? `/products/${product.slug}` : `${base}?q=${encodeURIComponent(product.name)}`;
