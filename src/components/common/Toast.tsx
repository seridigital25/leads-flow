import React from 'react';
import { useLeads } from '../../context/LeadContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast() {
  const { toast } = useLeads();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />,
  };

  const bgStyles = {
    success: 'border-emerald-200 dark:border-emerald-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100',
    error: 'border-rose-200 dark:border-rose-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100',
    info: 'border-blue-200 dark:border-blue-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-fade-in no-print">
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border shadow-xl text-xs font-medium max-w-md ${
          bgStyles[toast.type] || bgStyles.success
        }`}
      >
        {icons[toast.type] || icons.success}
        <span className="leading-snug">{toast.message}</span>
      </div>
    </div>
  );
}
