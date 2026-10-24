import { NextResponse, type NextRequest } from "next/server";
import { dbConfigured } from "@/lib/server/db";
import { applyCreemEvent } from "@/lib/server/business/billing";
import { creemWebhookSecret, parseCreemEvent, verifyCreemSignature } from "@/lib/server/business/creem";

/**
 * Creem webhook for Saver Option Business plans (register
 * https://<site>/api/webhooks/creem in Creem → Developers → Webhooks). The
 * signature is checked against the raw body before anything is parsed; each
 * event id is applied once (a retry or replay is acknowledged but not applied
 * again). Plan access changes only here and from server-side Creem API reads —
 * never from the checkout redirect.
 */
export async function POST(request: NextRequest) {
  const secret = creemWebhookSecret();
  if (!secret || !dbConfigured()) return NextResponse.json({ error: "not configured" }, { status: 503 });

  const raw = await request.text();
  if (raw.length > 1_000_000) return NextResponse.json({ error: "too large" }, { status: 413 });
  if (!verifyCreemSignature(raw, request.headers, secret)) {
    console.warn("[creem-webhook] rejected a delivery with a missing or invalid signature");
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const event = parseCreemEvent(raw);
  if (!event) return NextResponse.json({ error: "invalid event" }, { status: 400 });

  try {
    const outcome = await applyCreemEvent(event);
    console.info(JSON.stringify({ creem: "webhook", event: event.type, id: event.id.slice(0, 24), result: outcome.result, note: outcome.note }));
    return NextResponse.json({ result: outcome.result });
  } catch (err) {
    // 500 makes Creem retry; the event id wasn't stored because the transaction rolled back.
    console.error(`[creem-webhook] failed ${event.type} ${event.id}:`, err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }
}
