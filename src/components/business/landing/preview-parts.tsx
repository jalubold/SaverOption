import type { ReactNode } from "react";
import { SoftwareLogo } from "@/components/business/software-logo";
import { Pill } from "@/components/business/ui";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/components/ui/primitives";
import { intervalLabel, pricePerPeriod, type ExampleSub, type TimelineEntry } from "./example-data";

/** Building blocks for the landing page's product previews (example data only). */

/** A faux browser window around a preview, or (chrome="app") the Mac app's own window. */
export function AppWindow({ children, path, className, chrome = "browser" }: { children: ReactNode; path: string; className?: string; chrome?: "browser" | "app" }) {
  return (
    <div className={cn("theme-light overflow-hidden rounded-[18px] border border-line bg-bg text-fg shadow-[0_1px_0_rgb(255_255_255/0.6)_inset,0_40px_80px_-40px_rgb(0_0_0/0.7),0_0_0_1px_rgb(0_0_0/0.04)]", className)}>
      <div className="flex items-center gap-3 border-b border-line bg-surface px-3.5 py-2.5" aria-hidden="true">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#f2545b]/80" />
          <span className="size-2.5 rounded-full bg-[#eda100]/80" />
          <span className="size-2.5 rounded-full bg-[#1baf7a]/80" />
        </span>
        {chrome === "app" ? (
          <span className="mx-auto truncate text-[12px] font-semibold text-muted">Saver Option Business</span>
        ) : (
          <span className="mx-auto flex min-w-0 max-w-xs flex-1 items-center justify-center gap-1.5 truncate rounded-md bg-subtle px-3 py-1 text-[11.5px] text-faint">
            <Icon name="lock" size={11} />
            <span className="truncate">saveroption.com{path}</span>
          </span>
        )}
        <span className="hidden w-[42px] sm:block" />
      </div>
      {children}
    </div>
  );
}

export function PreviewCard({ title, aside, children, className }: { title: string; aside?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn("biz-card p-4", className)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[13px] font-semibold text-heading">{title}</p>
        {aside}
      </div>
      {children}
    </div>
  );
}

export function RenewalPill({ s }: { s: ExampleSub }) {
  if (s.cancelBy !== undefined && s.cancelBy <= 7) return <Pill tone="warn">Cancel by · {s.cancelBy}d</Pill>;
  return <Pill tone={s.renewsIn <= 7 ? "accent" : "neutral"}>Renews in {s.renewsIn}d</Pill>;
}

/** One subscription row: logo, name, interval, price and renewal pill. */
export function SubRow({ s, compact }: { s: ExampleSub; compact?: boolean }) {
  return (
    <li className="flex items-center gap-3 py-2">
      <SoftwareLogo name={s.name} src={s.logo} size={compact ? 26 : 30} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium text-fg">{s.name}</span>
        <span className="block truncate text-[11.5px] text-faint">
          {s.category} · {intervalLabel(s)}
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1">
        <span className="tabular text-[13px] font-semibold text-fg">{pricePerPeriod(s)}</span>
        <RenewalPill s={s} />
      </span>
    </li>
  );
}

const LANE = 34;

/** Greedy lanes, so logos that fall close together stack instead of overlapping. */
function placeLanes(items: TimelineEntry[], days: number, minGap: number) {
  const ends: number[] = [];
  const placed: (TimelineEntry & { pct: number; lane: number })[] = [];
  for (const it of [...items].sort((a, b) => a.daysLeft - b.daysLeft)) {
    const pct = Math.min(96, Math.max(4, (it.daysLeft / days) * 100));
    let lane = ends.findIndex((end) => pct - end >= minGap);
    if (lane === -1) lane = ends.length;
    ends[lane] = pct;
    placed.push({ ...it, pct, lane });
  }
  return { placed, lanes: Math.max(1, ends.length) };
}

/**
 * A static renewal strip for previews: logos on their renewal dates over the
 * next weeks. The visual is decorative; the same facts are in a list for
 * screen readers.
 */
export function MiniTimeline({ items, days = 30, minGap = 8, className }: { items: TimelineEntry[]; days?: number; minGap?: number; className?: string }) {
  const { placed, lanes } = placeLanes(
    items.filter((i) => i.daysLeft >= 0 && i.daysLeft <= days),
    days,
    minGap,
  );
  const weeks = Math.floor(days / 7);
  return (
    <div className={className}>
      <ul className="sr-only">
        {placed.map((it) => (
          <li key={`${it.id}-${it.kind}`}>
            {it.name}: {it.kind === "deadline" ? "cancellation deadline" : "renews"} in {it.daysLeft} days, {it.amount}
          </li>
        ))}
      </ul>
      <div aria-hidden="true" className="relative" style={{ height: 30 + lanes * LANE }}>
        <div className="absolute inset-x-0 bottom-[20px] h-px bg-line-strong" />
        <div className="absolute bottom-[20px] left-0 h-px w-[24%] bg-linear-to-r from-accent to-transparent" />
        {Array.from({ length: weeks + 1 }, (_, w) => (
          <div key={w} className="absolute bottom-0 flex -translate-x-1/2 flex-col items-center" style={{ left: `${Math.max(2, ((w * 7) / days) * 100)}%` }}>
            <span className={cn("mb-1 w-px", w === 0 ? "h-2.5 bg-accent" : "h-2 bg-line-strong")} />
            <span className={cn("text-[10px]", w === 0 ? "font-semibold text-accent-ink" : "text-faint")}>{w === 0 ? "Today" : `+${w * 7}d`}</span>
          </div>
        ))}
        {placed.map((it) => (
          <span
            key={`${it.id}-${it.kind}`}
            title={`${it.name} · ${it.kind === "deadline" ? "cancel by" : "renews"} in ${it.daysLeft}d · ${it.amount}`}
            className="absolute -translate-x-1/2"
            style={{ left: `${it.pct}%`, bottom: 26 + it.lane * LANE }}
          >
            <span className={cn("block rounded-[9px] ring-2", it.kind === "deadline" ? "ring-[#eda100]" : it.daysLeft <= 7 ? "ring-accent" : "ring-surface")}>
              <SoftwareLogo name={it.name} src={it.logo} size={24} />
            </span>
            <span className="absolute left-1/2 top-full h-[4px] w-px -translate-x-1/2 bg-line-strong" />
          </span>
        ))}
      </div>
      <div aria-hidden="true" className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10.5px] text-faint">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-accent" /> Within 7 days
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#eda100]" /> Cancellation deadline
        </span>
      </div>
    </div>
  );
}

/** A non-interactive control lookalike for previews (filters, buttons). */
export function FakeControl({ children, tone = "plain", className }: { children: ReactNode; tone?: "plain" | "primary"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-[12px] font-medium",
        tone === "primary" ? "border-transparent bg-accent text-white" : "border-line-strong bg-surface text-fg",
        className,
      )}
    >
      {children}
    </span>
  );
}
