/**
 * DEMO CONTENT — every provider and product below is fictional.
 * URLs use the reserved `.example` TLD so nothing points at a real business.
 */
import type { Product, Provider } from "@/lib/types";

export const providers: Provider[] = [
  { id: "lumen-labs", name: "Lumen Labs", website: "https://lumenly.example", about: "Makers of privacy-friendly product analytics." },
  { id: "inkframe", name: "Inkframe Inc.", website: "https://inkframe.example", about: "Collaborative interface design tools." },
  { id: "quill", name: "Quill Software", website: "https://quillpad.example" },
  { id: "relay", name: "Relaywire", website: "https://relaywire.example", about: "Email delivery infrastructure for developers." },
  { id: "cobalt", name: "Cobalt Systems", website: "https://cobalt.example", about: "Cloud compute and developer workflow tools." },
  { id: "vectorly", name: "Vectorly", website: "https://vectorly.example" },
  { id: "formlet", name: "Formlet", website: "https://formlet.example" },
  { id: "ledgerly", name: "Ledgerly Ltd.", website: "https://ledgerly.example" },
  { id: "mosaic", name: "Mosaic Docs", website: "https://mosaicdocs.example" },
  { id: "openboard", name: "Openboard Project", website: "https://openboard.example", about: "A community-maintained open-source project." },
  { id: "siftbase", name: "Siftbase", website: "https://siftbase.example" },
  { id: "clipwise", name: "Clipwise", website: "https://clipwise.example" },
  { id: "taskrail", name: "Taskrail", website: "https://taskrail.example" },
  { id: "glyphic", name: "Glyphic Studio", website: "https://glyphic.example" },
  { id: "beacon", name: "Beacon Status", website: "https://beaconstatus.example" },
  { id: "murmur", name: "Murmur Audio", website: "https://murmur.example" },
  { id: "keystone", name: "Keystone Security", website: "https://keystone.example" },
  { id: "driftwood", name: "Driftwood", website: "https://driftwood.example" },
  { id: "pixelmint", name: "Pixelmint", website: "https://pixelmint.example" },
  { id: "dealhub", name: "Bundlery (marketplace)", website: "https://bundlery.example", about: "A third-party software marketplace." },
];

export const products: Product[] = [
  {
    id: "lumenly", slug: "lumenly", name: "Lumenly", providerId: "lumen-labs",
    tagline: "Cookie-free product analytics",
    description: "Lumenly tracks product usage, funnels and retention without cookies, with EU data hosting and a lightweight script.",
    website: "https://lumenly.example", tags: ["Analytics", "Product", "Privacy"], brandColor: "#f59e0b",
  },
  {
    id: "inkframe", slug: "inkframe", name: "Inkframe", providerId: "inkframe",
    tagline: "Interface design, together",
    description: "Inkframe is a browser-based design tool for interfaces, prototypes and design systems with real-time collaboration.",
    website: "https://inkframe.example", tags: ["Design", "Prototyping", "Collaboration"], brandColor: "#8b5cf6",
  },
  {
    id: "quillpad", slug: "quillpad", name: "Quillpad", providerId: "quill",
    tagline: "AI writing assistant for long-form work",
    description: "Quillpad helps draft, edit and restructure long documents, with style guides and source citations.",
    website: "https://quillpad.example", tags: ["AI", "Writing", "Productivity"], brandColor: "#0ea5e9",
  },
  {
    id: "relaywire", slug: "relaywire", name: "Relaywire", providerId: "relay",
    tagline: "Transactional email API",
    description: "Relaywire sends transactional and product email through a simple API, with templates, webhooks and deliverability analytics.",
    website: "https://relaywire.example", tags: ["Email", "API", "Developer tools"], brandColor: "#ef4444",
  },
  {
    id: "cobalt-cloud", slug: "cobalt-cloud", name: "Cobalt Cloud", providerId: "cobalt",
    tagline: "Simple cloud compute and managed databases",
    description: "Cobalt Cloud offers virtual machines, managed Postgres and object storage with predictable monthly pricing.",
    website: "https://cobalt.example/cloud", tags: ["Cloud", "Hosting", "Databases", "Infrastructure"], brandColor: "#2563eb",
  },
  {
    id: "patchwork-ci", slug: "patchwork-ci", name: "Patchwork CI", providerId: "cobalt",
    tagline: "Fast CI/CD pipelines",
    description: "Patchwork CI runs build, test and deploy pipelines with caching and parallelism, configured in a single YAML file.",
    website: "https://cobalt.example/ci", tags: ["CI/CD", "Developer tools", "DevOps"], brandColor: "#1e40af",
  },
  {
    id: "vectorly", slug: "vectorly", name: "Vectorly AI", providerId: "vectorly",
    tagline: "Hosted language model APIs",
    description: "Vectorly provides hosted language and embedding model APIs with usage-based pricing and SDKs for popular languages.",
    website: "https://vectorly.example", tags: ["AI", "API", "LLM", "Developer tools"], brandColor: "#10b981",
  },
  {
    id: "formlet", slug: "formlet", name: "Formlet", providerId: "formlet",
    tagline: "Forms and surveys without code",
    description: "Formlet builds forms, surveys and quizzes with conditional logic, payments and integrations.",
    website: "https://formlet.example", tags: ["Forms", "No-code", "Surveys"], brandColor: "#ec4899",
  },
  {
    id: "ledgerly", slug: "ledgerly", name: "Ledgerly", providerId: "ledgerly",
    tagline: "Invoicing and bookkeeping for freelancers",
    description: "Ledgerly handles invoices, expenses, time tracking and multi-currency payments for freelancers and small studios.",
    website: "https://ledgerly.example", tags: ["Finance", "Invoicing", "Freelance"], brandColor: "#14b8a6",
  },
  {
    id: "mosaic-docs", slug: "mosaic-docs", name: "Mosaic Docs", providerId: "mosaic",
    tagline: "Notes, docs and wikis in one place",
    description: "Mosaic Docs combines notes, documents and team wikis with databases and templates.",
    website: "https://mosaicdocs.example", tags: ["Docs", "Notes", "Knowledge base", "Productivity"], brandColor: "#334155",
  },
  {
    id: "openboard", slug: "openboard", name: "Openboard", providerId: "openboard",
    tagline: "Open-source collaborative whiteboard",
    description: "Openboard is a self-hostable, real-time whiteboard for diagrams, sketches and workshops.",
    website: "https://openboard.example", tags: ["Whiteboard", "Collaboration", "Self-hosted"], brandColor: "#f97316",
    openSource: { license: "MIT", repoUrl: "https://openboard.example/source" },
  },
  {
    id: "siftbase", slug: "siftbase", name: "Siftbase", providerId: "siftbase",
    tagline: "Open-source web analytics",
    description: "Siftbase is a self-hosted, privacy-focused web analytics platform with a single-container install.",
    website: "https://siftbase.example", tags: ["Analytics", "Self-hosted", "Privacy"], brandColor: "#6366f1",
    openSource: { license: "AGPL-3.0", repoUrl: "https://siftbase.example/source" },
  },
  {
    id: "clipwise", slug: "clipwise", name: "Clipwise", providerId: "clipwise",
    tagline: "AI video editing for creators",
    description: "Clipwise turns long recordings into short clips with automatic captions, reframing and filler-word removal.",
    website: "https://clipwise.example", tags: ["AI", "Video", "Creators"], brandColor: "#e11d48",
  },
  {
    id: "taskrail", slug: "taskrail", name: "Taskrail", providerId: "taskrail",
    tagline: "Project tracking for product teams",
    description: "Taskrail tracks issues, sprints and roadmaps with a fast keyboard-driven interface.",
    website: "https://taskrail.example", tags: ["Project management", "Productivity", "Teams"], brandColor: "#7c3aed",
  },
  {
    id: "glyphic", slug: "glyphic", name: "Glyphic Icons", providerId: "glyphic",
    tagline: "A large, consistent icon library",
    description: "Glyphic is an icon library in multiple styles with design-tool plugins and developer packages.",
    website: "https://glyphic.example", tags: ["Design", "Icons", "Assets"], brandColor: "#0891b2",
  },
  {
    id: "beacon", slug: "beacon-status", name: "Beacon Status", providerId: "beacon",
    tagline: "Status pages and uptime monitoring",
    description: "Beacon Status monitors uptime and publishes hosted status pages with incident updates and subscriber alerts.",
    website: "https://beaconstatus.example", tags: ["Monitoring", "DevOps", "Status pages"], brandColor: "#16a34a",
  },
  {
    id: "murmur", slug: "murmur", name: "Murmur", providerId: "murmur",
    tagline: "Speech-to-text API and transcription",
    description: "Murmur transcribes audio and video with speaker labels, timestamps and a developer API.",
    website: "https://murmur.example", tags: ["AI", "Transcription", "API", "Audio"], brandColor: "#a855f7",
  },
  {
    id: "keystone", slug: "keystone-vault", name: "Keystone Vault", providerId: "keystone",
    tagline: "Password manager for teams",
    description: "Keystone Vault stores and shares passwords, secrets and passkeys with role-based access and audit logs.",
    website: "https://keystone.example", tags: ["Security", "Passwords", "Teams"], brandColor: "#0f172a",
  },
  {
    id: "driftwood", slug: "driftwood-crm", name: "Driftwood CRM", providerId: "driftwood",
    tagline: "A lightweight CRM for small teams",
    description: "Driftwood CRM tracks contacts, deals and follow-ups with email sync and a simple pipeline view.",
    website: "https://driftwood.example", tags: ["CRM", "Sales", "Small business"], brandColor: "#b45309",
  },
  {
    id: "pixelmint", slug: "pixelmint", name: "Pixelmint", providerId: "pixelmint",
    tagline: "Stock photos and illustrations",
    description: "Pixelmint offers stock photography, illustrations and mockups under a single commercial license.",
    website: "https://pixelmint.example", tags: ["Design", "Stock media", "Assets"], brandColor: "#65a30d",
  },
];
