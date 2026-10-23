import { addDays, addMonths, todayIn } from "@/lib/business/calc";
import type { BillingInterval, PricingModel, SoftwareCategory, SoftwareStatus, SubscriptionStatus } from "@/lib/business/constants";
import { db } from "@/lib/server/db";
import { BizError, displayName, type BizContext, type Db } from "@/lib/server/business/context";
import { matchCatalogProduct } from "@/lib/server/business/catalog-match";
import { createWorkspace } from "@/lib/server/business/workspace";
import type { SessionUser } from "@/lib/server/supabase";

/**
 * The demo workspace: a fictional company ("Northwind Studio") with sample
 * subscriptions, seats, renewals and payments, for trying the product. It is
 * its own workspace flagged is_demo — created only when someone asks for it,
 * labelled on every page, never mixed into a real workspace — and can be reset.
 * Prices are sample figures, not vendor quotes.
 */

export const DEMO_NAME = "Northwind Studio (demo)";
const DOMAIN = "northwind-studio.example";

const departments = ["Engineering", "Design", "Marketing", "Sales", "Operations"] as const;
type Dept = (typeof departments)[number];

const people: { name: string; dept: Dept; title: string }[] = [
  { name: "Maya Chen", dept: "Engineering", title: "Head of Engineering" },
  { name: "Daniel Okafor", dept: "Engineering", title: "Platform Engineer" },
  { name: "Priya Raman", dept: "Engineering", title: "Software Engineer" },
  { name: "Lucas Moreau", dept: "Engineering", title: "Software Engineer" },
  { name: "Sofia Alvarez", dept: "Design", title: "Design Lead" },
  { name: "Tom Becker", dept: "Design", title: "Product Designer" },
  { name: "Aisha Khan", dept: "Marketing", title: "Marketing Manager" },
  { name: "Jonah Price", dept: "Marketing", title: "Growth Marketer" },
  { name: "Elena Rossi", dept: "Sales", title: "Sales Lead" },
  { name: "Marcus Lee", dept: "Sales", title: "Account Executive" },
  { name: "Hannah Novak", dept: "Operations", title: "Operations Manager" },
  { name: "Ravi Patel", dept: "Operations", title: "Finance Manager" },
];

interface DemoSub {
  plan: string;
  price: number; // major units
  currency?: string;
  interval: BillingInterval;
  model: PricingModel;
  seats?: number;
  /** How many people (from the start of `seatHolders`) get named seats. */
  named?: number;
  reported?: number;
  startMonthsAgo: number;
  renewInDays?: number;
  cancelDeadlineInDays?: number;
  status?: SubscriptionStatus;
  endedMonthsAgo?: number;
  annualOption?: number;
  payments?: number[]; // monthly payments, most recent last
  priceChange?: { monthsAgo: number; fromPrice: number; fromSeats?: number };
  renewedMonthsAgo?: number;
  autoRenew?: boolean;
  payment?: string;
}

interface DemoSoftware {
  name: string;
  vendor: string;
  website: string;
  category: SoftwareCategory;
  owner: string;
  dept: Dept;
  purpose: string;
  status?: SoftwareStatus;
  seatHolders?: Dept[] | "all";
  sub?: DemoSub;
}

const software: DemoSoftware[] = [
  {
    name: "Slack", vendor: "Salesforce", website: "https://slack.com", category: "communication", owner: "Hannah Novak", dept: "Operations",
    purpose: "Company-wide chat and announcements.", seatHolders: "all",
    sub: { plan: "Pro", price: 122.5, interval: "monthly", model: "per_seat", seats: 14, named: 11, startMonthsAgo: 18, renewInDays: 9, payments: [122.5, 122.5, 122.5], priceChange: { monthsAgo: 2, fromPrice: 105, fromSeats: 12 }, payment: "Company Visa ••4242" },
  },
  {
    name: "Microsoft Teams", vendor: "Microsoft", website: "https://www.microsoft.com/microsoft-teams", category: "communication", owner: "Elena Rossi", dept: "Sales",
    purpose: "Calls with enterprise customers who require Teams.",
    sub: { plan: "Teams Essentials", price: 480, interval: "yearly", model: "per_seat", seats: 10, reported: 4, startMonthsAgo: 7, renewInDays: 152, payment: "Company Visa ••4242" },
  },
  {
    name: "Zoom", vendor: "Zoom", website: "https://zoom.us", category: "video_meetings", owner: "Hannah Novak", dept: "Operations",
    purpose: "Customer calls and webinars.", seatHolders: ["Sales", "Operations"],
    sub: { plan: "Pro", price: 66.5, interval: "monthly", model: "per_seat", seats: 5, named: 4, startMonthsAgo: 14, renewInDays: 17, payments: [66.5, 66.5, 66.5] },
  },
  {
    name: "Google Workspace", vendor: "Google", website: "https://workspace.google.com", category: "productivity", owner: "Hannah Novak", dept: "Operations",
    purpose: "Email, calendar and documents.", seatHolders: "all",
    sub: { plan: "Business Standard", price: 168, interval: "monthly", model: "per_seat", seats: 12, named: 12, startMonthsAgo: 26, renewInDays: 3, payments: [168, 168, 168], payment: "Company Amex ••1005" },
  },
  {
    name: "Figma", vendor: "Figma", website: "https://www.figma.com", category: "design", owner: "Sofia Alvarez", dept: "Design",
    purpose: "Product design and prototyping.", seatHolders: ["Design", "Engineering"],
    sub: { plan: "Professional", price: 1080, interval: "yearly", model: "per_seat", seats: 6, named: 4, startMonthsAgo: 16, renewInDays: 245, renewedMonthsAgo: 4 },
  },
  {
    name: "Adobe Creative Cloud", vendor: "Adobe", website: "https://www.adobe.com/creativecloud.html", category: "design", owner: "Sofia Alvarez", dept: "Design",
    purpose: "Brand and marketing assets.", seatHolders: ["Design"],
    sub: { plan: "Teams, All Apps", price: 1438.8, interval: "yearly", model: "per_seat", seats: 2, named: 2, startMonthsAgo: 23, renewInDays: 21, cancelDeadlineInDays: 14 },
  },
  {
    name: "Notion", vendor: "Notion Labs", website: "https://www.notion.com", category: "documentation", owner: "Maya Chen", dept: "Engineering",
    purpose: "Internal wiki and project notes.",
    sub: { plan: "Plus", price: 180, interval: "monthly", model: "per_seat", seats: 15, reported: 9, startMonthsAgo: 11, renewInDays: 26, payments: [180, 180, 180] },
  },
  {
    name: "Confluence", vendor: "Atlassian", website: "https://www.atlassian.com/software/confluence", category: "documentation", owner: "Maya Chen", dept: "Engineering",
    purpose: "Legacy engineering docs, being migrated to Notion.", status: "deprecated",
    sub: { plan: "Standard", price: 1200, interval: "yearly", model: "flat", startMonthsAgo: 30, renewInDays: 74 },
  },
  {
    name: "GitHub", vendor: "GitHub", website: "https://github.com", category: "development", owner: "Maya Chen", dept: "Engineering",
    purpose: "Source code, reviews and CI.", seatHolders: ["Engineering"],
    sub: { plan: "Team", price: 24, interval: "monthly", model: "per_seat", seats: 6, named: 4, startMonthsAgo: 20, renewInDays: 12, payments: [24, 24, 24] },
  },
  {
    name: "Amazon Web Services", vendor: "Amazon", website: "https://aws.amazon.com", category: "cloud_hosting", owner: "Daniel Okafor", dept: "Engineering",
    purpose: "Production hosting. Usage-based: the price is the current monthly average.",
    sub: { plan: "Usage-based", price: 1850, interval: "monthly", model: "flat", startMonthsAgo: 28, renewInDays: 8, payments: [1720, 1790, 1850], payment: "Company Amex ••1005" },
  },
  {
    name: "HubSpot", vendor: "HubSpot", website: "https://www.hubspot.com", category: "crm_sales", owner: "Elena Rossi", dept: "Sales",
    purpose: "CRM and sales pipeline.",
    sub: { plan: "Sales Hub Starter", price: 1800, interval: "yearly", model: "flat", startMonthsAgo: 12, renewInDays: 12, cancelDeadlineInDays: 5 },
  },
  {
    name: "Mailchimp", vendor: "Intuit", website: "https://mailchimp.com", category: "marketing", owner: "Aisha Khan", dept: "Marketing",
    purpose: "Newsletter and lifecycle email.",
    sub: { plan: "Standard", price: 350, interval: "monthly", model: "flat", startMonthsAgo: 8, renewInDays: 19, annualOption: 3780, payments: [350, 350, 350] },
  },
  {
    name: "1Password", vendor: "1Password", website: "https://1password.com", category: "security", owner: "Hannah Novak", dept: "Operations",
    purpose: "Shared vaults and password management.", seatHolders: "all",
    sub: { plan: "Business", price: 1150.56, interval: "yearly", model: "per_seat", seats: 12, named: 12, startMonthsAgo: 9, renewInDays: 92 },
  },
  {
    name: "Linear", vendor: "Linear", website: "https://linear.app", category: "project_management", owner: "Maya Chen", dept: "Engineering",
    purpose: "Engineering issue tracking.", seatHolders: ["Engineering", "Design"],
    sub: { plan: "Basic", price: 64, interval: "monthly", model: "per_seat", seats: 8, named: 6, startMonthsAgo: 10, renewInDays: 6, payments: [64, 64, 64] },
  },
  {
    name: "Asana", vendor: "Asana", website: "https://asana.com", category: "project_management", owner: "Aisha Khan", dept: "Marketing",
    purpose: "Marketing campaign planning.",
    sub: { plan: "Starter", price: 330, interval: "quarterly", model: "per_seat", seats: 10, reported: 3, startMonthsAgo: 5, renewInDays: 33 },
  },
  {
    name: "Hotjar", vendor: "Contentsquare", website: "https://www.hotjar.com", category: "analytics", owner: "Jonah Price", dept: "Marketing",
    purpose: "Website heatmaps and surveys (billed in euros).",
    sub: { plan: "Business", price: 99, currency: "EUR", interval: "monthly", model: "flat", startMonthsAgo: 6, renewInDays: 15, payments: [99, 99, 99] },
  },
  {
    name: "Intercom", vendor: "Intercom", website: "https://www.intercom.com", category: "customer_support", owner: "Elena Rossi", dept: "Sales",
    purpose: "Trialling live chat for the website.",
    sub: { plan: "Essential (trial)", price: 74, interval: "monthly", model: "flat", startMonthsAgo: 0, renewInDays: 9, status: "trial" },
  },
  {
    name: "Dropbox", vendor: "Dropbox", website: "https://www.dropbox.com", category: "storage", owner: "Hannah Novak", dept: "Operations",
    purpose: "Replaced by Google Drive.", status: "deprecated",
    sub: { plan: "Standard", price: 900, interval: "yearly", model: "flat", startMonthsAgo: 25, status: "cancelled", endedMonthsAgo: 2 },
  },
  {
    name: "Miro", vendor: "Miro", website: "https://miro.com", category: "design", owner: "Sofia Alvarez", dept: "Design",
    purpose: "Being evaluated for workshops. No paid plan yet.", status: "evaluating",
  },
];

/** Creates the demo workspace for a user (one per user). */
export async function createDemoWorkspace(user: SessionUser): Promise<string> {
  const [have] = await db()`
    select w.id from biz_workspaces w join biz_memberships m on m.workspace_id = w.id
    where m.user_id = ${user.id} and w.is_demo limit 1`;
  if (have) return have.id;
  const id = await createWorkspace(user, { name: DEMO_NAME, industry: "Design agency", companySize: "11-50", website: null, defaultCurrency: "USD", timeZone: "UTC", isDemo: true });
  await db().begin(async (sql) => {
    await sql`update biz_workspaces set onboarding_completed_at = now() where id = ${id}`;
    await seed(sql, id, user);
  });
  return id;
}

/** Clears the demo workspace back to its sample data. Only demo workspaces can be reset. */
export async function resetDemoWorkspace(ctx: BizContext): Promise<void> {
  if (!ctx.workspace.isDemo) throw new BizError("forbidden", "Only the demo workspace can be reset.");
  if (ctx.role !== "owner" && ctx.role !== "admin") throw new BizError("forbidden", "Only the demo's owner can reset it.");
  const ws = ctx.workspace.id;
  await db().begin(async (sql) => {
    for (const table of [
      "biz_realized_savings", "biz_savings_opportunities", "biz_notifications", "biz_reminders", "biz_renewal_events", "biz_payments",
      "biz_seat_assignments", "biz_cost_history", "biz_subscriptions", "biz_software", "biz_vendors", "biz_invitations", "biz_activity",
    ]) {
      await sql`delete from ${sql(table)} where workspace_id = ${ws}`;
    }
    await sql`delete from biz_people where workspace_id = ${ws} and id not in (select person_id from biz_memberships where workspace_id = ${ws} and person_id is not null)`;
    await sql`update biz_people set department_id = null where workspace_id = ${ws}`;
    await sql`delete from biz_departments where workspace_id = ${ws}`;
    await sql`update biz_workspaces set reminder_days = '{30,14,7}', notify_in_app = true, default_currency = 'USD', time_zone = 'UTC' where id = ${ws}`;
    await seed(sql, ws, ctx.user);
  });
}

async function seed(sql: Db, ws: string, user: SessionUser): Promise<void> {
  const today = todayIn("UTC");
  const monthsAgo = (n: number) => addMonths(today, -n);
  const dept = new Map<Dept, string>();
  for (const d of departments) {
    const [row] = await sql`insert into biz_departments (workspace_id, name) values (${ws}, ${d}) returning id`;
    dept.set(d, row.id);
  }
  const person = new Map<string, { id: string; dept: Dept }>();
  for (const p of people) {
    const email = `${p.name.toLowerCase().replace(/[^a-z]+/g, ".")}@${DOMAIN}`;
    const [row] = await sql`insert into biz_people (workspace_id, name, email, title, department_id) values (${ws}, ${p.name}, ${email}, ${p.title}, ${dept.get(p.dept)!}) returning id`;
    person.set(p.name, { id: row.id, dept: p.dept });
  }
  await sql`update biz_people set department_id = ${dept.get("Operations")!} where workspace_id = ${ws} and user_id = ${user.id}`;

  for (const sw of software) {
    const [vendor] = await sql`
      insert into biz_vendors (workspace_id, name, website) values (${ws}, ${sw.vendor}, null)
      on conflict (workspace_id, lower(name)) do update set updated_at = now() returning id`;
    const [s] = await sql`
      insert into biz_software (workspace_id, vendor_id, name, category, business_purpose, website, owner_person_id, department_id, status, catalog_product_id, created_by)
      values (${ws}, ${vendor.id}, ${sw.name}, ${sw.category}, ${sw.purpose}, ${sw.website}, ${person.get(sw.owner)!.id}, ${dept.get(sw.dept)!},
        ${sw.status ?? "active"}, ${matchCatalogProduct(sw.name, sw.website)?.id ?? null}, ${user.id})
      returning id`;
    const d = sw.sub;
    if (!d) continue;
    const currency = d.currency ?? "USD";
    const minor = (major: number) => Math.round(major * 100);
    const start = monthsAgo(d.startMonthsAgo);
    const status = d.status ?? "active";
    const endedOn = d.endedMonthsAgo !== undefined ? monthsAgo(d.endedMonthsAgo) : null;
    const renewal = d.renewInDays !== undefined ? addDays(today, d.renewInDays) : null;
    const [sub] = await sql`
      insert into biz_subscriptions (workspace_id, software_id, plan_name, price_minor, currency, pricing_model, billing_interval, start_date,
        next_renewal_date, auto_renew, cancellation_deadline, status, ended_on, purchased_seats, reported_assigned_seats, payment_method,
        annual_price_option_minor, created_by, created_at)
      values (${ws}, ${s.id}, ${d.plan}, ${minor(d.price)}, ${currency}, ${d.model}, ${d.interval}, ${start}, ${status === "cancelled" ? null : renewal},
        ${status === "cancelled" ? false : (d.autoRenew ?? true)}, ${d.cancelDeadlineInDays !== undefined ? addDays(today, d.cancelDeadlineInDays) : null},
        ${status}, ${endedOn}, ${d.seats ?? null}, ${d.reported ?? null}, ${d.payment ?? null},
        ${d.annualOption !== undefined ? minor(d.annualOption) : null}, ${user.id}, ${new Date(`${start}T09:00:00Z`)})
      returning id`;
    const history = d.priceChange
      ? [
          { price: d.priceChange.fromPrice, seats: d.priceChange.fromSeats ?? d.seats ?? null, from: start, reason: "Subscription added" },
          { price: d.price, seats: d.seats ?? null, from: monthsAgo(d.priceChange.monthsAgo), reason: "Added seats" },
        ]
      : [{ price: d.price, seats: d.seats ?? null, from: start, reason: "Subscription added" }];
    for (const h of history) {
      await sql`
        insert into biz_cost_history (workspace_id, subscription_id, price_minor, currency, pricing_model, billing_interval, purchased_seats, effective_from, reason, recorded_by)
        values (${ws}, ${sub.id}, ${minor(h.price)}, ${currency}, ${d.model}, ${d.interval}, ${h.seats}, ${h.from}, ${h.reason}, ${user.id})`;
    }
    // Named seats for the first people in the seat-holder departments.
    if (d.named && sw.seatHolders) {
      const holders = people.filter((p) => sw.seatHolders === "all" || sw.seatHolders!.includes(p.dept)).slice(0, d.named);
      for (const h of holders) {
        await sql`insert into biz_seat_assignments (workspace_id, subscription_id, person_id, assigned_by, assigned_at)
          values (${ws}, ${sub.id}, ${person.get(h.name)!.id}, ${user.id}, ${new Date(`${start}T10:00:00Z`)})`;
      }
    }
    // Monthly payments for the last few months (most recent last), on the renewal day.
    if (d.payments && renewal) {
      for (let i = 0; i < d.payments.length; i++) {
        const paidOn = addMonths(renewal, -(d.payments.length - i));
        if (paidOn > today) continue;
        await sql`insert into biz_payments (workspace_id, subscription_id, amount_minor, currency, paid_on, source, notes, created_by)
          values (${ws}, ${sub.id}, ${minor(d.payments[i])}, ${currency}, ${paidOn}, 'renewal', 'Sample payment', ${user.id})`;
      }
    }
    if (d.renewedMonthsAgo !== undefined && renewal) {
      const renewedOn = monthsAgo(d.renewedMonthsAgo);
      const [pay] = await sql`insert into biz_payments (workspace_id, subscription_id, amount_minor, currency, paid_on, source, notes, created_by)
        values (${ws}, ${sub.id}, ${minor(d.price)}, ${currency}, ${renewedOn}, 'renewal', 'Sample payment', ${user.id}) returning id`;
      await sql`insert into biz_renewal_events (workspace_id, subscription_id, renewal_date, outcome, amount_minor, currency, new_renewal_date, payment_id, notes, decided_by)
        values (${ws}, ${sub.id}, ${renewedOn}, 'renewed', ${minor(d.price)}, ${currency}, ${renewal}, ${pay.id}, 'Renewed for another year', ${user.id})`;
    }
    if (endedOn) {
      await sql`insert into biz_renewal_events (workspace_id, subscription_id, renewal_date, outcome, amount_minor, currency, notes, decided_by)
        values (${ws}, ${sub.id}, ${endedOn}, 'cancelled', ${minor(d.price)}, ${currency}, 'Moved files to Google Drive', ${user.id})`;
    }
  }
  await sql`
    insert into biz_activity (workspace_id, actor_id, actor_name, action, entity_type, entity_id, summary)
    values (${ws}, ${user.id}, ${displayName(user)}, 'demo.seeded', 'workspace', ${ws}, 'Loaded the fictional Northwind Studio sample data')`;
}
