import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { GoogleButton } from "@/components/auth/auth-forms";
import { BarList, StackedBar } from "@/components/business/charts";
import { BusinessPublicHeader } from "@/components/business/public-header";
import { Kpi, Meter, Money, Pill } from "@/components/business/ui";
import { JsonLd } from "@/components/seo/json-ld";
import { FormMessage } from "@/components/ui/form";
import { Icon, type IconProps } from "@/components/ui/icon";
import { buttonClass, Container, Eyebrow, SectionHeading } from "@/components/ui/primitives";
import { formatMoney, groupMonthly, monthlyEquivalent, seatSummary, summarizeSpend, type SubscriptionCalc } from "@/lib/business/calc";
import { billingIntervalLabels } from "@/lib/business/constants";
import { businessReady, getBizSession } from "@/lib/server/business/context";
import { googleSignInEnabled } from "@/lib/server/supabase";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

const description =
  "Saver Option Business tracks your company's software subscriptions, renewals and licenses in one workspace, and shows where you could spend less. Sign in with Google.";

export const metadata: Metadata = {
  ...pageMetadata({ title: "Saver Option Business: software spend management", description, path: "/business" }),
  title: { absolute: "Saver Option Business: software spend management" },
};

/**
 * A small fictional company, used only to illustrate the product with its real
 * components. Every figure shown on this page is computed from these rows by the
 * same calculation layer the app uses, and is labelled "Example data".
 */
type Example = SubscriptionCalc & { name: string; category: string; department: string };
const ex = (e: Partial<Example> & Pick<Example, "id" | "name" | "priceMinor" | "billingInterval" | "category" | "department">): Example => ({
  currency: "USD",
  customIntervalCount: null,
  customIntervalUnit: null,
  pricingModel: "flat",
  purchasedSeats: null,
  status: "active",
  archived: false,
  nextRenewalDate: null,
  namedSeats: 0,
  reportedAssignedSeats: null,
  ...e,
});
const example: Example[] = [
  ex({ id: "1", name: "Team chat", priceMinor: 12_000, billingInterval: "monthly", category: "Team chat", department: "Operations", pricingModel: "per_seat", purchasedSeats: 15, namedSeats: 12 }),
  ex({ id: "2", name: "Design tool", priceMinor: 144_000, billingInterval: "yearly", category: "Design", department: "Design", pricingModel: "per_seat", purchasedSeats: 8, namedSeats: 5 }),
  ex({ id: "3", name: "Cloud hosting", priceMinor: 95_000, billingInterval: "monthly", category: "Cloud & hosting", department: "Engineering" }),
  ex({ id: "4", name: "CRM", priceMinor: 90_000, billingInterval: "quarterly", category: "CRM & sales", department: "Sales" }),
  ex({ id: "5", name: "Docs & wiki", priceMinor: 16_000, billingInterval: "monthly", category: "Docs & knowledge base", department: "Engineering", purchasedSeats: 20, reportedAssignedSeats: 11 }),
  ex({ id: "6", name: "Email marketing", priceMinor: 30_000, billingInterval: "monthly", category: "Marketing", department: "Marketing" }),
];
const usd = (minor: number) => formatMoney(Math.round(minor), "USD", { whole: true });

function ExampleLabel() {
  return (
    <p className="mb-3 flex items-center gap-1.5 text-[11.5px] font-medium uppercase tracking-[0.06em] text-faint">
      <Icon name="info" size={12} /> Example data — a fictional company
    </p>
  );
}

function Feature({ id, icon, title, body, children }: { id?: string; icon: IconProps["name"]; title: string; body: string; children: ReactNode }) {
  return (
    <article id={id} className="biz-card flex flex-col p-5">
      <div className="flex items-center gap-2.5">
        <span className="icon-tile size-9">
          <Icon name={icon} size={17} />
        </span>
        <h3 className="text-[16px] font-semibold text-heading">{title}</h3>
      </div>
      <p className="mt-2 text-[14px] leading-relaxed text-muted">{body}</p>
      <div className="mt-4 flex-1 rounded-xl border border-line bg-bg p-4">
        <ExampleLabel />
        {children}
      </div>
    </article>
  );
}

const faq = [
  {
    q: "What is Saver Option Business?",
    a: "A workspace for your company's software spending: every subscription with its price, billing interval and renewal date, the seats you pay for and who uses them, upcoming renewals, reports, and opportunities to spend less.",
  },
  {
    q: "How do I sign in?",
    a: "With Google only. Saver Option receives your name, email address and profile picture — no access to Gmail, Drive or Calendar.",
  },
  {
    q: "Does it connect to our bank account or cards?",
    a: "No. You record subscriptions yourself, so you decide what's in the workspace. Payment methods are short labels such as “Company Visa ••4242”; card numbers are refused.",
  },
  {
    q: "How are potential savings estimated?",
    a: "Only from the prices and seats you enter — for example the per-seat cost of unassigned seats, or the difference to an annual price you recorded. When there's nothing to base an amount on, the opportunity is shown without one. Potential savings are kept separate from savings you confirm actually happened.",
  },
  {
    q: "Can we track subscriptions in different currencies?",
    a: "Yes. Each subscription keeps its own currency, and totals are shown per currency. Amounts are never converted or added across currencies.",
  },
  {
    q: "Can my colleagues use the same workspace?",
    a: "Yes. Owners and admins give access by email with a role — Admin, Finance, Member or Read-only — and roles are enforced on the server. No invitation email is sent: the colleague signs in with Google using that address and joins.",
  },
  {
    q: "Does it remind us about renewals?",
    a: "Yes, as in-app notifications 30, 14 and 7 days before each renewal by default, or the windows you choose. Email reminders aren't available yet.",
  },
  {
    q: "Can we export or delete our data?",
    a: "Yes. Subscriptions and reports export to CSV, the whole workspace exports to JSON, and the workspace owner can delete the workspace and everything in it.",
  },
  {
    q: "Can I try it without entering our data?",
    a: "After signing in you can open a separate demo workspace with a fictional company's sample data. It never mixes with your own workspace.",
  },
];

const steps = [
  { title: "Sign in with Google", body: "One button for new and returning users. No password to manage." },
  { title: "Create your workspace", body: "Add your company name, default currency and time zone." },
  { title: "Add your software", body: "Record each subscription's price, billing interval, renewal date, owner and seats." },
  { title: "Act on what it shows", body: "See spend by vendor, category and department, decide on renewals, and review savings." },
];

const principles = [
  { icon: "lock" as const, title: "Google sign-in, basic profile only", body: "Name, email address and profile picture. Saver Option doesn't request Gmail, Drive or Calendar access and doesn't keep Google access tokens." },
  { icon: "shield" as const, title: "Your workspace stays yours", body: "Every request is checked against your membership on the server, and the database itself refuses links between records of different workspaces." },
  { icon: "users" as const, title: "Role-based permissions", body: "Owners, admins, finance, members and read-only viewers each get what their role allows — enforced on the server, not just hidden in the interface." },
  { icon: "credit-card" as const, title: "You choose what to record", body: "No bank or card connections. Card numbers are never stored — a payment method is just a label." },
  { icon: "download" as const, title: "Export or delete any time", body: "Download your workspace as JSON or CSV whenever you like; the owner can delete it permanently." },
];

export default async function BusinessLandingPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const q = await props.searchParams;
  const { user } = await getBizSession();
  const ready = businessReady();
  const google = ready && (await googleSignInEnabled());

  const summary = summarizeSpend(example, "2026-10-23");
  const byCategory = [...groupMonthly(example, (s) => (s as Example).category).entries()].map(([label, t]) => ({ label, value: t.USD ?? 0, display: `${usd(t.USD ?? 0)}/mo` })).sort((a, b) => b.value - a.value);
  const byDepartment = [...groupMonthly(example, (s) => (s as Example).department).entries()].map(([label, t]) => ({ label, value: t.USD ?? 0, display: `${usd(t.USD ?? 0)}/mo` })).sort((a, b) => b.value - a.value);
  const byInterval = [...groupMonthly(example, (s) => s.billingInterval).entries()].map(([k, t]) => ({ label: billingIntervalLabels[k], value: t.USD ?? 0, display: `${usd(t.USD ?? 0)}/mo` })).sort((a, b) => b.value - a.value);
  const seated = example.filter((s) => s.purchasedSeats).map((s) => ({ s, seats: seatSummary(s) }));
  const unused = seated.reduce((t, x) => t + (x.seats.unusedMonthly ?? 0), 0);
  const design = seated.find((x) => x.s.id === "2")!.seats;
  const docs = seated.find((x) => x.s.id === "5")!.seats;

  const cta = user ? (
    <Link href="/business/dashboard" className={buttonClass("primary", "lg")}>
      Open your dashboard <Icon name="arrow-right" size={15} />
    </Link>
  ) : (
    <div className="w-full max-w-xs">
      <GoogleButton next="/business/dashboard" disabled={!google} />
    </div>
  );

  return (
    <>
      <BusinessPublicHeader signedIn={Boolean(user)} />
      <div className="theme-dark">
        <section className="hero-glow border-b border-line">
          <Container className="grid grid-cols-1 gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center lg:gap-14">
            <div className="min-w-0">
              {q.signed_out === "1" && (
                <div className="mb-5 max-w-md">
                  <FormMessage tone="success">You&apos;ve been signed out.</FormMessage>
                </div>
              )}
              <Eyebrow>
                <strong>Saver Option Business</strong>
                <span aria-hidden="true">•</span>
                Software spend management
              </Eyebrow>
              <h1 className="mt-5 max-w-2xl text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.035em] text-heading sm:text-[3.5rem]">Spend smarter on software.</h1>
              <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">
                Track subscriptions, manage renewals, optimize licenses, and uncover opportunities to save — all from one workspace.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {cta}
                <Link href="#features" className={buttonClass("secondary", "lg")}>
                  Explore features
                </Link>
              </div>
              {!user && !google && (
                <p className="mt-3 max-w-md text-[13px] text-warn">{ready ? "Google sign-in isn't switched on yet. Please check back a little later." : "Saver Option Business isn't switched on for this site yet."}</p>
              )}
              <p className="mt-4 text-[13px] text-faint">Google sign-in only · your name, email and profile picture, nothing more.</p>
            </div>

            <div className="theme-light rounded-[20px] border border-line bg-bg p-4 text-fg shadow-[0_24px_60px_-30px_rgb(0_0_0/0.6)]">
              <ExampleLabel />
              <div className="grid grid-cols-2 gap-3">
                <Kpi label="Monthly software spend" value={<Money totals={summary.monthly} preferred="USD" />} sub={`${summary.activeCount} active subscriptions`} />
                <Kpi label="Annualized spend" value={<Money totals={summary.annualized} preferred="USD" />} sub="Run-rate × 12" />
              </div>
              <div className="biz-card mt-3 p-4">
                <p className="mb-3 text-[13px] font-semibold">Spending by category</p>
                <BarList caption="Example: spending by category" rows={byCategory} max={4} />
              </div>
            </div>
          </Container>
        </section>
      </div>

      <section id="features" className="scroll-mt-20 border-b border-line">
        <Container className="py-16 sm:py-20">
          <SectionHeading
            title={
              <>
                Everything about your software, <em>in one place</em>
              </>
            }
            description="Built on what your team records — nothing is estimated until there's data to base it on."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <Feature icon="layers" title="Subscription tracking" body="Every plan with its price, currency, billing interval, renewal date, owner, department and contract notes. Search, filter, export to CSV.">
              <ul className="divide-y divide-line text-[13px]">
                {example.slice(0, 4).map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-2 py-1.5">
                    <span className="min-w-0 truncate">{s.name}</span>
                    <span className="flex shrink-0 items-center gap-2">
                      <Pill>{billingIntervalLabels[s.billingInterval]}</Pill>
                      <span className="tabular w-20 text-right font-medium">{usd(monthlyEquivalent(s)!)}/mo</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Feature>
            <Feature icon="chart" title="Spending dashboard" body="Monthly and annualized cost, spend by vendor, category and department, and how much is billed monthly versus yearly.">
              <StackedBar caption="Example: monthly equivalent by billing interval" segments={byInterval} />
            </Feature>
            <Feature icon="calendar" title="Renewal reminders" body="A renewal calendar, decisions to renew, renegotiate or cancel, and in-app reminders before each renewal and cancellation deadline.">
              <ul className="space-y-2 text-[13px]">
                {[
                  { name: "CRM", when: "in 9 days", amount: usd(90_000), note: "Cancel within 4 days" },
                  { name: "Design tool", when: "in 21 days", amount: usd(144_000), note: "Yearly" },
                  { name: "Team chat", when: "in 26 days", amount: usd(12_000), note: "Monthly" },
                ].map((r) => (
                  <li key={r.name} className="flex items-center justify-between gap-2">
                    <span>
                      <span className="font-medium">{r.name}</span> <span className="text-faint">renews {r.when}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <Pill tone={r.note.startsWith("Cancel") ? "warn" : "neutral"}>{r.note}</Pill>
                      <span className="tabular font-medium">{r.amount}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Feature>
            <Feature icon="key" title="License management" body="Purchased versus assigned seats, who holds each one, and what unassigned seats cost when the plan is priced per seat.">
              <ul className="space-y-2.5 text-[13px]">
                {seated.map(({ s, seats }) => (
                  <li key={s.id}>
                    <div className="flex justify-between gap-2">
                      <span>{s.name}</span>
                      <span className="text-faint">
                        {seats.assigned} of {seats.purchased} seats
                      </span>
                    </div>
                    <Meter value={seats.utilization} label={`${s.name} utilization`} />
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[12.5px] text-muted">Unassigned seats cost about {usd(unused)} a month.</p>
            </Feature>
            <Feature icon="piggy" title="Savings opportunities" body="Explainable findings — unused seats, potential overlap, annual billing, renewals to review and matching Saver Option deals — each with its evidence.">
              <ul className="space-y-2.5 text-[13px]">
                <li className="rounded-lg border border-line bg-surface p-2.5">
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">{design.available} unused seats on Design tool</span>
                    <span className="tabular font-medium">{usd((design.unusedMonthly ?? 0) * 12)}/yr</span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-muted">From the per-seat price you pay. Confidence: high.</p>
                </li>
                <li className="rounded-lg border border-line bg-surface p-2.5">
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">Docs &amp; wiki is {Math.round(docs.utilization ?? 0)}% utilized</span>
                    <span className="text-faint">Potential</span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-muted">A flat-priced plan: shown for review without an amount, since it depends on the vendor&apos;s smaller plans.</p>
                </li>
              </ul>
            </Feature>
            <Feature icon="trending-up" title="Reports & analytics" body="Spend by vendor, category, department and billing interval, renewal commitments, utilization and savings — filtered by date, currency and team, exported to CSV.">
              <BarList caption="Example: spending by department" rows={byDepartment} max={4} />
            </Feature>
          </div>
        </Container>
      </section>

      <section id="how-it-works" className="scroll-mt-20 border-b border-line bg-surface">
        <Container className="py-16 sm:py-20">
          <SectionHeading
            title={
              <>
                How it <em>works</em>
              </>
            }
          />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-line bg-bg p-5">
                <span className="flex size-8 items-center justify-center rounded-full bg-accent-soft text-[14px] font-semibold text-accent-ink">{i + 1}</span>
                <h3 className="mt-3 text-[15.5px] font-semibold text-heading">{s.title}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-line-strong p-5">
            <Icon name="tag" size={18} className="text-accent-ink" />
            <p className="min-w-0 flex-1 text-[14px] text-muted">
              Savings opportunities link to matching listings in the <Link href="/deals" className="text-accent-ink underline underline-offset-2">Saver Option deals catalog</Link> —
              discounts, credits and alternatives from the providers&apos; own pages.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-line">
        <Container className="py-16 sm:py-20">
          <SectionHeading
            title={
              <>
                Privacy and security <em>principles</em>
              </>
            }
            description="How Saver Option Business handles your company's data."
          />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((p) => (
              <li key={p.title} className="rounded-2xl border border-line bg-surface p-5">
                <Icon name={p.icon} size={20} className="text-accent-ink" />
                <h3 className="mt-3 text-[15.5px] font-semibold text-heading">{p.title}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-muted">{p.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="faq" className="scroll-mt-20 border-b border-line bg-surface">
        <Container className="max-w-3xl py-16 sm:py-20">
          <SectionHeading
            title={
              <>
                Frequently asked <em>questions</em>
              </>
            }
          />
          <div className="divide-y divide-line rounded-2xl border border-line bg-bg">
            {faq.map((f) => (
              <details key={f.q} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium text-heading">
                  {f.q}
                  <Icon name="chevron-down" size={16} className="shrink-0 text-faint transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <div className="theme-dark">
        <section className="hero-glow">
          <Container className="flex flex-col items-start gap-6 py-16 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[1.9rem] font-semibold leading-tight tracking-tight text-heading">See where your software budget goes.</h2>
              <p className="mt-2 text-[15px] text-muted">Start with one subscription — the dashboard fills in from there.</p>
            </div>
            {cta}
          </Container>
        </section>
      </div>
      <JsonLd data={faqJsonLd(faq)} />
    </>
  );
}
