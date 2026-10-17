import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "How we make money",
  description: `How ${siteConfig.name} labels sponsored listings, affiliate links and exclusive offers, and how editorial picks stay independent.`,
  path: "/disclosure",
});

export default function DisclosurePage() {
  const name = siteConfig.name;
  return (
    <Container className="pb-24 pt-16 sm:pt-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="display text-[3rem] sm:text-[4rem]">
          How we <em>make money.</em>
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">
          {name} is free to use. These are the ways the site may earn revenue, and the rules that keep listings honest.
        </p>
        <div className="prose-body mt-8 text-[16px]">
          <h2>Affiliate links</h2>
          <p>
            Some providers run affiliate programs that pay a commission when someone signs up through a link. If a
            listing uses an affiliate link, its page says so next to the button. Using one never costs you more. Whether
            a link earns a commission has no effect on whether we list an offer or how we describe it.
          </p>

          <h2>Sponsored listings</h2>
          <p>
            Providers can pay for a sponsored placement. Sponsored listings are always labelled
            &ldquo;Sponsored&rdquo;, carry a dashed outline, and name the sponsor. Paying doesn&apos;t buy a better
            description, a &ldquo;verified&rdquo; status or a place in Editor&apos;s picks.
          </p>

          <h2>Editor&apos;s picks</h2>
          <p>Editor&apos;s picks on the homepage are chosen for value and clear terms. They can&apos;t be bought.</p>

          <h2>Exclusive offers</h2>
          <p>
            Sometimes we arrange an offer with a provider just for {name} readers. These are labelled
            &ldquo;Exclusive&rdquo;, and any commercial arrangement behind them is disclosed on the listing.
          </p>

          <h2>Newsletter sponsorships</h2>
          <p>Newsletter issues may include a sponsor. Sponsored sections are always marked as sponsored in the email.</p>

          <h2>Verification</h2>
          <p>
            &ldquo;Verified&rdquo; means an editor checked the offer against the provider&apos;s own page on the date
            shown. Offers change without notice, so always confirm the final terms on the provider&apos;s site before
            you buy.
          </p>
        </div>
      </div>
    </Container>
  );
}
