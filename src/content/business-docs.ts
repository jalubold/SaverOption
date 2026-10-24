/**
 * User documentation for Saver Option Business (/business/docs). Structured
 * content, rendered by src/components/business/docs. Inline text supports
 * [label](/path), `code` and **bold**. Document only what exists; anything
 * planned is labelled "Not available yet".
 *
 * Special blocks render live data so the docs can't drift from the code:
 * csvFields (the CSV import columns), tools (the MCP tool registry) and
 * clients (the AI client compatibility matrix).
 */

export type DocBlock =
  | { type: "p"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "code"; text: string; label?: string }
  | { type: "note"; text: string; tone?: "info" | "warn" }
  | { type: "csvFields" }
  | { type: "tools" }
  | { type: "clients" };

export interface DocSection {
  heading: string;
  blocks: DocBlock[];
}

export type DocGroup = "Start" | "Use Saver Option Business" | "AI and MCP" | "Help";

export interface DocPage {
  slug: string;
  title: string;
  /** Shorter label for the side navigation. */
  nav?: string;
  description: string;
  group: DocGroup;
  /** Shown as a badge: the feature needs the site operator to configure something. */
  requiresConfiguration?: boolean;
  sections: DocSection[];
}

export const docGroups: DocGroup[] = ["Start", "Use Saver Option Business", "AI and MCP", "Help"];

export const guides: DocPage[] = [
  {
    slug: "getting-started",
    title: "Getting started",
    description: "What Saver Option Business does, how to sign in, and the fastest way to a useful overview of your software spend.",
    group: "Start",
    sections: [
      {
        heading: "What it is",
        blocks: [
          {
            type: "p",
            text: "Saver Option Business is a workspace for your company's software spending. You record the subscriptions you pay for — price, billing interval, renewal date, owner, department and seats — and it shows where the money goes, what renews soon, which seats are unassigned and where you could spend less.",
          },
          { type: "p", text: "Every figure comes from what your team records. Nothing is estimated from outside data, and there are no bank, card or vendor connections." },
        ],
      },
      {
        heading: "The workflow",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "[Sign in with Google](/business/login) and [create a workspace](/business/docs/create-workspace).",
              "Add subscriptions one by one, or [import them from a CSV file](/business/docs/csv-import).",
              "Read the [dashboard](/business/docs/dashboard) and [analytics](/business/docs/analytics) to understand spending.",
              "Review [Spend Detective](/business/docs/spend-detective) findings and decide on [renewals](/business/docs/renewals).",
              "Check [deals for your stack](/business/docs/deals) from the Saver Option marketplace.",
              "Optionally, [connect an AI client over MCP](/business/docs/mcp) and ask questions in plain language.",
            ],
          },
        ],
      },
      {
        heading: "Signing in",
        blocks: [
          { type: "p", text: "Google is the only sign-in method. Saver Option receives your name, email address and profile picture. It doesn't request access to Gmail, Drive or Calendar, and it doesn't keep Google access tokens." },
          { type: "p", text: "New and returning users use the same **Continue with Google** button." },
        ],
      },
      {
        heading: "Try it with sample data",
        blocks: [
          { type: "p", text: "After signing in you can open a separate demo workspace, “Northwind Studio (demo)”, with a fictional company's departments, people, subscriptions, seats, renewals and payments. Prices are sample figures, not vendor quotes. Demo data never mixes with your own workspace, and you can reset it in Settings." },
        ],
      },
    ],
  },
  {
    slug: "create-workspace",
    title: "Create your workspace",
    description: "Set up a workspace for your company, invite colleagues with roles, and switch between workspaces.",
    group: "Start",
    sections: [
      {
        heading: "Setup steps",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "**Create workspace**: company name (required), industry, company size and website (optional), default currency and time zone.",
              "**Add your first subscription**: or skip this step and add software later.",
              "**Open the dashboard**.",
            ],
          },
          { type: "p", text: "The default currency is used for new subscriptions; each subscription keeps its own currency. Renewal reminders and “today” follow the workspace time zone. You can change company details, preferences and notification defaults in [Settings](/business/settings)." },
        ],
      },
      {
        heading: "Roles",
        blocks: [
          {
            type: "table",
            head: ["Role", "Can"],
            rows: [
              ["Owner", "Everything, including deleting the workspace."],
              ["Admin", "Workspace settings, members (except owners and other admins), departments, people, every record, spend and savings."],
              ["Finance", "Software and subscription records, payments, renewal outcomes, reports, exports and savings."],
              ["Member", "View the workspace; edit the software and subscriptions they own."],
              ["Read-only", "View only."],
            ],
          },
          { type: "p", text: "Roles are checked on the server for every request, not only hidden in the interface." },
        ],
      },
      {
        heading: "Giving colleagues access",
        blocks: [
          { type: "p", text: "Owners and admins give an email address a role on [Team](/business/team). No invitation email is sent: the colleague signs in with Google using exactly that address and accepts on the onboarding page." },
          { type: "note", text: "Invitation and reminder emails are **not available yet** — there is no email provider configured." },
        ],
      },
      {
        heading: "Several workspaces",
        blocks: [{ type: "p", text: "If you belong to more than one company, switch workspaces from the menu at the top of the sidebar. Data from one workspace is never shown in another." }],
      },
    ],
  },
  {
    slug: "subscriptions",
    title: "Add and manage subscriptions",
    nav: "Subscriptions",
    description: "Record software subscriptions with their price, billing interval, renewal date, seats, owner and department; search, filter, export and archive them.",
    group: "Use Saver Option Business",
    sections: [
      {
        heading: "Adding a subscription",
        blocks: [
          { type: "p", text: "Use **Add software**. Pick a tool from your inventory or name a new one, then enter what you know. Only the software is required; a missing price is treated as unknown, never as zero, and left out of totals until you add one." },
          {
            type: "table",
            head: ["Field", "Notes"],
            rows: [
              ["Price per billing period", "What one billing period costs in total."],
              ["Billing interval", "Monthly, quarterly, yearly, or custom (every N days, weeks, months or years)."],
              ["Pricing model", "Flat, or per seat (the price covers the purchased seats)."],
              ["Status", "Active, trial, paused, cancelled or expired. Only active subscriptions count towards recurring cost."],
              ["Dates", "Start date, next renewal date, cancellation deadline, contract end date."],
              ["Auto-renew", "Whether the plan renews automatically."],
              ["Seats", "Purchased seats, and seats in use when they aren't assigned by name."],
              ["Owner and department", "From your team directory and departments."],
              ["Payment method", "A short label such as “Company Visa ••4242”. Anything that looks like a card number is rejected."],
            ],
          },
        ],
      },
      {
        heading: "Monthly and annual equivalents",
        blocks: [
          { type: "p", text: "Every price is converted to a **monthly equivalent**: monthly as entered, quarterly ÷ 3, yearly ÷ 12, custom intervals by their length. The **annualized** figure is the monthly equivalent × 12. These are run-rates (normalized estimates), not money spent; money spent is only what you record as payments." },
          { type: "p", text: "Currencies are never added together or converted. Totals are shown per currency." },
        ],
      },
      {
        heading: "Finding records",
        blocks: [
          { type: "p", text: "The [subscriptions list](/business/subscriptions) has a search box and filters for vendor, category, status, billing interval, department, owner, renewal window (next 30 days, next 90 days, overdue, no date), currency and payment method. Sort by name, cost, renewal date or newest." },
          { type: "p", text: "Select rows for bulk actions such as archiving or assigning a department or owner. **Export CSV** downloads the subscriptions you're allowed to see (roles with export access)." },
        ],
      },
      {
        heading: "Archive is not cancel",
        blocks: [
          { type: "note", tone: "warn", text: "Archiving a record, or setting its status to cancelled, only changes Saver Option. It never cancels, renews or changes anything at the vendor — do that in the vendor's own account." },
          { type: "p", text: "Archived subscriptions are kept for history and left out of every total. You can restore them." },
        ],
      },
      {
        heading: "Where a record came from",
        blocks: [
          { type: "p", text: "Each subscription shows its source — entered in the app, imported from CSV (with a link to the import), added by an AI client over MCP, or demo data — and when it was last verified. Imported records show “Not verified since import” until someone edits them." },
        ],
      },
    ],
  },
  {
    slug: "csv-import",
    title: "Import subscriptions from CSV",
    nav: "CSV import",
    description: "Import many subscriptions at once from a spreadsheet export: template, column mapping, preview, duplicate detection and import history.",
    group: "Use Saver Option Business",
    sections: [
      {
        heading: "Steps",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Open [Subscriptions → Import CSV](/business/subscriptions/import). Owners, admins and finance can import.",
              "Optionally download the template (column names only, no example rows).",
              "Choose a `.csv` file of up to 1 MB and 2,000 rows. Commas, semicolons and tabs are detected automatically.",
              "Check the column mapping and the file options, then update the preview.",
              "Review every row: **Will be created**, **Duplicate — will be skipped**, or **Error**, with the values as they'll be saved.",
              "Click **Import N subscriptions**. Nothing is saved before this step.",
            ],
          },
        ],
      },
      {
        heading: "Columns",
        blocks: [{ type: "p", text: "Columns are matched by their names (for example “Tool”, “Cost”, “Billing cycle”, “Licenses” or “Team”). Change any mapping that's wrong; columns you don't map are ignored. Only the software name is required." }, { type: "csvFields" }],
      },
      {
        heading: "File options",
        blocks: [
          {
            type: "list",
            items: [
              "**Date format** in the file: YYYY-MM-DD, DD/MM/YYYY or MM/DD/YYYY.",
              "**Decimal separator**: dot or comma. A mismatch is flagged rather than misread.",
              "**Default currency** for rows without one, and a default billing interval when the file has no such column.",
            ],
          },
        ],
      },
      {
        heading: "Validation and matching",
        blocks: [
          { type: "p", text: "Each row goes through the same rules as the subscription form: amounts, dates, seat counts, and payment-method labels (card numbers are refused). A blank price stays unknown." },
          { type: "p", text: "Software is matched to your inventory by name; new names are added to it. Departments and owners are matched to existing records only — an unknown one is left blank with a warning, never created." },
        ],
      },
      {
        heading: "Duplicates and re-imports",
        blocks: [
          { type: "p", text: "A row is a duplicate when the same software, plan, billing interval and currency already exists (or appears earlier in the file). Duplicates are skipped and linked to the matching record. Existing records are never overwritten." },
          { type: "p", text: "Importing the same file again shows when it was first imported, and creates nothing that already exists. A double click on Import can't create rows twice." },
        ],
      },
      {
        heading: "After the import",
        blocks: [
          { type: "p", text: "The result shows how many rows were created, skipped and failed, with links to the new subscriptions. Totals on the dashboard update straight away. **Import history** on the same page lists earlier imports with their counts and row messages." },
          { type: "note", text: "Imported records are marked “Imported from CSV” and “Not verified” until someone reviews and saves them." },
        ],
      },
    ],
  },
  {
    slug: "dashboard",
    title: "Understand your dashboard",
    nav: "Dashboard",
    description: "What each figure and chart on the overview means, and which ones are estimates.",
    group: "Use Saver Option Business",
    sections: [
      {
        heading: "Headline figures",
        blocks: [
          {
            type: "table",
            head: ["Figure", "What it is", "Basis"],
            rows: [
              ["Monthly software spend", "Monthly equivalent of active subscriptions with a price, per currency.", "Normalized estimate"],
              ["Annualized software spend", "Monthly equivalent × 12.", "Normalized estimate"],
              ["Renewing in 9 weeks", "Live subscriptions renewing in the next 63 days, at their current price.", "Projection"],
              ["Active subscriptions", "Active plans; trials shown separately.", "Count"],
              ["Upcoming renewals", "Renewals in the next 30 days.", "Count"],
              ["Est. potential savings", "Opportunities with an estimate, each subscription counted once, per year.", "Estimate"],
              ["Unused licenses", "Purchased seats not in use, and their monthly cost on per-seat plans.", "From recorded seats"],
            ],
          },
        ],
      },
      {
        heading: "Charts and lists",
        blocks: [
          {
            type: "list",
            items: [
              "**Monthly spending trend**: the recurring run-rate at each month's end, from start dates, end dates and recorded price changes.",
              "**Spending by category, vendor and department**, and **billing intervals**: shares of the monthly run-rate.",
              "**Renewals and deadlines**: the next nine weeks on a timeline, with cancellation deadlines for auto-renewing plans.",
              "**License utilization**: seats in use ÷ seats purchased where seats are tracked.",
              "**Savings**: potential (estimated) next to realized (confirmed) savings.",
              "**Needs attention**: high-cost renewals soon, cancellation deadlines, unused seats, potential overlap, and missing prices, dates or owners.",
            ],
          },
          { type: "p", text: "Every chart has a “View as table” option. When you bill in several currencies, the charts use your default currency and note the others; [Reports](/business/reports) charts any currency." },
        ],
      },
      {
        heading: "No data yet",
        blocks: [{ type: "p", text: "A new workspace shows an empty state with **Add software** and the demo workspace — no sample figures are shown as if they were yours." }],
      },
    ],
  },
  {
    slug: "analytics",
    title: "Spending analytics",
    nav: "Analytics",
    description: "Trends, period-over-period changes, largest subscriptions, cost per seat and upcoming commitments — each labelled actual, estimate or projection.",
    group: "Use Saver Option Business",
    sections: [
      {
        heading: "What's on the page",
        blocks: [
          {
            type: "list",
            items: [
              "A date range (last 3, 6, 12 or 24 months) and filters for currency, category, department and vendor.",
              "Run-rate trend and recorded payments by month.",
              "Changes between periods per currency: the run-rate month on month and against three months earlier, and recorded payments for complete months and quarters — shown only when the records reach back far enough.",
              "Spending insights with the evidence behind each one.",
              "Largest subscriptions and their share of spend; cost per seat for per-seat plans with a known price.",
              "Spend by vendor, category and department.",
              "Upcoming commitments for the next 3, 6 and 12 months: auto-renewing plans' renewal dates × their current price (manual renewals aren't counted).",
            ],
          },
          { type: "p", text: "[Analytics](/business/analytics) and [Reports](/business/reports) are built from the same numbers. Reports keeps the tables and CSV exports." },
        ],
      },
      {
        heading: "Actual, estimate or projection",
        blocks: [
          {
            type: "table",
            head: ["Label", "Meaning"],
            rows: [
              ["Actual", "Payments your team recorded, by payment date."],
              ["Normalized estimate", "Prices converted to monthly or annual equivalents (a run-rate, not cash spent)."],
              ["Projection", "Future renewals at each subscription's current recorded price."],
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "renewals",
    title: "Renewal management",
    nav: "Renewals",
    description: "See what renews and when, record decisions and outcomes, and get in-app reminders before renewals and cancellation deadlines.",
    group: "Use Saver Option Business",
    sections: [
      {
        heading: "Views",
        blocks: [
          {
            type: "list",
            items: [
              "**Upcoming**: a 60-day timeline of renewals and cancellation deadlines, and a list with expected amounts for the window you choose.",
              "**Calendar**: renewals by month.",
              "**Requires attention**: renewals without a decision, cancellation deadlines soon, missing dates.",
              "**History**: recorded renewal outcomes.",
            ],
          },
          { type: "p", text: "Dates are shown in the workspace time zone." },
        ],
      },
      {
        heading: "Decisions and outcomes",
        blocks: [
          { type: "p", text: "On a subscription, set the renewal decision (undecided, renew, renegotiate or cancel), a reviewer from your team directory and notes. **Record outcome** records what happened at renewal: the next renewal date moves on one period and the payment is recorded." },
          { type: "note", tone: "warn", text: "Saver Option never renews, cancels or changes a subscription at the vendor." },
        ],
      },
      {
        heading: "Reminders",
        blocks: [
          { type: "p", text: "In-app notifications are created 30, 14 and 7 days before each renewal and before cancellation deadlines on auto-renewing plans. Change the defaults in [Settings → Notifications](/business/settings/notifications) or per subscription. Each reminder is created once." },
          { type: "p", text: "Reminders are created when someone opens the app, and daily when the site operator has configured the scheduled job." },
          { type: "note", text: "Email reminders are **not available yet**. A reminder in the app doesn't mean anything was emailed." },
        ],
      },
    ],
  },
  {
    slug: "spend-detective",
    title: "Spend Detective",
    description: "The rules that find savings opportunities in your own data, how estimates are made, and how to record savings you actually achieved.",
    group: "Use Saver Option Business",
    sections: [
      {
        heading: "How it works",
        blocks: [
          { type: "p", text: "Spend Detective runs explainable rules over your workspace's own records. Each finding shows its evidence, an estimate only where your prices and seats support one, a confidence level and a recommended action. It doesn't use AI to invent findings, and it never assumes a license is unused without seat data." },
        ],
      },
      {
        heading: "Rules",
        blocks: [
          {
            type: "table",
            head: ["Finding", "When", "Estimate"],
            rows: [
              ["Unused licenses", "Per-seat plans with seats not in use.", "Unused seats × cost per seat."],
              ["Underutilized licenses", "Flat-priced plans under 60% utilization.", "None (the price doesn't scale with seats)."],
              ["Potential overlap", "Two or more active tools in a category where one usually does the job.", "None — for review, never a confirmed duplicate."],
              ["High-cost subscription", "20% or more of a currency's recurring cost (with at least 3 priced subscriptions).", "None."],
              ["Annual billing", "Monthly plans; an estimate only when you recorded an annual price.", "Monthly price × 12 − annual price, per year."],
              ["Alternative software", "Open-source products in the Saver Option catalog for the same job.", "None."],
              ["Renewal review", "Quarterly or longer renewals within 45 days with no decision.", "None."],
              ["Saver Option deal", "A live marketplace listing for a tool you use.", "None (eligibility varies)."],
            ],
          },
        ],
      },
      {
        heading: "Statuses",
        blocks: [
          { type: "p", text: "Findings are **New**, **Reviewing**, **Accepted**, **Dismissed** or **No longer detected**. Dismissals stick when the rules run again. A finding shows **Realized** once someone confirms a saving for it." },
        ],
      },
      {
        heading: "Potential vs realized",
        blocks: [
          { type: "p", text: "Potential savings are estimates and are never counted as realized. **Record a realized saving** when the expense has actually gone down: the amount, whether it's one-time, monthly or yearly, and evidence. Its first-year value is one-time as entered, monthly × 12, or yearly as entered." },
          { type: "p", text: "Potential totals count each subscription once (its largest estimate), so overlapping findings aren't added twice." },
        ],
      },
    ],
  },
  {
    slug: "deals",
    title: "Find software deals",
    nav: "Deals for your stack",
    description: "Listings from the Saver Option Deals marketplace that match the tools you already use, and a search across the catalog.",
    group: "Use Saver Option Business",
    sections: [
      {
        heading: "Deals for your stack",
        blocks: [
          { type: "p", text: "[Deals for your stack](/business/deals) shows live marketplace listings for the exact products your workspace records, then listings for other products in the same categories (possible alternatives), and a search across the whole catalog." },
          { type: "p", text: "When no listing matches a tool, the page says so — nothing is invented. Discount text, prices and expiry dates appear only when the listing states them, with its verification status." },
        ],
      },
      {
        heading: "Before you rely on a deal",
        blocks: [
          { type: "list", items: ["Open the deal page for the full terms and eligibility.", "Nothing is bought or switched automatically.", "Outbound clicks to providers are counted, as described in the [disclosure](/disclosure) and [privacy policy](/privacy)."] },
        ],
      },
    ],
  },
  {
    slug: "savings-reports",
    title: "Generate savings reports",
    nav: "Savings reports",
    description: "Save a dated snapshot of spend, potential and realized savings, and upcoming renewals, with the method behind each figure.",
    group: "Use Saver Option Business",
    sections: [
      {
        heading: "Creating a report",
        blocks: [
          { type: "p", text: "On [Reports](/business/reports), choose **Generate savings report** (owners, admins and finance). An AI client connected over MCP can generate one with the `generate_savings_report` tool." },
          {
            type: "list",
            items: [
              "Spend run-rate per currency.",
              "Potential savings by type, the top opportunities with their evidence, and how many still need checking.",
              "Confirmed (realized) savings.",
              "Renewals in the next 90 days at current prices.",
              "Data-quality notes (missing prices or dates, imports not yet reviewed, several currencies) and the method.",
            ],
          },
        ],
      },
      {
        heading: "Saved reports",
        blocks: [
          { type: "p", text: "Each report is saved as a snapshot: it doesn't change when records do. Open saved reports from the Reports page and use **Print or save as PDF** in your browser." },
          { type: "note", text: "A built-in PDF export is not available yet; printing to PDF from the browser works." },
        ],
      },
    ],
  },
  {
    slug: "assistant",
    title: "AI Savings Assistant",
    nav: "AI Savings Assistant",
    description: "An in-app assistant that answers questions about your workspace's spending using the same tools as MCP.",
    group: "AI and MCP",
    requiresConfiguration: true,
    sections: [
      {
        heading: "What it does",
        blocks: [
          { type: "p", text: "Ask questions such as “Which subscriptions renew next month?” or “Where should we start to reduce our software budget?”. The assistant answers using the same read tools as the [MCP server](/business/docs/mcp), shows the numbers and their basis (actual, estimate or projection), and links to the records it used." },
          { type: "p", text: "It can prepare a new or changed subscription record, but only as a preview: the details and any warnings appear under its answer with **Confirm and save** and **Discard** buttons. Nothing is saved until you press Confirm, even if the model asks to save. Saved records are marked “Added with the AI assistant” and appear in the audit log. It can't cancel, renew or buy anything." },
          { type: "list", items: ["It works with your role: read-only members get answers but no change previews.", "Up to 40 questions per person per hour.", "AI can make mistakes — check figures against the linked records."] },
        ],
      },
      {
        heading: "Privacy",
        blocks: [
          { type: "p", text: "Answers are generated with Anthropic's Claude API (model Claude Opus 5.5). Your question and the results of the tools it calls are sent to Anthropic for each answer — only what the question needs, never the whole workspace." },
          { type: "p", text: "The conversation is kept in your browser tab only. It isn't stored on Saver Option's servers, and it's gone when you start a new conversation or close the tab." },
        ],
      },
      {
        heading: "Requires configuration",
        blocks: [
          { type: "note", tone: "warn", text: "The assistant needs the site operator to set the server-only `ANTHROPIC_API_KEY` environment variable. Until then, the assistant page says it isn't configured and sends nothing to an AI model." },
        ],
      },
    ],
  },
  {
    slug: "billing",
    title: "Plans, free trial and billing",
    nav: "Plans & billing",
    description: "The 7-day free trial, Pro and Business plans, paying through Creem, cancelling, and what happens when a plan ends.",
    group: "Use Saver Option Business",
    sections: [
      {
        heading: "The free trial",
        blocks: [
          {
            type: "list",
            items: [
              "A new workspace starts with a **7-day free trial** with everything included. No card is needed.",
              "There's one free trial per account. Signing out, using another device or creating another workspace doesn't start a new one.",
              "The time left and the exact end are shown at the top of every page and in [Settings → Plan & billing](/business/settings/billing).",
              "The demo workspace (Northwind Studio) is sample data and isn't billed.",
            ],
          },
        ],
      },
      {
        heading: "Plans",
        blocks: [
          { type: "p", text: "**Pro** includes every Saver Option Business feature. **Business** includes everything in Pro with more members (people who sign in; open invitations count). The prices and member limits shown in Plan & billing are the ones that apply. **Self-Hosted** and **White-Label** are arranged directly — use the Contact us button." },
        ],
      },
      {
        heading: "Subscribing",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Owners and admins open [Settings → Plan & billing](/business/settings/billing), pick monthly or yearly, and choose a plan.",
              "The confirmation page shows the plan, interval, price (read from Creem), trial terms, when the first charge happens and that a payment method is needed.",
              "Continue to Creem's checkout to pay. Saver Option never sees card details.",
              "The plan becomes active once Creem confirms the payment — usually within seconds. Closing the checkout charges nothing.",
            ],
          },
          { type: "note", text: "Subscribing during the free trial starts the paid plan straight away; the remaining trial days aren't added on." },
        ],
      },
      {
        heading: "Managing and cancelling",
        blocks: [
          {
            type: "list",
            items: [
              "**Manage billing** opens Creem's customer portal for the payment method and invoices.",
              "**Cancel subscription** ends the plan at the close of the paid period. You keep access until then and nothing more is charged.",
              "Changing plan or interval isn't available in the app yet: cancel and subscribe again after the period ends, or contact us.",
            ],
          },
        ],
      },
      {
        heading: "When a trial or plan ends",
        blocks: [
          { type: "p", text: "Software records, the dashboard, reports, the assistant and AI client (MCP) tools pause until a plan is active. Nothing is deleted. Settings, members, Plan & billing, security, the workspace JSON export and the subscriptions CSV stay available." },
          { type: "p", text: "If a payment fails, a banner asks you to update the payment method; access continues until the end of the period already paid for." },
        ],
      },
    ],
  },
  {
    slug: "troubleshooting",
    title: "Troubleshooting",
    description: "Fixes for common problems with sign-in, AI client connections, CSV imports and totals.",
    group: "Help",
    sections: [
      {
        heading: "“Couldn't reach the MCP server”",
        blocks: [
          { type: "list", items: ["Use the exact URL from [Settings → AI clients](/business/settings/mcp). It ends in `/mcp` and starts with `https://`.", "Check that the AI client supports remote MCP servers with OAuth sign-in. See the [compatibility table](/business/docs/mcp)."] },
        ],
      },
      {
        heading: "Sign-in keeps returning to the login page",
        blocks: [{ type: "p", text: "Google sign-in must be switched on for the site. If the button is disabled or sign-in fails, the operator needs to enable the Google provider. Signing in to connect an AI client uses the same Google sign-in." }],
      },
      {
        heading: "“This connection is read-only”",
        blocks: [{ type: "p", text: "The connection was approved with **Read only**. Disconnect it in [Settings → AI clients](/business/settings/mcp) and connect again choosing **Read and change**. Changes also need the Owner, Admin or Finance role (members: records they own)." }],
      },
      {
        heading: "An AI client stopped working",
        blocks: [{ type: "p", text: "The connection may have been disconnected, your membership or role changed, or the sign-in expired. Connect again from the AI client." }],
      },
      {
        heading: "“Your role doesn't allow this change”",
        blocks: [{ type: "p", text: "Ask an owner or admin to change your role on [Team](/business/team), or to make the change." }],
      },
      {
        heading: "CSV import errors",
        blocks: [
          {
            type: "list",
            items: [
              "Dates rejected: set the file's date format (YYYY-MM-DD, DD/MM/YYYY or MM/DD/YYYY).",
              "Amounts flagged: set the decimal separator (dot or comma).",
              "Rows skipped as duplicates: a subscription with the same software, plan, interval and currency already exists. Edit it instead.",
              "Department or owner left blank: add them in the app first, then edit the record.",
              "File refused: it must be a text CSV under 1 MB and 2,000 rows.",
            ],
          },
        ],
      },
      {
        heading: "A subscription is missing from the totals",
        blocks: [{ type: "p", text: "Totals include only active subscriptions with a price. Trials, paused, cancelled, expired, archived and unpriced subscriptions are left out — the dashboard says how many have no price." }],
      },
      {
        heading: "Totals in several currencies",
        blocks: [
          {
            type: "p",
            text: "Each subscription keeps the currency it's billed in. Across the app — totals, charts, tables, reports and savings — amounts are shown in the workspace's default currency (Settings → Workspace): other currencies are converted at the European Central Bank's daily euro reference rate, with the billed amount underneath (\"billed €99.00/mo\") and the rate and its date noted on the page. A subscription's billing details, cost history and payments, the subscription and workspace exports, and MCP tool results keep each record's own currency. If the rates can't be fetched, or a currency has no ECB rate, those amounts stay in their own currency.",
          },
        ],
      },
    ],
  },
  {
    slug: "faq",
    title: "FAQ",
    description: "Short answers about data, AI, integrations and what Saver Option Business doesn't do yet.",
    group: "Help",
    sections: [
      {
        heading: "Does it connect to our bank, cards or accounting software?",
        blocks: [{ type: "p", text: "No. You record subscriptions yourself or import a CSV. Accounting, expense, card and bank integrations are **not available yet**." }],
      },
      {
        heading: "Does it measure how much each tool is used?",
        blocks: [{ type: "p", text: "No. Seats in use are what your team assigns or reports. Usage integrations (SSO or vendor APIs) are not available yet, so nothing is called unused without seat data." }],
      },
      {
        heading: "Can it cancel subscriptions for us?",
        blocks: [{ type: "p", text: "No. Saver Option records decisions; cancelling, renewing and buying happen in the vendor's own account." }],
      },
      {
        heading: "Which AI clients work?",
        blocks: [{ type: "p", text: "The MCP server targets Claude, ChatGPT, Gemini and Grok. Claude has been tested (sign-in and the read tools); the others haven't been verified end to end yet. The [compatibility table](/business/docs/mcp) shows the current status." }],
      },
      {
        heading: "What does it cost?",
        blocks: [{ type: "p", text: "Every new workspace starts with a 7-day free trial with everything included — no card needed. After that a paid plan (Pro or Business) is needed; there's no free plan. See [Plans & billing](/business/docs/billing)." }],
      },
      {
        heading: "Can we export or delete our data?",
        blocks: [{ type: "p", text: "Yes. Subscriptions and reports export to CSV, the whole workspace exports to JSON, and the owner can delete the workspace and everything in it from [Settings](/business/settings)." }],
      },
    ],
  },
];

/** The MCP security guide, served at /business/docs/mcp/security. */
export const mcpSecurity: DocPage = {
  slug: "mcp/security",
  title: "MCP security and permissions",
  nav: "MCP security",
  description: "How AI client connections are authorized, what they can and can't do, and how to disconnect them.",
  group: "AI and MCP",
  sections: [
    {
      heading: "One person, one workspace, one access level",
      blocks: [
        { type: "p", text: "A connection is created when you approve it on Saver Option's consent screen. You choose one workspace and either **Read only** or **Read and change**. The AI client can never reach another workspace." },
        { type: "p", text: "Your current role applies to every request. If your role is lowered or you leave the workspace, the connection's next request is refused." },
      ],
    },
    {
      heading: "What an AI client can do",
      blocks: [
        {
          type: "list",
          items: [
            "Read subscriptions, spending, renewals, savings opportunities and Saver Option deals.",
            "With **Read and change**: add and update subscription records. Each change is first returned as a preview; it's saved only when the client calls again with `confirm: true` after you agree.",
            "Generate and save a savings report (roles with export access).",
          ],
        },
      ],
    },
    {
      heading: "What it can't do",
      blocks: [
        {
          type: "list",
          items: [
            "Cancel, renew or buy subscriptions, make payments, or change anything at a vendor.",
            "Delete records, manage members or change workspace settings.",
            "Run arbitrary queries or code. Every tool has a fixed input schema that the server validates.",
            "Access your Google account.",
          ],
        },
      ],
    },
    {
      heading: "Tokens",
      blocks: [
        {
          type: "list",
          items: [
            "Sign-in uses OAuth 2.1 with PKCE (S256). Access tokens last one hour; refresh tokens last 30 days and change on every use.",
            "Tokens are stored only as SHA-256 hashes. They're never put in URLs or shown to the model.",
            "Reusing an old refresh token or authorization code revokes the whole connection.",
            "Each connection is limited to 120 requests a minute.",
          ],
        },
      ],
    },
    {
      heading: "Disconnecting",
      blocks: [
        { type: "p", text: "[Settings → AI clients (MCP)](/business/settings/mcp) lists your connections — owners and admins see everyone's. **Disconnect** ends a connection immediately. Connecting and disconnecting are recorded in the audit log, as are records the AI client adds or changes." },
      ],
    },
    {
      heading: "Data sent to the AI client",
      blocks: [{ type: "p", text: "The client receives only what each tool returns, not the whole workspace. Once it has the data, it's processed by that client under its own terms. Payment-method labels aren't returned by any tool." }],
    },
  ],
};

export const guideBySlug = new Map(guides.map((g) => [g.slug, g]));
