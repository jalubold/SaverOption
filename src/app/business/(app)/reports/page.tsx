import Link from "next/link";
import type { ReactNode } from "react";
import { BarList, DonutChart, RadialGauge, StackedBar, TrendChart, type BarRow } from "@/components/business/charts";
import { SoftwareLogo } from "@/components/business/software-logo";
import { Card, EmptyState, InlineNote, Kpi, Meter, Money, PageHeader, Pill, StatusPill, TableWrap } from "@/components/business/ui";
import { Icon } from "@/components/ui/icon";
import { buttonClass } from "@/components/ui/primitives";
import { annualized, firstYearValue, formatIsoDate, formatMonth, formatMoney, intervalLabel, monthlyEquivalent, percent, totalsList, type CurrencyTotals } from "@/lib/business/calc";
import { categoryLabels, opportunityTypeLabels, SOFTWARE_CATEGORIES, subscriptionStatusLabels } from "@/lib/business/constants";
import { can } from "@/lib/business/permissions";
import type { Group } from "@/lib/server/business/analytics";
import { requireBizContext } from "@/lib/server/business/context";
import { logoFor } from "@/lib/server/business/logos";
import { buildReport, hasFilters, paramsQuery, RANGE_PRESETS, rangeLabels, type ReportKey } from "@/lib/server/business/reports";

export const metadata = { title: "Reports" };

type Raw = Record<string, string | string[] | undefined>;
const whole = (minor: number, currency: string) => formatMoney(Math.round(minor), currency, { whole: true });

export default async function ReportsPage(props: { searchParams: Promise<Raw> }) {
  const ctx = await requireBizContext("/business/reports");
  const report = await buildReport(ctx, await props.searchParams);
  const { params, model, options } = report;
  const fmt = ctx.workspace.dateFormat;
  const pref = ctx.workspace.defaultCurrency;
  const cur = report.chartCurrency;
  const canExport = can(ctx.role, "data.export");
  const q = paramsQuery(params);
  const exportLink = (key: ReportKey) =>
    canExport ? (
      <a href={`/business/reports/export?report=${key}&${q}`} className={buttonClass("ghost", "sm")} download>
        <Icon name="download" size={14} /> CSV
      </a>
    ) : null;
  const s = model.summary;
  const filtered = hasFilters(params);
  const period = `${formatIsoDate(params.from, fmt)} – ${formatIsoDate(params.to, fmt)}`;
  const currencyNote = params.currency ? params.currency : model.currencies.length > 1 ? "all currencies, shown separately" : (model.currencies[0] ?? pref);
  const multiCurrency = !params.currency && model.currencies.length > 1;

  const groupRows = (groups: Group[], logoOf?: (g: Group) => string | null): BarRow[] =>
    groups
      .filter((g) => (g.totals[cur] ?? 0) > 0)
      .sort((a, b) => (b.totals[cur] ?? 0) - (a.totals[cur] ?? 0))
      .map((g) => ({
        label: g.label,
        value: g.totals[cur]!,
        display: `${whole(g.totals[cur]!, cur)}/mo`,
        sub: `· ${g.count} ${g.count === 1 ? "subscription" : "subscriptions"}`,
        ...(logoOf ? { logo: logoOf(g) } : {}),
      }));
  // A vendor's own mark when it's a well-known one, else the logo of its only tool, else a monogram.
  const vendorLogo = (g: Group): string | null => {
    if (g.key === "__none__") return null;
    const own = logoFor(g.label, null, null);
    if (own) return own;
    const tools = [...new Map(model.subs.filter((x) => x.vendorId === g.key).map((x) => [x.softwareId, x.logoSrc])).values()];
    return tools.length === 1 ? tools[0] : null;
  };
  const categoryRows = groupRows(model.byCategory);
  const categoryTotal = categoryRows.reduce((t, r) => t + r.value, 0);

  const controls = (
    <form method="get" action="/business/reports" className="biz-card mb-5 flex flex-wrap items-end gap-3 px-4 py-3">
      <Control label="Date range">
        <select name="range" defaultValue={params.preset} className="biz-select">
          {RANGE_PRESETS.map((r) => (
            <option key={r} value={r}>
              {rangeLabels[r]}
            </option>
          ))}
        </select>
      </Control>
      <Control label="From (custom)">
        <input type="date" name="from" defaultValue={params.from} className="biz-select pr-2" />
      </Control>
      <Control label="To (custom)">
        <input type="date" name="to" defaultValue={params.to} className="biz-select pr-2" />
      </Control>
      <Control label="Currency">
        <select name="currency" defaultValue={params.currency ?? ""} className="biz-select">
          <option value="">All currencies</option>
          {options.currencies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Control>
      <Control label="Category">
        <select name="category" defaultValue={params.category ?? ""} className="biz-select">
          <option value="">All categories</option>
          {SOFTWARE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {categoryLabels[c]}
            </option>
          ))}
        </select>
      </Control>
      <Control label="Department">
        <select name="department" defaultValue={params.department ?? ""} className="biz-select">
          <option value="">All departments</option>
          <option value="none">No department</option>
          {options.departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </Control>
      <Control label="Vendor">
        <select name="vendor" defaultValue={params.vendor ?? ""} className="biz-select max-w-48">
          <option value="">All vendors</option>
          {options.vendors.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </Control>
      <div className="flex items-center gap-2">
        <button type="submit" className={buttonClass("primary", "sm", "h-9")}>
          Apply
        </button>
        <Link href="/business/reports" className={buttonClass("ghost", "sm", "h-9")}>
          Reset
        </Link>
      </div>
    </form>
  );

  const header = (
    <PageHeader
      title="Reports"
      crumbs={[{ label: "Overview", href: "/business/dashboard" }, { label: "Reports" }]}
      description={
        <>
          Reporting period <strong className="font-medium text-fg">{period}</strong> · Currency <strong className="font-medium text-fg">{currencyNote}</strong>. Current-state figures (run-rate, seats, savings) are as of{" "}
          {formatIsoDate(ctx.today, fmt)}.
        </>
      }
      actions={exportLink("summary")}
    />
  );

  if (model.subs.length === 0) {
    return (
      <>
        {header}
        {controls}
        <Card>
          <EmptyState icon="chart" title={filtered ? "No subscriptions match these filters" : "Nothing to report yet"}>
            {filtered ? (
              <>
                Change the filters or{" "}
                <Link href="/business/reports" className="text-accent-ink underline underline-offset-2">
                  reset them
                </Link>
                .
              </>
            ) : (
              "Reports are built from the subscriptions, payments and renewals your team records. Add a subscription to get started."
            )}
          </EmptyState>
        </Card>
      </>
    );
  }

  const trend = report.runRate.map((p) => ({ label: formatMonth(p.month), value: p.totals[cur] ?? 0, display: `${whole(p.totals[cur] ?? 0, cur)}/mo` }));
  const paymentRows = report.paymentsByMonth.map((m) => ({
    label: formatMonth(m.month),
    value: m.totals[cur] ?? 0,
    display: m.totals[cur] ? formatMoney(m.totals[cur]!, cur) : formatMoney(0, cur),
    sub: m.count ? `· ${m.count} payment${m.count === 1 ? "" : "s"}` : undefined,
  }));
  const commitments = report.commitments;
  const realizedPeriod = report.realizedInRange;

  return (
    <>
      {header}
      {controls}
      {report.invalid.length > 0 && (
        <div className="mb-4">
          <InlineNote tone="warn" title="Some controls were ignored">
            The {report.invalid.join(", ")} you chose isn&apos;t valid, so the default was used instead.
          </InlineNote>
        </div>
      )}
      {!filtered && (
        <p className="mb-3 text-[12.5px] text-faint">No filters applied: the run-rate, subscription, seat and savings totals below are the same figures the Overview shows.</p>
      )}

      <section aria-label="Summary" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Kpi label="Monthly software spend" icon="coins" value={<Money totals={s.monthly} preferred={pref} />} sub={s.missingPrice ? `Run-rate · ${s.missingPrice} unpriced not included` : "Run-rate of active plans"} />
        <Kpi label="Annualized recurring cost" icon="trending-up" value={<Money totals={s.annualized} preferred={pref} />} sub="Run-rate × 12, not cash spent" />
        <Kpi label="Active subscriptions" icon="layers" value={s.activeCount} sub={s.trialCount ? `+ ${s.trialCount} in trial` : undefined} />
        <Kpi label="Recorded payments" icon="credit-card" value={totalsList(report.paymentsTotal).length ? <Money totals={report.paymentsTotal} preferred={pref} /> : "—"} sub={`Actual expenditure in the period · ${report.payments.length} payment${report.payments.length === 1 ? "" : "s"}`} />
        <Kpi
          label="Potential savings"
          icon="piggy"
          value={totalsList(model.potential.annual).length ? <span><Money totals={model.potential.annual} preferred={pref} /><span className="text-[13px] font-normal text-faint"> /yr</span></span> : "—"}
          sub="Estimates, each subscription once"
        />
        <Kpi label="Realized savings" icon="check" value={totalsList(realizedPeriod).length ? <Money totals={realizedPeriod} preferred={pref} /> : "—"} sub="Confirmed in the period · first-year value" />
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card title="Monthly software spending" description={`Recurring run-rate at each month's end, ${cur}. A run-rate from start dates and recorded price changes — not money spent.`} action={exportLink("subscriptions")}>
          {trend.length ? (
            <TrendChart points={trend} caption={`Monthly recurring run-rate, ${cur}, ${period}`} currency={cur} />
          ) : (
            <p className="text-[13.5px] text-muted">The period is in the future, so there&apos;s no run-rate history to chart.</p>
          )}
          {multiCurrency && <p className="mt-2 text-[12px] text-faint">Charted in {cur}. Choose a currency above to chart another one.</p>}
        </Card>
        <Card title="Recorded payments by month" description={`Actual expenditure your team recorded, by payment date, ${cur}. A separate measure from the run-rate.`} action={exportLink("payments")}>
          {report.payments.length === 0 ? (
            <p className="text-[13.5px] text-muted">No payments recorded in this period. Record them from a subscription, or when marking a renewal as renewed.</p>
          ) : (
            <>
              <BarList caption={`Recorded payments by month, ${cur}`} valueHead="Paid" rows={paymentRows} max={24} />
              {totalsList(report.paymentsTotal).length > 1 && (
                <p className="mt-2 text-[12px] text-faint">
                  Period totals: <Money totals={report.paymentsTotal} preferred={pref} className="!inline-flex !flex-row gap-2" />
                </p>
              )}
            </>
          )}
        </Card>
      </div>

      <Card title="Annualized costs" description="Monthly equivalent × 12 for each active subscription — a run-rate, not historical spend." className="mt-5" action={exportLink("subscriptions")}>
        <TableWrap>
          <table className="biz-table">
            <thead>
              <tr>
                <th>Software</th>
                <th>Plan</th>
                <th>Billing</th>
                <th className="num">Price</th>
                <th className="num">Monthly equivalent</th>
                <th className="num">Annualized</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {report.annualizedRows.map((r) => {
                const m = monthlyEquivalent(r);
                const a = annualized(r);
                return (
                  <tr key={r.id}>
                    <td className="min-w-40">
                      <span className="flex items-center gap-2.5">
                        <SoftwareLogo name={r.softwareName} src={r.logoSrc} size={26} />
                        <Link href={`/business/subscriptions/${r.id}`} className="font-medium hover:underline">
                          {r.softwareName}
                        </Link>
                      </span>
                    </td>
                    <td className="text-muted">{r.planName ?? "—"}</td>
                    <td className="whitespace-nowrap">{intervalLabel(r)}</td>
                    <td className="num">{r.priceMinor !== null ? formatMoney(r.priceMinor, r.currency) : <span className="text-faint">No price</span>}</td>
                    <td className="num">{m !== null ? formatMoney(Math.round(m), r.currency) : "—"}</td>
                    <td className="num">{a !== null ? formatMoney(Math.round(a), r.currency) : "—"}</td>
                    <td className="whitespace-nowrap text-muted">{r.departmentName ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="font-medium">
                  Total
                </td>
                <td className="num font-medium">
                  <Money totals={s.monthly} preferred={pref} />
                </td>
                <td className="num font-medium">
                  <Money totals={s.annualized} preferred={pref} />
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </TableWrap>
      </Card>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Breakdown title="By vendor" cur={cur} rows={groupRows(model.byVendor, vendorLogo)} groups={model.byVendor} multi={multiCurrency} pref={pref} action={exportLink("vendors")} />
        <Card title="By category" description={`Monthly equivalent of active subscriptions, ${cur}`} action={exportLink("categories")} className="min-w-0">
          {categoryRows.length ? (
            <>
              <DonutChart
                caption={`Spending by category, ${cur}`}
                segments={categoryRows.map((r) => ({ label: r.label, value: r.value, display: r.display }))}
                centerLabel="Per month"
                centerValue={whole(categoryTotal, cur)}
                otherLabel="Other categories"
              />
              <details className="mt-3 text-[12.5px]">
                <summary className="cursor-pointer select-none text-faint hover:text-fg">View as table</summary>
                <table className="biz-table mt-2">
                  <caption className="sr-only">Spending by category, {cur}</caption>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th className="num">Subscriptions</th>
                      <th className="num">Monthly</th>
                    </tr>
                  </thead>
                  <tbody>
                    {model.byCategory
                      .filter((g) => (g.totals[cur] ?? 0) > 0)
                      .sort((a, b) => (b.totals[cur] ?? 0) - (a.totals[cur] ?? 0))
                      .map((g) => (
                        <tr key={g.key}>
                          <td>{g.label}</td>
                          <td className="num">{g.count}</td>
                          <td className="num">{whole(g.totals[cur]!, cur)}/mo</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </details>
            </>
          ) : (
            <p className="text-[13.5px] text-muted">No priced active subscriptions in {cur}.</p>
          )}
          {multiCurrency && <GroupTable groups={model.byCategory} pref={pref} />}
        </Card>
        <Breakdown title="By department" cur={cur} rows={groupRows(model.byDepartment)} groups={model.byDepartment} multi={multiCurrency} pref={pref} action={exportLink("departments")} />
        <Card title="By billing interval" description={`Monthly equivalent, ${cur}`} action={exportLink("intervals")}>
          <StackedBar caption={`Monthly equivalent by billing interval, ${cur}`} segments={model.byInterval.map((g) => ({ label: g.label, value: g.totals[cur] ?? 0, display: `${whole(g.totals[cur] ?? 0, cur)}/mo` }))} />
          {multiCurrency && <GroupTable groups={model.byInterval} pref={pref} />}
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card title="Subscription status" description="All non-archived subscriptions in the selection.">
          <TableWrap>
            <table className="biz-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th className="num">Subscriptions</th>
                </tr>
              </thead>
              <tbody>
                {model.byStatus
                  .sort((a, b) => b.count - a.count)
                  .map((g) => (
                    <tr key={g.status}>
                      <td>
                        <StatusPill status={g.status} label={subscriptionStatusLabels[g.status as keyof typeof subscriptionStatusLabels] ?? g.label} />
                      </td>
                      <td className="num">{g.count}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </TableWrap>
        </Card>
        <Card
          title="Upcoming renewal commitments"
          description={`Charges scheduled by auto-renewing subscriptions, ${formatIsoDate(commitments.from, fmt)} – ${formatIsoDate(commitments.to, fmt)}.`}
          className="lg:col-span-2"
          action={exportLink("renewals")}
        >
          {commitments.rows.length === 0 ? (
            <p className="text-[13.5px] text-muted">No renewal dates fall in this window. Add next renewal dates to subscriptions to see commitments.</p>
          ) : (
            <>
              <p className="mb-3 text-[13.5px]">
                Committed: <Money totals={commitments.totals} preferred={pref} className="!inline-flex !flex-row gap-2 font-semibold" />
              </p>
              <TableWrap>
                <table className="biz-table">
                  <thead>
                    <tr>
                      <th>Software</th>
                      <th>Next renewal</th>
                      <th className="num">Renewals</th>
                      <th className="num">Amount</th>
                      <th>Renews</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commitments.rows.map((r) => (
                      <tr key={r.sub.id}>
                        <td className="min-w-40">
                          <span className="flex items-center gap-2.5">
                            <SoftwareLogo name={r.sub.softwareName} src={r.sub.logoSrc} size={26} />
                            <span className="min-w-0">
                              <Link href={`/business/subscriptions/${r.sub.id}`} className="font-medium hover:underline">
                                {r.sub.softwareName}
                              </Link>
                              <span className="block text-[12px] text-faint">{intervalLabel(r.sub)}</span>
                            </span>
                          </span>
                        </td>
                        <td className="whitespace-nowrap">{formatIsoDate(r.dates[0], fmt)}</td>
                        <td className="num">{r.dates.length}</td>
                        <td className="num">{r.amount !== null ? formatMoney(r.amount, r.sub.currency) : <span className="text-faint">No price</span>}</td>
                        <td>{r.manual ? <Pill tone="warn">Manual — not counted</Pill> : <Pill tone="neutral">Automatic</Pill>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrap>
              <p className="mt-2 text-[12px] text-faint">Subscriptions with auto-renew off only renew if someone renews them, so they&apos;re listed but not counted as committed.</p>
            </>
          )}
        </Card>
      </div>

      <Card title="License utilization" description="Purchased seats against seats in use (named assignments or the reported count). Actual product usage isn't known: no usage integration is connected." className="mt-5" action={exportLink("licenses")}>
        {report.licenseRows.length === 0 ? (
          <p className="text-[13.5px] text-muted">No subscriptions track purchased seats in this selection.</p>
        ) : (
          <>
            <div className="mb-4 flex flex-col items-center gap-4 sm:flex-row">
              <RadialGauge value={model.licenses.utilization} label="Overall seat utilization" sub="in use" size={112} />
              <div className="grid w-full min-w-0 flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Purchased seats" value={model.licenses.purchased} />
                <Stat label="In use" value={model.licenses.assigned} />
                <Stat label="Available" value={model.licenses.available} />
                <Stat label="Utilization" value={percent(model.licenses.utilization)} />
              </div>
            </div>
            <TableWrap>
              <table className="biz-table">
                <thead>
                  <tr>
                    <th>Software</th>
                    <th className="num">Purchased</th>
                    <th className="num">In use</th>
                    <th className="num">Available</th>
                    <th>Utilization</th>
                    <th className="num">Unused cost / mo</th>
                  </tr>
                </thead>
                <tbody>
                  {report.licenseRows.map(({ sub, seats }) => (
                    <tr key={sub.id}>
                      <td className="min-w-44">
                        <span className="flex items-center gap-2.5">
                          <SoftwareLogo name={sub.softwareName} src={sub.logoSrc} size={26} />
                          <span className="min-w-0">
                            <Link href={`/business/licenses/${sub.id}`} className="font-medium hover:underline">
                              {sub.softwareName}
                            </Link>
                            <span className="block text-[12px] text-faint">{seats.assignedSource === "named" ? "Named assignments" : seats.assignedSource === "reported" ? "Reported count" : "Nothing recorded"}</span>
                          </span>
                        </span>
                      </td>
                      <td className="num">{seats.purchased}</td>
                      <td className="num">{seats.assigned}</td>
                      <td className="num">{seats.available}</td>
                      <td>
                        <Meter value={seats.utilization} label={`${sub.softwareName} utilization`} tone={seats.utilization !== null && seats.utilization < 60 ? "warn" : "accent"} />
                      </td>
                      <td className="num">{seats.unusedMonthly !== null ? formatMoney(Math.round(seats.unusedMonthly), sub.currency) : <span className="text-faint">Not per seat</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          </>
        )}
      </Card>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card title="Potential savings by type" description="Open and reviewed opportunities. Types can overlap, so the total counts each subscription once." action={exportLink("savings")}>
          {report.savingsByType.length === 0 ? (
            <p className="text-[13.5px] text-muted">No open opportunities in this selection.</p>
          ) : (
            <TableWrap>
              <table className="biz-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th className="num">Open</th>
                    <th className="num">With estimate</th>
                    <th className="num">Potential / yr</th>
                  </tr>
                </thead>
                <tbody>
                  {report.savingsByType.map((r) => (
                    <tr key={r.type}>
                      <td>
                        <Link href={`/business/savings?type=${r.type}`} className="hover:underline">
                          {opportunityTypeLabels[r.type]}
                        </Link>
                      </td>
                      <td className="num">{r.count}</td>
                      <td className="num">{r.withEstimate}</td>
                      <td className="num">
                        <Money totals={r.annual} preferred={pref} />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="font-medium">
                      Total (each subscription once)
                    </td>
                    <td className="num font-medium">
                      <Money totals={model.potential.annual} preferred={pref} />
                    </td>
                  </tr>
                </tfoot>
              </table>
            </TableWrap>
          )}
        </Card>
        <Card title="Realized savings" description={`Savings confirmed in the period, with the amounts your team entered. ${period}.`} action={exportLink("realized")}>
          {report.realizedRows.length === 0 ? (
            <p className="text-[13.5px] text-muted">No savings were confirmed in this period.</p>
          ) : (
            <TableWrap>
              <table className="biz-table">
                <thead>
                  <tr>
                    <th>Confirmed</th>
                    <th>Description</th>
                    <th className="num">First-year value</th>
                  </tr>
                </thead>
                <tbody>
                  {report.realizedRows.map((r) => (
                    <tr key={r.id}>
                      <td className="whitespace-nowrap">{formatIsoDate(r.confirmedOn, fmt)}</td>
                      <td>{r.description}</td>
                      <td className="num">{formatMoney(firstYearValue(r), r.currency)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2} className="font-medium">
                      Total
                    </td>
                    <td className="num font-medium">
                      <Money totals={realizedPeriod} preferred={pref} />
                    </td>
                  </tr>
                </tfoot>
              </table>
            </TableWrap>
          )}
        </Card>
      </div>

      <Card id="activity" title="Audit log" description={`Changes recorded in the workspace, ${period} (latest 200).`} className="mt-5 scroll-mt-20" action={exportLink("activity")}>
        {report.activity.length === 0 ? (
          <p className="text-[13.5px] text-muted">No activity in this period.</p>
        ) : (
          <TableWrap>
            <table className="biz-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Who</th>
                  <th>What happened</th>
                </tr>
              </thead>
              <tbody>
                {report.activity.map((a) => (
                  <tr key={a.id}>
                    <td className="whitespace-nowrap">
                      {formatIsoDate(a.createdAt.toISOString().slice(0, 10), fmt)}{" "}
                      <span className="text-faint">{a.createdAt.toISOString().slice(11, 16)} UTC</span>
                    </td>
                    <td className="whitespace-nowrap">{a.actorName ?? "—"}</td>
                    <td>{a.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        )}
      </Card>
    </>
  );
}

function Control({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="text-[12.5px] text-muted">
      <span className="mb-1 block">{label}</span>
      {children}
    </label>
  );
}

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl border border-line px-3 py-2.5">
      <p className="text-[12px] text-faint">{label}</p>
      <p className="tabular mt-0.5 text-[17px] font-semibold text-heading">{value}</p>
    </div>
  );
}

function GroupTable({ groups, pref }: { groups: Group[]; pref: string }) {
  return (
    <details className="mt-3 text-[12.5px]">
      <summary className="cursor-pointer select-none text-faint hover:text-fg">All currencies</summary>
      <table className="biz-table mt-2">
        <thead>
          <tr>
            <th>Name</th>
            <th className="num">Subscriptions</th>
            <th className="num">Monthly equivalent</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => (
            <tr key={g.key}>
              <td>{g.label}</td>
              <td className="num">{g.count}</td>
              <td className="num">
                <Money totals={g.totals as CurrencyTotals} preferred={pref} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}

function Breakdown({
  title,
  cur,
  rows,
  groups,
  multi,
  pref,
  action,
}: {
  title: string;
  cur: string;
  rows: BarRow[];
  groups: Group[];
  multi: boolean;
  pref: string;
  action: ReactNode;
}) {
  return (
    <Card title={title} description={`Monthly equivalent of active subscriptions, ${cur}`} action={action} className="min-w-0">
      {rows.length ? <BarList caption={`${title}, ${cur}`} rows={rows} max={10} /> : <p className="text-[13.5px] text-muted">No priced active subscriptions in {cur}.</p>}
      {multi && <GroupTable groups={groups} pref={pref} />}
    </Card>
  );
}
