"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { signInWithGoogleAction } from "@/app/auth/actions";
import { GoogleLogo } from "@/components/brand/google-logo";
import { isDesktopApp } from "@/lib/desktop";

/** Where Google's own sign-in button loads from, and the web client it signs in to (see google-identity.ts). */
export interface GoogleIdentity {
  clientId: string;
  scriptSrc: string;
}

/**
 * The only way to sign in: new and returning users use the same button. With `identity`, it's
 * Google's own button on this page, so Google's account chooser names this site (and the brand,
 * once verified) instead of the Supabase project; otherwise, and in the Mac app (Google doesn't
 * allow sign-in inside apps' web views), it's the redirect through Supabase.
 */
export function GoogleButton({ next, label = "Continue with Google", disabled = false, identity }: { next: string; label?: string; disabled?: boolean; identity?: GoogleIdentity | null }) {
  const redirect = (
    <form action={signInWithGoogleAction}>
      <input type="hidden" name="next" value={next} />
      <GoogleSubmit label={label} disabled={disabled} />
    </form>
  );
  if (!identity || disabled) return redirect;
  return <GoogleIdentityButton identity={identity} next={next} fallback={redirect} />;
}

type GsiCredential = { credential?: string };
type GsiApi = {
  initialize: (config: Record<string, unknown>) => void;
  renderButton: (el: HTMLElement, options: Record<string, unknown>) => void;
};
declare global {
  interface Window {
    google?: { accounts?: { id?: GsiApi } };
  }
}

let scriptPromise: Promise<void> | null = null;
function loadScript(src: string): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => (window.google?.accounts?.id ? resolve() : reject(new Error("no gsi")));
    s.onerror = () => reject(new Error("gsi blocked"));
    document.head.appendChild(s);
  }).catch((err) => {
    scriptPromise = null;
    throw err;
  });
  return scriptPromise;
}

async function makeNonce(): Promise<{ raw: string; hashed: string }> {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const raw = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  const hashed = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return { raw, hashed };
}

function GoogleIdentityButton({ identity, next, fallback }: { identity: GoogleIdentity; next: string; fallback: React.ReactNode }) {
  const [mode, setMode] = useState<"loading" | "ready" | "busy" | "fallback">("loading");
  const [error, setError] = useState<string | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const nonce = useRef("");

  useEffect(() => {
    // Google doesn't allow sign-in inside an app's web view: the Mac app keeps the browser hand-off.
    if (isDesktopApp(navigator.userAgent) || document.documentElement.classList.contains("desktop-app")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- decided on the device, after hydration
      setMode("fallback");
      return;
    }
    let live = true;
    const giveUp = window.setTimeout(() => live && setMode((m) => (m === "loading" ? "fallback" : m)), 8000);

    const finish = async (res: GsiCredential) => {
      if (!res.credential) return;
      setMode("busy");
      setError(null);
      try {
        const r = await fetch("/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ credential: res.credential, nonce: nonce.current, next }),
        });
        const body = (await r.json().catch(() => ({}))) as { next?: string };
        if (r.ok && body.next) {
          window.location.assign(body.next);
          return;
        }
      } catch {}
      setError("Google sign-in didn't finish. Please try again.");
      await setup(); // a fresh nonce for the next try
    };

    const setup = async () => {
      const el = box.current;
      const gsi = window.google?.accounts?.id;
      if (!el || !gsi || !live) return;
      const n = await makeNonce();
      nonce.current = n.raw;
      gsi.initialize({ client_id: identity.clientId, nonce: n.hashed, callback: finish, ux_mode: "popup", context: "signin", itp_support: true, auto_select: false });
      el.replaceChildren();
      gsi.renderButton(el, { type: "standard", theme: "outline", size: "large", text: "continue_with", shape: "pill", logo_alignment: "center", width: Math.max(220, Math.min(400, Math.floor(el.parentElement?.clientWidth ?? 320))) });
      setMode("ready");
    };

    loadScript(identity.scriptSrc)
      .then(() => setup())
      .catch(() => live && setMode("fallback"));
    return () => {
      live = false;
      window.clearTimeout(giveUp);
    };
  }, [identity.clientId, identity.scriptSrc, next]);

  if (mode === "fallback") return <>{fallback}</>;
  return (
    <div data-google-identity={mode}>
      <div className="relative flex min-h-12 items-center justify-center">
        <div ref={box} className={mode === "ready" ? "flex w-full justify-center" : "pointer-events-none absolute inset-0 flex justify-center opacity-0"} data-gsi-button />
        {mode !== "ready" && (
          <span className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-[14px] border border-[#dadce0] bg-white px-5 text-[15px] font-medium text-[#1f1f1f]" aria-live="polite">
            <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-[#dadce0] border-t-[#1f1f1f]" />
            {mode === "busy" ? "Signing you in…" : "Loading Google…"}
          </span>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-2 text-center text-[13px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function GoogleSubmit({ label, disabled }: { label: string; disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      aria-busy={pending}
      className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-[14px] border border-[#dadce0] bg-white px-5 text-[15px] font-medium text-[#1f1f1f] shadow-sm transition-colors hover:bg-[#f8f9fa] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-[#dadce0] border-t-[#1f1f1f]" />
          Opening Google…
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

