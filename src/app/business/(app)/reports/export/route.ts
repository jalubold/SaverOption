import { NextResponse, type NextRequest } from "next/server";
import { annualized, currencyDigits, firstYearValue, intervalLabel, isRecurring, monthlyEquivalent, potentialSavings, totalsList, type CurrencyTotals } from "@/lib/business/calc";
import { opportunityStatusLabels, opportunityTypeLabels, subscriptionStatusLabels } from "@/lib/business/constants";
import { csvAmount, toCsv, type Cell } from "@/lib/business/csv";
import { can } from "@/lib/business/permissions";
import type { Group } from "@/lib/server/business/analytics";
import { getBizSession } from "@/lib/server/business/context";
import { workspaceDisplay } from "@/lib/server/business/display-currency";
import { buildReport, REPORT_KEYS, type Report, type ReportKey } from "@/lib/server/business/reports";

/**
 * CSV downloads for the Reports page. Built by the same buildReport call as the
 * page, with the same query parameters, so each file matches what's on screen.
 * Amounts are plain decimals with their currency in a separate column.
 */

const amt = (minor: number | null, currency: string) => csvAmount(minor === null ? null : Math.round(minor), currencyDigits(currency));
const totalsRows = (label: string, totals: CurrencyTotals, note = ""): Cell[][] =>
  totalsList(totals).map((t) => [label, t.currency, amt(t.amount, t.currency), note]);

function groupCsv(groups: Group[]): { header: string[]; rows: Cell[][] } {
  return {
    header: ["Name", "Active subscriptions", "Currency", "Monthly equivalent"],
    rows: groups.flatMap((g) => totalsList(g.totals).map((t) => [g.label, g.count, t.currency, amt(t.amount, t.currency)])),
  };
}

function build(report: Report, key: ReportKey): { header: string[]; rows: Cell[][] } {
  const { model, params } = report;
  switch (key) {
    case "summary":
      return {
        header: ["Metric", "Currency", "Value", "Note"],
        rows: [
          ["Reporting period", "", `${params.from} to ${params.to}`, ""],
          ...totalsRows("Monthly software spend", model.summary.monthly, "Recurring run-rate of active subscriptions"),
          ...totalsRows("Annualized recurring cost", model.summary.annualized, "Run-rate x 12; not cash spent"),
          ["Active subscriptions", "", model.summary.activeCount, ""],
          ["Subscriptions in trial", "", model.summary.trialCount, ""],
          ["Active subscriptions without a price", "", model.summary.missingPrice, "Not included in the totals"],
          ...totalsRows("Recorded payments in period", report.paymentsTotal, "Actual expenditure entered by the team"),
          ...totalsRows("Potential savings per year", model.potential.annual, "Estimates; each subscription counted once"),
          ...totalsRows("Realized savings confirmed in period", report.realizedInRange, "First-year value"),
        ],
      };
    case "subscriptions":
      return {
        header: ["Software", "Vendor", "Plan", "Status", "Billing interval", "Currency", "Price per period", "Monthly equivalent", "Annualized (run-rate)", "Start date", "Next renewal", "Auto-renew", "Department", "Owner", "Purchased seats", "Seats in use (reported)"],
        rows: model.subs.map((s) => {
          const recurring = isRecurring(s);
          return [
            s.softwareName,
            s.vendorName,
            s.planName,
            subscriptionStatusLabels[s.status],
            intervalLabel(s),
            s.currency,
            amt(s.priceMinor, s.currency),
            recurring ? amt(monthlyEquivalent(s), s.currency) : "",
            recurring ? amt(annualized(s), s.currency) : "",
            s.startDate,
            s.nextRenewalDate,
            s.autoRenew ? "yes" : "no",
            s.departmentName,
            s.ownerName,
            s.purchasedSeats,
            s.reportedAssignedSeats,
          ];
        }),
      };
    case "vendors":
      return groupCsv(model.byVendor);
    case "categories":
      return groupCsv(model.byCategory);
    case "departments":
      return groupCsv(model.byDepartment);
    case "intervals":
      return groupCsv(model.byInterval);
    case "renewals":
      return {
        header: ["Software", "Billing interval", "Next renewal", "Renewals in window", "Renewal dates", "Currency", "Amount", "Counted as committed", "Window from", "Window to"],
        rows: report.commitments.rows.map((r) => [
          r.sub.softwareName,
          intervalLabel(r.sub),
          r.dates[0],
          r.dates.length,
          r.dates.join("; "),
          r.sub.currency,
          amt(r.amount, r.sub.currency),
          r.manual ? "no (auto-renew off)" : "yes",
          report.commitments.from,
          report.commitments.to,
        ]),
      };
    case "licenses":
      return {
        header: ["Software", "Purchased seats", "Seats in use", "Source", "Available", "Utilization %", "Currency", "Unused seat cost per month"],
        rows: report.licenseRows.map(({ sub, seats }) => [
          sub.softwareName,
          seats.purchased,
          seats.assigned,
          seats.assignedSource,
          seats.available,
          seats.utilization === null ? "" : seats.utilization.toFixed(1),
          sub.currency,
          amt(seats.unusedMonthly, sub.currency),
        ]),
      };
    case "payments":
      return {
        header: ["Paid on", "Software", "Currency", "Amount", "Reference", "Source", "Notes"],
        rows: report.payments.map((p) => [p.paidOn, p.softwareName, p.currency, amt(p.amountMinor, p.currency), p.reference, p.source, p.notes]),
      };
    case "savings":
      return {
        header: ["Opportunity", "Type", "Status", "Confidence", "Currency", "Estimated monthly saving", "Estimated annual saving", "Recommended action", "Last detected"],
        rows: model.opportunities
          .filter((o) => o.status === "open" || o.status === "reviewed")
          .map((o) => {
            const est = o.estMonthlyMinor !== null && o.currency ? potentialSavings([{ ...o, status: "open" }]) : null;
            return [
              o.title,
              opportunityTypeLabels[o.type],
              opportunityStatusLabels[o.status],
              o.confidence,
              o.currency,
              est && o.currency ? amt(est.monthly[o.currency] ?? null, o.currency) : "",
              est && o.currency ? amt(est.annual[o.currency] ?? null, o.currency) : "",
              o.recommendedAction,
              o.lastDetectedAt.toISOString().slice(0, 10),
            ];
          }),
      };
    case "realized":
      return {
        header: ["Confirmed on", "Description", "Recurrence", "Currency", "Amount", "First-year value", "Evidence"],
        rows: report.realizedRows.map((r) => [r.confirmedOn, r.description, r.recurrence, r.currency, amt(r.amountMinor, r.currency), amt(firstYearValue(r), r.currency), r.evidence]),
      };
    case "activity":
      return {
        header: ["Time (UTC)", "Who", "Action", "Summary"],
        rows: report.activity.map((a) => [a.createdAt.toISOString(), a.actorName, a.action, a.summary]),
      };
  }
}

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("report") ?? "";
  if (!(REPORT_KEYS as readonly string[]).includes(key)) return NextResponse.json({ error: "Unknown report." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  const { user, ctx } = await getBizSession();
  if (!user) return NextResponse.json({ error: "Sign in to export reports." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  if (!ctx) return NextResponse.json({ error: "You don't have access to a workspace." }, { status: 403, headers: { "Cache-Control": "no-store" } });
  if (!can(ctx.role, "data.export")) return NextResponse.json({ error: "Your role can't export data." }, { status: 403, headers: { "Cache-Control": "no-store" } });

  const raw: Record<string, string> = {};
  for (const [k, v] of request.nextUrl.searchParams) if (k !== "report") raw[k] = v;
  // The same figures as the Reports page: amounts in the workspace currency.
  const report = await buildReport(ctx, raw, { display: await workspaceDisplay(ctx) });
  const { header, rows } = build(report, key as ReportKey);
  return new NextResponse(toCsv(header, rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="saver-option-${key}-${ctx.today}.csv"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
