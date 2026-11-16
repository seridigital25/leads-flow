import { Lead, StageConfig, PriorityConfig, QuickTemplate, LeadSource } from '../types';

export const MAX_MOCKUP_LEADS: number = 15;

export const STAGES: StageConfig[] = [
  { id: 'new', label: 'New Leads', color: 'blue', bgLight: 'bg-blue-50', bgDark: 'dark:bg-blue-950/40', borderLight: 'border-blue-200', borderDark: 'dark:border-blue-800' },
  { id: 'contacted', label: 'Contacted', color: 'amber', bgLight: 'bg-amber-50', bgDark: 'dark:bg-amber-950/40', borderLight: 'border-amber-200', borderDark: 'dark:border-amber-800' },
  { id: 'qualified', label: 'Qualified', color: 'indigo', bgLight: 'bg-indigo-50', bgDark: 'dark:bg-indigo-950/40', borderLight: 'border-indigo-200', borderDark: 'dark:border-indigo-800' },
  { id: 'proposal_sent', label: 'Proposal Sent', color: 'purple', bgLight: 'bg-purple-50', bgDark: 'dark:bg-purple-950/40', borderLight: 'border-purple-200', borderDark: 'dark:border-purple-800' },
  { id: 'won', label: 'Closed Won', color: 'emerald', bgLight: 'bg-emerald-50', bgDark: 'dark:bg-emerald-950/40', borderLight: 'border-emerald-200', borderDark: 'dark:border-emerald-800' },
  { id: 'lost', label: 'Closed Lost', color: 'rose', bgLight: 'bg-rose-50', bgDark: 'dark:bg-rose-950/40', borderLight: 'border-rose-200', borderDark: 'dark:border-rose-800' },
];

export const SOURCES: string[] = [
  'Meta Ads',
  'TikTok Ads',
  'Website Form',
  'Direct WhatsApp',
  'Google Search',
  'Referral / Partner',
];

export const DEFAULT_SOURCES: LeadSource[] = [
  { id: 'src-meta-ads', name: 'Meta Ads', category: 'Paid Ads', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'src-tiktok-ads', name: 'TikTok Ads', category: 'Paid Ads', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'src-website-form', name: 'Website Form', category: 'Inbound', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'src-direct-whatsapp', name: 'Direct WhatsApp', category: 'Inbound', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'src-google-search', name: 'Google Search', category: 'Organic', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
  { id: 'src-referral', name: 'Referral / Partner', category: 'Referral', isActive: true, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
];

export const PRIORITIES: PriorityConfig[] = [
  { id: 'urgent', label: 'Urgent', color: 'rose', bgLight: 'bg-rose-50', bgDark: 'dark:bg-rose-950/50', borderLight: 'border-rose-200', borderDark: 'dark:border-rose-800' },
  { id: 'high', label: 'High', color: 'amber', bgLight: 'bg-amber-50', bgDark: 'dark:bg-amber-950/50', borderLight: 'border-amber-200', borderDark: 'dark:border-amber-800' },
  { id: 'medium', label: 'Medium', color: 'blue', bgLight: 'bg-blue-50', bgDark: 'dark:bg-blue-950/50', borderLight: 'border-blue-200', borderDark: 'dark:border-blue-800' },
  { id: 'low', label: 'Low', color: 'zinc', bgLight: 'bg-zinc-100', bgDark: 'dark:bg-zinc-800', borderLight: 'border-zinc-200', borderDark: 'dark:border-zinc-700' },
];

export const LOST_REASONS: string[] = [
  'Price Above Budget',
  'Chose Competitor',
  'Ghosted / Unresponsive (Blue Ticked)',
  'Poor Product / Feature Fit',
  'Postponed / Bad Timing (Next Quarter / Post-Raya)',
  'No Authority to Buy (Pending Board Approval)',
];

export const SAMPLE_LEADS: Lead[] = [
  {
    id: 'lead-101',
    name: "Dato' Sri Azman Harun",
    company: 'Apex Industrial Logistics Sdn Bhd',
    phone: '012-345 6789',
    email: 'azman@apexlogistics.my',
    dealValue: 28500,
    stage: 'proposal_sent',
    priority: 'urgent',
    source: 'Meta Ads',
    assignedTo: 'Aiman (Sales Lead)',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    nextFollowUpDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: 'Requires a custom dispatch tracking workflow for 40 container trucks and automated WhatsApp broadcast alerts to driver vendors.',
    bant: {
      budget: true,
      authority: true,
      need: true,
      timeline: true
    },
    quotations: [
      {
        id: 'qt-101',
        number: 'QT-2026-0042',
        date: '2026-08-11',
        validUntil: '2026-08-25',
        status: 'sent',
        items: [
          { description: 'Fleet GPS & Dispatch Tracking Software License (40 Units)', qty: 40, unitPrice: 450, total: 18000 },
          { description: 'Official WhatsApp Business API Automation Setup & Integration', qty: 1, unitPrice: 7500, total: 7500 },
          { description: 'On-site Driver Training & System Handover Workshop', qty: 1, unitPrice: 3000, total: 3000 }
        ],
        subtotal: 28500,
        tax: 0,
        total: 28500,
        notes: 'Includes 12-month SLA warranty and cloud server maintenance.'
      }
    ],
    invoices: [],
    activities: [
      {
        id: 'act-1',
        type: 'whatsapp',
        author: 'Aiman',
        content: 'Delivered Quotation QT-2026-0042 (RM 28,500) and rollout phase schedule via WhatsApp.',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'act-2',
        type: 'call',
        author: 'Aiman',
        content: '20-minute call with Dato\'s Chief of Staff. Inquired about a 5% discount for upfront lumpsum payment.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    lostReason: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lead-102',
    name: 'Puan Nadia Kamaruddin',
    company: 'Nadia Aesthetic Clinic & MedSpa',
    phone: '019-888 2341',
    email: 'nadia@aestheticwellness.my',
    dealValue: 7500,
    stage: 'qualified',
    priority: 'high',
    source: 'TikTok Ads',
    assignedTo: 'Sarah (BD Manager)',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    nextFollowUpDate: new Date().toISOString().split('T')[0],
    notes: 'Wants automated WhatsApp appointment reminders to handle 150+ daily inquiries from viral TikTok Ads video campaigns.',
    bant: {
      budget: true,
      authority: true,
      need: true,
      timeline: true
    },
    quotations: [
      {
        id: 'qt-102',
        number: 'QT-2026-0048',
        date: '2026-08-13',
        validUntil: '2026-08-27',
        status: 'draft',
        items: [
          { description: 'Growth Tier Clinic Appointment Booking CRM', qty: 1, unitPrice: 4500, total: 4500 },
          { description: 'WhatsApp Multi-Agent Inbox Setup (3 Therapists)', qty: 1, unitPrice: 3000, total: 3000 }
        ],
        subtotal: 7500,
        tax: 0,
        total: 7500,
        notes: 'Draft quotation prepared for tomorrow\'s live Zoom walkthrough demo.'
      }
    ],
    invoices: [],
    activities: [
      {
        id: 'act-4',
        type: 'call',
        author: 'Sarah',
        content: '15-minute discovery call completed. Puan Nadia requested a live walkthrough demo over Google Meet tomorrow.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      }
    ],
    lostReason: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lead-103',
    name: 'Dr. Kenneth Tan',
    company: 'Tan Dental Specialists Group',
    phone: '017-234 5671',
    email: 'dr.tan@tandental.com.my',
    dealValue: 14000,
    stage: 'new',
    priority: 'urgent',
    source: 'Website Form',
    assignedTo: 'Unassigned',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    nextFollowUpDate: new Date().toISOString().split('T')[0],
    notes: 'Website Form Inquiry: "Looking for automated appointment reminders & patient recall CRM for our 3 dental clinics in Bangsar and Subang."',
    bant: {
      budget: false,
      authority: true,
      need: true,
      timeline: true
    },
    quotations: [],
    invoices: [],
    activities: [
      {
        id: 'act-6',
        type: 'note',
        author: 'System',
        content: 'Lead received through Website Inbound Contact Form.',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString()
      }
    ],
    lostReason: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lead-104',
    name: 'En. Faizal Zakaria',
    company: 'Seri Rasa F&B Group',
    phone: '011-2398 4712',
    email: 'faizal@serirasa.com.my',
    dealValue: 18500,
    stage: 'contacted',
    priority: 'medium',
    source: 'Direct WhatsApp',
    assignedTo: 'Aiman (Sales Lead)',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    nextFollowUpDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: 'Inquired about centralized customer loyalty points & VIP guest messaging for 8 restaurant outlets across Klang Valley.',
    bant: {
      budget: true,
      authority: false,
      need: true,
      timeline: false
    },
    quotations: [
      {
        id: 'qt-104',
        number: 'QT-2026-0039',
        date: '2026-08-12',
        validUntil: '2026-08-26',
        status: 'sent',
        items: [
          { description: 'F&B Digital Loyalty & Stamp Card System (8 Outlets)', qty: 8, unitPrice: 1800, total: 14400 },
          { description: 'POS Cashier API Integration & Cloud Sync', qty: 1, unitPrice: 4100, total: 4100 }
        ],
        subtotal: 18500,
        tax: 0,
        total: 18500,
        notes: 'Price includes tablet cashier setup for all 8 outlets.'
      }
    ],
    invoices: [],
    activities: [
      {
        id: 'act-7',
        type: 'whatsapp',
        author: 'Aiman',
        content: 'Introductory messaging and Quotation QT-2026-0039 sent to his WhatsApp.',
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString()
      }
    ],
    lostReason: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lead-105',
    name: 'Chloe Lim & Partners',
    company: 'Lumina Interior & Architecture PLT',
    phone: '016-555 1982',
    email: 'chloe@luminainterior.my',
    dealValue: 32000,
    stage: 'won',
    priority: 'high',
    source: 'Referral / Partner',
    assignedTo: 'Sarah (BD Manager)',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    nextFollowUpDate: undefined,
    notes: 'Custom Enterprise CRM & Sales Dashboard implementation for luxury residential renovations in Kuala Lumpur.',
    bant: {
      budget: true,
      authority: true,
      need: true,
      timeline: true
    },
    quotations: [
      {
        id: 'qt-105',
        number: 'QT-2026-0018',
        date: '2026-08-02',
        validUntil: '2026-08-16',
        status: 'approved',
        items: [
          { description: 'Lumina Custom Interior CRM & Project Milestones Suite', qty: 1, unitPrice: 24000, total: 24000 },
          { description: '3D Floorplan & Client Approval Portal Module', qty: 1, unitPrice: 8000, total: 8000 }
        ],
        subtotal: 32000,
        tax: 0,
        total: 32000,
        notes: 'Quotation approved and signed on 05 August 2026.'
      }
    ],
    invoices: [
      {
        id: 'inv-105',
        number: 'INV-2026-0088',
        date: '2026-08-06',
        dueDate: '2026-08-20',
        status: 'paid',
        items: [
          { description: '50% Initial Milestone Deposit - Lumina Custom CRM Setup', qty: 1, unitPrice: 16000, total: 16000 }
        ],
        subtotal: 16000,
        tax: 0,
        total: 16000,
        paidAt: '2026-08-06T11:45:00Z',
        paymentMethod: 'Maybank Instant Transfer (Ref: MBB-8921884)'
      }
    ],
    activities: [
      {
        id: 'act-8',
        type: 'meeting',
        author: 'Sarah',
        content: 'Onboarding kickoff meeting completed. Invoice INV-2026-0088 (RM16k deposit) confirmed paid.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    lostReason: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lead-106',
    name: 'Tuan Hafiz Ridzuan',
    company: 'Mega Bina Hardware & Machinery Sdn Bhd',
    phone: '013-999 2019',
    email: 'hafiz@megabina.com.my',
    dealValue: 5000,
    stage: 'lost',
    priority: 'low',
    source: 'Google Search',
    assignedTo: 'Aiman (Sales Lead)',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    nextFollowUpDate: undefined,
    notes: 'Only looking for a simple free Excel spreadsheet template rather than a full cloud-based CRM.',
    bant: {
      budget: false,
      authority: true,
      need: false,
      timeline: false
    },
    quotations: [
      {
        id: 'qt-106',
        number: 'QT-2026-0029',
        date: '2026-08-07',
        validUntil: '2026-08-21',
        status: 'declined',
        items: [
          { description: 'Starter CRM Tier (Wholesale Inventory Sync)', qty: 1, unitPrice: 5000, total: 5000 }
        ],
        subtotal: 5000,
        tax: 0,
        total: 5000,
        notes: 'Declined: Price above client budget.'
      }
    ],
    invoices: [],
    activities: [
      {
        id: 'act-10',
        type: 'call',
        author: 'Aiman',
        content: 'Prospect stated budget is insufficient for recurring monthly SaaS subscription fees.',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    lostReason: 'Price Above Budget',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lead-107',
    name: 'Siti Sarah Al-Attas',
    company: 'Al-Attas Halal Confectionery',
    phone: '012-444 9871',
    email: 'sarah@alattasconfections.my',
    dealValue: 9200,
    stage: 'proposal_sent',
    priority: 'high',
    source: 'Meta Ads',
    assignedTo: 'Sarah (BD Manager)',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    nextFollowUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: 'Needs CRM to manage 500+ wholesale seasonal orders from stockists and agents across West & East Malaysia.',
    bant: {
      budget: true,
      authority: true,
      need: true,
      timeline: true
    },
    quotations: [
      {
        id: 'qt-107',
        number: 'QT-2026-0051',
        date: '2026-08-10',
        validUntil: '2026-08-24',
        status: 'sent',
        items: [
          { description: 'Agency Growth Stockist CRM Tier (Unlimited Agents)', qty: 1, unitPrice: 6200, total: 6200 },
          { description: 'WhatsApp Parcel Tracking & Automated PDF Receipt Bot', qty: 1, unitPrice: 3000, total: 3000 }
        ],
        subtotal: 9200,
        tax: 0,
        total: 9200,
        notes: 'Seasonal Raya early-bird implementation discount applied.'
      }
    ],
    invoices: [],
    activities: [
      {
        id: 'act-11',
        type: 'whatsapp',
        author: 'Sarah',
        content: 'Delivered Agency Growth tier quotation QT-2026-0051 (RM9,200).',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    lostReason: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lead-108',
    name: 'Marcus Wong',
    company: 'Spark Fintech Academy KL',
    phone: '018-333 2014',
    email: 'marcus@sparkfintech.io',
    dealValue: 21000,
    stage: 'qualified',
    priority: 'medium',
    source: 'TikTok Ads',
    assignedTo: 'Aiman (Sales Lead)',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    nextFollowUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: 'Requires instant round-robin lead routing across 5 sales closers following weekly live business masterclasses.',
    bant: {
      budget: true,
      authority: true,
      need: true,
      timeline: true
    },
    quotations: [
      {
        id: 'qt-108',
        number: 'QT-2026-0053',
        date: '2026-08-12',
        validUntil: '2026-08-26',
        status: 'draft',
        items: [
          { description: 'Automated Round-Robin Sales Routing Engine (5 Closers)', qty: 1, unitPrice: 12000, total: 12000 },
          { description: 'Webinar Zoom / Stripe Webhook Ingestion Pipeline', qty: 1, unitPrice: 9000, total: 9000 }
        ],
        subtotal: 21000,
        tax: 0,
        total: 21000,
        notes: 'Draft proposal pending Monday live demo session.'
      }
    ],
    invoices: [],
    activities: [
      {
        id: 'act-12',
        type: 'call',
        author: 'Aiman',
        content: 'Scheduled strategy call for Monday at 11:00 AM. Drafted Quotation QT-2026-0053.',
        timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
      }
    ],
    lostReason: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lead-109',
    name: 'Tan Sri Vincent Lee',
    company: 'Lee Grand Hotel & Resorts Group',
    phone: '019-222 8119',
    email: 'vincent.lee@leegrandresorts.com',
    dealValue: 68000,
    stage: 'contacted',
    priority: 'urgent',
    source: 'Referral / Partner',
    assignedTo: 'Sarah (BD Manager)',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    nextFollowUpDate: new Date().toISOString().split('T')[0],
    notes: 'Wants multi-property guest loyalty CRM and automated WhatsApp check-in notification system for 4 resort properties.',
    bant: {
      budget: true,
      authority: true,
      need: true,
      timeline: true
    },
    quotations: [
      {
        id: 'qt-109',
        number: 'QT-2026-0055',
        date: '2026-08-13',
        validUntil: '2026-08-27',
        status: 'sent',
        items: [
          { description: 'Multi-Resort Guest Experience & Loyalty Portal (4 Properties)', qty: 4, unitPrice: 12500, total: 50000 },
          { description: 'Enterprise WhatsApp Concierge Gateway & PMS Integration', qty: 1, unitPrice: 18000, total: 18000 }
        ],
        subtotal: 68000,
        tax: 0,
        total: 68000,
        notes: 'Submitted for Board Executive Committee consideration.'
      }
    ],
    invoices: [],
    activities: [
      {
        id: 'act-13',
        type: 'call',
        author: 'Sarah',
        content: 'Initial discovery call with General Manager completed. Sent Quotation QT-2026-0055.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      }
    ],
    lostReason: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lead-110',
    name: 'Khairul Nizam',
    company: 'Sambal King Production Sdn Bhd',
    phone: '012-888 9921',
    email: 'nizam@sambalking.com.my',
    dealValue: 15500,
    stage: 'new',
    priority: 'high',
    source: 'TikTok Ads',
    assignedTo: 'Unassigned',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    nextFollowUpDate: new Date().toISOString().split('T')[0],
    notes: 'Inbound Inquiry: "Perlukan sistem tracking pesanan ejen & automated WhatsApp invoice untuk 300+ stokis seluruh Malaysia."',
    bant: {
      budget: true,
      authority: true,
      need: true,
      timeline: true
    },
    quotations: [],
    invoices: [],
    activities: [
      {
        id: 'act-14',
        type: 'note',
        author: 'System',
        content: '⚡ TikTok Lead Ads Webhook received: "Viral Sambal FMCG Campaign".',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      }
    ],
    lostReason: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lead-111',
    name: 'Datin Diana Mansor',
    company: 'Diana Couture Atelier Bangsar',
    phone: '017-777 4321',
    email: 'diana@dianacouture.my',
    dealValue: 24000,
    stage: 'won',
    priority: 'high',
    source: 'Direct WhatsApp',
    assignedTo: 'Sarah (BD Manager)',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    nextFollowUpDate: undefined,
    notes: 'Bespoke customer relationship portal for private VIP bridal appointments & bespoke tailor fitting schedule.',
    bant: {
      budget: true,
      authority: true,
      need: true,
      timeline: true
    },
    quotations: [
      {
        id: 'qt-111',
        number: 'QT-2026-0022',
        date: '2026-08-04',
        validUntil: '2026-08-18',
        status: 'approved',
        items: [
          { description: 'Couture VIP Fitting & Measurement Booking System', qty: 1, unitPrice: 16000, total: 16000 },
          { description: 'WhatsApp Automated Appointment Reminders & Catalog Sync', qty: 1, unitPrice: 8000, total: 8000 }
        ],
        subtotal: 24000,
        tax: 0,
        total: 24000,
        notes: 'Signed and approved by Datin Diana on 08 August 2026.'
      }
    ],
    invoices: [
      {
        id: 'inv-111',
        number: 'INV-2026-0092',
        date: '2026-08-09',
        dueDate: '2026-08-23',
        status: 'paid',
        items: [
          { description: '100% Upfront Annual Pro License - Diana Couture Atelier', qty: 1, unitPrice: 24000, total: 24000 }
        ],
        subtotal: 24000,
        tax: 0,
        total: 24000,
        paidAt: '2026-08-09T16:20:00Z',
        paymentMethod: 'CIMB Clicks Instant Transfer (Ref: CIMB-991204)'
      }
    ],
    activities: [
      {
        id: 'act-15',
        type: 'meeting',
        author: 'Sarah',
        content: 'In-person boutique walkthrough at Bangsar. Full invoice INV-2026-0092 (RM24k) settled via CIMB transfer.',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    lostReason: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lead-112',
    name: 'Ir. Bryan Goh',
    company: 'Nexus Civil Engineering PLT',
    phone: '016-333 4901',
    email: 'bryan.goh@nexuseng.com.my',
    dealValue: 42000,
    stage: 'proposal_sent',
    priority: 'medium',
    source: 'Website Form',
    assignedTo: 'Aiman (Sales Lead)',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    nextFollowUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: 'Civil engineering firm needs project milestone tracker CRM and sub-contractor bid management portal.',
    bant: {
      budget: true,
      authority: true,
      need: true,
      timeline: true
    },
    quotations: [
      {
        id: 'qt-112',
        number: 'QT-2026-0045',
        date: '2026-08-09',
        validUntil: '2026-08-23',
        status: 'sent',
        items: [
          { description: 'Civil Engineering Sub-Contractor Bid & Progress Tracker Portal', qty: 1, unitPrice: 32000, total: 32000 },
          { description: 'Cloud Auto-Backup & Document Audit Trail Module', qty: 1, unitPrice: 10000, total: 10000 }
        ],
        subtotal: 42000,
        tax: 0,
        total: 42000,
        notes: 'Submitted for technical committee evaluation.'
      }
    ],
    invoices: [],
    activities: [
      {
        id: 'act-16',
        type: 'whatsapp',
        author: 'Aiman',
        content: 'Sent technical RFP Quotation QT-2026-0045 (RM 42,000) & compliance checklist.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    lostReason: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lead-113',
    name: 'Hj. Roslan Osman',
    company: 'Nur Iman Umrah & Travel Group',
    phone: '013-444 8920',
    email: 'roslan@nurimantravel.com.my',
    dealValue: 19000,
    stage: 'contacted',
    priority: 'high',
    source: 'Meta Ads',
    assignedTo: 'Aiman (Sales Lead)',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    nextFollowUpDate: new Date().toISOString().split('T')[0],
    notes: 'Inquired about passport collection status tracking & automated WhatsApp reminder broadcasts for 2,000 pilgrims.',
    bant: {
      budget: true,
      authority: true,
      need: true,
      timeline: true
    },
    quotations: [
      {
        id: 'qt-113',
        number: 'QT-2026-0056',
        date: '2026-08-13',
        validUntil: '2026-08-27',
        status: 'draft',
        items: [
          { description: 'Umrah Pilgrim Passport & Visa Pipeline Management Portal', qty: 1, unitPrice: 13000, total: 13000 },
          { description: 'Automated WhatsApp Flight & Hotel Notification Broadcasts', qty: 1, unitPrice: 6000, total: 6000 }
        ],
        subtotal: 19000,
        tax: 0,
        total: 19000,
        notes: 'Draft quotation prepared for demo presentation.'
      }
    ],
    invoices: [],
    activities: [
      {
        id: 'act-17',
        type: 'call',
        author: 'Aiman',
        content: 'Briefed Haji Roslan on automated broadcast quotas and API compliance. Prepared Quotation QT-2026-0056.',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
      }
    ],
    lostReason: undefined,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lead-114',
    name: 'Samantha Low',
    company: 'Zenith Talent & Executive Search',
    phone: '012-777 9012',
    email: 'samantha@zenithtalent.io',
    dealValue: 8800,
    stage: 'lost',
    priority: 'low',
    source: 'Google Search',
    assignedTo: 'Sarah (BD Manager)',
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    nextFollowUpDate: undefined,
    notes: 'Recruitment firm evaluating CRM solutions for headhunter candidate tracking.',
    bant: {
      budget: true,
      authority: true,
      need: true,
      timeline: false
    },
    quotations: [
      {
        id: 'qt-114',
        number: 'QT-2026-0027',
        date: '2026-08-06',
        validUntil: '2026-08-20',
        status: 'declined',
        items: [
          { description: 'Headhunter Talent Pipeline & Candidate CRM', qty: 1, unitPrice: 8800, total: 8800 }
        ],
        subtotal: 8800,
        tax: 0,
        total: 8800,
        notes: 'Declined: Selected specialized niche ATS competitor.'
      }
    ],
    invoices: [],
    activities: [
      {
        id: 'act-18',
        type: 'call',
        author: 'Sarah',
        content: 'Client informed they chose a niche global ATS platform instead.',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    lostReason: 'Chose Competitor',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lead-115',
    name: 'Amirul Hakim',
    company: 'AutoPro Car Care Specialist (4 Outlets)',
    phone: '011-555 6789',
    email: 'amirul@autoprocare.my',
    dealValue: 16000,
    stage: 'new',
    priority: 'medium',
    source: 'Direct WhatsApp',
    assignedTo: 'Unassigned',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    nextFollowUpDate: new Date().toISOString().split('T')[0],
    notes: 'WhatsApp inquiry: "Salam, kami ada 4 bengkel servis kereta di Shah Alam & Klang. Nak tanya pakej auto-reminder servis minyak hitam & tayar."',
    bant: {
      budget: true,
      authority: true,
      need: true,
      timeline: true
    },
    quotations: [],
    invoices: [],
    activities: [
      {
        id: 'act-19',
        type: 'note',
        author: 'System',
        content: 'Direct WhatsApp Click-to-Chat link clicked: "Automotive Maintenance Campaign".',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      }
    ],
    lostReason: undefined,
    updatedAt: new Date().toISOString()
  }
];

export const QUICK_TEMPLATES: QuickTemplate[] = [
  {
    id: 'intro',
    title: 'Introduction & Greeting (First Contact)',
    template: 'Hi {{name}}! 👋 Thanks for reaching out to us at {{company}}. I\'m {{agent}} from the sales team. How can we best assist you with your requirements today?'
  },
  {
    id: 'proposal_followup',
    title: 'Proposal & Quotation Follow-Up',
    template: 'Hi {{name}}, I wanted to quickly follow up on the {{dealValue}} quotation (Ref: {{docNumber}}) we sent over. Do you have any questions or items we can clarify for {{company}}?'
  },
  {
    id: 'invoice_ready',
    title: 'Official Invoice & Payment Details',
    template: 'Salam {{name}}, terima kasih atas persetujuan projek bersama {{company}}. Dilampirkan Invois Rasmi {{docNumber}} berjumlah {{dealValue}}. Maklumat bayaran dan resit boleh disemak melalui pautan ini.'
  },
  {
    id: 'demo_booking',
    title: '15-Minute Live Demo Invitation (Google Meet)',
    template: 'Hi {{name}}, if you have 15 minutes tomorrow, let\'s hop on a quick Google Meet demo so I can show how our system saves {{company}} 3+ hours of manual work every day?'
  },
  {
    id: 'closing_offer',
    title: 'Limited-Time Incentive / Closing Offer',
    template: 'Hi {{name}}, for this week only, our team is offering complimentary setup & 1 month free on the selected package for {{company}}. Would you like to lock this in?'
  },
  {
    id: 'ghosting_recovery',
    title: 'Gentle Follow-Up / Ghosting Recovery',
    template: 'Hi {{name}}, just checking in to see if {{company}} is still planning to automate your sales workflow this month? Let me know if you have any questions or constraints! 😊'
  }
];
