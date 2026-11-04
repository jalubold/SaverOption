import { BrandMark } from "@/components/brand/logo";
import { DonutChart, Sparkline, TrendChart } from "@/components/business/charts";
import { annualTotal, byCategory, exampleSubs, monthlyTotal, potentialAnnual, renewalsIn30, runRateTrend, seatTotals, summary, usd } from "@/components/business/landing/example-data";
import { PreviewCard } from "@/components/business/landing/preview-parts";
import { LogoStack } from "@/components/business/software-logo";
import { Kpi, Meter } from "@/components/business/ui";
import { Icon, type IconProps } from "@/components/ui/icon";
import { buttonClass, cn } from "@/components/ui/primitives";

/**
 * The hero picture on the Business landing and download pages: Saver Option Business as the
 * Mac app really looks: a macOS window whose title bar is hidden, with the window buttons over the top of
 * the sidebar (titleBarStyle Overlay in desktop/src-tauri/src/lib.rs), the app's own sidebar collapsed
 * to its icons, the header and the Overview page as they are now
 * (src/components/business/app-shell.tsx, app/business/(app)/dashboard), with example data.
 */

/** The app's four places, as the sidebar shows them. */
const nav: { label: string; icon: IconProps["name"] }[] = [
  { label: "Overview", icon: "home" },
  { label: "Manage", icon: "layers" },
  { label: "Insights", icon: "trending-up" },
  { label: "Workspace", icon: "building" },
];

/** The macOS close, minimize and zoom buttons. */
function WindowButtons({ className }: { className?: string }) {
  return (
    <span className={cn("flex gap-2", className)}>
      <span className="size-3 rounded-full bg-[#ff5f57] shadow-[inset_0_0_0_0.5px_rgb(0_0_0/0.22)]" />
      <span className="size-3 rounded-full bg-[#febc2e] shadow-[inset_0_0_0_0.5px_rgb(0_0_0/0.22)]" />
      <span className="size-3 rounded-full bg-[#28c840] shadow-[inset_0_0_0_0.5px_rgb(0_0_0/0.22)]" />
    </span>
  );
}

/** The sidebar collapsed to its icons (68 px, as in the app), with the window buttons over its top. */
function Sidebar() {
  return (
    <div className="theme-dark hidden w-[68px] shrink-0 flex-col items-center border-r border-line bg-bg pb-3 text-fg md:flex">
      {/* The strip the window buttons sit on. */}
      <div className="h-[42px] shrink-0" />
      <BrandMark size={26} />
      <span className="mt-3 flex size-8 items-center justify-center rounded-lg border border-line bg-subtle text-[12px] font-semibold text-fg">N</span>
      <span className={buttonClass("primary", "sm", "mt-3 size-8 px-0")}>
        <Icon name="plus" size={15} />
      </span>
      <div className="mt-5 flex w-full flex-col items-center gap-1 px-2.5">
        {nav.map((it) => {
          const on = it.label === "Overview";
          return (
            <span
              key={it.label}
              title={it.label}
              className={cn(
                "relative flex h-10 w-full items-center justify-center rounded-lg",
                on
                  ? "bg-[linear-gradient(90deg,color-mix(in_oklab,var(--accent)_26%,transparent),color-mix(in_oklab,var(--accent)_6%,transparent))] text-accent-ink shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--accent)_22%,transparent)]"
                  : "text-muted",
              )}
            >
              {on && <span className="absolute -left-2.5 bottom-2.5 top-2.5 w-[3px] rounded-r-full bg-accent shadow-[0_0_12px_2px_color-mix(in_oklab,var(--accent)_70%,transparent)]" />}
              <Icon name={it.icon} size={18} />
            </span>
          );
        })}
      </div>
      {/* The collapse toggle in its own footer at the bottom, as in the app. */}
      <div className="mt-auto flex w-full justify-center border-t border-line pt-2.5">
        <span className="flex h-8 w-full items-center justify-center text-faint">
          <Icon name="panel-left" size={15} />
        </span>
      </div>
    </div>
  );
}

function Header() {
  return (
    // On narrow windows the app's header starts after the window buttons, as it does in the app.
    <div className="flex h-[42px] items-center gap-2 border-b border-line bg-bg pl-[78px] pr-3 md:px-4">
      <span className="flex h-7 min-w-0 max-w-[280px] flex-1 items-center gap-2 rounded-lg border border-line bg-surface px-2.5 text-[12px] text-faint">
        <Icon name="search" size={13} className="shrink-0" />
        <span className="truncate">Search software, vendors, people…</span>
      </span>
      {/* The quick jump button (QuickJump in shell-client.tsx). */}
      <span className="hidden h-7 shrink-0 items-center gap-1.5 rounded-lg border border-line bg-surface px-2 text-[11.5px] text-faint md:inline-flex">
        <Icon name="arrow-up-right" size={12} />
        Jump to…
        <kbd className="rounded border border-line bg-subtle px-1 font-sans text-[10px] text-faint">⌘K</kbd>
      </span>
      <span className="ml-auto flex items-center gap-2">
        <span className={buttonClass("primary", "sm", "hidden h-7 px-2.5 text-[11.5px] sm:inline-flex")}>
          <Icon name="sparkles" size={12} /> Upgrade
        </span>
        <span className="relative flex size-7 items-center justify-center text-muted">
          <Icon name="bell" size={16} />
          <span className="absolute right-0.5 top-0.5 size-1.5 rounded-full bg-accent" />
        </span>
        <span className="flex size-7 items-center justify-center rounded-full bg-accent-soft text-[11px] font-semibold text-accent-ink">AM</span>
        <span className="hidden text-[12px] font-medium text-fg sm:block">Alex Morgan</span>
      </span>
    </div>
  );
}

const MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
/** The example run-rate (whole dollars) as the dashboard's trend points (cents). */
/** How the example run-rate moved over the 12 months, as the dashboard shows it. */
const trendChange = (runRateTrend.at(-1)! / runRateTrend[0] - 1) * 100;
const trendPoints = runRateTrend.map((v, i) => ({ label: MONTHS[i], value: v * 100, display: `${usd(v * 100)}/mo` }));
/** Logos of the example tools with an active plan, and of those renewing in the next 30 days. */
const active = exampleSubs.filter((x) => x.status === "active" && !x.archived).map((x) => ({ name: x.name, src: x.logo }));
const renewing = exampleSubs.filter((x) => x.renewsIn <= 30).map((x) => ({ name: x.name, src: x.logo }));

function Overview() {
  return (
    <div className="space-y-3 p-3 sm:p-4">
      {/* The Overview's dark summary card, as compact as the dashboard's. */}
      <section className="biz-card biz-hero theme-dark px-4 py-3.5 text-fg sm:px-5">
        <div className="relative z-10 flex items-center justify-between gap-2">
          <p className="text-[11px] font-medium text-muted">Monthly software spend</p>
          <div className="hidden gap-1.5 sm:flex">
            <span className="inline-flex h-6 items-center gap-1 rounded-md border border-white/15 bg-white/10 px-2 text-[10.5px] font-medium text-fg">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
              </svg>
              Share
            </span>
            <span className="inline-flex h-6 items-center gap-1 rounded-md border border-white/15 bg-white/10 px-2 text-[10.5px] font-medium text-fg">
              <Icon name="download" size={11} /> Save <Icon name="chevron-down" size={10} className="opacity-60" />
            </span>
          </div>
        </div>
        <div className="relative z-10 mt-1 grid gap-x-6 gap-y-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:items-end">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <p className="so-ink tabular w-fit text-[1.85rem] font-semibold leading-[1.1] tracking-tight">{usd(monthlyTotal)}</p>
              <span className="pill bg-white/10 text-[10.5px] text-muted shadow-[inset_0_0_0_1px_rgb(255_255_255/0.14)]">↑ {Math.round(trendChange)}% in 12 months</span>
            </div>
            <p className="mt-1.5 text-[11.5px] text-muted">
              <span className="tabular font-semibold text-heading">{usd(annualTotal)}</span> a year
            </p>
          </div>
          <div className="hidden min-w-0 sm:block">
            <div className="mb-1 flex items-baseline justify-between gap-2 text-[10.5px] text-faint">
              <span>12-month run-rate · USD</span>
              <span className="tabular">
                {MONTHS[0]} – {MONTHS.at(-1)}
              </span>
            </div>
            <Sparkline values={runRateTrend} label="Example: monthly run-rate over the last 12 months" tone="light" height={40} />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
        <Kpi label="Active subscriptions" icon="layers" tone="violet" value={summary.activeCount} sub={`${summary.activeCount} tools with a paid plan`} chart={<LogoStack items={active} max={6} size={20} />} />
        <Kpi label="Upcoming renewals" icon="calendar" tone="blue" value={renewalsIn30} sub="Next 30 days" chart={<LogoStack items={renewing} max={6} size={20} />} />
        <Kpi label="Est. potential savings" icon="piggy" tone="green" value={`${usd(potentialAnnual)}/yr`} sub="Estimate, not guaranteed" />
        <Kpi
          label="Unused licenses"
          icon="key"
          tone="orange"
          value={seatTotals.purchased - seatTotals.assigned}
          sub={`${seatTotals.assigned} of ${seatTotals.purchased} seats in use`}
          chart={<Meter value={(seatTotals.assigned / seatTotals.purchased) * 100} label="Example: license utilization" tone="warn" />}
        />
      </div>

      <div className="hidden gap-2.5 sm:grid lg:grid-cols-3">
        <PreviewCard title="Monthly spending trend" className="lg:col-span-2">
          <TrendChart points={trendPoints} caption="Example: monthly recurring run-rate, USD, last 12 months" currency="USD" height={230} />
        </PreviewCard>
        <PreviewCard title="Spending by category">
          <DonutChart caption="Example: monthly spending by category" segments={byCategory} centerLabel="Per month" centerValue={usd(monthlyTotal)} />
        </PreviewCard>
      </div>
    </div>
  );
}

export function MacAppPreview() {
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden rounded-[12px] bg-bg shadow-[0_0_0_1px_rgb(0_0_0/0.6),0_0_0_1.5px_rgb(255_255_255/0.1),0_60px_120px_-30px_rgb(0_0_0/0.9),0_28px_56px_-28px_rgb(0_0_0/0.65)]"
    >
      <WindowButtons className="absolute left-[14px] top-[15px] z-20" />
      <div className="flex">
        <Sidebar />
        <div className="theme-light min-w-0 flex-1 bg-bg text-fg">
          <Header />
          <Overview />
        </div>
      </div>
    </div>
  );
}
