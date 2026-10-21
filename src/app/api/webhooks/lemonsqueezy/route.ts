import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { dbConfigured } from "@/lib/server/db";
import { lsCatalog, parseOrderWebhook, verifyWebhookSignature, webhookSecret } from "@/lib/server/lemonsqueezy";
import { applyOrderEvent } from "@/lib/server/submissions";

/**
 * Lemon Squeezy webhook (subscribe to order_created and order_refunded).
 * The signature is checked against the raw body before anything is parsed.
 * Payment status changes only here — never from the checkout redirect.
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
  const event = parseOrderWebhook(body, request.headers.get("x-event-name"));
  if (!event) return NextResponse.json({ result: "ignored" });

  try {
    const outcome = await applyOrderEvent(event, createHash("sha256").update(raw).digest("hex"), await lsCatalog());
    if (outcome.result === "ignored") console.warn(`[ls-webhook] ignored ${event.eventName} order ${event.orderId}: ${outcome.reason}`);
    return NextResponse.json({ result: outcome.result });
  } catch (err) {
    // 500 makes Lemon Squeezy retry; the delivery id wasn't stored because the transaction rolled back.
    console.error(`[ls-webhook] failed ${event.eventName} order ${event.orderId}:`, err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }
}
