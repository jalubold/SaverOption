import Link from "next/link";
import { AudienceGrid } from "@/components/categories/audience-grid";
import { CategoryGrid } from "@/components/categories/category-links";
import { Container, Eyebrow, SectionHeading } from "@/components/ui/primitives";
import { getAudiences, getCatalogStats, getCategories } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Browse software deals by category",
  description:
    "Explore software deals by category: AI tools, SaaS discounts, lifetime deals, free credits, free trials, student discounts, startup perks and open-source alternatives.",
  path: "/categories",
});

export default async function CategoriesPage() {
  const [categories, audiences, stats] = await Promise.all([getCategories(), getAudiences(), getCatalogStats()]);
  const live = categories.filter((c) => c.count > 0).length;

  return (
    <>
      <section className="theme-dark hero-glow border-b border-line bg-bg">
        <Container className="py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-xs text-faint">
            <Link href="/" className="-m-1 -my-2 inline-block px-1 py-2 hover:text-fg">
              Home
            </Link>{" "}
            / <span className="text-muted">Categories</span>
          </nav>
          <Eyebrow className="mt-5">
            <strong className="tabular">{live}</strong> categories
            <span aria-hidden="true">•</span>
            <strong className="tabular">{stats.offers}</strong> active offers
          </Eyebrow>
          <h1 className="display mt-4 text-[2.75rem] sm:text-[4rem]">
            All <em>categories.</em>
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-muted">
            Every offer is filed under one or more categories, so a startup credit for an AI API shows up under both.
          </p>
        </Container>
      </section>

      <Container className="space-y-20 pb-24 pt-10 sm:space-y-24 sm:pt-14">
        <section aria-label="Categories">
          <CategoryGrid categories={categories} />
        </section>

        <section aria-labelledby="explore-heading">
          <SectionHeading
            id="explore-heading"
            title={
              <>
                Explore <em>Deals</em>
              </>
            }
            description="Discover software discounts, exclusive offers, and better prices on the tools you use."
          />
          <AudienceGrid audiences={audiences} />
        </section>
      </Container>
    </>
  );
}
