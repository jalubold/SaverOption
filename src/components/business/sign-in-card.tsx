import Link from "next/link";
import { redirect } from "next/navigation";
import { GoogleButton } from "@/components/auth/auth-forms";
import { BusinessPublicHeader } from "@/components/business/public-header";
import { FormMessage } from "@/components/ui/form";
import { Container } from "@/components/ui/primitives";
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

  return (
    <>
      <BusinessPublicHeader signedIn={false} />
      <div className="theme-dark bg-bg text-fg">
        <section className="hero-glow min-h-[72vh] border-b border-line">
          <Container className="max-w-md py-14 sm:py-20">
            <div className="rounded-[20px] border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
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
                <GoogleButton next={next} disabled={!google} />
                <p className="text-[12.5px] leading-relaxed text-faint">
                  {mode === "signup" ? "New and returning users use the same button. " : "New here? The same button creates your account. "}
                  Saver Option only receives your name, email address and profile picture from Google — no access to Gmail, Drive or Calendar.
                </p>
              </div>
            </div>
            <p className="mt-5 text-center text-[13px] text-muted">
              Looking for software deals instead?{" "}
              <Link href="/deals" className="text-accent-ink underline underline-offset-2">
                Browse all deals
              </Link>
            </p>
          </Container>
        </section>
      </div>
    </>
  );
}
