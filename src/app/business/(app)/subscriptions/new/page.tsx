import { AddSoftwareWizard } from "@/components/business/add-software-wizard";
import { InlineNote, PageHeader } from "@/components/business/ui";
import { isUuid } from "@/lib/business/form";
import { can } from "@/lib/business/permissions";
import { requireBizContext } from "@/lib/server/business/context";
import { getDepartments, getPeople, getSoftwareList } from "@/lib/server/business/data";

export const metadata = { title: "Add software" };

export default async function NewSubscriptionPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const ctx = await requireBizContext("/business/subscriptions/new");
  const q = await props.searchParams;
  const crumbs = [{ label: "Subscriptions", href: "/business/subscriptions" }, { label: "Add software" }];
  if (!can(ctx.role, "records.manage")) {
    return (
      <>
        <PageHeader title="Add software" crumbs={crumbs} />
        <InlineNote title="Your role can't add software">Owners, admins and finance can add software and subscriptions. Ask one of them to add it, or to change your role.</InlineNote>
      </>
    );
  }
  const ws = ctx.workspace.id;
  const [software, people, departments] = await Promise.all([getSoftwareList(ws), getPeople(ws), getDepartments(ws)]);
  const live = software.filter((s) => s.status !== "archived");
  const requested = typeof q.software === "string" && isUuid(q.software) ? q.software.toLowerCase() : null;
  const wanted = requested ? live.find((s) => s.id === requested) : undefined;
  return (
    <>
      <PageHeader
        title={wanted ? `Add a subscription for ${wanted.name}` : "Add software"}
        description="Pick software from your inventory or add a new one, then enter the subscription, ownership and seats. Only the software is required."
        crumbs={crumbs}
      />
      <div className="max-w-3xl">
        <AddSoftwareWizard
          workspaceId={ws}
          software={live.map((s) => ({ id: s.id, name: s.name, vendorName: s.vendorName, category: s.category }))}
          people={people.filter((p) => p.status === "active").map((p) => ({ id: p.id, name: p.name, departmentName: p.departmentName }))}
          departments={departments.filter((d) => !d.archivedAt).map((d) => ({ id: d.id, name: d.name }))}
          defaultCurrency={ctx.workspace.defaultCurrency}
          defaultOwnerId={ctx.personId}
          today={ctx.today}
          initialSoftwareId={wanted?.id ?? null}
        />
      </div>
    </>
  );
}
