/**
 * Seat utilization over time, from named seat assignments (when each started
 * and was released) and the purchased seat counts in each subscription's cost
 * history. It only covers named assignments — reported counts have no history,
 * and nothing here reflects actual product usage.
 *
 * Pure module, so Node tests run it directly.
 */
import { addDays, monthEnd } from "./calc.ts";

export interface AssignmentSpan {
  subscriptionId: string;
  /** When the seat was assigned (a Date or an ISO timestamp). */
  assignedAt: Date | string;
  releasedAt: Date | string | null;
}

export interface SeatTermsPoint {
  subscriptionId: string;
  effectiveFrom: string;
  purchasedSeats: number | null;
}

export interface UtilizationPoint {
  month: string;
  /** Named seats assigned at the month's end (capped at each subscription's purchased seats). */
  assigned: number;
  purchased: number;
  /** assigned ÷ purchased × 100; null when no seats were purchased at that date. */
  utilization: number | null;
}

const day = (v: Date | string): string => (typeof v === "string" ? v : v.toISOString()).slice(0, 10);

/**
 * Utilization at each month's end for the given subscriptions. A seat counts
 * when it was assigned on or before the month's last day and not released by
 * then; purchased seats come from the cost-history entry in effect that day.
 */
export function utilizationByMonth(subscriptionIds: string[], assignments: AssignmentSpan[], history: SeatTermsPoint[], months: string[]): UtilizationPoint[] {
  const ids = new Set(subscriptionIds);
  return months.map((month) => {
    const end = monthEnd(month);
    let assigned = 0;
    let purchased = 0;
    for (const id of ids) {
      const terms = history
        .filter((h) => h.subscriptionId === id && h.effectiveFrom <= end)
        .sort((a, b) => a.effectiveFrom.localeCompare(b.effectiveFrom))
        .at(-1);
      const seats = terms?.purchasedSeats ?? 0;
      if (!seats) continue;
      const active = assignments.filter((a) => a.subscriptionId === id && day(a.assignedAt) <= end && (a.releasedAt === null || day(a.releasedAt) > end)).length;
      purchased += seats;
      assigned += Math.min(active, seats);
    }
    return { month, assigned, purchased, utilization: purchased > 0 ? (assigned / purchased) * 100 : null };
  });
}

/** Whether named assignments go back at least `days` days — enough history to be worth charting. */
export function hasAssignmentHistory(assignments: AssignmentSpan[], today: string, days = 30): boolean {
  const cutoff = addDays(today, -days);
  return assignments.some((a) => day(a.assignedAt) <= cutoff);
}
