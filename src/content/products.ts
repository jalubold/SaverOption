/**
 * Providers and products — generated from research notes on 2026-10-17 and 2026-10-19.
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
  }
];
