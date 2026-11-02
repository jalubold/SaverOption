import { randomBytes } from "node:crypto";
import { siteConfig } from "@/config/site";
import { addDays, formatIsoDate, formatMoney, periodSuffix } from "@/lib/business/calc";
import { hasPremium } from "@/lib/business/billing";
import { accessFor } from "@/lib/server/business/billing";
import { mapWorkspace, type BizContext } from "@/lib/server/business/context";
import { db } from "@/lib/server/db";

/**
 * A personal calendar feed (ICS) of a workspace's renewals and cancellation deadlines, for
 * Google Calendar, Outlook or Apple Calendar. Each member has their own secret link (the token
 * on their membership): it can be reset, and it stops working when they leave the workspace.
 * Events are all-day, so time zones don't shift them; each carries reminders at the workspace's
 * (or the subscription's) reminder windows, for the calendar apps that use them.
 */

export const CALENDAR_TOKEN = /^[A-Za-z0-9_-]{32,64}$/;

/** The calendar apps the feed recognises when they fetch it. */
export type CalendarClient = "google" | "apple" | "outlook" | "other";

export const calendarClientLabels: Record<CalendarClient, string> = {
  google: "Google Calendar",
  apple: "Apple Calendar",
  outlook: "Outlook",
  other: "Your calendar app",
};

export interface CalendarStatus {
  token: string | null;
  /** When a calendar app last fetched the feed (browsers aren't counted). */
  fetchedAt: Date | null;
  client: CalendarClient | null;
  promptDismissed: boolean;
}

export async function calendarStatus(ctx: BizContext): Promise<CalendarStatus> {
  const [row] = await db()<{ calendar_token: string | null; calendar_fetched_at: Date | null; calendar_client: CalendarClient | null; calendar_prompt_dismissed_at: Date | null }[]>`
    select calendar_token, calendar_fetched_at, calendar_client, calendar_prompt_dismissed_at
    from biz_memberships where workspace_id = ${ctx.workspace.id} and user_id = ${ctx.user.id}`;
  return {
    token: row?.calendar_token ?? null,
    fetchedAt: row?.calendar_fetched_at ?? null,
    client: row?.calendar_client ?? null,
    promptDismissed: Boolean(row?.calendar_prompt_dismissed_at),
  };
}

/**
 * The member's status, with a link made if they have none yet, so "Add to Google Calendar" is a
 * plain link (one click, no popup blockers). The link is shown only to them.
 */
export async function ensureCalendarStatus(ctx: BizContext): Promise<CalendarStatus & { token: string }> {
  const status = await calendarStatus(ctx);
  return status.token ? { ...status, token: status.token } : { ...status, token: await setCalendarToken(ctx) };
}

/** Creates the member's link, or replaces it (the old one stops working at once, so its status starts over). */
export async function setCalendarToken(ctx: BizContext, { reset = false }: { reset?: boolean } = {}): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const [row] = await db()<{ calendar_token: string }[]>`
    update biz_memberships set
      calendar_token = case when ${reset} or calendar_token is null then ${token} else calendar_token end,
      calendar_fetched_at = case when ${reset} then null else calendar_fetched_at end,
      calendar_client = case when ${reset} then null else calendar_client end,
      updated_at = now()
    where workspace_id = ${ctx.workspace.id} and user_id = ${ctx.user.id}
    returning calendar_token`;
  return row.calendar_token;
}

export async function dismissCalendarPrompt(ctx: BizContext): Promise<void> {
  await db()`
    update biz_memberships set calendar_prompt_dismissed_at = coalesce(calendar_prompt_dismissed_at, now())
    where workspace_id = ${ctx.workspace.id} and user_id = ${ctx.user.id}`;
}

export function calendarFeedPath(token: string): string {
  return `/api/business/calendar/${token}.ics`;
}

/** The links that add a feed to a calendar app. */
export function calendarLinks(feedUrl: string) {
  const webcal = feedUrl.replace(/^https?:/, "webcal:");
  return {
    feed: feedUrl,
    webcal,
    // Google Calendar opens an "Add calendar?" prompt for the feed. Google takes the feed's
    // address as webcal:// here (an https:// one is refused), and fetches it over HTTPS.
    google: `https://calendar.google.com/calendar/r?cid=${webcal}`,
    // The manual route, if the prompt doesn't open: Other calendars → + → From URL.
    googleByUrl: "https://calendar.google.com/calendar/u/0/r/settings/addbyurl",
  };
}

/**
 * Which calendar app fetched the feed, from its user agent; null for a web browser (someone
 * opening the link), which doesn't mean a calendar is subscribed.
 */
export function calendarClientFrom(userAgent: string | null): CalendarClient | null {
  const ua = userAgent ?? "";
  if (/Google-Calendar-Importer/i.test(ua)) return "google";
  if (/CalendarAgent|dataaccessd|iCal\//i.test(ua)) return "apple";
  if (/Outlook|Microsoft Office|Exchange/i.test(ua)) return "outlook";
  if (/Mozilla\/\d/.test(ua) && /(Chrome|Firefox|Safari|Edg|SaverOptionBusinessDesktop)\//.test(ua)) return null;
  return "other";
}

interface FeedRow {
  id: string;
  software_name: string;
  plan_name: string | null;
  price_minor: string | number | null;
  currency: string;
  billing_interval: "monthly" | "quarterly" | "yearly" | "custom";
  custom_interval_count: number | null;
  custom_interval_unit: "day" | "week" | "month" | "year" | null;
  next_renewal_date: string | null;
  cancellation_deadline: string | null;
  auto_renew: boolean;
  status: "active" | "trial";
  reminder_days: number[] | null;
  owner_name: string | null;
  updated_at: Date;
}

/**
 * The feed behind a token, or null when no membership has it. A fetch by a calendar app is noted
 * on the membership (at most every few minutes), which is how the app knows the calendar is in use.
 */
export async function calendarFeed(token: string, { now = new Date(), userAgent = null }: { now?: Date; userAgent?: string | null } = {}): Promise<string | null> {
  if (!CALENDAR_TOKEN.test(token)) return null;
  const [m] = await db()`
    select w.* from biz_memberships m join biz_workspaces w on w.id = m.workspace_id where m.calendar_token = ${token}`;
  if (!m) return null;
  const client = calendarClientFrom(userAgent);
  if (client) {
    await db()`
      update biz_memberships set calendar_fetched_at = now(), calendar_client = ${client}
      where calendar_token = ${token}
        and (calendar_fetched_at is null or calendar_fetched_at < now() - interval '5 minutes' or calendar_client is distinct from ${client})`;
  }
  const workspace = mapWorkspace(m);
  // When the plan has ended the calendar stays valid but empty, so calendar apps don't keep erroring.
  const rows = hasPremium(await accessFor(workspace))
    ? await db()<FeedRow[]>`
        select s.id, sw.name as software_name, s.plan_name, s.price_minor, s.currency, s.billing_interval, s.custom_interval_count,
          s.custom_interval_unit, s.next_renewal_date::text, s.cancellation_deadline::text, s.auto_renew, s.status, s.reminder_days,
          p.name as owner_name, s.updated_at
        from biz_subscriptions s
        join biz_software sw on sw.workspace_id = s.workspace_id and sw.id = s.software_id
        left join biz_people p on p.workspace_id = s.workspace_id and p.id = coalesce(s.renewal_owner_person_id, s.owner_person_id)
        where s.workspace_id = ${workspace.id} and s.archived_at is null and s.status in ('active', 'trial')
          and (s.next_renewal_date >= ${addDays(now.toISOString().slice(0, 10), -60)} or s.cancellation_deadline >= ${addDays(now.toISOString().slice(0, 10), -60)})
        order by s.next_renewal_date nulls last`
    : [];

  const events: CalendarEvent[] = [];
  for (const s of rows) {
    const name = s.plan_name ? `${s.software_name} ${s.plan_name}` : s.software_name;
    const price = s.price_minor !== null ? `${formatMoney(Number(s.price_minor), s.currency)}${periodSuffix({ billingInterval: s.billing_interval, customIntervalCount: s.custom_interval_count, customIntervalUnit: s.custom_interval_unit })}` : null;
    const link = `${siteConfig.url}/business/subscriptions/${s.id}`;
    const reminders = (s.reminder_days ?? workspace.reminderDays).map(Number).filter((d) => d >= 1 && d <= 365);
    const details = [price && `Price: ${price}`, s.owner_name && `Owner: ${s.owner_name}`];
    if (s.next_renewal_date) {
      const trial = s.status === "trial";
      events.push({
        uid: `${s.id}-renewal@saveroption.com`,
        date: s.next_renewal_date,
        summary: trial ? `Trial ends: ${name}` : `${s.auto_renew ? "Renews" : "Ends"}: ${name}${price ? ` · ${price}` : ""}`,
        description: [
          ...details,
          s.cancellation_deadline && s.auto_renew ? `Cancel by ${formatIsoDate(s.cancellation_deadline)} to avoid renewing` : null,
          `Open in Saver Option Business: ${link}`,
        ],
        url: link,
        reminders,
        updatedAt: s.updated_at,
      });
    }
    if (s.cancellation_deadline && s.auto_renew) {
      events.push({
        uid: `${s.id}-deadline@saveroption.com`,
        date: s.cancellation_deadline,
        summary: `Cancel by: ${name}${s.next_renewal_date ? ` (renews ${formatIsoDate(s.next_renewal_date, "MMM d")})` : ""}`,
        description: [...details, "Last day to cancel before it renews automatically.", `Open in Saver Option Business: ${link}`],
        url: link,
        reminders,
        updatedAt: s.updated_at,
      });
    }
  }
  return buildCalendar({ name: `Saver Option · ${workspace.name}`, timeZone: workspace.timeZone, events, now });
}

// ─── ICS (RFC 5545) ──────────────────────────────────────────────────────────

export interface CalendarEvent {
  uid: string;
  /** YYYY-MM-DD, an all-day event. */
  date: string;
  summary: string;
  description: (string | null | false)[];
  url: string;
  /** Days before, each a reminder at 9:00 that morning. */
  reminders: number[];
  updatedAt: Date;
}

const escapeText = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
const icsDate = (iso: string) => iso.replaceAll("-", "");
const icsStamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

/** Folds a content line at 75 octets, without splitting a UTF-8 character. */
function fold(line: string): string {
  const out: string[] = [];
  let current = "";
  let bytes = 0;
  for (const ch of line) {
    const size = Buffer.byteLength(ch);
    if (bytes + size > (out.length ? 74 : 75)) {
      out.push(current);
      current = "";
      bytes = 0;
    }
    current += ch;
    bytes += size;
  }
  out.push(current);
  return out.join("\r\n ");
}

export function buildCalendar({ name, timeZone, events, now = new Date() }: { name: string; timeZone: string; events: CalendarEvent[]; now?: Date }): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Saver Option//Saver Option Business//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(name)}`,
    "X-WR-CALDESC:Renewals and cancellation deadlines from Saver Option Business",
    `X-WR-TIMEZONE:${escapeText(timeZone)}`,
    // Hints for how often to refresh; Google Calendar keeps its own schedule.
    "REFRESH-INTERVAL;VALUE=DURATION:PT6H",
    "X-PUBLISHED-TTL:PT6H",
  ];
  for (const e of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.uid}`,
      `DTSTAMP:${icsStamp(now)}`,
      `LAST-MODIFIED:${icsStamp(e.updatedAt)}`,
      `DTSTART;VALUE=DATE:${icsDate(e.date)}`,
      `DTEND;VALUE=DATE:${icsDate(addDays(e.date, 1))}`,
      `SUMMARY:${escapeText(e.summary)}`,
      `DESCRIPTION:${escapeText(e.description.filter(Boolean).join("\n"))}`,
      `URL:${e.url}`,
      "TRANSP:TRANSPARENT",
    );
    for (const days of [...new Set(e.reminders)].sort((a, b) => b - a)) {
      // 9:00 on the morning `days` before the (midnight) start of the all-day event.
      lines.push("BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${escapeText(e.summary)}`, `TRIGGER:-P${days - 1}DT15H`, "END:VALARM");
    }
    lines.push("END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}
