import { NextResponse, type NextRequest } from "next/server";
import { dbConfigured } from "@/lib/server/db";
import { recordListingEvent } from "@/lib/server/tracking";
import { requestVisitor } from "@/lib/server/visitor";
import { isLikelyBot } from "@/lib/visitors";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Listing page view beacon. Only counts live listings, once per visitor per day, from our own pages. */
export async function POST(request: NextRequest) {
  const done = new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  const site = request.headers.get("sec-fetch-site");
  if (!dbConfigured() || (site && site !== "same-origin")) return done;
  const visitor = requestVisitor(request);
  if (isLikelyBot(visitor.userAgent)) return done;
  const body = (await request.json().catch(() => null)) as { id?: string } | null;
  if (!body?.id || !UUID.test(body.id)) return done;
  try {
    await recordListingEvent(body.id.toLowerCase(), "view", visitor);
  } catch (err) {
    console.error("[listing view]", err instanceof Error ? err.message : err);
  }
  return done;
}
