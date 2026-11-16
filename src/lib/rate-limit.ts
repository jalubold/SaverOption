import { createHash } from "node:crypto";
import { redisPipeline } from "./redis.ts";

/**
 * Fixed-window request limits, counted in Upstash Redis (the same store as the visitor and click
 * counts) so every server instance shares them. One INCR per request; the counter expires with its
 * window.
 *
 * Without Redis, or when Redis can't be reached, each server instance counts in memory instead, so
 * the limits still hold (per instance) rather than switching off.
 */
export async function overLimit(key: string, limit: number, windowSeconds: number, now = Date.now()): Promise<boolean> {
  const window = Math.floor(now / 1000 / windowSeconds);
  const counter = `rl:${key}:${window}`;
  const result = await redisPipeline([
    ["INCR", counter],
    ["EXPIRE", counter, windowSeconds * 2],
  ]);
  const count = Number(result?.[0]);
  return (Number.isFinite(count) ? count : countInMemory(counter, window)) > limit;
}

const memory = new Map<string, { window: number; count: number }>();

function countInMemory(counter: string, window: number): number {
  // Forget finished windows now and then, so the map stays small.
  if (memory.size > 5_000) for (const [k, v] of memory) if (v.window < window) memory.delete(k);
  const entry = memory.get(counter) ?? { window, count: 0 };
  entry.count += 1;
  memory.set(counter, entry);
  return entry.count;
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
