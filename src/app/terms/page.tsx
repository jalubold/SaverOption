import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of use",
  description: `The terms for using ${siteConfig.name}.`,
  path: "/terms",
});

const LAST_UPDATED = "October 22, 2026";

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
            {name} lists software offers published by software providers and other sellers. We don&apos;t sell software or
            run the offers ourselves. You claim every offer with the provider, under the provider&apos;s own terms. The only
            thing we sell is sponsored listing subscriptions for software makers, described below.
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

          <h2 id="sponsored-listings">Sponsored listings</h2>
          <p>These terms apply when you subscribe to a sponsored listing (&ldquo;Promote your SaaS&rdquo;).</p>
          <ul>
            <li>
              <strong>What you buy.</strong> A subscription that keeps a listing for one product on {name} while it&apos;s
              active. You&apos;re billed in advance every month, every 3 months or every year, depending on the plan, and it
              renews automatically until you cancel. Live listings appear on our Sponsored listings page and in the Sponsored
              section of the homepage, and are always labelled &ldquo;Sponsored&rdquo;.
            </li>
            <li>
              <strong>Payment.</strong> Payments are processed by Lemon Squeezy, which acts as the merchant of record for
              the purchase; its terms also apply. Applicable taxes are added at checkout. Renewals are charged to the same
              payment method on the renewal date shown in your dashboard. We never see or store your card details.
            </li>
            <li>
              <strong>Review.</strong> Every listing is reviewed before it goes live. We may decline a listing that is
              misleading, unlawful, unsafe, not about software, or that uses names, logos or content you don&apos;t have
              the right to use. We may remove a live listing that breaks these rules.
            </li>
            <li>
              <strong>When your listing is live.</strong> Billing starts at checkout. Your listing goes live once
              it&apos;s approved and stays live while your subscription is paid up. If a renewal payment fails, Lemon
              Squeezy retries it, and your listing may be hidden until the payment goes through.
            </li>
            <li>
              <strong>Cancelling.</strong> You can cancel anytime from your dashboard (&ldquo;Manage subscription&rdquo;).
              You won&apos;t be charged again, and your listing stays live until the end of the period you&apos;ve
              already paid for.
            </li>
            <li>
              <strong>Price changes.</strong> New prices apply to new subscriptions. We&apos;ll email you before any change
              to the price of your subscription takes effect, so you can cancel first.
            </li>
            <li>
              <strong>No guaranteed results.</strong> We don&apos;t guarantee any number of views, clicks, sign-ups or
              sales. The statistics in your dashboard are the views and clicks we actually measured.
            </li>
            <li>
              <strong>Your content.</strong> You&apos;re responsible for the accuracy of your listing and for having the
              right to use its name, logo and description. You allow us to display them while your listing is live.
            </li>
            <li>
              <strong>Your account.</strong> You sign in with Google and are responsible for activity on your account.
            </li>
          </ul>

          <h2 id="refunds">Refunds</h2>
          <ul>
            <li>
              <strong>If we decline your listing</strong>, you get a full refund and we cancel the subscription.
            </li>
            <li>
              <strong>If you cancel before your listing goes live</strong>, you get a refund of your first payment minus
              the payment processing fees, which aren&apos;t returned to us.
            </li>
            <li>
              <strong>Once your listing is live</strong>, payments for the current billing period, including renewals,
              are non-refundable, except where the law requires otherwise. Cancel before your renewal date to avoid the
              next charge. If we remove a live listing for breaking these terms, no refund is due for the rest of the
              period.
            </li>
          </ul>
          <p>
            To ask for a refund, email <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a> with your
            order number or listing reference. Refunds are issued through Lemon Squeezy to the original payment method.
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
