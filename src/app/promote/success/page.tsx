import Link from "next/link";
import { siteConfig } from "@/config/site";
import { formatCents, getPlan } from "@/config/listing-plans";
import { TestModeBadge } from "@/components/advertiser/status-pill";
import { GoogleButton } from "@/components/auth/auth-forms";
import { StatusPoller } from "@/components/promote/status-poller";
import { Icon } from "@/components/ui/icon";
import { buttonClass, Container } from "@/components/ui/primitives";
import { isPaid } from "@/lib/listing-status";
import { readClaimCookie } from "@/lib/server/claim";
import { dbConfigured } from "@/lib/server/db";
import { getForUser, getSubmissionByClaim, type SafeSubmission } from "@/lib/server/submissions";
import { getUser, googleSignInEnabled } from "@/lib/server/supabase";
import { recordFunnelEvent } from "@/lib/server/tracking";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Listing submission",
  description: "The status of your Saver Option listing payment.",
  path: "/promote/success",
  noIndex: true,
});

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Where Lemon Squeezy sends the buyer after checkout. Arriving here proves
 * nothing: the status shown is whatever verified webhooks have written to the
 * database, and only to the browser holding the claim cookie (or the owner).
 */
export default async function PromoteSuccessPage(props: PageProps<"/promote/success">) {
  const { s } = await props.searchParams;
  const id = typeof s === "string" && UUID.test(s) ? s.toLowerCase() : null;
  const user = await getUser();
  const google = await googleSignInEnabled();

  let sub: SafeSubmission | null = null;
  let owned = false;
  if (id && dbConfigured()) {
    try {
      const claim = await readClaimCookie();
      if (claim?.submissionId === id) sub = await getSubmissionByClaim(claim);
      if (user) {
        const mine = await getForUser(id, user.id);
        if (mine) {
          sub = mine;
          owned = true;
        }
      }
      if (sub) await recordFunnelEvent("checkout_returned", { submissionId: sub.id });
    } catch (err) {
      console.error("[promote/success]", err instanceof Error ? err.message : err);
    }
  }

  return (
    <div className="theme-dark bg-bg text-fg">
      <section className="hero-glow min-h-[70vh] border-b border-line">
        <Container className="max-w-2xl py-14 sm:py-20">
          <div className="rounded-[20px] border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
            {sub ? <Status sub={sub} owned={owned} signedIn={Boolean(user)} google={google} /> : <Unknown signedIn={Boolean(user)} />}
          </div>
        </Container>
      </section>
    </div>
  );
}

function Status({ sub, owned, signedIn, google }: { sub: SafeSubmission; owned: boolean; signedIn: boolean; google: boolean }) {
  const plan = getPlan(sub.plan);
  const summary = (
    <dl className="mt-6 divide-y divide-line rounded-[14px] border border-line bg-subtle text-sm">
      <Row label="Product" value={sub.product_name} />
      <Row label="Plan" value={`${plan?.name ?? sub.plan} · ${plan?.days ?? "—"}-day listing`} />
      <Row label="Price" value={formatCents(sub.price_cents, sub.currency)} />
      <Row label="Reference" value={<span className="font-mono">{sub.id.slice(0, 8).toUpperCase()}</span>} />
    </dl>
  );
  const testBadge = sub.checkout_test_mode ? <TestModeBadge /> : null;

  if (isPaid(sub.payment_status)) {
    return (
      <>
        <Tile icon="check" />
        <h1 className="display mt-4 text-[2rem] sm:text-[2.5rem]">
          Your listing submission is <em className="accent">received!</em>
        </h1>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-[15px] leading-relaxed text-muted">
          {owned
            ? "Payment confirmed. It's in your dashboard, where you can complete your product details and track its performance."
            : "Payment confirmed. Create an account to manage your submission, complete your product details, and track its performance."}{" "}
          {testBadge}
        </p>
        {summary}
        <ol className="mt-6 space-y-2 text-sm text-muted">
          <Step n={1} done>Payment verified by Lemon Squeezy. Your receipt is on its way to {sub.contact_email}.</Step>
          <Step n={2}>Add a logo and a short description so your listing is ready to publish.</Step>
          <Step n={3}>We review it, then publish it for {plan?.days ?? "the"} days.</Step>
        </ol>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          {owned ? (
            <Link href={`/dashboard/listings/${sub.id}`} className={buttonClass("primary", "lg", "w-full sm:flex-1")}>
              Complete your listing <Icon name="arrow-right" size={16} />
            </Link>
          ) : signedIn ? (
            // A plain link: /claim is a route handler, so it needs a full navigation.
            <a href="/claim" className={buttonClass("primary", "lg", "w-full sm:flex-1")}>
              Add to my dashboard <Icon name="arrow-right" size={16} />
            </a>
          ) : (
            <div className="w-full">
              <GoogleButton next="/claim" disabled={!google} />
              <p className="mt-2 text-center text-xs text-faint">
                {google
                  ? "Creates your account, or signs you in if you already have one."
                  : "Sign-in opens shortly. Your payment is safe; use the link in your receipt email to add this listing to your account."}
              </p>
            </div>
          )}
        </div>
        {!owned && (
          <p className="mt-4 text-xs leading-relaxed text-faint">
            On another device? Use the &ldquo;Manage your listing&rdquo; link in your receipt email. It works once and expires after 30 days.
          </p>
        )}
      </>
    );
  }

  if (sub.payment_status === "failed") {
    return (
      <>
        <Tile icon="alert" danger />
        <h1 className="display mt-4 text-[2rem] sm:text-[2.5rem]">
          Payment didn&apos;t <em className="accent">go through</em>
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">You haven&apos;t been charged. Your details are saved, so you can try again with another card or method. {testBadge}</p>
        {summary}
        <Link href="/promote" className={buttonClass("primary", "lg", "mt-7 w-full")}>
          Try again <Icon name="arrow-right" size={16} />
        </Link>
      </>
    );
  }

  if (sub.payment_status === "refunded" || sub.payment_status === "partially_refunded") {
    return (
      <>
        <Tile icon="info" />
        <h1 className="display mt-4 text-[2rem] sm:text-[2.5rem]">
          This payment was <em className="accent">refunded</em>
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">
          The listing won&apos;t be published. Questions? Email{" "}
          <a href={`mailto:${siteConfig.listingsEmail}`} className="font-medium text-accent-ink underline-offset-2 hover:underline">
            {siteConfig.listingsEmail}
          </a>
          .
        </p>
        {summary}
      </>
    );
  }

  // awaiting_payment or pending: no verified payment yet.
  return (
    <>
      <Tile icon="clock" />
      <h1 className="display mt-4 text-[2rem] sm:text-[2.5rem]">
        Confirming your <em className="accent">payment</em>
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-muted">
        We show a confirmation only once Lemon Squeezy has verified the payment. This usually takes a few seconds. {testBadge}
      </p>
      {summary}
      <StatusPoller
        fallback={
          <div className="mt-6 rounded-[14px] border border-line bg-subtle p-4 text-sm text-muted">
            <p className="font-medium text-fg">Still waiting for confirmation.</p>
            <p className="mt-1 leading-relaxed">
              If you completed payment, your receipt email has a link to manage your listing, and this page will show it once confirmed. If you
              left checkout early, your details are saved.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Link href={`/promote/success?s=${sub.id}`} className={buttonClass("secondary", "md")}>
                <Icon name="refresh" size={15} /> Check again
              </Link>
              <Link href="/promote" className={buttonClass("primary", "md")}>
                Return to checkout <Icon name="arrow-right" size={15} />
              </Link>
            </div>
          </div>
        }
      />
    </>
  );
}

function Unknown({ signedIn }: { signedIn: boolean }) {
  return (
    <>
      <Tile icon="info" />
      <h1 className="display mt-4 text-[2rem] sm:text-[2.5rem]">
        We can&apos;t show this <em className="accent">order here</em>
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-muted">
        For your privacy, payment status is only shown in the browser that started checkout, or in your account. Use the link in your receipt
        email, or {signedIn ? "open your dashboard" : "sign in"} to see your listings.
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Link href={signedIn ? "/dashboard" : "/login?next=/dashboard"} className={buttonClass("primary", "lg", "w-full sm:flex-1")}>
          {signedIn ? "Go to dashboard" : "Sign in"} <Icon name="arrow-right" size={16} />
        </Link>
        <Link href="/promote" className={buttonClass("secondary", "lg", "w-full sm:w-auto")}>
          Promote your SaaS
        </Link>
      </div>
    </>
  );
}

function Tile({ icon, danger }: { icon: "check" | "alert" | "info" | "clock"; danger?: boolean }) {
  return (
    <span className="icon-tile size-11" style={danger ? ({ "--tile-from": "#f97066", "--tile-to": "#d92d20" } as React.CSSProperties) : undefined}>
      <Icon name={icon} size={20} />
    </span>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5">
      <dt className="text-muted">{label}</dt>
      <dd className="min-w-0 truncate text-right text-fg">{value}</dd>
    </div>
  );
}

function Step({ n, done, children }: { n: number; done?: boolean; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span
        className={
          done
            ? "inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-[var(--accent-contrast)]"
            : "tabular inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-line-strong text-[12px] text-faint"
        }
      >
        {done ? <Icon name="check" size={13} /> : n}
      </span>
      <span className="pt-0.5 leading-relaxed">{children}</span>
    </li>
  );
}
