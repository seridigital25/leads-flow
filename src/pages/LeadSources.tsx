import React, { useMemo, useState } from 'react';
import { useLeads } from '../context/LeadContext';
import { LeadSource } from '../types';
import { Radio, Plus, Pencil, Trash2, X, Check, Filter } from 'lucide-react';

const CATEGORIES = ['Paid Ads', 'Inbound', 'Organic', 'Referral', 'Events', 'Outbound', 'Other'];

export default function LeadSources() {
  const { sources, addSource, updateSource, deleteSource, leads, setSelectedSource, showToast } = useLeads();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<LeadSource | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Inbound');

  const leadCounts = useMemo(() => {
    const counts = new Map<string, number>();
    leads.forEach((l) => counts.set(l.source, (counts.get(l.source) || 0) + 1));
    return counts;
  }, [leads]);

  const openCreateForm = () => {
    setEditingSource(null);
    setName('');
    setCategory('Inbound');
    setIsFormOpen(true);
  };

  const openEditForm = (source: LeadSource) => {
    setEditingSource(source);
    setName(source.name);
    setCategory(source.category);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Source name cannot be empty.', 'error');
      return;
    }
    if (editingSource) {
      // Prevent renaming to a name that already exists (on another source)
      if (sources.some((s) => s.id !== editingSource.id && s.name.toLowerCase() === name.trim().toLowerCase())) {
        showToast(`Source "${name.trim()}" already exists.`, 'error');
        return;
      }
      updateSource(editingSource.id, { name: name.trim(), category });
      showToast(`Lead source "${name.trim()}" updated.`);
    } else {
      addSource({ name, category });
    }
    setIsFormOpen(false);
  };

  const handleDelete = (source: LeadSource) => {
    const inUse = leadCounts.get(source.name) || 0;
    const msg = inUse > 0
      ? `"${source.name}" is used by ${inUse} lead(s). Deleting it will NOT change those leads, but the source will disappear from new-lead dropdowns. Delete anyway?`
      : `Delete lead source "${source.name}"?`;
    if (window.confirm(msg)) {
      deleteSource(source.id);
    }
  };

  const handleToggleActive = (source: LeadSource) => {
    updateSource(source.id, { isActive: !source.isActive });
  };

  const handleFilterLeads = (source: LeadSource) => {
    setSelectedSource(source.name);
    showToast(`Lead table filtered by source: ${source.name}`, 'info');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-zinc-100/60 dark:bg-zinc-950 space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Radio className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <div>
            <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">Lead Sources</h2>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Manage the channels your leads come from. {sources.length} sources configured.
            </p>
          </div>
        </div>
        <button
          onClick={openCreateForm}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Source</span>
        </button>
      </div>

      {/* Sources table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/40 text-zinc-500 dark:text-zinc-400 font-semibold">
                <th className="py-3 px-4">Source Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Leads</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
              {sources.length > 0 ? (
                sources.map((source) => {
                  const count = leadCounts.get(source.name) || 0;
                  return (
                    <tr key={source.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">{source.name}</td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800">
                          {source.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleActive(source)}
                          title={source.isActive ? 'Active — available when creating leads. Click to deactivate.' : 'Inactive. Click to activate.'}
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer transition-colors ${
                            source.isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                              : 'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
                          }`}
                        >
                          {source.isActive ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          {source.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-zinc-700 dark:text-zinc-300">{count}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleFilterLeads(source)}
                            disabled={count === 0}
                            title={`Filter lead table by "${source.name}"`}
                            className="p-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Filter className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditForm(source)}
                            title="Edit Source"
                            className="p-1 rounded bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(source)}
                            title="Delete Source"
                            className="p-1 rounded text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-400 text-sm">
                    No lead sources configured. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsFormOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-fade-in" />
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden z-10 animate-fade-in">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {editingSource ? 'Edit Lead Source' : 'Add Lead Source'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Source Name *</label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. LinkedIn Outreach, Raya Expo Booth"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs p-2 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all cursor-pointer shadow-xs"
                >
                  {editingSource ? 'Save Changes' : 'Add Source'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
