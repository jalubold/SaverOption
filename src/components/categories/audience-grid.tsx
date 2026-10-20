import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/ui/icon";
import type { Audience } from "@/lib/types";

type AudienceWithCount = Audience & { count: number };

/** "Saver Option for …" collection cards. */
export function AudienceGrid({ audiences }: { audiences: AudienceWithCount[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
      {audiences.map((a) => (
        <li key={a.slug}>
          <Link
            href={`/for/${a.slug}`}
            className="group flex h-full min-w-0 flex-col rounded-[var(--radius-card)] border border-line bg-surface p-4 shadow-[var(--shadow-card)] transition-[border-color,box-shadow] hover:border-line-strong hover:shadow-[var(--shadow-card-hover)] sm:p-5"
          >
            <span className="inline-flex size-10 items-center justify-center rounded-[10px] bg-accent-soft text-accent-ink">
              <Icon name={a.icon} size={19} />
            </span>
            <span className="mt-3 text-[15px] leading-snug sm:mt-4">
              <span className="text-muted">{siteConfig.name} for</span>{" "}
              <span className="font-semibold text-fg group-hover:text-accent-ink">{a.name}</span>
            </span>
            <span className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted">{a.description}</span>
            <span className="tabular mt-auto pt-4 text-[11px] font-medium uppercase tracking-wider text-faint">
              {a.count === 0 ? "Offers coming soon" : `${a.count} active ${a.count === 1 ? "offer" : "offers"}`}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
