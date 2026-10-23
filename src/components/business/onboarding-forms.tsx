"use client";

import { useEffect, useState } from "react";
import { createWorkspaceAction } from "@/app/business/actions/workspace";
import { COMMON_CURRENCIES, COMPANY_SIZES } from "@/lib/business/constants";
import { ActionForm, SelectField, Submit, TextField } from "@/components/business/forms";

/** Onboarding: create the company workspace and its basic details. */
export function CreateWorkspaceForm() {
  const [timeZone, setTimeZone] = useState("UTC");
  const [currency, setCurrency] = useState("USD");
  useEffect(() => {
    // Sensible defaults from the browser; both can be changed before saving.
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only defaults, applied after hydration
      setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
      const region = new Intl.Locale(navigator.language).maximize().region;
      const byRegion: Record<string, string> = { GB: "GBP", ID: "IDR", IN: "INR", JP: "JPY", CA: "CAD", AU: "AUD", SG: "SGD", CH: "CHF", SE: "SEK", NZ: "NZD", BR: "BRL", MX: "MXN", ZA: "ZAR", AE: "AED" };
      const eur = ["DE", "FR", "ES", "IT", "NL", "BE", "AT", "IE", "PT", "FI", "GR", "LU", "SK", "SI", "EE", "LV", "LT", "MT", "CY", "HR"];
      if (region) setCurrency(byRegion[region] ?? (eur.includes(region) ? "EUR" : "USD"));
    } catch {}
  }, []);
  const zones = (() => {
    try {
      return Intl.supportedValuesOf("timeZone");
    } catch {
      return ["UTC"];
    }
  })();
  return (
    // The workspace id isn't known yet; the server action checks the session instead.
    <ActionForm action={createWorkspaceAction} workspaceId="" className="grid gap-4 sm:grid-cols-2">
      <TextField label="Company name" name="name" required maxLength={80} placeholder="e.g. Acme Inc." className="sm:col-span-2" autoFocus />
      <TextField label="Industry" name="industry" optional maxLength={80} placeholder="e.g. Software, Agency, Retail" />
      <SelectField label="Company size" name="companySize" optional placeholder="Choose…" options={COMPANY_SIZES.map((s) => ({ value: s, label: `${s} people` }))} />
      <TextField label="Website" name="website" optional placeholder="acme.com" maxLength={300} />
      <SelectField label="Default currency" name="defaultCurrency" value={currency} onChange={(e) => setCurrency(e.target.value)} options={[...new Set([currency, ...COMMON_CURRENCIES])].map((c) => ({ value: c, label: c }))} hint="Used for new subscriptions. Each subscription keeps its own currency." />
      <SelectField label="Time zone" name="timeZone" value={timeZone} onChange={(e) => setTimeZone(e.target.value)} options={[...new Set([timeZone, ...zones])].map((z) => ({ value: z, label: z.replace(/_/g, " ") }))} className="sm:col-span-2" hint="Renewal reminders and “today” follow this time zone." />
      <div className="sm:col-span-2">
        <Submit pendingLabel="Creating workspace…" size="lg">
          Create workspace
        </Submit>
      </div>
    </ActionForm>
  );
}
