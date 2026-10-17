"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useRef, useState, useTransition, type ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/components/ui/primitives";
import type { CategorySlug, OfferType, PriceFilter, SortKey } from "@/lib/types";

/**
 * Filter + sort controls for /deals. It is a plain GET form, so it works
 * without JavaScript (via the Apply button); with JS, every change
 * navigates immediately and the results dim while the server responds.
 */

const PendingContext = createContext(false);

function ResultsRegion({ children }: { children: ReactNode }) {
  const pending = useContext(PendingContext);
  return (
    <div aria-busy={pending} className={cn("transition-opacity", pending && "pointer-events-none opacity-50")}>
      {children}
    </div>
  );
}

interface Option<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface FiltersProps {
  q?: string;
  category?: CategorySlug;
  type?: OfferType;
  price?: PriceFilter;
  sort?: SortKey;
  categoryOptions: Option<CategorySlug>[];
  typeOptions: Option<OfferType>[];
  priceOptions: Option<PriceFilter>[];
  sortOptions: Option<SortKey>[];
  activeCount: number;
  children: ReactNode; // results
  toolbar: ReactNode; // rendered left of the sort control
}

export function DealsFilters(props: FiltersProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  function navigate() {
    const form = formRef.current;
    if (!form) return;
    const sp = new URLSearchParams();
    for (const [key, value] of new FormData(form)) {
      const v = String(value);
      if (!v || v === "all" || (key === "sort" && v === "relevance")) continue;
      sp.set(key, v);
    }
    const qs = sp.toString();
    startTransition(() => router.push(qs ? `/deals?${qs}` : "/deals", { scroll: false }));
  }

  return (
    <PendingContext.Provider value={pending}>
      <form
        ref={formRef}
        action="/deals"
        method="get"
        onChange={navigate}
        onSubmit={(e) => {
          e.preventDefault();
          navigate();
        }}
        className="grid gap-8 lg:grid-cols-[230px_minmax(0,1fr)]"
      >
        {props.q && <input type="hidden" name="q" value={props.q} />}

        {/* Filters */}
        <div>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="filters-panel"
            className="flex h-11 w-full items-center justify-between rounded-[12px] border border-line-strong bg-surface px-4 text-sm font-medium lg:hidden"
          >
            <span>
              Filters
              {props.activeCount > 0 && <span className="ml-1.5 text-accent-ink">({props.activeCount})</span>}
            </span>
            <Icon name={mobileOpen ? "x" : "menu"} size={16} className="text-faint" />
          </button>

          <div id="filters-panel" className={cn("mt-4 space-y-7 lg:mt-0 lg:block", !mobileOpen && "hidden")}>
            <RadioGroup legend="Price" name="price" value={props.price ?? "all"} options={props.priceOptions} variant="segmented" />
            <RadioGroup legend="Category" name="category" value={props.category ?? ""} options={[{ value: "" as CategorySlug, label: "All categories" }, ...props.categoryOptions]} />
            <RadioGroup legend="Offer type" name="type" value={props.type ?? ""} options={[{ value: "" as OfferType, label: "All types" }, ...props.typeOptions]} />
            <noscript>
              <button type="submit" className="h-9 rounded-lg bg-accent px-4 text-sm font-medium text-accent-fg">
                Apply filters
              </button>
            </noscript>
          </div>
        </div>

        {/* Results */}
        <div className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">{props.toolbar}</div>
            <label className="flex items-center gap-2 text-sm text-muted">
              Sort
              <select
                name="sort"
                defaultValue={props.sort ?? "relevance"}
                key={props.sort ?? "relevance"}
                className="h-10 rounded-full border border-line-strong bg-surface pl-4 pr-9 text-sm text-fg outline-none focus:border-accent"
              >
                {props.sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <ResultsRegion>{props.children}</ResultsRegion>
        </div>
      </form>
    </PendingContext.Provider>
  );
}

function RadioGroup<T extends string>({
  legend,
  name,
  value,
  options,
  variant = "list",
}: {
  legend: string;
  name: string;
  value: string;
  options: Option<T>[];
  variant?: "list" | "segmented";
}) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-faint">{legend}</legend>
      <div className={variant === "segmented" ? "seg grid w-full grid-cols-3" : "space-y-0.5"}>
        {options.map((o) => {
          const disabled = o.count === 0 && o.value !== value;
          return (
            <label
              key={o.value || "all"}
              className={cn(
                variant === "segmented"
                  ? "seg-item h-9 px-2 text-[13px]"
                  : "relative flex cursor-pointer items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-sm text-muted transition-colors hover:bg-subtle hover:text-fg has-[:checked]:bg-accent-soft has-[:checked]:font-medium has-[:checked]:text-accent-ink has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                // Uncontrolled + key: stays in sync with the URL after navigation.
                key={`${name}-${value}`}
                defaultChecked={o.value === value}
                disabled={disabled}
                className="sr-only"
              />
              <span className="truncate">{o.label}</span>
              {o.count !== undefined && variant === "list" && (
                <span className="tabular text-xs text-faint">{o.count}</span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
