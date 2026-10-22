import Link from "next/link";
import { notFound } from "next/navigation";
import { formatCents, formatPlanRate, getPlan } from "@/config/listing-plans";
import { PublishForm, ReviewForm } from "@/components/advertiser/admin-forms";
import { DashboardShell, fmtDate, Panel, StatCard } from "@/components/advertiser/dashboard-shell";
import { PaymentPill, StatusPill, TestModeBadge } from "@/components/advertiser/status-pill";
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
import { getSubmission, missingProfileFields, ordersFor } from "@/lib/server/submissions";
import { requireAdmin } from "@/lib/server/supabase";
import { listingStats } from "@/lib/server/tracking";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Submission", description: "Admin review.", path: "/admin", noIndex: true });

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const day = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : "");

export default async function AdminSubmissionPage(props: PageProps<"/admin/submissions/[id]">) {
  const user = await requireAdmin();
  const { id } = await props.params;
  if (!UUID.test(id)) notFound();
  const sub = await getSubmission(id.toLowerCase());
  if (!sub) notFound();
  const [orders, stats] = await Promise.all([ordersFor(sub.id), listingStats(sub.id)]);
  const plan = getPlan(sub.plan);
  const pub = publicationState(sub);
  const missing = missingProfileFields(sub);
  const paid = isPaid(sub.payment_status);
  const published = sub.review_status === "published";
  const links = Object.entries(sub.links ?? {}).filter(([, v]) => v);

  return (
    <DashboardShell email={user.email} admin section="admin">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">
        <Icon name="arrow-left" size={14} /> All submissions
      </Link>
      <div className="mt-4 flex flex-wrap items-start gap-4">
        {sub.logo_url && (
          // eslint-disable-next-line @next/next/no-img-element -- advertiser logo from Supabase Storage
          <img src={sub.logo_url} alt="" className="size-14 rounded-xl border border-line bg-white object-contain" />
        )}
        <div className="min-w-0 flex-1">
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
            View live <Icon name="arrow-up-right" size={14} />
          </Link>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <Panel title="Submission">
            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              <Field label="Website">
                <a href={sub.website} target="_blank" rel="noopener noreferrer nofollow" className="text-accent-ink [overflow-wrap:anywhere] hover:underline">
                  {sub.website}
                </a>
              </Field>
              <Field label="Contact email">{sub.contact_email}</Field>
              <Field label="Plan">
                {plan ? `${plan.name} · ${formatPlanRate(plan, sub.price_cents)}` : `${sub.plan} · ${formatCents(sub.price_cents, sub.currency)}`}
              </Field>
              <Field label="Subscription">
                {sub.subscription_status ? (
                  <>
                    {subscriptionLabels[sub.subscription_status]}
                    {sub.subscription_status === "cancelled" || sub.subscription_status === "expired"
                      ? ` · ends ${fmtDate(sub.subscription_ends_at)}`
                      : ` · renews ${fmtDate(sub.subscription_renews_at)}`}
                    <span className="block font-mono text-[11px] text-faint">LS {sub.subscription_id}</span>
                  </>
                ) : (
                  <span className="text-faint">{paid ? "One-time payment (no subscription)" : "—"}</span>
                )}
              </Field>
              <Field label="Account">{sub.user_id ? `Claimed ${fmtDate(sub.claimed_at)}` : "Not claimed yet"}</Field>
              <Field label="Submitted">{fmtDate(sub.created_at)}</Field>
              <Field label="Paid">{fmtDate(sub.paid_at)}</Field>
              <Field label="Reference">
                <span className="font-mono">{sub.id}</span>
              </Field>
              <Field label="Slug">{sub.slug ?? "—"}</Field>
            </dl>
            <div className="mt-5 border-t border-line pt-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-faint">Description</p>
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-fg">{sub.description || <span className="text-faint">None yet</span>}</p>
            </div>
            {links.length > 0 && (
              <ul className="mt-4 space-y-1 text-sm">
                {links.map(([k, v]) => (
                  <li key={k}>
                    <span className="text-muted">{k}: </span>
                    <a href={v as string} target="_blank" rel="noopener noreferrer nofollow" className="text-accent-ink [overflow-wrap:anywhere] hover:underline">
                      {v as string}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {missing.length > 0 && <p className="mt-4 text-sm text-warn">Missing before publication: {missing.join(", ")}.</p>}
          </Panel>

          <Panel title="Verified payments">
            {orders.length === 0 ? (
              <p className="text-sm text-muted">No webhook-verified orders.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-[0.08em] text-faint">
                      <th scope="col" className="pb-2 font-medium">Order</th>
                      <th scope="col" className="pb-2 font-medium">Status</th>
                      <th scope="col" className="pb-2 font-medium">Total</th>
                      <th scope="col" className="pb-2 font-medium">Refunded</th>
                      <th scope="col" className="pb-2 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="border-t border-line">
                        <td className="py-2">
                          <span className="font-mono text-[12px] text-fg">{o.kind === "renewal" ? "Renewal" : `#${o.order_number ?? "—"}`}</span>
                          <span className="block font-mono text-[11px] text-faint">LS {o.provider_order_id}</span>
                        </td>
                        <td className="py-2">
                          {paymentLabels[o.status]} {o.test_mode && <TestModeBadge />}
                        </td>
                        <td className="tabular py-2">{formatCents(o.total_cents, o.currency)}</td>
                        <td className="tabular py-2">{o.refunded_cents ? formatCents(o.refunded_cents, o.currency) : "—"}</td>
                        <td className="tabular py-2 text-muted">{fmtDate(o.paid_at ?? o.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>

          <Panel title="Listing analytics">
            <div className="grid grid-cols-3 gap-3">
              <StatCard label="Views" value={stats.views} />
              <StatCard label="Clicks" value={stats.clicks} />
              <StatCard label="CTR" value={stats.views ? `${((stats.clicks / stats.views) * 100).toFixed(1)}%` : "—"} />
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Review">
            {!paid && <p className="mb-3 text-sm text-warn">Payment isn&apos;t verified, so this can&apos;t be approved.</p>}
            <ReviewForm id={sub.id} notes={sub.review_notes ?? ""} canApprove={paid && !published} canReject={!published} />
          </Panel>
          <Panel title="Publication">
            {sub.review_status !== "approved" && !published ? (
              <p className="text-sm text-muted">Approve the listing first.</p>
            ) : (
              <PublishForm
                id={sub.id}
                startsAt={day(sub.listing_starts_at) || new Date().toISOString().slice(0, 10)}
                endsAt={day(sub.listing_ends_at)}
                paidThrough={sub.paid_through ? fmtDate(sub.paid_through) : null}
                published={published}
                canPublish={paid && missing.length === 0}
              />
            )}
            {missing.length > 0 && (sub.review_status === "approved" || published) && (
              <p className="mt-3 text-[12px] text-warn">The advertiser needs to add: {missing.join(", ")}.</p>
            )}
          </Panel>
        </div>
      </div>
    </DashboardShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-faint">{label}</dt>
      <dd className="mt-0.5 text-fg">{children}</dd>
    </div>
  );
}
