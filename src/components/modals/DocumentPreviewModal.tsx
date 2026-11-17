import React from 'react';
import { formatCurrency, formatShortDate } from '../../lib/utils';
import { Lead, Quotation, Invoice } from '../../types';
import { 
  X, 
  Printer, 
  MessageSquare, 
  CheckCircle2, 
  Clock
} from 'lucide-react';

interface DocumentPreviewModalProps {
  doc: Quotation | Invoice | null;
  lead: Lead | null;
  type: 'quotation' | 'invoice';
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentPreviewModal({ doc, lead, type, isOpen, onClose }: DocumentPreviewModalProps) {
  if (!isOpen || !doc || !lead) return null;

  const isInvoice = type === 'invoice';
  const invoiceDoc = doc as Invoice;
  const isPaid = isInvoice && invoiceDoc.status === 'paid';
  const isApproved = !isInvoice && (doc as Quotation).status === 'approved';

  const handlePrint = () => {
    // Open standalone print page instead of printing modal
    const printUrl = `${window.location.origin}/print/${type}/${doc.id}`;
    window.open(printUrl, '_blank');
  };

  const handleShareWhatsApp = () => {
    const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
    let msg = '';
    if (isInvoice) {
      msg = `Salam ${lead.name}, dilampirkan Invois Rasmi #${doc.number} berjumlah ${formatCurrency(doc.total)} untuk perhatian ${lead.company}. Status: ${doc.status.toUpperCase()}.`;
    } else {
      msg = `Salam ${lead.name}, dilampirkan Sebut Harga Rasmi #${doc.number} bernilai ${formatCurrency(doc.total)} daripada LeadFlow Solutions. Sila maklumkan jika perlukan sebarang penyesuaian.`;
    }
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 no-print-backdrop">
      {/* Backdrop (Hidden during print) */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-fade-in no-print"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden z-10 animate-fade-in flex flex-col max-h-[92vh]">
        
        {/* Top Control Bar (Hidden during Print) */}
        <div className="p-3.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900 shrink-0 no-print">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded border ${
              isInvoice
                ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800'
                : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
            }`}>
              {isInvoice ? 'Tax Invoice' : 'Official Quotation'}
            </span>
            <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">
              #{doc.number}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send via WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-bold rounded bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 text-white dark:text-zinc-900 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            ISOLATED PRINTABLE DOCUMENT SHEET (A4 Canvas)
            ========================================================================= */}
        <div
          id="printable-document"
          className="flex-1 overflow-y-auto p-0 bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 select-text"
        >
          {/* Document Header with Accent Bar */}
          <div className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold flex items-center justify-center text-lg shadow-md">
                  LF
                </div>
                <div>
                  <span className="text-lg font-bold tracking-tight block">
                    LeadFlow Solutions
                  </span>
                  <span className="text-xs opacity-80 font-medium tracking-wide">
                    Enterprise Cloud & CRM Systems
                  </span>
                </div>
              </div>
              <div className="text-right">
                <h1 className="text-2xl font-black uppercase tracking-wider">
                  {isInvoice ? 'TAX INVOICE' : 'OFFICIAL QUOTATION'}
                </h1>
              </div>
            </div>
          </div>

          {/* Document Meta Bar */}
          <div className="bg-zinc-50 dark:bg-zinc-800/50 px-8 py-3 border-b border-zinc-200 dark:border-zinc-700">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-4">
                <div><span className="text-zinc-500 font-medium">Doc Number:</span> <strong className="font-mono">{doc.number}</strong></div>
                <div><span className="text-zinc-500 font-medium">Issue Date:</span> <strong>{formatShortDate(doc.date)}</strong></div>
                {'validUntil' in doc && doc.validUntil && <div><span className="text-zinc-500 font-medium">Valid Until:</span> <strong>{formatShortDate(doc.validUntil)}</strong></div>}
                {'dueDate' in doc && doc.dueDate && <div><span className="text-zinc-500 font-medium">Due Date:</span> <strong>{formatShortDate(doc.dueDate)}</strong></div>}
              </div>
              <div>
                {isPaid && (
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded bg-emerald-600 text-white inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> PAID IN FULL
                  </span>
                )}
                {!isPaid && isInvoice && (
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded bg-amber-500 text-white inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> PENDING PAYMENT
                  </span>
                )}
                {!isInvoice && (
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded ${
                    isApproved
                      ? 'bg-emerald-600 text-white'
                      : doc.status === 'declined'
                      ? 'bg-rose-600 text-white'
                      : 'bg-blue-600 text-white'
                  }`}>
                    {doc.status === 'approved' ? '✓ APPROVED & SIGNED' : doc.status.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="px-8 py-4 border-b border-zinc-100 dark:border-zinc-800">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              LeadFlow Enterprise Solutions Sdn. Bhd. (202401089211 / 1582910-X)<br />
              Level 28, Menara Horizon, KL Sentral, 50470 Kuala Lumpur, Malaysia<br />
              Billing Support: <strong>finance@leadflow.my</strong> • Tel: <strong>+603-2788 9000</strong>
            </p>
          </div>

          {/* Billed To / Client Info Box */}
          <div className="px-8 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border-l-4 border-zinc-900 dark:border-zinc-100">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-2">
                  BIL KEPADA / BILL TO:
                </span>
                <strong className="text-base font-bold block text-zinc-900 dark:text-zinc-100">{lead.name}</strong>
                <div className="text-zinc-700 dark:text-zinc-300 font-medium mt-1">{lead.company}</div>
                <div className="text-zinc-500 text-sm mt-2">
                  <div>Phone: {lead.phone}</div>
                  {lead.email && <div>Email: {lead.email}</div>}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border-l-4 border-zinc-900 dark:border-zinc-100">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-2">
                  PREPARED BY / SALES REP:
                </span>
                <strong className="text-base font-bold block text-zinc-900 dark:text-zinc-100">{lead.assignedTo || 'Aiman (Sales Lead)'}</strong>
                <div className="text-zinc-700 dark:text-zinc-300 mt-1">Enterprise Cloud Solutions Division</div>
                <div className="text-zinc-500 text-sm mt-2">Ref Campaign: {lead.source}</div>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="px-8 pb-6">
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left doc-table">
                <thead>
                  <tr className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold">
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">Item & Scope Description</th>
                    <th className="py-3 px-4 text-center w-20">Qty</th>
                    <th className="py-3 px-4 text-right w-32">Unit Price</th>
                    <th className="py-3 px-4 text-right w-32">Amount (RM)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {doc.items && doc.items.length > 0 ? (
                    doc.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                        <td className="py-4 px-4 text-zinc-400 text-center font-medium">{idx + 1}</td>
                        <td className="py-4 px-4 font-medium text-zinc-900 dark:text-zinc-100">
                          {item.description}
                        </td>
                        <td className="py-4 px-4 text-center text-zinc-700 dark:text-zinc-300 font-medium">{item.qty}</td>
                        <td className="py-4 px-4 text-right text-zinc-700 dark:text-zinc-300">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="py-4 px-4 text-right font-bold text-zinc-900 dark:text-zinc-100">
                          {formatCurrency(item.total || item.qty * item.unitPrice)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-zinc-400 font-medium">
                        Tiada item direkodkan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Calculation */}
          <div className="px-8 pb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
              <div className="text-sm text-zinc-500 max-w-md">
                <span className="font-bold text-zinc-700 dark:text-zinc-300 block mb-2">Notes & Terms of Service:</span>
                <p className="italic leading-relaxed">{doc.notes || 'Payment terms: 14 days from date of document. Price is inclusive of standard support and 12-month cloud server SLA.'}</p>
              </div>

              <div className="w-full sm:w-72 space-y-3">
                <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
                  <span>Subtotal:</span>
                  <span className="font-medium">{formatCurrency(doc.subtotal || doc.total)}</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
                  <span>Service Tax / SST (0%):</span>
                  <span className="font-medium">RM 0</span>
                </div>
                <div className="border-t-2 border-zinc-900 dark:border-zinc-100 pt-3 flex justify-between text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  <span>Grand Total:</span>
                  <span className="text-xl font-extrabold">{formatCurrency(doc.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details & Signature Block */}
          <div className="px-8 pb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-3">
                  Official Banking Details (Maybank)
                </span>
                <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                  Maybank Berhad • Acc: <span className="font-mono font-bold">5142 8891 0023</span>
                </div>
                <div className="text-zinc-600 dark:text-zinc-400 text-xs mt-1">
                  Beneficiary: <strong>LeadFlow Enterprise Solutions Sdn Bhd</strong>
                </div>
                {isPaid && invoiceDoc.paymentMethod && (
                  <div className="mt-3 p-2 rounded bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-mono">
                    Verified: {invoiceDoc.paymentMethod}
                  </div>
                )}
              </div>

              <div className="p-5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-3">
                  Authorized Signatory / Digital Signature
                </span>
                <div className="pt-6 border-b-2 border-zinc-300 dark:border-zinc-600 pb-2 flex justify-between items-end">
                  <span className="font-serif italic font-bold text-lg text-zinc-700 dark:text-zinc-300">Aiman Ridzuan</span>
                  <span className="text-xs text-zinc-400 font-mono">{formatShortDate(doc.date)}</span>
                </div>
                <div className="text-xs text-zinc-500 mt-2">
                  Authorized Officer • LeadFlow Solutions
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
