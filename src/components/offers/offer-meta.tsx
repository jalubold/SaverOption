import { Icon } from "@/components/ui/icon";
import { Badge, cn } from "@/components/ui/primitives";
import { expiryLabel, formatDate } from "@/lib/format";
import { offerTypeLabels } from "@/lib/labels";
import type { OfferView } from "@/lib/types";

/** Type + trust badges. Sponsored and exclusive status are always visible when they apply. */
export function OfferBadges({ offer, showSource = false }: { offer: OfferView; showSource?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Badge tone={offer.isFree ? "accent" : "neutral"}>{offerTypeLabels[offer.type]}</Badge>
      {offer.placement?.exclusive && (
        <Badge tone="outline">
          <Icon name="star" size={11} /> Exclusive
        </Badge>
      )}
      {/* Third-party offers are always flagged; official/partner only where source is the point (detail page). */}
      {offer.source === "third-party" && <Badge tone="outline">Third-party</Badge>}
      {showSource && offer.source === "official" && <Badge tone="outline">Official</Badge>}
      {showSource && offer.source === "partner" && <Badge tone="outline">Partner</Badge>}
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

export function ExpiryText({ offer, className }: { offer: OfferView; className?: string }) {
  const label = expiryLabel(offer);
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
      <span className={cn("inline-flex items-center gap-1 text-accent-ink", className)}>
        <Icon name="shield" size={13} />
        {checkedAt ? (
          <>
            {long ? "Verified by our editors on " : "Verified "}
            <time dateTime={checkedAt}>{formatDate(checkedAt)}</time>
          </>
        ) : (
          "Verified"
        )}
      </span>
    );
  }
  if (status === "demo") {
    return (
      <span className={cn("inline-flex items-center gap-1 text-faint", className)}>
        <Icon name="info" size={13} />
        {long ? "Sample listing — not a live offer" : "Sample listing"}
      </span>
    );
  }
  return (
    <span className={cn("inline-flex items-center gap-1 text-faint", className)}>
      <Icon name="info" size={13} />
      {long ? "Not yet verified by our editors" : "Unverified"}
    </span>
  );
}
