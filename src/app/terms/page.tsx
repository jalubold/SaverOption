import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of use",
  description: `The terms for using ${siteConfig.name}.`,
  path: "/terms",
});

const LAST_UPDATED = "October 17, 2026";

export default function TermsPage() {
  const name = siteConfig.name;
  return (
    <Container className="pb-24 pt-16 sm:pt-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="display text-[3rem] sm:text-[4rem]">
          Terms <em>of use.</em>
        </h1>
        <p className="mt-4 text-sm text-faint">Last updated {LAST_UPDATED}</p>
        <div className="prose-body mt-8 text-[16px]">
          <p>By using {name} you agree to these terms. If you don&apos;t agree, please don&apos;t use the site.</p>

          <h2>What {name} is</h2>
          <p>
            {name} lists software offers published by software providers and other sellers. We don&apos;t sell software,
            take payments or run the offers ourselves. You claim every offer with the provider, under the provider&apos;s
            own terms.
          </p>

          <h2>Accuracy of listings</h2>
          <p>
            We check offers against their official source and show the date we checked. Offers can change or end at any
            time without notice, so the provider&apos;s current terms always take precedence over what you read here. We
            can&apos;t guarantee that an offer is still available or that you&apos;ll qualify for it.
          </p>

          <h2>Links to other sites</h2>
          <p>
            Listings link to third-party websites. We aren&apos;t responsible for their content, products, prices or
            privacy practices. Some links may be affiliate links; when they are, the listing says so. See our{" "}
            <Link href="/disclosure">disclosure</Link>.
          </p>

          <h2>Trademarks</h2>
          <p>
            Product names and trademarks belong to their owners and are used only to identify the products. A listing
            doesn&apos;t mean the provider endorses {name}.
          </p>

          <h2>Liability</h2>
          <p>
            The site is provided &ldquo;as is&rdquo;. To the extent the law allows, {name} isn&apos;t liable for losses
            arising from your use of the site or of any offer listed on it.
          </p>

          <h2>Contact</h2>
          <p>
            Questions, corrections or takedown requests: <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
            See also our <Link href="/privacy">privacy policy</Link>.
          </p>
        </div>
      </div>
    </Container>
  );
}
