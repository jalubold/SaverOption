import { notFound } from "next/navigation";
import { LogoTitle } from "@/components/business/logo-title";
import { SoftwareForm } from "@/components/business/software-form";
import { InlineNote, LinkButton, PageHeader } from "@/components/business/ui";
import { isUuid } from "@/lib/business/form";
import { canEditRecord } from "@/lib/business/permissions";
import { requireBizContext } from "@/lib/server/business/context";
import { getDepartments, getPeople, getSoftware } from "@/lib/server/business/data";

export const metadata = { title: "Edit software" };

export default async function EditSoftwarePage(props: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await props.params;
  const ctx = await requireBizContext(`/business/software/${encodeURIComponent(rawId)}/edit`);
  if (!isUuid(rawId)) notFound();
  const id = rawId.toLowerCase();
  const sw = await getSoftware(ctx, id);
  if (!sw) notFound();
  const crumbs = [{ label: "Software Inventory", href: "/business/software" }, { label: sw.name, href: `/business/software/${id}` }, { label: "Edit" }];
  const title = (
    <LogoTitle name={sw.name} src={sw.logoSrc} size={40}>
      Edit {sw.name}
    </LogoTitle>
  );

  if (!canEditRecord(ctx.role, { ownerPersonId: sw.ownerPersonId }, ctx.personId)) {
    return (
      <>
        <PageHeader title={title} crumbs={crumbs} />
        <InlineNote title="You can view this software but not change it">
          Owners, admins and finance can edit any record; members can edit the ones they own. <LinkButton href={`/business/software/${id}`}>Back to {sw.name}</LinkButton>
        </InlineNote>
      </>
    );
  }
  if (sw.status === "archived") {
    return (
      <>
        <PageHeader title={title} crumbs={crumbs} />
        <InlineNote tone="warn" title="This software is archived">
          Restore it from its page before editing. <LinkButton href={`/business/software/${id}`}>Open {sw.name}</LinkButton>
        </InlineNote>
      </>
    );
  }

  const ws = ctx.workspace.id;
  const [people, departments] = await Promise.all([getPeople(ws), getDepartments(ws)]);
  const archivedDepartment = sw.departmentId ? departments.find((d) => d.id === sw.departmentId && d.archivedAt) : undefined;
  return (
    <>
      <PageHeader title={title} crumbs={crumbs} />
      <div className="max-w-3xl space-y-4">
        {archivedDepartment && (
          <InlineNote tone="warn" title={`The ${archivedDepartment.name} department is archived`}>
            Choose another department before saving; saving removes the archived department from this record.
          </InlineNote>
        )}
        <SoftwareForm
          workspaceId={ws}
          values={{
            id,
            name: sw.name,
            vendorName: sw.vendorName,
            category: sw.category,
            description: sw.description,
            businessPurpose: sw.businessPurpose,
            website: sw.website,
            ownerPersonId: sw.ownerPersonId,
            departmentId: archivedDepartment ? null : sw.departmentId,
            status: sw.status,
            notes: sw.notes,
          }}
          people={people.filter((p) => p.status === "active" || p.id === sw.ownerPersonId).map((p) => ({ id: p.id, name: p.name, departmentName: p.departmentName }))}
          departments={departments.filter((d) => !d.archivedAt).map((d) => ({ id: d.id, name: d.name }))}
        />
      </div>
    </>
  );
}
