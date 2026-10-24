// Unit tests for spending insights and period changes. Run: npm test
import assert from "node:assert/strict";
import test from "node:test";
import { computeInsights, periodChanges, renewalCommitment, type InsightSubscription, type InsightsInput } from "./insights-calc.ts";

const sub = (over: Partial<InsightSubscription> & { id: string }): InsightSubscription => ({
  softwareName: over.id,
  category: "other",
  planName: null,
  startDate: "2026-01-01",
  createdOn: "2026-01-01",
  annualPriceOptionMinor: null,
  priceMinor: 10_000,
  currency: "USD",
  billingInterval: "monthly",
  customIntervalCount: null,
  customIntervalUnit: null,
  pricingModel: "flat",
  purchasedSeats: null,
  status: "active",
  archived: false,
  nextRenewalDate: null,
  cancellationDeadline: null,
  autoRenew: true,
  namedSeats: 0,
  reportedAssignedSeats: null,
  ...over,
});

const base = (over: Partial<InsightsInput> = {}): InsightsInput => ({
  today: "2026-10-24",
  subs: [],
  runRate: [],
  payments: [],
  ...over,
});

const rr = (values: [string, number][], currency = "USD") => values.map(([month, v]) => ({ month, totals: v ? { [currency]: v } : {} }));

test("run-rate change is reported only when history reaches back past the earlier month", () => {
  const runRate = rr([["2026-07", 10_000], ["2026-08", 10_000], ["2026-09", 20_000], ["2026-10", 30_000]]);
  const old = periodChanges(base({ subs: [sub({ id: "a", startDate: "2026-01-01" })], runRate }));
  const month = old.find((c) => c.id === "run_rate_month")!;
  assert.equal(month.previous, 20_000);
  assert.equal(month.current, 30_000);
  assert.equal(month.change, 10_000);
  assert.equal(Math.round(month.changePct!), 50);
  const quarter = old.find((c) => c.id === "run_rate_quarter")!;
  assert.equal(quarter.previous, 10_000);
  assert.equal(quarter.previousLabel, "Jul 2026");

  // A workspace whose first subscription started this month has nothing to compare against.
  const fresh = periodChanges(base({ subs: [sub({ id: "a", startDate: "2026-10-02", createdOn: "2026-10-02" })], runRate }));
  assert.equal(fresh.filter((c) => c.basis === "normalized_estimate").length, 0);
});

test("payment changes compare complete periods and keep currencies apart", () => {
  const payments = [
    { amountMinor: 5_000, currency: "USD", paidOn: "2026-08-15", subscriptionId: "a" },
    { amountMinor: 7_000, currency: "USD", paidOn: "2026-09-15", subscriptionId: "a" },
    { amountMinor: 2_000, currency: "EUR", paidOn: "2026-09-20", subscriptionId: "b" },
    // The current, incomplete month isn't compared.
    { amountMinor: 99_000, currency: "USD", paidOn: "2026-10-03", subscriptionId: "a" },
    { amountMinor: 1_000, currency: "USD", paidOn: "2026-05-10", subscriptionId: "a" },
  ];
  const changes = periodChanges(base({ payments }));
  const usdMonth = changes.find((c) => c.id === "payments_month" && c.currency === "USD")!;
  assert.deepEqual([usdMonth.previousLabel, usdMonth.previous, usdMonth.currentLabel, usdMonth.current], ["Aug 2026", 5_000, "Sep 2026", 7_000]);
  const eurMonth = changes.find((c) => c.id === "payments_month" && c.currency === "EUR")!;
  assert.equal(eurMonth.previous, 0);
  assert.equal(eurMonth.changePct, null);
  const usdQuarter = changes.find((c) => c.id === "payments_quarter" && c.currency === "USD")!;
  assert.deepEqual([usdQuarter.previousLabel, usdQuarter.previous, usdQuarter.currentLabel, usdQuarter.current], ["Q2 2026", 1_000, "Q3 2026", 12_000]);
});

test("renewal commitment counts auto-renewing plans at current prices and lists manual ones separately", () => {
  const subs = [
    sub({ id: "a", nextRenewalDate: "2026-11-01", priceMinor: 12_000 }),
    sub({ id: "b", nextRenewalDate: "2026-11-10", priceMinor: null }),
    sub({ id: "c", nextRenewalDate: "2026-11-05", autoRenew: false }),
    sub({ id: "d", nextRenewalDate: "2027-03-01" }),
    sub({ id: "e", nextRenewalDate: "2026-11-02", status: "cancelled" }),
    sub({ id: "f", nextRenewalDate: "2026-11-03", currency: "EUR", priceMinor: 4_000 }),
  ];
  const r = renewalCommitment(subs, "2026-10-24", 30);
  assert.deepEqual(r.totals, { USD: 12_000, EUR: 4_000 });
  assert.equal(r.unpriced, 1);
  assert.deepEqual(r.manual.map((s) => s.id), ["c"]);
  assert.deepEqual(r.due.map((s) => s.id).sort(), ["a", "b", "f"]);
});

test("insights: overlap is for review, unused seats need per-seat prices, annual savings need a recorded annual price", () => {
  const subs = [
    sub({ id: "slack", softwareName: "Slack", category: "communication" }),
    sub({ id: "teams", softwareName: "Teams", category: "communication" }),
    sub({ id: "notion", softwareName: "Notion", pricingModel: "per_seat", purchasedSeats: 10, namedSeats: 6, priceMinor: 10_000 }),
    sub({ id: "flat", softwareName: "Flat", purchasedSeats: 10, namedSeats: 2 }),
    sub({ id: "zoom", softwareName: "Zoom", priceMinor: 2_000, annualPriceOptionMinor: 20_000 }),
    sub({ id: "trial", softwareName: "Trial", status: "trial", category: "communication" }),
  ];
  const list = computeInsights(base({ subs }));
  const overlap = list.find((i) => i.id === "overlap:communication")!;
  assert.match(overlap.detail, /Not a confirmed duplicate/);
  assert.equal(overlap.evidence.length, 2);
  const seats = list.find((i) => i.id === "unused_seats")!;
  assert.match(seats.title, /^4 unassigned paid seats/);
  assert.equal(seats.evidence.length, 1);
  const annual = list.find((i) => i.id === "annual:zoom")!;
  assert.match(annual.title, /\$40 less a year/);
  assert.equal(list.some((i) => i.id.startsWith("run_rate")), false);
});

test("insights: concentration needs at least four priced subscriptions in the currency", () => {
  const three = [1, 2, 3].map((n) => sub({ id: `s${n}`, priceMinor: n * 10_000 }));
  assert.equal(computeInsights(base({ subs: three })).some((i) => i.id.startsWith("concentration")), false);
  const five = [1, 2, 3, 4, 5].map((n) => sub({ id: `s${n}`, priceMinor: n * 10_000 }));
  const c = computeInsights(base({ subs: five })).find((i) => i.id === "concentration:USD")!;
  assert.match(c.title, /80%/);
  assert.equal(c.basis, "normalized_estimate");
});

test("insights: missing prices are reported, never counted as zero", () => {
  const list = computeInsights(base({ subs: [sub({ id: "a", priceMinor: null }), sub({ id: "b" })] }));
  const missing = list.find((i) => i.id === "missing_prices")!;
  assert.match(missing.title, /^1 active subscription has no price/);
});
