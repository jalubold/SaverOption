import Link from "next/link";
import { DocHeader, Pager } from "@/components/business/docs/doc-blocks";
import { docNav } from "@/components/business/docs/nav-items";
import { docGroups, guides, mcpSecurity } from "@/content/business-docs";
import { mcpClients } from "@/lib/business/mcp-clients";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Saver Option Business docs",
  description: "How to track software subscriptions, import them from CSV, read your spending, manage renewals, review savings and connect AI clients over MCP.",
  path: "/business/docs",
});

const summaries = new Map<string, string>([
  ...guides.map((g) => [`/business/docs/${g.slug}`, g.description] as [string, string]),
  ["/business/docs/mcp", "Connect an AI client to your workspace over the Model Context Protocol: sign-in, tools and compatibility."],
  ...mcpClients.map((c) => [`/business/docs/mcp/${c.id}`, `Status of ${c.name} with this server and what ${c.vendor} documents.`] as [string, string]),
  ["/business/docs/mcp/security", mcpSecurity.description],
]);

export default function DocsIndex() {
  return (
    <>
      <DocHeader
        eyebrow="Documentation"
        title="Saver Option Business docs"
        description="Guides for tracking your company's software spending: subscriptions, CSV import, the dashboard and analytics, renewals, Spend Detective, deals, reports and AI clients over MCP."
      />
      <div className="space-y-10">
        {docGroups.map((group) => (
          <section key={group} aria-labelledby={`g-${group}`}>
            <h2 id={`g-${group}`} className="text-[1.1rem] font-semibold text-heading">
              {group}
            </h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {docNav
                .filter((d) => d.group === group && d.href !== "/business/docs")
                .map((d) => (
                  <li key={d.href}>
                    <Link href={d.href} className="block h-full rounded-xl border border-line bg-surface px-4 py-3.5 transition-colors hover:border-line-strong">
                      <span className="block text-[15px] font-semibold text-fg">{d.label}</span>
                      <span className="mt-1 block text-[13.5px] leading-relaxed text-muted">{summaries.get(d.href)}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
      <Pager href="/business/docs" />
    </>
  );
}
