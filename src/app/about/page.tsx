import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: `About ${siteConfig.name}`,
  description: `${siteConfig.name} collects software deals, free credits and perks in one place and links every offer to its source.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <Container className="pb-24 pt-16 sm:pt-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="display text-[3rem] sm:text-[4rem]">
          About <em>{siteConfig.name}.</em>
        </h1>
        <div className="prose-body mt-8 text-[16px]">
          <p>
            Software spending creeps up one subscription at a time. {siteConfig.name} is a single place to find the
            discounts, free credits, startup programs, student plans and open-source alternatives that can bring it back
            down.
          </p>
          <p>
            We&apos;re a discovery site, not a store. We don&apos;t sell software or process payments — every listing links
            to the provider, or the marketplace running the offer, so you redeem it with them directly.
          </p>

          <h2>How listings work</h2>
          <ul>
            <li>Each offer links to its official source, and says whether it&apos;s run by the provider, a partner or a third party.</li>
            <li>Prices, savings and end dates are only shown when the source states them. If we don&apos;t know, we leave it blank.</li>
            <li>
              Offers marked <em>verified</em> were checked by an editor against the source on the date shown. Unverified
              offers are labelled as such.
            </li>
            <li>When an offer ends, we mark it as ended rather than quietly leaving it live.</li>
          </ul>

          <h2>Who it&apos;s for</h2>
          <p>
            Indie hackers, founders, startup teams, freelancers, developers, designers, students and small businesses —
            anyone who&apos;d rather spend less on tools.
          </p>

          <h2>Corrections and submissions</h2>
          <p>
            Spotted an expired offer or a wrong detail, or want to suggest a deal? Email{" "}
            <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>. See our{" "}
            <Link href="/disclosure">disclosure</Link> for how sponsored and affiliate links are labelled.
          </p>
        </div>
      </div>
    </Container>
  );
}
