/**
 * Role permissions for Saver Option Business. The server checks these on every
 * mutation (src/lib/server/business/context.ts); the UI uses the same function
 * only to decide which controls to show.
 */
import type { Role } from "./constants.ts";

export type Capability =
  /** Company details, preferences, notification defaults. */
  | "workspace.manage"
  /** Rename or delete the workspace, change owners. */
  | "workspace.own"
  /** Members, roles and access invitations. */
  | "members.manage"
  /** Departments and the people directory. */
  | "directory.manage"
  /** Software inventory and subscription records, seats and renewal decisions — any record. */
  | "records.manage"
  /** The same, limited to records the user owns (owner person = them). */
  | "records.manage_own"
  /** Payments, renewal outcomes, savings decisions and confirmed savings. */
  | "spend.manage"
  /** CSV and data exports. */
  | "data.export"
  /** The workspace's Saver Option plan: checkout, cancellation and the billing portal. */
  | "billing.manage";

const grants: Record<Role, ReadonlySet<Capability>> = {
  owner: new Set(["workspace.manage", "workspace.own", "members.manage", "directory.manage", "records.manage", "records.manage_own", "spend.manage", "data.export", "billing.manage"]),
  admin: new Set(["workspace.manage", "members.manage", "directory.manage", "records.manage", "records.manage_own", "spend.manage", "data.export", "billing.manage"]),
  finance: new Set(["records.manage", "records.manage_own", "spend.manage", "data.export"]),
  member: new Set(["records.manage_own"]),
  viewer: new Set(),
};

export function can(role: Role, capability: Capability): boolean {
  return grants[role].has(capability);
}

/**
 * Whether a user may change one software or subscription record: anyone with
 * records.manage, or a member who is the record's owner.
 */
export function canEditRecord(role: Role, record: { ownerPersonId: string | null }, myPersonId: string | null): boolean {
  if (can(role, "records.manage")) return true;
  return can(role, "records.manage_own") && myPersonId !== null && record.ownerPersonId === myPersonId;
}

/** Roles a member with `role` may grant to others. Owners can't be created here — ownership is transferred. */
export function assignableRoles(role: Role): Role[] {
  if (role === "owner") return ["admin", "finance", "member", "viewer"];
  if (role === "admin") return ["finance", "member", "viewer"];
  return [];
}

/** Whether `actor` may change or remove a member who currently has `target` role. */
export function canManageMember(actor: Role, target: Role): boolean {
  if (actor === "owner") return target !== "owner";
  if (actor === "admin") return target !== "owner" && target !== "admin";
  return false;
}
