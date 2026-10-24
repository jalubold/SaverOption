import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { createDemoAction } from "@/app/business/actions/workspace";
import { BarList, DonutChart, RadialGauge, RenewalTimeline, Sparkline, StackedBar, TrendChart, type TimelineItem } from "@/components/business/charts";
import { Aurora, SpotlightGroup } from "@/components/business/motion";
import { LogoStack, SoftwareLogo, SoftwareName } from "@/components/business/software-logo";
import { Card, EmptyState, IconTile, Kpi, LinkButton, Meter, Money, Pill, StatusPill, TableWrap, type KpiTone } from "@/components/business/ui";
import { Icon, type IconProps } from "@/components/ui/icon";
import { buttonClass, cn } from "@/components/ui/primitives";
import {
  annualized,
  daysBetween,
  formatIsoDate,
  formatMonth,
  formatMoney,
  intervalLabel,
  isLive,
  isRecurring,
  monthlyEquivalent,
  seatSummary,
  totalsList,
  type CurrencyTotals,
} from "@/lib/business/calc";
import { categoryLabels, opportunityTypeLabels, subscriptionStatusLabels } from "@/lib/business/constants";
import { convertedParts, convertTotals, rateText, type ConvertedTotal } from "@/lib/business/fx";
import { can } from "@/lib/business/permissions";
import { buildSpendModel, type AttentionItem, type Group } from "@/lib/server/business/analytics";
import { displayName, requireBizContext } from "@/lib/server/business/context";
import { getFxRates } from "@/lib/server/business/fx";
import { getActivity, type Subscription } from "@/lib/server/business/data";
import { logoFor } from "@/lib/server/business/logos";

export const metadata = { title: "Overview" };

const TIMELINE_DAYS = 63;

const whole = (minor: number, currency: string) => formatMoney(Math.round(minor), currency, { whole: true });

function chartRows(groups: Group[], currency: string, opts: { href?: (key: string) => string; logo?: (key: string) => string | null } = {}) {
  return groups
    .filter((g) => (g.totals[currency] ?? 0) > 0)
    .sort((a, b) => (b.totals[currency] ?? 0) - (a.totals[currency] ?? 0))
    .map((g) => ({
      label: g.label,
      value: g.totals[currency]!,
      display: `${whole(g.totals[currency]!, currency)}/mo`,
      sub: `· ${g.count} ${g.count === 1 ? "subscription" : "subscriptions"}`,
      href: opts.href?.(g.key),
      logo: opts.logo?.(g.key),
    }));
}

function others(totals: CurrencyTotals, currency: string) {
  return totalsList(totals).filter((t) => t.currency !== currency);
}

/** One entry per tool, most expensive first (for logo rows). */
function topTools(subs: Subscription[], pref: string) {
  const seen = new Set<string>();
  return subs
    .filter((s) => isRecurring(s))
    .sort((a, b) => Number(b.currency === pref) - Number(a.currency === pref) || (monthlyEquivalent(b) ?? -1) - (monthlyEquivalent(a) ?? -1))
    .filter((s) => (seen.has(s.softwareId) ? false : (seen.add(s.softwareId), true)))
    .map((s) => ({ name: s.softwareName, src: s.logoSrc }));
}

const attentionIcon: Record<AttentionItem["kind"], IconProps["name"]> = {
  renewal_soon: "calendar",
  deadline_soon: "clock",
  missing_date: "calendar",
  missing_price: "coins",
  unused_seats: "key",
  no_owner: "user",
  overlap: "layers",
};
const attentionTone: Record<AttentionItem["kind"], KpiTone> = {
  renewal_soon: "orange",
  deadline_soon: "amber",
  missing_date: "blue",
  missing_price: "blue",
  unused_seats: "orange",
  no_owner: "violet",
  overlap: "pink",
};

const activityIcon: Record<string, IconProps["name"]> = {
  subscription: "layers",
  software: "box",
  seats: "key",
  savings: "piggy",
  renewal: "calendar",
  payment: "coins",
  member: "users",
  department: "building",
  person: "user",
  workspace: "gear",
};

export default async function DashboardPage() {
  const ctx = await requireBizContext("/business/dashboard");
  const model = await buildSpendModel(ctx);
  const activity = await getActivity(ctx.workspace.id, { limit: 8 });
  const fmt = ctx.workspace.dateFormat;
  const pref = ctx.workspace.defaultCurrency;
  const canAdd = can(ctx.role, "records.manage");
  const s = model.summary;
  const firstName = displayName(ctx.user).split(/\s+/)[0];

  if (model.subs.length === 0 && model.software.length === 0) {
    return (
      <>
        <section className="biz-card biz-hero so-grain theme-dark mb-5 px-5 py-6 text-fg sm:px-7">
          <Aurora />
          <div className="relative z-10">
            <p className="text-[12.5px] font-medium text-faint">{ctx.workspace.name}</p>
            <h1 className="mt-1 text-[26px] font-semibold leading-tight tracking-tight text-heading">Overview</h1>
            <p className="mt-2 max-w-xl text-[14px] text-muted">Welcome, {firstName}. Add the tools your team pays for and this page fills in with spending, renewals, seats and savings.</p>
          </div>
        </section>
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
  const showDelta = model.historyReliable && delta !== 0;
  const otherMonthly = others(s.monthly, chartCurrency);
  const tools = topTools(model.subs, pref);
  const vendorCount = model.byVendor.filter((g) => g.key !== "__none__").length;

  // Logos for vendor rows: the vendor's own mark when it's a known tool, or its only tool's logo.
  const vendorTools = new Map<string, Map<string, string | null>>();
  for (const sub of model.subs) {
    const key = sub.vendorId ?? "__none__";
    if (!vendorTools.has(key)) vendorTools.set(key, new Map());
    vendorTools.get(key)!.set(sub.softwareId, sub.logoSrc);
  }
  const vendorLogo = (key: string) => {
    const g = model.byVendor.find((v) => v.key === key);
    const own = g && key !== "__none__" ? logoFor(g.label, null, null) : null;
    if (own) return own;
    const toolsOf = vendorTools.get(key);
    return toolsOf && toolsOf.size === 1 ? [...toolsOf.values()][0] : null;
  };
  const vendorRows = chartRows(model.byVendor, chartCurrency, { logo: vendorLogo });
  const categoryRows = chartRows(model.byCategory, chartCurrency, { href: (k) => `/business/subscriptions?category=${k}` });
  const departmentRows = chartRows(model.byDepartment, chartCurrency, { href: (k) => (k === "__none__" ? "/business/subscriptions?department=none" : `/business/subscriptions?department=${k}`) });

  const timeline: TimelineItem[] = [];
  for (const sub of model.subs) {
    if (!isLive(sub)) continue;
    const amount = sub.priceMinor !== null ? formatMoney(sub.priceMinor, sub.currency) : null;
    if (sub.nextRenewalDate) {
      const d = daysBetween(ctx.today, sub.nextRenewalDate);
      if (d >= 0 && d <= TIMELINE_DAYS)
        timeline.push({ id: sub.id, name: sub.softwareName, logo: sub.logoSrc, date: sub.nextRenewalDate, dateLabel: formatIsoDate(sub.nextRenewalDate, fmt), daysLeft: d, amount, href: `/business/subscriptions/${sub.id}`, kind: "renewal" });
    }
    if (sub.cancellationDeadline && sub.autoRenew) {
      const d = daysBetween(ctx.today, sub.cancellationDeadline);
      if (d >= 0 && d <= TIMELINE_DAYS)
        timeline.push({ id: sub.id, name: sub.softwareName, logo: sub.logoSrc, date: sub.cancellationDeadline, dateLabel: formatIsoDate(sub.cancellationDeadline, fmt), daysLeft: d, amount, href: `/business/subscriptions/${sub.id}`, kind: "deadline" });
    }
  }
  const renewalsInWindow = timeline.filter((t) => t.kind === "renewal");
  const renewalTotals: CurrencyTotals = {};
  for (const t of renewalsInWindow) {
    const sub = model.subs.find((x) => x.id === t.id)!;
    if (sub.priceMinor !== null) renewalTotals[sub.currency] = (renewalTotals[sub.currency] ?? 0) + sub.priceMinor;
  }

  const logoById = new Map(model.subs.map((x) => [x.id, { name: x.softwareName, logo: x.logoSrc }]));
  const softwareById = new Map(model.software.map((x) => [x.id, { name: x.name, logo: x.logoSrc }]));
  const oppSoftware = (o: { subscriptionId: string | null; softwareId: string | null }) => (o.subscriptionId && logoById.get(o.subscriptionId)) || (o.softwareId && softwareById.get(o.softwareId)) || null;
  const openOpps = model.opportunities
    .filter((o) => o.status === "open")
    .sort((a, b) => (b.estMonthlyMinor ?? -1) - (a.estMonthlyMinor ?? -1));
  const potentialAnnual = model.potential.annual[chartCurrency] ?? 0;
  const realizedAnnual = model.realized[chartCurrency] ?? 0;

  const seatRows = model.subs
    .filter((x) => isLive(x))
    .map((x) => ({ sub: x, seats: seatSummary(x) }))
    .filter((r) => r.seats.purchased)
    .sort((a, b) => (b.seats.available ?? 0) - (a.seats.available ?? 0))
    .slice(0, 4);

  const activityLogo = (entityType: string | null, entityId: string | null) => (entityType === "subscription" && entityId ? logoById.get(entityId) : entityType === "software" && entityId ? softwareById.get(entityId) : null) ?? null;

  // One headline figure: other currencies are converted into the default one at the ECB reference rate
  // (shown with the rate and date); without rates they're listed beside it instead.
  const [heroMain, ...heroRest] = totalsList(s.monthly, pref);
  const foreign = [s.monthly, s.annualized, renewalTotals].some((t) => Object.entries(t).some(([c, v]) => c !== pref && v !== 0));
  const fx = foreign ? await getFxRates() : null;
  const conv = { monthly: convertTotals(s.monthly, pref, fx), annualized: convertTotals(s.annualized, pref, fx), renewing: convertTotals(renewalTotals, pref, fx) };
  return (
    <>
      {/* ── Hero: this month's run-rate at a glance ─────────────────────────── */}
      <section className="biz-card biz-hero so-grain theme-dark so-rise px-5 py-6 text-fg sm:px-7 sm:py-7">
        <Aurora />
        <span aria-hidden="true" className="so-shine pointer-events-none absolute inset-0 rounded-[inherit]" />
        <div className="relative z-10 grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:items-end">
          <div className="min-w-0">
            <p className="text-[12.5px] font-medium text-faint">
              {ctx.workspace.name} · As of {formatIsoDate(ctx.today, fmt)}
            </p>
            <h1 className="mt-1 text-[26px] font-semibold leading-tight tracking-tight text-heading">Overview</h1>
            <p className="mt-6 text-[12.5px] font-medium text-muted">Monthly software spend</p>
            <div className="so-ink tabular mt-1 w-fit text-[2.35rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.75rem]">
              {conv.monthly ? formatMoney(conv.monthly.amount, pref) : heroMain ? formatMoney(heroMain.amount, heroMain.currency) : "—"}
            </div>
            {conv.monthly ? (
              <p className="mt-1.5 text-[12.5px] text-muted">
                Includes <span className="tabular font-medium text-fg">{convertedParts(conv.monthly)}</span>/mo converted at the ECB reference rate of{" "}
                {formatIsoDate(conv.monthly.date, fmt)} ({rateText(conv.monthly)})
              </p>
            ) : (
              heroRest.length > 0 && (
                <p className="mt-1.5 text-[12.5px] text-muted">
                  Plus <span className="tabular font-medium text-fg">{heroRest.map((t) => formatMoney(t.amount, t.currency)).join(" + ")}</span>/mo billed in{" "}
                  {heroRest.map((t) => t.currency).join(" and ")} — exchange rates unavailable right now, so not converted
                </p>
              )
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[12.5px]">
              {showDelta && (
                <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium", delta > 0 ? "bg-[#eb6834]/20 text-[#ffb08a]" : "bg-[#1baf7a]/20 text-[#7be0b6]")}>
                  <Icon name="trending-up" size={13} className={delta < 0 ? "-scale-y-100" : undefined} />
                  {delta > 0 ? "+" : "−"}
                  {whole(Math.abs(delta), chartCurrency)} vs {formatMonth(model.runRate.at(-2)!.month)}
                </span>
              )}
              {s.missingPrice > 0 && (
                <Link href="/business/subscriptions?status=active" className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-muted hover:text-fg">
                  <Icon name="info" size={13} /> {s.missingPrice} without a price not included
                </Link>
              )}
              {!showDelta && s.missingPrice === 0 && <span className="text-faint">Monthly equivalent of active plans</span>}
            </div>
            <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-[13px]">
              <div>
                <dt className="text-faint">Annualized software spend</dt>
                <dd className="tabular mt-0.5 text-[15px] font-semibold text-heading">
                  <ConvertedMoney c={conv.annualized} fallback={<Money totals={s.annualized} preferred={pref} />} />
                </dd>
                <dd className="text-[11.5px] text-faint">Run-rate × 12, not cash spent</dd>
              </div>
              <div>
                <dt className="text-faint">Renewing in 9 weeks</dt>
                <dd className="tabular mt-0.5 text-[15px] font-semibold text-heading">
                  <ConvertedMoney c={conv.renewing} fallback={<Money totals={renewalTotals} preferred={pref} empty="Nothing" />} />
                </dd>
                <dd className="text-[11.5px] text-faint">
                  {renewalsInWindow.length} renewal{renewalsInWindow.length === 1 ? "" : "s"}, list prices
                </dd>
              </div>
            </dl>
          </div>
          <div className="so-rise min-w-0 rounded-2xl border border-white/10 bg-white/[0.05] p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] backdrop-blur-md" style={{ "--d": "250ms" } as CSSProperties}>
            <div className="flex items-baseline justify-between gap-2 text-[12px]">
              <span className="font-medium text-muted">12-month run-rate · {chartCurrency}</span>
              <span className="tabular text-faint">{whole(cur, chartCurrency)}/mo now</span>
            </div>
            <div className="mt-2">
              <Sparkline values={model.runRate.map((p) => p.totals[chartCurrency] ?? 0)} label={`Monthly run-rate over the last 12 months, ${chartCurrency}`} tone="light" height={56} />
            </div>
            <div className="mt-1 flex justify-between text-[10.5px] text-faint">
              <span>{formatMonth(model.runRate[0]!.month)}</span>
              <span>{formatMonth(model.runRate.at(-1)!.month)}</span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
              <span className="text-[12.5px] text-muted">
                <strong className="font-semibold text-heading">{s.activeCount}</strong> active · <strong className="font-semibold text-heading">{vendorCount}</strong> vendor{vendorCount === 1 ? "" : "s"}
              </span>
              {tools.length > 0 && (
                <span className="[&_.ring-surface]:ring-[#1a1530]">
                  <LogoStack items={tools} max={6} size={26} />
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="relative z-10 mt-6 flex flex-wrap gap-2">
          {canAdd && (
            <LinkButton href="/business/subscriptions/new" variant="primary" icon="plus">
              Add software
            </LinkButton>
          )}
          <LinkButton href="/business/reports" icon="chart">
            Reports
          </LinkButton>
          <LinkButton href="/business/renewals" icon="calendar">
            Renewals
          </LinkButton>
        </div>
      </section>

      {/* ── KPI tiles ───────────────────────────────────────────────────────── */}
      <SpotlightGroup className="mt-5 grid grid-cols-1 gap-3 min-[460px]:grid-cols-2 xl:grid-cols-4">
        <Kpi
          className="so-rise"
          style={{ "--d": "120ms" } as CSSProperties}
          label="Active subscriptions"
          icon="layers"
          tone="violet"
          value={s.activeCount}
          sub={s.trialCount ? `+ ${s.trialCount} in trial` : `${tools.length} tool${tools.length === 1 ? "" : "s"} with a paid plan`}
          href="/business/subscriptions?status=active"
          chart={tools.length > 0 ? <LogoStack items={tools} max={7} size={22} /> : undefined}
        />
        <Kpi
          className="so-rise"
          style={{ "--d": "180ms" } as CSSProperties}
          label="Upcoming renewals"
          icon="calendar"
          tone="blue"
          value={s.upcomingRenewals}
          sub={s.missingRenewalDate ? `Next 30 days · ${s.missingRenewalDate} without a date` : "Next 30 days"}
          href="/business/renewals"
          chart={model.upcoming.length > 0 ? <LogoStack items={model.upcoming.map((r) => ({ name: r.softwareName, src: r.logoSrc }))} max={7} size={22} /> : undefined}
        />
        <Kpi
          className="so-rise"
          style={{ "--d": "240ms" } as CSSProperties}
          label="Est. potential savings"
          icon="piggy"
          tone="green"
          value={totalsList(model.potential.annual).length ? <span><Money totals={model.potential.annual} preferred={pref} /><span className="text-[13px] font-normal text-faint"> /yr</span></span> : "—"}
          sub={`${model.potential.counted} with an estimate${model.potential.withoutEstimate ? ` · ${model.potential.withoutEstimate} to check` : ""}`}
          href="/business/savings"
        />
        <Kpi
          className="so-rise"
          style={{ "--d": "300ms" } as CSSProperties}
          label="Unused licenses"
          icon="key"
          tone="orange"
          value={model.licenses.tracked ? model.licenses.available : "—"}
          sub={totalsList(model.licenses.unusedMonthly).length ? <span>≈ <Money totals={model.licenses.unusedMonthly} preferred={pref} className="!inline" /> /mo</span> : model.licenses.tracked ? `${model.licenses.assigned} of ${model.licenses.purchased} seats in use` : "No seats tracked yet"}
          href="/business/licenses"
          chart={model.licenses.tracked ? <Meter value={model.licenses.utilization} label="License utilization" tone={(model.licenses.utilization ?? 100) < 60 ? "warn" : "accent"} /> : undefined}
        />
      </SpotlightGroup>

      {/* ── Trend + category mix ────────────────────────────────────────────── */}
      <div className="so-rise mt-5 grid gap-5 lg:grid-cols-3" style={{ "--d": "360ms" } as CSSProperties}>
        <Card title="Monthly spending trend" description={`Recurring run-rate at each month's end, in ${chartCurrency} — from start dates and recorded price changes.`} className="lg:col-span-2">
          <TrendChart points={trend} caption={`Monthly recurring run-rate, ${chartCurrency}, last 12 months`} currency={chartCurrency} height={230} />
          {otherMonthly.length > 0 && (
            <p className="mt-2 text-[12px] text-faint">Also billed in {otherMonthly.map((t) => `${t.currency} (${whole(t.amount, t.currency)}/mo)`).join(", ")} — see Reports to chart those.</p>
          )}
        </Card>
        <Card title="Spending by category" description={`Share of the monthly run-rate, ${chartCurrency}`}>
          {categoryRows.length ? (
            <DonutChart
              caption="Spending by category"
              centerLabel="Per month"
              centerValue={whole(s.monthly[chartCurrency] ?? 0, chartCurrency)}
              segments={categoryRows.map((r) => ({ label: r.label, value: r.value, display: r.display }))}
            />
          ) : (
            <p className="text-[13px] text-faint">No priced subscriptions in {chartCurrency}.</p>
          )}
        </Card>
      </div>

      {/* ── Renewal timeline ────────────────────────────────────────────────── */}
      <Card
        className="so-rise mt-5"
        style={{ "--d": "440ms" } as CSSProperties}
        title="Renewals and deadlines — next 9 weeks"
        description="Each logo sits on its date. Hover or focus one for the details; open it to record a decision."
        action={<LinkButton href="/business/renewals?view=calendar" icon="calendar">Calendar</LinkButton>}
      >
        <RenewalTimeline items={timeline} days={TIMELINE_DAYS} startLabel="Today" />
      </Card>

      {/* ── Vendors, seats, savings ─────────────────────────────────────────── */}
      <div className="so-rise mt-5 grid gap-5 lg:grid-cols-3" style={{ "--d": "520ms" } as CSSProperties}>
        <Card title="Spending by vendor" description={`Monthly equivalent, ${chartCurrency}`}>
          {vendorRows.length ? <BarList caption="Spending by vendor" rows={vendorRows} max={6} /> : <p className="text-[13px] text-faint">No priced subscriptions in {chartCurrency}.</p>}
        </Card>

        <Card title="License utilization" description="Seats in use ÷ seats purchased, where seats are tracked." action={<LinkButton href="/business/licenses">Licenses</LinkButton>}>
          {model.licenses.tracked ? (
            <>
              <div className="flex items-center gap-5">
                <RadialGauge value={model.licenses.utilization} label="License utilization" sub={`${model.licenses.tracked} plan${model.licenses.tracked === 1 ? "" : "s"}`} size={120} />
                <dl className="grid flex-1 grid-cols-1 gap-2 text-[12.5px]">
                  <div className="flex justify-between gap-2">
                    <dt className="text-faint">Purchased</dt>
                    <dd className="tabular font-medium text-fg">{model.licenses.purchased}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-faint">In use</dt>
                    <dd className="tabular font-medium text-fg">{model.licenses.assigned}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-faint">Available</dt>
                    <dd className="tabular font-medium text-fg">{model.licenses.available}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-faint">Unused cost</dt>
                    <dd className="tabular text-right font-medium text-fg">
                      <Money totals={model.licenses.unusedMonthly} preferred={pref} empty="—" />
                    </dd>
                  </div>
                </dl>
              </div>
              <ul className="mt-4 space-y-2.5 border-t border-line pt-3">
                {seatRows.map(({ sub, seats }) => (
                  <li key={sub.id}>
                    <Link href={`/business/licenses/${sub.id}`} className="flex items-center gap-2.5 rounded-lg hover:bg-subtle">
                      <SoftwareLogo name={sub.softwareName} src={sub.logoSrc} size={24} />
                      <span className="min-w-0 flex-1">
                        <span className="flex justify-between gap-2 text-[12.5px]">
                          <span className="truncate font-medium text-fg">{sub.softwareName}</span>
                          <span className="tabular shrink-0 text-faint">
                            {seats.assigned}/{seats.purchased}
                          </span>
                        </span>
                        <Meter value={seats.utilization} label={`${sub.softwareName} utilization`} tone={(seats.utilization ?? 100) < 60 ? "warn" : "accent"} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-[13px] text-faint">No seats tracked yet. Add purchased seats to a subscription to see utilization here. Usage isn&apos;t measured — seats are assigned or reported.</p>
          )}
        </Card>

        <Card title="Savings" description="Potential is an estimate; realized is only what someone confirmed." action={<LinkButton href="/business/savings">Savings center</LinkButton>}>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[#1baf7a]/10 px-3 py-2.5">
              <p className="text-[11.5px] font-medium text-[color-mix(in_oklab,#1baf7a_70%,black)]">Potential / yr</p>
              <p className="tabular mt-0.5 text-[1.15rem] font-semibold text-heading">
                <Money totals={model.potential.annual} preferred={pref} />
              </p>
            </div>
            <div className="rounded-xl bg-accent-soft px-3 py-2.5">
              <p className="text-[11.5px] font-medium text-accent-ink">Realized, first year</p>
              <p className="tabular mt-0.5 text-[1.15rem] font-semibold text-heading">
                <Money totals={model.realized} preferred={pref} />
              </p>
            </div>
          </div>
          {(potentialAnnual > 0 || realizedAnnual > 0) && (
            <div className="mt-3">
              <BarList
                caption={`Potential vs realized savings, ${chartCurrency} per year`}
                valueHead="Per year"
                rows={[
                  { label: "Potential (estimated)", value: potentialAnnual, display: whole(potentialAnnual, chartCurrency) },
                  { label: "Realized (confirmed)", value: realizedAnnual, display: whole(realizedAnnual, chartCurrency) },
                ]}
              />
            </div>
          )}
          {openOpps.length === 0 ? (
            <p className="mt-3 text-[13px] text-muted">No open opportunities. They appear as the rules find unused seats, overlap, renewals to review and more.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line border-t border-line">
              {openOpps.slice(0, 4).map((o) => {
                const sw = oppSoftware(o);
                return (
                  <li key={o.id}>
                    <Link href={`/business/savings?focus=${o.id}#${o.id}`} className="-mx-2 flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-subtle">
                      {sw ? <SoftwareLogo name={sw.name} src={sw.logo} size={24} /> : <IconTile icon="piggy" tone="green" size={24} />}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[12.5px] font-medium text-fg">{o.title}</span>
                        <span className="block text-[11.5px] text-faint">{opportunityTypeLabels[o.type]}</span>
                      </span>
                      <span className="tabular shrink-0 text-[12px] font-medium text-fg">{o.estMonthlyMinor !== null && o.currency ? `${formatMoney(o.estMonthlyMinor * 12, o.currency, { whole: true })}/yr` : <span className="font-normal text-faint">Review</span>}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          {openOpps.length > 4 && <p className="mt-2 text-[12px] text-faint">+ {openOpps.length - 4} more open.</p>}
        </Card>
      </div>

      {/* ── Attention + departments ─────────────────────────────────────────── */}
      <div className="so-rise mt-5 grid gap-5 lg:grid-cols-3" style={{ "--d": "580ms" } as CSSProperties}>
        <Card title="Needs attention" description="Upcoming high-cost renewals, missing details, unused seats and potential overlap." className="lg:col-span-2">
          {model.attention.length === 0 ? (
            <div className="flex items-center gap-3 py-2">
              <IconTile icon="check" tone="green" size={32} />
              <p className="text-[13.5px] text-muted">Nothing needs attention right now.</p>
            </div>
          ) : (
            <SpotlightGroup>
              <ul className="grid gap-2 sm:grid-cols-2">
                {model.attention.slice(0, 8).map((a, i) => (
                  <li key={i}>
                    <Link href={a.href} className="so-spot biz-card-lift flex h-full items-start gap-3 rounded-xl border border-line px-3 py-2.5">
                      <span className="relative shrink-0">
                        {a.software ? <SoftwareLogo name={a.software.name} src={a.software.logo} size={32} /> : <IconTile icon={attentionIcon[a.kind]} tone={attentionTone[a.kind]} size={32} />}
                        {a.software && (
                          <span className="absolute -bottom-1 -right-1">
                            <IconTile icon={attentionIcon[a.kind]} tone={attentionTone[a.kind]} size={17} />
                          </span>
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[13px] font-medium leading-snug text-fg">{a.title}</span>
                        <span className="mt-0.5 block text-[12px] leading-snug text-muted">{a.detail}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </SpotlightGroup>
          )}
          {model.attention.length > 8 && <p className="mt-2 text-[12px] text-faint">+ {model.attention.length - 8} more.</p>}
        </Card>
        <Card title="Spending by department" description={`Monthly equivalent, ${chartCurrency}`}>
          {departmentRows.length ? <BarList caption="Spending by department" rows={departmentRows} max={6} /> : <p className="text-[13px] text-faint">No priced subscriptions in {chartCurrency}.</p>}
          <div className="mt-5 border-t border-line pt-4">
            <p className="mb-2 text-[12.5px] font-semibold text-fg">Billing intervals</p>
            <StackedBar
              caption="Monthly equivalent by billing interval"
              segments={model.byInterval.map((g) => ({ label: g.label, value: g.totals[chartCurrency] ?? 0, display: `${whole(g.totals[chartCurrency] ?? 0, chartCurrency)}/mo` }))}
            />
          </div>
          <div className="mt-5 border-t border-line pt-4">
            <p className="mb-2 text-[12.5px] font-semibold text-fg">Subscriptions by status</p>
            <div className="flex flex-wrap gap-1.5">
              {model.byStatus
                .sort((a, b) => b.count - a.count)
                .map((g) => (
                  <Link key={g.status} href={`/business/subscriptions?status=${g.status}`} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2 py-1 text-[12px] hover:border-line-strong">
                    <StatusPill status={g.status} label={g.label} />
                    <span className="tabular font-semibold text-fg">{g.count}</span>
                  </Link>
                ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ── Tables ──────────────────────────────────────────────────────────── */}
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
                    <th className="num hidden sm:table-cell">Expected</th>
                    <th className="hidden sm:table-cell">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {model.upcoming.slice(0, 8).map((r) => {
                    const d = daysBetween(ctx.today, r.nextRenewalDate!);
                    return (
                      <tr key={r.id}>
                        <td>
                          <Link href={`/business/subscriptions/${r.id}`} className="hover:underline">
                            <SoftwareName name={r.softwareName} src={r.logoSrc} sub={intervalLabel(r)} size={28} />
                          </Link>
                          {(r.status !== "active" || !r.autoRenew) && (
                            <div className="mt-1 flex gap-1 pl-9 sm:hidden">
                              {r.status !== "active" && <StatusPill status={r.status} label={subscriptionStatusLabels[r.status]} />}
                              {!r.autoRenew && <Pill>Manual</Pill>}
                            </div>
                          )}
                        </td>
                        <td>
                          <span className="whitespace-nowrap">{formatIsoDate(r.nextRenewalDate, fmt)}</span>
                          {/* On phones the expected amount sits here instead of its own column. */}
                          <span className="mt-0.5 flex items-center gap-1.5 whitespace-nowrap sm:contents">
                            <span className={cn("rounded px-1 text-[11px] font-medium sm:ml-1.5", d <= 7 ? "bg-accent-soft text-accent-ink" : "bg-subtle text-faint")}>{d === 0 ? "today" : `${d}d`}</span>
                            <span className="tabular text-[12.5px] font-medium sm:hidden">{r.priceMinor !== null ? formatMoney(r.priceMinor, r.currency) : "—"}</span>
                          </span>
                        </td>
                        <td className="num hidden sm:table-cell">{r.priceMinor !== null ? formatMoney(r.priceMinor, r.currency) : "—"}</td>
                        <td className="hidden sm:table-cell">
                          <StatusPill status={r.status} label={subscriptionStatusLabels[r.status]} />
                          {!r.autoRenew && <Pill className="ml-1">Manual</Pill>}
                        </td>
                      </tr>
                    );
                  })}
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
                    <th className="num hidden sm:table-cell">Annualized</th>
                    <th className="hidden sm:table-cell">Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {model.highestCost.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <Link href={`/business/subscriptions/${r.id}`} className="hover:underline">
                          <SoftwareName name={r.softwareName} src={r.logoSrc} sub={categoryLabels[r.category]} size={28} />
                        </Link>
                      </td>
                      <td className="num">{formatMoney(Math.round(monthlyEquivalent(r)!), r.currency)}</td>
                      <td className="num hidden sm:table-cell">{formatMoney(Math.round(annualized(r)!), r.currency)}</td>
                      <td className="hidden whitespace-nowrap sm:table-cell">{r.ownerName ?? <span className="text-faint">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          )}
        </Card>
      </div>

      {/* ── Activity ────────────────────────────────────────────────────────── */}
      <Card className="mt-5" title="Recent activity" action={<LinkButton href="/business/reports#activity">Audit log</LinkButton>}>
        {activity.length === 0 ? (
          <p className="text-[13.5px] text-muted">No activity yet.</p>
        ) : (
          <ol className="grid gap-x-8 gap-y-3 md:grid-cols-2">
            {activity.map((a) => {
              const sw = activityLogo(a.entityType, a.entityId);
              const kind = a.action.split(".")[0];
              return (
                <li key={a.id} className="flex items-start gap-3 text-[13px]">
                  {sw ? (
                    <SoftwareLogo name={sw.name} src={sw.logo} size={26} />
                  ) : (
                    <span className="flex size-[26px] shrink-0 items-center justify-center rounded-lg bg-subtle text-muted" aria-hidden="true">
                      <Icon name={activityIcon[kind] ?? "info"} size={14} />
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="text-fg">{a.summary}</span>
                    <span className="block text-[12px] text-faint">
                      {a.actorName ?? "Someone"} · {formatIsoDate(a.createdAt.toISOString().slice(0, 10), fmt)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </Card>
    </>
  );
}

/** A converted total with what it includes underneath ("incl. €1,188.00"), or the per-currency fallback. */
function ConvertedMoney({ c, fallback }: { c: ConvertedTotal | null; fallback: ReactNode }) {
  if (!c) return <>{fallback}</>;
  return (
    <span className="inline-flex flex-col">
      <span className="whitespace-nowrap">{formatMoney(c.amount, c.currency)}</span>
      <span className="whitespace-nowrap text-[0.8em] font-normal opacity-65">incl. {convertedParts(c)} converted</span>
    </span>
  );
}
