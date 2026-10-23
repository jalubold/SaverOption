import Link from "next/link";
import { Card, DefinitionList, EmptyState, InlineNote, Kpi, LinkButton, Meter, Money, PageHeader, Pill, TableWrap, Tabs } from "@/components/business/ui";
import { formatMoney, formatMonth, isLive, lastMonths, licenseTotals, percent, seatSummary, totalsList } from "@/lib/business/calc";
import { hasAssignmentHistory, utilizationByMonth } from "@/lib/business/utilization";
import { requireBizContext } from "@/lib/server/business/context";
import { getCostHistory, getDepartments, getSeatAssignments, getSubscriptions, getVendors } from "@/lib/server/business/data";

export const metadata = { title: "Licenses & Seats" };

type Search = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);

export default async function LicensesPage(props: { searchParams: Promise<Search> }) {
  const q = await props.searchParams;
  const ctx = await requireBizContext("/business/licenses");
  const ws = ctx.workspace.id;
  const [subs, assignments, history, departments, vendors] = await Promise.all([getSubscriptions(ws), getSeatAssignments(ws), getCostHistory(ws), getDepartments(ws), getVendors(ws)]);
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
  const totals = licenseTotals(scoped);
  const rows = tracked
    .map((s) => ({ s, seats: seatSummary(s) }))
    .filter((r) => view === "all" || (r.seats.available ?? 0) > 0)
    .sort((a, b) => (b.seats.unusedMonthly ?? -1) - (a.seats.unusedMonthly ?? -1) || (b.seats.available ?? 0) - (a.seats.available ?? 0) || a.s.softwareName.localeCompare(b.s.softwareName));
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
        description="Purchased seats against the seats your team has assigned or reported in use, for active and trial subscriptions."
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <Kpi label="Purchased seats" icon="key" value={totals.purchased} sub={`${totals.tracked} subscription${totals.tracked === 1 ? "" : "s"} tracking seats`} />
        <Kpi label="Seats in use" icon="users" value={totals.assigned} sub="Named or reported" />
        <Kpi label="Available seats" icon="box" value={totals.available} sub={unassignedCount ? `On ${unassignedCount} subscription${unassignedCount === 1 ? "" : "s"}` : "None unassigned"} href={qs({ view: "unassigned" })} />
        <Kpi label="Utilization" icon="chart" value={percent(totals.utilization)} sub="In use ÷ purchased" />
        <Kpi
          label="Est. unused seat cost"
          icon="coins"
          value={totalsList(totals.unusedMonthly).length ? <span><Money totals={totals.unusedMonthly} preferred={pref} /><span className="text-[13px] font-normal text-faint"> /mo</span></span> : "—"}
          sub={flatWithSeats ? `Per-seat plans only · ${flatWithSeats} flat-priced plan${flatWithSeats === 1 ? " has" : "s have"} no per-seat cost` : "Per-seat plans only"}
        />
      </div>

      <form method="get" action="/business/licenses" className="mt-5 flex flex-wrap items-end gap-2">
        {view !== "all" && <input type="hidden" name="view" value={view} />}
        <label className="text-[12px] text-faint">
          <span className="mb-1 block">Department</span>
          <select name="department" defaultValue={department ?? ""} className="biz-select">
            <option value="">All departments</option>
            <option value="none">No department</option>
            {departments
              .filter((d) => !d.archivedAt)
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
          </select>
        </label>
        <label className="text-[12px] text-faint">
          <span className="mb-1 block">Vendor</span>
          <select name="vendor" defaultValue={vendor ?? ""} className="biz-select">
            <option value="">All vendors</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="btn btn-secondary h-9 rounded-[9px] px-3 text-[13px]">
          Apply
        </button>
        {(department || vendor) && (
          <Link href={qs({ department: undefined, vendor: undefined })} className="h-9 px-2 text-[13px] leading-9 text-muted hover:text-fg">
            Clear
          </Link>
        )}
      </form>

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
            <EmptyState icon="key" title={tracked.length ? "Every purchased seat is in use" : "No subscriptions track seats yet"}>
              {tracked.length
                ? "Nothing in this view has unassigned seats."
                : "Add the number of purchased seats to a subscription to see utilization and the cost of unused seats here."}
            </EmptyState>
          ) : (
            <TableWrap>
              <table className="biz-table">
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
                      <td>
                        <Link href={`/business/licenses/${s.id}`} className="font-medium hover:underline">
                          {s.softwareName}
                        </Link>
                        <span className="block text-[12px] text-faint">
                          {[s.planName, s.departmentName].filter(Boolean).join(" · ") || "—"}
                          {s.status === "trial" && " · Trial"}
                        </span>
                      </td>
                      <td className="num">{seats.purchased}</td>
                      <td className="num">
                        {seats.assigned}
                        <span className="block text-[11.5px] text-faint">
                          {seats.assignedSource === "named" ? "named" : seats.assignedSource === "reported" ? "reported" : "none recorded"}
                        </span>
                      </td>
                      <td className="num">
                        {seats.available}
                        {seats.overAssigned && (
                          <Pill tone="warn" className="ml-1">
                            Over
                          </Pill>
                        )}
                      </td>
                      <td>
                        <Meter value={seats.utilization} label={`${s.softwareName} utilization`} tone={seats.utilization !== null && seats.utilization < 60 ? "warn" : "accent"} />
                      </td>
                      <td className="num">
                        {seats.costPerSeatMonthly !== null ? formatMoney(Math.round(seats.costPerSeatMonthly), s.currency) : <span className="text-faint" title="Flat price or no price: no per-seat cost">—</span>}
                      </td>
                      <td className="num">
                        {seats.unusedMonthly !== null ? (seats.unusedMonthly > 0 ? formatMoney(Math.round(seats.unusedMonthly), s.currency) : formatMoney(0, s.currency)) : <span className="text-faint">—</span>}
                      </td>
                      <td>
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
            <p className="mt-3 text-[12.5px] text-faint">
              {untracked} live subscription{untracked === 1 ? " doesn't" : "s don't"} record purchased seats, so {untracked === 1 ? "it isn't" : "they aren't"} listed. Add seats on the subscription&apos;s edit page.
            </p>
          )}
        </Card>

        <div className="space-y-5">
          <Card title="How seats are counted">
            <DefinitionList
              className="!grid-cols-1"
              items={[
                { label: "Purchased seats", value: "What the plan pays for, as entered on the subscription." },
                { label: "Named assignments", value: "Seats given to people in your team directory on this page." },
                { label: "Reported in use", value: "A count someone entered, e.g. from the vendor's admin page, when seats aren't assigned by name." },
                { label: "Seats in use", value: "The larger of named assignments and the reported count." },
                { label: "Verified active usage", value: <span className="text-faint">Not available — no usage integration is connected.</span> },
              ]}
            />
          </Card>
          <InlineNote title="Unused seat cost">
            Estimated only for per-seat plans with a price: cost per seat = price ÷ purchased seats, converted to a monthly equivalent. Flat-priced plans don&apos;t get cheaper per
            unassigned seat, so they show no estimate.
          </InlineNote>
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
  );
}
