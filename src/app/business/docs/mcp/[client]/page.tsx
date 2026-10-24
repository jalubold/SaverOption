import Link from "next/link";
import { notFound } from "next/navigation";
import { DocHeader, Note, Pager, StatusBadge, Table } from "@/components/business/docs/doc-blocks";
import { formatIsoDate } from "@/lib/business/calc";
import { mcpClients } from "@/lib/business/mcp-clients";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return mcpClients.map((c) => ({ client: c.id }));
}

export async function generateMetadata(props: { params: Promise<{ client: string }> }) {
  const { client } = await props.params;
  const c = mcpClients.find((x) => x.id === client);
  if (!c) return {};
  return pageMetadata({
    title: `Connect ${c.name} — Business docs`,
    description: `Status of ${c.name} with the Saver Option Business MCP server, what ${c.vendor} documents, and the connection details.`,
    path: `/business/docs/mcp/${c.id}`,
  });
}

const code = "rounded bg-subtle px-1 py-0.5 font-mono text-[0.88em] text-fg";

export default async function McpClientPage(props: { params: Promise<{ client: string }> }) {
  const { client } = await props.params;
  const c = mcpClients.find((x) => x.id === client);
  if (!c) notFound();
  const verified = c.status === "verified";
  return (
    <article>
      <DocHeader eyebrow="AI and MCP" title={`Connect ${c.name}`} description={`Using ${c.name} (${c.vendor}) with the Saver Option Business MCP server.`} badge={<StatusBadge status={c.status} />} />
      <div className="prose-body text-[15.5px]">
        {!verified && (
          <Note tone="warn">
            <strong className="font-semibold text-fg">Not yet verified with this server.</strong> We&apos;ll publish step-by-step instructions here once the connection has been tested.
          </Note>
        )}

        <h2 id="documented">What {c.vendor} documents</h2>
        <p>
          {c.documented}{" "}
          <a href={c.docsUrl} target="_blank" rel="noopener noreferrer">
            {c.vendor}&apos;s documentation
          </a>
          . Features and plan availability are decided by {c.vendor} and can change.
        </p>

        <h2 id="facts">Connection details</h2>
        <ul>
          <li>
            Server URL: <code className={code}>https://&lt;your Saver Option domain&gt;/mcp</code> — intended production endpoint{" "}
            <code className={code}>https://www.saveroption.com/mcp</code>.
          </li>
          <li>Transport: Streamable HTTP (JSON responses).</li>
          <li>Sign-in: OAuth 2.1 with PKCE (S256) and dynamic client registration; you approve one workspace and an access level on Saver Option&apos;s consent screen.</li>
          <li>
            Scopes: <code className={code}>business.read</code>, and <code className={code}>business.write</code> for changes.
          </li>
          <li>The server accepts any redirect URI the client registers over HTTPS, or HTTP on localhost/127.0.0.1 (any port).</li>
        </ul>

        <h2 id="status">Test status</h2>
        <Table
          caption={`${c.name} test status`}
          head={["", ""]}
          rows={[
            ["Status", <StatusBadge key="s" status={c.status} />],
            ["Last verified", c.lastVerified ? formatIsoDate(c.lastVerified) : "Never tested with this server"],
            ["Tested surface", c.testedSurface ?? "—"],
            ["Read tools", c.readTools],
            ["Write tools", c.writeTools],
          ]}
        />
        {c.limitations.length > 0 && (
          <>
            <h2 id="limitations">Known limitations</h2>
            <ul>
              {c.limitations.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </>
        )}

        <h2 id="more">See also</h2>
        <ul>
          <li>
            <Link href="/business/docs/mcp">MCP overview, tools and compatibility</Link>
          </li>
          <li>
            <Link href="/business/docs/mcp/security">MCP security and permissions</Link>
          </li>
          <li>
            <Link href="/business/docs/troubleshooting">Troubleshooting</Link>
          </li>
        </ul>
      </div>
      <Pager href={`/business/docs/mcp/${c.id}`} />
    </article>
  );
}
