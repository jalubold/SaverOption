import {
  daysBetween,
  groupMonthly,
  isLive,
  isRecurring,
  lastMonths,
  licenseTotals,
  monthlyEquivalent,
  potentialSavings,
  realizedTotals,
  runRateByMonth,
  seatSummary,
  summarizeSpend,
  type CurrencyTotals,
  type LicenseTotals,
  type SpendSummary,
} from "@/lib/business/calc";
import { billingIntervalLabels, categoryLabels, subscriptionStatusLabels, type SoftwareCategory } from "@/lib/business/constants";
import type { BizContext } from "@/lib/server/business/context";
import {
  getCostHistory,
  getRealizedSavings,
  getSoftwareList,
  getSubscriptions,
  type Opportunity,
  type RealizedSavingRow,
  type Software,
  type Subscription,
} from "@/lib/server/business/data";
import { SUB_MONEY, type DisplayCurrency, type FxNote } from "@/lib/server/business/display-currency";
import { refreshSavings } from "@/lib/server/business/savings-sync";

/**
 * One model of a workspace's spending that the dashboard and reports both
 * render, so their totals always agree. Filters narrow the subscriptions;
 * everything downstream (totals, groups, seats, savings) uses that same slice.
 */

export interface SpendFilters {
  category?: SoftwareCategory | null;
  departmentId?: string | null;
  vendorId?: string | null;
  currency?: string | null;
}

export interface Group {
  key: string;
  label: string;
  totals: CurrencyTotals;
  count: number;
}

export interface AttentionItem {
  kind: "renewal_soon" | "deadline_soon" | "missing_date" | "missing_price" | "unused_seats" | "no_owner" | "overlap";
  title: string;
  detail: string;
  href: string;
  /** The software it's about, for its logo (null for workspace-level items). */
  software: { name: string; logo: string | null } | null;
}

export interface SpendModel {
  /** Non-archived subscriptions in the slice. */
  subs: Subscription[];
  software: Software[];
  summary: SpendSummary;
  currencies: string[];
  byVendor: Group[];
  byCategory: Group[];
  byDepartment: Group[];
  byInterval: Group[];
  byStatus: { status: string; label: string; count: number }[];
  licenses: LicenseTotals;
  runRate: { month: string; totals: CurrencyTotals }[];
  /** Whether run-rate history goes back far enough for a month-on-month comparison. */
  historyReliable: boolean;
  upcoming: Subscription[];
  highestCost: Subscription[];
  opportunities: Opportunity[];
  potential: ReturnType<typeof potentialSavings>;
  realized: CurrencyTotals;
  realizedRows: RealizedSavingRow[];
  attention: AttentionItem[];
  /** With a display currency: the currencies subscriptions are billed in (before conversion), and the rates used. */
  billedCurrencies: string[];
  fx: FxNote | null;
}

const UNASSIGNED = "__none__";

export function groupsFrom(subs: Subscription[], keyOf: (s: Subscription) => string, labelOf: (key: string) => string): Group[] {
  const totals = groupMonthly(subs, keyOf);
  const counts = new Map<string, number>();
  for (const s of subs) if (isRecurring(s)) counts.set(keyOf(s), (counts.get(keyOf(s)) ?? 0) + 1);
  return [...totals.entries()]
    .map(([key, t]) => ({ key, label: labelOf(key), totals: t, count: counts.get(key) ?? 0 }))
    .sort((a, b) => Math.max(...Object.values(b.totals)) - Math.max(...Object.values(a.totals)));
}

/**
 * Pass `display` to show every amount in the workspace currency (converted at
 * the ECB rate, see display-currency.ts); without it — as the MCP tools call
 * it — amounts stay in each subscription's own currency. Filters, including
 * the currency filter, always apply to the currency a subscription is billed in.
 */
export async function buildSpendModel(
  ctx: BizContext,
  filters: SpendFilters = {},
  opts: { refreshSavings?: boolean; months?: number; renewalWindowDays?: number; display?: DisplayCurrency } = {},
): Promise<SpendModel> {
  const ws = ctx.workspace.id;
  const d = opts.display;
  const [billed, software, rawHistory, rawRealized] = await Promise.all([getSubscriptions(ws), getSoftwareList(ws), getCostHistory(ws), getRealizedSavings(ws)]);
  const rawOpps = opts.refreshSavings === false ? [] : await refreshSavings(ctx);
  const history = d ? d.rows(rawHistory, ["priceMinor"]) : rawHistory;
  const realizedRows = d ? d.rows(rawRealized, ["amountMinor"]) : rawRealized;
  const opportunities = d ? d.rows(rawOpps, ["estMonthlyMinor"]) : rawOpps;
  const billedCurrencies = [...new Set(billed.filter((s) => !s.archived).map((s) => s.currency))];
  const match = (s: Subscription) =>
    !s.archived &&
    (!filters.category || s.category === filters.category) &&
    (!filters.departmentId || (filters.departmentId === UNASSIGNED ? !s.departmentId : s.departmentId === filters.departmentId)) &&
    (!filters.vendorId || s.vendorId === filters.vendorId) &&
    (!filters.currency || s.currency === filters.currency);
  const subs = d ? d.rows(billed.filter(match), SUB_MONEY) : billed.filter(match);
  const all = d ? d.rows(billed, SUB_MONEY) : billed;
  const ids = new Set(subs.map((s) => s.id));
  const window = opts.renewalWindowDays ?? 30;
  const summary = summarizeSpend(subs, ctx.today, window);

  const vendorNames = new Map(subs.map((s) => [s.vendorId ?? UNASSIGNED, s.vendorName ?? "No vendor"]));
  const deptNames = new Map(subs.map((s) => [s.departmentId ?? UNASSIGNED, s.departmentName ?? "No department"]));

  const months = lastMonths(ctx.today, opts.months ?? 12);
  const runRate = runRateByMonth(
    subs.map((s) => ({
      id: s.id,
      status: s.status,
      archived: s.archived,
      startDate: s.startDate ?? s.createdOn,
      endedOn: s.endedOn,
      history: history.filter((h) => h.subscriptionId === s.id),
    })),
    months,
  );
  const earliest = subs.reduce<string | null>((m, s) => {
    const d = s.startDate ?? s.createdOn;
    return !m || d < m ? d : m;
  }, null);

  const statusCounts = new Map<string, number>();
  for (const s of subs) statusCounts.set(s.status, (statusCounts.get(s.status) ?? 0) + 1);

  const upcoming = subs
    .filter((s) => isLive(s) && s.nextRenewalDate && daysBetween(ctx.today, s.nextRenewalDate) >= 0 && daysBetween(ctx.today, s.nextRenewalDate) <= window)
    .sort((a, b) => a.nextRenewalDate!.localeCompare(b.nextRenewalDate!));
  const pref = ctx.workspace.defaultCurrency;
  const highestCost = subs
    .filter((s) => isRecurring(s) && monthlyEquivalent(s) !== null)
    .sort((a, b) => Number(b.currency === pref) - Number(a.currency === pref) || monthlyEquivalent(b)! - monthlyEquivalent(a)!)
    .slice(0, 6);

  const scopedOpps = opportunities.filter((o) => !o.subscriptionId || ids.has(o.subscriptionId) || (filters.category || filters.departmentId || filters.vendorId || filters.currency ? false : true));
  const scopedRealized = realizedRows.filter((r) => !filters.currency || (r.original?.currency ?? r.currency) === filters.currency);

  return {
    subs,
    software,
    summary,
    currencies: [...new Set(all.filter((s) => !s.archived).map((s) => s.currency))].sort((a, b) => (a === pref ? -1 : b === pref ? 1 : a.localeCompare(b))),
    byVendor: groupsFrom(subs, (s) => s.vendorId ?? UNASSIGNED, (k) => vendorNames.get(k) ?? "No vendor"),
    byCategory: groupsFrom(subs, (s) => s.category, (k) => categoryLabels[k as SoftwareCategory] ?? k),
    byDepartment: groupsFrom(subs, (s) => s.departmentId ?? UNASSIGNED, (k) => deptNames.get(k) ?? "No department"),
    byInterval: groupsFrom(subs, (s) => s.billingInterval, (k) => billingIntervalLabels[k as keyof typeof billingIntervalLabels] ?? k),
    byStatus: [...statusCounts.entries()].map(([status, count]) => ({ status, label: subscriptionStatusLabels[status as keyof typeof subscriptionStatusLabels] ?? status, count })),
    licenses: licenseTotals(subs),
    runRate,
    historyReliable: earliest !== null && daysBetween(earliest, ctx.today) >= 60,
    upcoming,
    highestCost,
    opportunities: scopedOpps,
    potential: potentialSavings(scopedOpps),
    realized: realizedTotals(scopedRealized),
    realizedRows: scopedRealized,
    attention: attentionItems(ctx, subs, scopedOpps),
    billedCurrencies: billedCurrencies.sort((a, b) => (a === pref ? -1 : b === pref ? 1 : a.localeCompare(b))),
    fx: d?.note() ?? null,
  };
}

function attentionItems(ctx: BizContext, subs: Subscription[], opps: Opportunity[]): AttentionItem[] {
  const out: AttentionItem[] = [];
  const pref = ctx.workspace.defaultCurrency;
  // "High-cost": in the top quarter of priced recurring subscriptions in the default currency, or yearly.
  const priced = subs.filter((s) => isRecurring(s) && monthlyEquivalent(s) !== null && s.currency === pref).map((s) => monthlyEquivalent(s)!).sort((a, b) => b - a);
  const highCut = priced.length ? priced[Math.max(0, Math.floor(priced.length / 4) - 1)] : Infinity;
  for (const s of subs) {
    if (!isLive(s)) continue;
    const href = `/business/subscriptions/${s.id}`;
    const software = { name: s.softwareName, logo: s.logoSrc };
    if (s.nextRenewalDate) {
      const days = daysBetween(ctx.today, s.nextRenewalDate);
      const m = monthlyEquivalent(s);
      const high = s.billingInterval === "yearly" || (m !== null && s.currency === pref && m >= highCut);
      if (days >= 0 && days <= 14 && high && s.renewalDecision === "undecided")
        out.push({ kind: "renewal_soon", title: `${s.softwareName} renews in ${days} day${days === 1 ? "" : "s"}`, detail: "High-cost renewal with no decision recorded.", href, software });
    } else out.push({ kind: "missing_date", title: `${s.softwareName} has no renewal date`, detail: "Add it so reminders and the renewal calendar include it.", href: `${href}/edit`, software });
    if (s.cancellationDeadline && s.autoRenew) {
      const d = daysBetween(ctx.today, s.cancellationDeadline);
      if (d >= 0 && d <= 14) out.push({ kind: "deadline_soon", title: `Cancellation deadline for ${s.softwareName} in ${d} day${d === 1 ? "" : "s"}`, detail: "After it, the next period is charged automatically.", href, software });
    }
    if (isRecurring(s) && s.priceMinor === null) out.push({ kind: "missing_price", title: `${s.softwareName} has no price`, detail: "It's left out of spending totals until a price is added.", href: `${href}/edit`, software });
    if (!s.ownerPersonId) out.push({ kind: "no_owner", title: `${s.softwareName} has no owner`, detail: "Assign someone to own renewals and seats.", href: `${href}/edit`, software });
    const seats = seatSummary(s);
    if (seats.available && seats.available > 0 && seats.purchased) out.push({ kind: "unused_seats", title: `${seats.available} unused ${s.softwareName} seat${seats.available === 1 ? "" : "s"}`, detail: `${seats.assigned} of ${seats.purchased} in use.`, href: `/business/licenses/${s.id}`, software });
  }
  for (const o of opps) {
    if (o.type === "overlapping_software" && o.status === "open") out.push({ kind: "overlap", title: o.title, detail: "Potential overlap for review — not a confirmed duplicate.", href: `/business/savings?focus=${o.id}#${o.id}`, software: null });
  }
  const order: AttentionItem["kind"][] = ["deadline_soon", "renewal_soon", "unused_seats", "overlap", "missing_price", "missing_date", "no_owner"];
  return out.sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind));
}
