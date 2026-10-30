import type postgres from "postgres";
import { getPlan, planPriceCents, withPrices, type ListingPlanId } from "@/config/listing-plans";
import { isPaid } from "@/lib/listing-status";
import { db } from "@/lib/server/db";
import {
  dodoConfig,
  dodoPrices,
  dodoProducts,
  planForProduct,
  type DodoEvent,
  type DodoPaymentEvent,
  type DodoRefundEvent,
  type DodoSubscriptionEvent,
} from "@/lib/server/dodo";
import type { OrderStatus } from "@/lib/server/lemonsqueezy";
import { lockSubmissionForSubscription, paidThrough, rollUp, type Submission, type WebhookOutcome } from "@/lib/server/submissions";
import { recordFunnelEvent } from "@/lib/server/tracking";

/**
 * Applies verified Dodo Payments webhooks to listings, as the Lemon Squeezy handlers do:
 * each in one transaction with its delivery id recorded (so retries apply once), orders
 * keyed by Dodo's payment id, and only the first payment deciding whether a listing is paid for.
 */

/** An event that can't be linked to its listing yet (a subscription announced before its payment): answer 500 so Dodo retries. */
export class RetryLater extends Error {}

async function firstDelivery(tx: postgres.TransactionSql, deliveryId: string, type: string): Promise<boolean> {
  const fresh = await tx`insert into webhook_events (id, event_name) values (${deliveryId}, ${type.slice(0, 60)})
    on conflict (id) do nothing returning id`;
  return fresh.length > 0;
}

export async function applyDodoEvent(ev: DodoEvent, deliveryId: string): Promise<WebhookOutcome> {
  const products = dodoProducts();
  if (ev.kind === "refund") return applyRefund(ev, deliveryId);
  const prices = await dodoPrices().catch(() => ({}));
  if (ev.kind === "payment") {
    const testMode = (await dodoConfig())?.environment !== "live_mode";
    return applyPayment(ev, deliveryId, products, prices, testMode);
  }
  return applySubscription(ev, deliveryId, products, prices);
}

/** The submission a payment belongs to: the checkout's metadata, then the checkout session, its subscription or an earlier delivery. */
async function lockForPayment(tx: postgres.TransactionSql, ev: DodoPaymentEvent): Promise<Submission | null> {
  if (ev.submissionId) {
    const [row] = await tx<Submission[]>`select * from submissions where id = ${ev.submissionId} for update`;
    if (row) return row;
  }
  if (ev.checkoutSessionId) {
    const [row] = await tx<Submission[]>`select * from submissions where checkout_id = ${ev.checkoutSessionId} for update`;
    if (row) return row;
  }
  if (ev.subscriptionId) {
    const [row] = await tx<Submission[]>`select * from submissions where subscription_id = ${ev.subscriptionId} for update`;
    if (row) return row;
  }
  const [row] = await tx<Submission[]>`select s.* from submissions s join orders o on o.submission_id = s.id
    where o.provider_order_id = ${ev.paymentId} for update of s`;
  return row ?? null;
}

async function applyPayment(
  ev: DodoPaymentEvent,
  deliveryId: string,
  products: Record<ListingPlanId, string | null>,
  prices: Partial<Record<ListingPlanId, number>>,
  testMode: boolean,
): Promise<WebhookOutcome> {
  return db().begin(async (tx) => {
    if (!(await firstDelivery(tx, deliveryId, ev.type))) return { result: "duplicate" } as const;
    const plan = planForProduct(products, ev.productId);
    const sub = await lockForPayment(tx, ev);
    if (!sub) return { result: "ignored", reason: plan ? "payment for no known submission" : "other product" } as const;
    if (ev.subscriptionId && sub.subscription_id && sub.subscription_id !== ev.subscriptionId) {
      return { result: "ignored", reason: "submission has another subscription" } as const;
    }

    const [prev] = await tx<{ provider_updated_at: Date | null; kind: "initial" | "renewal" }[]>`
      select provider_updated_at, kind from orders where provider_order_id = ${ev.paymentId} for update`;
    if (prev?.provider_updated_at && ev.at < prev.provider_updated_at) return { result: "stale" } as const;

    // The first payment that goes through is the listing's; later ones are renewals.
    const [{ n }] = await tx<{ n: number }[]>`select count(*)::int as n from orders where submission_id = ${sub.id} and kind = 'initial'
      and status in ('paid', 'refunded', 'partially_refunded') and provider_order_id <> ${ev.paymentId}`;
    const kind = prev?.kind ?? (n > 0 ? "renewal" : "initial");
    const planId = plan ?? sub.plan;

    await tx`
      insert into orders (submission_id, provider, provider_order_id, kind, variant_id, plan, status, currency, subtotal_cents, tax_cents,
        total_cents, refunded_cents, test_mode, provider_updated_at, paid_at)
      values (${sub.id}, 'dodo', ${ev.paymentId}, ${kind}, ${ev.productId ?? ""}, ${planId}, ${ev.status}, ${ev.currency},
        ${ev.subtotalCents}, ${ev.taxCents}, ${ev.totalCents}, 0, ${testMode}, ${ev.at},
        ${ev.status === "paid" ? (ev.createdAt ?? ev.at) : null})
      on conflict (provider_order_id) do update set
        status = excluded.status, subtotal_cents = excluded.subtotal_cents, tax_cents = excluded.tax_cents,
        total_cents = excluded.total_cents, provider_updated_at = excluded.provider_updated_at,
        paid_at = coalesce(orders.paid_at, excluded.paid_at), updated_at = now()`;

    if (kind === "renewal") return { result: "applied", submissionId: sub.id, paymentStatus: sub.payment_status } as const;

    const statuses = await tx<{ status: OrderStatus }[]>`select status from orders where submission_id = ${sub.id} and kind = 'initial'`;
    const paymentStatus = rollUp(statuses.map((r) => r.status));
    const becamePaid = isPaid(paymentStatus) && !isPaid(sub.payment_status) && !sub.paid_at;
    const price = ev.subtotalCents || planPriceCents(getPlan(planId, withPrices(prices))!);

    await tx`
      update submissions set
        payment_status = ${paymentStatus},
        paid_at = ${becamePaid ? new Date() : sub.paid_at},
        -- The paid plan is the truth, even if the visitor switched plans in another tab.
        plan = ${becamePaid ? planId : sub.plan},
        price_cents = ${becamePaid ? price : sub.price_cents},
        -- Payment queues the listing for review; it never approves or publishes it.
        review_status = ${becamePaid && sub.review_status === "draft" ? "pending_review" : sub.review_status},
        claim_token_expires_at = case when ${becamePaid} and claim_token_hash is not null
          then greatest(claim_token_expires_at, now() + interval '30 days') else claim_token_expires_at end,
        billing_provider = 'dodo',
        provider_customer_id = coalesce(${ev.customerId}, provider_customer_id),
        subscription_id = coalesce(subscription_id, ${ev.status === "paid" ? ev.subscriptionId : null}),
        updated_at = now()
      where id = ${sub.id}`;

    if (becamePaid) await recordFunnelEvent("payment_succeeded", { submissionId: sub.id }, tx);
    if (ev.status === "failed") await recordFunnelEvent("payment_failed", { submissionId: sub.id }, tx);
    return { result: "applied", submissionId: sub.id, paymentStatus } as const;
  });
}

async function applySubscription(
  ev: DodoSubscriptionEvent,
  deliveryId: string,
  products: Record<ListingPlanId, string | null>,
  prices: Partial<Record<ListingPlanId, number>>,
): Promise<WebhookOutcome> {
  return db().begin(async (tx) => {
    if (!(await firstDelivery(tx, deliveryId, ev.type))) return { result: "duplicate" } as const;
    const plan = planForProduct(products, ev.productId);
    const sub = await lockSubmissionForSubscription(tx, { subscriptionId: ev.subscriptionId, submissionId: ev.submissionId, orderId: ev.paymentId });
    if (!sub) {
      // Ours, but its payment hasn't arrived yet: rolls back, so Dodo's retry is applied once it has.
      if (plan) throw new RetryLater(`subscription ${ev.subscriptionId} isn't linked to a listing yet`);
      return { result: "ignored", reason: "other product" } as const;
    }
    if (sub.subscription_id && sub.subscription_id !== ev.subscriptionId) return { result: "ignored", reason: "submission has another subscription" } as const;
    if (sub.subscription_updated_at && ev.at < sub.subscription_updated_at) return { result: "stale" } as const;

    // Changing plan in the customer portal changes the product.
    const price = plan && plan !== sub.plan ? getPlan(plan, withPrices(prices))!.priceCents : sub.price_cents;
    const through = paidThrough(ev, sub.paid_through);

    await tx`
      update submissions set
        subscription_id = ${ev.subscriptionId},
        subscription_status = ${ev.status},
        subscription_renews_at = ${ev.renewsAt},
        subscription_ends_at = ${ev.endsAt},
        subscription_updated_at = ${ev.at},
        paid_through = ${through},
        plan = ${plan ?? sub.plan},
        price_cents = ${price},
        billing_provider = 'dodo',
        provider_customer_id = coalesce(${ev.customerId}, provider_customer_id),
        -- A listing that has been published stays live exactly as long as it's paid for.
        listing_ends_at = case when listing_starts_at is not null and ${through}::timestamptz is not null
          then greatest(${through}::timestamptz, listing_starts_at + interval '1 second') else listing_ends_at end,
        updated_at = now()
      where id = ${sub.id}`;
    return { result: "applied", submissionId: sub.id, paymentStatus: sub.payment_status } as const;
  });
}

/** A refund of a recorded payment; refunding the first one changes whether the listing is paid for. */
async function applyRefund(ev: DodoRefundEvent, deliveryId: string): Promise<WebhookOutcome> {
  return db().begin(async (tx) => {
    if (!(await firstDelivery(tx, deliveryId, ev.type))) return { result: "duplicate" } as const;
    const [order] = await tx<{ submission_id: string; kind: "initial" | "renewal"; total_cents: number; refunded_cents: number }[]>`
      select submission_id, kind, total_cents, refunded_cents from orders where provider_order_id = ${ev.paymentId} and provider = 'dodo' for update`;
    if (!order) return { result: "ignored", reason: "refund of an unknown payment" } as const;

    const refunded = Math.min(order.total_cents, order.refunded_cents + ev.amountCents);
    const status: OrderStatus = !ev.partial || refunded >= order.total_cents ? "refunded" : "partially_refunded";
    await tx`
      update orders set refunded_cents = ${refunded}, status = ${status}, refunded_at = ${ev.at},
        provider_updated_at = greatest(provider_updated_at, ${ev.at}::timestamptz), updated_at = now()
      where provider_order_id = ${ev.paymentId}`;

    const [sub] = await tx<Submission[]>`select * from submissions where id = ${order.submission_id} for update`;
    if (order.kind !== "initial" || !sub) return { result: "applied", submissionId: order.submission_id, paymentStatus: sub?.payment_status ?? "paid" } as const;
    const statuses = await tx<{ status: OrderStatus }[]>`select status from orders where submission_id = ${sub.id} and kind = 'initial'`;
    const paymentStatus = rollUp(statuses.map((r) => r.status));
    await tx`update submissions set payment_status = ${paymentStatus}, updated_at = now() where id = ${sub.id}`;
    return { result: "applied", submissionId: sub.id, paymentStatus } as const;
  });
}
