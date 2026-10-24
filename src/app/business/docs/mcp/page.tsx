import Link from "next/link";
import { ClientsTable, DocHeader, Note, Pager, Table, ToolsTable } from "@/components/business/docs/doc-blocks";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Connect AI clients over MCP — Business docs",
  description: "The Saver Option Business remote MCP server: URL, OAuth sign-in, scopes, confirmation for changes, rate limits, every tool, and the AI client compatibility status.",
  path: "/business/docs/mcp",
});

const PROD = "https://www.saveroption.com/mcp";

export default function McpOverviewPage() {
  return (
    <article>
      <DocHeader
        eyebrow="AI and MCP"
        title="Connect AI clients over MCP"
        description="Ask an AI assistant about your workspace's software spending in plain language. Saver Option Business runs one remote MCP server that compatible AI clients can connect to after you sign in and approve."
      />
      <div className="prose-body text-[15.5px]">
        <h2 id="what">What MCP is</h2>
        <p>
          The Model Context Protocol (MCP) is an open standard that lets AI applications call tools on other services. An AI client that supports remote MCP servers can connect to
          Saver Option Business, and then answer questions such as “Which subscriptions renew next month?” by calling the tools below with your permission.
        </p>

        <h2 id="url">Server URL</h2>
        <p>
          The endpoint is <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[0.88em] text-fg">https://&lt;your Saver Option domain&gt;/mcp</code>. The intended production endpoint
          is <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[0.88em] text-fg">{PROD}</code>. Signed-in members can copy it from{" "}
          <Link href="/business/settings/mcp">Settings → AI clients (MCP)</Link>.
        </p>
        <Table
          caption="Transport"
          head={["", "Details"]}
          rows={[
            ["Transport", "Streamable HTTP. Clients POST JSON-RPC messages and get JSON responses. The server is stateless and offers no event stream (GET returns 405)."],
            ["Protocol versions", "2025-11-25, 2025-06-18 and 2025-03-26."],
            ["Capabilities", "Tools only."],
          ]}
        />

        <h2 id="sign-in">How sign-in works</h2>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5">
          <li>You add the server URL in your AI client.</li>
          <li>The client finds Saver Option&apos;s sign-in server and registers itself.</li>
          <li>Your browser opens Saver Option. You sign in with Google if needed.</li>
          <li>
            On the consent screen you choose <strong className="font-semibold text-fg">one workspace</strong> and <strong className="font-semibold text-fg">Read only</strong> or{" "}
            <strong className="font-semibold text-fg">Read and change</strong>. The screen shows the app&apos;s self-declared name and the address it will return you to.
          </li>
          <li>You&apos;re sent back to the client, which can now call tools within your role.</li>
        </ol>
        <Table
          caption="Authorization"
          head={["Standard", "Where"]}
          rows={[
            ["OAuth 2.1 authorization code flow with PKCE (S256 only)", "/business/oauth/authorize"],
            ["Protected resource metadata (RFC 9728)", "/.well-known/oauth-protected-resource/mcp"],
            ["Authorization server metadata (RFC 8414)", "/.well-known/oauth-authorization-server"],
            ["Dynamic client registration (RFC 7591)", "/oauth/register"],
            ["Token endpoint (authorization_code, refresh_token)", "/oauth/token"],
            ["Token revocation (RFC 7009)", "/oauth/revoke"],
          ]}
        />
        <p>
          Unauthenticated requests get <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[0.88em] text-fg">401</code> with a{" "}
          <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[0.88em] text-fg">WWW-Authenticate</code> header pointing at the protected resource metadata. Access tokens last one hour;
          refresh tokens last 30 days and rotate on every use. Registered redirect URIs must use HTTPS, or HTTP on a loopback address (localhost or 127.0.0.1, any port).
        </p>

        <h2 id="scopes">Scopes</h2>
        <Table
          caption="Scopes"
          head={["Scope", "Allows"]}
          rows={[
            ["business.read", "Every read tool, within your role."],
            ["business.write", "Also create_subscription and update_subscription — only when you chose “Read and change” and your role is Owner, Admin or Finance (members: records they own)."],
          ]}
        />

        <h2 id="confirm">Changes need your confirmation</h2>
        <p>
          The change tools work in two steps. A call with <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[0.88em] text-fg">confirm: false</code> (the default) returns the
          interpreted details or a before/after comparison, with warnings, and saves nothing. The client should show you the preview; only a second call with{" "}
          <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[0.88em] text-fg">confirm: true</code> saves it. Repeating the same confirmed call doesn&apos;t create a duplicate.
        </p>

        <h2 id="limits">What it can&apos;t do</h2>
        <ul>
          <li>Cancel, renew or buy subscriptions, make payments, or change anything at a vendor.</li>
          <li>Delete records, manage members or change workspace settings.</li>
          <li>Run arbitrary queries, SQL or code — each tool has a fixed input schema that the server validates.</li>
          <li>Reach any workspace other than the one you approved.</li>
        </ul>
        <Note>
          Each connection is limited to 120 requests a minute. The OAuth endpoints are rate-limited per IP address. Figures are returned per currency and never converted, and each one says
          whether it&apos;s actual, a normalized estimate or a projection.
        </Note>

        <h2 id="tools">Tools</h2>
        <p>Generated from the server&apos;s tool registry.</p>
        <ToolsTable />

        <h2 id="compatibility">AI client compatibility</h2>
        <p>
          The server targets Claude, ChatGPT, Gemini and Grok. A client is listed as verified only after sign-in, read tools and (where supported) write tools have been tested with this
          server. Until then, no client-specific setup steps are published.
        </p>
        <ClientsTable />

        <h2 id="more">More</h2>
        <ul>
          <li>
            <Link href="/business/docs/mcp/security">MCP security and permissions</Link>
          </li>
          <li>
            <Link href="/business/docs/troubleshooting">Troubleshooting</Link>
          </li>
        </ul>
      </div>
      <Pager href="/business/docs/mcp" />
    </article>
  );
}
