import Form from "next/form";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

/** Compact search in the header; collapses to an icon link on small screens. */
export function HeaderSearch() {
  return (
    <>
      <Form action="/deals" role="search" className="relative hidden w-64 lg:block">
        <label htmlFor="header-search" className="sr-only">
          Search deals
        </label>
        <Icon name="search" size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
        <input
          id="header-search"
          name="q"
          type="search"
          placeholder="Search deals"
          autoComplete="off"
          className="h-9 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm text-fg outline-none placeholder:text-faint focus:border-accent focus:ring-4 focus:ring-accent/15"
        />
      </Form>
      <Link
        href="/deals"
        className="inline-flex size-10 items-center justify-center rounded-lg text-muted hover:bg-subtle hover:text-fg lg:hidden"
      >
        <Icon name="search" size={19} />
        <span className="sr-only">Search deals</span>
      </Link>
    </>
  );
}
