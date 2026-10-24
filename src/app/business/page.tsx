import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { GoogleButton } from "@/components/auth/auth-forms";
import { byId, pricePerPeriod, trackable, usd } from "@/components/business/landing/example-data";
import { LicensesVisual, RenewalsVisual, ReportsVisual, SavingsVisual, SpendVisual } from "@/components/business/landing/feature-visuals";
import { HeroPreview } from "@/components/business/landing/hero-preview";
import { LogoStrip } from "@/components/business/landing/logo-strip";
import { FaqAccordion, FeatureRow, IconTile } from "@/components/business/landing/sections";
import { Aurora, SpotlightGroup } from "@/components/business/motion";
import { BusinessPublicHeader } from "@/components/business/public-header";
import { LogoStack, SoftwareLogo } from "@/components/business/software-logo";
import { JsonLd } from "@/components/seo/json-ld";
import { FormMessage } from "@/components/ui/form";
import { Icon, type IconProps } from "@/components/ui/icon";
import { buttonClass, Container, Eyebrow, SectionHeading } from "@/components/ui/primitives";
import { businessReady, getBizSession } from "@/lib/server/business/context";
import { googleSignInEnabled } from "@/lib/server/supabase";
import { seatSummary } from "@/lib/business/calc";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

const description =
  "Saver Option Business tracks your company's software subscriptions, renewals and licenses in one workspace, and shows where you could spend less. Sign in with Google.";

export const metadata: Metadata = {
  ...pageMetadata({ title: "Saver Option Business: software spend management", description, path: "/business" }),
  title: { absolute: "Saver Option Business: software spend management" },
};

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

const steps: { icon: IconProps["name"]; title: string; body: string }[] = [
  { icon: "lock", title: "Sign in with Google", body: "One button for new and returning users. No password to manage." },
  { icon: "building", title: "Create your workspace", body: "Add your company name, default currency and time zone." },
  { icon: "plus", title: "Add your software", body: "Record each subscription's price, billing interval, renewal date, owner and seats." },
  { icon: "trending-up", title: "Act on what it shows", body: "See spend by vendor, category and department, decide on renewals, and review savings." },
];

const principles: { icon: IconProps["name"]; title: string; body: string }[] = [
  { icon: "lock", title: "Google sign-in, basic profile only", body: "Name, email address and profile picture. Saver Option doesn't request Gmail, Drive or Calendar access and doesn't keep Google access tokens." },
  { icon: "shield", title: "Your workspace stays yours", body: "Every request is checked against your membership on the server, and the database itself refuses links between records of different workspaces." },
  { icon: "users", title: "Role-based permissions", body: "Owners, admins, finance, members and read-only viewers each get what their role allows — enforced on the server, not just hidden in the interface." },
  { icon: "credit-card", title: "You choose what to record", body: "No bank or card connections. Card numbers are never stored — a payment method is just a label." },
  { icon: "download", title: "Export or delete any time", body: "Download your workspace as JSON or CSV whenever you like; the owner can delete it permanently." },
];

export default async function BusinessLandingPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const q = await props.searchParams;
  const { user } = await getBizSession();
  const ready = businessReady();
  const google = ready && (await googleSignInEnabled());

  const cta = user ? (
    <Link href="/business/dashboard" className={buttonClass("primary", "lg")}>
      Open your dashboard <Icon name="arrow-right" size={15} />
    </Link>
  ) : (
    <div className="so-shine-hover w-full max-w-xs shadow-[0_10px_30px_-12px_rgb(124_58_236/0.55)]">
      <GoogleButton next="/business/dashboard" disabled={!google} />
    </div>
  );
  const unavailable =
    !user && !google ? (
      <p className="max-w-md text-[13px] text-warn">{ready ? "Google sign-in isn't switched on yet. Please check back a little later." : "Saver Option Business isn't switched on for this site yet."}</p>
    ) : null;

  return (
    <>
      <BusinessPublicHeader signedIn={Boolean(user)} />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="theme-dark">
        <section className="hero-glow so-grain relative overflow-hidden border-b border-line">
          <Aurora />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgb(255_255_255/0.08)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(70%_60%_at_50%_0%,#000_30%,transparent_100%)]"
          />
          <Container className="relative pt-12 sm:pt-20">
            {q.signed_out === "1" && (
              <div className="mb-5 max-w-md">
                <FormMessage tone="success">You&apos;ve been signed out.</FormMessage>
              </div>
            )}
            <div className="max-w-3xl">
              <div className="so-rise">
                <Eyebrow>
                  <strong>Saver Option Business</strong>
                  <span aria-hidden="true">•</span>
                  Software spend management
                </Eyebrow>
              </div>
              <h1 className="display mt-6 text-[3.1rem] leading-[0.98] sm:text-[4.6rem] lg:text-[5.4rem]">
                <span className="so-rise-blur" style={{ "--d": "80ms" } as CSSProperties}>
                  Spend
                </span>{" "}
                <span className="so-rise-blur" style={{ "--d": "160ms" } as CSSProperties}>
                  smarter
                </span>{" "}
                <span className="so-rise-blur" style={{ "--d": "240ms" } as CSSProperties}>
                  on
                </span>{" "}
                <em className="accent so-rise-blur [text-shadow:0_0_48px_color-mix(in_oklab,var(--accent)_65%,transparent)]" style={{ "--d": "360ms" } as CSSProperties}>
                  software.
                </em>
              </h1>
              <p className="so-rise mt-6 max-w-xl text-[17px] leading-relaxed text-muted sm:text-[18px]" style={{ "--d": "520ms" } as CSSProperties}>
                Track subscriptions, manage renewals, optimize licenses, and uncover opportunities to save — all from one workspace.
              </p>
              <div className="so-rise mt-8 flex flex-wrap items-center gap-3" style={{ "--d": "640ms" } as CSSProperties}>
                {cta}
                <Link href="#features" className={buttonClass("secondary", "lg")}>
                  Explore features
                </Link>
              </div>
              {unavailable && <div className="mt-3">{unavailable}</div>}
              <ul className="so-rise mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-faint" style={{ "--d": "760ms" } as CSSProperties}>
                {["Google sign-in only — name, email and picture", "No bank or card connections", "Export or delete any time"].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <Icon name="check" size={13} className="text-accent-ink" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Container>

          <Container className="relative mt-12 pb-14 sm:mt-16 sm:pb-20">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-[8%] top-[6%] h-[55%] rounded-full bg-accent/30 blur-[90px]" />
            <div className="so-rise relative" style={{ "--d": "700ms" } as CSSProperties}>
              <div className="so-tilt">
                <div className="so-beam rounded-[18px]">
                  <HeroPreview />
                </div>
              </div>
              <HeroFloaters />
            </div>
          </Container>
        </section>
      </div>

      <LogoStrip />

      {/* ── Features ─────────────────────────────────────────────── */}
      <section id="features" className="scroll-mt-20 border-b border-line">
        <Container className="py-16 sm:py-24">
          <div className="so-reveal">
            <SectionHeading
              title={
                <>
                  Everything about your software, <em>in one place</em>
                </>
              }
              description="Built on what your team records — nothing is estimated until there's data to base it on."
            />
          </div>
          <SpotlightGroup className="mt-12 space-y-20 sm:space-y-28">
            <FeatureRow
              icon="calendar"
              tone="violet"
              eyebrow="Subscriptions & renewals"
              title={
                <>
                  Never be surprised by a <em className="accent">renewal.</em>
                </>
              }
              body="Record each subscription once — price, currency, billing interval, renewal date, owner and department — and see what's coming up on a timeline."
              bullets={[
                "In-app reminders 30, 14 and 7 days before renewals and cancellation deadlines",
                "Decide to renew, renegotiate or cancel, with the history kept",
                "Search, filter and export the list to CSV",
              ]}
              visual={<RenewalsVisual />}
            />
            <FeatureRow
              flip
              icon="chart"
              tone="blue"
              eyebrow="Spending dashboard"
              title={
                <>
                  See where the budget <em className="accent">goes.</em>
                </>
              }
              body="Monthly and annualized run-rate, broken down by vendor, category and department — calculated only from what your team records."
              bullets={["Totals per currency — amounts are never converted or mixed", "Spend by vendor, category and department", "Monthly versus yearly billing at a glance"]}
              visual={<SpendVisual />}
            />
            <FeatureRow
              icon="key"
              tone="aqua"
              eyebrow="Licenses & seats"
              title={
                <>
                  Pay for the seats you <em className="accent">use.</em>
                </>
              }
              body="Compare purchased and assigned seats on every plan, see who holds each one, and what unassigned seats cost on per-seat pricing."
              bullets={[
                "Assign, reassign and release seats person by person",
                "Utilization per plan and across the workspace",
                "Seats are assigned or reported by your team — never presented as measured usage",
              ]}
              visual={<LicensesVisual />}
            />
            <FeatureRow
              flip
              icon="piggy"
              tone="orange"
              eyebrow="Savings opportunities"
              title={
                <>
                  Find savings you can <em className="accent">explain.</em>
                </>
              }
              body="Rules look for unused seats, potential overlap, monthly plans worth checking for annual billing and renewals to review — each finding shows the evidence behind it."
              bullets={[
                "Estimates only where your prices and seats support one — potential, not guaranteed",
                "Potential savings kept separate from savings you confirm",
                "Matching offers from the Saver Option deals catalog",
              ]}
              visual={<SavingsVisual />}
            />
            <FeatureRow
              icon="download"
              tone="indigo"
              eyebrow="Reports & exports"
              title={
                <>
                  Reports that match the <em className="accent">dashboard.</em>
                </>
              }
              body="Filter by date range, currency, category, department and vendor, and export what you see. Reports and the dashboard are built from the same numbers."
              bullets={["CSV export for subscriptions and every report", "Full workspace export as JSON", "An audit log of significant changes"]}
              visual={<ReportsVisual />}
            />
          </SpotlightGroup>
        </Container>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section id="how-it-works" className="scroll-mt-20 border-b border-line bg-surface">
        <Container className="py-16 sm:py-24">
          <div className="so-reveal">
            <SectionHeading
              title={
                <>
                  How it <em>works</em>
                </>
              }
              description="From sign-in to your first overview in four steps."
            />
          </div>
          <SpotlightGroup>
            <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <span aria-hidden="true" className="pointer-events-none absolute left-[12%] right-[12%] top-[42px] hidden h-px bg-linear-to-r from-transparent via-accent/40 to-transparent lg:block" />
              {steps.map((s, i) => (
                <li key={s.title} className="so-reveal so-spot biz-card-lift relative rounded-2xl border border-line bg-bg p-5">
                  <div className="flex items-center justify-between">
                    <IconTile icon={s.icon} size={44} />
                    <span aria-hidden="true" className="display text-[2.2rem] text-line-strong">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-4 text-[16px] font-semibold text-heading">{s.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{s.body}</p>
                </li>
              ))}
            </ol>
          </SpotlightGroup>
          <div className="so-reveal mt-8 grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl border border-dashed border-line-strong p-5">
              <Icon name="eye" size={18} className="mt-0.5 text-accent-ink" />
              <p className="min-w-0 flex-1 text-[14px] leading-relaxed text-muted">
                Prefer to look around first? After signing in you can open a separate demo workspace with a fictional company&apos;s sample data.
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-dashed border-line-strong p-5">
              <Icon name="tag" size={18} className="mt-0.5 text-accent-ink" />
              <p className="min-w-0 flex-1 text-[14px] leading-relaxed text-muted">
                Savings opportunities link to matching listings in the{" "}
                <Link href="/deals" className="text-accent-ink underline underline-offset-2">
                  Saver Option deals catalog
                </Link>{" "}
                — discounts, credits and alternatives from the providers&apos; own pages.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Privacy & security ───────────────────────────────────── */}
      <div className="theme-dark">
        <section aria-labelledby="privacy-heading" className="so-grain relative overflow-hidden border-b border-line">
          <Aurora className="opacity-70" />
          <Container className="relative py-16 sm:py-24">
            <div className="so-reveal">
              <SectionHeading
                id="privacy-heading"
                title={
                  <>
                    Privacy and security <em className="accent">principles</em>
                  </>
                }
                description="How Saver Option Business handles your company's data."
              />
            </div>
            <SpotlightGroup>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {principles.map((p) => (
                  <li key={p.title} className="so-reveal so-spot rounded-2xl border border-line bg-surface/70 p-5 backdrop-blur-sm">
                    <IconTile icon={p.icon} size={42} />
                    <h3 className="mt-4 text-[15.5px] font-semibold text-heading">{p.title}</h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{p.body}</p>
                  </li>
                ))}
                <li className="so-reveal flex flex-col justify-between rounded-2xl border border-dashed border-line-strong p-5">
                  <p className="text-[14px] leading-relaxed text-muted">How Saver Option handles personal data across the site, including Google sign-in, is described in the privacy policy.</p>
                  <Link href="/privacy" className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent-ink hover:underline underline-offset-4">
                    Read the privacy policy <Icon name="arrow-right" size={14} />
                  </Link>
                </li>
              </ul>
            </SpotlightGroup>
          </Container>
        </section>
      </div>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section id="faq" className="scroll-mt-20 border-b border-line">
        <Container className="grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:gap-16">
          <div className="so-reveal lg:sticky lg:top-24 lg:self-start">
            <h2 className="display text-[2.25rem] sm:text-[3rem]">
              Frequently asked <em>questions</em>
            </h2>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted">What Saver Option Business does — and what it doesn&apos;t do yet.</p>
          </div>
          <FaqAccordion items={faq} />
        </Container>
      </section>

      {/* ── Final call to action ─────────────────────────────────── */}
      <div className="theme-dark">
        <section className="hero-glow so-grain relative overflow-hidden">
          <Aurora />
          <Container className="so-reveal relative flex flex-col items-center py-16 text-center sm:py-24">
            <span className="so-float">
              <LogoStack items={trackable.slice(0, 8)} max={8} size={36} />
            </span>
            <p className="mt-3 text-[12.5px] text-faint">Slack, Figma, AWS — and anything else you pay for</p>
            <h2 className="display mt-6 max-w-3xl text-[2.5rem] sm:text-[3.6rem]">
              See where your software budget <em className="accent">goes.</em>
            </h2>
            <p className="mt-4 max-w-md text-[16px] leading-relaxed text-muted">Start with one subscription — the dashboard fills in from there.</p>
            <div className="mt-8 flex w-full flex-col items-center gap-3">
              {cta}
              {unavailable}
            </div>
          </Container>
        </section>
      </div>
      <JsonLd data={faqJsonLd(faq)} />
    </>
  );
}

/** Two example notifications floating beside the hero preview (large screens only). */
function HeroFloaters() {
  const slack = byId("slack");
  const notion = byId("notion");
  const notionSeats = seatSummary(notion);
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden xl:block">
      <div className="so-rise absolute -right-8 -top-9" style={{ "--d": "1300ms" } as CSSProperties}>
        <div className="so-float flex w-64 items-center gap-3 rounded-2xl border border-white/15 bg-[#16131f]/80 p-3 text-left shadow-[0_24px_50px_-20px_rgb(0_0_0/0.8)] backdrop-blur-md" style={{ "--d": "0ms" } as CSSProperties}>
          <span className="relative">
            <SoftwareLogo name={slack.name} src={slack.logo} size={36} />
            <span className="viz-live absolute -right-1 -top-1 size-2.5 rounded-full bg-accent" />
          </span>
          <span className="min-w-0">
            <span className="block text-[13px] font-semibold text-white">
              {slack.name} renews in {slack.renewsIn} days
            </span>
            <span className="block text-[11.5px] text-white/60">{pricePerPeriod(slack)} · Example reminder</span>
          </span>
        </div>
      </div>
      <div className="so-rise absolute -left-12 bottom-28" style={{ "--d": "1550ms" } as CSSProperties}>
        <div className="so-float flex w-72 items-center gap-3 rounded-2xl border border-white/15 bg-[#16131f]/80 p-3 text-left shadow-[0_24px_50px_-20px_rgb(0_0_0/0.8)] backdrop-blur-md" style={{ "--d": "-3s" } as CSSProperties}>
          <span className="icon-tile size-9 shrink-0 rounded-[11px]" style={{ "--tile-from": "#22b07d", "--tile-to": "#047857" } as CSSProperties}>
            <Icon name="piggy" size={17} />
          </span>
          <span className="min-w-0">
            <span className="block text-[13px] font-semibold text-white">
              {notionSeats.available} unused {notion.name} seats
            </span>
            <span className="block text-[11.5px] text-white/60">≈ {usd((notionSeats.unusedMonthly ?? 0) * 12)}/yr potential · Example</span>
          </span>
        </div>
      </div>
    </div>
  );
}
