# ⚡ LeadFlow CRM — High-Velocity Lead Management (Malaysia RM Edition)

> **High-Velocity CRM & WhatsApp Sales Pipeline** built with React 19, TypeScript, Vite, and Tailwind CSS v4. Engineered specifically for Malaysian startups, digital marketing agencies (running Meta & TikTok Ads campaigns), and high-growth B2B sales teams. The public sales page and `/demo` sandbox are zero-backend (LocalStorage only); the private `/owner` CRM module is backed by a real Neon Postgres database via Vercel Serverless Functions.

<p align="center">
  <img src="public/brand-logo.svg" alt="LeadFlow CRM Brand Logo" width="360" />
</p>

<p align="center">
  <a href="https://myleads-flow.vercel.app/"><img src="https://img.shields.io/badge/Live_Demo-myleads--flow.vercel.app-10b981?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" /></a>
</p>

<p align="center">
  <a href="https://github.com/sharilm/leads-flow"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0+-3178c6.svg?logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61dafb.svg" alt="React 19" /></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-8.2-646cff.svg" alt="Vite 8" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg" alt="Tailwind CSS v4" /></a>
  <a href="https://neon.tech"><img src="https://img.shields.io/badge/Storage-LocalStorage_Demo_%2B_Neon_Owner_CRM-10b981.svg" alt="LocalStorage demo plus Neon-backed Owner CRM" /></a>
  <a href="https://wa.me/60135928812"><img src="https://img.shields.io/badge/WhatsApp-Contact_Developer-25D366?logo=whatsapp&logoColor=white" alt="WhatsApp Developer" /></a>
</p>

---

## 👨‍💻 Proof of Concept (POC) & Custom Development

This project is an interactive **Proof of Concept (POC)** prototype developed by **Sharil**.

* 🌐 **Sales Landing Page (Homepage)**: [https://myleads-flow.vercel.app/](https://myleads-flow.vercel.app/)
* 🧪 **Live Interactive Demo (CRM App)**: [https://myleads-flow.vercel.app/demo](https://myleads-flow.vercel.app/demo)
* 📖 **Panduan Lengkap SEO & Google Indexing**: [docs/PANDUAN_SETUP_GOOGLE_SEO_DAN_INDEXING.md](docs/PANDUAN_SETUP_GOOGLE_SEO_DAN_INDEXING.md)

If you or your business are interested in:
* Building a **Custom Enterprise CRM / Sales Pipeline** tailored to your workflow.
* Automating **WhatsApp Inbound Leads** with Meta Ads, TikTok Ads, and Webhooks.
* Developing custom web applications, SaaS dashboards, or client management software.

👉 **[Get in Touch on WhatsApp](https://wa.me/60135928812?text=Hi%20Sharil,%20I%20tested%20the%20LeadFlow%20CRM%20POC%20prototype%20and%20would%20like%20to%20discuss%20building%20a%20custom%20CRM%20/%20software%20solution.)**

---

## 💎 Brand Identity & Philosophy

**LeadFlow CRM** embodies one core mission: ***"Capture fast. Close faster."***

In high-velocity digital advertising markets like Malaysia (where leads generated from TikTok Ads and Meta Ads cool down rapidly if uncontacted within 15 minutes), every minute of latency directly damages deal conversion rates. LeadFlow equips sales closers with frictionless 1-click WhatsApp outreach, BANT qualification, follow-up automation, official quotations, tax invoices, and real-time revenue analytics.

### Visual Design Tokens
* **Primary Brand Accents**: `Emerald Surge (#10b981 / #059669)` — represents velocity, deal closures, and positive cash flow.
* **Surface Neutral Palette**: `Onyx & Slate Zinc (#09090b / #18181b / #27272a)` — high-contrast readability in both Dark and Light modes.
* **Typography**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) for ultra-legible UI labels & JetBrains Mono for monetary figures (`RM 28,500`) and IDs.
* **Aesthetics**: Strictly crafted with clean Zinc/Neutral borders, subtle shadows, zero neon clichés, and full responsive fluidity.

---

## 🧭 Site Structure: Landing Page, Live Demo & Owner CRM

The app renders one of three experiences based on the URL path (simple pathname check in `src/App.tsx`, no router dependency):

* **`/` — Sales Landing Page** (`src/pages/Landing.tsx`): Conversion-focused marketing page — hero, problem/solution, feature grid, pricing tiers (RM 99 / RM 249 / RM 499), industry use-cases, comparison table, FAQ, and a **Request Demo** form. This is the homepage and the page indexed by Google.
* **`/demo` — Interactive CRM Prototype**: The full Kanban/Table/Analytics application described below, running entirely on LocalStorage sample data, for prospects to try hands-on without signing up.
* **`/owner` — Private Owner CRM** (`src/pages/Owner.tsx`): Password-gated, same Kanban/Table/Analytics UI as `/demo`, but backed by real leads in Neon Postgres. Every `/` Request Demo submission lands directly in its "New Leads" column.

---

## ✨ Key Features

### 1. 🇲🇾 Malaysian Market Adapted (Ringgit Malaysia & Phone Normalizer)
* **Malaysian Ringgit (RM)**: All deal values, pipeline stage totals, and revenue metrics are natively formatted in standard Malaysian Ringgit (e.g. `RM 28,500`).
* **Smart Phone Normalizer**: Automatically normalizes local phone formats (`012-345 6789`, `+6019...`, `011...`, `6012...`) into standard international `wa.me/601...` direct links.

### 2. 🔷 Full TypeScript Architecture & Type Safety
* **Strict Type Checking**: Strict mode (`strict: true`) enabled across all domain models, context providers, utility functions, and components.
* **Domain Model Typings**: Strongly typed interfaces for `Lead`, `StageId`, `PriorityId`, `Quotation`, `Invoice`, `DocumentItem`, `BANT`, `Activity`, and `Stats`.

### 3. 📄 Official Quotations & Tax Invoices (A4 Print Isolation)
* **Dynamic Document Builder**: Create itemized quotations (`QT-2026-xxxx`) and invoices (`INV-2026-xxxx`) with custom line items, unit prices, and notes.
* **Pure A4 Printable Isolation**: Clean print mode that strips away all application UI (navbars, drawers, buttons, backdrops) and outputs ONLY the official document with corporate letterhead, SSM details, Maybank payment info, and digital signatures.
* **1-Click Stage Automation**: Convert approved quotations to Tax Invoices and automatically advance the lead to *Closed Won*.

### 4. 💬 1-Click WhatsApp Direct Actions (`wa.me`)
* **Instant WhatsApp Launcher**: 1-click direct link to open WhatsApp with pre-filled, personalized messages (`{{name}}`, `{{company}}`, `{{dealValue}}`, `{{agent}}`).
* **5 High-Converting Sales Templates**:
  - 🌟 **Introduction & Greeting (First Contact)**: Warm inbound touchpoint following ad inquiries.
  - 📄 **Proposal & Quotation Follow-Up**: Direct follow-up referencing sent quote value.
  - 🎥 **15-Minute Live Demo Invitation**: Google Meet walkthrough pitch to showcase time savings.
  - 🎁 **Limited-Time Incentive / Closing Offer**: Discount & free month onboarding urgency trigger.
  - 🔔 **Gentle Follow-Up / Ghosting Recovery**: Soft nudge for uncontacted / blue-ticked prospects.

### 5. 🗂️ Interactive Kanban Pipeline (Drag & Drop)
* **Visual Pipeline Stages**: `New Leads` ➔ `Contacted` ➔ `Qualified` ➔ `Proposal Sent` ➔ `Closed Won` / `Closed Lost`.
* **Native Drag & Drop**: Smooth column-to-column lead transitions with visual drop-zone feedback.
* **Real-Time Column Totals**: Live calculation of active deal counts and aggregate RM value per stage.

### 6. 📋 Table View with Multi-Attribute Filtering & Sorting
* **Global Search**: Search across lead names, companies, phone numbers, notes, and tags simultaneously.
* **Granular Filtering**: Filter by marketing channel (`Meta Ads`, `TikTok Ads`, `Website Form`, `Direct WhatsApp`, etc.) and priority (`Urgent`, `High`, `Medium`, `Low`).
* **Dynamic Sorting**: Sort by `Newest First`, `Value: High to Low`, `Value: Low to High`, `Follow-up Date`, or `Name (A-Z)`.

### 7. 📑 Slide-Over Lead Drawer & Activity Logger
* **Inline Profile Editing**: Update prospect name, company, phone, email, and deal value in place.
* **BANT Qualification Checklist**: Verify **Budget**, **Authority**, **Need**, and **Timeline** before formal quoting.
* **Smart Follow-Up Scheduler**: Quick date picker with shortcut buttons (`Today`, `Tomorrow`, `+3 Days`, `+1 Week`) and visual overdue badges.
* **Multi-Channel Activity Timeline**: Log and timestamp interactions categorized by `WhatsApp`, `Phone Call`, `Meeting`, or `Sales Note`.

### 8. 📊 Conversion Funnel & Ad Channel Analytics
* **Lead Progression Funnel**: Top-to-bottom visual drop-off analysis across pipeline stages.
* **Channel Attribution & Revenue**: Track lead volume and revenue contribution per ad source (*Meta Ads, TikTok Ads, Website Form, Direct WhatsApp, Google Search, Referrals*).
* **Deal Loss Reason Taxonomy**: Analyze why prospects didn't buy (*Price Above Budget, Competitor, Ghosted/Blue Ticked, Poor Fit, Postponed/Next Quarter*).

### 9. 🔍 Full-Spectrum Google SEO & Schema.org Structured Data
* **Verified Google Indexing**: Live sitemap submitted and verified on Google Search Console (`https://myleads-flow.vercel.app/sitemap.xml`).
* **Schema.org Rich Snippets**: Integrated `WebApplication`, `FAQPage`, and `Organization` JSON-LD schemas for rich Google search cards.
* **Google Favicon Standard**: Multiples of 48px square icons (`48x48`, `96x96`, `192x192`, `512x512`, `apple-touch-icon.png`) for instant logo appearance in Google search results.
* **Social Graph Previews**: High-resolution 1200x630 OpenGraph cards (`og-image.png`) with Ringgit Malaysia branding for WhatsApp and social shares.

### 10. 🛡️ Enterprise-Grade Security Headers
* Hardened with enterprise security headers across development and all deployment targets:
  - **`Content-Security-Policy (CSP)`**: Restricts unauthorized script injection, inline execution, and resource framing.
  - **`Strict-Transport-Security (HSTS)`**: Enforces HTTPS with `max-age=63072000; includeSubDomains; preload`.
  - **`X-Frame-Options: DENY`**: Protects against clickjacking.
  - **`X-Content-Type-Options: nosniff`**: Prevents MIME-type sniffing.
  - **`Permissions-Policy`**: Restricts unused device hardware APIs (camera, microphone, geolocation).
  - **`Cross-Origin-Opener-Policy (COOP)`**: `same-origin-allow-popups` ensures secure WhatsApp popup dispatching.

### 11. 🔒 Source Code Protection & Deep Obfuscation
* **Production Code Obfuscation**: Production JS chunks are transformed using `javascript-obfuscator` (hexadecimal identifier mangling, string array encryption with RC4/Base64, control-flow flattening, dead code injection, and self-defending heuristics).
* **Disabled Source Maps**: `sourcemap: false` prevents original source exposure.
* **Anti-Tamper & Inspection Guard**: Intercepts common DevTools shortcuts (`F12`, `Ctrl+Shift+I`, `Ctrl+Shift+J`, `Ctrl+U`, `Ctrl+S`), disables non-form context menus, and outputs an IP copyright notice in the browser console.

### 12. ⚡ Live Inbound Webhook Simulator
* Click the **"⚡ Simulate Lead"** button to simulate instant incoming webhook leads from live TikTok Ads and Meta campaigns.

### 13. 🌓 Theme Support (Dark / Light Mode)
* Native dark and light mode powered by Tailwind CSS v4 custom variant (`@custom-variant dark (&:where(.dark, .dark *));`).
* Persisted to `localStorage` with an anti-flicker head script to prevent flash during page reload.

### 14. 💾 100% Client-Side Resilience & Data Portability (`/demo` sandbox)
* The public `/demo` prototype requires zero external database — everything syncs to browser `localStorage`.
* **Export Leads (JSON)**: Download your entire lead database as a structured JSON backup.
* **Reset Sample Data**: Restore the default Malaysian sample dataset at any time.

### 15. 📝 Request Demo Form & Private Owner CRM Module
* **Public Request Demo Form**: Visitors on the landing page submit Name, Company, WhatsApp, Email, and an interest type (*Try Demo / Subscribe / Custom Deal*) directly into a real backend — no localStorage involved.
* **Server-Enforced Safety**: The public insert endpoint (`POST /api/leads`) always forces `stage: 'new'` and `dealValue: 0` server-side, and clamps priority to a known set — a crafted request can never fake a closed deal.
* **Owner-Only Access**: `/owner` is gated behind a password login (bcrypt-hashed, signed httpOnly JWT cookie) — only Sharil can view or manage real leads.
* **Same CRM, Real Data**: `/owner` reuses the exact same Kanban/Table/Analytics/Drawer/Modal components as `/demo` via a shared `CRMShell`, so managing real subscribers and custom-deal prospects feels identical to the public prototype.
* **Backend**: Neon Postgres accessed only from Vercel Serverless Functions under `api/` — the database connection string never reaches the browser bundle.

---

## 📁 Project Structure

```
leadflow-crm/
├── index.html                     # HTML entry point with SEO metadata, Schema.org JSON-LD & noscript shell
├── package.json                   # Project metadata, dependencies, and scripts
├── tsconfig.json                  # TypeScript compiler configuration (src/)
├── tsconfig.api.json              # TypeScript compiler configuration (api/ and scripts/, Node types)
├── tsconfig.node.json             # TypeScript config for node/bundler configs
├── vite.config.js                 # Vite config with deep obfuscation plugin, Terser, security headers & /api dev proxy
├── vercel.json                    # Vercel deployment configuration with static sitemap exceptions, /api rewrite exclusion & headers
├── netlify.toml                   # Netlify deployment configuration & security headers
├── .env.example                   # Documents DATABASE_URL, JWT_SECRET, OWNER_PASSWORD_HASH (server-only, never in the client bundle)
├── api/                           # Vercel Serverless Functions — the only code that ever touches the Neon connection string
│   ├── _lib/
│   │   ├── db.ts                  # Neon client (@neondatabase/serverless)
│   │   ├── auth.ts                # Signed JWT cookie issue/verify + Owner auth guard
│   │   └── leadMapper.ts          # snake_case DB row ↔ camelCase Lead type mapping
│   ├── leads.ts                   # GET (owner-only list) / POST (public insert, safe-defaults enforced; owner insert, trusted)
│   ├── leads/[id].ts              # PATCH / DELETE a single lead (owner-only)
│   └── owner/
│       ├── login.ts               # Password check (bcrypt) → issues session cookie
│       ├── logout.ts              # Clears session cookie
│       └── session.ts             # Checks current session validity
├── scripts/
│   ├── setup-db.mjs               # One-time `leads` table + indexes creation against DATABASE_URL
│   └── dev-api-server.mjs         # Local esbuild+http server that serves api/* for `npm run dev:api`, proxied from Vite at /api
├── docs/
│   ├── PANDUAN_SETUP_GOOGLE_SEO_DAN_INDEXING.md # Complete Google SEO & Search Console configuration guide
│   ├── BUSINESS_VALUATION_AND_PRICING_GUIDE.md  # Business valuation & SaaS pricing models
│   ├── CLIENT_PROPOSAL_TEMPLATE.md              # Client proposal presentation template
│   └── SKRIP_PITCH_JUALAN_LENGKAP.md            # WhatsApp closing & live demo pitch scripts
├── public/
│   ├── robots.txt                 # Search engine crawler directives & sitemap reference
│   ├── sitemap.xml                # XML Sitemap with image metadata
│   ├── site.webmanifest           # Web app manifest for PWA & mobile search discovery
│   ├── og-image.png               # OpenGraph 1200x630 social share banner
│   ├── og-image.svg               # Vector OpenGraph banner
│   ├── brand-logo.png             # Official Google Knowledge Graph & Schema logo
│   ├── brand-logo.svg             # Vector brand lockup
│   ├── favicon-48x48.png          # Google Search Console standard 48px square icon
│   ├── favicon-96x96.png          # Desktop SERP 96px icon
│   ├── favicon-192x192.png        # Mobile Chrome PWA 192px icon
│   ├── favicon-512x512.png        # High-res 512px icon
│   ├── apple-touch-icon.png       # Apple iOS home screen icon (180x180 px)
│   ├── favicon.svg                # Vector browser tab favicon
│   └── googlee7e80d636d6f56dd.html# Google Search Console HTML verification file
└── src/
    ├── main.tsx                   # React root mount & security guard initializer
    ├── App.tsx                    # Pathname router (/ → Landing, /demo → CRM app, /owner → Owner CRM)
    ├── index.css                  # Global styles, Tailwind v4 imports, custom variants, and A4 print rules
    ├── types/
    │   └── index.ts               # Domain types for Leads, BANT, Documents, Stages, Stats & LeadContextType (mode/loading/signOut)
    ├── pages/
    │   ├── Landing.tsx            # Sales landing page (hero, pricing, FAQ, industries, Request Demo CTAs) served at "/"
    │   └── Owner.tsx               # /owner session check → OwnerLogin or authenticated Owner CRM
    ├── components/
    │   ├── CRMShell.tsx           # Shared Kanban/Table/Analytics shell reused by both /demo and /owner, mode-aware
    │   ├── OwnerLogin.tsx         # Password login form for the Owner CRM (posts to /api/owner/login)
    │   ├── common/
    │   │   ├── BrandLogo.tsx      # SVG vector brand mark with live glow effects
    │   │   ├── PocContactBanner.tsx # Floating bottom bar with developer WhatsApp link (demo mode only)
    │   │   └── Toast.tsx          # Animated notification toasts
    │   ├── layout/
    │   │   ├── Navbar.tsx         # Navigation bar, view tabs, theme toggle, data menu — mode-aware (demo vs owner)
    │   │   ├── MetricsBar.tsx     # Top KPI summary cards (Pipeline, Won, Follow-ups, Speed to Lead)
    │   │   └── FilterToolbar.tsx  # Search bar, source/priority dropdowns, and sorting controls
    │   ├── kanban/
    │   │   ├── KanbanBoard.tsx    # Drag-and-drop Kanban columns
    │   │   └── LeadCard.tsx       # Individual draggable lead cards with 1-click WhatsApp/Call
    │   ├── table/
    │   │   └── LeadsTableView.tsx # Tabular lead view with inline stage changers
    │   ├── analytics/
    │   │   └── AnalyticsView.tsx  # Funnel progression, source attribution, and loss taxonomy
    │   ├── drawer/
    │   │   └── LeadDetailDrawer.tsx # Slide-over inspection drawer, BANT checklist, and documents
    │   └── modals/
    │       ├── AboutModal.tsx     # Brand intelligence, feature guide, and Google-indexed FAQ
    │       ├── AddLeadModal.tsx   # Create lead dialog
    │       ├── LostReasonModal.tsx # Deal loss categorization dialog
    │       ├── DocumentPreviewModal.tsx # Isolated A4 printable Quotation & Tax Invoice viewer
    │       ├── CreateDocumentModal.tsx # Custom Quotation & Invoice line-item builder
    │       └── RequestDemoModal.tsx # Public Request Demo form on the landing page (posts to /api/leads)
    ├── context/
    │   ├── LeadContext.tsx        # Demo CRM state management & LocalStorage sync (mode: 'demo')
    │   └── OwnerLeadContext.tsx   # Owner CRM state management via ownerApi + Neon (mode: 'owner'), same LeadContextType shape
    ├── data/
    │   └── initialLeads.ts        # Default 15 Malaysian sample leads, quotations, invoices, and templates
    └── lib/
        ├── securityGuard.ts       # Client-side anti-tamper, shortcut interceptor & console watermark
        ├── utils.ts               # Formatting utilities (RM Currency, Phone Normalizer, Relative Time)
        ├── leadSelectors.ts       # Shared filter/sort/stats logic used by both LeadContext and OwnerLeadContext
        └── ownerApi.ts            # fetch wrapper for /api/leads* and /api/owner/* (credentials: 'include')
```

---

## 🚀 Quick Start

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/sharilm/leads-flow.git

# 2. Enter directory
cd leads-flow

# 3. Install dependencies
npm install

# 4. Type-check codebase
npm run typecheck

# 5. Start local development server
npm run dev
```

Open your browser and navigate to `http://localhost:5173` for the sales landing page, or `http://localhost:5173/demo` for the interactive CRM app.

### Owner CRM Backend Setup (`/owner`)

The `/owner` module and the public Request Demo form need a real database. This is optional for working on the landing page or `/demo` — skip it if you're not touching those.

```bash
# 1. Create a free Neon Postgres project at https://neon.tech and copy the pooled connection string

# 2. Copy the example env file and fill in the three values
cp .env.example .env.local
# DATABASE_URL          — your Neon connection string
# JWT_SECRET             — generate with: openssl rand -hex 32
# OWNER_PASSWORD_HASH    — generate with: node -e "console.log(require('bcryptjs').hashSync('your-password', 12))"

# 3. Create the `leads` table (one-time)
node --env-file=.env.local scripts/setup-db.mjs

# 4. Run the local API dev server (separate terminal from `npm run dev`)
npm run dev:api
```

With both `npm run dev` and `npm run dev:api` running, Vite proxies `/api/*` to the local API server (`vite.config.js` → `server.proxy`), so the Request Demo form and `/owner` work fully locally against your real Neon database — no Vercel CLI required.

---

## 🚢 Deployment Guide

### Deploy on Vercel
1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Vercel automatically detects `vercel.json` and `api/` and applies Vite presets, static file exemptions (`/sitemap.xml`, `/robots.txt`), the `/api` rewrite exclusion, and security headers.
4. Add `DATABASE_URL`, `JWT_SECRET`, and `OWNER_PASSWORD_HASH` under Project Settings → Environment Variables (Production, Preview, and Development) — required for `/owner` and the Request Demo form to work. Without them the rest of the site (landing page + `/demo`) still works fine.

---

## 🧰 Tech Stack

* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Core Framework**: [React 19](https://react.dev/)
* **Build Tool**: [Vite 8](https://vitejs.dev/)
* **CSS Framework**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
* **Code Obfuscator**: [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator) & [Terser](https://terser.org/)
* **Typography**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) & JetBrains Mono (Google Fonts)
* **Icon Set**: [Lucide React](https://lucide.dev/)
* **State & Persistence**: React Context API — `localStorage` for `/demo`, [Neon](https://neon.tech) Postgres for `/owner`
* **Backend**: [Vercel Serverless Functions](https://vercel.com/docs/functions) (`api/`), [@neondatabase/serverless](https://github.com/neondatabase/serverless), `bcryptjs` + `jsonwebtoken` for Owner auth

---

## 📄 License

This project is open-sourced under the [MIT License](LICENSE).
