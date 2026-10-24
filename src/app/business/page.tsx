import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { GoogleButton } from "@/components/auth/auth-forms";
import { byId, pricePerPeriod, trackable, usd } from "@/components/business/landing/example-data";
import { LicensesVisual, RenewalsVisual, ReportsVisual, SavingsVisual, SpendVisual } from "@/components/business/landing/feature-visuals";
import { HeroPreview } from "@/components/business/landing/hero-preview";
import { LogoStrip } from "@/components/business/landing/logo-strip";
import { FeatureStory, Magnetic, PointerLight, PointerTilt, ScrollScrub, ScrollWords, type StoryItem } from "@/components/business/landing/luxe";
import { FaqAccordion, IconTile } from "@/components/business/landing/sections";
import { Aurora, RevealOnScroll, SpotlightGroup } from "@/components/business/motion";
import { BusinessPublicHeader } from "@/components/business/public-header";
import { LogoStack, SoftwareLogo } from "@/components/business/software-logo";
import { JsonLd } from "@/components/seo/json-ld";
import { FormMessage } from "@/components/ui/form";
import { Icon, type IconProps } from "@/components/ui/icon";
import { buttonClass, Container, SectionHeading } from "@/components/ui/primitives";
import { planLabels, PLANS, TRIAL_DAYS } from "@/lib/business/billing";
import { formatMoney } from "@/lib/business/calc";
import { assistantConfigured } from "@/lib/server/business/assistant";
import { offerViews, type OfferView } from "@/lib/server/business/billing";
import { businessReady, getBizSession } from "@/lib/server/business/context";
import { businessContactEmail, planFeatures } from "@/lib/server/business/plans";
import { googleSignInEnabled } from "@/lib/server/supabase";
import { seatSummary } from "@/lib/business/calc";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

const description =
  "Saver Option Business tracks your company's software subscriptions, renewals and licenses in one workspace, and shows where you could spend less. Sign in with Google.";

export const metadata: Metadata = {
  ...pageMetadata({ title: "Saver Option Business: software spend management", description, path: "/business" }),
  title: { absolute: "Saver Option Business: software spend management" },
};

const baseFaq = [
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
    a: "Yes. Each subscription keeps the currency it's billed in. Amounts across the app are shown in your default currency, converting the others at the European Central Bank's daily reference rate — with the billed amounts, the rate and its date shown alongside.",
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
  const offers = await offerViews();
  const contact = businessContactEmail();
  const faq = [...baseFaq, ...pricingFaq(offers, contact)];

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
      <p className="max-w-md text-[13px] text-warn">
        {ready ? "Google sign-in isn't switched on yet. Please check back a little later." : "Saver Option Business isn't switched on for this site yet."}
      </p>
    ) : null;

  const story: StoryItem[] = [
    {
      id: "feature-renewals",
      icon: "calendar",
      eyebrow: "Subscriptions & renewals",
      title: (
        <>
          Never be surprised by a <em className="accent">renewal.</em>
        </>
      ),
      body: "Record each subscription once — price, currency, billing interval, renewal date, owner and department — and see what's coming up on a timeline.",
      bullets: [
        "In-app reminders 30, 14 and 7 days before renewals and cancellation deadlines",
        "Decide to renew, renegotiate or cancel, with the history kept",
        "Search, filter and export the list to CSV",
      ],
      visual: <RenewalsVisual />,
    },
    {
      id: "feature-spend",
      icon: "chart",
      eyebrow: "Spending dashboard",
      title: (
        <>
          See where the budget <em className="accent">goes.</em>
        </>
      ),
      body: "Monthly and annualized run-rate, broken down by vendor, category and department — calculated only from what your team records.",
      bullets: ["Totals in your default currency, converted at the ECB's daily rate", "Spend by vendor, category and department", "Monthly versus yearly billing at a glance"],
      visual: <SpendVisual />,
    },
    {
      id: "feature-seats",
      icon: "key",
      eyebrow: "Licenses & seats",
      title: (
        <>
          Pay for the seats you <em className="accent">use.</em>
        </>
      ),
      body: "Compare purchased and assigned seats on every plan, see who holds each one, and what unassigned seats cost on per-seat pricing.",
      bullets: [
        "Assign, reassign and release seats person by person",
        "Utilization per plan and across the workspace",
        "Seats are assigned or reported by your team — never presented as measured usage",
      ],
      visual: <LicensesVisual />,
    },
    {
      id: "feature-savings",
      icon: "piggy",
      eyebrow: "Savings opportunities",
      title: (
        <>
          Find savings you can <em className="accent">explain.</em>
        </>
      ),
      body: "Rules look for unused seats, potential overlap, monthly plans worth checking for annual billing and renewals to review — each finding shows the evidence behind it.",
      bullets: [
        "Estimates only where your prices and seats support one — potential, not guaranteed",
        "Potential savings kept separate from savings you confirm",
        "Matching offers from the Saver Option deals catalog",
      ],
      visual: <SavingsVisual />,
    },
    {
      id: "feature-reports",
      icon: "download",
      eyebrow: "Reports & exports",
      title: (
        <>
          Reports that match the <em className="accent">dashboard.</em>
        </>
      ),
      body: "Filter by date range, currency, category, department and vendor, and export what you see. Reports and the dashboard are built from the same numbers.",
      bullets: ["CSV export for subscriptions and every report", "Full workspace export as JSON", "An audit log of significant changes"],
      visual: <ReportsVisual />,
    },
  ];

  return (
    <div className="theme-dark lx-page text-fg">
      <BusinessPublicHeader signedIn={Boolean(user)} />
      <RevealOnScroll />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <PointerLight className="so-grain relative overflow-hidden border-b border-line">
        <Aurora className="opacity-90" />
        <div aria-hidden="true" className="lx-dots" />
        <div aria-hidden="true" className="lx-dots-lit" />
        <div aria-hidden="true" className="lx-light" />
        <Container className="relative flex flex-col items-center pt-14 text-center sm:pt-24">
          {q.signed_out === "1" && (
            <div className="mb-6 w-full max-w-md text-left">
              <FormMessage tone="success">You&apos;ve been signed out.</FormMessage>
            </div>
          )}
          <Link
            href="/business/mcp"
            className="so-rise group inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] py-1 pl-1 pr-3.5 text-[12.5px] text-muted shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-md transition-colors hover:border-accent/50 hover:text-fg"
          >
            <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-white shadow-[0_0_18px_rgb(124_58_236/0.7)]">New</span>
            Ask Claude about your software spend
            <Icon name="arrow-right" size={13} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <h1 className="display mt-8 max-w-5xl text-[3.3rem] leading-[0.94] sm:text-[5.4rem] lg:text-[6.9rem]">
            <span className="so-rise-blur" style={{ "--d": "80ms" } as CSSProperties}>
              Spend
            </span>{" "}
            <span className="so-rise-blur" style={{ "--d": "180ms" } as CSSProperties}>
              smarter
            </span>{" "}
            <span className="so-rise-blur" style={{ "--d": "280ms" } as CSSProperties}>
              on
            </span>{" "}
            {/* The entrance and the sheen are separate animations, so they sit on separate elements. No filter on
                either: Safari can't clip text to its gradient (background-clip: text) inside a filtered element, so
                the glow is a blurred shape behind the word and the entrance only fades and rises. */}
            <span className="so-rise-soft relative isolate inline-block" style={{ "--d": "400ms" } as CSSProperties}>
              <span aria-hidden="true" className="pointer-events-none absolute -inset-x-[4%] inset-y-[20%] -z-10 rounded-full bg-accent/30 blur-2xl" />
              <em className="accent lx-sheen">software.</em>
            </span>
          </h1>
          <p className="so-rise mt-7 max-w-2xl text-[17px] leading-relaxed text-muted sm:text-[19px]" style={{ "--d": "560ms" } as CSSProperties}>
            Track subscriptions, manage renewals, optimize licenses, and uncover opportunities to save — all from one workspace.
          </p>
          <div className="so-rise mt-9 flex w-full flex-wrap items-center justify-center gap-3" style={{ "--d": "680ms" } as CSSProperties}>
            <Magnetic className="w-full max-w-xs sm:w-auto">{cta}</Magnetic>
            <Link href="#features" className={buttonClass("secondary", "lg")}>
              Explore features
            </Link>
          </div>
          {unavailable && <div className="mt-3">{unavailable}</div>}
          <ul className="so-rise mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] text-faint" style={{ "--d": "800ms" } as CSSProperties}>
            {["Google sign-in only — name, email and picture", "No bank or card connections", "Export or delete any time"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Icon name="check" size={13} className="text-accent-ink" />
                {t}
              </li>
            ))}
          </ul>
        </Container>

        <Container className="relative mt-14 pb-24 sm:mt-20 sm:pb-32">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-[8%] top-[6%] h-[58%] rounded-full bg-accent/35 blur-[110px]" />
          <div className="so-rise relative" style={{ "--d": "760ms" } as CSSProperties}>
            <div className="so-tilt">
              <PointerTilt max={4}>
                <div className="so-beam rounded-[18px]">
                  <HeroPreview />
                </div>
                <HeroFloaters />
              </PointerTilt>
            </div>
          </div>
          <div aria-hidden="true" className="lx-horizon bottom-12 sm:bottom-16" />
        </Container>
      </PointerLight>

      <LogoStrip />

      {/* ── Statement ────────────────────────────────────────────── */}
      <section aria-label="What Saver Option Business is for" className="relative overflow-hidden border-b border-line">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-1/2 size-[520px] -translate-y-1/2 rounded-full bg-accent/15 blur-[120px]" />
        <Container className="relative py-24 sm:py-36">
          <p className="so-reveal mb-8 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-accent-ink">
            <span aria-hidden="true" className="h-px w-8 bg-accent/60" />
            One workspace
          </p>
          <ScrollWords
            className="display max-w-5xl text-[2.3rem] leading-[1.1] sm:text-[3.5rem] lg:text-[4.3rem]"
            text="Every subscription, every seat, every renewal — in one place, with the numbers behind each decision and nothing guessed."
            accent={["subscription", "seat", "renewal"]}
          />
        </Container>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section id="features" className="scroll-mt-20 border-b border-line">
        <Container className="pt-20 sm:pt-28">
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
        </Container>
        <Container className="pb-12 sm:pb-20">
          <FeatureStory items={story} />
        </Container>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section id="how-it-works" className="relative scroll-mt-20 overflow-hidden border-b border-line">
        <Container className="py-20 sm:py-28">
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
          <ScrollScrub className="relative" start={0.85} end={0.55} style={{ "--n": steps.length } as CSSProperties}>
            <span aria-hidden="true" className="pointer-events-none absolute left-[12%] right-[12%] top-[42px] hidden h-px bg-line lg:block" />
            <span
              aria-hidden="true"
              className="lx-draw-x pointer-events-none absolute left-[12%] right-[12%] top-[42px] hidden h-px bg-linear-to-r from-accent via-[#cdb9ff] to-accent shadow-[0_0_18px_rgb(124_58_236/0.9)] lg:block"
            />
            <SpotlightGroup>
              <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {steps.map((st, i) => (
                  <li key={st.title} className="lx-stagger so-spot lx-glass relative rounded-2xl p-5" style={{ "--i": i } as CSSProperties}>
                    <div className="flex items-center justify-between">
                      <IconTile icon={st.icon} size={44} />
                      <span aria-hidden="true" className="display text-[2.2rem] text-line-strong">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-4 text-[16px] font-semibold text-heading">{st.title}</h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{st.body}</p>
                  </li>
                ))}
              </ol>
            </SpotlightGroup>
          </ScrollScrub>
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
      <section aria-labelledby="privacy-heading" className="so-grain relative overflow-hidden border-b border-line">
        <Aurora className="opacity-60" />
        <Container className="relative py-20 sm:py-28">
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
              {principles.map((pr) => (
                <li key={pr.title} className="so-reveal so-spot lx-glass rounded-2xl p-5">
                  <IconTile icon={pr.icon} size={42} />
                  <h3 className="mt-4 text-[15.5px] font-semibold text-heading">{pr.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{pr.body}</p>
                </li>
              ))}
              <li className="so-reveal flex flex-col justify-between rounded-2xl border border-dashed border-line-strong p-5">
                <p className="text-[14px] leading-relaxed text-muted">
                  How Saver Option handles personal data across the site, including Google sign-in, is described in the privacy policy.
                </p>
                <Link href="/privacy" className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent-ink hover:underline underline-offset-4">
                  Read the privacy policy <Icon name="arrow-right" size={14} />
                </Link>
              </li>
            </ul>
          </SpotlightGroup>
        </Container>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────── */}
      <Pricing offers={offers} contact={contact} assistant={assistantConfigured()} signedIn={Boolean(user)} />

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section id="faq" className="scroll-mt-20 border-b border-line">
        <Container className="grid gap-10 py-20 sm:py-28 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:gap-16">
          <div className="so-reveal lg:sticky lg:top-24 lg:self-start">
            <h2 className="display text-[2.4rem] sm:text-[3.2rem]">
              Frequently asked <em>questions</em>
            </h2>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted">What Saver Option Business does — and what it doesn&apos;t do yet.</p>
          </div>
          <FaqAccordion items={faq} />
        </Container>
      </section>

      {/* ── Final call to action ─────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="lx-orb" />
        <div aria-hidden="true" className="lx-ring" />
        <div aria-hidden="true" className="lx-ring" style={{ "--d": "2.3s" } as CSSProperties} />
        <div aria-hidden="true" className="lx-ring" style={{ "--d": "4.6s" } as CSSProperties} />
        <Container className="so-reveal relative flex flex-col items-center py-28 text-center sm:py-40">
          <span className="so-float">
            <LogoStack items={trackable.slice(0, 8)} max={8} size={36} />
          </span>
          <p className="mt-3 text-[12.5px] text-faint">Slack, Figma, AWS — and anything else you pay for</p>
          <h2 className="display mt-7 max-w-4xl text-[2.8rem] leading-[0.98] sm:text-[4.4rem]">
            See where your software budget <em className="accent lx-sheen">goes.</em>
          </h2>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-muted">Start with one subscription — the dashboard fills in from there.</p>
          <div className="mt-9 flex w-full flex-col items-center gap-3">
            <Magnetic className="w-full max-w-xs sm:w-auto">{cta}</Magnetic>
            {unavailable}
          </div>
        </Container>
      </section>
      <JsonLd data={faqJsonLd(faq)} />
    </div>
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
        <div data-depth style={{ "--depth": "-34px" } as CSSProperties}>
          <div
            className="so-float flex w-64 items-center gap-3 rounded-2xl border border-white/15 bg-[#16131f]/80 p-3 text-left shadow-[0_24px_50px_-20px_rgb(0_0_0/0.8)] backdrop-blur-md"
            style={{ "--d": "0ms" } as CSSProperties}
          >
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
      </div>
      <div className="so-rise absolute -left-12 bottom-28" style={{ "--d": "1550ms" } as CSSProperties}>
        <div data-depth style={{ "--depth": "40px" } as CSSProperties}>
          <div
            className="so-float flex w-72 items-center gap-3 rounded-2xl border border-white/15 bg-[#16131f]/80 p-3 text-left shadow-[0_24px_50px_-20px_rgb(0_0_0/0.8)] backdrop-blur-md"
            style={{ "--d": "-3s" } as CSSProperties}
          >
            <span
              className="icon-tile size-9 shrink-0 rounded-[11px]"
              style={
                {
                  "--tile-from": "#22b07d",
                  "--tile-to": "#047857",
                } as CSSProperties
              }
            >
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
    </div>
  );
}

function monthly(offers: OfferView[], plan: OfferView["plan"]): string | null {
  const o = offers.find((x) => x.plan === plan && x.interval === "month");
  return o?.priceMinor != null ? formatMoney(o.priceMinor, o.currency) : null;
}

/** Questions about the trial and plans, with the prices this deployment actually shows. */
function pricingFaq(offers: OfferView[], contact: string): { q: string; a: string }[] {
  const pro = monthly(offers, "pro");
  const business = monthly(offers, "business");
  const prices = [pro && `Pro (${pro}/month)`, business && `Business (${business}/month)`].filter(Boolean).join(" or ");
  return [
    {
      q: "How much does it cost?",
      a: `Every new workspace starts with a ${TRIAL_DAYS}-day free trial with everything included — no card needed. After that you choose a paid plan${prices ? `: ${prices}` : ""}. There's no free plan. Payments are handled by Creem.`,
    },
    {
      q: "What happens when the free trial ends?",
      a: "Software records, reports and the AI tools pause until an owner or admin chooses a plan. Nothing is deleted: your data, settings, members and exports stay available. There's one free trial per account — creating another workspace doesn't start a new one.",
    },
    { q: "Can we cancel?", a: "Yes, any time in Settings → Plan & billing. Cancelling takes effect at the end of the period you've paid for, and you keep access until then." },
    { q: "Do you offer self-hosted or white-label versions?", a: `They're arranged directly with us rather than bought online. Email ${contact} with what you need.` },
  ];
}

/** Pro, Business and the contact-only options; prices come from Creem when it's configured. */
function Pricing({ offers, contact, assistant, signedIn }: { offers: OfferView[]; contact: string; assistant: boolean; signedIn: boolean }) {
  const start = signedIn ? "/business/settings/billing" : "/business/login?next=%2Fbusiness%2Fdashboard";
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="relative scroll-mt-20 overflow-hidden border-b border-line">
      <Container className="py-20 sm:py-28">
        <div className="so-reveal">
          <SectionHeading
            id="pricing-heading"
            title={
              <>
                Simple <em className="accent">pricing</em>
              </>
            }
            description={`Every new workspace starts with a ${TRIAL_DAYS}-day free trial with everything included — no card needed. Then pick a plan; there's no free tier.`}
          />
        </div>
        <SpotlightGroup>
          <ul className="grid gap-4 lg:grid-cols-3">
            {PLANS.map((plan) => {
              const m = offers.find((o) => o.plan === plan && o.interval === "month")!;
              const y = offers.find((o) => o.plan === plan && o.interval === "year")!;
              return (
                <li key={plan} className={`so-reveal so-spot lx-glass flex flex-col rounded-2xl p-6 ${plan === "business" ? "ring-1 ring-accent/40" : ""}`} data-pricing-plan={plan}>
                  <h3 className="text-[18px] font-semibold text-heading">{planLabels[plan]}</h3>
                  <p className="mt-1 text-[13.5px] text-muted">{plan === "pro" ? "For a team getting its software spend in order." : "For larger teams that need more members."}</p>
                  <p className="mt-5">
                    {m.priceMinor != null ? (
                      <>
                        <span className="display text-[2.6rem] leading-none text-heading">{formatMoney(m.priceMinor, m.currency)}</span>
                        <span className="text-[14px] text-muted"> / month</span>
                      </>
                    ) : (
                      <span className="text-[15px] text-muted">Contact us for pricing</span>
                    )}
                  </p>
                  {y.priceMinor != null && (
                    <p className="mt-1 text-[13px] text-faint">
                      or {formatMoney(y.priceMinor, y.currency)} / year
                    </p>
                  )}
                  <ul className="mt-5 grid gap-2 text-[14px] text-muted">
                    {planFeatures(plan, { assistant }).map((f) => (
                      <li key={f} className="flex gap-2">
                        <Icon name="check" size={15} className="mt-0.5 shrink-0 text-accent-ink" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-6">
                    <Link href={start} className={buttonClass(plan === "business" ? "primary" : "secondary", "md", "w-full")}>
                      {signedIn ? "See plans in your workspace" : `Start the ${TRIAL_DAYS}-day free trial`}
                    </Link>
                  </div>
                </li>
              );
            })}
            <li className="so-reveal flex flex-col rounded-2xl border border-dashed border-line-strong p-6" data-pricing-plan="contact">
              <h3 className="text-[18px] font-semibold text-heading">Self-Hosted &amp; White-Label</h3>
              <p className="mt-1 text-[13.5px] text-muted">Run it on your own infrastructure, or offer it under your own brand.</p>
              <p className="mt-5 text-[15px] text-muted">Arranged directly with us — no online checkout.</p>
              <div className="mt-auto pt-6">
                <a href={`mailto:${contact}?subject=${encodeURIComponent("Saver Option Business — Self-Hosted / White-Label inquiry")}`} className={buttonClass("secondary", "md", "w-full")}>
                  <Icon name="mail" size={15} /> Contact us
                </a>
                <p className="mt-2 text-center text-[12px] text-faint">{contact}</p>
              </div>
            </li>
          </ul>
        </SpotlightGroup>
        <p className="so-reveal mt-6 text-center text-[12.5px] text-faint">
          Payments are handled by Creem. Cancel any time; access continues to the end of the paid period. One free trial per account.
        </p>
      </Container>
    </section>
  );
}
