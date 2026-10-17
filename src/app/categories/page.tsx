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
    <Container className="pb-24 pt-12">
      <h1 className="display text-[2.75rem] sm:text-[3.5rem]">
        All <em>categories.</em>
      </h1>
      <p className="mt-2 max-w-2xl text-[15px] text-muted">
        Every offer is filed under one or more categories, so a startup credit for an AI API shows up under both.
      </p>
      <div className="mt-8">
        <CategoryGrid categories={categories} />
      </div>
    </Container>
  );
}
