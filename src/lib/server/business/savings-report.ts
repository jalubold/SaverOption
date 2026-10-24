import { daysBetween, formatIsoDate, formatMoney, isLive, totalsList, type CurrencyTotals } from "@/lib/business/calc";
import { opportunityTypeLabels } from "@/lib/business/constants";
import { buildSpendModel } from "@/lib/server/business/analytics";
import type { DisplayCurrency } from "@/lib/server/business/display-currency";
import { logActivity, type BizContext } from "@/lib/server/business/context";
import { db } from "@/lib/server/db";

/**
 * A savings report: a dated snapshot of the workspace's spending, potential
 * (estimated) savings, confirmed (realized) savings and upcoming renewals,
 * with the method behind each figure. Generated from the same spend model as
 * the dashboard, and saved so it can be shared and compared later.
 */

export interface ReportMoney {
  amount: number;
  currency: string;
  display: string;
}

export interface SavingsReport {
  version: 1;
  title: string;
  workspaceName: string;
  asOf: string;
  generatedAt: string;
  spend: { monthly: ReportMoney[]; annualized: ReportMoney[]; activeSubscriptions: number; withoutPrice: number; basis: string };
  potential: {
    annual: ReportMoney[];
    withEstimate: number;
    withoutEstimate: number;
    basis: string;
    byType: { type: string; label: string; count: number }[];
    top: { id: string; title: string; type: string; annualEstimate: ReportMoney | null; confidence: string; recommendedAction: string; evidence: { label: string; value: string }[] }[];
  };
  realized: { firstYear: ReportMoney[]; entries: { description: string; amount: ReportMoney; recurrence: string; confirmedOn: string }[]; basis: string };
  renewals: { days: number; items: { subscriptionId: string; software: string; date: string; daysLeft: number; amount: ReportMoney | null; autoRenew: boolean; decision: string }[]; totals: ReportMoney[]; basis: string };
  dataQuality: string[];
  method: string[];
}

const money = (amount: number, currency: string): ReportMoney => ({ amount: Math.round(amount), currency, display: formatMoney(Math.round(amount), currency) });
const list = (t: CurrencyTotals, pref: string) => totalsList(t, pref).map((x) => money(x.amount, x.currency));

/** Reports saved from the app pass `display` (amounts in the workspace currency); MCP keeps each currency. */
export async function buildSavingsReport(ctx: BizContext, opts: { title?: string; renewalDays?: number; display?: DisplayCurrency } = {}): Promise<SavingsReport> {
  const days = Math.min(365, Math.max(7, opts.renewalDays ?? 90));
  const model = await buildSpendModel(ctx, {}, { renewalWindowDays: days, display: opts.display });
  const pref = ctx.workspace.defaultCurrency;
  const open = model.opportunities.filter((o) => o.status === "open" || o.status === "reviewed");
  const byType = new Map<string, number>();
  for (const o of open) byType.set(o.type, (byType.get(o.type) ?? 0) + 1);
  const renewals = model.subs
    .filter((s) => isLive(s) && s.nextRenewalDate && daysBetween(ctx.today, s.nextRenewalDate) >= 0 && daysBetween(ctx.today, s.nextRenewalDate) <= days)
    .sort((a, b) => a.nextRenewalDate!.localeCompare(b.nextRenewalDate!));
  const renewalTotals: CurrencyTotals = {};
  for (const s of renewals) if (s.priceMinor !== null) renewalTotals[s.currency] = (renewalTotals[s.currency] ?? 0) + s.priceMinor;
  const unverified = model.subs.filter((s) => s.source === "csv_import" && !s.lastVerifiedOn).length;
  const quality = [
    model.summary.missingPrice ? `${model.summary.missingPrice} active subscription(s) have no price and are left out of the totals.` : null,
    model.summary.missingRenewalDate ? `${model.summary.missingRenewalDate} live subscription(s) have no renewal date.` : null,
    unverified ? `${unverified} imported subscription(s) haven't been reviewed since the import.` : null,
    model.fx
      ? `Amounts billed in ${model.fx.rates.map((r) => r.currency).join(", ")} are converted to ${model.fx.to} at the European Central Bank reference rate of ${model.fx.date} (${model.fx.rates.map((r) => `1 ${r.currency} = ${r.rate.toFixed(4)} ${model.fx!.to}`).join(", ")}).`
      : model.currencies.length > 1
        ? `Spending is in ${model.currencies.length} currencies (${model.currencies.join(", ")}); totals are shown per currency and never converted.`
        : null,
  ].filter((x): x is string => Boolean(x));

  return {
    version: 1,
    title: (opts.title?.trim() || `Savings report — ${formatIsoDate(ctx.today, "MMM d, yyyy")}`).slice(0, 200),
    workspaceName: ctx.workspace.name,
    asOf: ctx.today,
    generatedAt: new Date().toISOString(),
    spend: {
      monthly: list(model.summary.monthly, pref),
      annualized: list(model.summary.annualized, pref),
      activeSubscriptions: model.summary.activeCount,
      withoutPrice: model.summary.missingPrice,
      basis: "Normalized estimate: each active subscription's price converted to a monthly equivalent (annualized = × 12). Not cash spent.",
    },
    potential: {
      annual: list(model.potential.annual, pref),
      withEstimate: model.potential.counted,
      withoutEstimate: model.potential.withoutEstimate,
      basis: "Estimate: only where your own prices and seat counts support an amount; each subscription counted once (its largest estimate). Potential, not guaranteed.",
      byType: [...byType.entries()].map(([type, count]) => ({ type, label: opportunityTypeLabels[type as keyof typeof opportunityTypeLabels] ?? type, count })).sort((a, b) => b.count - a.count),
      top: open
        .sort((a, b) => (b.estMonthlyMinor ?? -1) - (a.estMonthlyMinor ?? -1))
        .slice(0, 10)
        .map((o) => ({
          id: o.id,
          title: o.title,
          type: opportunityTypeLabels[o.type] ?? o.type,
          annualEstimate: o.estMonthlyMinor !== null && o.currency ? money(o.estMonthlyMinor * 12, o.currency) : null,
          confidence: o.confidence,
          recommendedAction: o.recommendedAction,
          evidence: o.evidence.slice(0, 6),
        })),
    },
    realized: {
      firstYear: list(model.realized, pref),
      entries: model.realizedRows.slice(0, 20).map((r) => ({ description: r.description, amount: money(r.amountMinor, r.currency), recurrence: r.recurrence, confirmedOn: r.confirmedOn })),
      basis: "Actual: savings someone in the workspace confirmed after the expense was reduced. First-year value: one-time as entered, monthly × 12, yearly as entered.",
    },
    renewals: {
      days,
      items: renewals.slice(0, 50).map((s) => ({
        subscriptionId: s.id,
        software: s.softwareName,
        date: s.nextRenewalDate!,
        daysLeft: daysBetween(ctx.today, s.nextRenewalDate!),
        amount: s.priceMinor !== null ? money(s.priceMinor, s.currency) : null,
        autoRenew: s.autoRenew,
        decision: s.renewalDecision,
      })),
      totals: list(renewalTotals, pref),
      basis: `Projection: each live subscription renewing in the next ${days} days at its current recorded price per billing period.`,
    },
    dataQuality: quality,
    method: [
      "All figures come from the records in this workspace; nothing is estimated from outside data.",
      "Currencies are never added together or converted.",
      "Seat usage is what your team assigned or reported; no usage integration measures it.",
      "Potential savings are separate from realized savings and never counted as realized until confirmed.",
    ],
  };
}

export async function saveSavingsReport(ctx: BizContext, report: SavingsReport, source: "app" | "mcp"): Promise<string> {
  return db().begin(async (sql) => {
    const [row] = await sql`
      insert into biz_reports (workspace_id, kind, title, content, source, created_by)
      values (${ctx.workspace.id}, 'savings', ${report.title}, ${sql.json(report as never)}, ${source}, ${ctx.user.id})
      returning id`;
    await logActivity(sql, ctx, {
      action: "report.generated",
      entityType: "report",
      entityId: row.id,
      summary: `Generated a savings report${source === "mcp" ? " via an AI client (MCP)" : ""}`,
    });
    return row.id as string;
  });
}

export interface SavedReportRow {
  id: string;
  title: string;
  source: "app" | "mcp";
  createdAt: Date;
  createdByName: string | null;
}

export async function listSavedReports(ctx: BizContext, limit = 20): Promise<SavedReportRow[]> {
  const rows = await db()`
    select r.id, r.title, r.source, r.created_at,
      (select a.actor_name from biz_activity a where a.workspace_id = r.workspace_id and a.entity_id = r.id order by a.created_at limit 1) as by_name
    from biz_reports r where r.workspace_id = ${ctx.workspace.id} order by r.created_at desc limit ${limit}`;
  return rows.map((r) => ({ id: r.id, title: r.title, source: r.source, createdAt: r.created_at, createdByName: r.by_name }));
}

export async function getSavedReport(ctx: BizContext, id: string): Promise<(SavedReportRow & { content: SavingsReport }) | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [r] = await db()`select id, title, source, created_at, content from biz_reports where workspace_id = ${ctx.workspace.id} and id = ${id}`;
  return r ? { id: r.id, title: r.title, source: r.source, createdAt: r.created_at, createdByName: null, content: r.content as SavingsReport } : null;
}
