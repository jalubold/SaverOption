"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ROLES } from "@/lib/business/constants";
import { FormReader, isUuid, stateFromErrors, type FormState } from "@/lib/business/form";
import { BizError, runAction } from "@/lib/server/business/context";
import { changeMemberRole, createPerson, inviteMember, removeMember, revokeInvitation, updatePerson } from "@/lib/server/business/team";

const refresh = () => revalidatePath("/business", "layout");

/** Gives an email address access with a role. Nothing is emailed: the inviter shares the sign-in link. */
export async function inviteMemberAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const r = new FormReader(form);
    const email = r.email("email", { label: "Email", required: true });
    const role = r.oneOf("role", ROLES.filter((x) => x !== "owner"), { label: "Role" });
    if (!r.ok || !email) return stateFromErrors(r);
    await inviteMember(ctx, email, role);
    refresh();
    return { ok: true, message: `Access added for ${email}. No email was sent — share the sign-in link with them.` };
  });
}

export async function revokeInvitationAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const id = form.get("invitationId");
    if (!isUuid(id)) throw new BizError("not_found", "That invitation wasn't found.");
    await revokeInvitation(ctx, id);
    refresh();
    return { ok: true, message: "Access revoked." };
  });
}

export async function changeRoleAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const r = new FormReader(form);
    const id = r.id("membershipId", { label: "a member", required: true });
    const role = r.oneOf("role", ROLES.filter((x) => x !== "owner"), { label: "Role" });
    if (!r.ok || !id) return stateFromErrors(r);
    await changeMemberRole(ctx, id, role);
    refresh();
    return { ok: true, message: "Role updated." };
  });
}

/** Removes a member, or lets someone leave the workspace (then they go to whichever workspace they have left). */
export async function removeMemberAction(_prev: FormState, form: FormData): Promise<FormState> {
  let self = false;
  const result = await runAction(form, async (ctx) => {
    const id = form.get("membershipId");
    if (!isUuid(id)) throw new BizError("not_found", "That member wasn't found.");
    self = (await removeMember(ctx, id)).self;
    return { ok: true, message: "Member removed." };
  });
  refresh();
  if (result.ok && self) redirect("/business/dashboard");
  return result;
}

export async function createPersonAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const r = new FormReader(form);
    const name = r.requiredText("name", { label: "Name", max: 120 });
    const email = r.email("email", { label: "Email" });
    const title = r.text("title", { label: "Job title", max: 80 });
    const departmentId = r.id("departmentId", { label: "a department" });
    if (!r.ok) return stateFromErrors(r);
    await createPerson(ctx, { name, email, title, departmentId });
    refresh();
    return { ok: true, message: `${name} was added to the directory.` };
  });
}

export async function updatePersonAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const r = new FormReader(form);
    const id = r.id("id", { label: "a person", required: true });
    const name = r.requiredText("name", { label: "Name", max: 120 });
    const email = r.email("email", { label: "Email" });
    const title = r.text("title", { label: "Job title", max: 80 });
    const departmentId = r.id("departmentId", { label: "a department" });
    const status = r.oneOf("status", ["active", "inactive"] as const, { label: "Status", fallback: "active" });
    if (!r.ok || !id) return stateFromErrors(r);
    await updatePerson(ctx, id, { name, email, title, departmentId, status });
    refresh();
    redirect("/business/team?saved=1#people");
  });
}
