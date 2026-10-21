import Link from "next/link";
import { getPlan } from "@/config/listing-plans";
import { DashboardShell, fmtDate } from "@/components/advertiser/dashboard-shell";
import { PaymentPill, StatusPill, TestModeBadge } from "@/components/advertiser/status-pill";
import { cn } from "@/components/ui/primitives";
import {
  paymentLabels,
  publicationLabels,
  publicationState,
  publicationTone,
  reviewTone,
  type PaymentStatus,
  type ReviewStatus,
} from "@/lib/listing-status";
import { dbConfigured } from "@/lib/server/db";
import { adminList, missingProfileFields } from "@/lib/server/submissions";
import { requireAdmin } from "@/lib/server/supabase";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Review listings", description: "Admin review.", path: "/admin", noIndex: true });

const PAYMENT: PaymentStatus[] = ["paid", "awaiting_payment", "pending", "failed", "refunded", "partially_refunded"];
const REVIEW: ReviewStatus[] = ["pending_review", "approved", "published", "rejected", "draft"];
const reviewNames: Record<ReviewStatus, string> = {
  draft: "Draft",
  pending_review: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
  published: "Published",
};

export default async function AdminPage(props: PageProps<"/admin">) {
  const user = await requireAdmin();
  const q = await props.searchParams;
  const payment = PAYMENT.find((p) => p === q.payment);
  const review = REVIEW.find((r) => r === q.review);
  const rows = dbConfigured() ? await adminList({ payment, review }) : [];
  const href = (next: { payment?: string; review?: string }) => {
    const p = new URLSearchParams();
    const pay = "payment" in next ? next.payment : payment;
    const rev = "review" in next ? next.review : review;
    if (pay) p.set("payment", pay);
    if (rev) p.set("review", rev);
    const s = p.toString();
    return s ? `/admin?${s}` : "/admin";
  };

  return (
    <DashboardShell email={user.email} admin section="admin">
      <h1 className="display text-[2.4rem] sm:text-[3rem]">
        Listing <em className="accent">review</em>
      </h1>
      <p className="mt-1 text-[15px] text-muted">Every advertiser submission. Paid doesn&apos;t mean approved: review, then publish.</p>

      <div className="mt-6 space-y-3">
        <FilterRow label="Payment" items={[["All", href({ payment: undefined }), !payment], ...PAYMENT.map((p) => [paymentLabels[p], href({ payment: p }), payment === p] as [string, string, boolean])]} />
        <FilterRow label="Review" items={[["All", href({ review: undefined }), !review], ...REVIEW.map((r) => [reviewNames[r], href({ review: r }), review === r] as [string, string, boolean])]} />
      </div>

      <p className="mt-6 text-sm text-muted">
        {rows.length} submission{rows.length === 1 ? "" : "s"}
        {rows.length === 500 && " (showing the latest 500)"}
      </p>
      {rows.length === 0 ? (
        <p className="mt-3 rounded-[14px] border border-dashed border-line-strong px-4 py-10 text-center text-sm text-muted">No submissions match these filters.</p>
      ) : (
        <div className="mt-3 overflow-x-auto rounded-[16px] border border-line bg-surface">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[11px] uppercase tracking-[0.08em] text-faint">
                <th scope="col" className="px-4 py-3 font-medium">Product</th>
                <th scope="col" className="px-4 py-3 font-medium">Plan</th>
                <th scope="col" className="px-4 py-3 font-medium">Payment</th>
                <th scope="col" className="px-4 py-3 font-medium">Review</th>
                <th scope="col" className="px-4 py-3 font-medium">Publication</th>
                <th scope="col" className="px-4 py-3 font-medium">Profile</th>
                <th scope="col" className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const pub = publicationState(r);
                const missing = missingProfileFields(r);
                return (
                  <tr key={r.id} className="border-b border-line last:border-0 hover:bg-subtle/60">
                    <td className="px-4 py-3">
                      <Link href={`/admin/submissions/${r.id}`} className="font-medium text-fg hover:text-accent-ink hover:underline">
                        {r.product_name}
                      </Link>
                      <p className="max-w-[240px] truncate text-[12px] text-faint">{r.contact_email}</p>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {getPlan(r.plan)?.name ?? r.plan} {r.checkout_test_mode && <TestModeBadge />}
                    </td>
                    <td className="px-4 py-3">
                      <PaymentPill status={r.payment_status} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill tone={reviewTone(r.review_status)}>{reviewNames[r.review_status]}</StatusPill>
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill tone={publicationTone(pub)}>{publicationLabels[pub]}</StatusPill>
                    </td>
                    <td className="px-4 py-3 text-[13px]">{missing.length === 0 ? <span className="text-success">Complete</span> : <span className="text-warn">{missing.length} missing</span>}</td>
                    <td className="tabular px-4 py-3 text-muted">{fmtDate(r.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  );
}

function FilterRow({ label, items }: { label: string; items: [string, string, boolean][] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 w-16 text-[12px] font-medium uppercase tracking-[0.08em] text-faint">{label}</span>
      {items.map(([text, href, active]) => (
        <Link
          key={text}
          href={href}
          aria-current={active ? "true" : undefined}
          className={cn(
            "rounded-full border px-2.5 py-1 text-[13px] transition-colors",
            active ? "border-accent bg-accent-soft text-fg" : "border-line text-muted hover:border-line-strong hover:text-fg",
          )}
        >
          {text}
        </Link>
      ))}
    </div>
  );
}
