"use client";

import { useState } from "react";
import { deleteWorkspaceAction, resetDemoAction, updateCompanyAction, updateNotificationsAction, updatePreferencesAction } from "@/app/business/actions/workspace";
import { formatIsoDate, MONTH_NAMES } from "@/lib/business/calc";
import { COMMON_CURRENCIES, COMPANY_SIZES, DATE_FORMATS } from "@/lib/business/constants";
import { ActionForm, CheckboxField, ConfirmSubmit, SelectField, Submit, TextField, useBizForm } from "@/components/business/forms";

export interface CompanyValues {
  name: string;
  industry: string | null;
  companySize: string | null;
  website: string | null;
  logoUrl: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
}

export function CompanyForm({ workspaceId, values }: { workspaceId: string; values: CompanyValues }) {
  const [logo, setLogo] = useState(values.logoUrl ?? "");
  const showLogo = /^https:\/\/[^\s]+\.[^\s]+/.test(logo);
  return (
    <ActionForm action={updateCompanyAction} workspaceId={workspaceId} className="grid gap-4 sm:grid-cols-2">
      <TextField label="Company name" name="name" required minLength={2} maxLength={80} defaultValue={values.name} className="sm:col-span-2" />
      <div className="sm:col-span-2">
        <TextField
          label="Logo URL"
          name="logoUrl"
          optional
          maxLength={300}
          placeholder="https://…/logo.png"
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
          hint="An https:// link to an image. It's shown in this workspace only."
        />
        {showLogo && (
          <div className="mt-2 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- user-supplied logo URL, previewed as-is */}
            <img src={logo} alt="Logo preview" referrerPolicy="no-referrer" className="size-12 rounded-lg border border-line object-contain" />
            <span className="text-[12px] text-faint">Preview</span>
          </div>
        )}
      </div>
      <TextField label="Industry" name="industry" optional maxLength={80} defaultValue={values.industry ?? ""} />
      <SelectField label="Company size" name="companySize" optional placeholder="Not set" defaultValue={values.companySize ?? ""} options={COMPANY_SIZES.map((s) => ({ value: s, label: `${s} people` }))} />
      <TextField label="Website" name="website" optional maxLength={300} defaultValue={values.website ?? ""} placeholder="company.com" className="sm:col-span-2" />
      <TextField label="Contact name" name="contactName" optional maxLength={120} defaultValue={values.contactName ?? ""} />
      <TextField label="Contact email" name="contactEmail" type="email" optional maxLength={254} defaultValue={values.contactEmail ?? ""} />
      <TextField label="Contact phone" name="contactPhone" optional maxLength={40} defaultValue={values.contactPhone ?? ""} />
      <div className="sm:col-span-2">
        <Submit pendingLabel="Saving…">Save company details</Submit>
      </div>
    </ActionForm>
  );
}

export function PreferencesForm({
  workspaceId,
  values,
  zones,
  today,
}: {
  workspaceId: string;
  values: { defaultCurrency: string; timeZone: string; fiscalYearStart: number; dateFormat: string };
  zones: string[];
  today: string;
}) {
  return (
    <ActionForm action={updatePreferencesAction} workspaceId={workspaceId} className="grid gap-4 sm:grid-cols-2">
      <SelectField
        label="Default currency"
        name="defaultCurrency"
        defaultValue={values.defaultCurrency}
        options={[...new Set([values.defaultCurrency, ...COMMON_CURRENCIES])].map((c) => ({ value: c, label: c }))}
        hint="Pre-selected for new subscriptions. Headline totals are shown in it, converting other currencies at the ECB's daily reference rate."
      />
      <SelectField label="Time zone" name="timeZone" defaultValue={values.timeZone} options={zones.map((z) => ({ value: z, label: z.replace(/_/g, " ") }))} hint="Decides what “today” is for renewals and reminders." />
      <SelectField
        label="Fiscal year starts in"
        name="fiscalYearStart"
        defaultValue={String(values.fiscalYearStart)}
        options={MONTH_NAMES.map((m, i) => ({ value: String(i + 1), label: m }))}
        hint="Used for the “This fiscal year” range in reports."
      />
      <SelectField label="Date format" name="dateFormat" defaultValue={values.dateFormat} options={DATE_FORMATS.map((f) => ({ value: f, label: `${formatIsoDate(today, f)}  (${f})` }))} />
      <div className="sm:col-span-2">
        <Submit pendingLabel="Saving…">Save preferences</Submit>
      </div>
    </ActionForm>
  );
}

const PRESETS = [30, 14, 7];

/** Reminder windows: presets plus custom days, combined into the reminderDays field the server parses. */
export function NotificationsForm({ workspaceId, reminderDays, notifyInApp }: { workspaceId: string; reminderDays: number[]; notifyInApp: boolean }) {
  const [presets, setPresets] = useState(PRESETS.filter((d) => reminderDays.includes(d)));
  const [custom, setCustom] = useState(reminderDays.filter((d) => !PRESETS.includes(d)).join(", "));
  const combined = [...presets, ...custom.split(/[\s,]+/).filter(Boolean)].join(", ");
  return (
    <ActionForm action={updateNotificationsAction} workspaceId={workspaceId} className="space-y-4">
      <input type="hidden" name="reminderDays" value={combined} />
      <fieldset>
        <legend className="text-[13px] font-medium">Remind before each renewal</legend>
        <div className="mt-2 flex flex-wrap gap-4">
          {PRESETS.map((d) => (
            <label key={d} className="flex items-center gap-2 text-[13.5px]">
              <input
                type="checkbox"
                checked={presets.includes(d)}
                onChange={(e) => setPresets((p) => (e.target.checked ? [...p, d] : p.filter((x) => x !== d)))}
                className="size-4 accent-[var(--accent)]"
              />
              {d} days before
            </label>
          ))}
        </div>
      </fieldset>
      <CustomDaysField value={custom} onChange={setCustom} />
      <CheckboxField label="In-app notifications" name="notifyInApp" defaultChecked={notifyInApp} hint="Reminders appear under the bell for every member of this workspace." />
      <CheckboxField label="Email reminders" name="_notifyEmail" disabled hint="Not available: no email provider is configured, so nothing is emailed." />
      <p className="text-[12.5px] text-faint">{combined ? `Reminders: ${combined} days before renewal.` : "No reminder windows selected — renewal reminders are off."}</p>
      <Submit pendingLabel="Saving…">Save notification settings</Submit>
    </ActionForm>
  );
}

function CustomDaysField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  // Server errors for reminderDays are shown here, next to the field people type in.
  const error = useBizForm().state.fieldErrors?.reminderDays;
  return (
    <div>
      <TextField label="Custom days" name="_customDays" optional value={value} onChange={(e) => onChange(e.target.value)} placeholder="e.g. 60, 3" hint="Comma-separated, 1–365 days. Up to 6 windows in total." />
      {error && <p className="mt-1 text-[12px] text-danger">{error}</p>}
    </div>
  );
}

export function ResetDemoForm({ workspaceId }: { workspaceId: string }) {
  return (
    <ActionForm action={resetDemoAction} workspaceId={workspaceId}>
      <ConfirmSubmit
        title="Reset the demo workspace?"
        body="Everything you changed in the demo is replaced with the original fictional Northwind Studio sample data. Your real workspaces aren't touched."
        confirmLabel="Reset demo"
      >
        Reset demo data
      </ConfirmSubmit>
    </ActionForm>
  );
}

export function DeleteWorkspaceForm({ workspaceId, name }: { workspaceId: string; name: string }) {
  const [typed, setTyped] = useState("");
  return (
    <ActionForm action={deleteWorkspaceAction} workspaceId={workspaceId} className="space-y-3">
      <TextField label={`Type “${name}” to confirm`} name="confirmName" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" />
      <Submit variant="secondary" size="sm" pendingLabel="Deleting…" className={typed.trim() === name ? "!border-danger !text-danger" : undefined}>
        Delete workspace permanently
      </Submit>
    </ActionForm>
  );
}
