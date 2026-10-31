import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { CSSProperties } from "react";
import { GoogleButton } from "@/components/auth/auth-forms";
import { SignInAside } from "@/components/business/landing/sign-in-aside";
import { Aurora } from "@/components/business/motion";
import { BusinessPublicHeader } from "@/components/business/public-header";
import { FormMessage } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { Container } from "@/components/ui/primitives";
import { isDesktopApp } from "@/lib/desktop";
import { businessReady, getBizSession, safeBusinessNext } from "@/lib/server/business/context";
import { googleSignInEnabled } from "@/lib/server/supabase";

const notices: Record<string, string> = {
  google: "Google sign-in didn't finish. Please try again.",
  cancelled: "Google sign-in was cancelled. Continue with Google when you're ready.",
  unavailable: "Sign-in isn't available right now. Please try again later.",
  expired: "Your session has expired. Sign in again to continue.",
};

/** /business/login and /business/signup: Continue with Google is the only way in. */
export async function BusinessSignIn({ searchParams, mode }: { searchParams: Record<string, string | string[] | undefined>; mode: "login" | "signup" }) {
  const next = safeBusinessNext(searchParams.next);
  const { user, ctx } = await getBizSession();
  if (user) redirect(ctx ? next : "/business/onboarding");
  const ready = businessReady();
  const google = ready && (await googleSignInEnabled());
  const notice = typeof searchParams.error === "string" ? notices[searchParams.error] : undefined;
  const desktop = isDesktopApp((await headers()).get("user-agent"));

  return (
    <>
      <BusinessPublicHeader signedIn={false} />
      <div className="theme-dark bg-bg text-fg">
        <section className="hero-glow so-grain relative min-h-[72vh] overflow-hidden border-b border-line">
          <Aurora />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(60%_60%_at_80%_10%,#000_20%,transparent_100%)]"
          />
          <Container className="relative grid items-center gap-12 py-12 sm:py-20 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:gap-16">
            <div className="so-rise mx-auto w-full max-w-md lg:mx-0">
              <div className="so-beam rounded-[22px] border border-line-strong bg-surface/90 p-6 shadow-[0_30px_70px_-40px_rgb(0_0_0/0.8)] backdrop-blur-md sm:p-8">
                <span aria-hidden="true" className="icon-tile mb-5 size-11">
                  <Icon name="building" size={21} />
                </span>
                <h1 className="text-[1.6rem] font-semibold leading-tight tracking-tight text-heading">
                  {mode === "signup" ? "Get started with Saver Option Business" : "Welcome to Saver Option Business"}
                </h1>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">Manage your company&apos;s software spending in one place.</p>
                <div className="mt-6 space-y-4">
                  {notice && <FormMessage tone="error">{notice}</FormMessage>}
                  {!ready ? (
                    <FormMessage tone="error">Saver Option Business isn&apos;t switched on for this site yet.</FormMessage>
                  ) : !google ? (
                    <FormMessage tone="error">Google sign-in isn&apos;t switched on yet. Please try again a little later.</FormMessage>
                  ) : null}
                  <div className="so-shine-hover">
                    <GoogleButton next={next} disabled={!google} />
                  </div>
                  {desktop && (
                    <p className="flex gap-2 text-[12.5px] leading-relaxed text-muted" data-desktop-hint>
                      <Icon name="arrow-up-right" size={14} className="mt-0.5 text-accent-ink" />
                      <span>Google sign-in opens in your browser. When you&apos;re done there, it brings you back to the app.</span>
                    </p>
                  )}
                  <p className="flex gap-2 text-[12.5px] leading-relaxed text-faint">
                    <Icon name="lock" size={14} className="mt-0.5 text-accent-ink" />
                    <span>
                      {mode === "signup" ? "New and returning users use the same button. " : "New here? The same button creates your account. "}
                      Saver Option only receives your name, email address and profile picture from Google — no access to Gmail, Drive or Calendar.
                    </span>
                  </p>
                </div>
              </div>
              <p className="mt-5 text-center text-[13px] text-muted">
                Looking for software deals instead?{" "}
                <Link href="/business/software-deals" className="text-accent-ink underline underline-offset-2">
                  Browse all deals
                </Link>
              </p>
            </div>
            <div className="so-rise min-w-0" style={{ "--d": "180ms" } as CSSProperties}>
              <SignInAside />
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}
