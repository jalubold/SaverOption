import { isCategorySlug } from "@/lib/catalog";
import { offerTypeLabels, priceFilterLabels, sortLabels } from "@/lib/labels";
import type { OfferQuery, OfferType, PriceFilter, SortKey } from "@/lib/types";

export type RawSearchParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;

const isOfferType = (v?: string): v is OfferType => Boolean(v && v in offerTypeLabels);
const isSort = (v?: string): v is SortKey => Boolean(v && v in sortLabels);
const isPrice = (v?: string): v is PriceFilter => Boolean(v && v in priceFilterLabels);

export interface DealsParams extends OfferQuery {
  page: number;
}

/** Parses /deals URL params, silently dropping anything invalid. */
export function parseDealsParams(raw: RawSearchParams): DealsParams {
  const category = first(raw.category);
  const type = first(raw.type);
  const price = first(raw.price);
  const sort = first(raw.sort);
  const page = Number.parseInt(first(raw.page) ?? "1", 10);
  return {
    q: first(raw.q)?.slice(0, 100),
    category: isCategorySlug(category) ? category : undefined,
    type: isOfferType(type) ? type : undefined,
    price: isPrice(price) && price !== "all" ? price : undefined,
    sort: isSort(sort) && sort !== "relevance" ? sort : undefined,
    page: Number.isFinite(page) && page > 1 ? page : 1,
  };
}

/** Builds a /deals URL from params, omitting defaults so URLs stay canonical. */
export function dealsHref(params: Partial<DealsParams>, overrides: Partial<Record<keyof DealsParams, string | number | undefined>> = {}) {
  const merged = { ...params, ...overrides } as Record<string, string | number | undefined>;
  const sp = new URLSearchParams();
  for (const key of ["q", "category", "type", "price", "sort", "page"] as const) {
    const value = merged[key];
    if (value === undefined || value === "" || (key === "page" && Number(value) <= 1)) continue;
    sp.set(key, String(value));
  }
  const qs = sp.toString();
  return qs ? `/deals?${qs}` : "/deals";
}

export function hasActiveFilters(p: DealsParams): boolean {
  return Boolean(p.q || p.category || p.type || p.price);
}
