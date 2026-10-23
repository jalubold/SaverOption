import { AddSoftwareWizard } from "@/components/business/add-software-wizard";
import { InlineNote, PageHeader } from "@/components/business/ui";
import { can } from "@/lib/business/permissions";
import { requireBizContext } from "@/lib/server/business/context";
import { getDepartments, getPeople, getSoftwareList } from "@/lib/server/business/data";

export const metadata = { title: "Add to software inventory" };

export default async function NewSoftwarePage() {
  const ctx = await requireBizContext("/business/software/new");
  const crumbs = [{ label: "Software Inventory", href: "/business/software" }, { label: "Add software" }];
  if (!can(ctx.role, "records.manage")) {
    return (
      <>
        <PageHeader title="Add software" crumbs={crumbs} />
        <InlineNote title="Your role can't add software">Owners, admins and finance can add software to the inventory. Ask one of them to add it, or to change your role.</InlineNote>
      </>
    );
  }
  const ws = ctx.workspace.id;
  const [software, people, departments] = await Promise.all([getSoftwareList(ws), getPeople(ws), getDepartments(ws)]);
  return (
    <>
      <PageHeader
        title="Add to software inventory"
        description="Record a tool your company uses — even without a paid plan. Untick “No paid subscription yet” to add its subscription in the same step."
        crumbs={crumbs}
      />
      <div className="max-w-3xl">
        <AddSoftwareWizard
          workspaceId={ws}
          software={software.filter((s) => s.status !== "archived").map((s) => ({ id: s.id, name: s.name, vendorName: s.vendorName, category: s.category }))}
          people={people.filter((p) => p.status === "active").map((p) => ({ id: p.id, name: p.name, departmentName: p.departmentName }))}
          departments={departments.filter((d) => !d.archivedAt).map((d) => ({ id: d.id, name: d.name }))}
          defaultCurrency={ctx.workspace.defaultCurrency}
          defaultOwnerId={ctx.personId}
          today={ctx.today}
          initialMode="new"
          softwareOnly
        />
      </div>
    </>
  );
}
