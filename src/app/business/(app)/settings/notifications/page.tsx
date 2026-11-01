import { CopyField } from "@/components/business/copy-field";
import { CalendarLinkForm, NotificationsForm } from "@/components/business/settings-forms";
import { Card, DefinitionList, InlineNote, PageHeader } from "@/components/business/ui";
import { Icon } from "@/components/ui/icon";
import { buttonClass } from "@/components/ui/primitives";
import { can } from "@/lib/business/permissions";
import { calendarFeedPath, calendarToken } from "@/lib/server/business/calendar";
import { requireBizContext } from "@/lib/server/business/context";
import { requestOrigin } from "@/lib/server/origin";

export const metadata = { title: "Notification settings" };

export default async function NotificationSettingsPage() {
  const ctx = await requireBizContext("/business/settings/notifications", { billing: "open" });
  const ws = ctx.workspace;
  const editable = can(ctx.role, "workspace.manage");
  const token = await calendarToken(ctx);
  const feedUrl = token ? `${await requestOrigin()}${calendarFeedPath(token)}` : null;
  return (
    <>
      <PageHeader
        title="Notifications"
        description="When Saver Option reminds your team about renewals and cancellation deadlines."
        crumbs={[{ label: "Settings", href: "/business/settings" }, { label: "Notifications" }]}
      />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Card title="Renewal reminders">
          {editable ? (
            <NotificationsForm workspaceId={ws.id} reminderDays={ws.reminderDays} notifyInApp={ws.notifyInApp} />
          ) : (
            <>
              <p className="mb-4 text-[13px] text-faint">Only owners and admins can change notification settings.</p>
              <DefinitionList
                items={[
                  { label: "Reminder windows", value: ws.reminderDays.length ? `${ws.reminderDays.join(", ")} days before` : "Off" },
                  { label: "In-app notifications", value: ws.notifyInApp ? "On" : "Off" },
                  { label: "Email", value: "Not available" },
                ]}
              />
            </>
          )}
        </Card>
        <Card title="Your calendar" className="lg:col-start-1" action={<Icon name="calendar" size={16} className="text-faint" />}>
          <p className="text-[13.5px] leading-relaxed text-muted">
            See every renewal and cancellation deadline of {ws.name} in Google Calendar, Outlook or Apple Calendar. The link is personal: it
            works only for you, and stops working if you leave the workspace.
          </p>
          {feedUrl ? (
            <div className="mt-4 space-y-4" data-calendar-feed>
              <CopyField value={feedUrl} label="Your calendar link" />
              <div className="flex flex-wrap gap-2">
                <a href="https://calendar.google.com/calendar/u/0/r/settings/addbyurl" target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "sm")}>
                  <Icon name="external" size={14} /> Open Google Calendar
                </a>
                <a href={feedUrl.replace(/^https?:/, "webcal:")} className={buttonClass("secondary", "sm")}>
                  <Icon name="calendar" size={14} /> Open in Apple Calendar or Outlook
                </a>
              </div>
              <ol className="list-decimal space-y-1 pl-5 text-[13px] leading-relaxed text-muted">
                <li>Copy the link above.</li>
                <li>
                  In Google Calendar, open <strong className="font-medium text-fg">Other calendars → + → From URL</strong> (the button above goes straight
                  there), paste it and choose <strong className="font-medium text-fg">Add calendar</strong>.
                </li>
                <li>Renewals and deadlines appear as all-day events in their own calendar, &ldquo;Saver Option · {ws.name}&rdquo;.</li>
              </ol>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                <p className="text-[12.5px] text-faint">Shared it by mistake? Reset it: the old link stops working at once.</p>
                <CalendarLinkForm workspaceId={ws.id} hasLink />
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <CalendarLinkForm workspaceId={ws.id} hasLink={false} />
            </div>
          )}
        </Card>
        <div className="space-y-4 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <InlineNote title="About the calendar">
            Google Calendar refreshes subscribed calendars on its own schedule, usually within a few hours and sometimes up to a day, so a new
            renewal can take a while to appear. Events carry your reminder windows for the calendar apps that use them; in Google Calendar, set
            notifications for this calendar in its settings.
          </InlineNote>
          <InlineNote title="How reminders work">
            For each active or trial subscription with a renewal date, a reminder appears in the notifications of every member when a window is reached (for
            example 30, 14 and 7 days before). The same goes for cancellation deadlines on plans that renew automatically. Each reminder is created once, however
            often the check runs.
          </InlineNote>
          <InlineNote title="When they're checked">
            Whenever anyone opens the business app, and once a day by a scheduled job when the site&apos;s cron secret (CRON_SECRET) is configured.
          </InlineNote>
          <InlineNote title="Per-subscription windows">
            A subscription can use its own reminder days instead of these: set them on the subscription&apos;s edit page.
          </InlineNote>
          <InlineNote tone="warn" title="No email reminders">
            No email provider is configured, so Saver Option doesn&apos;t send email. Reminders are in-app only.
          </InlineNote>
        </div>
      </div>
    </>
  );
}
