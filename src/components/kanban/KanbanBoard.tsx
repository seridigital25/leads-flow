import React, { useState } from 'react';
import { useLeads } from '../../context/LeadContext';
import { STAGES } from '../../data/initialLeads';
import { formatCurrency } from '../../lib/utils';
import { StageId } from '../../types';
import LeadCard from './LeadCard';
import { Plus, Inbox, Lock } from 'lucide-react';

export default function KanbanBoard() {
  const { filteredLeads, moveStage, setIsAddModalOpen, isLimitReached, maxLeads, leads } = useLeads();
  const [dragOverStage, setDragOverStage] = useState<StageId | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, stageId: StageId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStage !== stageId) {
      setDragOverStage(stageId);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>, stageId: StageId) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (dragOverStage === stageId) {
      setDragOverStage(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, stageId: StageId) => {
    e.preventDefault();
    setDragOverStage(null);
    const leadId = e.dataTransfer.getData('text/plain');
    if (leadId) {
      moveStage(leadId, stageId);
    }
  };

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 bg-zinc-100/70 dark:bg-zinc-950">
      <div className="flex gap-3 h-full min-w-max pb-2">
        {STAGES.map((stage) => {
          const stageLeads = filteredLeads.filter(l => l.stage === stage.id);
          const totalValue = stageLeads.reduce((acc, curr) => acc + (Number(curr.dealValue) || 0), 0);
          const isDraggingOver = dragOverStage === stage.id;

          return (
            <div
              key={stage.id}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={(e) => handleDragLeave(e, stage.id)}
              onDrop={(e) => handleDrop(e, stage.id)}
              className={`w-72 sm:w-80 flex flex-col rounded-xl transition-all ${
                isDraggingOver
                  ? 'bg-zinc-200/80 dark:bg-zinc-800/80 ring-2 ring-zinc-400 dark:ring-zinc-600'
                  : 'bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80'
              }`}
            >
              {/* Column Header */}
              <div className="p-3 border-b border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    stage.id === 'new' ? 'bg-blue-500' :
                    stage.id === 'contacted' ? 'bg-amber-500' :
                    stage.id === 'qualified' ? 'bg-indigo-500' :
                    stage.id === 'proposal_sent' ? 'bg-purple-500' :
                    stage.id === 'won' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`} />
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                    {stage.label}
                  </h3>
                  <span className="text-[11px] font-semibold px-1.5 py-0.2 rounded bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="text-[11px] font-mono font-medium text-zinc-600 dark:text-zinc-400">
                  {formatCurrency(totalValue)}
                </div>
              </div>

              {/* Card List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {stageLeads.length > 0 ? (
                  stageLeads.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} />
                  ))
                ) : (
                  <div className="h-32 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg flex flex-col items-center justify-center text-zinc-400 text-xs p-4 text-center">
                    <Inbox className="w-5 h-5 mb-1.5 opacity-40" />
                    <span>Drop leads here</span>
                  </div>
                )}
              </div>

              {/* Quick Add at bottom of New Lead Column */}
              {stage.id === 'new' && (
                <div className="p-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className={`w-full py-1.5 px-2 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      isLimitReached
                        ? 'text-zinc-400 dark:text-zinc-500 bg-zinc-100/50 dark:bg-zinc-800/30'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {isLimitReached ? (
                      <>
                        <Lock className="w-3 h-3 text-zinc-400" />
                        <span>Limit reached ({leads.length}/{maxLeads})</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add new inquiry ({leads.length}/{maxLeads})</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
