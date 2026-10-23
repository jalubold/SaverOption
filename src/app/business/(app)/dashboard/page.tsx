import Link from "next/link";
import { createDemoAction } from "@/app/business/actions/workspace";
import { BarList, StackedBar, TrendChart } from "@/components/business/charts";
import { Card, EmptyState, Kpi, LinkButton, Money, PageHeader, Pill, StatusPill, TableWrap } from "@/components/business/ui";
import { Icon } from "@/components/ui/icon";
import { buttonClass } from "@/components/ui/primitives";
import { annualized, daysBetween, formatIsoDate, formatMonth, formatMoney, intervalLabel, monthlyEquivalent, totalsList, type CurrencyTotals } from "@/lib/business/calc";
import { categoryLabels, opportunityTypeLabels, subscriptionStatusLabels } from "@/lib/business/constants";
import { can } from "@/lib/business/permissions";
import { buildSpendModel, type Group } from "@/lib/server/business/analytics";
import { requireBizContext } from "@/lib/server/business/context";
import { getActivity } from "@/lib/server/business/data";

export const metadata = { title: "Overview" };

const whole = (minor: number, currency: string) => formatMoney(Math.round(minor), currency, { whole: true });

function chartRows(groups: Group[], currency: string, href?: (key: string) => string) {
  return groups
    .filter((g) => (g.totals[currency] ?? 0) > 0)
    .sort((a, b) => (b.totals[currency] ?? 0) - (a.totals[currency] ?? 0))
    .map((g) => ({ label: g.label, value: g.totals[currency]!, display: `${whole(g.totals[currency]!, currency)}/mo`, sub: `· ${g.count} ${g.count === 1 ? "subscription" : "subscriptions"}`, href: href?.(g.key) }));
}

function others(totals: CurrencyTotals, currency: string) {
  return totalsList(totals).filter((t) => t.currency !== currency);
}

export default async function DashboardPage() {
  const ctx = await requireBizContext("/business/dashboard");
  const model = await buildSpendModel(ctx);
  const activity = await getActivity(ctx.workspace.id, { limit: 10 });
  const fmt = ctx.workspace.dateFormat;
  const pref = ctx.workspace.defaultCurrency;
  const canAdd = can(ctx.role, "records.manage");
  const s = model.summary;

  if (model.subs.length === 0 && model.software.length === 0) {
    return (
      <>
        <PageHeader title="Overview" description={`Software spending for ${ctx.workspace.name}.`} />
        <Card>
          <EmptyState
            icon="layers"
            title="Add your first subscription"
            action={
              <div className="flex flex-wrap justify-center gap-2">
                {canAdd && (
                  <Link href="/business/subscriptions/new" className={buttonClass("primary", "md")}>
                    <Icon name="plus" size={15} /> Add software
                  </Link>
                )}
                {!ctx.memberships.some((m) => m.isDemo) && (
                  <form action={createDemoAction}>
                    <button type="submit" className={buttonClass("secondary", "md")}>
                      Explore the demo workspace
                    </button>
                  </form>
                )}
              </div>
            }
          >
            The dashboard is built only from what your team records: add a tool with its price, billing interval and renewal date, and spending, renewals, seats and
            savings appear here. Nothing is estimated before then.
          </EmptyState>
        </Card>
      </>
    );
  }

  const chartCurrency = model.currencies.includes(pref) || model.currencies.length === 0 ? pref : model.currencies[0];
  const trend = model.runRate.map((p) => ({ label: formatMonth(p.month).replace(/ \d{4}$/, (y) => (p.month.endsWith("-01") ? y : "")), value: p.totals[chartCurrency] ?? 0, display: `${whole(p.totals[chartCurrency] ?? 0, chartCurrency)}/mo` }));
  const prev = model.runRate.at(-2)?.totals[chartCurrency] ?? 0;
  const cur = model.runRate.at(-1)?.totals[chartCurrency] ?? 0;
  const delta = cur - prev;
  const otherMonthly = others(s.monthly, chartCurrency);
  const openOpps = model.opportunities
    .filter((o) => o.status === "open")
    .sort((a, b) => (b.estMonthlyMinor ?? -1) - (a.estMonthlyMinor ?? -1))
    .slice(0, 5);

  return (
    <>
      <PageHeader
        title="Overview"
        description={`As of ${formatIsoDate(ctx.today, fmt)}. Totals are kept per currency — nothing is converted.`}
        actions={
          <>
            <LinkButton href="/business/reports" icon="chart">
              Reports
            </LinkButton>
            {canAdd && (
              <LinkButton href="/business/subscriptions/new" variant="primary" icon="plus">
                Add software
              </LinkButton>
            )}
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Kpi
          label="Monthly software spend"
          icon="coins"
          value={<Money totals={s.monthly} preferred={pref} />}
          sub={
            model.historyReliable && model.currencies.length === 1 && delta !== 0
              ? `${delta > 0 ? "+" : "−"}${whole(Math.abs(delta), chartCurrency)} vs ${formatMonth(model.runRate.at(-2)!.month)}`
              : s.missingPrice
                ? `${s.missingPrice} without a price not included`
                : "Monthly equivalent of active plans"
          }
          href="/business/subscriptions?status=active"
        />
        <Kpi label="Annualized software spend" icon="trending-up" value={<Money totals={s.annualized} preferred={pref} />} sub="Run-rate × 12, not cash spent" href="/business/reports" />
        <Kpi label="Active subscriptions" icon="layers" value={s.activeCount} sub={s.trialCount ? `+ ${s.trialCount} in trial` : undefined} href="/business/subscriptions?status=active" />
        <Kpi label="Upcoming renewals" icon="calendar" value={s.upcomingRenewals} sub={s.missingRenewalDate ? `Next 30 days · ${s.missingRenewalDate} without a date` : "Next 30 days"} href="/business/renewals" />
        <Kpi
          label="Est. potential savings"
          icon="piggy"
          value={totalsList(model.potential.annual).length ? <span><Money totals={model.potential.annual} preferred={pref} /><span className="text-[13px] font-normal text-faint"> /yr</span></span> : "—"}
          sub={`${model.potential.counted} with an estimate${model.potential.withoutEstimate ? ` · ${model.potential.withoutEstimate} to check` : ""}`}
          href="/business/savings"
        />
        <Kpi
          label="Unused licenses"
          icon="key"
          value={model.licenses.tracked ? model.licenses.available : "—"}
          sub={totalsList(model.licenses.unusedMonthly).length ? <span>≈ <Money totals={model.licenses.unusedMonthly} preferred={pref} className="!inline" /> /mo</span> : model.licenses.tracked ? `${Math.round(model.licenses.utilization ?? 0)}% utilization` : "No seats tracked yet"}
          href="/business/licenses"
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card title="Monthly spending trend" description={`Recurring run-rate at each month's end, in ${chartCurrency} — from start dates and recorded price changes.`} className="lg:col-span-2">
          <TrendChart points={trend} caption={`Monthly recurring run-rate, ${chartCurrency}, last 12 months`} currency={chartCurrency} />
          {otherMonthly.length > 0 && (
            <p className="mt-2 text-[12px] text-faint">Also billed in {otherMonthly.map((t) => `${t.currency} (${whole(t.amount, t.currency)}/mo)`).join(", ")} — see Reports to chart those.</p>
          )}
        </Card>
        <Card title="Billing intervals" description={`Monthly equivalent by billing interval, ${chartCurrency}.`}>
          <StackedBar
            caption="Monthly equivalent by billing interval"
            segments={model.byInterval.map((g) => ({ label: g.label, value: g.totals[chartCurrency] ?? 0, display: `${whole(g.totals[chartCurrency] ?? 0, chartCurrency)}/mo` }))}
          />
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card title="Spending by vendor" description={`Monthly equivalent, ${chartCurrency}`}>
          {chartRows(model.byVendor, chartCurrency).length ? <BarList caption="Spending by vendor" rows={chartRows(model.byVendor, chartCurrency)} /> : <p className="text-[13px] text-faint">No priced subscriptions in {chartCurrency}.</p>}
        </Card>
        <Card title="Spending by category" description={`Monthly equivalent, ${chartCurrency}`}>
          {chartRows(model.byCategory, chartCurrency).length ? (
            <BarList caption="Spending by category" rows={chartRows(model.byCategory, chartCurrency, (k) => `/business/subscriptions?category=${k}`)} />
          ) : (
            <p className="text-[13px] text-faint">No priced subscriptions in {chartCurrency}.</p>
          )}
        </Card>
        <Card title="Spending by department" description={`Monthly equivalent, ${chartCurrency}`}>
          {chartRows(model.byDepartment, chartCurrency).length ? (
            <BarList caption="Spending by department" rows={chartRows(model.byDepartment, chartCurrency, (k) => (k === "__none__" ? "/business/subscriptions?department=none" : `/business/subscriptions?department=${k}`))} />
          ) : (
            <p className="text-[13px] text-faint">No priced subscriptions in {chartCurrency}.</p>
          )}
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card title="Needs attention" description="Upcoming high-cost renewals, missing details, unused seats and potential overlap." className="lg:col-span-2">
          {model.attention.length === 0 ? (
            <p className="text-[13.5px] text-muted">Nothing needs attention right now.</p>
          ) : (
            <ul className="divide-y divide-line">
              {model.attention.slice(0, 7).map((a, i) => (
                <li key={i}>
                  <Link href={a.href} className="-mx-2 flex items-start gap-3 rounded-lg px-2 py-2.5 hover:bg-subtle">
                    <Icon name={a.kind === "renewal_soon" || a.kind === "deadline_soon" ? "calendar" : a.kind === "unused_seats" ? "key" : a.kind === "overlap" ? "layers" : "alert"} size={16} className="mt-0.5 text-warn" />
                    <span className="min-w-0">
                      <span className="block text-[13.5px] font-medium text-fg">{a.title}</span>
                      <span className="block text-[12.5px] text-muted">{a.detail}</span>
                    </span>
                    <Icon name="chevron-right" size={14} className="ml-auto mt-1 text-faint" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {model.attention.length > 7 && <p className="mt-2 text-[12px] text-faint">+ {model.attention.length - 7} more.</p>}
        </Card>
        <Card title="Subscriptions by status">
          <BarList
            caption="Subscriptions by status"
            valueHead="Subscriptions"
            rows={model.byStatus
              .sort((a, b) => b.count - a.count)
              .map((g) => ({ label: g.label, value: g.count, display: String(g.count), href: `/business/subscriptions?status=${g.status}` }))}
          />
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card title="Upcoming renewals" description="Next 30 days" action={<LinkButton href="/business/renewals">All renewals</LinkButton>}>
          {model.upcoming.length === 0 ? (
            <p className="text-[13.5px] text-muted">No renewals in the next 30 days.</p>
          ) : (
            <TableWrap>
              <table className="biz-table">
                <thead>
                  <tr>
                    <th>Software</th>
                    <th>Renews</th>
                    <th className="num">Expected</th>
                    <th>Billing</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {model.upcoming.slice(0, 8).map((r) => (
                    <tr key={r.id}>
                      <td>
                        <Link href={`/business/subscriptions/${r.id}`} className="font-medium hover:underline">
                          {r.softwareName}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap">
                        {formatIsoDate(r.nextRenewalDate, fmt)} <span className="text-faint">· {daysBetween(ctx.today, r.nextRenewalDate!)}d</span>
                      </td>
                      <td className="num">{r.priceMinor !== null ? formatMoney(r.priceMinor, r.currency) : "—"}</td>
                      <td>{intervalLabel(r)}</td>
                      <td>
                        <StatusPill status={r.status} label={subscriptionStatusLabels[r.status]} />
                        {!r.autoRenew && <Pill className="ml-1">Manual</Pill>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          )}
        </Card>
        <Card title="Highest-cost software" action={<LinkButton href="/business/subscriptions?sort=cost">All subscriptions</LinkButton>}>
          {model.highestCost.length === 0 ? (
            <p className="text-[13.5px] text-muted">No priced active subscriptions yet.</p>
          ) : (
            <TableWrap>
              <table className="biz-table">
                <thead>
                  <tr>
                    <th>Software</th>
                    <th className="num">Monthly</th>
                    <th className="num">Annualized</th>
                    <th>Category</th>
                    <th>Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {model.highestCost.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <Link href={`/business/subscriptions/${r.id}`} className="font-medium hover:underline">
                          {r.softwareName}
                        </Link>
                      </td>
                      <td className="num">{formatMoney(Math.round(monthlyEquivalent(r)!), r.currency)}</td>
                      <td className="num">{formatMoney(Math.round(annualized(r)!), r.currency)}</td>
                      <td className="whitespace-nowrap">{categoryLabels[r.category]}</td>
                      <td className="whitespace-nowrap">{r.ownerName ?? <span className="text-faint">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          )}
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card title="Savings opportunities" description="Estimates from your own prices and seats; potential, not confirmed." action={<LinkButton href="/business/savings">Savings center</LinkButton>}>
          {openOpps.length === 0 ? (
            <p className="text-[13.5px] text-muted">No open opportunities. They appear as the rules find unused seats, overlap, renewals to review and more.</p>
          ) : (
            <ul className="divide-y divide-line">
              {openOpps.map((o) => (
                <li key={o.id} className="py-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/business/savings?focus=${o.id}#${o.id}`} className="min-w-0 text-[13.5px] font-medium text-fg hover:underline">
                      {o.title}
                    </Link>
                    <span className="tabular shrink-0 text-[13px] font-medium">{o.estMonthlyMinor !== null && o.currency ? `${formatMoney(o.estMonthlyMinor * 12, o.currency, { whole: true })}/yr` : <span className="text-faint">No estimate</span>}</span>
                  </div>
                  <p className="mt-0.5 text-[12.5px] text-muted">
                    <Pill tone="outline" className="mr-1.5">{opportunityTypeLabels[o.type]}</Pill>
                    {o.recommendedAction}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="Recent activity" action={<LinkButton href="/business/reports#activity">Audit log</LinkButton>}>
          {activity.length === 0 ? (
            <p className="text-[13.5px] text-muted">No activity yet.</p>
          ) : (
            <ul className="space-y-2.5">
              {activity.map((a) => (
                <li key={a.id} className="flex gap-3 text-[13px]">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-line-strong" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="text-fg">{a.summary}</span>
                    <span className="block text-[12px] text-faint">
                      {a.actorName ?? "Someone"} · {formatIsoDate(a.createdAt.toISOString().slice(0, 10), fmt)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
