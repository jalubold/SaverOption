import { addDays, daysBetween, formatIsoDate, formatMoney, todayIn } from "@/lib/business/calc";
import { db } from "@/lib/server/db";
import { mapWorkspace, type BizWorkspace } from "@/lib/server/business/context";

/**
 * Renewal and cancellation-deadline reminders, delivered as in-app
 * notifications. Runs when someone opens the business app (at most every few
 * minutes per workspace) and from the daily cron route when CRON_SECRET is set.
 * biz_reminders records each reminder once, so neither path can duplicate one.
 * Email isn't sent: no email provider is configured.
 */

const lastRun = new Map<string, number>();
const THROTTLE_MS = 5 * 60_000;

/** Creates the reminders that have come due for one workspace. Returns how many notifications were created. */
export async function syncReminders(workspace: BizWorkspace, opts: { force?: boolean } = {}): Promise<number> {
  const now = Date.now();
  if (!opts.force && now - (lastRun.get(workspace.id) ?? 0) < THROTTLE_MS) return 0;
  lastRun.set(workspace.id, now);
  if (!workspace.notifyInApp) return 0;

  const today = todayIn(workspace.timeZone);
  const maxDays = Math.max(0, ...workspace.reminderDays, 365);
  const horizon = addDays(today, maxDays);
  const subs = await db()`
    select s.id, s.next_renewal_date, s.cancellation_deadline, s.reminder_days, s.price_minor, s.currency, s.auto_renew, sw.name as software_name
    from biz_subscriptions s join biz_software sw on sw.workspace_id = s.workspace_id and sw.id = s.software_id
    where s.workspace_id = ${workspace.id} and s.archived_at is null and s.status in ('active', 'trial')
      and ((s.next_renewal_date between ${today} and ${horizon}) or (s.cancellation_deadline between ${today} and ${horizon}))`;
  if (subs.length === 0) return 0;
  const members = await db()`select user_id from biz_memberships where workspace_id = ${workspace.id}`;
  let created = 0;

  for (const s of subs) {
    const days: number[] = s.reminder_days ? s.reminder_days.map(Number) : workspace.reminderDays;
    if (days.length === 0) continue;
    const events: { kind: "renewal" | "cancellation_deadline"; date: string }[] = [];
    if (s.next_renewal_date) events.push({ kind: "renewal", date: s.next_renewal_date });
    if (s.cancellation_deadline && s.auto_renew) events.push({ kind: "cancellation_deadline", date: s.cancellation_deadline });
    for (const ev of events) {
      const left = daysBetween(today, ev.date);
      if (left < 0) continue;
      const crossed = days.filter((d) => left <= d);
      if (crossed.length === 0) continue;
      // Record every window already reached, but notify once: for the closest window, if it's new.
      const tightest = Math.min(...crossed);
      const inserted = await db()`
        insert into biz_reminders (workspace_id, subscription_id, kind, due_date, days_before)
        select ${workspace.id}, ${s.id}, ${ev.kind}, ${ev.date}, d from unnest(${crossed}::int[]) as d
        on conflict (subscription_id, kind, due_date, days_before) do nothing
        returning days_before`;
      if (!inserted.some((r) => Number(r.days_before) === tightest)) continue;
      const when = left === 0 ? "today" : left === 1 ? "tomorrow" : `in ${left} days`;
      const amount = s.price_minor !== null ? ` for ${formatMoney(Number(s.price_minor), String(s.currency).trim())}` : "";
      const title =
        ev.kind === "renewal"
          ? `${s.software_name} renews ${when}${amount}`
          : `Cancellation deadline for ${s.software_name} is ${when}`;
      const body =
        ev.kind === "renewal"
          ? `Renewal date: ${formatIsoDate(ev.date, workspace.dateFormat)}. Review seats and usage, then record a decision.`
          : `Cancel or change the plan by ${formatIsoDate(ev.date, workspace.dateFormat)} to avoid the next charge.`;
      for (const m of members) {
        const rows = await db()`
          insert into biz_notifications (workspace_id, user_id, kind, title, body, link, dedupe_key)
          values (${workspace.id}, ${m.user_id}, ${ev.kind === "renewal" ? "renewal_reminder" : "cancellation_reminder"}, ${title}, ${body},
            ${`/business/subscriptions/${s.id}`}, ${`${ev.kind}:${s.id}:${ev.date}:${tightest}`})
          on conflict (workspace_id, user_id, dedupe_key) do nothing
          returning id`;
        created += rows.length;
      }
    }
  }
  return created;
}

/** Every workspace, for the cron route. */
export async function syncAllReminders(): Promise<{ workspaces: number; notifications: number }> {
  const rows = await db()`select * from biz_workspaces where notify_in_app`;
  let notifications = 0;
  for (const r of rows) notifications += await syncReminders(mapWorkspace(r), { force: true });
  return { workspaces: rows.length, notifications };
}
