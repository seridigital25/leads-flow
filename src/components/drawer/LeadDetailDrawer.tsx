import React, { useState, useEffect } from 'react';
import { useLeads } from '../../context/LeadContext';
import { STAGES, PRIORITIES, QUICK_TEMPLATES } from '../../data/initialLeads';
import { formatCurrency, formatDate, formatShortDate, getFollowUpStatus, getWhatsAppUrl } from '../../lib/utils';
import { Lead, Quotation, Invoice, ActivityType, PriorityId } from '../../types';
import DocumentPreviewModal from '../modals/DocumentPreviewModal';
import CreateDocumentModal from '../modals/CreateDocumentModal';
import { 
  X, 
  Phone, 
  MessageSquare, 
  Mail, 
  Calendar, 
  Send, 
  Trash2, 
  CheckCircle2, 
  FileText,
  Copy,
  Check,
  Receipt,
  Plus,
  ArrowRight,
  Eye
} from 'lucide-react';

export default function LeadDetailDrawer() {
  const { 
    selectedLead, 
    setSelectedLeadId, 
    updateLead, 
    moveStage, 
    addActivity, 
    toggleBANT,
    deleteLead,
    showToast
  } = useLeads();

  const [activeTab, setActiveTab] = useState<'activity' | 'documents' | 'bant' | 'details'>('activity');
  const [newLogType, setNewLogType] = useState<ActivityType>('whatsapp');
  const [newLogContent, setNewLogContent] = useState<string>('');
  const [showWhatsAppTemplates, setShowWhatsAppTemplates] = useState<boolean>(false);
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);

  // Document modal states
  const [previewDoc, setPreviewDoc] = useState<Quotation | Invoice | null>(null);
  const [previewType, setPreviewType] = useState<'quotation' | 'invoice'>('quotation');
  const [isDocPreviewOpen, setIsDocPreviewOpen] = useState<boolean>(false);
  const [isCreateDocOpen, setIsCreateDocOpen] = useState<boolean>(false);
  const [createDocType, setCreateDocType] = useState<'quotation' | 'invoice'>('quotation');

  // Editable fields local state
  const [name, setName] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [dealValue, setDealValue] = useState<number>(0);
  const [nextFollowUpDate, setNextFollowUpDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (selectedLead) {
      setName(selectedLead.name || '');
      setCompany(selectedLead.company || '');
      setPhone(selectedLead.phone || '');
      setEmail(selectedLead.email || '');
      setDealValue(selectedLead.dealValue || 0);
      setNextFollowUpDate(selectedLead.nextFollowUpDate || '');
      setNotes(selectedLead.notes || '');
    }
  }, [selectedLead]);

  if (!selectedLead) return null;

  const followUpInfo = getFollowUpStatus(nextFollowUpDate);
  const quotations = selectedLead.quotations || [];
  const invoices = selectedLead.invoices || [];

  const handleSaveField = (field: keyof Lead, value: any) => {
    updateLead(selectedLead.id, { [field]: value });
  };

  const handleAddActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogContent.trim()) return;
    addActivity(selectedLead.id, {
      type: newLogType,
      content: newLogContent,
      author: 'You'
    });
    setNewLogContent('');
  };

  const getProcessedTemplate = (templateStr: string, docNumber: string = '') => {
    return templateStr
      .replace(/{{name}}/g, name || 'there')
      .replace(/{{company}}/g, company || 'your business')
      .replace(/{{dealValue}}/g, formatCurrency(dealValue))
      .replace(/{{docNumber}}/g, docNumber || (quotations[0]?.number || invoices[0]?.number || 'QT-2026-0042'))
      .replace(/{{agent}}/g, selectedLead.assignedTo?.split(' ')[0] || 'Aiman');
  };

  const handleSendWhatsApp = (templateText?: string) => {
    const defaultMsg = `Hi ${name}! Thanks for reaching out to us. How can we best assist you with your requirements today?`;
    const text = templateText ? getProcessedTemplate(templateText) : defaultMsg;
    const waUrl = getWhatsAppUrl(phone, text);

    window.open(waUrl, '_blank');
    
    addActivity(selectedLead.id, {
      type: 'whatsapp',
      content: `Sent WhatsApp message: "${text.slice(0, 90)}..."`,
      author: 'You'
    });
    setShowWhatsAppTemplates(false);
  };

  const handleCopyTemplate = (e: React.MouseEvent, templateId: string, templateText: string) => {
    e.stopPropagation();
    const text = getProcessedTemplate(templateText);
    navigator.clipboard.writeText(text);
    setCopiedTemplateId(templateId);
    showToast('WhatsApp template copied to clipboard!');
    setTimeout(() => setCopiedTemplateId(null), 2000);
  };

  const setQuickFollowUp = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const dateStr = d.toISOString().split('T')[0];
    setNextFollowUpDate(dateStr);
    handleSaveField('nextFollowUpDate', dateStr);
    showToast(`Next follow-up scheduled for ${dateStr}`);
  };

  const openPreview = (doc: Quotation | Invoice, type: 'quotation' | 'invoice') => {
    setPreviewDoc(doc);
    setPreviewType(type);
    setIsDocPreviewOpen(true);
  };

  const handleConvertToInvoice = (quote: Quotation) => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const invoiceNum = `INV-2026-${randomCode}`;
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      number: invoiceNum,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'unpaid',
      items: quote.items || [],
      subtotal: quote.subtotal || quote.total,
      tax: 0,
      total: quote.total,
      notes: `Converted from approved Quotation #${quote.number}.`
    };

    const updatedQuotations = quotations.map(q => q.id === quote.id ? { ...q, status: 'approved' as const } : q);

    updateLead(selectedLead.id, {
      quotations: updatedQuotations,
      invoices: [newInvoice, ...invoices],
      stage: 'won'
    });

    addActivity(selectedLead.id, {
      type: 'note',
      content: `Quotation #${quote.number} approved! Issued Tax Invoice #${invoiceNum} (${formatCurrency(quote.total)}). Stage moved to Closed Won.`,
      author: 'You'
    });

    showToast(`Invoice #${invoiceNum} generated from Quotation #${quote.number}!`);
  };

  const handleMarkInvoicePaid = (inv: Invoice) => {
    const updatedInvoices = invoices.map(i => {
      if (i.id === inv.id) {
        return {
          ...i,
          status: 'paid' as const,
          paidAt: new Date().toISOString(),
          paymentMethod: 'Maybank Instant Online Transfer'
        };
      }
      return i;
    });

    updateLead(selectedLead.id, {
      invoices: updatedInvoices,
      stage: 'won'
    });

    addActivity(selectedLead.id, {
      type: 'note',
      content: `Payment received for Invoice #${inv.number} (${formatCurrency(inv.total)}). Official receipt generated.`,
      author: 'You'
    });

    showToast(`Invoice #${inv.number} marked as Paid!`);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Backdrop */}
        <div 
          onClick={() => setSelectedLeadId(null)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
        />

        {/* Slide-over Drawer Panel */}
        <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 shadow-2xl border-l border-zinc-200 dark:border-zinc-800 h-full flex flex-col z-10 animate-slide-left">
          {/* Header */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-50/80 dark:bg-zinc-900">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono">
                {selectedLead.source}
              </span>
              <span className="text-xs text-zinc-400 font-mono">ID: {selectedLead.id}</span>
            </div>

            <button
              onClick={() => setSelectedLeadId(null)}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lead Profile Header */}
          <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 space-y-3 shrink-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => handleSaveField('name', name)}
                  placeholder="Lead Full Name"
                  className="text-lg font-bold text-zinc-900 dark:text-zinc-100 w-full bg-transparent border-b border-transparent hover:border-zinc-300 focus:border-zinc-900 dark:focus:border-zinc-100 focus:outline-hidden py-0.5"
                />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  onBlur={() => handleSaveField('company', company)}
                  placeholder="Company / Organization Name"
                  className="text-xs text-zinc-500 dark:text-zinc-400 w-full bg-transparent border-b border-transparent hover:border-zinc-300 focus:border-zinc-900 dark:focus:border-zinc-100 focus:outline-hidden py-0.5 mt-0.5"
                />
              </div>

              {/* Deal Value Input in RM */}
              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase font-semibold text-zinc-400">Deal Value (RM)</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <input
                    type="number"
                    value={dealValue}
                    onChange={(e) => setDealValue(Number(e.target.value))}
                    onBlur={() => handleSaveField('dealValue', Number(dealValue))}
                    className="w-28 text-right text-base font-bold font-mono text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-800 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>
            </div>

            {/* Quick Action Bar (WhatsApp Direct, Call, Mail) */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setShowWhatsAppTemplates(!showWhatsAppTemplates)}
                className="flex-1 py-1.5 px-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Direct (wa.me)</span>
              </button>
              <a
                href={`tel:${phone}`}
                className="py-1.5 px-3 rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium text-xs flex items-center gap-1.5 border border-zinc-200 dark:border-zinc-700 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-zinc-500" />
                <span>Call</span>
              </a>
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="py-1.5 px-3 rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium text-xs flex items-center gap-1.5 border border-zinc-200 dark:border-zinc-700 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Email</span>
                </a>
              )}
            </div>

            {/* WhatsApp Template Selector Accordion */}
            {showWhatsAppTemplates && (
              <div className="p-3 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2 animate-fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  <span>Select WhatsApp Message Template:</span>
                  <button 
                    onClick={() => setShowWhatsAppTemplates(false)}
                    className="text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 text-xs cursor-pointer font-medium"
                  >
                    Close
                  </button>
                </div>
                <div className="space-y-2">
                  {QUICK_TEMPLATES.map(tmpl => {
                    const processed = getProcessedTemplate(tmpl.template);
                    const isCopied = copiedTemplateId === tmpl.id;

                    return (
                      <div
                        key={tmpl.id}
                        className="w-full text-left p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-emerald-200/80 dark:border-emerald-800/80 hover:border-emerald-500 text-xs transition-colors flex items-start justify-between gap-2"
                      >
                        <div className="flex-1 cursor-pointer" onClick={() => handleSendWhatsApp(tmpl.template)}>
                          <strong className="text-zinc-900 dark:text-zinc-100 block">{tmpl.title}</strong>
                          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2 italic leading-relaxed">
                            "{processed}"
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1 shrink-0 pt-0.5">
                          <button
                            onClick={(e) => handleCopyTemplate(e, tmpl.id, tmpl.template)}
                            title="Copy Message Text"
                            className="p-1.5 rounded text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleSendWhatsApp(tmpl.template)}
                            title="Send WhatsApp Now"
                            className="p-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stage & Priority Selector Bar */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Pipeline Stage
                </label>
                <select
                  value={selectedLead.stage}
                  onChange={(e) => moveStage(selectedLead.id, e.target.value)}
                  className="w-full text-xs font-semibold py-1.5 px-2 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 focus:ring-1 focus:ring-zinc-900 cursor-pointer"
                >
                  {STAGES.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Priority
                </label>
                <select
                  value={selectedLead.priority}
                  onChange={(e) => handleSaveField('priority', e.target.value as PriorityId)}
                  className="w-full text-xs font-semibold py-1.5 px-2 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 focus:ring-1 focus:ring-zinc-900 cursor-pointer"
                >
                  {PRIORITIES.map(p => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-zinc-200 dark:border-zinc-800 px-5 flex items-center gap-4 text-xs font-semibold shrink-0">
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'activity'
                  ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100'
                  : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
              }`}
            >
              Activity ({selectedLead.activities?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'documents'
                  ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100'
                  : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
              }`}
            >
              <span>Docs ({quotations.length + invoices.length})</span>
              {(quotations.length > 0 || invoices.length > 0) && (
                <span className="w-2 h-2 rounded-full bg-blue-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('bant')}
              className={`py-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'bant'
                  ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100'
                  : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
              }`}
            >
              BANT Qual
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`py-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'details'
                  ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100'
                  : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
              }`}
            >
              Contact
            </button>
          </div>

          {/* Tab Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* TAB 1: ACTIVITY & TIMELINE */}
            {activeTab === 'activity' && (
              <div className="space-y-4">
                <form onSubmit={handleAddActivitySubmit} className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center gap-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setNewLogType('whatsapp')}
                      className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                        newLogType === 'whatsapp'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                      }`}
                    >
                      💬 WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewLogType('call')}
                      className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                        newLogType === 'call'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                      }`}
                    >
                      📞 Phone Call
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewLogType('meeting')}
                      className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                        newLogType === 'meeting'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          : 'text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                      }`}
                    >
                      🤝 Meeting
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewLogType('note')}
                      className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                        newLogType === 'note'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                      }`}
                    >
                      📝 Sales Note
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    value={newLogContent}
                    onChange={(e) => setNewLogContent(e.target.value)}
                    placeholder="Log call summary, client feedback, or next action items..."
                    className="w-full text-xs p-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newLogContent.trim()}
                      className="px-3 py-1.5 text-xs font-semibold rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-40 transition-opacity cursor-pointer"
                    >
                      Log Activity
                    </button>
                  </div>
                </form>

                {/* Timeline Feed */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    Activity Timeline
                  </h4>

                  <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-zinc-200 dark:before:bg-zinc-800">
                    {selectedLead.activities && selectedLead.activities.length > 0 ? (
                      selectedLead.activities.map((act) => (
                        <div key={act.id} className="relative pl-7 text-xs">
                          <div className="absolute left-1.5 top-0.5 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white dark:bg-zinc-900 border-2 border-zinc-400 dark:border-zinc-600 flex items-center justify-center" />

                          <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800">
                            <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                                {act.author || 'User'} • {act.type?.toUpperCase()}
                              </span>
                              <span>{formatDate(act.timestamp)}</span>
                            </div>
                            <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed">
                              {act.content}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-zinc-400 italic pl-7">No activity recorded yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DOCUMENTS (QUOTATIONS & INVOICES) */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                {/* Quotations Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                        Quotations & Proposals ({quotations.length})
                      </h4>
                    </div>

                    <button
                      onClick={() => {
                        setCreateDocType('quotation');
                        setIsCreateDocOpen(true);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ New Quotation</span>
                    </button>
                  </div>

                  {quotations.length > 0 ? (
                    <div className="space-y-2.5">
                      {quotations.map((quote) => (
                        <div
                          key={quote.id}
                          className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100">
                                #{quote.number}
                              </span>
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                                quote.status === 'approved'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                                  : quote.status === 'declined'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
                                  : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
                              }`}>
                                {quote.status}
                              </span>
                            </div>

                            <span className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-100">
                              {formatCurrency(quote.total)}
                            </span>
                          </div>

                          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1">
                            <div>Date: {formatShortDate(quote.date)} {quote.validUntil && `• Valid until ${formatShortDate(quote.validUntil)}`}</div>
                            <div className="text-zinc-600 dark:text-zinc-300 font-medium">
                              {quote.items?.length || 0} Scope Item(s): {quote.items?.[0]?.description || 'Custom package'}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-between gap-2">
                            <button
                              onClick={() => openPreview(quote, 'quotation')}
                              className="px-2.5 py-1 text-xs font-semibold rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1.5 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View & Print</span>
                            </button>

                            {quote.status !== 'approved' && quote.status !== 'declined' && (
                              <button
                                onClick={() => handleConvertToInvoice(quote)}
                                className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <span>Approve & Convert to Invoice</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg text-center text-zinc-400 text-xs">
                      No quotation created for this lead yet.
                    </div>
                  )}
                </div>

                {/* Invoices & Receipts Section */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Receipt className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                        Tax Invoices & Receipts ({invoices.length})
                      </h4>
                    </div>

                    <button
                      onClick={() => {
                        setCreateDocType('invoice');
                        setIsCreateDocOpen(true);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold rounded bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Issue Invoice</span>
                    </button>
                  </div>

                  {invoices.length > 0 ? (
                    <div className="space-y-2.5">
                      {invoices.map((inv) => (
                        <div
                          key={inv.id}
                          className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100">
                                #{inv.number}
                              </span>
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                                inv.status === 'paid'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                                  : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
                              }`}>
                                {inv.status === 'paid' ? 'PAID ✓' : 'UNPAID'}
                              </span>
                            </div>

                            <span className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-100">
                              {formatCurrency(inv.total)}
                            </span>
                          </div>

                          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1">
                            <div>Issued: {formatShortDate(inv.date)} • Due: {formatShortDate(inv.dueDate)}</div>
                            {inv.paidAt && (
                              <div className="text-emerald-600 dark:text-emerald-400 font-medium">
                                Paid on {formatDate(inv.paidAt)} via {inv.paymentMethod}
                              </div>
                            )}
                          </div>

                          <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-between gap-2">
                            <button
                              onClick={() => openPreview(inv, 'invoice')}
                              className="px-2.5 py-1 text-xs font-semibold rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1.5 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Receipt / PDF</span>
                            </button>

                            {inv.status !== 'paid' && (
                              <button
                                onClick={() => handleMarkInvoicePaid(inv)}
                                className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Mark Paid & Settle</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg text-center text-zinc-400 text-xs">
                      No tax invoice issued yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: BANT QUALIFICATION */}
            {activeTab === 'bant' && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                    BANT Qualification Checklist
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-3">
                    Ensure the lead satisfies qualification criteria before preparing formal quotations or proposals.
                  </p>

                  <div className="space-y-2.5">
                    <label className="flex items-center gap-2.5 text-xs text-zinc-800 dark:text-zinc-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedLead.bant?.budget || false}
                        onChange={() => toggleBANT(selectedLead.id, 'budget')}
                        className="rounded border-zinc-300 text-zinc-900 focus:ring-0 w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <strong>Budget:</strong> Lead has confirmed sufficient budget allocation for this solution.
                      </div>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs text-zinc-800 dark:text-zinc-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedLead.bant?.authority || false}
                        onChange={() => toggleBANT(selectedLead.id, 'authority')}
                        className="rounded border-zinc-300 text-zinc-900 focus:ring-0 w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <strong>Authority:</strong> Speaking directly with the key decision maker (Owner / Director / Manager).
                      </div>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs text-zinc-800 dark:text-zinc-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedLead.bant?.need || false}
                        onChange={() => toggleBANT(selectedLead.id, 'need')}
                        className="rounded border-zinc-300 text-zinc-900 focus:ring-0 w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <strong>Need:</strong> Has a specific operational pain point our solution solves.
                      </div>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs text-zinc-800 dark:text-zinc-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedLead.bant?.timeline || false}
                        onChange={() => toggleBANT(selectedLead.id, 'timeline')}
                        className="rounded border-zinc-300 text-zinc-900 focus:ring-0 w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <strong>Timeline:</strong> Ready to kick off implementation in the near term (&lt; 30 days).
                      </div>
                    </label>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                    Original Inquiry / Context
                  </h4>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    onBlur={() => handleSaveField('notes', notes)}
                    placeholder="Add background context or client pain points..."
                    className="w-full text-xs p-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: CONTACT & FOLLOW-UP */}
            {activeTab === 'details' && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-zinc-500" />
                      <span>Next Follow-Up Schedule</span>
                    </h4>
                    {nextFollowUpDate && (
                      <span className={`text-[11px] font-bold ${
                        followUpInfo.status === 'overdue' ? 'text-rose-600' :
                        followUpInfo.status === 'today' ? 'text-amber-600' : 'text-zinc-500'
                      }`}>
                        {followUpInfo.label}
                      </span>
                    )}
                  </div>

                  <input
                    type="date"
                    value={nextFollowUpDate}
                    onChange={(e) => {
                      setNextFollowUpDate(e.target.value);
                      handleSaveField('nextFollowUpDate', e.target.value);
                    }}
                    className="w-full text-xs p-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                  />

                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setQuickFollowUp(0)}
                      className="flex-1 py-1 px-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[11px] cursor-pointer"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickFollowUp(1)}
                      className="flex-1 py-1 px-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[11px] cursor-pointer"
                    >
                      Tomorrow
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickFollowUp(3)}
                      className="flex-1 py-1 px-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[11px] cursor-pointer"
                    >
                      +3 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickFollowUp(7)}
                      className="flex-1 py-1 px-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[11px] cursor-pointer"
                    >
                      +1 Week
                    </button>
                  </div>
                </div>

                <div className="space-y-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    Contact Information
                  </h4>

                  <div>
                    <label className="text-[10px] font-semibold text-zinc-400 uppercase">Phone / WhatsApp Number (Malaysia)</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onBlur={() => handleSaveField('phone', phone)}
                      placeholder="012-345 6789"
                      className="w-full text-xs p-2 mt-0.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-zinc-400 uppercase">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => handleSaveField('email', email)}
                      placeholder="prospect@company.my"
                      className="w-full text-xs p-2 mt-0.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-zinc-400 uppercase">Assigned Sales Rep</label>
                    <input
                      type="text"
                      value={selectedLead.assignedTo || ''}
                      onChange={(e) => handleSaveField('assignedTo', e.target.value)}
                      placeholder="Aiman (Sales Lead)"
                      className="w-full text-xs p-2 mt-0.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900 flex items-center justify-between shrink-0">
            <button
              onClick={() => {
                if (window.confirm(`Delete lead record "${selectedLead.name}"?`)) {
                  deleteLead(selectedLead.id);
                }
              }}
              className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Lead</span>
            </button>

            <button
              onClick={() => setSelectedLeadId(null)}
              className="px-4 py-1.5 text-xs font-semibold rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Document View & Print Modal */}
      <DocumentPreviewModal
        isOpen={isDocPreviewOpen}
        onClose={() => setIsDocPreviewOpen(false)}
        doc={previewDoc}
        lead={selectedLead}
        type={previewType}
      />

      {/* Create New Quotation / Invoice Modal */}
      <CreateDocumentModal
        isOpen={isCreateDocOpen}
        onClose={() => setIsCreateDocOpen(false)}
        lead={selectedLead}
        docType={createDocType}
      />
    </>
  );
}
