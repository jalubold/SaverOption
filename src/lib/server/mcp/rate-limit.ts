import { redisConfigured, redisPipeline } from "@/lib/redis";

/**
 * Fixed-window rate limits for the MCP and OAuth endpoints. Uses Upstash Redis
 * when it's configured (shared across serverless instances); otherwise a
 * per-instance in-memory window, which still stops a runaway client on one
 * instance.
 */

const memory = new Map<string, { count: number; resetAt: number }>();

export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<{ ok: boolean; retryAfter: number }> {
  const now = Date.now();
  const bucket = Math.floor(now / (windowSeconds * 1000));
  const retryAfter = Math.max(1, Math.ceil(((bucket + 1) * windowSeconds * 1000 - now) / 1000));
  if (redisConfigured()) {
    const k = `rl:${key}:${bucket}`;
    const res = await redisPipeline([
      ["INCR", k],
      ["EXPIRE", k, windowSeconds + 5],
    ]);
    const count = Number(res?.[0]);
    if (Number.isFinite(count)) return { ok: count <= limit, retryAfter };
  }
  const k = `${key}:${bucket}`;
  const entry = memory.get(k) ?? { count: 0, resetAt: (bucket + 1) * windowSeconds * 1000 };
  entry.count++;
  memory.set(k, entry);
  if (memory.size > 5000) for (const [mk, v] of memory) if (v.resetAt < now) memory.delete(mk);
  return { ok: entry.count <= limit, retryAfter };
}

/** The client IP as seen by Vercel's proxy (first X-Forwarded-For entry), for per-IP limits. */
export function clientIp(headers: Headers): string {
  return (headers.get("x-forwarded-for") ?? "").split(",")[0]!.trim() || headers.get("x-real-ip") || "unknown";
}
