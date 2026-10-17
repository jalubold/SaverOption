/**
 * Providers and products — generated from research notes on 2026-10-17.
 * Sources are the providers' own sites. `verification.status` says whether the
 * live page was checked ("verified") or the facts came from the provider's site
 * via search extracts only ("unverified"). Supporting quotes are kept in
 * `verification.evidence`.
 * Offers change: re-check before relying on any figure.
 */
import type { Product, Provider } from "@/lib/types";

export const providers: Provider[] = [
  {
    "id": "github",
    "name": "GitHub",
    "website": "https://github.com"
  },
  {
    "id": "microsoft",
    "name": "Microsoft",
    "website": "https://www.microsoft.com"
  },
  {
    "id": "google",
    "name": "Google",
    "website": "https://cloud.google.com"
  },
  {
    "id": "notion",
    "name": "Notion Labs",
    "website": "https://www.notion.com"
  },
  {
    "id": "atlassian",
    "name": "Atlassian",
    "website": "https://www.atlassian.com"
  },
  {
    "id": "linear",
    "name": "Linear",
    "website": "https://linear.app"
  },
  {
    "id": "canva",
    "name": "Canva",
    "website": "https://www.canva.com"
  },
  {
    "id": "kaleidos",
    "name": "Kaleidos (Penpot)",
    "website": "https://penpot.app"
  },
  {
    "id": "plausible",
    "name": "Plausible Analytics",
    "website": "https://plausible.io"
  },
  {
    "id": "nextcloud",
    "name": "Nextcloud GmbH",
    "website": "https://nextcloud.com"
  },
  {
    "id": "mattermost",
    "name": "Mattermost, Inc.",
    "website": "https://mattermost.com"
  },
  {
    "id": "betterdisplay",
    "name": "BetterDisplay (waydabber)",
    "website": "https://betterdisplay.pro"
  }
];

export const products: Product[] = [
  {
    "id": "github",
    "slug": "github",
    "name": "GitHub",
    "providerId": "github",
    "tagline": "Code hosting and collaboration platform",
    "description": "GitHub is a platform for hosting Git repositories and collaborating on software, with built-in tools for code review, automation and project management.",
    "website": "https://github.com",
    "tags": [
      "Developer tools",
      "Git"
    ],
    "brandColor": "#181717"
  },
  {
    "id": "github-copilot",
    "slug": "github-copilot",
    "name": "GitHub Copilot",
    "providerId": "github",
    "tagline": "AI coding assistant from GitHub",
    "description": "GitHub Copilot is an AI assistant that suggests code, answers questions and runs agent tasks inside editors and on GitHub.",
    "website": "https://github.com/features/copilot",
    "tags": [
      "AI",
      "Developer tools",
      "Code assistant"
    ],
    "brandColor": "#8957E5"
  },
  {
    "id": "github-codespaces",
    "slug": "github-codespaces",
    "name": "GitHub Codespaces",
    "providerId": "github",
    "tagline": "Cloud development environments hosted by GitHub",
    "description": "GitHub Codespaces provides configurable cloud-hosted development environments that open directly from a repository.",
    "website": "https://github.com/features/codespaces",
    "tags": [
      "Developer tools",
      "Cloud IDE"
    ],
    "brandColor": "#181717"
  },
  {
    "id": "office-365",
    "slug": "office-365",
    "name": "Office 365",
    "providerId": "microsoft",
    "tagline": "Microsoft's cloud productivity apps suite",
    "description": "Office 365 is Microsoft's suite of productivity apps such as Word, Excel, PowerPoint, Outlook and OneNote, with cloud services for storage and collaboration.",
    "website": "https://www.microsoft.com/en-us/education/products/office",
    "tags": [
      "Productivity",
      "Office suite"
    ],
    "brandColor": "#D83B01"
  },
  {
    "id": "microsoft-azure",
    "slug": "microsoft-azure",
    "name": "Microsoft Azure",
    "providerId": "microsoft",
    "tagline": "Microsoft's cloud computing and AI platform",
    "description": "Microsoft Azure is a cloud platform offering compute, storage, databases, networking, analytics and AI services.",
    "website": "https://azure.microsoft.com",
    "tags": [
      "Cloud",
      "Developer tools"
    ],
    "brandColor": "#0078D4"
  },
  {
    "id": "google-cloud",
    "slug": "google-cloud",
    "name": "Google Cloud",
    "providerId": "google",
    "tagline": "Google's cloud computing, data and AI platform",
    "description": "Google Cloud is Google's public cloud platform, offering compute, storage, databases, analytics and AI services billed on usage.",
    "website": "https://cloud.google.com",
    "tags": [
      "Cloud",
      "Infrastructure",
      "AI"
    ],
    "brandColor": "#4285F4"
  },
  {
    "id": "notion",
    "slug": "notion",
    "name": "Notion",
    "providerId": "notion",
    "tagline": "Connected workspace for docs and projects",
    "description": "Notion is a workspace app for notes, documents, wikis and project tracking, with built-in AI features (Notion AI).",
    "website": "https://www.notion.com",
    "tags": [
      "Docs",
      "Productivity",
      "AI"
    ],
    "brandColor": "#000000"
  },
  {
    "id": "atlassian-cloud",
    "slug": "atlassian-cloud",
    "name": "Atlassian Cloud (Jira, Confluence, Loom)",
    "providerId": "atlassian",
    "tagline": "Project tracking, wiki and video tools",
    "description": "Atlassian makes team software including Jira for issue and project tracking, Confluence for documentation, and Loom for async video.",
    "website": "https://www.atlassian.com",
    "tags": [
      "Project Management",
      "Docs",
      "Collaboration"
    ],
    "brandColor": "#0052CC"
  },
  {
    "id": "linear",
    "slug": "linear",
    "name": "Linear",
    "providerId": "linear",
    "tagline": "Issue tracking for software teams",
    "description": "Linear is a project and issue tracking tool built for product and engineering teams.",
    "website": "https://linear.app",
    "tags": [
      "Project Management",
      "Developer Tools"
    ],
    "brandColor": "#5E6AD2"
  },
  {
    "id": "google-ai-pro",
    "slug": "google-ai-pro",
    "name": "Google AI Pro (Gemini)",
    "providerId": "google",
    "tagline": "Google's paid Gemini AI plan",
    "description": "Google AI Pro is Google's subscription plan that gives higher Gemini usage limits, access to more capable Gemini models and extra cloud storage.",
    "website": "https://gemini.google",
    "tags": [
      "AI",
      "Assistant",
      "Students"
    ],
    "brandColor": "#4285F4"
  },
  {
    "id": "canva",
    "slug": "canva",
    "name": "Canva",
    "providerId": "canva",
    "tagline": "Online design and visual content tool",
    "description": "Canva is a browser-based design tool for creating graphics, presentations, social posts and other visual content, with AI features.",
    "website": "https://www.canva.com",
    "tags": [
      "Design",
      "AI",
      "Marketing"
    ],
    "brandColor": "#00C4CC"
  },
  {
    "id": "penpot",
    "slug": "penpot",
    "name": "Penpot",
    "providerId": "kaleidos",
    "tagline": "Open-source design and prototyping platform",
    "description": "Penpot is a browser-based design and prototyping tool for product teams. It works with open standards such as SVG, CSS and HTML and can be used as a hosted service or deployed on your own servers.",
    "website": "https://penpot.app",
    "tags": [
      "Design",
      "Prototyping",
      "Self-hosted"
    ],
    "brandColor": "#000000",
    "openSource": {
      "license": "MPL-2.0",
      "repoUrl": "https://github.com/penpot/penpot"
    }
  },
  {
    "id": "plausible-community-edition",
    "slug": "plausible-community-edition",
    "name": "Plausible Community Edition",
    "providerId": "plausible",
    "tagline": "Self-hosted, privacy-focused web analytics",
    "description": "Plausible is a lightweight, cookie-free web analytics tool. Its Community Edition is the self-hosted version that you install and run on your own server.",
    "website": "https://plausible.io",
    "tags": [
      "Analytics",
      "Privacy",
      "Self-hosted"
    ],
    "brandColor": "#5850EC",
    "openSource": {
      "license": "AGPL-3.0",
      "repoUrl": "https://github.com/plausible/analytics"
    }
  },
  {
    "id": "nextcloud",
    "slug": "nextcloud",
    "name": "Nextcloud",
    "providerId": "nextcloud",
    "tagline": "Self-hosted files, calendars and contacts",
    "description": "Nextcloud is a self-hosted platform for storing and syncing files, contacts and calendars across devices, extendable with apps. You run it on hardware or a server of your choice.",
    "website": "https://nextcloud.com",
    "tags": [
      "File sync",
      "Collaboration",
      "Self-hosted"
    ],
    "brandColor": "#0082C9",
    "openSource": {
      "license": "AGPL-3.0-or-later",
      "repoUrl": "https://github.com/nextcloud/server"
    }
  },
  {
    "id": "mattermost",
    "slug": "mattermost",
    "name": "Mattermost",
    "providerId": "mattermost",
    "tagline": "Open-core, self-hosted team collaboration platform",
    "description": "Mattermost is a collaboration platform offering chat, workflow automation, voice calling and screen sharing. It runs as a single Linux binary backed by PostgreSQL and can be deployed on your own infrastructure.",
    "website": "https://mattermost.com",
    "tags": [
      "Team chat",
      "Collaboration",
      "Self-hosted"
    ],
    "brandColor": "#1E325C",
    "openSource": {
      "license": "MIT (compiled releases); AGPL-3.0 and Apache-2.0 (source)",
      "repoUrl": "https://github.com/mattermost/mattermost"
    }
  },
  {
    "id": "betterdisplay",
    "slug": "betterdisplay",
    "name": "BetterDisplay",
    "providerId": "betterdisplay",
    "tagline": "Mac display control from the menu bar",
    "description": "BetterDisplay is a macOS menu bar app for controlling and configuring connected displays. Many features are free for non-business use, and a Pro licence unlocks the rest.",
    "website": "https://betterdisplay.pro",
    "tags": [
      "macOS",
      "Displays",
      "Utilities"
    ]
  }
];
