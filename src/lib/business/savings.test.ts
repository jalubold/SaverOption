// Unit tests for the savings rules and role permissions. Run: npm test
import assert from "node:assert/strict";
import test from "node:test";
import { potentialSavings } from "./calc.ts";
import { assignableRoles, can, canEditRecord, canManageMember } from "./permissions.ts";
import { findSavings, type SavingsInput, type SavingsSubscription } from "./savings.ts";

const sub = (over: Partial<SavingsSubscription> & { id: string; softwareId: string }): SavingsSubscription => ({
  softwareName: over.softwareId,
  category: "other",
  planName: null,
  startDate: "2026-01-01",
  createdOn: "2026-01-01",
  renewalDecision: "undecided",
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

const input = (subscriptions: SavingsSubscription[], extra: Partial<SavingsInput> = {}): SavingsInput => ({
  today: "2026-10-23",
  subscriptions,
  software: [...new Set(subscriptions.map((s) => s.softwareId))].map((id) => ({ id, name: id, category: subscriptions.find((s) => s.softwareId === id)!.category, status: "active" as const })),
  deals: [],
  alternatives: [],
  ...extra,
});

test("unused per-seat licenses are estimated from the real per-seat cost", () => {
  const f = findSavings(input([sub({ id: "s1", softwareId: "figma", pricingModel: "per_seat", priceMinor: 15_000, purchasedSeats: 10, namedSeats: 7 })]));
  const unused = f.find((x) => x.type === "unused_licenses")!;
  assert.equal(unused.estMonthlyMinor, 4_500); // 3 seats × $15
  assert.equal(unused.confidence, "high");
  assert.equal(f.some((x) => x.type === "underutilized_licenses"), false, "not also counted as underutilized");
});

test("flat-priced underutilization has no invented amount", () => {
  const f = findSavings(input([sub({ id: "s1", softwareId: "notion", purchasedSeats: 20, reportedAssignedSeats: 5 })]));
  const u = f.find((x) => x.type === "underutilized_licenses")!;
  assert.equal(u.estMonthlyMinor, null);
});

test("potential overlap is flagged for review, with the cheaper tool as the target", () => {
  const f = findSavings(
    input([
      sub({ id: "s1", softwareId: "slack", softwareName: "Slack", category: "communication", priceMinor: 30_000 }),
      sub({ id: "s2", softwareId: "teams", softwareName: "Teams", category: "communication", priceMinor: 12_000 }),
      sub({ id: "s3", softwareId: "aws", category: "cloud_hosting" }),
      sub({ id: "s4", softwareId: "gcp", category: "cloud_hosting" }),
    ]),
  );
  const overlaps = f.filter((x) => x.type === "overlapping_software");
  assert.equal(overlaps.length, 1, "cloud providers aren't flagged");
  assert.equal(overlaps[0].subscriptionId, "s2");
  assert.equal(overlaps[0].estMonthlyMinor, 12_000);
  assert.equal(overlaps[0].confidence, "low");
  assert.match(overlaps[0].explanation, /not a confirmed duplicate/);
});

test("overlap across currencies has no estimate", () => {
  const f = findSavings(
    input([
      sub({ id: "s1", softwareId: "a", category: "design", priceMinor: 30_000 }),
      sub({ id: "s2", softwareId: "b", category: "design", priceMinor: 12_000, currency: "EUR" }),
    ]),
  );
  assert.equal(f.find((x) => x.type === "overlapping_software")!.estMonthlyMinor, null);
});

test("annual billing: estimate only from a recorded annual price", () => {
  const withQuote = findSavings(input([sub({ id: "s1", softwareId: "x", priceMinor: 10_000, annualPriceOptionMinor: 96_000 })]));
  assert.equal(withQuote.find((x) => x.type === "annual_billing")!.estMonthlyMinor, 2_000);
  const noQuote = findSavings(input([sub({ id: "s1", softwareId: "x", priceMinor: 10_000 })]));
  assert.equal(noQuote.find((x) => x.type === "annual_billing")!.estMonthlyMinor, null);
  const recent = findSavings(input([sub({ id: "s1", softwareId: "x", startDate: "2026-10-01" })]));
  assert.equal(recent.some((x) => x.type === "annual_billing"), false);
});

test("renewal review for undecided long commitments only", () => {
  const f = findSavings(
    input([
      sub({ id: "y", softwareId: "y", billingInterval: "yearly", priceMinor: 120_000, nextRenewalDate: "2026-11-20" }),
      sub({ id: "m", softwareId: "m", nextRenewalDate: "2026-11-01" }),
      sub({ id: "d", softwareId: "d", billingInterval: "yearly", nextRenewalDate: "2026-11-10", renewalDecision: "renew" }),
    ]),
  );
  const reviews = f.filter((x) => x.type === "renewal_review");
  assert.deepEqual(reviews.map((r) => r.subscriptionId), ["y"]);
  assert.equal(reviews[0].ruleKey, "renewal_review:y:2026-11-20");
});

test("high-cost subscriptions need three priced subscriptions in the currency", () => {
  const f = findSavings(
    input([
      sub({ id: "big", softwareId: "big", priceMinor: 100_000 }),
      sub({ id: "s2", softwareId: "s2", priceMinor: 10_000 }),
      sub({ id: "s3", softwareId: "s3", priceMinor: 10_000 }),
    ]),
  );
  const exp = f.filter((x) => x.type === "expensive_subscription");
  assert.deepEqual(exp.map((e) => e.subscriptionId), ["big"]);
  assert.equal(exp[0].estMonthlyMinor, null);
});

test("deals and alternatives come from the catalog, without amounts", () => {
  const f = findSavings(
    input([sub({ id: "s1", softwareId: "slack", softwareName: "Slack", category: "communication" })], {
      deals: [{ softwareId: "slack", slug: "slack-pro-discount", title: "50% off", summary: "Half price.", typeLabel: "Discount", verification: "Verified", eligibility: null }],
      alternatives: [{ softwareId: "slack", productName: "Mattermost", productSlug: "mattermost", tagline: "Self-hosted chat.", license: "MIT", sharedTag: "Team chat" }],
    }),
  );
  const deal = f.find((x) => x.type === "marketplace_deal")!;
  assert.equal(deal.dealSlug, "slack-pro-discount");
  assert.equal(deal.estMonthlyMinor, null);
  assert.equal(f.find((x) => x.type === "software_alternative")!.estMonthlyMinor, null);
});

test("findings about one subscription aren't double-counted", () => {
  const f = findSavings(
    input([
      sub({ id: "s1", softwareId: "a", category: "design", pricingModel: "per_seat", priceMinor: 10_000, purchasedSeats: 10, namedSeats: 5 }),
      sub({ id: "s2", softwareId: "b", category: "design", priceMinor: 50_000 }),
    ]),
  );
  // s1: unused seats ($50) and overlap target ($100) → only $100 counts.
  const totals = potentialSavings(f.map((x, i) => ({ id: String(i), status: "open", subscriptionId: x.subscriptionId, estMonthlyMinor: x.estMonthlyMinor, currency: x.currency })));
  assert.deepEqual(totals.monthly, { USD: 10_000 });
});

test("role permissions", () => {
  assert.equal(can("owner", "workspace.own"), true);
  assert.equal(can("admin", "workspace.own"), false);
  assert.equal(can("finance", "spend.manage"), true);
  assert.equal(can("finance", "members.manage"), false);
  assert.equal(can("member", "records.manage"), false);
  assert.equal(can("viewer", "data.export"), false);
  assert.equal(canEditRecord("member", { ownerPersonId: "p1" }, "p1"), true);
  assert.equal(canEditRecord("member", { ownerPersonId: "p2" }, "p1"), false);
  assert.equal(canEditRecord("member", { ownerPersonId: null }, null), false);
  assert.equal(canEditRecord("viewer", { ownerPersonId: "p1" }, "p1"), false);
  assert.deepEqual(assignableRoles("admin"), ["finance", "member", "viewer"]);
  assert.equal(canManageMember("admin", "admin"), false);
  assert.equal(canManageMember("owner", "admin"), true);
  assert.equal(canManageMember("owner", "owner"), false);
});

test("annual-pricing prompts only for the largest monthly plans", () => {
  const subs = [1, 2, 3, 4, 5, 6].map((n) => sub({ id: `s${n}`, softwareId: `t${n}`, priceMinor: n * 1_000 }));
  const prompts = findSavings(input(subs)).filter((x) => x.type === "annual_billing");
  assert.equal(prompts.length, 5);
  assert.equal(prompts.some((p) => p.subscriptionId === "s1"), false, "the smallest plan is left out");
});

test("one Saver Option deal per tool", () => {
  const deal = (slug: string) => ({ softwareId: "slack", slug, title: slug, summary: "x.", typeLabel: "Discount", verification: "Verified", eligibility: null });
  const f = findSavings(input([sub({ id: "s1", softwareId: "slack" })], { deals: [deal("a"), deal("b")] }));
  assert.equal(f.filter((x) => x.type === "marketplace_deal").length, 1);
});
