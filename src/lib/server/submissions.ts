import { getPlan, planPriceCents, type ListingPlan, type ListingPlanId } from "@/config/listing-plans";
import { isPaid, type PaymentStatus, type ReviewStatus } from "@/lib/listing-status";
import { claimTokenMatches } from "@/lib/server/claim";
import { db } from "@/lib/server/db";
import { planForVariant, type LsCatalog, type OrderEvent, type OrderStatus } from "@/lib/server/lemonsqueezy";
import { recordFunnelEvent } from "@/lib/server/tracking";

/**
 * Advertiser submissions: creation before checkout, payment updates from
 * verified webhooks, claiming by an account, profile edits, admin review and
 * public listing reads. Every function enforces its own access rule; callers
 * pass the authenticated user, never a user id from the browser.
 */

export interface ListingLinks {
  pricing?: string;
  docs?: string;
  x?: string;
  linkedin?: string;
}

export interface Submission {
  id: string;
  idempotency_key: string;
  user_id: string | null;
  product_name: string;
  website: string;
  contact_email: string;
  description: string | null;
  logo_url: string | null;
  links: ListingLinks;
  plan: ListingPlanId;
  price_cents: number;
  currency: string;
  payment_status: PaymentStatus;
  paid_at: Date | null;
  review_status: ReviewStatus;
  review_notes: string | null;
  reviewed_at: Date | null;
  slug: string | null;
  listing_starts_at: Date | null;
  listing_ends_at: Date | null;
  checkout_id: string | null;
  checkout_url: string | null;
  checkout_plan: ListingPlanId | null;
  checkout_test_mode: boolean | null;
  checkout_created_at: Date | null;
  claim_token_hash: string | null;
  claim_token_expires_at: Date | null;
  claimed_at: Date | null;
  profile_started_at: Date | null;
  profile_completed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  id: string;
  submission_id: string;
  provider_order_id: string;
  order_identifier: string | null;
  order_number: number | null;
  plan: ListingPlanId;
  status: OrderStatus;
  currency: string;
  subtotal_cents: number;
  tax_cents: number;
  total_cents: number;
  refunded_cents: number;
  test_mode: boolean;
  paid_at: Date | null;
  refunded_at: Date | null;
  created_at: Date;
}

/** Columns that are safe to hand to page code (no claim token, checkout URL or idempotency key). */
const PUBLIC_COLUMNS = [
  "id", "user_id", "product_name", "website", "contact_email", "description", "logo_url", "links", "plan",
  "price_cents", "currency", "payment_status", "paid_at", "review_status", "review_notes", "reviewed_at", "slug",
  "listing_starts_at", "listing_ends_at", "checkout_test_mode", "claimed_at", "profile_started_at",
  "profile_completed_at", "created_at", "updated_at",
] as const;
export type SafeSubmission = Pick<Submission, (typeof PUBLIC_COLUMNS)[number]>;

// ─── Creation before checkout ────────────────────────────────────────────────

export interface EssentialDetails {
  productName: string;
  website: string;
  email: string;
  description: string | null;
}

/**
 * Creates the pending submission, or updates it when the same browser comes back
 * (same idempotency key) before paying — so refreshes and double clicks never
 * create a second row. Returns null if that submission is already paid.
 */
export async function upsertPendingSubmission(details: EssentialDetails, plan: ListingPlan, idempotencyKey: string) {
  const sql = db();
  const rows = await sql<Submission[]>`
    insert into submissions (idempotency_key, product_name, website, contact_email, description, plan, price_cents, currency)
    values (${idempotencyKey}, ${details.productName}, ${details.website}, ${details.email}, ${details.description},
            ${plan.id}, ${planPriceCents(plan)}, ${plan.currency})
    on conflict (idempotency_key) do update set
      product_name = excluded.product_name, website = excluded.website, contact_email = excluded.contact_email,
      description = excluded.description, plan = excluded.plan, price_cents = excluded.price_cents, updated_at = now()
    where submissions.payment_status in ('awaiting_payment', 'failed') and submissions.user_id is null
    returning *`;
  if (rows[0]) return { submission: rows[0], created: rows[0].created_at.getTime() === rows[0].updated_at.getTime() };
  const [existing] = await sql<Submission[]>`select * from submissions where idempotency_key = ${idempotencyKey}`;
  return existing ? { submission: existing, created: false, locked: true as const } : null;
}

export async function getSubmission(id: string): Promise<Submission | null> {
  const [row] = await db()<Submission[]>`select * from submissions where id = ${id}`;
  return row ?? null;
}

/** The submission behind a claim cookie or receipt link, if the token is valid and unexpired. */
export async function getSubmissionByClaim(claim: { submissionId: string; token: string } | null): Promise<Submission | null> {
  if (!claim) return null;
  const sub = await getSubmission(claim.submissionId);
  if (!sub || !claimTokenMatches(claim.token, sub.claim_token_hash)) return null;
  if (sub.claim_token_expires_at && sub.claim_token_expires_at < new Date()) return null;
  return sub;
}

/** A checkout less than 23 hours old for the same plan and mode can be reused instead of creating another. */
export function reusableCheckout(sub: Submission, plan: ListingPlan, testMode: boolean): string | null {
  if (!sub.checkout_url || !sub.checkout_created_at) return null;
  const fresh = Date.now() - sub.checkout_created_at.getTime() < 23 * 3600_000;
  return fresh && sub.checkout_plan === plan.id && sub.checkout_test_mode === testMode ? sub.checkout_url : null;
}

export async function recordCheckout(
  id: string,
  checkout: { id: string; url: string; plan: ListingPlanId; testMode: boolean },
  claim: { hash: string; expiresAt: Date },
) {
  await db()`
    update submissions set checkout_id = ${checkout.id}, checkout_url = ${checkout.url}, checkout_plan = ${checkout.plan},
      checkout_test_mode = ${checkout.testMode}, checkout_created_at = now(),
      claim_token_hash = ${claim.hash}, claim_token_expires_at = ${claim.expiresAt}, updated_at = now()
    where id = ${id} and payment_status in ('awaiting_payment', 'failed')`;
}

/** Saves a claim token without a checkout (when online checkout is closed). */
export async function setClaimToken(id: string, claim: { hash: string; expiresAt: Date }) {
  await db()`update submissions set claim_token_hash = ${claim.hash}, claim_token_expires_at = ${claim.expiresAt}, updated_at = now()
    where id = ${id} and user_id is null`;
}

// ─── Payments (verified webhooks only) ───────────────────────────────────────

/** Overall payment status from all of a submission's orders: any successful payment wins. */
function rollUp(statuses: OrderStatus[]): PaymentStatus {
  if (statuses.includes("paid")) return "paid";
  if (statuses.includes("partially_refunded")) return "partially_refunded";
  if (statuses.includes("refunded")) return "refunded";
  if (statuses.includes("pending")) return "pending";
  if (statuses.includes("failed")) return "failed";
  return "awaiting_payment";
}

export type WebhookOutcome =
  | { result: "duplicate" }
  | { result: "ignored"; reason: string }
  | { result: "stale" }
  | { result: "applied"; submissionId: string; paymentStatus: PaymentStatus };

/**
 * Applies a verified order webhook in one transaction. The delivery id (hash of
 * the raw body) is recorded in the same transaction, so a failure rolls back and
 * Lemon Squeezy's retry is processed, while a repeat of a processed delivery is
 * ignored. Orders are keyed by Lemon Squeezy's order id, so revenue can't double.
 */
export async function applyOrderEvent(ev: OrderEvent, deliveryId: string, catalog: LsCatalog): Promise<WebhookOutcome> {
  return db().begin(async (tx) => {
    const fresh = await tx`insert into webhook_events (id, event_name) values (${deliveryId}, ${ev.eventName.slice(0, 60)})
      on conflict (id) do nothing returning id`;
    if (fresh.length === 0) return { result: "duplicate" } as const;

    if (ev.storeId !== catalog.storeId) return { result: "ignored", reason: "other store" } as const;
    if (!ev.submissionId) return { result: "ignored", reason: "no submission_id in custom data" } as const;
    const plan = planForVariant(catalog, ev.variantId);
    if (!plan) return { result: "ignored", reason: "unknown variant" } as const;

    const [sub] = await tx<Submission[]>`select * from submissions where id = ${ev.submissionId} for update`;
    if (!sub) return { result: "ignored", reason: "unknown submission" } as const;

    const [prev] = await tx<{ provider_updated_at: Date | null }[]>`
      select provider_updated_at from orders where provider_order_id = ${ev.orderId} for update`;
    const updatedAt = ev.updatedAt ? new Date(ev.updatedAt) : null;
    if (prev?.provider_updated_at && updatedAt && updatedAt < prev.provider_updated_at) return { result: "stale" } as const;

    await tx`
      insert into orders (submission_id, provider_order_id, order_identifier, order_number, variant_id, plan, status, currency,
        subtotal_cents, tax_cents, total_cents, refunded_cents, test_mode, provider_updated_at, paid_at, refunded_at)
      values (${sub.id}, ${ev.orderId}, ${ev.identifier}, ${ev.orderNumber}, ${ev.variantId}, ${plan.id}, ${ev.status}, ${ev.currency},
        ${ev.subtotalCents}, ${ev.taxCents}, ${ev.totalCents}, ${ev.refundedCents}, ${ev.testMode}, ${updatedAt},
        ${ev.status === "paid" ? (ev.createdAt ? new Date(ev.createdAt) : new Date()) : null},
        ${ev.refundedAt ? new Date(ev.refundedAt) : null})
      on conflict (provider_order_id) do update set
        status = excluded.status, subtotal_cents = excluded.subtotal_cents, tax_cents = excluded.tax_cents,
        total_cents = excluded.total_cents, refunded_cents = excluded.refunded_cents, provider_updated_at = excluded.provider_updated_at,
        paid_at = coalesce(orders.paid_at, excluded.paid_at), refunded_at = coalesce(excluded.refunded_at, orders.refunded_at),
        updated_at = now()`;

    const statuses = await tx<{ status: OrderStatus }[]>`select status from orders where submission_id = ${sub.id}`;
    const paymentStatus = rollUp(statuses.map((r) => r.status));
    const becamePaid = isPaid(paymentStatus) && !isPaid(sub.payment_status) && !sub.paid_at;

    await tx`
      update submissions set
        payment_status = ${paymentStatus},
        paid_at = ${becamePaid ? new Date() : sub.paid_at},
        -- The paid plan is the truth, even if the visitor switched plans in another tab.
        plan = ${becamePaid ? plan.id : sub.plan},
        price_cents = ${becamePaid ? planPriceCents(plan) : sub.price_cents},
        -- Payment queues the listing for review; it never approves or publishes it.
        review_status = ${becamePaid && sub.review_status === "draft" ? "pending_review" : sub.review_status},
        -- The receipt email's claim link stays valid for 30 days after payment (still single-use).
        claim_token_expires_at = case when ${becamePaid} and claim_token_hash is not null
          then greatest(claim_token_expires_at, now() + interval '30 days') else claim_token_expires_at end,
        updated_at = now()
      where id = ${sub.id}`;

    if (becamePaid) await recordFunnelEvent("payment_succeeded", { submissionId: sub.id }, tx);
    if (ev.status === "failed") await recordFunnelEvent("payment_failed", { submissionId: sub.id }, tx);
    return { result: "applied", submissionId: sub.id, paymentStatus } as const;
  });
}

// ─── Claiming by an account ──────────────────────────────────────────────────

export type ClaimResult = "claimed" | "already_yours" | "not_found" | "invalid" | "unpaid" | "taken";

/**
 * Links a paid submission to the signed-in user, once, with a valid unexpired
 * claim token. The token is consumed on success; unpaid submissions keep it so
 * the user can claim after payment is confirmed.
 */
export async function claimSubmission(
  claim: { submissionId: string; token: string },
  user: { id: string; email: string },
): Promise<{ result: ClaimResult; submissionId?: string }> {
  return db().begin(async (tx) => {
    const [sub] = await tx<Submission[]>`select * from submissions where id = ${claim.submissionId} for update`;
    if (!sub) return { result: "not_found" as const };
    if (sub.user_id === user.id) return { result: "already_yours" as const, submissionId: sub.id };
    if (sub.user_id) return { result: "taken" as const };
    const expired = sub.claim_token_expires_at && sub.claim_token_expires_at < new Date();
    if (expired || !claimTokenMatches(claim.token, sub.claim_token_hash)) return { result: "invalid" as const };
    if (!isPaid(sub.payment_status)) return { result: "unpaid" as const, submissionId: sub.id };

    await tx`insert into advertiser_profiles (user_id, email) values (${user.id}, ${user.email})
      on conflict (user_id) do update set email = excluded.email`;
    await tx`update submissions set user_id = ${user.id}, claimed_at = now(), claim_token_hash = null,
      claim_token_expires_at = null, updated_at = now() where id = ${sub.id}`;
    return { result: "claimed" as const, submissionId: sub.id };
  });
}

// ─── Advertiser dashboard ────────────────────────────────────────────────────

export async function listForUser(userId: string): Promise<SafeSubmission[]> {
  const sql = db();
  return sql<SafeSubmission[]>`select ${sql(PUBLIC_COLUMNS as unknown as string[])} from submissions
    where user_id = ${userId} order by created_at desc`;
}

export async function getForUser(id: string, userId: string): Promise<SafeSubmission | null> {
  const sql = db();
  const [row] = await sql<SafeSubmission[]>`select ${sql(PUBLIC_COLUMNS as unknown as string[])} from submissions
    where id = ${id} and user_id = ${userId}`;
  return row ?? null;
}

export async function ordersFor(submissionId: string): Promise<Order[]> {
  return db()<Order[]>`select * from orders where submission_id = ${submissionId} order by created_at desc`;
}

const MIN_DESCRIPTION = 40;

/** Fields still needed before a listing can be published. */
export function missingProfileFields(s: Pick<Submission, "description" | "logo_url">): string[] {
  const missing: string[] = [];
  if (!s.description || s.description.trim().length < MIN_DESCRIPTION) missing.push(`Description (at least ${MIN_DESCRIPTION} characters)`);
  if (!s.logo_url) missing.push("Logo");
  return missing;
}

/** Name and website can change until the listing is approved; after that they're locked to what was reviewed. */
export function isLocked(s: Pick<Submission, "review_status">): boolean {
  return s.review_status === "approved" || s.review_status === "published";
}

export interface ProfileUpdate {
  productName?: string;
  website?: string;
  description?: string | null;
  links?: ListingLinks;
  logoUrl?: string;
}

/** Updates the advertiser's own profile fields. Status columns are never touched here. */
export async function updateProfile(id: string, userId: string, update: ProfileUpdate): Promise<SafeSubmission | null> {
  return db().begin(async (tx) => {
    const [sub] = await tx<Submission[]>`select * from submissions where id = ${id} and user_id = ${userId} for update`;
    if (!sub) return null;
    const fields: Record<string, unknown> = { updated_at: new Date() };
    if (!isLocked(sub)) {
      if (update.productName !== undefined) fields.product_name = update.productName;
      if (update.website !== undefined) fields.website = update.website;
    }
    if (update.description !== undefined) fields.description = update.description;
    if (update.links !== undefined) fields.links = tx.json(update.links as Record<string, string>);
    if (update.logoUrl !== undefined) fields.logo_url = update.logoUrl;
    if (!sub.profile_started_at) fields.profile_started_at = new Date();
    const next = { ...sub, description: (fields.description as string | null | undefined) ?? sub.description, logo_url: (fields.logo_url as string | undefined) ?? sub.logo_url };
    const complete = missingProfileFields(next).length === 0;
    if (complete && !sub.profile_completed_at) fields.profile_completed_at = new Date();
    if (!complete) fields.profile_completed_at = null;

    const [row] = await tx<SafeSubmission[]>`update submissions set ${tx(fields)} where id = ${id}
      returning ${tx(PUBLIC_COLUMNS as unknown as string[])}`;
    if (!sub.profile_started_at) await recordFunnelEvent("profile_completion_started", { submissionId: id }, tx);
    if (complete && !sub.profile_completed_at) await recordFunnelEvent("profile_completed", { submissionId: id }, tx);
    return row;
  });
}

// ─── Admin review ────────────────────────────────────────────────────────────

export async function adminList(filter: { payment?: PaymentStatus; review?: ReviewStatus }): Promise<Submission[]> {
  const sql = db();
  return sql<Submission[]>`select * from submissions
    where (${filter.payment ?? null}::text is null or payment_status = ${filter.payment ?? null})
      and (${filter.review ?? null}::text is null or review_status = ${filter.review ?? null})
    order by created_at desc limit 500`;
}

export type AdminAction =
  | { type: "approve"; notes: string | null }
  | { type: "reject"; notes: string }
  | { type: "publish"; startsAt: Date | null; endsAt: Date | null }
  | { type: "unpublish" }
  | { type: "notes"; notes: string | null };

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "listing"
  );
}

/** Admin-only state changes. Callers must have checked `isAdmin` already. */
export async function adminAct(id: string, action: AdminAction): Promise<{ ok: true } | { ok: false; error: string }> {
  return db().begin(async (tx) => {
    const [sub] = await tx<Submission[]>`select * from submissions where id = ${id} for update`;
    if (!sub) return { ok: false as const, error: "Submission not found." };
    const paid = isPaid(sub.payment_status);
    switch (action.type) {
      case "approve":
        if (!paid) return { ok: false as const, error: "Only paid submissions can be approved." };
        if (sub.review_status === "published") return { ok: false as const, error: "Already published." };
        await tx`update submissions set review_status = 'approved', review_notes = ${action.notes}, reviewed_at = now(), updated_at = now() where id = ${id}`;
        return { ok: true as const };
      case "reject":
        if (!action.notes.trim()) return { ok: false as const, error: "Add a note explaining the rejection." };
        await tx`update submissions set review_status = 'rejected', review_notes = ${action.notes}, reviewed_at = now(), updated_at = now() where id = ${id}`;
        return { ok: true as const };
      case "notes":
        await tx`update submissions set review_notes = ${action.notes}, updated_at = now() where id = ${id}`;
        return { ok: true as const };
      case "unpublish":
        if (sub.review_status !== "published") return { ok: false as const, error: "Not published." };
        await tx`update submissions set review_status = 'approved', updated_at = now() where id = ${id}`;
        return { ok: true as const };
      case "publish": {
        if (!paid) return { ok: false as const, error: "Payment isn't verified." };
        if (sub.review_status !== "approved" && sub.review_status !== "published") return { ok: false as const, error: "Approve the listing first." };
        const missing = missingProfileFields(sub);
        if (missing.length) return { ok: false as const, error: `Profile incomplete: ${missing.join(", ")}.` };
        const plan = getPlan(sub.plan)!;
        const startsAt = action.startsAt ?? sub.listing_starts_at ?? new Date();
        const endsAt = action.endsAt ?? new Date(startsAt.getTime() + plan.days * 86400_000);
        if (endsAt <= startsAt) return { ok: false as const, error: "End date must be after the start date." };
        let slug = sub.slug;
        if (!slug) {
          const base = slugify(sub.product_name);
          const taken = await tx<{ slug: string }[]>`select slug from submissions where slug = ${base} or slug like ${base + "-%"}`;
          const used = new Set(taken.map((t) => t.slug));
          slug = base;
          for (let n = 2; used.has(slug); n++) slug = `${base}-${n}`;
        }
        await tx`update submissions set review_status = 'published', slug = ${slug}, listing_starts_at = ${startsAt},
          listing_ends_at = ${endsAt}, reviewed_at = coalesce(reviewed_at, now()), updated_at = now() where id = ${id}`;
        return { ok: true as const };
      }
    }
  });
}

// ─── Public sponsored listings ───────────────────────────────────────────────

export type PublicListing = Pick<Submission, "id" | "product_name" | "website" | "description" | "logo_url" | "links" | "slug" | "listing_starts_at" | "listing_ends_at">;

/** Live listings: published by an admin, paid, and inside their listing window. */
export async function listPublished(limit = 50): Promise<PublicListing[]> {
  return db()<PublicListing[]>`
    select id, product_name, website, description, logo_url, links, slug, listing_starts_at, listing_ends_at
    from submissions
    where review_status = 'published' and payment_status in ('paid', 'partially_refunded')
      and listing_starts_at <= now() and listing_ends_at > now()
    order by listing_starts_at desc limit ${limit}`;
}

export async function getPublishedBySlug(slug: string): Promise<PublicListing | null> {
  const [row] = await db()<PublicListing[]>`
    select id, product_name, website, description, logo_url, links, slug, listing_starts_at, listing_ends_at
    from submissions
    where slug = ${slug} and review_status = 'published' and payment_status in ('paid', 'partially_refunded')
      and listing_starts_at <= now() and listing_ends_at > now()`;
  return row ?? null;
}
