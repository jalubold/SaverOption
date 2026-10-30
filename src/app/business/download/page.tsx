import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { MacAppPreview } from "@/components/business/landing/mac-app-preview";
import { LicensesVisual, RenewalsVisual, SavingsVisual, SpendVisual } from "@/components/business/landing/feature-visuals";
import { Magnetic, PointerLight, PointerTilt, ScrollScrub } from "@/components/business/landing/luxe";
import { IconTile, type TileTone } from "@/components/business/landing/sections";
import { Aurora, RevealOnScroll, SpotlightGroup } from "@/components/business/motion";
import { BusinessPublicHeader } from "@/components/business/public-header";
import { Icon, type IconProps } from "@/components/ui/icon";
import { buttonClass, cn, Container, SectionHeading } from "@/components/ui/primitives";
import { latestMacRelease, MAC_DOWNLOAD_PATH, type MacReleaseLookup } from "@/lib/server/desktop-release";
import { pageMetadata } from "@/lib/seo";

const description =
  "Saver Option Business for Mac: track subscriptions, manage licenses and find savings across your business, in an app of its own. Free download for Apple silicon and Intel Macs.";

export const metadata: Metadata = {
  ...pageMetadata({ title: "Saver Option Business for Mac", description, path: "/business/download" }),
  title: { absolute: "Download Saver Option Business for Mac" },
};

// Prerendered like the other public Business pages; the release details refresh every 15 minutes
// (and at once when a release is published, see /api/desktop/refresh).
export const dynamic = "force-static";
export const revalidate = 900;

const APP_ICON = "/business/mac-app-icon.png";

/** What the Mac app adds, as it's implemented in desktop/src-tauri (shown under the screenshot). */
const desktop: { icon: IconProps["name"]; text: string }[] = [
  { icon: "laptop", text: "Its own window, Dock icon and ⌘-Tab" },
  { icon: "grid", text: "Menu bar and shortcuts, ⌘1–⌘9 for pages" },
  { icon: "clock", text: "Reopens on the page you left" },
];

const benefits: { title: ReactNode; body: string; visual: ReactNode; glow: string }[] = [
  {
    title: (
      <>
        Know where your money <em className="accent">goes.</em>
      </>
    ),
    body: "See all your software spending in one place. Understand monthly costs, annual commitments, and spending by category.",
    visual: <SpendVisual />,
    glow: "rgb(124 58 236 / 0.26)",
  },
  {
    title: (
      <>
        Never miss a <em className="accent">renewal.</em>
      </>
    ),
    body: "Track upcoming renewals, billing dates, and cancellation deadlines before they cost you another month.",
    visual: <RenewalsVisual />,
    glow: "rgb(42 120 214 / 0.24)",
  },
  {
    title: (
      <>
        Manage licenses and <em className="accent">seats.</em>
      </>
    ),
    body: "Know who's using your software, track assigned seats, and identify unused licenses.",
    visual: <LicensesVisual />,
    glow: "rgb(235 104 52 / 0.2)",
  },
  {
    title: (
      <>
        Find opportunities to <em className="accent">save.</em>
      </>
    ),
    body: "Discover potential savings, unnecessary subscriptions, and opportunities to reduce software costs.",
    visual: <SavingsVisual />,
    glow: "rgb(27 175 122 / 0.2)",
  },
];

const steps: { icon: IconProps["name"]; tone: TileTone; title: string; body: string }[] = [
  { icon: "download", tone: "violet", title: "Open the download", body: "Open Saver-Option-Business-mac.dmg and drag Saver Option Business into Applications." },
  {
    icon: "shield",
    tone: "orange",
    title: "Allow it the first time",
    body: "The app isn't notarized by Apple yet, so macOS asks first. Open System Settings → Privacy & Security, find Saver Option Business and choose Open Anyway.",
  },
  {
    icon: "lock",
    tone: "blue",
    title: "Sign in with Google",
    body: "Google sign-in opens in your browser. When it asks to open Saver Option Business, allow it — you're signed in to the app.",
  },
];

const fmtSize = (bytes: number) => (bytes > 0 ? `${(bytes / 1024 / 1024).toFixed(bytes > 100 * 1024 * 1024 ? 0 : 1)} MB` : null);

/** "Free · v0.2.1 · 10.4 MB · macOS 12+ · Apple silicon & Intel": one short line, wrapping only between items. */
function ReleaseMeta({ lookup, withVersion = true, className }: { lookup: MacReleaseLookup; withVersion?: boolean; className?: string }) {
  const release = lookup.state === "ready" ? lookup.release : null;
  const items = ["Free", withVersion && release && `v${release.version}`, release && fmtSize(release.sizeBytes), "macOS 12+", "Apple silicon & Intel"].filter(Boolean);
  return (
    <p className={cn("flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[13px] text-faint", className)}>
      {items.map((t, i) => (
        <span key={i} className="flex items-center gap-2 whitespace-nowrap">
          {i > 0 && <span aria-hidden="true" className="size-[3px] rounded-full bg-current opacity-60" />}
          {t}
        </span>
      ))}
    </p>
  );
}

function DownloadButton({ lookup, mark, className }: { lookup: MacReleaseLookup; mark?: boolean; className?: string }) {
  if (lookup.state === "none") {
    return (
      <span className={buttonClass("secondary", "lg", cn("pointer-events-none w-full opacity-70", className))} aria-disabled="true">
        The first build is on its way
      </span>
    );
  }
  return (
    <a
      href={MAC_DOWNLOAD_PATH}
      className={buttonClass("primary", "lg", cn("so-shine-hover w-full shadow-[0_14px_40px_-12px_rgb(124_58_236/0.8)]", className))}
      {...(mark ? { "data-download-mac": "" } : {})}
    >
      <Icon name="download" size={16} /> Download for Mac
    </a>
  );
}

export default async function DownloadPage() {
  const lookup = await latestMacRelease();
  const version = lookup.state === "ready" ? lookup.release.version : null;

  return (
    <div className="theme-dark lx-page text-fg">
      <BusinessPublicHeader />
      <RevealOnScroll />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <PointerLight className="so-grain relative overflow-hidden border-b border-line">
        <Aurora className="opacity-90" />
        <div aria-hidden="true" className="lx-dots" />
        <div aria-hidden="true" className="lx-dots-lit" />
        <div aria-hidden="true" className="lx-light" />
        <Container className="relative flex flex-col items-center pt-14 text-center sm:pt-20">
          <span className="so-rise inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.04] py-1 pl-1 pr-3.5 text-[12.5px] text-muted shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-md">
            {/* eslint-disable-next-line @next/next/no-img-element -- a fixed 512 px PNG, no optimization needed */}
            <img src={APP_ICON} alt="" width={24} height={24} className="size-6 rounded-[6px]" />
            <span className="font-medium text-fg">Saver Option Business for Mac</span>
            <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-white shadow-[0_0_18px_rgb(124_58_236/0.7)]">{version ? `v${version}` : "New"}</span>
          </span>
          <h1 className="display mt-8 max-w-4xl text-[2.9rem] leading-[0.98] sm:text-[4.4rem] lg:text-[5.2rem]">
            <span className="so-rise-blur block" style={{ "--d": "100ms" } as CSSProperties}>
              Your software spend,
            </span>{" "}
            {/* Entrance and sheen on separate elements, no filter around the sheen (Safari can't clip text to a
                gradient inside a filtered element); the glow is a blurred shape behind the words. */}
            <span className="so-rise-soft relative isolate inline-block" style={{ "--d": "240ms" } as CSSProperties}>
              <span aria-hidden="true" className="pointer-events-none absolute -inset-x-[3%] inset-y-[22%] -z-10 rounded-full bg-accent/30 blur-2xl" />
              <em className="accent lx-sheen">under control.</em>
            </span>{" "}
            <span className="so-rise mt-4 block font-sans text-[1.15rem] font-medium leading-snug tracking-normal text-heading/90 sm:mt-5 sm:text-[1.45rem]" style={{ "--d": "380ms" } as CSSProperties}>
              Now on your Mac.
            </span>
          </h1>
          <p className="so-rise mt-5 max-w-xl text-[16.5px] leading-relaxed text-muted sm:text-[18px]" style={{ "--d": "480ms" } as CSSProperties}>
            Track subscriptions, manage licenses, and find savings across your business — all from one place.
          </p>
          <div className="so-rise mt-9 flex w-full flex-wrap items-center justify-center gap-3" style={{ "--d": "600ms" } as CSSProperties}>
            {/* Both buttons share one width, side by side or stacked. */}
            <Magnetic className="w-full max-w-xs">
              <DownloadButton lookup={lookup} mark />
            </Magnetic>
            <Link href="/business" className={buttonClass("secondary", "lg", "w-full max-w-xs")}>
              Use it in the browser
            </Link>
          </div>
          <div className="so-rise mt-5" style={{ "--d": "720ms" } as CSSProperties}>
            {/* The version is in the badge above. */}
            <ReleaseMeta lookup={lookup} withVersion={false} />
          </div>
        </Container>

        <Container className="relative mt-14 pb-16 sm:mt-20 sm:pb-20">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-[8%] top-[6%] h-[60%] rounded-full bg-accent/30 blur-[120px]" />
          <div className="so-rise relative mx-auto max-w-[1080px]" style={{ "--d": "760ms" } as CSSProperties}>
            <div className="so-tilt">
              <PointerTilt max={2}>
                <MacAppPreview />
              </PointerTilt>
            </div>
          </div>
          <ul className="so-rise relative mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[13.5px] text-muted" style={{ "--d": "900ms" } as CSSProperties}>
            {desktop.map((d) => (
              <li key={d.text} className="flex items-center gap-2">
                <Icon name={d.icon} size={15} className="text-accent-ink" />
                {d.text}
              </li>
            ))}
          </ul>
          <p className="relative mt-3 text-center text-[12px] text-faint">Shown with example data.</p>
        </Container>
      </PointerLight>

      {/* ── What it does ─────────────────────────────────────────── */}
      <section className="relative border-b border-line">
        <Container className="py-20 sm:py-28">
          <div className="so-reveal">
            <SectionHeading
              title={
                <>
                  One workspace for every <em className="accent">software decision.</em>
                </>
              }
              description="The same Saver Option Business you use in the browser — now in an app of its own."
            />
          </div>
          <div className="mt-14 space-y-20 sm:mt-20 sm:space-y-28">
            {benefits.map((b, i) => (
              <article key={i} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div className={cn("so-reveal min-w-0", i % 2 === 1 && "lg:order-2")}>
                  <p className="flex items-center gap-3 text-accent-ink">
                    <span className="display text-[1.35rem] leading-none">{String(i + 1).padStart(2, "0")}</span>
                    <span aria-hidden="true" className="h-px w-12 bg-linear-to-r from-accent to-transparent" />
                  </p>
                  <h3 className="display mt-5 text-[2.2rem] leading-[1.02] sm:text-[2.9rem]">{b.title}</h3>
                  <p className="mt-4 max-w-md text-[16px] leading-relaxed text-muted">{b.body}</p>
                </div>
                <div className={cn("so-reveal so-scroll-viz relative isolate min-w-0", i % 2 === 1 && "lg:order-1")}>
                  <div aria-hidden="true" className="pointer-events-none absolute inset-x-6 inset-y-10 -z-10 rounded-full blur-3xl" style={{ background: b.glow }} />
                  {b.visual}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Install ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-line">
        <Container className="py-20 sm:py-28">
          <div className="so-reveal">
            <SectionHeading
              title={
                <>
                  Install in <em className="accent">three steps</em>
                </>
              }
              description="About a minute, once."
            />
          </div>
          <ScrollScrub className="relative mt-10" start={0.85} end={0.55} style={{ "--n": steps.length } as CSSProperties}>
            <span aria-hidden="true" className="pointer-events-none absolute left-[16%] right-[16%] top-[46px] hidden h-px bg-line md:block" />
            <span
              aria-hidden="true"
              className="lx-draw-x pointer-events-none absolute left-[16%] right-[16%] top-[46px] hidden h-px bg-linear-to-r from-accent via-[#cdb9ff] to-accent shadow-[0_0_18px_rgb(124_58_236/0.9)] md:block"
            />
            <SpotlightGroup>
              <ol className="relative grid gap-4 md:grid-cols-3">
                {steps.map((s, i) => (
                  <li key={s.title} className="lx-stagger so-spot lx-glass flex flex-col rounded-3xl p-6" style={{ "--i": i } as CSSProperties}>
                    <div className="flex items-center justify-between">
                      <IconTile icon={s.icon} tone={s.tone} size={46} />
                      <span aria-hidden="true" className="display text-[2.4rem] leading-none text-line-strong">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-5 text-[17px] font-semibold text-heading">{s.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-muted">{s.body}</p>
                  </li>
                ))}
              </ol>
            </SpotlightGroup>
          </ScrollScrub>
        </Container>
      </section>

      {/* ── Final call to action ─────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="lx-orb" />
        <div aria-hidden="true" className="lx-ring" />
        <div aria-hidden="true" className="lx-ring" style={{ "--d": "2.3s" } as CSSProperties} />
        <div aria-hidden="true" className="lx-ring" style={{ "--d": "4.6s" } as CSSProperties} />
        <Container className="so-reveal relative flex flex-col items-center py-28 text-center sm:py-40">
          <span className="so-float block">
            {/* eslint-disable-next-line @next/next/no-img-element -- a fixed 512 px PNG, no optimization needed */}
            <img src={APP_ICON} alt="" width={88} height={88} className="size-[88px] drop-shadow-[0_20px_36px_rgb(0_0_0/0.5)]" />
          </span>
          <h2 className="display mt-8 max-w-3xl text-[2.7rem] leading-[0.98] sm:text-[4.2rem]">
            Your software spend, <em className="accent lx-sheen">one click away.</em>
          </h2>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-muted">Download once — new features arrive without reinstalling.</p>
          <div className="mt-9 flex w-full flex-col items-center gap-4">
            <Magnetic className="w-full max-w-xs">
              <DownloadButton lookup={lookup} />
            </Magnetic>
            <ReleaseMeta lookup={lookup} />
          </div>
          <p className="mt-10 max-w-md text-[12.5px] leading-relaxed text-faint">
            Windows and Linux versions aren&apos;t available yet — Saver Option Business works in any modern browser there.
          </p>
        </Container>
      </section>
    </div>
  );
}
