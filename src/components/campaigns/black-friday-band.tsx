import Link from "next/link";
import type { CSSProperties } from "react";
import { Countdown } from "@/components/campaigns/countdown";
import { OfferGrid } from "@/components/offers/offer-card";
import { ProductLogo } from "@/components/offers/product-logo";
import { Icon } from "@/components/ui/icon";
import { buttonClass, cn } from "@/components/ui/primitives";
import { formatDate } from "@/lib/format";
import type { Campaign, OfferView } from "@/lib/types";

export const countdownLabels = (c: Campaign) => ({
  before: `${c.name} starts in`,
  live: `${c.name} deals end in`,
  after: `${c.name} ${c.year} has ended. Deals with later end dates stay listed.`,
});

/**
 * The Black Friday band on the home page and the categories page: the countdown, a few of the deals
 * and a way to all of them. Before any deal is announced it says so instead of showing an empty grid.
 */
export function BlackFridayBand({ campaign, offers, limit = 6, headingId = "black-friday-heading", compact = false }: { campaign: Campaign; offers: OfferView[]; limit?: number; headingId?: string; compact?: boolean }) {
  const shown = offers.slice(0, limit);
  const logos = [...new Map(offers.map((o) => [o.product.id, o.product])).values()].slice(0, 6);
  return (
    <section aria-labelledby={headingId} className="space-y-6" data-black-friday-band>
      <div
        style={{ "--bf-from": campaign.color.from, "--bf-to": campaign.color.to } as CSSProperties}
        className="theme-dark relative overflow-hidden rounded-[22px] border border-white/10 bg-[#09090b] p-6 text-fg shadow-[0_30px_80px_-40px_rgb(0_0_0/0.7)] sm:p-8"
      >
        <span aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[var(--bf-from)] opacity-25 blur-3xl" />
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-28 left-1/3 size-72 rounded-full bg-[var(--bf-to)] opacity-15 blur-3xl" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,var(--bf-from),var(--bf-to))]" />
        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(90deg,var(--bf-from),var(--bf-to))] px-3 py-1 text-[12px] font-semibold text-[#1d0b00]">
              <Icon name="tag" size={13} />
              {campaign.name} {campaign.year} · Cyber Monday {formatDate(campaign.cyberMonday)}
            </p>
            <h2 id={headingId} className={cn("display mt-4 text-heading", compact ? "text-[2rem] sm:text-[2.5rem]" : "text-[2.25rem] sm:text-[3rem]")}>
              {campaign.name} <em>software deals.</em>
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
              {offers.length > 0
                ? `${offers.length} ${campaign.name} deal${offers.length === 1 ? "" : "s"} announced by the providers so far, each with its dates and terms. More arrive as companies publish theirs.`
                : `Providers announce most ${campaign.name} deals during November. Each one is listed here as soon as its terms are published on the provider's own site.`}
            </p>
            {logos.length > 0 && (
              <ul className="mt-4 flex -space-x-2" aria-label="Some of the brands with deals">
                {logos.map((p) => (
                  <li key={p.id} className="rounded-[10px] ring-2 ring-[#09090b]">
                    <ProductLogo product={p} size="md" />
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex flex-col gap-4 lg:items-end">
            <Countdown startsAt={campaign.startsAt} endsAt={campaign.endsAt} renderedAt={new Date().getTime()} label={countdownLabels(campaign)} />
            <Link href="/black-friday" className={buttonClass("primary", "md", "w-full sm:w-auto")} data-black-friday-link>
              {offers.length > 0 ? `See all ${offers.length} deals` : `${campaign.name} deals`}
              <Icon name="arrow-right" size={15} />
            </Link>
          </div>
        </div>
      </div>
      {shown.length > 0 && <OfferGrid offers={shown} />}
    </section>
  );
}
