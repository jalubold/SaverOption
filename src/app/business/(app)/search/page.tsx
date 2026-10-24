import Link from "next/link";
import type { ReactNode } from "react";
import { SoftwareLogo } from "@/components/business/software-logo";
import { Card, EmptyState, PageHeader, Pill, StatusPill } from "@/components/business/ui";
import { Icon, type IconProps } from "@/components/ui/icon";
import { formatMoney, intervalLabel } from "@/lib/business/calc";
import { categoryLabels, softwareStatusLabels, subscriptionStatusLabels } from "@/lib/business/constants";
import { requireBizContext } from "@/lib/server/business/context";
import { getDepartments, getPeople, getSoftwareList, getSubscriptions, getVendors } from "@/lib/server/business/data";
import { logoFor } from "@/lib/server/business/logos";

export const metadata = { title: "Search" };

const LIMIT = 25;

export default async function SearchPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await props.searchParams;
  const ctx = await requireBizContext("/business/search");
  const raw = typeof params.q === "string" ? params.q.replace(/\s+/g, " ").trim().slice(0, 80) : "";
  const term = raw.toLowerCase();
  const ready = term.length >= 2;

  const header = (
    <PageHeader
      title="Search"
      crumbs={[{ label: "Overview", href: "/business/dashboard" }, { label: "Search" }]}
      description="Software, subscriptions, vendors, people and departments in this workspace."
    />
  );
  const form = (
    <form method="get" action="/business/search" role="search" className="mb-5 flex max-w-xl gap-2">
      <label htmlFor="search-page-q" className="sr-only">
        Search
      </label>
      <input
        id="search-page-q"
        name="q"
        type="search"
        defaultValue={raw}
        maxLength={80}
        placeholder="Name, vendor, plan, email…"
        className="h-10 min-w-0 flex-1 rounded-[10px] border border-line-strong bg-surface px-3 text-[14px] outline-none focus:border-accent focus:ring-4 focus:ring-accent/20"
      />
      <button type="submit" className="btn btn-primary h-10 rounded-[10px] px-4 text-sm">
        Search
      </button>
    </form>
  );

  if (!ready) {
    return (
      <>
        {header}
        {form}
        <Card>
          <EmptyState icon="search" title={raw ? "Type at least 2 characters" : "Search this workspace"}>
            Find a tool, a subscription by plan or vendor, a vendor, a person in the team directory or a department.
          </EmptyState>
        </Card>
      </>
    );
  }

  const ws = ctx.workspace.id;
  const [software, subs, vendors, people, departments] = await Promise.all([getSoftwareList(ws), getSubscriptions(ws), getVendors(ws), getPeople(ws), getDepartments(ws)]);
  const has = (...values: (string | null | undefined)[]) => values.some((v) => v?.toLowerCase().includes(term));

  const softwareHits = software.filter((s) => has(s.name, s.vendorName, categoryLabels[s.category], s.businessPurpose));
  const subHits = subs.filter((s) => has(s.softwareName, s.planName, s.vendorName, s.contractReference));
  const vendorHits = vendors.filter((v) => has(v.name, v.website));
  const peopleHits = people.filter((p) => has(p.name, p.email, p.title));
  const deptHits = departments.filter((d) => has(d.name));
  const total = softwareHits.length + subHits.length + vendorHits.length + peopleHits.length + deptHits.length;

  return (
    <>
      {header}
      {form}
      {total === 0 ? (
        <Card>
          <EmptyState icon="search" title={`No results for “${raw}”`}>
            Check the spelling, or search for a vendor or plan name instead.
          </EmptyState>
        </Card>
      ) : (
        <div className="space-y-5">
          <p className="text-[13px] text-muted">
            {total} result{total === 1 ? "" : "s"} for “{raw}”
          </p>
          <Group title="Software" icon="box" count={softwareHits.length}>
            {softwareHits.slice(0, LIMIT).map((s) => (
              <Row key={s.id} href={`/business/software/${s.id}`} logo={{ name: s.name, src: s.logoSrc }} title={s.name} meta={[s.vendorName, categoryLabels[s.category], s.ownerName].filter(Boolean).join(" · ")}>
                <StatusPill status={s.status} label={softwareStatusLabels[s.status]} />
              </Row>
            ))}
          </Group>
          <Group title="Subscriptions" icon="layers" count={subHits.length}>
            {subHits.slice(0, LIMIT).map((s) => (
              <Row
                key={s.id}
                href={`/business/subscriptions/${s.id}`}
                logo={{ name: s.softwareName, src: s.logoSrc }}
                title={`${s.softwareName}${s.planName ? ` · ${s.planName}` : ""}`}
                meta={[s.priceMinor !== null ? formatMoney(s.priceMinor, s.currency) : null, intervalLabel(s), s.vendorName].filter(Boolean).join(" · ")}
              >
                {s.archived ? <Pill tone="outline">Archived</Pill> : <StatusPill status={s.status} label={subscriptionStatusLabels[s.status]} />}
              </Row>
            ))}
          </Group>
          <Group title="Vendors" icon="building" count={vendorHits.length}>
            {vendorHits.slice(0, LIMIT).map((v) => (
              <Row key={v.id} href={`/business/software?vendor=${v.id}`} logo={{ name: v.name, src: logoFor(v.name, v.website, null) }} title={v.name} meta={`${software.filter((s) => s.vendorId === v.id).length} software record(s)`} />
            ))}
          </Group>
          <Group title="People" icon="users" count={peopleHits.length}>
            {peopleHits.slice(0, LIMIT).map((p) => (
              <Row key={p.id} href="/business/team" title={p.name} meta={[p.title, p.email, p.departmentName].filter(Boolean).join(" · ")}>
                {p.status === "inactive" && <Pill tone="outline">Inactive</Pill>}
              </Row>
            ))}
          </Group>
          <Group title="Departments" icon="building" count={deptHits.length}>
            {deptHits.slice(0, LIMIT).map((d) => (
              <Row key={d.id} href="/business/settings/departments" title={d.name} meta={`${people.filter((p) => p.departmentId === d.id).length} people`}>
                {d.archivedAt && <Pill tone="outline">Archived</Pill>}
              </Row>
            ))}
          </Group>
        </div>
      )}
    </>
  );
}

function Group({ title, icon, count, children }: { title: string; icon: IconProps["name"]; count: number; children: ReactNode }) {
  if (count === 0) return null;
  return (
    <Card
      title={
        <span className="flex items-center gap-2">
          <Icon name={icon} size={15} className="text-faint" /> {title} <span className="text-[12px] font-normal text-faint">{count}</span>
        </span>
      }
      bodyClassName="py-1"
    >
      <ul className="divide-y divide-line">{children}</ul>
      {count > LIMIT && <p className="py-2 text-[12px] text-faint">Showing the first {LIMIT}. Narrow your search to see the rest.</p>}
    </Card>
  );
}

function Row({ href, title, meta, logo, children }: { href: string; title: string; meta?: string; logo?: { name: string; src: string | null }; children?: ReactNode }) {
  return (
    <li>
      <Link href={href} className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-subtle">
        {logo && <SoftwareLogo name={logo.name} src={logo.src} size={32} />}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13.5px] font-medium text-fg">{title}</span>
          {meta && <span className="block truncate text-[12.5px] text-muted">{meta}</span>}
        </span>
        {children}
        <Icon name="chevron-right" size={14} className="text-faint" />
      </Link>
    </li>
  );
}
