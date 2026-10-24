import { docGroups, guides, mcpSecurity, type DocGroup } from "@/content/business-docs";
import { mcpClients } from "@/lib/business/mcp-clients";

/** Every docs page in reading order, for the side navigation, prev/next links and the sitemap. */
export interface DocNavItem {
  href: string;
  label: string;
  group: DocGroup;
}

function build(): DocNavItem[] {
  const items: DocNavItem[] = [{ href: "/business/docs", label: "Overview", group: "Start" }];
  for (const g of guides) {
    if (g.group === "AI and MCP") continue;
    items.push({ href: `/business/docs/${g.slug}`, label: g.nav ?? g.title, group: g.group });
  }
  const assistant = guides.find((g) => g.slug === "assistant");
  if (assistant) items.push({ href: "/business/docs/assistant", label: assistant.nav ?? assistant.title, group: "AI and MCP" });
  items.push({ href: "/business/docs/mcp", label: "MCP overview", group: "AI and MCP" });
  for (const c of mcpClients) items.push({ href: `/business/docs/mcp/${c.id}`, label: `Connect ${c.name}`, group: "AI and MCP" });
  items.push({ href: "/business/docs/mcp/security", label: mcpSecurity.nav ?? mcpSecurity.title, group: "AI and MCP" });
  // Reading order follows the groups.
  return docGroups.flatMap((group) => items.filter((i) => i.group === group));
}

export const docNav: DocNavItem[] = build();

export function neighbours(href: string): { prev: DocNavItem | null; next: DocNavItem | null } {
  const i = docNav.findIndex((d) => d.href === href);
  return { prev: i > 0 ? docNav[i - 1] : null, next: i >= 0 && i < docNav.length - 1 ? docNav[i + 1] : null };
}
