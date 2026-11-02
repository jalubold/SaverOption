import { LogoStack } from "@/components/business/software-logo";
import { SummaryStrip } from "@/components/business/summary-strip";
import { SubscriptionTable, type SubscriptionRowView } from "@/components/business/subscription-table";
import { cookies } from "next/headers";
import { FilterBar } from "@/components/business/filter-bar";
import { ViewToggle } from "@/components/business/view-toggle";
import { Card, EmptyState, FxNoteLine, LinkButton, Money, PageHeader, Pagination, Tabs } from "@/components/business/ui";
import { daysBetween, formatIsoDate, formatMoney, isRecurring, monthlyEquivalent, periodSuffix, seatSummary, summarizeSpend } from "@/lib/business/calc";
import { billingIntervalLabels, BILLING_INTERVALS, categoryLabels, SOFTWARE_CATEGORIES, SUBSCRIPTION_STATUSES, subscriptionStatusLabels } from "@/lib/business/constants";
import { pickView, viewCookie } from "@/lib/business/list-view";
import { can } from "@/lib/business/permissions";
import { requireBizContext } from "@/lib/server/business/context";
import { getDepartments, getPeople, getSubscriptions, getVendors } from "@/lib/server/business/data";
import { SUB_MONEY, workspaceDisplay } from "@/lib/server/business/display-currency";
import { applySubscriptionFilters, filtersQuery, hasActiveFilters, parseSubscriptionFilters, type SubscriptionFilters } from "@/lib/server/business/subscription-filters";

export const metadata = { title: "Subscriptions" };

const PAGE_SIZE = 25;

export default async function SubscriptionsPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const ctx = await requireBizContext("/business/subscriptions");
  const sp = await props.searchParams;
  const f = parseSubscriptionFilters(sp);
  // List or cards: the URL can ask for one; otherwise the person's last choice (a cookie); otherwise the list.
  const view = pickView(sp.view, (await cookies()).get(viewCookie("subscriptions"))?.value);
  const ws = ctx.workspace.id;
  const [billedAll, vendors, departments, people, display] = await Promise.all([getSubscriptions(ws), getVendors(ws), getDepartments(ws), getPeople(ws), workspaceDisplay(ctx)]);
  // Shown in the workspace currency (ECB rate); filters and the currency list use the currency each is billed in.
  const all = display.rows(billedAll, SUB_MONEY);
  const fmt = ctx.workspace.dateFormat;
  const canManage = can(ctx.role, "records.manage");

  const rows = applySubscriptionFilters(all, f, ctx.today);
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const page = Math.min(f.page, pageCount);
  const shown = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const summary = summarizeSpend(rows, ctx.today);
  const currencies = [...new Set(billedAll.map((s) => s.currency))].sort();
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
      billed: s.original && s.original.values.priceMinor != null ? `${formatMoney(s.original.values.priceMinor, s.original.currency)}${periodSuffix(s)}` : null,
      monthly: m !== null ? formatMoney(Math.round(m), s.currency) : null,
      renewal: s.nextRenewalDate ? formatIsoDate(s.nextRenewalDate, fmt) : null,
      renewalDays: s.nextRenewalDate && !s.archived && (s.status === "active" || s.status === "trial") ? daysBetween(ctx.today, s.nextRenewalDate) : null,
      autoRenew: s.autoRenew,
      seats: seats.purchased !== null ? `${seats.assigned} / ${seats.purchased}` : seats.assigned > 0 ? String(seats.assigned) : null,
      interval: s.billingInterval,
      seatsUsed: seats.assigned,
      seatsTotal: seats.purchased,
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
  // What the converted part of the totals is billed as, for the note under them.
  const fxNote = display.note();
  const tools = new Map<string, { name: string; src: string | null; rank: [number, number] }>();
  for (const s of rows) {
    const m = isRecurring(s) ? (monthlyEquivalent(s) ?? 0) : 0;
    const rank: [number, number] = [s.currency === pref ? 0 : 1, -m];
    const prev = tools.get(s.softwareId);
    if (!prev || rank[0] < prev.rank[0] || (rank[0] === prev.rank[0] && rank[1] < prev.rank[1])) tools.set(s.softwareId, { name: s.softwareName, src: s.logoSrc, rank });
  }
  const topTools = [...tools.values()].sort((a, b) => a.rank[0] - b.rank[0] || a.rank[1] - b.rank[1] || a.name.localeCompare(b.name));

  const filtered = hasActiveFilters(f);

  return (
    <>
      <PageHeader
        exportAs={{ title: "Subscriptions", workspace: ctx.workspace.name }}
        title="Subscriptions"
        description={
          <>
            Every paid plan your company tracks, with its price, renewal and seats.
            <FxNoteLine note={fxNote} dateFormat={fmt} className="mt-1.5" />
          </>
        }
        crumbs={[{ label: "Overview", href: "/business/dashboard" }, { label: "Subscriptions" }]}
        primary={
          canManage ? (
            <LinkButton href="/business/subscriptions/new" variant="primary" icon="plus">
              Add software
            </LinkButton>
          ) : undefined
        }
        more={[
          ...(can(ctx.role, "data.export") && all.length > 0 ? [{ label: "Export CSV", href: `/business/subscriptions/export${filtersQuery(f, { page: null })}`, icon: "download" as const, download: true }] : []),
          ...(canManage ? [{ label: "Import CSV", href: "/business/subscriptions/import", icon: "file" as const }] : []),
        ]}
      />

      {all.length === 0 ? (
        <Card>
          <EmptyState
            icon="layers"
            title="No subscriptions yet"
            action={
              canManage ? (
                <div className="flex flex-wrap justify-center gap-2">
                  <LinkButton href="/business/subscriptions/new" variant="primary" size="md" icon="plus">
                    Add your first subscription
                  </LinkButton>
                  <LinkButton href="/business/subscriptions/import" size="md" icon="download">
                    Import from CSV
                  </LinkButton>
                </div>
              ) : undefined
            }
          >
            Add the tools your company pays for — price, billing interval and renewal date — and they&apos;ll appear here, on the dashboard and in reports. Already tracking them in a spreadsheet? Import it as CSV.
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

          <FilterBar
            action="/business/subscriptions"
            label="Filter subscriptions"
            trailing={<ViewToggle name="subscriptions" value={view} />}
            keep={{ status: f.status }}
            search={{ value: f.q, placeholder: "Search software, plan or vendor" }}
            inline={[
              {
                name: "sort",
                label: "Sort",
                value: f.sort,
                options: [
                  { value: "name", label: "Name" },
                  { value: "cost", label: "Highest cost" },
                  { value: "renewal", label: "Next renewal" },
                  { value: "newest", label: "Newest" },
                ],
              },
            ]}
            more={[
              { name: "renewal", label: "Renewal", value: f.renewal, allLabel: "Any time", options: [
                { value: "next30", label: "Next 30 days" },
                { value: "next90", label: "Next 90 days" },
                { value: "overdue", label: "Date has passed" },
                { value: "none", label: "No renewal date" },
              ] },
              { name: "category", label: "Category", value: f.category, allLabel: "All categories", options: SOFTWARE_CATEGORIES.map((c) => ({ value: c, label: categoryLabels[c] })) },
              { name: "vendor", label: "Vendor", value: f.vendor, allLabel: "All vendors", options: [...vendors.map((v) => ({ value: v.id, label: v.name })), { value: "none", label: "No vendor" }] },
              { name: "interval", label: "Billing", value: f.interval, allLabel: "Any billing", options: BILLING_INTERVALS.map((b) => ({ value: b, label: billingIntervalLabels[b] })) },
              { name: "department", label: "Department", value: f.department, allLabel: "All departments", options: [...departments.map((d) => ({ value: d.id, label: d.archivedAt ? `${d.name} (archived)` : d.name })), { value: "none", label: "No department" }] },
              { name: "owner", label: "Owner", value: f.owner, allLabel: "Anyone", options: [...people.map((p) => ({ value: p.id, label: p.name })), { value: "none", label: "No owner" }] },
              ...(currencies.length > 1 ? [{ name: "currency", label: "Billed in", value: f.currency, allLabel: "Any currency", options: currencies.map((c) => ({ value: c, label: c })) }] : []),
              ...(payments.length > 0 ? [{ name: "payment", label: "Payment method", value: f.payment, allLabel: "Any method", options: [...payments.map((p) => ({ value: p, label: p })), { value: "none", label: "Not recorded" }] }] : []),
            ]}
          />

          {rows.length > 0 && f.status !== "archived" && (
            <SummaryStrip
              label="Summary of this view"
              figure={{
                label: "Monthly equivalent",
                value: (
                  <span className="inline-flex items-baseline gap-1">
                    <Money totals={summary.monthly} preferred={pref} />
                    <span className="text-[13px] font-normal text-faint">/mo</span>
                  </span>
                ),
                sub: (
                  <>
                    <Money totals={summary.annualized} preferred={pref} className="!inline" /> a year
                  </>
                ),
              }}
              counts={[
                { value: summary.activeCount, label: "active" },
                { value: summary.trialCount, label: "in trial", hideZero: true },
                { value: summary.upcomingRenewals, label: "renewing in 30 days", tone: "accent", hideZero: true },
              ]}
              aside={topTools.length > 0 && <LogoStack items={topTools} max={6} size={28} />}
            />
          )}

          {(() => {
            const count = (
              <div className="flex flex-wrap items-baseline justify-between gap-2 py-3 text-[13px] text-muted">
                <span>
                  {rows.length} subscription{rows.length === 1 ? "" : "s"}
                </span>
                {summary.missingPrice > 0 && f.status !== "archived" && <span className="text-[12px] text-faint">{summary.missingPrice} active without a price aren&apos;t in the totals</span>}
              </div>
            );
            const empty = (
              <EmptyState icon="search" title={filtered ? "No subscriptions match" : "Nothing here"}>
                {filtered ? "Try removing a filter or searching for something else." : "There are no subscriptions in this view."}
              </EmptyState>
            );
            const list = (
              <>
                <SubscriptionTable
                  rows={views}
                  view={view}
                  workspaceId={ws}
                  canBulkAssign={canManage}
                  canArchive={canManage}
                  archivedView={f.status === "archived"}
                  departments={departments.filter((d) => !d.archivedAt).map((d) => ({ id: d.id, name: d.name }))}
                  people={people.filter((p) => p.status === "active").map((p) => ({ id: p.id, name: p.name }))}
                />
                <Pagination page={page} pageCount={pageCount} href={(p) => `/business/subscriptions${filtersQuery(f, { page: p })}`} />
              </>
            );
            // Cards sit on the page; the list sits in a card.
            return view === "cards" ? (
              <section aria-label="Subscriptions">
                <div className="-mt-1">{count}</div>
                {rows.length === 0 ? <Card>{empty}</Card> : list}
              </section>
            ) : (
              <Card bodyClassName="px-4 pb-3 pt-0 sm:px-5">
                {count}
                {rows.length === 0 ? empty : list}
              </Card>
            );
          })()}
        </>
      )}
    </>
  );
}
