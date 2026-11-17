import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatCurrency, formatShortDate } from '../../lib/utils';
import { Lead, Quotation, Invoice } from '../../types';

/**
 * Standalone print page for quotations and invoices.
 * Professional business document layout — no web UI elements.
 */
export default function QuotationPrintPage() {
  const { id } = useParams<{ id: string }>();
  const [doc, setDoc] = useState<Quotation | Invoice | null>(null);
  const [lead, setLead] = useState<Lead | null>(null);
  const [type, setType] = useState<'quotation' | 'invoice'>('quotation');

  useEffect(() => {
    const stored = localStorage.getItem('leadflow_crm_leads_en_my_v3_15');
    if (stored) {
      const leads = JSON.parse(stored);
      const foundLead = leads.find((l: Lead) =>
        l.quotations?.some((q: Quotation) => q.id === id) ||
        l.invoices?.some((i: Invoice) => i.id === id)
      );
      if (foundLead) {
        setLead(foundLead);
        const quotation = foundLead.quotations?.find((q: Quotation) => q.id === id);
        const invoice = foundLead.invoices?.find((i: Invoice) => i.id === id);
        if (quotation) {
          setDoc(quotation);
          setType('quotation');
        } else if (invoice) {
          setDoc(invoice);
          setType('invoice');
        }
      }
    }
  }, [id]);

  if (!doc || !lead) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 mb-4">Document Not Found</h1>
          <p className="text-zinc-600">The requested document could not be loaded.</p>
        </div>
      </div>
    );
  }

  const isInvoice = type === 'invoice';
  const invoiceDoc = doc as Invoice;
  const isPaid = isInvoice && invoiceDoc.status === 'paid';
  const isApproved = !isInvoice && (doc as Quotation).status === 'approved';

  return (
    <div className="min-h-screen bg-white print:bg-white">
      {/* Print controls — hidden when printing */}
      <div className="print:hidden p-4 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between no-print">
        <a href="/demo" className="text-sm text-emerald-700 hover:underline">
          ← Back to CRM
        </a>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-zinc-900 text-white text-sm font-bold rounded hover:bg-zinc-800"
        >
          Print / Save as PDF
        </button>
      </div>

      {/* A4 Document — Professional Business Layout */}
      <div className="quotation-sheet mx-auto bg-white print:bg-white text-zinc-900" style={{ maxWidth: '210mm', padding: '20mm' }}>
        
        {/* Header — Clean Business Layout */}
        <header className="border-b-2 border-zinc-900 pb-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 border-2 border-zinc-900 flex items-center justify-center font-bold text-lg">
                  LF
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">LeadFlow Solutions</h1>
                  <p className="text-sm text-zinc-600">Enterprise Cloud & CRM Systems</p>
                </div>
              </div>
              <div className="text-sm text-zinc-700 leading-relaxed">
                <p><strong>LeadFlow Enterprise Solutions Sdn. Bhd.</strong></p>
                <p>Reg. No: 202401089211 (1582910-X)</p>
                <p>Level 28, Menara Horizon, KL Sentral</p>
                <p>50470 Kuala Lumpur, Malaysia</p>
                <p className="mt-2">
                  <strong>Billing:</strong> finance@leadflow.my • +603-2788 9000
                </p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold uppercase tracking-wider text-zinc-900">
                {isInvoice ? 'TAX INVOICE' : 'QUOTATION'}
              </h2>
              <div className="mt-4 text-sm">
                <p><strong>Document No:</strong> {doc.number}</p>
                <p><strong>Date:</strong> {formatShortDate(doc.date)}</p>
                {'validUntil' in doc && doc.validUntil && (
                  <p><strong>Valid Until:</strong> {formatShortDate(doc.validUntil)}</p>
                )}
                {'dueDate' in doc && doc.dueDate && (
                  <p><strong>Due Date:</strong> {formatShortDate(doc.dueDate)}</p>
                )}
              </div>
              {isPaid && (
                <p className="mt-3 text-sm font-bold text-emerald-700 uppercase">PAID IN FULL</p>
              )}
              {!isPaid && isInvoice && (
                <p className="mt-3 text-sm font-bold text-amber-700 uppercase">PENDING PAYMENT</p>
              )}
              {!isInvoice && (
                <p className={`mt-3 text-sm font-bold uppercase ${
                  isApproved ? 'text-emerald-700' :
                  doc.status === 'declined' ? 'text-rose-700' : 'text-zinc-700'
                }`}>
                  {doc.status === 'approved' ? 'APPROVED & SIGNED' : doc.status.toUpperCase()}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Bill To / Prepared By — Clean Borders */}
        <section className="grid grid-cols-2 gap-8 mb-8">
          <div className="border border-zinc-300 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3 border-b border-zinc-200 pb-2">
              BILL TO
            </h3>
            <p className="font-bold text-base">{lead.name}</p>
            <p className="text-sm">{lead.company}</p>
            <div className="text-sm text-zinc-700 mt-3">
              <p>Phone: {lead.phone}</p>
              {lead.email && <p>Email: {lead.email}</p>}
            </div>
          </div>
          <div className="border border-zinc-300 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3 border-b border-zinc-200 pb-2">
              PREPARED BY
            </h3>
            <p className="font-bold text-base">{lead.assignedTo || 'Aiman (Sales Lead)'}</p>
            <p className="text-sm">Enterprise Cloud Solutions Division</p>
            <p className="text-sm text-zinc-700 mt-3">LeadFlow Enterprise Solutions</p>
          </div>
        </section>

        {/* Itemized Table — High Contrast */}
        <section className="mb-8">
          <table className="w-full text-sm border-collapse border border-zinc-300">
            <thead>
              <tr className="bg-zinc-100 border-b-2 border-zinc-900">
                <th className="py-3 px-4 text-left font-bold border-r border-zinc-300 w-12">#</th>
                <th className="py-3 px-4 text-left font-bold border-r border-zinc-300">Item & Scope Description</th>
                <th className="py-3 px-4 text-center font-bold border-r border-zinc-300 w-20">Qty</th>
                <th className="py-3 px-4 text-right font-bold border-r border-zinc-300 w-32">Unit Price (RM)</th>
                <th className="py-3 px-4 text-right font-bold w-32">Amount (RM)</th>
              </tr>
            </thead>
            <tbody>
              {doc.items && doc.items.length > 0 ? (
                doc.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-zinc-300">
                    <td className="py-3 px-4 text-center border-r border-zinc-300 font-medium">{idx + 1}</td>
                    <td className="py-3 px-4 border-r border-zinc-300 font-medium text-zinc-900">{item.description}</td>
                    <td className="py-3 px-4 text-center border-r border-zinc-300 font-medium">{item.qty}</td>
                    <td className="py-3 px-4 text-right border-r border-zinc-300">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-3 px-4 text-right font-bold">{formatCurrency(item.total || item.qty * item.unitPrice)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500">No items recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Totals — Right Aligned */}
        <section className="flex justify-end mb-8">
          <div className="w-80">
            <div className="flex justify-between py-2 border-b border-zinc-200">
              <span className="text-sm">Subtotal:</span>
              <span className="text-sm font-medium">{formatCurrency(doc.subtotal || doc.total)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-zinc-200">
              <span className="text-sm">Service Tax / SST (0%):</span>
              <span className="text-sm font-medium">RM 0.00</span>
            </div>
            <div className="flex justify-between py-3 border-t-2 border-zinc-900 mt-2">
              <span className="text-lg font-bold">GRAND TOTAL:</span>
              <span className="text-lg font-bold">{formatCurrency(doc.total)}</span>
            </div>
          </div>
        </section>

        {/* Notes & Terms */}
        <section className="mb-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">Notes & Terms of Service</h3>
          <div className="text-sm text-zinc-700 border border-zinc-200 p-4 bg-zinc-50">
            <p className="mb-2"><strong>Payment Terms:</strong> 14 days from date of document</p>
            <p className="mb-2"><strong>Delivery:</strong> As per agreed timeline</p>
            <p className="mb-2"><strong>Warranty:</strong> 12-month SLA warranty included</p>
            <p><strong>Support:</strong> Standard support and cloud server maintenance included</p>
            {doc.notes && <p className="mt-3 italic">{doc.notes}</p>}
          </div>
        </section>

        {/* Payment & Signature — Professional Layout */}
        <section className="grid grid-cols-2 gap-8">
          <div className="border border-zinc-300 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3 border-b border-zinc-200 pb-2">
              BANKING DETAILS
            </h3>
            <div className="text-sm space-y-2">
              <p><strong>Bank:</strong> Maybank Berhad</p>
              <p><strong>Account No:</strong> <span className="font-mono">5142 8891 0023</span></p>
              <p><strong>Beneficiary:</strong> LeadFlow Enterprise Solutions Sdn Bhd</p>
              <p><strong>Reference:</strong> {doc.number}</p>
            </div>
            {isPaid && invoiceDoc.paymentMethod && (
              <p className="mt-3 text-xs font-mono text-emerald-700 border-t border-zinc-200 pt-2">
                Payment verified: {invoiceDoc.paymentMethod}
              </p>
            )}
          </div>
          <div className="border border-zinc-300 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3 border-b border-zinc-200 pb-2">
              AUTHORIZED SIGNATORY
            </h3>
            <div className="mt-8 pt-6 border-t border-zinc-300">
              <p className="font-serif italic font-bold text-lg">Aiman Ridzuan</p>
              <p className="text-sm text-zinc-600 mt-1">Authorized Officer</p>
              <p className="text-sm text-zinc-600">LeadFlow Enterprise Solutions Sdn Bhd</p>
              <p className="text-sm text-zinc-600 mt-2">Date: {formatShortDate(doc.date)}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-200">
              <p className="text-xs text-zinc-500">Company Stamp / Chop:</p>
              <div className="h-16 border border-dashed border-zinc-300 mt-2"></div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-zinc-300 text-center text-xs text-zinc-500">
          <p>Thank you for your business. Please quote document number in all correspondence.</p>
          <p className="mt-1">LeadFlow Enterprise Solutions Sdn Bhd • finance@leadflow.my • +603-2788 9000</p>
        </footer>
      </div>
    </div>
  );
}
