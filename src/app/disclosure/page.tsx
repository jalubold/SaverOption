import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Disclosure",
  description: `How ${siteConfig.name} labels sponsored and affiliate links.`,
  path: "/disclosure",
});

export default function DisclosurePage() {
  const name = siteConfig.name;
  return (
    <Container className="pb-24 pt-16 sm:pt-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="display text-[3rem] sm:text-[4rem]">Disclosure</h1>
        <div className="prose-body mt-8 text-[16px]">
          <p>
            {name} is free to use. Some links on this site may be affiliate or sponsored links, which means we may be
            compensated if you visit or sign up through them, at no extra cost to you.
          </p>
          <p>
            Listings that are sponsored or use an affiliate link are labelled on the page. This never changes how we
            describe or verify an offer.
          </p>
          <p>
            Offers are set by their providers and can change at any time. Always confirm the final terms on the
            provider&apos;s site.
          </p>
        </div>
      </div>
    </Container>
  );
}
