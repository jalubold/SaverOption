import Link from "next/link";
import { SoftwareLogo } from "@/components/business/software-logo";
import { Pill } from "@/components/business/ui";
import { Icon } from "@/components/ui/icon";
import { buttonClass, cn } from "@/components/ui/primitives";
import type { DealSummary } from "@/lib/server/business/deals";

/** One Saver Option listing, showing only what the listing itself states. */
export function DealCard({ d, reason, className }: { d: DealSummary; reason?: string; className?: string }) {
  return (
    <li className={cn("biz-card flex min-w-0 flex-col px-4 py-4", className)}>
      <div className="flex items-start gap-3">
        <SoftwareLogo name={d.product.name} src={d.product.logo} size={36} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12.5px] text-faint">
            {d.product.name} · {d.providerName}
          </p>
          <h3 className="mt-0.5 text-[14.5px] font-semibold leading-snug text-fg">
            <Link href={`/business/software-deals/${d.slug}`} className="hover:underline underline-offset-2">
              {d.title}
            </Link>
          </h3>
        </div>
      </div>
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <Pill tone="outline">{d.offerTypeLabel}</Pill>
        {d.headline && <span className="max-w-full rounded-md bg-accent-soft px-1.5 py-0.5 text-[11.5px] font-medium leading-4 text-accent-ink">{d.headline}</span>}
        <Pill tone={d.verification.status === "verified" ? "success" : "neutral"}>{d.verification.label}</Pill>
        {d.expiryLabel && (
          <Pill tone="warn">
            <Icon name="clock" size={11} /> {d.expiryLabel}
          </Pill>
        )}
        {d.sponsored && <Pill tone="outline">Sponsored</Pill>}
      </div>
      <p className="mt-2.5 text-[13px] leading-relaxed text-muted">{d.summary}</p>
      {d.price && (d.price.current || d.price.regular || d.price.renewal) && (
        <p className="tabular mt-2 text-[12.5px] text-fg">
          {d.price.current && <span className="font-semibold">{d.price.current}</span>}
          {d.price.regular && <span className="ml-1.5 text-faint line-through">{d.price.regular}</span>}
          {d.price.note && <span className="ml-1.5 text-faint">{d.price.note}</span>}
          {d.price.renewal && <span className="ml-1.5 text-faint">· {d.price.renewal}</span>}
        </p>
      )}
      {reason && (
        <p className="mt-2 flex gap-1.5 text-[12px] text-faint">
          <Icon name="link" size={12} className="mt-0.5 shrink-0" />
          <span>{reason}</span>
        </p>
      )}
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-3.5">
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
