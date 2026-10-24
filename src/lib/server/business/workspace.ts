import { COMPANY_SIZES, DATE_FORMATS, type DateFormat } from "@/lib/business/constants";
import type { FormReader } from "@/lib/business/form";
import { db } from "@/lib/server/db";
import { startTrialIfEligible } from "@/lib/server/business/billing";
import { assertCan, BizError, displayName, logActivity, type BizContext } from "@/lib/server/business/context";
import type { SessionUser } from "@/lib/server/supabase";

/** Workspace creation and settings. */

export interface CompanyInput {
  name: string;
  industry: string | null;
  companySize: string | null;
  website: string | null;
  logoUrl: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
}

export function readCompanyInput(r: FormReader): CompanyInput {
  return {
    name: r.requiredText("name", { label: "Company name", max: 80, min: 2 }),
    industry: r.text("industry", { label: "Industry", max: 80 }),
    companySize: r.optionalOneOf("companySize", COMPANY_SIZES, { label: "Company size" }),
    website: r.url("website", { label: "Website" }),
    logoUrl: r.url("logoUrl", { label: "Logo URL", httpsOnly: true }),
    contactName: r.text("contactName", { label: "Contact name", max: 120 }),
    contactEmail: r.email("contactEmail", { label: "Contact email" }),
    contactPhone: r.text("contactPhone", { label: "Contact phone", max: 40 }),
  };
}

export interface PreferencesInput {
  defaultCurrency: string;
  timeZone: string;
  fiscalYearStart: number;
  dateFormat: DateFormat;
}

export function validTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return tz.length <= 64;
  } catch {
    return false;
  }
}

export function readPreferencesInput(r: FormReader, current: { defaultCurrency: string }): PreferencesInput {
  const timeZone = r.requiredText("timeZone", { label: "Time zone", max: 64 });
  if (timeZone && !validTimeZone(timeZone)) r.fail("timeZone", "Choose a time zone from the list.");
  return {
    defaultCurrency: r.currency("defaultCurrency", current.defaultCurrency),
    timeZone: timeZone || "UTC",
    fiscalYearStart: r.int("fiscalYearStart", { label: "Fiscal year start", min: 1, max: 12, required: true }) ?? 1,
    dateFormat: r.oneOf("dateFormat", DATE_FORMATS, { label: "Date format", fallback: "MMM d, yyyy" }),
  };
}

/**
 * Creates a workspace owned by the user, with the user added to its people
 * directory. Only ever called from an explicit "Create workspace" action.
 * It starts with the free trial if this account hasn't had one.
 */
export async function createWorkspace(
  user: SessionUser,
  input: { name: string; industry: string | null; companySize: string | null; website: string | null; defaultCurrency: string; timeZone: string; isDemo?: boolean },
): Promise<string> {
  const [{ n }] = await db()`select count(*)::int as n from biz_memberships where user_id = ${user.id} and role = 'owner'`;
  if (n >= 10) throw new BizError("invalid", "You already own 10 workspaces, the most one account can create.");
  return db().begin(async (sql) => {
    const [ws] = await sql`
      insert into biz_workspaces (name, industry, company_size, website, default_currency, time_zone, is_demo, created_by)
      values (${input.name}, ${input.industry}, ${input.companySize}, ${input.website}, ${input.defaultCurrency}, ${input.timeZone}, ${input.isDemo ?? false}, ${user.id})
      returning id`;
    const [person] = await sql`
      insert into biz_people (workspace_id, name, email, user_id) values (${ws.id}, ${displayName(user)}, ${user.email}, ${user.id}) returning id`;
    await sql`insert into biz_memberships (workspace_id, user_id, role, person_id) values (${ws.id}, ${user.id}, 'owner', ${person.id})`;
    // The free trial, once per account (the demo workspace isn't billed).
    if (!input.isDemo) await startTrialIfEligible(sql, user, ws.id);
    await sql`
      insert into biz_activity (workspace_id, actor_id, actor_name, action, entity_type, entity_id, summary)
      values (${ws.id}, ${user.id}, ${displayName(user)}, 'workspace.created', 'workspace', ${ws.id}, ${`Created the ${input.name} workspace`})`;
    return ws.id as string;
  });
}

export async function updateCompany(ctx: BizContext, input: CompanyInput): Promise<void> {
  assertCan(ctx, "workspace.manage", "Only owners and admins can change company details.");
  await db().begin(async (sql) => {
    await sql`
      update biz_workspaces set name = ${input.name}, industry = ${input.industry}, company_size = ${input.companySize}, website = ${input.website},
        logo_url = ${input.logoUrl}, contact_name = ${input.contactName}, contact_email = ${input.contactEmail}, contact_phone = ${input.contactPhone},
        updated_at = now()
      where id = ${ctx.workspace.id}`;
    await logActivity(sql, ctx, { action: "workspace.company_updated", entityType: "workspace", entityId: ctx.workspace.id, summary: "Updated company details" });
  });
}

export async function updatePreferences(ctx: BizContext, input: PreferencesInput): Promise<void> {
  assertCan(ctx, "workspace.manage", "Only owners and admins can change workspace preferences.");
  await db().begin(async (sql) => {
    await sql`
      update biz_workspaces set default_currency = ${input.defaultCurrency}, time_zone = ${input.timeZone}, fiscal_year_start = ${input.fiscalYearStart},
        date_format = ${input.dateFormat}, updated_at = now()
      where id = ${ctx.workspace.id}`;
    await logActivity(sql, ctx, { action: "workspace.preferences_updated", entityType: "workspace", entityId: ctx.workspace.id, summary: "Updated workspace preferences" });
  });
}

export async function updateNotificationSettings(ctx: BizContext, input: { reminderDays: number[]; notifyInApp: boolean; notifyEmail: boolean }): Promise<void> {
  assertCan(ctx, "workspace.manage", "Only owners and admins can change notification settings.");
  await db().begin(async (sql) => {
    await sql`
      update biz_workspaces set reminder_days = ${input.reminderDays}, notify_in_app = ${input.notifyInApp}, notify_email = ${input.notifyEmail}, updated_at = now()
      where id = ${ctx.workspace.id}`;
    await logActivity(sql, ctx, {
      action: "workspace.notifications_updated",
      entityType: "workspace",
      entityId: ctx.workspace.id,
      summary: `Renewal reminders set to ${input.reminderDays.length ? input.reminderDays.join(", ") + " days before" : "off"}`,
    });
  });
}

export async function completeOnboarding(ctx: BizContext): Promise<void> {
  await db()`update biz_workspaces set onboarding_completed_at = coalesce(onboarding_completed_at, now()) where id = ${ctx.workspace.id}`;
}

/** Permanently deletes the workspace and everything in it. Owners only, confirmed by typing the name. */
export async function deleteWorkspace(ctx: BizContext, confirmName: string): Promise<void> {
  assertCan(ctx, "workspace.own", "Only the workspace owner can delete it.");
  if (confirmName.trim() !== ctx.workspace.name) throw new BizError("invalid", "Type the workspace name exactly to confirm.");
  await db()`delete from biz_workspaces where id = ${ctx.workspace.id}`;
}
