/**
 * The shared calculation layer for Saver Option Business. The dashboard,
 * subscription pages, licenses, renewals, reports and savings engine all call
 * these functions, so every page applies the same rules:
 *
 * - Money is integer minor units (cents, yen) plus an ISO currency code.
 *   Totals are kept per currency and never added across currencies — there is
 *   no exchange-rate source.
 * - Monthly equivalent = price per billing period ÷ months in the period
 *   (monthly 1, quarterly 3, yearly 12, custom: days × 12/365, weeks × 7 × 12/365,
 *   months as given, years × 12).
 * - Annualized recurring cost = monthly equivalent × 12. It is a run-rate, not
 *   money spent: actual expenditure comes only from recorded payments.
 * - Only active, non-archived subscriptions count towards recurring cost.
 *   Trials, paused, cancelled and expired subscriptions don't (a trial joins
 *   once someone marks it active). A missing price counts as "unknown", never 0.
 * - Seats in use = the larger of named seat assignments and the count someone
 *   reported. Nothing here knows actual product usage: there's no usage integration.
 *
 * Pure module (no imports outside this folder) so Node can test it directly.
 */
import type { BillingInterval, IntervalUnit, PricingModel, SubscriptionStatus } from "./constants.ts";

// ─── Money ──────────────────────────────────────────────────────────────────

/** Totals per currency code. */
export type CurrencyTotals = Record<string, number>;

const digitsCache = new Map<string, number>();

/** Minor-unit digits for a currency (2 for USD, 0 for JPY and IDR display, 3 for KWD). */
export function currencyDigits(currency: string): number {
  const hit = digitsCache.get(currency);
  if (hit !== undefined) return hit;
  let digits = 2;
  try {
    digits = new Intl.NumberFormat("en-US", { style: "currency", currency }).resolvedOptions().maximumFractionDigits ?? 2;
  } catch {
    digits = 2;
  }
  digitsCache.set(currency, digits);
  return digits;
}

export function isCurrencyCode(value: string): boolean {
  if (!/^[A-Z]{3}$/.test(value)) return false;
  try {
    new Intl.NumberFormat("en-US", { style: "currency", currency: value });
    return true;
  } catch {
    return false;
  }
}

/**
 * Parses a typed amount ("1,299.50", "49") into minor units. Returns null for
 * an empty input and NaN for anything that isn't a non-negative amount with at
 * most the currency's decimal places.
 */
export function parseMoney(input: string, currency: string): number | null {
  const raw = input.trim();
  if (raw === "") return null;
  if (raw.includes("-")) return NaN;
  // Allow a leading currency symbol or code ("$49", "EUR 49") and thousands separators.
  const s = raw.replace(/[\s,]/g, "").replace(/^[^\d.]+/, "");
  const digits = currencyDigits(currency);
  const m = /^(\d{1,13})(?:\.(\d*))?$/.exec(s);
  if (!m) return NaN;
  const frac = m[2] ?? "";
  if (frac.length > digits) return NaN;
  const minor = Number(m[1]) * 10 ** digits + Number((frac + "0".repeat(digits)).slice(0, digits) || "0");
  return Number.isSafeInteger(minor) && minor < 1e13 ? minor : NaN;
}

/** Minor units → the plain decimal string an input field should show ("1299.50"). */
export function minorToInput(minor: number | null, currency: string): string {
  if (minor === null) return "";
  const digits = currencyDigits(currency);
  return digits === 0 ? String(Math.round(minor)) : (Math.round(minor) / 10 ** digits).toFixed(digits);
}

export function formatMoney(minor: number, currency: string, opts: { compact?: boolean; whole?: boolean } = {}): string {
  const digits = currencyDigits(currency);
  const value = minor / 10 ** digits;
  const whole = opts.whole || opts.compact;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: opts.compact && Math.abs(value) >= 10_000 ? "compact" : "standard",
    maximumFractionDigits: whole ? 0 : digits,
    minimumFractionDigits: whole ? 0 : digits,
  }).format(value);
}

export function addTo(totals: CurrencyTotals, currency: string, amount: number): void {
  totals[currency] = (totals[currency] ?? 0) + amount;
}

/** Currencies in a stable order: the preferred currency first, then by size. */
export function totalsList(totals: CurrencyTotals, preferred?: string): { currency: string; amount: number }[] {
  return Object.entries(totals)
    .map(([currency, amount]) => ({ currency, amount }))
    .sort((a, b) => (a.currency === preferred ? -1 : b.currency === preferred ? 1 : b.amount - a.amount || a.currency.localeCompare(b.currency)));
}

export function formatTotals(totals: CurrencyTotals, preferred?: string, opts?: { compact?: boolean; whole?: boolean }): string {
  const list = totalsList(totals, preferred);
  if (list.length === 0) return formatMoney(0, preferred ?? "USD", opts);
  return list.map((t) => formatMoney(t.amount, t.currency, opts)).join(" + ");
}

// ─── Billing periods ────────────────────────────────────────────────────────

export interface CostTerms {
  priceMinor: number | null;
  currency: string;
  billingInterval: BillingInterval;
  customIntervalCount: number | null;
  customIntervalUnit: IntervalUnit | null;
  pricingModel: PricingModel;
  purchasedSeats: number | null;
}

/** Months covered by one billing period. Null for a custom interval missing its count or unit. */
export function monthsPerPeriod(t: Pick<CostTerms, "billingInterval" | "customIntervalCount" | "customIntervalUnit">): number | null {
  switch (t.billingInterval) {
    case "monthly":
      return 1;
    case "quarterly":
      return 3;
    case "yearly":
      return 12;
    case "custom": {
      const n = t.customIntervalCount;
      if (!n || n <= 0 || !t.customIntervalUnit) return null;
      if (t.customIntervalUnit === "day") return (n * 12) / 365;
      if (t.customIntervalUnit === "week") return (n * 7 * 12) / 365;
      if (t.customIntervalUnit === "month") return n;
      return n * 12;
    }
  }
}

export function intervalLabel(t: Pick<CostTerms, "billingInterval" | "customIntervalCount" | "customIntervalUnit">): string {
  if (t.billingInterval !== "custom") return { monthly: "Monthly", quarterly: "Quarterly", yearly: "Yearly" }[t.billingInterval];
  const n = t.customIntervalCount ?? 0;
  return `Every ${n} ${t.customIntervalUnit}${n === 1 ? "" : "s"}`;
}

/** Short suffix for a price: "/mo", "/qtr", "/yr", "/6 months". */
export function periodSuffix(t: Pick<CostTerms, "billingInterval" | "customIntervalCount" | "customIntervalUnit">): string {
  if (t.billingInterval === "monthly") return "/mo";
  if (t.billingInterval === "quarterly") return "/qtr";
  if (t.billingInterval === "yearly") return "/yr";
  const n = t.customIntervalCount ?? 0;
  return `/${n} ${t.customIntervalUnit}${n === 1 ? "" : "s"}`;
}

/** Monthly equivalent in minor units (may be fractional; round only for display). Null when the price is unknown. */
export function monthlyEquivalent(t: CostTerms): number | null {
  if (t.priceMinor === null) return null;
  const months = monthsPerPeriod(t);
  if (!months) return null;
  return t.priceMinor / months;
}

/** Annualized recurring cost: monthly equivalent × 12 (a run-rate, not historical spend). */
export function annualized(t: CostTerms): number | null {
  const m = monthlyEquivalent(t);
  return m === null ? null : m * 12;
}

// ─── Subscriptions ──────────────────────────────────────────────────────────

export interface SubscriptionCalc extends CostTerms {
  id: string;
  status: SubscriptionStatus;
  archived: boolean;
  nextRenewalDate: string | null;
  cancellationDeadline?: string | null;
  autoRenew?: boolean;
  /** Active named seat assignments. */
  namedSeats: number;
  reportedAssignedSeats: number | null;
}

/** Counts towards current recurring cost: active and not archived. */
export function isRecurring(s: Pick<SubscriptionCalc, "status" | "archived">): boolean {
  return s.status === "active" && !s.archived;
}

/** Still something the team pays or may pay (shown in renewals): active or trial, not archived. */
export function isLive(s: Pick<SubscriptionCalc, "status" | "archived">): boolean {
  return (s.status === "active" || s.status === "trial") && !s.archived;
}

export interface SpendSummary {
  activeCount: number;
  trialCount: number;
  /** Monthly equivalent of active subscriptions with a known price, per currency. */
  monthly: CurrencyTotals;
  annualized: CurrencyTotals;
  /** Active subscriptions without a price (left out of the totals). */
  missingPrice: number;
  /** Live subscriptions without a next renewal date. */
  missingRenewalDate: number;
  /** Live subscriptions renewing within the window (today included). */
  upcomingRenewals: number;
}

export function summarizeSpend(subs: SubscriptionCalc[], today: string, renewalWindowDays = 30): SpendSummary {
  const out: SpendSummary = { activeCount: 0, trialCount: 0, monthly: {}, annualized: {}, missingPrice: 0, missingRenewalDate: 0, upcomingRenewals: 0 };
  for (const s of subs) {
    if (s.archived) continue;
    if (s.status === "trial") out.trialCount++;
    if (isLive(s)) {
      if (!s.nextRenewalDate) out.missingRenewalDate++;
      else {
        const d = daysBetween(today, s.nextRenewalDate);
        if (d >= 0 && d <= renewalWindowDays) out.upcomingRenewals++;
      }
    }
    if (!isRecurring(s)) continue;
    out.activeCount++;
    const m = monthlyEquivalent(s);
    if (m === null) {
      out.missingPrice++;
      continue;
    }
    addTo(out.monthly, s.currency, m);
    addTo(out.annualized, s.currency, m * 12);
  }
  return out;
}

/** Sums the monthly equivalent of recurring subscriptions into groups (vendor, category, department…). */
export function groupMonthly<T extends SubscriptionCalc, K extends string>(subs: T[], keyOf: (s: T) => K): Map<K, CurrencyTotals> {
  const groups = new Map<K, CurrencyTotals>();
  for (const s of subs) {
    if (!isRecurring(s)) continue;
    const m = monthlyEquivalent(s);
    if (m === null) continue;
    const k = keyOf(s);
    const t = groups.get(k) ?? {};
    addTo(t, s.currency, m);
    groups.set(k, t);
  }
  return groups;
}

// ─── Seats ──────────────────────────────────────────────────────────────────

export interface SeatSummary {
  purchased: number | null;
  named: number;
  reported: number | null;
  /** Seats in use: the larger of named assignments and the reported count. */
  assigned: number;
  assignedSource: "named" | "reported" | "none";
  available: number | null;
  /** Named assignments exceed purchased seats (e.g. seats were reduced). */
  overAssigned: boolean;
  /** assigned ÷ purchased × 100; null when no seats are purchased (no division by zero). */
  utilization: number | null;
  /** Monthly cost of one seat, only for per-seat pricing with a known price and seats. */
  costPerSeatMonthly: number | null;
  /** Monthly cost of unassigned seats, under the same conditions. */
  unusedMonthly: number | null;
}

export function seatSummary(s: SubscriptionCalc): SeatSummary {
  const purchased = s.purchasedSeats;
  const reported = s.reportedAssignedSeats;
  const assigned = Math.max(s.namedSeats, reported ?? 0);
  const assignedSource = assigned === 0 ? "none" : s.namedSeats >= (reported ?? 0) ? "named" : "reported";
  const available = purchased === null ? null : Math.max(0, purchased - assigned);
  const utilization = purchased && purchased > 0 ? Math.min(100, (assigned / purchased) * 100) : null;
  const monthly = monthlyEquivalent(s);
  const perSeat = s.pricingModel === "per_seat" && monthly !== null && purchased && purchased > 0 ? monthly / purchased : null;
  return {
    purchased,
    named: s.namedSeats,
    reported,
    assigned,
    assignedSource,
    available,
    overAssigned: purchased !== null && s.namedSeats > purchased,
    utilization,
    costPerSeatMonthly: perSeat,
    unusedMonthly: perSeat !== null && available !== null && isRecurring(s) ? perSeat * available : null,
  };
}

export interface LicenseTotals {
  purchased: number;
  assigned: number;
  available: number;
  /** Across subscriptions that track seats; null when none do. */
  utilization: number | null;
  /** Monthly cost of unused seats where it can be calculated, per currency. */
  unusedMonthly: CurrencyTotals;
  tracked: number;
}

export function licenseTotals(subs: SubscriptionCalc[]): LicenseTotals {
  const out: LicenseTotals = { purchased: 0, assigned: 0, available: 0, utilization: null, unusedMonthly: {}, tracked: 0 };
  for (const s of subs) {
    if (!isLive(s) || !s.purchasedSeats) continue;
    const seats = seatSummary(s);
    out.tracked++;
    out.purchased += s.purchasedSeats;
    out.assigned += Math.min(seats.assigned, s.purchasedSeats);
    out.available += seats.available ?? 0;
    if (seats.unusedMonthly !== null && seats.unusedMonthly > 0) addTo(out.unusedMonthly, s.currency, seats.unusedMonthly);
  }
  out.utilization = out.purchased > 0 ? (out.assigned / out.purchased) * 100 : null;
  return out;
}

// ─── Dates (calendar dates as YYYY-MM-DD, compared in UTC) ───────────────────

export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDate(s: string): boolean {
  if (!ISO_DATE.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

/** Today's date in a time zone (falls back to UTC for an unknown zone). */
export function todayIn(timeZone: string, now = new Date()): string {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  } catch {
    return now.toISOString().slice(0, 10);
  }
}

const ms = (iso: string) => Date.parse(`${iso}T00:00:00Z`);

/** Whole days from `from` to `to` (negative when `to` is earlier). */
export function daysBetween(from: string, to: string): number {
  return Math.round((ms(to) - ms(from)) / 86_400_000);
}

export function addDays(iso: string, days: number): string {
  return new Date(ms(iso) + days * 86_400_000).toISOString().slice(0, 10);
}

/** Adds calendar months, clamping to the month's last day (Jan 31 + 1 month = Feb 28/29). */
export function addMonths(iso: string, months: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const total = y * 12 + (m - 1) + months;
  const ny = Math.floor(total / 12);
  const nm = total - ny * 12;
  const last = new Date(Date.UTC(ny, nm + 1, 0)).getUTCDate();
  return new Date(Date.UTC(ny, nm, Math.min(d, last))).toISOString().slice(0, 10);
}

/** The renewal date one billing period after `iso`. */
export function nextPeriodDate(iso: string, t: Pick<CostTerms, "billingInterval" | "customIntervalCount" | "customIntervalUnit">): string {
  switch (t.billingInterval) {
    case "monthly":
      return addMonths(iso, 1);
    case "quarterly":
      return addMonths(iso, 3);
    case "yearly":
      return addMonths(iso, 12);
    case "custom": {
      const n = t.customIntervalCount ?? 1;
      if (t.customIntervalUnit === "day") return addDays(iso, n);
      if (t.customIntervalUnit === "week") return addDays(iso, n * 7);
      if (t.customIntervalUnit === "month") return addMonths(iso, n);
      return addMonths(iso, n * 12);
    }
  }
}

/** Last day of a YYYY-MM month. */
export function monthEnd(ym: string): string {
  return addDays(addMonths(`${ym}-01`, 1), -1);
}

/** The `count` months ending with the month of `today`, oldest first, as YYYY-MM. */
export function lastMonths(today: string, count: number): string[] {
  const out: string[] = [];
  for (let i = count - 1; i >= 0; i--) out.push(addMonths(`${today.slice(0, 7)}-01`, -i).slice(0, 7));
  return out;
}

export const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Formats a calendar date with one of the workspace date formats. */
export function formatIsoDate(iso: string | null | undefined, format = "MMM d, yyyy"): string {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return "—";
  const p = (n: number) => String(n).padStart(2, "0");
  switch (format) {
    case "d MMM yyyy":
      return `${d} ${MONTH_NAMES[m - 1]} ${y}`;
    case "yyyy-MM-dd":
      return `${y}-${p(m)}-${p(d)}`;
    case "MM/dd/yyyy":
      return `${p(m)}/${p(d)}/${y}`;
    case "dd/MM/yyyy":
      return `${p(d)}/${p(m)}/${y}`;
    default:
      return `${MONTH_NAMES[m - 1]} ${d}, ${y}`;
  }
}

export function formatMonth(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

/** First day of the fiscal year containing `today`, for a fiscal year starting in `startMonth` (1–12). */
export function fiscalYearStart(today: string, startMonth: number): string {
  const [y, m] = today.split("-").map(Number);
  const year = m >= startMonth ? y : y - 1;
  return `${year}-${String(startMonth).padStart(2, "0")}-01`;
}

// ─── Run-rate history ───────────────────────────────────────────────────────

export interface CostHistoryPoint extends CostTerms {
  effectiveFrom: string;
}

export interface RunRateInput {
  id: string;
  status: SubscriptionStatus;
  archived: boolean;
  /** Start date, or the date the record was created when no start date was entered. */
  startDate: string;
  endedOn: string | null;
  /** Price terms over time, oldest first. */
  history: CostHistoryPoint[];
}

/**
 * Monthly recurring run-rate at the end of each month, per currency, from start
 * dates, end dates and recorded price changes. Trials and paused subscriptions
 * are left out (their past status isn't recorded); cancelled and expired ones
 * count until their end date.
 */
export function runRateByMonth(subs: RunRateInput[], months: string[]): { month: string; totals: CurrencyTotals }[] {
  return months.map((month) => {
    const end = monthEnd(month);
    const totals: CurrencyTotals = {};
    for (const s of subs) {
      if (s.archived || s.status === "trial" || s.status === "paused") continue;
      if (s.startDate > end) continue;
      if (s.endedOn && s.endedOn <= end) continue;
      if ((s.status === "cancelled" || s.status === "expired") && !s.endedOn) continue;
      const terms = [...s.history].reverse().find((h) => h.effectiveFrom <= end) ?? s.history[0];
      if (!terms) continue;
      const m = monthlyEquivalent(terms);
      if (m !== null) addTo(totals, terms.currency, m);
    }
    return { month, totals };
  });
}

// ─── Savings totals ─────────────────────────────────────────────────────────

export interface OpportunityAmount {
  id: string;
  status: string;
  subscriptionId: string | null;
  estMonthlyMinor: number | null;
  currency: string | null;
}

/**
 * Potential savings of open (and reviewed) opportunities, per currency, without
 * double-counting: several findings about the same subscription (say, unused
 * seats and a possible overlap that would cancel it) can't both happen, so each
 * subscription contributes only its largest estimate.
 */
export function potentialSavings(opps: OpportunityAmount[]): { monthly: CurrencyTotals; annual: CurrencyTotals; counted: number; withoutEstimate: number } {
  const best = new Map<string, OpportunityAmount>();
  let withoutEstimate = 0;
  for (const o of opps) {
    if (o.status !== "open" && o.status !== "reviewed") continue;
    if (o.estMonthlyMinor === null || !o.currency) {
      withoutEstimate++;
      continue;
    }
    const key = o.subscriptionId ?? `opportunity:${o.id}`;
    const prev = best.get(key);
    if (!prev || (prev.estMonthlyMinor ?? 0) < o.estMonthlyMinor) best.set(key, o);
  }
  const monthly: CurrencyTotals = {};
  const annual: CurrencyTotals = {};
  for (const o of best.values()) {
    addTo(monthly, o.currency!, o.estMonthlyMinor!);
    addTo(annual, o.currency!, o.estMonthlyMinor! * 12);
  }
  return { monthly, annual, counted: best.size, withoutEstimate };
}

export interface RealizedSaving {
  amountMinor: number;
  currency: string;
  recurrence: "one_time" | "monthly" | "yearly";
}

/** First-year value of a confirmed saving: one-time as entered, monthly × 12, yearly as entered. */
export function firstYearValue(r: RealizedSaving): number {
  return r.recurrence === "monthly" ? r.amountMinor * 12 : r.amountMinor;
}

export function realizedTotals(rows: RealizedSaving[]): CurrencyTotals {
  const t: CurrencyTotals = {};
  for (const r of rows) addTo(t, r.currency, firstYearValue(r));
  return t;
}

// ─── Misc ───────────────────────────────────────────────────────────────────

export function percent(value: number | null, digits = 0): string {
  return value === null ? "—" : `${value.toFixed(digits)}%`;
}

/** Normalised name for matching software across inventory and the deals catalog. */
export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\b(inc|llc|ltd|gmbh|corp|corporation|co|software|app|labs?|technologies|hq)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
