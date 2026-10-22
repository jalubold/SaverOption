/**
 * Listing status vocabulary shared by the dashboard, admin and public pages.
 * Payment and listing (review/publication) status are tracked separately: a
 * listing can be paid and under review at the same time.
 */

export type PaymentStatus = "awaiting_payment" | "pending" | "paid" | "failed" | "refunded" | "partially_refunded";
/** Lemon Squeezy's subscription status. */
export type SubscriptionStatus = "on_trial" | "active" | "paused" | "past_due" | "unpaid" | "cancelled" | "expired";
export type ReviewStatus = "draft" | "pending_review" | "approved" | "rejected" | "published";
/** Review status plus what time does to a published listing. */
export type ListingState = Exclude<ReviewStatus, "published"> | "scheduled" | "published" | "expired";

export const paymentLabels: Record<PaymentStatus, string> = {
  awaiting_payment: "Awaiting payment",
  pending: "Payment pending",
  paid: "Paid",
  failed: "Payment failed",
  refunded: "Refunded",
  partially_refunded: "Partially refunded",
};

export const listingLabels: Record<ListingState, string> = {
  draft: "Draft",
  pending_review: "Under review",
  approved: "Approved",
  rejected: "Rejected",
  scheduled: "Scheduled",
  published: "Published",
  expired: "Expired",
};

/**
 * Whether the listing is paid for and can be published. A partial refund is how a
 * cancellation is refunded (amount minus processing fees), so it counts as cancelled.
 */
export function isPaid(status: PaymentStatus): boolean {
  return status === "paid";
}

export function listingState(
  s: { review_status: ReviewStatus; listing_starts_at: Date | null; listing_ends_at: Date | null },
  now = new Date(),
): ListingState {
  if (s.review_status !== "published") return s.review_status;
  if (s.listing_ends_at && s.listing_ends_at <= now) return "expired";
  if (s.listing_starts_at && s.listing_starts_at > now) return "scheduled";
  return "published";
}

/** Tone for status pills: positive, waiting, negative or neutral. */
export function statusTone(state: ListingState | PaymentStatus): "good" | "wait" | "bad" | "neutral" {
  switch (state) {
    case "paid":
    case "published":
    case "approved":
      return "good";
    case "awaiting_payment":
    case "pending":
    case "pending_review":
    case "scheduled":
      return "wait";
    case "failed":
    case "rejected":
    case "refunded":
    case "partially_refunded":
      return "bad";
    default:
      return "neutral";
  }
}

/** Review outcome on its own (publication is shown separately). */
export const reviewLabels: Record<ReviewStatus, string> = {
  draft: "Not submitted",
  pending_review: "Under review",
  approved: "Approved",
  rejected: "Rejected",
  published: "Approved",
};

export function reviewTone(status: ReviewStatus): "good" | "wait" | "bad" | "neutral" {
  return status === "approved" || status === "published" ? "good" : status === "pending_review" ? "wait" : status === "rejected" ? "bad" : "neutral";
}

export type PublicationState = "unpublished" | "scheduled" | "published" | "expired";

export const publicationLabels: Record<PublicationState, string> = {
  unpublished: "Not published",
  scheduled: "Scheduled",
  published: "Published",
  expired: "Expired",
};

export function publicationState(
  s: { review_status: ReviewStatus; listing_starts_at: Date | null; listing_ends_at: Date | null },
  now = new Date(),
): PublicationState {
  const state = listingState(s, now);
  return state === "scheduled" || state === "published" || state === "expired" ? state : "unpublished";
}

export function publicationTone(state: PublicationState): "good" | "wait" | "bad" | "neutral" {
  return state === "published" ? "good" : state === "scheduled" ? "wait" : "neutral";
}

export const subscriptionLabels: Record<SubscriptionStatus, string> = {
  on_trial: "Trial",
  active: "Active",
  paused: "Paused",
  past_due: "Payment failed",
  unpaid: "Unpaid",
  cancelled: "Cancelled",
  expired: "Ended",
};

/** A cancelled subscription still runs to the end of its paid period, so it's "waiting", not bad. */
export function subscriptionTone(status: SubscriptionStatus): "good" | "wait" | "bad" | "neutral" {
  switch (status) {
    case "active":
    case "on_trial":
      return "good";
    case "cancelled":
      return "wait";
    case "past_due":
    case "unpaid":
      return "bad";
    default:
      return "neutral";
  }
}
