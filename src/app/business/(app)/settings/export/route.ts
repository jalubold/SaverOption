import { NextResponse } from "next/server";
import { can } from "@/lib/business/permissions";
import { getBizSession } from "@/lib/server/business/context";
import {
  getActivity,
  getCostHistory,
  getDepartments,
  getOpportunities,
  getPayments,
  getPeople,
  getRealizedSavings,
  getRenewalEvents,
  getSeatAssignments,
  getSoftwareList,
  getSubscriptions,
  getVendors,
} from "@/lib/server/business/data";

/** Downloads everything in the current workspace as JSON. Only this workspace's rows are read. */
export async function GET() {
  const { user, ctx } = await getBizSession();
  if (!user) return NextResponse.json({ error: "Sign in to export data." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  if (!ctx) return NextResponse.json({ error: "You don't have access to a workspace." }, { status: 403, headers: { "Cache-Control": "no-store" } });
  if (!can(ctx.role, "data.export")) return NextResponse.json({ error: "Your role can't export data." }, { status: 403, headers: { "Cache-Control": "no-store" } });

  const ws = ctx.workspace.id;
  const [departments, people, vendors, software, subscriptions, costHistory, payments, renewalEvents, seatAssignments, opportunities, realizedSavings, activity] =
    await Promise.all([
      getDepartments(ws),
      getPeople(ws),
      getVendors(ws),
      getSoftwareList(ws),
      getSubscriptions(ws),
      getCostHistory(ws),
      getPayments(ws),
      getRenewalEvents(ws),
      getSeatAssignments(ws),
      getOpportunities(ws),
      getRealizedSavings(ws),
      getActivity(ws, { limit: 1000 }),
    ]);

  const w = ctx.workspace;
  const body = {
    exportedAt: new Date().toISOString(),
    exportedBy: user.email,
    notes: [
      "Money amounts are integer minor units (e.g. cents) in the currency given next to them.",
      "monthly/annualized figures are not included: they're derived from price, billing interval and status.",
    ],
    workspace: {
      id: w.id,
      name: w.name,
      industry: w.industry,
      companySize: w.companySize,
      website: w.website,
      logoUrl: w.logoUrl,
      contactName: w.contactName,
      contactEmail: w.contactEmail,
      contactPhone: w.contactPhone,
      defaultCurrency: w.defaultCurrency,
      timeZone: w.timeZone,
      fiscalYearStart: w.fiscalYearStart,
      dateFormat: w.dateFormat,
      reminderDays: w.reminderDays,
      notifyInApp: w.notifyInApp,
      isDemo: w.isDemo,
      createdAt: w.createdAt,
    },
    departments,
    people,
    vendors,
    software,
    subscriptions,
    costHistory,
    payments,
    renewalEvents,
    seatAssignments,
    savingsOpportunities: opportunities,
    realizedSavings,
    activity,
  };

  return new NextResponse(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="saver-option-business-${ctx.today}.json"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
