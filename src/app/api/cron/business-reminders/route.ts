import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { dbConfigured } from "@/lib/server/db";
import { syncAllReminders } from "@/lib/server/business/reminders";

/**
 * Daily renewal-reminder run for every workspace (scheduled in vercel.json).
 * Vercel Cron sends "Authorization: Bearer <CRON_SECRET>" when CRON_SECRET is
 * set; without it the route refuses to run. Reminders are deduplicated in the
 * database, so a repeated run never creates a reminder twice.
 */
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

function authorized(header: string | null, secret: string): boolean {
  const expected = Buffer.from(`Bearer ${secret}`);
  const given = Buffer.from(header ?? "");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "CRON_SECRET is not configured" }, { status: 503, headers: noStore });
  if (!authorized(request.headers.get("authorization"), secret)) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
  if (!dbConfigured()) return NextResponse.json({ error: "Database is not configured" }, { status: 503, headers: noStore });
  try {
    const result = await syncAllReminders();
    return NextResponse.json({ ok: true, ...result }, { headers: noStore });
  } catch (err) {
    console.error("[business] reminder cron failed:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Reminder run failed" }, { status: 500, headers: noStore });
  }
}
