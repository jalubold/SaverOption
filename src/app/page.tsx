import Link from "next/link";
import { siteConfig } from "@/config/site";
import { CategoryChips, CategoryGrid } from "@/components/categories/category-links";
import { NewsletterSection } from "@/components/newsletter/newsletter-section";
import { HomeTabs } from "@/components/offers/home-tabs";
import { OfferGrid } from "@/components/offers/offer-card";
import { OfferRow } from "@/components/offers/offer-row";
import { SearchBox } from "@/components/search/search-box";
import { Icon } from "@/components/ui/icon";
import { buttonClass, CheckDot, Container, Eyebrow, SectionHeading } from "@/components/ui/primitives";
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

const steps = [
  {
    title: "Search and filter",
    body: "Search by product or keyword, then narrow by category, offer type and free or paid.",
    points: ["Ten categories, from AI tools to open source", "Sort by newest or ending soon", "No account needed"],
  },
  {
    title: "Check the terms",
    body: "Every listing shows who's eligible, how to redeem, the restrictions and the end date.",
    points: ["Prices only when the provider states them", "Official, partner or third-party, labelled", "Verification status and last update"],
  },
  {
    title: "Redeem with the provider",
    body: "View deal takes you to the provider's own page. You sign up and pay with them directly.",
    points: ["We never take payments", "Affiliate links are disclosed on the listing", "Ended offers are marked as ended"],
  },
];

const trustPoints = [
  "Every offer links to its source",
  "No invented prices or end dates",
  "Sponsored placements are labelled",
  "Editor's picks are never paid for",
];

export default async function HomePage() {
  const [stats, categories, featured, recent, popular, endingSoon, free] = await Promise.all([
    getCatalogStats(),
    getCategories(),
    getFeaturedOffers(6),
    getRecentOffers(6),
    getPopularOffers(6),
    queryOffers({ sort: "ending-soon" }),
    queryOffers({ price: "free", sort: "newest" }),
  ]);
  const ending = endingSoon.offers.filter((o) => o.daysLeft !== undefined).slice(0, 4);
  const chips = categories.filter((c) => quickCategories.includes(c.slug));

  const tabs = [
    {
      id: "picks",
      label: "Editor's picks",
      caption: "Chosen by our editors for value and clear terms. Never paid for.",
      offers: featured,
    },
    { id: "newest", label: "Newest", caption: "The most recently added offers.", offers: recent },
    {
      id: "free",
      label: "Free",
      caption: "Free plans, credits, trials and open-source alternatives.",
      offers: free.offers.slice(0, 6),
    },
  ].filter((t) => t.offers.length > 0);

  return (
    <>
      <div className="theme-dark">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="hero-glow">
          <Container className="grid gap-12 py-16 sm:py-24 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center lg:gap-16">
            <div className="min-w-0">
              <Eyebrow>
                <strong className="tabular">{stats.offers}</strong> {siteConfig.demoMode ? "sample" : "active"} offers
                <span aria-hidden="true">•</span>
                <strong className="tabular">{stats.products}</strong> products
                <span aria-hidden="true">•</span>
                <strong className="tabular">{categories.length}</strong> categories
              </Eyebrow>
              <h1 className="mt-5 max-w-2xl text-[2.5rem] font-semibold leading-[1.06] tracking-[-0.035em] text-muted sm:text-[3.5rem]">
                Find <span className="text-heading">software deals</span> and{" "}
                <span className="text-heading">free credits</span> before you pay full price.
              </h1>
              <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[17px] text-fg/85">
                Search <Icon name="arrow-right" size={15} className="text-faint" /> compare the terms{" "}
                <Icon name="arrow-right" size={15} className="text-faint" /> redeem on the provider&apos;s site.
              </p>
              <SearchBox className="mt-8 max-w-2xl" />
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link href="/deals" className={buttonClass("primary", "lg")}>
                  Browse all deals <Icon name="arrow-right" size={16} />
                </Link>
                <Link href="/categories/free-credits" className={buttonClass("secondary", "lg")}>
                  Explore free credits <Icon name="arrow-right" size={16} />
                </Link>
              </div>
              <div className="mt-10">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-faint">Popular categories</p>
                <CategoryChips categories={chips} />
              </div>
            </div>

            <aside aria-labelledby="ending-heading" className="rounded-[18px] border border-line bg-surface p-3">
              <div className="flex items-center justify-between px-2 pb-2 pt-1">
                <h2 id="ending-heading" className="flex items-center gap-2 text-sm font-semibold text-fg">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-[#f2545b]" />
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
              <Link href="/deals?sort=ending-soon" className={buttonClass("primary", "md", "mt-2 w-full")}>
                View ending soon <Icon name="arrow-right" size={15} />
              </Link>
            </aside>
          </Container>
        </section>

        {/* ── Catalog tabs ─────────────────────────────────────────── */}
        <section aria-label="Deals" className="pb-20 pt-4">
          <Container>
            <HomeTabs
              tabs={tabs.map((t) => ({
                id: t.id,
                label: t.label,
                content: (
                  <>
                    <p className="mb-5 text-sm text-faint">{t.caption}</p>
                    <OfferGrid offers={t.offers} />
                  </>
                ),
              }))}
              aside={
                <Link
                  href="/categories"
                  className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line-strong px-4 text-[13px] font-medium text-fg transition-colors hover:bg-subtle"
                >
                  All categories <Icon name="arrow-right" size={13} />
                </Link>
              }
            />
            <div className="mt-12 flex justify-center">
              <Link href="/deals" className={buttonClass("primary", "md")}>
                See all deals <Icon name="arrow-right" size={15} />
              </Link>
            </div>
          </Container>
        </section>
      </div>

      <div className="space-y-24 py-24 sm:space-y-32">
        {/* ── Categories ───────────────────────────────────────────── */}
        <Container>
          <section aria-labelledby="categories-heading">
            <SectionHeading
              id="categories-heading"
              align="center"
              title={
                <>
                  Browse by <em>category.</em>
                </>
              }
              description="From AI credits and startup programs to lifetime licenses and self-hosted alternatives."
            />
            <CategoryGrid categories={categories} />
          </section>
        </Container>

        {/* ── Popular — only rendered with real engagement data ────── */}
        {popular.length > 0 && (
          <Container>
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
          </Container>
        )}

        {/* ── How it works ─────────────────────────────────────────── */}
        <div className="mx-auto w-full max-w-[1400px] sm:px-6 lg:px-10">
          <section
            aria-labelledby="how-heading"
            className="theme-dark panel-accent px-4 py-16 sm:rounded-[28px] sm:px-10 sm:py-20 lg:px-16"
          >
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-block rounded-lg bg-white px-2.5 py-1 text-sm font-medium text-[#0a0a0a]">
                How it works
              </span>
              <h2 id="how-heading" className="display mt-5 text-[2.5rem] sm:text-[3.5rem]">
                Search it. <em>Check it.</em> Save it.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-fg/90 sm:text-[17px]">
                {siteConfig.name} collects software offers in one place, so you can compare them quickly and redeem them
                with the provider.
              </p>
            </div>
            <ol className="theme-light mx-auto mt-12 grid max-w-5xl gap-4 bg-transparent lg:grid-cols-3">
              {steps.map((step, i) => (
                <li key={step.title} className="rounded-[28px] bg-surface p-7">
                  <span className="tabular inline-flex size-9 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent-ink">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 text-[22px] font-semibold tracking-tight text-heading">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{step.body}</p>
                  <ul className="mt-5 space-y-2.5">
                    {step.points.map((point) => (
                      <li key={point} className="flex gap-2 text-sm text-muted">
                        <Icon name="check" size={16} className="mt-0.5 text-accent" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* ── Trust ────────────────────────────────────────────────── */}
        <Container>
          <section aria-labelledby="honest-heading" className="text-center">
            <SectionHeading
              id="honest-heading"
              align="center"
              title={
                <>
                  Simple, <em>honest</em> listings.
                </>
              }
              description="A deals site is only useful if you can trust it. These rules apply to every listing."
            />
            <ul className="mx-auto -mt-2 flex max-w-3xl flex-wrap justify-center gap-x-6 gap-y-3">
              {trustPoints.map((point) => (
                <li key={point} className="flex items-center gap-2 text-[15px] font-medium text-fg">
                  <CheckDot />
                  {point}
                </li>
              ))}
            </ul>
            <Link
              href="/disclosure"
              className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-accent-ink hover:underline underline-offset-4"
            >
              Read how we make money and verify offers <Icon name="arrow-right" size={14} />
            </Link>
          </section>
        </Container>

        <Container>
          <NewsletterSection />
        </Container>
      </div>
    </>
  );
}
