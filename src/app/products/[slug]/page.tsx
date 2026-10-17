import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OfferGrid } from "@/components/offers/offer-card";
import { ProductLogo } from "@/components/offers/product-logo";
import { JsonLd } from "@/components/seo/json-ld";
import { Icon } from "@/components/ui/icon";
import { Badge, buttonClass, Container } from "@/components/ui/primitives";
import { getAllProductSlugs, getOffersForProduct, getProductBySlug } from "@/lib/catalog";
import { hostname } from "@/lib/outbound";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getAllProductSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = await getProductBySlug((await props.params).slug);
  if (!product) return {};
  return pageMetadata({
    title: `${product.name} deals, discounts and offers`,
    description: `Current ${product.name} offers — discounts, credits, trials and programs. ${product.tagline}.`,
    path: `/products/${product.slug}`,
  });
}

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const product = await getProductBySlug((await props.params).slug);
  if (!product) notFound();

  const offers = await getOffersForProduct(product.id);
  const active = offers.filter((o) => !o.isExpired);
  const ended = offers.filter((o) => o.isExpired);

  return (
    <div className="theme-dark">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Deals", path: "/deals" },
          { name: product.name, path: `/products/${product.slug}` },
        ])}
      />
      <section className="hero-glow border-b border-line">
        <Container className="py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-xs text-faint">
            <Link href="/" className="hover:text-fg">
              Home
            </Link>{" "}
            /{" "}
            <Link href="/deals" className="hover:text-fg">
              Deals
            </Link>{" "}
            / <span className="text-muted">{product.name}</span>
          </nav>
          <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <ProductLogo product={product} size="lg" />
              <div>
                <h1 className="text-[2.25rem] font-semibold leading-tight tracking-[-0.03em] text-heading sm:text-5xl">{product.name} offers</h1>
                <p className="mt-1 text-[15px] text-muted">
                  {product.tagline} · by {product.provider.name}
                </p>
              </div>
            </div>
            <a href={product.website} target="_blank" rel="nofollow noopener" className={buttonClass("secondary", "md", "self-start")}>
              {hostname(product.website)} <Icon name="external" size={14} />
            </a>
          </div>
          <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-muted">{product.description}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {product.tags.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
            {product.openSource && <Badge tone="accent">Open source · {product.openSource.license}</Badge>}
          </div>
        </Container>
      </section>

      <Container className="pb-24 pt-10">
        <h2 className="mb-5 text-lg font-semibold">
          Active offers <span className="tabular font-normal text-faint">({active.length})</span>
        </h2>
        {active.length > 0 ? (
          <OfferGrid offers={active} />
        ) : (
          <p className="rounded-[var(--radius-card)] border border-dashed border-line-strong bg-surface p-8 text-center text-sm text-muted">
            No active offers for {product.name} right now.
          </p>
        )}

        {ended.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-5 text-lg font-semibold">
              Past offers <span className="tabular font-normal text-faint">({ended.length})</span>
            </h2>
            <OfferGrid offers={ended} />
          </section>
        )}
      </Container>
    </div>
  );
}
