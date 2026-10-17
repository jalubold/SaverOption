import Link from "next/link";
import { siteConfig } from "@/config/site";
import { CategoryChips, CategoryGrid } from "@/components/categories/category-links";
import { NewsletterSection } from "@/components/newsletter/newsletter-section";
import { OfferGrid } from "@/components/offers/offer-card";
import { OfferRow } from "@/components/offers/offer-row";
import { SearchBox } from "@/components/search/search-box";
import { Icon } from "@/components/ui/icon";
import { buttonClass, Container, SectionHeading } from "@/components/ui/primitives";
import {
  getCatalogStats,
  getCategories,
  getFeaturedOffers,
  getPopularOffers,
  getRecentOffers,
  queryOffers,
} from "@/lib/catalog";

// Re-render hourly so expiry labels and "ending soon" stay accurate.
export const revalidate = 3600;

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
    body: "Eligibility, restrictions and end dates sit next to the offer — we only show them when the provider states them.",
  },
  {
    icon: "shield" as const,
    title: "Paid placements are labelled",
    body: "Editor's picks are never paid for. Sponsored listings and affiliate links are always marked as such.",
  },
];

export default async function HomePage() {
  const [stats, categories, featured, recent, popular, endingSoon] = await Promise.all([
    getCatalogStats(),
    getCategories(),
    getFeaturedOffers(6),
    getRecentOffers(6),
    getPopularOffers(6),
    queryOffers({ sort: "ending-soon" }),
  ]);
  const ending = endingSoon.offers.filter((o) => o.daysLeft !== undefined).slice(0, 4);
  const chips = categories.filter((c) => quickCategories.includes(c.slug));

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="border-b border-line bg-surface">
        <Container className="grid gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center lg:gap-16">
          <div>
            <p className="tabular text-sm font-medium text-accent-ink">
              {stats.offers} {siteConfig.demoMode ? "sample" : "active"} offers across {stats.products} products
            </p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-fg sm:text-5xl">
              Spend less on the software you already need.
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">
              Discounts, free credits, startup perks and student offers on SaaS, AI and developer tools — each one
              linked to the original provider, with terms and end dates up front.
            </p>
            <SearchBox className="mt-8 max-w-2xl" />
            <div className="mt-6">
              <p className="mb-2.5 text-xs font-medium uppercase tracking-wider text-faint">Popular categories</p>
              <CategoryChips categories={chips} />
            </div>
          </div>

          <aside aria-labelledby="ending-heading" className="rounded-[var(--radius-card)] border border-line bg-bg p-3">
            <div className="flex items-center justify-between px-2 pb-1 pt-1">
              <h2 id="ending-heading" className="text-sm font-semibold text-fg">
                Ending soon
              </h2>
              <Link href="/deals?sort=ending-soon" className="text-xs font-medium text-accent-ink hover:underline">
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
              <p className="px-2 py-6 text-sm text-muted">No offers with a published end date right now.</p>
            )}
            <Link href="/deals" className={buttonClass("primary", "md", "mt-2 w-full")}>
              Explore all deals
              <Icon name="arrow-right" size={15} />
            </Link>
          </aside>
        </Container>
      </section>

      <Container className="space-y-20 pt-16 sm:space-y-24">
        {/* ── Featured ──────────────────────────────────────────────── */}
        {featured.length > 0 && (
          <section aria-labelledby="featured-heading">
            <SectionHeading
              id="featured-heading"
              title="Editor's picks"
              description="Chosen by our editors for value and clarity of terms. Never paid for."
              href="/deals"
              linkLabel="All deals"
            />
            <OfferGrid offers={featured} />
          </section>
        )}

        {/* ── Categories ────────────────────────────────────────────── */}
        <section aria-labelledby="categories-heading">
          <SectionHeading
            id="categories-heading"
            title="Browse by category"
            description="From AI credits to lifetime licenses and self-hosted alternatives."
            href="/categories"
            linkLabel="All categories"
          />
          <CategoryGrid categories={categories} />
        </section>

        {/* ── Recently added ───────────────────────────────────────── */}
        <section aria-labelledby="recent-heading">
          <SectionHeading
            id="recent-heading"
            title="Recently added"
            description="The newest offers in the catalog."
            href="/deals?sort=newest"
            linkLabel="View newest"
          />
          <OfferGrid offers={recent} />
        </section>

        {/* ── Popular — only rendered with real engagement data ─────── */}
        {popular.length > 0 && (
          <section aria-labelledby="popular-heading">
            <SectionHeading
              id="popular-heading"
              title="Popular this month"
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
          <ul className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:grid-cols-3">
            {principles.map((p) => (
              <li key={p.title} className="bg-surface p-6">
                <Icon name={p.icon} size={20} className="text-accent" />
                <h3 className="mt-3 text-[15px] font-semibold text-fg">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted">
            <Link href="/disclosure" className="font-medium text-accent-ink hover:underline underline-offset-4">
              Read how we make money and verify offers
            </Link>
          </p>
        </section>

        <NewsletterSection />
      </Container>
    </>
  );
}
