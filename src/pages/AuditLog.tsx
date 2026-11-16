import React, { useMemo, useState } from 'react';
import { useLeads } from '../context/LeadContext';
import { AUDIT_ACTION_LABELS } from '../lib/audit';
import { AuditAction, AuditEvent } from '../types';
import { formatDate, getRelativeTime } from '../lib/utils';
import { ScrollText, Trash2, Search, X, User, Clock, FileText } from 'lucide-react';

const ACTION_STYLES: Record<AuditAction, string> = {
  lead_created: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
  lead_updated: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
  lead_deleted: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
  lead_stage_changed: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
  lead_lost: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
  export_csv: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800',
  export_json: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800',
  demo_reset: 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
};

export default function AuditLog() {
  const { auditEvents, clearAuditLog, mode } = useLeads();
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<'all' | AuditAction>('all');

  const availableActions = useMemo(() => {
    const seen = new Set<AuditAction>();
    auditEvents.forEach((e) => seen.add(e.action));
    return Array.from(seen);
  }, [auditEvents]);

  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return auditEvents.filter((e: AuditEvent) => {
      if (actionFilter !== 'all' && e.action !== actionFilter) return false;
      if (
        q &&
        !(
          e.actor?.toLowerCase().includes(q) ||
          e.targetName?.toLowerCase().includes(q) ||
          e.details?.toLowerCase().includes(q) ||
          AUDIT_ACTION_LABELS[e.action]?.toLowerCase().includes(q)
        )
      ) {
        return false;
      }
      return true;
    });
  }, [auditEvents, search, actionFilter]);

  const handleClear = () => {
    if (window.confirm('Clear the entire audit log? This cannot be undone.')) {
      clearAuditLog();
    }
  };

  const hasFilters = search || actionFilter !== 'all';

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-zinc-100/60 dark:bg-zinc-950 space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ScrollText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <div>
            <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">Audit Trail</h2>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Who did what, and when. {filteredEvents.length} of {auditEvents.length} events
              {mode === 'owner' && ' · mirrored to the server (best-effort)'}.
            </p>
          </div>
        </div>
        <button
          onClick={handleClear}
          disabled={auditEvents.length === 0}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Log</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs p-3 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px] max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search actor, lead, details…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-7 py-1.5 text-xs rounded-md bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-400"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value as 'all' | AuditAction)}
          className="text-xs py-1.5 px-2.5 rounded-md bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-300 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-400 cursor-pointer"
        >
          <option value="all">All Actions</option>
          {availableActions.map((a) => (
            <option key={a} value={a}>{AUDIT_ACTION_LABELS[a]}</option>
          ))}
        </select>
        {hasFilters && (
          <button
            onClick={() => { setSearch(''); setActionFilter('all'); }}
            className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs overflow-hidden">
        {filteredEvents.length > 0 ? (
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {filteredEvents.map((event) => (
              <li key={event.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ACTION_STYLES[event.action]}`}>
                        {AUDIT_ACTION_LABELS[event.action]}
                      </span>
                      {event.targetName && (
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{event.targetName}</span>
                      )}
                    </div>
                    {event.details && (
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1.5 flex items-start gap-1.5">
                        <FileText className="w-3 h-3 shrink-0 mt-0.5" />
                        <span>{event.details}</span>
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[10px] text-zinc-400 font-mono">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {event.actor}
                      </span>
                      <span className="flex items-center gap-1" title={formatDate(event.timestamp)}>
                        <Clock className="w-3 h-3" />
                        {formatDate(event.timestamp)} ({getRelativeTime(event.timestamp)})
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-12 text-center">
            <ScrollText className="w-8 h-8 mx-auto mb-2 text-zinc-300 dark:text-zinc-600" />
            <p className="text-sm font-medium text-zinc-400">
              {auditEvents.length === 0 ? 'No audit events yet — actions will appear here as you work.' : 'No events match the current filters.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
