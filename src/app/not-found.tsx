import Link from "next/link";
import { SearchBox } from "@/components/search/search-box";
import { buttonClass, Container } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <Container className="py-24">
      <div className="mx-auto max-w-lg text-center">
        <p className="eyebrow">
          <strong>404</strong> Page not found
        </p>
        <h1 className="display mt-5 text-[2.75rem] sm:text-[3.5rem]">
          We couldn&apos;t find <em>that page.</em>
        </h1>
        <p className="mt-3 text-[15px] text-muted">
          The offer may have been removed, or the link may be mistyped. Try searching instead.
        </p>
        <SearchBox size="md" className="mt-8" placeholder="Search deals" />
        <Link href="/" className={buttonClass("ghost", "sm", "mt-6")}>
          Back to the homepage
        </Link>
      </div>
    </Container>
  );
}
