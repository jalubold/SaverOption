import { cn } from "@/components/ui/primitives";
import type { InsightBasis } from "@/lib/business/insights-calc";

/** What a figure rests on: recorded payments, prices entered (normalized), or future renewals at today's prices. */
export const basisInfo: Record<InsightBasis, { label: string; explain: string; className: string }> = {
  actual: {
    label: "Actual",
    explain: "Recorded payments and records as entered — money your team logged as spent.",
    className: "pill-success",
  },
  normalized_estimate: {
    label: "Normalized estimate",
    explain: "Monthly equivalent of each plan's entered price (yearly ÷ 12, quarterly ÷ 3) — a run-rate, not cash spent.",
    className: "pill-accent",
  },
  projection: {
    label: "Projection",
    explain: "Upcoming renewals at today's prices, assuming nothing changes.",
    className: "pill-warn",
  },
};

export function BasisBadge({ basis, className }: { basis: InsightBasis; className?: string }) {
  const b = basisInfo[basis];
  return (
    <span title={b.explain} className={cn("pill", b.className, className)}>
      {b.label}
    </span>
  );
}
