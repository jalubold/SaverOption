import { cookies } from "next/headers";
import type postgres from "postgres";
import { redirect, unstable_rethrow } from "next/navigation";
import { cache } from "react";
import { todayIn } from "@/lib/business/calc";
import type { DateFormat, Role } from "@/lib/business/constants";
import type { FormState } from "@/lib/business/form";
import { can, type Capability } from "@/lib/business/permissions";
import { hasPremium } from "@/lib/business/billing";
import { accessFor, assertPremium } from "@/lib/server/business/billing";
import { db, dbConfigured } from "@/lib/server/db";
import { authConfigured, getUser, type SessionUser } from "@/lib/server/supabase";

/**
 * Who is signed in to Saver Option Business, which workspace they're working
 * in and with which role. Every business page and server action goes through
 * here: authentication (a verified Supabase session) and authorization (an
 * actual membership row for the workspace) are checked separately, and every
 * query afterwards is scoped to ctx.workspace.id.
 */

export const WORKSPACE_COOKIE = "so_biz_ws";

export interface BizWorkspace {
  id: string;
  name: string;
  industry: string | null;
  companySize: string | null;
  website: string | null;
  logoUrl: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  defaultCurrency: string;
  timeZone: string;
  fiscalYearStart: number;
  dateFormat: DateFormat;
  reminderDays: number[];
  notifyInApp: boolean;
  notifyEmail: boolean;
  isDemo: boolean;
  onboardingCompletedAt: Date | null;
  createdAt: Date;
}

export interface MembershipSummary {
  workspaceId: string;
  name: string;
  role: Role;
  isDemo: boolean;
}

export interface BizContext {
  user: SessionUser;
  workspace: BizWorkspace;
  role: Role;
  /** The user's entry in the people directory, if linked (used for "records I own"). */
  personId: string | null;
  memberships: MembershipSummary[];
  /** Today in the workspace's time zone, YYYY-MM-DD. */
  today: string;
}

/** An expected failure with a message that's safe to show. */
export class BizError extends Error {
  constructor(
    readonly code: "auth" | "forbidden" | "not_found" | "conflict" | "invalid" | "stale" | "unavailable" | "locked",
    message: string,
  ) {
    super(message);
  }
}

export function businessReady(): boolean {
  return dbConfigured() && authConfigured();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapWorkspace(r: any): BizWorkspace {
  return {
    id: r.id,
    name: r.name,
    industry: r.industry,
    companySize: r.company_size,
    website: r.website,
    logoUrl: r.logo_url,
    contactName: r.contact_name,
    contactEmail: r.contact_email,
    contactPhone: r.contact_phone,
    defaultCurrency: r.default_currency,
    timeZone: r.time_zone,
    fiscalYearStart: Number(r.fiscal_year_start),
    dateFormat: r.date_format,
    reminderDays: (r.reminder_days ?? []).map(Number),
    notifyInApp: r.notify_in_app,
    notifyEmail: r.notify_email,
    isDemo: r.is_demo,
    onboardingCompletedAt: r.onboarding_completed_at,
    createdAt: r.created_at,
  };
}

export const listMemberships = cache(async (userId: string): Promise<(MembershipSummary & { personId: string | null })[]> => {
  const rows = await db()`
    select m.workspace_id, m.role, m.person_id, w.name, w.is_demo
    from biz_memberships m join biz_workspaces w on w.id = m.workspace_id
    where m.user_id = ${userId}
    order by w.is_demo, w.created_at`;
  return rows.map((r) => ({ workspaceId: r.workspace_id, name: r.name, role: r.role, isDemo: r.is_demo, personId: r.person_id }));
});

/** The current user and business context; ctx is null when they have no workspace yet. */
export const getBizSession = cache(async (): Promise<{ user: SessionUser | null; ctx: BizContext | null }> => {
  if (!businessReady()) return { user: null, ctx: null };
  const user = await getUser();
  if (!user) return { user: null, ctx: null };
  const memberships = await listMemberships(user.id);
  if (memberships.length === 0) return { user, ctx: null };
  const wanted = (await cookies()).get(WORKSPACE_COOKIE)?.value;
  const current = memberships.find((m) => m.workspaceId === wanted) ?? memberships[0];
  const [row] = await db()`select * from biz_workspaces where id = ${current.workspaceId}`;
  if (!row) return { user, ctx: null };
  const workspace = mapWorkspace(row);
  return {
    user,
    ctx: {
      user,
      workspace,
      role: current.role,
      personId: current.personId,
      memberships: memberships.map(({ personId: _p, ...m }) => m),
      today: todayIn(workspace.timeZone),
    },
  };
});

/**
 * Context for a request authorized by an MCP access token instead of a browser
 * session: the same membership and role lookup, for the one workspace the
 * connection was granted. Null when the person is no longer a member, so a
 * removed member's connections stop working immediately.
 */
export async function contextForMember(userId: string, workspaceId: string): Promise<BizContext | null> {
  if (!businessReady()) return null;
  const memberships = await listMemberships(userId);
  const current = memberships.find((m) => m.workspaceId === workspaceId);
  if (!current) return null;
  const [[row], [u]] = await Promise.all([
    db()`select * from biz_workspaces where id = ${workspaceId}`,
    // to_jsonb keeps this working whichever auth.users columns the database has.
    db()`select u.id, u.email, to_jsonb(u)->>'email_confirmed_at' as email_confirmed_at, to_jsonb(u)->'raw_user_meta_data' as meta from auth.users u where u.id = ${userId}`,
  ]);
  if (!row || !u?.email) return null;
  const meta = (u.meta ?? {}) as Record<string, unknown>;
  const name = typeof meta.full_name === "string" ? meta.full_name : typeof meta.name === "string" ? meta.name : null;
  const user: SessionUser = { id: u.id, email: String(u.email).toLowerCase(), emailConfirmed: Boolean(u.email_confirmed_at), name: name ? name.slice(0, 120) : null, avatarUrl: null };
  const workspace = mapWorkspace(row);
  return {
    user,
    workspace,
    role: current.role,
    personId: current.personId,
    memberships: [{ workspaceId: current.workspaceId, name: current.name, role: current.role, isDemo: current.isDemo }],
    today: todayIn(workspace.timeZone),
  };
}

/** Post-sign-in destinations are limited to the business app's own pages. */
export function safeBusinessNext(value: unknown, fallback = "/business/dashboard"): string {
  if (typeof value !== "string" || value.length > 300) return fallback;
  if (!/^\/business(\/[A-Za-z0-9\-_/]*)?(\?[A-Za-z0-9\-_=&%.]*)?$/.test(value)) return fallback;
  if (value.includes("//") || value.startsWith("/business/login") || value.startsWith("/business/signup")) return fallback;
  return value;
}

/** For pages that only need a signed-in user (onboarding). */
export async function requireBizUser(next: string): Promise<SessionUser> {
  const { user } = await getBizSession();
  if (!user) redirect(`/business/login?next=${encodeURIComponent(safeBusinessNext(next))}`);
  return user;
}

/**
 * Which pages and actions stay open when a workspace's trial or subscription
 * has ended: account and workspace settings, members, billing and security.
 * Everything else ("premium") needs an active trial or subscription.
 */
export interface AccessOptions {
  billing?: "open";
}

/** The app paths that stay open when the plan has ended (their pages pass { billing: "open" }). */
export function opensWhenLocked(path: string): boolean {
  const p = path.split(/[?#]/)[0];
  if (p === "/business/settings/departments") return false;
  return p === "/business/team" || p === "/business/settings" || p.startsWith("/business/settings/");
}

/** For app pages: signed in and a member of a workspace, or sent to sign-in / onboarding (or to Billing when the plan has ended). */
export async function requireBizContext(next: string, opts: AccessOptions = {}): Promise<BizContext> {
  const { user, ctx } = await getBizSession();
  if (!user) redirect(`/business/login?next=${encodeURIComponent(safeBusinessNext(next))}`);
  if (!ctx) redirect("/business/onboarding");
  if (opts.billing !== "open" && !hasPremium(await accessFor(ctx.workspace))) redirect("/business/settings/billing?locked=1");
  return ctx;
}

export function assertCan(ctx: BizContext, capability: Capability, message = "Your role doesn't allow this change."): void {
  if (!can(ctx.role, capability)) throw new BizError("forbidden", message);
}

/**
 * Context for a server action. Never redirects: an expired session or a
 * workspace switched in another tab becomes an error message instead, so the
 * user's typed input stays on screen.
 */
export async function actionContext(form: FormData | null, opts: AccessOptions = {}): Promise<BizContext> {
  if (!businessReady()) throw new BizError("unavailable", "Saver Option Business isn't available right now.");
  const { user, ctx } = await getBizSession();
  if (!user) throw new BizError("auth", "Your session has expired. Sign in again to continue.");
  if (!ctx) throw new BizError("forbidden", "You don't have access to a workspace yet.");
  const posted = form?.get("workspaceId");
  if (form && posted !== ctx.workspace.id) {
    throw new BizError("stale", "You switched to another workspace in a different tab. Reload this page and try again.");
  }
  if (opts.billing !== "open") await assertPremium(ctx);
  return ctx;
}

/** Runs a server action body with consistent error handling. */
export async function runAction(form: FormData | null, fn: (ctx: BizContext) => Promise<FormState>, opts: AccessOptions = {}): Promise<FormState> {
  try {
    const ctx = await actionContext(form, opts);
    return await fn(ctx);
  } catch (err) {
    unstable_rethrow(err);
    if (err instanceof BizError) return { error: err.message };
    const code = (err as { code?: string })?.code;
    if (code === "23505") return { error: "That already exists. Check for a record with the same name." };
    if (code === "23503") return { error: "Something this refers to no longer exists. Reload the page and try again." };
    console.error("[business] action failed:", err instanceof Error ? err.message : err);
    return { error: "Something went wrong and nothing was saved. Please try again." };
  }
}

/** Display name for the activity log and member lists. */
export function displayName(user: SessionUser): string {
  return user.name ?? user.email.split("@")[0];
}

/** The shared client or a transaction from `db().begin(...)`. */
export type Db = postgres.Sql | postgres.TransactionSql;

export interface ActivityEntry {
  action: string;
  entityType?: string;
  entityId?: string | null;
  summary: string;
  details?: Record<string, unknown>;
}

/** Appends to the workspace's audit log (inside the caller's transaction when given). */
export async function logActivity(sql: Db, ctx: Pick<BizContext, "user" | "workspace">, e: ActivityEntry): Promise<void> {
  await sql`
    insert into biz_activity (workspace_id, actor_id, actor_name, action, entity_type, entity_id, summary, details)
    values (${ctx.workspace.id}, ${ctx.user.id}, ${displayName(ctx.user)}, ${e.action}, ${e.entityType ?? null}, ${e.entityId ?? null},
      ${e.summary.slice(0, 300)}, ${e.details ? sql.json(e.details as never) : null})`;
}
