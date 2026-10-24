import { createHash } from "node:crypto";
import { cache } from "react";
import {
  canStartCheckout,
  CREEM_PERIOD,
  effectivePlan,
  hasPremium,
  isPlan,
  isPlanInterval,
  memberLimitReached,
  planLabels,
  resolveAccess,
  subscriptionAccess,
  TRIAL_DAYS,
  type Access,
  type BillingRecord,
  type PlanId,
  type PlanInterval,
} from "@/lib/business/billing";
import { isUuid } from "@/lib/business/form";
import { can } from "@/lib/business/permissions";
import { db } from "@/lib/server/db";
import { assertCan, BizError, logActivity, type BizContext, type BizWorkspace, type Db } from "@/lib/server/business/context";
import {
  cancelSubscriptionAtPeriodEnd,
  createCheckout,
  creemApiKey,
  CreemError,
  creemMode,
  creemWebhookSecret,
  customerPortalLink,
  getCheckout,
  getProduct,
  getSubscription,
  parseCheckout,
  parseRefund,
  parseSubscription,
  type CreemCheckout,
  type CreemEvent,
  type CreemProduct,
  type CreemRefund,
  type CreemSubscription,
} from "@/lib/server/business/creem";
import { memberLimit, offerForProduct, planOffer, planOffers, type PlanOffer } from "@/lib/server/business/plans";
import type { SessionUser } from "@/lib/server/supabase";

/**
 * Trials, plans and Creem billing for workspaces. The billing record changes
 * only here: when a workspace is created (its trial), from verified Creem
 * webhooks, and from Creem API responses fetched with the server's key. A
 * browser redirect back from checkout never changes it by itself.
 */

// ─── Reading ─────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBilling(r: any): BillingRecord {
  return {
    trialStartedAt: r.trial_started_at,
    trialEndsAt: r.trial_ends_at,
    plan: isPlan(r.plan) ? r.plan : null,
    interval: isPlanInterval(r.billing_interval) ? r.billing_interval : null,
    status: r.status,
    creemCustomerId: r.creem_customer_id,
    creemSubscriptionId: r.creem_subscription_id,
    priceMinor: r.price_minor === null ? null : Number(r.price_minor),
    currency: r.currency,
    currentPeriodStart: r.current_period_start,
    currentPeriodEnd: r.current_period_end,
    canceledAt: r.canceled_at,
    endedAt: r.ended_at,
    lastRefundAt: r.last_refund_at,
  };
}

export async function getBillingRecord(workspaceId: string, sql: Db = db()): Promise<BillingRecord | null> {
  const [row] = await sql`select * from biz_billing where workspace_id = ${workspaceId}`;
  return row ? mapBilling(row) : null;
}

/** Once per request: who may use this workspace's premium features right now. */
export const workspaceAccess = cache(async (workspaceId: string, isDemo: boolean): Promise<Access> => {
  if (isDemo) return { kind: "demo" };
  return resolveAccess(await getBillingRecord(workspaceId), { isDemo, now: new Date() });
});

export function accessFor(ws: Pick<BizWorkspace, "id" | "isDemo">): Promise<Access> {
  return workspaceAccess(ws.id, ws.isDemo);
}

/** Throws when the workspace has no trial or subscription giving access. */
export async function assertPremium(ctx: BizContext): Promise<void> {
  if (!hasPremium(await accessFor(ctx.workspace))) {
    throw new BizError(
      "locked",
      can(ctx.role, "billing.manage")
        ? "This workspace's free trial or subscription has ended. Choose a plan in Settings → Billing to keep working — your data is kept."
        : "This workspace's free trial or subscription has ended. Ask an owner or admin to choose a plan in Settings → Billing — your data is kept.",
    );
  }
}

// ─── Trials ──────────────────────────────────────────────────────────────────

export function emailHash(email: string): string {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}

/**
 * Gives a new workspace the free trial if the account (by user ID or email
 * address) has never had one; otherwise it starts without one. Runs in the
 * workspace-creation transaction. Returns whether a trial started.
 */
export async function startTrialIfEligible(sql: Db, user: SessionUser, workspaceId: string, now = new Date()): Promise<boolean> {
  const ends = new Date(now.getTime() + TRIAL_DAYS * 86_400_000);
  const [claimed] = await sql`
    insert into biz_trial_claims (user_id, email_sha256, workspace_id, started_at)
    values (${user.id}, ${emailHash(user.email)}, ${workspaceId}, ${now})
    on conflict do nothing
    returning user_id`;
  await sql`
    insert into biz_billing (workspace_id, trial_started_at, trial_ends_at)
    values (${workspaceId}, ${claimed ? now : null}, ${claimed ? ends : null})
    on conflict (workspace_id) do nothing`;
  return Boolean(claimed);
}

/** Whether this account has already used its free trial (for the onboarding copy). */
export async function trialUsed(user: SessionUser): Promise<boolean> {
  const [row] = await db()`select 1 from biz_trial_claims where user_id = ${user.id} or email_sha256 = ${emailHash(user.email)} limit 1`;
  return Boolean(row);
}

// ─── Plan limits ─────────────────────────────────────────────────────────────

export interface MemberCapacity {
  plan: PlanId | null;
  limit: number | null;
  members: number;
  openInvites: number;
  reached: boolean;
}

export async function memberCapacity(ctx: BizContext, sql: Db = db()): Promise<MemberCapacity> {
  const plan = effectivePlan(await accessFor(ctx.workspace));
  const limit = plan ? memberLimit(plan) : 0;
  const [{ members, invites }] = await sql`
    select (select count(*)::int from biz_memberships where workspace_id = ${ctx.workspace.id}) as members,
      (select count(*)::int from biz_invitations where workspace_id = ${ctx.workspace.id} and accepted_at is null and revoked_at is null) as invites`;
  return { plan, limit, members, openInvites: invites, reached: plan === null || memberLimitReached(limit, members, invites) };
}

/** Before an invitation: the plan must be active and have room. */
export async function assertMemberCapacity(ctx: BizContext, sql: Db): Promise<void> {
  await assertPremium(ctx);
  const c = await memberCapacity(ctx, sql);
  if (c.reached && c.plan) {
    const hint = c.plan === "pro" ? " Upgrade to Business or remove a member or open invitation first." : " Remove a member or open invitation first.";
    throw new BizError("invalid", `The ${planLabels[c.plan]} plan includes up to ${c.limit} members (including open invitations).${hint}`);
  }
}

// ─── Offers and prices ───────────────────────────────────────────────────────

export interface OfferView extends PlanOffer {
  /** Price and currency to show, from Creem when the product could be read, otherwise the list price. */
  priceMinor: number | null;
  currency: string;
  priceSource: "creem" | "list" | null;
  /** Checkout can start for this offer right now. */
  available: boolean;
  /** A Creem-side trial configured on the product. */
  creemTrialDays: number | null;
  creemTrialPrice: number | null;
  problem: string | null;
}

/** Whether online checkout is set up at all (API key, webhook secret and at least one product). */
export function checkoutConfigured(): boolean {
  return Boolean(creemApiKey() && creemWebhookSecret() && planOffers().some((o) => o.productId));
}

const productCache = new Map<string, { at: number; product: CreemProduct | null; error: string | null }>();
const PRODUCT_TTL = 10 * 60_000;
const PRODUCT_ERROR_TTL = 60_000;

/** A product as Creem reports it, or why it can't be sold (wrong period, not recurring, unreadable). */
export async function readProduct(offer: PlanOffer, opts: { fresh?: boolean } = {}): Promise<{ product: CreemProduct | null; problem: string | null }> {
  if (!offer.productId) return { product: null, problem: "No Creem product is configured for this plan." };
  if (!creemApiKey()) return { product: null, problem: "Creem isn't configured." };
  const hit = productCache.get(offer.productId);
  if (!opts.fresh && hit && Date.now() - hit.at < (hit.product ? PRODUCT_TTL : PRODUCT_ERROR_TTL)) return check(offer, hit.product, hit.error);
  try {
    const product = await getProduct(offer.productId);
    productCache.set(offer.productId, { at: Date.now(), product, error: null });
    return check(offer, product, null);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[billing] product ${offer.plan}/${offer.interval} unreadable: ${msg}`);
    productCache.set(offer.productId, { at: Date.now(), product: null, error: "The price couldn't be read from Creem." });
    return { product: null, problem: "The price couldn't be read from Creem." };
  }
}

function check(offer: PlanOffer, product: CreemProduct | null, error: string | null): { product: CreemProduct | null; problem: string | null } {
  if (!product) return { product: null, problem: error ?? "The price couldn't be read from Creem." };
  if (product.billingType && product.billingType !== "recurring") return { product, problem: "The Creem product isn't a subscription." };
  if (product.billingPeriod !== CREEM_PERIOD[offer.interval]) return { product, problem: `The Creem product bills ${product.billingPeriod ?? "on an unknown schedule"}, not ${CREEM_PERIOD[offer.interval]}.` };
  if (product.mode && !modeMatches(product.mode)) return { product, problem: `The Creem product is in ${product.mode} mode.` };
  return { product, problem: null };
}

export async function offerViews(opts: { fresh?: boolean } = {}): Promise<OfferView[]> {
  const configured = checkoutConfigured();
  return Promise.all(
    planOffers().map(async (o) => {
      const { product, problem } = o.productId && creemApiKey() ? await readProduct(o, opts) : { product: null, problem: o.productId ? "Creem isn't configured." : null };
      const fromCreem = product && !problem;
      return {
        ...o,
        priceMinor: fromCreem ? product.price : o.listPriceMinor,
        currency: fromCreem ? product.currency : "USD",
        priceSource: fromCreem ? "creem" : o.listPriceMinor !== null ? "list" : null,
        available: Boolean(configured && fromCreem),
        creemTrialDays: fromCreem && product.trialPeriodDays && product.trialPeriodDays > 0 ? product.trialPeriodDays : null,
        creemTrialPrice: fromCreem ? product.trialPrice : null,
        problem: o.productId ? problem : null,
      } satisfies OfferView;
    }),
  );
}

function modeMatches(mode: string | null): boolean {
  if (!mode) return true;
  return creemMode() === "prod" ? mode === "prod" : mode === "test" || mode === "sandbox";
}

// ─── Checkout ────────────────────────────────────────────────────────────────

/**
 * Starts a Creem checkout for the chosen plan after re-reading its price from
 * Creem. The checkout row's id goes to Creem as request_id and, with the
 * workspace, in the metadata Creem copies onto the subscription.
 */
export async function startCheckout(ctx: BizContext, plan: PlanId, interval: PlanInterval, origin: string): Promise<string> {
  assertCan(ctx, "billing.manage", "Only owners and admins can change the plan.");
  if (ctx.workspace.isDemo) throw new BizError("invalid", "The demo workspace isn't billed. Create your company's workspace to subscribe.");
  if (!checkoutConfigured()) throw new BizError("unavailable", "Online checkout isn't set up yet. Contact us and we'll set up your plan.");
  const access = await accessFor(ctx.workspace);
  if (!canStartCheckout(access)) throw new BizError("conflict", "This workspace already has an active subscription. Use Manage billing to change it.");
  const offer = planOffer(plan, interval);
  const { product, problem } = await readProduct(offer, { fresh: true });
  if (!product || problem) throw new BizError("unavailable", `${planLabels[plan]} ${interval === "month" ? "monthly" : "yearly"} can't be bought right now. ${problem ?? ""}`.trim());

  const [row] = await db()`
    insert into biz_billing_checkouts (workspace_id, user_id, plan, billing_interval, creem_product_id)
    values (${ctx.workspace.id}, ${ctx.user.id}, ${plan}, ${interval}, ${product.id})
    returning id`;
  try {
    const checkout = await createCheckout({
      requestId: row.id,
      productId: product.id,
      successUrl: `${origin}/business/settings/billing?checkout=${row.id}`,
      email: ctx.user.email,
      name: ctx.user.name,
      metadata: { workspace_id: ctx.workspace.id, checkout_ref: row.id, user_id: ctx.user.id, plan, interval },
    });
    await db()`update biz_billing_checkouts set creem_checkout_id = ${checkout.id} where id = ${row.id}`;
    await logActivity(db(), ctx, { action: "billing.checkout_started", entityType: "workspace", entityId: ctx.workspace.id, summary: `Started checkout for ${planLabels[plan]} (${interval === "month" ? "monthly" : "yearly"})` });
    return checkout.checkoutUrl!;
  } catch (err) {
    await db()`update biz_billing_checkouts set status = 'failed' where id = ${row.id}`;
    if (err instanceof CreemError) {
      console.error(`[billing] checkout failed: ${err.message}`);
      throw new BizError("unavailable", "Creem couldn't start the checkout. Nothing was charged. Try again in a moment.");
    }
    throw err;
  }
}

export interface CheckoutReturn {
  state: "active" | "processing" | "unknown";
  plan: PlanId | null;
}

/**
 * After the redirect back from Creem: asks Creem's API (with the server key)
 * whether this workspace's checkout completed and applies the subscription it
 * reports. The redirect's own query string is never trusted.
 */
export async function confirmCheckoutReturn(ctx: BizContext, checkoutRef: string): Promise<CheckoutReturn> {
  if (!isUuid(checkoutRef)) return { state: "unknown", plan: null };
  const [row] = await db()`select * from biz_billing_checkouts where id = ${checkoutRef} and workspace_id = ${ctx.workspace.id}`;
  if (!row) return { state: "unknown", plan: null };
  const plan = isPlan(row.plan) ? row.plan : null;
  if (row.creem_checkout_id && creemApiKey()) {
    try {
      const c = await getCheckout(row.creem_checkout_id);
      if (c.status === "completed" && modeMatches(c.mode) && (c.requestId === null || c.requestId === row.id)) {
        await db()`update biz_billing_checkouts set status = 'completed', completed_at = coalesce(completed_at, now()) where id = ${row.id}`;
        const sub = c.subscription ?? (c.subscriptionId ? await getSubscription(c.subscriptionId) : null);
        if (sub) await db().begin((sql) => applySubscription(sql, sub, { hintWorkspaceId: row.workspace_id, eventAt: null, eventType: "checkout.api" }));
      }
    } catch (err) {
      console.error(`[billing] checkout return check failed: ${err instanceof Error ? err.message : err}`);
    }
  }
  const access = resolveAccess(await getBillingRecord(ctx.workspace.id), { isDemo: false, now: new Date() });
  return { state: access.kind === "subscription" ? "active" : "processing", plan };
}

// ─── Managing a subscription ─────────────────────────────────────────────────

export async function billingPortalUrl(ctx: BizContext): Promise<string> {
  assertCan(ctx, "billing.manage", "Only owners and admins can manage billing.");
  const b = await getBillingRecord(ctx.workspace.id);
  if (!b?.creemCustomerId) throw new BizError("not_found", "There's no Creem billing account for this workspace yet.");
  try {
    return await customerPortalLink(b.creemCustomerId);
  } catch (err) {
    console.error(`[billing] portal link failed: ${err instanceof Error ? err.message : err}`);
    throw new BizError("unavailable", "Creem's billing portal couldn't be opened. Try again in a moment.");
  }
}

/** Cancels at the end of the paid period; access continues until then. */
export async function cancelAtPeriodEnd(ctx: BizContext): Promise<Date | null> {
  assertCan(ctx, "billing.manage", "Only owners and admins can cancel the subscription.");
  const b = await getBillingRecord(ctx.workspace.id);
  if (!b?.creemSubscriptionId || !subscriptionAccess(b, new Date())) throw new BizError("not_found", "There's no active subscription to cancel.");
  if (b.status === "scheduled_cancel" || b.status === "canceled") throw new BizError("conflict", "The subscription is already set to end.");
  let sub: CreemSubscription;
  try {
    sub = await cancelSubscriptionAtPeriodEnd(b.creemSubscriptionId);
  } catch (err) {
    console.error(`[billing] cancel failed: ${err instanceof Error ? err.message : err}`);
    throw new BizError("unavailable", "Creem couldn't cancel the subscription. Nothing changed — try again or use Manage billing.");
  }
  await db().begin(async (sql) => {
    await applySubscription(sql, sub, { hintWorkspaceId: ctx.workspace.id, eventAt: null, eventType: "cancel.api" });
    await logActivity(sql, ctx, { action: "billing.cancel_scheduled", entityType: "workspace", entityId: ctx.workspace.id, summary: "Set the subscription to end at the close of the paid period" });
  });
  return sub.currentPeriodEnd ?? b.currentPeriodEnd;
}

// ─── Applying Creem's state ──────────────────────────────────────────────────

interface Applied {
  result: "applied" | "ignored" | "stale";
  note: string | null;
  workspaceId: string | null;
}

const ignored = (note: string, workspaceId: string | null = null): Applied => ({ result: "ignored", note, workspaceId });

function metaWorkspace(meta: Record<string, unknown>): string | null {
  const v = meta.workspace_id;
  return isUuid(v) ? (v as string) : null;
}

/**
 * Writes a subscription's state (from a verified webhook or an API response)
 * onto the workspace it belongs to. Ownership comes from the row already
 * linked to that subscription, else the metadata the server set at checkout;
 * an older update never overwrites a newer one, and a running subscription
 * isn't replaced by a different one that has ended.
 */
async function applySubscription(sql: Db, sub: CreemSubscription, opts: { hintWorkspaceId: string | null; eventAt: Date | null; eventType: string }): Promise<Applied> {
  if (!modeMatches(sub.mode)) return ignored(`${sub.mode} mode subscription; this deployment uses ${creemMode()}`);
  const [linked] = await sql`select workspace_id from biz_billing where creem_subscription_id = ${sub.id}`;
  const claimed = metaWorkspace(sub.metadata) ?? opts.hintWorkspaceId;
  if (linked && claimed && linked.workspace_id !== claimed) return ignored("subscription is linked to a different workspace", linked.workspace_id);
  const wsId: string | null = linked?.workspace_id ?? claimed;
  if (!wsId) return ignored("no workspace for this subscription");
  const [ws] = await sql`select id, is_demo from biz_workspaces where id = ${wsId}`;
  if (!ws) return ignored("workspace no longer exists");
  if (ws.is_demo) return ignored("demo workspaces aren't billed", wsId);

  await sql`insert into biz_billing (workspace_id) values (${wsId}) on conflict (workspace_id) do nothing`;
  const [cur] = await sql`select * from biz_billing where workspace_id = ${wsId} for update`;
  const current = mapBilling(cur);
  const changedAt = sub.updatedAt ?? opts.eventAt ?? new Date();
  const now = new Date();

  if (current.creemSubscriptionId === sub.id && cur.synced_at && changedAt.getTime() < new Date(cur.synced_at).getTime()) {
    return { result: "stale", note: `older than the state saved at ${new Date(cur.synced_at).toISOString()}`, workspaceId: wsId };
  }

  const offer = offerForProduct(sub.productId);
  const expired = opts.eventType === "subscription.expired";
  const status = expired ? "expired" : sub.status;
  const next: BillingRecord = {
    ...current,
    plan: offer?.plan ?? null,
    interval: offer?.interval ?? null,
    status,
    creemSubscriptionId: sub.id,
    creemCustomerId: sub.customerId ?? current.creemCustomerId,
    priceMinor: sub.price ?? (current.creemSubscriptionId === sub.id ? current.priceMinor : null),
    currency: sub.currency ?? (current.creemSubscriptionId === sub.id ? current.currency : null),
    currentPeriodStart: sub.currentPeriodStart ?? (current.creemSubscriptionId === sub.id ? current.currentPeriodStart : null),
    currentPeriodEnd: sub.currentPeriodEnd ?? (current.creemSubscriptionId === sub.id ? current.currentPeriodEnd : null),
    canceledAt: sub.canceledAt,
    endedAt: expired ? (opts.eventAt ?? now) : null,
  };

  if (current.creemSubscriptionId && current.creemSubscriptionId !== sub.id && subscriptionAccess(current, now) && !subscriptionAccess(next, now)) {
    return ignored(`superseded: workspace already has running subscription ${current.creemSubscriptionId}`, wsId);
  }

  await sql`
    update biz_billing set
      plan = ${next.plan}, billing_interval = ${next.interval}, status = ${status.slice(0, 40)}, creem_mode = ${sub.mode && ["test", "prod", "sandbox"].includes(sub.mode) ? sub.mode : null},
      creem_customer_id = ${next.creemCustomerId}, creem_subscription_id = ${sub.id}, creem_product_id = ${sub.productId},
      price_minor = ${next.priceMinor}, currency = ${next.currency && /^[A-Z]{3}$/.test(next.currency) ? next.currency : null},
      current_period_start = ${next.currentPeriodStart}, current_period_end = ${next.currentPeriodEnd},
      canceled_at = ${next.canceledAt}, ended_at = ${next.endedAt}, synced_at = ${changedAt}, updated_at = now()
    where workspace_id = ${wsId}`;
  return { result: "applied", note: offer ? `${offer.plan}/${offer.interval} ${status}` : `unknown product ${sub.productId ?? "(none)"} ${status}: no plan access`, workspaceId: wsId };
}

const SUBSCRIPTION_EVENTS = new Set([
  "subscription.active",
  "subscription.trialing",
  "subscription.paid",
  "subscription.canceled",
  "subscription.scheduled_cancel",
  "subscription.expired",
  "subscription.unpaid",
  "subscription.past_due",
  "subscription.paused",
  "subscription.update",
]);

export interface WebhookOutcome {
  result: "applied" | "ignored" | "stale" | "duplicate";
  note: string | null;
}

/**
 * Handles one verified webhook delivery exactly once: the event id is recorded
 * in the same transaction as its effect, so a retried or replayed delivery is
 * acknowledged without being applied again (and a failure rolls both back so
 * Creem retries).
 */
export async function applyCreemEvent(event: CreemEvent): Promise<WebhookOutcome> {
  // checkout.completed may only carry the subscription's id; read it from the API first, outside the transaction.
  let checkoutSub: CreemSubscription | null = null;
  const checkout = event.type === "checkout.completed" ? parseCheckout(event.object) : null;
  if (checkout && !checkout.subscription && checkout.subscriptionId && creemApiKey()) {
    try {
      checkoutSub = await getSubscription(checkout.subscriptionId);
    } catch (err) {
      // The subscription's own subscription.active event brings the same state.
      console.warn(`[billing] couldn't read subscription for ${event.id}: ${err instanceof Error ? err.message : err}`);
    }
  }

  return db().begin(async (sql) => {
    const [fresh] = await sql`
      insert into biz_billing_events (id, event_type, result, event_at) values (${event.id}, ${event.type.slice(0, 80)}, 'ignored', ${event.createdAt})
      on conflict (id) do nothing returning id`;
    if (!fresh) return { result: "duplicate" as const, note: null };

    let out: Applied;
    let objectId: string | null = null;
    let mode: string | null = null;
    if (SUBSCRIPTION_EVENTS.has(event.type)) {
      const sub = parseSubscription(event.object);
      objectId = sub?.id ?? null;
      mode = sub?.mode ?? null;
      out = sub ? await applySubscription(sql, sub, { hintWorkspaceId: null, eventAt: event.createdAt, eventType: event.type }) : ignored("unreadable subscription object");
    } else if (event.type === "checkout.completed") {
      objectId = checkout?.id ?? null;
      mode = checkout?.mode ?? null;
      out = checkout ? await applyCheckoutCompleted(sql, checkout, checkoutSub, event) : ignored("unreadable checkout object");
    } else if (event.type === "refund.created" || event.type === "dispute.created") {
      const refund = parseRefund(event.object);
      objectId = refund?.id ?? null;
      mode = refund?.mode ?? null;
      out = refund ? await recordRefund(sql, refund, event) : ignored(`unreadable ${event.type.split(".")[0]} object`);
    } else {
      out = ignored(`event type not used`);
    }
    await sql`
      update biz_billing_events set result = ${out.result}, note = ${out.note?.slice(0, 300) ?? null}, workspace_id = ${out.workspaceId},
        object_id = ${objectId?.slice(0, 100) ?? null}, mode = ${mode?.slice(0, 20) ?? null}
      where id = ${event.id}`;
    return { result: out.result, note: out.note };
  });
}

async function applyCheckoutCompleted(sql: Db, c: CreemCheckout, sub: CreemSubscription | null, event: CreemEvent): Promise<Applied> {
  if (!modeMatches(c.mode)) return ignored(`${c.mode} mode checkout; this deployment uses ${creemMode()}`);
  const ref = isUuid(c.requestId) ? c.requestId : isUuid(c.metadata.checkout_ref) ? (c.metadata.checkout_ref as string) : null;
  const [row] = ref
    ? await sql`select * from biz_billing_checkouts where id = ${ref}`
    : await sql`select * from biz_billing_checkouts where creem_checkout_id = ${c.id}`;
  if (!row) return ignored("checkout wasn't started from this app");
  if (row.creem_checkout_id && row.creem_checkout_id !== c.id) return ignored("checkout id doesn't match the one created for this request");
  const meta = metaWorkspace(c.metadata);
  if (meta && meta !== row.workspace_id) return ignored("checkout metadata names a different workspace", row.workspace_id);
  await sql`update biz_billing_checkouts set status = 'completed', completed_at = coalesce(completed_at, now()), creem_checkout_id = coalesce(creem_checkout_id, ${c.id}) where id = ${row.id}`;
  const s = c.subscription ?? sub;
  if (!s) return { result: "applied", note: "checkout recorded; waiting for the subscription event", workspaceId: row.workspace_id };
  return applySubscription(sql, s, { hintWorkspaceId: row.workspace_id, eventAt: event.createdAt, eventType: event.type });
}

async function recordRefund(sql: Db, r: CreemRefund, event: CreemEvent): Promise<Applied> {
  if (!modeMatches(r.mode)) return ignored(`${r.mode} mode ${event.type}; this deployment uses ${creemMode()}`);
  const [linked] = r.subscriptionId ? await sql`select workspace_id from biz_billing where creem_subscription_id = ${r.subscriptionId}` : [];
  const wsId: string | null = linked?.workspace_id ?? null;
  if (!wsId) return ignored(`${event.type} for a subscription not linked to a workspace`);
  if (event.type === "refund.created") {
    await sql`update biz_billing set last_refund_at = ${r.createdAt ?? event.createdAt ?? new Date()}, updated_at = now() where workspace_id = ${wsId}`;
  }
  // Access follows the subscription's own status events (a refund may be partial).
  return { result: "applied", note: `${event.type} recorded`, workspaceId: wsId };
}
