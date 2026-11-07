import Link from "next/link";
import { GoogleButton } from "@/components/auth/auth-forms";
import { BrandMark } from "@/components/brand/logo";
import { RedeemForm } from "@/components/business/redeem-form";
import { FormMessage } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { buttonClass } from "@/components/ui/primitives";
import { LIFETIME_MAX_CODES, planLabels } from "@/lib/business/billing";
import { normalizeCode } from "@/lib/business/lifetime-codes";
import { businessReady, getBizSession } from "@/lib/server/business/context";
import { redeemTargets, type RedeemTarget } from "@/lib/server/business/lifetime";
import { memberLimit } from "@/lib/server/business/plans";
import { googleIdentity } from "@/lib/server/google-identity";
import { googleSignInEnabled } from "@/lib/server/supabase";

export const metadata = { title: "Redeem your AppSumo code", robots: { index: false, follow: false } };

/** Where onboarding sends people back to after they create a workspace for their code. */
const NEW_WORKSPACE = "/business/onboarding?new=1&next=/business/redeem";

function targetLabel(t: RedeemTarget): string {
  return t.plan ? `${t.name} (${planLabels[t.plan]} for life, a second code makes it Business)` : t.name;
}

/**
 * /business/redeem: where AppSumo buyers turn a code into a lifetime plan.
 * Signed out: Continue with Google, which comes straight back here. Signed in:
 * the code and the workspace it goes to (owners and admins only), or a link to
 * create the workspace first.
 */
export default async function RedeemPage(props: PageProps<"/business/redeem">) {
  const q = await props.searchParams;
  const prefill = normalizeCode(typeof q.code === "string" ? q.code : "") ?? "";
  const back = prefill ? `/business/redeem?code=${encodeURIComponent(prefill)}` : "/business/redeem";
  const ready = businessReady();
  const { user, ctx } = await getBizSession();
  const proLimit = memberLimit("pro");

  let body: React.ReactNode;
  if (!ready) {
    body = <FormMessage tone="error">Saver Option Business isn&apos;t available right now. Please try again later.</FormMessage>;
  } else if (!user) {
    const google = await googleSignInEnabled();
    body = (
      <section className="biz-card p-5 sm:p-6" data-redeem="sign-in">
        <h2 className="text-[16px] font-semibold text-fg">Sign in to redeem</h2>
        <p className="mt-1 text-[13.5px] leading-relaxed text-muted">
          Use the Google account you want to use Saver Option with. New here? The same button creates your account, and you&apos;ll come straight back to this page.
        </p>
        <div className="mt-5 space-y-3">
          {!google && <FormMessage tone="error">Google sign-in isn&apos;t switched on yet. Please try again a little later.</FormMessage>}
          <GoogleButton identity={await googleIdentity()} next={back} disabled={!google} />
        </div>
      </section>
    );
  } else {
    const targets = await redeemTargets(user);
    const managed = targets.filter((t) => t.canRedeem);
    const open = managed.filter((t) => t.codes < LIFETIME_MAX_CODES);
    const memberOnly = targets.filter((t) => !t.canRedeem);
    const initial = open.find((t) => t.workspaceId === ctx?.workspace.id)?.workspaceId ?? open[0]?.workspaceId;

    body = (
      <>
        {open.length > 0 && initial ? (
          <section className="biz-card p-5 sm:p-6" data-redeem="form">
            <RedeemForm workspaces={open.map((t) => ({ value: t.workspaceId, label: targetLabel(t) }))} initialWorkspace={initial} initialCode={prefill} />
            <p className="mt-5 border-t border-line pt-4 text-[12.5px] text-faint">
              Want this code on a different company?{" "}
              <Link href={NEW_WORKSPACE} className="font-medium text-accent-ink underline underline-offset-2">
                Create a new workspace
              </Link>{" "}
              and you&apos;ll come back here.
            </p>
          </section>
        ) : (
          <section className="biz-card p-5 sm:p-6" data-redeem="no-workspace">
            <h2 className="text-[16px] font-semibold text-fg">{managed.length ? "All your workspaces already have Business for life" : "First, create your company's workspace"}</h2>
            <p className="mt-1 text-[13.5px] leading-relaxed text-muted">
              {managed.length
                ? "That's the highest plan, so this code can't add anything there. Create a new workspace to use it."
                : "The code is applied to a workspace: your company's software, renewals and team. It takes a minute, and you'll come straight back here to redeem."}
            </p>
            <div className="mt-5">
              <Link href={NEW_WORKSPACE} className={buttonClass("primary", "md")}>
                <Icon name="building" size={15} />
                Create workspace
              </Link>
            </div>
          </section>
        )}
        {memberOnly.length > 0 && (
          <p className="mt-4 flex gap-2 text-[12.5px] leading-relaxed text-faint">
            <Icon name="info" size={14} className="mt-0.5 shrink-0 text-accent-ink" />
            <span>
              You&apos;re also a member of {memberOnly.map((t) => t.name).join(", ")}. Only owners and admins can redeem a code for a workspace, so ask one of them, or create your own workspace.
            </span>
          </p>
        )}
      </>
    );
  }

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header data-tauri-drag-region className="theme-dark border-b border-line bg-bg">
        <div data-tauri-drag-region className="mx-auto flex h-14 max-w-4xl items-center gap-3 px-4 sm:px-6 desktop-app:max-xl:pl-[84px]">
          <BrandMark size={26} />
          <span className="text-[14px] font-semibold text-fg">
            Saver Option <span className="text-accent-ink">Business</span>
          </span>
          {user && (
            <>
              <span className="ml-auto hidden truncate text-[12.5px] text-faint sm:block">{user.email}</span>
              <form action="/auth/sign-out" method="post">
                <input type="hidden" name="next" value="/business/redeem" />
                <button type="submit" className={buttonClass("secondary", "sm")}>
                  Sign out
                </button>
              </form>
            </>
          )}
        </div>
      </header>
      <main id="main" className="mx-auto max-w-xl px-4 pb-20 pt-10 sm:px-6">
        <p className="eyebrow">AppSumo lifetime deal</p>
        <h1 className="mt-3 text-[1.7rem] font-semibold leading-tight tracking-tight text-heading">Redeem your code</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">Turn your AppSumo code into a lifetime plan for your company&apos;s workspace. No subscription and no card needed.</p>

        <div className="mt-8">{body}</div>

        <section aria-labelledby="how-heading" className="mt-10">
          <h2 id="how-heading" className="text-[14px] font-semibold text-fg">
            How it works
          </h2>
          <ul className="mt-3 grid gap-2.5 text-[13.5px] leading-relaxed text-muted">
            <li className="flex gap-2">
              <Icon name="check" size={15} className="mt-0.5 shrink-0 text-success" />
              <span>
                <strong className="font-medium text-fg">1 code:</strong> Pro for life, with every feature and {proLimit === null ? "unlimited members" : `up to ${proLimit} members`}.
              </span>
            </li>
            <li className="flex gap-2">
              <Icon name="check" size={15} className="mt-0.5 shrink-0 text-success" />
              <span>
                <strong className="font-medium text-fg">2 codes on the same workspace:</strong> Business for life, with unlimited members. Redeem the second code here the same way.
              </span>
            </li>
            <li className="flex gap-2">
              <Icon name="check" size={15} className="mt-0.5 shrink-0 text-success" />
              <span>Lifetime plans don&apos;t renew and never ask for a card. Each code works once, on one workspace.</span>
            </li>
            <li className="flex gap-2">
              <Icon name="check" size={15} className="mt-0.5 shrink-0 text-success" />
              <span>If you get a refund from AppSumo, its code is deactivated and the plan it gave ends.</span>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
