import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { formatCents, formatPlanRate, getPlan } from "@/config/listing-plans";
import { DashboardShell, fmtDate, Panel, StatCard } from "@/components/advertiser/dashboard-shell";
import { ListingEditor, LogoUploader } from "@/components/advertiser/listing-editor";
import { PaymentPill, StatusPill, TestModeBadge } from "@/components/advertiser/status-pill";
import { FormMessage } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { buttonClass } from "@/components/ui/primitives";
import {
  isPaid,
  paymentLabels,
  publicationLabels,
  publicationState,
  publicationTone,
  reviewLabels,
  reviewTone,
  subscriptionLabels,
  subscriptionTone,
} from "@/lib/listing-status";
import { getForUser, isLocked, missingProfileFields, ordersFor, type SafeSubmission } from "@/lib/server/submissions";
import { isAdmin, requireUser, storageAdmin } from "@/lib/server/supabase";
import { listingStats } from "@/lib/server/tracking";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Manage listing", description: "Manage your listing.", path: "/dashboard", noIndex: true });

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ListingDetailPage(props: PageProps<"/dashboard/listings/[id]">) {
  const { id } = await props.params;
  const user = await requireUser(`/dashboard/listings/${id}`);
  if (!UUID.test(id)) notFound();
  const sub = await getForUser(id.toLowerCase(), user.id);
  if (!sub) notFound();
  const q = await props.searchParams;

  const [orders, stats] = await Promise.all([ordersFor(sub.id), listingStats(sub.id)]);
  const plan = getPlan(sub.plan);
  const now = new Date();
  const pub = publicationState(sub, now);
  const missing = missingProfileFields(sub);
  const subscribed = sub.subscription_status !== null;
  // Older one-time listings count down to a fixed end date; subscriptions renew.
  const daysLeft = !subscribed && pub === "published" && sub.listing_ends_at ? Math.ceil((sub.listing_ends_at.getTime() - now.getTime()) / 86400_000) : null;

  return (
    <DashboardShell email={user.email} admin={isAdmin(user)} section="dashboard">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">
        <Icon name="arrow-left" size={14} /> All listings
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="display break-words text-[2.2rem] sm:text-[2.8rem]">{sub.product_name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <PaymentPill status={sub.payment_status} />
            <StatusPill tone={reviewTone(sub.review_status)}>{reviewLabels[sub.review_status]}</StatusPill>
            <StatusPill tone={publicationTone(pub)}>{publicationLabels[pub]}</StatusPill>
            {sub.subscription_status && (
              <StatusPill tone={subscriptionTone(sub.subscription_status)}>Subscription {subscriptionLabels[sub.subscription_status].toLowerCase()}</StatusPill>
            )}
            {sub.checkout_test_mode && <TestModeBadge />}
          </div>
        </div>
        {pub === "published" && sub.slug && (
          <Link href={`/listings/${sub.slug}`} className={buttonClass("secondary", "md")}>
            View live listing <Icon name="arrow-up-right" size={14} />
          </Link>
        )}
      </div>

      {q.welcome === "1" && (
        <div className="mt-6">
          <FormMessage tone="success">This listing is now linked to your account.</FormMessage>
        </div>
      )}
      {q.billing === "unavailable" && (
        <div className="mt-6">
          <FormMessage tone="error">
            Couldn&apos;t open your subscription settings just now. Please try again in a moment, or use the link in your Lemon Squeezy receipt email.
          </FormMessage>
        </div>
      )}

      <NextStep sub={sub} missing={missing} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <Panel title="Product details">
            <ListingEditor
              listing={{
                id: sub.id,
                productName: sub.product_name,
                website: sub.website,
                description: sub.description ?? "",
                links: sub.links ?? {},
                locked: isLocked(sub),
              }}
            />
          </Panel>
          <Panel title="Logo">
            <LogoUploader id={sub.id} logoUrl={sub.logo_url} enabled={storageAdmin() !== null} />
          </Panel>
          <Panel title="Performance">
            {sub.listing_starts_at === null ? (
              <p className="text-sm text-muted">Analytics start once your listing is published. We count real listing page views and clicks to your website.</p>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-3">
                  <StatCard label="Views" value={stats.views.toLocaleString("en-US")} />
                  <StatCard label="Clicks" value={stats.clicks.toLocaleString("en-US")} />
                  <StatCard label="CTR" value={stats.views > 0 ? `${((stats.clicks / stats.views) * 100).toFixed(1)}%` : "—"} />
                </div>
                {stats.daily.length === 0 ? (
                  <p className="mt-4 text-sm text-muted">No views or clicks recorded yet.</p>
                ) : (
                  <DailyTable daily={stats.daily.slice(-30)} />
                )}
                <p className="mt-3 text-xs text-faint">
                  Views are listing page visits; clicks are visits to your website from the listing. Each visitor counts once per day. No traffic
                  is guaranteed.
                </p>
              </>
            )}
          </Panel>
        </div>

        <div className="space-y-6">
          {sub.subscription_status && plan && (
            <Panel title="Subscription">
              <dl className="space-y-2 text-sm">
                <DateRow label="Plan" value={`${plan.name} · ${formatPlanRate(plan, sub.price_cents)}`} />
                <DateRow label="Status" value={subscriptionLabels[sub.subscription_status]} />
                {sub.subscription_status === "cancelled" || sub.subscription_status === "expired" ? (
                  <DateRow label="Listing ends" value={fmtDate(sub.subscription_ends_at)} />
                ) : (
                  <DateRow label="Next renewal" value={fmtDate(sub.subscription_renews_at)} />
                )}
              </dl>
              {sub.subscription_status !== "expired" && (
                // A plain link: the billing route redirects to Lemon Squeezy.
                <a href={`/dashboard/listings/${sub.id}/billing`} className={buttonClass("secondary", "md", "mt-4 w-full")}>
                  Manage subscription <Icon name="arrow-up-right" size={14} />
                </a>
              )}
              <p className="mt-3 text-xs leading-relaxed text-faint">
                Update your card, switch plan or cancel in Lemon Squeezy&apos;s billing portal. If you cancel, your listing stays live until the
                end of the period you&apos;ve paid for.
              </p>
            </Panel>
          )}
          {sub.review_notes && (
            <Panel title="Review feedback">
              <p className="whitespace-pre-line text-sm leading-relaxed text-fg">{sub.review_notes}</p>
              {sub.reviewed_at && <p className="mt-2 text-xs text-faint">Reviewed {fmtDate(sub.reviewed_at)}</p>}
            </Panel>
          )}
          <Panel title="Ready to publish">
            {missing.length === 0 ? (
              <p className="flex items-center gap-2 text-sm text-success">
                <Icon name="check" size={15} /> Your profile has everything needed.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {missing.map((m) => (
                  <li key={m} className="flex items-start gap-2 text-muted">
                    <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-warn" />
                    {m}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-xs text-faint">Optional until publication. Only what&apos;s needed for a useful listing.</p>
          </Panel>
          <Panel title="Dates">
            <dl className="space-y-2 text-sm">
              <DateRow label="Submitted" value={fmtDate(sub.created_at)} />
              <DateRow label="Paid" value={fmtDate(sub.paid_at)} />
              <DateRow label="Listing starts" value={fmtDate(sub.listing_starts_at)} />
              {!subscribed && (
                <>
                  <DateRow label="Listing duration" value={`${plan?.days ?? "—"} days`} />
                  <DateRow label="Listing expires" value={fmtDate(sub.listing_ends_at)} />
                </>
              )}
              {daysLeft !== null && <DateRow label="Days left" value={String(daysLeft)} />}
            </dl>
          </Panel>
          <Panel title="Payment">
            {orders.length === 0 ? (
              <p className="text-sm text-muted">{isPaid(sub.payment_status) ? "Paid." : "No verified payment yet."}</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {orders.map((o) => (
                  <li key={o.id} className="rounded-lg border border-line bg-subtle px-3 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-fg">{o.kind === "renewal" ? "Renewal" : `Order #${o.order_number ?? o.provider_order_id}`}</span>
                      <span className="tabular text-fg">{formatCents(o.total_cents, o.currency)}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-muted">
                      {paymentLabels[o.status === "pending" ? "pending" : o.status]} · {fmtDate(o.paid_at ?? o.created_at)}
                      {o.refunded_cents > 0 && <span>· Refunded {formatCents(o.refunded_cents, o.currency)}</span>}
                      {o.test_mode && <TestModeBadge />}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-xs text-faint">Payments are processed by Lemon Squeezy. We never see or store card details.</p>
          </Panel>
        </div>
      </div>
    </DashboardShell>
  );
}

function NextStep({ sub, missing }: { sub: SafeSubmission; missing: string[] }) {
  const pub = publicationState(sub);
  let title: string;
  let body: string;
  if (!isPaid(sub.payment_status)) {
    const refunded = sub.payment_status === "refunded" || sub.payment_status === "partially_refunded";
    title = refunded ? "Payment refunded" : "Awaiting payment";
    body =
      refunded
        ? "This listing won't be published."
        : "We'll update this page as soon as Lemon Squeezy confirms the payment.";
  } else if (sub.subscription_status === "past_due" || sub.subscription_status === "unpaid") {
    title = "Renewal payment failed";
    body = "Lemon Squeezy couldn't charge your card and will retry. Update your payment method from Manage subscription to keep your listing live.";
  } else if (sub.subscription_status === "expired") {
    title = "Subscription ended";
    body = "Your listing is no longer shown. Submit a new listing any time.";
  } else if (pub === "published" && sub.subscription_status === "cancelled") {
    title = "Subscription cancelled";
    body = `Your listing stays live until ${fmtDate(sub.subscription_ends_at)}, and you won't be charged again.`;
  } else if (pub === "published") {
    title = "Your listing is live";
    body = sub.subscription_status
      ? `It stays live while your subscription is active (next renewal ${fmtDate(sub.subscription_renews_at)}). Keep your details up to date — changes appear right away.`
      : `Shown until ${fmtDate(sub.listing_ends_at)}. Keep your details up to date — changes appear right away.`;
  } else if (pub === "expired") {
    title = "Listing period ended";
    body = "Thanks for listing with us. Submit a new listing any time.";
  } else if (sub.review_status === "rejected") {
    title = "Changes needed";
    body = `See the review feedback, update your listing, then email ${siteConfig.listingsEmail} so we can take another look.`;
  } else if (missing.length > 0) {
    title = "Complete your profile";
    body = `Add ${missing.join(" and ").toLowerCase()} so we can publish your listing once it's approved.`;
  } else if (sub.review_status === "approved" || pub === "scheduled") {
    title = pub === "scheduled" ? "Scheduled" : "Approved";
    body = pub === "scheduled" ? `Goes live on ${fmtDate(sub.listing_starts_at)}.` : "We'll publish it shortly and set your listing dates.";
  } else {
    title = "Under review";
    body = "We review every listing before it goes live, usually within a few business days.";
  }
  return (
    <div className="mt-6 flex items-start gap-3 rounded-[16px] border border-accent/30 bg-accent-soft px-4 py-3.5">
      <Icon name="info" size={18} className="mt-0.5 shrink-0 text-accent-ink" />
      <div>
        <p className="text-sm font-semibold text-fg">{title}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-muted">{body}</p>
      </div>
    </div>
  );
}

function DateRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className="tabular text-fg">{value}</dd>
    </div>
  );
}

function DailyTable({ daily }: { daily: { day: string; views: number; clicks: number }[] }) {
  const max = Math.max(1, ...daily.map((d) => d.views));
  return (
    <table className="mt-5 w-full text-sm">
      <caption className="sr-only">Daily views and clicks</caption>
      <thead>
        <tr className="text-left text-[11px] uppercase tracking-[0.08em] text-faint">
          <th scope="col" className="pb-2 font-medium">Day</th>
          <th scope="col" className="w-1/2 pb-2 font-medium">Views</th>
          <th scope="col" className="pb-2 text-right font-medium">Clicks</th>
        </tr>
      </thead>
      <tbody>
        {[...daily].reverse().map((d) => (
          <tr key={d.day} className="border-t border-line">
            <td className="tabular py-1.5 text-muted">{fmtDate(new Date(`${d.day}T00:00:00Z`))}</td>
            <td className="py-1.5">
              <span className="flex items-center gap-2">
                <span className="h-1.5 rounded-full bg-accent" style={{ width: `${Math.max(4, (d.views / max) * 100)}%` }} />
                <span className="tabular text-fg">{d.views}</span>
              </span>
            </td>
            <td className="tabular py-1.5 text-right text-fg">{d.clicks}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
