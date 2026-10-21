/**
 * Public traffic stats from Vercel Web Analytics (REST API).
 *
 * Server-only: import this from server components only, so VERCEL_ANALYTICS_TOKEN
 * (no NEXT_PUBLIC_ prefix) never reaches the browser. Responses are cached, so the
 * API is called at most a few times per hour per filter combination no matter how
 * many people open /stats. Only aggregate counts are read and shown.
 */

/** First day with Web Analytics data for this site. */
export const ANALYTICS_SINCE = "2026-10-19";

// ─── Query model (shared with the page; URL-safe) ───────────────────────────

export const RANGES = {
  "24h": { label: "Last 24 hours", short: "24h", days: 1 },
  "7d": { label: "Last 7 days", short: "7d", days: 7 },
  "30d": { label: "Last 30 days", short: "30d", days: 30 },
  all: { label: "All time", short: "All", days: Infinity },
} as const;
export type RangeKey = keyof typeof RANGES;
export const DEFAULT_RANGE: RangeKey = "7d";

/** Dimensions a visitor can filter by, with their label and query-string key. */
export const DIMENSIONS = {
  requestPath: { label: "Page", param: "page" },
  referrerHostname: { label: "Referrer", param: "referrer" },
  utmSource: { label: "UTM source", param: "utm" },
  country: { label: "Country", param: "country" },
  deviceType: { label: "Device", param: "device" },
  browserName: { label: "Browser", param: "browser" },
  osName: { label: "OS", param: "os" },
} as const;
export type Dimension = keyof typeof DIMENSIONS;

export type StatsFilters = Partial<Record<Dimension, string>>;

export interface StatsQuery {
  range: RangeKey;
  filters: StatsFilters;
}

type SearchParams = Record<string, string | string[] | undefined>;

/** Reads range and filters from the URL, ignoring anything unexpected. */
export function parseStatsQuery(sp: SearchParams): StatsQuery {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const rangeRaw = one(sp.range);
  const range = rangeRaw && rangeRaw in RANGES ? (rangeRaw as RangeKey) : DEFAULT_RANGE;
  const filters: StatsFilters = {};
  for (const [dim, { param }] of Object.entries(DIMENSIONS) as [Dimension, { param: string }][]) {
    const v = one(sp[param]);
    // Empty is a real value for referrers (direct visits), so only skip a missing param.
    if (v !== undefined && v.length <= 200) filters[dim] = v;
  }
  return { range, filters };
}

/** Builds a /stats URL for a query; pass overrides to change range or add/remove a filter. */
export function statsHref(q: StatsQuery, change: { range?: RangeKey; set?: [Dimension, string]; unset?: Dimension | "all" } = {}): string {
  const range = change.range ?? q.range;
  const filters: StatsFilters = change.unset === "all" ? {} : { ...q.filters };
  if (change.unset && change.unset !== "all") delete filters[change.unset];
  if (change.set) filters[change.set[0]] = change.set[1];
  const sp = new URLSearchParams();
  if (range !== DEFAULT_RANGE) sp.set("range", range);
  for (const [dim, value] of Object.entries(filters) as [Dimension, string][]) sp.set(DIMENSIONS[dim].param, value);
  const qs = sp.toString();
  return qs ? `/stats?${qs}` : "/stats";
}

// ─── Results ────────────────────────────────────────────────────────────────

export interface Point {
  /** Bucket start, ISO timestamp. */
  t: string;
  visitors: number;
  pageviews: number;
}

export interface Row {
  /** Raw dimension value, used for filtering. */
  value: string;
  label: string;
  visitors: number;
  pageviews: number;
  /** The API's folded long tail; not filterable. */
  other?: boolean;
}

export interface Totals {
  visitors: number;
  pageviews: number;
}

export interface TrafficStats {
  since: string;
  until: string;
  granularity: "hour" | "day";
  totals: Totals;
  /** Same-length period just before this one, when it falls after ANALYTICS_SINCE. */
  previous: Totals | null;
  series: Point[];
  breakdowns: Record<Dimension, Row[]>;
  fetchedAt: string;
}

interface ApiRow {
  timestamp?: string;
  visitors?: number;
  pageviews?: number;
  [dimension: string]: unknown;
}

function settings() {
  // Trim: a token pasted with a trailing newline would make the Authorization header invalid.
  const token = process.env.VERCEL_ANALYTICS_TOKEN?.trim();
  if (!token) return null;
  return {
    token,
    // Project and team IDs aren't secrets; they identify which Web Analytics data to read.
    projectId: process.env.VERCEL_ANALYTICS_PROJECT_ID || "prj_zxMMLKgNfLsnpNTmpNhhniRpRoqb",
    teamId: process.env.VERCEL_ANALYTICS_TEAM_ID || "team_d9Zh4wWR5w7IWppQlxs9bIyy",
    // Overridable for local testing against a mock.
    base: (process.env.VERCEL_ANALYTICS_API_URL || "https://api.vercel.com").replace(/\/$/, ""),
  };
}

export function trafficStatsConfigured(): boolean {
  return settings() !== null;
}

export class WebAnalyticsError extends Error {
  constructor(
    readonly endpoint: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(`Web Analytics ${endpoint} ${status}${code ? ` (${code})` : ""}`);
  }
}

// Personal tokens scoped to the account can reject an explicit teamId; remember what worked.
let sendTeamId = true;

async function query<T>(path: "count" | "aggregate", params: Record<string, string | number | undefined>, revalidate: number): Promise<T> {
  const s = settings();
  if (!s) throw new Error("VERCEL_ANALYTICS_TOKEN is not set");
  const attempt = async (withTeam: boolean) => {
    const url = new URL(`${s.base}/v1/query/web-analytics/visits/${path}`);
    url.searchParams.set("projectId", s.projectId);
    if (withTeam) url.searchParams.set("teamId", s.teamId);
    for (const [k, v] of Object.entries(params)) if (v !== undefined) url.searchParams.set(k, String(v));
    return fetch(url, {
      headers: { Authorization: `Bearer ${s.token}` },
      next: { revalidate, tags: ["traffic-stats"] },
    });
  };
  let res = await attempt(sendTeamId);
  if ((res.status === 403 || res.status === 404) && sendTeamId) {
    const retry = await attempt(false);
    if (retry.ok) sendTeamId = false;
    res = retry.ok ? retry : res;
  }
  if (!res.ok) {
    // Error bodies carry a short code (e.g. "forbidden"); never the token.
    const body = (await res.json().catch(() => null)) as { error?: { code?: string } } | null;
    throw new WebAnalyticsError(path, res.status, body?.error?.code);
  }
  return ((await res.json()) as { data: T }).data;
}

/** OData filter for the API; single quotes in values are doubled per OData rules. */
function odata(filters: StatsFilters): string | undefined {
  const parts = (Object.entries(filters) as [Dimension, string][]).map(([dim, v]) => `${dim} eq '${v.replace(/'/g, "''")}'`);
  return parts.length ? parts.join(" and ") : undefined;
}

const HOUR = 3600_000;
const DAY = 24 * HOUR;
const launch = Date.parse(`${ANALYTICS_SINCE}T00:00:00Z`);

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
function countryName(code: string) {
  if (!code) return "Unknown";
  try {
    return regionNames.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

const LABELS: Partial<Record<Dimension, (v: string) => string>> = {
  country: countryName,
  referrerHostname: (h) => h || "Direct / unknown",
  requestPath: (p) => p || "/",
  utmSource: (u) => u || "None",
  deviceType: (d) => (d ? d[0].toUpperCase() + d.slice(1) : "Unknown"),
  browserName: (b) => b || "Unknown",
  osName: (o) => o || "Unknown",
};

export function dimensionValueLabel(dim: Dimension, value: string): string {
  return (LABELS[dim] ?? ((v: string) => v))(value);
}

// Visits from our own pages aren't a traffic source.
const OWN_HOSTS = /(^|\.)saveroption\.com$|\.vercel\.app$/;

function toRows(dim: Dimension, rows: ApiRow[]): Row[] {
  const out: Row[] = rows
    .map((r) => {
      const value = typeof r[dim] === "string" ? (r[dim] as string) : "";
      const other = value === "Others";
      return { value, other, label: other ? "Others" : dimensionValueLabel(dim, value), visitors: r.visitors ?? 0, pageviews: r.pageviews ?? 0 };
    })
    .filter((r) => (r.visitors > 0 || r.pageviews > 0) && !(dim === "referrerHostname" && OWN_HOSTS.test(r.value)))
    // Utm rows with no source are every visit without UTM tags; they'd dwarf the real campaigns.
    .filter((r) => !(dim === "utmSource" && r.value === ""));
  out.sort((a, b) => Number(Boolean(a.other)) - Number(Boolean(b.other)) || b.visitors - a.visitors);
  return out;
}

export type TrafficStatsResult =
  | { ok: true; stats: TrafficStats }
  /** `reason` is safe to show: an HTTP status and error code, never a credential. */
  | { ok: false; reason: string };

/** Stats for a range and filters. */
export async function getTrafficStats(q: StatsQuery, now = new Date()): Promise<TrafficStatsResult> {
  if (!trafficStatsConfigured()) return { ok: false, reason: "not configured" };

  const granularity = q.range === "24h" ? "hour" : "day";
  const days = RANGES[q.range].days;
  const unit = granularity === "hour" ? HOUR : DAY;
  // Bucket-aligned window ending now, never before analytics was switched on.
  const end = Math.floor(now.getTime() / unit) * unit + unit;
  const wanted = Number.isFinite(days) ? end - days * DAY : launch;
  const start = Math.max(launch, Math.floor(wanted / unit) * unit);
  const since = new Date(start).toISOString();
  const until = now.toISOString();
  const filter = odata(q.filters);
  // Hourly data goes stale faster than daily.
  const revalidate = granularity === "hour" ? 900 : 3600;
  const range = { since, until, filter };

  const span = end - start;
  const prevStart = start - span;
  const hasPrevious = Number.isFinite(days) && prevStart >= launch;

  try {
    const dims = Object.keys(DIMENSIONS) as Dimension[];
    // Totals and the time series are required; the comparison and breakdowns degrade to empty.
    const optional = <T,>(p: Promise<T>, fallback: T) =>
      p.catch((err) => {
        console.error("[traffic-stats]", err instanceof Error ? err.message : err);
        return fallback;
      });
    const [totals, series, previous, ...lists] = await Promise.all([
      query<Totals>("count", range, revalidate),
      query<ApiRow[]>("aggregate", { ...range, by: granularity, limit: 100 }, revalidate),
      hasPrevious
        ? optional(query<Totals | null>("count", { since: new Date(prevStart).toISOString(), until: new Date(start - 1).toISOString(), filter }, revalidate), null)
        : Promise.resolve(null),
      ...dims.map((dim) => optional(query<ApiRow[]>("aggregate", { ...range, by: dim, limit: 10 }, revalidate), [] as ApiRow[])),
    ]);

    const byBucket = new Map(series.map((r) => [new Date(String(r.timestamp)).getTime(), r]));
    const points: Point[] = [];
    for (let t = start; t < end; t += unit) {
      const r = byBucket.get(t);
      points.push({ t: new Date(t).toISOString(), visitors: r?.visitors ?? 0, pageviews: r?.pageviews ?? 0 });
    }

    const breakdowns = Object.fromEntries(dims.map((dim, i) => [dim, toRows(dim, lists[i])])) as Record<Dimension, Row[]>;

    return {
      ok: true,
      stats: {
        since,
        until,
        granularity,
        totals: { visitors: totals.visitors ?? 0, pageviews: totals.pageviews ?? 0 },
        previous: previous ? { visitors: previous.visitors ?? 0, pageviews: previous.pageviews ?? 0 } : null,
        series: points,
        breakdowns,
        fetchedAt: now.toISOString(),
      },
    };
  } catch (err) {
    console.error("[traffic-stats]", err instanceof Error ? err.message : err);
    if (err instanceof WebAnalyticsError) return { ok: false, reason: `${err.endpoint} ${err.status}${err.code ? ` ${err.code}` : ""}` };
    return { ok: false, reason: err instanceof TypeError ? "network error" : "unexpected error" };
  }
}

/** Unique visitors so far today (UTC), or null when unavailable. Cached for five minutes. */
export async function getVisitorsTodayFromVercel(now = new Date()): Promise<number | null> {
  if (!trafficStatsConfigured()) return null;
  const since = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();
  try {
    const totals = await query<Totals>("count", { since, until: now.toISOString() }, 300);
    return totals.visitors ?? null;
  } catch (err) {
    console.error("[traffic-stats]", err instanceof Error ? err.message : err);
    return null;
  }
}
