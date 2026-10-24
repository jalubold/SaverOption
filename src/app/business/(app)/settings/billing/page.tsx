import Link from "next/link";
import { redirect } from "next/navigation";
import { CancelForm, PortalForm } from "@/components/business/billing-forms";
import { PricingSwitch } from "@/components/business/pricing-switch";
import { Card, DefinitionList, InlineNote, LinkButton, PageHeader, Pill } from "@/components/business/ui";
import { Icon } from "@/components/ui/icon";
import { buttonClass, cn } from "@/components/ui/primitives";
import {
  canStartCheckout,
  formatInstant,
  intervalLabels,
  planLabels,
  PLANS,
  remainingText,
  resolveAccess,
  TRIAL_DAYS,
  type Access,
  type BillingRecord,
  type PlanInterval,
} from "@/lib/business/billing";
import { formatMoney } from "@/lib/business/calc";
import { can } from "@/lib/business/permissions";
import { assistantConfigured } from "@/lib/server/business/assistant";
import { checkoutConfigured, confirmCheckoutReturn, getBillingRecord, memberCapacity, offerViews, pricingInfo, type OfferView } from "@/lib/server/business/billing";
import { requireBizContext } from "@/lib/server/business/context";
import { businessContactEmail, planFeatures } from "@/lib/server/business/plans";

export const metadata = { title: "Plan & billing" };

const per: Record<PlanInterval, string> = { month: "month", year: "year" };

function statusOf(a: Access, b: BillingRecord | null, tz: string, now: Date): { pill: React.ReactNode; detail: string } {
  switch (a.kind) {
    case "demo":
      return { pill: <Pill tone="neutral">Demo</Pill>, detail: "Sample data for trying the product — not billed." };
    case "trial":
      return { pill: <Pill tone="accent">Free trial</Pill>, detail: `${remainingText(a.endsAt, now)} left · ends ${formatInstant(a.endsAt, tz, { time: true })}` };
    case "subscription":
      if (a.state === "active") return { pill: <Pill tone="success">Active</Pill>, detail: a.until ? `Renews ${formatInstant(a.until, tz)}` : "Renews automatically" };
      if (a.state === "trialing") return { pill: <Pill tone="accent">Trial (Creem)</Pill>, detail: a.until ? `First payment ${formatInstant(a.until, tz)}` : "Trial at Creem" };
      if (a.state === "ending") return { pill: <Pill tone="warn">Cancelled</Pill>, detail: a.until ? `Access until ${formatInstant(a.until, tz)}; it won't renew` : "Ends at the close of the paid period" };
      return { pill: <Pill tone="danger">Payment failed</Pill>, detail: a.until ? `Update the payment method — access until ${formatInstant(a.until, tz)}` : "Update the payment method" };
    case "locked": {
      const label = { trial_ended: "Trial ended", no_trial: "No plan", subscription_ended: "Ended", payment_failed: "Payment failed", paused: "Paused" }[a.reason];
      const detail =
        a.reason === "trial_ended" && b?.trialEndsAt
          ? `The free trial ended ${formatInstant(b.trialEndsAt, tz, { time: true })}.`
          : a.reason === "no_trial"
            ? "This account has already used its free trial, so this workspace starts on a paid plan."
            : a.reason === "payment_failed"
              ? "Creem couldn't collect a payment and the paid period has ended."
              : a.reason === "paused"
                ? "The subscription is paused at Creem."
                : b?.currentPeriodEnd
                  ? `The subscription ended ${formatInstant(b.currentPeriodEnd, tz)}.`
                  : "The subscription has ended.";
      return { pill: <Pill tone="danger">{label}</Pill>, detail };
    }
  }
}

function priceText(o: OfferView): string | null {
  return o.priceMinor === null ? null : formatMoney(o.priceMinor, o.currency);
}

export default async function BillingPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const ctx = await requireBizContext("/business/settings/billing", { billing: "open" });
  const sp = await searchParams;
  const ws = ctx.workspace;

  // Back from Creem: confirm with Creem's API (never the redirect's own parameters), then reload cleanly.
  if (sp.checkout) {
    const r = await confirmCheckoutReturn(ctx, sp.checkout);
    redirect(`/business/settings/billing?return=${r.state}`);
  }

  const now = new Date();
  const record = ws.isDemo ? null : await getBillingRecord(ws.id);
  const access = resolveAccess(record, { isDemo: ws.isDemo, now });
  const canManage = can(ctx.role, "billing.manage");
  const [offers, capacity] = await Promise.all([offerViews(), memberCapacity(ctx)]);
  const configured = offers.some((o) => o.available) || (await checkoutConfigured());
  const pricing = pricingInfo(offers);
  const interval: PlanInterval = sp.interval === "year" && pricing.yearly ? "year" : "month";
  const contact = businessContactEmail();
  const status = statusOf(access, record, ws.timeZone, now);
  const subscribed = access.kind === "subscription";
  const showPlans = !ws.isDemo && canStartCheckout(access);
  const assistant = assistantConfigured();
  const recordPrice = record?.priceMinor !== null && record?.priceMinor !== undefined && record.currency ? formatMoney(record.priceMinor, record.currency) : null;
  const mail = (subject: string) => `mailto:${contact}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Workspace: ${ws.name}\n\n`)}`;

  return (
    <>
      <PageHeader
        title="Plan & billing"
        description={ws.isDemo ? "The demo workspace isn't billed." : `Your Saver Option plan for ${ws.name}. Payments are handled by Creem; Saver Option never sees your card details.`}
        crumbs={[{ label: "Settings", href: "/business/settings" }, { label: "Plan & billing" }]}
      />

      <div className="grid gap-5">
        {sp.return === "active" && subscribed && (
          <InlineNote title={`Payment confirmed — ${planLabels[access.plan]} is active`}>Creem confirmed the subscription. Thank you!</InlineNote>
        )}
        {sp.return === "processing" && !subscribed && (
          <InlineNote tone="warn" title="Waiting for Creem to confirm the payment">
            This usually takes a few seconds. Reload this page in a moment — the plan changes only once Creem confirms it. If you closed the checkout, nothing was charged.
          </InlineNote>
        )}
        {access.kind === "locked" && (
          <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3.5 text-[13.5px]" data-locked={access.reason}>
            <p className="font-semibold text-fg">
              <Icon name="lock" size={14} className="mr-1.5 inline text-danger" />
              {access.reason === "trial_ended" ? "Your free trial has ended." : access.reason === "no_trial" ? "Choose a plan to use this workspace." : "This workspace's subscription isn't active."}
            </p>
            <p className="mt-1 text-muted">
              Software records, reports and the AI tools are paused until a plan is active. Nothing is deleted — your data, settings, members and exports stay available.
              {!canManage && " Ask an owner or admin of this workspace to choose a plan."}
            </p>
          </div>
        )}

        <Card title="Current plan">
          <DefinitionList
            items={[
              { label: "Plan", value: subscribed ? planLabels[access.plan] : access.kind === "trial" ? "Free trial (everything in Business)" : access.kind === "demo" ? "Demo" : "None" },
              { label: "Status", value: <span className="inline-flex flex-wrap items-center gap-2">{status.pill}<span className="text-[13px] text-muted">{status.detail}</span></span> },
              ...(record?.trialStartedAt && record.trialEndsAt && (access.kind !== "subscription" || access.state === "past_due" || record.trialEndsAt > now)
                ? [{ label: "Free trial", value: `${formatInstant(record.trialStartedAt, ws.timeZone)} – ${formatInstant(record.trialEndsAt, ws.timeZone, { time: true })}`, hint: `${TRIAL_DAYS} days, no card needed.` }]
                : []),
              ...(record?.creemSubscriptionId
                ? [
                    { label: "Billing interval", value: record.interval ? intervalLabels[record.interval] : "—" },
                    { label: "Price", value: recordPrice ? `${recordPrice} / ${record.interval ? per[record.interval] : "period"}` : "—", hint: "As charged by Creem." },
                    {
                      label: "Current period",
                      value: record.currentPeriodStart && record.currentPeriodEnd ? `${formatInstant(record.currentPeriodStart, ws.timeZone)} – ${formatInstant(record.currentPeriodEnd, ws.timeZone)}` : "—",
                    },
                  ]
                : []),
              ...(record?.lastRefundAt ? [{ label: "Refund", value: `Creem issued a refund on ${formatInstant(record.lastRefundAt, ws.timeZone)}.` }] : []),
              {
                label: "Members",
                value: capacity.limit === null ? `${capacity.members} (no limit)` : capacity.plan ? `${capacity.members} of ${capacity.limit}` : String(capacity.members),
                hint: capacity.openInvites ? `${capacity.openInvites} open invitation${capacity.openInvites === 1 ? "" : "s"} count toward the limit.` : undefined,
              },
            ]}
          />
          {canManage && access.kind === "trial" && showPlans && (
            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4">
              <a href="#plans" className={buttonClass("primary", "sm")} data-upgrade-now>
                <Icon name="sparkles" size={14} />
                Upgrade now
              </a>
              <p className="max-w-md text-[12.5px] text-faint">Pay for a plan now instead of waiting for the trial to end.</p>
            </div>
          )}
          {canManage && record?.creemSubscriptionId && (
            <div className="mt-5 flex flex-wrap items-start gap-3 border-t border-line pt-4">
              {record.creemCustomerId && <PortalForm workspaceId={ws.id} label={access.kind === "subscription" && access.state === "past_due" ? "Update payment method" : "Manage billing"} />}
              <p className="max-w-md text-[12.5px] text-faint">Opens Creem&apos;s customer portal: payment method, invoices and receipts.</p>
            </div>
          )}
          {canManage && subscribed && (access.state === "active" || access.state === "trialing") && (
            <details className="mt-4 border-t border-line pt-4">
              <summary className="cursor-pointer text-[13px] font-medium text-muted hover:text-fg">Cancel subscription</summary>
              <div className="mt-3 max-w-lg">
                <CancelForm workspaceId={ws.id} endsOn={access.until ? formatInstant(access.until, ws.timeZone) : null} />
              </div>
            </details>
          )}
          {!canManage && !ws.isDemo && <p className="mt-4 text-[12.5px] text-faint">Only owners and admins can change the plan or billing.</p>}
        </Card>

        {ws.isDemo && (
          <InlineNote title="This is the demo workspace">
            Northwind Studio is sample data and isn&apos;t billed. Your company&apos;s own workspace starts with a {TRIAL_DAYS}-day free trial.{" "}
            <Link href="/business/onboarding" className="font-medium text-accent-ink underline underline-offset-2">
              Create your workspace
            </Link>
          </InlineNote>
        )}

        {showPlans && (
          <section aria-labelledby="plans-heading" id="plans" className="scroll-mt-24">
            <div className="mb-4">
              <h2 id="plans-heading" className="text-[16px] font-semibold text-fg">
                {access.kind === "trial" ? "Upgrade now" : "Choose a plan"}
              </h2>
              <p className="mt-0.5 text-[13px] text-muted">
                {access.kind === "trial"
                  ? "You don't have to wait for the trial to end — subscribe whenever you're ready. The paid plan starts once Creem confirms the payment. "
                  : ""}
                There&apos;s no free plan after the trial. Prices are confirmed with Creem before checkout.
              </p>
            </div>
            <PricingSwitch initial={interval} savingsBadge={pricing.yearly ? pricing.badge : null} className={pricing.yearly ? undefined : "[&>[data-pricing-switch]]:hidden"}>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {PLANS.map((plan) => (
                  <div key={plan} className={cn("biz-card flex flex-col p-5", plan === "business" && "ring-1 ring-accent/30")} data-plan={plan}>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-[17px] font-semibold text-fg">{planLabels[plan]}</h3>
                    </div>
                    {(["month", "year"] as const).map((i) => {
                      const o = offers.find((x) => x.plan === plan && x.interval === i)!;
                      const price = priceText(o);
                      const saved = i === "year" ? pricing.savings[plan] : null;
                      return (
                        <div key={i} className={i === "month" ? "group-data-[interval=year]/pricing:hidden" : "hidden group-data-[interval=year]/pricing:block"} data-card-interval={i}>
                          {o.creemTrialDays && (
                            <p className="mt-2">
                              <Pill tone="accent">{o.creemTrialDays}-day trial at checkout</Pill>
                            </p>
                          )}
                          <p className="mt-3 text-fg">
                            {price && (i === "month" || !pricing.yearly || o.available || !configured) ? (
                              <>
                                <span className="text-[28px] font-semibold tracking-tight" data-price={o.priceSource ?? ""}>
                                  {price}
                                </span>
                                <span className="text-[13px] text-muted"> / {per[i]}</span>
                              </>
                            ) : (
                              <span className="text-[14px] text-muted">{intervalLabels[i]} billing isn&apos;t available for this plan yet.</span>
                            )}
                          </p>
                          {saved && o.priceMinor !== null && (
                            <p className="mt-1 text-[12.5px] text-success" data-yearly-saving>
                              ≈ {formatMoney(Math.round(o.priceMinor / 12), o.currency)} / month · save {formatMoney(saved.perYear, saved.currency)} a year
                            </p>
                          )}
                        </div>
                      );
                    })}
                    <ul className="mt-4 grid gap-1.5 text-[13px] text-muted">
                      {planFeatures(plan, { assistant }).map((f) => (
                        <li key={f} className="flex gap-2">
                          <Icon name="check" size={14} className="mt-0.5 shrink-0 text-success" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    {(["month", "year"] as const).map((i) => {
                      const o = offers.find((x) => x.plan === plan && x.interval === i)!;
                      return (
                        <div key={i} className={cn("mt-auto pt-5", i === "month" ? "group-data-[interval=year]/pricing:hidden" : "hidden group-data-[interval=year]/pricing:block")}>
                          {!canManage ? (
                            <p className="text-[12.5px] text-faint">An owner or admin can subscribe.</p>
                          ) : o.available ? (
                            <Link href={`/business/settings/billing/checkout?plan=${plan}&interval=${i}`} className={buttonClass(plan === "business" ? "primary" : "secondary", "md", "w-full")}>
                              Continue with {planLabels[plan]} {i === "year" ? "yearly" : "monthly"}
                            </Link>
                          ) : (
                            <p className="text-[12.5px] text-faint" data-unavailable>
                              {configured ? "This plan can't be bought online right now. Try again later or contact us." : "Online checkout isn't available yet."}{" "}
                              <a href={mail(`Saver Option ${planLabels[plan]} plan`)} className="font-medium text-accent-ink underline underline-offset-2">
                                Contact us
                              </a>
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </PricingSwitch>
          </section>
        )}

        <Card title="Self-Hosted and White-Label" description="Custom pricing tailored to your setup. Tell us what you need and we'll put together a proposal.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[14px] font-medium text-fg">Self-Hosted</p>
              <p className="mt-1 text-[13px] text-muted">Run Saver Option Business on your own infrastructure.</p>
            </div>
            <div>
              <p className="text-[14px] font-medium text-fg">White-Label</p>
              <p className="mt-1 text-[13px] text-muted">Offer Saver Option Business to your clients under your own brand.</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a href={mail("Saver Option Business — Self-Hosted / White-Label inquiry")} className={buttonClass("secondary", "sm")}>
              <Icon name="mail" size={14} />
              Contact us
            </a>
          </div>
        </Card>

        <Card title="How billing works">
          <ul className="grid gap-2 text-[13px] text-muted">
            <li>
              New workspaces get a {TRIAL_DAYS}-day free trial with everything in Business — no card needed. One free trial per account; it isn&apos;t reset by signing out,
              switching devices or creating another workspace.
            </li>
            <li>After the trial, a paid plan is needed to keep using software records, reports and the AI tools. Your data is kept either way.</li>
            <li>Payments, invoices and payment methods are handled by Creem. Saver Option stores only Creem&apos;s customer and subscription references — never card details.</li>
            <li>Cancelling takes effect at the end of the paid period; you keep access until then.</li>
          </ul>
          <div className="mt-4">
            <LinkButton href="/business/docs" icon="info">
              Help and documentation
            </LinkButton>
          </div>
        </Card>
      </div>
    </>
  );
}
