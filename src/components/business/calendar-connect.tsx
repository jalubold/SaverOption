import { dismissCalendarPromptAction } from "@/app/business/actions/notifications";
import { GoogleLogo } from "@/components/brand/google-logo";
import { CalendarWatch } from "@/components/business/calendar-watch";
import { CopyField } from "@/components/business/copy-field";
import { Icon } from "@/components/ui/icon";
import { buttonClass, cn } from "@/components/ui/primitives";
import { calendarClientLabels, calendarFeedPath, calendarLinks, calendarStatus, ensureCalendarStatus } from "@/lib/server/business/calendar";
import type { BizContext } from "@/lib/server/business/context";
import { requestOrigin } from "@/lib/server/origin";

/**
 * Renewals in the member's own calendar, in as few clicks as possible: "Add to Google Calendar"
 * opens Google's own "Add calendar?" prompt for their personal feed, and the webcal:// link does
 * the same in Apple Calendar or Outlook. The page says "Connected" once a calendar app has
 * fetched the feed. Used in onboarding, Settings → Notifications and (compact) on the dashboard.
 */

function ago(date: Date, now = new Date()): string {
  const minutes = Math.max(0, Math.round((now.getTime() - date.getTime()) / 60_000));
  if (minutes < 2) return "just now";
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return hours === 1 ? "an hour ago" : `${hours} hours ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}

export async function CalendarConnect({ ctx }: { ctx: BizContext }) {
  const status = await ensureCalendarStatus(ctx);
  const links = calendarLinks(`${await requestOrigin()}${calendarFeedPath(status.token)}`);
  const connected = Boolean(status.fetchedAt && status.client);
  const app = status.client ? calendarClientLabels[status.client] : null;
  const calendarName = `Saver Option · ${ctx.workspace.name}`;
  return (
    <div className="space-y-4" data-calendar-connect data-connected={connected ? "yes" : "no"}>
      {connected && status.fetchedAt && (
        <div className="flex items-start gap-3 rounded-xl bg-success/12 px-4 py-3" data-calendar-connected={status.client}>
          <span aria-hidden="true" className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-success text-white">
            <Icon name="check" size={13} />
          </span>
          <div className="text-[13.5px] leading-relaxed">
            <p className="font-semibold text-fg">{status.client === "other" ? "Connected to your calendar" : `Connected to ${app}`}</p>
            <p className="text-muted">
              It last fetched your renewals {ago(status.fetchedAt)}. They&apos;re in the calendar &ldquo;{calendarName}&rdquo;.
            </p>
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <a href={links.google} target="_blank" rel="noopener noreferrer" className={buttonClass(connected ? "secondary" : "primary", "md")} data-calendar-add="google">
          <span className="flex size-5 items-center justify-center rounded-full bg-white">
            <GoogleLogo size={14} />
          </span>
          Add to Google Calendar
        </a>
        <a href={links.webcal} className={buttonClass("secondary", "md")} data-calendar-add="webcal">
          <Icon name="calendar" size={15} /> Apple Calendar or Outlook
        </a>
      </div>
      <CalendarWatch connected={connected} />
      {!connected && (
        <ol className="space-y-1.5 text-[13px] leading-relaxed text-muted" data-calendar-steps>
          {[
            <>Choose <strong className="font-medium text-fg">Add to Google Calendar</strong>. Google asks &ldquo;Add calendar?&rdquo;</>,
            <>Choose <strong className="font-medium text-fg">Add</strong>. That&apos;s all.</>,
            <>Renewals and cancel-by dates appear as all-day events in their own calendar, &ldquo;{calendarName}&rdquo;, and update as they change.</>,
          ].map((step, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-subtle text-[11px] font-semibold text-faint">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      )}
      <details className="group rounded-xl border border-line" data-calendar-manual>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-2.5 text-[13px] font-medium text-fg [&::-webkit-details-marker]:hidden">
          Another calendar app, or Google didn&apos;t ask?
          <Icon name="chevron-down" size={15} className="shrink-0 text-faint transition-transform group-open:rotate-180" />
        </summary>
        <div className="space-y-3 border-t border-line px-4 py-3.5">
          <CopyField value={links.feed} label="Your calendar link" />
          <ul className="space-y-1.5 text-[13px] leading-relaxed text-muted">
            <li>
              <strong className="font-medium text-fg">Google Calendar:</strong>{" "}
              <a href={links.googleByUrl} target="_blank" rel="noopener noreferrer" className="text-accent-ink underline underline-offset-2">
                Other calendars → + → From URL
              </a>
              , paste the link, then Add calendar.
            </li>
            <li>
              <strong className="font-medium text-fg">Outlook on the web:</strong> Add calendar → Subscribe from web, paste the link.
            </li>
            <li>
              <strong className="font-medium text-fg">Apple Calendar:</strong> File → New Calendar Subscription, paste the link.
            </li>
          </ul>
          <p className="text-[12.5px] text-faint">The link is personal: it shows this workspace&apos;s renewals to whoever has it, so keep it to yourself.</p>
        </div>
      </details>
    </div>
  );
}

/**
 * The dashboard's suggestion, for members whose calendar doesn't have their renewals yet. It goes
 * away once a calendar app fetches the feed, or when they choose "Not now".
 */
export async function CalendarPrompt({ ctx, className }: { ctx: BizContext; className?: string }) {
  if (ctx.workspace.isDemo) return null;
  const peek = await calendarStatus(ctx);
  if (peek.promptDismissed || peek.fetchedAt) return null;
  const status = await ensureCalendarStatus(ctx);
  const links = calendarLinks(`${await requestOrigin()}${calendarFeedPath(status.token)}`);
  return (
    <section className={cn("biz-card flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3.5 sm:px-5", className)} data-calendar-connect data-calendar-prompt>
      <span aria-hidden="true" className="icon-tile size-10 shrink-0">
        <Icon name="calendar" size={18} />
      </span>
      <div className="min-w-[14rem] flex-1">
        <p className="text-[14px] font-semibold text-heading">Put renewals in your calendar</p>
        <p className="text-[13px] leading-relaxed text-muted">Every renewal and cancel-by date as an all-day event, so nothing renews by surprise. Two clicks.</p>
        <CalendarWatch connected={false} compact />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <a href={links.google} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "sm")} data-calendar-add="google">
          <span className="flex size-4 items-center justify-center rounded-full bg-white">
            <GoogleLogo size={11} />
          </span>
          Add to Google Calendar
        </a>
        <a href={links.webcal} className={buttonClass("secondary", "sm")} data-calendar-add="webcal">
          Apple Calendar
        </a>
        <form action={dismissCalendarPromptAction}>
          <input type="hidden" name="workspaceId" value={ctx.workspace.id} />
          <button type="submit" className={buttonClass("ghost", "sm")} data-calendar-dismiss>
            Not now
          </button>
        </form>
      </div>
    </section>
  );
}

/**
 * A side card for pages about dates (Renewals): connected, or two clicks away from having these
 * dates in the member's own calendar.
 */
export async function CalendarSideCard({ ctx }: { ctx: BizContext }) {
  if (ctx.workspace.isDemo) return null;
  const peek = await calendarStatus(ctx);
  if (peek.fetchedAt && peek.client) {
    return (
      <section className="biz-card flex items-center gap-3 px-4 py-3.5" data-calendar-side="connected">
        <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-success text-white">
          <Icon name="check" size={15} />
        </span>
        <p className="min-w-0 flex-1 text-[13px] leading-snug text-muted">
          <span className="block font-semibold text-fg">{peek.client === "other" ? "In your calendar" : `In ${calendarClientLabels[peek.client]}`}</span>
          These dates are in your calendar too.
        </p>
        <a href="/business/settings/notifications#calendar" className="shrink-0 text-[12.5px] font-medium text-accent-ink hover:underline">
          Manage
        </a>
      </section>
    );
  }
  const status = await ensureCalendarStatus(ctx);
  const links = calendarLinks(`${await requestOrigin()}${calendarFeedPath(status.token)}`);
  return (
    <section className="biz-card px-4 py-4" data-calendar-connect data-calendar-side="offer">
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="icon-tile size-9 shrink-0">
          <Icon name="calendar" size={16} />
        </span>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-heading">See these in your calendar</p>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">Every renewal and cancel-by date as an all-day event in your own calendar. Two clicks.</p>
        </div>
      </div>
      <div className="mt-3.5 grid gap-2">
        <a href={links.google} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "sm", "w-full")} data-calendar-add="google">
          <span className="flex size-4 items-center justify-center rounded-full bg-white">
            <GoogleLogo size={11} />
          </span>
          Add to Google Calendar
        </a>
        <a href={links.webcal} className={buttonClass("secondary", "sm", "w-full")} data-calendar-add="webcal">
          Apple Calendar or Outlook
        </a>
      </div>
      <div className="mt-2">
        <CalendarWatch connected={false} compact />
      </div>
    </section>
  );
}
