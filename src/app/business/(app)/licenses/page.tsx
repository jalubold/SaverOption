import Link from "next/link";
import { RadialGauge } from "@/components/business/charts";
import { SoftwareLogo } from "@/components/business/software-logo";
import { FilterBar } from "@/components/business/filter-bar";
import { Card, EmptyState, FxNoteLine, Kpi, LinkButton, Meter, Money, PageHeader, Pill, TableWrap, Tabs } from "@/components/business/ui";
import { Icon } from "@/components/ui/icon";
import { formatMoney, formatMonth, isLive, lastMonths, licenseTotals, monthlyEquivalent, percent, seatSummary, totalsList } from "@/lib/business/calc";
import { hasAssignmentHistory, utilizationByMonth } from "@/lib/business/utilization";
import { requireBizContext } from "@/lib/server/business/context";
import { SUB_MONEY, workspaceDisplay } from "@/lib/server/business/display-currency";
import { getCostHistory, getDepartments, getSeatAssignments, getSubscriptions, getVendors, type Subscription } from "@/lib/server/business/data";

export const metadata = { title: "Licenses & Seats" };

type Search = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);

export default async function LicensesPage(props: { searchParams: Promise<Search> }) {
  const q = await props.searchParams;
  const ctx = await requireBizContext("/business/licenses");
  const ws = ctx.workspace.id;
  const [billedSubs, assignments, billedHistory, departments, vendors, display] = await Promise.all([
    getSubscriptions(ws),
    getSeatAssignments(ws),
    getCostHistory(ws),
    getDepartments(ws),
    getVendors(ws),
    workspaceDisplay(ctx),
  ]);
  // Seat costs in the workspace currency (ECB rate).
  const subs = display.rows(billedSubs, SUB_MONEY);
  const history = display.rows(billedHistory, ["priceMinor"]);
  const pref = ctx.workspace.defaultCurrency;

  // Filters are only honoured when they name something in this workspace.
  const deptParam = one(q.department);
  const department = deptParam === "none" || departments.some((d) => d.id === deptParam) ? deptParam : undefined;
  const vendorParam = one(q.vendor);
  const vendor = vendors.some((v) => v.id === vendorParam) ? vendorParam : undefined;
  const view = one(q.view) === "unassigned" ? "unassigned" : "all";

  const live = subs.filter((s) => isLive(s));
  const scoped = live.filter(
    (s) => (!department || (department === "none" ? !s.departmentId : s.departmentId === department)) && (!vendor || s.vendorId === vendor),
  );
  const tracked = scoped.filter((s) => s.purchasedSeats !== null);
  const untracked = scoped.length - tracked.length;
  // Live subscriptions without a seat count, biggest first: where adding seats is worth it.
  const withoutSeats = (list: typeof live) =>
    list
      .filter((s) => s.purchasedSeats === null)
      .map((s) => ({ s, monthly: monthlyEquivalent(s) }))
      .sort((a, b) => (b.monthly ?? -1) - (a.monthly ?? -1) || a.s.softwareName.localeCompare(b.s.softwareName));
  const tracksAny = live.some((s) => s.purchasedSeats !== null);
  const filtered = Boolean(department || vendor);
  const totals = licenseTotals(scoped);
  const rows = tracked
    .map((s) => ({ s, seats: seatSummary(s) }))
    .filter((r) => view === "all" || (r.seats.available ?? 0) > 0)
    .sort((a, b) => (b.seats.unusedMonthly ?? -1) - (a.seats.unusedMonthly ?? -1) || (b.seats.available ?? 0) - (a.seats.available ?? 0) || a.s.softwareName.localeCompare(b.s.softwareName));
  const mostUnused = tracked
    .map((s) => ({ s, seats: seatSummary(s) }))
    .filter((r) => (r.seats.available ?? 0) > 0)
    .sort((a, b) => (b.seats.unusedMonthly ?? -1) - (a.seats.unusedMonthly ?? -1) || (b.seats.available ?? 0) - (a.seats.available ?? 0))
    .slice(0, 3);
  const unassignedCount = tracked.filter((s) => (seatSummary(s).available ?? 0) > 0).length;
  const flatWithSeats = tracked.filter((s) => s.pricingModel === "flat").length;

  const qs = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { department, vendor, view: view === "all" ? undefined : view, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    const s = p.toString();
    return s ? `/business/licenses?${s}` : "/business/licenses";
  };

  const trackedIds = tracked.map((s) => s.id);
  const scopedAssignments = assignments.filter((a) => trackedIds.includes(a.subscriptionId));
  const showHistory = hasAssignmentHistory(scopedAssignments, ctx.today);
  const historyPoints = showHistory
    ? utilizationByMonth(
        trackedIds,
        scopedAssignments.map((a) => ({ subscriptionId: a.subscriptionId, assignedAt: a.assignedAt, releasedAt: a.releasedAt })),
        history.map((h) => ({ subscriptionId: h.subscriptionId, effectiveFrom: h.effectiveFrom, purchasedSeats: h.purchasedSeats })),
        lastMonths(ctx.today, 6),
      )
    : [];

  return (
    <>
      <PageHeader
        title="Licenses & Seats"
        crumbs={[{ label: "Overview", href: "/business/dashboard" }, { label: "Licenses & Seats" }]}
        description={
          <>
            Purchased seats against the seats your team has assigned or reported in use, for active and trial subscriptions.
            <FxNoteLine note={display.note()} dateFormat={ctx.workspace.dateFormat} className="mt-1.5" />
          </>
        }
      />

      {!tracksAny ? (
        <SeatsEmpty candidates={withoutSeats(live).slice(0, 6)} anyLive={live.length > 0} />
      ) : (
        <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <Kpi label="Purchased seats" icon="key" value={totals.purchased} sub={`${totals.tracked} subscription${totals.tracked === 1 ? "" : "s"} tracking seats`} />
        <Kpi
          label="Seats in use"
          icon="users"
          value={totals.assigned}
          sub="Named or reported"
          hint="Seats given to people in your team directory, or the count reported from the vendor's admin page — whichever is higher."
        />
        <Kpi label="Available seats" icon="box" value={totals.available} sub={unassignedCount ? `On ${unassignedCount} subscription${unassignedCount === 1 ? "" : "s"}` : "None unassigned"} href={qs({ view: "unassigned" })} />
        <Kpi label="Utilization" icon="chart" value={percent(totals.utilization)} sub="In use ÷ purchased" hint="Seats in use divided by purchased seats, for the subscriptions that record both." />
        <Kpi
          label="Est. unused seat cost"
          icon="coins"
          value={totalsList(totals.unusedMonthly).length ? <span><Money totals={totals.unusedMonthly} preferred={pref} /><span className="text-[13px] font-normal text-faint"> /mo</span></span> : "—"}
          sub="Per-seat plans only"
          hint={
            <>
              For per-seat plans with a price: price ÷ purchased seats × unused seats, as a monthly figure. Flat-priced plans don&apos;t get cheaper with fewer people, so they
              have no estimate{flatWithSeats ? ` (${flatWithSeats} here)` : ""}.
            </>
          }
        />
      </div>

      <div className="mt-5">
        <FilterBar
          action="/business/licenses"
          label="Filter licenses"
          keep={{ view: view !== "all" ? view : null }}
          inline={[
            { name: "department", label: "Department", value: department ?? null, allLabel: "All", options: [{ value: "none", label: "No department" }, ...departments.filter((d) => !d.archivedAt).map((d) => ({ value: d.id, label: d.name }))] },
            { name: "vendor", label: "Vendor", value: vendor ?? null, allLabel: "All", options: vendors.map((v) => ({ value: v.id, label: v.name })) },
          ]}
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Card
          title="Seat allocation by subscription"
          description="Sorted by the monthly cost of unassigned seats."
          className="xl:col-span-2"
          bodyClassName="pt-0"
        >
          <div className="pt-3">
            <Tabs
              items={[
                { label: "All tracked", href: qs({ view: undefined }), active: view === "all", count: tracked.length },
                { label: "With unassigned seats", href: qs({ view: "unassigned" }), active: view === "unassigned", count: unassignedCount },
              ]}
            />
          </div>
          {rows.length === 0 ? (
            <EmptyState
              icon="key"
              title={tracked.length ? "Every purchased seat is in use" : "No tracked subscription matches these filters"}
              action={!tracked.length && filtered ? <LinkButton href="/business/licenses">Clear filters</LinkButton> : undefined}
            >
              {tracked.length ? "Nothing in this view has unassigned seats. Nice." : "Try another department or vendor."}
            </EmptyState>
          ) : (
            <TableWrap>
              <table className="biz-table stack">
                <thead>
                  <tr>
                    <th>Software</th>
                    <th className="num">Purchased</th>
                    <th className="num">In use</th>
                    <th className="num">Available</th>
                    <th>Utilization</th>
                    <th className="num">Per seat /mo</th>
                    <th className="num">Unused /mo</th>
                    <th>
                      <span className="sr-only">Manage</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ s, seats }) => (
                    <tr key={s.id}>
                      <td className="max-sm:min-w-0 max-sm:flex-1 max-sm:basis-[60%] sm:min-w-44">
                        <span className="flex items-center gap-2.5">
                          <SoftwareLogo name={s.softwareName} src={s.logoSrc} size={30} />
                          <span className="min-w-0">
                            <Link href={`/business/licenses/${s.id}`} className="font-medium hover:underline">
                              {s.softwareName}
                            </Link>
                            <span className="block text-[12px] text-faint">
                              {[s.planName, s.departmentName].filter(Boolean).join(" · ") || "—"}
                              {s.status === "trial" && " · Trial"}
                            </span>
                          </span>
                        </span>
                      </td>
                      <td className="num max-sm:order-1 max-sm:pl-10" data-label="Purchased">
                        {seats.purchased}
                      </td>
                      <td className="num max-sm:order-1" data-label="In use">
                        {seats.assigned}
                        <span className="block text-[11.5px] text-faint max-sm:hidden">
                          {seats.assignedSource === "named" ? "named" : seats.assignedSource === "reported" ? "reported" : "none recorded"}
                        </span>
                      </td>
                      <td className="num stack-hide" data-label="Free">
                        {seats.available}
                        {seats.overAssigned && (
                          <Pill tone="warn" className="ml-1">
                            Over
                          </Pill>
                        )}
                      </td>
                      <td className="stack-hide">
                        <Meter value={seats.utilization} label={`${s.softwareName} utilization`} tone={seats.utilization !== null && seats.utilization < 60 ? "warn" : "accent"} />
                      </td>
                      <td className="num stack-hide">
                        {seats.costPerSeatMonthly !== null ? formatMoney(Math.round(seats.costPerSeatMonthly), s.currency) : <span className="text-faint" title="Flat price or no price: no per-seat cost">—</span>}
                      </td>
                      <td className="num max-sm:order-1" data-label="Unused">
                        {seats.unusedMonthly !== null ? (seats.unusedMonthly > 0 ? formatMoney(Math.round(seats.unusedMonthly), s.currency) : formatMoney(0, s.currency)) : <span className="text-faint">—</span>}
                      </td>
                      <td className="max-sm:-my-1 max-sm:self-start">
                        <LinkButton href={`/business/licenses/${s.id}`} variant="ghost">
                          Manage
                        </LinkButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          )}
          {untracked > 0 && (
            <div className="mt-4 rounded-xl border border-dashed border-line-strong px-3.5 py-3" data-untracked>
              <p className="text-[12.5px] text-muted">
                {untracked} live subscription{untracked === 1 ? " has" : "s have"} no seat count yet, so {untracked === 1 ? "it isn't" : "they aren't"} listed:
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {withoutSeats(scoped)
                  .slice(0, 6)
                  .map(({ s }) => (
                    <li key={s.id}>
                      <Link href={`/business/subscriptions/${s.id}/edit#seats`} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface py-0.5 pl-0.5 pr-2.5 text-[12.5px] hover:border-accent/40">
                        <SoftwareLogo name={s.softwareName} src={s.logoSrc} size={20} className="rounded-full" />
                        <span className="font-medium text-fg">{s.softwareName}</span>
                        <span className="text-accent-ink">Add seats</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </Card>

        <div className="min-w-0 space-y-5">
          <Card title="Overall utilization" description="Seats in use across the subscriptions in this view.">
            {totals.tracked === 0 ? (
              <p className="text-[13.5px] text-muted">No subscription in this view tracks seats.</p>
            ) : (
              <>
                <div className="flex items-center gap-5">
                  <RadialGauge value={totals.utilization} label="Overall seat utilization" sub="in use" size={132} />
                  <dl className="min-w-0 space-y-2 text-[13px]">
                    <div className="flex items-center gap-2">
                      <span aria-hidden="true" className="size-2.5 rounded-[3px] bg-accent" />
                      <dt className="text-muted">In use</dt>
                      <dd className="tabular ml-auto pl-3 font-semibold text-fg">{totals.assigned}</dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <span aria-hidden="true" className="size-2.5 rounded-[3px] bg-subtle ring-1 ring-line-strong" />
                      <dt className="text-muted">Available</dt>
                      <dd className="tabular ml-auto pl-3 font-semibold text-fg">{totals.available}</dd>
                    </div>
                    <div className="flex items-center gap-2 border-t border-line pt-2">
                      <dt className="text-muted">Purchased</dt>
                      <dd className="tabular ml-auto pl-3 font-semibold text-fg">{totals.purchased}</dd>
                    </div>
                  </dl>
                </div>
                {mostUnused.length > 0 && (
                  <div className="mt-4 border-t border-line pt-3">
                    <p className="text-[12px] font-medium text-faint">Most unassigned seats</p>
                    <ul className="mt-2 space-y-2">
                      {mostUnused.map(({ s, seats }) => (
                        <li key={s.id}>
                          <Link href={`/business/licenses/${s.id}`} className="flex items-center gap-2.5 text-[13px] hover:underline underline-offset-2">
                            <SoftwareLogo name={s.softwareName} src={s.logoSrc} size={24} />
                            <span className="min-w-0 truncate font-medium text-fg">{s.softwareName}</span>
                            <span className="tabular ml-auto shrink-0 text-muted">
                              {seats.available} free
                              {seats.unusedMonthly ? <span className="text-faint"> · {formatMoney(Math.round(seats.unusedMonthly), s.currency)}/mo</span> : null}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      </div>

      <Card title="Utilization history" description="Named seat assignments at each month's end, for the subscriptions above." className="mt-5">
        {showHistory ? (
          <TableWrap>
            <table className="biz-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th className="num">Named seats assigned</th>
                  <th className="num">Purchased seats</th>
                  <th>Utilization</th>
                </tr>
              </thead>
              <tbody>
                {historyPoints.map((p) => (
                  <tr key={p.month}>
                    <td>{formatMonth(p.month)}</td>
                    <td className="num">{p.assigned}</td>
                    <td className="num">{p.purchased}</td>
                    <td>
                      <Meter value={p.utilization} label={`Utilization ${formatMonth(p.month)}`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        ) : (
          <p className="text-[13.5px] text-muted">
            History appears once seat assignments are more than 30 days old. It covers named assignments only — reported counts have no history.
          </p>
        )}
        {showHistory && <p className="mt-2 text-[12px] text-faint">Reported counts aren&apos;t included: they have no dates. Purchased seats come from each subscription&apos;s recorded price history.</p>}
      </Card>
        </>
      )}

      {tracksAny && <SeatsExplained />}
    </>
  );
}

/** The definitions, folded away for whoever wants them (the figures carry a short ⓘ each). */
function SeatsExplained() {
  const terms: [string, string][] = [
    ["Purchased seats", "What the plan pays for, as entered on the subscription."],
    ["Named assignments", "Seats given to people in your team directory, on each subscription's seat page."],
    ["Reported in use", "A count someone entered, e.g. from the vendor's admin page, when seats aren't assigned by name."],
    ["Seats in use", "The higher of named assignments and the reported count."],
    ["Unused seat cost", "For per-seat plans with a price: price ÷ purchased seats, times the unused seats, as a monthly figure. Flat-priced plans have no estimate."],
    ["Verified active usage", "Not available: no usage integration is connected, so nothing here claims who actually logs in."],
  ];
  return (
    <details className="group mt-5 rounded-[14px] border border-line bg-surface" data-seats-explained>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-[13.5px] font-medium text-fg sm:px-5 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2">
          <Icon name="info" size={15} className="text-faint" /> How seats and unused cost are counted
        </span>
        <Icon name="chevron-down" size={15} className="shrink-0 text-faint transition-transform group-open:rotate-180" />
      </summary>
      <dl className="grid gap-x-8 gap-y-3 border-t border-line px-4 py-4 text-[13px] sm:grid-cols-2 sm:px-5">
        {terms.map(([term, text]) => (
          <div key={term}>
            <dt className="font-medium text-fg">{term}</dt>
            <dd className="mt-0.5 leading-relaxed text-muted">{text}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}

/**
 * Nothing tracks seats yet: why it's worth it, how it works in three steps, and the subscriptions
 * to start with (each with a direct "Add seats").
 */
function SeatsEmpty({ candidates, anyLive }: { candidates: { s: Subscription; monthly: number | null }[]; anyLive: boolean }) {
  const steps: [string, string][] = [
    ["Add purchased seats", "On a subscription: how many seats the plan pays for."],
    ["Show who uses them", "Give seats to people, or enter the count from the vendor's admin page."],
    ["See what's unused", "Free seats and roughly what they cost each month show up here."],
  ];
  return (
    <section className="biz-card overflow-hidden" data-seats-empty>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
        <div className="p-5 sm:p-7">
          <span aria-hidden="true" className="icon-tile size-11">
            <Icon name="key" size={20} />
          </span>
          <h2 className="mt-4 text-[20px] font-semibold tracking-tight text-heading">Find seats you pay for but nobody uses</h2>
          <p className="mt-1.5 max-w-lg text-[14px] leading-relaxed text-muted">
            Add how many seats your plans pay for, and this page shows who has one, what&apos;s free and what the free ones cost.
          </p>
          <ol className="mt-6 grid gap-4 sm:grid-cols-3">
            {steps.map(([title, body], i) => (
              <li key={title} className="flex gap-3 sm:flex-col sm:gap-2">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-accent/35 bg-surface text-[12.5px] font-semibold text-accent-ink">{i + 1}</span>
                <span>
                  <span className="block text-[13px] font-semibold text-fg">{title}</span>
                  <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">{body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="border-t border-line bg-subtle/50 p-5 sm:p-7 lg:border-l lg:border-t-0">
          {candidates.length > 0 ? (
            <>
              <p className="text-[13px] font-semibold text-fg">Start with these</p>
              <p className="text-[12.5px] text-faint">Your live subscriptions without a seat count, biggest first.</p>
              <ul className="mt-3 space-y-2" data-seat-candidates>
                {candidates.map(({ s, monthly }) => (
                  <li key={s.id} className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3 py-2.5">
                    <SoftwareLogo name={s.softwareName} src={s.logoSrc} size={30} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-medium text-fg">{s.softwareName}</span>
                      <span className="block truncate text-[12px] text-faint">
                        {[s.planName, monthly !== null ? `${formatMoney(Math.round(monthly), s.currency)}/mo` : null].filter(Boolean).join(" · ") || "No price yet"}
                      </span>
                    </span>
                    <LinkButton href={`/business/subscriptions/${s.id}/edit#seats`} variant="secondary">
                      Add seats
                    </LinkButton>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <p className="text-[13px] font-semibold text-fg">{anyLive ? "Every subscription is set" : "No subscriptions yet"}</p>
              <p className="mt-1 text-[12.5px] text-muted">{anyLive ? "" : "Add the tools your team pays for first; then come back to track their seats."}</p>
              {!anyLive && (
                <div className="mt-3">
                  <LinkButton href="/business/subscriptions/new" variant="primary" icon="plus">
                    Add software
                  </LinkButton>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
