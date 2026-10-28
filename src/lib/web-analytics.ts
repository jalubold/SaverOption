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
  today: { label: "Today", short: "Today", days: 1 },
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

/** A query as URL parameters (the default range is left out). */
export function statsParams(q: StatsQuery): URLSearchParams {
  const sp = new URLSearchParams();
  if (q.range !== DEFAULT_RANGE) sp.set("range", q.range);
  for (const [dim, value] of Object.entries(q.filters) as [Dimension, string][]) sp.set(DIMENSIONS[dim].param, value);
  return sp;
}

/**
 * Builds the stats URL for a query; pass overrides to change range or add/remove a filter. The
 * default view is the prerendered /stats; anything else is /stats/view?….
 */
export function statsHref(q: StatsQuery, change: { range?: RangeKey; set?: [Dimension, string]; unset?: Dimension | "all" } = {}): string {
  const filters: StatsFilters = change.unset === "all" ? {} : { ...q.filters };
  if (change.unset && change.unset !== "all") delete filters[change.unset];
  if (change.set) filters[change.set[0]] = change.set[1];
  const qs = statsParams({ range: change.range ?? q.range, filters }).toString();
  return qs ? `/stats/view?${qs}` : "/stats";
}

/** Breakdown rows as panel rows: each links to the view with that value as a filter; the active one links back out. */
export function panelRows(q: StatsQuery, dim: Dimension, rows: Row[]) {
  return rows.map((r) => {
    const active = q.filters[dim] === r.value;
    return { label: r.label, visitors: r.visitors, active, href: r.other ? undefined : active ? statsHref(q, { unset: dim }) : statsHref(q, { set: [dim, r.value] }) };
  });
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
  /** Null when only the totals could be read (the chart's endpoint was rate limited). */
  series: Point[] | null;
  /** The panels shown with the page; the other dimensions load when their tab is opened. */
  breakdowns: Partial<Record<Dimension, Row[]>>;
  fetchedAt: string;
}

/** Breakdowns read with the page; the rest (LAZY_DIMENSIONS) load when their tab is opened. */
export const PAGE_DIMENSIONS = ["requestPath", "referrerHostname", "country", "deviceType"] as const satisfies readonly Dimension[];
export const LAZY_DIMENSIONS = ["utmSource", "browserName", "osName"] as const satisfies readonly Dimension[];

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

export type Endpoint = "count" | "aggregate";

export class WebAnalyticsError extends Error {
  constructor(
    readonly endpoint: Endpoint,
    readonly status: number,
    readonly code?: string,
    /** For a 429: when the API says it accepts requests again (ms since epoch). */
    readonly retryAt?: number,
  ) {
    super(`Web Analytics ${endpoint} ${status}${code ? ` (${code})` : ""}`);
  }

  /** Safe to show: endpoint, HTTP status and error code, never a credential. */
  get reason(): string {
    return `${this.endpoint} ${this.status}${this.code ? ` ${this.code}` : ""}`;
  }
}

// Personal tokens scoped to the account can reject an explicit teamId; remember what worked.
let sendTeamId = true;

// Vercel rate limits each endpoint separately. After a 429 that endpoint isn't called again
// until the reset time the API gives (body `limit.resetMs`/`reset`, or Retry-After; else a minute),
// so a rate limit isn't prolonged by our own retries.
const coolUntil: Record<Endpoint, number> = { count: 0, aggregate: 0 };

/** When an endpoint may be called again (ms since epoch), or 0. */
export function cooldownUntil(endpoint: Endpoint): number {
  return coolUntil[endpoint] > Date.now() ? coolUntil[endpoint] : 0;
}

/** Applies a cooldown learned elsewhere (another server instance, via the database). */
export function noteCooldown(endpoint: Endpoint, until: number): void {
  if (until > coolUntil[endpoint]) coolUntil[endpoint] = until;
}

function retryTime(res: Response, body: unknown): number {
  const limit = (body as { error?: { limit?: { resetMs?: unknown; reset?: unknown } } } | null)?.error?.limit;
  if (typeof limit?.resetMs === "number" && limit.resetMs > Date.now()) return limit.resetMs;
  if (typeof limit?.reset === "number" && limit.reset * 1000 > Date.now()) return limit.reset * 1000;
  const wait = Number(res.headers.get("retry-after"));
  return Date.now() + (Number.isFinite(wait) && wait > 0 ? wait : 60) * 1000;
}

async function query<T>(path: Endpoint, params: Record<string, string | number | undefined>, revalidate: number): Promise<T> {
  const s = settings();
  if (!s) throw new Error("VERCEL_ANALYTICS_TOKEN is not set");
  if (cooldownUntil(path)) throw new WebAnalyticsError(path, 429, "rate_limited", coolUntil[path]);
  const attempt = (withTeam: boolean) => {
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
    res = retry.ok || retry.status === 429 ? retry : res;
  }
  if (!res.ok) {
    // Error bodies carry a short code (e.g. "forbidden") and, for 429, the reset time; never the token.
    const body = (await res.json().catch(() => null)) as { error?: { code?: string } } | null;
    if (res.status === 429) {
      const until = retryTime(res, body);
      noteCooldown(path, until);
      throw new WebAnalyticsError(path, 429, body?.error?.code ?? "rate_limited", until);
    }
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

/** Time window and filter for a query. */
function windowFor(q: StatsQuery, now: Date) {
  // Windows are aligned to UTC days because the count endpoint works in whole days: it rounds
  // `since` and `until` down to midnight and treats `until` as exclusive. The aggregate endpoint
  // rounds `until` up to the end of its bucket, so it gets the last millisecond of the window.
  const granularity: "hour" | "day" = q.range === "today" ? "hour" : "day";
  const dayStart = Math.floor(now.getTime() / DAY) * DAY;
  const dayEnd = dayStart + DAY;
  const days = RANGES[q.range].days;
  const start = q.range === "today" ? dayStart : Math.max(launch, Number.isFinite(days) ? dayEnd - days * DAY : launch);
  // Today's chart runs to the current hour; daily charts include today.
  const end = q.range === "today" ? Math.floor(now.getTime() / HOUR) * HOUR + HOUR : dayEnd;
  // Compare with the same number of days just before, once that period has data (not for "today",
  // which is still in progress).
  const prevStart = start - (dayEnd - start);
  return {
    granularity,
    start,
    end,
    dayEnd,
    since: new Date(start).toISOString(),
    until: new Date(end - 1).toISOString(),
    filter: odata(q.filters),
    prevStart: q.range !== "today" && Number.isFinite(days) && prevStart >= launch ? prevStart : null,
    // Hourly data goes stale faster than daily.
    revalidate: granularity === "hour" ? 900 : 3600,
  };
}

/** Totals and the previous period (count endpoint): the part of the page shown even when the chart can't load. */
export async function fetchSummary(q: StatsQuery, now = new Date()): Promise<Omit<TrafficStats, "series" | "breakdowns">> {
  const w = windowFor(q, now);
  // The first call alone: it settles whether the token takes a teamId before the others go out.
  const totals = await query<Totals>("count", { since: w.since, until: new Date(w.dayEnd).toISOString(), filter: w.filter }, w.revalidate);
  const previous =
    w.prevStart === null
      ? null
      : await query<Totals | null>("count", { since: new Date(w.prevStart).toISOString(), until: w.since, filter: w.filter }, w.revalidate).catch((err) => {
          // The comparison is optional, except that a rate limit must surface (it starts the cooldown).
          if (err instanceof WebAnalyticsError && err.status === 429) throw err;
          console.error("[traffic-stats]", err instanceof Error ? err.message : err);
          return null;
        });
  return {
    since: w.since,
    until: w.until,
    granularity: w.granularity,
    totals: { visitors: totals.visitors ?? 0, pageviews: totals.pageviews ?? 0 },
    previous: previous ? { visitors: previous.visitors ?? 0, pageviews: previous.pageviews ?? 0 } : null,
    fetchedAt: now.toISOString(),
  };
}

/** The chart: visitors and pageviews per hour (Today) or per day. */
export async function fetchSeries(q: StatsQuery, now = new Date()): Promise<Point[]> {
  const w = windowFor(q, now);
  const rows = await query<ApiRow[]>("aggregate", { since: w.since, until: w.until, filter: w.filter, by: w.granularity, limit: 100 }, w.revalidate);
  const byBucket = new Map(rows.map((r) => [new Date(String(r.timestamp)).getTime(), r]));
  const unit = w.granularity === "hour" ? HOUR : DAY;
  const points: Point[] = [];
  for (let t = w.start; t < w.end; t += unit) {
    const r = byBucket.get(t);
    points.push({ t: new Date(t).toISOString(), visitors: r?.visitors ?? 0, pageviews: r?.pageviews ?? 0 });
  }
  return points;
}

/** Top values of one dimension. */
export async function fetchBreakdown(q: StatsQuery, dim: Dimension, now = new Date()): Promise<Row[]> {
  const w = windowFor(q, now);
  return toRows(dim, await query<ApiRow[]>("aggregate", { since: w.since, until: w.until, filter: w.filter, by: dim, limit: 10 }, w.revalidate));
}

/** Unique visitors so far today (UTC), or null when unavailable. Cached for five minutes. */
export async function getVisitorsTodayFromVercel(now = new Date()): Promise<number | null> {
  if (!trafficStatsConfigured()) return null;
  const dayStart = Math.floor(now.getTime() / DAY) * DAY;
  const since = new Date(dayStart).toISOString();
  // Next midnight, not "now": the count endpoint rounds `until` down to the day (exclusive).
  const until = new Date(dayStart + DAY).toISOString();
  try {
    const totals = await query<Totals>("count", { since, until }, 300);
    return totals.visitors ?? null;
  } catch (err) {
    console.error("[traffic-stats]", err instanceof Error ? err.message : err);
    return null;
  }
}
