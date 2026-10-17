/**
 * Engagement data for "Popular" rankings and "deals opened today".
 *
 * Popularity comes only from measured outbound clicks recorded by
 * /go/[slug], stored per day in Redis. Without Redis this returns no data
 * and the homepage hides the Popular section rather than inventing numbers.
 */
import { dayKey, redisPipeline, redisRead } from "@/lib/redis";

export interface EngagementRecord {
  offerId: string;
  /** Outbound clicks in the reporting window. */
  clicks: number;
}

/** Minimum number of ranked offers before a "Popular" section is worth showing. */
export const MIN_POPULAR_OFFERS = 3;

const KEEP_DAYS = 40;

function lastDays(n: number): string[] {
  const now = Date.now();
  return Array.from({ length: n }, (_, i) => dayKey(new Date(now - i * 86400_000)));
}

export async function getTopOffersByEngagement(windowDays = 30): Promise<EngagementRecord[]> {
  const keys = lastDays(windowDays).map((d) => `clicks:offers:${d}`);
  const rows = await redisRead(["ZUNION", keys.length, ...keys, "WITHSCORES"], 600);
  if (!Array.isArray(rows)) return [];
  const out: EngagementRecord[] = [];
  for (let i = 0; i < rows.length; i += 2) {
    out.push({ offerId: String(rows[i]), clicks: Number(rows[i + 1]) });
  }
  return out.filter((r) => r.clicks > 0).sort((a, b) => b.clicks - a.clicks);
}

/** Total outbound clicks today (UTC), or null when not configured. */
export async function getClicksToday(): Promise<number | null> {
  const n = await redisRead(["GET", `clicks:total:${dayKey()}`], 60);
  if (n === null) return null;
  return Number(n) || 0;
}

/**
 * Called by the outbound redirect for every click. Stores only counts per
 * offer and day — nothing about the person who clicked.
 */
export async function recordOutboundClick(event: {
  offerId: string;
  destination: "affiliate" | "official";
  referrer?: string | null;
}): Promise<void> {
  const day = dayKey();
  const perOffer = `clicks:offers:${day}`;
  const total = `clicks:total:${day}`;
  await redisPipeline([
    ["ZINCRBY", perOffer, 1, event.offerId],
    ["EXPIRE", perOffer, KEEP_DAYS * 86400],
    ["INCR", total],
    ["EXPIRE", total, KEEP_DAYS * 86400],
  ]);
}
