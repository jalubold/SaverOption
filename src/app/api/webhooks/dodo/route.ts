import { NextResponse, type NextRequest } from "next/server";
import { dbConfigured } from "@/lib/server/db";
import { dodoWebhookKey, parseDodoWebhook, verifyDodoWebhook } from "@/lib/server/dodo";
import { applyDodoEvent, RetryLater } from "@/lib/server/dodo-events";

/**
 * Dodo Payments webhook: payments (first payment, renewals, failures), subscription
 * changes and refunds. The Standard Webhooks signature is checked against the raw body
 * before anything is parsed. Payment and subscription status change only here — never
 * from the checkout redirect.
 */
export async function POST(request: NextRequest) {
  const secret = dbConfigured() ? dodoWebhookKey() : null;
  if (!secret) return NextResponse.json({ error: "not configured" }, { status: 503 });

  const raw = await request.text();
  if (raw.length > 1_000_000) return NextResponse.json({ error: "too large" }, { status: 413 });
  if (!verifyDodoWebhook(raw, request.headers, secret)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const event = parseDodoWebhook(body);
  if (!event) return NextResponse.json({ result: "ignored" });
  const label = `${event.type} ${event.kind === "payment" ? event.paymentId : event.kind === "subscription" ? event.subscriptionId : event.refundId}`;

  try {
    // Dodo's message id is the same on every retry of one event.
    const deliveryId = `dodo:${request.headers.get("webhook-id")}`.slice(0, 200);
    const outcome = await applyDodoEvent(event, deliveryId);
    if (outcome.result === "ignored") console.warn(`[dodo-webhook] ignored ${label}: ${outcome.reason}`);
    return NextResponse.json({ result: outcome.result });
  } catch (err) {
    // 500 makes Dodo retry; the delivery id wasn't stored because the transaction rolled back.
    if (err instanceof RetryLater) console.warn(`[dodo-webhook] retry later ${label}: ${err.message}`);
    else console.error(`[dodo-webhook] failed ${label}:`, err instanceof Error ? err.message : err);
    return NextResponse.json({ error: err instanceof RetryLater ? "not ready" : "processing failed" }, { status: 500 });
  }
}
