import { redirect } from "next/navigation";
import { GoogleButton } from "@/components/auth/auth-forms";
import { AuthShell, AuthUnavailable } from "@/components/auth/auth-shell";
import { FormMessage } from "@/components/ui/form";
import { authConfigured, getUser, googleSignInEnabled } from "@/lib/server/supabase";
import { safeNext } from "@/lib/safe-next";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Sign in", description: "Sign in to manage your Saver Option listings.", path: "/login", noIndex: true });

const notices: Record<string, string> = {
  link: "That sign-in link is invalid or has expired. Please try again.",
  claim: "That listing link is invalid, expired or already used. Sign in to see listings already in your account.",
  google: "Google sign-in didn't finish. Please try again.",
  unavailable: "Accounts aren't available right now. Please try again later.",
};

/** Sign in or sign up — the same Google button does both. /signup redirects here. */
export default async function LoginPage(props: PageProps<"/login">) {
  const q = await props.searchParams;
  const next = safeNext(q.next);
  // /claim is a route handler; signed-in users pick up a pending claim from the dashboard banner instead.
  if (await getUser()) redirect(next === "/claim" ? "/dashboard" : next);
  const notice = typeof q.error === "string" ? notices[q.error] : undefined;
  const google = await googleSignInEnabled();

  return (
    <AuthShell
      title={
        <>
          Sign in with <em className="accent">Google</em>
        </>
      }
      description={next === "/claim" ? "Sign in to add your paid listing to your account." : "Manage your listings. New here? The same button creates your account."}
    >
      {notice && (
        <div className="mb-4">
          <FormMessage tone="error">{notice}</FormMessage>
        </div>
      )}
      {!authConfigured() ? (
        <AuthUnavailable />
      ) : (
        <>
          {!google && (
            <div className="mb-4">
              <FormMessage tone="error">Google sign-in isn&apos;t switched on yet. Please try again a little later.</FormMessage>
            </div>
          )}
          <GoogleButton next={next} />
        </>
      )}
    </AuthShell>
  );
}
