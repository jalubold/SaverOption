"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const POLL_MS = 5000;
const POLL_FOR_MS = 3 * 60_000;

/**
 * After someone chooses "Add to Google Calendar" (or Apple Calendar), checks back with the server
 * for a few minutes — and whenever they return to this tab — so the page can say "Connected" as
 * soon as their calendar app first fetches the feed. Nothing waits on it: it only updates the page.
 */
export function CalendarWatch({ connected, compact = false }: { connected: boolean; compact?: boolean }) {
  const router = useRouter();
  const ref = useRef<HTMLSpanElement>(null);
  const [state, setState] = useState<"idle" | "waiting" | "slow">("idle");

  useEffect(() => {
    const root = ref.current?.closest("[data-calendar-connect]");
    if (!root) return;
    const onClick = (e: Event) => {
      if (e.target instanceof Element && e.target.closest("[data-calendar-add]")) setState("waiting");
    };
    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (state !== "waiting" || connected) return;
    const started = Date.now();
    const check = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    const timer = setInterval(() => {
      if (Date.now() - started > POLL_FOR_MS) {
        clearInterval(timer);
        setState("slow");
      } else check();
    }, POLL_MS);
    document.addEventListener("visibilitychange", check);
    window.addEventListener("focus", check);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", check);
      window.removeEventListener("focus", check);
    };
  }, [state, connected, router]);

  const text =
    connected || state === "idle"
      ? null
      : state === "waiting"
        ? compact
          ? "Choose Add in your calendar. This disappears once it has your renewals."
          : "Choose Add in your calendar. This page shows Connected as soon as your calendar first fetches your renewals — you can carry on meanwhile."
        : "Added it? Google Calendar can take a while to fetch a new calendar the first time; it shows as connected here once it has. Nothing else to do.";
  return (
    <span ref={ref} role="status" aria-live="polite" className={text ? "block text-[12.5px] leading-relaxed text-muted" : "hidden"} data-calendar-waiting={text ? state : undefined}>
      {text}
    </span>
  );
}
