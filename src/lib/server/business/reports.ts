import {
  addDays,
  addMonths,
  addTo,
  annualized,
  daysBetween,
  fiscalYearStart,
  isIsoDate,
  isLive,
  isRecurring,
  monthEnd,
  nextPeriodDate,
  potentialSavings,
  realizedTotals,
  runRateByMonth,
  seatSummary,
  type CurrencyTotals,
  type SeatSummary,
} from "@/lib/business/calc";
import { OPPORTUNITY_TYPES, SOFTWARE_CATEGORIES, type OpportunityType, type SoftwareCategory } from "@/lib/business/constants";
import { buildSpendModel, type SpendModel } from "@/lib/server/business/analytics";
import type { BizContext } from "@/lib/server/business/context";
import {
  getActivity,
  getCostHistory,
  getDepartments,
  getPayments,
  getSubscriptions,
  getVendors,
  type ActivityItem,
  type Payment,
  type RealizedSavingRow,
  type Subscription,
} from "@/lib/server/business/data";

/**
 * Every Reports dataset, built once from the shared spend model (the same one
 * the Overview uses) plus recorded payments, renewals and the audit log for a
 * date range. The Reports page and its CSV exports both call buildReport, so a
 * downloaded file always matches what's on screen.
 *
 * Three kinds of money appear and are never mixed:
 * - recurring run-rate (monthly equivalent, and annualized = × 12) — what the
 *   current subscriptions cost per month/year, not money spent;
 * - recorded payments — actual expenditure the team entered, by payment date;
 * - renewal commitments — charges scheduled by auto-renewing subscriptions.
 * All totals stay per currency.
 */

export const RANGE_PRESETS = ["this_month", "last_month", "last_3_months", "last_6_months", "last_12_months", "this_fiscal_year", "last_fiscal_year", "custom"] as const;
export type RangePreset = (typeof RANGE_PRESETS)[number];

export const rangeLabels: Record<RangePreset, string> = {
  this_month: "This month",
  last_month: "Last month",
  last_3_months: "Last 3 months",
  last_6_months: "Last 6 months",
  last_12_months: "Last 12 months",
  this_fiscal_year: "This fiscal year",
  last_fiscal_year: "Last fiscal year",
  custom: "Custom range",
};

export const REPORT_KEYS = ["summary", "subscriptions", "vendors", "categories", "departments", "intervals", "renewals", "licenses", "payments", "savings", "realized", "activity"] as const;
export type ReportKey = (typeof REPORT_KEYS)[number];

export interface ReportParams {
  preset: RangePreset;
  from: string;
  to: string;
  /** Restricts the report to one currency; null = every currency, side by side. */
  currency: string | null;
  category: SoftwareCategory | null;
  /** A department id, "none" (no department), or null for all. */
  department: string | null;
  vendor: string | null;
}

export interface ReportOptions {
  currencies: string[];
  departments: { id: string; name: string }[];
  vendors: { id: string; name: string }[];
}

type Raw = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (typeof v === "string" ? v.trim() : Array.isArray(v) ? (v[0] ?? "").trim() : "");

/** The date span a preset covers, relative to the workspace's today and fiscal year. */
export function presetRange(preset: Exclude<RangePreset, "custom">, today: string, fiscalStartMonth: number): { from: string; to: string } {
  const monthStart = `${today.slice(0, 7)}-01`;
  const lastN = (n: number) => ({ from: addMonths(monthStart, -(n - 1)), to: today });
  switch (preset) {
    case "this_month":
      return { from: monthStart, to: today };
    case "last_month": {
      const start = addMonths(monthStart, -1);
      return { from: start, to: monthEnd(start.slice(0, 7)) };
    }
    case "last_3_months":
      return lastN(3);
    case "last_6_months":
      return lastN(6);
    case "last_12_months":
      return lastN(12);
    case "this_fiscal_year":
      return { from: fiscalYearStart(today, fiscalStartMonth), to: today };
    case "last_fiscal_year": {
      const start = fiscalYearStart(today, fiscalStartMonth);
      return { from: addMonths(start, -12), to: addDays(start, -1) };
    }
  }
}

/**
 * Reads and validates the report controls. Anything invalid falls back to the
 * default (last 12 months, all currencies, no filters) and is listed in `invalid`.
 */
export function parseReportParams(ctx: BizContext, raw: Raw, options: ReportOptions): { params: ReportParams; invalid: string[] } {
  const invalid: string[] = [];
  const presetRaw = one(raw.range);
  let preset: RangePreset = (RANGE_PRESETS as readonly string[]).includes(presetRaw) ? (presetRaw as RangePreset) : "last_12_months";
  if (presetRaw && preset !== presetRaw) invalid.push("date range");
  let from: string;
  let to: string;
  if (preset === "custom") {
    const f = one(raw.from);
    const t = one(raw.to);
    const ok = isIsoDate(f) && isIsoDate(t) && f <= t && f >= "2000-01-01" && daysBetween(f, t) <= 366 * 5;
    if (ok) {
      from = f;
      to = t;
    } else {
      invalid.push("custom dates");
      preset = "last_12_months";
      ({ from, to } = presetRange(preset, ctx.today, ctx.workspace.fiscalYearStart));
    }
  } else ({ from, to } = presetRange(preset, ctx.today, ctx.workspace.fiscalYearStart));

  const cur = one(raw.currency).toUpperCase();
  const currency = cur && options.currencies.includes(cur) ? cur : null;
  if (cur && cur !== "ALL" && !currency) invalid.push("currency");

  const cat = one(raw.category);
  const category = (SOFTWARE_CATEGORIES as readonly string[]).includes(cat) ? (cat as SoftwareCategory) : null;
  if (cat && !category) invalid.push("category");

  const dep = one(raw.department);
  const department = dep === "none" || options.departments.some((d) => d.id === dep) ? dep : null;
  if (dep && !department) invalid.push("department");

  const ven = one(raw.vendor);
  const vendor = options.vendors.some((v) => v.id === ven) ? ven : null;
  if (ven && !vendor) invalid.push("vendor");

  return { params: { preset, from, to, currency, category, department, vendor }, invalid };
}

/** Query string for links that keep the current controls (CSV exports, tabs). */
export function paramsQuery(p: ReportParams): string {
  const q = new URLSearchParams();
  q.set("range", p.preset);
  if (p.preset === "custom") {
    q.set("from", p.from);
    q.set("to", p.to);
  }
  if (p.currency) q.set("currency", p.currency);
  if (p.category) q.set("category", p.category);
  if (p.department) q.set("department", p.department);
  if (p.vendor) q.set("vendor", p.vendor);
  return q.toString();
}

export function hasFilters(p: ReportParams): boolean {
  return Boolean(p.currency || p.category || p.department || p.vendor);
}

// ─── Datasets ───────────────────────────────────────────────────────────────

export interface CommitmentRow {
  sub: Subscription;
  dates: string[];
  /** price × occurrences; null when the price is unknown. */
  amount: number | null;
  /** Auto-renew is off: nothing is charged unless someone renews it, so it isn't counted. */
  manual: boolean;
}

export interface LicenseRow {
  sub: Subscription;
  seats: SeatSummary;
}

export interface SavingsTypeRow {
  type: OpportunityType;
  count: number;
  withEstimate: number;
  /** Per-type potential (each subscription once within the type). Types can overlap each other. */
  monthly: CurrencyTotals;
  annual: CurrencyTotals;
}

export interface Report {
  params: ReportParams;
  invalid: string[];
  options: ReportOptions;
  model: SpendModel;
  /** Months shown in the run-rate trend (range months up to the current month). */
  months: string[];
  runRate: { month: string; totals: CurrencyTotals }[];
  /** The currency charts use: the chosen currency, else the workspace default (or the first available). */
  chartCurrency: string;
  payments: Payment[];
  paymentsByMonth: { month: string; totals: CurrencyTotals; count: number }[];
  paymentsTotal: CurrencyTotals;
  annualizedRows: Subscription[];
  commitments: { from: string; to: string; rows: CommitmentRow[]; totals: CurrencyTotals };
  licenseRows: LicenseRow[];
  savingsByType: SavingsTypeRow[];
  realizedRows: RealizedSavingRow[];
  realizedInRange: CurrencyTotals;
  activity: ActivityItem[];
}

const monthsBetween = (from: string, to: string): string[] => {
  const out: string[] = [];
  for (let m = `${from.slice(0, 7)}-01`; m.slice(0, 7) <= to.slice(0, 7) && out.length < 120; m = addMonths(m, 1)) out.push(m.slice(0, 7));
  return out;
};

export async function buildReport(ctx: BizContext, raw: Raw): Promise<Report> {
  const ws = ctx.workspace.id;
  const [allSubs, departments, vendors] = await Promise.all([getSubscriptions(ws), getDepartments(ws), getVendors(ws)]);
  const pref = ctx.workspace.defaultCurrency;
  const live = allSubs.filter((s) => !s.archived);
  const options: ReportOptions = {
    currencies: [...new Set(live.map((s) => s.currency))].sort((a, b) => (a === pref ? -1 : b === pref ? 1 : a.localeCompare(b))),
    departments: departments.filter((d) => !d.archivedAt).map((d) => ({ id: d.id, name: d.name })),
    vendors: vendors.map((v) => ({ id: v.id, name: v.name })),
  };
  const { params, invalid } = parseReportParams(ctx, raw, options);
  const filters = {
    category: params.category,
    departmentId: params.department === "none" ? "__none__" : params.department,
    vendorId: params.vendor,
    currency: params.currency,
  };
  const [model, history, allPayments, activity] = await Promise.all([
    buildSpendModel(ctx, filters),
    getCostHistory(ws),
    getPayments(ws),
    getActivity(ws, { limit: 200 }),
  ]);
  const inSlice = new Set(model.subs.map((s) => s.id));
  const chartCurrency = params.currency ?? (model.currencies.includes(pref) || model.currencies.length === 0 ? pref : model.currencies[0]);

  // Run-rate trend: the shared runRateByMonth over the range's months (never past this month).
  const currentMonth = ctx.today.slice(0, 7);
  const months = monthsBetween(params.from, params.to < ctx.today ? params.to : ctx.today).filter((m) => m <= currentMonth);
  const runRate = runRateByMonth(
    model.subs.map((s) => ({
      id: s.id,
      status: s.status,
      archived: s.archived,
      startDate: s.startDate ?? s.createdOn,
      endedOn: s.endedOn,
      history: history.filter((h) => h.subscriptionId === s.id),
    })),
    months,
  );

  // Recorded payments (actual expenditure) in the range, for subscriptions in the slice.
  const payments = allPayments.filter((p) => inSlice.has(p.subscriptionId) && p.paidOn >= params.from && p.paidOn <= params.to);
  const paymentsTotal: CurrencyTotals = {};
  const byMonth = new Map<string, { totals: CurrencyTotals; count: number }>();
  for (const m of monthsBetween(params.from, params.to)) byMonth.set(m, { totals: {}, count: 0 });
  for (const p of payments) {
    addTo(paymentsTotal, p.currency, p.amountMinor);
    const row = byMonth.get(p.paidOn.slice(0, 7));
    if (row) {
      addTo(row.totals, p.currency, p.amountMinor);
      row.count++;
    }
  }

  const annualizedRows = model.subs
    .filter(isRecurring)
    .sort((a, b) => Number(b.currency === pref) - Number(a.currency === pref) || a.currency.localeCompare(b.currency) || (annualized(b) ?? -1) - (annualized(a) ?? -1));

  // Renewal commitments from today to the later of the range end and 12 months out.
  const commitFrom = ctx.today;
  const commitTo = params.to > addMonths(ctx.today, 12) ? params.to : addMonths(ctx.today, 12);
  const rows: CommitmentRow[] = [];
  const commitTotals: CurrencyTotals = {};
  for (const s of model.subs) {
    if (!isLive(s) || !s.nextRenewalDate) continue;
    const end = s.contractEndDate && s.contractEndDate < commitTo ? s.contractEndDate : commitTo;
    const dates: string[] = [];
    let d = s.nextRenewalDate;
    for (let guard = 0; d <= end && guard < 400; guard++) {
      if (d >= commitFrom) dates.push(d);
      if (!s.autoRenew) break;
      d = nextPeriodDate(d, s);
    }
    if (dates.length === 0) continue;
    const manual = !s.autoRenew;
    const amount = s.priceMinor === null ? null : s.priceMinor * (manual ? 1 : dates.length);
    if (amount !== null && !manual) addTo(commitTotals, s.currency, amount);
    rows.push({ sub: s, dates, amount, manual });
  }
  rows.sort((a, b) => a.dates[0].localeCompare(b.dates[0]));

  const licenseRows = model.subs
    .filter((s) => isLive(s) && s.purchasedSeats)
    .map((s) => ({ sub: s, seats: seatSummary(s) }))
    .sort((a, b) => (a.seats.utilization ?? 101) - (b.seats.utilization ?? 101));

  const active = model.opportunities.filter((o) => o.status === "open" || o.status === "reviewed");
  const savingsByType: SavingsTypeRow[] = OPPORTUNITY_TYPES.map((type) => {
    const list = active.filter((o) => o.type === type);
    const p = potentialSavings(list);
    return { type, count: list.length, withEstimate: list.filter((o) => o.estMonthlyMinor !== null).length, monthly: p.monthly, annual: p.annual };
  }).filter((r) => r.count > 0);

  const filtered = params.category || params.department || params.vendor;
  const realizedRows = model.realizedRows.filter(
    (r) => r.confirmedOn >= params.from && r.confirmedOn <= params.to && (!filtered || (r.subscriptionId !== null && inSlice.has(r.subscriptionId))),
  );

  return {
    params,
    invalid,
    options,
    model,
    months,
    runRate,
    chartCurrency,
    payments,
    paymentsByMonth: [...byMonth.entries()].map(([month, v]) => ({ month, ...v })),
    paymentsTotal,
    annualizedRows,
    commitments: { from: commitFrom, to: commitTo, rows, totals: commitTotals },
    licenseRows,
    savingsByType,
    realizedRows,
    realizedInRange: realizedTotals(realizedRows),
    activity: activity.filter((a) => {
      const day = a.createdAt.toISOString().slice(0, 10);
      return day >= params.from && day <= params.to;
    }),
  };
}

