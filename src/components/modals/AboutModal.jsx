import React from 'react';
import { useLeads } from '../../context/LeadContext';
import BrandLogo, { BrandIcon } from '../common/BrandLogo';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Database, 
  Smartphone, 
  DollarSign, 
  ExternalLink,
  Code2,
  Heart
} from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  const { leads, stats } = useLeads();

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
                  v2.4.0 RM Edition
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
          {/* Core Pillars */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Brand Architecture & Capabilities
            </h4>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>WhatsApp Direct</span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  1-Click <code className="text-emerald-600 dark:text-emerald-400">wa.me</code> launcher with Malaysian phone normalization and closing templates.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Ringgit (RM) Native</span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Engineered specifically for Malaysian business metrics, SME deal sizes, and currency formatting.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Speed to Lead</span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  &lt; 15-minute response protocol designed to eliminate ad spend waste and double lead conversion.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100">
                  <Database className="w-3.5 h-3.5 text-blue-500" />
                  <span>Zero-Backend Security</span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  100% private, client-side browser storage. No external servers or database telemetry.
                </p>
              </div>
            </div>
          </div>

          {/* System Diagnostics */}
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Workspace Telemetry
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">Total Database</span>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{leads.length} Leads</span>
              </div>
              <div className="p-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">Win Rate</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{stats.winRate}%</span>
              </div>
              <div className="p-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">Storage Engine</span>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">LocalStorage</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-1">
              <span>Crafted with</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
              <span>for Malaysian Sales Closers</span>
            </div>

            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold cursor-pointer hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
