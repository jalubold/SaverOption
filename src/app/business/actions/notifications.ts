"use server";

import { revalidatePath } from "next/cache";
import { isUuid, type FormState } from "@/lib/business/form";
import { dismissCalendarPrompt, setCalendarToken } from "@/lib/server/business/calendar";
import { getBizSession, runAction } from "@/lib/server/business/context";
import { markNotificationsRead } from "@/lib/server/business/savings-sync";

/** Marks one of the user's own notifications as read (scoped to their user and workspace). */
export async function markNotificationReadAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const id = form.get("notificationId");
    if (!isUuid(id)) return { error: "That notification wasn't found." };
    await markNotificationsRead(ctx, [id.toLowerCase()]);
    revalidatePath("/business", "layout");
    return { ok: true };
  });
}

export async function markAllNotificationsReadAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    await markNotificationsRead(ctx, "all");
    revalidatePath("/business", "layout");
    return { ok: true, message: "All notifications marked as read." };
  });
}

/** Creates the member's own calendar link, or replaces it with a new one ("intent" = reset). */
export async function calendarLinkAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(
    form,
    async (ctx) => {
      const reset = form.get("intent") === "reset";
      await setCalendarToken(ctx, { reset });
      revalidatePath("/business/settings/notifications");
      return { ok: true, message: reset ? "New calendar link created. The old one no longer works." : "Your calendar link is ready." };
    },
    { billing: "open" },
  );
}

/** Hides the dashboard's "renewals in your calendar" suggestion for this member. */
export async function dismissCalendarPromptAction(form: FormData): Promise<void> {
  const { ctx } = await getBizSession();
  if (ctx && form.get("workspaceId") === ctx.workspace.id) await dismissCalendarPrompt(ctx);
  revalidatePath("/business/dashboard");
}
