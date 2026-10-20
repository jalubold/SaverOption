import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { OfferGrid } from "@/components/offers/offer-card";
import { JsonLd } from "@/components/seo/json-ld";
import { Icon } from "@/components/ui/icon";
import { Container } from "@/components/ui/primitives";
import { getAudience, getAudiences, queryOffers } from "@/lib/catalog";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getAudiences()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(props: PageProps<"/for/[slug]">): Promise<Metadata> {
  const audience = await getAudience((await props.params).slug);
  if (!audience) return {};
  return pageMetadata({
    title: `${siteConfig.name} for ${audience.name}`,
    description: audience.intro,
    path: `/for/${audience.slug}`,
  });
}

export default async function AudiencePage(props: PageProps<"/for/[slug]">) {
  const audience = await getAudience((await props.params).slug);
  if (!audience) notFound();

  const [{ offers, total }, all] = await Promise.all([queryOffers({ audience: audience.slug }), getAudiences()]);
  const title = `${siteConfig.name} for ${audience.name}`;
  const others = all.filter((a) => a.slug !== audience.slug && a.count > 0);

  return (
    <div className="theme-dark">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: title, path: `/for/${audience.slug}` },
        ])}
      />
      <section className="hero-glow border-b border-line">
        <Container className="py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-xs text-faint">
            <Link href="/" className="-m-1 -my-2 inline-block px-1 py-2 hover:text-fg">
              Home
            </Link>{" "}
            / <span className="text-muted">{title}</span>
          </nav>
          <div className="mt-4 flex items-start gap-4">
            <span className="hidden size-14 shrink-0 items-center justify-center rounded-2xl border border-line bg-accent-soft text-accent-ink sm:inline-flex">
              <Icon name={audience.icon} size={24} />
            </span>
            <div>
              <h1 className="text-[2.25rem] font-semibold leading-tight tracking-[-0.03em] text-heading sm:text-5xl">
                <span className="text-muted">{siteConfig.name} for</span> {audience.name}
              </h1>
              <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-muted">{audience.intro}</p>
            </div>
          </div>
        </Container>
      </section>

      <Container className="pb-24 pt-10">
        <p className="tabular mb-5 text-sm text-muted">
          <span className="font-medium text-fg">{total}</span> active {total === 1 ? "offer" : "offers"}
        </p>

        {total > 0 ? (
          <OfferGrid offers={offers} headingLevel="h2" />
        ) : (
          <div className="rounded-[var(--radius-card)] border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
            <h2 className="text-lg font-semibold">No active offers here yet</h2>
            <p className="mt-1.5 text-sm text-muted">New offers are added regularly. Explore another collection in the meantime.</p>
          </div>
        )}

        {others.length > 0 && (
          <section aria-labelledby="other-collections" className="mt-16">
            <h2 id="other-collections" className="mb-4 text-sm font-semibold text-fg">
              Explore more deals
            </h2>
            <ul className="flex flex-wrap gap-2">
              {others.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/for/${a.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-subtle px-3 py-1.5 text-[13px] font-medium text-muted transition-colors hover:border-line-strong hover:text-fg"
                  >
                    <Icon name={a.icon} size={14} className="text-accent-ink" />
                    {siteConfig.name} for {a.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </Container>
    </div>
  );
}
