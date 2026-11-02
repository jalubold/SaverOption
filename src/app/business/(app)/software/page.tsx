import Link from "next/link";
import { LogoStack, SoftwareLogo } from "@/components/business/software-logo";
import { SummaryStrip } from "@/components/business/summary-strip";
import { FilterBar } from "@/components/business/filter-bar";
import { Card, EmptyState, FxNoteLine, InlineNote, LinkButton, Money, PageHeader, StatusPill, Tabs } from "@/components/business/ui";
import { cn } from "@/components/ui/primitives";
import { addTo, groupMonthly, isLive, type CurrencyTotals } from "@/lib/business/calc";
import { categoryLabels, SOFTWARE_CATEGORIES, SOFTWARE_STATUSES, softwareStatusLabels, type SoftwareCategory, type SoftwareStatus } from "@/lib/business/constants";
import { findPotentialDuplicates } from "@/lib/business/duplicates";
import { isUuid } from "@/lib/business/form";
import { can } from "@/lib/business/permissions";
import { requireBizContext } from "@/lib/server/business/context";
import { SUB_MONEY, workspaceDisplay } from "@/lib/server/business/display-currency";
import { getDepartments, getPeople, getSoftwareList, getSubscriptions, getVendors, type Software } from "@/lib/server/business/data";

export const metadata = { title: "Software inventory" };

type Params = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (typeof v === "string" ? v.trim() : "");
const idOrNone = (v: string) => (v === "none" ? "none" : isUuid(v) ? v.toLowerCase() : null);

function parse(sp: Params) {
  const status = one(sp.status);
  const category = one(sp.category);
  const group = one(sp.group);
  return {
    q: one(sp.q).slice(0, 100),
    category: (SOFTWARE_CATEGORIES as readonly string[]).includes(category) ? (category as SoftwareCategory) : null,
    status: (SOFTWARE_STATUSES as readonly string[]).includes(status) ? (status as SoftwareStatus) : null,
    vendor: idOrNone(one(sp.vendor)),
    department: idOrNone(one(sp.department)),
    owner: idOrNone(one(sp.owner)),
    group: group === "vendor" || group === "category" ? group : null,
    view: one(sp.view) === "grid" ? "grid" : "table",
  } as const;
}
type Filters = ReturnType<typeof parse>;

function query(f: Filters, over: Partial<Record<keyof Filters, string | null>> = {}): string {
  const p = new URLSearchParams();
  const all: Record<string, string | null> = { q: f.q || null, category: f.category, status: f.status, vendor: f.vendor, department: f.department, owner: f.owner, group: f.group, view: f.view === "grid" ? "grid" : null, ...over };
  for (const [k, v] of Object.entries(all)) if (v) p.set(k, v);
  const s = p.toString();
  return s ? `?${s}` : "";
}

export default async function SoftwareInventoryPage(props: { searchParams: Promise<Params> }) {
  const ctx = await requireBizContext("/business/software");
  const f = parse(await props.searchParams);
  const ws = ctx.workspace.id;
  const [software, billedSubs, vendors, departments, people, display] = await Promise.all([getSoftwareList(ws), getSubscriptions(ws), getVendors(ws), getDepartments(ws), getPeople(ws), workspaceDisplay(ctx)]);
  // Spend in the workspace currency (ECB rate).
  const subs = display.rows(billedSubs, SUB_MONEY);
  const pref = ctx.workspace.defaultCurrency;
  const current = subs.filter((s) => !s.archived);
  const monthly = groupMonthly(current, (s) => s.softwareId);
  const counts = new Map<string, { live: number; total: number }>();
  for (const s of current) {
    const c = counts.get(s.softwareId) ?? { live: 0, total: 0 };
    c.total++;
    if (isLive(s)) c.live++;
    counts.set(s.softwareId, c);
  }

  const q = f.q.toLowerCase();
  const rows = software.filter((s) => {
    if (f.status ? s.status !== f.status : s.status === "archived") return false;
    if (q && ![s.name, s.vendorName, s.description, s.businessPurpose].some((v) => v?.toLowerCase().includes(q))) return false;
    if (f.category && s.category !== f.category) return false;
    if (f.vendor && (f.vendor === "none" ? s.vendorId !== null : s.vendorId !== f.vendor)) return false;
    if (f.department && (f.department === "none" ? s.departmentId !== null : s.departmentId !== f.department)) return false;
    if (f.owner && (f.owner === "none" ? s.ownerPersonId !== null : s.ownerPersonId !== f.owner)) return false;
    return true;
  });

  const duplicates = findPotentialDuplicates(
    software.map((s) => ({ id: s.id, name: s.name, vendorId: s.vendorId, category: s.category, website: s.website, status: s.status })),
    (c) => categoryLabels[c as SoftwareCategory] ?? c,
  );

  const groups: { key: string; label: string; items: Software[] }[] = [];
  if (f.group) {
    const map = new Map<string, { label: string; items: Software[] }>();
    for (const s of rows) {
      const key = f.group === "vendor" ? (s.vendorId ?? "none") : s.category;
      const label = f.group === "vendor" ? (s.vendorName ?? "No vendor") : categoryLabels[s.category];
      const g = map.get(key) ?? { label, items: [] };
      g.items.push(s);
      map.set(key, g);
    }
    groups.push(...[...map.entries()].map(([key, g]) => ({ key, ...g })).sort((a, b) => a.label.localeCompare(b.label)));
  } else groups.push({ key: "all", label: "", items: rows });

  const groupTotal = (items: Software[]): CurrencyTotals => {
    const t: CurrencyTotals = {};
    for (const s of items) for (const [c, v] of Object.entries(monthly.get(s.id) ?? {})) addTo(t, c, v);
    return t;
  };
  const byId = new Map(software.map((s) => [s.id, s]));
  const logoOf = (id: string) => byId.get(id)?.logoSrc ?? null;
  const statusCount = (st: SoftwareStatus) => rows.filter((s) => s.status === st).length;
  const unpaid = rows.filter((s) => s.status !== "archived" && !(counts.get(s.id)?.live ?? 0)).length;
  // Highest monthly cost first (default currency first), then the rest by name.
  const cost = (s: Software) => monthly.get(s.id)?.[pref] ?? 0;
  const ranked = [...rows].sort((a, b) => cost(b) - cost(a) || Number(Boolean(monthly.get(b.id))) - Number(Boolean(monthly.get(a.id))) || a.name.localeCompare(b.name));
  const canAdd = can(ctx.role, "records.manage");

  return (
    <>
      <PageHeader
        title="Software inventory"
        description={
          <>
            Every tool your company uses — paid or not — with its owner, department and linked subscriptions.
            <FxNoteLine note={display.note()} dateFormat={ctx.workspace.dateFormat} className="mt-1.5" />
          </>
        }
        crumbs={[{ label: "Overview", href: "/business/dashboard" }, { label: "Software Inventory" }]}
        actions={
          canAdd ? (
            <LinkButton href="/business/software/new" variant="primary" icon="plus">
              Add software
            </LinkButton>
          ) : undefined
        }
      />

      {software.length === 0 ? (
        <Card>
          <EmptyState
            icon="box"
            title="Your inventory is empty"
            action={
              canAdd ? (
                <LinkButton href="/business/software/new" variant="primary" size="md" icon="plus">
                  Add software
                </LinkButton>
              ) : undefined
            }
          >
            Add the tools your teams use. A record can exist without a paid subscription — for free tools or ones you&apos;re evaluating.
          </EmptyState>
        </Card>
      ) : (
        <>
          {duplicates.length > 0 && (
            <div className="mb-4">
              <InlineNote tone="warn" title={`Potential duplicates — review (${duplicates.length})`}>
                <p>These records look alike by the rules below. They need a human review: they may be separate tools on purpose.</p>
                <ul className="mt-2 space-y-1">
                  {duplicates.slice(0, 6).map((p) => (
                    <li key={`${p.a.id}-${p.b.id}`} className="flex items-start gap-2.5">
                      <span className="mt-px inline-flex shrink-0 items-center" aria-hidden="true">
                        <SoftwareLogo name={p.a.name} src={logoOf(p.a.id)} size={22} />
                        <span className="-ml-1 rounded-[7px] ring-2 ring-warn-soft">
                          <SoftwareLogo name={p.b.name} src={logoOf(p.b.id)} size={22} />
                        </span>
                      </span>
                      <span className="min-w-0">
                        <Link href={`/business/software/${p.a.id}`} className="font-medium text-fg underline underline-offset-2">
                          {p.a.name}
                        </Link>{" "}
                        and{" "}
                        <Link href={`/business/software/${p.b.id}`} className="font-medium text-fg underline underline-offset-2">
                          {p.b.name}
                        </Link>
                        <span className="text-faint"> — {p.reasons.join("; ")}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                {duplicates.length > 6 && <p className="mt-1 text-faint">+ {duplicates.length - 6} more pairs.</p>}
              </InlineNote>
            </div>
          )}

          <Tabs
            items={[
              { label: "Table", href: `/business/software${query(f, { view: null })}`, active: f.view === "table" },
              { label: "Grid", href: `/business/software${query(f, { view: "grid" })}`, active: f.view === "grid" },
            ]}
          />

          <FilterBar
            action="/business/software"
            label="Filter software"
            keep={{ view: f.view === "grid" ? "grid" : null }}
            search={{ value: f.q, placeholder: "Search name, vendor or purpose" }}
            inline={[{ name: "group", label: "Group", value: f.group, allLabel: "None", options: [{ value: "vendor", label: "Vendor" }, { value: "category", label: "Category" }] }]}
            more={[
              { name: "status", label: "Status", value: f.status, allLabel: "Current (not archived)", options: SOFTWARE_STATUSES.map((s) => ({ value: s, label: softwareStatusLabels[s] })) },
              { name: "category", label: "Category", value: f.category, allLabel: "All categories", options: SOFTWARE_CATEGORIES.map((c) => ({ value: c, label: categoryLabels[c] })) },
              { name: "vendor", label: "Vendor", value: f.vendor, allLabel: "All vendors", options: [...vendors.map((v) => ({ value: v.id, label: v.name })), { value: "none", label: "No vendor" }] },
              { name: "department", label: "Department", value: f.department, allLabel: "All departments", options: [...departments.map((d) => ({ value: d.id, label: d.archivedAt ? `${d.name} (archived)` : d.name })), { value: "none", label: "No department" }] },
              { name: "owner", label: "Owner", value: f.owner, allLabel: "Anyone", options: [...people.map((p) => ({ value: p.id, label: p.name })), { value: "none", label: "No owner" }] },
            ]}
          />

          {rows.length > 0 && (
            <SummaryStrip
              label="Summary of this view"
              figure={
                f.status === "archived"
                  ? undefined
                  : {
                      label: "Monthly equivalent",
                      value: (
                        <span className="inline-flex items-baseline gap-1">
                          <Money totals={groupTotal(rows)} preferred={pref} />
                          <span className="text-[13px] font-normal text-faint">/mo</span>
                        </span>
                      ),
                      sub: "Active plans with a price",
                    }
              }
              counts={
                f.status === "archived"
                  ? [{ value: rows.length, label: "archived" }]
                  : [
                      { value: statusCount("active"), label: "active" },
                      { value: statusCount("evaluating"), label: "evaluating", hideZero: true },
                      { value: statusCount("deprecated"), label: "deprecated", tone: "warn", hideZero: true },
                      { value: unpaid, label: "with no live plan", hideZero: true },
                    ]
              }
              aside={<LogoStack items={ranked.map((s) => ({ name: s.name, src: s.logoSrc }))} max={7} size={28} />}
            />
          )}

          {rows.length === 0 ? (
            <Card>
              <EmptyState icon="search" title="No software matches">
                Try removing a filter{f.status ? "" : ", or check the archived status"}.
              </EmptyState>
            </Card>
          ) : (
            <div className="space-y-5">
              {groups.map((g) => (
                <section key={g.key} aria-label={g.label || "Software"}>
                  {g.label && (
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <LogoStack items={g.items.map((s) => ({ name: s.name, src: s.logoSrc }))} max={4} size={22} />
                        <h2 className="truncate text-[14.5px] font-semibold">
                          {g.label} <span className="font-normal text-faint">· {g.items.length}</span>
                        </h2>
                      </div>
                      <Money totals={groupTotal(g.items)} preferred={pref} className="text-[13px] text-muted" empty="" />
                    </div>
                  )}
                  {f.view === "grid" ? (
                    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {g.items.map((s) => {
                        const c = counts.get(s.id) ?? { live: 0, total: 0 };
                        return (
                          <li key={s.id}>
                            <Link href={`/business/software/${s.id}`} className="biz-card group flex h-full flex-col px-4 py-4 transition-[border-color,box-shadow] hover:border-line-strong hover:shadow-md">
                              <span className="flex items-start gap-3">
                                <SoftwareLogo name={s.name} src={s.logoSrc} size={40} className="transition-transform group-hover:scale-105" />
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-[14.5px] font-semibold text-fg">{s.name}</span>
                                  <span className="block truncate text-[12.5px] text-faint">{[s.vendorName, categoryLabels[s.category]].filter(Boolean).join(" · ")}</span>
                                </span>
                                <StatusPill status={s.status} label={softwareStatusLabels[s.status]} />
                              </span>
                              {s.businessPurpose && <span className="mt-3 line-clamp-2 text-[12.5px] text-muted">{s.businessPurpose}</span>}
                              <span aria-hidden="true" className="min-h-3 flex-1" />
                              <span className="flex items-end justify-between gap-2 border-t border-line pt-3 text-[12.5px]">
                                <span className="min-w-0 text-faint">
                                  {c.total ? `${c.live} live of ${c.total} subscription${c.total === 1 ? "" : "s"}` : "No subscription"}
                                  {s.ownerName && <span className="block truncate">Owner: {s.ownerName}</span>}
                                </span>
                                <span className="shrink-0 text-right">
                                  <Money totals={monthly.get(s.id) ?? {}} preferred={pref} className="text-[14px] font-semibold text-heading" />
                                  {monthly.get(s.id) && <span className="block text-[11px] text-faint">a month</span>}
                                </span>
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <Card bodyClassName="px-0 py-0">
                      <div className="overflow-x-auto max-sm:-mx-4 max-sm:-my-4">
                        <table className="biz-table stack">
                          <thead>
                            <tr>
                              <th>Software</th>
                              <th>Vendor</th>
                              <th>Category</th>
                              <th>Status</th>
                              <th>Owner</th>
                              <th>Department</th>
                              <th className="num">Subscriptions</th>
                              <th className="num">Monthly equiv.</th>
                            </tr>
                          </thead>
                          <tbody>
                            {g.items.map((s) => {
                              const c = counts.get(s.id) ?? { live: 0, total: 0 };
                              return (
                                <tr key={s.id}>
                                  <td className="stack-full sm:min-w-48">
                                    <span className="flex items-center gap-2.5">
                                      <SoftwareLogo name={s.name} src={s.logoSrc} size={30} />
                                      <span className="min-w-0">
                                        <Link href={`/business/software/${s.id}`} className="font-medium text-fg hover:underline underline-offset-2">
                                          {s.name}
                                        </Link>
                                        {s.businessPurpose && <span className="block max-w-xs truncate text-[12px] text-faint">{s.businessPurpose}</span>}
                                      </span>
                                    </span>
                                  </td>
                                  <td className="stack-hide whitespace-nowrap">{s.vendorName ?? <span className="text-faint">—</span>}</td>
                                  <td className="stack-hide whitespace-nowrap">{categoryLabels[s.category]}</td>
                                  <td className="max-sm:pl-10">
                                    <StatusPill status={s.status} label={softwareStatusLabels[s.status]} />
                                  </td>
                                  <td className="stack-hide whitespace-nowrap">{s.ownerName ?? <span className="text-faint">—</span>}</td>
                                  <td className="stack-hide whitespace-nowrap">{s.departmentName ?? <span className="text-faint">—</span>}</td>
                                  <td className={cn("num stack-hide", c.total === 0 && "text-faint")}>{c.total ? `${c.live} / ${c.total}` : "None"}</td>
                                  <td className="num stack-end max-sm:font-semibold">
                                    <Money totals={monthly.get(s.id) ?? {}} preferred={pref} />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  )}
                </section>
              ))}
            </div>
          )}
          <p className="mt-3 text-[12px] text-faint">Subscriptions column: live (active or trial) / all non-archived. Monthly equivalent counts active subscriptions with a price.</p>
        </>
      )}
    </>
  );
}
