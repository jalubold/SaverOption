import Link from "next/link";
import { ArchiveDepartmentButton, AssignMembersForm, CreateDepartmentForm, RenameDepartmentForm } from "@/components/business/department-forms";
import { Card, EmptyState, Money, PageHeader, Pill, TableWrap } from "@/components/business/ui";
import { can } from "@/lib/business/permissions";
import { groupsFrom } from "@/lib/server/business/analytics";
import { requireBizContext } from "@/lib/server/business/context";
import { getDepartments, getPeople, getSoftwareList, getSubscriptions } from "@/lib/server/business/data";

export const metadata = { title: "Departments" };

const NONE = "__none__";

export default async function DepartmentsPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const q = await props.searchParams;
  const ctx = await requireBizContext("/business/settings/departments");
  const ws = ctx.workspace.id;
  const [departments, people, software, subscriptions] = await Promise.all([getDepartments(ws), getPeople(ws), getSoftwareList(ws), getSubscriptions(ws)]);
  const manage = can(ctx.role, "directory.manage");
  const subs = subscriptions.filter((s) => !s.archived);
  const spend = new Map(groupsFrom(subs, (s) => s.departmentId ?? NONE, (k) => k).map((g) => [g.key, g.totals]));
  const count = <T,>(list: T[], key: (x: T) => string | null) => {
    const m = new Map<string, number>();
    for (const x of list) {
      const k = key(x) ?? NONE;
      m.set(k, (m.get(k) ?? 0) + 1);
    }
    return m;
  };
  const peopleBy = count(people, (p) => p.departmentId);
  const softwareBy = count(software.filter((s) => s.status !== "archived"), (s) => s.departmentId);
  const subsBy = count(subs, (s) => s.departmentId);
  const active = departments.filter((d) => !d.archivedAt);
  const archived = departments.filter((d) => d.archivedAt);
  const managing = typeof q.manage === "string" && manage ? departments.find((d) => d.id === q.manage) : undefined;
  const pref = ctx.workspace.defaultCurrency;

  const rows = (list: typeof departments, isArchived: boolean) => (
    <TableWrap>
      <table className="biz-table">
        <thead>
          <tr>
            <th>Department</th>
            <th className="num">People</th>
            <th className="num">Software</th>
            <th className="num">Subscriptions</th>
            <th className="num">Monthly spend</th>
            <th className="num">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {list.map((d) => (
            <tr key={d.id}>
              <td>
                <span className="font-medium">{d.name}</span>
                {isArchived && <Pill tone="outline" className="ml-1.5">Archived</Pill>}
                <span className="mt-0.5 flex gap-3 text-[12px]">
                  <Link href={`/business/subscriptions?department=${d.id}`} className="text-accent-ink hover:underline">
                    Subscriptions
                  </Link>
                  <Link href={`/business/reports?department=${d.id}`} className="text-accent-ink hover:underline">
                    Report
                  </Link>
                </span>
              </td>
              <td className="num">{peopleBy.get(d.id) ?? 0}</td>
              <td className="num">{softwareBy.get(d.id) ?? 0}</td>
              <td className="num">{subsBy.get(d.id) ?? 0}</td>
              <td className="num">
                <Money totals={spend.get(d.id) ?? {}} preferred={pref} className="items-end" />
              </td>
              <td className="num whitespace-nowrap">
                {manage && (
                  <span className="inline-flex items-center gap-2">
                    {!isArchived && (
                      <Link href={`/business/settings/departments?manage=${d.id}#manage`} className="text-[13px] text-accent-ink hover:underline">
                        Manage
                      </Link>
                    )}
                    <ArchiveDepartmentButton workspaceId={ws} id={d.id} name={d.name} archived={isArchived} />
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  );

  return (
    <>
      <PageHeader
        title="Departments"
        description="Group people, software and spending by team. A subscription uses its own department, or else its software's."
        crumbs={[{ label: "Settings", href: "/business/settings" }, { label: "Departments" }]}
      />

      {manage && (
        <Card className="mb-5">
          <CreateDepartmentForm workspaceId={ws} />
        </Card>
      )}

      <Card title="Active departments" description={`Monthly spend is the monthly equivalent of active subscriptions, per currency.`}>
        {active.length === 0 ? (
          <EmptyState icon="building" title="No departments yet">
            {manage ? "Create departments to see spending by team and to assign people and software." : "An owner or admin can create departments."}
          </EmptyState>
        ) : (
          rows(active, false)
        )}
        {(subsBy.get(NONE) ?? 0) > 0 && (
          <p className="mt-3 text-[12.5px] text-faint">
            {subsBy.get(NONE)} subscription{subsBy.get(NONE) === 1 ? " has" : "s have"} no department (
            <Money totals={spend.get(NONE) ?? {}} preferred={pref} className="!inline-flex" /> a month).{" "}
            <Link href="/business/subscriptions?department=none" className="text-accent-ink hover:underline">
              Assign them
            </Link>
          </p>
        )}
      </Card>

      {managing && (
        <Card id="manage" title={`Manage ${managing.name}`} className="mt-5" action={<Link href="/business/settings/departments" className="text-[13px] text-muted hover:text-fg">Close</Link>}>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="mb-2 text-[13.5px] font-semibold">Rename</h3>
              <RenameDepartmentForm workspaceId={ws} id={managing.id} name={managing.name} />
            </div>
            <div>
              <h3 className="mb-2 text-[13.5px] font-semibold">Add people to {managing.name}</h3>
              <AssignMembersForm
                workspaceId={ws}
                departmentId={managing.id}
                people={people.filter((p) => p.status === "active" && p.departmentId !== managing.id).map((p) => ({ id: p.id, name: p.name, departmentName: p.departmentName }))}
                submitLabel={`Move to ${managing.name}`}
              />
            </div>
            <div className="lg:col-span-2">
              <h3 className="mb-2 text-[13.5px] font-semibold">People in {managing.name}</h3>
              <AssignMembersForm
                workspaceId={ws}
                departmentId=""
                people={people.filter((p) => p.departmentId === managing.id).map((p) => ({ id: p.id, name: p.name, departmentName: p.departmentName }))}
                submitLabel="Remove from department"
              />
            </div>
          </div>
        </Card>
      )}

      {archived.length > 0 && (
        <Card title="Archived departments" className="mt-5">
          {rows(archived, true)}
        </Card>
      )}
    </>
  );
}
