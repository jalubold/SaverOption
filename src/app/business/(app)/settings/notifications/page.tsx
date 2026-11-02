import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarConnect } from "@/components/business/calendar-connect";
import { CalendarLinkForm, NotificationsForm } from "@/components/business/settings-forms";
import { Card, DefinitionList, PageHeader, Pill } from "@/components/business/ui";
import { Icon, type IconProps } from "@/components/ui/icon";
import { can } from "@/lib/business/permissions";
import { calendarClientLabels, calendarStatus } from "@/lib/server/business/calendar";
import { requireBizContext } from "@/lib/server/business/context";

export const metadata = { title: "Notification settings" };

/** "30, 14 and 7" */
function daysList(days: number[]): string {
  const sorted = [...days].sort((a, b) => b - a).map(String);
  return sorted.length > 1 ? `${sorted.slice(0, -1).join(", ")} and ${sorted.at(-1)}` : (sorted[0] ?? "");
}

export default async function NotificationSettingsPage() {
  const ctx = await requireBizContext("/business/settings/notifications", { billing: "open" });
  const ws = ctx.workspace;
  const editable = can(ctx.role, "workspace.manage");
  const calendar = await calendarStatus(ctx);
  const calendarApp = calendar.fetchedAt && calendar.client ? calendarClientLabels[calendar.client] : null;
  // The daily check runs only where the site's scheduled job is set up.
  const daily = Boolean(process.env.CRON_SECRET);
  const windows = ws.reminderDays.length ? `${daysList(ws.reminderDays)} days before` : null;
  const inApp = ws.notifyInApp && windows !== null;

  return (
    <>
      <PageHeader
        title="Notifications"
        description="How your team hears about renewals and cancellation deadlines before they happen."
        crumbs={[{ label: "Settings", href: "/business/settings" }, { label: "Notifications" }]}
      />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="space-y-5">
          <Card title="Renewal reminders" description="When everyone in the workspace gets a heads-up, for each renewal and cancel-by date.">
            {editable ? (
              <NotificationsForm workspaceId={ws.id} reminderDays={ws.reminderDays} notifyInApp={ws.notifyInApp} />
            ) : (
              <>
                <p className="mb-4 text-[13px] text-faint">Only owners and admins can change these.</p>
                <DefinitionList
                  items={[
                    { label: "Reminder windows", value: windows ?? "Off" },
                    { label: "In-app notifications", value: ws.notifyInApp ? "On" : "Off" },
                    { label: "Email", value: "Not available" },
                  ]}
                />
              </>
            )}
            <Footnote>A subscription can use its own days instead of these: set them on its edit page.</Footnote>
          </Card>

          <Card title="Your calendar" description="Renewals and cancel-by dates as all-day events. Personal to you." id="calendar" className="scroll-mt-24">
            <CalendarConnect ctx={ctx} />
            <Footnote>
              Google refreshes subscribed calendars on its own schedule, often every few hours and sometimes once a day, so a new renewal can take a while to show
              there. For pop-up alerts, turn on notifications for this calendar in Google Calendar.
            </Footnote>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[12.5px] text-faint">Shared your link by mistake? Reset it and the old one stops working at once.</p>
              <CalendarLinkForm workspaceId={ws.id} />
            </div>
          </Card>
        </div>

        {/* One summary instead of a stack of notes: where reminders show up, and whether each is on. */}
        <Card title="Where reminders show up" className="lg:sticky lg:top-20" bodyClassName="!p-0">
          <ul className="divide-y divide-line" data-reminder-channels>
            <Channel icon="bell" title="In the app" status={inApp ? <Pill tone="success">On</Pill> : <Pill tone="outline">Off</Pill>}>
              {inApp ? `Under the bell for every member, ${windows} each renewal and cancel-by date. Each reminder is sent once.` : "Switched off for this workspace."}
            </Channel>
            <Channel icon="calendar" title="Your calendar" status={calendarApp ? <Pill tone="success">Connected</Pill> : <Pill tone="outline">Not connected</Pill>}>
              {calendarApp ? (
                calendar.client === "other" ? "Your calendar app has your renewals." : `${calendarApp} has your renewals.`
              ) : (
                <>
                  Add it in two clicks.{" "}
                  <Link href="#calendar" className="font-medium text-accent-ink hover:underline">
                    Set it up
                  </Link>
                </>
              )}
            </Channel>
            <Channel icon="mail" title="Email" status={<Pill tone="outline">Not available</Pill>}>
              Saver Option doesn&apos;t send email reminders yet.
            </Channel>
          </ul>
          <p className="flex gap-2 rounded-b-[inherit] border-t border-line bg-subtle/60 px-5 py-3 text-[12px] leading-relaxed text-faint">
            <Icon name="refresh" size={13} className="mt-0.5 shrink-0" />
            {daily ? "Checked whenever someone opens the app, and once a day automatically." : "Checked whenever someone opens the app."}
          </p>
        </Card>
      </div>
    </>
  );
}

function Footnote({ children }: { children: ReactNode }) {
  return (
    <p className="mt-5 flex gap-2 border-t border-line pt-4 text-[12.5px] leading-relaxed text-muted">
      <Icon name="info" size={14} className="mt-0.5 shrink-0 text-faint" />
      <span>{children}</span>
    </p>
  );
}

function Channel({ icon, title, status, children }: { icon: IconProps["name"]; title: string; status: ReactNode; children: ReactNode }) {
  return (
    <li className="flex gap-3 px-5 py-4">
      <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-subtle text-muted">
        <Icon name={icon} size={15} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[13.5px] font-semibold text-fg">{title}</p>
          {status}
        </div>
        <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">{children}</p>
      </div>
    </li>
  );
}
