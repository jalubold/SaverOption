import Link from "next/link";
import type { ReactNode } from "react";
import { BasisBadge, basisInfo } from "@/components/business/analytics/basis-badge";
import { BarList, Sparkline, TrendChart, type BarRow } from "@/components/business/charts";
import { SoftwareLogo, SoftwareName } from "@/components/business/software-logo";
import { Card, EmptyState, FxNoteLine, Kpi, LinkButton, Meter, Money, PageHeader, Pill, TableWrap } from "@/components/business/ui";
import { buttonClass } from "@/components/ui/primitives";
import { addMonths, addTo, annualized, formatIsoDate, formatMonth, formatMoney, intervalLabel, isRecurring, monthlyEquivalent, seatSummary, totalsList, type CurrencyTotals } from "@/lib/business/calc";
import type { InsightBasis } from "@/lib/business/insights-calc";
import { categoryLabels, SOFTWARE_CATEGORIES } from "@/lib/business/constants";
import type { Group } from "@/lib/server/business/analytics";
import { requireBizContext } from "@/lib/server/business/context";
import { buildInsights } from "@/lib/server/business/insights";
import { logoFor } from "@/lib/server/business/logos";
import { workspaceDisplay } from "@/lib/server/business/display-currency";
import { buildReport } from "@/lib/server/business/reports";

export const metadata = { title: "Analytics" };

type Raw = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (typeof v === "string" ? v.trim() : Array.isArray(v) ? (v[0] ?? "").trim() : "");
const PERIODS = [3, 6, 12, 24] as const;
const whole = (minor: number, currency: string) => formatMoney(Math.round(minor), currency, { whole: true });
const signed = (minor: number, currency: string) => `${minor > 0 ? "+" : minor < 0 ? "−" : ""}${whole(Math.abs(minor), currency)}`;

export default async function AnalyticsPage(props: { searchParams: Promise<Raw> }) {
  const ctx = await requireBizContext("/business/analytics");
  const sp = await props.searchParams;
  const fmt = ctx.workspace.dateFormat;
  const pref = ctx.workspace.defaultCurrency;

  const monthsRaw = Number(one(sp.months));
  const months = (PERIODS as readonly number[]).includes(monthsRaw) ? monthsRaw : 12;
  // The same report builder as /business/reports, so both pages agree on every figure.
  const monthStart = `${ctx.today.slice(0, 7)}-01`;
  const raw: Raw = {
    ...(months === 24 ? { range: "custom", from: addMonths(monthStart, -23), to: ctx.today } : { range: `last_${months}_months` }),
    currency: one(sp.currency),
    category: one(sp.category),
    department: one(sp.department),
    vendor: one(sp.vendor),
  };
  const display = await workspaceDisplay(ctx);
  const report = await buildReport(ctx, raw, { display });
  const { model, params, options } = report;
  const cur = report.chartCurrency;
  const { insights, changes } = await buildInsights(ctx, { model, display });
  const s = model.summary;

  const reportsHref = `/business/reports?${new URLSearchParams({
    range: months === 24 ? "custom" : `last_${months}_months`,
    ...(months === 24 ? { from: params.from, to: params.to } : {}),
    ...(params.currency ? { currency: params.currency } : {}),
    ...(params.category ? { category: params.category } : {}),
    ...(params.department ? { department: params.department } : {}),
    ...(params.vendor ? { vendor: params.vendor } : {}),
  }).toString()}`;

  if (model.subs.length === 0) {
    return (
      <>
        <PageHeader title="Analytics" crumbs={[{ label: "Overview", href: "/business/dashboard" }, { label: "Analytics" }]} />
        <Card>
          <EmptyState icon="chart" title="Nothing to analyse yet" action={<LinkButton href="/business/subscriptions/new" variant="primary" icon="plus" size="md">Add software</LinkButton>}>
            Analytics are built only from the subscriptions and payments your team records{params.category || params.department || params.vendor || params.currency ? " — and nothing matches these filters" : ""}.
          </EmptyState>
        </Card>
      </>
    );
  }

  // Trend (normalized run-rate) and recorded payments by month (actual).
  const trend = report.runRate.map((p) => ({
    label: formatMonth(p.month).replace(/ \d{4}$/, (y) => (p.month.endsWith("-01") || report.runRate.length <= 6 ? y : "")),
    value: p.totals[cur] ?? 0,
    display: `${whole(p.totals[cur] ?? 0, cur)}/mo`,
  }));
  const paymentRows: BarRow[] = report.paymentsByMonth.map((m) => ({ label: formatMonth(m.month), value: m.totals[cur] ?? 0, display: whole(m.totals[cur] ?? 0, cur), sub: m.count ? `· ${m.count} payment${m.count === 1 ? "" : "s"}` : undefined }));
  const paymentsRecorded = report.payments.length > 0;

  // Largest subscriptions, with their share of the run-rate in their currency.
  const monthlyByCurrency: CurrencyTotals = {};
  for (const x of model.subs) if (isRecurring(x) && monthlyEquivalent(x) !== null) addTo(monthlyByCurrency, x.currency, monthlyEquivalent(x)!);
  const largest = model.subs
    .filter((x) => isRecurring(x) && monthlyEquivalent(x) !== null)
    .sort((a, b) => Number(b.currency === cur) - Number(a.currency === cur) || monthlyEquivalent(b)! - monthlyEquivalent(a)!)
    .slice(0, 10);

  // Cost per seat (per-seat plans with a known price).
  const perSeat = model.subs
    .filter((x) => isRecurring(x) && x.pricingModel === "per_seat")
    .map((x) => ({ sub: x, seats: seatSummary(x) }))
    .filter((r) => r.seats.costPerSeatMonthly !== null)
    .sort((a, b) => Number(b.sub.currency === cur) - Number(a.sub.currency === cur) || b.seats.costPerSeatMonthly! - a.seats.costPerSeatMonthly!);

  // Upcoming commitments: renewal dates × current price, auto-renewing plans only.
  const windows = [3, 6, 12].map((n) => {
    const end = addMonths(ctx.today, n);
    const totals: CurrencyTotals = {};
    let renewals = 0;
    let unpriced = 0;
    let manual = 0;
    for (const r of report.commitments.rows) {
      const dates = r.dates.filter((d) => d <= end);
      if (!dates.length) continue;
      if (r.manual) {
        manual++;
        continue;
      }
      renewals += dates.length;
      if (r.sub.priceMinor === null) unpriced++;
      else addTo(totals, r.sub.currency, r.sub.priceMinor * dates.length);
    }
    return { months: n, end, totals, renewals, unpriced, manual };
  });
  const nextRenewals = report.commitments.rows.filter((r) => r.dates[0] <= addMonths(ctx.today, 3)).slice(0, 8);

  const groupRows = (groups: Group[], logoOf?: (g: Group) => string | null): BarRow[] =>
    groups
      .filter((g) => (g.totals[cur] ?? 0) > 0)
      .sort((a, b) => (b.totals[cur] ?? 0) - (a.totals[cur] ?? 0))
      .map((g) => ({ label: g.label, value: g.totals[cur]!, display: `${whole(g.totals[cur]!, cur)}/mo`, sub: `· ${g.count}`, ...(logoOf ? { logo: logoOf(g) } : {}) }));
  const vendorLogo = (g: Group): string | null => {
    if (g.key === "__none__") return null;
    const own = logoFor(g.label, null, null);
    if (own) return own;
    const tools = [...new Map(model.subs.filter((x) => x.vendorId === g.key).map((x) => [x.softwareId, x.logoSrc])).values()];
    return tools.length === 1 ? tools[0] : null;
  };

  const changeRows = changes.filter((c) => c.previous !== 0 || c.current !== 0);
  const otherCurrencies = totalsList(s.monthly).filter((t) => t.currency !== cur);

  return (
    <>
      <PageHeader
        title="Analytics"
        crumbs={[{ label: "Overview", href: "/business/dashboard" }, { label: "Analytics" }]}
        description={
          <>
            How spending changes over time, where it&apos;s concentrated and what&apos;s committed next — {formatIsoDate(params.from, fmt)} to {formatIsoDate(params.to, fmt)}, in{" "}
            <strong className="font-medium text-fg">{cur}</strong>.
            <FxNoteLine note={model.fx} dateFormat={fmt} className="mt-1.5" />
          </>
        }
        actions={
          <LinkButton href={reportsHref} icon="chart">
            Reports & CSV
          </LinkButton>
        }
      />

      <form method="get" action="/business/analytics" className="biz-card mb-4 flex flex-wrap items-end gap-3 px-4 py-3">
        <Control label="Period">
          <select name="months" defaultValue={String(months)} className="biz-select">
            {PERIODS.map((m) => (
              <option key={m} value={m}>
                Last {m} months
              </option>
            ))}
          </select>
        </Control>
        <Control label="Billed in">
          <select name="currency" defaultValue={params.currency ?? ""} className="biz-select">
            <option value="">Any currency</option>
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
          <Link href="/business/analytics" className={buttonClass("ghost", "sm", "h-9")}>
            Reset
          </Link>
        </div>
      </form>

      <ul className="mb-5 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] text-faint" aria-label="What the figures are based on">
        {(Object.keys(basisInfo) as InsightBasis[]).map((b) => (
          <li key={b} className="flex items-center gap-1.5">
            <BasisBadge basis={b} /> {basisInfo[b].explain}
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-1 gap-3 min-[460px]:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label="Monthly run-rate"
          icon="trending-up"
          tone="violet"
          value={<Money totals={s.monthly} preferred={pref} />}
          sub={<BasisBadge basis="normalized_estimate" />}
          chart={report.runRate.length > 1 ? <Sparkline values={report.runRate.map((p) => p.totals[cur] ?? 0)} label={`Monthly run-rate, ${cur}, ${months} months`} /> : undefined}
        />
        <Kpi label="Annualized run-rate" icon="chart" tone="blue" value={<Money totals={s.annualized} preferred={pref} />} sub={<span className="flex flex-wrap items-center gap-1.5"><BasisBadge basis="normalized_estimate" /> run-rate × 12</span>} />
        <Kpi
          label="Recorded payments"
          icon="coins"
          tone="green"
          value={totalsList(report.paymentsTotal).length ? <Money totals={report.paymentsTotal} preferred={pref} /> : "—"}
          sub={<span className="flex flex-wrap items-center gap-1.5"><BasisBadge basis="actual" /> {report.payments.length} in the period</span>}
        />
        <Kpi
          label="Committed, next 12 months"
          icon="calendar"
          tone="amber"
          value={totalsList(windows[2].totals).length ? <Money totals={windows[2].totals} preferred={pref} /> : "—"}
          sub={<span className="flex flex-wrap items-center gap-1.5"><BasisBadge basis="projection" /> {windows[2].renewals} renewals</span>}
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title={<SectionTitle basis="normalized_estimate">Monthly run-rate over time</SectionTitle>}
          description={`Recurring run-rate at each month's end, ${cur} — from start and end dates and recorded price changes.`}
        >
          <TrendChart points={trend} caption={`Monthly recurring run-rate, ${cur}, last ${months} months`} currency={cur} height={220} />
          {otherCurrencies.length > 0 && !params.currency && (
            <p className="mt-2 text-[12px] text-faint">
              Also billed in {otherCurrencies.map((t) => `${t.currency} (${whole(t.amount, t.currency)}/mo)`).join(", ")} — pick a currency above to chart it.
            </p>
          )}
        </Card>
        <Card title={<SectionTitle basis="actual">Recorded payments by month</SectionTitle>} description={`What your team logged as paid, ${cur}.`}>
          {paymentsRecorded ? (
            <BarList caption={`Recorded payments by month, ${cur}`} rows={paymentRows} valueHead="Paid" max={months} />
          ) : (
            <p className="text-[13px] text-muted">No payments recorded in this period. Record them on a subscription (or with a renewal outcome) to compare actual spending with the run-rate.</p>
          )}
        </Card>
      </div>

      <Card className="mt-5" title="Changes between periods" description="Run-rate changes need records that reach back past the earlier month; payment changes compare complete months and quarters.">
        {changeRows.length === 0 ? (
          <p className="text-[13px] text-muted">Not enough history to compare periods yet — subscriptions were added too recently, and no payments were recorded in the last two complete months or quarters.</p>
        ) : (
          <TableWrap>
            <table className="biz-table">
              <thead>
                <tr>
                  <th>Comparison</th>
                  <th>Basis</th>
                  <th className="num">Earlier</th>
                  <th className="num">Later</th>
                  <th className="num">Change</th>
                </tr>
              </thead>
              <tbody>
                {changeRows.map((c) => (
                  <tr key={`${c.id}-${c.currency}`}>
                    <td className="min-w-56">
                      {c.label}
                      <span className="block text-[12px] text-faint">{c.currency}</span>
                    </td>
                    <td>
                      <BasisBadge basis={c.basis} />
                    </td>
                    <td className="num">
                      {whole(c.previous, c.currency)}
                      <span className="block text-[11.5px] text-faint">{c.previousLabel}</span>
                    </td>
                    <td className="num">
                      {whole(c.current, c.currency)}
                      <span className="block text-[11.5px] text-faint">{c.currentLabel}</span>
                    </td>
                    <td className={`num font-medium ${c.change > 0 ? "text-[#c2410c]" : c.change < 0 ? "text-[color-mix(in_oklab,#1baf7a_70%,black)]" : ""}`}>
                      {signed(c.change, c.currency)}
                      <span className="block text-[11.5px] font-normal text-faint">{c.changePct === null ? "—" : `${c.changePct > 0 ? "+" : ""}${c.changePct.toFixed(0)}%`}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        )}
      </Card>

      <Card className="mt-5" title="Insights" description="Rule-based observations from your records — each with the figures behind it. No AI model and no usage data are involved.">
        {insights.length === 0 ? (
          <p className="text-[13px] text-muted">Nothing notable yet. Insights appear as you record prices, seats, renewal dates and payments.</p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {insights.map((i) => (
              <li key={i.id} className="rounded-xl border border-line px-4 py-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <BasisBadge basis={i.basis} />
                  {i.priority === 1 && <Pill tone="warn">Act soon</Pill>}
                </div>
                <p className="mt-1.5 text-[14px] font-semibold leading-snug text-fg">{i.title}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{i.detail}</p>
                {i.evidence.length > 0 && (
                  <dl className="mt-2 space-y-0.5 text-[12px]">
                    {i.evidence.map((e, n) => (
                      <div key={n} className="flex justify-between gap-3">
                        <dt className="min-w-0 truncate text-faint">{e.label}</dt>
                        <dd className="tabular shrink-0 text-fg">{e.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {i.href && i.href !== "/business/analytics" && (
                  <Link href={i.href} className="mt-2 inline-block text-[12.5px] font-medium text-accent-ink hover:underline">
                    Open →
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card title={<SectionTitle basis="normalized_estimate">Largest subscriptions</SectionTitle>} description="Share of the monthly run-rate in each subscription's currency.">
          <TableWrap>
            <table className="biz-table">
              <thead>
                <tr>
                  <th>Software</th>
                  <th className="num">Monthly</th>
                  <th className="num">Annualized</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {largest.map((x) => {
                  const share = monthlyByCurrency[x.currency] ? (monthlyEquivalent(x)! / monthlyByCurrency[x.currency]) * 100 : null;
                  return (
                    <tr key={x.id}>
                      <td>
                        <Link href={`/business/subscriptions/${x.id}`} className="hover:underline">
                          <SoftwareName name={x.softwareName} src={x.logoSrc} sub={`${x.planName ?? intervalLabel(x)} · ${x.currency}`} size={28} />
                        </Link>
                      </td>
                      <td className="num">{formatMoney(Math.round(monthlyEquivalent(x)!), x.currency)}</td>
                      <td className="num">{formatMoney(Math.round(annualized(x)!), x.currency)}</td>
                      <td className="min-w-36">
                        <Meter value={share} label={`${x.softwareName} share of ${x.currency} run-rate`} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableWrap>
          {s.missingPrice > 0 && <p className="mt-2 text-[12px] text-faint">{s.missingPrice} active subscription{s.missingPrice === 1 ? "" : "s"} without a price aren&apos;t included.</p>}
        </Card>

        <Card title={<SectionTitle basis="normalized_estimate">Cost per seat</SectionTitle>} description="Per-seat plans with a known price: monthly equivalent ÷ purchased seats.">
          {perSeat.length === 0 ? (
            <p className="text-[13px] text-muted">No per-seat plan with a price and purchased seats yet.</p>
          ) : (
            <TableWrap>
              <table className="biz-table">
                <thead>
                  <tr>
                    <th>Software</th>
                    <th className="num">Seats</th>
                    <th className="num">Per seat /mo</th>
                    <th className="num">Unassigned /mo</th>
                  </tr>
                </thead>
                <tbody>
                  {perSeat.map(({ sub: x, seats }) => (
                    <tr key={x.id}>
                      <td>
                        <Link href={`/business/licenses/${x.id}`} className="hover:underline">
                          <SoftwareName name={x.softwareName} src={x.logoSrc} sub={x.planName ?? intervalLabel(x)} size={28} />
                        </Link>
                      </td>
                      <td className="num">
                        {seats.assigned}/{seats.purchased}
                      </td>
                      <td className="num">{formatMoney(Math.round(seats.costPerSeatMonthly!), x.currency)}</td>
                      <td className="num">{seats.unusedMonthly ? formatMoney(Math.round(seats.unusedMonthly), x.currency) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          )}
          <p className="mt-2 text-[12px] text-faint">Seats count as used when they&apos;re assigned or reported — Saver Option doesn&apos;t measure product usage.</p>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card title={<SectionTitle basis="normalized_estimate">By vendor</SectionTitle>} description={`Monthly equivalent, ${cur}`}>
          {groupRows(model.byVendor).length ? <BarList caption="Spending by vendor" rows={groupRows(model.byVendor, vendorLogo)} max={6} /> : <p className="text-[13px] text-faint">No priced subscriptions in {cur}.</p>}
        </Card>
        <Card title={<SectionTitle basis="normalized_estimate">By category</SectionTitle>} description={`Monthly equivalent, ${cur}`}>
          {groupRows(model.byCategory).length ? <BarList caption="Spending by category" rows={groupRows(model.byCategory)} max={6} /> : <p className="text-[13px] text-faint">No priced subscriptions in {cur}.</p>}
        </Card>
        <Card title={<SectionTitle basis="normalized_estimate">By department</SectionTitle>} description={`Monthly equivalent, ${cur}`}>
          {groupRows(model.byDepartment).length ? <BarList caption="Spending by department" rows={groupRows(model.byDepartment)} max={6} /> : <p className="text-[13px] text-faint">No priced subscriptions in {cur}.</p>}
        </Card>
      </div>

      <Card className="mt-5" title={<SectionTitle basis="projection">Upcoming commitments</SectionTitle>} description="Each auto-renewing plan's renewal dates in the window × its current price. Plans set to renew manually aren't counted.">
        <div className="grid gap-3 sm:grid-cols-3">
          {windows.map((w) => (
            <div key={w.months} className="rounded-xl border border-line px-4 py-3">
              <p className="text-[12.5px] font-medium text-muted">Next {w.months} months</p>
              <p className="tabular mt-1 text-[1.2rem] font-semibold text-heading">
                <Money totals={w.totals} preferred={pref} empty="Nothing" />
              </p>
              <p className="mt-0.5 text-[11.5px] text-faint">
                {w.renewals} renewal{w.renewals === 1 ? "" : "s"} to {formatIsoDate(w.end, fmt)}
                {w.unpriced ? ` · ${w.unpriced} without a price` : ""}
                {w.manual ? ` · ${w.manual} manual` : ""}
              </p>
            </div>
          ))}
        </div>
        {nextRenewals.length > 0 && (
          <TableWrap className="mt-4">
            <table className="biz-table">
              <thead>
                <tr>
                  <th>Next 3 months</th>
                  <th>Renews</th>
                  <th className="num">At current price</th>
                </tr>
              </thead>
              <tbody>
                {nextRenewals.map((r) => (
                  <tr key={r.sub.id}>
                    <td>
                      <Link href={`/business/subscriptions/${r.sub.id}`} className="flex items-center gap-2.5 hover:underline">
                        <SoftwareLogo name={r.sub.softwareName} src={r.sub.logoSrc} size={24} />
                        <span className="font-medium">{r.sub.softwareName}</span>
                        {r.manual && <Pill>Manual</Pill>}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap">{r.dates.filter((d) => d <= addMonths(ctx.today, 3)).map((d) => formatIsoDate(d, fmt)).join(", ")}</td>
                    <td className="num">{r.sub.priceMinor === null ? "—" : formatMoney(r.sub.priceMinor, r.sub.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        )}
      </Card>

      <p className="mt-5 text-[12px] text-faint">
        Every figure comes from what your team recorded. Exchange rates aren&apos;t applied, so currencies are never added together. For tabular reports and CSV exports, open{" "}
        <Link href={reportsHref} className="underline underline-offset-2 hover:text-fg">
          Reports
        </Link>
        .
      </p>
    </>
  );
}

function SectionTitle({ basis, children }: { basis: InsightBasis; children: ReactNode }) {
  return (
    <span className="flex flex-wrap items-center gap-2">
      {children}
      <BasisBadge basis={basis} />
    </span>
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
