import { Icon, type IconProps } from "@/components/ui/icon";
import { buttonClass, cn } from "@/components/ui/primitives";
import { MAC_DOWNLOAD_PATH, type MacReleaseLookup } from "@/lib/server/desktop-release";

/** The Mac app's icon (a fixed 512 px PNG). */
export const MAC_APP_ICON = "/business/mac-app-icon.png";

/** What the Mac app adds, as it's implemented in desktop/src-tauri. */
export const MAC_APP_FEATURES: { icon: IconProps["name"]; text: string }[] = [
  { icon: "laptop", text: "Its own window, Dock icon and ⌘-Tab" },
  { icon: "grid", text: "Menu bar and shortcuts, ⌘1–⌘9 for pages" },
  { icon: "clock", text: "Reopens on the page you left" },
];

const fmtSize = (bytes: number) => (bytes > 0 ? `${(bytes / 1024 / 1024).toFixed(bytes > 100 * 1024 * 1024 ? 0 : 1)} MB` : null);

/** "Free · v0.2.1 · 10.4 MB · macOS 12+ · Apple silicon & Intel": one short line, wrapping only between items. */
export function MacReleaseMeta({ lookup, withVersion = true, align = "center", className }: { lookup: MacReleaseLookup; withVersion?: boolean; align?: "center" | "start"; className?: string }) {
  const release = lookup.state === "ready" ? lookup.release : null;
  const items = ["Free", withVersion && release && `v${release.version}`, release && fmtSize(release.sizeBytes), "macOS 12+", "Apple silicon & Intel"].filter(Boolean);
  return (
    <p className={cn("flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-faint", align === "center" ? "justify-center" : "justify-start", className)}>
      {items.map((t, i) => (
        <span key={i} className="flex items-center gap-2 whitespace-nowrap">
          {i > 0 && <span aria-hidden="true" className="size-[3px] rounded-full bg-current opacity-60" />}
          {t}
        </span>
      ))}
    </p>
  );
}

/** "Download for Mac", or a note while no build has been published yet. `shine` keeps the download page's sweep on hover. */
export function MacDownloadButton({ lookup, mark, shine = true, className }: { lookup: MacReleaseLookup; mark?: boolean; shine?: boolean; className?: string }) {
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
      className={buttonClass("primary", "lg", cn(shine && "so-shine-hover", "w-full shadow-[0_14px_40px_-12px_rgb(124_58_236/0.8)]", className))}
      {...(mark ? { "data-download-mac": "" } : {})}
    >
      <Icon name="download" size={16} /> Download for Mac
    </a>
  );
}
