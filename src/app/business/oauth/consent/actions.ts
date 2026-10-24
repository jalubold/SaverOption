"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { contextForMember, getBizSession, listMemberships, logActivity } from "@/lib/server/business/context";
import { db } from "@/lib/server/db";
import { approveAuthRequest, parseAuthRequest, SCOPE_WRITE, withParams } from "@/lib/server/mcp/oauth";
import { decodePending, PENDING_COOKIE, pendingCookieOptions, urlsFromHeaders } from "@/lib/server/mcp/pending";

async function pendingRequest() {
  const urls = await urlsFromHeaders();
  const raw = decodePending((await cookies()).get(PENDING_COOKIE)?.value);
  if (!raw) redirect("/business/oauth/consent?error=expired");
  const parsed = await parseAuthRequest(raw, urls);
  if (!parsed.ok) redirect(parsed.redirect ?? "/business/oauth/consent?error=request");
  return { urls, parsed };
}

async function clearPending() {
  (await cookies()).set(PENDING_COOKIE, "", { ...pendingCookieOptions, maxAge: 0 });
}

/** The person allowed the connection for one workspace at the access level they picked. */
export async function approveConnectionAction(form: FormData): Promise<void> {
  const { urls, parsed } = await pendingRequest();
  const { user } = await getBizSession();
  if (!user) redirect("/business/login?next=/business/oauth/consent");
  const workspaceId = String(form.get("workspaceId") ?? "");
  const membership = (await listMemberships(user.id)).find((m) => m.workspaceId === workspaceId);
  if (!membership) redirect("/business/oauth/consent?error=workspace");
  const allowWrite = form.get("access") === "write";
  const target = await approveAuthRequest(user, workspaceId, membership.role, parsed.req, allowWrite, urls);
  const ctx = await contextForMember(user.id, workspaceId);
  if (ctx) {
    const [g] = await db()`select scopes from biz_oauth_grants where workspace_id = ${workspaceId} and user_id = ${user.id} and client_id = ${parsed.client.id} and revoked_at is null`;
    const write = Boolean(g?.scopes?.includes(SCOPE_WRITE));
    await logActivity(db(), ctx, {
      action: "mcp.connected",
      entityType: "workspace",
      entityId: workspaceId,
      summary: `Connected an AI client (${(parsed.client.name ?? "unnamed app").slice(0, 60)}) with ${write ? "read and change" : "read-only"} access`,
    });
  }
  await clearPending();
  redirect(target);
}

export async function denyConnectionAction(): Promise<void> {
  const { urls, parsed } = await pendingRequest();
  await clearPending();
  redirect(withParams(parsed.req.redirectUri, { error: "access_denied", error_description: "The request was declined.", state: parsed.req.state, iss: urls.issuer }));
}
