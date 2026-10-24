import { notFound } from "next/navigation";
import { LogoTitle } from "@/components/business/logo-title";
import { SubscriptionForm } from "@/components/business/subscription-form";
import { InlineNote, LinkButton, PageHeader } from "@/components/business/ui";
import { isUuid } from "@/lib/business/form";
import { canEditRecord } from "@/lib/business/permissions";
import { requireBizContext } from "@/lib/server/business/context";
import { getDepartments, getPeople, getSoftware, getSubscription } from "@/lib/server/business/data";

export const metadata = { title: "Edit subscription" };

export default async function EditSubscriptionPage(props: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await props.params;
  const ctx = await requireBizContext(`/business/subscriptions/${encodeURIComponent(rawId)}/edit`);
  if (!isUuid(rawId)) notFound();
  const id = rawId.toLowerCase();
  const sub = await getSubscription(ctx, id);
  if (!sub) notFound();
  const ws = ctx.workspace.id;
  const [software, people, departments] = await Promise.all([getSoftware(ctx, sub.softwareId), getPeople(ws), getDepartments(ws)]);
  const crumbs = [
    { label: "Subscriptions", href: "/business/subscriptions" },
    { label: sub.softwareName, href: `/business/subscriptions/${id}` },
    { label: "Edit" },
  ];
  const title = (
    <LogoTitle name={sub.softwareName} src={sub.logoSrc} size={40}>
      Edit {sub.softwareName}
      {sub.planName ? ` · ${sub.planName}` : ""}
    </LogoTitle>
  );

  if (!canEditRecord(ctx.role, { ownerPersonId: sub.ownerPersonId }, ctx.personId)) {
    return (
      <>
        <PageHeader title={title} crumbs={crumbs} />
        <InlineNote title="You can view this subscription but not change it">
          Owners, admins and finance can edit any subscription; members can edit the ones they own. <LinkButton href={`/business/subscriptions/${id}`}>Back to the subscription</LinkButton>
        </InlineNote>
      </>
    );
  }
  if (sub.archived) {
    return (
      <>
        <PageHeader title={title} crumbs={crumbs} />
        <InlineNote tone="warn" title="This subscription is archived">
          Restore it from its page before editing. <LinkButton href={`/business/subscriptions/${id}`}>Open the subscription</LinkButton>
        </InlineNote>
      </>
    );
  }

  // The form edits the subscription's own owner and department; empty means "same as the software".
  const ownOwner = sub.ownSubscriptionOwner ? sub.ownerPersonId : null;
  const ownDepartment = sub.ownSubscriptionDepartment ? sub.departmentId : null;
  const activePeople = people.filter((p) => p.status === "active" || p.id === ownOwner);
  const liveDepartments = departments.filter((d) => !d.archivedAt);
  const archivedDepartment = ownDepartment ? departments.find((d) => d.id === ownDepartment && d.archivedAt) : undefined;

  return (
    <>
      <PageHeader title={title} description="Price, interval or seat changes are recorded in the cost history from today." crumbs={crumbs} />
      <div className="max-w-3xl space-y-4">
        {archivedDepartment && (
          <InlineNote tone="warn" title={`The ${archivedDepartment.name} department is archived`}>
            Choose another department, or leave it as “same as the software”. Saving removes the archived department from this subscription.
          </InlineNote>
        )}
        <SubscriptionForm
          workspaceId={ws}
          values={{
            id,
            planName: sub.planName,
            priceMinor: sub.priceMinor,
            currency: sub.currency,
            pricingModel: sub.pricingModel,
            billingInterval: sub.billingInterval,
            customIntervalCount: sub.customIntervalCount,
            customIntervalUnit: sub.customIntervalUnit,
            startDate: sub.startDate,
            nextRenewalDate: sub.nextRenewalDate,
            autoRenew: sub.autoRenew,
            cancellationDeadline: sub.cancellationDeadline,
            contractEndDate: sub.contractEndDate,
            status: sub.status,
            endedOn: sub.endedOn,
            purchasedSeats: sub.purchasedSeats,
            reportedAssignedSeats: sub.reportedAssignedSeats,
            paymentMethod: sub.paymentMethod,
            ownerPersonId: ownOwner,
            departmentId: ownDepartment,
            contractReference: sub.contractReference,
            contractNotes: sub.contractNotes,
            notes: sub.notes,
            annualPriceOptionMinor: sub.annualPriceOptionMinor,
            reminderDays: sub.reminderDays,
          }}
          people={activePeople.map((p) => ({ id: p.id, name: p.name, departmentName: p.departmentName }))}
          departments={liveDepartments.map((d) => ({ id: d.id, name: d.name }))}
          inheritedOwner={software?.ownerName ?? null}
          inheritedDepartment={software?.departmentName ?? null}
          defaultReminderDays={ctx.workspace.reminderDays}
        />
      </div>
    </>
  );
}
