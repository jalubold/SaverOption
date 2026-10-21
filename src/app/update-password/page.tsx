import { redirect } from "next/navigation";
import { UpdatePasswordForm } from "@/components/auth/auth-forms";
import { AuthShell } from "@/components/auth/auth-shell";
import { getUser } from "@/lib/server/supabase";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Choose a new password", description: "Set a new password.", path: "/update-password", noIndex: true });

/** Reached from the reset email (via /auth/callback, which signs the user in) or from the dashboard. */
export default async function UpdatePasswordPage() {
  const user = await getUser();
  if (!user) redirect("/login?error=link");
  return (
    <AuthShell
      title={
        <>
          Choose a new <em className="accent">password</em>
        </>
      }
      description={<>For {user.email}.</>}
    >
      <UpdatePasswordForm />
    </AuthShell>
  );
}
