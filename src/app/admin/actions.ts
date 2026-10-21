"use server";

import { revalidatePath } from "next/cache";
import { adminAct, getSubmission, type AdminAction } from "@/lib/server/submissions";
import { getUser, isAdmin } from "@/lib/server/supabase";

export type AdminState = { ok?: boolean; message?: string } | null;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function parseDay(value: FormDataEntryValue | null): Date | null | "invalid" {
  const v = String(value ?? "").trim();
  if (!v) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return "invalid";
  const d = new Date(`${v}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? "invalid" : d;
}

/** Every admin change goes through here; the session is re-checked on the server for each call. */
export async function adminAction(_prev: AdminState, form: FormData): Promise<AdminState> {
  if (!isAdmin(await getUser())) return { message: "Not allowed." };
  const id = String(form.get("id") ?? "");
  if (!UUID.test(id)) return { message: "Submission not found." };
  const notes = String(form.get("notes") ?? "").trim().slice(0, 2000) || null;

  let action: AdminAction;
  switch (form.get("intent")) {
    case "approve":
      action = { type: "approve", notes };
      break;
    case "reject":
      if (!notes) return { message: "Add a note telling the advertiser what to change." };
      action = { type: "reject", notes };
      break;
    case "notes":
      action = { type: "notes", notes };
      break;
    case "unpublish":
      action = { type: "unpublish" };
      break;
    case "publish": {
      const startsAt = parseDay(form.get("startsAt"));
      const endsAt = parseDay(form.get("endsAt"));
      if (startsAt === "invalid" || endsAt === "invalid") return { message: "Use valid dates." };
      action = { type: "publish", startsAt, endsAt };
      break;
    }
    default:
      return { message: "Unknown action." };
  }

  const result = await adminAct(id, action);
  if (!result.ok) return { message: result.error };
  const sub = await getSubmission(id);
  revalidatePath(`/admin/submissions/${id}`);
  revalidatePath("/admin");
  revalidatePath(`/dashboard/listings/${id}`);
  revalidatePath("/listings");
  revalidatePath("/");
  if (sub?.slug) revalidatePath(`/listings/${sub.slug}`);
  return { ok: true, message: "Saved." };
}
