/**
 * Providers and products — generated from research notes on 2026-10-17, 2026-10-19, 2026-10-23 and 2026-11-02.
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
  },
  {
    "id": "akamai",
    "name": "Akamai Technologies",
    "website": "https://www.akamai.com",
    "about": "Akamai runs content delivery, security and cloud computing services; its cloud computing business was formerly Linode."
  },
  {
    "id": "vultr",
    "name": "Vultr",
    "website": "https://www.vultr.com",
    "about": "Vultr is an independent cloud provider offering compute, GPU, storage and Kubernetes infrastructure."
  },
  {
    "id": "confluent",
    "name": "Confluent",
    "website": "https://www.confluent.io",
    "about": "Confluent provides a data streaming platform built on Apache Kafka."
  },
  {
    "id": "snowflake",
    "name": "Snowflake",
    "website": "https://www.snowflake.com",
    "about": "Snowflake runs the AI Data Cloud, a cloud platform for data warehousing, analytics and AI."
  },
  {
    "id": "alibaba-cloud",
    "name": "Alibaba Cloud",
    "website": "https://www.alibabacloud.com",
    "about": "Alibaba Cloud is the cloud computing business of Alibaba Group."
  },
  {
    "id": "scaleway",
    "name": "Scaleway",
    "website": "https://www.scaleway.com",
    "about": "Scaleway is a European cloud provider based in France."
  },
  {
    "id": "ovhcloud",
    "name": "OVHcloud",
    "website": "https://www.ovhcloud.com",
    "about": "OVHcloud is a European cloud provider headquartered in France."
  },
  {
    "id": "civo",
    "name": "Civo",
    "website": "https://www.civo.com",
    "about": "Civo is a cloud provider focused on managed Kubernetes, compute and GPU infrastructure."
  },
  {
    "id": "cockroach-labs",
    "name": "Cockroach Labs",
    "website": "https://www.cockroachlabs.com",
    "about": "Cockroach Labs makes CockroachDB, a distributed SQL database."
  },
  {
    "id": "clickhouse",
    "name": "ClickHouse",
    "website": "https://clickhouse.com",
    "about": "ClickHouse, Inc. develops the open-source ClickHouse analytical database and runs ClickHouse Cloud."
  },
  {
    "id": "render",
    "name": "Render",
    "website": "https://render.com",
    "about": "Render is a cloud platform for hosting web apps, services and databases."
  },
  {
    "id": "fly-io",
    "name": "Fly.io",
    "website": "https://fly.io",
    "about": "Fly.io runs applications on lightweight virtual machines in regions around the world."
  },
  {
    "id": "temporal",
    "name": "Temporal Technologies",
    "website": "https://temporal.io",
    "about": "Temporal makes an open-source durable execution platform and runs Temporal Cloud."
  },
  {
    "id": "new-relic",
    "name": "New Relic",
    "website": "https://newrelic.com",
    "about": "New Relic makes an observability platform for monitoring applications and infrastructure."
  },
  {
    "id": "pinecone",
    "name": "Pinecone",
    "website": "https://www.pinecone.io",
    "about": "Pinecone makes a managed vector database for AI applications."
  },
  {
    "id": "aiven",
    "name": "Aiven",
    "website": "https://aiven.io",
    "about": "Aiven runs managed open-source data services such as PostgreSQL, Apache Kafka and OpenSearch."
  },
  {
    "id": "elastic",
    "name": "Elastic",
    "website": "https://www.elastic.co",
    "about": "Elastic makes Elasticsearch and a platform for search, observability and security."
  },
  {
    "id": "modal",
    "name": "Modal Labs",
    "website": "https://modal.com",
    "about": "Modal is a serverless cloud platform for running AI inference, training and batch jobs on GPUs and CPUs."
  },
  {
    "id": "groq",
    "name": "Groq",
    "website": "https://groq.com",
    "about": "Groq builds the LPU inference chip and runs GroqCloud, an API platform for fast inference on open models."
  },
  {
    "id": "qdrant",
    "name": "Qdrant",
    "website": "https://qdrant.tech",
    "about": "Qdrant develops an open-source vector search engine and the managed Qdrant Cloud service."
  },
  {
    "id": "runway",
    "name": "Runway",
    "website": "https://runwayml.com",
    "about": "Runway makes generative AI tools and models for video and image creation."
  },
  {
    "id": "suno",
    "name": "Suno",
    "website": "https://suno.com",
    "about": "Suno makes an AI music generator that creates songs from text prompts."
  },
  {
    "id": "deepgram",
    "name": "Deepgram",
    "website": "https://deepgram.com",
    "about": "Deepgram provides speech-to-text, text-to-speech and voice agent APIs."
  },
  {
    "id": "assemblyai",
    "name": "AssemblyAI",
    "website": "https://www.assemblyai.com",
    "about": "AssemblyAI provides speech-to-text and speech understanding APIs."
  },
  {
    "id": "langchain",
    "name": "LangChain",
    "website": "https://www.langchain.com",
    "about": "LangChain makes open-source frameworks for building LLM agents and LangSmith, a platform for agent observability and evaluation."
  },
  {
    "id": "together-ai",
    "name": "Together AI",
    "website": "https://www.together.ai",
    "about": "Together AI is a cloud platform for running, fine-tuning and training open-source AI models."
  },
  {
    "id": "tavily",
    "name": "Tavily",
    "website": "https://www.tavily.com",
    "about": "Tavily provides a web search and extraction API built for AI agents."
  },
  {
    "id": "weights-and-biases",
    "name": "Weights & Biases",
    "website": "https://wandb.ai",
    "about": "Weights & Biases, now part of CoreWeave, makes tools for tracking machine-learning experiments and evaluating AI applications."
  },
  {
    "id": "salesforce",
    "name": "Salesforce",
    "website": "https://www.salesforce.com",
    "about": "Salesforce makes cloud CRM software for sales, service, marketing and nonprofit organizations."
  },
  {
    "id": "clickup",
    "name": "ClickUp",
    "website": "https://clickup.com",
    "about": "ClickUp makes a work-management app that combines tasks, docs and team collaboration."
  },
  {
    "id": "docusign",
    "name": "Docusign",
    "website": "https://www.docusign.com",
    "about": "Docusign makes electronic signature and agreement management software."
  },
  {
    "id": "intuit",
    "name": "Intuit",
    "website": "https://www.intuit.com",
    "about": "Intuit makes financial software, including QuickBooks accounting for small businesses."
  },
  {
    "id": "freshbooks",
    "name": "FreshBooks",
    "website": "https://www.freshbooks.com",
    "about": "FreshBooks makes cloud accounting and invoicing software for small businesses and self-employed professionals."
  },
  {
    "id": "mailerlite",
    "name": "MailerLite",
    "website": "https://www.mailerlite.com",
    "about": "MailerLite makes email marketing, newsletter and landing page software."
  },
  {
    "id": "tally",
    "name": "Tally",
    "website": "https://tally.so",
    "about": "Tally makes a no-code online form builder."
  },
  {
    "id": "typeform",
    "name": "Typeform",
    "website": "https://www.typeform.com",
    "about": "Typeform makes conversational online forms, surveys and quizzes."
  },
  {
    "id": "squarespace",
    "name": "Squarespace",
    "website": "https://www.squarespace.com",
    "about": "Squarespace makes a hosted website builder with domains, commerce and marketing tools."
  },
  {
    "id": "box",
    "name": "Box",
    "website": "https://www.box.com",
    "about": "Box makes cloud content management, file sharing and e-signature software for organizations."
  },
  {
    "id": "bitwarden",
    "name": "Bitwarden",
    "website": "https://bitwarden.com",
    "about": "Bitwarden makes an open-source password manager for individuals and businesses."
  },
  {
    "id": "zapier",
    "name": "Zapier",
    "website": "https://zapier.com",
    "about": "Zapier makes no-code automation software that connects web apps."
  },
  {
    "id": "outdoo",
    "name": "Outdoo",
    "website": "https://www.outdoo.ai",
    "about": "Outdoo makes Outdoo AI, an AI roleplay and coaching platform for sales teams."
  },
  {
    "id": "postnitro",
    "name": "PostNitro",
    "website": "https://postnitro.ai",
    "about": "PostNitro makes an AI carousel maker and social media scheduler."
  },
  {
    "id": "coupler-io",
    "name": "Coupler.io",
    "website": "https://www.coupler.io",
    "about": "Coupler.io makes a data integration and automated reporting platform."
  },
  {
    "id": "plerdy",
    "name": "Plerdy",
    "website": "https://www.plerdy.com",
    "about": "Plerdy makes conversion rate optimization and website analytics tools."
  },
  {
    "id": "saner-ai",
    "name": "Saner.AI",
    "website": "https://www.saner.ai",
    "about": "Saner.AI makes an AI personal assistant for notes, tasks and planning."
  },
  {
    "id": "callhippo",
    "name": "CallHippo",
    "website": "https://callhippo.com",
    "about": "CallHippo makes a cloud phone system and call center software."
  },
  {
    "id": "seedeo",
    "name": "Seedeo",
    "website": "https://seedeo.ai",
    "about": "Seedeo runs an AI creative platform for video, image, music and voice generation."
  },
  {
    "id": "nord-security",
    "name": "Nord Security",
    "website": "https://nordsecurity.com",
    "about": "Nord Security makes consumer and business security software, including NordVPN, NordPass and NordLayer."
  },
  {
    "id": "bluehost",
    "name": "Bluehost",
    "website": "https://www.bluehost.com",
    "about": "Bluehost is a web hosting company offering shared, WordPress, VPS and dedicated hosting plus AI website tools. It is part of Newfold Digital."
  },
  {
    "id": "scalahosting",
    "name": "ScalaHosting",
    "website": "https://www.scalahosting.com",
    "about": "ScalaHosting is a web hosting company known for managed cloud VPS hosting with its own SPanel control panel."
  },
  {
    "id": "internxt",
    "name": "Internxt",
    "website": "https://internxt.com",
    "about": "Internxt is a Spanish company making end-to-end encrypted cloud storage and privacy tools."
  },
  {
    "id": "coursera",
    "name": "Coursera",
    "website": "https://www.coursera.org",
    "about": "Coursera is an online learning platform offering courses, certificates and degrees from universities and companies."
  },
  {
    "id": "wix",
    "name": "Wix.com",
    "website": "https://www.wix.com",
    "about": "Wix makes a hosted website builder with templates, domains, ecommerce and business tools."
  },
  {
    "id": "grammarly",
    "name": "Grammarly",
    "website": "https://www.grammarly.com",
    "about": "Grammarly makes an AI writing assistant that checks grammar, clarity and tone across apps and browsers."
  },
  {
    "id": "make",
    "name": "Make (Celonis)",
    "website": "https://www.make.com",
    "about": "Make is a visual no-code automation platform for connecting apps and building workflows."
  },
  {
    "id": "netlify",
    "name": "Netlify",
    "website": "https://www.netlify.com",
    "about": "Netlify is a web development platform for building, deploying and hosting websites and web apps."
  },
  {
    "id": "twilio",
    "name": "Twilio",
    "website": "https://www.twilio.com",
    "about": "Twilio provides cloud communications APIs for SMS, voice, email (SendGrid) and verification."
  },
  {
    "id": "resend",
    "name": "Resend",
    "website": "https://resend.com",
    "about": "Resend is an email API for developers to send transactional and marketing email."
  },
  {
    "id": "beehiiv",
    "name": "beehiiv",
    "website": "https://www.beehiiv.com",
    "about": "beehiiv is a newsletter platform with publishing, growth and monetization tools."
  },
  {
    "id": "replit",
    "name": "Replit",
    "website": "https://replit.com",
    "about": "Replit is a browser-based development platform with an AI agent for building and publishing apps."
  },
  {
    "id": "krea",
    "name": "Krea",
    "website": "https://www.krea.ai",
    "about": "Krea makes AI image and video generation and editing tools."
  },
  {
    "id": "supabase",
    "name": "Supabase",
    "website": "https://supabase.com",
    "about": "Supabase is an open-source Postgres development platform with auth, storage, realtime and edge functions."
  },
  {
    "id": "docker",
    "name": "Docker",
    "website": "https://www.docker.com",
    "about": "Docker makes tools for building, sharing and running containerized applications, including Docker Desktop and Docker Hub."
  },
  {
    "id": "obsidian",
    "name": "Obsidian",
    "website": "https://obsidian.md",
    "about": "Obsidian makes a local-first, Markdown-based note-taking app with optional Sync and Publish services."
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
    "brandColor": "#0E1C4E",
    "logo": {
      "src": "/logos/restream.svg",
      "alt": "Restream logo"
    }
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
    "brandColor": "#054ADA",
    "logo": {
      "src": "/logos/ahrefs.svg",
      "alt": "Ahrefs logo"
    }
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
    ],
    "logo": {
      "src": "/logos/typora.svg",
      "alt": "Typora logo"
    }
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
    },
    "logo": {
      "src": "/logos/documenso.svg",
      "alt": "Documenso logo"
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
  },
  {
    "id": "akamai-cloud",
    "slug": "akamai-cloud",
    "name": "Akamai Cloud",
    "providerId": "akamai",
    "tagline": "Cloud computing from Akamai, formerly Linode",
    "description": "Akamai Cloud (formerly Linode) offers virtual machines, managed Kubernetes, object and block storage, managed databases and load balancers.",
    "website": "https://www.akamai.com/cloud",
    "tags": [
      "Cloud",
      "Compute",
      "VPS",
      "Kubernetes"
    ],
    "brandColor": "#0099CC",
    "logo": {
      "src": "/logos/akamai-cloud.svg",
      "alt": "Akamai Cloud logo"
    }
  },
  {
    "id": "vultr",
    "slug": "vultr",
    "name": "Vultr",
    "providerId": "vultr",
    "tagline": "Independent cloud infrastructure",
    "description": "Vultr provides cloud compute, bare metal, GPU instances, managed Kubernetes, storage and managed databases in data centres worldwide.",
    "website": "https://www.vultr.com",
    "tags": [
      "Cloud",
      "Compute",
      "GPU",
      "VPS"
    ],
    "brandColor": "#007BFC",
    "logo": {
      "src": "/logos/vultr.svg",
      "alt": "Vultr logo"
    }
  },
  {
    "id": "ibm-cloud",
    "slug": "ibm-cloud",
    "name": "IBM Cloud",
    "providerId": "ibm",
    "tagline": "IBM's public cloud platform",
    "description": "IBM Cloud offers compute, Kubernetes, storage, databases and AI services, including a set of always-free products.",
    "website": "https://www.ibm.com/cloud",
    "tags": [
      "Cloud",
      "Compute",
      "Kubernetes",
      "Databases"
    ],
    "brandColor": "#0F62FE",
    "logo": {
      "src": "/logos/ibm-cloud.svg",
      "alt": "IBM Cloud logo"
    }
  },
  {
    "id": "confluent-cloud",
    "slug": "confluent-cloud",
    "name": "Confluent Cloud",
    "providerId": "confluent",
    "tagline": "Managed Apache Kafka and data streaming",
    "description": "Confluent Cloud is a fully managed data streaming service built on Apache Kafka, available on AWS, Google Cloud and Microsoft Azure.",
    "website": "https://www.confluent.io/confluent-cloud/",
    "tags": [
      "Data Streaming",
      "Kafka",
      "Cloud"
    ],
    "brandColor": "#173361",
    "logo": {
      "src": "/logos/confluent-cloud.svg",
      "alt": "Confluent Cloud logo"
    }
  },
  {
    "id": "snowflake",
    "slug": "snowflake",
    "name": "Snowflake",
    "providerId": "snowflake",
    "tagline": "The AI Data Cloud",
    "description": "Snowflake is a cloud data platform for data warehousing, data engineering, analytics, applications and AI.",
    "website": "https://www.snowflake.com",
    "tags": [
      "Data Warehouse",
      "Analytics",
      "Cloud",
      "AI"
    ],
    "brandColor": "#29B5E8",
    "logo": {
      "src": "/logos/snowflake.svg",
      "alt": "Snowflake logo"
    }
  },
  {
    "id": "alibaba-cloud",
    "slug": "alibaba-cloud",
    "name": "Alibaba Cloud",
    "providerId": "alibaba-cloud",
    "tagline": "Cloud computing and AI services from Alibaba Group",
    "description": "Alibaba Cloud provides compute, storage, networking, databases and AI services, including the Model Studio platform for Qwen models.",
    "website": "https://www.alibabacloud.com",
    "tags": [
      "Cloud",
      "Compute",
      "AI",
      "LLM API"
    ],
    "brandColor": "#FF6A00",
    "logo": {
      "src": "/logos/alibaba-cloud.svg",
      "alt": "Alibaba Cloud logo"
    }
  },
  {
    "id": "scaleway",
    "slug": "scaleway",
    "name": "Scaleway",
    "providerId": "scaleway",
    "tagline": "European cloud provider",
    "description": "Scaleway offers compute instances, GPU, Kubernetes, object storage, managed databases and serverless products from European data centres.",
    "website": "https://www.scaleway.com",
    "tags": [
      "Cloud",
      "Compute",
      "GPU",
      "Kubernetes"
    ],
    "brandColor": "#4F0599",
    "logo": {
      "src": "/logos/scaleway.svg",
      "alt": "Scaleway logo"
    }
  },
  {
    "id": "ovhcloud",
    "slug": "ovhcloud",
    "name": "OVHcloud",
    "providerId": "ovhcloud",
    "tagline": "European public and private cloud",
    "description": "OVHcloud provides public cloud, hosted private cloud, bare-metal servers and web hosting.",
    "website": "https://www.ovhcloud.com",
    "tags": [
      "Cloud",
      "Compute",
      "Bare Metal",
      "Kubernetes"
    ],
    "brandColor": "#000E9C",
    "logo": {
      "src": "/logos/ovhcloud.svg",
      "alt": "OVHcloud logo"
    }
  },
  {
    "id": "civo",
    "slug": "civo",
    "name": "Civo",
    "providerId": "civo",
    "tagline": "Cloud built around managed Kubernetes",
    "description": "Civo is a cloud platform offering managed Kubernetes, compute instances, GPUs, object storage and databases.",
    "website": "https://www.civo.com",
    "tags": [
      "Cloud",
      "Kubernetes",
      "Compute",
      "GPU"
    ],
    "brandColor": "#239DFF",
    "logo": {
      "src": "/logos/civo.svg",
      "alt": "Civo logo"
    }
  },
  {
    "id": "cockroachdb-cloud",
    "slug": "cockroachdb-cloud",
    "name": "CockroachDB Cloud",
    "providerId": "cockroach-labs",
    "tagline": "Managed distributed SQL",
    "description": "CockroachDB Cloud is the fully managed version of CockroachDB, a distributed SQL database built for resilience and scale.",
    "website": "https://www.cockroachlabs.com/product/cloud/",
    "tags": [
      "Database",
      "SQL",
      "Cloud"
    ],
    "brandColor": "#6933FF",
    "logo": {
      "src": "/logos/cockroachdb-cloud.svg",
      "alt": "CockroachDB Cloud logo"
    }
  },
  {
    "id": "clickhouse-cloud",
    "slug": "clickhouse-cloud",
    "name": "ClickHouse Cloud",
    "providerId": "clickhouse",
    "tagline": "Managed ClickHouse for real-time analytics",
    "description": "ClickHouse Cloud is the managed service for ClickHouse, an open-source column-oriented database for real-time analytics.",
    "website": "https://clickhouse.com/cloud",
    "tags": [
      "Database",
      "Analytics",
      "Cloud"
    ],
    "brandColor": "#FAFF69",
    "logo": {
      "src": "/logos/clickhouse-cloud.svg",
      "alt": "ClickHouse Cloud logo"
    }
  },
  {
    "id": "render",
    "slug": "render",
    "name": "Render",
    "providerId": "render",
    "tagline": "Cloud hosting for apps and databases",
    "description": "Render hosts web services, static sites, background workers, cron jobs and managed Postgres with Git-based deploys.",
    "website": "https://render.com",
    "tags": [
      "Hosting",
      "PaaS",
      "Cloud",
      "Postgres"
    ],
    "brandColor": "#8A05FF",
    "logo": {
      "src": "/logos/render.svg",
      "alt": "Render logo"
    }
  },
  {
    "id": "fly-io",
    "slug": "fly-io",
    "name": "Fly.io",
    "providerId": "fly-io",
    "tagline": "Run apps close to your users",
    "description": "Fly.io runs applications in Fly Machines, lightweight virtual machines, across regions worldwide, with volumes and Managed Postgres.",
    "website": "https://fly.io",
    "tags": [
      "Hosting",
      "PaaS",
      "Cloud",
      "Compute"
    ],
    "brandColor": "#7B3BE2",
    "logo": {
      "src": "/logos/fly-io.svg",
      "alt": "Fly.io logo"
    }
  },
  {
    "id": "temporal-cloud",
    "slug": "temporal-cloud",
    "name": "Temporal Cloud",
    "providerId": "temporal",
    "tagline": "Managed durable execution",
    "description": "Temporal Cloud is the managed service for Temporal, an open-source platform for running reliable, durable workflows in code.",
    "website": "https://temporal.io/cloud",
    "tags": [
      "Workflow Orchestration",
      "Developer Tools",
      "Cloud"
    ],
    "brandColor": "#141414",
    "logo": {
      "src": "/logos/temporal-cloud.svg",
      "alt": "Temporal Cloud logo"
    }
  },
  {
    "id": "new-relic",
    "slug": "new-relic",
    "name": "New Relic",
    "providerId": "new-relic",
    "tagline": "Observability platform",
    "description": "New Relic is an observability platform for application performance monitoring, infrastructure, logs and AI monitoring.",
    "website": "https://newrelic.com",
    "tags": [
      "Observability",
      "Monitoring",
      "APM"
    ],
    "brandColor": "#1CE783",
    "logo": {
      "src": "/logos/new-relic.svg",
      "alt": "New Relic logo"
    }
  },
  {
    "id": "pinecone",
    "slug": "pinecone",
    "name": "Pinecone",
    "providerId": "pinecone",
    "tagline": "Vector database for AI",
    "description": "Pinecone is a fully managed vector database used for semantic search, retrieval-augmented generation and other AI applications.",
    "website": "https://www.pinecone.io",
    "tags": [
      "Vector Database",
      "AI",
      "Database"
    ],
    "brandColor": "#000000",
    "logo": {
      "src": "/logos/pinecone.svg",
      "alt": "Pinecone logo"
    }
  },
  {
    "id": "aiven",
    "slug": "aiven",
    "name": "Aiven",
    "providerId": "aiven",
    "tagline": "Managed open-source data platform",
    "description": "Aiven runs managed PostgreSQL, MySQL, Apache Kafka, OpenSearch, ClickHouse, Valkey and other open-source data services on major clouds.",
    "website": "https://aiven.io",
    "tags": [
      "Database",
      "Kafka",
      "Postgres",
      "Cloud"
    ],
    "brandColor": "#FF3554"
  },
  {
    "id": "elastic-cloud",
    "slug": "elastic-cloud",
    "name": "Elastic Cloud",
    "providerId": "elastic",
    "tagline": "Managed Elasticsearch and Elastic Stack",
    "description": "Elastic Cloud is Elastic's managed service for Elasticsearch and the Elastic Stack, available as Serverless or Hosted deployments.",
    "website": "https://www.elastic.co/cloud",
    "tags": [
      "Search",
      "Observability",
      "Database",
      "Cloud"
    ],
    "brandColor": "#00BFB3",
    "logo": {
      "src": "/logos/elastic-cloud.svg",
      "alt": "Elastic Cloud logo"
    }
  },
  {
    "id": "claude-developer-platform",
    "slug": "claude-developer-platform",
    "name": "Claude Developer Platform",
    "providerId": "anthropic",
    "tagline": "Anthropic's API and console for building with Claude",
    "description": "The Claude Developer Platform gives developers API access to Anthropic's Claude models, managed through the Claude Console.",
    "website": "https://platform.claude.com",
    "tags": [
      "AI",
      "LLM API",
      "Developer Tools"
    ],
    "brandColor": "#D97757",
    "logo": {
      "src": "/logos/claude.svg",
      "alt": "Claude Developer Platform logo"
    }
  },
  {
    "id": "modal",
    "slug": "modal",
    "name": "Modal",
    "providerId": "modal",
    "tagline": "Serverless GPUs and CPUs for AI workloads",
    "description": "Modal runs Python code in the cloud on GPUs and CPUs, billed per second, for AI inference, fine-tuning, batch jobs and sandboxes.",
    "website": "https://modal.com",
    "tags": [
      "AI",
      "GPU Cloud",
      "Serverless",
      "Developer Tools"
    ],
    "brandColor": "#7FEE64",
    "logo": {
      "src": "/logos/modal.svg",
      "alt": "Modal logo"
    }
  },
  {
    "id": "groqcloud",
    "slug": "groqcloud",
    "name": "GroqCloud",
    "providerId": "groq",
    "tagline": "Fast inference API for open models",
    "description": "GroqCloud is Groq's API platform for running open large language, speech and vision models on Groq's LPU hardware.",
    "website": "https://console.groq.com",
    "tags": [
      "AI",
      "LLM API",
      "Inference"
    ],
    "brandColor": "#F55036",
    "logo": {
      "src": "/logos/groqcloud.svg",
      "alt": "GroqCloud logo"
    }
  },
  {
    "id": "qdrant-cloud",
    "slug": "qdrant-cloud",
    "name": "Qdrant Cloud",
    "providerId": "qdrant",
    "tagline": "Managed Qdrant vector search",
    "description": "Qdrant Cloud is the managed service for Qdrant, an open-source vector search engine, running on AWS, Google Cloud and Azure.",
    "website": "https://qdrant.tech/cloud/",
    "tags": [
      "AI",
      "Vector Database",
      "Search"
    ],
    "brandColor": "#DC244C",
    "logo": {
      "src": "/logos/qdrant-cloud.svg",
      "alt": "Qdrant Cloud logo"
    }
  },
  {
    "id": "cloudflare-workers-ai",
    "slug": "cloudflare-workers-ai",
    "name": "Cloudflare Workers AI",
    "providerId": "cloudflare",
    "tagline": "Run AI models on Cloudflare's network",
    "description": "Workers AI lets developers run open AI models on Cloudflare's GPUs from Workers, Pages or a REST API, billed in Neurons.",
    "website": "https://developers.cloudflare.com/workers-ai/",
    "tags": [
      "AI",
      "Inference",
      "Serverless"
    ],
    "brandColor": "#F38020",
    "logo": {
      "src": "/logos/cloudflare.svg",
      "alt": "Cloudflare Workers AI logo"
    }
  },
  {
    "id": "runway",
    "slug": "runway",
    "name": "Runway",
    "providerId": "runway",
    "tagline": "AI video and image generation",
    "description": "Runway is a web and mobile app for generating and editing video and images with AI models.",
    "website": "https://runwayml.com",
    "tags": [
      "AI",
      "Video",
      "Image Generation"
    ],
    "brandColor": "#000000",
    "logo": {
      "src": "/logos/runway.svg",
      "alt": "Runway logo"
    }
  },
  {
    "id": "suno",
    "slug": "suno",
    "name": "Suno",
    "providerId": "suno",
    "tagline": "AI music generator",
    "description": "Suno creates songs, with vocals and instrumentals, from text prompts and lyrics.",
    "website": "https://suno.com",
    "tags": [
      "AI",
      "Music",
      "Audio"
    ],
    "brandColor": "#000000",
    "logo": {
      "src": "/logos/suno.svg",
      "alt": "Suno logo"
    }
  },
  {
    "id": "deepgram",
    "slug": "deepgram",
    "name": "Deepgram",
    "providerId": "deepgram",
    "tagline": "Voice AI APIs for speech-to-text and text-to-speech",
    "description": "Deepgram offers APIs for speech-to-text, text-to-speech and voice agents for developers and enterprises.",
    "website": "https://deepgram.com",
    "tags": [
      "AI",
      "Speech-to-Text",
      "Voice API"
    ],
    "brandColor": "#13EF93",
    "logo": {
      "src": "/logos/deepgram.svg",
      "alt": "Deepgram logo"
    }
  },
  {
    "id": "assemblyai",
    "slug": "assemblyai",
    "name": "AssemblyAI",
    "providerId": "assemblyai",
    "tagline": "Speech-to-text and speech understanding API",
    "description": "AssemblyAI provides APIs for pre-recorded and real-time speech-to-text, plus speech understanding features and guardrails.",
    "website": "https://www.assemblyai.com",
    "tags": [
      "AI",
      "Speech-to-Text",
      "Voice API"
    ],
    "brandColor": "#2545D3",
    "logo": {
      "src": "/logos/assemblyai.svg",
      "alt": "AssemblyAI logo"
    }
  },
  {
    "id": "langsmith",
    "slug": "langsmith",
    "name": "LangSmith",
    "providerId": "langchain",
    "tagline": "Observability and evals for LLM agents",
    "description": "LangSmith is LangChain's platform for tracing, monitoring, evaluating and deploying LLM applications and agents.",
    "website": "https://www.langchain.com/langsmith",
    "tags": [
      "AI",
      "Observability",
      "LLM Ops"
    ],
    "brandColor": "#1C3C3C",
    "logo": {
      "src": "/logos/langsmith.svg",
      "alt": "LangSmith logo"
    }
  },
  {
    "id": "together-ai",
    "slug": "together-ai",
    "name": "Together AI",
    "providerId": "together-ai",
    "tagline": "AI cloud for open-source models",
    "description": "Together AI offers serverless inference, fine-tuning, dedicated endpoints and GPU clusters for open-source AI models.",
    "website": "https://www.together.ai",
    "tags": [
      "AI",
      "LLM API",
      "GPU Cloud"
    ],
    "brandColor": "#0F6FFF",
    "logo": {
      "src": "/logos/together-ai.svg",
      "alt": "Together AI logo"
    }
  },
  {
    "id": "tavily",
    "slug": "tavily",
    "name": "Tavily",
    "providerId": "tavily",
    "tagline": "Web search API for AI agents",
    "description": "Tavily is a search, extract and crawl API that gives AI agents and LLM apps real-time web results.",
    "website": "https://www.tavily.com",
    "tags": [
      "AI",
      "Search API",
      "Agents"
    ],
    "brandColor": "#468BFF",
    "logo": {
      "src": "/logos/tavily.svg",
      "alt": "Tavily logo"
    }
  },
  {
    "id": "weights-and-biases",
    "slug": "weights-and-biases",
    "name": "Weights & Biases",
    "providerId": "weights-and-biases",
    "tagline": "Experiment tracking and LLM evaluation",
    "description": "Weights & Biases (W&B) tracks machine-learning experiments, models and datasets, and its Weave toolkit evaluates and monitors LLM applications.",
    "website": "https://wandb.ai",
    "tags": [
      "AI",
      "MLOps",
      "Experiment Tracking"
    ],
    "brandColor": "#FFBE00",
    "logo": {
      "src": "/logos/weights-and-biases.svg",
      "alt": "Weights & Biases logo"
    }
  },
  {
    "id": "amazon-q-developer",
    "slug": "amazon-q-developer",
    "name": "Amazon Q Developer",
    "providerId": "aws",
    "tagline": "AWS's AI coding assistant",
    "description": "Amazon Q Developer is an AI assistant for software development and AWS, available in IDEs, the command line and the AWS console.",
    "website": "https://aws.amazon.com/q/developer/",
    "tags": [
      "AI",
      "Coding Assistant",
      "Developer Tools"
    ],
    "brandColor": "#232F3E",
    "logo": {
      "src": "/logos/aws.svg",
      "alt": "Amazon Q Developer logo"
    }
  },
  {
    "id": "salesforce",
    "slug": "salesforce",
    "name": "Salesforce",
    "providerId": "salesforce",
    "tagline": "Cloud CRM for sales, service and nonprofits",
    "description": "Salesforce is a cloud CRM platform. Its nonprofit edition, now called Agentforce Nonprofit (formerly Nonprofit Cloud), covers fundraising, programs and constituent management.",
    "website": "https://www.salesforce.com",
    "tags": [
      "CRM",
      "Sales",
      "Customer service",
      "Nonprofit CRM"
    ],
    "brandColor": "#00A1E0",
    "logo": {
      "src": "/logos/salesforce.svg",
      "alt": "Salesforce logo"
    }
  },
  {
    "id": "zoho-mail",
    "slug": "zoho-mail",
    "name": "Zoho Mail",
    "providerId": "zoho",
    "tagline": "Business email on your own domain",
    "description": "Zoho Mail is Zoho's hosted business email service with custom-domain mailboxes, webmail and mobile apps.",
    "website": "https://www.zoho.com/mail/",
    "tags": [
      "Email",
      "Business email",
      "Custom domain email"
    ],
    "brandColor": "#E42527",
    "logo": {
      "src": "/logos/zoho-mail.svg",
      "alt": "Zoho Mail logo"
    }
  },
  {
    "id": "clickup",
    "slug": "clickup",
    "name": "ClickUp",
    "providerId": "clickup",
    "tagline": "Tasks, docs and projects in one workspace",
    "description": "ClickUp is a work-management app for tasks, projects, docs and team collaboration.",
    "website": "https://clickup.com",
    "tags": [
      "Project management",
      "Task management",
      "Productivity",
      "Collaboration"
    ],
    "brandColor": "#7B68EE",
    "logo": {
      "src": "/logos/clickup.svg",
      "alt": "ClickUp logo"
    }
  },
  {
    "id": "docusign-esignature",
    "slug": "docusign-esignature",
    "name": "Docusign eSignature",
    "providerId": "docusign",
    "tagline": "Send and sign agreements electronically",
    "description": "Docusign eSignature lets you prepare documents, send them for signature and track signed agreements online.",
    "website": "https://www.docusign.com",
    "tags": [
      "E-signature",
      "Contracts",
      "Document workflow"
    ],
    "brandColor": "#4C00FF",
    "logo": {
      "src": "/logos/docusign-esignature.svg",
      "alt": "Docusign logo"
    }
  },
  {
    "id": "quickbooks-online",
    "slug": "quickbooks-online",
    "name": "QuickBooks Online",
    "providerId": "intuit",
    "tagline": "Cloud accounting for small businesses",
    "description": "QuickBooks Online is Intuit's cloud accounting software for invoicing, expenses, bookkeeping and reporting.",
    "website": "https://quickbooks.intuit.com",
    "tags": [
      "Accounting",
      "Bookkeeping",
      "Invoicing",
      "Small business"
    ],
    "brandColor": "#2CA01C",
    "logo": {
      "src": "/logos/quickbooks-online.svg",
      "alt": "QuickBooks Online logo"
    }
  },
  {
    "id": "freshbooks",
    "slug": "freshbooks",
    "name": "FreshBooks",
    "providerId": "freshbooks",
    "tagline": "Accounting and invoicing for small businesses",
    "description": "FreshBooks is cloud accounting software for invoicing, expenses, time tracking and payments, aimed at small businesses and self-employed professionals.",
    "website": "https://www.freshbooks.com",
    "tags": [
      "Accounting",
      "Invoicing",
      "Time tracking",
      "Small business"
    ],
    "brandColor": "#0075DD"
  },
  {
    "id": "mailerlite",
    "slug": "mailerlite",
    "name": "MailerLite",
    "providerId": "mailerlite",
    "tagline": "Email marketing and newsletters",
    "description": "MailerLite is an email marketing platform for newsletters, automations, landing pages and signup forms.",
    "website": "https://www.mailerlite.com",
    "tags": [
      "Email marketing",
      "Newsletters",
      "Marketing automation"
    ],
    "brandColor": "#09C269"
  },
  {
    "id": "tally",
    "slug": "tally",
    "name": "Tally",
    "providerId": "tally",
    "tagline": "Free no-code form builder",
    "description": "Tally is a no-code form builder for forms, surveys and quizzes that works like a text document.",
    "website": "https://tally.so",
    "tags": [
      "Forms",
      "Surveys",
      "No-code"
    ],
    "brandColor": "#000000"
  },
  {
    "id": "typeform",
    "slug": "typeform",
    "name": "Typeform",
    "providerId": "typeform",
    "tagline": "Conversational forms and surveys",
    "description": "Typeform is an online form builder for conversational forms, surveys and quizzes, with integrations and response analytics.",
    "website": "https://www.typeform.com",
    "tags": [
      "Forms",
      "Surveys",
      "Lead generation"
    ],
    "brandColor": "#262627",
    "logo": {
      "src": "/logos/typeform.svg",
      "alt": "Typeform logo"
    }
  },
  {
    "id": "squarespace",
    "slug": "squarespace",
    "name": "Squarespace",
    "providerId": "squarespace",
    "tagline": "Website builder with hosting and commerce",
    "description": "Squarespace is a hosted website builder with templates, domains, online store and marketing tools.",
    "website": "https://www.squarespace.com",
    "tags": [
      "Website builder",
      "Hosting",
      "Ecommerce"
    ],
    "brandColor": "#000000",
    "logo": {
      "src": "/logos/squarespace.svg",
      "alt": "Squarespace logo"
    }
  },
  {
    "id": "box",
    "slug": "box",
    "name": "Box",
    "providerId": "box",
    "tagline": "Cloud content management and file sharing",
    "description": "Box is a cloud content management platform for storing, sharing and collaborating on files, with e-signature and security controls.",
    "website": "https://www.box.com",
    "tags": [
      "Cloud storage",
      "File sharing",
      "Collaboration",
      "E-signature"
    ],
    "brandColor": "#0061D5",
    "logo": {
      "src": "/logos/box.svg",
      "alt": "Box logo"
    }
  },
  {
    "id": "bitwarden",
    "slug": "bitwarden",
    "name": "Bitwarden Password Manager",
    "providerId": "bitwarden",
    "tagline": "Open-source password manager for teams",
    "description": "Bitwarden Password Manager stores and shares passwords and other credentials, with Teams and Enterprise plans for organizations.",
    "website": "https://bitwarden.com",
    "tags": [
      "Password manager",
      "Security",
      "Credential sharing"
    ],
    "brandColor": "#175DDC",
    "logo": {
      "src": "/logos/bitwarden.svg",
      "alt": "Bitwarden Password Manager logo"
    }
  },
  {
    "id": "zapier",
    "slug": "zapier",
    "name": "Zapier",
    "providerId": "zapier",
    "tagline": "No-code automation between apps",
    "description": "Zapier connects web apps and automates workflows between them without code.",
    "website": "https://zapier.com",
    "tags": [
      "Automation",
      "Integrations",
      "No-code",
      "Workflows"
    ],
    "brandColor": "#FF4F00",
    "logo": {
      "src": "/logos/zapier.svg",
      "alt": "Zapier logo"
    }
  },
  {
    "id": "outdoo-ai",
    "slug": "outdoo-ai",
    "name": "Outdoo AI",
    "providerId": "outdoo",
    "tagline": "AI sales roleplay and coaching for sales teams",
    "description": "Outdoo AI is a sales training platform where reps practise calls in AI roleplays and get coaching on how they did. It has a free plan with limited roleplay credits, a usage-based tier and custom-quoted enterprise plans.",
    "website": "https://www.outdoo.ai",
    "tags": [
      "AI",
      "Sales training",
      "Roleplay",
      "Coaching"
    ],
    "brandColor": "#5B3DF5"
  },
  {
    "id": "postnitro",
    "slug": "postnitro",
    "name": "PostNitro",
    "providerId": "postnitro",
    "tagline": "AI carousel maker and social media scheduler",
    "description": "PostNitro creates social media carousels and posts with AI, and its higher plans schedule and publish them to connected social accounts. The Free and Starter plans create and export content; Creator+ and Team+ add scheduling and publishing.",
    "website": "https://postnitro.ai",
    "tags": [
      "AI",
      "Social media",
      "Carousels",
      "Scheduling"
    ],
    "brandColor": "#6D4AFF"
  },
  {
    "id": "coupler-io",
    "slug": "coupler-io",
    "name": "Coupler.io",
    "providerId": "coupler-io",
    "tagline": "Data integration and automated reporting",
    "description": "Coupler.io connects business apps and data sources and moves the data on a schedule into spreadsheets, BI tools and dashboards for reporting, with AI features for analysing it.",
    "website": "https://www.coupler.io",
    "tags": [
      "Data integration",
      "Reporting",
      "Dashboards",
      "Automation"
    ],
    "brandColor": "#FF5A1F"
  },
  {
    "id": "plerdy",
    "slug": "plerdy",
    "name": "Plerdy",
    "providerId": "plerdy",
    "tagline": "Website analytics and conversion rate optimization",
    "description": "Plerdy is a conversion rate optimization tool for websites and online stores, with heatmaps, session recordings, funnels, pop-up forms and SEO checks.",
    "website": "https://www.plerdy.com",
    "tags": [
      "Analytics",
      "Heatmaps",
      "Conversion optimization",
      "SEO"
    ],
    "brandColor": "#F26B21"
  },
  {
    "id": "saner-ai",
    "slug": "saner-ai",
    "name": "Saner.AI",
    "providerId": "saner-ai",
    "tagline": "AI personal assistant for notes, tasks and planning",
    "description": "Saner.AI is an AI personal assistant that keeps notes, tasks and calendar together and helps plan the day. It is marketed in particular to people with ADHD.",
    "website": "https://www.saner.ai",
    "tags": [
      "AI",
      "Personal assistant",
      "Notes",
      "Tasks"
    ],
    "brandColor": "#4F46E5"
  },
  {
    "id": "callhippo",
    "slug": "callhippo",
    "name": "CallHippo",
    "providerId": "callhippo",
    "tagline": "Cloud phone system for sales and support teams",
    "description": "CallHippo is a cloud VoIP phone system for businesses, with virtual phone numbers, call center features, click-to-call and AI voice agents for sales and support teams.",
    "website": "https://callhippo.com",
    "tags": [
      "VoIP",
      "Business phone",
      "Call center"
    ],
    "brandColor": "#2B60DE"
  },
  {
    "id": "seedeo",
    "slug": "seedeo",
    "name": "Seedeo",
    "providerId": "seedeo",
    "tagline": "AI creative platform for video, image, music and voice",
    "description": "Seedeo is an AI creative platform that gives access to video and image generation models such as Kling 3.0 and Seedance 2.0 in one place. Paid plans include monthly credits, and unused credits roll over.",
    "website": "https://seedeo.ai",
    "tags": [
      "AI",
      "Video generation",
      "Image generation",
      "Music"
    ],
    "brandColor": "#111111"
  },
  {
    "id": "nordvpn",
    "slug": "nordvpn",
    "name": "NordVPN",
    "providerId": "nord-security",
    "tagline": "VPN service for private, encrypted browsing",
    "description": "NordVPN is a subscription VPN service from Nord Security. It encrypts your internet traffic and routes it through servers in many countries, with apps for desktop, mobile and browsers. Higher plans add threat protection, a password manager and other security tools.",
    "website": "https://nordvpn.com",
    "tags": [
      "VPN",
      "Privacy",
      "Security",
      "Threat protection"
    ],
    "brandColor": "#4687FF",
    "logo": {
      "src": "/logos/nordvpn.svg",
      "alt": "NordVPN logo"
    }
  },
  {
    "id": "bluehost-web-hosting",
    "slug": "bluehost-web-hosting",
    "name": "Bluehost",
    "providerId": "bluehost",
    "tagline": "Web hosting for WordPress and small business sites",
    "description": "Bluehost sells shared and WordPress hosting, VPS, virtual dedicated and dedicated servers, along with AI tools such as an AI website builder. Hosting plans include SSL, malware scanning and backups.",
    "website": "https://www.bluehost.com",
    "tags": [
      "Web hosting",
      "WordPress hosting",
      "VPS",
      "Website builder",
      "Domains"
    ],
    "brandColor": "#196BDE",
    "logo": {
      "src": "/logos/bluehost-web-hosting.svg",
      "alt": "Bluehost logo"
    }
  },
  {
    "id": "scalahosting-managed-cloud",
    "slug": "scalahosting-managed-cloud",
    "name": "ScalaHosting Managed Cloud",
    "providerId": "scalahosting",
    "tagline": "Managed cloud VPS hosting with SPanel",
    "description": "ScalaHosting's managed cloud plans run on dedicated cloud resources and host unlimited websites. They come with ScalaHosting's SPanel control panel, a dedicated IP and priority support.",
    "website": "https://www.scalahosting.com/managed-cloud-hosting.html",
    "tags": [
      "Web hosting",
      "Managed VPS",
      "Cloud hosting",
      "WordPress hosting"
    ],
    "brandColor": "#1E5BD8"
  },
  {
    "id": "internxt",
    "slug": "internxt",
    "name": "Internxt",
    "providerId": "internxt",
    "tagline": "Encrypted cloud storage with privacy tools",
    "description": "Internxt offers end-to-end encrypted cloud storage on subscription or lifetime plans. Paid plans also bundle privacy tools such as antivirus, a cleaner, a VPN, video meetings and mail.",
    "website": "https://internxt.com",
    "tags": [
      "Cloud storage",
      "Encrypted storage",
      "Backup",
      "Privacy",
      "VPN"
    ],
    "brandColor": "#0066FF",
    "logo": {
      "src": "/logos/internxt.svg",
      "alt": "Internxt logo"
    }
  },
  {
    "id": "coursera-plus",
    "slug": "coursera-plus",
    "name": "Coursera Plus",
    "providerId": "coursera",
    "tagline": "Subscription for unlimited access to most Coursera courses and certificates",
    "description": "Coursera Plus is Coursera's subscription that gives unlimited access to thousands of courses, Specializations and Professional Certificates from universities and companies such as Google and IBM, billed monthly or yearly.",
    "website": "https://www.coursera.org/courseraplus",
    "tags": [
      "Online learning",
      "Courses",
      "Certificates"
    ],
    "brandColor": "#0056D2",
    "logo": {
      "src": "/logos/coursera-plus.svg",
      "alt": "Coursera Plus logo"
    }
  },
  {
    "id": "wix",
    "slug": "wix",
    "name": "Wix",
    "providerId": "wix",
    "tagline": "Website builder with hosting, domains and ecommerce",
    "description": "Wix is a hosted website builder with drag-and-drop editing, templates, domains, online store and business tools, sold as monthly or yearly Premium plans.",
    "website": "https://www.wix.com",
    "tags": [
      "Website builder",
      "Hosting",
      "Ecommerce"
    ],
    "brandColor": "#116DFF",
    "logo": {
      "src": "/logos/wix.svg",
      "alt": "Wix logo"
    }
  },
  {
    "id": "microsoft-365-personal-family",
    "slug": "microsoft-365-personal-family",
    "name": "Microsoft 365 Personal, Family and Premium",
    "providerId": "microsoft",
    "tagline": "Word, Excel, PowerPoint, Outlook, OneDrive storage and Copilot for home users",
    "description": "Microsoft 365 Personal, Family and Premium are Microsoft's consumer subscriptions with the Office apps, OneDrive cloud storage and Copilot AI features, for one person (Personal, Premium) or shared with up to six people (Family).",
    "website": "https://www.microsoft.com/en-us/microsoft-365",
    "tags": [
      "Office suite",
      "Cloud storage",
      "AI assistant"
    ],
    "brandColor": "#0078D4",
    "logo": {
      "src": "/logos/microsoft-365-personal-family.svg",
      "alt": "Microsoft 365 Personal, Family and Premium logo"
    }
  },
  {
    "id": "dropbox",
    "slug": "dropbox",
    "name": "Dropbox",
    "providerId": "dropbox",
    "tagline": "Cloud storage, file sharing and backup for individuals and teams",
    "description": "Dropbox is a cloud storage and file-sharing service with sync, backup, file transfer and team admin tools, sold as individual and team plans.",
    "website": "https://www.dropbox.com",
    "tags": [
      "Cloud storage",
      "File sharing",
      "Backup"
    ],
    "brandColor": "#0061FF",
    "logo": {
      "src": "/logos/dropbox.svg",
      "alt": "Dropbox logo"
    }
  },
  {
    "id": "grammarly",
    "slug": "grammarly",
    "name": "Grammarly",
    "providerId": "grammarly",
    "tagline": "AI writing assistant for grammar, clarity and tone",
    "description": "Grammarly checks spelling, grammar, clarity and tone and offers AI writing help across the web, desktop apps and mobile keyboards. Grammarly Pro adds advanced suggestions and more AI usage.",
    "website": "https://www.grammarly.com",
    "tags": [
      "Writing assistant",
      "AI writing",
      "Grammar checker"
    ],
    "brandColor": "#15C39A",
    "logo": {
      "src": "/logos/grammarly.svg",
      "alt": "Grammarly logo"
    }
  },
  {
    "id": "loom",
    "slug": "loom",
    "name": "Loom",
    "providerId": "atlassian",
    "tagline": "Async video messaging and screen recording",
    "description": "Loom records your screen, camera and voice to share video messages, with AI features for titles, summaries and documents. Loom is part of Atlassian.",
    "website": "https://www.loom.com",
    "tags": [
      "Screen recording",
      "Video messaging",
      "Collaboration"
    ],
    "brandColor": "#625DF5",
    "logo": {
      "src": "/logos/loom.svg",
      "alt": "Loom logo"
    }
  },
  {
    "id": "make",
    "slug": "make",
    "name": "Make",
    "providerId": "make",
    "tagline": "Visual no-code workflow automation",
    "description": "Make lets you design automated workflows (scenarios) that connect thousands of apps and AI services on a visual canvas, billed by credits used.",
    "website": "https://www.make.com",
    "tags": [
      "Automation",
      "No-code",
      "Integrations"
    ],
    "brandColor": "#6D00CC",
    "logo": {
      "src": "/logos/make.svg",
      "alt": "Make logo"
    }
  },
  {
    "id": "netlify",
    "slug": "netlify",
    "name": "Netlify",
    "providerId": "netlify",
    "tagline": "Platform for building, deploying and hosting web apps",
    "description": "Netlify builds and deploys websites and web apps from Git, with global hosting, serverless and edge functions, forms and preview deploys, billed on credit-based plans.",
    "website": "https://www.netlify.com",
    "tags": [
      "Web hosting",
      "Deployment",
      "Serverless"
    ],
    "brandColor": "#00C7B7",
    "logo": {
      "src": "/logos/netlify.svg",
      "alt": "Netlify logo"
    }
  },
  {
    "id": "twilio",
    "slug": "twilio",
    "name": "Twilio",
    "providerId": "twilio",
    "tagline": "APIs for SMS, voice, email and verification",
    "description": "Twilio's communications platform provides APIs for programmable messaging, voice calls, email, phone numbers and user verification.",
    "website": "https://www.twilio.com",
    "tags": [
      "SMS API",
      "Voice API",
      "Communications"
    ],
    "brandColor": "#F22F46",
    "logo": {
      "src": "/logos/twilio.svg",
      "alt": "Twilio logo"
    }
  },
  {
    "id": "sendgrid",
    "slug": "sendgrid",
    "name": "Twilio SendGrid",
    "providerId": "twilio",
    "tagline": "Email API and email marketing campaigns",
    "description": "Twilio SendGrid is an email delivery platform with an Email API/SMTP relay for transactional email and a Marketing Campaigns product for newsletters and promotions.",
    "website": "https://sendgrid.com",
    "tags": [
      "Email API",
      "Transactional email",
      "Email marketing"
    ],
    "brandColor": "#1A82E2",
    "logo": {
      "src": "/logos/sendgrid.svg",
      "alt": "Twilio SendGrid logo"
    }
  },
  {
    "id": "resend",
    "slug": "resend",
    "name": "Resend",
    "providerId": "resend",
    "tagline": "Email API for developers",
    "description": "Resend is an email API with SDKs for popular languages, React Email support, domain management, inbound email and marketing broadcasts.",
    "website": "https://resend.com",
    "tags": [
      "Email API",
      "Transactional email",
      "Developer tools"
    ],
    "brandColor": "#000000",
    "logo": {
      "src": "/logos/resend.svg",
      "alt": "Resend logo"
    }
  },
  {
    "id": "beehiiv",
    "slug": "beehiiv",
    "name": "beehiiv",
    "providerId": "beehiiv",
    "tagline": "Newsletter platform for writing, growing and monetizing",
    "description": "beehiiv is a newsletter platform with an editor, website builder, podcast hosting, community features, growth tools and monetization such as ads and paid subscriptions.",
    "website": "https://www.beehiiv.com",
    "tags": [
      "Newsletter",
      "Email marketing",
      "Creator tools"
    ],
    "brandColor": "#000000",
    "logo": {
      "src": "/logos/beehiiv.svg",
      "alt": "beehiiv logo"
    }
  },
  {
    "id": "v0",
    "slug": "v0",
    "name": "v0",
    "providerId": "vercel",
    "tagline": "Vercel's AI app builder",
    "description": "v0 is Vercel's AI agent that generates and edits web apps and UI from prompts, with one-click deploys to Vercel. Usage is billed in credits.",
    "website": "https://v0.app",
    "tags": [
      "AI app builder",
      "AI coding",
      "Web development"
    ],
    "brandColor": "#000000",
    "logo": {
      "src": "/logos/v0.svg",
      "alt": "v0 logo"
    }
  },
  {
    "id": "replit",
    "slug": "replit",
    "name": "Replit",
    "providerId": "replit",
    "tagline": "Build and publish apps in the browser with an AI agent",
    "description": "Replit is a cloud development environment where you can code or ask Replit Agent to build apps, then publish them with hosting, databases and integrations.",
    "website": "https://replit.com",
    "tags": [
      "AI app builder",
      "Cloud IDE",
      "Hosting"
    ],
    "brandColor": "#F26207",
    "logo": {
      "src": "/logos/replit.svg",
      "alt": "Replit logo"
    }
  },
  {
    "id": "krea",
    "slug": "krea",
    "name": "Krea",
    "providerId": "krea",
    "tagline": "AI image and video generation and editing",
    "description": "Krea offers real-time and high-quality AI image generation, editing, upscaling and video tools using its own Krea models and third-party models, billed in compute units.",
    "website": "https://www.krea.ai",
    "tags": [
      "AI image generation",
      "AI video",
      "Creative tools"
    ],
    "brandColor": "#000000",
    "logo": {
      "src": "/logos/krea.svg",
      "alt": "Krea logo"
    }
  },
  {
    "id": "firebase",
    "slug": "firebase",
    "name": "Firebase",
    "providerId": "google",
    "tagline": "Google's app development platform",
    "description": "Firebase is Google's platform for building mobile and web apps, with Firestore and Realtime Database, Authentication, Hosting, Cloud Messaging, Crashlytics, AI Logic and more.",
    "website": "https://firebase.google.com",
    "tags": [
      "Backend as a service",
      "Database",
      "Mobile development"
    ],
    "brandColor": "#FFCA28",
    "logo": {
      "src": "/logos/firebase.svg",
      "alt": "Firebase logo"
    }
  },
  {
    "id": "supabase",
    "slug": "supabase",
    "name": "Supabase",
    "providerId": "supabase",
    "tagline": "Postgres development platform with auth, storage and APIs",
    "description": "Supabase gives every project a dedicated Postgres database plus authentication, instant APIs, file storage, realtime subscriptions, edge functions and vector support. The platform is open source and offered as a hosted service.",
    "website": "https://supabase.com",
    "tags": [
      "Database",
      "Backend as a service",
      "Postgres"
    ],
    "brandColor": "#3ECF8E",
    "openSource": {
      "license": "Apache-2.0",
      "repoUrl": "https://github.com/supabase/supabase"
    },
    "logo": {
      "src": "/logos/supabase.svg",
      "alt": "Supabase logo"
    }
  },
  {
    "id": "docker",
    "slug": "docker",
    "name": "Docker",
    "providerId": "docker",
    "tagline": "Container development platform: Docker Desktop, Docker Hub and more",
    "description": "Docker provides Docker Desktop for building and running containers locally, Docker Hub for sharing images, and tools such as Docker Scout and Docker Hardened Images, under Personal, Pro, Team and Business subscriptions.",
    "website": "https://www.docker.com",
    "tags": [
      "Containers",
      "DevOps",
      "Developer tools"
    ],
    "brandColor": "#1D63ED",
    "logo": {
      "src": "/logos/docker.svg",
      "alt": "Docker logo"
    }
  },
  {
    "id": "obsidian",
    "slug": "obsidian",
    "name": "Obsidian",
    "providerId": "obsidian",
    "tagline": "Private, local-first Markdown notes app",
    "description": "Obsidian is a note-taking and knowledge-base app that stores notes as local Markdown files, with links, graph view and plugins. Obsidian Sync and Obsidian Publish are optional paid add-on services.",
    "website": "https://obsidian.md",
    "tags": [
      "Note-taking",
      "Knowledge base",
      "Productivity"
    ],
    "brandColor": "#7F6DF2",
    "logo": {
      "src": "/logos/obsidian.svg",
      "alt": "Obsidian logo"
    }
  }
];
