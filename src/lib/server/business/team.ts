import { roleLabels, type Role } from "@/lib/business/constants";
import { assignableRoles, canEditRecord, canManageMember } from "@/lib/business/permissions";
import { db } from "@/lib/server/db";
import { assertCan, BizError, displayName, logActivity, type BizContext, type Db } from "@/lib/server/business/context";
import type { SessionUser } from "@/lib/server/supabase";

/** Members, access invitations, the people directory, departments and seat assignments. */

// ─── Members and invitations ────────────────────────────────────────────────

/**
 * Gives an email address access with a role. No email is sent — none is
 * configured — so the inviter shares the sign-in link; the invitee accepts after
 * signing in with Google using that address.
 */
export async function inviteMember(ctx: BizContext, email: string, role: Role): Promise<void> {
  assertCan(ctx, "members.manage", "Only owners and admins can invite members.");
  if (!assignableRoles(ctx.role).includes(role)) throw new BizError("forbidden", `Your role can't grant ${roleLabels[role]} access.`);
  const ws = ctx.workspace.id;
  await db().begin(async (sql) => {
    const [member] = await sql`
      select 1 from biz_memberships m join auth.users u on u.id = m.user_id
      where m.workspace_id = ${ws} and lower(u.email) = ${email}`;
    if (member) throw new BizError("conflict", `${email} is already a member.`);
    const [{ n }] = await sql`select count(*)::int as n from biz_invitations where workspace_id = ${ws} and accepted_at is null and revoked_at is null`;
    if (n >= 50) throw new BizError("invalid", "This workspace has 50 open invitations. Revoke some first.");
    await sql`insert into biz_invitations (workspace_id, email, role, invited_by) values (${ws}, ${email}, ${role}, ${ctx.user.id})`;
    await logActivity(sql, ctx, { action: "member.invited", entityType: "workspace", entityId: ws, summary: `Gave ${email} ${roleLabels[role]} access (pending sign-in)` });
  });
}

export async function revokeInvitation(ctx: BizContext, id: string): Promise<void> {
  assertCan(ctx, "members.manage", "Only owners and admins can revoke invitations.");
  await db().begin(async (sql) => {
    const [row] = await sql`
      update biz_invitations set revoked_at = now()
      where workspace_id = ${ctx.workspace.id} and id = ${id} and accepted_at is null and revoked_at is null
      returning email`;
    if (!row) throw new BizError("not_found", "That invitation is no longer open.");
    await logActivity(sql, ctx, { action: "member.invitation_revoked", entityType: "workspace", entityId: ctx.workspace.id, summary: `Revoked access for ${row.email}` });
  });
}

/** Accepts an invitation for the signed-in user. The Google-verified email must match. */
export async function acceptInvitation(user: SessionUser, invitationId: string): Promise<string> {
  if (!user.emailConfirmed) throw new BizError("forbidden", "Your email address isn't verified.");
  return db().begin(async (sql) => {
    const [inv] = await sql`
      select * from biz_invitations where id = ${invitationId} and accepted_at is null and revoked_at is null for update`;
    if (!inv || inv.email !== user.email) throw new BizError("not_found", "That invitation isn't available for your account.");
    const ws = inv.workspace_id as string;
    let [person] = await sql`select id from biz_people where workspace_id = ${ws} and (user_id = ${user.id} or email = ${user.email}) order by user_id nulls last limit 1`;
    if (person) await sql`update biz_people set user_id = ${user.id}, status = 'active', updated_at = now() where id = ${person.id}`;
    else [person] = await sql`insert into biz_people (workspace_id, name, email, user_id) values (${ws}, ${displayName(user)}, ${user.email}, ${user.id}) returning id`;
    await sql`
      insert into biz_memberships (workspace_id, user_id, role, person_id) values (${ws}, ${user.id}, ${inv.role}, ${person.id})
      on conflict (workspace_id, user_id) do nothing`;
    await sql`update biz_invitations set accepted_at = now(), accepted_by = ${user.id} where id = ${invitationId}`;
    await sql`
      insert into biz_activity (workspace_id, actor_id, actor_name, action, entity_type, entity_id, summary)
      values (${ws}, ${user.id}, ${displayName(user)}, 'member.joined', 'workspace', ${ws}, ${`${displayName(user)} joined as ${roleLabels[inv.role as Role]}`})`;
    return ws;
  });
}

export async function changeMemberRole(ctx: BizContext, membershipId: string, role: Role): Promise<void> {
  assertCan(ctx, "members.manage", "Only owners and admins can change roles.");
  await db().begin(async (sql) => {
    const [m] = await sql`select * from biz_memberships where workspace_id = ${ctx.workspace.id} and id = ${membershipId} for update`;
    if (!m) throw new BizError("not_found", "That member wasn't found.");
    if (m.user_id === ctx.user.id) throw new BizError("forbidden", "You can't change your own role.");
    if (!canManageMember(ctx.role, m.role) || !assignableRoles(ctx.role).includes(role)) throw new BizError("forbidden", "Your role can't make that change.");
    await sql`update biz_memberships set role = ${role}, updated_at = now() where id = ${membershipId}`;
    await logActivity(sql, ctx, { action: "member.role_changed", entityType: "workspace", entityId: ctx.workspace.id, summary: `Changed a member's role from ${roleLabels[m.role as Role]} to ${roleLabels[role]}` });
  });
}

/** Removes a member (or lets a non-owner leave). Their directory entry and seats stay. */
export async function removeMember(ctx: BizContext, membershipId: string): Promise<{ self: boolean }> {
  return db().begin(async (sql) => {
    const [m] = await sql`select * from biz_memberships where workspace_id = ${ctx.workspace.id} and id = ${membershipId} for update`;
    if (!m) throw new BizError("not_found", "That member wasn't found.");
    const self = m.user_id === ctx.user.id;
    if (self) {
      if (m.role === "owner") throw new BizError("forbidden", "Owners can't leave their workspace. Delete it in Settings instead.");
    } else {
      assertCan(ctx, "members.manage", "Only owners and admins can remove members.");
      if (!canManageMember(ctx.role, m.role)) throw new BizError("forbidden", "Your role can't remove this member.");
    }
    await sql`delete from biz_memberships where id = ${membershipId}`;
    if (m.person_id) await sql`update biz_people set user_id = null, updated_at = now() where workspace_id = ${ctx.workspace.id} and id = ${m.person_id}`;
    await logActivity(sql, ctx, { action: self ? "member.left" : "member.removed", entityType: "workspace", entityId: ctx.workspace.id, summary: self ? `${displayName(ctx.user)} left the workspace` : "Removed a member's access" });
    return { self };
  });
}

// ─── People directory ───────────────────────────────────────────────────────

export interface PersonInput {
  name: string;
  email: string | null;
  title: string | null;
  departmentId: string | null;
}

async function checkDepartment(sql: Db, ws: string, id: string | null) {
  if (!id) return;
  const [d] = await sql`select 1 from biz_departments where workspace_id = ${ws} and id = ${id} and archived_at is null`;
  if (!d) throw new BizError("invalid", "That department doesn't exist or is archived.");
}

export async function createPerson(ctx: BizContext, p: PersonInput): Promise<string> {
  assertCan(ctx, "records.manage", "Your role can't add people to the directory.");
  const ws = ctx.workspace.id;
  return db().begin(async (sql) => {
    await checkDepartment(sql, ws, p.departmentId);
    if (p.email) {
      const [dupe] = await sql`select name from biz_people where workspace_id = ${ws} and email = ${p.email}`;
      if (dupe) throw new BizError("conflict", `${p.email} is already in the directory as ${dupe.name}.`);
    }
    const [row] = await sql`
      insert into biz_people (workspace_id, name, email, title, department_id) values (${ws}, ${p.name}, ${p.email}, ${p.title}, ${p.departmentId}) returning id`;
    await logActivity(sql, ctx, { action: "person.created", entityType: "person", entityId: row.id, summary: `Added ${p.name} to the team directory` });
    return row.id as string;
  });
}

export async function updatePerson(ctx: BizContext, id: string, p: PersonInput & { status: "active" | "inactive" }): Promise<void> {
  assertCan(ctx, "directory.manage", "Only owners and admins can edit the team directory.");
  const ws = ctx.workspace.id;
  await db().begin(async (sql) => {
    const [before] = await sql`select * from biz_people where workspace_id = ${ws} and id = ${id} for update`;
    if (!before) throw new BizError("not_found", "That person wasn't found.");
    await checkDepartment(sql, ws, p.departmentId);
    if (p.email && p.email !== before.email) {
      const [dupe] = await sql`select name from biz_people where workspace_id = ${ws} and email = ${p.email} and id <> ${id}`;
      if (dupe) throw new BizError("conflict", `${p.email} is already in the directory as ${dupe.name}.`);
    }
    await sql`update biz_people set name = ${p.name}, email = ${p.email}, title = ${p.title}, department_id = ${p.departmentId}, status = ${p.status}, updated_at = now()
      where workspace_id = ${ws} and id = ${id}`;
    let released = 0;
    if (before.status === "active" && p.status === "inactive") {
      const rows = await sql`update biz_seat_assignments set released_at = now(), released_by = ${ctx.user.id}
        where workspace_id = ${ws} and person_id = ${id} and released_at is null returning id`;
      released = rows.length;
    }
    await logActivity(sql, ctx, {
      action: "person.updated",
      entityType: "person",
      entityId: id,
      summary: `Updated ${p.name}${before.status !== p.status ? ` (now ${p.status})` : ""}${released ? `; released ${released} seat${released === 1 ? "" : "s"}` : ""}`,
    });
  });
}

// ─── Departments ────────────────────────────────────────────────────────────

export async function createDepartment(ctx: BizContext, name: string): Promise<string> {
  assertCan(ctx, "directory.manage", "Only owners and admins can manage departments.");
  return db().begin(async (sql) => {
    const [dupe] = await sql`select 1 from biz_departments where workspace_id = ${ctx.workspace.id} and lower(name) = lower(${name}) and archived_at is null`;
    if (dupe) throw new BizError("conflict", `There's already a ${name} department.`);
    const [row] = await sql`insert into biz_departments (workspace_id, name) values (${ctx.workspace.id}, ${name}) returning id`;
    await logActivity(sql, ctx, { action: "department.created", entityType: "department", entityId: row.id, summary: `Created the ${name} department` });
    return row.id as string;
  });
}

export async function renameDepartment(ctx: BizContext, id: string, name: string): Promise<void> {
  assertCan(ctx, "directory.manage", "Only owners and admins can manage departments.");
  await db().begin(async (sql) => {
    const [dupe] = await sql`select 1 from biz_departments where workspace_id = ${ctx.workspace.id} and lower(name) = lower(${name}) and archived_at is null and id <> ${id}`;
    if (dupe) throw new BizError("conflict", `There's already a ${name} department.`);
    const [row] = await sql`update biz_departments set name = ${name}, updated_at = now() where workspace_id = ${ctx.workspace.id} and id = ${id} and archived_at is null returning id`;
    if (!row) throw new BizError("not_found", "That department wasn't found.");
    await logActivity(sql, ctx, { action: "department.renamed", entityType: "department", entityId: id, summary: `Renamed a department to ${name}` });
  });
}

/** Archiving keeps history; people and records keep pointing at it until reassigned. */
export async function setDepartmentArchived(ctx: BizContext, id: string, archived: boolean): Promise<void> {
  assertCan(ctx, "directory.manage", "Only owners and admins can manage departments.");
  await db().begin(async (sql) => {
    const [row] = await sql`select * from biz_departments where workspace_id = ${ctx.workspace.id} and id = ${id} for update`;
    if (!row) throw new BizError("not_found", "That department wasn't found.");
    if (!archived) {
      const [dupe] = await sql`select 1 from biz_departments where workspace_id = ${ctx.workspace.id} and lower(name) = lower(${row.name}) and archived_at is null and id <> ${id}`;
      if (dupe) throw new BizError("conflict", `Another active department is already called ${row.name}.`);
    }
    await sql`update biz_departments set archived_at = ${archived ? new Date() : null}, updated_at = now() where id = ${id}`;
    await logActivity(sql, ctx, { action: archived ? "department.archived" : "department.restored", entityType: "department", entityId: id, summary: `${archived ? "Archived" : "Restored"} the ${row.name} department` });
  });
}

export async function assignPeopleToDepartment(ctx: BizContext, departmentId: string | null, personIds: string[]): Promise<number> {
  assertCan(ctx, "directory.manage", "Only owners and admins can manage departments.");
  if (personIds.length === 0) return 0;
  return db().begin(async (sql) => {
    await checkDepartment(sql, ctx.workspace.id, departmentId);
    const rows = await sql`update biz_people set department_id = ${departmentId}, updated_at = now()
      where workspace_id = ${ctx.workspace.id} and id = any(${personIds.slice(0, 500)}::uuid[]) returning id`;
    await logActivity(sql, ctx, { action: "department.members", entityType: "department", entityId: departmentId, summary: `Moved ${rows.length} ${rows.length === 1 ? "person" : "people"} ${departmentId ? "into a department" : "out of their department"}` });
    return rows.length;
  });
}

// ─── Seats ──────────────────────────────────────────────────────────────────

async function lockSubscriptionForSeats(sql: Db, ctx: BizContext, subscriptionId: string) {
  const [s] = await sql`
    select s.id, s.purchased_seats, s.status, s.archived_at, s.owner_person_id, sw.owner_person_id as sw_owner, sw.name
    from biz_subscriptions s join biz_software sw on sw.workspace_id = s.workspace_id and sw.id = s.software_id
    where s.workspace_id = ${ctx.workspace.id} and s.id = ${subscriptionId} for update of s`;
  if (!s) throw new BizError("not_found", "That subscription wasn't found.");
  if (!canEditRecord(ctx.role, { ownerPersonId: s.owner_person_id ?? s.sw_owner }, ctx.personId)) throw new BizError("forbidden", "Your role can only manage seats on software you own.");
  if (s.archived_at) throw new BizError("invalid", "This subscription is archived.");
  return s;
}

/** Assigns seats to people; refuses to go over the purchased seat count. */
export async function assignSeats(ctx: BizContext, subscriptionId: string, personIds: string[], note: string | null): Promise<number> {
  if (personIds.length === 0) throw new BizError("invalid", "Choose at least one person.");
  return db().begin(async (sql) => {
    const s = await lockSubscriptionForSeats(sql, ctx, subscriptionId);
    const people = await sql`select id, status from biz_people where workspace_id = ${ctx.workspace.id} and id = any(${personIds}::uuid[])`;
    if (people.length !== new Set(personIds).size) throw new BizError("invalid", "Someone you chose isn't in this workspace's directory.");
    if (people.some((p) => p.status !== "active")) throw new BizError("invalid", "Inactive people can't be given seats.");
    const active = await sql`select person_id from biz_seat_assignments where subscription_id = ${subscriptionId} and released_at is null`;
    const have = new Set(active.map((r) => r.person_id as string));
    const fresh = personIds.filter((id) => !have.has(id));
    if (fresh.length === 0) throw new BizError("conflict", "Everyone you chose already has a seat.");
    if (s.purchased_seats !== null && have.size + fresh.length > s.purchased_seats) {
      const left = Math.max(0, s.purchased_seats - have.size);
      throw new BizError("invalid", `Only ${left} of ${s.purchased_seats} seats are free. Release a seat or increase purchased seats first.`);
    }
    for (const personId of fresh) {
      await sql`insert into biz_seat_assignments (workspace_id, subscription_id, person_id, note, assigned_by) values (${ctx.workspace.id}, ${subscriptionId}, ${personId}, ${note}, ${ctx.user.id})`;
    }
    await logActivity(sql, ctx, { action: "seats.assigned", entityType: "subscription", entityId: subscriptionId, summary: `Assigned ${fresh.length} ${s.name} seat${fresh.length === 1 ? "" : "s"}` });
    return fresh.length;
  });
}

export async function releaseSeat(ctx: BizContext, assignmentId: string): Promise<void> {
  await db().begin(async (sql) => {
    const [a] = await sql`select a.*, p.name as person_name from biz_seat_assignments a join biz_people p on p.workspace_id = a.workspace_id and p.id = a.person_id
      where a.workspace_id = ${ctx.workspace.id} and a.id = ${assignmentId} and a.released_at is null`;
    if (!a) throw new BizError("not_found", "That seat is no longer assigned.");
    const s = await lockSubscriptionForSeats(sql, ctx, a.subscription_id);
    await sql`update biz_seat_assignments set released_at = now(), released_by = ${ctx.user.id} where id = ${assignmentId}`;
    await logActivity(sql, ctx, { action: "seats.released", entityType: "subscription", entityId: a.subscription_id, summary: `Released ${a.person_name}'s ${s.name} seat` });
  });
}

/** Moves a seat from one person to another in one step. */
export async function reassignSeat(ctx: BizContext, assignmentId: string, toPersonId: string): Promise<void> {
  await db().begin(async (sql) => {
    const [a] = await sql`select a.*, p.name as person_name from biz_seat_assignments a join biz_people p on p.workspace_id = a.workspace_id and p.id = a.person_id
      where a.workspace_id = ${ctx.workspace.id} and a.id = ${assignmentId} and a.released_at is null`;
    if (!a) throw new BizError("not_found", "That seat is no longer assigned.");
    const s = await lockSubscriptionForSeats(sql, ctx, a.subscription_id);
    const [to] = await sql`select id, name, status from biz_people where workspace_id = ${ctx.workspace.id} and id = ${toPersonId}`;
    if (!to) throw new BizError("invalid", "That person isn't in this workspace's directory.");
    if (to.status !== "active") throw new BizError("invalid", "Inactive people can't be given seats.");
    const [has] = await sql`select 1 from biz_seat_assignments where subscription_id = ${a.subscription_id} and person_id = ${toPersonId} and released_at is null`;
    if (has) throw new BizError("conflict", `${to.name} already has a seat.`);
    await sql`update biz_seat_assignments set released_at = now(), released_by = ${ctx.user.id} where id = ${assignmentId}`;
    await sql`insert into biz_seat_assignments (workspace_id, subscription_id, person_id, assigned_by) values (${ctx.workspace.id}, ${a.subscription_id}, ${toPersonId}, ${ctx.user.id})`;
    await logActivity(sql, ctx, { action: "seats.reassigned", entityType: "subscription", entityId: a.subscription_id, summary: `Moved a ${s.name} seat from ${a.person_name} to ${to.name}` });
  });
}
