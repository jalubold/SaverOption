import type { Metadata } from "next";
import { headers } from "next/headers";
import { AppShell } from "@/components/business/app-shell";
import { billingNotice } from "@/lib/business/billing";
import { can } from "@/lib/business/permissions";
import { accessFor } from "@/lib/server/business/billing";
import { opensWhenLocked, requireBizContext } from "@/lib/server/business/context";
import { getUnreadCount } from "@/lib/server/business/data";
import { syncReminders } from "@/lib/server/business/reminders";

export const metadata: Metadata = {
  title: { default: "Saver Option Business", template: "%s · Saver Option Business" },
  robots: { index: false, follow: false },
};

/** Signed-in business app: requires a session and a workspace membership on every page. */
export default async function BusinessAppLayout({ children }: { children: React.ReactNode }) {
  const path = (await headers()).get("x-so-path") ?? "/business/dashboard";
  // Pages check the plan themselves (that covers in-app navigation); checking here too turns a
  // first visit to a locked page into a plain redirect before anything is streamed.
  const ctx = await requireBizContext(path, { billing: opensWhenLocked(path) ? "open" : undefined });
  // Renewal reminders come due as people use the app (deduplicated in the database).
  try {
    await syncReminders(ctx.workspace);
  } catch (err) {
    console.error("[business] reminder sync failed:", err instanceof Error ? err.message : err);
  }
  const unread = await getUnreadCount(ctx.workspace.id, ctx.user.id);
  const notice = billingNotice(await accessFor(ctx.workspace), { timeZone: ctx.workspace.timeZone, canManage: can(ctx.role, "billing.manage"), now: new Date() });
  return (
    <div className="bg-bg text-fg">
      <AppShell ctx={ctx} unread={unread} notice={notice}>
        {children}
      </AppShell>
    </div>
  );
}
