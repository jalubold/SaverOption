import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryChips } from "@/components/categories/category-links";
import { OfferGrid } from "@/components/offers/offer-card";
import { FaqSection } from "@/components/seo/faq-section";
import { JsonLd } from "@/components/seo/json-ld";
import { Icon } from "@/components/ui/icon";
import { buttonClass, Container } from "@/components/ui/primitives";
import { getCategories, getCategory, getSponsoredOffers, queryOffers } from "@/lib/catalog";
import { categoryFaq } from "@/lib/faq";
import { breadcrumbJsonLd, clampDescription, collectionJsonLd, faqJsonLd, freshnessLabel, pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/categories/[slug]">): Promise<Metadata> {
  const category = await getCategory((await props.params).slug);
  if (!category) return {};
  const { offers } = await queryOffers({ category: category.slug });
  const fresh = freshnessLabel(offers.map((o) => o.updatedAt));
  const count = offers.length ? `${offers.length} offer${offers.length === 1 ? "" : "s"}` : null;
  return pageMetadata({
    // e.g. "Free cloud, API and AI credits: 36 offers (October 2026)"
    title: `${category.seoTitle ?? category.name}${count ? `: ${count}` : ""}${fresh ? ` (${fresh})` : ""}`,
    description: clampDescription(`${category.description} ${category.intro}`),
    path: `/categories/${category.slug}`,
    ownImage: true,
  });
}

export default async function CategoryPage(props: PageProps<"/categories/[slug]">) {
  const category = await getCategory((await props.params).slug);
  if (!category) notFound();

  const [{ offers: allOffers }, sponsoredSlot, all] = await Promise.all([
    queryOffers({ category: category.slug }),
    getSponsoredOffers(category.slug, 1),
    getCategories(),
  ]);
  // The sponsored card leads the grid once, labelled, and is removed from the organic list.
  const offers = allOffers.filter((o) => !sponsoredSlot.some((s) => s.id === o.id));
  const total = allOffers.length;
  const others = all.filter((c) => c.slug !== category.slug && c.count > 0);
  const faq = categoryFaq(category, allOffers);

  return (
    <div className="theme-dark">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Categories", path: "/categories" },
          { name: category.name, path: `/categories/${category.slug}` },
        ])}
      />
      <JsonLd data={collectionJsonLd({ name: category.name, description: category.intro, path: `/categories/${category.slug}`, offers: allOffers })} />
      <JsonLd data={faqJsonLd(faq)} />
      <section className="hero-glow border-b border-line">
        <Container className="py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-xs text-faint">
            <Link href="/" className="-m-1 -my-2 inline-block px-1 py-2 hover:text-fg">
              Home
            </Link>{" "}
            /{" "}
            <Link href="/categories" className="-m-1 -my-2 inline-block px-1 py-2 hover:text-fg">
              Categories
            </Link>{" "}
            / <span className="text-muted">{category.name}</span>
          </nav>
          <div className="mt-4 flex items-start gap-4">
            <span
              style={{ "--tile-from": category.color.from, "--tile-to": category.color.to } as CSSProperties}
              className="icon-tile hidden size-14 shrink-0 rounded-2xl sm:inline-flex"
            >
              <Icon name={category.icon} size={26} />
            </span>
            <div>
              <h1 className="text-[2.25rem] font-semibold leading-tight tracking-[-0.03em] text-heading sm:text-5xl">{category.name}</h1>
              <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-muted">{category.intro}</p>
            </div>
          </div>
          <div className="mt-7 flex flex-wrap gap-2">
            <Link href={`/deals?category=${category.slug}`} className={buttonClass("secondary", "sm")}>
              <Icon name="search" size={14} /> Search &amp; filter this category
            </Link>
            <Link href={`/deals?category=${category.slug}&sort=ending-soon`} className={buttonClass("ghost", "sm")}>
              Ending soon
            </Link>
          </div>
        </Container>
      </section>

      <Container className="pb-24 pt-10">
        <p className="tabular mb-5 text-sm text-muted">
          <span className="font-medium text-fg">{total}</span> active {total === 1 ? "offer" : "offers"}
        </p>

        {total > 0 ? (
          <OfferGrid offers={[...sponsoredSlot, ...offers]} headingLevel="h2" />
        ) : (
          <div className="rounded-[var(--radius-card)] border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
            <h2 className="text-lg font-semibold">No active offers in this category yet</h2>
            <p className="mt-1.5 text-sm text-muted">New offers are added regularly. Browse another category in the meantime.</p>
          </div>
        )}

        <FaqSection id="category-faq" title={`${category.name}: common questions`} items={faq} />

        {others.length > 0 && (
          <section aria-labelledby="other-cats" className="mt-16">
            <h2 id="other-cats" className="mb-4 text-sm font-semibold text-fg">
              Other categories
            </h2>
            <CategoryChips categories={others} />
          </section>
        )}
      </Container>
    </div>
  );
}
