import type { CSSProperties } from "react";
import { BrandMark } from "@/components/brand/logo";
import { HeroPreview } from "@/components/business/landing/hero-preview";
import { IconTile, type TileTone } from "@/components/business/landing/sections";
import type { IconProps } from "@/components/ui/icon";
import { cn } from "@/components/ui/primitives";

/**
 * The download page's hero picture: a Mac desktop with the app's menu bar, its Go menu open,
 * the app window (example data) and the Dock with the app icon. Decorative only.
 */

const menus = ["Edit", "View", "Go", "Window", "Help"];

const goMenu: { label: string; keys: string }[] = [
  { label: "Back", keys: "⌘[" },
  { label: "Forward", keys: "⌘]" },
  { label: "", keys: "" },
  { label: "Overview", keys: "⌘1" },
  { label: "Subscriptions", keys: "⌘2" },
  { label: "Renewals", keys: "⌘3" },
  { label: "Software", keys: "⌘4" },
  { label: "Licenses & Seats", keys: "⌘5" },
  { label: "Analytics", keys: "⌘6" },
  { label: "Savings", keys: "⌘7" },
];

// Generic tiles standing in for other apps in the Dock.
const dock: { icon: IconProps["name"]; tone: TileTone; wide?: boolean }[] = [
  { icon: "mail", tone: "blue" },
  { icon: "calendar", tone: "orange" },
  { icon: "image", tone: "pink", wide: true },
  { icon: "code", tone: "indigo", wide: true },
  { icon: "chart", tone: "aqua" },
];

export function MacScene() {
  return (
    <div aria-hidden="true" className="relative isolate overflow-hidden rounded-[22px] border border-white/12 shadow-[0_60px_120px_-50px_rgb(0_0_0/0.95),inset_0_1px_0_rgb(255_255_255/0.12)] sm:rounded-[30px]">
      <div className="dl-wallpaper absolute inset-0 -z-10" />

      {/* Menu bar */}
      <div className="relative z-20 flex h-7 items-center gap-4 bg-black/35 px-4 text-[12px] text-white/90 backdrop-blur-xl sm:h-8 sm:gap-5 sm:px-5">
        <BrandMark size={14} />
        <span className="font-semibold">Saver Option Business</span>
        {menus.map((m) =>
          m === "Go" ? (
            <span key={m} className="relative hidden md:inline">
              <span className="-mx-2 rounded-[5px] bg-white/22 px-2 py-0.5">Go</span>
              <span className="so-rise absolute left-[-10px] top-[calc(100%+7px)] hidden w-60 rounded-[11px] border border-white/15 bg-[#24212c]/95 p-1.5 text-left shadow-[0_24px_60px_-12px_rgb(0_0_0/0.8)] backdrop-blur-2xl lg:block" style={{ "--d": "1500ms" } as CSSProperties}>
                {goMenu.map((it, i) =>
                  it.label ? (
                    <span key={it.label} className={cn("flex items-center justify-between rounded-[6px] px-2.5 py-[3px]", it.label === "Renewals" ? "bg-accent text-white" : "text-white/88")}>
                      {it.label}
                      <span className={cn("tabular text-[11.5px]", it.label === "Renewals" ? "text-white/90" : "text-white/45")}>{it.keys}</span>
                    </span>
                  ) : (
                    <span key={i} className="mx-2.5 my-1 block h-px bg-white/12" />
                  ),
                )}
              </span>
            </span>
          ) : (
            <span key={m} className="hidden md:inline">
              {m}
            </span>
          ),
        )}
        <span className="tabular ml-auto text-white/80">9:41</span>
      </div>

      {/* The app window */}
      <div className="relative z-10 mx-auto w-[94%] max-w-[1060px] pb-[84px] pt-5 sm:pb-[104px] sm:pt-9">
        <HeroPreview chrome="app" timeline={false} />
      </div>

      {/* Dock */}
      <div className="absolute inset-x-0 bottom-2.5 z-20 flex justify-center sm:bottom-3.5">
        <div className="dl-dock flex items-end gap-1.5 rounded-[20px] border border-white/18 bg-white/[0.09] px-2 py-1.5 shadow-[0_20px_40px_-16px_rgb(0_0_0/0.7),inset_0_1px_0_rgb(255_255_255/0.15)] backdrop-blur-2xl sm:gap-2 sm:rounded-[22px] sm:px-2.5 sm:py-2">
          {dock.map((d) => (
            <span key={d.icon} className={cn("dl-dock-item", d.wide && "hidden sm:block")}>
              <IconTile icon={d.icon} tone={d.tone} size={44} className="rounded-[11px]" />
            </span>
          ))}
          <span className="mx-0.5 h-10 w-px self-center bg-white/20" />
          <span className="dl-dock-item relative">
            <span className="so-rise absolute -top-9 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-[7px] border border-white/12 bg-[#26232f]/90 px-2.5 py-1 text-[11.5px] font-medium text-white/90 shadow-lg backdrop-blur-xl sm:block" style={{ "--d": "2600ms" } as CSSProperties}>
              Saver Option Business
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element -- a fixed PNG, no optimization needed */}
            <img src="/business/mac-app-icon.png" alt="" width={54} height={54} className="dl-bounce block size-[50px] sm:size-[54px]" />
            <span className="absolute -bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-white/85" />
          </span>
        </div>
      </div>
    </div>
  );
}
