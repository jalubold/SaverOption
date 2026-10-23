"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";
import { COMPANY_SIZES } from "@/lib/business/constants";
import { FormReader, isUuid, stateFromErrors, type FormState } from "@/lib/business/form";
import { BizError, businessReady, getBizSession, listMemberships, runAction, WORKSPACE_COOKIE } from "@/lib/server/business/context";
import { createDemoWorkspace, resetDemoWorkspace } from "@/lib/server/business/demo";
import { acceptInvitation } from "@/lib/server/business/team";
import {
  completeOnboarding,
  createWorkspace,
  deleteWorkspace,
  readCompanyInput,
  readPreferencesInput,
  updateCompany,
  updateNotificationSettings,
  updatePreferences,
  validTimeZone,
} from "@/lib/server/business/workspace";

async function selectWorkspace(id: string) {
  (await cookies()).set(WORKSPACE_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

/** Onboarding step 1–2: create the company workspace (the user's explicit action). */
export async function createWorkspaceAction(_prev: FormState, form: FormData): Promise<FormState> {
  try {
    if (!businessReady()) return { error: "Saver Option Business isn't available right now." };
    const { user } = await getBizSession();
    if (!user) return { error: "Your session has expired. Sign in again to continue." };
    const r = new FormReader(form);
    const name = r.requiredText("name", { label: "Company name", max: 80, min: 2 });
    const industry = r.text("industry", { label: "Industry", max: 80 });
    const companySize = r.optionalOneOf("companySize", COMPANY_SIZES, { label: "Company size" });
    const website = r.url("website", { label: "Website" });
    const defaultCurrency = r.currency("defaultCurrency", "USD");
    let timeZone = r.text("timeZone", { label: "Time zone", max: 64 }) ?? "UTC";
    if (!validTimeZone(timeZone)) timeZone = "UTC";
    if (!r.ok) return stateFromErrors(r);
    const id = await createWorkspace(user, { name, industry, companySize, website, defaultCurrency, timeZone });
    await selectWorkspace(id);
    revalidatePath("/business", "layout");
    redirect("/business/onboarding?step=subscription");
  } catch (err) {
    unstable_rethrow(err);
    if (err instanceof BizError) return { error: err.message };
    console.error("[business] create workspace failed:", err instanceof Error ? err.message : err);
    return { error: "The workspace couldn't be created. Please try again." };
  }
}

export async function switchWorkspaceAction(form: FormData): Promise<void> {
  const id = form.get("workspaceId");
  const { user } = await getBizSession();
  if (!user) redirect("/business/login");
  if (isUuid(id) && (await listMemberships(user.id)).some((m) => m.workspaceId === id)) await selectWorkspace(id);
  revalidatePath("/business", "layout");
  redirect("/business/dashboard");
}

export async function createDemoAction(): Promise<void> {
  const { user } = await getBizSession();
  if (!user) redirect("/business/login");
  const id = await createDemoWorkspace(user);
  await selectWorkspace(id);
  revalidatePath("/business", "layout");
  redirect("/business/dashboard");
}

export async function resetDemoAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    await resetDemoWorkspace(ctx);
    revalidatePath("/business", "layout");
    return { ok: true, message: "The demo workspace was reset to its sample data." };
  });
}

export async function acceptInvitationAction(form: FormData): Promise<void> {
  const { user } = await getBizSession();
  if (!user) redirect("/business/login");
  const id = form.get("invitationId");
  if (!isUuid(id)) redirect("/business/onboarding");
  let ws: string;
  try {
    ws = await acceptInvitation(user, id);
  } catch (err) {
    unstable_rethrow(err);
    redirect("/business/onboarding?error=invitation");
  }
  await selectWorkspace(ws);
  revalidatePath("/business", "layout");
  redirect("/business/dashboard");
}

export async function completeOnboardingAction(form: FormData): Promise<void> {
  const { ctx } = await getBizSession();
  if (ctx && form.get("workspaceId") === ctx.workspace.id) await completeOnboarding(ctx);
  revalidatePath("/business", "layout");
  redirect("/business/dashboard");
}

export async function updateCompanyAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const r = new FormReader(form);
    const input = readCompanyInput(r);
    if (!r.ok) return stateFromErrors(r);
    await updateCompany(ctx, input);
    revalidatePath("/business", "layout");
    return { ok: true, message: "Company details saved." };
  });
}

export async function updatePreferencesAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const r = new FormReader(form);
    const input = readPreferencesInput(r, ctx.workspace);
    if (!r.ok) return stateFromErrors(r);
    await updatePreferences(ctx, input);
    revalidatePath("/business", "layout");
    return { ok: true, message: "Preferences saved. Dates and defaults now use them everywhere." };
  });
}

export async function updateNotificationsAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const r = new FormReader(form);
    const days = r.dayList("reminderDays", { label: "Reminder days" }) ?? [];
    const notifyInApp = r.bool("notifyInApp");
    if (!r.ok) return stateFromErrors(r);
    // Email stays off until an email provider is configured; the stored value is kept as-is.
    await updateNotificationSettings(ctx, { reminderDays: days, notifyInApp, notifyEmail: ctx.workspace.notifyEmail });
    revalidatePath("/business", "layout");
    return { ok: true, message: days.length ? "Reminder settings saved." : "Renewal reminders are switched off." };
  });
}

export async function deleteWorkspaceAction(_prev: FormState, form: FormData): Promise<FormState> {
  const result = await runAction(form, async (ctx) => {
    const r = new FormReader(form);
    await deleteWorkspace(ctx, r.requiredText("confirmName", { label: "Workspace name", max: 80 }));
    (await cookies()).delete(WORKSPACE_COOKIE);
    return { ok: true };
  });
  if (!result.ok) return result;
  revalidatePath("/business", "layout");
  redirect("/business/onboarding");
}
