import React, { useState } from 'react';
import { useLeads } from '../../context/LeadContext';
import { LOST_REASONS } from '../../data/initialLeads';
import { X, AlertOctagon, ArrowRight } from 'lucide-react';

export default function LostReasonModal() {
  const { isLostModalOpen, setIsLostModalOpen, leadPendingLost, setLeadPendingLost, moveStage } = useLeads();
  const [selectedReason, setSelectedReason] = useState(LOST_REASONS[0]);
  const [extraNotes, setExtraNotes] = useState('');

  if (!isLostModalOpen || !leadPendingLost) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalReason = extraNotes.trim() ? `${selectedReason} - ${extraNotes.trim()}` : selectedReason;
    moveStage(leadPendingLost, 'lost', finalReason);
    
    // Reset & close
    setIsLostModalOpen(false);
    setLeadPendingLost(null);
    setExtraNotes('');
  };

  const handleCancel = () => {
    setIsLostModalOpen(false);
    setLeadPendingLost(null);
    setExtraNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={handleCancel}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden z-10 animate-fade-in">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-rose-50/70 dark:bg-rose-950/40">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">
              Record Closed Lost Reason
            </h3>
          </div>
          <button
            onClick={handleCancel}
            className="p-1 rounded text-zinc-400 hover:text-zinc-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Capturing why deals are lost provides marketing intelligence to prevent wasted ad spend and refine sales messaging.
          </p>

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">
              Select Primary Reason *
            </label>
            <div className="space-y-1.5">
              {LOST_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                    selectedReason === reason
                      ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-400 dark:border-rose-700 font-semibold text-rose-900 dark:text-rose-200'
                      : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="lostReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="text-rose-600 focus:ring-0"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Additional Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Competitor offered RM2,000 lower pricing on annual contract..."
              value={extraNotes}
              onChange={(e) => setExtraNotes(e.target.value)}
              className="w-full text-xs p-2 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold rounded-md bg-rose-600 hover:bg-rose-700 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Confirm & Archive Deal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
