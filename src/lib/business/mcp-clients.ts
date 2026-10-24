/**
 * AI clients the MCP server targets, and what has actually been verified.
 * Update `status` and `lastVerified` only after testing the connection (sign-in,
 * read tools and, where supported, write tools) in that client. Statuses:
 * verified | partial | not_supported | not_tested.
 */

export type ClientStatus = "verified" | "partial" | "not_supported" | "not_tested";

export interface McpClientInfo {
  id: "claude" | "chatgpt" | "gemini" | "grok";
  name: string;
  vendor: string;
  status: ClientStatus;
  /** YYYY-MM-DD of the last test in that client, or null. */
  lastVerified: string | null;
  testedSurface: string | null;
  /** One line on what works, for the public MCP page; null until tested. */
  summary: string | null;
  readTools: string;
  writeTools: string;
  /** What the vendor's own documentation says, with the page it came from. */
  documented: string;
  docsUrl: string;
  limitations: string[];
}

export const statusLabels: Record<ClientStatus, string> = {
  verified: "Verified",
  partial: "Partially verified",
  not_supported: "Not supported in the tested client",
  not_tested: "Not yet tested",
};

export const mcpClients: McpClientInfo[] = [
  {
    id: "claude",
    name: "Claude",
    vendor: "Anthropic",
    status: "partial",
    lastVerified: "2026-10-24",
    testedSurface: "Custom connector on a claude.ai account (server URL https://www.saveroption.com/mcp), used from Claude Code on the web",
    summary: "Sign-in and the read tools work. Changing records hasn't been tested yet.",
    readTools:
      "Verified: sign-in through Saver Option's consent screen worked, the read tools were listed, and list_subscriptions, get_spend_summary, get_upcoming_renewals and search_deals returned the connected workspace's data",
    writeTools: "Not yet tested (the tested connection was approved read-only)",
    documented:
      "Anthropic documents custom connectors to remote MCP servers with OAuth sign-in (dynamic client registration or a client ID metadata document) for claude.ai, the Claude desktop and mobile apps and Claude Code.",
    docsUrl: "https://claude.com/docs/connectors/building/authentication",
    limitations: [
      "Which Claude plans can add custom connectors is decided by Anthropic.",
      "Only the surface above was tested; the Claude desktop and mobile apps and the Claude Code CLI haven't been checked with this server yet.",
    ],
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    vendor: "OpenAI",
    status: "not_tested",
    lastVerified: null,
    testedSurface: null,
    summary: null,
    readTools: "Not yet tested",
    writeTools: "Not yet tested",
    documented: "OpenAI documents remote MCP servers in ChatGPT's developer mode (beta), with OAuth. Availability, and whether write actions are allowed, depend on the plan and workspace settings.",
    docsUrl: "https://help.openai.com/en/articles/12584461-developer-mode-apps-and-full-mcp-connectors-in-chatgpt-beta",
    limitations: ["Developer mode is a beta feature and may need a workspace admin to enable it."],
  },
  {
    id: "gemini",
    name: "Gemini",
    vendor: "Google",
    status: "not_tested",
    lastVerified: null,
    testedSurface: null,
    summary: null,
    readTools: "Not yet tested",
    writeTools: "Not yet tested",
    documented: "Google documents remote MCP servers over Streamable HTTP with OAuth for the Gemini CLI. Support in the Gemini app hasn't been checked.",
    docsUrl: "https://geminicli.com/docs/tools/mcp-server/",
    limitations: ["Which Gemini surface (CLI, app, enterprise) supports custom remote servers differs and changes over time."],
  },
  {
    id: "grok",
    name: "Grok",
    vendor: "xAI",
    status: "not_tested",
    lastVerified: null,
    testedSurface: null,
    summary: null,
    readTools: "Not yet tested",
    writeTools: "Not yet tested",
    documented: "xAI documents remote MCP tools for its API (Streamable HTTP or SSE servers). Custom connectors in the Grok app haven't been checked.",
    docsUrl: "https://docs.x.ai/developers/tools/remote-mcp",
    limitations: ["How the API passes OAuth credentials to a remote MCP server hasn't been tested with this server."],
  },
];
