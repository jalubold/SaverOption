import Link from "next/link";
import { siteConfig } from "@/config/site";
import { AudienceGrid } from "@/components/categories/audience-grid";
import { CategoryChips } from "@/components/categories/category-links";
import { NewsletterSection } from "@/components/newsletter/newsletter-section";
import { OfferGrid } from "@/components/offers/offer-card";
import { OfferRow } from "@/components/offers/offer-row";
import { SponsoredStrip } from "@/components/listings/sponsored-strip";
import { VisitorsToday } from "@/components/analytics/visitors-today";
import { Icon } from "@/components/ui/icon";
import { buttonClass, Container, Eyebrow, SectionHeading } from "@/components/ui/primitives";
import { formatDate } from "@/lib/format";
import {
  getAudiences,
  getCatalogStats,
  getCategories,
  getFeaturedOffers,
  getPopularOffers,
  getRecentOffers,
  queryOffers,
} from "@/lib/catalog";

// Re-render hourly so expiry labels and "ending soon" stay accurate.
export const revalidate = 3600;

// Rows in the hero side panel: offers with a published end date first, then the largest credit programs.
const HERO_ROWS = 5;

const quickCategories = ["ai-tools", "free-credits", "startup-perks", "student-discounts", "lifetime-deals", "open-source"];

const principles = [
  {
    icon: "external" as const,
    title: "Linked to the source",
    body: "Every listing points to the provider's own offer page, so you can confirm the terms before you sign up.",
  },
  {
    icon: "calendar" as const,
    title: "Dates and terms up front",
    body: "Eligibility, restrictions and end dates sit next to the offer. We only show them when the provider states them.",
  },
  {
    icon: "shield" as const,
    title: "Paid placements are labelled",
    body: "Editor's picks are never paid for. Sponsored listings and affiliate links are always marked as such.",
  },
];

export default async function HomePage() {
  const [stats, categories, audiences, featured, recent, popular, endingSoon] = await Promise.all([
    getCatalogStats(),
    getCategories(),
    getAudiences(),
    getFeaturedOffers(6),
    getRecentOffers(6),
    getPopularOffers(6),
    queryOffers({ sort: "ending-soon" }),
  ]);
  // The hero panel only lists offers open to everyone; country-restricted offers stay in the catalog.
  const openToAll = endingSoon.offers.filter((o) => o.regions?.scope !== "limited");
  const ending = openToAll.filter((o) => o.daysLeft !== undefined).slice(0, HERO_ROWS - 1);
  const endingIds = new Set(ending.map((o) => o.id));
  const largestCredits = openToAll
    .filter((o) => !endingIds.has(o.id) && (o.pricing?.creditValue ?? 0) > 0)
    .sort((a, b) => (b.pricing?.creditValue ?? 0) - (a.pricing?.creditValue ?? 0))
    .slice(0, HERO_ROWS - ending.length);
  // Only categories with live offers appear in the hero chips; the full list lives on /categories.
  const liveCategories = categories.filter((c) => c.count > 0);
  const chips = liveCategories.filter((c) => quickCategories.includes(c.slug));

  return (
    <>
      <div className="theme-dark">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="hero-glow border-b border-line">
          <Container className="grid grid-cols-1 gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center lg:gap-16">
            <div className="min-w-0">
              <Eyebrow>
                <strong className="tabular">{stats.offers}</strong> active offers
                <span aria-hidden="true">•</span>
                <strong className="tabular">{stats.products}</strong> products
                {stats.lastChecked && (
                  <>
                    <span aria-hidden="true">•</span>
                    Checked <strong>{formatDate(stats.lastChecked)}</strong>
                  </>
                )}
                <VisitorsToday />
              </Eyebrow>
              <h1 className="mt-5 max-w-2xl text-[2.5rem] font-semibold leading-[1.06] tracking-[-0.035em] text-muted sm:text-[3.25rem]">
                Find <span className="text-heading">software deals</span> and{" "}
                <span className="text-heading">free credits</span> before you pay full price.
              </h1>
              <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">
                Discounts, free credits, startup perks and student offers on SaaS, AI and developer tools. Each one links
                to the original provider, with terms and end dates up front.
              </p>
              <div className="mt-8">
                <p className="mb-2.5 text-xs font-medium uppercase tracking-wider text-faint">Popular categories</p>
                <CategoryChips categories={chips} />
              </div>
            </div>

            <aside aria-labelledby="ending-heading" className="rounded-[18px] border border-line bg-surface p-3">
              <div className="flex items-center justify-between px-2 pb-1 pt-1">
                <h2 id="ending-heading" className="flex items-center gap-2 text-sm font-semibold text-fg">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-[#f2545b]" />
                  Ending soon
                </h2>
                <Link href="/deals?sort=ending-soon" className="-my-2 py-2 text-xs font-medium text-accent-ink hover:underline">
                  See all
                </Link>
              </div>
              {ending.length > 0 ? (
                <ul>
                  {ending.map((o) => (
                    <li key={o.id}>
                      <OfferRow offer={o} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-2 py-4 text-sm text-muted">No offers with a published end date right now.</p>
              )}
              {largestCredits.length > 0 && (
                <>
                  <div className="mt-2 flex items-center justify-between border-t border-line px-2 pb-1 pt-3">
                    <h2 className="flex items-center gap-2 text-sm font-semibold text-fg">
                      <Icon name="coins" size={14} className="text-accent-ink" />
                      Largest credit programs
                    </h2>
                    <Link href="/categories/free-credits" className="-my-2 py-2 text-xs font-medium text-accent-ink hover:underline">
                      See all
                    </Link>
                  </div>
                  <ul>
                    {largestCredits.map((o) => (
                      <li key={o.id}>
                        <OfferRow offer={o} />
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <Link href="/deals" className={buttonClass("primary", "md", "mt-2 w-full")}>
                Explore all deals
                <Icon name="arrow-right" size={15} />
              </Link>
            </aside>
          </Container>
        </section>

        {/* ── Featured ─────────────────────────────────────────────── */}
        {featured.length > 0 && (
          <Container className="py-16 sm:py-20">
            <section aria-labelledby="featured-heading">
              <SectionHeading
                id="featured-heading"
                title={
                  <>
                    Editor&apos;s <em>picks.</em>
                  </>
                }
                description="Chosen by our editors for value and clarity of terms. Never paid for."
                href="/deals"
                linkLabel="All deals"
              />
              <OfferGrid offers={featured} />
            </section>
          </Container>
        )}
      </div>

      <Container className="space-y-20 pb-24 pt-16 sm:space-y-24 sm:pt-20">
        {/* ── Explore deals (audience collections) ─────────────────── */}
        <section aria-labelledby="explore-heading">
          <SectionHeading
            id="explore-heading"
            title={
              <>
                Explore <em>Deals</em>
              </>
            }
            description="Discover software discounts, exclusive offers, and better prices on the tools you use."
            href="/categories"
            linkLabel="All categories"
          />
          <AudienceGrid audiences={audiences} />
        </section>

        {/* ── Sponsored (only when live paid listings exist) ───────── */}
        <SponsoredStrip />

        {/* ── Recently added ───────────────────────────────────────── */}
        <section aria-labelledby="recent-heading">
          <SectionHeading
            id="recent-heading"
            title={
              <>
                Recently <em>added.</em>
              </>
            }
            description="The newest offers in the catalog."
            href="/deals?sort=newest"
            linkLabel="View newest"
          />
          <OfferGrid offers={recent} />
        </section>

        {/* ── Popular — only rendered with real engagement data ────── */}
        {popular.length > 0 && (
          <section aria-labelledby="popular-heading">
            <SectionHeading
              id="popular-heading"
              title={
                <>
                  Popular <em>this month.</em>
                </>
              }
              description="Ranked by visits to the provider from this site in the last 30 days."
            />
            <OfferGrid offers={popular} />
          </section>
        )}

        {/* ── Principles ───────────────────────────────────────────── */}
        <section aria-labelledby="principles-heading">
          <h2 id="principles-heading" className="sr-only">
            How {siteConfig.name} works
          </h2>
          <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line shadow-[var(--shadow-card)] md:grid-cols-3">
            {principles.map((p) => (
              <li key={p.title} className="bg-surface p-6">
                <span className="inline-flex size-10 items-center justify-center rounded-[10px] bg-accent-soft text-accent-ink">
                  <Icon name={p.icon} size={19} />
                </span>
                <h3 className="mt-4 text-[15px] font-semibold text-heading">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {siteConfig.newsletter && <NewsletterSection />}
      </Container>
    </>
  );
}
