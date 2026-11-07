import Link from "next/link";
import type { ReactNode } from "react";
import { acceptInvitationAction, completeOnboardingAction, createDemoAction } from "@/app/business/actions/workspace";
import { AddSoftwareWizard } from "@/components/business/add-software-wizard";
import { CalendarConnect } from "@/components/business/calendar-connect";
import { CreateWorkspaceForm } from "@/components/business/onboarding-forms";
import { InviteForm, InviteSharePanel, InviteSteps } from "@/components/business/team-forms";
import { LogoStack } from "@/components/business/software-logo";
import { Money } from "@/components/business/ui";
import { BrandMark } from "@/components/brand/logo";
import { FormMessage } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { buttonClass, cn } from "@/components/ui/primitives";
import { summarizeSpend } from "@/lib/business/calc";
import { roleLabels } from "@/lib/business/constants";
import { inviteLink, inviteMessage } from "@/lib/business/invite";
import { assignableRoles, can } from "@/lib/business/permissions";
import { TRIAL_DAYS } from "@/lib/business/billing";
import { trialUsed } from "@/lib/server/business/billing";
import { calendarClientLabels, calendarStatus } from "@/lib/server/business/calendar";
import { getBizSession, requireBizUser, type BizContext } from "@/lib/server/business/context";
import { getDepartments, getInvitationsForEmail, getOpenInvitations, getPeople, getSoftwareList, getSubscriptions } from "@/lib/server/business/data";
import { requestOrigin } from "@/lib/server/origin";
import { regionDefaults } from "@/lib/server/business/visitor-region";

export const metadata = { title: "Set up Saver Option Business", robots: { index: false, follow: false } };

/** A few steps that matter, each one skippable; the last screen sums up what's set up. */
const stepNames = ["Create workspace", "First subscription", "Calendar", "Invite your team"];
const DONE = stepNames.length;
const stepByName: Record<string, number> = { subscription: 1, calendar: 2, team: 3, done: DONE };

export default async function OnboardingPage(props: PageProps<"/business/onboarding">) {
  const q = await props.searchParams;
  const user = await requireBizUser("/business/onboarding");
  const { ctx } = await getBizSession();
  const invitations = user.emailConfirmed ? await getInvitationsForEmail(user.email) : [];
  const wantsNew = q.new === "1";
  const step = !ctx || wantsNew ? 0 : (stepByName[typeof q.step === "string" ? q.step : ""] ?? 1);
  const usedTrial = step === 0 && (await trialUsed(user));

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header data-tauri-drag-region className="theme-dark border-b border-line bg-bg">
        <div data-tauri-drag-region className="mx-auto flex h-14 max-w-4xl items-center gap-3 px-4 sm:px-6 desktop-app:max-xl:pl-[84px]">
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
              <p className="mt-3 rounded-lg bg-subtle px-3 py-2 text-[13px] text-muted" data-trial-note={usedTrial ? "used" : "new"}>
                {usedTrial
                  ? "You've already used your free trial, so this workspace will need a paid plan (Settings → Plan & billing) before you can add records."
                  : `It starts with a ${TRIAL_DAYS}-day free trial with everything included — no card needed. After that, choose a paid plan to keep going.`}
              </p>
              <div className="mt-6">
                <CreateWorkspaceForm suggested={await regionDefaults()} next={q.next === "/business/redeem" ? "/business/redeem" : undefined} />
              </div>
            </section>
            <section className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-line-strong px-5 py-4" data-demo-offer>
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
        {step === 2 && ctx && <CalendarStep ctx={ctx} />}
        {step === 3 && ctx && <TeamStep ctx={ctx} invitedId={typeof q.invited === "string" ? q.invited : null} />}
        {step === DONE && ctx && <Done ctx={ctx} />}
      </main>
    </div>
  );
}

/** A step's heading, with its icon. */
function StepHeader({ icon, title, children }: { icon: "calendar" | "users"; title: string; children: ReactNode }) {
  return (
    <>
      <span aria-hidden="true" className="icon-tile mb-4 size-11">
        <Icon name={icon} size={20} />
      </span>
      <h1 className="text-[22px] font-semibold tracking-tight">{title}</h1>
      <p className="mt-1 max-w-xl text-[14px] leading-relaxed text-muted">{children}</p>
    </>
  );
}

/** Continue to the next step; the step can always be done later. */
function StepFooter({ next, later }: { next: string; later: string }) {
  return (
    <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
      <p className="text-[12.5px] text-faint">{later}</p>
      <Link href={next} className={buttonClass("primary", "md")} data-onboarding-next>
        Continue <Icon name="arrow-right" size={15} />
      </Link>
    </div>
  );
}

async function FirstSubscription({ ctx }: { ctx: BizContext }) {
  if (!can(ctx.role, "records.manage")) return <CalendarStep ctx={ctx} />;
  const ws = ctx.workspace.id;
  const [software, people, departments] = await Promise.all([getSoftwareList(ws), getPeople(ws), getDepartments(ws)]);
  return (
    <section>
      <h1 className="text-[22px] font-semibold tracking-tight">Add your first subscription</h1>
      <p className="mb-5 mt-1 text-[14px] text-muted">
        Start with one tool your company pays for. Licenses and renewal details are optional — you can add them now or later.
      </p>
      <AddSoftwareWizard
        workspaceId={ws}
        software={software.filter((s) => s.status !== "archived").map((s) => ({ id: s.id, name: s.name, vendorName: s.vendorName, category: s.category, logoSrc: s.logoSrc }))}
        people={people.filter((p) => p.status === "active").map((p) => ({ id: p.id, name: p.name, departmentName: p.departmentName }))}
        departments={departments.filter((d) => !d.archivedAt).map((d) => ({ id: d.id, name: d.name }))}
        defaultCurrency={ctx.workspace.defaultCurrency}
        defaultOwnerId={ctx.personId}
        today={ctx.today}
        initialMode="new"
        after="onboarding"
      />
      <div className="mt-4 flex justify-end">
        <Link href="/business/onboarding?step=calendar" className={buttonClass("ghost", "sm")}>
          Skip for now
        </Link>
      </div>
    </section>
  );
}

function CalendarStep({ ctx }: { ctx: BizContext }) {
  return (
    <section className="biz-card p-5 sm:p-7" data-onboarding-step="calendar">
      <StepHeader icon="calendar" title="Put renewals in your calendar">
        Every renewal and cancel-by date of {ctx.workspace.name} as an all-day event in Google Calendar, so nothing renews by surprise. It takes two clicks and
        stays private to you.
      </StepHeader>
      <div className="mt-6">
        <CalendarConnect ctx={ctx} />
      </div>
      <StepFooter next="/business/onboarding?step=team" later="You can also do this later in Settings → Notifications." />
    </section>
  );
}

async function TeamStep({ ctx, invitedId }: { ctx: BizContext; invitedId: string | null }) {
  const roles = assignableRoles(ctx.role).map((r) => ({ value: r, label: roleLabels[r] }));
  if (!can(ctx.role, "members.manage") || roles.length === 0) return <Done ctx={ctx} />;
  const [invitations, origin] = await Promise.all([getOpenInvitations(ctx.workspace.id), requestOrigin()]);
  const invited = invitedId ? invitations.find((i) => i.id === invitedId) : undefined;
  const others = invitations.filter((i) => i.id !== invited?.id);
  return (
    <section className="biz-card p-5 sm:p-7" data-onboarding-step="team">
      <StepHeader icon="users" title="Invite your team">
        Give colleagues access so they can see renewals and keep records up to date. Saver Option doesn&apos;t email anyone: you send each person their own
        invite link.
      </StepHeader>
      <div className="mt-6 space-y-4">
        <InviteForm workspaceId={ctx.workspace.id} roles={roles} after="onboarding" />
        {invited ? (
          <InviteSharePanel
            email={invited.email}
            role={roleLabels[invited.role]}
            workspace={ctx.workspace.name}
            url={inviteLink(origin, invited.id)}
            message={inviteMessage(ctx.workspace.name, invited.email, inviteLink(origin, invited.id))}
            doneHref="/business/onboarding?step=team"
          />
        ) : (
          <InviteSteps />
        )}
        {others.length > 0 && (
          <p className="text-[12.5px] text-muted" data-onboarding-invited>
            Also waiting to sign in: {others.map((i) => i.email).join(", ")}. Their invite links are under Team Members.
          </p>
        )}
      </div>
      <StepFooter next="/business/onboarding?step=done" later="Add people any time from Team Members." />
    </section>
  );
}

async function Done({ ctx }: { ctx: BizContext }) {
  const ws = ctx.workspace.id;
  const [subs, software, calendar, invitations] = await Promise.all([getSubscriptions(ws), getSoftwareList(ws), calendarStatus(ctx), getOpenInvitations(ws)]);
  const s = summarizeSpend(subs, ctx.today);
  const added = software.filter((sw) => sw.status !== "archived");
  const calendarApp = calendar.fetchedAt && calendar.client ? calendarClientLabels[calendar.client] : null;
  const checklist: { done: boolean; title: string; detail: string; href?: string; label?: string }[] = [
    { done: true, title: "Workspace created", detail: "Its currency, time zone and company details are in Settings." },
    added.length > 0
      ? { done: true, title: added.length === 1 ? `${added[0].name} added` : `${added.length} tools added`, detail: "Add more any time with “Add software”." }
      : { done: false, title: "No subscriptions yet", detail: "Add the tools your company pays for, and the dashboard fills in.", href: "/business/onboarding?step=subscription", label: "Add one" },
    calendarApp
      ? { done: true, title: calendar.client === "other" ? "Renewals in your calendar" : `Renewals in ${calendarApp}`, detail: "Each renewal and cancel-by date is an all-day event." }
      : {
          done: false,
          title: "Calendar not connected yet",
          detail: "Added it? It shows as connected once your calendar fetches it. Otherwise it's in Settings → Notifications.",
          href: "/business/onboarding?step=calendar",
          label: "Connect",
        },
    invitations.length > 0
      ? { done: true, title: `${invitations.length} colleague${invitations.length === 1 ? "" : "s"} invited`, detail: "They appear under Team Members once they sign in." }
      : { done: false, title: "No one invited yet", detail: "Give colleagues access from Team Members whenever you're ready." },
  ];
  return (
    <section className="biz-card p-5 sm:p-7" data-onboarding-step="done">
      {added.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <LogoStack items={added.map((sw) => ({ name: sw.name, src: sw.logoSrc }))} max={8} size={36} />
          <p className="text-[13px] text-muted">
            {added.length === 1 ? `${added[0].name} is in your inventory` : `${added.length} tools in your inventory`}
          </p>
        </div>
      )}
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
      <ul className="mt-6 divide-y divide-line rounded-xl border border-line" data-onboarding-checklist>
        {checklist.map((item) => (
          <li key={item.title} className="flex items-center gap-3 px-4 py-3" data-done={item.done ? "yes" : "no"}>
            <span
              aria-hidden="true"
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full",
                item.done ? "bg-success text-white" : "border border-dashed border-line-strong text-faint",
              )}
            >
              {item.done && <Icon name="check" size={13} />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13.5px] font-semibold text-fg">{item.title}</span>
              <span className="block text-[12.5px] leading-snug text-muted">{item.detail}</span>
            </span>
            {!item.done && item.href && (
              <Link href={item.href} className={buttonClass("ghost", "sm")}>
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-4 flex gap-2 text-[13px] text-muted">
        <Icon name="bell" size={15} className="mt-0.5 shrink-0 text-faint" /> Renewal reminders also appear in the app {ctx.workspace.reminderDays.join(", ")} days before
        each renewal — change that in Settings → Notifications.
      </p>
      <form action={completeOnboardingAction} className="mt-6">
        <input type="hidden" name="workspaceId" value={ctx.workspace.id} />
        <button type="submit" className={buttonClass("primary", "lg")}>
          Open the dashboard <Icon name="arrow-right" size={15} />
        </button>
      </form>
    </section>
  );
}
