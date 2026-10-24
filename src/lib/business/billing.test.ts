// Unit tests for plan access, the free trial and the Creem webhook/payload handling. Run: npm test
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { billingNotice, trialBadge, canStartCheckout, daysLeft, effectivePlan, hasPremium, memberLimitReached, remainingText, resolveAccess, TRIAL_DAYS, type BillingRecord } from "./billing.ts";
import { parseCheckout, parseCreemEvent, parseProduct, parseSubscription, verifyCreemSignature } from "../server/business/creem.ts";

const now = new Date("2026-10-24T12:00:00Z");
const day = 86_400_000;
const at = (offsetDays: number) => new Date(now.getTime() + offsetDays * day);

function record(p: Partial<BillingRecord> = {}): BillingRecord {
  return {
    trialStartedAt: null,
    trialEndsAt: null,
    plan: null,
    interval: null,
    status: null,
    creemCustomerId: null,
    creemSubscriptionId: null,
    priceMinor: null,
    currency: null,
    currentPeriodStart: null,
    currentPeriodEnd: null,
    canceledAt: null,
    endedAt: null,
    lastRefundAt: null,
    ...p,
  };
}
const trial = (endsInDays: number) => ({ trialStartedAt: at(endsInDays - TRIAL_DAYS), trialEndsAt: at(endsInDays) });
const sub = (status: string, periodEndInDays: number | null, plan: "pro" | "business" = "pro") => ({
  plan,
  interval: "month" as const,
  status,
  creemSubscriptionId: "sub_1",
  creemCustomerId: "cust_1",
  currentPeriodStart: at(-10),
  currentPeriodEnd: periodEndInDays === null ? null : at(periodEndInDays),
});

test("a running trial gives access; an ended one locks", () => {
  const a = resolveAccess(record(trial(3)), { isDemo: false, now });
  assert.equal(a.kind, "trial");
  assert.ok(hasPremium(a));
  assert.equal(effectivePlan(a), "business");
  const ended = resolveAccess(record(trial(-0.001)), { isDemo: false, now });
  assert.deepEqual(ended, { kind: "locked", reason: "trial_ended" });
  assert.equal(hasPremium(ended), false);
  assert.equal(effectivePlan(ended), null);
});

test("no billing record or no trial: locked; the demo is never billed", () => {
  assert.deepEqual(resolveAccess(null, { isDemo: false, now }), { kind: "locked", reason: "no_trial" });
  assert.deepEqual(resolveAccess(record(), { isDemo: false, now }), { kind: "locked", reason: "no_trial" });
  assert.equal(resolveAccess(null, { isDemo: true, now }).kind, "demo");
});

test("subscription states", () => {
  const r = (s: Partial<BillingRecord>) => resolveAccess(record(s), { isDemo: false, now });
  assert.deepEqual(r(sub("active", 20)), { kind: "subscription", plan: "pro", state: "active", until: at(20) });
  assert.equal(r(sub("trialing", 5)).kind, "subscription");
  // Cancelled or set to cancel: until the end of the paid period, then nothing.
  assert.deepEqual(r(sub("scheduled_cancel", 4)), { kind: "subscription", plan: "pro", state: "ending", until: at(4) });
  assert.deepEqual(r(sub("canceled", 4)), { kind: "subscription", plan: "pro", state: "ending", until: at(4) });
  assert.deepEqual(r(sub("canceled", -1)), { kind: "locked", reason: "subscription_ended" });
  assert.deepEqual(r(sub("canceled", null)), { kind: "locked", reason: "subscription_ended" });
  // Payment failure: access until the paid period ends.
  assert.deepEqual(r(sub("past_due", 2)), { kind: "subscription", plan: "pro", state: "past_due", until: at(2) });
  assert.deepEqual(r(sub("past_due", -1)), { kind: "locked", reason: "payment_failed" });
  assert.deepEqual(r(sub("unpaid", 10)), { kind: "locked", reason: "payment_failed" });
  assert.deepEqual(r(sub("paused", 10)), { kind: "locked", reason: "paused" });
  assert.deepEqual(r({ ...sub("active", 10), status: "expired", endedAt: at(-1) }), { kind: "locked", reason: "subscription_ended" });
  // Statuses Creem might add later never grant access.
  assert.deepEqual(r(sub("something_new", 10)), { kind: "locked", reason: "subscription_ended" });
  // A product this deployment doesn't sell (no plan) gives nothing.
  assert.deepEqual(r({ ...sub("active", 10), plan: null }), { kind: "locked", reason: "subscription_ended" });
});

test("a failed or ended subscription doesn't cut a running trial short", () => {
  assert.equal(resolveAccess(record({ ...trial(3), ...sub("past_due", 1) }), { isDemo: false, now }).kind, "trial");
  assert.equal(resolveAccess(record({ ...trial(3), ...sub("unpaid", 1) }), { isDemo: false, now }).kind, "trial");
  assert.equal(resolveAccess(record({ ...trial(3), ...sub("active", 30) }), { isDemo: false, now }).kind, "subscription");
});

test("checkout is offered unless a subscription is running and renewing", () => {
  assert.ok(canStartCheckout(resolveAccess(record(trial(3)), { isDemo: false, now })));
  assert.ok(canStartCheckout(resolveAccess(record(sub("canceled", 3)), { isDemo: false, now })));
  assert.equal(canStartCheckout(resolveAccess(record(sub("active", 3)), { isDemo: false, now })), false);
});

test("sidebar trial card: time left and share used", () => {
  const b = trialBadge(resolveAccess(record(trial(5)), { isDemo: false, now }), now)!;
  assert.equal(b.left, "5 days");
  assert.equal(b.daysLeft, 5);
  assert.ok(Math.abs(b.used - 2 / 7) < 1e-9);
  assert.equal(trialBadge(resolveAccess(record(sub("active", 20)), { isDemo: false, now }), now), null);
});

test("remaining time and member limits", () => {
  assert.equal(remainingText(at(6.4), now), "6 days");
  assert.equal(remainingText(new Date(at(7).getTime() - 5000), now), "7 days");
  assert.equal(remainingText(at(1.5), now), "1 day 12 hours");
  assert.equal(remainingText(new Date(now.getTime() + 5 * 3_600_000), now), "5 hours");
  assert.equal(remainingText(new Date(now.getTime() + 60_000), now), "less than an hour");
  assert.equal(remainingText(at(-1), now), "ended");
  assert.equal(daysLeft(at(6.2), now), 7);
  assert.equal(memberLimitReached(5, 4, 0), false);
  assert.equal(memberLimitReached(5, 4, 1), true);
  assert.equal(memberLimitReached(null, 400, 50), false);
});

test("banner text: trial countdown, payment problems, ended plans", () => {
  const t = billingNotice(resolveAccess(record(trial(5)), { isDemo: false, now }), { timeZone: "UTC", canManage: true, now })!;
  assert.match(t.title, /Free trial · 5 days left/);
  assert.match(t.body, /Ends Oct 29, 2026, 12:00 UTC/);
  assert.equal(t.cta, "Upgrade now");
  assert.match(t.body, /upgrade any time/);
  const member = billingNotice(resolveAccess(record(trial(5)), { isDemo: false, now }), { timeZone: "UTC", canManage: false, now })!;
  assert.equal(member.cta, null);
  assert.equal(billingNotice(resolveAccess(record(sub("past_due", 2)), { isDemo: false, now }), { timeZone: "UTC", canManage: true, now })!.title, "Payment failed");
  assert.equal(billingNotice(resolveAccess(record(sub("active", 20)), { isDemo: false, now }), { timeZone: "UTC", canManage: true, now }), null);
  assert.equal(billingNotice({ kind: "demo" }, { timeZone: "UTC", canManage: true, now }), null);
  assert.equal(billingNotice(resolveAccess(record(trial(-1)), { isDemo: false, now }), { timeZone: "UTC", canManage: true, now })!.tone, "danger");
});

// ─── Creem ───────────────────────────────────────────────────────────────────

const secret = "whsec_" + Buffer.from("a-test-signing-key-0123456789").toString("base64");
const body = JSON.stringify({ id: "evt_1", eventType: "subscription.paid", created_at: 1_793_000_000_000, object: { object: "subscription", id: "sub_1", status: "active" } });

function standardHeaders(raw: string, ts = Math.floor(now.getTime() / 1000), key = secret, id = "msg_1"): Headers {
  const sig = createHmac("sha256", Buffer.from(key.slice(6), "base64")).update(`${id}.${ts}.${raw}`).digest("base64");
  return new Headers({ "webhook-id": id, "webhook-timestamp": String(ts), "webhook-signature": `v1,${sig}` });
}

test("webhook signatures: Standard Webhooks scheme", () => {
  assert.ok(verifyCreemSignature(body, standardHeaders(body), secret, now.getTime()));
  // Several signatures (key rotation): any valid v1 passes.
  const h = standardHeaders(body);
  h.set("webhook-signature", `v1,AAAA ${h.get("webhook-signature")}`);
  assert.ok(verifyCreemSignature(body, h, secret, now.getTime()));
  // Tampered body, wrong secret, stale timestamp, missing header, wrong version.
  assert.equal(verifyCreemSignature(body.replace("active", "trialing"), standardHeaders(body), secret, now.getTime()), false);
  assert.equal(verifyCreemSignature(body, standardHeaders(body, undefined, "whsec_" + Buffer.from("other").toString("base64")), secret, now.getTime()), false);
  assert.equal(verifyCreemSignature(body, standardHeaders(body, Math.floor(now.getTime() / 1000) - 301), secret, now.getTime()), false);
  const missing = standardHeaders(body);
  missing.delete("webhook-timestamp");
  assert.equal(verifyCreemSignature(body, missing, secret, now.getTime()), false);
  const v2 = standardHeaders(body);
  v2.set("webhook-signature", v2.get("webhook-signature")!.replace("v1,", "v2,"));
  assert.equal(verifyCreemSignature(body, v2, secret, now.getTime()), false);
});

test("webhook signatures: creem-signature header", () => {
  const sig = createHmac("sha256", secret).update(body).digest("hex");
  assert.ok(verifyCreemSignature(body, new Headers({ "creem-signature": sig }), secret));
  assert.ok(verifyCreemSignature(body, new Headers({ "creem-signature": `sha256=${sig.toUpperCase()}` }), secret));
  assert.equal(verifyCreemSignature(body + " ", new Headers({ "creem-signature": sig }), secret), false);
  assert.equal(verifyCreemSignature(body, new Headers({ "creem-signature": sig.slice(0, 10) }), secret), false);
  assert.equal(verifyCreemSignature(body, new Headers(), secret), false);
});

test("event envelope and objects are parsed defensively", () => {
  const e = parseCreemEvent(body)!;
  assert.equal(e.id, "evt_1");
  assert.equal(e.type, "subscription.paid");
  assert.equal(e.createdAt?.getTime(), 1_793_000_000_000);
  assert.equal(parseCreemEvent("not json"), null);
  assert.equal(parseCreemEvent(JSON.stringify({ id: "x" })), null);
  // created_at in seconds is read as seconds.
  assert.equal(parseCreemEvent(JSON.stringify({ id: "e", type: "x", created_at: 1_793_000_000 }))!.createdAt?.getTime(), 1_793_000_000_000);

  const s = parseSubscription({
    object: "subscription",
    id: "sub_9",
    status: "scheduled_cancel",
    mode: "test",
    product: { id: "prod_pro_m", price: 2900, currency: "usd" },
    customer: { id: "cust_9", email: "x@example.com" },
    current_period_start_date: "2026-10-01T00:00:00.000Z",
    current_period_end_date: "2026-11-01T00:00:00.000Z",
    canceled_at: null,
    updated_at: "2026-10-20T10:00:00.000Z",
    metadata: { workspace_id: "w" },
  })!;
  assert.equal(s.productId, "prod_pro_m");
  assert.equal(s.price, 2900);
  assert.equal(s.currency, "USD");
  assert.equal(s.customerId, "cust_9");
  assert.equal(s.currentPeriodEnd?.toISOString(), "2026-11-01T00:00:00.000Z");
  assert.deepEqual(s.metadata, { workspace_id: "w" });
  assert.equal(parseSubscription({ object: "checkout", id: "c", status: "completed" }), null);
  assert.equal(parseSubscription({ id: "s" }), null);

  const c = parseCheckout({ object: "checkout", id: "ch_1", status: "completed", request_id: "r", product: "prod_x", subscription: "sub_1", customer: { id: "cust_1" }, checkout_url: "https://checkout.creem.io/ch_1" })!;
  assert.equal(c.subscriptionId, "sub_1");
  assert.equal(c.subscription, null);
  assert.equal(c.customerId, "cust_1");
  assert.equal(c.checkoutUrl, "https://checkout.creem.io/ch_1");
  // Only https links are followed.
  assert.equal(parseCheckout({ object: "checkout", id: "ch_2", status: "pending", checkout_url: "javascript:alert(1)" })!.checkoutUrl, null);

  const p = parseProduct({ id: "prod_1", name: "Pro", price: 2900, currency: "USD", billing_type: "recurring", billing_period: "every-month", trial_period_days: null, tax_mode: "exclusive" })!;
  assert.equal(p.billingPeriod, "every-month");
  assert.equal(p.taxMode, "exclusive");
  assert.equal(parseProduct({ id: "prod_2", price: "29" }), null);
});
