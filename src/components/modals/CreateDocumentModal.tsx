import React, { useState } from 'react';
import { useLeads } from '../../context/LeadContext';
import { formatCurrency } from '../../lib/utils';
import { Lead, DocumentItem, Quotation, Invoice, QuotationStatus, InvoiceStatus } from '../../types';
import { X, Plus, Trash2, FileText, Receipt } from 'lucide-react';

interface CreateDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  docType?: 'quotation' | 'invoice';
}

export default function CreateDocumentModal({ isOpen, onClose, lead, docType = 'quotation' }: CreateDocumentModalProps) {
  const { updateLead, addActivity, showToast } = useLeads();

  const isInvoice = docType === 'invoice';

  const [items, setItems] = useState<DocumentItem[]>([
    { description: lead ? `${lead.company || lead.name} — Implementation Service` : 'Custom Solution Package', qty: 1, unitPrice: lead?.dealValue || 5000 }
  ]);
  const [docNumber, setDocNumber] = useState<string>(() => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    return isInvoice ? `INV-2026-${randomCode}` : `QT-2026-${randomCode}`;
  });
  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [expiryOrDue, setExpiryOrDue] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [status, setStatus] = useState<string>(isInvoice ? 'unpaid' : 'sent');
  const [notes, setNotes] = useState<string>('Payment terms: 14 days from date of document. Price is inclusive of standard support.');

  if (!isOpen || !lead) return null;

  const handleAddItem = () => {
    setItems(prev => [...prev, { description: '', qty: 1, unitPrice: 1000 }]);
  };

  const handleItemChange = (index: number, field: keyof DocumentItem, value: string | number) => {
    setItems(prev => prev.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.unitPrice) || 0), 0);
  };

  const totalAmount = calculateTotal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedItems: DocumentItem[] = items.map(item => ({
      description: item.description || 'General Service Item',
      qty: Number(item.qty) || 1,
      unitPrice: Number(item.unitPrice) || 0,
      total: (Number(item.qty) || 1) * (Number(item.unitPrice) || 0)
    }));

    if (isInvoice) {
      const newInvoice: Invoice = {
        id: `inv-${Date.now()}`,
        number: docNumber,
        date: date,
        dueDate: expiryOrDue,
        status: status as InvoiceStatus,
        items: formattedItems,
        subtotal: totalAmount,
        tax: 0,
        total: totalAmount,
        paidAt: status === 'paid' ? new Date().toISOString() : null,
        paymentMethod: status === 'paid' ? 'Maybank Instant Online Transfer' : null,
        notes: notes
      };

      const existingInvoices = lead.invoices || [];
      updateLead(lead.id, {
        invoices: [newInvoice, ...existingInvoices],
        dealValue: totalAmount
      });

      addActivity(lead.id, {
        type: 'note',
        content: `Official Invoice #${docNumber} (${formatCurrency(totalAmount)}) created. Status: ${status.toUpperCase()}.`,
        author: 'You'
      });

      showToast(`Invoice #${docNumber} created successfully!`);
    } else {
      const newQuotation: Quotation = {
        id: `qt-${Date.now()}`,
        number: docNumber,
        date: date,
        validUntil: expiryOrDue,
        status: status as QuotationStatus,
        items: formattedItems,
        subtotal: totalAmount,
        tax: 0,
        total: totalAmount,
        notes: notes
      };

      const existingQuotations = lead.quotations || [];
      updateLead(lead.id, {
        quotations: [newQuotation, ...existingQuotations],
        dealValue: totalAmount,
        stage: lead.stage === 'new' || lead.stage === 'contacted' ? 'proposal_sent' : lead.stage
      });

      addActivity(lead.id, {
        type: 'whatsapp',
        content: `Generated Quotation #${docNumber} (${formatCurrency(totalAmount)}). Stage updated to Proposal Sent.`,
        author: 'You'
      });

      showToast(`Quotation #${docNumber} created successfully!`);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden z-10 animate-fade-in">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            {isInvoice ? (
              <Receipt className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            ) : (
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            )}
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {isInvoice ? 'Create Official Tax Invoice' : 'Create Quotation / Proposal'}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Client: <strong>{lead.name}</strong> ({lead.company})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                Document Number *
              </label>
              <input
                type="text"
                required
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                className="w-full text-xs p-2 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                Document Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs p-2 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                {isInvoice ? 'Payment Due Date' : 'Valid Until'}
              </label>
              <input
                type="date"
                required
                value={expiryOrDue}
                onChange={(e) => setExpiryOrDue(e.target.value)}
                className="w-full text-xs p-2 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>

          {/* Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full text-xs p-2 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                {isInvoice ? (
                  <>
                    <option value="unpaid">Pending Payment (Unpaid)</option>
                    <option value="paid">Paid in Full (Verified Receipt)</option>
                  </>
                ) : (
                  <>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent to Client</option>
                    <option value="approved">Approved & Accepted</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                Sales Rep In-Charge
              </label>
              <input
                type="text"
                disabled
                value={lead.assignedTo || 'Aiman (Sales Lead)'}
                className="w-full text-xs p-2 rounded-md bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-500"
              />
            </div>
          </div>

          {/* Line Items Builder */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                Line Items & Packages
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Item / Scope Description"
                      required
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      className="w-full text-xs p-1.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                  <div className="w-16">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.qty}
                      onChange={(e) => handleItemChange(idx, 'qty', parseInt(e.target.value) || 1)}
                      className="w-full text-xs p-1.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-center font-mono"
                    />
                  </div>
                  <div className="w-28">
                    <input
                      type="number"
                      min="0"
                      placeholder="Unit Price (RM)"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full text-xs p-1.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-right font-mono"
                    />
                  </div>
                  <div className="w-24 text-right font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100">
                    {formatCurrency((Number(item.qty) || 1) * (Number(item.unitPrice) || 0))}
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1 text-zinc-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Totals Summary */}
          <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-between font-mono">
            <span className="font-sans font-bold text-xs text-zinc-700 dark:text-zinc-300">
              Total Payable Amount:
            </span>
            <span className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
              {formatCurrency(totalAmount)}
            </span>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Notes & Special Instructions
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-2 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              {isInvoice ? 'Issue Invoice' : 'Generate Quotation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
