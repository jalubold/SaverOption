"use server";

import { revalidatePath } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { dateOrderFor, IMPORT_MAX_BYTES } from "@/lib/business/csv-import";
import { actionContext, BizError, type BizContext } from "@/lib/server/business/context";
import { commitImport, previewImport, readImportOptions, type ImportPreview, type ImportResult } from "@/lib/server/business/import";

export type ImportPreviewResponse = { ok: true; preview: ImportPreview } | { ok: false; error: string };
export type ImportCommitResponse = { ok: true; result: ImportResult } | { ok: false; error: string; stale?: boolean };

/**
 * The browser sends the CSV text as an upload, gzip-compressed when it can
 * (so a 1 MB file stays well under the server-action body limit). The text is
 * read in memory and never stored.
 */
async function readUpload(form: FormData): Promise<{ text: string; fileName: string }> {
  const file = form.get("file");
  if (!(file instanceof Blob)) throw new BizError("invalid", "Choose a CSV file to import.");
  if (file.size > IMPORT_MAX_BYTES + 64_000) throw new BizError("invalid", "The file is larger than 1 MB. Split it into smaller files.");
  let stream: ReadableStream<Uint8Array> = file.stream();
  if (form.get("encoding") === "gzip") stream = stream.pipeThrough(new DecompressionStream("gzip") as unknown as TransformStream<Uint8Array, Uint8Array>);
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      // Checked while reading, so a small compressed upload can't expand into something huge.
      if (total > IMPORT_MAX_BYTES) throw new BizError("invalid", "The file is larger than 1 MB. Split it into smaller files.");
      chunks.push(value);
    }
  } catch (err) {
    if (err instanceof BizError) throw err;
    throw new BizError("invalid", "The upload couldn't be read. Choose the file again.");
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(total);
  let at = 0;
  for (const c of chunks) {
    bytes.set(c, at);
    at += c.byteLength;
  }
  const text = new TextDecoder("utf-8").decode(bytes);
  const name = form.get("fileName");
  return { text, fileName: typeof name === "string" ? name : "upload.csv" };
}

function jsonField(form: FormData, name: string): Record<string, unknown> | null {
  const v = form.get(name);
  if (typeof v !== "string" || !v) return null;
  try {
    const parsed = JSON.parse(v);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function defaults(ctx: BizContext) {
  return { dateOrder: dateOrderFor(ctx.workspace.dateFormat), decimal: "dot" as const, defaultCurrency: ctx.workspace.defaultCurrency, defaultInterval: "" as const };
}

function failure(err: unknown): { ok: false; error: string; stale?: boolean } {
  unstable_rethrow(err);
  if (err instanceof BizError) return { ok: false, error: err.message, stale: err.code === "stale" || undefined };
  console.error("[business] import failed:", err instanceof Error ? err.message : err);
  return { ok: false, error: "Something went wrong and nothing was imported. Please try again." };
}

export async function previewImportAction(form: FormData): Promise<ImportPreviewResponse> {
  try {
    const ctx = await actionContext(form);
    const { text, fileName } = await readUpload(form);
    const preview = await previewImport(ctx, { text, fileName, mapping: jsonField(form, "mapping"), options: readImportOptions(jsonField(form, "options"), defaults(ctx)) });
    return { ok: true, preview };
  } catch (err) {
    return failure(err);
  }
}

export async function commitImportAction(form: FormData): Promise<ImportCommitResponse> {
  try {
    const ctx = await actionContext(form);
    const { text, fileName } = await readUpload(form);
    const expectedHash = form.get("expectedHash");
    const expectedCreate = Number(form.get("expectedCreate"));
    if (typeof expectedHash !== "string" || !/^[0-9a-f]{64}$/.test(expectedHash) || !Number.isInteger(expectedCreate))
      throw new BizError("invalid", "Preview the file before importing it.");
    const result = await commitImport(ctx, {
      text,
      fileName,
      mapping: jsonField(form, "mapping") ?? {},
      options: readImportOptions(jsonField(form, "options"), defaults(ctx)),
      expectedHash,
      expectedCreate,
    });
    revalidatePath("/business", "layout");
    return { ok: true, result };
  } catch (err) {
    return failure(err);
  }
}
