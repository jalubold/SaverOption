import Link from "next/link";
import { DealCard, DealsDisclosure } from "@/components/business/deals/deal-card";
import { SoftwareLogo } from "@/components/business/software-logo";
import { Card, EmptyState, LinkButton, PageHeader, Pagination, Pill } from "@/components/business/ui";
import { Icon } from "@/components/ui/icon";
import { can } from "@/lib/business/permissions";
import { requireBizContext } from "@/lib/server/business/context";
import { dealCategoryOptions, dealsForWorkspace, DEAL_OFFER_TYPES, DealsInputError, searchDeals, type DealSearchResult } from "@/lib/server/business/deals";
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
  const searching = Boolean(q || category || type);

  const [stack, options] = await Promise.all([dealsForWorkspace(ctx), dealCategoryOptions()]);
  let results: DealSearchResult | null = null;
  let searchError: string | null = null;
  if (searching) {
    try {
      results = await searchDeals({ query: q, category: category || undefined, offerType: type || undefined, limit: PER_PAGE, offset: (page - 1) * PER_PAGE });
    } catch (e) {
      if (!(e instanceof DealsInputError)) throw e;
      searchError = e.message;
    }
  }
  const pageCount = results ? Math.max(1, Math.ceil(results.total / PER_PAGE)) : 1;
  const searchHref = (p: number) => {
    const u = new URLSearchParams();
    if (q) u.set("q", q);
    if (category) u.set("category", category);
    if (type) u.set("type", type);
    if (p > 1) u.set("page", String(p));
    return `/business/deals?${u.toString()}#search`;
  };
  const toolCount = stack.matched.length + stack.unmatched.length;
  const canAdd = can(ctx.role, "records.manage");

  return (
    <>
      <PageHeader
        title="Deals for your stack"
        crumbs={[{ label: "Overview", href: "/business/dashboard" }, { label: "Deals for your stack" }]}
        description="Live listings from the Saver Option deals catalog that match the software your workspace records — first for the same products, then for other products that do the same job. Terms, prices and end dates are shown only as each listing states them."
        actions={
          <LinkButton href="/business/software-deals" icon="tag">
            Browse all deals
          </LinkButton>
        }
      />

      {toolCount === 0 ? (
        <Card>
          <EmptyState
            icon="tag"
            title="Add your software to see matching deals"
            action={
              canAdd ? (
                <LinkButton href="/business/subscriptions/new" variant="primary" icon="plus" size="md">
                  Add software
                </LinkButton>
              ) : undefined
            }
          >
            Deals are matched to the tools in your inventory. You can still search the whole catalog below.
          </EmptyState>
        </Card>
      ) : (
        <>
          <section aria-labelledby="matched-heading">
            <h2 id="matched-heading" className="mb-3 text-[15px] font-semibold text-fg">
              For tools you already use
            </h2>
            {stack.matched.length === 0 ? (
              <Card>
                <p className="text-[13.5px] text-muted">No listing in the catalog matches the exact products in your workspace right now.</p>
              </Card>
            ) : (
              <div className="space-y-5">
                {stack.matched.map(({ tool, deals }) => (
                  <div key={tool.softwareId}>
                    <div className="mb-2 flex flex-wrap items-center gap-2.5">
                      <SoftwareLogo name={tool.name} src={tool.logoSrc} size={28} />
                      <Link href={`/business/software/${tool.softwareId}`} className="text-[14px] font-semibold text-fg hover:underline">
                        {tool.name}
                      </Link>
                      <span className="text-[12.5px] text-faint">
                        {tool.categoryLabel} · {tool.subscriptionIds.length ? `${tool.subscriptionIds.length} live subscription${tool.subscriptionIds.length === 1 ? "" : "s"}` : "no paid subscription recorded"}
                      </span>
                    </div>
                    <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {deals.map((d) => (
                        <DealCard key={d.id} d={d} reason={d.matchReason} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {stack.unmatched.length > 0 && (
              <Card className="mt-5" title="No matching offer listed" description="Tools in your workspace without a business-relevant listing in the catalog right now.">
                <ul className="divide-y divide-line">
                  {stack.unmatched.map(({ tool, reason }) => (
                    <li key={tool.softwareId} className="flex items-start gap-3 py-2.5">
                      <SoftwareLogo name={tool.name} src={tool.logoSrc} size={26} />
                      <span className="min-w-0">
                        <Link href={`/business/software/${tool.softwareId}`} className="block text-[13.5px] font-medium text-fg hover:underline">
                          {tool.name}
                        </Link>
                        <span className="block text-[12.5px] text-muted">{reason}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </section>

          {stack.related.length > 0 && (
            <section aria-labelledby="related-heading" className="mt-8">
              <h2 id="related-heading" className="text-[15px] font-semibold text-fg">
                Same kind of tool — possible alternatives
              </h2>
              <p className="mb-3 mt-1 max-w-3xl text-[13px] text-muted">
                Listings for other products in the same category, matched by the catalog&apos;s product tags. They aren&apos;t like-for-like replacements: compare
                features, migration effort and your contract&apos;s notice period first.
              </p>
              <div className="space-y-5">
                {stack.related.map((r) => (
                  <div key={r.category}>
                    <p className="mb-2 flex flex-wrap items-center gap-2 text-[13px]">
                      <Pill tone="outline">{r.categoryLabel}</Pill>
                      <span className="text-faint">You use {r.tools.join(", ")}</span>
                    </p>
                    <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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

      <section id="search" aria-labelledby="search-heading" className="mt-8 scroll-mt-20">
        <Card title={<span id="search-heading">Search the deals catalog</span>} description="Every live listing on Saver Option Deals, with the same search as /deals.">
          <form method="get" action="/business/deals#search" role="search" className="flex flex-wrap items-end gap-2">
            <label className="min-w-0 flex-1 basis-56 text-[12.5px] text-muted">
              <span className="mb-1 block">Search</span>
              <span className="relative block">
                <Icon name="search" size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-faint" />
                <input name="q" type="search" defaultValue={q} placeholder="e.g. hosting credits, CRM, Figma" className="biz-select w-full bg-none pl-8" />
              </span>
            </label>
            <label className="text-[12.5px] text-muted">
              <span className="mb-1 block">Category</span>
              <select name="category" defaultValue={category} className="biz-select max-w-[14rem]">
                <option value="">Any category</option>
                <optgroup label="Deals categories">
                  {options.catalog.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Kind of software">
                  {options.business.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </optgroup>
              </select>
            </label>
            <label className="text-[12.5px] text-muted">
              <span className="mb-1 block">Offer type</span>
              <select name="type" defaultValue={type} className="biz-select">
                <option value="">Any type</option>
                {DEAL_OFFER_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {offerTypeLabels[t]}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="btn btn-secondary h-9 rounded-[9px] px-3 text-[13px]">
              Search
            </button>
            {searching && (
              <Link href="/business/deals#search" className="h-9 px-2 text-[13px] leading-9 text-muted hover:text-fg">
                Clear
              </Link>
            )}
          </form>

          {searchError && <p className="mt-4 text-[13px] text-danger">{searchError}</p>}
          {results && (
            <div className="mt-5">
              <p className="mb-3 text-[12.5px] text-faint" aria-live="polite">
                {results.total === 0 ? "No live listing matches this search." : `${results.total} live listing${results.total === 1 ? "" : "s"}`}
              </p>
              {results.deals.length > 0 && (
                <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {results.deals.map((d) => (
                    <DealCard key={d.id} d={d} />
                  ))}
                </ul>
              )}
              <Pagination page={Math.min(page, pageCount)} pageCount={pageCount} href={searchHref} />
            </div>
          )}
        </Card>
      </section>

      <div className="mt-6">
        <DealsDisclosure />
      </div>
    </>
  );
}
