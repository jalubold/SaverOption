"use server";

import { revalidatePath } from "next/cache";
import { dbConfigured } from "@/lib/server/db";
import { deactivateLifetimeCodes, importLifetimeCodes } from "@/lib/server/business/lifetime";
import { getUser, isAdmin } from "@/lib/server/supabase";

export type CodesState = { ok: boolean; message: string } | null;

/** Server actions accept up to 1 MB: about 40,000 codes like SOB-XXXX-XXXX-XXXX. Longer lists go in parts. */
const MAX_TEXT = 1_000_000;

/** The pasted list, else the uploaded file's text. */
async function readList(form: FormData): Promise<string | null> {
  const pasted = String(form.get("list") ?? "");
  if (pasted.trim()) return pasted.slice(0, MAX_TEXT);
  const file = form.get("file");
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_TEXT) return null;
    return await file.text();
  }
  return "";
}

const plural = (n: number, word: string) => `${n.toLocaleString("en-US")} ${word}${n === 1 ? "" : "s"}`;

/** Imports codes; the session is re-checked on the server for each call. */
export async function importCodesAction(_prev: CodesState, form: FormData): Promise<CodesState> {
  if (!isAdmin(await getUser())) return { ok: false, message: "Not allowed." };
  if (!dbConfigured()) return { ok: false, message: "The database isn't configured." };
  const text = await readList(form);
  if (text === null) return { ok: false, message: "That file is over 1 MB. Split it into smaller files and import each one." };
  if (!text.trim()) return { ok: false, message: "Choose a CSV file or paste the codes." };
  const batch = String(form.get("batch") ?? "").trim().slice(0, 80) || null;
  try {
    const r = await importLifetimeCodes(text, batch);
    if (!r.parsed.codes.length) return { ok: false, message: `No valid codes found${r.parsed.invalid ? ` (${plural(r.parsed.invalid, "line")} weren't codes)` : ""}.` };
    const notes = [
      r.existing ? `${plural(r.existing, "code")} already imported (unchanged)` : null,
      r.parsed.duplicates ? `${plural(r.parsed.duplicates, "duplicate")} in the file skipped` : null,
      r.parsed.invalid ? `${plural(r.parsed.invalid, "line")} that weren't codes skipped` : null,
      r.parsed.header ? "header row skipped" : null,
      r.parsed.truncated ? "only the first 20,000 codes were read" : null,
    ].filter(Boolean);
    revalidatePath("/admin/codes");
    return { ok: true, message: `Imported ${plural(r.added, "new code")}.${notes.length ? ` ${notes.join("; ")}.` : ""}` };
  } catch (err) {
    console.error("[lifetime] import failed:", err instanceof Error ? err.message : err);
    return { ok: false, message: "The import failed and nothing was saved. Check that the latest database migration has run." };
  }
}

/** Deactivates refunded or withdrawn codes. */
export async function deactivateCodesAction(_prev: CodesState, form: FormData): Promise<CodesState> {
  if (!isAdmin(await getUser())) return { ok: false, message: "Not allowed." };
  if (!dbConfigured()) return { ok: false, message: "The database isn't configured." };
  const text = await readList(form);
  if (text === null) return { ok: false, message: "That file is over 1 MB. Split it into smaller files." };
  if (!text.trim()) return { ok: false, message: "Choose a CSV file or paste the codes to deactivate." };
  if (form.get("confirm") !== "yes") return { ok: false, message: "Tick the confirmation first: deactivating can't be undone here." };
  const note = String(form.get("note") ?? "").trim().slice(0, 200) || null;
  try {
    const r = await deactivateLifetimeCodes(text, note);
    if (!r.parsed.codes.length) return { ok: false, message: "No valid codes found." };
    const notes = [
      r.wereRedeemed ? `${r.wereRedeemed.toLocaleString("en-US")} of them had been redeemed, so those workspaces lost that code's plan` : null,
      r.already ? `${plural(r.already, "code")} already deactivated` : null,
      r.unknown ? `${plural(r.unknown, "code")} never imported` : null,
    ].filter(Boolean);
    revalidatePath("/admin/codes");
    return { ok: true, message: `Deactivated ${plural(r.deactivated, "code")}.${notes.length ? ` ${notes.join("; ")}.` : ""}` };
  } catch (err) {
    console.error("[lifetime] deactivate failed:", err instanceof Error ? err.message : err);
    return { ok: false, message: "Deactivating failed and nothing was changed. Please try again." };
  }
}
