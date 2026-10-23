import Link from "next/link";
import { acceptInvitationAction, completeOnboardingAction, createDemoAction } from "@/app/business/actions/workspace";
import { AddSoftwareWizard } from "@/components/business/add-software-wizard";
import { CreateWorkspaceForm } from "@/components/business/onboarding-forms";
import { Money } from "@/components/business/ui";
import { BrandMark } from "@/components/brand/logo";
import { FormMessage } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { buttonClass, cn } from "@/components/ui/primitives";
import { summarizeSpend } from "@/lib/business/calc";
import { roleLabels } from "@/lib/business/constants";
import { can } from "@/lib/business/permissions";
import { getBizSession, requireBizUser } from "@/lib/server/business/context";
import { getDepartments, getInvitationsForEmail, getPeople, getSoftwareList, getSubscriptions } from "@/lib/server/business/data";

export const metadata = { title: "Set up Saver Option Business", robots: { index: false, follow: false } };

const stepNames = ["Create workspace", "Add your first subscription", "Open the dashboard"];

export default async function OnboardingPage(props: PageProps<"/business/onboarding">) {
  const q = await props.searchParams;
  const user = await requireBizUser("/business/onboarding");
  const { ctx } = await getBizSession();
  const invitations = user.emailConfirmed ? await getInvitationsForEmail(user.email) : [];
  const wantsNew = q.new === "1";
  const step = !ctx || wantsNew ? 0 : q.step === "done" ? 2 : 1;

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="theme-dark border-b border-line bg-bg">
        <div className="mx-auto flex h-14 max-w-4xl items-center gap-3 px-4 sm:px-6">
          <BrandMark size={26} />
          <span className="text-[14px] font-semibold text-fg">
            Saver Option <span className="text-accent-ink">Business</span>
          </span>
          <span className="ml-auto hidden truncate text-[12.5px] text-faint sm:block">{user.email}</span>
          <form action="/auth/sign-out" method="post">
            <input type="hidden" name="next" value="/business" />
            <button type="submit" className={buttonClass("secondary", "sm")}>
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:px-6">
        <ol className="mb-8 flex flex-wrap gap-2 text-[12.5px]" aria-label="Setup steps">
          {stepNames.map((s, i) => (
            <li key={s} className={cn("flex items-center gap-2 rounded-full border px-3 py-1", i === step ? "border-accent bg-accent-soft text-accent-ink" : i < step ? "border-line text-muted" : "border-line text-faint")}>
              <span className="font-semibold">{i < step ? <Icon name="check" size={12} /> : i + 1}</span> {s}
            </li>
          ))}
        </ol>

        {q.error === "invitation" && (
          <div className="mb-6">
            <FormMessage tone="error">That invitation isn&apos;t available for your account any more.</FormMessage>
          </div>
        )}

        {step === 0 && (
          <>
            {invitations.length > 0 && !wantsNew && (
              <section className="biz-card mb-6 p-5">
                <h2 className="text-[15px] font-semibold">You have access waiting</h2>
                <p className="mt-1 text-[13.5px] text-muted">These workspaces gave access to {user.email}. Joining is up to you.</p>
                <ul className="mt-3 divide-y divide-line">
                  {invitations.map((inv) => (
                    <li key={inv.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
                      <span className="text-[14px]">
                        <strong className="font-semibold">{inv.workspaceName}</strong> <span className="text-faint">· {roleLabels[inv.role]}</span>
                      </span>
                      <form action={acceptInvitationAction}>
                        <input type="hidden" name="invitationId" value={inv.id} />
                        <button type="submit" className={buttonClass("primary", "sm")}>
                          Join workspace
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <section className="biz-card p-5 sm:p-7">
              <h1 className="text-[22px] font-semibold tracking-tight">Create your company workspace</h1>
              <p className="mt-1 text-[14px] text-muted">A workspace holds your company&apos;s software, subscriptions and team. You can invite colleagues later.</p>
              <div className="mt-6">
                <CreateWorkspaceForm />
              </div>
            </section>
            <section className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-line-strong px-5 py-4">
              <div>
                <p className="text-[14px] font-medium">Just looking around?</p>
                <p className="text-[13px] text-muted">Open a separate demo workspace with a fictional company&apos;s sample data. It never mixes with your own.</p>
              </div>
              <form action={createDemoAction}>
                <button type="submit" className={buttonClass("secondary", "md")}>
                  <Icon name="sparkles" size={14} /> Explore the demo
                </button>
              </form>
            </section>
            {ctx && (
              <p className="mt-6 text-center text-[13px]">
                <Link href="/business/dashboard" className="text-accent-ink underline underline-offset-2">
                  Back to {ctx.workspace.name}
                </Link>
              </p>
            )}
          </>
        )}

        {step === 1 && ctx && <FirstSubscription ctx={ctx} />}
        {step === 2 && ctx && <Done ctx={ctx} />}
      </main>
    </div>
  );
}

async function FirstSubscription({ ctx }: { ctx: NonNullable<Awaited<ReturnType<typeof getBizSession>>["ctx"]> }) {
  const ws = ctx.workspace.id;
  const [software, people, departments] = await Promise.all([getSoftwareList(ws), getPeople(ws), getDepartments(ws)]);
  if (!can(ctx.role, "records.manage")) return <Done ctx={ctx} />;
  return (
    <section>
      <h1 className="text-[22px] font-semibold tracking-tight">Add your first subscription</h1>
      <p className="mb-5 mt-1 text-[14px] text-muted">
        Start with one tool your company pays for. Licenses and renewal details are optional — you can add them now or later.
      </p>
      <AddSoftwareWizard
        workspaceId={ws}
        software={software.filter((s) => s.status !== "archived").map((s) => ({ id: s.id, name: s.name, vendorName: s.vendorName, category: s.category }))}
        people={people.filter((p) => p.status === "active").map((p) => ({ id: p.id, name: p.name, departmentName: p.departmentName }))}
        departments={departments.filter((d) => !d.archivedAt).map((d) => ({ id: d.id, name: d.name }))}
        defaultCurrency={ctx.workspace.defaultCurrency}
        defaultOwnerId={ctx.personId}
        today={ctx.today}
        initialMode="new"
        after="onboarding"
      />
      <div className="mt-4 flex justify-end">
        <Link href="/business/onboarding?step=done" className={buttonClass("ghost", "sm")}>
          Skip for now
        </Link>
      </div>
    </section>
  );
}

async function Done({ ctx }: { ctx: NonNullable<Awaited<ReturnType<typeof getBizSession>>["ctx"]> }) {
  const subs = await getSubscriptions(ctx.workspace.id);
  const s = summarizeSpend(subs, ctx.today);
  return (
    <section className="biz-card p-5 sm:p-7">
      <h1 className="text-[22px] font-semibold tracking-tight">{ctx.workspace.name} is ready</h1>
      {s.activeCount > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-line px-4 py-3">
            <p className="text-[12px] text-faint">Monthly software spend</p>
            <Money totals={s.monthly} preferred={ctx.workspace.defaultCurrency} className="mt-1 text-[18px] font-semibold" />
          </div>
          <div className="rounded-xl border border-line px-4 py-3">
            <p className="text-[12px] text-faint">Annualized recurring cost</p>
            <Money totals={s.annualized} preferred={ctx.workspace.defaultCurrency} className="mt-1 text-[18px] font-semibold" />
          </div>
          <div className="rounded-xl border border-line px-4 py-3">
            <p className="text-[12px] text-faint">Active subscriptions</p>
            <p className="tabular mt-1 text-[18px] font-semibold">{s.activeCount}</p>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-[14px] text-muted">Your dashboard fills in as you add subscriptions.</p>
      )}
      <ul className="mt-6 space-y-2 text-[13.5px] text-muted">
        <li className="flex gap-2">
          <Icon name="calendar" size={15} className="mt-0.5 text-faint" /> Renewal reminders go out {ctx.workspace.reminderDays.join(", ")} days before each renewal — change that in Settings → Notifications.
        </li>
        <li className="flex gap-2">
          <Icon name="users" size={15} className="mt-0.5 text-faint" /> Give colleagues access from Team Members; they sign in with Google using the address you add.
        </li>
        <li className="flex gap-2">
          <Icon name="plus" size={15} className="mt-0.5 text-faint" /> Add more tools any time with “Add software”.
        </li>
      </ul>
      <form action={completeOnboardingAction} className="mt-6">
        <input type="hidden" name="workspaceId" value={ctx.workspace.id} />
        <button type="submit" className={buttonClass("primary", "lg")}>
          Open the dashboard <Icon name="arrow-right" size={15} />
        </button>
      </form>
    </section>
  );
}
