import { createHash } from "node:crypto";
import { redisPipeline } from "./redis.ts";

/**
 * Fixed-window request limits kept in Upstash Redis (the same store as the visitor and click
 * counts). One INCR per request; the counter expires with its window.
 *
 * Fails open: without Redis, or when Redis can't be reached, nothing is limited, so an outage
 * never locks people out.
 */
export async function overLimit(key: string, limit: number, windowSeconds: number, now = Date.now()): Promise<boolean> {
  const window = Math.floor(now / 1000 / windowSeconds);
  const counter = `rl:${key}:${window}`;
  const result = await redisPipeline([
    ["INCR", counter],
    ["EXPIRE", counter, windowSeconds * 2],
  ]);
  const count = Number(result?.[0]);
  return Number.isFinite(count) && count > limit;
}

/**
 * A short one-way hash of the visitor's IP for use in a counter key, so no IP address is stored
 * (in line with the privacy policy). The salt is the visitor-count salt.
 */
export function clientKey(forwardedFor: string | null, realIp: string | null): string {
  const ip = forwardedFor?.split(",")[0]?.trim() || realIp?.trim() || "unknown";
  const salt = process.env.VISITOR_SALT || "saver-option";
  return createHash("sha256").update(`${salt}:rl:${ip}`).digest("hex").slice(0, 16);
}
