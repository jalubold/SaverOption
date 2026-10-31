import Link from "next/link";
import { CategoryChips } from "@/components/categories/category-links";
import { OfferGrid } from "@/components/offers/offer-card";
import { DealsFilters } from "@/components/search/deals-filters";
import { SearchBox } from "@/components/search/search-box";
import { Icon } from "@/components/ui/icon";
import { buttonClass, Container } from "@/components/ui/primitives";
import { getCategories, getSponsoredOffers, queryOffers } from "@/lib/catalog";
import { isBusinessDeals, type DealsBase } from "@/lib/deals-paths";
import { offerTypeLabels, priceFilterLabels, sortLabels } from "@/lib/labels";
import { dealsHref, hasActiveFilters, type DealsParams } from "@/lib/query-params";
import type { OfferType, PriceFilter, SortKey } from "@/lib/types";

const PAGE_SIZE = 24;

/**
 * The deals list: search, filters, sponsored slot, results and pagination. Rendered at /deals
 * and, inside Saver Option Business's navigation, at /business/software-deals (`base`).
 */
export async function DealsListing({ params, base }: { params: DealsParams; base: DealsBase }) {
  const href = (overrides: Parameters<typeof dealsHref>[1]) => dealsHref(params, overrides, base);
  const business = isBusinessDeals(base);
  const [result, categories, sponsored, withNoCard, withWorldwide, anyNoCard, anyWorldwide] = await Promise.all([
    queryOffers(params),
    getCategories(),
    params.q ? Promise.resolve([]) : getSponsoredOffers(params.category),
    queryOffers({ ...params, noCard: true }),
    queryOffers({ ...params, worldwide: true }),
    // Whole-catalog checks: a requirement filter only appears once some offer carries that data.
    queryOffers({ noCard: true }),
    queryOffers({ worldwide: true }),
  ]);

  // One labelled sponsored card leads the first page, only when it matches the current filters.
  const matching = new Set(result.offers.map((o) => o.id));
  const sponsoredSlot = params.page === 1 ? sponsored.filter((s) => matching.has(s.id)).slice(0, 1) : [];
  const organic = result.offers.filter((o) => !sponsoredSlot.some((s) => s.id === o.id));

  const pageCount = Math.max(1, Math.ceil(organic.length / PAGE_SIZE));
  const page = Math.min(params.page, pageCount);
  const visible = organic.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeCategory = categories.find((c) => c.slug === params.category);
  const activeCount = [params.category, params.type, params.price, params.noCard, params.worldwide].filter(Boolean).length;

  const chips = [
    params.q && { label: `“${params.q}”`, href: href({ q: undefined, page: undefined }) },
    activeCategory && { label: activeCategory.name, href: href({ category: undefined, page: undefined }) },
    params.type && { label: offerTypeLabels[params.type], href: href({ type: undefined, page: undefined }) },
    params.price && { label: priceFilterLabels[params.price], href: href({ price: undefined, page: undefined }) },
    params.noCard && { label: "No credit card", href: href({ noCard: undefined, page: undefined }) },
    params.worldwide && { label: "Worldwide", href: href({ worldwide: undefined, page: undefined }) },
  ].filter((c): c is { label: string; href: string } => Boolean(c));

  const heading = params.q ? `Results for “${params.q}”` : activeCategory ? activeCategory.name : "All software deals";

  return (
    <div className="theme-dark">
      <section className="hero-glow border-b border-line">
        <Container className="py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-xs text-faint">
            <Link href={business ? "/business" : "/"} className="-m-1 -my-2 inline-block px-1 py-2 hover:text-fg">
              {business ? "Saver Option Business" : "Home"}
            </Link>{" "}
            / <span className="text-muted">{business ? "Software deals" : "Deals"}</span>
          </nav>
          <h1 className="mt-4 text-[2.25rem] font-semibold leading-tight tracking-[-0.03em] text-heading sm:text-5xl">{heading}</h1>
          <p className="mt-3 max-w-2xl text-[16px] text-muted">
            Search by product, tool or keyword, then narrow by category, offer type and price.
          </p>
          <SearchBox
            action={base}
            size="md"
            defaultValue={params.q}
            className="mt-6 max-w-2xl"
            placeholder="Search deals"
            hidden={{
              category: params.category,
              type: params.type,
              price: params.price,
              nocard: params.noCard ? "1" : undefined,
              worldwide: params.worldwide ? "1" : undefined,
              sort: params.sort,
            }}
          />
        </Container>
      </section>

      <Container className="pb-24 pt-10">
        <DealsFilters
          base={base}
          q={params.q}
          category={params.category}
          type={params.type}
          price={params.price}
          sort={params.sort}
          noCard={params.noCard}
          worldwide={params.worldwide}
          requirementCounts={{ noCard: withNoCard.total, worldwide: withWorldwide.total }}
          requirementsAvailable={{ noCard: anyNoCard.total > 0 || Boolean(params.noCard), worldwide: anyWorldwide.total > 0 || Boolean(params.worldwide) }}
          activeCount={activeCount}
          resultCount={result.total}
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
                  className="inline-flex min-h-8 items-center gap-1 rounded-full border border-line-strong bg-surface py-1 pl-3 pr-2 text-xs text-fg hover:border-fg sm:min-h-0 sm:py-0.5 sm:pl-2.5 sm:pr-1.5"
                >
                  {chip.label}
                  <Icon name="x" size={12} className="text-faint" />
                  <span className="sr-only">Remove filter</span>
                </Link>
              ))}
              {chips.length > 1 && (
                <Link href={base} className="-my-2 py-2 text-xs font-medium text-accent-ink hover:underline">
                  Clear all
                </Link>
              )}
            </div>
          }
        >
          {visible.length > 0 || sponsoredSlot.length > 0 ? (
            <OfferGrid offers={[...sponsoredSlot, ...visible]} headingLevel="h2" withSidebar base={base} />
          ) : (
            <EmptyState hasFilters={hasActiveFilters(params)} categories={categories} base={base} />
          )}

          {pageCount > 1 && (
            <nav aria-label="Pagination" className="mt-10 flex items-center justify-between border-t border-line pt-6">
              {page > 1 ? (
                <Link href={href({ page: page - 1 })} className={buttonClass("secondary", "sm")}>
                  Previous
                </Link>
              ) : (
                <span />
              )}
              <span className="tabular text-sm text-muted">
                Page {page} of {pageCount}
              </span>
              {page < pageCount ? (
                <Link href={href({ page: page + 1 })} className={buttonClass("secondary", "sm")}>
                  Next
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </DealsFilters>
      </Container>
    </div>
  );
}

function EmptyState({ hasFilters, categories, base }: { hasFilters: boolean; categories: Awaited<ReturnType<typeof getCategories>>; base: DealsBase }) {
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
        <Link href={base} className={buttonClass("secondary", "sm", "mt-5")}>
          Clear search and filters
        </Link>
      )}
      <CategoryChips categories={categories.filter((c) => c.count > 0).slice(0, 6)} className="mt-8 justify-center" base={base} />
    </div>
  );
}
