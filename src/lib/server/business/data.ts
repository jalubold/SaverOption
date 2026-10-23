import { cache } from "react";
import type { SubscriptionCalc } from "@/lib/business/calc";
import type {
  BillingInterval,
  IntervalUnit,
  OpportunityStatus,
  OpportunityType,
  PricingModel,
  RenewalDecision,
  RenewalOutcome,
  Role,
  SoftwareCategory,
  SoftwareStatus,
  SubscriptionStatus,
} from "@/lib/business/constants";
import { db } from "@/lib/server/db";
import type { BizContext } from "@/lib/server/business/context";

/**
 * Read queries for the business app. Every query is filtered by the caller's
 * workspace id; ids from the URL or a form are only ever looked up within it,
 * so another workspace's records read as "not found".
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
const num = (v: any): number | null => (v === null || v === undefined ? null : Number(v));

export interface Department {
  id: string;
  name: string;
  archivedAt: Date | null;
}

export interface Person {
  id: string;
  name: string;
  email: string | null;
  title: string | null;
  departmentId: string | null;
  departmentName: string | null;
  userId: string | null;
  status: "active" | "inactive";
}

export interface Vendor {
  id: string;
  name: string;
  website: string | null;
}

export interface Software {
  id: string;
  name: string;
  vendorId: string | null;
  vendorName: string | null;
  category: SoftwareCategory;
  description: string | null;
  businessPurpose: string | null;
  website: string | null;
  ownerPersonId: string | null;
  ownerName: string | null;
  departmentId: string | null;
  departmentName: string | null;
  status: SoftwareStatus;
  notes: string | null;
  catalogProductId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription extends SubscriptionCalc {
  softwareId: string;
  softwareName: string;
  softwareStatus: SoftwareStatus;
  category: SoftwareCategory;
  vendorId: string | null;
  vendorName: string | null;
  planName: string | null;
  startDate: string | null;
  contractEndDate: string | null;
  endedOn: string | null;
  autoRenew: boolean;
  cancellationDeadline: string | null;
  paymentMethod: string | null;
  /** Owner and department of the subscription, or else of its software. */
  ownerPersonId: string | null;
  ownerName: string | null;
  departmentId: string | null;
  departmentName: string | null;
  ownSubscriptionOwner: boolean;
  ownSubscriptionDepartment: boolean;
  contractReference: string | null;
  contractNotes: string | null;
  notes: string | null;
  annualPriceOptionMinor: number | null;
  reminderDays: number[] | null;
  renewalDecision: RenewalDecision;
  renewalOwnerPersonId: string | null;
  renewalOwnerName: string | null;
  renewalNotes: string | null;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  /** created_at as a calendar date. */
  createdOn: string;
}

function mapSubscription(r: any): Subscription {
  return {
    id: r.id,
    softwareId: r.software_id,
    softwareName: r.software_name,
    softwareStatus: r.software_status,
    category: r.software_category,
    vendorId: r.vendor_id,
    vendorName: r.vendor_name,
    planName: r.plan_name,
    priceMinor: num(r.price_minor),
    currency: r.currency.trim(),
    pricingModel: r.pricing_model as PricingModel,
    billingInterval: r.billing_interval as BillingInterval,
    customIntervalCount: num(r.custom_interval_count),
    customIntervalUnit: r.custom_interval_unit as IntervalUnit | null,
    purchasedSeats: num(r.purchased_seats),
    reportedAssignedSeats: num(r.reported_assigned_seats),
    namedSeats: Number(r.named_seats ?? 0),
    status: r.status as SubscriptionStatus,
    archived: r.archived_at !== null,
    startDate: r.start_date,
    nextRenewalDate: r.next_renewal_date,
    contractEndDate: r.contract_end_date,
    endedOn: r.ended_on,
    autoRenew: r.auto_renew,
    cancellationDeadline: r.cancellation_deadline,
    paymentMethod: r.payment_method,
    ownerPersonId: r.owner_person_id ?? r.sw_owner_person_id,
    ownerName: r.owner_name ?? r.sw_owner_name,
    departmentId: r.department_id ?? r.sw_department_id,
    departmentName: r.department_name ?? r.sw_department_name,
    ownSubscriptionOwner: r.owner_person_id !== null,
    ownSubscriptionDepartment: r.department_id !== null,
    contractReference: r.contract_reference,
    contractNotes: r.contract_notes,
    notes: r.notes,
    annualPriceOptionMinor: num(r.annual_price_option_minor),
    reminderDays: r.reminder_days ? r.reminder_days.map(Number) : null,
    renewalDecision: r.renewal_decision,
    renewalOwnerPersonId: r.renewal_owner_person_id,
    renewalOwnerName: r.renewal_owner_name,
    renewalNotes: r.renewal_notes,
    archivedAt: r.archived_at,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    createdOn: r.created_on,
  };
}

function mapSoftware(r: any): Software {
  return {
    id: r.id,
    name: r.name,
    vendorId: r.vendor_id,
    vendorName: r.vendor_name,
    category: r.category,
    description: r.description,
    businessPurpose: r.business_purpose,
    website: r.website,
    ownerPersonId: r.owner_person_id,
    ownerName: r.owner_name,
    departmentId: r.department_id,
    departmentName: r.department_name,
    status: r.status,
    notes: r.notes,
    catalogProductId: r.catalog_product_id,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

const subscriptionSelect = (ws: string) => db()`
  select s.*, s.created_at::date::text as created_on,
    sw.name as software_name, sw.category as software_category, sw.status as software_status, sw.vendor_id,
    v.name as vendor_name,
    op.name as owner_name, d.name as department_name, rp.name as renewal_owner_name,
    sw.owner_person_id as sw_owner_person_id, swo.name as sw_owner_name,
    sw.department_id as sw_department_id, swd.name as sw_department_name,
    (select count(*) from biz_seat_assignments a where a.subscription_id = s.id and a.released_at is null)::int as named_seats
  from biz_subscriptions s
  join biz_software sw on sw.workspace_id = s.workspace_id and sw.id = s.software_id
  left join biz_vendors v on v.workspace_id = s.workspace_id and v.id = sw.vendor_id
  left join biz_people op on op.workspace_id = s.workspace_id and op.id = s.owner_person_id
  left join biz_departments d on d.workspace_id = s.workspace_id and d.id = s.department_id
  left join biz_people rp on rp.workspace_id = s.workspace_id and rp.id = s.renewal_owner_person_id
  left join biz_people swo on swo.workspace_id = s.workspace_id and swo.id = sw.owner_person_id
  left join biz_departments swd on swd.workspace_id = s.workspace_id and swd.id = sw.department_id
  where s.workspace_id = ${ws}
  order by lower(sw.name), s.created_at`;

/** All subscriptions in the workspace (archived included; filter with `archived`). */
export const getSubscriptions = cache(async (workspaceId: string): Promise<Subscription[]> => {
  const rows = await subscriptionSelect(workspaceId);
  return rows.map(mapSubscription);
});

export async function getSubscription(ctx: BizContext, id: string): Promise<Subscription | null> {
  return (await getSubscriptions(ctx.workspace.id)).find((s) => s.id === id) ?? null;
}

const softwareSelect = (ws: string) => db()`
  select sw.*, v.name as vendor_name, p.name as owner_name, d.name as department_name
  from biz_software sw
  left join biz_vendors v on v.workspace_id = sw.workspace_id and v.id = sw.vendor_id
  left join biz_people p on p.workspace_id = sw.workspace_id and p.id = sw.owner_person_id
  left join biz_departments d on d.workspace_id = sw.workspace_id and d.id = sw.department_id
  where sw.workspace_id = ${ws}
  order by lower(sw.name)`;

export const getSoftwareList = cache(async (workspaceId: string): Promise<Software[]> => (await softwareSelect(workspaceId)).map(mapSoftware));

export async function getSoftware(ctx: BizContext, id: string): Promise<Software | null> {
  return (await getSoftwareList(ctx.workspace.id)).find((s) => s.id === id) ?? null;
}

export const getDepartments = cache(async (workspaceId: string): Promise<Department[]> => {
  const rows = await db()`select id, name, archived_at from biz_departments where workspace_id = ${workspaceId} order by archived_at nulls first, lower(name)`;
  return rows.map((r) => ({ id: r.id, name: r.name, archivedAt: r.archived_at }));
});

export const getPeople = cache(async (workspaceId: string): Promise<Person[]> => {
  const rows = await db()`
    select p.*, d.name as department_name from biz_people p
    left join biz_departments d on d.workspace_id = p.workspace_id and d.id = p.department_id
    where p.workspace_id = ${workspaceId} order by p.status, lower(p.name)`;
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    title: r.title,
    departmentId: r.department_id,
    departmentName: r.department_name,
    userId: r.user_id,
    status: r.status,
  }));
});

export const getVendors = cache(async (workspaceId: string): Promise<Vendor[]> => {
  const rows = await db()`select id, name, website from biz_vendors where workspace_id = ${workspaceId} order by lower(name)`;
  return rows.map((r) => ({ id: r.id, name: r.name, website: r.website }));
});

export interface SeatAssignment {
  id: string;
  subscriptionId: string;
  personId: string;
  personName: string;
  personEmail: string | null;
  departmentName: string | null;
  note: string | null;
  assignedAt: Date;
  releasedAt: Date | null;
}

export const getSeatAssignments = cache(async (workspaceId: string): Promise<SeatAssignment[]> => {
  const rows = await db()`
    select a.*, p.name as person_name, p.email as person_email, d.name as department_name
    from biz_seat_assignments a
    join biz_people p on p.workspace_id = a.workspace_id and p.id = a.person_id
    left join biz_departments d on d.workspace_id = p.workspace_id and d.id = p.department_id
    where a.workspace_id = ${workspaceId}
    order by a.released_at nulls first, lower(p.name)`;
  return rows.map((r) => ({
    id: r.id,
    subscriptionId: r.subscription_id,
    personId: r.person_id,
    personName: r.person_name,
    personEmail: r.person_email,
    departmentName: r.department_name,
    note: r.note,
    assignedAt: r.assigned_at,
    releasedAt: r.released_at,
  }));
});

export interface CostHistoryEntry {
  id: string;
  subscriptionId: string;
  priceMinor: number | null;
  currency: string;
  pricingModel: PricingModel;
  billingInterval: BillingInterval;
  customIntervalCount: number | null;
  customIntervalUnit: IntervalUnit | null;
  purchasedSeats: number | null;
  effectiveFrom: string;
  reason: string | null;
  recordedAt: Date;
}

export const getCostHistory = cache(async (workspaceId: string): Promise<CostHistoryEntry[]> => {
  const rows = await db()`select * from biz_cost_history where workspace_id = ${workspaceId} order by subscription_id, effective_from, recorded_at`;
  return rows.map((r) => ({
    id: r.id,
    subscriptionId: r.subscription_id,
    priceMinor: num(r.price_minor),
    currency: r.currency.trim(),
    pricingModel: r.pricing_model,
    billingInterval: r.billing_interval,
    customIntervalCount: num(r.custom_interval_count),
    customIntervalUnit: r.custom_interval_unit,
    purchasedSeats: num(r.purchased_seats),
    effectiveFrom: r.effective_from,
    reason: r.reason,
    recordedAt: r.recorded_at,
  }));
});

export interface Payment {
  id: string;
  subscriptionId: string;
  softwareName: string;
  amountMinor: number;
  currency: string;
  paidOn: string;
  reference: string | null;
  notes: string | null;
  source: "manual" | "renewal";
  createdAt: Date;
}

export const getPayments = cache(async (workspaceId: string): Promise<Payment[]> => {
  const rows = await db()`
    select p.*, sw.name as software_name from biz_payments p
    join biz_subscriptions s on s.workspace_id = p.workspace_id and s.id = p.subscription_id
    join biz_software sw on sw.workspace_id = s.workspace_id and sw.id = s.software_id
    where p.workspace_id = ${workspaceId} order by p.paid_on desc, p.created_at desc`;
  return rows.map((r) => ({
    id: r.id,
    subscriptionId: r.subscription_id,
    softwareName: r.software_name,
    amountMinor: Number(r.amount_minor),
    currency: r.currency.trim(),
    paidOn: r.paid_on,
    reference: r.reference,
    notes: r.notes,
    source: r.source,
    createdAt: r.created_at,
  }));
});

export interface RenewalEvent {
  id: string;
  subscriptionId: string;
  softwareName: string;
  renewalDate: string;
  outcome: RenewalOutcome;
  amountMinor: number | null;
  currency: string;
  newRenewalDate: string | null;
  notes: string | null;
  createdAt: Date;
}

export const getRenewalEvents = cache(async (workspaceId: string): Promise<RenewalEvent[]> => {
  const rows = await db()`
    select e.*, sw.name as software_name from biz_renewal_events e
    join biz_subscriptions s on s.workspace_id = e.workspace_id and s.id = e.subscription_id
    join biz_software sw on sw.workspace_id = s.workspace_id and sw.id = s.software_id
    where e.workspace_id = ${workspaceId} order by e.renewal_date desc, e.created_at desc`;
  return rows.map((r) => ({
    id: r.id,
    subscriptionId: r.subscription_id,
    softwareName: r.software_name,
    renewalDate: r.renewal_date,
    outcome: r.outcome,
    amountMinor: num(r.amount_minor),
    currency: r.currency.trim(),
    newRenewalDate: r.new_renewal_date,
    notes: r.notes,
    createdAt: r.created_at,
  }));
});

export interface ActivityItem {
  id: number;
  actorName: string | null;
  action: string;
  entityType: string | null;
  entityId: string | null;
  summary: string;
  createdAt: Date;
}

export async function getActivity(workspaceId: string, opts: { entityIds?: string[]; limit?: number } = {}): Promise<ActivityItem[]> {
  const limit = Math.min(opts.limit ?? 20, 200);
  const rows = opts.entityIds?.length
    ? await db()`select * from biz_activity where workspace_id = ${workspaceId} and entity_id = any(${opts.entityIds}::uuid[]) order by created_at desc limit ${limit}`
    : await db()`select * from biz_activity where workspace_id = ${workspaceId} order by created_at desc limit ${limit}`;
  return rows.map((r) => ({
    id: Number(r.id),
    actorName: r.actor_name,
    action: r.action,
    entityType: r.entity_type,
    entityId: r.entity_id,
    summary: r.summary,
    createdAt: r.created_at,
  }));
}

export interface Opportunity {
  id: string;
  ruleKey: string;
  type: OpportunityType;
  subscriptionId: string | null;
  softwareId: string | null;
  title: string;
  explanation: string;
  evidence: { label: string; value: string }[];
  estMonthlyMinor: number | null;
  currency: string | null;
  confidence: "low" | "medium" | "high";
  recommendedAction: string;
  dealSlug: string | null;
  status: OpportunityStatus;
  decision: string | null;
  reviewedAt: Date | null;
  lastDetectedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export function mapOpportunity(r: any): Opportunity {
  return {
    id: r.id,
    ruleKey: r.rule_key,
    type: r.type,
    subscriptionId: r.subscription_id,
    softwareId: r.software_id,
    title: r.title,
    explanation: r.explanation,
    evidence: Array.isArray(r.evidence) ? r.evidence : [],
    estMonthlyMinor: num(r.est_monthly_minor),
    currency: r.currency?.trim() ?? null,
    confidence: r.confidence,
    recommendedAction: r.recommended_action,
    dealSlug: r.deal_slug,
    status: r.status,
    decision: r.decision,
    reviewedAt: r.reviewed_at,
    lastDetectedAt: r.last_detected_at,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export async function getOpportunities(workspaceId: string): Promise<Opportunity[]> {
  const rows = await db()`select * from biz_savings_opportunities where workspace_id = ${workspaceId} order by created_at desc`;
  return rows.map(mapOpportunity);
}

export interface RealizedSavingRow {
  id: string;
  opportunityId: string | null;
  subscriptionId: string | null;
  amountMinor: number;
  currency: string;
  recurrence: "one_time" | "monthly" | "yearly";
  description: string;
  evidence: string | null;
  confirmedOn: string;
  createdAt: Date;
}

export const getRealizedSavings = cache(async (workspaceId: string): Promise<RealizedSavingRow[]> => {
  const rows = await db()`select * from biz_realized_savings where workspace_id = ${workspaceId} order by confirmed_on desc, created_at desc`;
  return rows.map((r) => ({
    id: r.id,
    opportunityId: r.opportunity_id,
    subscriptionId: r.subscription_id,
    amountMinor: Number(r.amount_minor),
    currency: r.currency.trim(),
    recurrence: r.recurrence,
    description: r.description,
    evidence: r.evidence,
    confirmedOn: r.confirmed_on,
    createdAt: r.created_at,
  }));
});

export interface Member {
  id: string;
  userId: string;
  role: Role;
  personId: string | null;
  name: string | null;
  email: string | null;
  createdAt: Date;
}

export async function getMembers(workspaceId: string): Promise<Member[]> {
  const rows = await db()`
    select m.id, m.user_id, m.role, m.person_id, m.created_at, p.name, coalesce(p.email, u.email) as email
    from biz_memberships m
    left join biz_people p on p.workspace_id = m.workspace_id and p.id = m.person_id
    left join auth.users u on u.id = m.user_id
    where m.workspace_id = ${workspaceId}
    order by case m.role when 'owner' then 0 when 'admin' then 1 when 'finance' then 2 when 'member' then 3 else 4 end, m.created_at`;
  return rows.map((r) => ({ id: r.id, userId: r.user_id, role: r.role, personId: r.person_id, name: r.name, email: r.email, createdAt: r.created_at }));
}

export interface Invitation {
  id: string;
  email: string;
  role: Role;
  createdAt: Date;
}

export async function getOpenInvitations(workspaceId: string): Promise<Invitation[]> {
  const rows = await db()`
    select id, email, role, created_at from biz_invitations
    where workspace_id = ${workspaceId} and accepted_at is null and revoked_at is null order by created_at desc`;
  return rows.map((r) => ({ id: r.id, email: r.email, role: r.role, createdAt: r.created_at }));
}

/** Invitations waiting for a signed-in user (matched on their verified Google email). */
export async function getInvitationsForEmail(email: string): Promise<(Invitation & { workspaceId: string; workspaceName: string })[]> {
  const rows = await db()`
    select i.id, i.email, i.role, i.created_at, i.workspace_id, w.name as workspace_name
    from biz_invitations i join biz_workspaces w on w.id = i.workspace_id
    where i.email = ${email.toLowerCase()} and i.accepted_at is null and i.revoked_at is null
    order by i.created_at desc`;
  return rows.map((r) => ({ id: r.id, email: r.email, role: r.role, createdAt: r.created_at, workspaceId: r.workspace_id, workspaceName: r.workspace_name }));
}

export interface NotificationItem {
  id: string;
  kind: string;
  title: string;
  body: string | null;
  link: string | null;
  readAt: Date | null;
  createdAt: Date;
}

export async function getNotifications(ctx: BizContext, limit = 50): Promise<NotificationItem[]> {
  const rows = await db()`
    select id, kind, title, body, link, read_at, created_at from biz_notifications
    where workspace_id = ${ctx.workspace.id} and user_id = ${ctx.user.id}
    order by created_at desc limit ${limit}`;
  return rows.map((r) => ({ id: r.id, kind: r.kind, title: r.title, body: r.body, link: r.link, readAt: r.read_at, createdAt: r.created_at }));
}

export const getUnreadCount = cache(async (workspaceId: string, userId: string): Promise<number> => {
  const [r] = await db()`select count(*)::int as n from biz_notifications where workspace_id = ${workspaceId} and user_id = ${userId} and read_at is null`;
  return r?.n ?? 0;
});
