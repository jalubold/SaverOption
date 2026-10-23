"use server";

import { revalidatePath } from "next/cache";
import { isUuid, type FormState } from "@/lib/business/form";
import { runAction } from "@/lib/server/business/context";
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
