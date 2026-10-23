// Unit tests for the shared business calculations. Run: npm test
import assert from "node:assert/strict";
import test from "node:test";
import {
  addMonths,
  annualized,
  daysBetween,
  firstYearValue,
  fiscalYearStart,
  formatMoney,
  formatTotals,
  isIsoDate,
  licenseTotals,
  monthlyEquivalent,
  monthsPerPeriod,
  nextPeriodDate,
  parseMoney,
  potentialSavings,
  realizedTotals,
  runRateByMonth,
  seatSummary,
  summarizeSpend,
  todayIn,
  type SubscriptionCalc,
} from "./calc.ts";

const sub = (over: Partial<SubscriptionCalc> = {}): SubscriptionCalc => ({
  id: over.id ?? "s1",
  priceMinor: 12_000,
  currency: "USD",
  billingInterval: "monthly",
  customIntervalCount: null,
  customIntervalUnit: null,
  pricingModel: "flat",
  purchasedSeats: null,
  status: "active",
  archived: false,
  nextRenewalDate: null,
  namedSeats: 0,
  reportedAssignedSeats: null,
  ...over,
});

test("monthly equivalent for each billing interval", () => {
  assert.equal(monthlyEquivalent(sub({ priceMinor: 9_900 })), 9_900);
  assert.equal(monthlyEquivalent(sub({ priceMinor: 30_000, billingInterval: "quarterly" })), 10_000);
  assert.equal(monthlyEquivalent(sub({ priceMinor: 120_000, billingInterval: "yearly" })), 10_000);
  assert.equal(monthlyEquivalent(sub({ priceMinor: 60_000, billingInterval: "custom", customIntervalCount: 6, customIntervalUnit: "month" })), 10_000);
  assert.equal(monthlyEquivalent(sub({ priceMinor: 240_000, billingInterval: "custom", customIntervalCount: 2, customIntervalUnit: "year" })), 10_000);
  // 365 days ≈ 12 months
  assert.ok(Math.abs(monthlyEquivalent(sub({ priceMinor: 120_000, billingInterval: "custom", customIntervalCount: 365, customIntervalUnit: "day" }))! - 10_000) < 1e-9);
  assert.equal(monthsPerPeriod({ billingInterval: "custom", customIntervalCount: null, customIntervalUnit: "month" }), null);
});

test("annualized is monthly equivalent × 12; unknown price stays unknown", () => {
  assert.equal(annualized(sub({ priceMinor: 30_000, billingInterval: "quarterly" })), 120_000);
  assert.equal(monthlyEquivalent(sub({ priceMinor: null })), null);
  assert.equal(annualized(sub({ priceMinor: null })), null);
});

test("spend summary keeps currencies apart and skips non-recurring records", () => {
  const today = "2026-10-23";
  const s = summarizeSpend(
    [
      sub({ id: "a", priceMinor: 10_000, nextRenewalDate: "2026-11-01" }),
      sub({ id: "b", priceMinor: 120_000, billingInterval: "yearly", currency: "EUR", nextRenewalDate: "2027-03-01" }),
      sub({ id: "c", priceMinor: null }),
      sub({ id: "d", status: "trial", priceMinor: 5_000, nextRenewalDate: "2026-10-30" }),
      sub({ id: "e", status: "cancelled", priceMinor: 99_999 }),
      sub({ id: "f", archived: true, priceMinor: 99_999 }),
    ],
    today,
  );
  assert.equal(s.activeCount, 3);
  assert.equal(s.trialCount, 1);
  assert.deepEqual(s.monthly, { USD: 10_000, EUR: 10_000 });
  assert.deepEqual(s.annualized, { USD: 120_000, EUR: 120_000 });
  assert.equal(s.missingPrice, 1);
  assert.equal(s.upcomingRenewals, 2); // a (9 days) and the trial ending in 7 days
  assert.equal(s.missingRenewalDate, 1); // c (the trial has a date; e and f aren't live)
  assert.equal(formatTotals(s.monthly, "USD"), "$100.00 + €100.00");
});

test("seat utilization, zero seats and unused seat cost", () => {
  const perSeat = sub({ priceMinor: 10_000, pricingModel: "per_seat", purchasedSeats: 10, namedSeats: 6 });
  const s = seatSummary(perSeat);
  assert.equal(s.assigned, 6);
  assert.equal(s.available, 4);
  assert.equal(s.utilization, 60);
  assert.equal(s.costPerSeatMonthly, 1_000);
  assert.equal(s.unusedMonthly, 4_000);

  const zero = seatSummary(sub({ purchasedSeats: 0 }));
  assert.equal(zero.utilization, null);
  assert.equal(zero.available, 0);

  const flat = seatSummary(sub({ pricingModel: "flat", purchasedSeats: 10, namedSeats: 2 }));
  assert.equal(flat.unusedMonthly, null, "flat pricing has no per-seat cost to estimate");

  const reported = seatSummary(sub({ pricingModel: "per_seat", purchasedSeats: 20, namedSeats: 3, reportedAssignedSeats: 15 }));
  assert.equal(reported.assigned, 15);
  assert.equal(reported.assignedSource, "reported");

  const over = seatSummary(sub({ purchasedSeats: 2, namedSeats: 3 }));
  assert.equal(over.overAssigned, true);
  assert.equal(over.available, 0);
  assert.equal(over.utilization, 100);
});

test("license totals across subscriptions", () => {
  const t = licenseTotals([
    sub({ id: "a", pricingModel: "per_seat", priceMinor: 10_000, purchasedSeats: 10, namedSeats: 5 }),
    sub({ id: "b", purchasedSeats: 5, namedSeats: 5 }),
    sub({ id: "c", purchasedSeats: 0 }),
    sub({ id: "d", purchasedSeats: 8, status: "cancelled" }),
  ]);
  assert.equal(t.purchased, 15);
  assert.equal(t.assigned, 10);
  assert.equal(t.available, 5);
  assert.ok(Math.abs(t.utilization! - 66.6667) < 0.01);
  assert.deepEqual(t.unusedMonthly, { USD: 5_000 });
});

test("money parsing respects currency decimals", () => {
  assert.equal(parseMoney("1,299.50", "USD"), 129_950);
  assert.equal(parseMoney("$49", "USD"), 4_900);
  assert.equal(parseMoney("", "USD"), null);
  assert.ok(Number.isNaN(parseMoney("12.345", "USD")));
  assert.ok(Number.isNaN(parseMoney("-5", "USD")));
  assert.equal(parseMoney("1500", "JPY"), 1_500);
  assert.ok(Number.isNaN(parseMoney("1500.5", "JPY")));
  assert.equal(formatMoney(129_950, "USD"), "$1,299.50");
  assert.equal(formatMoney(1_500, "JPY"), "¥1,500");
});

test("dates: month arithmetic, renewal periods, fiscal year", () => {
  assert.equal(addMonths("2026-01-31", 1), "2026-02-28");
  assert.equal(addMonths("2026-11-15", 3), "2027-02-15");
  assert.equal(nextPeriodDate("2026-10-23", { billingInterval: "yearly", customIntervalCount: null, customIntervalUnit: null }), "2027-10-23");
  assert.equal(nextPeriodDate("2026-10-23", { billingInterval: "custom", customIntervalCount: 2, customIntervalUnit: "week" }), "2026-11-06");
  assert.equal(daysBetween("2026-10-23", "2026-11-22"), 30);
  assert.equal(fiscalYearStart("2026-10-23", 4), "2026-04-01");
  assert.equal(fiscalYearStart("2026-02-01", 4), "2025-04-01");
  assert.equal(isIsoDate("2026-02-30"), false);
  assert.equal(isIsoDate("2026-02-28"), true);
  assert.equal(todayIn("Not/AZone", new Date("2026-10-23T12:00:00Z")), "2026-10-23");
  assert.equal(todayIn("Pacific/Auckland", new Date("2026-10-23T12:00:00Z")), "2026-10-24");
});

test("run-rate history follows start dates, end dates and price changes", () => {
  const terms = (priceMinor: number, effectiveFrom: string) => ({ ...sub({ priceMinor }), effectiveFrom });
  const series = runRateByMonth(
    [
      { id: "a", status: "active", archived: false, startDate: "2026-08-10", endedOn: null, history: [terms(10_000, "2026-08-10"), terms(15_000, "2026-10-01")] },
      { id: "b", status: "cancelled", archived: false, startDate: "2026-07-01", endedOn: "2026-09-15", history: [terms(5_000, "2026-07-01")] },
      { id: "c", status: "trial", archived: false, startDate: "2026-07-01", endedOn: null, history: [terms(9_000, "2026-07-01")] },
    ],
    ["2026-07", "2026-08", "2026-09", "2026-10"],
  );
  assert.deepEqual(
    series.map((p) => p.totals.USD ?? 0),
    [5_000, 15_000, 10_000, 15_000],
  );
});

test("potential savings take one estimate per subscription", () => {
  const t = potentialSavings([
    { id: "1", status: "open", subscriptionId: "s1", estMonthlyMinor: 4_000, currency: "USD" },
    { id: "2", status: "open", subscriptionId: "s1", estMonthlyMinor: 10_000, currency: "USD" },
    { id: "3", status: "reviewed", subscriptionId: "s2", estMonthlyMinor: 1_000, currency: "EUR" },
    { id: "4", status: "dismissed", subscriptionId: "s3", estMonthlyMinor: 50_000, currency: "USD" },
    { id: "5", status: "open", subscriptionId: "s4", estMonthlyMinor: null, currency: null },
  ]);
  assert.deepEqual(t.monthly, { USD: 10_000, EUR: 1_000 });
  assert.deepEqual(t.annual, { USD: 120_000, EUR: 12_000 });
  assert.equal(t.counted, 2);
  assert.equal(t.withoutEstimate, 1);
});

test("realized savings use the confirmed amount's first-year value", () => {
  assert.equal(firstYearValue({ amountMinor: 1_000, currency: "USD", recurrence: "monthly" }), 12_000);
  assert.deepEqual(
    realizedTotals([
      { amountMinor: 1_000, currency: "USD", recurrence: "monthly" },
      { amountMinor: 50_000, currency: "USD", recurrence: "one_time" },
      { amountMinor: 20_000, currency: "EUR", recurrence: "yearly" },
    ]),
    { USD: 62_000, EUR: 20_000 },
  );
});
