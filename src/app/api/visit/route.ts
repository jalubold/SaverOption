import { NextResponse, type NextRequest } from "next/server";
import { redisConfigured } from "@/lib/redis";
import { isLikelyBot, recordVisit } from "@/lib/visitors";

/** Receives the page-view beacon. Stores nothing when Redis isn't configured. */
export async function POST(request: NextRequest) {
  const userAgent = request.headers.get("user-agent");
  if (redisConfigured() && !isLikelyBot(userAgent)) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
    await recordVisit({ ip, userAgent: userAgent ?? "" });
  }
  return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
