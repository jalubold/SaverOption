import { SoftwareLogo } from "@/components/business/software-logo";
import { Icon } from "@/components/ui/icon";
import { Container } from "@/components/ui/primitives";
import { trackable } from "./example-data";

/**
 * "Track every tool you pay for": two slow, CSS-only rows of tool logos — the
 * kinds of software a team can record, not customers, partners or integrations.
 * With reduced motion the rows stop and wrap into a static grid.
 */

const css = `
.bizl-marquee { mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent); -webkit-mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent); }
.bizl-track { display: flex; width: max-content; animation: bizl-scroll var(--bizl-speed, 70s) linear infinite; }
.bizl-track[data-reverse] { animation-direction: reverse; }
.bizl-marquee:hover .bizl-track { animation-play-state: paused; }
@keyframes bizl-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) {
  .bizl-marquee { mask-image: none; -webkit-mask-image: none; }
  .bizl-track { animation: none !important; width: auto; flex-wrap: wrap; justify-content: center; padding-inline: 1rem; }
  .bizl-dup { display: none; }
}
`;

function Chip({ name, src }: { name: string; src: string }) {
  return (
    <span className="mr-3 inline-flex shrink-0 items-center gap-2.5 rounded-full border border-line bg-surface py-1.5 pl-1.5 pr-4 text-[14px] font-medium text-fg shadow-[var(--shadow-card)]">
      <SoftwareLogo name={name} src={src} size={28} />
      {name}
    </span>
  );
}

function Row({ items, reverse }: { items: typeof trackable; reverse?: boolean }) {
  return (
    <div className="bizl-track gap-y-3 py-1.5" data-reverse={reverse ? "" : undefined}>
      {items.map((t) => (
        <Chip key={t.name} {...t} />
      ))}
      <span className="bizl-dup flex">
        {items.map((t) => (
          <Chip key={t.name} {...t} />
        ))}
      </span>
    </div>
  );
}

export function LogoStrip() {
  const half = Math.ceil(trackable.length / 2);
  return (
    <section aria-labelledby="track-heading" className="overflow-hidden border-b border-line bg-surface">
      <style href="bizl-marquee" precedence="default">
        {css}
      </style>
      <Container className="pb-8 pt-14 sm:pt-16">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-accent-ink">Works with any software</p>
            <h2 id="track-heading" className="mt-2 text-[1.45rem] font-semibold leading-snug tracking-tight text-heading sm:text-[1.75rem]">
              Track every tool you pay for — <span className="text-muted">Slack, Notion, Figma, AWS, and anything else.</span>
            </h2>
          </div>
          <p className="inline-flex w-fit items-center gap-2.5 rounded-full border border-dashed border-line-strong bg-bg py-1.5 pl-1.5 pr-4 text-[13.5px] text-muted">
            <SoftwareLogo name="Acme Payroll" size={28} />
            <span>
              <Icon name="plus" size={12} className="mr-1 inline align-[-1px] text-accent-ink" />
              Any software, even ones not listed — it gets a monogram
            </span>
          </p>
        </div>
      </Container>

      <div className="bizl-marquee space-y-1.5" aria-hidden="true">
        <Row items={trackable.slice(0, half)} />
        <Row items={trackable.slice(half)} reverse />
      </div>
      <p className="sr-only">For example: {trackable.map((t) => t.name).join(", ")}.</p>

      <Container className="pb-12 pt-6">
        <p className="text-[12px] leading-relaxed text-faint">
          You record what you pay for — there are no bank, card or vendor connections. Logos are shown only to illustrate tools you can track; they&apos;re trademarks of their owners and don&apos;t imply a partnership.
        </p>
      </Container>
    </section>
  );
}
