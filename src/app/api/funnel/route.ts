import { NextResponse, type NextRequest } from "next/server";
import { dbConfigured } from "@/lib/server/db";
import { ensureFunnelSession } from "@/lib/server/funnel-session";
import { CLIENT_FUNNEL_EVENTS, recordFunnelEvent, type FunnelEvent } from "@/lib/server/tracking";

/** Records a browser-side funnel step (page view, form start, details submitted, plan selected, signup started). */
export async function POST(request: NextRequest) {
  if (!dbConfigured()) return new NextResponse(null, { status: 204 });
  const body = (await request.json().catch(() => null)) as { name?: string } | null;
  const name = body?.name as FunnelEvent | undefined;
  if (!name || !CLIENT_FUNNEL_EVENTS.has(name)) return NextResponse.json({ error: "unknown event" }, { status: 400 });
  try {
    await recordFunnelEvent(name, { sessionId: await ensureFunnelSession() });
  } catch (err) {
    console.error("[funnel]", err instanceof Error ? err.message : err);
  }
  return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
