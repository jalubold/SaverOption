import { createHash } from "node:crypto";
import type postgres from "postgres";
import { db } from "@/lib/server/db";

/**
 * First-party event tracking in our own database:
 *  - listing events: views and outbound clicks of published sponsored listings,
 *    counted once per visitor per day (daily-salted hash of IP + user agent);
 *  - funnel events: each step of the promote → pay → account flow, counted once
 *    per submission (or anonymous browser session before one exists).
 * No personal data is stored.
 */

export const FUNNEL_EVENTS = [
  "promote_page_viewed",
  "listing_form_started",
  "listing_details_submitted",
  "plan_selected",
  "checkout_started",
  "checkout_returned",
  "payment_succeeded",
  "payment_failed",
  "account_signup_started",
  "account_created",
  "profile_completion_started",
  "profile_completed",
] as const;
export type FunnelEvent = (typeof FUNNEL_EVENTS)[number];

/** Events the browser may report; the rest are recorded by the server where they happen. */
export const CLIENT_FUNNEL_EVENTS: ReadonlySet<FunnelEvent> = new Set([
  "promote_page_viewed",
  "listing_form_started",
  "listing_details_submitted",
  "plan_selected",
  "account_signup_started",
]);

type Sql = postgres.Sql | postgres.TransactionSql;

export async function recordFunnelEvent(
  name: FunnelEvent,
  ids: { sessionId?: string | null; submissionId?: string | null },
  sql: Sql = db(),
): Promise<void> {
  const scope = ids.submissionId ? `s:${ids.submissionId}` : ids.sessionId ? `b:${ids.sessionId}` : null;
  if (!scope) return;
  await sql`insert into funnel_events (name, session_id, submission_id, dedupe_key)
    values (${name}, ${ids.sessionId ?? null}, ${ids.submissionId ?? null}, ${`${name}:${scope}`})
    on conflict (dedupe_key) do nothing`;
}

export function visitorHash(ip: string, userAgent: string, day: string): string {
  const salt = process.env.VISITOR_SALT || "saver-option";
  return createHash("sha256").update(`${salt}:listing:${day}:${ip}:${userAgent}`).digest("hex").slice(0, 32);
}

/** Records a view or click for a live listing (others are ignored). Returns whether it counted. */
export async function recordListingEvent(submissionId: string, type: "view" | "click", visitor: { ip: string; userAgent: string }) {
  const day = new Date().toISOString().slice(0, 10);
  const rows = await db()`
    insert into listing_events (submission_id, type, day, visitor_hash)
    select id, ${type}, ${day}::date, ${visitorHash(visitor.ip, visitor.userAgent, day)}
    from submissions
    where id = ${submissionId} and review_status = 'published' and payment_status = 'paid'
      and listing_starts_at <= now() and listing_ends_at > now()
    on conflict do nothing
    returning id`;
  return rows.length > 0;
}

export interface ListingStats {
  views: number;
  clicks: number;
  daily: { day: string; views: number; clicks: number }[];
}

export async function listingStats(submissionId: string): Promise<ListingStats> {
  const rows = await db()<{ day: string; views: number; clicks: number }[]>`
    select to_char(day, 'YYYY-MM-DD') as day,
      count(*) filter (where type = 'view')::int as views,
      count(*) filter (where type = 'click')::int as clicks
    from listing_events where submission_id = ${submissionId}
    group by day order by day`;
  return {
    views: rows.reduce((s, r) => s + r.views, 0),
    clicks: rows.reduce((s, r) => s + r.clicks, 0),
    daily: rows,
  };
}

/** Total views and clicks per listing, for the dashboard list. */
export async function statsForSubmissions(ids: string[]): Promise<Map<string, { views: number; clicks: number }>> {
  if (ids.length === 0) return new Map();
  const rows = await db()<{ submission_id: string; views: number; clicks: number }[]>`
    select submission_id,
      count(*) filter (where type = 'view')::int as views,
      count(*) filter (where type = 'click')::int as clicks
    from listing_events where submission_id = any(${ids}::uuid[])
    group by submission_id`;
  return new Map(rows.map((r) => [r.submission_id, { views: r.views, clicks: r.clicks }]));
}

// ─── Internal conversion metrics ─────────────────────────────────────────────

export interface FunnelMetrics {
  counts: Record<FunnelEvent, number>;
  rates: { label: string; numerator: FunnelEvent; denominator: FunnelEvent; value: number | null }[];
  revenue: { paidOrders: number; grossCents: number; refundCount: number; refundedCents: number; testOrders: number };
  since: Date | null;
}

const RATE_DEFS: { label: string; numerator: FunnelEvent; denominator: FunnelEvent }[] = [
  { label: "Form completion", numerator: "listing_details_submitted", denominator: "listing_form_started" },
  { label: "Plan selection", numerator: "plan_selected", denominator: "listing_details_submitted" },
  { label: "Checkout initiation", numerator: "checkout_started", denominator: "plan_selected" },
  { label: "Paid conversion", numerator: "payment_succeeded", denominator: "checkout_started" },
  { label: "Payment failure", numerator: "payment_failed", denominator: "checkout_started" },
  { label: "Signup completion", numerator: "account_created", denominator: "account_signup_started" },
  { label: "Profile completion", numerator: "profile_completed", denominator: "payment_succeeded" },
];

/** Funnel counts and rates from recorded events; revenue from verified, non-test orders only. */
export async function funnelMetrics(days: number | null): Promise<FunnelMetrics> {
  const sql = db();
  const since = days ? new Date(Date.now() - days * 86400_000) : null;
  const rows = await sql<{ name: FunnelEvent; n: number }[]>`
    select name, count(*)::int as n from funnel_events
    where ${since}::timestamptz is null or created_at >= ${since}
    group by name`;
  const counts = Object.fromEntries(FUNNEL_EVENTS.map((e) => [e, 0])) as Record<FunnelEvent, number>;
  for (const r of rows) counts[r.name] = r.n;

  const [rev] = await sql<{ paid_orders: number; gross: number; refund_count: number; refunded: number; test_orders: number }[]>`
    select
      count(*) filter (where not test_mode and paid_at is not null)::int as paid_orders,
      coalesce(sum(total_cents) filter (where not test_mode and paid_at is not null), 0)::int as gross,
      count(*) filter (where not test_mode and refunded_cents > 0)::int as refund_count,
      coalesce(sum(refunded_cents) filter (where not test_mode), 0)::int as refunded,
      count(*) filter (where test_mode)::int as test_orders
    from orders
    where ${since}::timestamptz is null or created_at >= ${since}`;

  return {
    counts,
    rates: RATE_DEFS.map((d) => ({ ...d, value: counts[d.denominator] ? counts[d.numerator] / counts[d.denominator] : null })),
    revenue: {
      paidOrders: rev.paid_orders,
      grossCents: rev.gross,
      refundCount: rev.refund_count,
      refundedCents: rev.refunded,
      testOrders: rev.test_orders,
    },
    since,
  };
}
