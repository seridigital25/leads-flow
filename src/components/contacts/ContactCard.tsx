import React from 'react';
import { Contact } from '../../types';
import { STAGES } from '../../data/initialLeads';
import { formatCurrency, formatShortDate, getWhatsAppUrl } from '../../lib/utils';
import { Building2, Mail, Phone, MessageSquare, Link2, ChevronDown, ChevronUp } from 'lucide-react';

interface ContactCardProps {
  contact: Contact;
  linkedLeads: { id: string; name: string; stage: string; dealValue: number; source: string; createdAt: string }[];
  onOpenLead?: (leadId: string) => void;
}

export default function ContactCard({ contact, linkedLeads, onOpenLead }: ContactCardProps) {
  const [expanded, setExpanded] = React.useState(false);
  const waUrl = getWhatsAppUrl(contact.phone, `Hi ${contact.name}!`);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs overflow-hidden">
      {/* Main contact info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{contact.name}</h3>
            <div className="mt-1 space-y-1 text-[11px] text-zinc-500 dark:text-zinc-400">
              {contact.company && (
                <div className="flex items-center gap-1.5 truncate">
                  <Building2 className="w-3 h-3 shrink-0" />
                  <span className="truncate">{contact.company}</span>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center gap-1.5 font-mono">
                  <Phone className="w-3 h-3 shrink-0" />
                  <span>{contact.phone}</span>
                </div>
              )}
              {contact.email && (
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3 h-3 shrink-0" />
                  <span className="truncate">{contact.email}</span>
                </div>
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 font-mono">
                {contact.source}
              </span>
              <span className="text-[10px] font-medium text-zinc-400 flex items-center gap-1">
                <Link2 className="w-3 h-3" />
                {linkedLeads.length} linked lead{linkedLeads.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 shrink-0">
            {contact.phone && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat via WhatsApp"
                className="p-1.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </a>
            )}
            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                title="Call Phone"
                className="p-1.5 rounded bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Linked leads (collapsible) */}
      <div className="border-t border-zinc-100 dark:border-zinc-800">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-4 py-2 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
        >
          <span>Linked Leads</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        {expanded && (
          <div className="px-4 pb-3 space-y-1.5">
            {linkedLeads.length > 0 ? (
              linkedLeads.map((lead) => {
                const stageObj = STAGES.find((s) => s.id === lead.stage);
                return (
                  <button
                    key={lead.id}
                    onClick={() => onOpenLead?.(lead.id)}
                    className="w-full flex items-center justify-between gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/60 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">{lead.name}</div>
                      <div className="text-[10px] text-zinc-400 font-mono">{lead.source} · {formatShortDate(lead.createdAt)}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${stageObj?.bgLight} ${stageObj?.borderLight} ${stageObj?.bgDark} ${stageObj?.borderDark}`}>
                        {stageObj?.label || lead.stage}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-zinc-700 dark:text-zinc-300">{formatCurrency(lead.dealValue)}</span>
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="text-[11px] text-zinc-400 py-1">No linked leads.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
