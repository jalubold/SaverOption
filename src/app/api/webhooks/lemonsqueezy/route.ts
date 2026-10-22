import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { dbConfigured } from "@/lib/server/db";
import {
  lsCatalog,
  parseInvoiceWebhook,
  parseOrderWebhook,
  parseSubscriptionWebhook,
  verifyWebhookSignature,
  webhookSecret,
} from "@/lib/server/lemonsqueezy";
import { applyInvoiceEvent, applyOrderEvent, applySubscriptionEvent } from "@/lib/server/submissions";

/**
 * Lemon Squeezy webhook: orders (first payment, refunds), subscription changes
 * and renewal payments (the admin Connect button subscribes to all of them).
 * The signature is checked against the raw body before anything is parsed.
 * Payment and subscription status change only here — never from the checkout redirect.
 */
export async function POST(request: NextRequest) {
  const secret = dbConfigured() ? await webhookSecret() : null;
  if (!secret) return NextResponse.json({ error: "not configured" }, { status: 503 });

  const raw = await request.text();
  if (raw.length > 1_000_000) return NextResponse.json({ error: "too large" }, { status: 413 });
  if (!verifyWebhookSignature(raw, request.headers.get("x-signature"), secret)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const name = request.headers.get("x-event-name");
  const order = parseOrderWebhook(body, name);
  const subscription = order ? null : parseSubscriptionWebhook(body, name);
  const invoice = order || subscription ? null : parseInvoiceWebhook(body, name);
  const event = order ?? subscription ?? invoice;
  if (!event) return NextResponse.json({ result: "ignored" });
  const label = `${event.eventName} ${order ? `order ${order.orderId}` : subscription ? `subscription ${subscription.subscriptionId}` : `invoice ${invoice!.invoiceId}`}`;

  try {
    const deliveryId = createHash("sha256").update(raw).digest("hex");
    const catalog = await lsCatalog();
    const outcome = order
      ? await applyOrderEvent(order, deliveryId, catalog)
      : subscription
        ? await applySubscriptionEvent(subscription, deliveryId, catalog)
        : await applyInvoiceEvent(invoice!, deliveryId, catalog);
    if (outcome.result === "ignored") console.warn(`[ls-webhook] ignored ${label}: ${outcome.reason}`);
    return NextResponse.json({ result: outcome.result });
  } catch (err) {
    // 500 makes Lemon Squeezy retry; the delivery id wasn't stored because the transaction rolled back.
    console.error(`[ls-webhook] failed ${label}:`, err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }
}
