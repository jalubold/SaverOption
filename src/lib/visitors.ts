import { createHash } from "node:crypto";
import { dayKey, redisPipeline, redisRead } from "@/lib/redis";

/**
 * Cookie-free unique visitor counting.
 *
 * Each visit is reduced to a one-way hash of (daily salt, IP, user agent)
 * and added to a HyperLogLog for that day. The raw IP and user agent are
 * never stored, the hash changes every day, and a HyperLogLog can't be read
 * back into individual visitors — it only answers "how many".
 */

const KEEP_DAYS = 40;
const BOT_RE = /bot|crawl|spider|slurp|preview|headless|lighthouse|monitor|curl|wget|python|httpclient/i;

/** Below this many visitors the count isn't shown (a tiny number reads as "empty"). */
export function visitorDisplayThreshold(): number {
  const n = Number(process.env.VISITORS_MIN_TO_SHOW);
  return Number.isFinite(n) && n >= 0 ? n : 50;
}

export function isLikelyBot(userAgent: string | null): boolean {
  return !userAgent || BOT_RE.test(userAgent);
}

export async function recordVisit({ ip, userAgent }: { ip: string; userAgent: string }): Promise<void> {
  const day = dayKey();
  const salt = process.env.VISITOR_SALT || "saver-option";
  const id = createHash("sha256").update(`${salt}:${day}:${ip}:${userAgent}`).digest("hex").slice(0, 32);
  const key = `visitors:${day}`;
  await redisPipeline([
    ["PFADD", key, id],
    ["EXPIRE", key, KEEP_DAYS * 86400],
  ]);
}

/** Unique visitors today (UTC), or null when counting isn't configured. */
export async function getVisitorsToday(): Promise<number | null> {
  const count = await redisRead(["PFCOUNT", `visitors:${dayKey()}`], 60);
  return typeof count === "number" ? count : null;
}
