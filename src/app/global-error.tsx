"use client";

import { useEffect } from "react";
import { recoverWithFullLoad } from "@/lib/load-recovery";

/**
 * Shown when the whole app fails, typically a navigation whose next page couldn't be downloaded on a
 * patchy mobile connection. It first opens the page the visitor was going to with a full page load
 * (once; see src/lib/load-recovery.ts), so usually the page simply appears; the message only fades in
 * if that doesn't happen. It replaces the root layout, so it brings its own <html> and styles.
 */
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error(error);
    recoverWithFullLoad();
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>This page couldn’t load · Saver Option</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
      </head>
      <body style={{ margin: 0, minHeight: "100dvh", display: "grid", placeItems: "center", background: "#0c0e12", color: "#f7f7f7", fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' }}>
        <style>{"@keyframes so-reveal{from{opacity:0}to{opacity:1}}"}</style>
        <main style={{ maxWidth: "26rem", padding: "2rem", opacity: 0, animation: "so-reveal 300ms ease-out 2s forwards" }}>
          <h1 style={{ fontSize: "1.75rem", lineHeight: 1.2, margin: "0 0 .6rem" }}>This page couldn’t load</h1>
          <p style={{ margin: "0 0 1.5rem", color: "#a1a1aa" }}>
            {error.digest ? "A server error occurred. Reload to try again." : "Check your connection, then reload to try again, or go back."}
          </p>
          <div style={{ display: "flex", gap: ".6rem" }}>
            <button type="button" onClick={() => window.location.reload()} style={{ padding: ".65rem 1.2rem", borderRadius: 10, border: 0, background: "#f4f4f5", color: "#0c0e12", font: "inherit", fontWeight: 600 }}>
              Reload
            </button>
            <button type="button" onClick={() => window.history.back()} style={{ padding: ".65rem 1.2rem", borderRadius: 10, border: "1px solid #3f3f46", background: "transparent", color: "#f4f4f5", font: "inherit", fontWeight: 600 }}>
              Back
            </button>
          </div>
          {error.digest && <p style={{ marginTop: "1.5rem", fontSize: 12, color: "#71717a" }}>Reference: {error.digest}</p>}
        </main>
      </body>
    </html>
  );
}
