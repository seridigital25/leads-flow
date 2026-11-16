import React, { useMemo, useState } from 'react';
import { useLeads } from '../../context/LeadContext';
import { STAGES, SOURCES } from '../../data/initialLeads';
import { formatCurrency, formatShortDate } from '../../lib/utils';
import { downloadLeadsCsv } from '../../lib/exportCsv';
import { Lead, SortOption } from '../../types';
import { Download, FileText, Search, X } from 'lucide-react';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'value_desc', label: 'Value: High to Low' },
  { value: 'value_asc', label: 'Value: Low to High' },
  { value: 'name_asc', label: 'Name (A-Z)' },
];

function sortLeads(list: Lead[], sortBy: SortOption): Lead[] {
  const sorted = [...list];
  if (sortBy === 'newest') sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  if (sortBy === 'value_desc') sorted.sort((a, b) => (b.dealValue || 0) - (a.dealValue || 0));
  if (sortBy === 'value_asc') sorted.sort((a, b) => (a.dealValue || 0) - (b.dealValue || 0));
  if (sortBy === 'name_asc') sorted.sort((a, b) => a.name.localeCompare(b.name));
  return sorted;
}

export default function LeadListReport() {
  const { leads, mode } = useLeads();
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Include custom sources from the Sources module in the filter dropdown
  const allSources = useMemo(() => {
    const names = new Set<string>(SOURCES);
    leads.forEach((l) => names.add(l.source));
    return Array.from(names);
  }, [leads]);

  const reportLeads = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = leads.filter((l) => {
      if (q && !(l.name?.toLowerCase().includes(q) || l.company?.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q))) {
        return false;
      }
      if (sourceFilter !== 'all' && l.source !== sourceFilter) return false;
      if (stageFilter !== 'all' && l.stage !== stageFilter) return false;
      return true;
    });
    return sortLeads(filtered, sortBy);
  }, [leads, search, sourceFilter, stageFilter, sortBy]);

  const actor = mode === 'owner' ? 'Owner' : 'Demo User';

  const handleExport = () => {
    downloadLeadsCsv(reportLeads, actor);
  };

  const hasFilters = search || sourceFilter !== 'all' || stageFilter !== 'all';

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs overflow-hidden">
      {/* Header + filters + export */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-zinc-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Lead List Report</h3>
            <span className="text-[11px] text-zinc-400 font-mono">{reportLeads.length} rows</span>
          </div>
          <button
            onClick={handleExport}
            disabled={reportLeads.length === 0}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[180px] max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search name, company, email…"
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
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-md bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-300 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-400 cursor-pointer"
          >
            <option value="all">All Sources</option>
            {allSources.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-md bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-300 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-400 cursor-pointer"
          >
            <option value="all">All Stages</option>
            {STAGES.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-xs py-1.5 px-2.5 rounded-md bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-300 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-400 cursor-pointer font-medium"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>Sort: {o.label}</option>
            ))}
          </select>

          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setSourceFilter('all'); setStageFilter('all'); }}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Report table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/40 text-zinc-500 dark:text-zinc-400 font-semibold">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Stage</th>
              <th className="py-3 px-4 text-right">Value</th>
              <th className="py-3 px-4">Source</th>
              <th className="py-3 px-4">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
            {reportLeads.length > 0 ? (
              reportLeads.map((lead) => {
                const stageObj = STAGES.find((s) => s.id === lead.stage);
                return (
                  <tr key={lead.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">{lead.name}</td>
                    <td className="py-3 px-4">{lead.company || '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${stageObj?.bgLight} ${stageObj?.borderLight} ${stageObj?.bgDark} ${stageObj?.borderDark}`}>
                        {stageObj?.label || lead.stage}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-zinc-900 dark:text-zinc-100">{formatCurrency(lead.dealValue)}</td>
                    <td className="py-3 px-4 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">{lead.source}</td>
                    <td className="py-3 px-4 text-[11px] text-zinc-500 dark:text-zinc-400">{formatShortDate(lead.createdAt)}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-zinc-400 text-sm">No leads match the current report filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
