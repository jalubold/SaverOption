import { PreferencesForm } from "@/components/business/settings-forms";
import { Card, DefinitionList, PageHeader } from "@/components/business/ui";
import { formatIsoDate, MONTH_NAMES } from "@/lib/business/calc";
import { can } from "@/lib/business/permissions";
import { requireBizContext } from "@/lib/server/business/context";

export const metadata = { title: "Preferences" };

function timeZones(current: string): string[] {
  let all: string[] = [];
  try {
    all = Intl.supportedValuesOf("timeZone");
  } catch {
    all = [];
  }
  return [...new Set([current, "UTC", ...all])];
}

export default async function PreferencesPage() {
  const ctx = await requireBizContext("/business/settings/preferences");
  const ws = ctx.workspace;
  const editable = can(ctx.role, "workspace.manage");
  return (
    <>
      <PageHeader
        title="Preferences"
        description="Defaults used across the workspace: new subscriptions, dates, reminders and reporting periods."
        crumbs={[{ label: "Settings", href: "/business/settings" }, { label: "Preferences" }]}
      />
      <Card className="max-w-3xl">
        {editable ? (
          <PreferencesForm
            workspaceId={ws.id}
            values={{ defaultCurrency: ws.defaultCurrency, timeZone: ws.timeZone, fiscalYearStart: ws.fiscalYearStart, dateFormat: ws.dateFormat }}
            zones={timeZones(ws.timeZone)}
            today={ctx.today}
          />
        ) : (
          <>
            <p className="mb-4 text-[13px] text-faint">Only owners and admins can change workspace preferences.</p>
            <DefinitionList
              items={[
                { label: "Default currency", value: ws.defaultCurrency },
                { label: "Time zone", value: ws.timeZone.replace(/_/g, " ") },
                { label: "Fiscal year starts in", value: MONTH_NAMES[ws.fiscalYearStart - 1] },
                { label: "Date format", value: formatIsoDate(ctx.today, ws.dateFormat) },
              ]}
            />
          </>
        )}
      </Card>
    </>
  );
}
