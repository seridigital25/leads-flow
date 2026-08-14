import React, { useState } from 'react';
import { useLeads } from '../../context/LeadContext';
import { STAGES, SOURCES, PRIORITIES } from '../../data/initialLeads';
import { BrandIcon } from '../common/BrandLogo';
import { X, Plus, Sparkles, Building2, User, Phone, Mail, DollarSign, AlertCircle } from 'lucide-react';

export default function AddLeadModal() {
  const { isAddModalOpen, setIsAddModalOpen, addLead, isLimitReached, maxLeads, leads } = useLeads();

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dealValue, setDealValue] = useState('');
  const [source, setSource] = useState('Meta Ads');
  const [priority, setPriority] = useState('medium');
  const [stage, setStage] = useState('new');
  const [notes, setNotes] = useState('');

  if (!isAddModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLimitReached) {
      alert(`Mockup limit reached: Demo is limited to max ${maxLeads} leads. Delete an existing lead to create a new one.`);
      return;
    }

    if (!name.trim() || !phone.trim()) {
      alert('Please enter Full Name and Phone/WhatsApp Number.');
      return;
    }

    const created = addLead({
      name,
      company,
      phone,
      email,
      dealValue: Number(dealValue) || 0,
      source,
      priority,
      stage,
      notes,
    });

    if (created) {
      // Reset form & close
      setName('');
      setCompany('');
      setPhone('');
      setEmail('');
      setDealValue('');
      setNotes('');
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsAddModalOpen(false)}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden z-10 animate-fade-in">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/80 dark:bg-zinc-900">
          <div className="flex items-center gap-2.5">
            <BrandIcon className="w-8 h-8" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Create New Lead
                </h3>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                  {leads.length}/{maxLeads}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Enter prospect details to start tracking in your LeadFlow pipeline.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Capacity Banner if reached */}
          {isLimitReached && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>Mockup Limit Reached:</strong> You currently have {leads.length} of {maxLeads} max leads in this browser demo. Delete an existing lead first before adding a new one.
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                disabled={isLimitReached}
                placeholder="e.g. Dato' Azman / Puan Nadia"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                disabled={isLimitReached}
                placeholder="e.g. Apex Logistics Sdn Bhd / Nadia Clinic"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full text-xs p-2 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                WhatsApp / Phone Number *
              </label>
              <input
                type="tel"
                required
                disabled={isLimitReached}
                placeholder="012-345 6789 or +6012..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs p-2 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-mono disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled={isLimitReached}
                placeholder="prospect@company.my"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-2 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                Estimated Value (RM)
              </label>
              <input
                type="number"
                disabled={isLimitReached}
                placeholder="e.g. 5000"
                value={dealValue}
                onChange={(e) => setDealValue(e.target.value)}
                className="w-full text-xs p-2 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-mono disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                Lead Source
              </label>
              <select
                disabled={isLimitReached}
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full text-xs p-2 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer disabled:opacity-50"
              >
                {SOURCES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                Priority
              </label>
              <select
                disabled={isLimitReached}
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full text-xs p-2 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer disabled:opacity-50"
              >
                {PRIORITIES.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Initial Notes / Prospect Inquiries
            </label>
            <textarea
              rows={2}
              disabled={isLimitReached}
              placeholder="e.g. Inquired about enterprise tier for 5 regional branch locations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-2 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLimitReached}
              className="px-4 py-1.5 text-xs font-semibold rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-40 transition-all cursor-pointer shadow-xs"
            >
              Save & Open Pipeline
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
