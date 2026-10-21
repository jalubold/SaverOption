/**
 * Public traffic stats from Vercel Web Analytics (REST API).
 *
 * Server-only: import this from server components only, so VERCEL_ANALYTICS_TOKEN
 * (no NEXT_PUBLIC_ prefix) never reaches the browser. Results are
 * cached for an hour, so the API is called at most a few times per hour no matter
 * how many people open /stats. Only aggregate counts are read and shown.
 */

/** First day with Web Analytics data for this site. */
export const ANALYTICS_SINCE = "2026-10-19";
/** Rolling window shown on /stats, capped at ANALYTICS_SINCE. */
export const WINDOW_DAYS = 30;
const REVALIDATE_SECONDS = 3600;

export interface DayPoint {
  date: string; // YYYY-MM-DD
  visitors: number;
  pageviews: number;
}

export interface Breakdown {
  label: string;
  visitors: number;
  pageviews: number;
}

export interface TrafficStats {
  since: string;
  until: string;
  days: number;
  visitors: number;
  pageviews: number;
  daily: DayPoint[];
  countries: Breakdown[];
  referrers: Breakdown[];
  pages: Breakdown[];
  devices: Breakdown[];
  fetchedAt: string;
}

interface Row {
  timestamp?: string;
  visitors?: number;
  pageviews?: number;
  [dimension: string]: unknown;
}

function settings() {
  const token = process.env.VERCEL_ANALYTICS_TOKEN;
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

async function query<T>(path: "count" | "aggregate", params: Record<string, string | number>): Promise<T> {
  const s = settings();
  if (!s) throw new Error("VERCEL_ANALYTICS_TOKEN is not set");
  const url = new URL(`${s.base}/v1/query/web-analytics/visits/${path}`);
  url.searchParams.set("projectId", s.projectId);
  url.searchParams.set("teamId", s.teamId);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${s.token}` },
    next: { revalidate: REVALIDATE_SECONDS, tags: ["traffic-stats"] },
  });
  if (!res.ok) throw new Error(`Web Analytics ${path} ${res.status}`);
  return ((await res.json()) as { data: T }).data;
}

const isoDay = (d: Date) => d.toISOString().slice(0, 10);

/**
 * Turns API rows into labelled rows sorted by `metric`. The API folds the long
 * tail into a row named "Others"; it is relabelled and kept last.
 */
function breakdown(
  rows: Row[],
  key: string,
  { label = (v: string) => v, others, metric = "visitors" }: { label?: (value: string) => string; others: string; metric?: "visitors" | "pageviews" },
): Breakdown[] {
  const out = rows
    .map((r) => {
      const raw = typeof r[key] === "string" ? (r[key] as string) : "";
      return { label: raw === "Others" ? others : label(raw), other: raw === "Others", visitors: r.visitors ?? 0, pageviews: r.pageviews ?? 0 };
    })
    .filter((b) => b.visitors > 0 || b.pageviews > 0);
  out.sort((a, b) => Number(a.other) - Number(b.other) || b[metric] - a[metric]);
  return out.map(({ label, visitors, pageviews }) => ({ label, visitors, pageviews }));
}

/** Aggregated stats for the window, or null when not configured or the API fails. */
export async function getTrafficStats(now = new Date()): Promise<TrafficStats | null> {
  if (!trafficStatsConfigured()) return null;

  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const windowStart = new Date(end);
  windowStart.setUTCDate(windowStart.getUTCDate() - (WINDOW_DAYS - 1));
  const sinceDate = isoDay(windowStart) < ANALYTICS_SINCE ? ANALYTICS_SINCE : isoDay(windowStart);
  const since = `${sinceDate}T00:00:00.000Z`;
  const until = now.toISOString();
  const range = { since, until };

  try {
    const [total, daily, countries, referrers, pages, devices] = await Promise.all([
      query<{ visitors: number; pageviews: number }>("count", range),
      query<Row[]>("aggregate", { ...range, by: "day", limit: 100 }),
      query<Row[]>("aggregate", { ...range, by: "country", limit: 6 }),
      query<Row[]>("aggregate", { ...range, by: "referrerHostname", limit: 8 }),
      query<Row[]>("aggregate", { ...range, by: "requestPath", limit: 6 }),
      query<Row[]>("aggregate", { ...range, by: "deviceType", limit: 4 }),
    ]);

    const byDay = new Map(daily.map((r) => [String(r.timestamp).slice(0, 10), r]));
    const points: DayPoint[] = [];
    for (let d = new Date(`${sinceDate}T00:00:00Z`); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
      const r = byDay.get(isoDay(d));
      points.push({ date: isoDay(d), visitors: r?.visitors ?? 0, pageviews: r?.pageviews ?? 0 });
    }

    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    const countryName = (code: string) => {
      if (!code) return "Unknown";
      try {
        return regionNames.of(code.toUpperCase()) ?? code;
      } catch {
        return code;
      }
    };
    // Visits from our own pages aren't a traffic source; empty referrers are direct visits.
    const ownHosts = /(^|\.)saveroption\.com$|\.vercel\.app$/;
    const sources = breakdown(referrers, "referrerHostname", { label: (h) => h || "Direct / unknown", others: "Other sites" })
      .filter((b) => !ownHosts.test(b.label))
      .slice(0, 6);

    return {
      since: sinceDate,
      until: isoDay(end),
      days: points.length,
      visitors: total.visitors ?? 0,
      pageviews: total.pageviews ?? 0,
      daily: points,
      countries: breakdown(countries, "country", { label: countryName, others: "Other countries" }),
      referrers: sources,
      pages: breakdown(pages, "requestPath", { label: (p) => p || "/", others: "Other pages", metric: "pageviews" }),
      devices: breakdown(devices, "deviceType", { label: (d) => (d ? d[0].toUpperCase() + d.slice(1) : "Unknown"), others: "Other" }),
      fetchedAt: now.toISOString(),
    };
  } catch (err) {
    console.error("[traffic-stats]", err instanceof Error ? err.message : err);
    return null;
  }
}
