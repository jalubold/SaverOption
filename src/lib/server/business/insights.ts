import { lastMonths, runRateByMonth } from "@/lib/business/calc";
import { computeInsights, periodChanges, type Insight, type InsightsInput, type PeriodChange } from "@/lib/business/insights-calc";
import { buildSpendModel, type SpendModel } from "@/lib/server/business/analytics";
import type { BizContext } from "@/lib/server/business/context";
import { getCostHistory, getPayments } from "@/lib/server/business/data";

export type { Insight, InsightBasis, PeriodChange } from "@/lib/business/insights-calc";

/**
 * Evidence-backed spending insights for a workspace (deterministic rules over
 * its own records — see src/lib/business/insights-calc.ts). Pass the spend
 * model when the caller already built one, so the totals match its page.
 */
export async function buildInsights(ctx: BizContext, opts: { model?: SpendModel } = {}): Promise<{ insights: Insight[]; changes: PeriodChange[]; input: InsightsInput }> {
  const ws = ctx.workspace.id;
  const [model, history, payments] = await Promise.all([opts.model ?? buildSpendModel(ctx, {}, { refreshSavings: false }), getCostHistory(ws), getPayments(ws)]);
  const ids = new Set(model.subs.map((s) => s.id));
  const runRate = runRateByMonth(
    model.subs.map((s) => ({
      id: s.id,
      status: s.status,
      archived: s.archived,
      startDate: s.startDate ?? s.createdOn,
      endedOn: s.endedOn,
      history: history.filter((h) => h.subscriptionId === s.id),
    })),
    lastMonths(ctx.today, 7),
  );
  const input: InsightsInput = {
    today: ctx.today,
    dateFormat: ctx.workspace.dateFormat,
    subs: model.subs,
    runRate,
    payments: payments.filter((p) => ids.has(p.subscriptionId)).map((p) => ({ amountMinor: p.amountMinor, currency: p.currency, paidOn: p.paidOn, subscriptionId: p.subscriptionId })),
  };
  return { insights: computeInsights(input), changes: periodChanges(input), input };
}

/** Just the insights (for the MCP `analyze_saas_spending` tool and the dashboard). */
export async function getSpendingInsights(ctx: BizContext, opts: { model?: SpendModel; limit?: number } = {}): Promise<Insight[]> {
  const { insights } = await buildInsights(ctx, opts);
  return insights.slice(0, Math.min(Math.max(opts.limit ?? 20, 1), 50));
}
