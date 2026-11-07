import { createHash } from "node:crypto";
import { LIFETIME_MAX_CODES, lifetimePlan, planLabels, type PlanId } from "@/lib/business/billing";
import { codeHint, normalizeCode, parseCodeList, type ParsedCodes } from "@/lib/business/lifetime-codes";
import { can } from "@/lib/business/permissions";
import type { Role } from "@/lib/business/constants";
import { db } from "@/lib/server/db";
import { BizError, listMemberships, logActivity, mapWorkspace } from "@/lib/server/business/context";
import { rateLimit } from "@/lib/server/mcp/rate-limit";
import type { SessionUser } from "@/lib/server/supabase";

/**
 * Lifetime codes sold on AppSumo. A buyer redeems one on /business/redeem for a
 * workspace they own or administer; an admin imports codes and deactivates
 * refunded ones on /admin/codes. Only SHA-256 hashes of codes are stored, and
 * the plan a workspace gets is always counted from the codes table (see
 * getBillingRecord), never kept as a separate flag that could drift.
 */

export function codeSha256(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

// ─── Redeeming ───────────────────────────────────────────────────────────────

export interface RedeemTarget {
  workspaceId: string;
  name: string;
  role: Role;
  /** Owners and admins can redeem (the same people who manage billing). */
  canRedeem: boolean;
  /** Active lifetime codes on this workspace already. */
  codes: number;
  plan: PlanId | null;
}

/** The user's real (non-demo) workspaces with their current lifetime plan. */
export async function redeemTargets(user: SessionUser): Promise<RedeemTarget[]> {
  const memberships = (await listMemberships(user.id)).filter((m) => !m.isDemo);
  if (memberships.length === 0) return [];
  const ids = memberships.map((m) => m.workspaceId);
  const rows = await db()`
    select workspace_id, count(*)::int as n from biz_lifetime_codes
    where workspace_id in ${db()(ids)} and redeemed_at is not null and revoked_at is null
    group by workspace_id`;
  const counts = new Map<string, number>(rows.map((r) => [r.workspace_id as string, Number(r.n)]));
  return memberships.map((m) => {
    const codes = counts.get(m.workspaceId) ?? 0;
    return { workspaceId: m.workspaceId, name: m.name, role: m.role, canRedeem: can(m.role, "billing.manage"), codes, plan: lifetimePlan(codes) };
  });
}

export interface Redeemed {
  workspaceName: string;
  plan: PlanId;
  codes: number;
}

/**
 * Applies one code to a workspace, exactly once. The code row is claimed with a
 * conditional update (a code can't be used twice, even by two requests at the
 * same moment), and the workspace's billing row is locked so two codes redeemed
 * together still can't go past LIFETIME_MAX_CODES.
 */
export async function redeemLifetimeCode(user: SessionUser, workspaceId: string, rawCode: string): Promise<Redeemed> {
  const limit = await rateLimit(`lifetime-redeem:${user.id}`, 10, 900);
  if (!limit.ok) throw new BizError("unavailable", `Too many attempts. Try again in ${Math.ceil(limit.retryAfter / 60)} minutes.`);

  const membership = (await listMemberships(user.id)).find((m) => m.workspaceId === workspaceId);
  if (!membership) throw new BizError("forbidden", "You're not a member of that workspace.");
  if (membership.isDemo) throw new BizError("invalid", "The demo workspace can't take a code. Create your company's workspace first.");
  if (!can(membership.role, "billing.manage")) throw new BizError("forbidden", `Only owners and admins of ${membership.name} can redeem a code for it.`);

  const code = normalizeCode(rawCode);
  if (!code) throw new BizError("invalid", "That doesn't look like a code. Copy it from your AppSumo account: letters, numbers and dashes.");
  const hash = codeSha256(code);

  return db().begin(async (sql) => {
    const [ws] = await sql`select * from biz_workspaces where id = ${workspaceId}`;
    if (!ws) throw new BizError("not_found", "That workspace no longer exists.");
    await sql`insert into biz_billing (workspace_id) values (${workspaceId}) on conflict (workspace_id) do nothing`;
    await sql`select 1 from biz_billing where workspace_id = ${workspaceId} for update`;
    const [{ n }] = await sql`
      select count(*)::int as n from biz_lifetime_codes
      where workspace_id = ${workspaceId} and redeemed_at is not null and revoked_at is null`;
    if (n >= LIFETIME_MAX_CODES) {
      throw new BizError("conflict", `${ws.name} already has Business for life, the highest plan. Keep this code for another workspace.`);
    }

    const [claimed] = await sql`
      update biz_lifetime_codes set workspace_id = ${workspaceId}, redeemed_by = ${user.id}, redeemed_at = now()
      where code_sha256 = ${hash} and redeemed_at is null and revoked_at is null
      returning code_hint`;
    if (!claimed) {
      const [row] = await sql`select workspace_id, redeemed_at, revoked_at from biz_lifetime_codes where code_sha256 = ${hash}`;
      if (!row) throw new BizError("invalid", "We couldn't find that code. Check that it matches the code in your AppSumo account.");
      if (row.revoked_at) throw new BizError("invalid", "This code has been deactivated, for example after a refund. Contact us if you think that's a mistake.");
      if (row.workspace_id === workspaceId) throw new BizError("conflict", `This code is already applied to ${ws.name}.`);
      throw new BizError("conflict", "This code has already been redeemed. Each code works once.");
    }

    const codes = Number(n) + 1;
    const plan = lifetimePlan(codes)!;
    await logActivity(sql, { user, workspace: mapWorkspace(ws) }, {
      action: "billing.lifetime_code_redeemed",
      entityType: "workspace",
      entityId: workspaceId,
      summary: `Redeemed a lifetime code (…${claimed.code_hint}): ${planLabels[plan]} for life`,
      details: { codes, plan },
    });
    return { workspaceName: ws.name as string, plan, codes };
  });
}

/** The codes active on a workspace, newest first, for Plan & billing. */
export async function workspaceLifetimeCodes(workspaceId: string): Promise<{ hint: string; redeemedAt: Date }[]> {
  const rows = await db()`
    select code_hint, redeemed_at from biz_lifetime_codes
    where workspace_id = ${workspaceId} and redeemed_at is not null and revoked_at is null
    order by redeemed_at desc`;
  return rows.map((r) => ({ hint: r.code_hint as string, redeemedAt: r.redeemed_at as Date }));
}

// ─── Admin: importing and deactivating ──────────────────────────────────────

const CHUNK = 1000;

function chunks<T>(list: T[]): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += CHUNK) out.push(list.slice(i, i + CHUNK));
  return out;
}

export interface ImportResult {
  parsed: ParsedCodes;
  /** New codes saved. */
  added: number;
  /** Codes that were already there (left unchanged). */
  existing: number;
}

/** Adds codes from a pasted list or CSV. Re-importing the same file adds nothing and changes nothing. */
export async function importLifetimeCodes(text: string, batch: string | null): Promise<ImportResult> {
  const parsed = parseCodeList(text);
  let added = 0;
  if (parsed.codes.length) {
    await db().begin(async (sql) => {
      for (const part of chunks(parsed.codes)) {
        const rows = part.map((c) => ({ code_sha256: codeSha256(c), code_hint: codeHint(c), batch }));
        const res = await sql`insert into biz_lifetime_codes ${sql(rows, "code_sha256", "code_hint", "batch")} on conflict (code_sha256) do nothing returning 1`;
        added += res.length;
      }
    });
  }
  return { parsed, added, existing: parsed.codes.length - added };
}

export interface DeactivateResult {
  parsed: ParsedCodes;
  /** Codes deactivated now. */
  deactivated: number;
  /** Of those, codes that had been redeemed (their workspaces lose that code's plan). */
  wereRedeemed: number;
  /** Codes in the list that were already deactivated. */
  already: number;
  /** Codes in the list that were never imported. */
  unknown: number;
}

/** Deactivates codes (refunded on AppSumo, or withdrawn from sale). A deactivated code can't be redeemed and no longer gives access. */
export async function deactivateLifetimeCodes(text: string, note: string | null): Promise<DeactivateResult> {
  const parsed = parseCodeList(text);
  let deactivated = 0;
  let wereRedeemed = 0;
  let known = 0;
  if (parsed.codes.length) {
    await db().begin(async (sql) => {
      for (const part of chunks(parsed.codes.map(codeSha256))) {
        const [{ n }] = await sql`select count(*)::int as n from biz_lifetime_codes where code_sha256 in ${sql(part)}`;
        known += Number(n);
        const res = await sql`
          update biz_lifetime_codes set revoked_at = now(), revoke_note = ${note}
          where code_sha256 in ${sql(part)} and revoked_at is null
          returning redeemed_at`;
        deactivated += res.length;
        wereRedeemed += res.filter((r) => r.redeemed_at).length;
      }
    });
  }
  return { parsed, deactivated, wereRedeemed, already: known - deactivated, unknown: parsed.codes.length - known };
}

export interface LifetimeStats {
  total: number;
  available: number;
  redeemed: number;
  deactivated: number;
  workspaces: { pro: number; business: number };
  batches: { batch: string | null; total: number; redeemed: number; importedAt: Date }[];
}

export async function lifetimeCodeStats(): Promise<LifetimeStats> {
  const sql = db();
  const [[t], [w], batches] = await Promise.all([
    sql`
      select count(*)::int as total,
        count(*) filter (where redeemed_at is null and revoked_at is null)::int as available,
        count(*) filter (where redeemed_at is not null and revoked_at is null)::int as redeemed,
        count(*) filter (where revoked_at is not null)::int as deactivated
      from biz_lifetime_codes`,
    sql`
      select count(*) filter (where n = 1)::int as pro, count(*) filter (where n >= 2)::int as business
      from (select workspace_id, count(*) as n from biz_lifetime_codes
            where workspace_id is not null and redeemed_at is not null and revoked_at is null group by workspace_id) x`,
    sql`
      select batch, count(*)::int as total, count(*) filter (where redeemed_at is not null)::int as redeemed, min(imported_at) as imported_at
      from biz_lifetime_codes group by batch order by min(imported_at) desc limit 20`,
  ]);
  return {
    total: t.total,
    available: t.available,
    redeemed: t.redeemed,
    deactivated: t.deactivated,
    workspaces: { pro: w.pro, business: w.business },
    batches: batches.map((b) => ({ batch: b.batch, total: b.total, redeemed: b.redeemed, importedAt: b.imported_at })),
  };
}
