import React from 'react';
import { useLeads } from '../../context/LeadContext';
import { BrandIcon } from '../common/BrandLogo';
import { 
  X, 
  Sparkles, 
  Smartphone, 
  DollarSign, 
  Heart,
  MessageSquare,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  FileText
} from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  const { leads, stats } = useLeads();

  const developerPhone = '60135928812';
  const waMessage = encodeURIComponent(
    'Hi Sharil, I tested the LeadFlow CRM POC prototype and would like to discuss building a custom CRM / software solution for my business.'
  );
  const waUrl = `https://wa.me/${developerPhone}?text=${waMessage}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden z-10 animate-fade-in">
        {/* Header Hero Banner */}
        <div className="relative p-6 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 text-white border-b border-zinc-800">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <BrandIcon className="w-12 h-12 shadow-lg shadow-emerald-500/20" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold tracking-tight">
                  Lead<span className="text-emerald-400">Flow</span> CRM
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  POC Edition
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 font-medium">
                High-Velocity Lead Management & WhatsApp Sales Pipeline
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <span className="italic">"Capture fast. Close faster."</span>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Engine Online
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs text-zinc-600 dark:text-zinc-300">
          {/* Developer Contact Card (POC Box) */}
          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interested in a Custom CRM?</span>
              </span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                Developer: Sharil
              </span>
            </div>

            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
              This is an interactive <strong>Proof of Concept (POC)</strong> prototype. If you are looking to build a tailored sales CRM, WhatsApp workflow automation, or custom SaaS application for your organization:
            </p>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer hover:scale-[1.01]"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Chat with Developer on WhatsApp</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-90" />
            </a>
          </div>

          {/* Core Capabilities */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Core Capabilities & Architecture
            </h4>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>WhatsApp Direct</span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  1-Tap <code className="text-emerald-600 dark:text-emerald-400">wa.me</code> launcher with Malaysian phone normalization and pre-filled sales closing templates.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100">
                  <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Quotations & Invoices</span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Generate official itemized quotations and tax invoices with isolated A4 printable formatting.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Speed to Lead</span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Fast response workflows, automated follow-up dates, and BANT qualification checklists.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100">
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                  <span>Zero-Backend Security</span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  100% private, client-side browser storage with structured JSON export capabilities.
                </p>
              </div>
            </div>
          </div>

          {/* Workspace Telemetry */}
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Workspace Telemetry
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 block font-sans">Active Leads</span>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{leads.length} Records</span>
              </div>
              <div className="p-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 block font-sans">Win Rate</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{stats.winRate}%</span>
              </div>
              <div className="p-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 block font-sans">Storage</span>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">LocalStorage</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-1">
              <span>Crafted with</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
              <span>by Sharil</span>
            </div>

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold cursor-pointer hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
