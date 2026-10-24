import { DocArticle } from "@/components/business/docs/doc-blocks";
import { mcpSecurity } from "@/content/business-docs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: `${mcpSecurity.title} — Business docs`,
  description: mcpSecurity.description,
  path: "/business/docs/mcp/security",
});

export default function McpSecurityPage() {
  return <DocArticle page={mcpSecurity} href="/business/docs/mcp/security" />;
}
