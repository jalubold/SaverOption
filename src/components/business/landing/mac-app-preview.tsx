import { BrandMark } from "@/components/brand/logo";
import { DonutChart, Sparkline } from "@/components/business/charts";
import { annualTotal, byCategory, byId, monthlyTotal, potentialAnnual, renewalsIn30, runRateTrend, seatTotals, summary, trackable, usd } from "@/components/business/landing/example-data";
import { PreviewCard, SubRow } from "@/components/business/landing/preview-parts";
import { LogoStack } from "@/components/business/software-logo";
import { Kpi, Meter } from "@/components/business/ui";
import { Icon, type IconProps } from "@/components/ui/icon";
import { buttonClass, cn } from "@/components/ui/primitives";

/**
 * The hero picture on the Business landing and download pages: Saver Option Business as the
 * Mac app really looks: a macOS window whose title bar is hidden, with the window buttons over the top of
 * the sidebar (titleBarStyle Overlay in desktop/src-tauri/src/lib.rs), the app's own sidebar
 * (src/components/business/app-shell.tsx) and the Overview page with example data.
 */

const nav: { label: string | null; items: { label: string; icon: IconProps["name"] }[] }[] = [
  { label: null, items: [{ label: "Overview", icon: "home" }] },
  {
    label: "Manage",
    items: [
      { label: "Subscriptions", icon: "layers" },
      { label: "Renewals", icon: "calendar" },
      { label: "Software", icon: "box" },
      { label: "Licenses & seats", icon: "key" },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Analytics", icon: "trending-up" },
      { label: "Savings", icon: "piggy" },
      { label: "Reports", icon: "chart" },
      { label: "Deals", icon: "tag" },
    ],
  },
  {
    label: "Workspace",
    items: [
      { label: "Team", icon: "users" },
      { label: "AI clients (MCP)", icon: "code" },
      { label: "Settings", icon: "gear" },
    ],
  },
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

function Sidebar() {
  return (
    <div className="theme-dark hidden w-[212px] shrink-0 flex-col border-r border-line bg-bg px-2.5 pb-3 text-fg md:flex">
      {/* The strip the window buttons sit on. */}
      <div className="h-[42px] shrink-0" />
      <div className="flex h-10 items-center gap-2 px-1">
        <BrandMark size={22} />
        <span className="truncate text-[13px] font-semibold tracking-tight text-fg">
          Saver Option <span className="text-accent-ink">Business</span>
        </span>
      </div>
      <div className="mb-2.5 flex items-center gap-2 rounded-lg border border-line px-2 py-1.5">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-subtle text-[11px] font-semibold text-fg">N</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[12px] font-semibold text-fg">Northwind Studio</span>
          <span className="block text-[10.5px] text-faint">Owner</span>
        </span>
        <Icon name="chevron-down" size={13} className="text-faint" />
      </div>
      <span className={buttonClass("primary", "sm", "mb-4 h-8 w-full text-[12.5px]")}>
        <Icon name="plus" size={14} /> Add software
      </span>
      <div className="flex flex-col gap-3.5">
        {nav.map((g) => (
          <div key={g.label ?? "home"}>
            {g.label && <p className="mb-1 px-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-faint">{g.label}</p>}
            <ul className="flex flex-col gap-0.5">
              {g.items.map((it) => {
                const on = it.label === "Overview";
                return (
                  <li
                    key={it.label}
                    className={cn(
                      "relative flex h-[30px] items-center gap-2.5 rounded-lg px-2.5 text-[12.5px] font-medium",
                      on
                        ? "bg-[linear-gradient(90deg,color-mix(in_oklab,var(--accent)_26%,transparent),color-mix(in_oklab,var(--accent)_6%,transparent))] text-fg shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--accent)_22%,transparent)]"
                        : "text-muted",
                    )}
                  >
                    {on && <span className="absolute -left-2.5 bottom-1.5 top-1.5 w-[3px] rounded-r-full bg-accent shadow-[0_0_12px_2px_color-mix(in_oklab,var(--accent)_70%,transparent)]" />}
                    <Icon name={it.icon} size={15} className={on ? "text-accent-ink" : undefined} />
                    <span className="truncate">{it.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
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

function Overview() {
  return (
    <div className="space-y-3 p-3 sm:p-4">
      {/* The Overview's dark summary card. */}
      <section className="biz-card biz-hero theme-dark grid gap-4 px-4 py-4 text-fg sm:px-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,260px)] lg:items-end">
        <div className="relative z-10 min-w-0">
          <p className="text-[11px] font-medium text-faint">Northwind Studio · Example data</p>
          <p className="mt-0.5 text-[19px] font-semibold leading-tight tracking-tight text-heading">Overview</p>
          <p className="mt-3.5 text-[11px] font-medium text-muted">Monthly software spend</p>
          <p className="so-ink tabular w-fit text-[1.85rem] font-semibold leading-[1.1] tracking-tight">{usd(monthlyTotal)}</p>
          <dl className="mt-3 flex flex-wrap gap-x-7 gap-y-2 text-[11.5px]">
            <div>
              <dt className="text-faint">Annualized software spend</dt>
              <dd className="tabular mt-0.5 text-[13px] font-semibold text-heading">{usd(annualTotal)}</dd>
            </div>
            <div>
              <dt className="text-faint">Renewing in 30 days</dt>
              <dd className="tabular mt-0.5 text-[13px] font-semibold text-heading">
                {renewalsIn30} renewal{renewalsIn30 === 1 ? "" : "s"}
              </dd>
            </div>
          </dl>
        </div>
        <div className="relative z-10 hidden min-w-0 rounded-xl border border-white/10 bg-white/[0.05] p-3 shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] sm:block">
          <div className="flex items-baseline justify-between gap-2 text-[11px]">
            <span className="font-medium text-muted">12-month run-rate · USD</span>
            <span className="tabular text-faint">{usd(monthlyTotal)}/mo now</span>
          </div>
          <div className="mt-1.5">
            <Sparkline values={runRateTrend} label="Example: monthly run-rate over the last 12 months" tone="light" height={44} />
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-2.5 text-[11px] text-muted">
            <span>
              <strong className="font-semibold text-heading">{summary.activeCount}</strong> active subscriptions
            </span>
            <span className="[&_.ring-surface]:ring-[#1a1530]">
              <LogoStack items={trackable.slice(0, 5)} max={5} size={20} />
            </span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
        <Kpi label="Active subscriptions" icon="layers" tone="violet" value={summary.activeCount} sub={`Across ${byCategory.length} categories`} />
        <Kpi label="Upcoming renewals" icon="calendar" tone="blue" value={renewalsIn30} sub="Next 30 days" />
        <Kpi label="Est. potential savings" icon="piggy" tone="green" value={`${usd(potentialAnnual)}/yr`} sub="Estimate, not guaranteed" />
        <Kpi
          label="Unused licenses"
          icon="key"
          tone="orange"
          value={seatTotals.purchased - seatTotals.assigned}
          chart={<Meter value={(seatTotals.assigned / seatTotals.purchased) * 100} label="Example: license utilization" tone="warn" />}
        />
      </div>

      <div className="hidden gap-2.5 sm:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <PreviewCard title="Spending by category">
          <DonutChart caption="Example: monthly spending by category" segments={byCategory} centerLabel="Per month" centerValue={usd(monthlyTotal)} />
        </PreviewCard>
        <PreviewCard title="Upcoming renewals" aside={<span className="text-[11px] text-faint">Next 30 days</span>}>
          <ul className="-my-2 divide-y divide-line">
            {["hubspot", "linear", "slack", "aws", "figma"].map((id) => (
              <SubRow key={id} s={byId(id)} compact />
            ))}
          </ul>
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
