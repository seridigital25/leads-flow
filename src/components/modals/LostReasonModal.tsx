import React, { useState } from 'react';
import { useLeads } from '../../context/LeadContext';
import { LOST_REASONS } from '../../data/initialLeads';
import { X, AlertOctagon } from 'lucide-react';

export default function LostReasonModal() {
  const { lostModalLeadId, setLostModalLeadId, confirmLostReason } = useLeads();
  const [selectedReason, setSelectedReason] = useState<string>(LOST_REASONS[0]);
  const [customReason, setCustomReason] = useState<string>('');

  if (!lostModalLeadId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = selectedReason === 'Other' ? (customReason.trim() || 'Other') : selectedReason;
    confirmLostReason(lostModalLeadId, finalReason);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setLostModalLeadId(null)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden z-10 animate-fade-in">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-rose-50/50 dark:bg-rose-950/20">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Mark Deal as Closed Lost
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Categorize the reason for funnel analytics and loss prevention.
              </p>
            </div>
          </div>
          <button
            onClick={() => setLostModalLeadId(null)}
            className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block">
              Primary Reason for Deal Loss:
            </label>

            <div className="space-y-1.5">
              {LOST_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                    selectedReason === reason
                      ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 font-semibold'
                      : 'bg-zinc-50/50 dark:bg-zinc-800/30 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="lostReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="text-rose-600 focus:ring-rose-500"
                  />
                  <span>{reason}</span>
                </label>
              ))}

              <label
                className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                  selectedReason === 'Other'
                    ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 font-semibold'
                    : 'bg-zinc-50/50 dark:bg-zinc-800/30 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <input
                  type="radio"
                  name="lostReason"
                  value="Other"
                  checked={selectedReason === 'Other'}
                  onChange={() => setSelectedReason('Other')}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <span>Other Specific Reason...</span>
              </label>
            </div>

            {selectedReason === 'Other' && (
              <textarea
                rows={2}
                required
                placeholder="Explain specific circumstance..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="w-full text-xs p-2 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-rose-500 mt-2"
              />
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setLostModalLeadId(null)}
              className="px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold rounded-md bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer shadow-xs"
            >
              Confirm Closed Lost
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
