import type { Metadata } from "next";
import Link from "next/link";
import { CategoryChips } from "@/components/categories/category-links";
import { OfferGrid } from "@/components/offers/offer-card";
import { DealsFilters } from "@/components/search/deals-filters";
import { SearchBox } from "@/components/search/search-box";
import { Icon } from "@/components/ui/icon";
import { buttonClass, Container } from "@/components/ui/primitives";
import { getCategories, getSponsoredOffers, queryOffers } from "@/lib/catalog";
import { offerTypeLabels, priceFilterLabels, sortLabels } from "@/lib/labels";
import { dealsHref, hasActiveFilters, parseDealsParams } from "@/lib/query-params";
import { pageMetadata } from "@/lib/seo";
import type { OfferType, PriceFilter, SortKey } from "@/lib/types";

const PAGE_SIZE = 24;

export async function generateMetadata(props: PageProps<"/deals">): Promise<Metadata> {
  const params = parseDealsParams(await props.searchParams);
  const meta = pageMetadata({
    title: params.q ? `Deals matching “${params.q}”` : "All software deals",
    description:
      "Search and filter software deals, free credits, startup perks, student discounts and lifetime deals — sorted by newest, ending soon or relevance.",
    path: "/deals",
    // Filtered and searched variants are useful to people, not to search indexes.
    noIndex: hasActiveFilters(params) || params.page > 1 || Boolean(params.sort),
  });
  return meta;
}

export default async function DealsPage(props: PageProps<"/deals">) {
  const params = parseDealsParams(await props.searchParams);
  const [result, categories, sponsored] = await Promise.all([
    queryOffers(params),
    getCategories(),
    params.q ? Promise.resolve([]) : getSponsoredOffers(params.category),
  ]);

  // One labelled sponsored card leads the first page, only when it matches the current filters.
  const matching = new Set(result.offers.map((o) => o.id));
  const sponsoredSlot = params.page === 1 ? sponsored.filter((s) => matching.has(s.id)).slice(0, 1) : [];
  const organic = result.offers.filter((o) => !sponsoredSlot.some((s) => s.id === o.id));

  const pageCount = Math.max(1, Math.ceil(organic.length / PAGE_SIZE));
  const page = Math.min(params.page, pageCount);
  const visible = organic.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeCategory = categories.find((c) => c.slug === params.category);
  const activeCount = [params.category, params.type, params.price].filter(Boolean).length;

  const chips = [
    params.q && { label: `“${params.q}”`, href: dealsHref(params, { q: undefined, page: undefined }) },
    activeCategory && { label: activeCategory.name, href: dealsHref(params, { category: undefined, page: undefined }) },
    params.type && { label: offerTypeLabels[params.type], href: dealsHref(params, { type: undefined, page: undefined }) },
    params.price && { label: priceFilterLabels[params.price], href: dealsHref(params, { price: undefined, page: undefined }) },
  ].filter((c): c is { label: string; href: string } => Boolean(c));

  const heading = params.q ? `Results for “${params.q}”` : activeCategory ? activeCategory.name : "All software deals";

  return (
    <>
      <section className="border-b border-line bg-surface">
        <Container className="py-10">
          <nav aria-label="Breadcrumb" className="text-xs text-faint">
            <Link href="/" className="hover:text-fg">
              Home
            </Link>{" "}
            / <span className="text-muted">Deals</span>
          </nav>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{heading}</h1>
          <p className="mt-2 max-w-2xl text-[15px] text-muted">
            Search by product, tool or keyword, then narrow by category, offer type and price.
          </p>
          <SearchBox
            size="md"
            defaultValue={params.q}
            className="mt-6 max-w-2xl"
            placeholder="Search deals"
            hidden={{ category: params.category, type: params.type, price: params.price, sort: params.sort }}
          />
        </Container>
      </section>

      <Container className="py-10">
        <DealsFilters
          q={params.q}
          category={params.category}
          type={params.type}
          price={params.price}
          sort={params.sort}
          activeCount={activeCount}
          categoryOptions={categories.map((c) => ({ value: c.slug, label: c.name, count: result.facets.categories[c.slug] ?? 0 }))}
          typeOptions={(Object.keys(offerTypeLabels) as OfferType[]).map((t) => ({
            value: t,
            label: offerTypeLabels[t],
            count: result.facets.types[t] ?? 0,
          }))}
          priceOptions={(Object.keys(priceFilterLabels) as PriceFilter[]).map((p) => ({
            value: p,
            label: p === "all" ? "All" : p === "free" ? "Free" : "Paid",
          }))}
          sortOptions={(Object.keys(sortLabels) as SortKey[]).map((s) => ({ value: s, label: sortLabels[s] }))}
          toolbar={
            <div className="flex flex-wrap items-center gap-2">
              <p className="tabular text-sm text-muted" aria-live="polite">
                <span className="font-medium text-fg">{result.total}</span> {result.total === 1 ? "offer" : "offers"}
              </p>
              {chips.map((chip) => (
                <Link
                  key={chip.href}
                  href={chip.href}
                  className="inline-flex items-center gap-1 rounded-full border border-line-strong bg-surface py-0.5 pl-2.5 pr-1.5 text-xs text-fg hover:border-fg"
                >
                  {chip.label}
                  <Icon name="x" size={12} className="text-faint" />
                  <span className="sr-only">Remove filter</span>
                </Link>
              ))}
              {chips.length > 1 && (
                <Link href="/deals" className="text-xs font-medium text-accent-ink hover:underline">
                  Clear all
                </Link>
              )}
            </div>
          }
        >
          {visible.length > 0 || sponsoredSlot.length > 0 ? (
            <OfferGrid offers={[...sponsoredSlot, ...visible]} headingLevel="h2" />
          ) : (
            <EmptyState hasFilters={hasActiveFilters(params)} categories={categories} />
          )}

          {pageCount > 1 && (
            <nav aria-label="Pagination" className="mt-10 flex items-center justify-between border-t border-line pt-6">
              {page > 1 ? (
                <Link href={dealsHref(params, { page: page - 1 })} className={buttonClass("secondary", "sm")}>
                  Previous
                </Link>
              ) : (
                <span />
              )}
              <span className="tabular text-sm text-muted">
                Page {page} of {pageCount}
              </span>
              {page < pageCount ? (
                <Link href={dealsHref(params, { page: page + 1 })} className={buttonClass("secondary", "sm")}>
                  Next
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </DealsFilters>
      </Container>
    </>
  );
}

function EmptyState({ hasFilters, categories }: { hasFilters: boolean; categories: Awaited<ReturnType<typeof getCategories>> }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
      <span className="mx-auto inline-flex size-11 items-center justify-center rounded-full bg-subtle text-faint">
        <Icon name="search" size={20} />
      </span>
      <h2 className="mt-4 text-lg font-semibold">No offers match</h2>
      <p className="mx-auto mt-1.5 max-w-md text-sm text-muted">
        {hasFilters
          ? "Try a broader keyword, remove a filter, or browse a category instead."
          : "There are no active offers right now. Check back soon."}
      </p>
      {hasFilters && (
        <Link href="/deals" className={buttonClass("secondary", "sm", "mt-5")}>
          Clear search and filters
        </Link>
      )}
      <CategoryChips categories={categories.filter((c) => c.count > 0).slice(0, 6)} className="mt-8 justify-center" />
    </div>
  );
}
