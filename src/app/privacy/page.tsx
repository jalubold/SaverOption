import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy policy",
  description: `What ${siteConfig.name} collects, why, and the choices you have.`,
  path: "/privacy",
});

const LAST_UPDATED = "October 30, 2026";

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
            little personal data as possible. Software makers who buy a sponsored listing sign in with Google; the
            sections on advertisers below apply to them. Companies that use{" "}
            <Link href="/business">Saver Option Business</Link> to manage their software spending also sign in with
            Google; the sections on Business workspaces apply to them.
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
            <li>
              <strong>Page analytics.</strong> We use Vercel Web Analytics to see which pages are visited and where
              visitors come from (referrer, country, browser and device type). It doesn&apos;t use cookies, and visitors
              are identified only by a hash that resets every day.
            </li>
            <li>
              <strong>Advertiser accounts.</strong> When you sign in with Google, we receive your email address and basic
              Google profile (name and profile picture) to identify your account. We don&apos;t receive your Google
              password or access to any other Google data.
            </li>
            <li>
              <strong>Listing submissions and orders.</strong> The product details and work email you enter, and from
              our payment provider (Dodo Payments or Lemon Squeezy) the order or payment number, plan, amounts, tax, payment or refund
              status, your subscription&apos;s status and renewal or end date, and its customer reference for you. Card details are
              handled by the payment provider and never reach us.
            </li>
            <li>
              <strong>Sponsored listing statistics.</strong> Views of a sponsored listing and clicks to the
              advertiser&apos;s website are counted once per visitor per day. Each visit is stored only as a one-way hash
              of your IP address and browser user agent combined with a value that changes daily, together with the
              listing and the date.
            </li>
            <li>
              <strong>Business accounts.</strong> When you sign in to Saver Option Business with Google, we receive your
              email address, name and profile picture. We don&apos;t request access to Gmail, Drive, Calendar or any other
              Google data, and we don&apos;t store Google access tokens.
            </li>
            <li>
              <strong>Business workspace data.</strong> What your team enters in a workspace: company details,
              departments, a directory of people (name, and optionally work email, job title and department), software,
              subscriptions, prices, renewal dates and decisions, payments you record, seat assignments, savings
              decisions, in-app notifications, and an audit log of changes with the name of the member who made them.
              Payment methods are stored only as short labels; anything that looks like a card number is rejected. We
              don&apos;t connect to bank accounts, cards or vendors. Each workspace&apos;s data is visible only to its
              members, according to their role.
            </li>
            <li>
              <strong>AI features in Business.</strong> If a member connects an AI client (such as Claude or ChatGPT) to a
              workspace over MCP, we store the connection — which app, who connected it, the access level and when it was
              last used — and only hashed tokens. The AI client receives the data its requests return, under its
              provider&apos;s own terms. If the in-app AI assistant is switched on and used, the question and the data the
              assistant looks up for it are sent to Anthropic to generate the answer; the conversation itself is kept only
              in the browser tab, not on our servers.
            </li>
            <li>
              <strong>Functional cookies.</strong> Only on the listing purchase flow and advertiser pages: a sign-in
              session cookie, a cookie that links your checkout to your account (kept up to 7 days), and a random ID that
              counts the steps of the purchase flow without identifying you (kept up to 30 days). In Saver Option Business:
              the sign-in session cookie and a cookie that remembers which workspace you last opened (kept up to a
              year); whether the sidebar is collapsed is remembered in your browser only.
            </li>
            <li>
              <strong>Server logs.</strong> Our hosting provider keeps standard technical logs (such as IP address,
              browser type and pages requested) to run and secure the site.
            </li>
          </ul>
          <p>We don&apos;t use advertising or tracking cookies, and we don&apos;t sell personal data.</p>

          <h2>Why we use it</h2>
          <ul>
            <li>To send the newsletter you asked for (based on your consent).</li>
            <li>
              To provide advertiser accounts, process listing purchases, review and publish listings, and show their
              statistics (to perform our contract with you), and to keep order records (to meet our legal obligations).
            </li>
            <li>
              To provide Saver Option Business workspaces: sign-in, the records your team keeps, reminders, reports and
              exports (to perform our contract with the company using the workspace). The company decides what it
              records about its own people; we process that data on its behalf.
            </li>
            <li>
              To keep the site working, secure and useful, and to measure how many people use it (based on our legitimate
              interest in running the service).
            </li>
          </ul>

          <h2>Who else processes it</h2>
          <p>
            We use a hosting provider (Vercel) to serve the site and measure page visits, a database provider (Upstash)
            to store the aggregate counts, Supabase to store advertiser accounts, listings, orders and Business workspaces, Anthropic to generate
            answers in the Business AI assistant when it&apos;s used, Google to sign you in, and an email provider to send the newsletter. They process data only on our behalf. Dodo Payments and
            Lemon Squeezy process payments as the merchant of record, each under its own privacy policy. When you follow a link to a software provider, their own privacy policy applies on their site.
          </p>

          <h2>How long we keep it</h2>
          <p>
            We keep your email address until you unsubscribe. Daily visitor and click counts are deleted after 40 days.
            Advertiser accounts, listings and their statistics are kept while the account exists; order records are kept
            as long as tax and accounting rules require. Business workspace data is kept while the workspace exists; an
            owner can export it (JSON and CSV) and delete the workspace, which deletes all of its data. A member who
            leaves a workspace loses access to it; their name stays in its audit log.
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
