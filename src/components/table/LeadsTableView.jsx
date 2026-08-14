import React from 'react';
import { useLeads } from '../../context/LeadContext';
import { formatCurrency, formatShortDate, getFollowUpStatus, getWhatsAppUrl } from '../../lib/utils';
import { STAGES, PRIORITIES } from '../../data/initialLeads';
import { 
  Building2, 
  Phone, 
  MessageSquare, 
  Calendar, 
  MoreHorizontal, 
  ExternalLink, 
  Trash2, 
  Inbox,
  FileText,
  Receipt,
  CheckCircle2
} from 'lucide-react';

export default function LeadsTableView() {
  const { filteredLeads, moveStage, setSelectedLeadId, deleteLead } = useLeads();

  const handleWhatsApp = (e, lead) => {
    e.stopPropagation();
    const text = `Hi ${lead.name}! Thanks for connecting with us.`;
    const waUrl = getWhatsAppUrl(lead.phone, text);
    window.open(waUrl, '_blank');
  };

  const handleCall = (e, phone) => {
    e.stopPropagation();
    window.location.href = `tel:${phone}`;
  };

  const handleDelete = (e, leadId) => {
    e.stopPropagation();
    if (window.confirm('Delete this lead record?')) {
      deleteLead(leadId);
    }
  };

  return (
    <div className="flex-1 overflow-auto p-4 bg-zinc-100/60 dark:bg-zinc-950">
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/40 text-zinc-500 dark:text-zinc-400 font-semibold">
                <th className="py-3 px-4">Contact & Company</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Deal Value & Docs</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Next Follow-Up</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => {
                  const priorityObj = PRIORITIES.find(p => p.id === lead.priority) || PRIORITIES[2];
                  const followUp = getFollowUpStatus(lead.nextFollowUpDate);
                  const hasPaidInvoice = lead.invoices?.some(i => i.status === 'paid');
                  const hasQuotation = lead.quotations && lead.quotations.length > 0;

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLeadId(lead.id)}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors group"
                    >
                      {/* Name & Company */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {lead.name}
                        </div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-zinc-400" />
                          <span>{lead.company}</span>
                        </div>
                      </td>

                      {/* Stage Dropdown Selector */}
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.stage}
                          onChange={(e) => moveStage(lead.id, e.target.value)}
                          className="text-xs font-semibold py-1 px-2 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 focus:ring-1 focus:ring-zinc-900 cursor-pointer"
                        >
                          {STAGES.map(st => (
                            <option key={st.id} value={st.id}>{st.label}</option>
                          ))}
                        </select>
                      </td>

                      {/* Deal Value & Document Badges */}
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                          {formatCurrency(lead.dealValue)}
                        </div>
                        {hasPaidInvoice ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">
                            <CheckCircle2 className="w-3 h-3" /> INV #{lead.invoices[0]?.number} (Paid)
                          </span>
                        ) : hasQuotation ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-700 dark:text-blue-400 font-mono mt-0.5">
                            <FileText className="w-3 h-3" /> QT #{lead.quotations[0]?.number}
                          </span>
                        ) : null}
                      </td>

                      {/* Priority Badge */}
                      <td className="py-3 px-4">
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
                      </td>

                      {/* Source */}
                      <td className="py-3 px-4 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                        {lead.source}
                      </td>

                      {/* Next Follow-Up */}
                      <td className="py-3 px-4">
                        {lead.nextFollowUpDate && lead.stage !== 'won' && lead.stage !== 'lost' ? (
                          <div className={`text-[11px] font-medium flex items-center gap-1 ${
                            followUp.status === 'overdue'
                              ? 'text-rose-600 dark:text-rose-400 font-bold'
                              : followUp.status === 'today'
                              ? 'text-amber-600 dark:text-amber-400 font-semibold'
                              : 'text-zinc-500 dark:text-zinc-400'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            <span>{followUp.label} ({formatShortDate(lead.nextFollowUpDate)})</span>
                          </div>
                        ) : (
                          <span className="text-zinc-400 text-[11px]">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => handleWhatsApp(e, lead)}
                            title="Chat via WhatsApp"
                            className="p-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleCall(e, lead.phone)}
                            title="Call Phone"
                            className="p-1 rounded bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, lead.id)}
                            title="Delete Lead"
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
                  <td colSpan="7" className="py-12 text-center text-zinc-400">
                    <Inbox className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium">No leads found matching current filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
