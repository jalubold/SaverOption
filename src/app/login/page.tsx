import Link from "next/link";
import { redirect } from "next/navigation";
import { GoogleButton, LoginForm } from "@/components/auth/auth-forms";
import { AuthShell, AuthUnavailable } from "@/components/auth/auth-shell";
import { FormMessage } from "@/components/ui/form";
import { authConfigured, getUser, googleSignInEnabled } from "@/lib/server/supabase";
import { safeNext } from "@/lib/safe-next";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Log in", description: "Log in to manage your Saver Option listings.", path: "/login", noIndex: true });

const notices: Record<string, string> = {
  link: "That link is invalid or has expired. If you just confirmed your email, log in below.",
  claim: "That listing link is invalid, expired or already used. Log in to see listings already in your account.",
  verify: "Confirm your email address, then log in to continue.",
  google: "Google sign-in didn't finish. Please try again.",
  unavailable: "Accounts aren't available right now. Please try again later.",
};

export default async function LoginPage(props: PageProps<"/login">) {
  const q = await props.searchParams;
  const next = safeNext(q.next);
  // /claim is a route handler; signed-in users pick up a pending claim from the dashboard banner instead.
  if (await getUser()) redirect(next === "/claim" ? "/dashboard" : next);
  const notice = typeof q.error === "string" ? notices[q.error] : undefined;
  const signupHref = next === "/dashboard" ? "/signup" : `/signup?next=${encodeURIComponent(next)}`;
  const google = await googleSignInEnabled();

  return (
    <AuthShell
      title={
        <>
          Welcome <em className="accent">back</em>
        </>
      }
      description={next === "/claim" ? "Log in to add your paid listing to your account." : "Log in to manage your listings."}
      aside={
        google ? (
          "New here? The same button creates your account."
        ) : (
          <>
            New here?{" "}
            <Link href={signupHref} className="font-medium text-accent-ink underline-offset-2 hover:underline">
              Create an account
            </Link>
          </>
        )
      }
    >
      {notice && (
        <div className="mb-4">
          <FormMessage tone="error">{notice}</FormMessage>
        </div>
      )}
      {!authConfigured() ? (
        <AuthUnavailable />
      ) : google ? (
        <GoogleButton next={next} />
      ) : (
        <LoginForm next={next} email={typeof q.email === "string" ? q.email.slice(0, 254) : ""} />
      )}
    </AuthShell>
  );
}
