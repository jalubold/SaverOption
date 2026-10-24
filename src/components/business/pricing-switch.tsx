"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/components/ui/primitives";

/**
 * Monthly / Yearly switch for the pricing cards. Both prices are rendered on
 * the server; this only flips data-interval on the wrapper, and the cards show
 * one or the other with group-data-[interval=…]/pricing variants (so the page
 * reads fine without JavaScript too, showing monthly).
 */
export function PricingSwitch({
  initial = "month",
  savingsBadge,
  dark,
  children,
  className,
}: {
  initial?: "month" | "year";
  /** e.g. "-17%"; shown next to "Yearly". */
  savingsBadge?: string | null;
  dark?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const [interval, setInterval] = useState<"month" | "year">(initial);
  const yearly = interval === "year";
  const label = (active: boolean) => cn("text-[15px] font-medium transition-colors", active ? (dark ? "text-white" : "text-fg") : dark ? "text-white/45 hover:text-white/75" : "text-faint hover:text-muted");
  return (
    <div data-interval={interval} className={cn("group/pricing", className)}>
      <div className="flex flex-wrap items-center justify-center gap-3" data-pricing-switch>
        <button type="button" className={label(!yearly)} onClick={() => setInterval("month")} aria-pressed={!yearly}>
          Monthly
        </button>
        <button
          type="button"
          role="switch"
          aria-checked={yearly}
          aria-label="Bill yearly"
          onClick={() => setInterval(yearly ? "month" : "year")}
          className={cn(
            "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30",
            yearly ? "bg-accent" : dark ? "bg-white/15" : "bg-line-strong",
          )}
        >
          <span className={cn("size-6 rounded-full bg-white shadow-[0_1px_3px_rgb(0_0_0/0.25)] transition-transform duration-200", yearly && "translate-x-5")} />
        </button>
        <button type="button" className={label(yearly)} onClick={() => setInterval("year")} aria-pressed={yearly}>
          Yearly
        </button>
        {savingsBadge && (
          <span className={cn("rounded-md px-2 py-0.5 text-[12.5px] font-semibold", dark ? "bg-emerald-400/15 text-emerald-300" : "bg-success/12 text-[color-mix(in_oklab,var(--success)_75%,black)]")} data-savings-badge>
            {savingsBadge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
