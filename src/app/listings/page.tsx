import Link from "next/link";
import { siteConfig } from "@/config/site";
import { SponsoredCard } from "@/components/listings/sponsored-card";
import { Icon } from "@/components/ui/icon";
import { buttonClass, Container, Eyebrow } from "@/components/ui/primitives";
import { dbConfigured } from "@/lib/server/db";
import { listPublished, type PublicListing } from "@/lib/server/submissions";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Sponsored listings",
  description: `Software products listed on ${siteConfig.name} by their makers. Every sponsored listing is reviewed before it goes live.`,
  path: "/listings",
});

export const dynamic = "force-dynamic";

export default async function ListingsPage() {
  let listings: PublicListing[] = [];
  if (dbConfigured()) {
    try {
      listings = await listPublished(60);
    } catch (err) {
      console.error("[listings]", err instanceof Error ? err.message : err);
    }
  }

  return (
    <>
      <section className="theme-dark hero-glow border-b border-line bg-bg">
        <Container className="py-14 sm:py-20">
          <Eyebrow>Sponsored</Eyebrow>
          <h1 className="display mt-5 text-[2.6rem] sm:text-[3.6rem]">
            Sponsored <em>listings</em>
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-muted">
            Products listed by their makers. These are paid placements, reviewed by us before they go live and kept separate from our editorial
            deals.
          </p>
        </Container>
      </section>
      <Container className="pb-24 pt-12">
        {listings.length === 0 ? (
          <div className="rounded-[20px] border border-dashed border-line-strong px-6 py-14 text-center">
            <p className="text-[15px] text-muted">No sponsored listings right now.</p>
            <Link href="/promote" className={buttonClass("primary", "md", "mt-5")}>
              Promote your SaaS <Icon name="arrow-right" size={15} />
            </Link>
          </div>
        ) : (
          <>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((l) => (
                <li key={l.id}>
                  <SponsoredCard listing={l} />
                </li>
              ))}
            </ul>
            <p className="mt-10 text-center text-sm text-muted">
              Want your product here?{" "}
              <Link href="/promote" className="font-medium text-accent-ink underline-offset-2 hover:underline">
                Promote your SaaS
              </Link>
            </p>
          </>
        )}
      </Container>
    </>
  );
}
