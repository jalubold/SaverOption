import Link from "next/link";
import { BarList, DonutChart, RadialGauge } from "@/components/business/charts";
import { LogoStack, SoftwareLogo } from "@/components/business/software-logo";
import { Meter, Pill } from "@/components/business/ui";
import { Icon } from "@/components/ui/icon";
import {
  byCategory,
  byDepartment,
  byId,
  exampleSubs,
  monthlyTotal,
  potentialAnnual,
  renewalsIn30,
  seatTotals,
  seated,
  seatUtilization,
  timeline,
  topVendors,
  usd,
} from "./example-data";
import { FakeControl, MiniTimeline, PreviewCard, SubRow } from "./preview-parts";

/** Example-data visuals for the landing page's feature sections. */

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-light so-spot relative rounded-[20px] border border-line bg-subtle/80 p-3 text-fg shadow-[0_30px_60px_-36px_rgb(10_10_10/0.35)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_40px_70px_-36px_rgb(60_20_140/0.45)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-4">
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function RenewalsVisual() {
  return (
    <Frame>
      <PreviewCard title="Renewals · next 30 days" aside={<Pill tone="accent">{renewalsIn30} renewals</Pill>}>
        <MiniTimeline items={timeline} />
      </PreviewCard>
      <PreviewCard title="Subscriptions" aside={<span className="text-[11.5px] text-faint">Sorted by renewal</span>}>
        <ul className="-my-2 divide-y divide-line">
          {["hubspot", "linear", "slack", "figma"].map((id) => (
            <SubRow key={id} s={byId(id)} />
          ))}
        </ul>
      </PreviewCard>
    </Frame>
  );
}

export function SpendVisual() {
  return (
    <Frame>
      <PreviewCard title="Spending by category" aside={<span className="tabular text-[11.5px] text-faint">{usd(monthlyTotal)}/mo</span>}>
        <DonutChart caption="Example: monthly spending by category" segments={byCategory} centerLabel="Per month" centerValue={usd(monthlyTotal)} />
      </PreviewCard>
      <PreviewCard title="Top vendors">
        <BarList caption="Example: monthly spending by vendor" rows={topVendors} max={5} />
      </PreviewCard>
    </Frame>
  );
}

export function LicensesVisual() {
  const rows = seated.slice(0, 5);
  return (
    <Frame>
      <div className="biz-card grid items-center gap-5 p-4 sm:grid-cols-[auto_minmax(0,1fr)]">
        <div className="flex flex-col items-center gap-1 text-center">
          <RadialGauge value={seatUtilization} label="Example: seat utilization across per-seat plans" sub={`${seatTotals.assigned} of ${seatTotals.purchased} seats`} size={128} />
          <p className="text-[11.5px] text-faint">Seats in use</p>
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-heading">Unassigned seats</p>
          <p className="tabular mt-1 text-[1.5rem] font-semibold leading-tight tracking-tight text-heading">
            {usd(seatTotals.unusedMonthly)}
            <span className="text-[14px] font-medium text-muted">/mo</span>
          </p>
          <p className="mt-1 text-[12px] text-faint">{seatTotals.purchased - seatTotals.assigned} seats on per-seat plans aren&apos;t assigned to anyone.</p>
        </div>
      </div>
      <PreviewCard title="Seats by plan" aside={<span className="text-[11.5px] text-faint">Lowest utilization first</span>}>
        <ul className="space-y-3">
          {rows.map(({ s, seats }) => (
            <li key={s.id} className="flex items-center gap-3">
              <SoftwareLogo name={s.name} src={s.logo} size={28} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2 text-[12.5px]">
                  <span className="truncate font-medium text-fg">{s.name}</span>
                  <span className="tabular shrink-0 text-faint">
                    {seats.assigned} of {seats.purchased} · {seats.available} free
                  </span>
                </div>
                <Meter value={seats.utilization} label={`Example: ${s.name} seat utilization`} tone={(seats.utilization ?? 0) < 70 ? "warn" : "accent"} />
              </div>
            </li>
          ))}
        </ul>
      </PreviewCard>
    </Frame>
  );
}

export function SavingsVisual() {
  const notion = seated.find((x) => x.s.id === "notion")!;
  const findings = [
    {
      icon: "key" as const,
      logos: [byId("notion")],
      title: `${notion.seats.available} unused Notion seats`,
      body: "From the per-seat price you entered.",
      amount: `${usd((notion.seats.unusedMonthly ?? 0) * 12)}/yr`,
      tag: "Unused licenses",
    },
    {
      icon: "layers" as const,
      logos: [byId("notion"), byId("confluence")],
      title: "Notion and Confluence both cover docs",
      body: "Potential overlap — flagged for review, not a confirmed duplicate.",
      amount: null,
      tag: "Potential overlap",
    },
    {
      icon: "calendar" as const,
      logos: [byId("mailchimp")],
      title: "Mailchimp is billed monthly",
      body: "Check for an annual plan. No amount until you record an annual price.",
      amount: null,
      tag: "Annual billing",
    },
  ];
  return (
    <Frame>
      <div className="biz-card flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <p className="text-[12px] font-medium text-muted">Potential savings · estimate</p>
          <p className="tabular mt-0.5 text-[1.5rem] font-semibold leading-tight tracking-tight text-heading">
            {usd(potentialAnnual)}
            <span className="text-[14px] font-medium text-muted">/yr</span>
          </p>
        </div>
        <Pill tone="outline">Potential, not guaranteed</Pill>
      </div>
      <ul className="space-y-2.5">
        {findings.map((f) => (
          <li key={f.title} className="biz-card flex items-start gap-3 p-3.5">
            <LogoStack items={f.logos.map((s) => ({ name: s.name, src: s.logo }))} size={28} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="text-[13px] font-semibold text-fg">{f.title}</p>
                {f.amount ? <span className="tabular text-[13px] font-semibold text-accent-ink">≈ {f.amount}</span> : <span className="text-[11.5px] text-faint">No estimate</span>}
              </div>
              <p className="mt-0.5 text-[12px] leading-relaxed text-muted">{f.body}</p>
              <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-faint">
                <Icon name={f.icon} size={12} /> {f.tag}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-3 rounded-[14px] border border-accent/30 bg-accent-soft p-3.5">
        <span className="icon-tile size-9 shrink-0">
          <Icon name="tag" size={17} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-fg">Saver Option deals for tools you use</p>
          <p className="text-[12px] text-muted">Discounts, credits and startup programs from the deals catalog. Eligibility varies, so no amount is estimated.</p>
        </div>
        <Link href="/deals" className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-accent-ink hover:underline underline-offset-2">
          Browse deals <Icon name="arrow-right" size={13} />
        </Link>
      </div>
    </Frame>
  );
}

export function ReportsVisual() {
  return (
    <Frame>
      <div aria-hidden="true" className="flex flex-wrap gap-2">
        {["Last 12 months", "USD", "All departments", "All categories"].map((f) => (
          <FakeControl key={f}>
            {f} <Icon name="chevron-down" size={12} className="text-faint" />
          </FakeControl>
        ))}
      </div>
      <PreviewCard title="Spending by department" aside={<span className="tabular text-[11.5px] text-faint">{exampleSubs.length} subscriptions</span>}>
        <BarList caption="Example: monthly spending by department" rows={byDepartment} max={5} />
      </PreviewCard>
      <div aria-hidden="true" className="biz-card flex flex-wrap items-center gap-3 p-3.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#1baf7a]/12 text-[10px] font-bold tracking-wide text-[#0f7a52]">CSV</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-fg">spend-by-department.csv</p>
          <p className="text-[11.5px] text-faint">Same filters as on screen · workspace export as JSON</p>
        </div>
        <FakeControl>
          <Icon name="download" size={13} /> Export CSV
        </FakeControl>
      </div>
    </Frame>
  );
}
