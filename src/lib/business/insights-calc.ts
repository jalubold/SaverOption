/**
 * Spending insights: short, evidence-backed observations computed from a
 * workspace's own records. Deterministic (no AI model); every insight says
 * whether it rests on actual recorded payments, a normalized estimate (the
 * monthly run-rate from entered prices) or a projection (renewals at today's
 * prices). Changes over time are only reported when the records go back far
 * enough to compare. Currencies are never added together.
 *
 * Pure module, so Node tests run it directly.
 */
import { addMonths, addTo, daysBetween, formatIsoDate, formatMonth, formatMoney, isLive, isRecurring, monthEnd, monthlyEquivalent, seatSummary, type CurrencyTotals, type SubscriptionCalc } from "./calc.ts";
import { categoryLabels, OVERLAP_PRONE_CATEGORIES, type SoftwareCategory } from "./constants.ts";

export type InsightBasis = "actual" | "normalized_estimate" | "projection";

export interface Insight {
  id: string;
  title: string;
  detail: string;
  basis: InsightBasis;
  evidence: { label: string; value: string }[];
  href?: string;
  /** 1 = act on it soon, 2 = worth a look, 3 = for context. */
  priority: 1 | 2 | 3;
}

export interface InsightSubscription extends SubscriptionCalc {
  softwareName: string;
  category: SoftwareCategory;
  planName: string | null;
  startDate: string | null;
  createdOn: string;
  annualPriceOptionMinor: number | null;
}

export interface PeriodChange {
  id: "run_rate_month" | "run_rate_quarter" | "payments_month" | "payments_quarter";
  label: string;
  basis: InsightBasis;
  currency: string;
  previousLabel: string;
  currentLabel: string;
  previous: number;
  current: number;
  change: number;
  /** Null when the previous value is 0. */
  changePct: number | null;
}

export interface InsightsInput {
  today: string;
  dateFormat?: string;
  /** Non-archived subscriptions. */
  subs: InsightSubscription[];
  /** Run-rate at each month's end, oldest first, ending with the current month (at least 4 months for the quarter comparison). */
  runRate: { month: string; totals: CurrencyTotals }[];
  payments: { amountMinor: number; currency: string; paidOn: string; subscriptionId: string }[];
}

const money = (minor: number, currency: string) => formatMoney(Math.round(minor), currency, { whole: true });
const signed = (minor: number, currency: string) => `${minor > 0 ? "+" : minor < 0 ? "−" : ""}${money(Math.abs(minor), currency)}`;
const pct = (v: number | null) => (v === null ? "new" : `${v > 0 ? "+" : ""}${v.toFixed(0)}%`);

/** The earliest date any recorded subscription started (or was added). */
export function earliestStart(subs: Pick<InsightSubscription, "startDate" | "createdOn">[]): string | null {
  let min: string | null = null;
  for (const s of subs) {
    const d = s.startDate ?? s.createdOn;
    if (!min || d < min) min = d;
  }
  return min;
}

function quarterOf(ym: string): { key: string; start: string; end: string; label: string } {
  const [y, m] = ym.split("-").map(Number);
  const q = Math.floor((m - 1) / 3);
  const start = `${y}-${String(q * 3 + 1).padStart(2, "0")}`;
  const endMonth = `${y}-${String(q * 3 + 3).padStart(2, "0")}`;
  return { key: `${y}-Q${q + 1}`, start: `${start}-01`, end: monthEnd(endMonth), label: `Q${q + 1} ${y}` };
}

function change(previous: number, current: number) {
  return { change: current - previous, changePct: previous === 0 ? null : ((current - previous) / previous) * 100 };
}

/**
 * Period-over-period changes per currency:
 * - run-rate (normalized estimate) this month vs last month, and vs three months ago — only when
 *   the records reach back past the earlier month, so a newly entered workspace doesn't read as growth;
 * - recorded payments (actual) in the last complete month vs the month before, and the last complete
 *   calendar quarter vs the one before — only when there are payments in either period.
 */
export function periodChanges(input: InsightsInput): PeriodChange[] {
  const out: PeriodChange[] = [];
  const earliest = earliestStart(input.subs);
  const rr = input.runRate;
  const cur = rr.at(-1);
  const compareRunRate = (back: number, id: PeriodChange["id"], label: string) => {
    const prev = rr.at(-1 - back);
    if (!cur || !prev || !earliest || earliest > monthEnd(prev.month) || daysBetween(earliest, input.today) < 30 * (back + 1)) return;
    for (const currency of new Set([...Object.keys(prev.totals), ...Object.keys(cur.totals)])) {
      const p = prev.totals[currency] ?? 0;
      const c = cur.totals[currency] ?? 0;
      out.push({ id, label, basis: "normalized_estimate", currency, previousLabel: formatMonth(prev.month), currentLabel: formatMonth(cur.month), previous: p, current: c, ...change(p, c) });
    }
  };
  compareRunRate(1, "run_rate_month", "Monthly run-rate, this month vs last month");
  compareRunRate(3, "run_rate_quarter", "Monthly run-rate, now vs three months ago");

  const thisMonth = input.today.slice(0, 7);
  const lastMonth = addMonths(`${thisMonth}-01`, -1).slice(0, 7);
  const monthBefore = addMonths(`${thisMonth}-01`, -2).slice(0, 7);
  const sumIn = (from: string, to: string) => {
    const t: CurrencyTotals = {};
    for (const p of input.payments) if (p.paidOn >= from && p.paidOn <= to) addTo(t, p.currency, p.amountMinor);
    return t;
  };
  const comparePayments = (id: PeriodChange["id"], label: string, prevLabel: string, prevFrom: string, prevTo: string, curLabel: string, curFrom: string, curTo: string) => {
    const a = sumIn(prevFrom, prevTo);
    const b = sumIn(curFrom, curTo);
    for (const currency of new Set([...Object.keys(a), ...Object.keys(b)])) {
      const p = a[currency] ?? 0;
      const c = b[currency] ?? 0;
      out.push({ id, label, basis: "actual", currency, previousLabel: prevLabel, currentLabel: curLabel, previous: p, current: c, ...change(p, c) });
    }
  };
  comparePayments("payments_month", "Recorded payments, last complete month vs the month before", formatMonth(monthBefore), `${monthBefore}-01`, monthEnd(monthBefore), formatMonth(lastMonth), `${lastMonth}-01`, monthEnd(lastMonth));
  const thisQ = quarterOf(thisMonth);
  const lastQ = quarterOf(addMonths(thisQ.start, -3).slice(0, 7));
  const qBefore = quarterOf(addMonths(lastQ.start, -3).slice(0, 7));
  comparePayments("payments_quarter", "Recorded payments, last complete quarter vs the one before", qBefore.label, qBefore.start, qBefore.end, lastQ.label, lastQ.start, lastQ.end);
  return out;
}

/** Renewals of live, auto-renewing subscriptions between today and `days` from now, at current prices, per currency. */
export function renewalCommitment(subs: InsightSubscription[], today: string, days: number) {
  const totals: CurrencyTotals = {};
  const due: InsightSubscription[] = [];
  const manual: InsightSubscription[] = [];
  let unpriced = 0;
  for (const s of subs) {
    if (!isLive(s) || !s.nextRenewalDate) continue;
    const d = daysBetween(today, s.nextRenewalDate);
    if (d < 0 || d > days) continue;
    if (s.autoRenew === false) {
      manual.push(s);
      continue;
    }
    due.push(s);
    if (s.priceMinor === null) unpriced++;
    else addTo(totals, s.currency, s.priceMinor);
  }
  return { totals, due, manual, unpriced };
}

export function computeInsights(input: InsightsInput): Insight[] {
  const out: Insight[] = [];
  const fmt = input.dateFormat;
  const recurring = input.subs.filter(isRecurring);

  // Run-rate and payment changes.
  for (const c of periodChanges(input)) {
    if (c.change === 0) continue;
    const big = c.changePct === null || Math.abs(c.changePct) >= 10;
    const what = c.basis === "actual" ? "Recorded payments" : "Monthly run-rate";
    out.push({
      id: `${c.id}:${c.currency}`,
      title: `${what} ${c.change > 0 ? "rose" : "fell"} ${signed(c.change, c.currency)} (${pct(c.changePct)})`,
      detail:
        c.basis === "actual"
          ? `${money(c.current, c.currency)} recorded in ${c.currentLabel}, against ${money(c.previous, c.currency)} in ${c.previousLabel}. Only payments someone recorded are counted.`
          : `${money(c.current, c.currency)}/mo in ${c.currentLabel}, against ${money(c.previous, c.currency)}/mo in ${c.previousLabel} — from start and end dates and recorded price changes.`,
      basis: c.basis,
      evidence: [
        { label: c.previousLabel, value: money(c.previous, c.currency) },
        { label: c.currentLabel, value: money(c.current, c.currency) },
        { label: "Change", value: `${signed(c.change, c.currency)} (${pct(c.changePct)})` },
      ],
      href: "/business/analytics",
      priority: big && c.change > 0 ? 1 : big ? 2 : 3,
    });
  }

  // Concentration: the largest subscriptions' share of each currency's run-rate.
  const byCurrency = new Map<string, InsightSubscription[]>();
  for (const s of recurring) if (monthlyEquivalent(s) !== null) byCurrency.set(s.currency, [...(byCurrency.get(s.currency) ?? []), s]);
  for (const [currency, list] of byCurrency) {
    if (list.length < 4) continue;
    const sorted = [...list].sort((a, b) => monthlyEquivalent(b)! - monthlyEquivalent(a)!);
    const total = sorted.reduce((t, s) => t + monthlyEquivalent(s)!, 0);
    const top = sorted.slice(0, 3);
    const topTotal = top.reduce((t, s) => t + monthlyEquivalent(s)!, 0);
    const share = total > 0 ? (topTotal / total) * 100 : 0;
    out.push({
      id: `concentration:${currency}`,
      title: `Three subscriptions make up ${share.toFixed(0)}% of ${currency} spend`,
      detail: `${top.map((s) => s.softwareName).join(", ")} — ${money(topTotal, currency)} of ${money(total, currency)} a month. Reviewing these first has the most effect.`,
      basis: "normalized_estimate",
      evidence: top.map((s) => ({ label: s.softwareName, value: `${money(monthlyEquivalent(s)!, currency)}/mo (${((monthlyEquivalent(s)! / total) * 100).toFixed(0)}%)` })),
      href: "/business/subscriptions?sort=cost",
      priority: share >= 60 ? 2 : 3,
    });
  }

  // Upcoming commitments.
  for (const days of [30, 90]) {
    const r = renewalCommitment(input.subs, input.today, days);
    if (r.due.length === 0 && r.manual.length === 0) continue;
    if (days === 90) {
      const r30 = renewalCommitment(input.subs, input.today, 30);
      if (r30.due.length === r.due.length && r30.manual.length === r.manual.length) continue;
    }
    const totals = Object.entries(r.totals).map(([c, v]) => money(v, c));
    out.push({
      id: `renewals:${days}`,
      title: `${r.due.length} renewal${r.due.length === 1 ? "" : "s"} in the next ${days} days${totals.length ? ` — ${totals.join(" + ")}` : ""}`,
      detail: `At current prices, if nothing changes.${r.unpriced ? ` ${r.unpriced} without a price aren't included.` : ""}${r.manual.length ? ` ${r.manual.length} more renew only if someone renews them manually.` : ""} Decide on each before its date.`,
      basis: "projection",
      evidence: [...r.due]
        .sort((a, b) => a.nextRenewalDate!.localeCompare(b.nextRenewalDate!))
        .slice(0, 5)
        .map((s) => ({ label: `${s.softwareName} · ${formatIsoDate(s.nextRenewalDate, fmt)}`, value: s.priceMinor === null ? "No price" : formatMoney(s.priceMinor, s.currency) })),
      href: "/business/renewals",
      priority: days === 30 ? 1 : 2,
    });
  }

  // Unused per-seat licenses.
  const unused: CurrencyTotals = {};
  const unusedRows: { s: InsightSubscription; seats: number; monthly: number }[] = [];
  for (const s of input.subs) {
    if (!isRecurring(s)) continue;
    const seats = seatSummary(s);
    if (seats.unusedMonthly && seats.available) {
      addTo(unused, s.currency, seats.unusedMonthly);
      unusedRows.push({ s, seats: seats.available, monthly: seats.unusedMonthly });
    }
  }
  if (unusedRows.length) {
    const seatsTotal = unusedRows.reduce((t, r) => t + r.seats, 0);
    out.push({
      id: "unused_seats",
      title: `${seatsTotal} unassigned paid seat${seatsTotal === 1 ? "" : "s"} — ${Object.entries(unused).map(([c, v]) => `${money(v, c)}/mo`).join(" + ")}`,
      detail: "Per-seat plans with more seats purchased than assigned or reported in use. Usage isn't measured — confirm before reducing seats.",
      basis: "normalized_estimate",
      evidence: unusedRows
        .sort((a, b) => b.monthly - a.monthly)
        .slice(0, 5)
        .map((r) => ({ label: r.s.softwareName, value: `${r.seats} seat${r.seats === 1 ? "" : "s"} · ${money(r.monthly, r.s.currency)}/mo` })),
      href: "/business/licenses",
      priority: 2,
    });
  }

  // Several active tools in a category where one usually does the job.
  const byCategory = new Map<SoftwareCategory, string[]>();
  for (const s of recurring) {
    if (!OVERLAP_PRONE_CATEGORIES.has(s.category)) continue;
    const names = byCategory.get(s.category) ?? [];
    if (!names.includes(s.softwareName)) names.push(s.softwareName);
    byCategory.set(s.category, names);
  }
  for (const [category, names] of byCategory) {
    if (names.length < 2) continue;
    out.push({
      id: `overlap:${category}`,
      title: `${names.length} active tools for ${categoryLabels[category].toLowerCase()}`,
      detail: `${names.join(", ")}. Teams often need only one — check whether they serve different purposes before consolidating. Not a confirmed duplicate.`,
      basis: "actual",
      evidence: names.map((n) => ({ label: categoryLabels[category], value: n })),
      href: "/business/savings",
      priority: 2,
    });
  }

  // Monthly plans with a recorded annual price that costs less.
  for (const s of recurring) {
    if (s.billingInterval !== "monthly" || s.priceMinor === null || s.annualPriceOptionMinor === null) continue;
    const diff = s.priceMinor * 12 - s.annualPriceOptionMinor;
    if (diff <= 0) continue;
    out.push({
      id: `annual:${s.id}`,
      title: `${s.softwareName}: annual billing would cost ${money(diff, s.currency)} less a year`,
      detail: `12 × ${formatMoney(s.priceMinor, s.currency)} monthly against the annual price of ${formatMoney(s.annualPriceOptionMinor, s.currency)} you recorded. Annual plans usually commit you for the year.`,
      basis: "normalized_estimate",
      evidence: [
        { label: "Monthly × 12", value: formatMoney(s.priceMinor * 12, s.currency) },
        { label: "Annual price recorded", value: formatMoney(s.annualPriceOptionMinor, s.currency) },
      ],
      href: `/business/subscriptions/${s.id}`,
      priority: 2,
    });
  }

  // Data gaps that keep totals incomplete.
  const unpriced = recurring.filter((s) => s.priceMinor === null);
  if (unpriced.length) {
    out.push({
      id: "missing_prices",
      title: `${unpriced.length} active subscription${unpriced.length === 1 ? " has" : "s have"} no price`,
      detail: "They're left out of every total until a price is added, so spend is understated.",
      basis: "actual",
      evidence: unpriced.slice(0, 5).map((s) => ({ label: s.softwareName, value: s.planName ?? "No plan name" })),
      href: "/business/subscriptions?status=active",
      priority: 3,
    });
  }

  return out.sort((a, b) => a.priority - b.priority);
}
