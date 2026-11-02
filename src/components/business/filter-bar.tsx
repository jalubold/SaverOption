"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/components/ui/primitives";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterField {
  name: string;
  label: string;
  /** The value in effect ("" or null when nothing is chosen). */
  value: string | null;
  options?: FilterOption[];
  /** The "nothing chosen" option ("All", "Any confidence"); left out when the field always has a value (sort, period). */
  allLabel?: string;
  type?: "select" | "date";
  /** Shown only while another field has this value (custom dates for a "Custom" range). */
  showIf?: { name: string; value: string };
}

/**
 * The search and filters above a list, the same on every page: a search box and a few compact
 * selects (sort, period) in one row; every other filter behind one "Filters" button with a count,
 * in a panel that opens under the row. Changes apply at once (search after a short pause), and
 * active filters show as chips that remove themselves. It's a GET form, so the URL is the state.
 */
export function FilterBar({
  action,
  label,
  keep = {},
  search,
  inline = [],
  more = [],
  className = "mb-4",
}: {
  action: string;
  /** What the form filters, for screen readers ("Filter subscriptions"). */
  label: string;
  /** Parameters carried over as they are: the tab, the view. */
  keep?: Record<string, string | null | undefined>;
  search?: { name?: string; value: string; placeholder: string };
  inline?: FilterField[];
  more?: FilterField[];
  /** Spacing around the bar (no margin when it sits in a card's header). */
  className?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const searchName = search?.name ?? "q";
  const fields = [...inline, ...more];
  const fromProps = () => {
    const v: Record<string, string> = Object.fromEntries(fields.map((f) => [f.name, f.value ?? ""]));
    if (search) v[searchName] = search.value;
    return v;
  };
  const propsKey = JSON.stringify(fromProps());
  const [values, setValues] = useState(fromProps);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // A chip, "Clear all" or the tabs change the URL: show what it now says.
  const [seenKey, setSeenKey] = useState(propsKey);
  if (seenKey !== propsKey) {
    setSeenKey(propsKey);
    setValues(JSON.parse(propsKey));
  }
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const hidden = (name: string, v: Record<string, string>) => {
    const f = fields.find((x) => x.name === name);
    return Boolean(f?.showIf && v[f.showIf.name] !== f.showIf.value);
  };
  const go = (next: Record<string, string>) => {
    if (timer.current) clearTimeout(timer.current);
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(keep)) if (v) params.set(k, v);
    for (const [k, v] of Object.entries(next)) if (v && !hidden(k, next)) params.set(k, v);
    const qs = params.toString();
    startTransition(() => router.replace(qs ? `${action}?${qs}` : action, { scroll: false }));
  };
  const set = (name: string, value: string, { now = true } = {}) => {
    const next = { ...values, [name]: value };
    setValues(next);
    if (now) go(next);
    else {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => go(next), 400);
    }
  };

  const activeMore = more.filter((f) => f.value);
  const optionalInline = inline.filter((f) => f.allLabel !== undefined && f.value);
  const anyActive = activeMore.length > 0 || optionalInline.length > 0 || Boolean(search?.value);
  const clearAll = () => {
    const next = { ...values };
    for (const f of [...more, ...optionalInline]) next[f.name] = "";
    if (search) next[searchName] = "";
    setValues(next);
    go(next);
  };
  const labelOf = (f: FilterField) => f.options?.find((o) => o.value === f.value)?.label ?? f.value;

  return (
    <form
      method="get"
      action={action}
      role="search"
      aria-label={label}
      aria-busy={pending}
      className={cn("space-y-2.5", className)}
      onSubmit={(e) => {
        e.preventDefault();
        go(values);
        setOpen(false);
      }}
      data-filter-bar
    >
      {Object.entries(keep).map(([k, v]) => v && <input key={k} type="hidden" name={k} value={v} />)}
      <div className="flex flex-wrap items-center gap-2">
        {search && (
          <label className="relative min-w-0 basis-full sm:max-w-sm sm:flex-1 sm:basis-auto">
            <span className="sr-only">Search</span>
            <Icon name="search" size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
            <input
              type="search"
              name={searchName}
              value={values[searchName] ?? ""}
              onChange={(e) => set(searchName, e.target.value, { now: false })}
              placeholder={search.placeholder}
              autoComplete="off"
              className="h-9 w-full rounded-[9px] border border-line-strong bg-surface pl-9 pr-9 text-[13.5px] outline-none placeholder:text-faint focus:border-accent focus:ring-4 focus:ring-accent/15"
              data-filter-search
            />
            {pending && <Spinner className="absolute right-3 top-1/2 -translate-y-1/2" />}
          </label>
        )}
        {inline
          .filter((f) => !hidden(f.name, values))
          .map((f) => (f.type === "date" ? <DateChip key={f.name} field={f} value={values[f.name] ?? ""} onChange={(v) => set(f.name, v)} /> : <CompactSelect key={f.name} field={f} value={values[f.name] ?? ""} onChange={(v) => set(f.name, v)} />))}
        {more.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="filter-panel"
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[9px] border px-3 text-[13px] font-medium transition-colors",
              open || activeMore.length ? "border-accent/50 bg-accent-soft text-accent-ink" : "border-line-strong bg-surface text-fg hover:border-accent/40",
            )}
            data-filter-toggle
          >
            <FunnelIcon />
            Filters
            {activeMore.length > 0 && <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold text-white">{activeMore.length}</span>}
          </button>
        )}
        {!search && pending && <Spinner />}
      </div>

      {more.length > 0 && (
        <div id="filter-panel" hidden={!open} className="rounded-xl border border-line bg-surface p-3.5 shadow-[0_8px_24px_-16px_rgb(0_0_0/0.25)] sm:p-4" data-filter-panel>
          <div className="grid grid-cols-1 gap-3 min-[520px]:grid-cols-2 lg:grid-cols-4">
            {more
              .filter((f) => !hidden(f.name, values))
              .map((f) => (
                <label key={f.name} className="min-w-0 text-[12px] font-medium text-muted">
                  <span className="mb-1 block">{f.label}</span>
                  {f.type === "date" ? (
                    <input type="date" name={f.name} value={values[f.name] ?? ""} onChange={(e) => set(f.name, e.target.value)} className="biz-select w-full pr-2" />
                  ) : (
                    <select name={f.name} value={values[f.name] ?? ""} onChange={(e) => set(f.name, e.target.value)} className="biz-select w-full">
                      {f.allLabel !== undefined && <option value="">{f.allLabel}</option>}
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  )}
                </label>
              ))}
          </div>
          <div className="mt-3.5 flex items-center justify-between gap-3 border-t border-line pt-3">
            <span className="text-[12px] text-faint">Results update as you choose.</span>
            <button type="submit" className="inline-flex h-8 items-center rounded-[8px] bg-fg px-3 text-[12.5px] font-semibold text-bg hover:opacity-90">
              Done
            </button>
          </div>
        </div>
      )}

      {anyActive && (
        <div className="flex flex-wrap items-center gap-1.5" data-filter-chips>
          {activeMore.map((f) => (
            <button
              key={f.name}
              type="button"
              onClick={() => set(f.name, "")}
              className="inline-flex h-7 max-w-full items-center gap-1 rounded-full border border-line bg-subtle pl-2.5 pr-1.5 text-[12px] text-fg hover:border-accent/40"
              aria-label={`Remove filter ${f.label}: ${labelOf(f)}`}
            >
              <span className="text-faint">{f.label}:</span>
              <span className="truncate font-medium">{labelOf(f)}</span>
              <Icon name="x" size={12} className="shrink-0 text-faint" />
            </button>
          ))}
          <button type="button" onClick={clearAll} className="h-7 px-1.5 text-[12px] font-medium text-accent-ink hover:underline" data-filter-clear>
            Clear all
          </button>
        </div>
      )}
    </form>
  );
}

/** A select that fits in the row: its label and current choice in one control ("Sort  Name ▾"). */
function CompactSelect({ field, value, onChange }: { field: FilterField; value: string; onChange: (v: string) => void }) {
  const active = field.allLabel !== undefined && value !== "";
  return (
    <label
      className={cn(
        // On phones the compact selects share the row (and truncate); from sm up they size to their content.
        "relative inline-flex h-9 min-w-0 flex-1 basis-0 items-center rounded-[9px] border bg-surface pl-3 text-[13px] focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15 sm:flex-none sm:basis-auto",
        active ? "border-accent/50" : "border-line-strong",
      )}
    >
      <span className="shrink-0 text-faint">{field.label}</span>
      <select name={field.name} value={value} onChange={(e) => onChange(e.target.value)} className="h-full w-full min-w-0 cursor-pointer appearance-none truncate bg-transparent pl-1.5 pr-8 font-medium text-fg outline-none sm:w-auto sm:max-w-[11rem]">
        {field.allLabel !== undefined && <option value="">{field.allLabel}</option>}
        {field.options?.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Icon name="chevron-down" size={13} className="pointer-events-none absolute right-2.5 text-faint" />
    </label>
  );
}

function DateChip({ field, value, onChange }: { field: FilterField; value: string; onChange: (v: string) => void }) {
  return (
    <label className="inline-flex h-9 min-w-0 items-center gap-1.5 rounded-[9px] border border-line-strong bg-surface pl-3 pr-1.5 text-[13px] focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15">
      <span className="shrink-0 text-faint">{field.label}</span>
      <input type="date" name={field.name} value={value} onChange={(e) => onChange(e.target.value)} className="h-full min-w-0 bg-transparent font-medium text-fg outline-none" />
    </label>
  );
}

function Spinner({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("inline-block size-3.5 animate-spin rounded-full border-2 border-line-strong border-t-accent", className)} />;
}

function FunnelIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 5h18l-7 8v5l-4 2v-7L3 5z" />
    </svg>
  );
}
