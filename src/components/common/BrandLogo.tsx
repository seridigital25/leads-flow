import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showBadge?: boolean;
  onClick?: () => void;
}

export function BrandIcon({ className = "w-8 h-8", onClick }: { className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center rounded-xl bg-zinc-950 dark:bg-zinc-900 border border-zinc-800 p-1.5 shrink-0 select-none ${onClick ? 'cursor-pointer hover:border-emerald-500/80 transition-colors' : ''} ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path
          d="M20 50L45 25L75 25L50 50L80 50L45 85L55 55L30 55L20 50Z"
          fill="url(#brandGradient)"
        />
        <circle cx="50" cy="50" r="6" fill="#ffffff" />
        <defs>
          <linearGradient id="brandGradient" x1="20" y1="25" x2="80" y2="85" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10b981" />
            <stop offset="0.5" stopColor="#059669" />
            <stop offset="1" stopColor="#047857" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function BrandLogo({ size = 'md', className = '', showBadge = true, onClick }: BrandLogoProps) {
  const sizeClasses = {
    sm: { icon: 'w-6 h-6', text: 'text-sm', badge: 'text-[9px] px-1.5 py-0.2' },
    md: { icon: 'w-8 h-8', text: 'text-base', badge: 'text-[10px] px-2 py-0.5' },
    lg: { icon: 'w-10 h-10', text: 'text-xl', badge: 'text-xs px-2.5 py-0.5' }
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      <BrandIcon className={currentSize.icon} />
      
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 ${currentSize.text} ${onClick ? 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors' : ''}`}>
            Lead<span className="text-emerald-600 dark:text-emerald-400">Flow</span>
          </span>
          <span className={`font-bold text-zinc-400 dark:text-zinc-500 text-[10px] uppercase tracking-wider`}>
            CRM
          </span>
          {showBadge && (
            <span className={`font-mono font-bold rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80 ${currentSize.badge}`}>
              RM
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
