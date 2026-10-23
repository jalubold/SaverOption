// Unit tests for seat utilization history. Run: npm test
import assert from "node:assert/strict";
import test from "node:test";
import { hasAssignmentHistory, utilizationByMonth } from "./utilization.ts";

test("utilization at month ends follows assignments and purchased seats", () => {
  const points = utilizationByMonth(
    ["s1", "s2"],
    [
      { subscriptionId: "s1", assignedAt: "2026-07-10T09:00:00Z", releasedAt: null },
      { subscriptionId: "s1", assignedAt: "2026-07-20T09:00:00Z", releasedAt: "2026-09-05T09:00:00Z" },
      { subscriptionId: "s1", assignedAt: new Date("2026-09-30T23:00:00Z"), releasedAt: null },
      { subscriptionId: "s2", assignedAt: "2026-08-01T09:00:00Z", releasedAt: null },
      { subscriptionId: "s2", assignedAt: "2026-08-01T09:00:00Z", releasedAt: null },
      { subscriptionId: "s2", assignedAt: "2026-08-01T09:00:00Z", releasedAt: null },
    ],
    [
      { subscriptionId: "s1", effectiveFrom: "2026-07-01", purchasedSeats: 4 },
      { subscriptionId: "s2", effectiveFrom: "2026-08-01", purchasedSeats: 2 },
      { subscriptionId: "s2", effectiveFrom: "2026-09-15", purchasedSeats: 5 },
    ],
    ["2026-06", "2026-07", "2026-08", "2026-09"],
  );
  assert.deepEqual(
    points.map((p) => [p.assigned, p.purchased]),
    [
      [0, 0], // nothing purchased yet
      [2, 4],
      [4, 6], // s2 has 3 named seats but only 2 purchased: capped at 2
      [5, 9], // one s1 seat released, one added on the 30th; s2 now has 5 seats
    ],
  );
  assert.equal(points[0].utilization, null);
  assert.equal(points[1].utilization, 50);
});

test("ignores subscriptions outside the list and zero-seat terms", () => {
  const points = utilizationByMonth(
    ["s1"],
    [{ subscriptionId: "other", assignedAt: "2026-01-01", releasedAt: null }],
    [{ subscriptionId: "s1", effectiveFrom: "2026-01-01", purchasedSeats: 0 }],
    ["2026-02"],
  );
  assert.deepEqual(points[0], { month: "2026-02", assigned: 0, purchased: 0, utilization: null });
});

test("history check needs an assignment older than the window", () => {
  const a = [{ subscriptionId: "s1", assignedAt: "2026-10-10T00:00:00Z", releasedAt: null }];
  assert.equal(hasAssignmentHistory(a, "2026-10-23"), false);
  assert.equal(hasAssignmentHistory(a, "2026-11-20"), true);
  assert.equal(hasAssignmentHistory([], "2026-10-23"), false);
});
