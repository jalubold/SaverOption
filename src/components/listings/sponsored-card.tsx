import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { PublicListing } from "@/lib/server/submissions";

export function SponsoredLabel() {
  return (
    <span className="inline-flex items-center rounded-md border border-line-strong px-1.5 py-px text-[11px] font-medium uppercase tracking-[0.06em] text-muted">
      Sponsored
    </span>
  );
}

export function ListingLogo({ listing, size = 48 }: { listing: Pick<PublicListing, "logo_url" | "product_name">; size?: number }) {
  return listing.logo_url ? (
    // eslint-disable-next-line @next/next/no-img-element -- advertiser logo from Supabase Storage
    <img src={listing.logo_url} alt="" width={size} height={size} style={{ width: size, height: size }} className="shrink-0 rounded-xl border border-line bg-white object-contain" />
  ) : (
    <span style={{ width: size, height: size }} className="inline-flex shrink-0 items-center justify-center rounded-xl border border-line bg-subtle text-lg font-semibold text-muted">
      {listing.product_name.slice(0, 1).toUpperCase()}
    </span>
  );
}

/** A paid listing card. Always labelled Sponsored; links to the listing page, not straight out. */
export function SponsoredCard({ listing }: { listing: PublicListing }) {
  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="group flex h-full flex-col rounded-[16px] border border-line bg-surface p-5 shadow-[var(--shadow-card)] transition-[border-color,transform] hover:-translate-y-0.5 hover:border-line-strong"
    >
      <div className="flex items-start justify-between gap-3">
        <ListingLogo listing={listing} />
        <SponsoredLabel />
      </div>
      <h3 className="mt-4 text-[16px] font-semibold text-fg group-hover:text-accent-ink">{listing.product_name}</h3>
      {listing.description && <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-muted">{listing.description}</p>}
      <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-accent-ink">
        Learn more <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
