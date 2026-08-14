# ⚡ LeadFlow CRM — High-Velocity Lead Management (Malaysia RM Edition)

> **Modern, Zero-Backend, High-Velocity CRM & WhatsApp Sales Pipeline** built with React 19, Vite, and Tailwind CSS v4. Engineered specifically for Malaysian startups, digital marketing agencies (running Meta & TikTok Ads campaigns), and high-growth B2B sales teams.

<p align="center">
  <img src="public/brand-logo.svg" alt="LeadFlow CRM Brand Logo" width="360" />
</p>

<p align="center">
  <a href="https://github.com/sharilm/leads-flow"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61dafb.svg" alt="React 19" /></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-8.2-646cff.svg" alt="Vite 8" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg" alt="Tailwind CSS v4" /></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage"><img src="https://img.shields.io/badge/Storage-100%25_Client--Side-10b981.svg" alt="Client-side LocalStorage" /></a>
  <a href="https://wa.me/60135928812"><img src="https://img.shields.io/badge/WhatsApp-Contact_Developer-25D366?logo=whatsapp&logoColor=white" alt="WhatsApp Developer" /></a>
</p>

---

## 👨‍💻 Proof of Concept (POC) & Custom Development

This project is an interactive **Proof of Concept (POC)** prototype developed by **Sharil**.

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

## ✨ Key Features

### 1. 🇲🇾 Malaysian Market Adapted (Ringgit Malaysia & Phone Normalizer)
* **Malaysian Ringgit (RM)**: All deal values, pipeline stage totals, and revenue metrics are natively formatted in standard Malaysian Ringgit (e.g. `RM 28,500`).
* **Smart Phone Normalizer**: Automatically normalizes local phone formats (`012-345 6789`, `+6019...`, `011...`, `6012...`) into standard international `wa.me/601...` direct links.

### 2. 📄 Official Quotations & Tax Invoices (A4 Print Isolation)
* **Dynamic Document Builder**: Create itemized quotations (`QT-2026-xxxx`) and invoices (`INV-2026-xxxx`) with custom line items, unit prices, and notes.
* **Pure A4 Printable Isolation**: Clean print mode that strips away all application UI (navbars, drawers, buttons, backdrops) and outputs ONLY the official document with corporate letterhead, SSM details, Maybank payment info, and digital signatures.
* **1-Click Stage Automation**: Convert approved quotations to Tax Invoices and automatically advance the lead to *Closed Won*.

### 3. 💬 1-Click WhatsApp Direct Actions (`wa.me`)
* **Instant WhatsApp Launcher**: 1-click direct link to open WhatsApp with pre-filled, personalized messages (`{{name}}`, `{{company}}`, `{{dealValue}}`, `{{agent}}`).
* **5 High-Converting Sales Templates**:
  - 🌟 **Introduction & Greeting (First Contact)**: Warm inbound touchpoint following ad inquiries.
  - 📄 **Proposal & Quotation Follow-Up**: Direct follow-up referencing sent quote value.
  - 🎥 **15-Minute Live Demo Invitation**: Google Meet walkthrough pitch to showcase time savings.
  - 🎁 **Limited-Time Incentive / Closing Offer**: Discount & free month onboarding urgency trigger.
  - 🔔 **Gentle Follow-Up / Ghosting Recovery**: Soft nudge for uncontacted / blue-ticked prospects.

### 4. 🗂️ Interactive Kanban Pipeline (Drag & Drop)
* **Visual Pipeline Stages**: `New Leads` ➔ `Contacted` ➔ `Qualified` ➔ `Proposal Sent` ➔ `Closed Won` / `Closed Lost`.
* **Native Drag & Drop**: Smooth column-to-column lead transitions with visual drop-zone feedback.
* **Real-Time Column Totals**: Live calculation of active deal counts and aggregate RM value per stage.

### 5. 📋 Table View with Multi-Attribute Filtering & Sorting
* **Global Search**: Search across lead names, companies, phone numbers, notes, and tags simultaneously.
* **Granular Filtering**: Filter by marketing channel (`Meta Ads`, `TikTok Ads`, `Website Form`, `Direct WhatsApp`, etc.) and priority (`Urgent`, `High`, `Medium`, `Low`).
* **Dynamic Sorting**: Sort by `Newest First`, `Value: High to Low`, `Value: Low to High`, `Follow-up Date`, or `Name (A-Z)`.

### 6. 📑 Slide-Over Lead Drawer & Activity Logger
* **Inline Profile Editing**: Update prospect name, company, phone, email, and deal value in place.
* **BANT Qualification Checklist**: Verify **Budget**, **Authority**, **Need**, and **Timeline** before formal quoting.
* **Smart Follow-Up Scheduler**: Quick date picker with shortcut buttons (`Today`, `Tomorrow`, `+3 Days`, `+1 Week`) and visual overdue badges.
* **Multi-Channel Activity Timeline**: Log and timestamp interactions categorized by `WhatsApp`, `Phone Call`, `Meeting`, or `Sales Note`.

### 7. 📊 Conversion Funnel & Ad Channel Analytics
* **Lead Progression Funnel**: Top-to-bottom visual drop-off analysis across pipeline stages.
* **Channel Attribution & Revenue**: Track lead volume and revenue contribution per ad source (*Meta Ads, TikTok Ads, Website Form, Direct WhatsApp, Google Search, Referrals*).
* **Deal Loss Reason Taxonomy**: Analyze why prospects didn't buy (*Price Above Budget, Competitor, Ghosted/Blue Ticked, Poor Fit, Postponed/Next Quarter*).

### 8. 🛡️ Enterprise-Grade Security Headers
* Hardened with enterprise security headers across development and all deployment targets:
  - **`Content-Security-Policy (CSP)`**: Restricts unauthorized script injection, inline execution, and resource framing.
  - **`Strict-Transport-Security (HSTS)`**: Enforces HTTPS with `max-age=63072000; includeSubDomains; preload`.
  - **`X-Frame-Options: DENY`**: Protects against clickjacking.
  - **`X-Content-Type-Options: nosniff`**: Prevents MIME-type sniffing.
  - **`Permissions-Policy`**: Restricts unused device hardware APIs (camera, microphone, geolocation).
  - **`Cross-Origin-Opener-Policy (COOP)`**: `same-origin-allow-popups` ensures secure WhatsApp popup dispatching.
* **Pre-configured configs provided**: `vercel.json`, `netlify.toml`, `public/_headers`, and `vite.config.js`.

### 9. 🔒 Source Code Protection & Deep Obfuscation
* **Production Code Obfuscation**: Production JS chunks are transformed using `javascript-obfuscator` (hexadecimal identifier mangling, string array encryption with RC4/Base64, control-flow flattening, dead code injection, and self-defending heuristics).
* **Disabled Source Maps**: `sourcemap: false` prevents original JSX/TypeScript source exposure.
* **Anti-Tamper & Inspection Guard**: Intercepts common DevTools shortcuts (`F12`, `Ctrl+Shift+I`, `Ctrl+Shift+J`, `Ctrl+U`, `Ctrl+S`), disables non-form context menus, and outputs an IP copyright notice in the browser console.

### 10. ⚡ Live Inbound Webhook Simulator
* Click the **"⚡ Simulate Lead"** button to simulate instant incoming webhook leads from live TikTok Ads and Meta campaigns.

### 11. 🌓 Theme Support (Dark / Light Mode)
* Native dark and light mode powered by Tailwind CSS v4 custom variant (`@custom-variant dark (&:where(.dark, .dark *));`).
* Persisted to `localStorage` with an anti-flicker head script to prevent flash during page reload.

### 12. 💾 100% Client-Side Resilience & Data Portability
* Zero external database required—everything syncs to browser `localStorage`.
* **Export Leads (JSON)**: Download your entire lead database as a structured JSON backup.
* **Reset Sample Data**: Restore the default Malaysian sample dataset at any time.

---

## 📁 Project Structure

```
leadflow-crm/
├── index.html                     # HTML entry point with security meta tags & anti-flash theme script
├── package.json                   # Project metadata, dependencies, and scripts
├── vite.config.js                 # Vite config with deep obfuscation plugin, Terser, and security headers
├── vercel.json                    # Vercel deployment configuration with enterprise security headers & SPA rewrites
├── netlify.toml                   # Netlify deployment configuration & security headers
├── public/
│   ├── _headers                   # Cloudflare Pages / Netlify security header rules
│   ├── favicon.svg                # LeadFlow brand mark vector favicon
│   └── brand-logo.svg             # LeadFlow horizontal vector brand lockup
└── src/
    ├── main.jsx                   # React root mount & security guard initializer
    ├── App.jsx                    # Core CRM app layout & view switcher
    ├── index.css                  # Global styles, Tailwind v4 imports, custom variants, and A4 print rules
    ├── components/
    │   ├── common/
    │   │   ├── BrandLogo.jsx      # Reusable vector brand logo & icon components
    │   │   ├── PocContactBanner.jsx # Floating POC developer contact widget
    │   │   └── Toast.jsx          # Notification toast container
    │   ├── layout/
    │   │   ├── Navbar.jsx         # Navigation bar, view tabs, theme toggle, and data menu
    │   │   ├── MetricsBar.jsx     # Top KPI summary cards (Pipeline, Won, Follow-ups, Speed to Lead)
    │   │   └── FilterToolbar.jsx  # Search bar, source/priority dropdowns, and sorting controls
    │   ├── kanban/
    │   │   ├── KanbanBoard.jsx    # Drag-and-drop Kanban columns
    │   │   └── LeadCard.jsx       # Individual draggable lead cards with 1-click WhatsApp/Call
    │   ├── table/
    │   │   └── LeadsTableView.jsx # Tabular lead view with inline stage changers
    │   ├── analytics/
    │   │   └── AnalyticsView.jsx  # Funnel progression, source attribution, and loss taxonomy
    │   ├── drawer/
    │   │   └── LeadDetailDrawer.jsx # Slide-over inspection drawer, BANT checklist, and documents
    │   └── modals/
    │       ├── AboutModal.jsx     # Brand intelligence, system diagnostics, and shortcuts dialog
    │       ├── AddLeadModal.jsx   # Create lead dialog
    │       ├── LostReasonModal.jsx # Deal loss categorization dialog
    │       ├── DocumentPreviewModal.jsx # Isolated A4 printable Quotation & Tax Invoice viewer
    │       └── CreateDocumentModal.jsx # Custom Quotation & Invoice line-item builder
    ├── context/
    │   └── LeadContext.jsx        # Global CRM state management & LocalStorage sync
    ├── data/
    │   └── initialLeads.js        # Default 15 Malaysian sample leads, quotations, invoices, and templates
    └── lib/
        ├── securityGuard.js       # Client-side anti-tamper, shortcut interceptor & console watermark
        └── utils.js               # Formatting utilities (RM Currency, Phone Normalizer, Relative Time)
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

# 4. Start local development server
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

---

## 🚢 Deployment Guide

### Deploy on Vercel
1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Vercel will automatically detect `vercel.json` and apply all SPA routing and security headers.

### Deploy on Netlify
1. Connect your repository to [Netlify](https://netlify.com).
2. Build command: `npm run build` | Publish directory: `dist`.
3. Netlify will automatically detect `netlify.toml` for headers and redirects.

### Deploy on Cloudflare Pages
1. Connect repository in Cloudflare Pages dashboard.
2. Build command: `npm run build` | Output directory: `dist`.
3. Cloudflare Pages will automatically consume `public/_headers`.

---

## 🧰 Tech Stack

* **Core Framework**: [React 19](https://react.dev/)
* **Build Tool**: [Vite 8](https://vitejs.dev/)
* **CSS Framework**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
* **Code Obfuscator**: [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator) & [Terser](https://terser.org/)
* **Typography**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) & JetBrains Mono (Google Fonts)
* **Icon Set**: [Lucide React](https://lucide.dev/)
* **State & Persistence**: React Context API + Browser `localStorage` API

---

## 📄 License

This project is open-sourced under the [MIT License](LICENSE).
