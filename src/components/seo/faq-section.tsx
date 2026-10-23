import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { FaqItem } from "@/lib/faq";

/** Questions and answers, open by default for the first one. Pair with faqJsonLd(items) on the page. */
export function FaqSection({ id, title, items }: { id: string; title: string; items: FaqItem[] }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby={id} className="mt-16">
      <h2 id={id} className="text-[1.35rem] font-semibold tracking-[-0.02em] text-heading">
        {title}
      </h2>
      <div className="mt-4 divide-y divide-line rounded-[var(--radius-card)] border border-line bg-surface">
        {items.map((item, i) => (
          <details key={item.q} open={i === 0} className="group px-5 py-4 sm:px-6">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[15px] font-medium text-fg [&::-webkit-details-marker]:hidden">
              <h3 className="font-medium">{item.q}</h3>
              <Icon name="arrow-right" size={14} className="mt-1 shrink-0 text-faint transition-transform group-open:rotate-90" />
            </summary>
            <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-muted">{item.a}</p>
            {item.links && item.links.length > 0 && (
              <ul className="mt-2 space-y-1 text-[13px]">
                {item.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-accent-ink underline-offset-2 hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </details>
        ))}
      </div>
    </section>
  );
}
