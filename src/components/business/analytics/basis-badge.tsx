import { cn } from "@/components/ui/primitives";
import type { InsightBasis } from "@/lib/business/insights-calc";

/** What a figure rests on: recorded payments, prices entered (normalized), or future renewals at today's prices. */
export const basisInfo: Record<InsightBasis, { label: string; explain: string; className: string }> = {
  actual: {
    label: "Actual",
    explain: "Recorded payments and records as entered — money your team logged as spent.",
    className: "bg-[#1baf7a]/12 text-[color-mix(in_oklab,#1baf7a_70%,black)]",
  },
  normalized_estimate: {
    label: "Normalized estimate",
    explain: "Monthly equivalent of each plan's entered price (yearly ÷ 12, quarterly ÷ 3) — a run-rate, not cash spent.",
    className: "bg-accent-soft text-accent-ink",
  },
  projection: {
    label: "Projection",
    explain: "Upcoming renewals at today's prices, assuming nothing changes.",
    className: "bg-[#eda100]/15 text-[color-mix(in_oklab,#eda100_55%,black)]",
  },
};

export function BasisBadge({ basis, className }: { basis: InsightBasis; className?: string }) {
  const b = basisInfo[basis];
  return (
    <span title={b.explain} className={cn("inline-flex items-center whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-semibold leading-4", b.className, className)}>
      {b.label}
    </span>
  );
}
