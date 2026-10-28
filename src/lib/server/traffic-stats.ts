import { createHash } from "node:crypto";
import { db, dbConfigured } from "@/lib/server/db";
import {
  cooldownUntil,
  fetchBreakdown,
  fetchSeries,
  fetchSummary,
  noteCooldown,
  PAGE_DIMENSIONS,
  trafficStatsConfigured,
  WebAnalyticsError,
  type Dimension,
  type Endpoint,
  type Row,
  type StatsQuery,
  type TrafficStats,
} from "@/lib/web-analytics";

/**
 * /stats data with a shared cache in front of Vercel's Web Analytics API.
 *
 * Every server instance reads the same database rows, so each view (range +
 * filters) calls the API at most once per 30 minutes (15 for Today), however
 * many people or crawlers open it. A rate limit is shared too: once one
 * instance gets a 429, the others wait for the same reset time. While the API
 * is unavailable a view shows its last saved numbers, or at least its totals
 * when only the chart's endpoint is limited — never an empty page if anything
 * can be shown. Views nobody opens for 30 days are dropped.
 */

export type StatsViewResult =
  | { kind: "fresh"; stats: TrafficStats }
  /** stale: the last saved numbers; partial: current totals without chart and breakdowns. */
  | { kind: "stale" | "partial"; stats: TrafficStats; reason: string; retryAt: string | null }
  | { kind: "unavailable"; reason: string; retryAt: string | null };

export type BreakdownResult = { ok: true; rows: Row[] } | { ok: false; reason: string; retryAt: string | null };

const freshFor = (q: StatsQuery) => (q.range === "today" ? 15 : 30) * 60_000;

function keyOf(q: StatsQuery, dim?: Dimension): string {
  const filters = Object.entries(q.filters).sort(([a], [b]) => a.localeCompare(b));
  return createHash("sha256")
    .update(JSON.stringify(dim ? [q.range, filters, dim] : [q.range, filters]))
    .digest("hex");
}

async function load<T>(key: string): Promise<{ payload: T; age: number } | null> {
  if (!dbConfigured()) return null;
  try {
    const [row] = await db()<{ stats: T; fetched_at: Date }[]>`select stats, fetched_at from public.traffic_stats_snapshots where query_key = ${key}`;
    return row ? { payload: row.stats, age: Date.now() - new Date(row.fetched_at).getTime() } : null;
  } catch (err) {
    console.error("[traffic-stats] couldn't read the cache:", err instanceof Error ? err.message : err);
    return null;
  }
}

async function save(key: string, payload: unknown, fetchedAt: string): Promise<void> {
  if (!dbConfigured()) return;
  try {
    const sql = db();
    await sql`insert into public.traffic_stats_snapshots (query_key, stats, fetched_at)
      values (${key}, ${sql.json(payload as never)}, ${fetchedAt})
      on conflict (query_key) do update set stats = excluded.stats, fetched_at = excluded.fetched_at
      where traffic_stats_snapshots.fetched_at < excluded.fetched_at`;
    await sql`delete from public.traffic_stats_snapshots where fetched_at < now() - interval '30 days'`;
  } catch (err) {
    console.error("[traffic-stats] couldn't save the cache:", err instanceof Error ? err.message : err);
  }
}

// Rate-limit reset times, shared through app_settings so every instance waits for them.
const COOLDOWN_KEY: Record<Endpoint, string> = { count: "traffic_stats_cooldown_count", aggregate: "traffic_stats_cooldown_aggregate" };
const shared: Record<Endpoint, number> = { count: 0, aggregate: 0 };

async function syncCooldowns(): Promise<void> {
  if (!dbConfigured()) return;
  try {
    const rows = await db()<{ key: string; value: string }[]>`select key, value from public.app_settings where key in (${COOLDOWN_KEY.count}, ${COOLDOWN_KEY.aggregate})`;
    for (const r of rows) {
      const endpoint = r.key === COOLDOWN_KEY.count ? "count" : "aggregate";
      const until = Date.parse(r.value);
      if (Number.isFinite(until)) {
        noteCooldown(endpoint, until);
        shared[endpoint] = Math.max(shared[endpoint], until);
      }
    }
  } catch (err) {
    console.error("[traffic-stats] couldn't read the rate-limit state:", err instanceof Error ? err.message : err);
  }
}

async function shareCooldown(endpoint: Endpoint, until: number): Promise<void> {
  if (!dbConfigured() || until <= shared[endpoint]) return;
  shared[endpoint] = until;
  try {
    const value = new Date(until).toISOString();
    await db()`insert into public.app_settings (key, value) values (${COOLDOWN_KEY[endpoint]}, ${value})
      on conflict (key) do update set value = excluded.value, updated_at = now()`;
  } catch (err) {
    console.error("[traffic-stats] couldn't save the rate-limit state:", err instanceof Error ? err.message : err);
  }
}

async function failure(err: unknown): Promise<{ reason: string; retryAt: string | null }> {
  if (err instanceof WebAnalyticsError) {
    if (err.status === 429 && err.retryAt) await shareCooldown(err.endpoint, err.retryAt);
    else console.error("[traffic-stats]", err.message);
    return { reason: err.reason, retryAt: err.retryAt ? new Date(err.retryAt).toISOString() : null };
  }
  console.error("[traffic-stats]", err instanceof Error ? err.message : err);
  return { reason: err instanceof TypeError ? "network error" : "unexpected error", retryAt: null };
}

function waiting(): { reason: string; retryAt: string } | null {
  const endpoint = cooldownUntil("aggregate") ? "aggregate" : cooldownUntil("count") ? "count" : null;
  return endpoint ? { reason: `${endpoint} 429 rate_limited`, retryAt: new Date(cooldownUntil(endpoint)).toISOString() } : null;
}

/** Everything the /stats page shows for one view, except the tabs that load on demand. */
export async function getStatsView(q: StatsQuery): Promise<StatsViewResult> {
  if (!trafficStatsConfigured()) return { kind: "unavailable", reason: "not configured", retryAt: null };
  const key = keyOf(q);
  const [saved] = await Promise.all([load<TrafficStats>(key), syncCooldowns()]);
  if (saved && saved.age < freshFor(q)) return { kind: "fresh", stats: saved.payload };
  // Rate limited and something saved: show it without spending a call.
  const wait = waiting();
  if (saved && wait) return { kind: "stale", stats: saved.payload, ...wait };

  let summary: Awaited<ReturnType<typeof fetchSummary>> | null = null;
  try {
    summary = await fetchSummary(q);
    // A breakdown that fails for another reason shows as empty; a rate limit fails the whole view.
    const rows = (dim: Dimension) =>
      fetchBreakdown(q, dim).catch((err) => {
        if (err instanceof WebAnalyticsError && err.status === 429) throw err;
        console.error("[traffic-stats]", err instanceof Error ? err.message : err);
        return [] as Row[];
      });
    const [series, ...lists] = await Promise.all([fetchSeries(q), ...PAGE_DIMENSIONS.map(rows)]);
    const stats: TrafficStats = { ...summary, series, breakdowns: Object.fromEntries(PAGE_DIMENSIONS.map((d, i) => [d, lists[i]])) };
    await save(key, stats, stats.fetchedAt);
    return { kind: "fresh", stats };
  } catch (err) {
    const why = await failure(err);
    if (saved) return { kind: "stale", stats: saved.payload, ...why };
    if (summary) return { kind: "partial", stats: { ...summary, series: null, breakdowns: {} }, ...why };
    return { kind: "unavailable", ...why };
  }
}

/** One of the breakdowns that load when their tab is opened, with the same cache and fallbacks. */
export async function getLazyBreakdown(q: StatsQuery, dim: Dimension): Promise<BreakdownResult> {
  if (!trafficStatsConfigured()) return { ok: false, reason: "not configured", retryAt: null };
  const key = keyOf(q, dim);
  const [saved] = await Promise.all([load<{ rows: Row[]; fetchedAt: string }>(key), syncCooldowns()]);
  if (saved && (saved.age < freshFor(q) || cooldownUntil("aggregate"))) return { ok: true, rows: saved.payload.rows };
  try {
    const fetchedAt = new Date().toISOString();
    const rows = await fetchBreakdown(q, dim);
    await save(key, { rows, fetchedAt }, fetchedAt);
    return { ok: true, rows };
  } catch (err) {
    const why = await failure(err);
    return saved ? { ok: true, rows: saved.payload.rows } : { ok: false, ...why };
  }
}
