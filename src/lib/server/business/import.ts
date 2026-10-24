import { createHash } from "node:crypto";
import { formatIsoDate, intervalLabel, monthlyEquivalent, normalizeName, isCurrencyCode } from "@/lib/business/calc";
import {
  autoMap,
  cleanMapping,
  convertRow,
  CsvError,
  duplicateKey,
  IMPORT_FIELDS,
  IMPORT_MAX_BYTES,
  parseCsv,
  type ColumnMapping,
  type ImportField,
  type ImportOptions,
  type RowMessage,
} from "@/lib/business/csv-import";
import { FormReader } from "@/lib/business/form";
import { db } from "@/lib/server/db";
import { assertCan, BizError, logActivity, type BizContext } from "@/lib/server/business/context";
import { getDepartments, getPeople, getSoftwareList, getSubscriptions } from "@/lib/server/business/data";
import { logoFor } from "@/lib/server/business/logos";
import { createSubscriptionIn, readSoftwareInput, readSubscriptionInput, type SoftwareInput, type SubscriptionInput } from "@/lib/server/business/records";

/**
 * CSV import of subscriptions. The preview and the commit run the same plan:
 * parse the file, map its columns, validate every row with the app's own form
 * rules, match software, departments and people, and spot duplicates. Nothing
 * is written until the commit, which re-plans on the server and saves every
 * valid row in one transaction.
 */

export interface ImportPreviewRow {
  /** Line in the file where the row starts. */
  line: number;
  status: "create" | "duplicate" | "error";
  software: { name: string; existingId: string | null; logo: string | null };
  planName: string | null;
  priceMinor: number | null;
  currency: string;
  interval: string | null;
  monthlyMinor: number | null;
  nextRenewalDate: string | null;
  seats: number | null;
  seatsInUse: number | null;
  department: { ref: string; name: string | null } | null;
  owner: { ref: string; name: string | null } | null;
  messages: RowMessage[];
  duplicateOf: { kind: "file"; line: number } | { kind: "existing"; subscriptionId: string; label: string } | null;
}

export interface ImportPreview {
  fileName: string;
  fileHash: string;
  headers: string[];
  /** Up to three example values per column, for the mapping controls. */
  samples: string[][];
  mapping: ColumnMapping;
  options: ImportOptions;
  rows: ImportPreviewRow[];
  counts: { total: number; create: number; duplicate: number; error: number };
  newSoftware: number;
  previousImport: { at: string; fileName: string | null; created: number } | null;
  /** File-level notes, e.g. unreadable characters. */
  notices: string[];
}

interface PlannedRow {
  preview: ImportPreviewRow;
  normName: string;
  softwareId: string | null;
  softwareInput: SoftwareInput | null;
  input: SubscriptionInput | null;
  idempotencyKey: string;
}

const DATE_ORDERS = ["iso", "dmy", "mdy"] as const;
const DECIMALS = ["dot", "comma"] as const;
const DEFAULT_INTERVALS = ["", "monthly", "quarterly", "yearly"] as const;

export function readImportOptions(raw: unknown, fallback: ImportOptions): ImportOptions {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const pick = <T extends string>(v: unknown, list: readonly T[], d: T): T => ((list as readonly unknown[]).includes(v) ? (v as T) : d);
  const currency = typeof o.defaultCurrency === "string" ? o.defaultCurrency.trim().toUpperCase() : "";
  return {
    dateOrder: pick(o.dateOrder, DATE_ORDERS, fallback.dateOrder),
    decimal: pick(o.decimal, DECIMALS, fallback.decimal),
    defaultCurrency: isCurrencyCode(currency) ? currency : fallback.defaultCurrency,
    defaultInterval: pick(o.defaultInterval, DEFAULT_INTERVALS, fallback.defaultInterval),
  };
}

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
const fieldLabel = (k: ImportField) => IMPORT_FIELDS.find((f) => f.key === k)!.label;

function readerFor(fields: Record<string, string>): FormReader {
  const f = new FormData();
  for (const [k, v] of Object.entries(fields)) f.set(k, v);
  return new FormReader(f);
}

async function plan(
  ctx: BizContext,
  text: string,
  fileName: string,
  mappingIn: Record<string, unknown> | null,
  optionsIn: ImportOptions,
): Promise<{ preview: ImportPreview; rows: PlannedRow[] }> {
  assertCan(ctx, "records.manage", "Your role can't import subscriptions. Owners, admins and finance can.");
  if (new TextEncoder().encode(text).length > IMPORT_MAX_BYTES) throw new BizError("invalid", "The file is larger than 1 MB. Split it into smaller files.");
  let parsed;
  try {
    parsed = parseCsv(text);
  } catch (err) {
    if (err instanceof CsvError) throw new BizError("invalid", err.message);
    throw err;
  }
  if (parsed.rows.length === 0) throw new BizError("invalid", "The file has column names but no rows to import.");

  const ws = ctx.workspace.id;
  const fileHash = sha256(text);
  const auto = autoMap(parsed.headers);
  const mapping = mappingIn ? cleanMapping(mappingIn, parsed.headers.length) : auto.mapping;
  const options = { ...optionsIn };
  if (!mappingIn && !options.defaultInterval && auto.defaultInterval) options.defaultInterval = auto.defaultInterval;

  const notices: string[] = [];
  if (text.includes("�")) notices.push("Some characters in the file couldn't be read. If names look wrong, save the file as “CSV UTF-8” and upload it again.");
  if (mapping.software === undefined) notices.push("Choose which column holds the software name — it's the only required column.");

  const [software, subs, people, departments, [prev]] = await Promise.all([
    getSoftwareList(ws),
    getSubscriptions(ws),
    getPeople(ws),
    getDepartments(ws),
    db()`select created_at, file_name, created_count from biz_import_jobs where workspace_id = ${ws} and file_sha256 = ${fileHash} order by created_at desc limit 1`,
  ]);
  const softwareByName = new Map<string, (typeof software)[number]>();
  for (const s of software) {
    const k = normalizeName(s.name);
    const had = softwareByName.get(k);
    if (!had || (had.status === "archived" && s.status !== "archived")) softwareByName.set(k, s);
  }
  const existingByKey = new Map<string, (typeof subs)[number]>();
  for (const s of subs) if (!s.archived) existingByKey.set(duplicateKey({ softwareName: s.softwareName, planName: s.planName, billingInterval: s.billingInterval, customIntervalCount: s.customIntervalCount, customIntervalUnit: s.customIntervalUnit, currency: s.currency }), s);
  const liveDepartments = departments.filter((d) => !d.archivedAt);

  const samples = parsed.headers.map((_, i) => parsed.rows.map((r) => r[i]).filter(Boolean).slice(0, 3));
  const fileKeys = new Map<string, number>();
  const rows: PlannedRow[] = [];

  for (let i = 0; i < parsed.rows.length; i++) {
    const line = parsed.lines[i];
    const conv = convertRow(parsed.rows[i], mapping, options);
    const messages = [...conv.messages];
    const normName = normalizeName(conv.softwareName);
    const preview: ImportPreviewRow = {
      line,
      status: "error",
      software: { name: conv.softwareName || "—", existingId: null, logo: null },
      planName: conv.fields.planName ?? null,
      priceMinor: null,
      currency: conv.fields.currency,
      interval: null,
      monthlyMinor: null,
      nextRenewalDate: conv.fields.nextRenewalDate ?? null,
      seats: null,
      seatsInUse: null,
      department: null,
      owner: null,
      messages,
      duplicateOf: null,
    };
    const planned: PlannedRow = { preview, normName, softwareId: null, softwareInput: null, input: null, idempotencyKey: sha256(`${ws}:${fileHash}:${line}`).slice(0, 48) };
    rows.push(planned);
    if (mapping.software === undefined) {
      messages.length = 0;
      messages.push({ level: "error", text: "No column is mapped to Software name, so this row can't be imported." });
      continue;
    }

    // Department and owner: matched to existing records only.
    let departmentId: string | null = null;
    if (conv.departmentRef) {
      const d = liveDepartments.find((x) => x.name.toLowerCase() === conv.departmentRef.toLowerCase());
      preview.department = { ref: conv.departmentRef, name: d?.name ?? null };
      if (d) departmentId = d.id;
      else messages.push({ level: "warning", text: `Department “${conv.departmentRef}” isn't in this workspace — left blank.` });
    }
    let ownerId: string | null = null;
    if (conv.ownerRef) {
      const ref = conv.ownerRef.toLowerCase();
      const byEmail = people.filter((p) => p.email && p.email.toLowerCase() === ref);
      const byName = byEmail.length ? byEmail : people.filter((p) => p.name.toLowerCase() === ref);
      const active = byName.filter((p) => p.status === "active");
      const hits = active.length ? active : byName;
      if (hits.length === 1) {
        ownerId = hits[0].id;
        preview.owner = { ref: conv.ownerRef, name: hits[0].name };
      } else {
        preview.owner = { ref: conv.ownerRef, name: null };
        messages.push({
          level: "warning",
          text: hits.length > 1 ? `Several people are called “${conv.ownerRef}” — owner left blank. Use their email instead.` : `“${conv.ownerRef}” isn't in your team directory — owner left blank.`,
        });
      }
    }

    // Software: an existing inventory record by name, or a new one.
    const existing = normName ? softwareByName.get(normName) : undefined;
    if (existing) {
      preview.software = { name: existing.name, existingId: existing.id, logo: existing.logoSrc };
      planned.softwareId = existing.id;
      if (existing.status === "archived") messages.push({ level: "error", text: `${existing.name} is archived in your inventory. Restore it first, or remove this row.` });
    } else if (conv.softwareName) {
      const r = readerFor({
        name: conv.softwareName,
        vendorName: conv.vendor,
        category: conv.category ?? "other",
        website: conv.website,
        businessPurpose: conv.purpose,
        ...(ownerId ? { ownerPersonId: ownerId } : {}),
        ...(departmentId ? { departmentId } : {}),
      });
      const input = readSoftwareInput(r);
      for (const [k, msg] of Object.entries(r.errors)) messages.push({ level: "error", text: k === "website" ? `${fieldLabel("website")}: ${msg}` : msg });
      planned.softwareInput = input;
      preview.software = { name: conv.softwareName, existingId: null, logo: logoFor(conv.softwareName, input.website, null) };
    }

    // The subscription itself, through the same validation as the form.
    const r = readerFor({ ...conv.fields, ...(ownerId ? { ownerPersonId: ownerId } : {}), ...(departmentId ? { departmentId } : {}) });
    const input = readSubscriptionInput(r, { currency: options.defaultCurrency });
    for (const msg of Object.values(r.errors)) messages.push({ level: "error", text: msg });
    planned.input = input;
    preview.priceMinor = input.priceMinor;
    preview.currency = input.currency;
    preview.interval = intervalLabel(input);
    preview.monthlyMinor = monthlyEquivalent(input);
    preview.nextRenewalDate = input.nextRenewalDate;
    preview.seats = input.purchasedSeats;
    preview.seatsInUse = input.reportedAssignedSeats;
    preview.planName = input.planName;

    if (messages.some((m) => m.level === "error")) continue;
    const key = duplicateKey({ softwareName: preview.software.name, planName: input.planName, billingInterval: input.billingInterval, customIntervalCount: input.customIntervalCount, customIntervalUnit: input.customIntervalUnit, currency: input.currency });
    const sameInFile = fileKeys.get(key);
    const sameInWorkspace = existingByKey.get(key);
    if (sameInWorkspace) {
      preview.status = "duplicate";
      preview.duplicateOf = { kind: "existing", subscriptionId: sameInWorkspace.id, label: `${sameInWorkspace.softwareName}${sameInWorkspace.planName ? ` · ${sameInWorkspace.planName}` : ""}` };
    } else if (sameInFile !== undefined) {
      preview.status = "duplicate";
      preview.duplicateOf = { kind: "file", line: sameInFile };
    } else {
      preview.status = "create";
      fileKeys.set(key, line);
    }
  }

  const count = (s: ImportPreviewRow["status"]) => rows.filter((r) => r.preview.status === s).length;
  const newNames = new Set(rows.filter((r) => r.preview.status === "create" && !r.softwareId).map((r) => r.normName));
  return {
    rows,
    preview: {
      fileName,
      fileHash,
      headers: parsed.headers,
      samples,
      mapping,
      options,
      rows: rows.map((r) => r.preview),
      counts: { total: rows.length, create: count("create"), duplicate: count("duplicate"), error: count("error") },
      newSoftware: newNames.size,
      previousImport: prev ? { at: new Date(prev.created_at).toISOString(), fileName: prev.file_name, created: prev.created_count } : null,
      notices,
    },
  };
}

export async function previewImport(ctx: BizContext, args: { text: string; fileName: string; mapping: Record<string, unknown> | null; options: ImportOptions }): Promise<ImportPreview> {
  return (await plan(ctx, args.text, cleanFileName(args.fileName), args.mapping, args.options)).preview;
}

export interface ImportResult {
  jobId: string;
  created: number;
  skipped: number;
  failed: number;
  createdIds: string[];
}

/**
 * Saves the rows the preview showed as "will be created". Re-plans from the
 * file on the server (the client's preview is never trusted), and refuses if
 * the plan changed since the preview, e.g. because someone added one of the
 * subscriptions meanwhile.
 */
export async function commitImport(
  ctx: BizContext,
  args: { text: string; fileName: string; mapping: Record<string, unknown>; options: ImportOptions; expectedHash: string; expectedCreate: number },
): Promise<ImportResult> {
  const fileName = cleanFileName(args.fileName);
  const { preview, rows } = await plan(ctx, args.text, fileName, args.mapping, args.options);
  if (preview.fileHash !== args.expectedHash) throw new BizError("stale", "The file changed since the preview. Preview it again before importing.");
  if (preview.counts.create !== args.expectedCreate)
    throw new BizError("stale", "Something changed since the preview — for example a subscription was added or the team directory changed. Preview the file again.");
  if (preview.counts.create === 0) throw new BizError("invalid", "Nothing to import: every row is a duplicate or has an error.");

  const ws = ctx.workspace.id;
  const toCreate = rows.filter((r) => r.preview.status === "create");
  const issues = rows
    .flatMap((r) => [
      // Stored messages never carry a card-number-like run of digits, even inside a quoted cell value.
      ...r.preview.messages.map((m) => ({ line: r.preview.line, level: m.level, text: m.text.replace(/\d[\d -]{10,}\d/g, "••••").slice(0, 300) })),
      ...(r.preview.status === "duplicate"
        ? [{ line: r.preview.line, level: "warning" as const, text: r.preview.duplicateOf?.kind === "file" ? `Duplicate of line ${r.preview.duplicateOf.line} — skipped.` : "Already in the workspace — skipped." }]
        : []),
    ])
    .slice(0, 200);
  const mapping = Object.fromEntries(Object.entries(preview.mapping).map(([field, col]) => [field, preview.headers[col as number] ?? null]));

  const result = await db().begin(async (sql) => {
    // One import of a given file at a time per workspace, so a double submit can't race itself.
    await sql`select pg_advisory_xact_lock(hashtext(${`biz-import:${ws}:${preview.fileHash}`}))`;
    const keys = toCreate.map((r) => r.idempotencyKey);
    const taken = new Set((await sql`select idempotency_key from biz_subscriptions where idempotency_key = any(${keys}::text[])`).map((r) => r.idempotency_key as string));
    const [job] = await sql`
      insert into biz_import_jobs (workspace_id, file_name, file_sha256, row_count, mapping, created_by)
      values (${ws}, ${fileName}, ${preview.fileHash}, ${rows.length}, ${sql.json(mapping as never)}, ${ctx.user.id})
      returning id`;
    const createdSoftware = new Map<string, string>();
    const createdIds: string[] = [];
    let skipped = preview.counts.duplicate;
    for (const r of toCreate) {
      if (taken.has(r.idempotencyKey)) {
        skipped++;
        continue;
      }
      const softwareId = r.softwareId ?? createdSoftware.get(r.normName) ?? null;
      const res = await createSubscriptionIn(sql, ctx, {
        softwareId,
        newSoftware: softwareId ? null : r.softwareInput,
        input: r.input!,
        idempotencyKey: r.idempotencyKey,
        seatPersonIds: [],
        source: "csv_import",
        importJobId: job.id,
      });
      if (!softwareId) createdSoftware.set(r.normName, res.softwareId);
      if (res.duplicate) skipped++;
      else createdIds.push(res.id);
    }
    const failed = preview.counts.error;
    await sql`
      update biz_import_jobs set created_count = ${createdIds.length}, skipped_count = ${skipped}, failed_count = ${failed}, issues = ${sql.json(issues as never)}
      where workspace_id = ${ws} and id = ${job.id}`;
    await logActivity(sql, ctx, {
      action: "subscriptions.imported",
      entityType: "import",
      entityId: job.id,
      summary: `Imported ${createdIds.length} subscription${createdIds.length === 1 ? "" : "s"} from ${fileName}${skipped || failed ? ` (${skipped} skipped, ${failed} with errors)` : ""}`,
      details: { created: createdIds.length, skipped, failed, newSoftware: createdSoftware.size },
    });
    return { jobId: job.id as string, created: createdIds.length, skipped, failed, createdIds };
  });
  return result;
}

function cleanFileName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "";
  const clean = base.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 200);
  return clean || "upload.csv";
}

// ─── History ────────────────────────────────────────────────────────────────

export interface ImportJob {
  id: string;
  fileName: string | null;
  createdAt: Date;
  createdByName: string | null;
  rowCount: number;
  created: number;
  skipped: number;
  failed: number;
  mapping: Record<string, string | null>;
  issues: { line: number; level: "error" | "warning"; text: string }[];
}

export async function getImportJobs(workspaceId: string, limit = 20): Promise<ImportJob[]> {
  const rows = await db()`
    select j.*, coalesce(a.actor_name, p.name, u.email) as created_by_name
    from biz_import_jobs j
    left join lateral (
      select actor_name from biz_activity a
      where a.workspace_id = j.workspace_id and a.entity_id = j.id and a.action = 'subscriptions.imported' limit 1
    ) a on true
    left join auth.users u on u.id = j.created_by
    left join biz_memberships m on m.workspace_id = j.workspace_id and m.user_id = j.created_by
    left join biz_people p on p.workspace_id = j.workspace_id and p.id = m.person_id
    where j.workspace_id = ${workspaceId}
    order by j.created_at desc
    limit ${Math.min(limit, 100)}`;
  return rows.map((r) => ({
    id: r.id,
    fileName: r.file_name,
    createdAt: r.created_at,
    createdByName: r.created_by_name,
    rowCount: r.row_count,
    created: r.created_count,
    skipped: r.skipped_count,
    failed: r.failed_count,
    mapping: r.mapping ?? {},
    issues: Array.isArray(r.issues) ? r.issues : [],
  }));
}

/** "Imported from CSV on <date>" for a subscription's detail page. */
export async function getImportJob(workspaceId: string, id: string): Promise<{ id: string; fileName: string | null; createdAt: Date } | null> {
  const [r] = await db()`select id, file_name, created_at from biz_import_jobs where workspace_id = ${workspaceId} and id = ${id}`;
  return r ? { id: r.id, fileName: r.file_name, createdAt: r.created_at } : null;
}

export function describePreviousImport(p: ImportPreview["previousImport"], dateFormat: Parameters<typeof formatIsoDate>[1]): string | null {
  if (!p) return null;
  return `This file was imported on ${formatIsoDate(p.at.slice(0, 10), dateFormat)}${p.created ? ` (${p.created} created)` : ""}. Rows already in the workspace are skipped as duplicates.`;
}
