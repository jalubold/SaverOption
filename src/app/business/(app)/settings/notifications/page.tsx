import { CalendarConnect } from "@/components/business/calendar-connect";
import { CalendarLinkForm, NotificationsForm } from "@/components/business/settings-forms";
import { Card, DefinitionList, InlineNote, PageHeader } from "@/components/business/ui";
import { Icon } from "@/components/ui/icon";
import { can } from "@/lib/business/permissions";
import { requireBizContext } from "@/lib/server/business/context";

export const metadata = { title: "Notification settings" };

export default async function NotificationSettingsPage() {
  const ctx = await requireBizContext("/business/settings/notifications", { billing: "open" });
  const ws = ctx.workspace;
  const editable = can(ctx.role, "workspace.manage");
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
        <Card title="Your calendar" className="lg:col-start-1" action={<Icon name="calendar" size={16} className="text-faint" />} id="calendar">
          <p className="mb-4 text-[13.5px] leading-relaxed text-muted">
            Every renewal and cancellation deadline of {ws.name} in Google Calendar, Apple Calendar or Outlook. It&apos;s personal: it works only for you,
            and stops working if you leave the workspace.
          </p>
          <CalendarConnect ctx={ctx} showLink />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <p className="text-[12.5px] text-faint">Shared your link by mistake? Reset it: the old one stops working at once.</p>
            <CalendarLinkForm workspaceId={ws.id} />
          </div>
        </Card>
        <div className="space-y-4 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <InlineNote title="About the calendar">
            Google Calendar refreshes subscribed calendars on its own schedule, often every few hours and sometimes only once a day, so a new
            renewal can take a while to appear there. Events carry your reminder windows for the calendar apps that use them; in Google Calendar,
            set notifications for this calendar in its settings. &ldquo;Connected&rdquo; means a calendar app has fetched your link.
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
