import { OPPORTUNITY_STATUSES, type OpportunityStatus } from "@/lib/business/constants";
import { findSavings, type Finding } from "@/lib/business/savings";
import { db } from "@/lib/server/db";
import { assertCan, BizError, logActivity, type BizContext } from "@/lib/server/business/context";
import { alternativesFor, dealsForSoftware } from "@/lib/server/business/catalog-match";
import { getOpportunities, getSoftwareList, getSubscriptions, mapOpportunity, type Opportunity } from "@/lib/server/business/data";

/**
 * Runs the savings rules against the workspace's current data and stores the
 * findings: new ones are added, changed ones updated, and ones the rules no
 * longer find are marked "resolved". People's decisions (reviewed, dismissed,
 * actioned) are kept; a resolved finding that comes back reopens.
 */
export async function refreshSavings(ctx: BizContext): Promise<Opportunity[]> {
  const ws = ctx.workspace.id;
  const [subs, software] = await Promise.all([getSubscriptions(ws), getSoftwareList(ws)]);
  const liveSoftware = software.filter((s) => s.status !== "archived");
  const findings = findSavings({
    today: ctx.today,
    dateFormat: ctx.workspace.dateFormat,
    subscriptions: subs.filter((s) => !s.archived),
    software: software.map((s) => ({ id: s.id, name: s.name, category: s.category, status: s.status })),
    deals: await dealsForSoftware(liveSoftware),
    alternatives: liveSoftware.flatMap((s) => alternativesFor(s)),
  });

  const existing = new Map((await getOpportunities(ws)).map((o) => [o.ruleKey, o]));
  const seen = new Set<string>();
  const signature = (f: Pick<Finding, "title" | "explanation" | "evidence" | "estMonthlyMinor" | "currency" | "confidence" | "recommendedAction" | "subscriptionId" | "softwareId" | "dealSlug">) =>
    JSON.stringify([f.title, f.explanation, f.evidence, f.estMonthlyMinor, f.currency, f.confidence, f.recommendedAction, f.subscriptionId, f.softwareId, f.dealSlug]);

  for (const f of findings) {
    seen.add(f.ruleKey);
    const prev = existing.get(f.ruleKey);
    if (!prev) {
      await db()`
        insert into biz_savings_opportunities (workspace_id, rule_key, type, subscription_id, software_id, title, explanation, evidence,
          est_monthly_minor, currency, confidence, recommended_action, deal_slug)
        values (${ws}, ${f.ruleKey}, ${f.type}, ${f.subscriptionId}, ${f.softwareId}, ${f.title}, ${f.explanation}, ${db().json(f.evidence)},
          ${f.estMonthlyMinor}, ${f.currency}, ${f.confidence}, ${f.recommendedAction}, ${f.dealSlug})
        on conflict (workspace_id, rule_key) do nothing`;
      continue;
    }
    const reopen = prev.status === "resolved";
    if (!reopen && signature(prev) === signature(f)) continue;
    await db()`
      update biz_savings_opportunities set type = ${f.type}, subscription_id = ${f.subscriptionId}, software_id = ${f.softwareId}, title = ${f.title},
        explanation = ${f.explanation}, evidence = ${db().json(f.evidence)}, est_monthly_minor = ${f.estMonthlyMinor}, currency = ${f.currency},
        confidence = ${f.confidence}, recommended_action = ${f.recommendedAction}, deal_slug = ${f.dealSlug},
        status = ${reopen ? "open" : prev.status}, last_detected_at = now(), updated_at = now()
      where workspace_id = ${ws} and id = ${prev.id}`;
  }
  const gone = [...existing.values()].filter((o) => !seen.has(o.ruleKey) && (o.status === "open" || o.status === "reviewed")).map((o) => o.id);
  if (gone.length) await db()`update biz_savings_opportunities set status = 'resolved', updated_at = now() where workspace_id = ${ws} and id = any(${gone}::uuid[])`;
  return getOpportunities(ws);
}

const decisionStatuses: OpportunityStatus[] = OPPORTUNITY_STATUSES.filter((s) => s !== "resolved");

export async function setOpportunityStatus(ctx: BizContext, id: string, status: OpportunityStatus, decision: string | null): Promise<void> {
  assertCan(ctx, "spend.manage", "Only owners, admins and finance can review savings opportunities.");
  if (!decisionStatuses.includes(status)) throw new BizError("invalid", "Choose a valid status.");
  await db().begin(async (sql) => {
    const [row] = await sql`
      update biz_savings_opportunities set status = ${status}, decision = coalesce(${decision}, decision), reviewed_by = ${ctx.user.id},
        reviewed_at = now(), updated_at = now()
      where workspace_id = ${ctx.workspace.id} and id = ${id}
      returning *`;
    if (!row) throw new BizError("not_found", "That opportunity wasn't found.");
    const o = mapOpportunity(row);
    const verb = { open: "Reopened", reviewed: "Marked as reviewed", dismissed: "Dismissed", actioned: "Recorded a decision on", resolved: "Resolved" }[status];
    await logActivity(sql, ctx, { action: `savings.${status}`, entityType: "opportunity", entityId: id, summary: `${verb}: ${o.title}`.slice(0, 300) });
  });
}

export interface RealizedInput {
  opportunityId: string | null;
  subscriptionId: string | null;
  amountMinor: number;
  currency: string;
  recurrence: "one_time" | "monthly" | "yearly";
  description: string;
  evidence: string | null;
  confirmedOn: string;
}

/** Records a saving someone confirmed, with their amount. Marks the related opportunity as actioned. */
export async function recordRealizedSaving(ctx: BizContext, r: RealizedInput): Promise<void> {
  assertCan(ctx, "spend.manage", "Only owners, admins and finance can confirm savings.");
  const ws = ctx.workspace.id;
  await db().begin(async (sql) => {
    if (r.opportunityId) {
      const [o] = await sql`select id from biz_savings_opportunities where workspace_id = ${ws} and id = ${r.opportunityId}`;
      if (!o) throw new BizError("not_found", "That opportunity wasn't found.");
    }
    if (r.subscriptionId) {
      const [s] = await sql`select id from biz_subscriptions where workspace_id = ${ws} and id = ${r.subscriptionId}`;
      if (!s) throw new BizError("not_found", "That subscription wasn't found.");
    }
    await sql`
      insert into biz_realized_savings (workspace_id, opportunity_id, subscription_id, amount_minor, currency, recurrence, description, evidence, confirmed_on, confirmed_by)
      values (${ws}, ${r.opportunityId}, ${r.subscriptionId}, ${r.amountMinor}, ${r.currency}, ${r.recurrence}, ${r.description}, ${r.evidence}, ${r.confirmedOn}, ${ctx.user.id})`;
    if (r.opportunityId) {
      await sql`update biz_savings_opportunities set status = 'actioned', reviewed_by = ${ctx.user.id}, reviewed_at = now(), updated_at = now()
        where workspace_id = ${ws} and id = ${r.opportunityId}`;
    }
    await logActivity(sql, ctx, { action: "savings.realized", entityType: "opportunity", entityId: r.opportunityId, summary: `Confirmed a realized saving: ${r.description}`.slice(0, 300) });
  });
}

export async function deleteRealizedSaving(ctx: BizContext, id: string): Promise<void> {
  assertCan(ctx, "spend.manage", "Only owners, admins and finance can remove confirmed savings.");
  await db().begin(async (sql) => {
    const [row] = await sql`delete from biz_realized_savings where workspace_id = ${ctx.workspace.id} and id = ${id} returning description`;
    if (!row) throw new BizError("not_found", "That saving wasn't found.");
    await logActivity(sql, ctx, { action: "savings.realized_removed", entityType: "workspace", entityId: ctx.workspace.id, summary: `Removed a confirmed saving: ${row.description}`.slice(0, 300) });
  });
}

// ─── Notifications ──────────────────────────────────────────────────────────

export async function markNotificationsRead(ctx: BizContext, ids: string[] | "all"): Promise<void> {
  if (ids === "all") await db()`update biz_notifications set read_at = now() where workspace_id = ${ctx.workspace.id} and user_id = ${ctx.user.id} and read_at is null`;
  else if (ids.length) await db()`update biz_notifications set read_at = now() where workspace_id = ${ctx.workspace.id} and user_id = ${ctx.user.id} and id = any(${ids}::uuid[])`;
}
