import React from 'react';

/**
 * LeadFlow Brand Logo Component
 * Renders the custom velocity flow emblem + typography lockup
 */
export function BrandIcon({ className = "w-8 h-8" }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 dark:from-zinc-100 dark:via-zinc-50 dark:to-zinc-200 shadow-md shadow-emerald-500/10 border border-zinc-800/80 dark:border-zinc-300 ${className}`}>
      {/* SVG Velocity Bolt & Inbound Funnel Nodes */}
      <svg 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-3/5 h-3/5"
      >
        <defs>
          <linearGradient id="lfEmeraldGrad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="#34d399" />
            <stop offset="0.5" stopColor="#10b981" />
            <stop offset="1" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="lfDarkGrad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="#059669" />
            <stop offset="1" stopColor="#047857" />
          </linearGradient>
        </defs>

        {/* Dynamic Velocity Flow Paths */}
        <path 
          d="M7 6H19C22.3137 6 25 8.68629 25 12V12C25 15.3137 22.3137 18 19 18H9" 
          stroke="url(#lfEmeraldGrad)" 
          strokeWidth="3.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="dark:hidden"
        />
        <path 
          d="M7 6H19C22.3137 6 25 8.68629 25 12V12C25 15.3137 22.3137 18 19 18H9" 
          stroke="url(#lfDarkGrad)" 
          strokeWidth="3.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="hidden dark:block"
        />

        {/* Speed Lightning Inbound Arrow */}
        <path 
          d="M13 13L8 18L13 23" 
          stroke="url(#lfEmeraldGrad)" 
          strokeWidth="3.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="dark:hidden"
        />
        <path 
          d="M13 13L8 18L13 23" 
          stroke="url(#lfDarkGrad)" 
          strokeWidth="3.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="hidden dark:block"
        />

        {/* Closing Conversion Node */}
        <circle 
          cx="22" 
          cy="23" 
          r="3" 
          fill="#10b981" 
          className="dark:fill-emerald-600 animate-pulse"
        />
      </svg>
    </div>
  );
}

export default function BrandLogo({ size = 'md', showTagline = false, onClick }) {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''}`}
    >
      <BrandIcon className={isSmall ? 'w-7 h-7' : isLarge ? 'w-10 h-10' : 'w-8 h-8'} />
      <div>
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 ${
            isSmall ? 'text-sm' : isLarge ? 'text-xl' : 'text-base'
          }`}>
            Lead<span className="text-emerald-600 dark:text-emerald-400">Flow</span>
          </span>
          <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
            CRM
          </span>
        </div>
        {showTagline && (
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium mt-1">
            High-Velocity WhatsApp Pipeline
          </p>
        )}
      </div>
    </div>
  );
}
