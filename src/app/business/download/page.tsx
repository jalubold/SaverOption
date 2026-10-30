import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { AutoDownload } from "@/components/business/auto-download";
import { MacScene } from "@/components/business/download/mac-scene";
import { Magnetic, PointerLight, PointerTilt, ScrollScrub } from "@/components/business/landing/luxe";
import { IconTile, type TileTone } from "@/components/business/landing/sections";
import { Aurora, RevealOnScroll, SpotlightGroup } from "@/components/business/motion";
import { BusinessPublicHeader } from "@/components/business/public-header";
import { Icon, type IconProps } from "@/components/ui/icon";
import { buttonClass, cn, Container, SectionHeading } from "@/components/ui/primitives";
import { latestMacRelease, MAC_DOWNLOAD_PATH, type MacReleaseLookup } from "@/lib/server/desktop-release";
import { pageMetadata } from "@/lib/seo";

const description =
  "Saver Option Business for Mac: your software subscriptions, renewals and savings in their own window, with a Dock icon. Free download for Apple silicon and Intel Macs.";

export const metadata: Metadata = {
  ...pageMetadata({ title: "Saver Option Business for Mac", description, path: "/business/download" }),
  title: { absolute: "Download Saver Option Business for Mac" },
};

// Prerendered like the other public Business pages; the release details refresh every 15 minutes
// (and at once when a release is published, see /api/desktop/refresh).
export const dynamic = "force-static";
export const revalidate = 900;

const APP_ICON = "/business/mac-app-icon.png";

const shortcuts: { keys: string[]; label: string }[] = [
  { keys: ["⌘", "1–9"], label: "Jump to any page" },
  { keys: ["⌘", "K"], label: "Quick jump" },
  { keys: ["⌘", "["], label: "Back" },
  { keys: ["⌘", "]"], label: "Forward" },
  { keys: ["⌘", ","], label: "Settings" },
  { keys: ["⌘", "R"], label: "Reload" },
];

const native: { icon: IconProps["name"]; tone: TileTone; title: string; body: string }[] = [
  { icon: "clock", tone: "blue", title: "Picks up where you left off", body: "Opens on the page you last had open, in the same size and place." },
  { icon: "arrow-left", tone: "aqua", title: "Swipe back and forward", body: "Two fingers on the trackpad, just like you'd expect on a Mac." },
  { icon: "lock", tone: "orange", title: "Sign in once", body: "Google sign-in opens in your browser and hands you straight back to the app." },
  { icon: "refresh", tone: "pink", title: "Always current", body: "New features arrive without reinstalling, and the app tells you when a new version is out." },
  { icon: "download", tone: "indigo", title: "Files and payments", body: "Exports save to Downloads; checkout and outside links open in your default browser." },
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

function Keys({ keys }: { keys: string[] }) {
  return (
    <span className="flex shrink-0 gap-1">
      {keys.map((k) => (
        <kbd key={k} className="dl-key">
          {k}
        </kbd>
      ))}
    </span>
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
        <Container className="relative flex flex-col items-center pt-12 text-center sm:pt-20">
          <div className="so-rise relative">
            <div aria-hidden="true" className="pointer-events-none absolute inset-[8%] rounded-[32%] bg-accent/55 blur-[46px]" />
            <span className="so-float block">
              {/* eslint-disable-next-line @next/next/no-img-element -- a fixed 512 px PNG, no optimization needed */}
              <img src={APP_ICON} alt="Saver Option Business app icon" width={128} height={128} className="relative size-[104px] drop-shadow-[0_24px_40px_rgb(0_0_0/0.5)] sm:size-[128px]" />
            </span>
          </div>
          <span
            className="so-rise mt-7 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] py-1 pl-1 pr-3.5 text-[12.5px] text-muted shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-md"
            style={{ "--d": "120ms" } as CSSProperties}
          >
            <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-white shadow-[0_0_18px_rgb(124_58_236/0.7)]">{version ? `v${version}` : "New"}</span>
            Saver Option Business for Mac
          </span>
          <h1 className="display mt-7 max-w-5xl text-[3.1rem] leading-[0.95] sm:text-[5rem] lg:text-[6.2rem]">
            <span className="so-rise-blur" style={{ "--d": "180ms" } as CSSProperties}>
              Your software spend,
            </span>{" "}
            {/* Entrance and sheen on separate elements, no filter around the sheen (Safari can't clip text to a
                gradient inside a filtered element); the glow is a blurred shape behind the words. */}
            <span className="so-rise-soft relative isolate inline-block" style={{ "--d": "360ms" } as CSSProperties}>
              <span aria-hidden="true" className="pointer-events-none absolute -inset-x-[3%] inset-y-[22%] -z-10 rounded-full bg-accent/30 blur-2xl" />
              <em className="accent lx-sheen">in your Dock.</em>
            </span>
          </h1>
          <p className="so-rise mt-6 max-w-xl text-[17px] leading-relaxed text-muted sm:text-[19px]" style={{ "--d": "520ms" } as CSSProperties}>
            The whole workspace in a Mac app of its own — native window, menus and shortcuts.
          </p>
          <div className="so-rise mt-9 flex w-full flex-wrap items-center justify-center gap-3" style={{ "--d": "640ms" } as CSSProperties}>
            {/* Both buttons share one width, side by side or stacked. */}
            <Magnetic className="w-full max-w-xs">
              <DownloadButton lookup={lookup} mark />
            </Magnetic>
            <Link href="/business" className={buttonClass("secondary", "lg", "w-full max-w-xs")}>
              Use it in the browser
            </Link>
          </div>
          <div className="so-rise mt-5" style={{ "--d": "760ms" } as CSSProperties}>
            {/* The version is in the badge above. */}
            <ReleaseMeta lookup={lookup} withVersion={false} />
          </div>
          {lookup.state !== "none" && <AutoDownload href={MAC_DOWNLOAD_PATH} />}
        </Container>

        <Container className="relative mt-14 pb-20 sm:mt-20 sm:pb-28">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-[6%] top-[4%] h-[62%] rounded-full bg-accent/30 blur-[120px]" />
          <div className="so-rise relative" style={{ "--d": "780ms" } as CSSProperties}>
            <div className="so-tilt">
              <PointerTilt max={3}>
                <MacScene />
              </PointerTilt>
            </div>
          </div>
          <div aria-hidden="true" className="lx-horizon bottom-10 sm:bottom-14" />
        </Container>
      </PointerLight>

      {/* ── Made for the Mac ─────────────────────────────────────── */}
      <section className="relative border-b border-line">
        <Container className="py-20 sm:py-28">
          <div className="so-reveal">
            <SectionHeading
              title={
                <>
                  Made for the <em className="accent">Mac.</em>
                </>
              }
              description="Everything Saver Option Business does on the web, with what a Mac app does better."
            />
          </div>
          <SpotlightGroup>
            <ul className="mt-10 grid gap-4 lg:grid-cols-3">
              <li className="so-reveal so-spot lx-glass relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:col-span-2 lg:row-span-2">
                <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-accent/25 blur-[90px]" />
                <IconTile icon="grid" tone="violet" size={46} />
                <h3 className="display mt-6 text-[2rem] leading-[1.05] text-heading sm:text-[2.5rem]">
                  Keyboard <em className="accent">first.</em>
                </h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">Every page is a shortcut away, from the menu bar or straight from the keys.</p>
                <ul className="relative mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {shortcuts.map((s) => (
                    <li key={s.label} className="flex items-center gap-4">
                      <Keys keys={s.keys} />
                      <span className="text-[14.5px] text-fg">{s.label}</span>
                    </li>
                  ))}
                </ul>
              </li>
              {native.map((n, i) => (
                <li key={n.title} className="so-reveal so-spot lx-glass rounded-3xl p-6" style={{ "--d": `${(i + 1) * 70}ms` } as CSSProperties}>
                  <IconTile icon={n.icon} tone={n.tone} size={42} />
                  <h3 className="mt-5 text-[16px] font-semibold text-heading">{n.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{n.body}</p>
                </li>
              ))}
            </ul>
          </SpotlightGroup>
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
            Your workspace, <em className="accent lx-sheen">one click away.</em>
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
