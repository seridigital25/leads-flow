import React from 'react';
import { useLeads } from '../../context/LeadContext';
import { formatCurrency, formatShortDate, getFollowUpStatus, getRelativeTime, getWhatsAppUrl } from '../../lib/utils';
import { STAGES, PRIORITIES } from '../../data/initialLeads';
import { 
  Phone, 
  MessageSquare, 
  Clock, 
  Calendar, 
  Building2, 
  AlertCircle, 
  ChevronRight, 
  MoreHorizontal,
  Flame,
  ArrowRight,
  FileText,
  Receipt,
  CheckCircle2
} from 'lucide-react';

export default function LeadCard({ lead }) {
  const { setSelectedLeadId, moveStage } = useLeads();

  const priorityObj = PRIORITIES.find(p => p.id === lead.priority) || PRIORITIES[2];
  const followUpInfo = getFollowUpStatus(lead.nextFollowUpDate);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', lead.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleWhatsAppClick = (e) => {
    e.stopPropagation();
    const text = `Hi ${lead.name}! Thanks for reaching out to us. How can we best help you with your requirements today?`;
    const waUrl = getWhatsAppUrl(lead.phone, text);
    window.open(waUrl, '_blank');
  };

  const handleCallClick = (e) => {
    e.stopPropagation();
    window.location.href = `tel:${lead.phone}`;
  };

  const isOverdue = followUpInfo.status === 'overdue' && lead.stage !== 'won' && lead.stage !== 'lost';
  const isDueToday = followUpInfo.status === 'today' && lead.stage !== 'won' && lead.stage !== 'lost';

  const hasPaidInvoice = lead.invoices?.some(i => i.status === 'paid');
  const hasQuotation = lead.quotations && lead.quotations.length > 0;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => setSelectedLeadId(lead.id)}
      className="group relative bg-white dark:bg-zinc-900 rounded-lg p-3 border border-zinc-200/90 dark:border-zinc-800 shadow-2xs hover:shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-grab active:cursor-grabbing select-none"
    >
      {/* Top Row: Priority Badge & Deal Value */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
            lead.priority === 'urgent'
              ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
              : lead.priority === 'high'
              ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
              : lead.priority === 'medium'
              ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
              : 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
          }`}>
            {priorityObj.label}
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">
            {lead.source}
          </span>
        </div>

        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-mono">
          {formatCurrency(lead.dealValue)}
        </span>
      </div>

      {/* Main Info: Name & Company */}
      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
        {lead.name}
      </h4>
      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5 line-clamp-1">
        <Building2 className="w-3 h-3 shrink-0 text-zinc-400" />
        <span>{lead.company}</span>
      </p>

      {/* Document Indicator Pill if available */}
      {hasPaidInvoice ? (
        <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/80 font-mono">
          <CheckCircle2 className="w-3 h-3" />
          <span>INV #{lead.invoices[0]?.number} (PAID)</span>
        </div>
      ) : hasQuotation ? (
        <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800/80 font-mono">
          <FileText className="w-3 h-3" />
          <span>QT #{lead.quotations[0]?.number} ({lead.quotations[0]?.status})</span>
        </div>
      ) : lead.notes ? (
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/40 rounded p-1.5 mt-2 line-clamp-2 border border-zinc-100 dark:border-zinc-800/80 leading-relaxed italic">
          "{lead.notes}"
        </p>
      ) : null}

      {/* Lost Reason if stage is lost */}
      {lead.stage === 'lost' && lead.lostReason && (
        <div className="mt-2 text-[10px] font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-1 rounded border border-rose-200 dark:border-rose-800">
          Reason: {lead.lostReason}
        </div>
      )}

      {/* Footer Meta: Follow-up alert & Quick Actions */}
      <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px]">
        {/* Next Follow-up Alert */}
        {lead.nextFollowUpDate && lead.stage !== 'won' && lead.stage !== 'lost' ? (
          <div className={`flex items-center gap-1 font-medium ${
            isOverdue
              ? 'text-rose-600 dark:text-rose-400'
              : isDueToday
              ? 'text-amber-600 dark:text-amber-400 font-semibold'
              : 'text-zinc-500 dark:text-zinc-400'
          }`}>
            <Calendar className="w-3 h-3 shrink-0" />
            <span>{followUpInfo.label}</span>
          </div>
        ) : (
          <span className="text-zinc-400 text-[10px]">
            {getRelativeTime(lead.createdAt)}
          </span>
        )}

        {/* 1-Click Quick Contact Bar */}
        <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleWhatsAppClick}
            title="Chat via WhatsApp"
            className="p-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800/60 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3 h-3" />
          </button>
          <button
            onClick={handleCallClick}
            title="Call phone"
            className="p-1 rounded bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer"
          >
            <Phone className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
