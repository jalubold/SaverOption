/**
 * Plans, the free trial and who gets access — the rules only, with no I/O, so
 * they can be tested on their own. The server (src/lib/server/business/billing.ts)
 * loads a workspace's billing record and asks resolveAccess() on every request;
 * nothing here trusts the browser.
 *
 * - Every new workspace whose creator hasn't had a trial gets TRIAL_DAYS of
 *   full access, without a card. There is no free plan after that.
 * - A paid subscription gives access while Creem reports it active (or in a
 *   Creem-side trial), and until the end of the paid period once it's set to
 *   cancel, cancelled or behind on payment. Paused, unpaid, expired or unknown
 *   states give none.
 * - The demo workspace (fictional sample data for trying the product) isn't billed.
 */

export const TRIAL_DAYS = 7;

export const PLANS = ["pro", "business"] as const;
export type PlanId = (typeof PLANS)[number];

export const PLAN_INTERVALS = ["month", "year"] as const;
export type PlanInterval = (typeof PLAN_INTERVALS)[number];

export const planLabels: Record<PlanId, string> = { pro: "Pro", business: "Business" };
export const intervalLabels: Record<PlanInterval, string> = { month: "Monthly", year: "Yearly" };

export function isPlan(v: unknown): v is PlanId {
  return v === "pro" || v === "business";
}

export function isPlanInterval(v: unknown): v is PlanInterval {
  return v === "month" || v === "year";
}

/** The billing record the rules look at (src/lib/server/business/billing.ts maps the row). */
export interface BillingRecord {
  trialStartedAt: Date | null;
  trialEndsAt: Date | null;
  plan: PlanId | null;
  interval: PlanInterval | null;
  /** Creem's subscription status, as sent. */
  status: string | null;
  creemCustomerId: string | null;
  creemSubscriptionId: string | null;
  priceMinor: number | null;
  currency: string | null;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  canceledAt: Date | null;
  endedAt: Date | null;
  lastRefundAt: Date | null;
}

export type LockReason = "trial_ended" | "no_trial" | "subscription_ended" | "payment_failed" | "paused";

export type Access =
  | { kind: "demo" }
  | { kind: "trial"; endsAt: Date }
  | {
      kind: "subscription";
      plan: PlanId;
      /** active: renews; trialing: Creem-side trial; ending: set to cancel or cancelled, paid up to `until`; past_due: a payment failed, access until `until`. */
      state: "active" | "trialing" | "ending" | "past_due";
      until: Date | null;
    }
  | { kind: "locked"; reason: LockReason };

/** What a subscription in this state gives right now, or null when it gives nothing. */
export function subscriptionAccess(b: BillingRecord, now: Date): Extract<Access, { kind: "subscription" }> | null {
  if (!b.creemSubscriptionId || !b.plan || !b.status || b.endedAt) return null;
  const end = b.currentPeriodEnd;
  const paidUp = end !== null && end.getTime() > now.getTime();
  switch (b.status) {
    case "active":
      return { kind: "subscription", plan: b.plan, state: "active", until: end };
    case "trialing":
      return { kind: "subscription", plan: b.plan, state: "trialing", until: end };
    case "scheduled_cancel":
    case "canceled":
      return paidUp ? { kind: "subscription", plan: b.plan, state: "ending", until: end } : null;
    case "past_due":
      return paidUp ? { kind: "subscription", plan: b.plan, state: "past_due", until: end } : null;
    default:
      // unpaid, paused, expired and anything Creem adds later: no access.
      return null;
  }
}

export function trialActive(b: BillingRecord | null, now: Date): boolean {
  return Boolean(b?.trialEndsAt && b.trialEndsAt.getTime() > now.getTime());
}

/** Who may use the premium features of a workspace right now. */
export function resolveAccess(b: BillingRecord | null, opts: { isDemo: boolean; now: Date }): Access {
  if (opts.isDemo) return { kind: "demo" };
  if (!b) return { kind: "locked", reason: "no_trial" };
  const sub = subscriptionAccess(b, opts.now);
  // A failed or cancelled subscription doesn't cut a trial that is still running.
  if (sub && !(sub.state === "past_due" && trialActive(b, opts.now))) return sub;
  if (trialActive(b, opts.now)) return { kind: "trial", endsAt: b.trialEndsAt! };
  if (sub) return sub;
  if (b.creemSubscriptionId && b.status) {
    if (b.status === "paused") return { kind: "locked", reason: "paused" };
    if (b.status === "past_due" || b.status === "unpaid") return { kind: "locked", reason: "payment_failed" };
    return { kind: "locked", reason: "subscription_ended" };
  }
  return { kind: "locked", reason: b.trialEndsAt ? "trial_ended" : "no_trial" };
}

export function hasPremium(a: Access): boolean {
  return a.kind !== "locked";
}

/** The plan whose limits apply: the trial (and the demo) get everything Business has. */
export function effectivePlan(a: Access): PlanId | null {
  if (a.kind === "subscription") return a.plan;
  if (a.kind === "trial" || a.kind === "demo") return "business";
  return null;
}

/** Whether starting a new checkout makes sense (not while a subscription is running and renewing). */
export function canStartCheckout(a: Access): boolean {
  return !(a.kind === "subscription" && (a.state === "active" || a.state === "trialing"));
}

/** "6 days 4 hours", "5 hours", "less than an hour" — time left until `end`. */
export function remainingText(end: Date, now: Date): string {
  const ms = end.getTime() - now.getTime();
  if (ms <= 0) return "ended";
  const hours = Math.floor(ms / 3_600_000);
  const days = Math.floor(hours / 24);
  const h = hours % 24;
  const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;
  // Three days or more: whole days, rounded (a trial that just started shows "7 days").
  if (days >= 3) return plural(Math.round(hours / 24), "day");
  if (days >= 1) return h > 0 ? `${plural(days, "day")} ${plural(h, "hour")}` : plural(days, "day");
  if (hours >= 1) return plural(hours, "hour");
  return "less than an hour";
}

/** Whole days left (rounded up), for compact badges. */
export function daysLeft(end: Date, now: Date): number {
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86_400_000));
}

/** "Oct 31, 2026, 14:05 UTC" in the workspace's time zone. */
export function formatInstant(d: Date, timeZone: string, opts: { time?: boolean } = {}): string {
  const tz = safeZone(timeZone);
  const date = new Intl.DateTimeFormat("en-US", { timeZone: tz, month: "short", day: "numeric", year: "numeric" }).format(d);
  if (!opts.time) return date;
  const time = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }).format(d);
  return `${date}, ${time} ${tz === "UTC" ? "UTC" : tzName(d, tz)}`;
}

function safeZone(tz: string): string {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return tz;
  } catch {
    return "UTC";
  }
}

function tzName(d: Date, tz: string): string {
  const part = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "short" }).formatToParts(d).find((p) => p.type === "timeZoneName");
  return part?.value ?? tz;
}

/** The Creem billing period that matches each interval; anything else is a misconfigured product. */
export const CREEM_PERIOD: Record<PlanInterval, string> = { month: "every-month", year: "every-year" };

/** Members a plan allows; null means no limit. Open invitations count. */
export function memberLimitReached(limit: number | null, members: number, openInvites: number): boolean {
  return limit !== null && members + openInvites >= limit;
}

export interface BillingNotice {
  tone: "accent" | "warn" | "danger";
  title: string;
  body: string;
  /** Owners and admins get a link to Billing; others are told who can act. */
  cta: string | null;
}

/** The strip shown under the app header for trials, payment problems and ended plans (null when nothing needs saying). */
export function billingNotice(a: Access, opts: { timeZone: string; canManage: boolean; now: Date }): BillingNotice | null {
  const cta = opts.canManage ? "Choose a plan" : null;
  const askOwner = opts.canManage ? "" : " An owner or admin can choose a plan.";
  switch (a.kind) {
    case "demo":
      return null;
    case "trial": {
      const left = remainingText(a.endsAt, opts.now);
      const soon = a.endsAt.getTime() - opts.now.getTime() < 2 * 86_400_000;
      return {
        tone: soon ? "warn" : "accent",
        title: `Free trial · ${left} left`,
        body: `Ends ${formatInstant(a.endsAt, opts.timeZone, { time: true })}. No card needed for the trial.${opts.canManage ? " You can upgrade any time." : " An owner or admin can upgrade any time."}`,
        cta: opts.canManage ? "Upgrade now" : null,
      };
    }
    case "subscription":
      if (a.state === "past_due")
        return { tone: "danger", title: "Payment failed", body: `Creem couldn't collect the last payment. Update the payment method to keep access${a.until ? ` after ${formatInstant(a.until, opts.timeZone)}` : ""}.`, cta: opts.canManage ? "Fix payment" : null };
      if (a.state === "ending")
        return { tone: "warn", title: "Subscription ending", body: `Your ${planLabels[a.plan]} plan was cancelled and ends ${a.until ? formatInstant(a.until, opts.timeZone) : "at the end of the paid period"}.`, cta: opts.canManage ? "View billing" : null };
      return null;
    case "locked": {
      const title =
        a.reason === "trial_ended" ? "Your free trial has ended" : a.reason === "payment_failed" ? "Payment failed — access paused" : a.reason === "paused" ? "Subscription paused" : a.reason === "no_trial" ? "Choose a plan to start" : "Your subscription has ended";
      return { tone: "danger", title, body: `Your data is kept. Settings, members and billing stay available.${askOwner}`, cta };
    }
  }
}

/** The trial card in the sidebar: time left and how much of the trial is used (0–1). */
export interface TrialBadge {
  left: string;
  daysLeft: number;
  used: number;
}

export function trialBadge(a: Access, now: Date): TrialBadge | null {
  if (a.kind !== "trial") return null;
  const total = TRIAL_DAYS * 86_400_000;
  const used = Math.min(1, Math.max(0, 1 - (a.endsAt.getTime() - now.getTime()) / total));
  return { left: remainingText(a.endsAt, now), daysLeft: daysLeft(a.endsAt, now), used };
}

/**
 * Which plan and interval a Creem product is for, from how it's set up in
 * Creem: a recurring product whose name contains "Pro" or "Business" (not
 * both), billed every month or every year. Anything else isn't one of ours.
 */
export function classifyProduct(p: { name: string | null; billingType?: string | null; billingPeriod?: string | null; status?: string | null }): { plan: PlanId; interval: PlanInterval } | null {
  if (!p.name) return null;
  if (p.billingType && p.billingType !== "recurring") return null;
  const interval: PlanInterval | null = p.billingPeriod === CREEM_PERIOD.month ? "month" : p.billingPeriod === CREEM_PERIOD.year ? "year" : null;
  if (!interval) return null;
  const pro = /\bpro\b/i.test(p.name);
  const business = /\bbusiness\b/i.test(p.name);
  if (pro === business) return null;
  return { plan: pro ? "pro" : "business", interval };
}

/** What yearly billing saves against twelve monthly payments (same currency), or null when it doesn't. */
export function yearlySavings(monthly: { priceMinor: number | null; currency: string }, yearly: { priceMinor: number | null; currency: string }): { pct: number; perYear: number } | null {
  if (monthly.priceMinor === null || yearly.priceMinor === null || monthly.currency !== yearly.currency) return null;
  const full = monthly.priceMinor * 12;
  const perYear = full - yearly.priceMinor;
  if (perYear <= 0 || full === 0) return null;
  return { pct: Math.round((perYear / full) * 100), perYear };
}
