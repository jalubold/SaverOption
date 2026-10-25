"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { CopyField } from "@/components/business/copy-field";

/*
 * Browser-side hints that let the public Business pages (landing, AI & MCP) be
 * prerendered and served from the CDN, so opening them is instant. They only
 * choose what the page shows: every app page and action still verifies the
 * session on the server.
 */

const subscribe = () => () => {};

/** Whether this browser holds a Saver Option sign-in (the Supabase auth cookie). */
export function useSignedInHint(): boolean {
  return useSyncExternalStore(subscribe, () => /(?:^|;\s*)sb-[^=]+-auth-token(?:\.0)?=/.test(document.cookie), () => false);
}

/** Renders one of two server-rendered variants depending on the sign-in hint. */
export function SignedInSwitch({ signedIn, signedOut }: { signedIn: ReactNode; signedOut: ReactNode }) {
  return <>{useSignedInHint() ? signedIn : signedOut}</>;
}

/** Shows its children when the page URL has ?name=value. */
export function QueryFlag({ name, value, children }: { name: string; value: string; children: ReactNode }) {
  const on = useSyncExternalStore(subscribe, () => new URLSearchParams(window.location.search).get(name) === value, () => false);
  return on ? <>{children}</> : null;
}

/** A copyable URL on the host this page is open on (production, preview or local); `fallback` until hydration. */
export function HostUrlField({ path, fallback, label }: { path: string; fallback: string; label: string }) {
  const value = useSyncExternalStore(
    subscribe,
    () => {
      const { hostname, host, origin } = window.location;
      const local = hostname === "localhost" || hostname === "127.0.0.1";
      return `${local ? origin : `https://${host}`}${path}`;
    },
    () => fallback,
  );
  return <CopyField value={value} label={label} />;
}
