"use server";

import { revalidatePath } from "next/cache";
import { FormReader, isUuid, stateFromErrors, type FormState } from "@/lib/business/form";
import { BizError, runAction } from "@/lib/server/business/context";
import { assignPeopleToDepartment, createDepartment, renameDepartment, setDepartmentArchived } from "@/lib/server/business/team";

const refresh = () => revalidatePath("/business", "layout");

export async function createDepartmentAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const r = new FormReader(form);
    const name = r.requiredText("name", { label: "Department name", max: 60 });
    if (!r.ok) return stateFromErrors(r);
    await createDepartment(ctx, name);
    refresh();
    return { ok: true, message: `Created the ${name} department.` };
  });
}

export async function renameDepartmentAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const r = new FormReader(form);
    const id = r.id("id", { label: "a department", required: true });
    const name = r.requiredText("name", { label: "Department name", max: 60 });
    if (!r.ok || !id) return stateFromErrors(r);
    await renameDepartment(ctx, id, name);
    refresh();
    return { ok: true, message: "Department renamed." };
  });
}

export async function archiveDepartmentAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const id = form.get("id");
    if (!isUuid(id)) throw new BizError("not_found", "That department wasn't found.");
    const restore = form.get("restore") === "1";
    await setDepartmentArchived(ctx, id, !restore);
    refresh();
    return { ok: true, message: restore ? "Department restored." : "Department archived." };
  });
}

/** Moves people into a department, or out of any department when none is chosen. */
export async function assignMembersAction(_prev: FormState, form: FormData): Promise<FormState> {
  return runAction(form, async (ctx) => {
    const r = new FormReader(form);
    const departmentId = r.id("departmentId", { label: "a department" });
    const personIds = r.ids("personIds");
    if (!r.ok) return stateFromErrors(r);
    if (personIds.length === 0) return { error: "Choose at least one person." };
    const n = await assignPeopleToDepartment(ctx, departmentId, personIds);
    refresh();
    return { ok: true, message: `Updated ${n} ${n === 1 ? "person" : "people"}.` };
  });
}
