import Link from "next/link";
import { ResetRequestForm } from "@/components/auth/auth-forms";
import { AuthShell, AuthUnavailable } from "@/components/auth/auth-shell";
import { authConfigured } from "@/lib/server/supabase";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Reset password", description: "Reset your Saver Option password.", path: "/reset-password", noIndex: true });

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title={
        <>
          Reset your <em className="accent">password</em>
        </>
      }
      description="Enter your account email and we'll send you a link to choose a new password."
      aside={
        <Link href="/login" className="font-medium text-accent-ink underline-offset-2 hover:underline">
          Back to log in
        </Link>
      }
    >
      {authConfigured() ? <ResetRequestForm /> : <AuthUnavailable />}
    </AuthShell>
  );
}
