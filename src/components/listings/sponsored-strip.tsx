import { SponsoredCard } from "@/components/listings/sponsored-card";
import { SectionHeading } from "@/components/ui/primitives";
import { dbConfigured } from "@/lib/server/db";
import { listPublished, type PublicListing } from "@/lib/server/submissions";

/** Homepage section for live paid listings. Renders nothing when there are none. */
export async function SponsoredStrip() {
  let listings: PublicListing[] = [];
  if (dbConfigured()) {
    try {
      listings = await listPublished(3);
    } catch {
      return null;
    }
  }
  if (listings.length === 0) return null;
  return (
    <section aria-labelledby="sponsored-heading">
      <SectionHeading
        id="sponsored-heading"
        title={
          <>
            Sponsored <em>listings</em>
          </>
        }
        description="Paid placements from software makers, reviewed before they go live."
        href="/listings"
        linkLabel="All sponsored"
      />
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((l) => (
          <li key={l.id}>
            <SponsoredCard listing={l} />
          </li>
        ))}
      </ul>
    </section>
  );
}
