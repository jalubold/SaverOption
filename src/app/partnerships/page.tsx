import { siteConfig } from "@/config/site";
import { Icon } from "@/components/ui/icon";
import { buttonClass, Container, Eyebrow } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Partnerships",
  description: `Partner with ${siteConfig.name} through affiliate partnerships, exclusive deals, sponsored listings and newsletter campaigns that reach people looking for software.`,
  path: "/partnerships",
});

const partnerHref = `mailto:${siteConfig.partnershipsEmail}?subject=${encodeURIComponent(
  `Partnership Opportunity — ${siteConfig.name}`,
)}`;

const opportunities = [
  {
    icon: "coins" as const,
    title: "Affiliate Partnerships",
    body: "Promote software through relevant listings and earn commissions from qualifying referrals.",
  },
  {
    icon: "star" as const,
    title: "Exclusive Deals",
    body: `Offer special discounts, promo codes, free credits, and exclusive offers to ${siteConfig.name} users.`,
  },
  {
    icon: "sparkles" as const,
    title: "Sponsored Listings",
    body: "Increase product visibility through featured placements in relevant categories.",
  },
  {
    icon: "mail" as const,
    title: "Newsletter & Campaigns",
    body: "Explore promotional opportunities through newsletters and targeted campaigns when available.",
  },
];

const benefits = [
  "Reach users looking for software and deals.",
  "Introduce products to relevant audiences.",
  "Explore affiliate and promotional partnerships.",
  "Build long-term collaboration opportunities.",
];

function PartnerButton({ className }: { className?: string }) {
  return (
    <a href={partnerHref} className={buttonClass("primary", "lg", className)}>
      <Icon name="mail" size={17} />
      Become a Partner
    </a>
  );
}

export default function PartnershipsPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="theme-dark hero-glow border-b border-line bg-bg">
        <Container className="py-16 sm:py-24">
          <div className="max-w-3xl">
            <Eyebrow>Partnerships</Eyebrow>
            <h1 className="display mt-5 text-[2.75rem] sm:text-[4rem]">
              Partner with <em>{siteConfig.name}</em>
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">
              Connect your software with people looking for better tools, smarter deals, and more value.
            </p>
            <PartnerButton className="mt-8 w-full sm:w-auto" />
          </div>
        </Container>
      </section>

      <Container className="space-y-20 pb-24 pt-16 sm:space-y-24 sm:pt-20">
        {/* ── Opportunities ────────────────────────────────────────── */}
        <section aria-labelledby="opportunities-heading">
          <div className="mb-8">
            <h2 id="opportunities-heading" className="display text-[2.25rem] sm:text-[3rem]">
              Partnership <em>opportunities.</em>
            </h2>
            <p className="mt-2 text-[15px] text-muted">Ways we can work together.</p>
          </div>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {opportunities.map((o) => (
              <li
                key={o.title}
                className="flex flex-col rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-[var(--shadow-card)]"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-[10px] bg-accent-soft text-accent-ink">
                  <Icon name={o.icon} size={19} />
                </span>
                <h3 className="mt-4 text-[15px] font-semibold text-heading">{o.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{o.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Why partner ──────────────────────────────────────────── */}
        <section
          aria-labelledby="why-heading"
          className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start lg:gap-16"
        >
          <div>
            <h2 id="why-heading" className="display text-[2.25rem] sm:text-[3rem]">
              Why partner with <em>{siteConfig.name}?</em>
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
              {siteConfig.name} is a discovery site for software deals, free credits and perks. Every listing links to
              the provider, and sponsored placements and affiliate links are always labelled.
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line shadow-[var(--shadow-card)]">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 bg-surface p-5">
                <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-ink">
                  <Icon name="check" size={15} />
                </span>
                <span className="pt-0.5 text-[15px] text-fg">{b}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────── */}
        <section
          aria-labelledby="cta-heading"
          className="theme-dark hero-glow overflow-hidden rounded-2xl border border-line bg-bg px-6 py-12 text-center sm:px-10 sm:py-16"
        >
          <h2 id="cta-heading" className="display text-[2.25rem] sm:text-[3rem]">
            Let&apos;s build something <em>together</em>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-muted">
            Have a software product or an offer worth sharing? We&apos;d love to explore a partnership.
          </p>
          <PartnerButton className="mt-8 w-full sm:w-auto" />
        </section>
      </Container>
    </>
  );
}
