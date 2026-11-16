import React, { useMemo, useState } from 'react';
import { useLeads } from '../context/LeadContext';
import ContactCard from '../components/contacts/ContactCard';
import { Contact } from '../types';
import { Search, Users, X } from 'lucide-react';

export default function Contacts() {
  const { contacts, getLinkedLeads, setSelectedLeadId } = useLeads();
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');

  const contactSources = useMemo(() => {
    const names = new Set<string>();
    contacts.forEach((c) => names.add(c.source));
    return Array.from(names).sort();
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return contacts
      .filter((c: Contact) => {
        if (q && !(c.name?.toLowerCase().includes(q) || c.company?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.phone?.toLowerCase().includes(q))) {
          return false;
        }
        if (sourceFilter !== 'all' && c.source !== sourceFilter) return false;
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [contacts, search, sourceFilter]);

  const handleOpenLead = (leadId: string) => {
    setSelectedLeadId(leadId);
  };

  const hasFilters = search || sourceFilter !== 'all';

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-zinc-100/60 dark:bg-zinc-950 space-y-4">
      {/* Header & filters */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs p-4 space-y-3">
        <div className="flex items-center gap-2.5">
          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">Contacts</h2>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {filteredContacts.length} of {contacts.length} contacts — auto-created from your leads.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[180px] max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search contacts by name, company, phone, email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-7 py-1.5 text-xs rounded-md bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-400"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-md bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-300 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-400 cursor-pointer"
          >
            <option value="all">All Sources</option>
            {contactSources.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setSourceFilter('all'); }}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Contact cards grid */}
      {filteredContacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              linkedLeads={getLinkedLeads(contact.id).map((l) => ({
                id: l.id,
                name: l.name,
                stage: l.stage,
                dealValue: l.dealValue,
                source: l.source,
                createdAt: l.createdAt,
              }))}
              onOpenLead={handleOpenLead}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
          <Users className="w-8 h-8 mx-auto mb-2 text-zinc-300 dark:text-zinc-600" />
          <p className="text-sm font-medium text-zinc-400">No contacts found matching current filters.</p>
          {contacts.length === 0 && (
            <p className="text-xs text-zinc-400 mt-1">Contacts are created automatically when you add leads.</p>
          )}
        </div>
      )}

      {/* Hint about auto-creation */}
      {contacts.length > 0 && !hasFilters && (
        <p className="text-[11px] text-zinc-400 text-center">
          Contacts are auto-created when leads are added — duplicates are merged by email or phone number.
        </p>
      )}
    </div>
  );
}
