import React from 'react';
import { useLeads } from '../../context/LeadContext';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export default function Toast() {
  const { toast } = useLeads();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isInfo = toast.type === 'info';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-fade-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium transition-all ${
        isSuccess
          ? 'bg-zinc-900 text-white border-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-200'
          : isInfo
          ? 'bg-blue-600 text-white border-blue-500'
          : 'bg-rose-600 text-white border-rose-500'
      }`}>
        {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />}
        {isInfo && <Info className="w-4 h-4 text-blue-200 shrink-0" />}
        {isError && <AlertCircle className="w-4 h-4 text-rose-200 shrink-0" />}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
