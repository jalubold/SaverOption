import type { ReactNode } from "react";
import { cn } from "@/components/ui/primitives";

/**
 * A slim row of figures above a list (count, monthly equivalent, renewals…),
 * optionally ending in a logo stack. Works in server and client components.
 */
export function SummaryStrip({ children, aside, className, label }: { children: ReactNode; aside?: ReactNode; className?: string; label: string }) {
  return (
    <section aria-label={label} className={cn("biz-card mb-4 flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-5", className)}>
      <dl className="flex min-w-0 flex-wrap items-start gap-x-6 gap-y-3">{children}</dl>
      {aside && <div className="flex min-w-0 items-center gap-2.5 sm:ml-auto">{aside}</div>}
    </section>
  );
}

export function StripStat({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: ReactNode; tone?: "warn" | "accent" }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11.5px] font-medium uppercase tracking-[0.04em] text-faint">{label}</dt>
      <dd className={cn("tabular mt-0.5 text-[1.05rem] font-semibold leading-tight text-heading", tone === "warn" && "text-warn", tone === "accent" && "text-accent-ink")}>{value}</dd>
      {sub && <dd className="mt-0.5 text-[11.5px] text-faint">{sub}</dd>}
    </div>
  );
}
