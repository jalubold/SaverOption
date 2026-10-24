import { nextPeriodDate } from "@/lib/business/calc";
import {
  BILLING_INTERVALS,
  INTERVAL_UNITS,
  PRICING_MODELS,
  SOFTWARE_CATEGORIES,
  SOFTWARE_STATUSES,
  SUBSCRIPTION_STATUSES,
  type BillingInterval,
  type IntervalUnit,
  type PricingModel,
  type SoftwareCategory,
  type SoftwareStatus,
  type SubscriptionStatus,
  categoryLabels,
} from "@/lib/business/constants";
import type { FormReader } from "@/lib/business/form";
import { canEditRecord } from "@/lib/business/permissions";
import { db } from "@/lib/server/db";
import { assertCan, BizError, logActivity, type BizContext, type Db } from "@/lib/server/business/context";
import { matchCatalogProduct } from "@/lib/server/business/catalog-match";

/** Writes for software records and subscriptions. Callers parse forms with the read*Input helpers. */

// ─── Inputs ─────────────────────────────────────────────────────────────────

export interface SoftwareInput {
  name: string;
  vendorName: string | null;
  category: SoftwareCategory;
  description: string | null;
  businessPurpose: string | null;
  website: string | null;
  ownerPersonId: string | null;
  departmentId: string | null;
  status: SoftwareStatus;
  notes: string | null;
}

export function readSoftwareInput(r: FormReader, p = ""): SoftwareInput {
  return {
    name: r.requiredText(`${p}name`, { label: "Software name", max: 80 }),
    vendorName: r.text(`${p}vendorName`, { label: "Vendor", max: 80 }),
    category: r.oneOf(`${p}category`, SOFTWARE_CATEGORIES, { label: "Category", fallback: "other" }),
    description: r.text(`${p}description`, { label: "Description", max: 1000, multiline: true }),
    businessPurpose: r.text(`${p}businessPurpose`, { label: "Business purpose", max: 500, multiline: true }),
    website: r.url(`${p}website`, { label: "Website" }),
    ownerPersonId: r.id(`${p}ownerPersonId`, { label: "an owner" }),
    departmentId: r.id(`${p}departmentId`, { label: "a department" }),
    status: r.oneOf(`${p}status`, SOFTWARE_STATUSES.filter((s) => s !== "archived"), { label: "Status", fallback: "active" }),
    notes: r.text(`${p}notes`, { label: "Notes", max: 4000, multiline: true }),
  };
}

export interface SubscriptionInput {
  planName: string | null;
  priceMinor: number | null;
  currency: string;
  pricingModel: PricingModel;
  billingInterval: BillingInterval;
  customIntervalCount: number | null;
  customIntervalUnit: IntervalUnit | null;
  startDate: string | null;
  nextRenewalDate: string | null;
  autoRenew: boolean;
  cancellationDeadline: string | null;
  contractEndDate: string | null;
  status: SubscriptionStatus;
  endedOn: string | null;
  purchasedSeats: number | null;
  reportedAssignedSeats: number | null;
  paymentMethod: string | null;
  ownerPersonId: string | null;
  departmentId: string | null;
  contractReference: string | null;
  contractNotes: string | null;
  notes: string | null;
  annualPriceOptionMinor: number | null;
  reminderDays: number[] | null;
}

export function readSubscriptionInput(r: FormReader, defaults: { currency: string }): SubscriptionInput {
  const currency = r.currency("currency", defaults.currency);
  const billingInterval = r.oneOf("billingInterval", BILLING_INTERVALS, { label: "Billing interval", fallback: "monthly" });
  const custom = billingInterval === "custom";
  const input: SubscriptionInput = {
    planName: r.text("planName", { label: "Plan", max: 80 }),
    priceMinor: r.money("price", currency, { label: "Price" }),
    currency,
    pricingModel: r.oneOf("pricingModel", PRICING_MODELS, { label: "Pricing model", fallback: "flat" }),
    billingInterval,
    customIntervalCount: custom ? r.int("customIntervalCount", { label: "Interval length", min: 1, max: 120, required: true }) : null,
    customIntervalUnit: custom ? r.oneOf<IntervalUnit>("customIntervalUnit", INTERVAL_UNITS, { label: "Interval unit", fallback: "month" }) : null,
    startDate: r.date("startDate", { label: "Start date" }),
    nextRenewalDate: r.date("nextRenewalDate", { label: "Next renewal date" }),
    autoRenew: r.has("autoRenew") ? r.bool("autoRenew") : true,
    cancellationDeadline: r.date("cancellationDeadline", { label: "Cancellation deadline" }),
    contractEndDate: r.date("contractEndDate", { label: "Contract end date" }),
    status: r.oneOf("status", SUBSCRIPTION_STATUSES, { label: "Status", fallback: "active" }),
    endedOn: r.date("endedOn", { label: "End date" }),
    purchasedSeats: r.int("purchasedSeats", { label: "Purchased seats", min: 0, max: 1_000_000 }),
    reportedAssignedSeats: r.int("reportedAssignedSeats", { label: "Seats in use", min: 0, max: 1_000_000 }),
    paymentMethod: r.paymentMethod("paymentMethod"),
    ownerPersonId: r.id("ownerPersonId", { label: "an owner" }),
    departmentId: r.id("departmentId", { label: "a department" }),
    contractReference: r.text("contractReference", { label: "Contract reference", max: 120 }),
    contractNotes: r.text("contractNotes", { label: "Contract notes", max: 2000, multiline: true }),
    notes: r.text("notes", { label: "Notes", max: 4000, multiline: true }),
    annualPriceOptionMinor: r.money("annualPriceOption", currency, { label: "Annual price option" }),
    reminderDays: r.dayList("reminderDays", { label: "Reminder days" }),
  };
  if (input.startDate && input.nextRenewalDate && input.nextRenewalDate < input.startDate) r.fail("nextRenewalDate", "The next renewal can't be before the start date.");
  if (input.cancellationDeadline && input.nextRenewalDate && input.cancellationDeadline > input.nextRenewalDate)
    r.fail("cancellationDeadline", "The cancellation deadline should be on or before the renewal date.");
  if (input.purchasedSeats !== null && input.reportedAssignedSeats !== null && input.reportedAssignedSeats > input.purchasedSeats)
    r.fail("reportedAssignedSeats", "Seats in use can't be more than the seats purchased.");
  if (input.pricingModel === "per_seat" && !input.purchasedSeats) r.fail("purchasedSeats", "Per-seat pricing needs the number of purchased seats.");
  if (input.billingInterval !== "monthly") input.annualPriceOptionMinor = null;
  if (input.status === "cancelled" || input.status === "expired") input.autoRenew = false;
  else input.endedOn = null;
  return input;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Confirms referenced people and departments belong to this workspace (the schema enforces it too). */
async function checkRefs(sql: Db, ws: string, refs: { people?: (string | null)[]; departments?: (string | null)[] }) {
  const people = (refs.people ?? []).filter((x): x is string => Boolean(x));
  const departments = (refs.departments ?? []).filter((x): x is string => Boolean(x));
  if (people.length) {
    const rows = await sql`select id from biz_people where workspace_id = ${ws} and id = any(${people}::uuid[])`;
    if (rows.length !== new Set(people).size) throw new BizError("invalid", "That person isn't in this workspace's team directory.");
  }
  if (departments.length) {
    const rows = await sql`select id from biz_departments where workspace_id = ${ws} and id = any(${departments}::uuid[]) and archived_at is null`;
    if (rows.length !== new Set(departments).size) throw new BizError("invalid", "That department doesn't exist or is archived.");
  }
}

async function vendorId(sql: Db, ws: string, name: string | null, website: string | null): Promise<string | null> {
  if (!name) return null;
  const [row] = await sql`
    insert into biz_vendors (workspace_id, name, website) values (${ws}, ${name}, ${website})
    on conflict (workspace_id, lower(name)) do update set updated_at = biz_vendors.updated_at
    returning id`;
  return row.id;
}

function costChanged(a: Record<string, unknown>, b: SubscriptionInput): boolean {
  return (
    (a.price_minor === null ? null : Number(a.price_minor)) !== b.priceMinor ||
    String(a.currency).trim() !== b.currency ||
    a.pricing_model !== b.pricingModel ||
    a.billing_interval !== b.billingInterval ||
    (a.custom_interval_count === null ? null : Number(a.custom_interval_count)) !== b.customIntervalCount ||
    a.custom_interval_unit !== b.customIntervalUnit ||
    (a.purchased_seats === null ? null : Number(a.purchased_seats)) !== b.purchasedSeats
  );
}

async function insertCostHistory(sql: Db, ctx: BizContext, subscriptionId: string, i: SubscriptionInput, effectiveFrom: string, reason: string) {
  await sql`
    insert into biz_cost_history (workspace_id, subscription_id, price_minor, currency, pricing_model, billing_interval,
      custom_interval_count, custom_interval_unit, purchased_seats, effective_from, reason, recorded_by)
    values (${ctx.workspace.id}, ${subscriptionId}, ${i.priceMinor}, ${i.currency}, ${i.pricingModel}, ${i.billingInterval},
      ${i.customIntervalCount}, ${i.customIntervalUnit}, ${i.purchasedSeats}, ${effectiveFrom}, ${reason}, ${ctx.user.id})`;
}

async function loadSoftwareRow(sql: Db, ws: string, id: string, lock = false) {
  const [row] = lock
    ? await sql`select * from biz_software where workspace_id = ${ws} and id = ${id} for update`
    : await sql`select * from biz_software where workspace_id = ${ws} and id = ${id}`;
  if (!row) throw new BizError("not_found", "That software record wasn't found in this workspace.");
  return row;
}

async function loadSubscriptionRow(sql: Db, ws: string, id: string) {
  const [row] = await sql`
    select s.*, sw.owner_person_id as sw_owner_person_id, sw.name as software_name
    from biz_subscriptions s join biz_software sw on sw.workspace_id = s.workspace_id and sw.id = s.software_id
    where s.workspace_id = ${ws} and s.id = ${id} for update of s`;
  if (!row) throw new BizError("not_found", "That subscription wasn't found in this workspace.");
  return row;
}

function assertEdit(ctx: BizContext, ownerPersonId: string | null) {
  if (!canEditRecord(ctx.role, { ownerPersonId }, ctx.personId)) throw new BizError("forbidden", "Your role can only change records you own.");
}

// ─── Software ───────────────────────────────────────────────────────────────

export async function createSoftware(sql: Db, ctx: BizContext, input: SoftwareInput): Promise<string> {
  assertCan(ctx, "records.manage");
  const ws = ctx.workspace.id;
  await checkRefs(sql, ws, { people: [input.ownerPersonId], departments: [input.departmentId] });
  const [dupe] = await sql`select id from biz_software where workspace_id = ${ws} and lower(name) = lower(${input.name}) and status <> 'archived'`;
  if (dupe) throw new BizError("conflict", `${input.name} is already in your software inventory.`);
  const vendor = await vendorId(sql, ws, input.vendorName, null);
  const catalog = matchCatalogProduct(input.name, input.website);
  const [row] = await sql`
    insert into biz_software (workspace_id, vendor_id, name, category, description, business_purpose, website, owner_person_id,
      department_id, status, notes, catalog_product_id, created_by)
    values (${ws}, ${vendor}, ${input.name}, ${input.category}, ${input.description}, ${input.businessPurpose}, ${input.website},
      ${input.ownerPersonId}, ${input.departmentId}, ${input.status}, ${input.notes}, ${catalog?.id ?? null}, ${ctx.user.id})
    returning id`;
  await logActivity(sql, ctx, { action: "software.created", entityType: "software", entityId: row.id, summary: `Added ${input.name} to the software inventory (${categoryLabels[input.category]})` });
  return row.id;
}

export async function updateSoftware(ctx: BizContext, id: string, input: SoftwareInput): Promise<void> {
  const ws = ctx.workspace.id;
  await db().begin(async (sql) => {
    const before = await loadSoftwareRow(sql, ws, id, true);
    assertEdit(ctx, before.owner_person_id);
    if (before.status === "archived") throw new BizError("invalid", "Restore this software before editing it.");
    await checkRefs(sql, ws, { people: [input.ownerPersonId], departments: [input.departmentId] });
    const vendor = await vendorId(sql, ws, input.vendorName, null);
    const catalog = before.name === input.name && before.website === input.website ? before.catalog_product_id : (matchCatalogProduct(input.name, input.website)?.id ?? null);
    await sql`
      update biz_software set vendor_id = ${vendor}, name = ${input.name}, category = ${input.category}, description = ${input.description},
        business_purpose = ${input.businessPurpose}, website = ${input.website}, owner_person_id = ${input.ownerPersonId},
        department_id = ${input.departmentId}, status = ${input.status}, notes = ${input.notes}, catalog_product_id = ${catalog}, updated_at = now()
      where workspace_id = ${ws} and id = ${id}`;
    const changes = [
      before.name !== input.name && `renamed to ${input.name}`,
      before.status !== input.status && `status ${before.status} → ${input.status}`,
      before.owner_person_id !== input.ownerPersonId && "owner changed",
      before.department_id !== input.departmentId && "department changed",
      before.category !== input.category && `category → ${categoryLabels[input.category]}`,
    ].filter(Boolean);
    await logActivity(sql, ctx, { action: "software.updated", entityType: "software", entityId: id, summary: `Updated ${input.name}${changes.length ? `: ${changes.join(", ")}` : ""}` });
  });
}

/** Archive (or restore) a software record. Archiving needs its subscriptions archived, cancelled or expired first. */
export async function setSoftwareArchived(ctx: BizContext, id: string, archived: boolean): Promise<void> {
  const ws = ctx.workspace.id;
  await db().begin(async (sql) => {
    const row = await loadSoftwareRow(sql, ws, id, true);
    assertEdit(ctx, row.owner_person_id);
    if (archived) {
      const [live] = await sql`
        select count(*)::int as n from biz_subscriptions
        where workspace_id = ${ws} and software_id = ${id} and archived_at is null and status in ('active', 'trial', 'paused')`;
      if (live.n > 0) throw new BizError("invalid", `Archive or cancel ${row.name}'s ${live.n === 1 ? "subscription" : `${live.n} subscriptions`} first.`);
      await sql`update biz_software set status = 'archived', updated_at = now() where workspace_id = ${ws} and id = ${id}`;
    } else {
      const [dupe] = await sql`select id from biz_software where workspace_id = ${ws} and lower(name) = lower(${row.name}) and status <> 'archived' and id <> ${id}`;
      if (dupe) throw new BizError("conflict", `Another active record is already called ${row.name}.`);
      await sql`update biz_software set status = 'active', updated_at = now() where workspace_id = ${ws} and id = ${id}`;
    }
    await logActivity(sql, ctx, { action: archived ? "software.archived" : "software.restored", entityType: "software", entityId: id, summary: `${archived ? "Archived" : "Restored"} ${row.name}` });
  });
}

// ─── Subscriptions ──────────────────────────────────────────────────────────

export interface CreateSubscriptionArgs {
  softwareId: string | null;
  newSoftware: SoftwareInput | null;
  input: SubscriptionInput;
  idempotencyKey: string;
  seatPersonIds: string[];
  /** Defaults to "manual" (entered in the app). */
  source?: "manual" | "csv_import" | "mcp" | "assistant";
  importJobId?: string | null;
}

/**
 * Creates a subscription (and, in the same transaction, a new software record
 * and seat assignments when given). Resubmitting the same form returns the
 * subscription created the first time instead of a duplicate.
 */
export async function createSubscription(ctx: BizContext, a: CreateSubscriptionArgs): Promise<{ id: string; softwareId: string; duplicate: boolean }> {
  assertCan(ctx, "records.manage");
  const ws = ctx.workspace.id;
  const [existing] = await db()`select id, software_id from biz_subscriptions where workspace_id = ${ws} and idempotency_key = ${a.idempotencyKey}`;
  if (existing) return { id: existing.id, softwareId: existing.software_id, duplicate: true };
  return db().begin((sql) => createSubscriptionIn(sql, ctx, a));
}

/** createSubscription inside a transaction the caller already holds (CSV import creates many in one). */
export async function createSubscriptionIn(sql: Db, ctx: BizContext, a: CreateSubscriptionArgs): Promise<{ id: string; softwareId: string; duplicate: boolean }> {
  assertCan(ctx, "records.manage");
  const ws = ctx.workspace.id;
  const i = a.input;
  if (a.seatPersonIds.length && i.purchasedSeats !== null && a.seatPersonIds.length > i.purchasedSeats)
    throw new BizError("invalid", `You assigned ${a.seatPersonIds.length} people but purchased ${i.purchasedSeats} seats.`);
  const source = a.source ?? "manual";
  // Entered or confirmed by a person; imported rows stay unverified until someone reviews them.
  const verifiedOn = source === "csv_import" ? null : ctx.today;
  let softwareId = a.softwareId;
  let softwareName: string;
  if (a.newSoftware) {
    softwareId = await createSoftware(sql, ctx, a.newSoftware);
    softwareName = a.newSoftware.name;
  } else {
    if (!softwareId) throw new BizError("invalid", "Choose the software this subscription is for.");
    const sw = await loadSoftwareRow(sql, ws, softwareId);
    if (sw.status === "archived") throw new BizError("invalid", "That software is archived. Restore it first.");
    softwareName = sw.name;
  }
  await checkRefs(sql, ws, { people: [i.ownerPersonId, ...a.seatPersonIds], departments: [i.departmentId] });
  const endedOn = i.status === "cancelled" || i.status === "expired" ? (i.endedOn ?? ctx.today) : null;
  const [row] = await sql`
    insert into biz_subscriptions (workspace_id, software_id, idempotency_key, plan_name, price_minor, currency, pricing_model,
      billing_interval, custom_interval_count, custom_interval_unit, start_date, next_renewal_date, auto_renew, cancellation_deadline,
      contract_end_date, status, ended_on, purchased_seats, reported_assigned_seats, payment_method, owner_person_id, department_id,
      contract_reference, contract_notes, notes, annual_price_option_minor, reminder_days, created_by, source, last_verified_on, import_job_id)
    values (${ws}, ${softwareId}, ${a.idempotencyKey}, ${i.planName}, ${i.priceMinor}, ${i.currency}, ${i.pricingModel},
      ${i.billingInterval}, ${i.customIntervalCount}, ${i.customIntervalUnit}, ${i.startDate}, ${i.nextRenewalDate}, ${i.autoRenew},
      ${i.cancellationDeadline}, ${i.contractEndDate}, ${i.status}, ${endedOn}, ${i.purchasedSeats}, ${i.reportedAssignedSeats},
      ${i.paymentMethod}, ${i.ownerPersonId}, ${i.departmentId}, ${i.contractReference}, ${i.contractNotes}, ${i.notes},
      ${i.annualPriceOptionMinor}, ${i.reminderDays}, ${ctx.user.id}, ${source}, ${verifiedOn}, ${a.importJobId ?? null})
    on conflict (idempotency_key) do nothing
    returning id`;
  if (!row) {
    // A concurrent submission of the same form won the race.
    const [dupe] = await sql`select id, software_id from biz_subscriptions where workspace_id = ${ws} and idempotency_key = ${a.idempotencyKey}`;
    if (!dupe) throw new BizError("conflict", "This form was already used. Reload the page and try again.");
    return { id: dupe.id, softwareId: dupe.software_id, duplicate: true };
  }
  await insertCostHistory(sql, ctx, row.id, i, i.startDate ?? ctx.today, "Subscription added");
  for (const personId of a.seatPersonIds) {
    await sql`insert into biz_seat_assignments (workspace_id, subscription_id, person_id, assigned_by) values (${ws}, ${row.id}, ${personId}, ${ctx.user.id})`;
  }
  await logActivity(sql, ctx, {
    action: "subscription.created",
    entityType: "subscription",
    entityId: row.id,
    summary: `Added a ${i.billingInterval === "custom" ? "custom" : i.billingInterval} subscription for ${softwareName}${i.planName ? ` (${i.planName})` : ""}${source === "mcp" ? " via an AI client (MCP)" : source === "assistant" ? " via the AI assistant" : ""}`,
    details: { softwareId, seats: a.seatPersonIds.length, source },
  });
  if (a.seatPersonIds.length) {
    await logActivity(sql, ctx, { action: "seats.assigned", entityType: "subscription", entityId: row.id, summary: `Assigned ${a.seatPersonIds.length} ${softwareName} seat${a.seatPersonIds.length === 1 ? "" : "s"}` });
  }
  return { id: row.id, softwareId: softwareId!, duplicate: false };
}

export async function updateSubscription(ctx: BizContext, id: string, i: SubscriptionInput): Promise<void> {
  const ws = ctx.workspace.id;
  await db().begin(async (sql) => {
    const before = await loadSubscriptionRow(sql, ws, id);
    assertEdit(ctx, before.owner_person_id ?? before.sw_owner_person_id);
    if (before.archived_at) throw new BizError("invalid", "Restore this subscription before editing it.");
    await checkRefs(sql, ws, { people: [i.ownerPersonId], departments: [i.departmentId] });
    const [{ n: named }] = await sql`select count(*)::int as n from biz_seat_assignments where subscription_id = ${id} and released_at is null`;
    if (i.purchasedSeats !== null && named > i.purchasedSeats)
      throw new BizError("invalid", `${named} seats are assigned to people. Release some on the Licenses page before reducing purchased seats to ${i.purchasedSeats}.`);
    const ending = i.status === "cancelled" || i.status === "expired";
    const endedOn = ending ? (i.endedOn ?? before.ended_on ?? ctx.today) : null;
    await sql`
      update biz_subscriptions set plan_name = ${i.planName}, price_minor = ${i.priceMinor}, currency = ${i.currency}, pricing_model = ${i.pricingModel},
        billing_interval = ${i.billingInterval}, custom_interval_count = ${i.customIntervalCount}, custom_interval_unit = ${i.customIntervalUnit},
        start_date = ${i.startDate}, next_renewal_date = ${i.nextRenewalDate}, auto_renew = ${i.autoRenew}, cancellation_deadline = ${i.cancellationDeadline},
        contract_end_date = ${i.contractEndDate}, status = ${i.status}, ended_on = ${endedOn}, purchased_seats = ${i.purchasedSeats},
        reported_assigned_seats = ${i.reportedAssignedSeats}, payment_method = ${i.paymentMethod}, owner_person_id = ${i.ownerPersonId},
        department_id = ${i.departmentId}, contract_reference = ${i.contractReference}, contract_notes = ${i.contractNotes}, notes = ${i.notes},
        annual_price_option_minor = ${i.annualPriceOptionMinor}, reminder_days = ${i.reminderDays}, last_verified_on = ${ctx.today}, updated_at = now()
      where workspace_id = ${ws} and id = ${id}`;
    const changes: string[] = [];
    if (costChanged(before, i)) {
      await insertCostHistory(sql, ctx, id, i, ctx.today, "Price or billing terms changed");
      changes.push("price or billing terms changed");
    }
    if (before.status !== i.status) changes.push(`status ${before.status} → ${i.status}`);
    if (before.next_renewal_date !== i.nextRenewalDate) changes.push(`renewal date → ${i.nextRenewalDate ?? "none"}`);
    if (before.owner_person_id !== i.ownerPersonId) changes.push("owner changed");
    await logActivity(sql, ctx, {
      action: "subscription.updated",
      entityType: "subscription",
      entityId: id,
      summary: `Updated the ${before.software_name} subscription${changes.length ? `: ${changes.join(", ")}` : ""}`,
    });
  });
}

/** Archives subscriptions (kept for history, left out of every total). Returns how many changed. */
export async function setSubscriptionsArchived(ctx: BizContext, ids: string[], archived: boolean): Promise<number> {
  const ws = ctx.workspace.id;
  if (ids.length === 0) return 0;
  return db().begin(async (sql) => {
    let changed = 0;
    for (const id of ids.slice(0, 200)) {
      const row = await loadSubscriptionRow(sql, ws, id);
      assertEdit(ctx, row.owner_person_id ?? row.sw_owner_person_id);
      if (Boolean(row.archived_at) === archived) continue;
      if (!archived) {
        const [sw] = await sql`select status from biz_software where workspace_id = ${ws} and id = ${row.software_id}`;
        if (sw?.status === "archived") throw new BizError("invalid", `Restore ${row.software_name} in the software inventory first.`);
      }
      await sql`update biz_subscriptions set archived_at = ${archived ? sql`now()` : null}, updated_at = now() where workspace_id = ${ws} and id = ${id}`;
      if (archived) await sql`update biz_seat_assignments set released_at = now(), released_by = ${ctx.user.id} where subscription_id = ${id} and released_at is null`;
      await logActivity(sql, ctx, {
        action: archived ? "subscription.archived" : "subscription.restored",
        entityType: "subscription",
        entityId: id,
        summary: `${archived ? "Archived" : "Restored"} the ${row.software_name} subscription${archived ? " (its seat assignments were released)" : ""}`,
      });
      changed++;
    }
    return changed;
  });
}

/** Sets the department and/or owner on several subscriptions at once. */
export async function bulkAssign(ctx: BizContext, ids: string[], patch: { departmentId?: string | null; ownerPersonId?: string | null }): Promise<number> {
  assertCan(ctx, "records.manage");
  const ws = ctx.workspace.id;
  if (ids.length === 0) return 0;
  return db().begin(async (sql) => {
    await checkRefs(sql, ws, { people: [patch.ownerPersonId ?? null], departments: [patch.departmentId ?? null] });
    const rows = await sql`select id from biz_subscriptions where workspace_id = ${ws} and id = any(${ids.slice(0, 200)}::uuid[]) and archived_at is null`;
    const found = rows.map((r) => r.id as string);
    if (found.length === 0) return 0;
    if (patch.departmentId !== undefined) await sql`update biz_subscriptions set department_id = ${patch.departmentId}, updated_at = now() where workspace_id = ${ws} and id = any(${found}::uuid[])`;
    if (patch.ownerPersonId !== undefined) await sql`update biz_subscriptions set owner_person_id = ${patch.ownerPersonId}, updated_at = now() where workspace_id = ${ws} and id = any(${found}::uuid[])`;
    await logActivity(sql, ctx, {
      action: "subscription.bulk_updated",
      entityType: "subscription",
      summary: `Updated ${patch.departmentId !== undefined ? "the department" : "the owner"} on ${found.length} subscription${found.length === 1 ? "" : "s"}`,
      details: { ids: found },
    });
    return found.length;
  });
}

// ─── Renewals and payments ──────────────────────────────────────────────────

export async function setRenewalDecision(ctx: BizContext, id: string, decision: "undecided" | "renew" | "renegotiate" | "cancel", ownerPersonId: string | null, notes: string | null): Promise<void> {
  const ws = ctx.workspace.id;
  await db().begin(async (sql) => {
    const row = await loadSubscriptionRow(sql, ws, id);
    assertEdit(ctx, row.owner_person_id ?? row.sw_owner_person_id);
    await checkRefs(sql, ws, { people: [ownerPersonId] });
    await sql`update biz_subscriptions set renewal_decision = ${decision}, renewal_owner_person_id = ${ownerPersonId}, renewal_notes = ${notes}, updated_at = now()
      where workspace_id = ${ws} and id = ${id}`;
    await logActivity(sql, ctx, { action: "renewal.decision", entityType: "subscription", entityId: id, summary: `Renewal decision for ${row.software_name}: ${decision}` });
  });
}

export interface RenewalOutcomeInput {
  outcome: "renewed" | "renegotiated" | "cancelled";
  amountMinor: number | null;
  recordPayment: boolean;
  paidOn: string | null;
  newRenewalDate: string | null;
  notes: string | null;
}

/**
 * Records what happened at the current renewal date. Renewed/renegotiated moves
 * the renewal date on by one period (or to the date given) and can record the
 * payment; renegotiated with a new amount also updates the price. Cancelled
 * ends the subscription. Each renewal date can only be recorded once.
 */
export async function recordRenewal(ctx: BizContext, id: string, o: RenewalOutcomeInput): Promise<void> {
  assertCan(ctx, "spend.manage", "Only owners, admins and finance can record renewal outcomes.");
  const ws = ctx.workspace.id;
  await db().begin(async (sql) => {
    const row = await loadSubscriptionRow(sql, ws, id);
    if (row.archived_at) throw new BizError("invalid", "This subscription is archived.");
    const renewalDate: string | null = row.next_renewal_date;
    if (!renewalDate) throw new BizError("invalid", "Add the next renewal date first.");
    const [done] = await sql`select id from biz_renewal_events where subscription_id = ${id} and renewal_date = ${renewalDate}`;
    if (done) throw new BizError("conflict", "This renewal was already recorded.");
    const currency = String(row.currency).trim();
    const terms = { billingInterval: row.billing_interval, customIntervalCount: row.custom_interval_count === null ? null : Number(row.custom_interval_count), customIntervalUnit: row.custom_interval_unit };
    let paymentId: string | null = null;
    if (o.outcome !== "cancelled" && o.recordPayment) {
      if (o.amountMinor === null) throw new BizError("invalid", "Enter the amount paid to record the payment.");
      const [p] = await sql`
        insert into biz_payments (workspace_id, subscription_id, amount_minor, currency, paid_on, source, notes, created_by)
        values (${ws}, ${id}, ${o.amountMinor}, ${currency}, ${o.paidOn ?? renewalDate}, 'renewal', ${`Renewal of ${renewalDate}`}, ${ctx.user.id})
        returning id`;
      paymentId = p.id;
    }
    const next = o.outcome === "cancelled" ? null : (o.newRenewalDate ?? nextPeriodDate(renewalDate, terms));
    if (next && next <= renewalDate) throw new BizError("invalid", "The new renewal date must be after the current one.");
    await sql`
      insert into biz_renewal_events (workspace_id, subscription_id, renewal_date, outcome, amount_minor, currency, new_renewal_date, payment_id, notes, decided_by)
      values (${ws}, ${id}, ${renewalDate}, ${o.outcome}, ${o.amountMinor}, ${currency}, ${next}, ${paymentId}, ${o.notes}, ${ctx.user.id})`;
    if (o.outcome === "cancelled") {
      await sql`update biz_subscriptions set status = 'cancelled', ended_on = ${renewalDate}, auto_renew = false, renewal_decision = 'undecided', updated_at = now()
        where workspace_id = ${ws} and id = ${id}`;
    } else {
      const priceChanged = o.outcome === "renegotiated" && o.amountMinor !== null && o.amountMinor !== (row.price_minor === null ? null : Number(row.price_minor));
      await sql`update biz_subscriptions set next_renewal_date = ${next}, renewal_decision = 'undecided',
          cancellation_deadline = null, price_minor = ${priceChanged ? o.amountMinor : row.price_minor},
          status = case when status = 'trial' then 'active' else status end, updated_at = now()
        where workspace_id = ${ws} and id = ${id}`;
      if (priceChanged) {
        await sql`
          insert into biz_cost_history (workspace_id, subscription_id, price_minor, currency, pricing_model, billing_interval,
            custom_interval_count, custom_interval_unit, purchased_seats, effective_from, reason, recorded_by)
          values (${ws}, ${id}, ${o.amountMinor}, ${currency}, ${row.pricing_model}, ${row.billing_interval}, ${row.custom_interval_count},
            ${row.custom_interval_unit}, ${row.purchased_seats}, ${renewalDate}, 'Renegotiated at renewal', ${ctx.user.id})`;
      }
    }
    await logActivity(sql, ctx, {
      action: `renewal.${o.outcome}`,
      entityType: "subscription",
      entityId: id,
      summary:
        o.outcome === "cancelled"
          ? `Cancelled ${row.software_name} at its ${renewalDate} renewal`
          : `${o.outcome === "renewed" ? "Renewed" : "Renegotiated"} ${row.software_name}; next renewal ${next}${paymentId ? " (payment recorded)" : ""}`,
    });
  });
}

export interface PaymentInput {
  amountMinor: number;
  paidOn: string;
  reference: string | null;
  notes: string | null;
}

export async function addPayment(ctx: BizContext, subscriptionId: string, p: PaymentInput): Promise<void> {
  assertCan(ctx, "spend.manage", "Only owners, admins and finance can record payments.");
  const ws = ctx.workspace.id;
  await db().begin(async (sql) => {
    const row = await loadSubscriptionRow(sql, ws, subscriptionId);
    await sql`
      insert into biz_payments (workspace_id, subscription_id, amount_minor, currency, paid_on, reference, notes, source, created_by)
      values (${ws}, ${subscriptionId}, ${p.amountMinor}, ${String(row.currency).trim()}, ${p.paidOn}, ${p.reference}, ${p.notes}, 'manual', ${ctx.user.id})`;
    await logActivity(sql, ctx, { action: "payment.recorded", entityType: "subscription", entityId: subscriptionId, summary: `Recorded a ${row.software_name} payment on ${p.paidOn}` });
  });
}

export async function deletePayment(ctx: BizContext, paymentId: string): Promise<void> {
  assertCan(ctx, "spend.manage", "Only owners, admins and finance can remove payments.");
  const ws = ctx.workspace.id;
  await db().begin(async (sql) => {
    const [p] = await sql`
      delete from biz_payments where workspace_id = ${ws} and id = ${paymentId}
      returning subscription_id, paid_on`;
    if (!p) throw new BizError("not_found", "That payment wasn't found.");
    await logActivity(sql, ctx, { action: "payment.deleted", entityType: "subscription", entityId: p.subscription_id, summary: `Removed the payment recorded for ${p.paid_on}` });
  });
}

