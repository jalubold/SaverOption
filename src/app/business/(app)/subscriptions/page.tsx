import Link from "next/link";
import { LogoStack } from "@/components/business/software-logo";
import { SummaryStrip, StripStat } from "@/components/business/summary-strip";
import { SubscriptionTable, type SubscriptionRowView } from "@/components/business/subscription-table";
import { Card, EmptyState, LinkButton, Money, PageHeader, Pagination, Tabs } from "@/components/business/ui";
import { buttonClass } from "@/components/ui/primitives";
import { daysBetween, formatIsoDate, formatMoney, isRecurring, monthlyEquivalent, periodSuffix, seatSummary, summarizeSpend } from "@/lib/business/calc";
import { billingIntervalLabels, BILLING_INTERVALS, categoryLabels, SOFTWARE_CATEGORIES, SUBSCRIPTION_STATUSES, subscriptionStatusLabels } from "@/lib/business/constants";
import { can } from "@/lib/business/permissions";
import { requireBizContext } from "@/lib/server/business/context";
import { getDepartments, getPeople, getSubscriptions, getVendors } from "@/lib/server/business/data";
import { applySubscriptionFilters, filtersQuery, hasActiveFilters, parseSubscriptionFilters, type SubscriptionFilters } from "@/lib/server/business/subscription-filters";

export const metadata = { title: "Subscriptions" };

const PAGE_SIZE = 25;

export default async function SubscriptionsPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const ctx = await requireBizContext("/business/subscriptions");
  const f = parseSubscriptionFilters(await props.searchParams);
  const ws = ctx.workspace.id;
  const [all, vendors, departments, people] = await Promise.all([getSubscriptions(ws), getVendors(ws), getDepartments(ws), getPeople(ws)]);
  const fmt = ctx.workspace.dateFormat;
  const canManage = can(ctx.role, "records.manage");

  const rows = applySubscriptionFilters(all, f, ctx.today);
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const page = Math.min(f.page, pageCount);
  const shown = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const summary = summarizeSpend(rows, ctx.today);
  const currencies = [...new Set(all.map((s) => s.currency))].sort();
  const payments = [...new Set(all.map((s) => s.paymentMethod).filter((p): p is string => Boolean(p)))].sort();

  const views: SubscriptionRowView[] = shown.map((s) => {
    const m = monthlyEquivalent(s);
    const seats = seatSummary(s);
    return {
      id: s.id,
      softwareId: s.softwareId,
      softwareName: s.softwareName,
      logoSrc: s.logoSrc,
      planName: s.planName,
      vendorName: s.vendorName,
      categoryLabel: categoryLabels[s.category],
      status: s.status,
      statusLabel: subscriptionStatusLabels[s.status],
      archived: s.archived,
      price: s.priceMinor !== null ? `${formatMoney(s.priceMinor, s.currency)}${periodSuffix(s)}` : null,
      monthly: m !== null ? formatMoney(Math.round(m), s.currency) : null,
      renewal: s.nextRenewalDate ? formatIsoDate(s.nextRenewalDate, fmt) : null,
      renewalDays: s.nextRenewalDate && !s.archived && (s.status === "active" || s.status === "trial") ? daysBetween(ctx.today, s.nextRenewalDate) : null,
      autoRenew: s.autoRenew,
      seats: seats.purchased !== null ? `${seats.assigned} / ${seats.purchased}` : seats.assigned > 0 ? String(seats.assigned) : null,
      owner: s.ownerName,
      department: s.departmentName,
    };
  });

  const count = (status: SubscriptionFilters["status"]) => all.filter((s) => (status === "archived" ? s.archived : !s.archived && (!status || s.status === status))).length;
  const tab = (label: string, status: SubscriptionFilters["status"]) => ({
    label,
    href: `/business/subscriptions${filtersQuery(f, { status, page: null })}`,
    active: f.status === status,
    count: count(status),
  });

  // The tools in this view, highest monthly cost first (default currency first, as currencies aren't compared).
  const pref = ctx.workspace.defaultCurrency;
  const tools = new Map<string, { name: string; src: string | null; rank: [number, number] }>();
  for (const s of rows) {
    const m = isRecurring(s) ? (monthlyEquivalent(s) ?? 0) : 0;
    const rank: [number, number] = [s.currency === pref ? 0 : 1, -m];
    const prev = tools.get(s.softwareId);
    if (!prev || rank[0] < prev.rank[0] || (rank[0] === prev.rank[0] && rank[1] < prev.rank[1])) tools.set(s.softwareId, { name: s.softwareName, src: s.logoSrc, rank });
  }
  const topTools = [...tools.values()].sort((a, b) => a.rank[0] - b.rank[0] || a.rank[1] - b.rank[1] || a.name.localeCompare(b.name));

  const filtered = hasActiveFilters(f);
  const withoutStatus = hasActiveFilters({ ...f, status: null });

  return (
    <>
      <PageHeader
        title="Subscriptions"
        description="Every paid plan your company tracks, with its price, renewal and seats."
        crumbs={[{ label: "Overview", href: "/business/dashboard" }, { label: "Subscriptions" }]}
        actions={
          <>
            {can(ctx.role, "data.export") && all.length > 0 && (
              <a href={`/business/subscriptions/export${filtersQuery(f, { page: null })}`} className={buttonClass("secondary", "sm")} download>
                Export CSV
              </a>
            )}
            {canManage && (
              <LinkButton href="/business/subscriptions/new" variant="primary" icon="plus">
                Add software
              </LinkButton>
            )}
          </>
        }
      />

      {all.length === 0 ? (
        <Card>
          <EmptyState
            icon="layers"
            title="No subscriptions yet"
            action={
              canManage ? (
                <LinkButton href="/business/subscriptions/new" variant="primary" size="md" icon="plus">
                  Add your first subscription
                </LinkButton>
              ) : undefined
            }
          >
            Add the tools your company pays for — price, billing interval and renewal date — and they&apos;ll appear here, on the dashboard and in reports.
          </EmptyState>
        </Card>
      ) : (
        <>
          <Tabs
            items={[
              tab("All", null),
              ...SUBSCRIPTION_STATUSES.map((s) => tab(subscriptionStatusLabels[s], s)).filter((t) => t.count > 0 || t.active),
              tab("Archived", "archived"),
            ]}
          />

          <form method="get" className="mb-4 flex flex-wrap items-end gap-2" role="search" aria-label="Filter subscriptions">
            {f.status && <input type="hidden" name="status" value={f.status} />}
            <label className="text-[12px] text-muted">
              <span className="block">Search</span>
              <input
                type="search"
                name="q"
                defaultValue={f.q}
                placeholder="Software, plan or vendor"
                className="mt-1 h-9 w-56 rounded-[9px] border border-line-strong bg-surface px-3 text-[13.5px] outline-none focus:border-accent focus:ring-4 focus:ring-accent/15"
              />
            </label>
            <FilterSelect label="Vendor" name="vendor" value={f.vendor} options={[...vendors.map((v) => ({ value: v.id, label: v.name })), { value: "none", label: "No vendor" }]} />
            <FilterSelect label="Category" name="category" value={f.category} options={SOFTWARE_CATEGORIES.map((c) => ({ value: c, label: categoryLabels[c] }))} />
            <FilterSelect label="Billing" name="interval" value={f.interval} options={BILLING_INTERVALS.map((b) => ({ value: b, label: billingIntervalLabels[b] }))} />
            <FilterSelect label="Department" name="department" value={f.department} options={[...departments.map((d) => ({ value: d.id, label: d.archivedAt ? `${d.name} (archived)` : d.name })), { value: "none", label: "No department" }]} />
            <FilterSelect label="Owner" name="owner" value={f.owner} options={[...people.map((p) => ({ value: p.id, label: p.name })), { value: "none", label: "No owner" }]} />
            <FilterSelect
              label="Renewal"
              name="renewal"
              value={f.renewal}
              options={[
                { value: "next30", label: "Next 30 days" },
                { value: "next90", label: "Next 90 days" },
                { value: "overdue", label: "Date has passed" },
                { value: "none", label: "No renewal date" },
              ]}
            />
            {currencies.length > 1 && <FilterSelect label="Currency" name="currency" value={f.currency} options={currencies.map((c) => ({ value: c, label: c }))} />}
            {payments.length > 0 && <FilterSelect label="Payment method" name="payment" value={f.payment} options={[...payments.map((p) => ({ value: p, label: p })), { value: "none", label: "Not recorded" }]} />}
            <label className="text-[12px] text-muted">
              <span className="block">Sort</span>
              <select name="sort" defaultValue={f.sort} className="biz-select mt-1">
                <option value="name">Name</option>
                <option value="cost">Highest cost</option>
                <option value="renewal">Next renewal</option>
                <option value="newest">Newest</option>
              </select>
            </label>
            <button type="submit" className={buttonClass("secondary", "sm", "h-9")}>
              Apply
            </button>
            {withoutStatus && (
              <Link href={`/business/subscriptions${f.status ? `?status=${f.status}` : ""}`} className="self-center text-[13px] text-accent-ink underline underline-offset-2">
                Clear filters
              </Link>
            )}
          </form>

          {rows.length > 0 && f.status !== "archived" && (
            <SummaryStrip
              label="Summary of this view"
              aside={
                topTools.length > 0 && (
                  <>
                    <LogoStack items={topTools} max={6} size={28} />
                    <span className="text-[12px] text-faint">
                      {topTools.length} tool{topTools.length === 1 ? "" : "s"}
                    </span>
                  </>
                )
              }
            >
              <StripStat label="Active" value={summary.activeCount} sub={summary.trialCount ? `+ ${summary.trialCount} in trial` : undefined} />
              <StripStat label="Monthly equivalent" value={<Money totals={summary.monthly} preferred={pref} />} sub="Active, priced plans" />
              <StripStat label="Annualized" value={<Money totals={summary.annualized} preferred={pref} />} sub="Run-rate × 12" />
              <StripStat label="Renewing in 30 days" value={summary.upcomingRenewals} tone={summary.upcomingRenewals > 0 ? "accent" : undefined} />
            </SummaryStrip>
          )}

          <Card bodyClassName="px-4 pb-3 pt-0 sm:px-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2 py-3 text-[13px] text-muted">
              <span>
                {rows.length} subscription{rows.length === 1 ? "" : "s"}
              </span>
              {summary.missingPrice > 0 && f.status !== "archived" && <span className="text-[12px] text-faint">{summary.missingPrice} active without a price aren&apos;t in the totals</span>}
            </div>
            {rows.length === 0 ? (
              <EmptyState icon="search" title={filtered ? "No subscriptions match" : "Nothing here"}>
                {filtered ? "Try removing a filter or searching for something else." : "There are no subscriptions in this view."}
              </EmptyState>
            ) : (
              <>
                <SubscriptionTable
                  rows={views}
                  workspaceId={ws}
                  canBulkAssign={canManage}
                  canArchive={canManage}
                  archivedView={f.status === "archived"}
                  departments={departments.filter((d) => !d.archivedAt).map((d) => ({ id: d.id, name: d.name }))}
                  people={people.filter((p) => p.status === "active").map((p) => ({ id: p.id, name: p.name }))}
                />
                <Pagination page={page} pageCount={pageCount} href={(p) => `/business/subscriptions${filtersQuery(f, { page: p })}`} />
              </>
            )}
          </Card>
        </>
      )}
    </>
  );
}

function FilterSelect({ label, name, value, options }: { label: string; name: string; value: string | null; options: { value: string; label: string }[] }) {
  return (
    <label className="text-[12px] text-muted">
      <span className="block">{label}</span>
      <select name={name} defaultValue={value ?? ""} className="biz-select mt-1 max-w-48">
        <option value="">All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
