import React, { useState } from 'react';
import { MessageSquare, X, Sparkles, ArrowUpRight } from 'lucide-react';

export default function PocContactBanner() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const developerPhone = '60135928812';
  const waMessage = encodeURIComponent(
    'Hi Sharil, I tried the LeadFlow CRM POC prototype and I am interested in discussing a custom CRM / web application build for my business.'
  );
  const waUrl = `https://wa.me/${developerPhone}?text=${waMessage}`;

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-4 z-40 animate-fade-in no-print">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-zinc-900 dark:bg-zinc-800 text-white text-xs font-semibold shadow-lg border border-zinc-700 hover:border-emerald-500 transition-all cursor-pointer hover:scale-105"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>POC Prototype • Contact Developer</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-sm sm:max-w-md w-[calc(100vw-2rem)] animate-fade-in no-print">
      <div className="p-4 rounded-xl bg-zinc-900 text-white shadow-2xl border border-zinc-800 backdrop-blur-md flex flex-col gap-2.5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
              Proof of Concept (POC)
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(true)}
              title="Minimize"
              className="text-[11px] text-zinc-400 hover:text-zinc-200 px-1.5 py-0.5 rounded hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Minimize
            </button>
            <button
              onClick={() => setIsOpen(false)}
              title="Dismiss"
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* English Content */}
        <p className="text-xs text-zinc-300 leading-relaxed">
          This is an interactive frontend prototype for <strong>LeadFlow CRM</strong>. Interested in building a custom CRM, WhatsApp sales automation, or software solution for your business?
        </p>

        {/* Action Button */}
        <div className="flex items-center gap-2 pt-0.5">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer hover:scale-[1.01]"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-white" />
            <span>Chat with Developer on WhatsApp</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>
      </div>
    </div>
  );
}
