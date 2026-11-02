"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useFormStatus } from "react-dom";
import { signInWithGoogleAction } from "@/app/auth/actions";
import { GoogleLogo } from "@/components/brand/google-logo";
import { isDesktopApp } from "@/lib/desktop";

/** Where Google's script loads from, and the web client it signs in to (see google-identity.ts). */
export interface GoogleIdentity {
  clientId: string;
  scriptSrc: string;
}

/**
 * The only way to sign in: new and returning users use the same button, and it's always our own.
 * With `identity`, a click opens Google's account chooser in a popup over this page, so Google names
 * this site (and the brand, once verified) instead of the Supabase project. Otherwise — no identity,
 * Google's script blocked, the popup blocked, or the Mac app (Google doesn't allow sign-in inside
 * apps' web views) — the same button submits the redirect through Supabase.
 */
export function GoogleButton({ next, label = "Continue with Google", disabled = false, identity }: { next: string; label?: string; disabled?: boolean; identity?: GoogleIdentity | null }) {
  const form = useRef<HTMLFormElement>(null);
  const popup = useGooglePopup(disabled ? null : (identity ?? null), next, () => form.current?.requestSubmit());
  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (popup.open()) e.preventDefault();
  };
  return (
    <div data-google-signin={popup.state}>
      <form ref={form} action={signInWithGoogleAction}>
        <input type="hidden" name="next" value={next} />
        <GoogleSubmit label={label} disabled={disabled} busy={popup.state === "busy"} onClick={onClick} />
      </form>
      {popup.error && (
        <p role="alert" className="mt-2 text-center text-[13px] text-danger">
          {popup.error}
        </p>
      )}
    </div>
  );
}

type CodeResponse = { code?: string; error?: string };
type CodeClient = { requestCode: () => void };
type GsiOAuth2 = {
  initCodeClient: (config: {
    client_id: string;
    scope: string;
    ux_mode: "popup";
    select_account?: boolean;
    callback: (res: CodeResponse) => void;
    error_callback?: (err: { type?: string }) => void;
  }) => CodeClient;
};
declare global {
  interface Window {
    google?: { accounts?: { oauth2?: GsiOAuth2 } };
  }
}

let scriptPromise: Promise<void> | null = null;
function loadScript(src: string): Promise<void> {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => (window.google?.accounts?.oauth2 ? resolve() : reject(new Error("no gsi")));
    s.onerror = () => reject(new Error("gsi blocked"));
    document.head.appendChild(s);
  }).catch((err) => {
    scriptPromise = null;
    throw err;
  });
  return scriptPromise;
}

/**
 * Google's popup, prepared ahead so a click opens it straight away (browsers only allow popups from
 * the click itself). `open()` says whether it took the click; when it didn't, the redirect form runs.
 */
function useGooglePopup(identity: GoogleIdentity | null, next: string, redirect: () => void) {
  const [state, setState] = useState<"off" | "loading" | "ready" | "busy">(identity ? "loading" : "off");
  const [error, setError] = useState<string | null>(null);
  const client = useRef<CodeClient | null>(null);
  const nextRef = useRef(next);
  const redirectRef = useRef(redirect);
  useEffect(() => {
    nextRef.current = next;
    redirectRef.current = redirect;
  });

  const clientId = identity?.clientId;
  const scriptSrc = identity?.scriptSrc;
  useEffect(() => {
    // Google doesn't allow sign-in inside an app's web view: the Mac app keeps the browser hand-off.
    if (!clientId || !scriptSrc || isDesktopApp(navigator.userAgent) || document.documentElement.classList.contains("desktop-app")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- decided on the device, after hydration
      setState("off");
      return;
    }
    let live = true;
    const finish = async (res: CodeResponse) => {
      if (!res.code) {
        // Closing the chooser or pressing Cancel isn't an error worth showing.
        if (res.error && res.error !== "access_denied") setError("Google sign-in didn't finish. Please try again.");
        return;
      }
      setState("busy");
      setError(null);
      try {
        const r = await fetch("/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Requested-With": "XmlHttpRequest" },
          credentials: "same-origin",
          body: JSON.stringify({ code: res.code, next: nextRef.current }),
        });
        const body = (await r.json().catch(() => ({}))) as { next?: string };
        if (r.ok && body.next) {
          window.location.assign(body.next);
          return;
        }
      } catch {}
      setError("Google sign-in didn't finish. Please try again.");
      setState("ready");
    };
    loadScript(scriptSrc)
      .then(() => {
        const oauth2 = window.google?.accounts?.oauth2;
        if (!live || !oauth2) return;
        client.current = oauth2.initCodeClient({
          client_id: clientId,
          scope: "openid email profile",
          ux_mode: "popup",
          select_account: true,
          callback: (res) => void finish(res),
          // A blocked popup falls back to the redirect; closing it just leaves the button as it was.
          error_callback: (err) => {
            if (err?.type === "popup_failed_to_open") redirectRef.current();
          },
        });
        setState("ready");
      })
      .catch(() => live && setState("off"));
    return () => {
      live = false;
    };
  }, [clientId, scriptSrc]);

  const open = () => {
    if (state !== "ready" || !client.current) return false;
    setError(null);
    client.current.requestCode();
    return true;
  };
  return { state, error, open };
}

function GoogleSubmit({ label, disabled, busy, onClick }: { label: string; disabled: boolean; busy: boolean; onClick: (e: MouseEvent<HTMLButtonElement>) => void }) {
  const { pending } = useFormStatus();
  const working = pending || busy;
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={working || disabled}
      aria-busy={working}
      className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-[14px] border border-[#dadce0] bg-white px-5 text-[15px] font-medium text-[#1f1f1f] shadow-sm transition-colors hover:bg-[#f8f9fa] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {working ? (
        <>
          <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-[#dadce0] border-t-[#1f1f1f]" />
          {busy ? "Signing you in…" : "Opening Google…"}
        </>
      ) : (
        <>
          <GoogleLogo />
          {label}
        </>
      )}
    </button>
  );
}
