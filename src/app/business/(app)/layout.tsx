import type { Metadata } from "next";
import { headers } from "next/headers";
import { AppShell } from "@/components/business/app-shell";
import { requireBizContext } from "@/lib/server/business/context";
import { getUnreadCount } from "@/lib/server/business/data";
import { syncReminders } from "@/lib/server/business/reminders";

export const metadata: Metadata = {
  title: { default: "Saver Option Business", template: "%s · Saver Option Business" },
  robots: { index: false, follow: false },
};

/** Signed-in business app: requires a session and a workspace membership on every page. */
export default async function BusinessAppLayout({ children }: { children: React.ReactNode }) {
  const path = (await headers()).get("x-so-path") ?? "/business/dashboard";
  const ctx = await requireBizContext(path);
  // Renewal reminders come due as people use the app (deduplicated in the database).
  try {
    await syncReminders(ctx.workspace);
  } catch (err) {
    console.error("[business] reminder sync failed:", err instanceof Error ? err.message : err);
  }
  const unread = await getUnreadCount(ctx.workspace.id, ctx.user.id);
  return (
    <div className="bg-bg text-fg">
      <AppShell ctx={ctx} unread={unread}>
        {children}
      </AppShell>
    </div>
  );
}
