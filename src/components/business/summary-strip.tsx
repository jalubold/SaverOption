import type { ReactNode } from "react";
import { cn } from "@/components/ui/primitives";

export interface StripCount {
  value: number;
  /** Lower-case, read after the number ("active", "renewing in 30 days"). */
  label: string;
  tone?: "warn" | "accent";
  /** Left out when it's zero, so the strip only says what's there. */
  hideZero?: boolean;
}

/**
 * A calm summary above a list: one main figure (with a line under it), the counts as small
 * pills (zeros left out where they'd only add noise) and, on wider screens, a logo stack.
 * Works in server and client components.
 */
export function SummaryStrip({
  label,
  figure,
  counts = [],
  aside,
  className,
}: {
  /** What it summarises, for screen readers. */
  label: string;
  figure?: { label: string; value: ReactNode; sub?: ReactNode };
  counts?: StripCount[];
  aside?: ReactNode;
  className?: string;
}) {
  const shown = counts.filter((c) => !(c.hideZero && c.value === 0));
  return (
    <section aria-label={label} className={cn("biz-card mb-4 flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3.5 sm:px-5", className)} data-summary-strip>
      {figure && (
        <div className="min-w-0">
          <p className="text-[12px] text-faint">{figure.label}</p>
          <div className="tabular text-[1.35rem] font-semibold leading-tight tracking-tight text-heading">{figure.value}</div>
          {figure.sub && <p className="mt-0.5 text-[12px] text-muted">{figure.sub}</p>}
        </div>
      )}
      {shown.length > 0 && (
        <ul className={cn("flex min-w-0 flex-wrap items-center gap-1.5", figure && "sm:border-l sm:border-line sm:pl-6")} aria-label="Counts">
          {shown.map((c) => (
            <li
              key={c.label}
              className={cn(
                "inline-flex items-baseline gap-1 rounded-full px-2.5 py-1 text-[12.5px]",
                c.tone === "warn" && c.value > 0 ? "bg-warn-soft text-warn" : c.tone === "accent" && c.value > 0 ? "bg-accent-soft text-accent-ink" : "bg-subtle text-muted",
              )}
            >
              <span className="tabular font-semibold">{c.value}</span>
              {c.label}
            </li>
          ))}
        </ul>
      )}
      {aside && <div className="ml-auto hidden min-w-0 items-center sm:flex">{aside}</div>}
    </section>
  );
}
