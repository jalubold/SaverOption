import Link from "next/link";
import { SoftwareLogo } from "@/components/business/software-logo";
import { Pill } from "@/components/business/ui";
import { Icon } from "@/components/ui/icon";
import { buttonClass, cn } from "@/components/ui/primitives";
import type { DealSummary } from "@/lib/server/business/deals";

/**
 * One Saver Option listing, showing only what the listing itself states. The offer's headline
 * ("40% off the first year", "$300 credit") leads; the summary is kept to a few lines so cards
 * line up in a grid.
 */
export function DealCard({ d, reason, className }: { d: DealSummary; reason?: string; className?: string }) {
  return (
    <li className={cn("biz-card group flex min-w-0 flex-col p-4 transition-[border-color,box-shadow] hover:border-line-strong hover:shadow-md", className)} data-deal-card>
      <div className="flex items-start gap-3">
        <SoftwareLogo name={d.product.name} src={d.product.logo} size={40} className="transition-transform group-hover:scale-105" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12.5px] text-faint">
            {d.product.name}
            {d.providerName && d.providerName !== d.product.name ? ` · ${d.providerName}` : ""}
          </p>
          <h3 className="mt-0.5 line-clamp-2 text-[14.5px] font-semibold leading-snug text-fg">
            <Link href={`/business/software-deals/${d.slug}`} className="underline-offset-2 hover:underline">
              {d.title}
            </Link>
          </h3>
        </div>
      </div>
      {d.headline && <p className="mt-3 line-clamp-2 text-[17px] font-semibold leading-tight tracking-tight text-accent-ink">{d.headline}</p>}
      <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-muted">{d.summary}</p>
      {d.price && (d.price.current || d.price.regular || d.price.renewal) && (
        <p className="tabular mt-2 text-[12.5px] text-fg">
          {d.price.current && <span className="font-semibold">{d.price.current}</span>}
          {d.price.regular && <span className="ml-1.5 text-faint line-through">{d.price.regular}</span>}
          {d.price.note && <span className="ml-1.5 text-faint">{d.price.note}</span>}
          {d.price.renewal && <span className="ml-1.5 text-faint">· {d.price.renewal}</span>}
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Pill tone="outline">{d.offerTypeLabel}</Pill>
        <Pill tone={d.verification.status === "verified" ? "success" : "neutral"}>{d.verification.label}</Pill>
        {d.expiryLabel && (
          <Pill tone="warn">
            <Icon name="clock" size={11} /> {d.expiryLabel}
          </Pill>
        )}
        {d.sponsored && <Pill tone="outline">Sponsored</Pill>}
      </div>
      {reason && (
        <p className="mt-2.5 flex gap-1.5 text-[12px] text-faint">
          <Icon name="link" size={12} className="mt-0.5 shrink-0" />
          <span>{reason}</span>
        </p>
      )}
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
        <a href={`/go/${d.slug}`} rel={d.sponsored ? "sponsored nofollow noopener" : "nofollow noopener"} className={buttonClass("primary", "sm")}>
          View deal <Icon name="arrow-up-right" size={13} />
        </a>
        <Link href={`/business/software-deals/${d.slug}`} className={buttonClass("ghost", "sm")}>
          Terms & eligibility
        </Link>
      </div>
    </li>
  );
}

/** The disclosure that goes with any list of deals. */
export function DealsDisclosure() {
  return (
    <p className="text-[12px] leading-relaxed text-faint">
      &ldquo;View deal&rdquo; goes through Saver Option&apos;s redirect, which counts the click per offer and day — nothing about you is stored. Some listings use an
      affiliate or sponsored link; those are labelled.{" "}
      <Link href="/disclosure" className="underline underline-offset-2 hover:text-fg">
        Disclosure
      </Link>{" "}
      ·{" "}
      <Link href="/privacy" className="underline underline-offset-2 hover:text-fg">
        Privacy
      </Link>
    </p>
  );
}
