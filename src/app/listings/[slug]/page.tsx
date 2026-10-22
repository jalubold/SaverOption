import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { ListingLogo, SponsoredLabel } from "@/components/listings/sponsored-card";
import { ListingViewBeacon } from "@/components/listings/view-beacon";
import { Icon } from "@/components/ui/icon";
import { buttonClass, Container } from "@/components/ui/primitives";
import { dbConfigured } from "@/lib/server/db";
import { getPublishedBySlug } from "@/lib/server/submissions";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

async function load(slug: string) {
  if (!dbConfigured()) return null;
  return getPublishedBySlug(slug).catch(() => null);
}

export async function generateMetadata(props: PageProps<"/listings/[slug]">): Promise<Metadata> {
  const listing = await load((await props.params).slug);
  if (!listing) return { title: "Listing not found" };
  return pageMetadata({
    title: `${listing.product_name} (Sponsored)`,
    description: listing.description?.slice(0, 160) || `${listing.product_name}, a sponsored listing on ${siteConfig.name}.`,
    path: `/listings/${listing.slug}`,
  });
}

const LINK_LABELS: Record<string, string> = { pricing: "Pricing", docs: "Docs", x: "X", linkedin: "LinkedIn" };

export default async function ListingPage(props: PageProps<"/listings/[slug]">) {
  const listing = await load((await props.params).slug);
  if (!listing) notFound();
  const host = new URL(listing.website).hostname.replace(/^www\./, "");
  const links = Object.entries(listing.links ?? {}).filter(([k, v]) => v && LINK_LABELS[k]) as [string, string][];

  return (
    <>
      <ListingViewBeacon id={listing.id} />
      <section className="theme-dark hero-glow border-b border-line bg-bg">
        <Container className="max-w-3xl py-12 sm:py-16">
          <Link href="/listings" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">
            <Icon name="arrow-left" size={14} /> Sponsored listings
          </Link>
          <div className="mt-6 flex items-start gap-4">
            <ListingLogo listing={listing} size={64} />
            <div className="min-w-0">
              <SponsoredLabel />
              <h1 className="display mt-2 break-words text-[2.4rem] sm:text-[3.2rem]">{listing.product_name}</h1>
              <p className="mt-1 text-sm text-muted">{host}</p>
            </div>
          </div>
          <a
            href={`/listings/${listing.slug}/visit`}
            target="_blank"
            rel="sponsored noopener"
            className={buttonClass("primary", "lg", "mt-8 w-full sm:w-auto")}
          >
            Visit {host} <Icon name="arrow-up-right" size={15} />
          </a>
        </Container>
      </section>
      <Container className="max-w-3xl pb-24 pt-10">
        {listing.description && <p className="whitespace-pre-line text-[16px] leading-relaxed text-fg">{listing.description}</p>}
        {links.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-2">
            {links.map(([k, v]) => (
              <li key={k}>
                <a href={v} target="_blank" rel="sponsored nofollow noopener" className={buttonClass("secondary", "sm")}>
                  <Icon name="link" size={13} /> {LINK_LABELS[k]}
                </a>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-10 rounded-xl border border-line bg-subtle p-4 text-[13px] leading-relaxed text-muted">
          <strong className="text-fg">Sponsored listing.</strong> The maker pays to list this product on {siteConfig.name}. We review listings
          before they go live, but this isn&apos;t an editorial recommendation. Check the provider&apos;s site for current pricing and terms.
        </p>
      </Container>
    </>
  );
}
