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
  placeholder = "Search software deals",
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
        className={cn("pointer-events-none absolute top-1/2 -translate-y-1/2 text-faint", lg ? "left-4" : "left-3.5")}
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
          "w-full rounded-[14px] border border-line-strong bg-surface text-fg outline-none transition-colors placeholder:text-faint focus:border-accent focus:ring-4 focus:ring-accent/20",
          lg ? "h-14 pl-12 pr-28 text-base" : "h-12 pl-10 pr-24 text-[15px]",
        )}
      />
      {hidden &&
        Object.entries(hidden).map(([k, v]) => (v ? <input key={k} type="hidden" name={k} value={v} /> : null))}
      <button
        type="submit"
        className={cn("btn btn-primary absolute top-1/2 -translate-y-1/2", lg ? "right-2 h-10 rounded-[10px] px-4 text-sm" : "right-1.5 h-9 rounded-[10px] px-3.5 text-[13px]")}
      >
        Search
      </button>
    </Form>
  );
}
