import { BrandMark } from "@/components/brand/logo";
import { DonutChart, Sparkline } from "@/components/business/charts";
import { SoftwareLogo } from "@/components/business/software-logo";
import { Icon, type IconProps } from "@/components/ui/icon";
import { cn } from "@/components/ui/primitives";
import { CountUp } from "./luxe";
import { annualTotal, byCategory, byId, monthlyTotal, potentialAnnual, renewalsIn30, runRateTrend, summary, timeline, usd } from "./example-data";
import { AppWindow, FakeControl, MiniTimeline, PreviewCard, SubRow } from "./preview-parts";

const nav: { icon: IconProps["name"]; label: string }[] = [
  { icon: "home", label: "Overview" },
  { icon: "layers", label: "Subscriptions" },
  { icon: "calendar", label: "Renewals" },
  { icon: "key", label: "Licenses" },
  { icon: "piggy", label: "Savings" },
  { icon: "chart", label: "Reports" },
  { icon: "users", label: "Team" },
];

function Tile({ label, value, icon, children }: { label: string; value: React.ReactNode; icon: IconProps["name"]; children: React.ReactNode }) {
  return (
    <div className="biz-card px-3.5 py-3">
      <p className="flex items-center justify-between gap-2 text-[11.5px] font-medium text-muted">
        <span className="truncate">{label}</span>
        <Icon name={icon} size={13} className="text-faint" />
      </p>
      <p className="tabular mt-1 text-[1.3rem] font-semibold leading-tight tracking-tight text-heading">{value}</p>
      <div className="mt-1 text-[11.5px] text-faint">{children}</div>
    </div>
  );
}

/** The hero's faux dashboard: KPI tiles, category donut, subscriptions and the renewal strip, all example data. */
export function HeroPreview({ chrome, timeline: withTimeline = true }: { chrome?: "browser" | "app"; timeline?: boolean }) {
  const rows = ["hubspot", "linear", "slack", "aws", "figma"].map(byId);
  const deadlines = timeline.filter((t) => t.kind === "deadline").length;
  return (
    <AppWindow path="/business/dashboard" chrome={chrome}>
      <div className="flex">
        <div aria-hidden="true" className="hidden w-14 shrink-0 flex-col items-center gap-1.5 border-r border-line bg-surface py-3.5 sm:flex">
          <BrandMark size={26} />
          <span className="my-1.5 h-px w-6 bg-line" />
          {nav.map((n, i) => (
            <span key={n.label} title={n.label} className={cn("flex size-9 items-center justify-center rounded-[10px]", i === 0 ? "bg-accent-soft text-accent-ink" : "text-faint")}>
              <Icon name={n.icon} size={17} />
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1 p-3 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <SoftwareLogo name="Northwind Studio" size={30} />
              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold text-heading">Northwind Studio · Overview</p>
              </div>
            </div>
            <span aria-hidden="true" className="hidden items-center gap-2 md:flex">
              <FakeControl>
                Last 12 months <Icon name="chevron-down" size={12} className="text-faint" />
              </FakeControl>
              <FakeControl tone="primary">
                <Icon name="plus" size={12} /> Add software
              </FakeControl>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Tile label="Monthly software spend" value={<CountUp value={Math.round(monthlyTotal / 100)} prefix="$" delay={900} />} icon="trending-up">
              <Sparkline values={runRateTrend} label="Example: monthly run-rate over the last 12 months, rising" />
            </Tile>
            <Tile label="Annualized spend" value={<CountUp value={Math.round(annualTotal / 100)} prefix="$" delay={1000} />} icon="chart">
              Run-rate × 12 · {summary.activeCount} active
            </Tile>
            <Tile label="Renewals · 30 days" value={<CountUp value={renewalsIn30} delay={1100} duration={1000} />} icon="calendar">
              <span className="text-warn">{deadlines} cancellation deadline{deadlines === 1 ? "" : "s"}</span>
            </Tile>
            <Tile label="Potential savings" value={<CountUp value={Math.round(potentialAnnual / 100)} prefix="$" suffix="/yr" delay={1200} />} icon="piggy">
              Estimate · not guaranteed
            </Tile>
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <PreviewCard title="Spending by category">
              <DonutChart caption="Example: monthly spending by category" segments={byCategory} centerLabel="Per month" centerValue={usd(monthlyTotal)} />
            </PreviewCard>
            <PreviewCard title="Next up" aside={<span className="text-[11.5px] text-faint">{summary.activeCount} subscriptions</span>}>
              <ul className="-my-2 divide-y divide-line">
                {rows.map((s) => (
                  <SubRow key={s.id} s={s} compact />
                ))}
              </ul>
            </PreviewCard>
          </div>

          {withTimeline && (
            <PreviewCard title="Renewals · next 30 days" className="mt-3 hidden sm:block">
              <MiniTimeline items={timeline} minGap={5} />
            </PreviewCard>
          )}
        </div>
      </div>
    </AppWindow>
  );
}
