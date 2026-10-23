import Link from "next/link";
import { notFound } from "next/navigation";
import { AssignSeatsForm, ReassignSeatForm, ReleaseSeatButton } from "@/components/business/record-forms";
import { Card, EmptyState, InlineNote, Kpi, LinkButton, Meter, PageHeader, Pill, StatusPill, TableWrap } from "@/components/business/ui";
import { formatIsoDate, formatMoney, isLive, percent, seatSummary } from "@/lib/business/calc";
import { subscriptionStatusLabels } from "@/lib/business/constants";
import { isUuid } from "@/lib/business/form";
import { canEditRecord } from "@/lib/business/permissions";
import { requireBizContext } from "@/lib/server/business/context";
import { getPeople, getSeatAssignments, getSubscription } from "@/lib/server/business/data";

export const metadata = { title: "Seat allocation" };

const day = (d: Date) => d.toISOString().slice(0, 10);

export default async function SeatAllocationPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const ctx = await requireBizContext(`/business/licenses/${id}`);
  if (!isUuid(id)) notFound();
  const sub = await getSubscription(ctx, id.toLowerCase());
  if (!sub) notFound();
  const ws = ctx.workspace.id;
  const [assignments, people] = await Promise.all([getSeatAssignments(ws), getPeople(ws)]);
  const fmt = ctx.workspace.dateFormat;
  const mine = assignments.filter((a) => a.subscriptionId === sub.id);
  const active = mine.filter((a) => !a.releasedAt);
  const released = mine.filter((a) => a.releasedAt).sort((a, b) => b.releasedAt!.getTime() - a.releasedAt!.getTime());
  const seats = seatSummary(sub);
  const editable = !sub.archived && canEditRecord(ctx.role, { ownerPersonId: sub.ownerPersonId }, ctx.personId);
  const holders = new Set(active.map((a) => a.personId));
  const available = people.filter((p) => p.status === "active" && !holders.has(p.id)).map((p) => ({ id: p.id, name: p.name, departmentName: p.departmentName }));
  const title = `${sub.softwareName}${sub.planName ? ` · ${sub.planName}` : ""}`;

  return (
    <>
      <PageHeader
        title={`${sub.softwareName} seats`}
        crumbs={[{ label: "Licenses & Seats", href: "/business/licenses" }, { label: title }]}
        description={
          <>
            <StatusPill status={sub.status} label={subscriptionStatusLabels[sub.status]} />
            {sub.archived && <Pill className="ml-1.5">Archived</Pill>}
            <span className="ml-2">{sub.ownerName ? `Owned by ${sub.ownerName}` : "No owner"}{sub.departmentName ? ` · ${sub.departmentName}` : ""}</span>
          </>
        }
        actions={
          <>
            <LinkButton href={`/business/subscriptions/${sub.id}`} icon="layers">
              Subscription
            </LinkButton>
            {editable && (
              <LinkButton href={`/business/subscriptions/${sub.id}/edit`} icon="pen">
                Edit seats or price
              </LinkButton>
            )}
          </>
        }
      />

      {sub.archived && (
        <div className="mb-5">
          <InlineNote tone="warn" title="This subscription is archived">
            Its seat assignments were released when it was archived. Restore the subscription to manage seats again.
          </InlineNote>
        </div>
      )}
      {!sub.archived && !isLive(sub) && (
        <div className="mb-5">
          <InlineNote title={`This subscription is ${subscriptionStatusLabels[sub.status].toLowerCase()}`}>It isn&apos;t counted in license totals while it isn&apos;t active or in trial.</InlineNote>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <Kpi label="Purchased seats" icon="key" value={seats.purchased ?? "—"} sub={seats.purchased === null ? "Not recorded" : undefined} />
        <Kpi
          label="Seats in use"
          icon="users"
          value={seats.assigned}
          sub={seats.assignedSource === "reported" ? `Reported count (${seats.named} named)` : seats.assignedSource === "named" ? "Named assignments" : "None recorded"}
        />
        <Kpi label="Available" icon="box" value={seats.available ?? "—"} sub={seats.overAssigned ? "More named seats than purchased" : undefined} />
        <Kpi label="Utilization" icon="chart" value={percent(seats.utilization)} sub={seats.purchased === 0 ? "No seats purchased" : undefined} />
        <Kpi
          label="Unused seat cost"
          icon="coins"
          value={seats.unusedMonthly !== null ? `${formatMoney(Math.round(seats.unusedMonthly), sub.currency)}` : "—"}
          sub={seats.costPerSeatMonthly !== null ? `${formatMoney(Math.round(seats.costPerSeatMonthly), sub.currency)} per seat /mo` : sub.pricingModel === "flat" ? "Flat price: no per-seat cost" : "Needs a price and seats"}
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Card title="Assigned seats" description={`${active.length} named assignment${active.length === 1 ? "" : "s"}`} className="xl:col-span-2">
          {active.length === 0 ? (
            <EmptyState icon="users" title="No seats assigned by name">
              {sub.reportedAssignedSeats !== null
                ? `${sub.reportedAssignedSeats} seats are reported in use. Assign seats to people to see who has them.`
                : "Assign seats to people in your team directory to track who uses this tool."}
            </EmptyState>
          ) : (
            <TableWrap>
              <table className="biz-table">
                <thead>
                  <tr>
                    <th>Person</th>
                    <th>Department</th>
                    <th>Assigned</th>
                    <th>Note</th>
                    {editable && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {active.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <span className="font-medium">{a.personName}</span>
                        {a.personEmail && <span className="block text-[12px] text-faint">{a.personEmail}</span>}
                      </td>
                      <td>{a.departmentName ?? <span className="text-faint">—</span>}</td>
                      <td className="whitespace-nowrap">{formatIsoDate(day(a.assignedAt), fmt)}</td>
                      <td className="max-w-48 text-[12.5px] text-muted">{a.note ?? "—"}</td>
                      {editable && (
                        <td>
                          <div className="flex flex-wrap items-end gap-2">
                            <ReassignSeatForm workspaceId={ws} assignmentId={a.id} people={available} />
                            <ReleaseSeatButton workspaceId={ws} assignmentId={a.id} personName={a.personName} />
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          )}
          {seats.purchased !== null && seats.purchased > 0 && (
            <div className="mt-4">
              <Meter value={seats.utilization} label="Utilization" />
            </div>
          )}
        </Card>

        <div className="space-y-5">
          {editable ? (
            <Card title="Assign seats">
              {seats.purchased !== null && seats.available === 0 ? (
                <p className="text-[13.5px] text-muted">
                  All {seats.purchased} purchased seats are in use. Release a seat, or{" "}
                  <Link href={`/business/subscriptions/${sub.id}/edit`} className="text-accent-ink underline underline-offset-2">
                    increase purchased seats
                  </Link>
                  .
                </p>
              ) : (
                <AssignSeatsForm workspaceId={ws} subscriptionId={sub.id} people={available} free={seats.purchased === null ? null : Math.max(0, seats.purchased - seats.named)} />
              )}
            </Card>
          ) : (
            !sub.archived && (
              <InlineNote title="View only">Your role can only manage seats on software you own. Ask an owner, admin or finance member to change seats here.</InlineNote>
            )
          )}
          <InlineNote title="Actual usage">
            Seats here are assignments, not activity. Verified active usage isn&apos;t available — no usage integration is connected.
          </InlineNote>
        </div>
      </div>

      <Card title="Assignment history" description="Seats released from people, newest first." className="mt-5">
        {released.length === 0 ? (
          <p className="text-[13.5px] text-muted">No seats have been released yet.</p>
        ) : (
          <TableWrap>
            <table className="biz-table">
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Assigned</th>
                  <th>Released</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {released.slice(0, 100).map((a) => (
                  <tr key={a.id}>
                    <td>{a.personName}</td>
                    <td className="whitespace-nowrap">{formatIsoDate(day(a.assignedAt), fmt)}</td>
                    <td className="whitespace-nowrap">{formatIsoDate(day(a.releasedAt!), fmt)}</td>
                    <td className="text-[12.5px] text-muted">{a.note ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        )}
      </Card>
    </>
  );
}
