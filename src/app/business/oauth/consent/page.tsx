import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { approveConnectionAction, denyConnectionAction } from "@/app/business/oauth/consent/actions";
import { BusinessPublicHeader } from "@/components/business/public-header";
import { Icon, type IconProps } from "@/components/ui/icon";
import { buttonClass, Container } from "@/components/ui/primitives";
import { roleLabels } from "@/lib/business/constants";
import { can } from "@/lib/business/permissions";
import { getBizSession, listMemberships } from "@/lib/server/business/context";
import { isLoopback, parseAuthRequest, SCOPE_WRITE } from "@/lib/server/mcp/oauth";
import { decodePending, PENDING_COOKIE, urlsFromHeaders } from "@/lib/server/mcp/pending";

export const metadata = { title: "Connect an AI client", robots: { index: false, follow: false } };

const errors: Record<string, string> = {
  expired: "This connection request expired or was already used. Start connecting again from your AI client.",
  request: "This connection request isn't valid — the app may not be registered, or it asked to return to an address it didn't register. Start connecting again from your AI client.",
  workspace: "You aren't a member of that workspace. Pick one of yours and try again.",
  unavailable: "Saver Option Business isn't available right now. Try again later.",
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BusinessPublicHeader signedIn />
      <div className="theme-dark bg-bg text-fg">
        <section className="hero-glow relative min-h-[72vh] overflow-hidden border-b border-line">
          <Container className="relative py-12 sm:py-16">
            <div className="mx-auto w-full max-w-xl rounded-[22px] border border-line-strong bg-surface p-6 shadow-[0_30px_70px_-40px_rgb(0_0_0/0.8)] sm:p-8">{children}</div>
          </Container>
        </section>
      </div>
    </>
  );
}

function Point({ icon, children, tone = "ok" }: { icon: IconProps["name"]; children: React.ReactNode; tone?: "ok" | "no" }) {
  return (
    <li className="flex gap-2.5 text-[13.5px] leading-snug text-muted">
      <Icon name={icon} size={15} className={tone === "ok" ? "mt-0.5 shrink-0 text-accent-ink" : "mt-0.5 shrink-0 text-faint"} />
      <span>{children}</span>
    </li>
  );
}

export default async function ConsentPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const q = await props.searchParams;
  const errorKey = typeof q.error === "string" ? q.error : null;
  if (errorKey) {
    return (
      <Shell>
        <h1 className="text-[1.4rem] font-semibold text-heading">Couldn&apos;t connect</h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-muted">{errors[errorKey] ?? errors.request}</p>
        <Link href="/business/docs/mcp" className="mt-5 inline-flex text-[14px] font-semibold text-accent-ink hover:underline">
          How connecting AI clients works
        </Link>
      </Shell>
    );
  }

  const raw = decodePending((await cookies()).get(PENDING_COOKIE)?.value);
  if (!raw) redirect("/business/oauth/consent?error=expired");
  const urls = await urlsFromHeaders();
  const parsed = await parseAuthRequest(raw, urls);
  if (!parsed.ok) redirect("/business/oauth/consent?error=request");
  const { user } = await getBizSession();
  if (!user) redirect("/business/login?next=/business/oauth/consent");
  const memberships = await listMemberships(user.id);
  const { client, req } = parsed;
  const host = new URL(req.redirectUri).host;
  const loopback = isLoopback(req.redirectUri);
  const wantsWrite = req.scopes.includes(SCOPE_WRITE);

  return (
    <Shell>
      <span aria-hidden="true" className="icon-tile mb-5 size-11">
        <Icon name="sparkles" size={21} />
      </span>
      <h1 className="text-[1.5rem] font-semibold leading-tight tracking-tight text-heading">Connect an AI client to Saver Option Business</h1>
      <p className="mt-2 text-[14.5px] leading-relaxed text-muted">
        <strong className="text-fg">{client.name ?? "An app"}</strong> wants to use your workspace&apos;s software spending data through the Model Context Protocol (MCP).
        The name is what the app registered itself as — Saver Option hasn&apos;t verified it.
      </p>
      <div className="mt-4 rounded-xl border border-line bg-subtle px-3.5 py-3 text-[13px]">
        <p className="text-muted">
          After you decide, you&apos;ll be sent back to <strong className="text-fg">{host}</strong>
        </p>
        <p className="mt-0.5 break-all text-[12px] text-faint">{req.redirectUri}</p>
        {loopback && (
          <p className="mt-2 flex gap-2 text-[12.5px] text-warn">
            <Icon name="alert" size={14} className="mt-0.5 shrink-0" />
            This returns to an app running on this computer (a command-line or desktop client). Only continue if you just started connecting from such an app yourself.
          </p>
        )}
      </div>

      {memberships.length === 0 ? (
        <div className="mt-6">
          <p className="text-[14px] text-muted">You don&apos;t have a workspace yet. Create one first, then start connecting again from your AI client.</p>
          <Link href="/business/onboarding" className={buttonClass("primary", "md", "mt-4")}>
            Create a workspace
          </Link>
        </div>
      ) : (
        <form className="mt-6 space-y-6">
          <fieldset>
            <legend className="text-[13.5px] font-semibold text-fg">Workspace</legend>
            <p className="text-[12.5px] text-faint">The connection can reach this one workspace only.</p>
            <div className="mt-2 space-y-2">
              {memberships.map((m, i) => (
                <label key={m.workspaceId} className="flex cursor-pointer items-center gap-3 rounded-xl border border-line px-3.5 py-2.5 has-[:checked]:border-accent has-[:checked]:bg-accent-soft/40">
                  <input type="radio" name="workspaceId" value={m.workspaceId} defaultChecked={i === 0} className="accent-[var(--accent)]" required />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-medium text-fg">{m.name}</span>
                    <span className="block text-[12px] text-faint">
                      Your role: {roleLabels[m.role]}
                      {m.isDemo ? " · demo data" : ""}
                      {wantsWrite && !can(m.role, "records.manage") ? " · read-only for your role" : ""}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-[13.5px] font-semibold text-fg">Access</legend>
            <div className="mt-2 space-y-2">
              <label className="flex cursor-pointer gap-3 rounded-xl border border-line px-3.5 py-2.5 has-[:checked]:border-accent has-[:checked]:bg-accent-soft/40">
                <input type="radio" name="access" value="read" defaultChecked className="mt-1 accent-[var(--accent)]" />
                <span>
                  <span className="block text-[14px] font-medium text-fg">Read only</span>
                  <span className="block text-[12.5px] text-muted">View subscriptions, spending, renewals, savings opportunities and Saver Option deals.</span>
                </span>
              </label>
              <label className={wantsWrite ? "flex cursor-pointer gap-3 rounded-xl border border-line px-3.5 py-2.5 has-[:checked]:border-accent has-[:checked]:bg-accent-soft/40" : "flex gap-3 rounded-xl border border-dashed border-line px-3.5 py-2.5 opacity-60"}>
                <input type="radio" name="access" value="write" disabled={!wantsWrite} className="mt-1 accent-[var(--accent)]" />
                <span>
                  <span className="block text-[14px] font-medium text-fg">Read and change</span>
                  <span className="block text-[12.5px] text-muted">
                    Also add and update subscription records — each change is shown to you for confirmation first. Needs the Owner, Admin or Finance role.
                    {!wantsWrite && " This app only asked for read access."}
                  </span>
                </span>
              </label>
            </div>
          </fieldset>

          <ul className="space-y-1.5">
            <Point icon="check">Your permissions apply to every request, and it can never reach other workspaces.</Point>
            <Point icon="x" tone="no">
              It can&apos;t cancel, renew or buy subscriptions, make payments, or change anything at your vendors.
            </Point>
            <Point icon="x" tone="no">
              It doesn&apos;t get access to your Google account.
            </Point>
            <Point icon="check">Disconnect any time in Saver Option Business → AI clients (MCP).</Point>
          </ul>

          <div className="flex flex-wrap gap-2 border-t border-line pt-5">
            <button type="submit" formAction={approveConnectionAction} className={buttonClass("primary", "md")}>
              Allow access
            </button>
            <button type="submit" formAction={denyConnectionAction} formNoValidate className={buttonClass("secondary", "md")}>
              Cancel
            </button>
          </div>
          <p className="text-[12px] text-faint">
            Signed in as {user.email}. Data the AI client receives is processed by that client under its own terms; see the{" "}
            <Link href="/privacy" className="underline underline-offset-2">
              privacy policy
            </Link>
            .
          </p>
        </form>
      )}
    </Shell>
  );
}
