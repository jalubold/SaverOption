/**
 * Minimal Upstash Redis REST client — no dependency, works on serverless.
 * Reads the env names set by Upstash directly or by Vercel's Upstash
 * Marketplace integration. Returns null when not configured, so callers
 * can hide features that need it.
 */

type Command = (string | number)[];

function config() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

export function redisConfigured(): boolean {
  return config() !== null;
}

/**
 * Write path: runs commands in one uncached round trip. Resolves null when
 * Redis isn't configured or the call fails.
 */
export async function redisPipeline(commands: Command[]): Promise<unknown[] | null> {
  const cfg = config();
  if (!cfg || commands.length === 0) return null;
  try {
    const res = await fetch(`${cfg.url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as { result?: unknown; error?: string }[];
    return rows.map((r) => (r.error ? null : r.result));
  } catch {
    return null;
  }
}

/**
 * Read path: a GET request that Next.js can cache for `revalidate` seconds,
 * so statically generated pages stay static.
 */
export async function redisRead(command: Command, revalidate = 300): Promise<unknown | null> {
  const cfg = config();
  if (!cfg) return null;
  try {
    const path = command.map((part) => encodeURIComponent(String(part))).join("/");
    const res = await fetch(`${cfg.url}/${path}`, {
      headers: { Authorization: `Bearer ${cfg.token}` },
      next: { revalidate },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { result?: unknown; error?: string };
    return body.error ? null : (body.result ?? null);
  } catch {
    return null;
  }
}

/** "2026-10-17" in UTC — the bucket key for daily counters. */
export function dayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}
