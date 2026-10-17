import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy policy",
  description: `What ${siteConfig.name} collects, why, and the choices you have.`,
  path: "/privacy",
});

const LAST_UPDATED = "October 17, 2026";

export default function PrivacyPage() {
  const name = siteConfig.name;
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
              <strong>Outbound clicks.</strong> When you click &ldquo;View deal&rdquo;, we may count the click against that
              offer to see which offers are useful. These counts don&apos;t identify you.
            </li>
            <li>
              <strong>Server logs.</strong> Our hosting provider keeps standard technical logs (such as IP address,
              browser type and pages requested) to run and secure the site.
            </li>
          </ul>
          <p>We don&apos;t use advertising cookies, and we don&apos;t sell personal data.</p>

          <h2>Why we use it</h2>
          <ul>
            <li>To send the newsletter you asked for (based on your consent).</li>
            <li>To keep the site working, secure and useful (based on our legitimate interest in running the service).</li>
          </ul>

          <h2>Who else processes it</h2>
          <p>
            We use a hosting provider to serve the site and an email provider to send the newsletter. They process data
            only on our behalf. When you follow a link to a software provider, their own privacy policy applies on their
            site.
          </p>

          <h2>How long we keep it</h2>
          <p>
            We keep your email address until you unsubscribe. Server logs are kept for a limited period by our hosting
            provider.
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
            <Link href="/terms">terms of use</Link> and <Link href="/disclosure">how we make money</Link>.
          </p>
        </div>
      </div>
    </Container>
  );
}
