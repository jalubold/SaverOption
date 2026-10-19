import Link from "next/link";
import { siteConfig } from "@/config/site";
import { googleAnalyticsId } from "@/components/analytics/google-analytics";
import { Container } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy policy",
  description: `What ${siteConfig.name} collects, why, and the choices you have.`,
  path: "/privacy",
});

const LAST_UPDATED = "October 19, 2026";

export default function PrivacyPage() {
  const name = siteConfig.name;
  const usesGoogleAnalytics = googleAnalyticsId() !== null;
  return (
    <Container className="pb-24 pt-16 sm:pt-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="display text-[3rem] sm:text-[4rem]">
          Privacy <em>policy.</em>
        </h1>
        <p className="mt-4 text-sm text-faint">Last updated {LAST_UPDATED}</p>
        <div className="prose-body mt-8 text-[16px]">
          <p>
            {name} is a website for discovering software offers. You can browse it without an account, and we collect as
            little personal data as possible.
          </p>

          <h2>What we collect</h2>
          <ul>
            <li>
              <strong>Newsletter sign-ups.</strong> If you subscribe, we store your email address so we can send the
              newsletter.
            </li>
            <li>
              <strong>Visitor counts.</strong> To count unique visitors per day without cookies, each page view is turned
              into a one-way hash of your IP address and browser user agent combined with a value that changes daily. Only
              that hash is added to an aggregate daily count; your IP address and user agent are not stored, and the hash
              can&apos;t be linked across days. We show the daily total on the site.
            </li>
            <li>
              <strong>Outbound clicks.</strong> When you click &ldquo;View deal&rdquo;, we count the click against that
              offer to see which offers are useful. Only the count per offer and day is stored, nothing about you.
            </li>
            {usesGoogleAnalytics && (
              <li>
                <strong>Google Analytics.</strong> We use Google Analytics to understand how the site is used, such as
                which pages are visited and how people arrive. It sets first-party cookies and Google processes data such
                as your IP address, browser and device type, and pages viewed. Google signals and ad personalization are
                turned off. You can opt out with Google&apos;s{" "}
                <a href="https://tools.google.com/dlpage/gaoptout">browser add-on</a>.
              </li>
            )}
            <li>
              <strong>Server logs.</strong> Our hosting provider keeps standard technical logs (such as IP address,
              browser type and pages requested) to run and secure the site.
            </li>
          </ul>
          <p>We don&apos;t use advertising cookies, and we don&apos;t sell personal data.</p>

          <h2>Why we use it</h2>
          <ul>
            <li>To send the newsletter you asked for (based on your consent).</li>
            <li>
              To keep the site working, secure and useful, and to measure how many people use it (based on our legitimate
              interest in running the service).
            </li>
          </ul>

          <h2>Who else processes it</h2>
          <p>
            We use a hosting provider to serve the site, a database provider (Upstash) to store the aggregate counts,
            {usesGoogleAnalytics && " Google (Google Analytics) to measure site usage,"} and an email provider to send
            the newsletter. They process data only on our behalf. When you follow a link to a software provider, their own privacy policy applies on their
            site.
          </p>

          <h2>How long we keep it</h2>
          <p>
            We keep your email address until you unsubscribe. Daily visitor and click counts are deleted after 40 days.
            {usesGoogleAnalytics && " Google Analytics data is kept according to the retention setting in our Google Analytics account."}{" "}
            Server logs are kept for a limited period by our hosting provider.
          </p>

          <h2>Your choices and rights</h2>
          <p>
            You can unsubscribe from any newsletter email with one click. Depending on where you live (for example in the
            EU or UK under the GDPR), you can also ask to access, correct or delete your data, or object to how we use it.
            Email <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a> and we&apos;ll respond within
            30 days. You can also complain to your local data protection authority.
          </p>

          <h2>Changes</h2>
          <p>
            If we change this policy, we&apos;ll update the date at the top of this page. See also our{" "}
            <Link href="/terms">terms of use</Link> and <Link href="/disclosure">disclosure</Link>.
          </p>
        </div>
      </div>
    </Container>
  );
}
