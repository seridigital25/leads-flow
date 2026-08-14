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
    window.print();
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
          className="flex-1 overflow-y-auto p-6 sm:p-10 bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 space-y-6 select-text"
        >
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-zinc-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  LF
                </div>
                <div>
                  <span className="text-base font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 block">
                    LeadFlow Solutions
                  </span>
                  <span className="text-[11px] text-zinc-500 font-semibold tracking-wide">
                    Enterprise Cloud & CRM Systems
                  </span>
                </div>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2.5 leading-relaxed">
                LeadFlow Enterprise Solutions Sdn. Bhd. (202401089211 / 1582910-X)<br />
                Level 28, Menara Horizon, KL Sentral, 50470 Kuala Lumpur, Malaysia<br />
                Billing Support: <strong>finance@leadflow.my</strong> • Tel: <strong>+603-2788 9000</strong>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                {isInvoice ? 'TAX INVOICE' : 'OFFICIAL QUOTATION'}
              </h1>
              <div className="mt-2 space-y-0.5 text-xs font-mono">
                <div><span className="text-zinc-400 font-sans">Doc Number:</span> <strong>{doc.number}</strong></div>
                <div><span className="text-zinc-400 font-sans">Issue Date:</span> {formatShortDate(doc.date)}</div>
                {'validUntil' in doc && doc.validUntil && <div><span className="text-zinc-400 font-sans">Valid Until:</span> {formatShortDate(doc.validUntil)}</div>}
                {'dueDate' in doc && doc.dueDate && <div><span className="text-zinc-400 font-sans">Due Date:</span> {formatShortDate(doc.dueDate)}</div>}
              </div>

              {/* Status Stamp Badge */}
              <div className="mt-3 inline-block">
                {isPaid && (
                  <span className="px-3.5 py-1 text-xs font-black uppercase tracking-widest rounded border-2 border-emerald-600 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 inline-flex items-center gap-1.5 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> PAID IN FULL
                  </span>
                )}
                {!isPaid && isInvoice && (
                  <span className="px-3 py-1 text-xs font-bold uppercase rounded border-2 border-amber-400 text-amber-800 bg-amber-50 dark:bg-amber-950/40 inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" /> PENDING PAYMENT
                  </span>
                )}
                {!isInvoice && (
                  <span className={`px-3 py-1 text-xs font-bold uppercase rounded border-2 ${
                    isApproved
                      ? 'border-emerald-500 text-emerald-800 bg-emerald-50'
                      : doc.status === 'declined'
                      ? 'border-rose-500 text-rose-800 bg-rose-50'
                      : 'border-blue-400 text-blue-800 bg-blue-50'
                  }`}>
                    {doc.status === 'approved' ? '✓ APPROVED & SIGNED' : doc.status.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Billed To / Client Info Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-1">
                BIL KEPADA / BILL TO:
              </span>
              <strong className="text-sm font-bold block text-zinc-900 dark:text-zinc-100">{lead.name}</strong>
              <div className="text-zinc-700 dark:text-zinc-300 font-medium mt-0.5">{lead.company}</div>
              <div className="text-zinc-500 font-mono mt-1">
                Phone: {lead.phone} {lead.email && `• Email: ${lead.email}`}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-1">
                PREPARED BY / SALES REP:
              </span>
              <strong className="text-sm font-bold block text-zinc-900 dark:text-zinc-100">{lead.assignedTo || 'Aiman (Sales Lead)'}</strong>
              <div className="text-zinc-700 dark:text-zinc-300 mt-0.5">Enterprise Cloud Solutions Division</div>
              <div className="text-zinc-500 font-mono mt-1">Ref Campaign: {lead.source}</div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left doc-table">
              <thead>
                <tr className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-bold border-b border-zinc-200 dark:border-zinc-800">
                  <th className="py-2.5 px-3 w-10 text-center">#</th>
                  <th className="py-2.5 px-4">Item & Scope Description</th>
                  <th className="py-2.5 px-3 text-center w-16">Qty</th>
                  <th className="py-2.5 px-4 text-right w-28">Unit Price</th>
                  <th className="py-2.5 px-4 text-right w-28">Amount (RM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-mono">
                {doc.items && doc.items.length > 0 ? (
                  doc.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                      <td className="py-3 px-3 text-zinc-400 text-center font-sans">{idx + 1}</td>
                      <td className="py-3 px-4 font-sans font-semibold text-zinc-900 dark:text-zinc-100">
                        {item.description}
                      </td>
                      <td className="py-3 px-3 text-center text-zinc-700 dark:text-zinc-300 font-sans">{item.qty}</td>
                      <td className="py-3 px-4 text-right text-zinc-700 dark:text-zinc-300">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-zinc-900 dark:text-zinc-100">
                        {formatCurrency(item.total || item.qty * item.unitPrice)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-zinc-400 font-sans">
                      Tiada item direkodkan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals Calculation */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
            <div className="text-xs text-zinc-500 max-w-sm">
              <span className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Notes & Terms of Service:</span>
              <p className="italic leading-relaxed">{doc.notes || 'Payment terms: 14 days from date of document. Price is inclusive of standard support and 12-month cloud server SLA.'}</p>
            </div>

            <div className="w-full sm:w-64 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-zinc-500">
                <span className="font-sans">Subtotal:</span>
                <span>{formatCurrency(doc.subtotal || doc.total)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span className="font-sans">Service Tax / SST (0%):</span>
                <span>RM 0</span>
              </div>
              <div className="border-t-2 border-zinc-900 dark:border-zinc-100 pt-2 flex justify-between text-sm font-bold text-zinc-900 dark:text-zinc-100">
                <span className="font-sans">Grand Total:</span>
                <span className="text-base font-extrabold">{formatCurrency(doc.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Details & Signature Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
            <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-xs">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                Official Banking Details (Maybank)
              </span>
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                Maybank Berhad • Acc: <span className="font-mono font-bold">5142 8891 0023</span>
              </div>
              <div className="text-zinc-600 dark:text-zinc-400 text-[11px] mt-0.5">
                Beneficiary: <strong>LeadFlow Enterprise Solutions Sdn Bhd</strong>
              </div>
              {isPaid && invoiceDoc.paymentMethod && (
                <div className="mt-2 p-1.5 rounded bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono">
                  Verified: {invoiceDoc.paymentMethod}
                </div>
              )}
            </div>

            <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-xs flex flex-col justify-between">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Authorized Signatory / Digital Signature
              </span>
              <div className="pt-4 border-b border-zinc-300 dark:border-zinc-700 pb-1 flex justify-between items-end">
                <span className="font-serif italic font-bold text-sm text-zinc-700 dark:text-zinc-300">Aiman Ridzuan</span>
                <span className="text-[10px] text-zinc-400 font-mono">{formatShortDate(doc.date)}</span>
              </div>
              <div className="text-[10px] text-zinc-500 mt-1">
                Authorized Officer • LeadFlow Solutions
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
