import { CompanyForm } from "@/components/business/settings-forms";
import { Card, DefinitionList, PageHeader } from "@/components/business/ui";
import { can } from "@/lib/business/permissions";
import { requireBizContext } from "@/lib/server/business/context";

export const metadata = { title: "Company settings" };

export default async function CompanySettingsPage() {
  const ctx = await requireBizContext("/business/settings/company");
  const ws = ctx.workspace;
  const editable = can(ctx.role, "workspace.manage");
  return (
    <>
      <PageHeader
        title="Company"
        description="How your company appears in this workspace."
        crumbs={[{ label: "Settings", href: "/business/settings" }, { label: "Company" }]}
      />
      <Card className="max-w-3xl">
        {editable ? (
          <CompanyForm
            workspaceId={ws.id}
            values={{
              name: ws.name,
              industry: ws.industry,
              companySize: ws.companySize,
              website: ws.website,
              logoUrl: ws.logoUrl,
              contactName: ws.contactName,
              contactEmail: ws.contactEmail,
              contactPhone: ws.contactPhone,
            }}
          />
        ) : (
          <>
            <p className="mb-4 text-[13px] text-faint">Only owners and admins can change company details.</p>
            <DefinitionList
              items={[
                { label: "Company name", value: ws.name },
                { label: "Industry", value: ws.industry ?? "—" },
                { label: "Company size", value: ws.companySize ? `${ws.companySize} people` : "—" },
                { label: "Website", value: ws.website ?? "—" },
                { label: "Contact name", value: ws.contactName ?? "—" },
                { label: "Contact email", value: ws.contactEmail ?? "—" },
                { label: "Contact phone", value: ws.contactPhone ?? "—" },
              ]}
            />
          </>
        )}
      </Card>
    </>
  );
}
