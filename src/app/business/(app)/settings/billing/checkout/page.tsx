import { CheckoutForm } from "@/components/business/billing-forms";
import { Card, DefinitionList, InlineNote, LinkButton, PageHeader } from "@/components/business/ui";
import { canStartCheckout, formatInstant, intervalLabels, isPlan, isPlanInterval, planLabels, resolveAccess, type PlanInterval } from "@/lib/business/billing";
import { formatMoney } from "@/lib/business/calc";
import { can } from "@/lib/business/permissions";
import { checkoutConfigured, getBillingRecord, readProduct } from "@/lib/server/business/billing";
import { requireBizContext } from "@/lib/server/business/context";
import { businessContactEmail, planOffer } from "@/lib/server/business/plans";

export const metadata = { title: "Confirm your plan" };

const every: Record<PlanInterval, string> = { month: "every month", year: "every year" };

/**
 * The last step before Creem: the plan, interval, price, trial terms, when the
 * first charge happens and that a payment method is needed — all read from
 * Creem's product (not from the URL) right before the button.
 */
export default async function ConfirmCheckoutPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const ctx = await requireBizContext("/business/settings/billing", { billing: "open" });
  const sp = await searchParams;
  const ws = ctx.workspace;
  const crumbs = [
    { label: "Settings", href: "/business/settings" },
    { label: "Plan & billing", href: "/business/settings/billing" },
    { label: "Confirm" },
  ];
  const back = (
    <LinkButton href="/business/settings/billing#plans" icon="arrow-left">
      Back to plans
    </LinkButton>
  );
  const stop = (title: string, body: string) => (
    <>
      <PageHeader title="Confirm your plan" crumbs={crumbs} />
      <div className="grid max-w-2xl gap-4">
        <InlineNote tone="warn" title={title}>
          {body}
        </InlineNote>
        <div>{back}</div>
      </div>
    </>
  );

  if (!isPlan(sp.plan) || !isPlanInterval(sp.interval)) return stop("Choose a plan first", "Pick a plan and billing interval on the Plan & billing page.");
  if (!can(ctx.role, "billing.manage")) return stop("Only owners and admins can subscribe", "Ask an owner or admin of this workspace to choose the plan.");
  if (ws.isDemo) return stop("The demo workspace isn't billed", "Create your company's own workspace to subscribe.");
  if (!checkoutConfigured()) return stop("Online checkout isn't available yet", "Contact us and we'll set up your plan.");

  const now = new Date();
  const record = await getBillingRecord(ws.id);
  const access = resolveAccess(record, { isDemo: false, now });
  if (!canStartCheckout(access)) return stop("You already have an active subscription", "Use Manage billing on the Plan & billing page to change it.");

  const plan = sp.plan;
  const interval = sp.interval;
  const { product, problem } = await readProduct(planOffer(plan, interval), { fresh: true });
  if (!product || problem) return stop(`${planLabels[plan]} ${intervalLabels[interval].toLowerCase()} can't be bought right now`, problem ?? "The price couldn't be confirmed with Creem. Try again in a moment.");

  const price = formatMoney(product.price, product.currency);
  const tax = product.taxMode === "inclusive" ? "Tax included." : product.taxMode === "exclusive" ? "Tax, where it applies, is added on top of this price." : null;
  const creemTrial = product.trialPeriodDays && product.trialPeriodDays > 0 ? product.trialPeriodDays : null;
  const trialPrice = creemTrial && product.trialPrice ? formatMoney(product.trialPrice, product.currency) : null;
  const firstFull = creemTrial ? new Date(now.getTime() + creemTrial * 86_400_000) : now;
  const tz = ws.timeZone;
  const contact = businessContactEmail();

  const trialTerms = creemTrial
    ? `This plan starts with a ${creemTrial}-day trial at Creem${trialPrice ? ` costing ${trialPrice}` : ", free"}; Creem collects your payment method at checkout.`
    : access.kind === "trial"
      ? `Your free trial ends ${formatInstant(access.endsAt, tz, { time: true })}. Subscribing now starts the paid plan today — the remaining trial days aren't added on. You can also wait and subscribe before the trial ends.`
      : "No trial — this workspace's free trial has ended or was already used.";
  const firstCharge = creemTrial
    ? `${trialPrice ? `${trialPrice} today, then ` : ""}${price} on about ${formatInstant(firstFull, tz)}, when the trial ends`
    : `${price} today (${formatInstant(now, tz)})`;

  return (
    <>
      <PageHeader title="Confirm your plan" description="Check the details, then continue to Creem's secure checkout to pay." crumbs={crumbs} />
      <div className="grid max-w-2xl gap-5">
        <Card title={`${planLabels[plan]} · ${intervalLabels[interval]}`} description={`For ${ws.name}`}>
          <DefinitionList
            className="sm:grid-cols-1"
            items={[
              { label: "Plan", value: planLabels[plan] },
              { label: "Billing interval", value: `${intervalLabels[interval]} — billed ${every[interval]}` },
              { label: "Price", value: <span data-confirm-price>{`${price} / ${interval}`}</span>, hint: tax ?? undefined },
              { label: "Trial", value: trialTerms },
              { label: "First charge", value: firstCharge },
              { label: "After that", value: `${price} ${every[interval]} until you cancel. Cancel any time in Settings → Plan & billing; access continues to the end of the paid period.` },
              { label: "Payment method", value: "Required — you enter it on Creem's checkout page. Saver Option never sees or stores card details." },
            ]}
          />
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
            <CheckoutForm workspaceId={ws.id} plan={plan} interval={interval} label={`Continue to checkout — ${price} / ${interval}`} />
            {back}
          </div>
          <p className="mt-3 text-[12px] text-faint">
            You&apos;ll be taken to Creem (creem.io) to pay. The plan becomes active once Creem confirms the payment — closing the checkout charges nothing. Questions
            about billing:{" "}
            <a href={`mailto:${contact}`} className="underline underline-offset-2">
              {contact}
            </a>
            .
          </p>
        </Card>
      </div>
    </>
  );
}
