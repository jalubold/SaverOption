import { CategoryGrid } from "@/components/categories/category-links";
import { Container } from "@/components/ui/primitives";
import { getCategories } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Browse software deals by category",
  description:
    "Explore software deals by category: AI tools, SaaS discounts, lifetime deals, free credits, free trials, student discounts, startup perks and open-source alternatives.",
  path: "/categories",
});

export default async function CategoriesPage() {
  const categories = await getCategories();
  return (
    <Container className="pb-24 pt-16 sm:pt-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="display text-[3rem] sm:text-[4rem]">
          All <em>categories.</em>
        </h1>
        <p className="mt-3 text-[16px] leading-relaxed text-muted">
          Every offer is filed under one or more categories, so a startup credit for an AI API shows up under both.
        </p>
      </div>
      <div className="mt-12">
        <CategoryGrid categories={categories} />
      </div>
    </Container>
  );
}
