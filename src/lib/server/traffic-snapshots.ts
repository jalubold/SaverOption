import { createHash } from "node:crypto";
import { db, dbConfigured } from "@/lib/server/db";
import type { StatsQuery, TrafficStats } from "@/lib/web-analytics";

/**
 * The last good /stats numbers per range and filter set, kept so the page can
 * show them (with the time they were fetched) when Vercel's Web Analytics API
 * is rate limiting or down, instead of an empty error. Combinations nobody
 * opens for 30 days are dropped.
 */

// Each instance writes a given snapshot at most this often; reads are cheap.
const SAVE_EVERY_MS = 10 * 60_000;
const savedAt = new Map<string, number>();

function keyOf(q: StatsQuery): string {
  const filters = Object.entries(q.filters).sort(([a], [b]) => a.localeCompare(b));
  return createHash("sha256").update(JSON.stringify([q.range, filters])).digest("hex");
}

export async function saveTrafficSnapshot(q: StatsQuery, stats: TrafficStats): Promise<void> {
  if (!dbConfigured()) return;
  const key = keyOf(q);
  if (Date.now() - (savedAt.get(key) ?? 0) < SAVE_EVERY_MS) return;
  savedAt.set(key, Date.now());
  try {
    const sql = db();
    await sql`insert into public.traffic_stats_snapshots (query_key, stats, fetched_at)
      values (${key}, ${sql.json(stats as never)}, ${stats.fetchedAt})
      on conflict (query_key) do update set stats = excluded.stats, fetched_at = excluded.fetched_at
      where traffic_stats_snapshots.fetched_at < excluded.fetched_at`;
    await sql`delete from public.traffic_stats_snapshots where fetched_at < now() - interval '30 days'`;
  } catch (err) {
    console.error("[traffic-stats] couldn't save the snapshot:", err instanceof Error ? err.message : err);
  }
}

export async function loadTrafficSnapshot(q: StatsQuery): Promise<TrafficStats | null> {
  if (!dbConfigured()) return null;
  try {
    const [row] = await db()<{ stats: TrafficStats }[]>`select stats from public.traffic_stats_snapshots where query_key = ${keyOf(q)}`;
    return row?.stats ?? null;
  } catch (err) {
    console.error("[traffic-stats] couldn't read the snapshot:", err instanceof Error ? err.message : err);
    return null;
  }
}
