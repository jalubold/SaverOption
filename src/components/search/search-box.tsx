import Form from "next/form";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/components/ui/primitives";

/**
 * Keyword search that submits to /deals as a plain GET form — works without
 * JavaScript, and `next/form` upgrades it to a client-side navigation.
 */
export function SearchBox({
  defaultValue,
  size = "lg",
  placeholder = "Search products or keywords",
  autoFocus,
  hidden,
  className,
}: {
  defaultValue?: string;
  size?: "md" | "lg";
  placeholder?: string;
  autoFocus?: boolean;
  /** Extra params to keep when searching (e.g. the current category). */
  hidden?: Record<string, string | undefined>;
  className?: string;
}) {
  const lg = size === "lg";
  return (
    <Form action="/deals" role="search" className={cn("relative w-full", className)}>
      <label htmlFor={lg ? "search-lg" : "search-md"} className="sr-only">
        Search deals
      </label>
      <Icon
        name="search"
        size={lg ? 20 : 17}
        className={cn("pointer-events-none absolute top-1/2 -translate-y-1/2 text-faint", lg ? "left-4" : "left-3")}
      />
      <input
        id={lg ? "search-lg" : "search-md"}
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete="off"
        autoFocus={autoFocus}
        enterKeyHint="search"
        className={cn(
          "w-full rounded-xl border border-line-strong bg-surface text-fg shadow-[var(--shadow-card)] outline-none transition-colors placeholder:text-faint focus:border-accent focus:ring-4 focus:ring-accent/15",
          lg ? "h-14 pl-12 pr-28 text-base" : "h-11 pl-10 pr-24 text-[15px]",
        )}
      />
      {hidden &&
        Object.entries(hidden).map(([k, v]) => (v ? <input key={k} type="hidden" name={k} value={v} /> : null))}
      <button
        type="submit"
        className={cn(
          "absolute top-1/2 -translate-y-1/2 rounded-lg bg-accent font-medium text-accent-fg transition-colors hover:bg-accent-ink",
          lg ? "right-2 h-10 px-4 text-sm" : "right-1.5 h-8 px-3 text-[13px]",
        )}
      >
        Search
      </button>
    </Form>
  );
}
