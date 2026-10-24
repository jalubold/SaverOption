import Link from "next/link";
import type { ReactNode } from "react";
import type { DocBlock, DocPage } from "@/content/business-docs";
import { IMPORT_FIELDS } from "@/lib/business/csv-import";
import { formatIsoDate } from "@/lib/business/calc";
import { mcpClients, statusLabels, type ClientStatus } from "@/lib/business/mcp-clients";
import type { ObjectSchema } from "@/lib/business/schema";
import { tools } from "@/lib/server/mcp/tools";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/components/ui/primitives";
import { RichText, slugify } from "./rich-text";
import { neighbours } from "./nav-items";

/** Rendering for the structured docs content (server components). */

export function Table({ head, rows, caption }: { head: ReactNode[]; rows: ReactNode[][]; caption?: string }) {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[520px] border-collapse text-left text-[14px]">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className="bg-subtle">
          <tr>
            {head.map((h, i) => (
              <th key={i} scope="col" className="border-b border-line px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.04em] text-muted">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="align-top">
              {r.map((c, j) => (
                <td key={j} className={cn("border-b border-line px-3 py-2.5 leading-relaxed text-fg", i === rows.length - 1 && "border-b-0", j === 0 && "font-medium")}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Note({ tone = "info", children }: { tone?: "info" | "warn"; children: ReactNode }) {
  return (
    <div className={cn("my-4 flex gap-2.5 rounded-xl border px-4 py-3 text-[14.5px] leading-relaxed", tone === "warn" ? "border-warn/30 bg-warn-soft text-fg" : "border-line bg-subtle text-muted")}>
      <Icon name={tone === "warn" ? "alert" : "info"} size={16} className={cn("mt-1 shrink-0", tone === "warn" ? "text-warn" : "text-faint")} />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

const statusTone: Record<ClientStatus, string> = {
  verified: "bg-success/12 text-[color-mix(in_oklab,var(--success)_75%,black)]",
  partial: "bg-accent-soft text-accent-ink",
  not_supported: "bg-danger/10 text-danger",
  not_tested: "border border-line-strong text-muted",
};

export function StatusBadge({ status }: { status: ClientStatus }) {
  return <span className={cn("inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-[12px] font-semibold", statusTone[status])}>{statusLabels[status]}</span>;
}

function inputsOf(schema: ObjectSchema): ReactNode {
  const names = Object.keys(schema.properties);
  if (names.length === 0) return <span className="text-faint">none</span>;
  const required = new Set(schema.required ?? []);
  return (
    <span className="flex flex-wrap gap-1">
      {names.map((n) => (
        <code key={n} className="rounded bg-subtle px-1 py-0.5 font-mono text-[12px] text-fg">
          {n}
          {required.has(n) ? "*" : ""}
        </code>
      ))}
    </span>
  );
}

export function ToolsTable() {
  return (
    <>
      <Table
        caption="MCP tools"
        head={["Tool", "What it does", "Inputs (* required)"]}
        rows={tools.map((t) => [
          <span key="n" className="block">
            <code className="font-mono text-[13px]">{t.name}</code>
            {t.write && <span className="mt-1 block w-fit rounded bg-warn-soft px-1.5 text-[11px] font-semibold text-warn">Changes records</span>}
          </span>,
          <span key="d" className="text-muted">
            <strong className="block font-semibold text-fg">{t.title}</strong>
            {t.description}
          </span>,
          inputsOf(t.inputSchema),
        ])}
      />
      <p>Tools marked “Changes records” appear only on connections approved with read and change access.</p>
    </>
  );
}

export function ClientsTable() {
  return (
    <Table
      caption="AI client compatibility"
      head={["Client", "Status", "Last verified", "Read tools", "Write tools", "What the vendor documents"]}
      rows={mcpClients.map((c) => [
        <Link key="n" href={`/business/docs/mcp/${c.id}`}>
          {c.name}
        </Link>,
        <StatusBadge key="s" status={c.status} />,
        c.lastVerified ? formatIsoDate(c.lastVerified) : "—",
        c.readTools,
        c.writeTools,
        <span key="d" className="text-muted">
          {c.documented}{" "}
          <a href={c.docsUrl} target="_blank" rel="noopener noreferrer">
            Vendor docs
          </a>
        </span>,
      ])}
    />
  );
}

export function CsvFieldsTable() {
  return (
    <Table
      caption="CSV import columns"
      head={["Column", "Required", "Format", "Example"]}
      rows={IMPORT_FIELDS.map((f) => [f.header, f.required ? "Yes" : "No", f.format, f.example ? <code key="e" className="font-mono text-[12.5px]">{f.example}</code> : "—"])}
    />
  );
}

export function Block({ block }: { block: DocBlock }) {
  switch (block.type) {
    case "p":
      return (
        <p>
          <RichText text={block.text} />
        </p>
      );
    case "list": {
      const items = block.items.map((t, i) => (
        <li key={i}>
          <RichText text={t} />
        </li>
      ));
      return block.ordered ? <ol className="mt-2 list-decimal space-y-1.5 pl-5">{items}</ol> : <ul>{items}</ul>;
    }
    case "table":
      return <Table head={block.head} rows={block.rows.map((r) => r.map((c, i) => <RichText key={i} text={c} />))} />;
    case "code":
      return (
        <pre className="my-4 overflow-x-auto rounded-xl border border-line bg-subtle px-4 py-3 font-mono text-[13px] text-fg" aria-label={block.label}>
          <code>{block.text}</code>
        </pre>
      );
    case "note":
      return (
        <Note tone={block.tone}>
          <RichText text={block.text} />
        </Note>
      );
    case "csvFields":
      return <CsvFieldsTable />;
    case "tools":
      return <ToolsTable />;
    case "clients":
      return <ClientsTable />;
  }
}

export function DocHeader({ eyebrow, title, description, badge }: { eyebrow: string; title: string; description: string; badge?: ReactNode }) {
  return (
    <header className="mb-8 border-b border-line pb-6">
      <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-accent-ink">{eyebrow}</p>
      <h1 className="display mt-2 text-[2.3rem] leading-[1.05] sm:text-[2.9rem]">{title}</h1>
      <p className="mt-3 max-w-2xl text-[16.5px] leading-relaxed text-muted">{description}</p>
      {badge && <div className="mt-4">{badge}</div>}
    </header>
  );
}

export function Pager({ href }: { href: string }) {
  const { prev, next } = neighbours(href);
  return (
    <nav aria-label="Previous and next pages" className="mt-12 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
      {prev ? (
        <Link href={prev.href} className="rounded-xl border border-line px-4 py-3 hover:border-line-strong hover:bg-subtle">
          <span className="block text-[12px] text-faint">Previous</span>
          <span className="text-[14.5px] font-medium text-fg">{prev.label}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link href={next.href} className="rounded-xl border border-line px-4 py-3 text-right hover:border-line-strong hover:bg-subtle">
          <span className="block text-[12px] text-faint">Next</span>
          <span className="text-[14.5px] font-medium text-fg">{next.label}</span>
        </Link>
      )}
    </nav>
  );
}

/** A guide page: header, sections with linkable headings, previous/next. */
export function DocArticle({ page, href }: { page: DocPage; href: string }) {
  return (
    <article>
      <DocHeader
        eyebrow={page.group}
        title={page.title}
        description={page.description}
        badge={page.requiresConfiguration ? <span className="inline-flex rounded-md bg-warn-soft px-2 py-0.5 text-[12px] font-semibold text-warn">Requires configuration</span> : undefined}
      />
      <div className="prose-body text-[15.5px]">
        {page.sections.map((s) => {
          const id = slugify(s.heading);
          return (
            <section key={s.heading} aria-labelledby={id}>
              <h2 id={id}>
                <a href={`#${id}`} className="!text-heading !no-underline hover:!underline">
                  {s.heading}
                </a>
              </h2>
              {s.blocks.map((b, i) => (
                <Block key={i} block={b} />
              ))}
            </section>
          );
        })}
      </div>
      <Pager href={href} />
    </article>
  );
}
