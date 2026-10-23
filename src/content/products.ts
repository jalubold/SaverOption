/**
 * Providers and products — generated from research notes on 2026-10-17, 2026-10-19 and 2026-10-23.
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
  },
  {
    "id": "aws",
    "name": "Amazon Web Services",
    "website": "https://aws.amazon.com",
    "about": "Amazon Web Services is Amazon's cloud computing platform."
  },
  {
    "id": "cloudflare",
    "name": "Cloudflare",
    "website": "https://www.cloudflare.com",
    "about": "Cloudflare provides a global network for security, performance and developer services."
  },
  {
    "id": "digitalocean",
    "name": "DigitalOcean",
    "website": "https://www.digitalocean.com",
    "about": "DigitalOcean is a cloud infrastructure provider for developers and startups."
  },
  {
    "id": "mongodb",
    "name": "MongoDB",
    "website": "https://www.mongodb.com",
    "about": "MongoDB, Inc. develops the MongoDB document database and the MongoDB Atlas cloud service."
  },
  {
    "id": "oracle",
    "name": "Oracle",
    "website": "https://www.oracle.com",
    "about": "Oracle is an enterprise software and cloud company that runs Oracle Cloud Infrastructure (OCI)."
  },
  {
    "id": "vercel",
    "name": "Vercel",
    "website": "https://vercel.com",
    "about": "Vercel is a cloud platform for deploying and hosting web applications."
  },
  {
    "id": "neon",
    "name": "Neon",
    "website": "https://neon.com",
    "about": "Neon provides serverless Postgres and is part of Databricks."
  },
  {
    "id": "nvidia",
    "name": "NVIDIA",
    "website": "https://www.nvidia.com",
    "about": "NVIDIA makes GPUs and the software platforms used to build and run AI."
  },
  {
    "id": "elevenlabs",
    "name": "ElevenLabs",
    "website": "https://elevenlabs.io",
    "about": "ElevenLabs builds AI voice, text-to-speech and conversational audio products."
  },
  {
    "id": "openai",
    "name": "OpenAI",
    "website": "https://openai.com",
    "about": "OpenAI develops the GPT models, ChatGPT and the OpenAI API."
  },
  {
    "id": "cohere",
    "name": "Cohere",
    "website": "https://cohere.com",
    "about": "Cohere builds large language models and AI tools for enterprises."
  },
  {
    "id": "hubspot",
    "name": "HubSpot",
    "website": "https://www.hubspot.com",
    "about": "HubSpot makes CRM, marketing, sales and customer service software."
  },
  {
    "id": "posthog",
    "name": "PostHog",
    "website": "https://posthog.com",
    "about": "PostHog makes product analytics and related developer tools."
  },
  {
    "id": "intercom",
    "name": "Intercom",
    "website": "https://www.intercom.com",
    "about": "Intercom makes customer service software and the Fin AI agent."
  },
  {
    "id": "sentry",
    "name": "Sentry",
    "website": "https://sentry.io",
    "about": "Sentry makes application error tracking and performance monitoring software."
  },
  {
    "id": "datadog",
    "name": "Datadog",
    "website": "https://www.datadoghq.com",
    "about": "Datadog makes monitoring and observability software for cloud applications."
  },
  {
    "id": "miro",
    "name": "Miro",
    "website": "https://miro.com",
    "about": "Miro makes an online whiteboard and visual collaboration workspace."
  },
  {
    "id": "mixpanel",
    "name": "Mixpanel",
    "website": "https://mixpanel.com",
    "about": "Mixpanel makes product analytics software."
  },
  {
    "id": "zendesk",
    "name": "Zendesk",
    "website": "https://www.zendesk.com",
    "about": "Zendesk makes customer service and help desk software."
  },
  {
    "id": "jetbrains",
    "name": "JetBrains",
    "website": "https://www.jetbrains.com",
    "about": "JetBrains makes IDEs and developer tools such as IntelliJ IDEA, PyCharm and ReSharper."
  },
  {
    "id": "figma",
    "name": "Figma",
    "website": "https://www.figma.com",
    "about": "Figma makes collaborative design and prototyping tools."
  },
  {
    "id": "autodesk",
    "name": "Autodesk",
    "website": "https://www.autodesk.com",
    "about": "Autodesk makes design, engineering and 3D software such as AutoCAD, Revit and Fusion."
  },
  {
    "id": "anthropic",
    "name": "Anthropic",
    "website": "https://www.anthropic.com",
    "about": "Anthropic is an AI safety and research company that makes the Claude family of AI models and apps."
  },
  {
    "id": "perplexity",
    "name": "Perplexity",
    "website": "https://www.perplexity.ai",
    "about": "Perplexity makes an AI-powered answer engine and research assistant."
  },
  {
    "id": "cognition",
    "name": "Cognition",
    "website": "https://devin.ai",
    "about": "Cognition makes Devin, an AI software engineering agent, and Devin Desktop (formerly Windsurf), an AI coding editor."
  },
  {
    "id": "wave",
    "name": "Wave",
    "website": "https://www.waveapps.com",
    "about": "Wave makes accounting, invoicing and payments software for small businesses in the United States and Canada."
  },
  {
    "id": "zoho",
    "name": "Zoho",
    "website": "https://www.zoho.com",
    "about": "Zoho makes a suite of business software, including CRM, finance and collaboration apps."
  },
  {
    "id": "clockify",
    "name": "Clockify",
    "website": "https://clockify.me",
    "about": "Clockify makes time tracking and timesheet software for individuals and teams."
  },
  {
    "id": "calendly",
    "name": "Calendly",
    "website": "https://calendly.com",
    "about": "Calendly makes online meeting scheduling software."
  },
  {
    "id": "shopify",
    "name": "Shopify",
    "website": "https://www.shopify.com",
    "about": "Shopify makes an ecommerce platform for building and running online stores."
  },
  {
    "id": "1password",
    "name": "1Password",
    "website": "https://1password.com",
    "about": "1Password makes password management and access security software for individuals and businesses."
  },
  {
    "id": "slack",
    "name": "Slack",
    "website": "https://slack.com",
    "about": "Slack makes a messaging and collaboration app for teams."
  },
  {
    "id": "dropbox",
    "name": "Dropbox",
    "website": "https://www.dropbox.com",
    "about": "Dropbox makes cloud file storage, sharing and eSignature products."
  },
  {
    "id": "adobe",
    "name": "Adobe",
    "website": "https://www.adobe.com",
    "about": "Adobe makes creative, document and marketing software, including Creative Cloud, Adobe Express and Acrobat."
  },
  {
    "id": "framer",
    "name": "Framer",
    "website": "https://www.framer.com",
    "about": "Framer makes a no-code website builder for designers and teams."
  },
  {
    "id": "webflow",
    "name": "Webflow",
    "website": "https://webflow.com",
    "about": "Webflow makes a visual website builder with built-in hosting and CMS."
  },
  {
    "id": "descript",
    "name": "Descript",
    "website": "https://www.descript.com",
    "about": "Descript makes a text-based audio and video editor with AI tools."
  },
  {
    "id": "blackmagic-design",
    "name": "Blackmagic Design",
    "website": "https://www.blackmagicdesign.com",
    "about": "Blackmagic Design makes cameras, broadcast hardware and the DaVinci Resolve post-production software."
  },
  {
    "id": "sketch",
    "name": "Sketch",
    "website": "https://www.sketch.com",
    "about": "Sketch makes a Mac design app and a web workspace for UI design and collaboration."
  },
  {
    "id": "riverside",
    "name": "Riverside",
    "website": "https://riverside.com",
    "about": "Riverside makes remote podcast and video recording and editing software."
  },
  {
    "id": "restream",
    "name": "Restream",
    "website": "https://restream.io",
    "about": "Restream makes live streaming software for broadcasting to several platforms at once."
  },
  {
    "id": "zoom",
    "name": "Zoom",
    "website": "https://www.zoom.com",
    "about": "Zoom Communications makes the Zoom Workplace platform for video meetings, chat and phone."
  },
  {
    "id": "airtable",
    "name": "Airtable",
    "website": "https://www.airtable.com",
    "about": "Airtable makes a no-code platform for building apps and databases on top of spreadsheet-style tables."
  },
  {
    "id": "mailchimp",
    "name": "Intuit Mailchimp",
    "website": "https://mailchimp.com",
    "about": "Mailchimp is an email and marketing automation platform owned by Intuit."
  },
  {
    "id": "brevo",
    "name": "Brevo",
    "website": "https://www.brevo.com",
    "about": "Brevo (formerly Sendinblue) makes email, SMS and marketing automation software."
  },
  {
    "id": "kit",
    "name": "Kit",
    "website": "https://kit.com",
    "about": "Kit (formerly ConvertKit) makes email marketing software for creators."
  },
  {
    "id": "buffer",
    "name": "Buffer",
    "website": "https://buffer.com",
    "about": "Buffer makes social media scheduling and analytics tools."
  },
  {
    "id": "ahrefs",
    "name": "Ahrefs",
    "website": "https://ahrefs.com",
    "about": "Ahrefs makes SEO tools for keyword research, backlink analysis and site audits."
  },
  {
    "id": "sublime-hq",
    "name": "Sublime HQ",
    "website": "https://www.sublimehq.com"
  },
  {
    "id": "typora",
    "name": "Typora",
    "website": "https://typora.io"
  },
  {
    "id": "cleanshot",
    "name": "CleanShot",
    "website": "https://cleanshot.com"
  },
  {
    "id": "panic",
    "name": "Panic",
    "website": "https://panic.com"
  },
  {
    "id": "cultured-code",
    "name": "Cultured Code",
    "website": "https://culturedcode.com"
  },
  {
    "id": "n8n",
    "name": "n8n",
    "website": "https://n8n.io"
  },
  {
    "id": "immich",
    "name": "Immich",
    "website": "https://immich.app"
  },
  {
    "id": "twenty",
    "name": "Twenty",
    "website": "https://twenty.com"
  },
  {
    "id": "documenso",
    "name": "Documenso",
    "website": "https://documenso.com"
  },
  {
    "id": "umami",
    "name": "Umami",
    "website": "https://umami.is"
  },
  {
    "id": "heygen",
    "name": "HeyGen",
    "website": "https://www.heygen.com",
    "about": "HeyGen makes AI video and voice generation tools, available in a web app and through a developer API."
  },
  {
    "id": "mistral-ai",
    "name": "Mistral AI",
    "website": "https://mistral.ai",
    "about": "Mistral AI is a French company that builds open-weight and commercial large language models."
  },
  {
    "id": "lovable",
    "name": "Lovable",
    "website": "https://lovable.dev",
    "about": "Lovable makes an AI app and website builder that works from chat prompts."
  },
  {
    "id": "stackblitz",
    "name": "StackBlitz",
    "website": "https://stackblitz.com",
    "about": "StackBlitz makes Bolt.new, an AI app builder, and the StackBlitz browser-based development environment."
  },
  {
    "id": "deepl",
    "name": "DeepL",
    "website": "https://www.deepl.com",
    "about": "DeepL is a German company that makes AI translation and writing tools."
  },
  {
    "id": "railway",
    "name": "Railway",
    "website": "https://railway.com",
    "about": "Railway is a cloud platform for deploying apps, databases and other services, billed by usage."
  },
  {
    "id": "monday",
    "name": "monday.com",
    "website": "https://monday.com"
  },
  {
    "id": "asana",
    "name": "Asana",
    "website": "https://asana.com"
  },
  {
    "id": "hostinger",
    "name": "Hostinger",
    "website": "https://www.hostinger.com"
  },
  {
    "id": "ibm",
    "name": "IBM",
    "website": "https://www.ibm.com"
  },
  {
    "id": "raycast",
    "name": "Raycast",
    "website": "https://www.raycast.com"
  },
  {
    "id": "pipedrive",
    "name": "Pipedrive",
    "website": "https://www.pipedrive.com",
    "about": "Pipedrive makes a sales CRM for managing deals and pipelines."
  },
  {
    "id": "freshworks",
    "name": "Freshworks",
    "website": "https://www.freshworks.com",
    "about": "Freshworks makes customer service and business software, including Freshdesk."
  },
  {
    "id": "apple",
    "name": "Apple",
    "website": "https://www.apple.com",
    "about": "Apple makes Mac, iPad and iPhone hardware and software, including its pro creative apps."
  },
  {
    "id": "unity",
    "name": "Unity",
    "website": "https://unity.com",
    "about": "Unity makes a real-time 3D development platform and game engine."
  },
  {
    "id": "okta",
    "name": "Okta",
    "website": "https://www.okta.com"
  },
  {
    "id": "retool",
    "name": "Retool",
    "website": "https://retool.com"
  },
  {
    "id": "amplitude",
    "name": "Amplitude",
    "website": "https://amplitude.com"
  },
  {
    "id": "algolia",
    "name": "Algolia",
    "website": "https://www.algolia.com"
  },
  {
    "id": "stripe",
    "name": "Stripe",
    "website": "https://stripe.com"
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
    "brandColor": "#181717",
    "logo": {
      "src": "/logos/github.svg",
      "alt": "GitHub logo"
    }
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
    "brandColor": "#8957E5",
    "logo": {
      "src": "/logos/github-copilot.svg",
      "alt": "GitHub Copilot logo"
    }
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
    "brandColor": "#181717",
    "logo": {
      "src": "/logos/github-codespaces.svg",
      "alt": "GitHub Codespaces logo"
    }
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
    "brandColor": "#D83B01",
    "logo": {
      "src": "/logos/office-365.svg",
      "alt": "Office 365 logo"
    }
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
    "brandColor": "#0078D4",
    "logo": {
      "src": "/logos/microsoft-azure.svg",
      "alt": "Microsoft Azure logo"
    }
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
    "brandColor": "#4285F4",
    "logo": {
      "src": "/logos/google-cloud.svg",
      "alt": "Google Cloud logo"
    }
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
    "brandColor": "#000000",
    "logo": {
      "src": "/logos/notion.svg",
      "alt": "Notion logo"
    }
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
    "brandColor": "#0052CC",
    "logo": {
      "src": "/logos/atlassian-cloud.svg",
      "alt": "Atlassian Cloud (Jira, Confluence, Loom) logo"
    }
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
    "brandColor": "#5E6AD2",
    "logo": {
      "src": "/logos/linear.svg",
      "alt": "Linear logo"
    }
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
    "brandColor": "#4285F4",
    "logo": {
      "src": "/logos/google-ai-pro.svg",
      "alt": "Google AI Pro (Gemini) logo"
    }
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
    "brandColor": "#00C4CC",
    "logo": {
      "src": "/logos/canva.svg",
      "alt": "Canva logo"
    }
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
    "logo": {
      "src": "/logos/penpot.svg",
      "alt": "Penpot logo"
    },
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
    "logo": {
      "src": "/logos/plausible-community-edition.svg",
      "alt": "Plausible Community Edition logo"
    },
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
    "logo": {
      "src": "/logos/nextcloud.svg",
      "alt": "Nextcloud logo"
    },
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
    "logo": {
      "src": "/logos/mattermost.svg",
      "alt": "Mattermost logo"
    },
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
  },
  {
    "id": "aws",
    "slug": "aws",
    "name": "Amazon Web Services (AWS)",
    "providerId": "aws",
    "tagline": "Cloud computing platform",
    "description": "AWS is Amazon's cloud platform offering compute, storage, databases, AI and other infrastructure services.",
    "website": "https://aws.amazon.com",
    "tags": [
      "Cloud",
      "Infrastructure",
      "Hosting"
    ],
    "brandColor": "#FF9900",
    "logo": {
      "src": "/logos/aws.svg",
      "alt": "Amazon Web Services (AWS) logo"
    }
  },
  {
    "id": "cloudflare",
    "slug": "cloudflare",
    "name": "Cloudflare",
    "providerId": "cloudflare",
    "tagline": "Connectivity cloud and developer platform",
    "description": "Cloudflare offers CDN, security and developer platform services such as Workers, R2 and Workers AI.",
    "website": "https://www.cloudflare.com",
    "tags": [
      "Cloud",
      "CDN",
      "Security",
      "Serverless"
    ],
    "brandColor": "#F38020",
    "logo": {
      "src": "/logos/cloudflare.svg",
      "alt": "Cloudflare logo"
    }
  },
  {
    "id": "digitalocean",
    "slug": "digitalocean",
    "name": "DigitalOcean",
    "providerId": "digitalocean",
    "tagline": "Cloud infrastructure for developers",
    "description": "DigitalOcean provides cloud infrastructure including Droplets, GPU Droplets, managed databases and Kubernetes.",
    "website": "https://www.digitalocean.com",
    "tags": [
      "Cloud",
      "Infrastructure",
      "Hosting"
    ],
    "brandColor": "#0080FF",
    "logo": {
      "src": "/logos/digitalocean.svg",
      "alt": "DigitalOcean logo"
    }
  },
  {
    "id": "mongodb-atlas",
    "slug": "mongodb-atlas",
    "name": "MongoDB Atlas",
    "providerId": "mongodb",
    "tagline": "Managed MongoDB database in the cloud",
    "description": "MongoDB Atlas is MongoDB's fully managed cloud database service.",
    "website": "https://www.mongodb.com/atlas",
    "tags": [
      "Database",
      "Cloud",
      "NoSQL"
    ],
    "brandColor": "#00ED64",
    "logo": {
      "src": "/logos/mongodb-atlas.svg",
      "alt": "MongoDB Atlas logo"
    }
  },
  {
    "id": "oracle-cloud-infrastructure",
    "slug": "oracle-cloud-infrastructure",
    "name": "Oracle Cloud Infrastructure (OCI)",
    "providerId": "oracle",
    "tagline": "Oracle's public cloud platform",
    "description": "Oracle Cloud Infrastructure is Oracle's cloud platform for compute, storage, databases and AI workloads.",
    "website": "https://www.oracle.com/cloud/",
    "tags": [
      "Cloud",
      "Infrastructure",
      "AI"
    ],
    "brandColor": "#C74634",
    "logo": {
      "src": "/logos/oracle-cloud-infrastructure.svg",
      "alt": "Oracle Cloud Infrastructure (OCI) logo"
    }
  },
  {
    "id": "vercel",
    "slug": "vercel",
    "name": "Vercel",
    "providerId": "vercel",
    "tagline": "Frontend cloud for web apps",
    "description": "Vercel is a platform for building, deploying and hosting web applications, with AI Gateway and v0.",
    "website": "https://vercel.com",
    "tags": [
      "Hosting",
      "Developer Tools",
      "Cloud"
    ],
    "brandColor": "#000000",
    "logo": {
      "src": "/logos/vercel.svg",
      "alt": "Vercel logo"
    }
  },
  {
    "id": "neon",
    "slug": "neon",
    "name": "Neon",
    "providerId": "neon",
    "tagline": "Serverless Postgres",
    "description": "Neon is a serverless Postgres database platform.",
    "website": "https://neon.com",
    "tags": [
      "Database",
      "Postgres",
      "Cloud"
    ],
    "brandColor": "#00E599",
    "logo": {
      "src": "/logos/neon.svg",
      "alt": "Neon logo"
    }
  },
  {
    "id": "nvidia-inception",
    "slug": "nvidia-inception",
    "name": "NVIDIA Inception",
    "providerId": "nvidia",
    "tagline": "NVIDIA's program for startups",
    "description": "NVIDIA Inception is NVIDIA's free membership program for technology startups.",
    "website": "https://www.nvidia.com/en-us/startups/",
    "tags": [
      "AI",
      "GPU",
      "Startup Program"
    ],
    "brandColor": "#76B900",
    "logo": {
      "src": "/logos/nvidia-inception.svg",
      "alt": "NVIDIA Inception logo"
    }
  },
  {
    "id": "elevenlabs",
    "slug": "elevenlabs",
    "name": "ElevenLabs",
    "providerId": "elevenlabs",
    "tagline": "AI voice and text-to-speech",
    "description": "ElevenLabs provides AI text-to-speech, voice and conversational agent tools through an app and an API.",
    "website": "https://elevenlabs.io",
    "tags": [
      "AI",
      "Text to Speech",
      "Voice API"
    ],
    "brandColor": "#000000",
    "logo": {
      "src": "/logos/elevenlabs.svg",
      "alt": "ElevenLabs logo"
    }
  },
  {
    "id": "openai-api",
    "slug": "openai-api",
    "name": "OpenAI API",
    "providerId": "openai",
    "tagline": "API access to OpenAI models",
    "description": "The OpenAI API gives developers programmatic access to OpenAI's models.",
    "website": "https://openai.com/api/",
    "tags": [
      "AI",
      "LLM API",
      "Developer Tools"
    ],
    "brandColor": "#000000",
    "logo": {
      "src": "/logos/openai-api.svg",
      "alt": "OpenAI API logo"
    }
  },
  {
    "id": "cohere",
    "slug": "cohere",
    "name": "Cohere",
    "providerId": "cohere",
    "tagline": "Enterprise language models and API",
    "description": "Cohere offers large language models for generation, search and retrieval through its API.",
    "website": "https://cohere.com",
    "tags": [
      "AI",
      "LLM API",
      "Enterprise"
    ],
    "brandColor": "#39594D",
    "logo": {
      "src": "/logos/cohere.svg",
      "alt": "Cohere logo"
    }
  },
  {
    "id": "hubspot",
    "slug": "hubspot",
    "name": "HubSpot",
    "providerId": "hubspot",
    "tagline": "CRM platform for marketing, sales and service",
    "description": "HubSpot is a CRM platform with marketing, sales, customer service and content tools.",
    "website": "https://www.hubspot.com",
    "tags": [
      "CRM",
      "Marketing",
      "Sales"
    ],
    "brandColor": "#FF7A59",
    "logo": {
      "src": "/logos/hubspot.svg",
      "alt": "HubSpot logo"
    }
  },
  {
    "id": "posthog",
    "slug": "posthog",
    "name": "PostHog",
    "providerId": "posthog",
    "tagline": "Product analytics and developer tools",
    "description": "PostHog is a product analytics platform with session replay, feature flags and experiments.",
    "website": "https://posthog.com",
    "tags": [
      "Analytics",
      "Product Analytics",
      "Developer Tools"
    ],
    "brandColor": "#F54E00",
    "logo": {
      "src": "/logos/posthog.svg",
      "alt": "PostHog logo"
    }
  },
  {
    "id": "intercom",
    "slug": "intercom",
    "name": "Intercom",
    "providerId": "intercom",
    "tagline": "Customer service platform with the Fin AI agent",
    "description": "Intercom is a customer service platform with a help desk, messaging and the Fin AI agent.",
    "website": "https://www.intercom.com",
    "tags": [
      "Customer Support",
      "Help Desk",
      "AI"
    ],
    "brandColor": "#1F8DED",
    "logo": {
      "src": "/logos/intercom.svg",
      "alt": "Intercom logo"
    }
  },
  {
    "id": "sentry",
    "slug": "sentry",
    "name": "Sentry",
    "providerId": "sentry",
    "tagline": "Error tracking and performance monitoring",
    "description": "Sentry is an application monitoring tool for error tracking and performance monitoring.",
    "website": "https://sentry.io",
    "tags": [
      "Monitoring",
      "Error Tracking",
      "Developer Tools"
    ],
    "brandColor": "#362D59",
    "logo": {
      "src": "/logos/sentry.svg",
      "alt": "Sentry logo"
    }
  },
  {
    "id": "datadog",
    "slug": "datadog",
    "name": "Datadog",
    "providerId": "datadog",
    "tagline": "Monitoring and observability for cloud applications",
    "description": "Datadog is a monitoring and observability platform for infrastructure, applications and logs.",
    "website": "https://www.datadoghq.com",
    "tags": [
      "Monitoring",
      "Observability",
      "DevOps"
    ],
    "brandColor": "#632CA6",
    "logo": {
      "src": "/logos/datadog.svg",
      "alt": "Datadog logo"
    }
  },
  {
    "id": "miro",
    "slug": "miro",
    "name": "Miro",
    "providerId": "miro",
    "tagline": "Online whiteboard for team collaboration",
    "description": "Miro is an online whiteboard and visual workspace for team collaboration.",
    "website": "https://miro.com",
    "tags": [
      "Collaboration",
      "Whiteboard",
      "Design"
    ],
    "brandColor": "#FFD02F",
    "logo": {
      "src": "/logos/miro.svg",
      "alt": "Miro logo"
    }
  },
  {
    "id": "mixpanel",
    "slug": "mixpanel",
    "name": "Mixpanel",
    "providerId": "mixpanel",
    "tagline": "Product analytics for web and mobile",
    "description": "Mixpanel is a product analytics tool for tracking user events in web and mobile apps.",
    "website": "https://mixpanel.com",
    "tags": [
      "Analytics",
      "Product Analytics"
    ],
    "brandColor": "#7856FF",
    "logo": {
      "src": "/logos/mixpanel.svg",
      "alt": "Mixpanel logo"
    }
  },
  {
    "id": "zendesk",
    "slug": "zendesk",
    "name": "Zendesk",
    "providerId": "zendesk",
    "tagline": "Customer service and help desk software",
    "description": "Zendesk is customer service software with ticketing, messaging and a help center.",
    "website": "https://www.zendesk.com",
    "tags": [
      "Customer Support",
      "Help Desk"
    ],
    "brandColor": "#03363D",
    "logo": {
      "src": "/logos/zendesk.svg",
      "alt": "Zendesk logo"
    }
  },
  {
    "id": "jetbrains-ides",
    "slug": "jetbrains-ides",
    "name": "JetBrains IDEs",
    "providerId": "jetbrains",
    "tagline": "IDEs for professional development",
    "description": "JetBrains IDEs, including IntelliJ IDEA, PyCharm and WebStorm, are development environments for many programming languages.",
    "website": "https://www.jetbrains.com/ides/",
    "tags": [
      "Developer Tools",
      "IDE"
    ],
    "brandColor": "#000000",
    "logo": {
      "src": "/logos/jetbrains-ides.svg",
      "alt": "JetBrains IDEs logo"
    }
  },
  {
    "id": "figma",
    "slug": "figma",
    "name": "Figma",
    "providerId": "figma",
    "tagline": "Collaborative interface design",
    "description": "Figma is a browser-based tool for interface design, prototyping and collaboration.",
    "website": "https://www.figma.com",
    "tags": [
      "Design",
      "Prototyping",
      "Collaboration"
    ],
    "brandColor": "#F24E1E",
    "logo": {
      "src": "/logos/figma.svg",
      "alt": "Figma logo"
    }
  },
  {
    "id": "cloudflare-workers",
    "slug": "cloudflare-workers",
    "name": "Cloudflare Workers",
    "providerId": "cloudflare",
    "tagline": "Serverless functions on Cloudflare's network",
    "description": "Cloudflare Workers is a serverless platform for running code on Cloudflare's global network.",
    "website": "https://workers.cloudflare.com",
    "tags": [
      "Serverless",
      "Hosting",
      "Developer Tools"
    ],
    "brandColor": "#F38020",
    "logo": {
      "src": "/logos/cloudflare-workers.svg",
      "alt": "Cloudflare Workers logo"
    }
  },
  {
    "id": "autodesk",
    "slug": "autodesk",
    "name": "Autodesk",
    "providerId": "autodesk",
    "tagline": "Design, engineering and 3D software",
    "description": "Autodesk makes design and engineering software including AutoCAD, Revit, Fusion and Maya.",
    "website": "https://www.autodesk.com",
    "tags": [
      "CAD",
      "3D",
      "Design"
    ],
    "brandColor": "#0696D7",
    "logo": {
      "src": "/logos/autodesk.svg",
      "alt": "Autodesk logo"
    }
  },
  {
    "id": "claude",
    "slug": "claude",
    "name": "Claude",
    "providerId": "anthropic",
    "tagline": "AI assistant from Anthropic",
    "description": "Claude is Anthropic's AI assistant, available on the web, desktop and mobile, with Claude Code and Cowork for agentic work.",
    "website": "https://claude.com",
    "tags": [
      "AI",
      "Assistant",
      "Education"
    ],
    "brandColor": "#D97757",
    "logo": {
      "src": "/logos/claude.svg",
      "alt": "Claude logo"
    }
  },
  {
    "id": "chatgpt",
    "slug": "chatgpt",
    "name": "ChatGPT",
    "providerId": "openai",
    "tagline": "AI assistant from OpenAI",
    "description": "ChatGPT is OpenAI's AI assistant, offered on Free and paid plans such as Plus.",
    "website": "https://chatgpt.com",
    "tags": [
      "AI",
      "Assistant",
      "Chatbot"
    ],
    "brandColor": "#10A37F",
    "logo": {
      "src": "/logos/chatgpt.svg",
      "alt": "ChatGPT logo"
    }
  },
  {
    "id": "gemini-api",
    "slug": "gemini-api",
    "name": "Gemini API",
    "providerId": "google",
    "tagline": "Google's developer API for Gemini models",
    "description": "The Gemini Developer API gives developers paid and free-tier access to Google's Gemini models.",
    "website": "https://ai.google.dev/gemini-api/docs",
    "tags": [
      "AI",
      "LLM API",
      "Developer tools"
    ],
    "brandColor": "#1A73E8",
    "logo": {
      "src": "/logos/gemini-api.svg",
      "alt": "Gemini API logo"
    }
  },
  {
    "id": "kiro",
    "slug": "kiro",
    "name": "Kiro",
    "providerId": "aws",
    "tagline": "Agentic AI IDE from AWS",
    "description": "Kiro is an AI coding IDE and agent from AWS.",
    "website": "https://kiro.dev",
    "tags": [
      "AI",
      "IDE",
      "Developer tools"
    ],
    "brandColor": "#7B3FE4",
    "logo": {
      "src": "/logos/kiro.svg",
      "alt": "Kiro logo"
    }
  },
  {
    "id": "perplexity",
    "slug": "perplexity",
    "name": "Perplexity",
    "providerId": "perplexity",
    "tagline": "AI answer engine",
    "description": "Perplexity is an AI answer engine with Pro, Max and Enterprise plans.",
    "website": "https://www.perplexity.ai",
    "tags": [
      "AI",
      "Search",
      "Research"
    ],
    "brandColor": "#20808D",
    "logo": {
      "src": "/logos/perplexity.svg",
      "alt": "Perplexity logo"
    }
  },
  {
    "id": "devin-desktop",
    "slug": "devin-desktop",
    "name": "Devin Desktop",
    "providerId": "cognition",
    "tagline": "AI coding editor and CLI from Cognition (formerly Windsurf)",
    "description": "Devin Desktop, formerly Windsurf, is an AI code editor with an agent panel and a companion Devin CLI that run models from several AI labs.",
    "website": "https://devin.ai",
    "tags": [
      "AI coding",
      "Code editor",
      "Developer tools"
    ],
    "brandColor": "#0B100F",
    "logo": {
      "src": "/logos/devin-desktop.svg",
      "alt": "Devin Desktop logo"
    }
  },
  {
    "id": "wave",
    "slug": "wave",
    "name": "Wave",
    "providerId": "wave",
    "tagline": "Invoicing and accounting for small businesses",
    "description": "Wave is accounting and invoicing software for small businesses, with optional paid add-ons such as online payments and payroll.",
    "website": "https://www.waveapps.com",
    "tags": [
      "Invoicing",
      "Accounting",
      "Small business"
    ],
    "brandColor": "#1C6CFF"
  },
  {
    "id": "zoho-invoice",
    "slug": "zoho-invoice",
    "name": "Zoho Invoice",
    "providerId": "zoho",
    "tagline": "Free online invoicing software",
    "description": "Zoho Invoice is online invoicing software for creating invoices, sending payment reminders and collecting payments.",
    "website": "https://www.zoho.com/invoice/",
    "tags": [
      "Invoicing",
      "Billing",
      "Small business"
    ],
    "brandColor": "#E42527",
    "logo": {
      "src": "/logos/zoho-invoice.svg",
      "alt": "Zoho Invoice logo"
    }
  },
  {
    "id": "clockify",
    "slug": "clockify",
    "name": "Clockify",
    "providerId": "clockify",
    "tagline": "Time tracker and timesheet app",
    "description": "Clockify is a time tracking and timesheet app for logging work hours across projects, tasks and clients.",
    "website": "https://clockify.me",
    "tags": [
      "Time tracking",
      "Timesheets",
      "Productivity"
    ],
    "brandColor": "#03A9F4",
    "logo": {
      "src": "/logos/clockify.svg",
      "alt": "Clockify logo"
    }
  },
  {
    "id": "calendly",
    "slug": "calendly",
    "name": "Calendly",
    "providerId": "calendly",
    "tagline": "Online meeting scheduling",
    "description": "Calendly is a scheduling app that lets people book meetings from a booking page connected to your calendar.",
    "website": "https://calendly.com",
    "tags": [
      "Scheduling",
      "Meetings",
      "Calendar"
    ],
    "brandColor": "#006BFF",
    "logo": {
      "src": "/logos/calendly.svg",
      "alt": "Calendly logo"
    }
  },
  {
    "id": "shopify",
    "slug": "shopify",
    "name": "Shopify",
    "providerId": "shopify",
    "tagline": "Ecommerce platform for online stores",
    "description": "Shopify is an ecommerce platform for building an online store and selling online and in person.",
    "website": "https://www.shopify.com",
    "tags": [
      "Ecommerce",
      "Online store",
      "Payments"
    ],
    "brandColor": "#95BF47",
    "logo": {
      "src": "/logos/shopify.svg",
      "alt": "Shopify logo"
    }
  },
  {
    "id": "1password-business",
    "slug": "1password-business",
    "name": "1Password Business",
    "providerId": "1password",
    "tagline": "Password manager for teams and businesses",
    "description": "1Password Business is a password manager for companies, with shared vaults, admin controls and security reporting.",
    "website": "https://1password.com/business",
    "tags": [
      "Password manager",
      "Security",
      "Teams"
    ],
    "brandColor": "#0572EC",
    "logo": {
      "src": "/logos/1password-business.svg",
      "alt": "1Password Business logo"
    }
  },
  {
    "id": "slack",
    "slug": "slack",
    "name": "Slack",
    "providerId": "slack",
    "tagline": "Team messaging and collaboration",
    "description": "Slack is a messaging app for teams, organised into channels, direct messages and huddles.",
    "website": "https://slack.com",
    "tags": [
      "Team chat",
      "Messaging",
      "Collaboration"
    ],
    "brandColor": "#4A154B",
    "logo": {
      "src": "/logos/slack.svg",
      "alt": "Slack logo"
    }
  },
  {
    "id": "dropbox-sign",
    "slug": "dropbox-sign",
    "name": "Dropbox Sign",
    "providerId": "dropbox",
    "tagline": "Electronic signatures from Dropbox",
    "description": "Dropbox Sign is an eSignature service for sending documents for signature and signing them online.",
    "website": "https://sign.dropbox.com",
    "tags": [
      "eSignature",
      "Contracts",
      "Documents"
    ],
    "brandColor": "#0061FF",
    "logo": {
      "src": "/logos/dropbox-sign.svg",
      "alt": "Dropbox Sign logo"
    }
  },
  {
    "id": "adobe-express",
    "slug": "adobe-express",
    "name": "Adobe Express",
    "providerId": "adobe",
    "tagline": "Quick design for social, video and documents",
    "description": "Adobe Express is a web and mobile app for making social posts, videos, flyers and other graphics from templates.",
    "website": "https://www.adobe.com/express/",
    "tags": [
      "Graphic design",
      "Templates",
      "Social media"
    ],
    "brandColor": "#EB1000",
    "logo": {
      "src": "/logos/adobe-express.svg",
      "alt": "Adobe Express logo"
    }
  },
  {
    "id": "framer",
    "slug": "framer",
    "name": "Framer",
    "providerId": "framer",
    "tagline": "No-code website builder for designers",
    "description": "Framer is a website builder with a design canvas, CMS and hosting for publishing sites without code.",
    "website": "https://www.framer.com",
    "tags": [
      "Website builder",
      "No-code",
      "Design"
    ],
    "brandColor": "#0055FF",
    "logo": {
      "src": "/logos/framer.svg",
      "alt": "Framer logo"
    }
  },
  {
    "id": "webflow",
    "slug": "webflow",
    "name": "Webflow",
    "providerId": "webflow",
    "tagline": "Visual website builder with CMS and hosting",
    "description": "Webflow is a visual website builder that combines design, a CMS and hosting.",
    "website": "https://webflow.com",
    "tags": [
      "Website builder",
      "No-code",
      "CMS"
    ],
    "brandColor": "#146EF5",
    "logo": {
      "src": "/logos/webflow.svg",
      "alt": "Webflow logo"
    }
  },
  {
    "id": "descript",
    "slug": "descript",
    "name": "Descript",
    "providerId": "descript",
    "tagline": "Edit video and audio like a doc",
    "description": "Descript is an audio and video editor that lets you edit recordings by editing their transcript, with built-in AI tools.",
    "website": "https://www.descript.com",
    "tags": [
      "Video editing",
      "Podcasting",
      "Transcription",
      "AI"
    ],
    "brandColor": "#000000",
    "logo": {
      "src": "/logos/descript.svg",
      "alt": "Descript logo"
    }
  },
  {
    "id": "davinci-resolve",
    "slug": "davinci-resolve",
    "name": "DaVinci Resolve",
    "providerId": "blackmagic-design",
    "tagline": "Editing, color, effects and audio in one app",
    "description": "DaVinci Resolve is Blackmagic Design's post-production application for video editing, color correction, visual effects and audio.",
    "website": "https://www.blackmagicdesign.com/products/davinciresolve",
    "tags": [
      "Video editing",
      "Color grading",
      "Post-production"
    ],
    "brandColor": "#233A51",
    "logo": {
      "src": "/logos/davinci-resolve.svg",
      "alt": "DaVinci Resolve logo"
    }
  },
  {
    "id": "affinity",
    "slug": "affinity",
    "name": "Affinity",
    "providerId": "canva",
    "tagline": "Vector, pixel and layout design in one app",
    "description": "Affinity is Canva's professional desktop design app combining vector, pixel and page layout tools.",
    "website": "https://www.affinity.studio",
    "tags": [
      "Graphic design",
      "Photo editing",
      "Desktop publishing"
    ],
    "brandColor": "#111111",
    "logo": {
      "src": "/logos/affinity.svg",
      "alt": "Affinity logo"
    }
  },
  {
    "id": "sketch",
    "slug": "sketch",
    "name": "Sketch",
    "providerId": "sketch",
    "tagline": "UI design app for Mac",
    "description": "Sketch is a Mac app and web workspace for designing and prototyping user interfaces.",
    "website": "https://www.sketch.com",
    "tags": [
      "UI design",
      "Prototyping",
      "Mac"
    ],
    "brandColor": "#F7B500",
    "logo": {
      "src": "/logos/sketch.svg",
      "alt": "Sketch logo"
    }
  },
  {
    "id": "riverside",
    "slug": "riverside",
    "name": "Riverside",
    "providerId": "riverside",
    "tagline": "Remote podcast and video recording",
    "description": "Riverside is a browser-based studio for recording podcasts and video interviews with remote guests, with separate tracks per participant.",
    "website": "https://riverside.com",
    "tags": [
      "Podcasting",
      "Video recording",
      "Remote recording"
    ],
    "brandColor": "#5E3BEE"
  },
  {
    "id": "restream",
    "slug": "restream",
    "name": "Restream",
    "providerId": "restream",
    "tagline": "Stream live to several platforms at once",
    "description": "Restream is a live streaming service for broadcasting to several platforms at the same time from its browser studio or from encoders such as OBS.",
    "website": "https://restream.io",
    "tags": [
      "Live streaming",
      "Multistreaming",
      "Video"
    ],
    "brandColor": "#0E1C4E"
  },
  {
    "id": "google-workspace",
    "slug": "google-workspace",
    "name": "Google Workspace",
    "providerId": "google",
    "tagline": "Gmail, Drive, Docs and Meet for businesses",
    "description": "Google Workspace is Google's paid suite of business email, file storage, documents and video meetings, including Gmail, Drive, Docs, Sheets and Meet.",
    "website": "https://workspace.google.com",
    "tags": [
      "Productivity",
      "Email",
      "Collaboration"
    ],
    "brandColor": "#4285F4",
    "logo": {
      "src": "/logos/google-workspace.svg",
      "alt": "Google Workspace logo"
    }
  },
  {
    "id": "microsoft-365-business",
    "slug": "microsoft-365-business",
    "name": "Microsoft 365 for business",
    "providerId": "microsoft",
    "tagline": "Office apps, email and Teams for organizations",
    "description": "Microsoft 365 for business is a family of subscriptions (Business Basic, Standard and Premium, plus Apps for business) that bundle Office apps, Exchange email, OneDrive, SharePoint and Teams.",
    "website": "https://www.microsoft.com/microsoft-365/business",
    "tags": [
      "Productivity",
      "Email",
      "Collaboration"
    ],
    "brandColor": "#D83B01",
    "logo": {
      "src": "/logos/microsoft-365-business.svg",
      "alt": "Microsoft 365 for business logo"
    }
  },
  {
    "id": "zoom-workplace",
    "slug": "zoom-workplace",
    "name": "Zoom Workplace",
    "providerId": "zoom",
    "tagline": "Video meetings, chat and collaboration",
    "description": "Zoom Workplace is Zoom's collaboration platform for video meetings, team chat, whiteboards and notes.",
    "website": "https://www.zoom.com",
    "tags": [
      "Video meetings",
      "Communication"
    ],
    "brandColor": "#0B5CFF",
    "logo": {
      "src": "/logos/zoom-workplace.svg",
      "alt": "Zoom Workplace logo"
    }
  },
  {
    "id": "trello",
    "slug": "trello",
    "name": "Trello",
    "providerId": "atlassian",
    "tagline": "Kanban boards for organizing work",
    "description": "Trello is Atlassian's board-based project management tool that organizes tasks as cards on lists.",
    "website": "https://trello.com",
    "tags": [
      "Project management",
      "Kanban",
      "Collaboration"
    ],
    "brandColor": "#0052CC",
    "logo": {
      "src": "/logos/trello.svg",
      "alt": "Trello logo"
    }
  },
  {
    "id": "airtable",
    "slug": "airtable",
    "name": "Airtable",
    "providerId": "airtable",
    "tagline": "Spreadsheet-database hybrid for building apps",
    "description": "Airtable is a cloud platform that combines spreadsheet-style tables with database features, views and automations for building team apps.",
    "website": "https://www.airtable.com",
    "tags": [
      "Database",
      "No-code",
      "Project management"
    ],
    "brandColor": "#18BFFF",
    "logo": {
      "src": "/logos/airtable.svg",
      "alt": "Airtable logo"
    }
  },
  {
    "id": "mailchimp",
    "slug": "mailchimp",
    "name": "Mailchimp",
    "providerId": "mailchimp",
    "tagline": "Email marketing and automation",
    "description": "Mailchimp is an email marketing platform for building audiences, sending campaigns and automating marketing messages.",
    "website": "https://mailchimp.com",
    "tags": [
      "Email marketing",
      "Marketing automation"
    ],
    "brandColor": "#FFE01B",
    "logo": {
      "src": "/logos/mailchimp.svg",
      "alt": "Mailchimp logo"
    }
  },
  {
    "id": "brevo",
    "slug": "brevo",
    "name": "Brevo",
    "providerId": "brevo",
    "tagline": "Email, SMS and marketing automation",
    "description": "Brevo is a marketing platform for email campaigns, transactional email, SMS and marketing automation.",
    "website": "https://www.brevo.com",
    "tags": [
      "Email marketing",
      "Marketing automation",
      "SMS"
    ],
    "brandColor": "#0B996E",
    "logo": {
      "src": "/logos/brevo.svg",
      "alt": "Brevo logo"
    }
  },
  {
    "id": "kit",
    "slug": "kit",
    "name": "Kit",
    "providerId": "kit",
    "tagline": "Email marketing for creators",
    "description": "Kit, formerly ConvertKit, is an email marketing platform for creators with forms, landing pages, newsletters and digital product sales.",
    "website": "https://kit.com",
    "tags": [
      "Email marketing",
      "Newsletters",
      "Creators"
    ],
    "brandColor": "#FB6970",
    "logo": {
      "src": "/logos/kit.svg",
      "alt": "Kit logo"
    }
  },
  {
    "id": "buffer",
    "slug": "buffer",
    "name": "Buffer",
    "providerId": "buffer",
    "tagline": "Social media scheduling",
    "description": "Buffer is a tool for planning, scheduling and analyzing posts across social media channels.",
    "website": "https://buffer.com",
    "tags": [
      "Social media",
      "Scheduling",
      "Marketing"
    ],
    "brandColor": "#231F20",
    "logo": {
      "src": "/logos/buffer.svg",
      "alt": "Buffer logo"
    }
  },
  {
    "id": "ahrefs",
    "slug": "ahrefs",
    "name": "Ahrefs",
    "providerId": "ahrefs",
    "tagline": "SEO tools for site audits and backlinks",
    "description": "Ahrefs is an SEO platform for site audits, backlink and keyword research, and rank tracking.",
    "website": "https://ahrefs.com",
    "tags": [
      "SEO",
      "Marketing",
      "Analytics"
    ],
    "brandColor": "#054ADA"
  },
  {
    "id": "sublime-text",
    "slug": "sublime-text",
    "name": "Sublime Text",
    "providerId": "sublime-hq",
    "tagline": "Code and text editor",
    "description": "Sublime Text is a code and text editor from Sublime HQ. Personal licences are a one-time purchase, while business licences are sold as per-seat subscriptions.",
    "website": "https://www.sublimetext.com",
    "tags": [
      "Code editor",
      "Developer tools"
    ],
    "logo": {
      "src": "/logos/sublime-text.svg",
      "alt": "Sublime Text logo"
    }
  },
  {
    "id": "typora",
    "slug": "typora",
    "name": "Typora",
    "providerId": "typora",
    "tagline": "Markdown editor and reader",
    "description": "Typora is a desktop Markdown editor and reader. It is sold as a one-time licence, with a 15-day free trial before purchase.",
    "website": "https://typora.io",
    "tags": [
      "Markdown",
      "Writing"
    ]
  },
  {
    "id": "cleanshot-x",
    "slug": "cleanshot-x",
    "name": "CleanShot X",
    "providerId": "cleanshot",
    "tagline": "Mac screenshots and screen recording",
    "description": "CleanShot X is a macOS app for taking screenshots and screen recordings, with optional CleanShot Cloud storage for uploads. It requires macOS 13.0 or newer.",
    "website": "https://cleanshot.com",
    "tags": [
      "macOS",
      "Screenshots",
      "Screen recording"
    ]
  },
  {
    "id": "nova",
    "slug": "nova",
    "name": "Nova",
    "providerId": "panic",
    "tagline": "Code editor for the Mac",
    "description": "Nova is a code editor for macOS made by Panic. It is sold as a licence that never expires, with one year of updates included and a free trial.",
    "website": "https://nova.app",
    "tags": [
      "Code editor",
      "macOS"
    ]
  },
  {
    "id": "things-3",
    "slug": "things-3",
    "name": "Things 3",
    "providerId": "cultured-code",
    "tagline": "To-do list app for Apple devices",
    "description": "Things 3 is a personal task manager from Cultured Code for Mac, iPhone, iPad, Apple Watch and Apple Vision Pro. Each platform version is a one-time App Store purchase, and sync through Things Cloud is free.",
    "website": "https://culturedcode.com/things/",
    "tags": [
      "Task management",
      "Productivity"
    ],
    "logo": {
      "src": "/logos/things-3.svg",
      "alt": "Things 3 logo"
    }
  },
  {
    "id": "n8n",
    "slug": "n8n",
    "name": "n8n",
    "providerId": "n8n",
    "tagline": "Fair-code workflow automation platform",
    "description": "n8n is a workflow automation platform that combines visual building with custom code and offers 400+ integrations. It can be self-hosted under its fair-code Sustainable Use License or used through the paid n8n Cloud service.",
    "website": "https://n8n.io",
    "tags": [
      "Workflow automation",
      "Integrations",
      "Self-hosted"
    ],
    "openSource": {
      "license": "Sustainable Use License (fair-code, source-available; not OSI open source)",
      "repoUrl": "https://github.com/n8n-io/n8n"
    },
    "logo": {
      "src": "/logos/n8n.svg",
      "alt": "n8n logo"
    }
  },
  {
    "id": "immich",
    "slug": "immich",
    "name": "Immich",
    "providerId": "immich",
    "tagline": "Self-hosted photo and video management",
    "description": "Immich is a self-hosted application for browsing, searching and organising photos and videos on your own server. It is developed in the open under the AGPL-3.0 licence.",
    "website": "https://immich.app",
    "tags": [
      "Photos",
      "Video",
      "Self-hosted"
    ],
    "openSource": {
      "license": "AGPL-3.0",
      "repoUrl": "https://github.com/immich-app/immich"
    },
    "logo": {
      "src": "/logos/immich.svg",
      "alt": "Immich logo"
    }
  },
  {
    "id": "twenty",
    "slug": "twenty",
    "name": "Twenty",
    "providerId": "twenty",
    "tagline": "Open-source, self-hostable CRM platform",
    "description": "Twenty is an open-source customer relationship management (CRM) platform that can be self-hosted or used on Twenty's managed cloud. Its code is licensed mostly under AGPL-3.0, with some packages under MIT and some files under a commercial licence.",
    "website": "https://twenty.com",
    "tags": [
      "CRM",
      "Self-hosted"
    ],
    "openSource": {
      "license": "AGPL-3.0",
      "repoUrl": "https://github.com/twentyhq/twenty"
    },
    "logo": {
      "src": "/logos/twenty.svg",
      "alt": "Twenty logo"
    }
  },
  {
    "id": "documenso",
    "slug": "documenso",
    "name": "Documenso",
    "providerId": "documenso",
    "tagline": "Open-source document signing platform",
    "description": "Documenso is an open-source e-signature platform for sending and signing documents, positioned as an alternative to DocuSign. It is available as a hosted service or self-hosted, with the core licensed under AGPL-3.0.",
    "website": "https://documenso.com",
    "tags": [
      "E-signatures",
      "Documents",
      "Self-hosted"
    ],
    "openSource": {
      "license": "AGPL-3.0",
      "repoUrl": "https://github.com/documenso/documenso"
    }
  },
  {
    "id": "umami",
    "slug": "umami",
    "name": "Umami",
    "providerId": "umami",
    "tagline": "Privacy-focused web analytics",
    "description": "Umami is an open-source, privacy-focused web and product analytics platform, positioned as an alternative to Google Analytics, Mixpanel and Amplitude. It is released under the MIT licence and can be self-hosted or used through Umami Cloud.",
    "website": "https://umami.is",
    "tags": [
      "Analytics",
      "Privacy",
      "Self-hosted"
    ],
    "openSource": {
      "license": "MIT",
      "repoUrl": "https://github.com/umami-software/umami"
    },
    "logo": {
      "src": "/logos/umami.svg",
      "alt": "Umami logo"
    }
  },
  {
    "id": "heygen",
    "slug": "heygen",
    "name": "HeyGen",
    "providerId": "heygen",
    "tagline": "AI video and voice generation",
    "description": "HeyGen is an AI video platform with avatar video, voice and text-to-speech tools, available in a web app and through a developer API.",
    "website": "https://www.heygen.com",
    "tags": [
      "AI video",
      "Text to speech",
      "API"
    ]
  },
  {
    "id": "mistral-ai-studio",
    "slug": "mistral-ai-studio",
    "name": "Mistral AI Studio",
    "providerId": "mistral-ai",
    "tagline": "Mistral models through an API",
    "description": "Mistral AI Studio is Mistral AI's developer platform for using Mistral models through an API, with plans from a free Experiment tier to pay-per-use Scale.",
    "website": "https://mistral.ai",
    "tags": [
      "LLM API",
      "AI models"
    ],
    "logo": {
      "src": "/logos/mistral-ai-studio.svg",
      "alt": "Mistral AI Studio logo"
    }
  },
  {
    "id": "lovable",
    "slug": "lovable",
    "name": "Lovable",
    "providerId": "lovable",
    "tagline": "AI app builder from prompts",
    "description": "Lovable is an AI app builder that creates and edits web apps and websites from chat prompts, with a built-in Lovable Cloud backend.",
    "website": "https://lovable.dev",
    "tags": [
      "AI app builder",
      "No-code"
    ],
    "logo": {
      "src": "/logos/lovable.svg",
      "alt": "Lovable logo"
    }
  },
  {
    "id": "bolt-new",
    "slug": "bolt-new",
    "name": "Bolt.new",
    "providerId": "stackblitz",
    "tagline": "AI web app builder in the browser",
    "description": "Bolt.new is StackBlitz's AI app builder that creates, runs and hosts web apps from chat prompts in the browser.",
    "website": "https://bolt.new",
    "tags": [
      "AI app builder",
      "Web development"
    ],
    "logo": {
      "src": "/logos/bolt-new.svg",
      "alt": "Bolt.new logo"
    }
  },
  {
    "id": "deepl-api",
    "slug": "deepl-api",
    "name": "DeepL API",
    "providerId": "deepl",
    "tagline": "Machine translation API",
    "description": "The DeepL API gives developers programmatic access to DeepL's AI translation, with a free Developer plan for testing and paid Growth and Enterprise plans.",
    "website": "https://www.deepl.com/pro-api",
    "tags": [
      "Translation API",
      "AI"
    ],
    "logo": {
      "src": "/logos/deepl-api.svg",
      "alt": "DeepL API logo"
    }
  },
  {
    "id": "railway",
    "slug": "railway",
    "name": "Railway",
    "providerId": "railway",
    "tagline": "Cloud platform for deploying apps",
    "description": "Railway is a usage-billed cloud platform for deploying web apps, databases and other services.",
    "website": "https://railway.com",
    "tags": [
      "Cloud hosting",
      "PaaS"
    ],
    "logo": {
      "src": "/logos/railway.svg",
      "alt": "Railway logo"
    }
  },
  {
    "id": "monday-com",
    "slug": "monday-com",
    "name": "monday.com",
    "providerId": "monday",
    "tagline": "Work management and CRM platform",
    "description": "monday.com is a cloud work platform with separate products for work management, CRM, service and software development teams.",
    "website": "https://monday.com",
    "tags": [
      "Project management",
      "CRM",
      "Work management"
    ],
    "logo": {
      "src": "/logos/monday-com.svg",
      "alt": "monday.com logo"
    }
  },
  {
    "id": "asana",
    "slug": "asana",
    "name": "Asana",
    "providerId": "asana",
    "tagline": "Work and project management platform",
    "description": "Asana is a cloud work management tool for planning projects, assigning tasks and tracking team work.",
    "website": "https://asana.com",
    "tags": [
      "Project management",
      "Task management"
    ],
    "logo": {
      "src": "/logos/asana.svg",
      "alt": "Asana logo"
    }
  },
  {
    "id": "hostinger-web-hosting",
    "slug": "hostinger-web-hosting",
    "name": "Hostinger Web Hosting",
    "providerId": "hostinger",
    "tagline": "Web hosting, domains and website builder",
    "description": "Hostinger sells web hosting plans along with VPS hosting, domain registration and an AI website builder.",
    "website": "https://www.hostinger.com",
    "tags": [
      "Web hosting",
      "Domains",
      "Website builder"
    ],
    "logo": {
      "src": "/logos/hostinger-web-hosting.svg",
      "alt": "Hostinger Web Hosting logo"
    }
  },
  {
    "id": "ibm-bob",
    "slug": "ibm-bob",
    "name": "IBM Bob",
    "providerId": "ibm",
    "tagline": "AI coding agent from IBM",
    "description": "IBM Bob is IBM's AI development partner for planning, building, testing, securing and modernizing applications, with usage billed in Bobcoins.",
    "website": "https://www.ibm.com/products/ai-coding-agent",
    "tags": [
      "AI coding agent",
      "Developer tools"
    ],
    "logo": {
      "src": "/logos/ibm-bob.svg",
      "alt": "IBM Bob logo"
    }
  },
  {
    "id": "raycast",
    "slug": "raycast",
    "name": "Raycast",
    "providerId": "raycast",
    "tagline": "Extendable launcher with built-in AI",
    "description": "Raycast is a launcher and productivity app with extensions, snippets, notes and AI chat; the Pro plan adds Raycast AI and Cloud Sync across Mac, Windows and iOS.",
    "website": "https://www.raycast.com",
    "tags": [
      "Launcher",
      "Productivity",
      "AI assistant"
    ],
    "logo": {
      "src": "/logos/raycast.svg",
      "alt": "Raycast logo"
    }
  },
  {
    "id": "zoho-one",
    "slug": "zoho-one",
    "name": "Zoho One",
    "providerId": "zoho",
    "tagline": "Bundle of Zoho business apps",
    "description": "Zoho One is Zoho's suite of integrated business applications, which Zoho calls an operating system for business, with shared services such as AI, business intelligence and unified communication tools.",
    "website": "https://www.zoho.com/one/",
    "tags": [
      "Business suite",
      "CRM",
      "Productivity"
    ],
    "logo": {
      "src": "/logos/zoho-one.svg",
      "alt": "Zoho One logo"
    }
  },
  {
    "id": "pipedrive",
    "slug": "pipedrive",
    "name": "Pipedrive",
    "providerId": "pipedrive",
    "tagline": "Sales CRM for closing deals",
    "description": "Pipedrive is a sales CRM for tracking leads and deals through a visual sales pipeline.",
    "website": "https://www.pipedrive.com",
    "tags": [
      "CRM",
      "Sales"
    ],
    "logo": {
      "src": "/logos/pipedrive.svg",
      "alt": "Pipedrive logo"
    }
  },
  {
    "id": "freshdesk",
    "slug": "freshdesk",
    "name": "Freshdesk",
    "providerId": "freshworks",
    "tagline": "Help desk and ticketing software",
    "description": "Freshdesk is Freshworks' customer support help desk, with ticketing, workflow automation, self-service and analytics.",
    "website": "https://www.freshworks.com/freshdesk/",
    "tags": [
      "Help desk",
      "Customer support",
      "Ticketing"
    ]
  },
  {
    "id": "apple-creator-studio",
    "slug": "apple-creator-studio",
    "name": "Apple Creator Studio",
    "providerId": "apple",
    "tagline": "Subscription bundle of Apple's pro apps",
    "description": "Apple Creator Studio is a subscription that includes Final Cut Pro, Logic Pro, Pixelmator Pro, Motion, Compressor and MainStage, plus premium content and AI features in Keynote, Pages, Numbers and Freeform.",
    "website": "https://creatorstudio.apple.com/",
    "tags": [
      "Video editing",
      "Music production",
      "Creative suite"
    ],
    "brandColor": "#000000",
    "logo": {
      "src": "/logos/apple-creator-studio.svg",
      "alt": "Apple Creator Studio logo"
    }
  },
  {
    "id": "adobe-creative-cloud",
    "slug": "adobe-creative-cloud",
    "name": "Adobe Creative Cloud Pro",
    "providerId": "adobe",
    "tagline": "Adobe's creative apps in one plan",
    "description": "Creative Cloud Pro is Adobe's subscription plan with 20+ creative apps, such as Photoshop, Illustrator and Premiere Pro, along with Adobe Firefly generative AI.",
    "website": "https://www.adobe.com/creativecloud.html",
    "tags": [
      "Design",
      "Photo editing",
      "Video editing"
    ],
    "brandColor": "#FA0F00",
    "logo": {
      "src": "/logos/adobe-creative-cloud.svg",
      "alt": "Adobe Creative Cloud Pro logo"
    }
  },
  {
    "id": "unity",
    "slug": "unity",
    "name": "Unity",
    "providerId": "unity",
    "tagline": "Real-time 3D and game engine",
    "description": "Unity is a real-time 3D development platform and editor used to build games and interactive 2D, 3D and XR experiences.",
    "website": "https://unity.com",
    "tags": [
      "Game engine",
      "3D",
      "Developer tools"
    ],
    "brandColor": "#000000",
    "logo": {
      "src": "/logos/unity.svg",
      "alt": "Unity logo"
    }
  },
  {
    "id": "auth0",
    "slug": "auth0",
    "name": "Auth0",
    "providerId": "okta",
    "tagline": "Customer identity and login platform",
    "description": "Auth0, part of Okta, is a customer identity platform for adding login, single sign-on and multi-factor authentication to applications.",
    "website": "https://auth0.com",
    "tags": [
      "Authentication",
      "Identity"
    ],
    "logo": {
      "src": "/logos/auth0.svg",
      "alt": "Auth0 logo"
    }
  },
  {
    "id": "retool",
    "slug": "retool",
    "name": "Retool",
    "providerId": "retool",
    "tagline": "Build internal tools on your data",
    "description": "Retool is a platform for building internal tools, apps and workflows on top of databases and APIs.",
    "website": "https://retool.com",
    "tags": [
      "Internal tools",
      "Low-code"
    ],
    "logo": {
      "src": "/logos/retool.svg",
      "alt": "Retool logo"
    }
  },
  {
    "id": "amplitude",
    "slug": "amplitude",
    "name": "Amplitude",
    "providerId": "amplitude",
    "tagline": "Product and digital analytics platform",
    "description": "Amplitude is a digital analytics platform for tracking and analysing how people use products and websites.",
    "website": "https://amplitude.com",
    "tags": [
      "Analytics",
      "Product analytics"
    ],
    "logo": {
      "src": "/logos/amplitude.svg",
      "alt": "Amplitude logo"
    }
  },
  {
    "id": "algolia",
    "slug": "algolia",
    "name": "Algolia",
    "providerId": "algolia",
    "tagline": "Hosted search and discovery API",
    "description": "Algolia is a hosted search and discovery platform that developers add to websites and apps through its APIs.",
    "website": "https://www.algolia.com",
    "tags": [
      "Search API",
      "Developer tools"
    ],
    "logo": {
      "src": "/logos/algolia.svg",
      "alt": "Algolia logo"
    }
  },
  {
    "id": "stripe-atlas",
    "slug": "stripe-atlas",
    "name": "Stripe Atlas",
    "providerId": "stripe",
    "tagline": "Online company incorporation for founders",
    "description": "Stripe Atlas is Stripe's service for incorporating a startup online; its one-time fee covers incorporation and the first year of registered agent service.",
    "website": "https://stripe.com/atlas",
    "tags": [
      "Incorporation",
      "Payments"
    ],
    "brandColor": "#635BFF",
    "logo": {
      "src": "/logos/stripe-atlas.svg",
      "alt": "Stripe Atlas logo"
    }
  }
];
