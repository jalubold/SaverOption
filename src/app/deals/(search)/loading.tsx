import { OfferCardSkeleton } from "@/components/offers/offer-card";
import { Container } from "@/components/ui/primitives";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading deals" className="theme-dark">
      <div className="hero-glow border-b border-line">
        <Container className="py-12 sm:py-16">
          <div className="h-3 w-24 animate-pulse rounded bg-subtle" />
          <div className="mt-4 h-8 w-72 animate-pulse rounded bg-subtle" />
          <div className="mt-8 h-11 max-w-2xl animate-pulse rounded-xl bg-subtle" />
        </Container>
      </div>
      <Container className="grid gap-8 pb-24 pt-10 lg:grid-cols-[230px_minmax(0,1fr)]">
        <div className="hidden space-y-3 lg:block">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="h-7 animate-pulse rounded-md bg-subtle" />
          ))}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <OfferCardSkeleton key={i} />
          ))}
        </div>
      </Container>
    </div>
  );
}
