# ⚡ LeadFlow CRM — High-Velocity Lead Management (Malaysia RM Edition)

> **Modern, Zero-Backend, High-Velocity CRM & WhatsApp Sales Pipeline** built with React 19, Vite, and Tailwind CSS v4. Designed for Malaysian startups, digital marketing agencies (running Meta & TikTok Ads campaigns), and high-growth sales teams.

<p align="center">
  <img src="public/brand-logo.svg" alt="LeadFlow CRM Brand Logo" width="360" />
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Storage: LocalStorage](https://img.shields.io/badge/Storage-100%25_Client--Side-10b981.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
[![Theme: Dark/Light](https://img.shields.io/badge/Theme-Dark%20%2F%20Light%20Mode-zinc.svg)](#-theme-support-dark--light-mode)
[![Developer Contact](https://img.shields.io/badge/WhatsApp-013--592_8812-25D366?logo=whatsapp&logoColor=white)](https://wa.me/60135928812)

---

## 👨‍💻 POC Prototype & Developer Contact

Ini adalah prototaip **Proof of Concept (POC)** yang dibangunkan oleh **Sharil**.

Jika anda atau organisasi anda berminat untuk:
* Membina **Sistem CRM Kustom** untuk perniagaan anda.
* Menghubungkan **Automasi WhatsApp** dengan iklan Meta / TikTok Ads Webhooks.
* Membangunkan aplikasi web / perisian SaaS khusus.

Boleh hubungi terus di WhatsApp:
👉 **[Chat WhatsApp: +6013-592 8812 (Sharil)](https://wa.me/60135928812?text=Salam%20Sharil,%20saya%20tertarik%20dengan%20POC%20LeadFlow%20CRM%20dan%20berminat%20nak%20bincang%20projek/custom%20sistem)**

---

## 💎 Brand Identity & Philosophy

**LeadFlow CRM** embodies one central mission: ***"Capture fast. Close faster."***

In high-velocity digital advertising markets like Malaysia (where leads from TikTok Ads and Meta Ads quickly cool down if uncontacted), every minute of latency directly harms deal conversion. LeadFlow provides sales closers with frictionless 1-click WhatsApp outreach, BANT qualification, follow-up automation, official quotations, tax invoices, and real-time revenue analytics.

### Visual Design Tokens
* **Primary Brand Accents**: `Emerald Surge (#10b981 / #059669)` — represents speed, deal closures, and positive cash flow.
* **Surface Neutral Palette**: `Onyx & Slate Zinc (#09090b / #18181b / #27272a)` — high-contrast readability in both Dark and Light modes.
* **Typography**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) for ultra-legible UI labels & JetBrains Mono for monetary figures (`RM 28,500`) and IDs.

---

## ✨ Key Features

### 1. 🇲🇾 Malaysian Market Adapted (Ringgit Malaysia & Phone Normalizer)
* **Malaysian Currency (RM)**: All deal values, pipeline summaries, and revenue metrics are formatted in standard Malaysian Ringgit (e.g. `RM 28,500`).
* **Smart Phone Normalizer**: Automatically detects and normalizes local phone formats (`012-345 6789`, `+6019...`, `011...`, `6012...`) into standard international `wa.me/601...` links.

### 2. 📄 Official Quotations & Tax Invoices (A4 Printable)
* **Official Quotations & Tax Invoices**: Generate itemized quotations (`QT-2026-xxxx`) and invoices (`INV-2026-xxxx`) with SSM details, Maybank payment info, and digital signatures.
* **Pure A4 Printable Isolation**: Clean print mode that outputs ONLY the official document without any browser app clutter.
* **1-Click Stage Automation**: Convert approved quotations to Tax Invoices and move leads to *Closed Won* with 1 click.

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
* **Granular Filtering**: Filter by marketing channel and priority.
* **Dynamic Sorting**: Sort by `Newest First`, `Value: High to Low`, `Value: Low to High`, `Follow-up Date`, or `Name (A-Z)`.

### 6. 📑 Slide-Over Lead Drawer & Activity Logger
* **Inline Profile Editing**: Update prospect name, company, phone, email, and deal value in place.
* **BANT Qualification Checklist**: Verify **Budget**, **Authority**, **Need**, and **Timeline** before formal quoting.
* **Smart Follow-Up Scheduler**: Quick date picker with shortcut buttons (`Today`, `Tomorrow`, `+3 Days`, `+1 Week`) and visual overdue badges.

### 7. 📊 Conversion Funnel & Ad Channel Analytics
* **Lead Progression Funnel**: Top-to-bottom visual drop-off analysis across pipeline stages.
* **Channel Attribution & Revenue**: Track lead volume and revenue contribution per ad source (*Meta Ads, TikTok Ads, Website Form, Direct WhatsApp, Google Search, Referrals*).
* **Deal Loss Reason Taxonomy**: Analyze why prospects didn't buy (*Price Above Budget, Competitor, Ghosted/Blue Ticked, Poor Fit, Postponed/Next Quarter*).

### 8. ⚡ Live Inbound Webhook Simulator
* Click the **"⚡ Simulate Lead"** button to simulate instant incoming webhook leads from live TikTok Ads and Meta campaigns.

### 9. 🌓 Theme Support (Dark / Light Mode)
* Native dark and light mode powered by Tailwind CSS v4 custom variant.

### 10. 💾 100% Client-Side Resilience & Data Portability
* Zero external database required—everything syncs to browser `localStorage`.
* **Export Leads (JSON)**: Download your entire lead database as a structured JSON backup.
* **Reset Sample Data**: Restore the default Malaysian sample dataset at any time.

---

## 🚀 Quick Start

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/your-username/leadflow-crm.git

# 2. Enter directory
cd leadflow-crm

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

---

## 🧰 Tech Stack

* **Core Framework**: [React 19](https://react.dev/)
* **Build Tool**: [Vite 8](https://vitejs.dev/)
* **CSS Framework**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
* **Typography**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) & JetBrains Mono (Google Fonts)
* **Icon Set**: [Lucide React](https://lucide.dev/)
* **State & Persistence**: React Context API + Browser `localStorage` API

---

## 📄 License

This project is open-sourced under the [MIT License](LICENSE).
