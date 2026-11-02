import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { countdownLabels } from "@/components/campaigns/black-friday-band";
import { Countdown } from "@/components/campaigns/countdown";
import { NewsletterSection } from "@/components/newsletter/newsletter-section";
import { OfferGrid } from "@/components/offers/offer-card";
import { JsonLd } from "@/components/seo/json-ld";
import { Icon } from "@/components/ui/icon";
import { buttonClass, Container } from "@/components/ui/primitives";
import { getCampaign, getCampaignOffers, getCategories } from "@/lib/catalog";
import { formatDate } from "@/lib/format";
import { breadcrumbJsonLd, clampDescription, collectionJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import type { CategorySlug, OfferView } from "@/lib/types";

// Hourly, so deals past their end date drop off and the countdown's starting point stays close.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const c = getCampaign("black-friday");
  if (!c) return {};
  const offers = await getCampaignOffers("black-friday");
  return pageMetadata({
    title: `${c.title}${offers.length ? `: ${offers.length} deals` : ""}`,
    description: clampDescription(c.description),
    path: "/black-friday",
    ownImage: true,
  });
}

/** Sections in this order; an offer sits in the first of these it belongs to. */
const ORDER: CategorySlug[] = ["ai-tools", "lifetime-deals", "saas-discounts", "software-deals", "free-credits", "free-trials", "startup-perks", "student-discounts", "open-source", "exclusive"];

function groupByCategory(offers: OfferView[]) {
  const groups = new Map<CategorySlug, OfferView[]>();
  for (const o of offers) {
    const home = ORDER.find((c) => o.categories.includes(c)) ?? o.categories[0];
    groups.set(home, [...(groups.get(home) ?? []), o]);
  }
  return ORDER.filter((c) => groups.has(c)).map((c) => ({ slug: c, offers: groups.get(c)! }));
}

export default async function BlackFridayPage() {
  const campaign = getCampaign("black-friday");
  if (!campaign) notFound();
  const [offers, categories] = await Promise.all([getCampaignOffers("black-friday"), getCategories()]);
  const names = new Map(categories.map((c) => [c.slug, c.name]));
  const groups = groupByCategory(offers);
  const ending = offers.filter((o) => o.daysLeft !== undefined);
  const verified = offers.filter((o) => o.verification.status === "verified").length;
  const updated = offers.map((o) => o.updatedAt).sort().at(-1);

  return (
    <div className="theme-dark" data-black-friday-page>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: campaign.title, path: "/black-friday" },
        ])}
      />
      <JsonLd data={collectionJsonLd({ name: campaign.title, description: campaign.intro, path: "/black-friday", offers })} />
      <JsonLd data={faqJsonLd(campaign.faq)} />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section
        style={{ "--bf-from": campaign.color.from, "--bf-to": campaign.color.to } as CSSProperties}
        className="relative overflow-hidden border-b border-line bg-[#09090b]"
      >
        <span aria-hidden="true" className="pointer-events-none absolute -right-32 -top-40 size-[34rem] rounded-full bg-[var(--bf-from)] opacity-20 blur-3xl" />
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-48 -left-24 size-[28rem] rounded-full bg-[var(--bf-to)] opacity-10 blur-3xl" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,var(--bf-from),var(--bf-to))]" />
        <Container className="relative grid gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="min-w-0">
            <nav aria-label="Breadcrumb" className="text-xs text-faint">
              <Link href="/" className="-m-1 -my-2 inline-block px-1 py-2 hover:text-fg">
                Home
              </Link>{" "}
              / <span className="text-muted">{campaign.name}</span>
            </nav>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(90deg,var(--bf-from),var(--bf-to))] px-3 py-1 text-[12px] font-semibold text-[#1d0b00]">
              <Icon name="tag" size={13} />
              {formatDate(campaign.startsAt.slice(0, 10))} · Cyber Monday {formatDate(campaign.cyberMonday)}
            </p>
            <h1 className="display mt-4 text-[2.75rem] text-heading sm:text-[4.25rem]">
              {campaign.name} {campaign.year} <em>software deals.</em>
            </h1>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted">{campaign.intro}</p>
            <p className="tabular mt-5 flex flex-wrap gap-x-5 gap-y-1 text-[13.5px] text-muted" data-black-friday-stats>
              <span>
                <strong className="text-fg">{offers.length}</strong> deal{offers.length === 1 ? "" : "s"} announced
              </span>
              {ending.length > 0 && (
                <span>
                  <strong className="text-fg">{ending.length}</strong> with an end date
                </span>
              )}
              {verified > 0 && (
                <span>
                  <strong className="text-fg">{verified}</strong> checked on the live page
                </span>
              )}
              {updated && <span>Updated {formatDate(updated)}</span>}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <Countdown startsAt={campaign.startsAt} endsAt={campaign.endsAt} renderedAt={new Date().getTime()} label={countdownLabels(campaign)} />
          </div>
        </Container>
      </section>

      <Container className="space-y-16 pb-24 pt-10 sm:space-y-20">
        {offers.length === 0 ? (
          <div className="rounded-[var(--radius-card)] border border-dashed border-line-strong bg-surface px-6 py-14 text-center" data-black-friday-empty>
            <h2 className="text-lg font-semibold">No {campaign.name} deals announced yet</h2>
            <p className="mx-auto mt-1.5 max-w-xl text-sm text-muted">
              Software companies publish their {campaign.name} offers during November. Each one appears here once its terms are on the provider&apos;s own site.
            </p>
            <Link href="/deals?sort=ending-soon" className={buttonClass("secondary", "md", "mt-6")}>
              Deals ending soon <Icon name="arrow-right" size={15} />
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {groups.length > 1 && (
              <nav aria-label={`${campaign.name} deals by category`} className="flex flex-wrap gap-2">
                {groups.map((g) => (
                  <a key={g.slug} href={`#${g.slug}`} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-subtle px-3 py-1.5 text-[13px] font-medium text-muted transition-colors hover:border-line-strong hover:text-fg">
                    {names.get(g.slug) ?? g.slug}
                    <span className="tabular text-faint">{g.offers.length}</span>
                  </a>
                ))}
              </nav>
            )}
            {groups.map((g) => (
              <section key={g.slug} id={g.slug} aria-labelledby={`${g.slug}-heading`} className="scroll-mt-24">
                <h2 id={`${g.slug}-heading`} className="mb-5 text-[1.35rem] font-semibold tracking-tight text-heading">
                  {names.get(g.slug) ?? g.slug} <span className="tabular text-[15px] font-normal text-faint">{g.offers.length}</span>
                </h2>
                <OfferGrid offers={g.offers} headingLevel="h3" />
              </section>
            ))}
          </div>
        )}

        {/* ── How deals get here ───────────────────────────────────── */}
        <section aria-labelledby="bf-how" className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:grid-cols-3">
          <h2 id="bf-how" className="sr-only">
            How {campaign.name} deals are listed
          </h2>
          {[
            { icon: "external" as const, title: "From the provider", body: "Only deals a company announces itself, linked to its own page. Nothing carried over from last year." },
            { icon: "calendar" as const, title: "Dates up front", body: "Start and end dates as the provider states them; deals leave the list once they've ended." },
            { icon: "shield" as const, title: "Checked and labelled", body: "Each listing says whether an editor read the live page, and when." },
          ].map((p) => (
            <div key={p.title} className="bg-surface p-6">
              <span className="inline-flex size-10 items-center justify-center rounded-[10px] bg-accent-soft text-accent-ink">
                <Icon name={p.icon} size={19} />
              </span>
              <h3 className="mt-4 text-[15px] font-semibold text-heading">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.body}</p>
            </div>
          ))}
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────── */}
        <section aria-labelledby="bf-faq">
          <h2 id="bf-faq" className="display text-[2rem] text-heading sm:text-[2.5rem]">
            {campaign.name} <em>questions.</em>
          </h2>
          <div className="mt-6 divide-y divide-line rounded-[var(--radius-card)] border border-line bg-surface">
            {campaign.faq.map((f) => (
              <details key={f.q} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium text-fg [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Icon name="chevron-down" size={16} className="shrink-0 text-faint transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {siteConfig.newsletter && <NewsletterSection />}
      </Container>
    </div>
  );
}
