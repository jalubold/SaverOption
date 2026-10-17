import Link from "next/link";
import { ExpiryText, OfferBadges, SponsoredLabel, VerificationText } from "@/components/offers/offer-meta";
import { ProductLogo } from "@/components/offers/product-logo";
import { Icon } from "@/components/ui/icon";
import { buttonClass, cn } from "@/components/ui/primitives";
import { headlineValue, summarizePrice } from "@/lib/format";
import { outboundHref, outboundRel } from "@/lib/outbound";
import type { OfferView } from "@/lib/types";

/**
 * The core listing unit. The whole card links to the detail page (stretched
 * link on the title); "View deal" goes straight to the provider.
 */
export function OfferCard({ offer, headingLevel = "h3" }: { offer: OfferView; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const value = headlineValue(offer);
  const price = summarizePrice(offer.pricing);
  const detailHref = `/deals/${offer.slug}`;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-[var(--radius-card)] border bg-surface p-5 shadow-[var(--shadow-card)] transition-[border-color,box-shadow] hover:shadow-[var(--shadow-card-hover)]",
        offer.isSponsored ? "border-dashed border-line-strong" : "border-line hover:border-line-strong",
        offer.isExpired && "opacity-75",
      )}
    >
      <SponsoredLabel offer={offer} className="mb-3" />

      <div className="flex items-start gap-3">
        <ProductLogo product={offer.product} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-fg">{offer.product.name}</p>
          <p className="truncate text-xs text-faint">{offer.product.tagline}</p>
        </div>
      </div>

      <Heading className="mt-4 text-[15px] font-semibold leading-snug text-fg">
        <Link
          href={detailHref}
          className="outline-none after:absolute after:inset-0 after:rounded-[var(--radius-card)] after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent"
        >
          {offer.title}
        </Link>
      </Heading>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">{offer.summary}</p>

      <div className="mt-4">
        <OfferBadges offer={offer} />
      </div>

      {(value || price) && (
        <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 border-t border-line pt-4">
          {value && <span className="text-[15px] font-semibold text-accent-ink">{value}</span>}
          {price?.current && (price.was || !value) && (
            <span className="tabular text-sm text-fg">
              {value && <span className="sr-only">Price: </span>}
              {price.current}
            </span>
          )}
          {price?.was && (
            <s className="tabular text-sm text-faint">
              <span className="sr-only">was </span>
              {price.was}
            </s>
          )}
          {price?.note && (!value || value === price.current) && (
            <span className="text-xs text-faint">{price.note}</span>
          )}
        </div>
      )}

      <div className="mt-auto flex items-end justify-between gap-3 pt-5">
        <div className="flex min-w-0 flex-col gap-1 text-xs">
          <ExpiryText offer={offer} />
          <VerificationText offer={offer} />
        </div>
        {!offer.isExpired && (
          <a
            href={outboundHref(offer)}
            target="_blank"
            rel={outboundRel(offer)}
            className={buttonClass("secondary", "sm", "relative z-10 shrink-0")}
          >
            View deal
            <Icon name="external" size={13} />
            <span className="sr-only">for {offer.product.name} (opens provider site in a new tab)</span>
          </a>
        )}
      </div>
    </article>
  );
}

export function OfferGrid({ offers, headingLevel }: { offers: OfferView[]; headingLevel?: "h2" | "h3" }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {offers.map((offer) => (
        <li key={offer.id}>
          <OfferCard offer={offer} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}

export function OfferCardSkeleton() {
  return (
    <div className="h-[290px] animate-pulse rounded-[var(--radius-card)] border border-line bg-surface p-5">
      <div className="flex gap-3">
        <div className="size-11 rounded-lg bg-subtle" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3 w-1/3 rounded bg-subtle" />
          <div className="h-3 w-1/2 rounded bg-subtle" />
        </div>
      </div>
      <div className="mt-6 h-4 w-4/5 rounded bg-subtle" />
      <div className="mt-3 h-3 w-full rounded bg-subtle" />
      <div className="mt-2 h-3 w-2/3 rounded bg-subtle" />
      <div className="mt-8 h-3 w-1/4 rounded bg-subtle" />
    </div>
  );
}
