import Link from "next/link";
import { markAllNotificationsReadAction, markNotificationReadAction } from "@/app/business/actions/notifications";
import { ActionForm, Submit } from "@/components/business/forms";
import { SoftwareLogo } from "@/components/business/software-logo";
import { Card, EmptyState, InlineNote, PageHeader, Pill } from "@/components/business/ui";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/components/ui/primitives";
import { formatIsoDate } from "@/lib/business/calc";
import { requireBizContext } from "@/lib/server/business/context";
import { getNotifications, getSubscriptions } from "@/lib/server/business/data";

export const metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const ctx = await requireBizContext("/business/notifications");
  const [items, subs] = await Promise.all([getNotifications(ctx, 100), getSubscriptions(ctx.workspace.id)]);
  // Reminders link to their subscription; show that software's logo.
  const subById = new Map(subs.map((s) => [s.id, s]));
  const subjectOf = (link: string | null) => {
    const id = link?.match(/^\/business\/subscriptions\/([0-9a-f-]{36})/)?.[1];
    return id ? subById.get(id) : undefined;
  };
  const unread = items.filter((n) => !n.readAt).length;
  const ws = ctx.workspace.id;
  const fmt = ctx.workspace.dateFormat;

  return (
    <>
      <PageHeader
        title="Notifications"
        crumbs={[{ label: "Overview", href: "/business/dashboard" }, { label: "Notifications" }]}
        description={unread ? `${unread} unread` : "You're all caught up."}
        actions={
          unread > 0 ? (
            <ActionForm action={markAllNotificationsReadAction} workspaceId={ws} showMessages={false}>
              <Submit variant="secondary" size="sm" pendingLabel="Marking…">
                <Icon name="check" size={14} /> Mark all as read
              </Submit>
            </ActionForm>
          ) : undefined
        }
      />
      <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
        <Card bodyClassName="p-0" className="min-w-0">
          {items.length === 0 ? (
            <EmptyState icon="bell" title="No notifications yet">
              Reminders appear here ahead of each subscription&apos;s renewal date and cancellation deadline. Add renewal dates to your subscriptions to get them.
            </EmptyState>
          ) : (
            <ul className="divide-y divide-line">
              {items.map((n) => {
                const subject = subjectOf(n.link);
                return (
                  <li key={n.id} className={cn("flex items-start gap-3 px-4 py-3.5 sm:px-5", !n.readAt && "bg-accent-soft/40")}>
                    <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", n.readAt ? "bg-transparent" : "bg-accent")} aria-hidden="true" />
                    {subject ? (
                      <SoftwareLogo name={subject.softwareName} src={subject.logoSrc} size={34} />
                    ) : (
                      <span aria-hidden="true" className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-subtle text-faint">
                        <Icon name="bell" size={16} />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {n.link ? (
                          <Link href={n.link} className="text-[14px] font-medium text-fg hover:underline">
                            {n.title}
                          </Link>
                        ) : (
                          <span className="text-[14px] font-medium text-fg">{n.title}</span>
                        )}
                        {!n.readAt && <Pill tone="accent">Unread</Pill>}
                      </div>
                      {n.body && <p className="mt-0.5 text-[13px] text-muted">{n.body}</p>}
                      <p className="mt-1 text-[12px] text-faint">{formatIsoDate(n.createdAt.toISOString().slice(0, 10), fmt)}</p>
                    </div>
                    {!n.readAt && (
                      <ActionForm action={markNotificationReadAction} workspaceId={ws} showMessages={false}>
                        <input type="hidden" name="notificationId" value={n.id} />
                        <Submit variant="ghost" size="sm" pendingLabel="…">
                          Mark read
                        </Submit>
                      </ActionForm>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
        <aside className="min-w-0">
          <InlineNote title="About notifications">
            Renewal and cancellation-deadline reminders are delivered here, in the app. Email isn&apos;t sent — no email provider is configured.{" "}
            <Link href="/business/settings/notifications" className="text-accent-ink underline underline-offset-2">
              Reminder settings
            </Link>
          </InlineNote>
        </aside>
      </div>
    </>
  );
}
