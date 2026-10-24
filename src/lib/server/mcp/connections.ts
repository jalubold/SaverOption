import { can } from "@/lib/business/permissions";
import { BizError, logActivity, type BizContext } from "@/lib/server/business/context";
import { db } from "@/lib/server/db";
import { revokeGrantById, SCOPE_WRITE } from "@/lib/server/mcp/oauth";

/** AI client (MCP) connections to a workspace, for Settings → AI clients. */

export interface Connection {
  id: string;
  clientName: string | null;
  clientUri: string | null;
  userId: string;
  userLabel: string;
  canWrite: boolean;
  createdAt: Date;
  lastUsedAt: Date | null;
  revokedAt: Date | null;
}

/** Owners and admins see every connection; others see their own. */
export async function listConnections(ctx: BizContext, opts: { includeRevoked?: boolean } = {}): Promise<Connection[]> {
  const all = can(ctx.role, "members.manage");
  const rows = await db()`
    select g.id, g.user_id, g.scopes, g.created_at, g.last_used_at, g.revoked_at, c.client_name, c.client_uri,
      coalesce(nullif(to_jsonb(u)->'raw_user_meta_data'->>'full_name', ''), u.email) as user_label
    from biz_oauth_grants g
    join biz_oauth_clients c on c.id = g.client_id
    left join auth.users u on u.id = g.user_id
    where g.workspace_id = ${ctx.workspace.id}
      and (${all} or g.user_id = ${ctx.user.id})
      and (${opts.includeRevoked ?? false} or g.revoked_at is null)
    order by g.revoked_at nulls first, coalesce(g.last_used_at, g.created_at) desc
    limit 100`;
  return rows.map((r) => ({
    id: r.id,
    clientName: r.client_name,
    clientUri: r.client_uri,
    userId: r.user_id,
    userLabel: r.user_label ?? "A former member",
    canWrite: (r.scopes as string[]).includes(SCOPE_WRITE),
    createdAt: r.created_at,
    lastUsedAt: r.last_used_at,
    revokedAt: r.revoked_at,
  }));
}

export async function disconnect(ctx: BizContext, grantId: string): Promise<void> {
  const [g] = await db()`
    select g.id, g.user_id, g.revoked_at, c.client_name from biz_oauth_grants g join biz_oauth_clients c on c.id = g.client_id
    where g.workspace_id = ${ctx.workspace.id} and g.id = ${grantId}`;
  if (!g) throw new BizError("not_found", "That connection isn't in this workspace.");
  if (g.user_id !== ctx.user.id && !can(ctx.role, "members.manage")) throw new BizError("forbidden", "Only owners and admins can disconnect other people's AI clients.");
  if (g.revoked_at) return;
  await revokeGrantById(grantId);
  await logActivity(db(), ctx, {
    action: "mcp.disconnected",
    entityType: "workspace",
    entityId: ctx.workspace.id,
    summary: `Disconnected an AI client (${String(g.client_name ?? "unnamed app").slice(0, 60)})`,
  });
}
