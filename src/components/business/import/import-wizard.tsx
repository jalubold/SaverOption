"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { commitImportAction, previewImportAction } from "@/app/business/actions/import";
import { SoftwareLogo } from "@/components/business/software-logo";
import { Pill } from "@/components/business/ui";
import { FormMessage, inputClass } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { buttonClass, cn } from "@/components/ui/primitives";
import { formatIsoDate, formatMoney } from "@/lib/business/calc";
import { IMPORT_FIELDS, IMPORT_MAX_BYTES, IMPORT_MAX_ROWS, type ColumnMapping, type ImportField, type ImportOptions } from "@/lib/business/csv-import";
import type { ImportPreview, ImportPreviewRow, ImportResult } from "@/lib/server/business/import";

/**
 * Upload → preview (with column mapping and file options) → confirm → result.
 * Nothing is saved until "Import N subscriptions"; the server re-checks the
 * whole file then, so this preview is only ever a view of the server's plan.
 */

type Step = { kind: "upload" } | { kind: "preview"; preview: ImportPreview } | { kind: "done"; result: ImportResult; fileName: string };

const PAGE = 50;
const FILTERS = [
  { key: "all", label: "All rows" },
  { key: "create", label: "Will be created" },
  { key: "duplicate", label: "Duplicates" },
  { key: "error", label: "Errors" },
] as const;

async function compress(text: string): Promise<{ blob: Blob; encoding: "gzip" | "plain" }> {
  if (typeof CompressionStream !== "undefined") {
    try {
      const stream = new Blob([text]).stream().pipeThrough(new CompressionStream("gzip"));
      return { blob: await new Response(stream).blob(), encoding: "gzip" };
    } catch {
      // fall through to a plain upload
    }
  }
  return { blob: new Blob([text], { type: "text/csv" }), encoding: "plain" };
}

export function ImportWizard({ workspaceId, defaults, dateFormat }: { workspaceId: string; defaults: ImportOptions; dateFormat: string }) {
  const router = useRouter();
  const fileInputId = useId();
  const [step, setStep] = useState<Step>({ kind: "upload" });
  const [file, setFile] = useState<{ name: string; text: string } | null>(null);
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [options, setOptions] = useState<ImportOptions>(defaults);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<{ text: string; stale?: boolean } | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [page, setPage] = useState(1);
  const [pending, start] = useTransition();
  const [busy, setBusy] = useState<"preview" | "commit" | null>(null);

  async function formFor(f: { name: string; text: string }, extra: Record<string, string>) {
    const fd = new FormData();
    fd.set("workspaceId", workspaceId);
    fd.set("fileName", f.name);
    const { blob, encoding } = await compress(f.text);
    fd.set("encoding", encoding);
    fd.set("file", blob, encoding === "gzip" ? "upload.csv.gz" : "upload.csv");
    for (const [k, v] of Object.entries(extra)) fd.set(k, v);
    return fd;
  }

  function runPreview(f: { name: string; text: string }, m: ColumnMapping | null, o: ImportOptions) {
    setError(null);
    setBusy("preview");
    start(async () => {
      try {
        const res = await previewImportAction(await formFor(f, { options: JSON.stringify(o), ...(m ? { mapping: JSON.stringify(m) } : {}) }));
        if (!res.ok) {
          setError({ text: res.error });
          return;
        }
        setMapping(res.preview.mapping);
        setOptions(res.preview.options);
        setDirty(false);
        setFilter(res.preview.counts.error ? "error" : "all");
        setPage(1);
        setStep({ kind: "preview", preview: res.preview });
      } catch {
        setError({ text: "The file couldn't be sent. It may be too large for this browser — try a smaller file, or check your connection." });
      } finally {
        setBusy(null);
      }
    });
  }

  function runCommit(preview: ImportPreview) {
    if (!file) return;
    setError(null);
    setBusy("commit");
    start(async () => {
      try {
        const res = await commitImportAction(
          await formFor(file, {
            mapping: JSON.stringify(mapping),
            options: JSON.stringify(options),
            expectedHash: preview.fileHash,
            expectedCreate: String(preview.counts.create),
          }),
        );
        if (!res.ok) {
          setError({ text: res.error, stale: res.stale });
          return;
        }
        setStep({ kind: "done", result: res.result, fileName: preview.fileName });
        router.refresh();
      } catch {
        setError({ text: "The import couldn't be sent, so nothing was saved. Check your connection and try again." });
      } finally {
        setBusy(null);
      }
    });
  }

  async function onFile(input: HTMLInputElement) {
    const f = input.files?.[0];
    setError(null);
    if (!f) return;
    if (!/\.(csv|txt|tsv)$/i.test(f.name)) {
      setError({ text: "Choose a .csv file. In Excel or Google Sheets, use File → Download / Save as → CSV." });
      return;
    }
    if (f.size > IMPORT_MAX_BYTES) {
      setError({ text: "The file is larger than 1 MB. Split it into smaller files." });
      return;
    }
    const text = await f.text();
    const next = { name: f.name, text };
    setFile(next);
    runPreview(next, null, defaults);
  }

  function reset() {
    setStep({ kind: "upload" });
    setFile(null);
    setMapping({});
    setOptions(defaults);
    setError(null);
    setDirty(false);
  }

  const errorBox = error && (
    <div className="mt-4 space-y-2">
      <FormMessage tone="error">{error.text}</FormMessage>
      {error.stale && file && (
        <button type="button" className={buttonClass("secondary", "sm")} onClick={() => runPreview(file, mapping, options)} disabled={pending}>
          <Icon name="refresh" size={14} /> Preview again
        </button>
      )}
    </div>
  );

  if (step.kind === "done") {
    const r = step.result;
    return (
      <section className="biz-card p-5" aria-live="polite">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success/12 text-[color-mix(in_oklab,var(--success)_75%,black)]">
            <Icon name="check" size={20} />
          </span>
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold text-fg">
              Imported {r.created} subscription{r.created === 1 ? "" : "s"} from {step.fileName}
            </h2>
            <p className="mt-1 text-[13.5px] text-muted">
              {r.skipped} skipped as duplicates · {r.failed} with errors not imported. The new records are marked “Imported from CSV” and “Not verified” until someone reviews them, and they&apos;re already in your dashboard totals.
            </p>
          </div>
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
          {[
            ["Created", r.created],
            ["Skipped", r.skipped],
            ["Failed", r.failed],
          ].map(([label, n]) => (
            <div key={label} className="rounded-xl border border-line px-3 py-2.5">
              <dt className="text-[12px] text-faint">{label}</dt>
              <dd className="tabular text-[1.3rem] font-semibold text-heading">{n}</dd>
            </div>
          ))}
        </dl>
        {r.createdIds.length > 0 && (
          <details className="mt-4 text-[13px]">
            <summary className="cursor-pointer text-muted hover:text-fg">Open the imported subscriptions</summary>
            <ul className="mt-2 flex flex-wrap gap-2">
              {r.createdIds.slice(0, 60).map((id, i) => (
                <li key={id}>
                  <Link href={`/business/subscriptions/${id}`} className="rounded-md border border-line px-2 py-1 text-[12.5px] hover:border-line-strong">
                    #{i + 1}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        )}
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/business/subscriptions" className={buttonClass("primary", "sm")}>
            View subscriptions
          </Link>
          <Link href={`/business/subscriptions/import?job=${r.jobId}#history`} className={buttonClass("secondary", "sm")}>
            Import details
          </Link>
          <button type="button" className={buttonClass("ghost", "sm")} onClick={reset}>
            Import another file
          </button>
        </div>
      </section>
    );
  }

  const preview = step.kind === "preview" ? step.preview : null;
  return (
    <div className="space-y-5">
      <section className="biz-card p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <label htmlFor={fileInputId} className="block text-[13px] font-medium text-fg">
              CSV file
            </label>
            <input
              id={fileInputId}
              type="file"
              accept=".csv,text/csv,.txt,.tsv,text/tab-separated-values"
              className="mt-1.5 block w-full max-w-md text-[13.5px] text-muted file:mr-3 file:rounded-lg file:border file:border-line-strong file:bg-surface file:px-3 file:py-1.5 file:text-[13px] file:font-medium file:text-fg hover:file:bg-subtle"
              onChange={(e) => void onFile(e.currentTarget)}
              disabled={pending}
              aria-describedby={`${fileInputId}-hint`}
            />
            <p id={`${fileInputId}-hint`} className="mt-1.5 text-[12px] text-faint">
              Up to 1 MB and {IMPORT_MAX_ROWS.toLocaleString("en-US")} rows. Comma, semicolon or tab separated, first row with column names. The file is read in memory and not stored.
            </p>
          </div>
          <a href="/business/subscriptions/import/template" className={buttonClass("secondary", "sm")} download>
            <Icon name="download" size={14} /> Download the template
          </a>
        </div>
        {busy === "preview" && (
          <p className="mt-3 flex items-center gap-2 text-[13px] text-muted" role="status">
            <span aria-hidden="true" className="size-3.5 animate-spin rounded-full border-2 border-line-strong border-t-accent" /> Reading {file?.name}…
          </p>
        )}
        {step.kind === "upload" && errorBox}
      </section>

      {preview && file && (
        <>
          <PreviewSummary preview={preview} dateFormat={dateFormat} />

          <section className="biz-card">
            <div className="border-b border-line px-4 py-3 sm:px-5">
              <h2 className="text-[14.5px] font-semibold text-fg">Columns and file options</h2>
              <p className="mt-0.5 text-[12.5px] text-faint">Columns were matched by their names. Change any that are wrong, then update the preview. Columns you don&apos;t map are ignored.</p>
            </div>
            <div className="grid gap-x-5 gap-y-3 px-4 py-4 sm:grid-cols-2 sm:px-5 lg:grid-cols-3">
              {IMPORT_FIELDS.map((f) => {
                const value = mapping[f.key];
                return (
                  <label key={f.key} className="block min-w-0">
                    <span className="block text-[12.5px] font-medium text-fg">
                      {f.label} {f.required && <span className="text-danger">*</span>}
                    </span>
                    <select
                      aria-label={f.label}
                      className={cn("biz-select mt-1 w-full", f.required && value === undefined && "border-danger")}
                      value={value === undefined ? "" : String(value)}
                      onChange={(e) => {
                        const v = e.currentTarget.value;
                        setMapping((m) => {
                          const next: ColumnMapping = { ...m };
                          if (v === "") delete next[f.key];
                          else {
                            // One column feeds one field: moving it here unmaps it elsewhere.
                            for (const k of Object.keys(next) as ImportField[]) if (next[k] === Number(v)) delete next[k];
                            next[f.key] = Number(v);
                          }
                          return next;
                        });
                        setDirty(true);
                      }}
                    >
                      <option value="">— Not in this file —</option>
                      {preview.headers.map((h, i) => (
                        <option key={i} value={i}>
                          {h || `Column ${i + 1}`}
                          {preview.samples[i]?.length ? ` — e.g. ${preview.samples[i].join(", ").slice(0, 40)}` : ""}
                        </option>
                      ))}
                    </select>
                  </label>
                );
              })}
            </div>
            <div className="grid gap-x-5 gap-y-3 border-t border-line px-4 py-4 sm:grid-cols-2 sm:px-5 lg:grid-cols-4">
              <label className="block">
                <span className="block text-[12.5px] font-medium text-fg">Date format in the file</span>
                <select
                  className="biz-select mt-1 w-full"
                  value={options.dateOrder}
                  onChange={(e) => {
                    setOptions({ ...options, dateOrder: e.currentTarget.value as ImportOptions["dateOrder"] });
                    setDirty(true);
                  }}
                >
                  <option value="iso">YYYY-MM-DD</option>
                  <option value="dmy">DD/MM/YYYY</option>
                  <option value="mdy">MM/DD/YYYY</option>
                </select>
              </label>
              <label className="block">
                <span className="block text-[12.5px] font-medium text-fg">Decimal separator</span>
                <select
                  className="biz-select mt-1 w-full"
                  value={options.decimal}
                  onChange={(e) => {
                    setOptions({ ...options, decimal: e.currentTarget.value as ImportOptions["decimal"] });
                    setDirty(true);
                  }}
                >
                  <option value="dot">Dot (1,299.50)</option>
                  <option value="comma">Comma (1.299,50)</option>
                </select>
              </label>
              <label className="block">
                <span className="block text-[12.5px] font-medium text-fg">Currency when a row has none</span>
                <input
                  className={inputClass(false, "mt-1 h-9 text-[13.5px] uppercase")}
                  value={options.defaultCurrency}
                  maxLength={3}
                  onChange={(e) => {
                    setOptions({ ...options, defaultCurrency: e.currentTarget.value.toUpperCase() });
                    setDirty(true);
                  }}
                />
              </label>
              <label className="block">
                <span className="block text-[12.5px] font-medium text-fg">Billing interval when a row has none</span>
                <select
                  className="biz-select mt-1 w-full"
                  value={options.defaultInterval}
                  onChange={(e) => {
                    setOptions({ ...options, defaultInterval: e.currentTarget.value as ImportOptions["defaultInterval"] });
                    setDirty(true);
                  }}
                >
                  <option value="">Required in every row</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </label>
            </div>
            <div className="flex flex-wrap items-center gap-3 border-t border-line px-4 py-3 sm:px-5">
              <button type="button" className={buttonClass(dirty ? "primary" : "secondary", "sm")} onClick={() => runPreview(file, mapping, options)} disabled={pending}>
                <Icon name="refresh" size={14} /> Update preview
              </button>
              {dirty && <span className="text-[12.5px] text-warn">You changed the columns or options — update the preview before importing.</span>}
            </div>
          </section>

          <RowsTable preview={preview} filter={filter} setFilter={(f) => { setFilter(f); setPage(1); }} page={page} setPage={setPage} dateFormat={dateFormat} />

          <section className="biz-card p-5">
            <h2 className="text-[14.5px] font-semibold text-fg">Confirm the import</h2>
            <p className="mt-1 text-[13.5px] text-muted">
              {preview.counts.create} subscription{preview.counts.create === 1 ? "" : "s"} will be created
              {preview.newSoftware ? `, adding ${preview.newSoftware} new software record${preview.newSoftware === 1 ? "" : "s"} to your inventory` : ""}. {preview.counts.duplicate} duplicate
              {preview.counts.duplicate === 1 ? "" : "s"} and {preview.counts.error} row{preview.counts.error === 1 ? "" : "s"} with errors will be skipped. Existing records are never changed.
            </p>
            {errorBox}
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className={buttonClass("primary", "md")} disabled={pending || dirty || preview.counts.create === 0} onClick={() => runCommit(preview)}>
                {busy === "commit" ? "Importing…" : `Import ${preview.counts.create} subscription${preview.counts.create === 1 ? "" : "s"}`}
              </button>
              <button type="button" className={buttonClass("ghost", "md")} onClick={reset} disabled={pending}>
                Choose another file
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function PreviewSummary({ preview, dateFormat }: { preview: ImportPreview; dateFormat: string }) {
  const c = preview.counts;
  return (
    <section className="biz-card p-5" aria-live="polite">
      <p className="text-[13px] text-faint">{preview.fileName}</p>
      <h2 className="mt-0.5 text-[16px] font-semibold text-fg">
        {c.total} row{c.total === 1 ? "" : "s"} in the file
      </h2>
      <div className="mt-3 flex flex-wrap gap-2 text-[13px]">
        <Pill tone="success">{c.create} will be created</Pill>
        <Pill tone="neutral">{c.duplicate} duplicate{c.duplicate === 1 ? "" : "s"} — skipped</Pill>
        <Pill tone={c.error ? "danger" : "neutral"}>{c.error} with errors — skipped</Pill>
      </div>
      {preview.previousImport && (
        <p className="mt-3 flex gap-2 rounded-lg border border-warn/30 bg-warn-soft px-3 py-2 text-[13px] text-fg">
          <Icon name="info" size={15} className="mt-0.5 shrink-0 text-warn" />
          This file was imported on {formatIsoDate(preview.previousImport.at.slice(0, 10), dateFormat)}
          {preview.previousImport.created ? ` (${preview.previousImport.created} created)` : ""}. Rows already in the workspace are skipped as duplicates.
        </p>
      )}
      {preview.notices.map((n) => (
        <p key={n} className="mt-3 flex gap-2 rounded-lg border border-line bg-subtle px-3 py-2 text-[13px] text-muted">
          <Icon name="info" size={15} className="mt-0.5 shrink-0 text-faint" /> {n}
        </p>
      ))}
    </section>
  );
}

const statusPill: Record<ImportPreviewRow["status"], { tone: "success" | "neutral" | "danger"; label: string }> = {
  create: { tone: "success", label: "Will be created" },
  duplicate: { tone: "neutral", label: "Duplicate — skipped" },
  error: { tone: "danger", label: "Error — skipped" },
};

function RowsTable({
  preview,
  filter,
  setFilter,
  page,
  setPage,
  dateFormat,
}: {
  preview: ImportPreview;
  filter: (typeof FILTERS)[number]["key"];
  setFilter: (f: (typeof FILTERS)[number]["key"]) => void;
  page: number;
  setPage: (p: number) => void;
  dateFormat: string;
}) {
  const rows = filter === "all" ? preview.rows : preview.rows.filter((r) => r.status === filter);
  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const shown = rows.slice((page - 1) * PAGE, page * PAGE);
  return (
    <section className="biz-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3 sm:px-5">
        <h2 className="text-[14.5px] font-semibold text-fg">Preview</h2>
        <div role="group" aria-label="Show rows" className="flex flex-wrap gap-1">
          {FILTERS.map((f) => {
            const n = f.key === "all" ? preview.counts.total : preview.counts[f.key];
            return (
              <button
                key={f.key}
                type="button"
                aria-pressed={filter === f.key}
                onClick={() => setFilter(f.key)}
                className={cn("rounded-lg px-2.5 py-1 text-[12.5px] font-medium", filter === f.key ? "bg-accent-soft text-accent-ink" : "text-muted hover:bg-subtle hover:text-fg")}
              >
                {f.label} <span className="tabular text-faint">{n}</span>
              </button>
            );
          })}
        </div>
      </div>
      {rows.length === 0 ? (
        <p className="px-5 py-6 text-[13.5px] text-muted">No rows to show.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="biz-table">
            <caption className="sr-only">How each row of the file will be imported</caption>
            <thead>
              <tr>
                <th>Line</th>
                <th>Result</th>
                <th>Software</th>
                <th className="num">Price</th>
                <th>Billing</th>
                <th className="num">Monthly equiv.</th>
                <th>Next renewal</th>
                <th className="num">Seats</th>
                <th>Department · Owner</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.line}>
                  <td className="tabular text-faint">{r.line}</td>
                  <td>
                    <Pill tone={statusPill[r.status].tone}>{statusPill[r.status].label}</Pill>
                  </td>
                  <td className="min-w-48">
                    <span className="flex items-center gap-2.5">
                      <SoftwareLogo name={r.software.name} src={r.software.logo} size={26} />
                      <span className="min-w-0">
                        <span className="block font-medium text-fg">{r.software.name}</span>
                        <span className="block text-[12px] text-faint">
                          {r.planName ?? "No plan"} · {r.software.existingId ? "In your inventory" : "New software"}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className="num">{r.priceMinor !== null ? formatMoney(r.priceMinor, r.currency) : <span className="text-faint">Unknown</span>}</td>
                  <td className="whitespace-nowrap">{r.interval ?? "—"}</td>
                  <td className="num">{r.monthlyMinor !== null ? formatMoney(Math.round(r.monthlyMinor), r.currency) : <span className="text-faint">—</span>}</td>
                  <td className="whitespace-nowrap">{r.nextRenewalDate ? formatIsoDate(r.nextRenewalDate, dateFormat) : <span className="text-faint">—</span>}</td>
                  <td className="num">
                    {r.seats ?? "—"}
                    {r.seatsInUse !== null && <span className="text-faint"> ({r.seatsInUse} in use)</span>}
                  </td>
                  <td className="min-w-40 text-[12.5px]">
                    {r.department ? <span className={cn("block", !r.department.name && "text-warn")}>{r.department.name ?? `${r.department.ref} (not found)`}</span> : <span className="block text-faint">No department</span>}
                    {r.owner ? <span className={cn("block", !r.owner.name && "text-warn")}>{r.owner.name ?? `${r.owner.ref} (not found)`}</span> : <span className="block text-faint">No owner</span>}
                  </td>
                  <td className="min-w-64 text-[12.5px]">
                    {r.duplicateOf &&
                      (r.duplicateOf.kind === "existing" ? (
                        <span className="block text-muted">
                          Same as{" "}
                          <Link href={`/business/subscriptions/${r.duplicateOf.subscriptionId}`} className="text-accent-ink underline underline-offset-2" target="_blank">
                            {r.duplicateOf.label}
                          </Link>{" "}
                          already in the workspace.
                        </span>
                      ) : (
                        <span className="block text-muted">Same as line {r.duplicateOf.line} in this file.</span>
                      ))}
                    {r.messages.map((m, i) => (
                      <span key={i} className={cn("block", m.level === "error" ? "text-danger" : "text-warn")}>
                        {m.text}
                      </span>
                    ))}
                    {!r.duplicateOf && r.messages.length === 0 && <span className="text-faint">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pages > 1 && (
        <nav aria-label="Preview pages" className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 text-[13px] text-muted sm:px-5">
          <span>
            Rows {(page - 1) * PAGE + 1}–{Math.min(page * PAGE, rows.length)} of {rows.length}
          </span>
          <span className="flex gap-2">
            <button type="button" className={buttonClass("secondary", "sm")} disabled={page === 1} onClick={() => setPage(page - 1)}>
              <Icon name="chevron-left" size={14} /> Previous
            </button>
            <button type="button" className={buttonClass("secondary", "sm")} disabled={page === pages} onClick={() => setPage(page + 1)}>
              Next <Icon name="chevron-right" size={14} />
            </button>
          </span>
        </nav>
      )}
    </section>
  );
}
