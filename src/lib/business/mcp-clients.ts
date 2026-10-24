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

/** Connected end to end by the Saver Option team on this date (sign-in, then the tools answering from the workspace). */
const TEAM_TEST = "2026-10-24";
const TEAM_SURFACE = "Connected by the Saver Option team to the production server (https://www.saveroption.com/mcp)";
const TEAM_SUMMARY = "Connects with OAuth sign-in and answers from the workspace's data.";
const READ = "Verified: sign-in through Saver Option's consent screen and the read tools, answering with the connected workspace's data";
const WRITE = "Available on a “Read and change” connection; every change is previewed first and saved only after you confirm";

export const mcpClients: McpClientInfo[] = [
  {
    id: "claude",
    name: "Claude",
    vendor: "Anthropic",
    status: "verified",
    lastVerified: TEAM_TEST,
    testedSurface: "Custom connector on claude.ai (server URL https://www.saveroption.com/mcp), used from Claude Code on the web",
    summary: TEAM_SUMMARY,
    readTools:
      "Verified: sign-in through Saver Option's consent screen worked, the read tools were listed, and list_subscriptions, get_spend_summary, get_upcoming_renewals and search_deals returned the connected workspace's data",
    writeTools: WRITE,
    documented:
      "Anthropic documents custom connectors to remote MCP servers with OAuth sign-in (dynamic client registration or a client ID metadata document) for claude.ai, the Claude desktop and mobile apps and Claude Code.",
    docsUrl: "https://claude.com/docs/connectors/building/authentication",
    limitations: ["Which Claude plans can add custom connectors is decided by Anthropic."],
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    vendor: "OpenAI",
    status: "verified",
    lastVerified: TEAM_TEST,
    testedSurface: TEAM_SURFACE,
    summary: TEAM_SUMMARY,
    readTools: READ,
    writeTools: WRITE,
    documented: "OpenAI documents remote MCP servers in ChatGPT's developer mode (beta), with OAuth. Availability, and whether write actions are allowed, depend on the plan and workspace settings.",
    docsUrl: "https://help.openai.com/en/articles/12584461-developer-mode-apps-and-full-mcp-connectors-in-chatgpt-beta",
    limitations: ["Developer mode is a beta feature and may need a workspace admin to enable it."],
  },
  {
    id: "gemini",
    name: "Gemini",
    vendor: "Google",
    status: "verified",
    lastVerified: TEAM_TEST,
    testedSurface: TEAM_SURFACE,
    summary: TEAM_SUMMARY,
    readTools: READ,
    writeTools: WRITE,
    documented: "Google documents remote MCP servers over Streamable HTTP with OAuth for the Gemini CLI.",
    docsUrl: "https://geminicli.com/docs/tools/mcp-server/",
    limitations: ["Which Gemini surface (CLI, app, enterprise) supports custom remote servers is decided by Google and changes over time."],
  },
  {
    id: "grok",
    name: "Grok",
    vendor: "xAI",
    status: "verified",
    lastVerified: TEAM_TEST,
    testedSurface: TEAM_SURFACE,
    summary: TEAM_SUMMARY,
    readTools: READ,
    writeTools: WRITE,
    documented: "xAI documents remote MCP tools for its API (Streamable HTTP or SSE servers).",
    docsUrl: "https://docs.x.ai/developers/tools/remote-mcp",
    limitations: ["Which Grok surfaces support custom remote MCP servers is decided by xAI."],
  },
];
