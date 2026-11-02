import Link from "next/link";
import { DealCard, DealsDisclosure } from "@/components/business/deals/deal-card";
import { SoftwareLogo } from "@/components/business/software-logo";
import { FilterBar } from "@/components/business/filter-bar";
import { LogoStack } from "@/components/business/software-logo";
import { SummaryStrip } from "@/components/business/summary-strip";
import { Card, EmptyState, LinkButton, PageHeader, Pagination, Pill } from "@/components/business/ui";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/components/ui/primitives";
import { can } from "@/lib/business/permissions";
import { requireBizContext } from "@/lib/server/business/context";
import { dealCatalogStats, dealCategoryOptions, dealsForWorkspace, DEAL_OFFER_TYPES, DealsInputError, searchDeals, type DealSearchResult } from "@/lib/server/business/deals";
import { offerTypeLabels } from "@/lib/labels";

export const metadata = { title: "Deals for your stack" };

type Raw = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (typeof v === "string" ? v.trim() : Array.isArray(v) ? (v[0] ?? "").trim() : "");
const PER_PAGE = 12;

export default async function BusinessDealsPage(props: { searchParams: Promise<Raw> }) {
  const ctx = await requireBizContext("/business/deals");
  const sp = await props.searchParams;
  const q = one(sp.q).slice(0, 100);
  const category = one(sp.category);
  const type = one(sp.type);
  const pageRaw = Number(one(sp.page));
  const page = Number.isInteger(pageRaw) && pageRaw >= 1 ? pageRaw : 1;

  const [stack, options, stats] = await Promise.all([dealsForWorkspace(ctx), dealCategoryOptions(), dealCatalogStats()]);
  // The catalog always shows listings: everything, or what the search and filters narrow it to.
  let results: DealSearchResult | null = null;
  let searchError: string | null = null;
  try {
    results = await searchDeals({ query: q, category: category || undefined, offerType: type || undefined, limit: PER_PAGE, offset: (page - 1) * PER_PAGE });
  } catch (e) {
    if (!(e instanceof DealsInputError)) throw e;
    searchError = e.message;
  }
  const pageCount = results ? Math.max(1, Math.ceil(results.total / PER_PAGE)) : 1;
  const catalogHref = (patch: Record<string, string | null>) => {
    const u = new URLSearchParams();
    const merged: Record<string, string | null> = { q: q || null, category: category || null, type: type || null, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) u.set(k, v);
    const qs = u.toString();
    return `/business/deals${qs ? `?${qs}` : ""}#catalog`;
  };
  const toolCount = stack.matched.length + stack.unmatched.length;
  const canAdd = can(ctx.role, "records.manage");
  const matchedDeals = stack.matched.reduce((n, m) => n + m.deals.length, 0);
  const relatedDeals = stack.related.reduce((n, r) => n + r.deals.length, 0);
  const verifiedForYou = [...stack.matched.flatMap((m) => m.deals), ...stack.related.flatMap((r) => r.deals)].filter((d) => d.verification.status === "verified").length;
  const categoryName = [...options.catalog, ...options.business].find((c) => c.value === category)?.label ?? null;

  return (
    <>
      <PageHeader
        exportAs={{ title: "Deals", workspace: ctx.workspace.name, save: false }}
        title="Deals for your stack"
        crumbs={[{ label: "Overview", href: "/business/dashboard" }, { label: "Deals" }]}
        description="Discounts, credits and free plans for the software your team pays for, and for tools that do the same job. Terms, prices and end dates are only what each listing states."
      />

      {toolCount > 0 && (
        <SummaryStrip
          label="Deals summary"
          figure={{
            label: "Deals for your stack",
            value: matchedDeals + relatedDeals,
            sub: `from ${stats.total} live listings in the catalog`,
          }}
          counts={[
            { value: matchedDeals, label: "for tools you use", tone: "accent", hideZero: true },
            { value: relatedDeals, label: "alternatives", hideZero: true },
            { value: verifiedForYou, label: "verified", hideZero: true },
          ]}
          aside={stack.matched.length > 0 && <LogoStack items={stack.matched.map((m) => ({ name: m.tool.name, src: m.tool.logoSrc }))} max={6} size={28} />}
        />
      )}

      {toolCount === 0 ? (
        <Card>
          <EmptyState
            icon="tag"
            title="Add your software to see deals for it"
            action={
              canAdd ? (
                <LinkButton href="/business/subscriptions/new" variant="primary" icon="plus" size="md">
                  Add software
                </LinkButton>
              ) : undefined
            }
          >
            Deals are matched to the tools in your inventory. Meanwhile, the whole catalog is below.
          </EmptyState>
        </Card>
      ) : (
        <>
          <section aria-labelledby="matched-heading" data-deals-matched>
            <SectionTitle id="matched-heading" title="For tools you already use" note={matchedDeals ? `${matchedDeals} deal${matchedDeals === 1 ? "" : "s"} on what your team already pays for` : undefined} />
            {stack.matched.length === 0 ? (
              <Card>
                <p className="text-[13.5px] text-muted">No listing in the catalog matches the exact products in your workspace right now. Alternatives and the full catalog are below.</p>
              </Card>
            ) : (
              <div className="space-y-6">
                {stack.matched.map(({ tool, deals }) => (
                  <div key={tool.softwareId}>
                    <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
                      <SoftwareLogo name={tool.name} src={tool.logoSrc} size={30} />
                      <Link href={`/business/software/${tool.softwareId}`} className="text-[14.5px] font-semibold text-fg hover:underline">
                        {tool.name}
                      </Link>
                      <span className="text-[12.5px] text-faint">
                        {tool.categoryLabel} · {deals.length} deal{deals.length === 1 ? "" : "s"}
                      </span>
                    </div>
                    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {deals.map((d) => (
                        <DealCard key={d.id} d={d} reason={d.matchReason} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
            {stack.unmatched.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-1.5 text-[12.5px]" data-deals-unmatched>
                <span className="text-faint">No listing yet for</span>
                {stack.unmatched.slice(0, 8).map(({ tool, reason }) => (
                  <Link
                    key={tool.softwareId}
                    href={`/business/software/${tool.softwareId}`}
                    title={reason}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface py-0.5 pl-0.5 pr-2.5 text-fg hover:border-line-strong"
                  >
                    <SoftwareLogo name={tool.name} src={tool.logoSrc} size={20} className="rounded-full" />
                    {tool.name}
                  </Link>
                ))}
                {stack.unmatched.length > 8 && <span className="text-faint">+{stack.unmatched.length - 8} more</span>}
              </div>
            )}
          </section>

          {stack.related.length > 0 && (
            <section aria-labelledby="related-heading" className="mt-10" data-deals-related>
              <SectionTitle
                id="related-heading"
                title="Alternatives for what you use"
                note="Other products in the same category. Not like-for-like: compare features, migration effort and your notice period first."
              />
              <div className="space-y-6">
                {stack.related.map((r) => (
                  <div key={r.category}>
                    <p className="mb-2.5 flex flex-wrap items-center gap-2 text-[13px]">
                      <Pill tone="outline">{r.categoryLabel}</Pill>
                      <span className="text-faint">instead of {r.tools.join(", ")}</span>
                    </p>
                    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      {r.deals.map((d) => (
                        <DealCard key={d.id} d={d} reason={d.matchReason} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* The whole catalog, always showing listings: categories as chips, then search and type. */}
      <section id="catalog" aria-labelledby="catalog-heading" className="mt-10 scroll-mt-20" data-deals-catalog>
        <SectionTitle id="catalog-heading" title="Browse the catalog" note={`${stats.total} live listings · ${stats.verified} verified`} />
        <nav aria-label="Deal categories" className="-mx-4 mb-3 overflow-x-auto px-4 sm:mx-0 sm:px-0" data-export-hide>
          <ul className="flex w-max gap-1.5 pb-1 sm:w-auto sm:flex-wrap">
            <li>
              <CategoryChip href={catalogHref({ category: null, page: null })} active={!category} label="All" count={stats.total} />
            </li>
            {stats.byCategory.map((c) => (
              <li key={c.value}>
                <CategoryChip href={catalogHref({ category: c.value, page: null })} active={category === c.value} label={c.label} count={c.count} />
              </li>
            ))}
          </ul>
        </nav>
        <FilterBar
          action="/business/deals"
          label="Search the deals catalog"
          keep={{ category: category || null }}
          search={{ value: q, placeholder: "Search deals: hosting credits, CRM, Figma…" }}
          inline={[{ name: "type", label: "Offer", value: type || null, allLabel: "Any", options: DEAL_OFFER_TYPES.map((t) => ({ value: t, label: offerTypeLabels[t] })) }]}
        />
        {searchError ? (
          <p className="text-[13px] text-danger">{searchError}</p>
        ) : results && results.total === 0 ? (
          <Card>
            <EmptyState icon="search" title="No live listing matches" action={<LinkButton href={catalogHref({ q: null, type: null, category: null, page: null })}>Show all deals</LinkButton>}>
              Try fewer words, another category or any offer type.
            </EmptyState>
          </Card>
        ) : (
          results && (
            <>
              <p className="mb-3 text-[12.5px] text-faint" aria-live="polite">
                {results.total} listing{results.total === 1 ? "" : "s"}
                {categoryName ? ` in ${categoryName}` : ""}
                {q ? ` for “${q}”` : ""}
                {pageCount > 1 ? ` · page ${Math.min(page, pageCount)} of ${pageCount}` : ""}
              </p>
              <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {results.deals.map((d) => (
                  <DealCard key={d.id} d={d} />
                ))}
              </ul>
              <Pagination page={Math.min(page, pageCount)} pageCount={pageCount} href={(p) => catalogHref({ page: p > 1 ? String(p) : null })} />
            </>
          )
        )}
      </section>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        <DealsDisclosure />
        <Link href="/business/software-deals" className="text-[12.5px] font-medium text-accent-ink hover:underline">
          Open the deals site <Icon name="arrow-up-right" size={12} className="inline" />
        </Link>
      </div>
    </>
  );
}

function SectionTitle({ id, title, note }: { id: string; title: string; note?: string }) {
  return (
    <div className="mb-3.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <h2 id={id} className="text-[17px] font-semibold tracking-tight text-heading">
        {title}
      </h2>
      {note && <p className="max-w-2xl text-[12.5px] text-faint">{note}</p>}
    </div>
  );
}

function CategoryChip({ href, active, label, count }: { href: string; active: boolean; label: string; count: number }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 text-[12.5px] font-medium transition-colors",
        active ? "border-accent bg-accent text-white" : "border-line bg-surface text-fg hover:border-accent/40",
      )}
    >
      {label}
      <span className={cn("tabular text-[11.5px]", active ? "text-white/80" : "text-faint")}>{count}</span>
    </Link>
  );
}
