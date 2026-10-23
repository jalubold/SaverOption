"use client";

import { updateSoftwareAction } from "@/app/business/actions/records";
import { categoryLabels, SOFTWARE_CATEGORIES, softwareStatusLabels, type SoftwareCategory, type SoftwareStatus } from "@/lib/business/constants";
import { ActionForm, SelectField, Submit, TextAreaField, TextField } from "@/components/business/forms";
import { LinkButton } from "@/components/business/ui";

export interface SoftwareFormValues {
  id: string;
  name: string;
  vendorName: string | null;
  category: SoftwareCategory;
  description: string | null;
  businessPurpose: string | null;
  website: string | null;
  ownerPersonId: string | null;
  departmentId: string | null;
  status: Exclude<SoftwareStatus, "archived">;
  notes: string | null;
}

/** Edit a software inventory record (archiving is a separate action on its page). */
export function SoftwareForm({
  workspaceId,
  values: v,
  people,
  departments,
}: {
  workspaceId: string;
  values: SoftwareFormValues;
  people: { id: string; name: string; departmentName: string | null }[];
  departments: { id: string; name: string }[];
}) {
  return (
    <ActionForm action={updateSoftwareAction} workspaceId={workspaceId} className="biz-card grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
      <input type="hidden" name="id" value={v.id} />
      <TextField label="Software name" name="name" required defaultValue={v.name} maxLength={80} />
      <TextField label="Vendor" name="vendorName" optional defaultValue={v.vendorName ?? ""} maxLength={80} />
      <SelectField label="Category" name="category" defaultValue={v.category} options={SOFTWARE_CATEGORIES.map((c) => ({ value: c, label: categoryLabels[c] }))} />
      <SelectField
        label="Status"
        name="status"
        defaultValue={v.status}
        options={(["active", "evaluating", "deprecated"] as const).map((s) => ({ value: s, label: softwareStatusLabels[s] }))}
        hint="Archive from the software's page."
      />
      <TextField label="Website" name="website" optional defaultValue={v.website ?? ""} placeholder="https://" maxLength={300} />
      <div className="hidden sm:block" />
      <SelectField
        label="Owner"
        name="ownerPersonId"
        optional
        defaultValue={v.ownerPersonId ?? ""}
        placeholder="No owner"
        options={people.map((p) => ({ value: p.id, label: p.departmentName ? `${p.name} · ${p.departmentName}` : p.name }))}
        hint="Subscriptions without their own owner use this one."
      />
      <SelectField label="Department" name="departmentId" optional defaultValue={v.departmentId ?? ""} placeholder="No department" options={departments.map((d) => ({ value: d.id, label: d.name }))} />
      <TextAreaField label="Business purpose" name="businessPurpose" optional defaultValue={v.businessPurpose ?? ""} maxLength={500} rows={2} className="sm:col-span-2" />
      <TextAreaField label="Description" name="description" optional defaultValue={v.description ?? ""} maxLength={1000} rows={2} className="sm:col-span-2" />
      <TextAreaField label="Notes" name="notes" optional defaultValue={v.notes ?? ""} maxLength={4000} className="sm:col-span-2" />
      <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4 sm:col-span-2">
        <Submit pendingLabel="Saving…">Save changes</Submit>
        <LinkButton href={`/business/software/${v.id}`} size="md">
          Cancel
        </LinkButton>
      </div>
    </ActionForm>
  );
}
