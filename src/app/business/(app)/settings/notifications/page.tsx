import { NotificationsForm } from "@/components/business/settings-forms";
import { Card, DefinitionList, InlineNote, PageHeader } from "@/components/business/ui";
import { can } from "@/lib/business/permissions";
import { requireBizContext } from "@/lib/server/business/context";

export const metadata = { title: "Notification settings" };

export default async function NotificationSettingsPage() {
  const ctx = await requireBizContext("/business/settings/notifications");
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
        <div className="space-y-4">
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
