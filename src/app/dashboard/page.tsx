import Link from "next/link";
import { siteConfig } from "@/config/site";
import { PromoteTrigger } from "@/components/promote/promote-modal";
import { getPlan } from "@/config/listing-plans";
import { DashboardShell, fmtDate, StatCard } from "@/components/advertiser/dashboard-shell";
import { PaymentPill, StatusPill, TestModeBadge } from "@/components/advertiser/status-pill";
import { FormMessage } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { buttonClass } from "@/components/ui/primitives";
import {
  isPaid,
  publicationLabels,
  publicationState,
  publicationTone,
  reviewLabels,
  reviewTone,
} from "@/lib/listing-status";
import { dbConfigured } from "@/lib/server/db";
import { readClaimCookie } from "@/lib/server/claim";
import { getSubmissionByClaim, listForUser, missingProfileFields } from "@/lib/server/submissions";
import { isAdmin, requireUser } from "@/lib/server/supabase";
import { statsForSubmissions } from "@/lib/server/tracking";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Dashboard", description: "Your Saver Option listings.", path: "/dashboard", noIndex: true });

const claimMessages: Record<string, string> = {
  invalid: "That listing link is invalid, expired or already used. If you paid and can't see your listing, email us your receipt.",
  taken: "That listing is already linked to another account.",
};

export default async function DashboardPage(props: PageProps<"/dashboard">) {
  const user = await requireUser("/dashboard");
  const q = await props.searchParams;
  const listings = dbConfigured() ? await listForUser(user.id) : [];
  const stats = await statsForSubmissions(listings.map((l) => l.id)).catch(() => new Map<string, { views: number; clicks: number }>());
  const now = new Date();

  const counts = {
    total: listings.length,
    paid: listings.filter((l) => isPaid(l.payment_status)).length,
    review: listings.filter((l) => l.review_status === "pending_review").length,
    published: listings.filter((l) => publicationState(l, now) === "published").length,
  };
  const claimNotice = typeof q.claim === "string" ? claimMessages[q.claim] : undefined;
  // A paid listing this browser checked out but hasn't added to an account yet.
  const pending = dbConfigured() ? await getSubmissionByClaim(await readClaimCookie()).catch(() => null) : null;
  const pendingClaim = pending && !pending.user_id && isPaid(pending.payment_status) ? pending : null;

  return (
    <DashboardShell email={user.email} admin={isAdmin(user)} section="dashboard">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-[2.4rem] sm:text-[3rem]">
            Your <em className="accent">listings</em>
          </h1>
          <p className="mt-1 text-[15px] text-muted">Status, next steps and performance for everything you&apos;ve listed.</p>
        </div>
        {listings.length > 0 && (
          <PromoteTrigger className={buttonClass("primary", "md")}>
            Submit a Listing <Icon name="arrow-right" size={15} />
          </PromoteTrigger>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {claimNotice && <FormMessage tone="error">{claimNotice}</FormMessage>}
        {q.password === "updated" && <FormMessage tone="success">Your password was updated.</FormMessage>}
        {pendingClaim && (
          <div className="flex flex-col gap-3 rounded-[14px] border border-accent/30 bg-accent-soft px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-fg">
              Your paid listing <strong>{pendingClaim.product_name}</strong> isn&apos;t in your account yet.
            </p>
            {/* Plain link: /claim is a route handler. */}
            <a href="/claim" className={buttonClass("primary", "sm")}>
              Add it to my dashboard
            </a>
          </div>
        )}
      </div>

      {listings.length === 0 ? (
        <div className="mt-8 rounded-[20px] border border-dashed border-line-strong bg-surface/60 px-6 py-14 text-center">
          <span className="icon-tile mx-auto size-12">
            <Icon name="megaphone" size={22} />
          </span>
          <h2 className="display mt-5 text-[1.9rem] sm:text-[2.3rem]">
            Promote your SaaS on <em className="accent">{siteConfig.name}</em>
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
            List your product for a fixed period with a one-time payment. Already paid? Open the &ldquo;Manage your listing&rdquo; link in your
            receipt email to add it to this account.
          </p>
          <PromoteTrigger className={buttonClass("primary", "lg", "mt-6")}>
            Submit a Listing <Icon name="arrow-right" size={16} />
          </PromoteTrigger>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Total submissions" value={counts.total} />
            <StatCard label="Paid listings" value={counts.paid} />
            <StatCard label="Awaiting review" value={counts.review} />
            <StatCard label="Published" value={counts.published} />
          </div>

          <h2 className="mt-10 text-[15px] font-semibold text-fg">My listings</h2>
          <ul className="mt-3 space-y-3">
            {listings.map((l) => {
              const plan = getPlan(l.plan);
              const pub = publicationState(l, now);
              const missing = missingProfileFields(l);
              const s = stats.get(l.id);
              return (
                <li key={l.id}>
                  <Link
                    href={`/dashboard/listings/${l.id}`}
                    className="group block rounded-[16px] border border-line bg-surface p-4 transition-colors hover:border-line-strong sm:p-5"
                  >
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      {l.logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element -- user-uploaded logo from Supabase Storage
                        <img src={l.logo_url} alt="" className="size-10 shrink-0 rounded-lg border border-line bg-white object-contain" />
                      ) : (
                        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-line bg-subtle text-faint">
                          <Icon name="image" size={18} />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-semibold text-fg">{l.product_name}</p>
                        <p className="text-[13px] text-muted">
                          {plan?.name ?? l.plan} · {plan?.days}-day listing {l.checkout_test_mode && <TestModeBadge />}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-accent-ink">
                        Manage <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[13px] sm:grid-cols-3 lg:grid-cols-6">
                      <Item label="Payment">
                        <PaymentPill status={l.payment_status} />
                      </Item>
                      <Item label="Review">
                        <StatusPill tone={reviewTone(l.review_status)}>{reviewLabels[l.review_status]}</StatusPill>
                      </Item>
                      <Item label="Publication">
                        <StatusPill tone={publicationTone(pub)}>{publicationLabels[pub]}</StatusPill>
                      </Item>
                      <Item label="Starts">{fmtDate(l.listing_starts_at)}</Item>
                      <Item label="Expires">{fmtDate(l.listing_ends_at)}</Item>
                      <Item label="Profile">
                        {missing.length === 0 ? (
                          <span className="inline-flex items-center gap-1 text-success">
                            <Icon name="check" size={13} /> Complete
                          </span>
                        ) : (
                          <span className="text-warn">{missing.length} to add</span>
                        )}
                      </Item>
                    </dl>
                    {s && (s.views > 0 || s.clicks > 0) && (
                      <p className="mt-3 flex gap-4 border-t border-line pt-3 text-[13px] text-muted">
                        <span className="inline-flex items-center gap-1.5">
                          <Icon name="eye" size={14} /> <strong className="tabular font-semibold text-fg">{s.views.toLocaleString("en-US")}</strong> views
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Icon name="pointer" size={14} /> <strong className="tabular font-semibold text-fg">{s.clicks.toLocaleString("en-US")}</strong> clicks
                        </span>
                      </p>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </DashboardShell>
  );
}

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-faint">{label}</dt>
      <dd className="mt-1 text-fg">{children}</dd>
    </div>
  );
}
