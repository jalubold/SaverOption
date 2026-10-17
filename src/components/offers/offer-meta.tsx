import { Icon } from "@/components/ui/icon";
import { Badge, cn } from "@/components/ui/primitives";
import { expiryLabel, formatDate, formatShortDate } from "@/lib/format";
import { conditionLabels, offerTypeLabels } from "@/lib/labels";
import type { OfferView } from "@/lib/types";

/** Type + trust badges. Sponsored and exclusive status are always visible when they apply. */
export function OfferBadges({ offer }: { offer: OfferView }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Badge tone={offer.isFree ? "accent" : "neutral"}>{offerTypeLabels[offer.type]}</Badge>
      {offer.placement?.exclusive && (
        <Badge tone="outline">
          <Icon name="star" size={11} /> Exclusive
        </Badge>
      )}
      {offer.source === "official" && <Badge tone="outline">Official</Badge>}
      {offer.source === "partner" && <Badge tone="outline">Partner</Badge>}
      {offer.source === "third-party" && <Badge tone="outline">Third-party</Badge>}
      {offer.claim.method === "code" && <Badge tone="accent">Promo code</Badge>}
    </div>
  );
}

export function SponsoredLabel({ offer, className }: { offer: OfferView; className?: string }) {
  if (!offer.isSponsored) return null;
  return (
    <p className={cn("text-[11px] font-medium uppercase tracking-wider text-faint", className)}>
      Sponsored<span className="sr-only"> listing</span>
      {offer.placement?.sponsored?.sponsor && (
        <span className="normal-case tracking-normal"> · Paid placement by {offer.placement.sponsored.sponsor}</span>
      )}
    </p>
  );
}

export function ExpiryText({ offer, short = false, className }: { offer: OfferView; short?: boolean; className?: string }) {
  const label = expiryLabel(offer, { short });
  if (!label) return null;
  const urgent = !offer.isExpired && offer.daysLeft !== undefined && offer.daysLeft <= 14;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap",
        offer.isExpired ? "text-danger" : urgent ? "font-medium text-warn" : "text-muted",
        className,
      )}
    >
      <Icon name="clock" size={13} />
      {offer.expiresAt && !offer.isExpired ? (
        <time dateTime={offer.expiresAt}>{label}</time>
      ) : (
        label
      )}
    </span>
  );
}

/** Verification status. Demo listings say so explicitly — they are never shown as verified. */
export function VerificationText({ offer, long = false, className }: { offer: OfferView; long?: boolean; className?: string }) {
  const { status, checkedAt } = offer.verification;
  if (status === "verified") {
    return (
      <span className={cn("inline-flex items-center gap-1 whitespace-nowrap text-accent-ink", className)}>
        <Icon name="shield" size={13} />
        {checkedAt ? (
          <>
            {long ? "Verified by our editors on " : "Verified "}
            <time dateTime={checkedAt} title={formatDate(checkedAt)}>
              {long ? formatDate(checkedAt) : formatShortDate(checkedAt)}
            </time>
          </>
        ) : (
          "Verified"
        )}
      </span>
    );
  }
  if (status === "demo") {
    return (
      <span className={cn("inline-flex items-center gap-1 whitespace-nowrap text-faint", className)}>
        <Icon name="info" size={13} />
        {long ? "Sample listing — not a live offer" : "Sample listing"}
      </span>
    );
  }
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap text-faint", className)}>
      <Icon name="info" size={13} />
      {long ? "Not yet verified by our editors" : "Unverified"}
    </span>
  );
}

/**
 * Structured conditions (card required, regions, approval…). Only conditions
 * the source states are shown; `limit` keeps cards compact.
 */
export function OfferConditions({ offer, limit, className }: { offer: OfferView; limit?: number; className?: string }) {
  const items = conditionLabels(offer.requirements, offer.regions).slice(0, limit);
  if (items.length === 0) return null;
  return (
    <ul className={cn("flex flex-wrap gap-x-3 gap-y-1 text-xs", className)}>
      {items.map((c) => (
        <li key={c.label} className={cn("inline-flex items-center gap-1", c.positive ? "text-fg" : "text-muted")}>
          <Icon name={c.positive ? "check" : "info"} size={13} className={c.positive ? "text-success" : "text-faint"} />
          {c.label}
        </li>
      ))}
    </ul>
  );
}
