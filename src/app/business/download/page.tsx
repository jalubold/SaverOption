import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { IconTile, type TileTone } from "@/components/business/landing/sections";
import { Aurora, RevealOnScroll } from "@/components/business/motion";
import { BusinessPublicHeader } from "@/components/business/public-header";
import { Icon, type IconProps } from "@/components/ui/icon";
import { buttonClass, Container, Eyebrow, SectionHeading } from "@/components/ui/primitives";
import { AutoDownload } from "@/components/business/auto-download";
import { latestMacRelease, MAC_DOWNLOAD_PATH } from "@/lib/server/desktop-release";
import { pageMetadata } from "@/lib/seo";

const description =
  "Saver Option Business for Mac: your software subscriptions, renewals and savings in their own window, with a Dock icon. Free download for Apple silicon and Intel Macs.";

export const metadata: Metadata = {
  ...pageMetadata({ title: "Saver Option Business for Mac", description, path: "/business/download" }),
  title: { absolute: "Download Saver Option Business for Mac" },
};

// Prerendered like the other public Business pages; the release details refresh every 15 minutes.
export const dynamic = "force-static";
export const revalidate = 900;

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

const perks: { icon: IconProps["name"]; tone: TileTone; title: string; body: string }[] = [
  { icon: "laptop", tone: "violet", title: "Its own window", body: "A Dock icon, ⌘-Tab, and a window that remembers its size and place." },
  { icon: "refresh", tone: "aqua", title: "Always current", body: "The app shows the live Saver Option Business, so new features arrive without reinstalling." },
  { icon: "download", tone: "blue", title: "Exports to Downloads", body: "CSV and JSON exports save straight to your Downloads folder." },
  { icon: "credit-card", tone: "pink", title: "Payments in your browser", body: "Checkout, the billing portal and links to other sites open in your default browser." },
];

const fmtSize = (bytes: number) => (bytes > 0 ? `${(bytes / 1024 / 1024).toFixed(bytes > 100 * 1024 * 1024 ? 0 : 1)} MB` : null);
const fmtDate = (iso: string) => (iso ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(iso)) : null);

export default async function DownloadPage() {
  const lookup = await latestMacRelease();
  const release = lookup.state === "ready" ? lookup.release : null;
  // The site's own download link: it starts the newest .dmg straight away.
  const href = MAC_DOWNLOAD_PATH;
  const meta = release ? [`Version ${release.version}`, fmtSize(release.sizeBytes), fmtDate(release.publishedAt)].filter(Boolean).join(" · ") : null;

  return (
    <div className="theme-dark lx-page text-fg">
      <BusinessPublicHeader />
      <RevealOnScroll />

      <section className="hero-glow so-grain relative overflow-hidden border-b border-line">
        <Aurora className="opacity-80" />
        <Container className="relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
          <div className="min-w-0">
            <Eyebrow className="so-rise">Saver Option Business for Mac</Eyebrow>
            <h1 className="display so-rise mt-5 text-[2.8rem] leading-[1] sm:text-[4rem]" style={{ "--d": "100ms" } as CSSProperties}>
              Your software spend, <em className="accent">in your Dock.</em>
            </h1>
            <p className="so-rise mt-6 max-w-xl text-[17px] leading-relaxed text-muted" style={{ "--d": "250ms" } as CSSProperties}>
              Subscriptions, renewals, seats and savings in a window of their own — the same workspace as on the web, one click from your Dock.
            </p>
            <div className="so-rise mt-8 flex flex-wrap items-center gap-3" style={{ "--d": "380ms" } as CSSProperties}>
              {lookup.state === "none" ? (
                <span className={buttonClass("secondary", "lg", "pointer-events-none w-full max-w-xs opacity-70 sm:w-64")} aria-disabled="true">
                  The first build is on its way
                </span>
              ) : (
                <a href={href} className={buttonClass("primary", "lg", "w-full max-w-xs sm:w-64")} data-download-mac>
                  <Icon name="download" size={16} /> Download for Mac
                </a>
              )}
              <Link href="/business" className={buttonClass("secondary", "lg", "w-full max-w-xs sm:w-64")}>
                Use it in the browser
              </Link>
            </div>
            {lookup.state !== "none" && <AutoDownload href={href} />}
            <p className="so-rise mt-4 text-[13px] text-faint" style={{ "--d": "460ms" } as CSSProperties}>
              Free download · Apple silicon and Intel · macOS 12 Monterey or later
              {meta ? <span className="block sm:inline"> · {meta}</span> : null}
            </p>
          </div>
          <div className="so-rise relative mx-auto" style={{ "--d": "300ms" } as CSSProperties}>
            <div aria-hidden="true" className="pointer-events-none absolute inset-[12%] rounded-full bg-accent/40 blur-[70px]" />
            {/* eslint-disable-next-line @next/next/no-img-element -- a fixed 256 px PNG, no optimization needed */}
            <img src="/business/mac-app-icon.png" alt="Saver Option Business app icon" width={224} height={224} className="relative drop-shadow-[0_30px_50px_rgb(0_0_0/0.45)]" />
          </div>
        </Container>
      </section>

      <section className="border-b border-line">
        <Container className="py-16 sm:py-20">
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
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="so-reveal lx-glass flex flex-col rounded-2xl p-6" style={{ "--d": `${i * 90}ms` } as CSSProperties}>
                <div className="flex items-center justify-between">
                  <IconTile icon={s.icon} tone={s.tone} size={44} />
                  <span className="display text-[2.2rem] leading-none text-faint">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-5 text-[17px] font-semibold text-heading">{s.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-b border-line">
        <Container className="py-16 sm:py-20">
          <div className="so-reveal">
            <SectionHeading
              title={
                <>
                  Made for the <em className="accent">desktop</em>
                </>
              }
              description="Everything Saver Option Business does on the web, with a few things a Mac app does better."
            />
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((p, i) => (
              <li key={p.title} className="so-reveal lx-glass rounded-2xl p-6" style={{ "--d": `${i * 70}ms` } as CSSProperties}>
                <IconTile icon={p.icon} tone={p.tone} size={42} />
                <h3 className="mt-5 text-[16px] font-semibold text-heading">{p.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{p.body}</p>
              </li>
            ))}
          </ul>
          <p className="so-reveal mt-8 max-w-3xl text-[13px] leading-relaxed text-faint">
            Windows and Linux versions aren&apos;t available yet — Saver Option Business works in any modern browser there.
          </p>
        </Container>
      </section>
    </div>
  );
}
