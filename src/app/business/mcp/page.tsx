import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { GoogleButton } from "@/components/auth/auth-forms";
import { CopyField } from "@/components/business/copy-field";
import { McpChatPreview } from "@/components/business/landing/mcp-chat-preview";
import { FaqAccordion, IconTile, type TileTone } from "@/components/business/landing/sections";
import { Aurora, RevealOnScroll, SpotlightGroup } from "@/components/business/motion";
import { BusinessPublicHeader } from "@/components/business/public-header";
import { SoftwareLogo } from "@/components/business/software-logo";
import { JsonLd } from "@/components/seo/json-ld";
import { Icon, type IconProps } from "@/components/ui/icon";
import { buttonClass, Container, Eyebrow, SectionHeading } from "@/components/ui/primitives";
import { formatIsoDate } from "@/lib/business/calc";
import { mcpClients, type McpClientInfo } from "@/lib/business/mcp-clients";
import { assistantConfigured } from "@/lib/server/business/assistant";
import { businessReady, getBizSession } from "@/lib/server/business/context";
import { urlsFromHeaders } from "@/lib/server/mcp/pending";
import { SCOPE_READ, SCOPE_WRITE } from "@/lib/server/mcp/oauth";
import { toolsFor } from "@/lib/server/mcp/tools";
import { googleSignInEnabled } from "@/lib/server/supabase";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

const description =
  "Connect Claude or another AI assistant that supports remote MCP servers to your Saver Option Business workspace, and ask about subscriptions, renewals, spending and savings in plain language.";

export const metadata: Metadata = {
  ...pageMetadata({ title: "Ask your AI assistant about your software spend (MCP) — Saver Option Business", description, path: "/business/mcp" }),
  title: { absolute: "Ask your AI assistant about your software spend (MCP) — Saver Option Business" },
};

// Logos only identify each client; listing one doesn't mean it's supported or endorses Saver Option.
const clientLogos: Record<McpClientInfo["id"], string> = {
  claude: "/logos/business/claude.svg",
  chatgpt: "/logos/chatgpt.svg",
  gemini: "/logos/gemini-api.svg",
  grok: "/logos/business/grok.svg",
};

// Where each vendor documents remote MCP support (summarised from mcp-clients.ts → documented).
const clientWhere: Record<McpClientInfo["id"], string> = {
  claude: "Custom connectors on claude.ai, in the desktop and mobile apps, and in Claude Code.",
  chatgpt: "Remote MCP servers in ChatGPT's developer mode (beta), depending on plan and workspace settings.",
  gemini: "Remote MCP servers in the Gemini CLI.",
  grok: "Remote MCP tools through the xAI API.",
};

const prompts: { q: string; tool: string; write?: boolean }[] = [
  { q: "What do we spend on software every month?", tool: "get_spend_summary" },
  { q: "Which subscriptions renew in the next 30 days?", tool: "get_upcoming_renewals" },
  { q: "Where are we paying for seats nobody uses?", tool: "get_savings_opportunities" },
  { q: "Do we have tools that do the same job?", tool: "find_duplicate_tools" },
  { q: "Which vendors and categories cost us the most?", tool: "get_spending_by_vendor" },
  { q: "Are there Saver Option deals for the software we use?", tool: "get_deals_for_my_software" },
  { q: "Write a savings report for our finance review.", tool: "generate_savings_report" },
  { q: "Add Loom at $15 a month, renewing on the 1st.", tool: "create_subscription", write: true },
];

const steps: { icon: IconProps["name"]; title: string; body: string }[] = [
  { icon: "copy", title: "Copy the server URL", body: "One address for every workspace — you pick the workspace when you sign in." },
  { icon: "link", title: "Add it to your AI client", body: "As a custom connector or remote MCP server, following your client's own steps." },
  { icon: "lock", title: "Sign in and choose access", body: "Sign in with Google on Saver Option, pick the workspace, and choose Read only or Read and change." },
  { icon: "sparkles", title: "Ask in plain language", body: "Your assistant calls the tools it needs and answers with the numbers and where they came from." },
];

const safety: { icon: IconProps["name"]; tone: TileTone; title: string; body: string }[] = [
  { icon: "key", tone: "violet", title: "You choose the access", body: "On Saver Option's own sign-in screen you pick one workspace and Read only (the default) or Read and change." },
  { icon: "check", tone: "aqua", title: "Changes wait for your OK", body: "Adding or updating a subscription returns a preview first. It's saved only after you confirm, and every change is in the audit log." },
  { icon: "credit-card", tone: "orange", title: "Nothing moves money", body: "No tool cancels, renews or buys anything at a vendor, and none can make a payment." },
  { icon: "shield", tone: "blue", title: "One workspace, your role", body: "A connection reaches only the workspace you approved, with your role's permissions, checked on every call." },
  { icon: "clock", tone: "indigo", title: "Short-lived, revocable access", body: "Access tokens last an hour and are stored only as hashes. Disconnect in Settings and access ends straight away." },
  { icon: "chart", tone: "violet", title: "Numbers that say what they are", body: "Each figure is labeled actual, normalized estimate or projection, and currencies are never converted or added together." },
];

const listOf = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}`);

export default async function McpLandingPage() {
  const { user } = await getBizSession();
  const ready = businessReady();
  const google = ready && (await googleSignInEnabled());
  const urls = await urlsFromHeaders();
  const readTools = toolsFor([SCOPE_READ]);
  const writeTools = toolsFor([SCOPE_READ, SCOPE_WRITE]).filter((t) => t.write);
  const tested = mcpClients.filter((c) => c.status === "verified" || c.status === "partial");
  const untested = mcpClients.filter((c) => c.status === "not_tested").map((c) => c.name);

  const faq = [
    {
      q: "Which AI assistants can I connect?",
      a: `Any client that supports remote MCP servers with OAuth sign-in should be able to connect. ${
        tested.length
          ? tested.map((c) => `${c.name} has been tested with this server (${formatIsoDate(c.lastVerified!)}): ${c.summary}`).join(" ")
          : "No client has been tested end to end with this server yet."
      }${untested.length ? ` ${listOf(untested)} haven't been tested yet.` : ""}`,
    },
    {
      q: "Does the AI see all of our data?",
      a: "No. It receives only what a tool returns for the question it's working on — a spend summary, a list of renewals, a savings opportunity — from the one workspace you approved. It never receives sign-in tokens, and Saver Option doesn't store card numbers.",
    },
    {
      q: "Can it change our records?",
      a: "Only with Read and change access, and only subscriptions: it can add one or update one. Each change comes back as a preview with what was understood, and is saved after you confirm. With Read only access it can't change anything.",
    },
    {
      q: "Can it cancel or buy software for us?",
      a: "No. Nothing in the MCP server cancels, renews or purchases anything at a vendor, or moves money. It can point you to the subscription in Saver Option or to a listed deal, and you decide what to do.",
    },
    {
      q: "What does the AI provider do with our conversations?",
      a: "Tool results go to the AI client you connected. How that provider stores or uses conversations is set by its own terms and your account settings, so check them before connecting a company workspace.",
    },
    {
      q: "How do we disconnect?",
      a: "Open Settings → AI clients (MCP) in the workspace and choose Disconnect; access ends immediately. Owners and admins see every connection to the workspace there. You can also remove the connector in the AI client.",
    },
    ...(assistantConfigured()
      ? [{ q: "Is there an assistant inside Saver Option too?", a: "Yes. The AI Savings Assistant in the app uses the same tools and the same rules, so you can ask without connecting an outside client." }]
      : []),
  ];

  const primary = user ? (
    <Link href="/business/settings/mcp" className={buttonClass("primary", "lg")}>
      Connect an AI client <Icon name="arrow-right" size={15} />
    </Link>
  ) : (
    <div className="so-shine-hover w-full max-w-xs shadow-[0_10px_30px_-12px_rgb(124_58_236/0.55)]">
      <GoogleButton next="/business/settings/mcp" disabled={!google} />
    </div>
  );

  return (
    <>
      <BusinessPublicHeader signedIn={Boolean(user)} />
      <RevealOnScroll />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="theme-dark">
        <section className="hero-glow so-grain relative overflow-hidden border-b border-line">
          <Aurora />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgb(255_255_255/0.08)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(70%_60%_at_50%_0%,#000_30%,transparent_100%)]"
          />
          <Container className="relative grid gap-12 py-12 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-center lg:gap-14">
            <div className="min-w-0">
              <div className="so-rise">
                <Eyebrow>
                  <strong>Saver Option Business</strong>
                  <span aria-hidden="true">•</span>
                  MCP server
                </Eyebrow>
              </div>
              <h1 className="display so-rise-blur mt-6 text-[2.8rem] leading-[1] sm:text-[4rem] lg:text-[4.4rem]" style={{ "--d": "100ms" } as CSSProperties}>
                Ask your AI about your <em className="accent [text-shadow:0_0_48px_color-mix(in_oklab,var(--accent)_65%,transparent)]">software spend.</em>
              </h1>
              <p className="so-rise mt-6 max-w-xl text-[17px] leading-relaxed text-muted" style={{ "--d": "300ms" } as CSSProperties}>
                Connect Claude or another assistant that supports remote MCP servers to your workspace. It answers from your own subscriptions, renewals and savings — with the
                numbers and how they were calculated.
              </p>
              <div className="so-rise mt-8 flex flex-wrap items-center gap-3" style={{ "--d": "420ms" } as CSSProperties}>
                {primary}
                <Link href="/business/docs/mcp" className={buttonClass("secondary", "lg")}>
                  Setup guide
                </Link>
              </div>
              {!user && !google && (
                <p className="mt-3 max-w-md text-[13px] text-warn">
                  {ready ? "Google sign-in isn't switched on yet. Please check back a little later." : "Saver Option Business isn't switched on for this site yet."}
                </p>
              )}
              <div className="so-rise mt-8 max-w-lg" style={{ "--d": "540ms" } as CSSProperties}>
                <p className="mb-2 text-[12.5px] font-medium text-faint">Server URL</p>
                <CopyField value={urls.mcp} label="MCP server URL" />
                <p className="mt-2 text-[12px] text-faint">Streamable HTTP · OAuth 2.1 sign-in with PKCE · read only unless you allow changes</p>
              </div>
            </div>
            <div className="so-rise relative min-w-0" style={{ "--d": "450ms" } as CSSProperties}>
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-[10%] top-[10%] h-[70%] rounded-full bg-accent/30 blur-[90px]" />
              <McpChatPreview className="relative" />
            </div>
          </Container>
        </section>
      </div>

      {/* ── Compatibility ────────────────────────────────────────── */}
      <section id="clients" className="scroll-mt-20 border-b border-line">
        <Container className="py-16 sm:py-24">
          <div className="so-reveal">
            <SectionHeading
              title={
                <>
                  Use the assistant you <em>already have</em>
                </>
              }
              description="Saver Option speaks the open Model Context Protocol (MCP) with OAuth sign-in — the way these assistants connect to remote tools."
            />
          </div>
          <SpotlightGroup>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {mcpClients.map((c) => (
                <li key={c.id} className="so-reveal so-spot biz-card-lift relative flex flex-col rounded-2xl border border-line bg-surface p-5">
                  <SoftwareLogo name={c.name} src={clientLogos[c.id]} size={40} />
                  <h3 className="mt-4 text-[16px] font-semibold text-heading">{c.name}</h3>
                  <p className="text-[12.5px] text-faint">{c.vendor}</p>
                  <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-muted">{clientWhere[c.id]}</p>
                  <Link href={`/business/docs/mcp/${c.id}`} className="mt-4 inline-flex items-center gap-1 text-[13.5px] font-semibold text-accent-ink hover:underline underline-offset-4">
                    Details <Icon name="arrow-right" size={13} />
                  </Link>
                </li>
              ))}
            </ul>
          </SpotlightGroup>
          <p className="so-reveal mt-5 text-[12.5px] leading-relaxed text-faint">
            {tested.length
              ? `Tested end to end so far: ${listOf(tested.map((c) => `${c.name} (${formatIsoDate(c.lastVerified!)})`))} — the others are next, see each client's details. `
              : "None of these has been tested end to end with this server yet. "}
            Names and logos belong to their owners and identify each client only — no partnership or endorsement is implied. Which plans can add custom connectors is decided by each
            provider.
          </p>
        </Container>
      </section>

      {/* ── How to connect ───────────────────────────────────────── */}
      <section id="connect" className="scroll-mt-20 border-b border-line bg-surface">
        <Container className="py-16 sm:py-24">
          <div className="so-reveal">
            <SectionHeading
              title={
                <>
                  Connect in <em>a minute</em>
                </>
              }
              description="No API keys to copy around: your AI client signs in to Saver Option, and you approve exactly what it can reach."
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
          <div className="so-reveal mt-8 flex flex-col gap-3 rounded-2xl border border-dashed border-line-strong p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="min-w-0 text-[14px] leading-relaxed text-muted">
              Signed in already? Your workspace&apos;s <strong className="font-semibold text-fg">Settings → AI clients (MCP)</strong> page has the URL, the client status and every
              connection, with Disconnect.
            </p>
            <Link href={user ? "/business/settings/mcp" : "/business/docs/mcp"} className={buttonClass("secondary", "md", "shrink-0")}>
              {user ? "Open AI clients (MCP)" : "Read the setup guide"} <Icon name="arrow-right" size={14} />
            </Link>
          </div>
        </Container>
      </section>

      {/* ── What you can ask ─────────────────────────────────────── */}
      <section id="ask" className="scroll-mt-20 border-b border-line">
        <Container className="py-16 sm:py-24">
          <div className="so-reveal">
            <SectionHeading
              title={
                <>
                  What you can <em>ask</em>
                </>
              }
              description="Plain questions; the assistant picks the tool. Answers come from your workspace's records, never from guesses."
            />
          </div>
          <SpotlightGroup>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {prompts.map((p) => (
                <li key={p.q} className="so-reveal so-spot biz-card-lift relative flex flex-col rounded-2xl border border-line bg-surface p-5">
                  <Icon name={p.write ? "plus" : "search"} size={17} className="text-accent-ink" />
                  <p className="mt-3 flex-1 text-[15px] font-medium leading-snug text-heading">&ldquo;{p.q}&rdquo;</p>
                  <p className="mt-4 flex flex-wrap items-center gap-1.5 text-[11.5px] text-faint">
                    <code className="rounded bg-subtle px-1.5 py-0.5 font-mono text-[11px] text-muted">{p.tool}</code>
                    {p.write && <span>· preview, then you confirm</span>}
                  </p>
                </li>
              ))}
            </ul>
          </SpotlightGroup>
        </Container>
      </section>

      {/* ── Safety ───────────────────────────────────────────────── */}
      <div className="theme-dark">
        <section aria-labelledby="safety-heading" className="so-grain relative overflow-hidden border-b border-line">
          <Aurora className="opacity-70" />
          <Container className="relative py-16 sm:py-24">
            <div className="so-reveal">
              <SectionHeading
                id="safety-heading"
                title={
                  <>
                    Built so you stay <em className="accent">in control</em>
                  </>
                }
                description="The same permissions and checks as the app itself — an AI client never gets more than the person who connected it."
              />
            </div>
            <SpotlightGroup>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {safety.map((p) => (
                  <li key={p.title} className="so-reveal so-spot rounded-2xl border border-line bg-surface/70 p-5 backdrop-blur-sm">
                    <IconTile icon={p.icon} tone={p.tone} size={42} />
                    <h3 className="mt-4 text-[15.5px] font-semibold text-heading">{p.title}</h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{p.body}</p>
                  </li>
                ))}
              </ul>
            </SpotlightGroup>
            <p className="so-reveal mt-6 text-[14px] text-muted">
              More detail in{" "}
              <Link href="/business/docs/mcp/security" className="font-semibold text-accent-ink underline-offset-4 hover:underline">
                MCP security and permissions
              </Link>
              .
            </p>
          </Container>
        </section>
      </div>

      {/* ── Tools ────────────────────────────────────────────────── */}
      <section id="tools" className="scroll-mt-20 border-b border-line bg-surface">
        <Container className="grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)] lg:gap-16">
          <div className="so-reveal lg:sticky lg:top-24 lg:self-start">
            <h2 className="display text-[2.25rem] sm:text-[3rem]">
              {readTools.length + writeTools.length} tools, <em>one workspace</em>
            </h2>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted">
              Every connection can read. Changing records needs Read and change access, and each change is previewed first.
            </p>
            <Link href="/business/docs/mcp#tools" className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent-ink hover:underline underline-offset-4">
              Inputs and outputs for each tool <Icon name="arrow-right" size={14} />
            </Link>
          </div>
          <div className="so-reveal grid gap-4">
            <div className="rounded-2xl border border-line bg-bg p-5">
              <p className="flex items-center gap-2 text-[13px] font-semibold text-heading">
                <Icon name="eye" size={15} className="text-accent-ink" /> Read · {readTools.length}
              </p>
              <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {readTools.map((t) => (
                  <li key={t.name} className="min-w-0">
                    <code className="block truncate font-mono text-[12.5px] text-fg">{t.name}</code>
                    <span className="block text-[12.5px] text-faint">{t.title}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-line bg-bg p-5">
              <p className="flex items-center gap-2 text-[13px] font-semibold text-heading">
                <Icon name="plus" size={15} className="text-accent-ink" /> Change · {writeTools.length}
              </p>
              <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {writeTools.map((t) => (
                  <li key={t.name} className="min-w-0">
                    <code className="block truncate font-mono text-[12.5px] text-fg">{t.name}</code>
                    <span className="block text-[12.5px] text-faint">{t.title}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 rounded-xl bg-subtle px-3 py-2.5 text-[12.5px] leading-relaxed text-muted">
                Called without <code className="font-mono text-[11.5px]">confirm: true</code> they only return a preview. Nothing is cancelled, renewed or bought.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section id="faq" className="scroll-mt-20 border-b border-line">
        <Container className="grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:gap-16">
          <div className="so-reveal lg:sticky lg:top-24 lg:self-start">
            <h2 className="display text-[2.25rem] sm:text-[3rem]">
              Questions about <em>AI access</em>
            </h2>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted">What an AI client can and can&apos;t do with your workspace.</p>
          </div>
          <FaqAccordion items={faq} />
        </Container>
      </section>

      {/* ── Final call to action ─────────────────────────────────── */}
      <div className="theme-dark">
        <section className="hero-glow so-grain relative overflow-hidden">
          <Aurora />
          <Container className="so-reveal relative flex flex-col items-center py-16 text-center sm:py-24">
            <span className="so-float flex size-14 items-center justify-center rounded-2xl bg-accent text-white shadow-[0_18px_40px_-14px_rgb(124_58_236/0.9)]">
              <Icon name="sparkles" size={26} />
            </span>
            <h2 className="display mt-6 max-w-3xl text-[2.5rem] sm:text-[3.6rem]">
              Your numbers, in the assistant <em className="accent">you already use.</em>
            </h2>
            <p className="mt-4 max-w-md text-[16px] leading-relaxed text-muted">Add a few subscriptions, connect your AI client, and ask your first question.</p>
            <div className="mt-8 flex w-full flex-col items-center gap-3">{primary}</div>
          </Container>
        </section>
      </div>
      <JsonLd data={faqJsonLd(faq)} />
    </>
  );
}
