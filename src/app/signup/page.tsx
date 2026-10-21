import Link from "next/link";
import { redirect } from "next/navigation";
import { GoogleButton, SignupForm } from "@/components/auth/auth-forms";
import { AuthShell, AuthUnavailable } from "@/components/auth/auth-shell";
import { readClaimCookie } from "@/lib/server/claim";
import { dbConfigured } from "@/lib/server/db";
import { getSubmissionByClaim } from "@/lib/server/submissions";
import { authConfigured, getUser, googleSignInEnabled } from "@/lib/server/supabase";
import { safeNext } from "@/lib/safe-next";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Create account", description: "Create a Saver Option advertiser account.", path: "/signup", noIndex: true });

export default async function SignupPage(props: PageProps<"/signup">) {
  const q = await props.searchParams;
  const next = safeNext(q.next);
  // /claim is a route handler; signed-in users pick up a pending claim from the dashboard banner instead.
  if (await getUser()) redirect(next === "/claim" ? "/dashboard" : next);

  // Prefill the email from the listing this browser paid for (read server-side from the claim cookie).
  let email = "";
  let product: string | null = null;
  if (dbConfigured()) {
    try {
      const sub = await getSubmissionByClaim(await readClaimCookie());
      if (sub && !sub.user_id) {
        email = sub.contact_email;
        product = sub.product_name;
      }
    } catch {}
  }
  const loginHref = next === "/dashboard" ? "/login" : `/login?next=${encodeURIComponent(next)}`;
  const google = await googleSignInEnabled();

  return (
    <AuthShell
      title={
        <>
          Create your <em className="accent">account</em>
        </>
      }
      description={
        product ? (
          <>
            Manage <strong className="text-fg">{product}</strong>: complete your product details and track its performance.
          </>
        ) : (
          "Manage your listings, complete your product details and track performance."
        )
      }
      aside={
        google ? (
          "Already have an account? The same button signs you in."
        ) : (
        <>
          Already have an account?{" "}
          <Link href={loginHref} className="font-medium text-accent-ink underline-offset-2 hover:underline">
            Log in
          </Link>
        </>
        )
      }
    >
      {!authConfigured() ? <AuthUnavailable /> : google ? <GoogleButton next={next} /> : <SignupForm next={next} email={email} />}
    </AuthShell>
  );
}
