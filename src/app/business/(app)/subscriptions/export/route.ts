import { NextResponse, type NextRequest } from "next/server";
import { annualized, currencyDigits, intervalLabel, monthlyEquivalent, seatSummary } from "@/lib/business/calc";
import { categoryLabels, pricingModelLabels, subscriptionStatusLabels } from "@/lib/business/constants";
import { csvAmount, toCsv } from "@/lib/business/csv";
import { can } from "@/lib/business/permissions";
import { getBizSession } from "@/lib/server/business/context";
import { getSubscriptions } from "@/lib/server/business/data";
import { applySubscriptionFilters, parseSubscriptionFilters } from "@/lib/server/business/subscription-filters";

/** CSV of the subscription list, with the same filters as the page. Amounts are plain numbers in each row's own currency. */
export async function GET(request: NextRequest) {
  const { user, ctx } = await getBizSession();
  if (!user) return new NextResponse("Sign in to export.", { status: 401, headers: { "Cache-Control": "no-store" } });
  if (!ctx) return new NextResponse("You don't have access to a workspace.", { status: 403, headers: { "Cache-Control": "no-store" } });
  if (!can(ctx.role, "data.export")) return new NextResponse("Your role can't export data.", { status: 403, headers: { "Cache-Control": "no-store" } });

  const f = parseSubscriptionFilters(Object.fromEntries(request.nextUrl.searchParams));
  const rows = applySubscriptionFilters(await getSubscriptions(ctx.workspace.id), f, ctx.today);
  const csv = toCsv(
    [
      "Software", "Vendor", "Category", "Plan", "Status", "Archived", "Currency", "Price per period", "Billing interval", "Pricing model",
      "Monthly equivalent", "Annualized recurring cost", "Start date", "Next renewal", "Cancellation deadline", "Auto-renew",
      "Seats purchased", "Seats in use", "Seats in use source", "Owner", "Department", "Payment method",
    ],
    rows.map((s) => {
      const d = currencyDigits(s.currency);
      const seats = seatSummary(s);
      return [
        s.softwareName, s.vendorName, categoryLabels[s.category], s.planName, subscriptionStatusLabels[s.status], s.archived ? "Yes" : "No", s.currency,
        csvAmount(s.priceMinor, d), intervalLabel(s), pricingModelLabels[s.pricingModel], csvAmount(monthlyEquivalent(s), d), csvAmount(annualized(s), d),
        s.startDate, s.nextRenewalDate, s.cancellationDeadline, s.autoRenew ? "Yes" : "No",
        seats.purchased, seats.assigned, seats.assignedSource === "none" ? "" : seats.assignedSource, s.ownerName, s.departmentName, s.paymentMethod,
      ];
    }),
  );
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="saver-option-subscriptions-${ctx.today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
