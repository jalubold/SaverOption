"use client";

import { useEffect, useState } from "react";
import { isDesktopApp } from "@/lib/desktop";

/**
 * /business/download?start=1 (the header's "Download"): on a Mac the file starts downloading
 * straight away, while the page shows the install steps. Not on other devices (iPadOS also
 * says "Macintosh", but has touch), nor inside the app itself.
 */
export function AutoDownload({ href }: { href: string }) {
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("start") !== "1") return;
    const mac = /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints < 2;
    if (!mac || isDesktopApp(navigator.userAgent)) return;
    const t = setTimeout(() => {
      // A refresh shouldn't download again.
      window.history.replaceState(window.history.state, "", window.location.pathname);
      window.location.href = href;
      setStarted(true);
    }, 300);
    return () => clearTimeout(t);
  }, [href]);
  if (!started) return null;
  return (
    <p role="status" className="mt-4 text-[13.5px] text-muted" data-download-started>
      Your download has started (Saver-Option-Business-mac.dmg).{" "}
      <a href={href} className="text-accent-ink underline underline-offset-2">
        Download again
      </a>
    </p>
  );
}
