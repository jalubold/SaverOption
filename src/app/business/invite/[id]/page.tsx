import Link from "next/link";
import type { ReactNode } from "react";
import { acceptInviteLinkAction } from "@/app/business/actions/workspace";
import { GoogleButton } from "@/components/auth/auth-forms";
import { googleIdentity } from "@/lib/server/google-identity";
import { Aurora } from "@/components/business/motion";
import { BusinessPublicHeader } from "@/components/business/public-header";
import { FormMessage } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { buttonClass, Container } from "@/components/ui/primitives";
import { isUuid } from "@/lib/business/form";
import { roleLabels } from "@/lib/business/constants";
import { businessReady } from "@/lib/server/business/context";
import { getInviteLink, isWorkspaceMember } from "@/lib/server/business/data";
import { getUser, googleSignInEnabled } from "@/lib/server/supabase";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "You've been given access",
  description: "Join a Saver Option Business workspace: sign in with Google using the invited email address.",
  path: "/business/invite",
  noIndex: true,
});

/**
 * A personal invite link, shared by whoever gave the access (no email is sent). It says which
 * workspace and which address, signs the person in with Google and brings them back here to
 * join. Joining checks on the server that the Google address is the invited one.
 */
export default async function InvitePage(props: PageProps<"/business/invite/[id]">) {
  const { id } = await props.params;
  const q = await props.searchParams;
  const invite = isUuid(id) && businessReady() ? await getInviteLink(id.toLowerCase()) : null;
  const user = invite ? await getUser() : null;
  const google = await googleSignInEnabled();
  const here = invite ? `/business/invite/${invite.id}` : "/business";

  let body: ReactNode;
  if (!invite || invite.status === "revoked") {
    body = (
      <>
        <Title icon="alert">This invitation isn&apos;t available</Title>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">
          It may have been revoked, or the link was copied incompletely. Ask the person who gave you access for a new invite link.
        </p>
        <Link href="/business" className={buttonClass("secondary", "md", "mt-6")}>
          About Saver Option Business
        </Link>
      </>
    );
  } else if (invite.status === "accepted") {
    const member = user ? await isWorkspaceMember(user.id, invite.workspaceId) : false;
    body = member ? (
      <>
        <Title icon="check">You&apos;ve already joined {invite.workspaceName}</Title>
        <Link href="/business/dashboard" className={buttonClass("primary", "lg", "mt-6 w-full")}>
          Open the dashboard <Icon name="arrow-right" size={15} />
        </Link>
      </>
    ) : (
      <>
        <Title icon="info">This invitation has been used</Title>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">
          Someone has already joined {invite.workspaceName} with it. If that wasn&apos;t you, ask for a new invite link.
        </p>
        {!user && (
          <div className="mt-6">
            <GoogleButton identity={googleIdentity()} next={here} disabled={!google} label="Sign in with Google" />
          </div>
        )}
      </>
    );
  } else {
    const matches = user?.email === invite.email;
    body = (
      <>
        <Title icon="users">
          Join <span className="text-accent-ink">{invite.workspaceName}</span>
        </Title>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">
          {invite.inviterName ?? "A colleague"} gave you <strong className="font-semibold text-fg">{roleLabels[invite.role]}</strong> access to their
          workspace on Saver Option Business.
        </p>
        <div className="mt-5 rounded-xl border border-line bg-subtle px-4 py-3">
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-faint">Sign in with this Google account</p>
          <p className="mt-1 break-all text-[15px] font-semibold text-fg" data-invite-email>
            {invite.email}
          </p>
        </div>
        <div className="mt-6 space-y-4">
          {q.error === "1" && <FormMessage tone="error">That didn&apos;t work. Make sure you&apos;re signed in as {invite.email}, then try again.</FormMessage>}
          {!user ? (
            <>
              {!google && <FormMessage tone="error">Google sign-in isn&apos;t switched on yet. Please try again a little later.</FormMessage>}
              <div className="so-shine-hover">
                <GoogleButton identity={googleIdentity()} next={here} disabled={!google} />
              </div>
              <Steps active={1} />
            </>
          ) : matches ? (
            <>
              <form action={acceptInviteLinkAction}>
                <input type="hidden" name="invitationId" value={invite.id} />
                <button type="submit" className={buttonClass("primary", "lg", "w-full")}>
                  Join {invite.workspaceName} <Icon name="arrow-right" size={15} />
                </button>
              </form>
              <p className="text-center text-[13px] text-muted">Signed in as {user.email}</p>
            </>
          ) : (
            <>
              <FormMessage tone="error">
                You&apos;re signed in as {user.email}, but this access is for {invite.email}. Sign out, then sign in with Google using {invite.email}.
              </FormMessage>
              <form action="/auth/sign-out" method="post">
                <input type="hidden" name="next" value={here} />
                <button type="submit" className={buttonClass("primary", "lg", "w-full")}>
                  Sign out and switch account
                </button>
              </form>
            </>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <BusinessPublicHeader signedIn={Boolean(user)} />
      <div className="theme-dark bg-bg text-fg">
        <section className="hero-glow so-grain relative min-h-[72vh] overflow-hidden border-b border-line">
          <Aurora />
          <Container className="relative flex justify-center py-12 sm:py-20">
            <div className="so-rise w-full max-w-md">
              <div className="so-beam rounded-[22px] border border-line-strong bg-surface/90 p-6 shadow-[0_30px_70px_-40px_rgb(0_0_0/0.8)] backdrop-blur-md sm:p-8" data-invite>
                {body}
              </div>
              <p className="mt-5 flex justify-center gap-2 text-center text-[12.5px] leading-relaxed text-faint">
                <Icon name="lock" size={14} className="mt-0.5 shrink-0 text-accent-ink" />
                <span>Saver Option only receives your name, email address and profile picture from Google — no access to Gmail, Drive or Calendar.</span>
              </p>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}

function Title({ icon, children }: { icon: "alert" | "check" | "info" | "users"; children: ReactNode }) {
  return (
    <>
      <span aria-hidden="true" className="icon-tile mb-5 size-11">
        <Icon name={icon} size={21} />
      </span>
      <h1 className="text-[1.6rem] font-semibold leading-tight tracking-tight text-heading">{children}</h1>
    </>
  );
}

/** What happens after "Continue with Google". */
function Steps({ active }: { active: number }) {
  const steps = ["Continue with Google using the address above", "You come back here", "Choose Join, and you're in"];
  return (
    <ol className="space-y-2 border-t border-line pt-4 text-[13px] text-muted">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-2.5">
          <span className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${i + 1 === active ? "bg-accent text-white" : "bg-subtle text-faint"}`}>{i + 1}</span>
          {s}
        </li>
      ))}
    </ol>
  );
}
