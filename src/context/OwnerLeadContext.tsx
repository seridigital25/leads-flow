import React, { useState, useEffect, useMemo, ReactNode } from 'react';
import { STAGES, DEFAULT_SOURCES } from '../data/initialLeads';
import { Lead, LeadContextType, SortOption, ViewMode, Activity, BANT, ToastState, Contact, LeadSource, AuditEvent } from '../types';
import { filterAndSortLeads, computeStats } from '../lib/leadSelectors';
import { ownerApi } from '../lib/ownerApi';
import { trackLeadCreated, trackStageChanged, trackExport } from '../lib/analytics';
import { logAuditEvent, readAuditEvents, clearAuditStorage } from '../lib/audit';
import { downloadLeadsCsv } from '../lib/exportCsv';
import { LeadContext, VIEW_KEY, DARK_KEY } from './LeadContext';

const SOURCES_KEY = 'leadflow_owner_sources_v1';
const VALID_VIEW_MODES: ViewMode[] = ['kanban', 'table', 'analytics', 'reports', 'contacts', 'sources', 'audit', 'privacy'];

/** Load owner lead sources from localStorage, falling back to defaults. */
function loadOwnerSources(): LeadSource[] {
  try {
    const saved = localStorage.getItem(SOURCES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as LeadSource[];
    }
  } catch (e) {
    console.error('Error loading owner sources', e);
  }
  return DEFAULT_SOURCES;
}

/** Shared helper: build contacts by de-duplicating leads on email (or normalized phone). */
export function buildContactsFromLeads(leads: Lead[]): Contact[] {
  const byKey = new Map<string, Contact>();
  for (const lead of [...leads].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))) {
    const phoneKey = lead.phone ? lead.phone.replace(/[^0-9]/g, '') : '';
    const emailKey = lead.email ? lead.email.toLowerCase() : '';
    const key = emailKey || `p:${phoneKey}` || `n:${lead.name.toLowerCase()}`;
    const existing = byKey.get(key);
    if (existing) {
      if (!existing.linkedLeadIds.includes(lead.id)) existing.linkedLeadIds.push(lead.id);
      if (!existing.company && lead.company) existing.company = lead.company;
      if (!existing.email && lead.email) existing.email = lead.email;
      if (!existing.phone && lead.phone) existing.phone = lead.phone;
      existing.updatedAt = lead.updatedAt;
    } else {
      byKey.set(key, {
        id: `contact-${key.replace(/[^a-z0-9]/gi, '') || lead.id}`,
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        company: lead.company,
        source: lead.source,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
        linkedLeadIds: [lead.id],
      });
    }
  }
  return Array.from(byKey.values());
}

export function OwnerLeadProvider({ children, onSignedOut }: { children: ReactNode; onSignedOut: () => void }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem(VIEW_KEY) as ViewMode | null;
    return saved && VALID_VIEW_MODES.includes(saved) ? saved : 'kanban';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(DARK_KEY);
    if (saved !== null) return saved === 'true';
    return typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false;
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [lostModalLeadId, setLostModalLeadId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [sources, setSources] = useState<LeadSource[]>(loadOwnerSources);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(readAuditEvents);

  useEffect(() => {
    try {
      localStorage.setItem(SOURCES_KEY, JSON.stringify(sources));
    } catch (e) {
      console.error('Error saving owner sources', e);
    }
  }, [sources]);

  /** Log an audit event: persisted locally and mirrored to the owner API (best-effort). */
  const logAndSet = (event: Parameters<typeof logAuditEvent>[0]) => {
    const created = logAuditEvent(event);
    setAuditEvents(readAuditEvents());
    ownerApi.logAuditEvent(created).catch(() => {
      /* Audit mirroring is best-effort; local storage is the source of truth for now. */
    });
    return created;
  };

  useEffect(() => {
    localStorage.setItem(VIEW_KEY, viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem(DARK_KEY, String(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    ownerApi
      .listLeads()
      .then(setLeads)
      .catch((err) => showToast(err.message || 'Failed to load leads', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const selectedLead = useMemo(
    () => (selectedLeadId ? leads.find((l) => l.id === selectedLeadId) || null : null),
    [leads, selectedLeadId]
  );

  const addLead = (newLeadData: Partial<Lead>): Lead | null => {
    const tempId = `temp-${Date.now()}`;
    const now = new Date().toISOString();
    const optimistic: Lead = {
      id: tempId,
      name: newLeadData.name || 'New Prospect',
      company: newLeadData.company || '',
      phone: newLeadData.phone || '',
      email: newLeadData.email || '',
      dealValue: Number(newLeadData.dealValue) || 0,
      stage: newLeadData.stage || 'new',
      priority: newLeadData.priority || 'medium',
      source: newLeadData.source || 'Manual Entry',
      assignedTo: newLeadData.assignedTo || 'Sharil (Owner)',
      createdAt: now,
      updatedAt: now,
      nextFollowUpDate: newLeadData.nextFollowUpDate,
      notes: newLeadData.notes || '',
      bant: newLeadData.bant || { budget: false, authority: false, need: true, timeline: false },
      quotations: [],
      invoices: [],
      activities: [],
    };

    setLeads((prev) => [optimistic, ...prev]);
    trackLeadCreated({ mode: 'owner', source: optimistic.source, stage: optimistic.stage, dealValue: optimistic.dealValue });

    ownerApi
      .createLead(newLeadData)
      .then((created) => {
        setLeads((prev) => prev.map((l) => (l.id === tempId ? created : l)));
        logAndSet({
          action: 'lead_created',
          actor: 'Owner',
          targetId: created.id,
          targetName: created.name,
          details: `Lead created via ${created.source}. Contact auto-linked.`,
        });
        showToast(`Lead "${created.name}" added successfully!`);
      })
      .catch((err) => {
        setLeads((prev) => prev.filter((l) => l.id !== tempId));
        showToast(err.message || 'Failed to add lead', 'error');
      });

    return optimistic;
  };

  const patchLead = (id: string, updates: Partial<Lead>, successMessage?: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l)));

    ownerApi
      .updateLead(id, updates)
      .then((saved) => {
        setLeads((prev) => prev.map((l) => (l.id === id ? saved : l)));
        if (successMessage) showToast(successMessage);
      })
      .catch((err) => {
        showToast(err.message || 'Failed to save changes', 'error');
        ownerApi.listLeads().then(setLeads).catch(() => {});
      });
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    const before = leads.find((l) => l.id === id);
    patchLead(id, updates);
    if (before && (updates.name !== undefined || updates.company !== undefined || updates.phone !== undefined || updates.email !== undefined || updates.source !== undefined)) {
      logAndSet({
        action: 'lead_updated',
        actor: 'Owner',
        targetId: id,
        targetName: updates.name || before.name,
        details: 'Lead details updated (contact info / source).',
      });
    }
  };

  const moveStage: LeadContextType['moveStage'] = (leadId, newStage) => {
    if (newStage === 'lost') {
      setLostModalLeadId(leadId);
      return;
    }

    const lead = leads.find((l) => l.id === leadId);
    const stageObj = STAGES.find((s) => s.id === newStage);
    const stageLabel = stageObj ? stageObj.label : newStage;
    if (lead && lead.stage !== newStage) {
      trackStageChanged({ mode: 'owner', from: lead.stage, to: newStage, dealValue: lead.dealValue });
      logAndSet({
        action: 'lead_stage_changed',
        actor: 'Owner',
        targetId: leadId,
        targetName: lead.name,
        details: `Stage moved from "${lead.stage}" to "${newStage}".`,
      });
    }
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      type: 'note',
      author: 'You',
      content: `Stage updated to "${stageLabel}".`,
      timestamp: new Date().toISOString(),
    };

    patchLead(
      leadId,
      {
        stage: newStage as Lead['stage'],
        lostReason: undefined,
        activities: [newActivity, ...(lead?.activities || [])],
      },
      `Stage updated to ${stageLabel}`
    );
  };

  const confirmLostReason = (leadId: string, reason: string) => {
    const lead = leads.find((l) => l.id === leadId);
    trackStageChanged({ mode: 'owner', from: lead?.stage || 'new', to: 'lost', dealValue: lead?.dealValue });
    logAndSet({
      action: 'lead_lost',
      actor: 'Owner',
      targetId: leadId,
      targetName: lead?.name,
      details: `Marked Closed Lost. Reason: ${reason}.`,
    });
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      type: 'note',
      author: 'You',
      content: `Lead marked Closed Lost. Reason: ${reason}.`,
      timestamp: new Date().toISOString(),
    };

    patchLead(
      leadId,
      { stage: 'lost', lostReason: reason, activities: [newActivity, ...(lead?.activities || [])] },
      'Lead marked as Closed Lost.'
    );
    setLostModalLeadId(null);
  };

  const addActivity = (leadId: string, { type, content, author = 'You' }: Omit<Activity, 'id' | 'timestamp'>) => {
    if (!content.trim()) return;
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    const newAct: Activity = { id: `act-${Date.now()}`, type, author, content, timestamp: new Date().toISOString() };
    const updates: Partial<Lead> = { activities: [newAct, ...(lead.activities || [])] };
    if ((type === 'call' || type === 'whatsapp' || type === 'meeting') && lead.stage === 'new') {
      updates.stage = 'contacted';
    }

    patchLead(leadId, updates, 'Activity logged successfully');
  };

  const toggleBANT = (leadId: string, criteriaKey: keyof BANT) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;
    const currentBant = lead.bant || { budget: false, authority: false, need: false, timeline: false };
    patchLead(leadId, { bant: { ...currentBant, [criteriaKey]: !currentBant[criteriaKey] } });
  };

  const deleteLead = (leadId: string) => {
    const removed = leads.find((l) => l.id === leadId);
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    if (selectedLeadId === leadId) setSelectedLeadId(null);

    ownerApi
      .deleteLead(leadId)
      .then(() => {
        logAndSet({
          action: 'lead_deleted',
          actor: 'Owner',
          targetId: leadId,
          targetName: removed?.name,
          details: 'Lead record deleted.',
        });
        showToast('Lead record deleted.');
      })
      .catch((err) => {
        showToast(err.message || 'Failed to delete lead', 'error');
        if (removed) setLeads((prev) => [removed, ...prev]);
      });
  };

  const exportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(leads, null, 2));
    const anchor = document.createElement('a');
    anchor.setAttribute('href', dataStr);
    anchor.setAttribute('download', `leadflow-owner-export-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    trackExport({ format: 'json', mode: 'owner', count: leads.length });
    logAndSet({
      action: 'export_json',
      actor: 'Owner',
      details: `Exported ${leads.length} leads to JSON.`,
    });
    showToast('Leads exported to JSON format.');
  };

  const exportCsv = () => {
    downloadLeadsCsv(filteredLeads, 'Owner');
    trackExport({ format: 'csv', mode: 'owner', count: filteredLeads.length });
    setAuditEvents(readAuditEvents()); // downloadLeadsCsv logs the event itself
    showToast(`Exported ${filteredLeads.length} leads to CSV.`);
  };

  const contacts = useMemo(() => buildContactsFromLeads(leads), [leads]);

  const getLinkedLeads = (contactId: string): Lead[] => {
    const contact = contacts.find((c) => c.id === contactId);
    if (!contact) return [];
    const ids = new Set(contact.linkedLeadIds);
    return leads.filter((l) => ids.has(l.id));
  };

  // ── Lead Sources Management (owner-persisted in localStorage) ──
  const addSource = ({ name, category }: { name: string; category: string }): LeadSource | null => {
    const trimmed = name.trim();
    if (!trimmed) {
      showToast('Source name cannot be empty.', 'error');
      return null;
    }
    if (sources.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) {
      showToast(`Source "${trimmed}" already exists.`, 'error');
      return null;
    }
    const now = new Date().toISOString();
    const newSource: LeadSource = {
      id: `src-${Date.now()}`,
      name: trimmed,
      category: category.trim() || 'Other',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    setSources((prev) => [...prev, newSource]);
    showToast(`Lead source "${newSource.name}" added.`);
    return newSource;
  };

  const updateSource = (id: string, updates: Partial<LeadSource>) => {
    setSources((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s)));
  };

  const deleteSource = (id: string) => {
    const removed = sources.find((s) => s.id === id);
    setSources((prev) => prev.filter((s) => s.id !== id));
    showToast(`Lead source "${removed?.name || id}" deleted.`);
  };

  const clearAuditLog = () => {
    clearAuditStorage();
    setAuditEvents([]);
    showToast('Audit log cleared.');
  };

  const signOut = () => {
    ownerApi.logout().finally(onSignedOut);
  };

  const filteredLeads = useMemo(
    () => filterAndSortLeads(leads, { searchQuery, selectedSource, selectedPriority, sortBy }),
    [leads, searchQuery, selectedSource, selectedPriority, sortBy]
  );

  const stats = useMemo(() => computeStats(leads), [leads]);

  return (
    <LeadContext.Provider
      value={{
        mode: 'owner',
        loading,
        signOut,
        leads,
        maxLeads: Infinity,
        isLimitReached: false,
        filteredLeads,
        stats,
        selectedLead,
        selectedLeadId,
        setSelectedLeadId,
        viewMode,
        setViewMode,
        searchQuery,
        setSearchQuery,
        selectedSource,
        setSelectedSource,
        selectedPriority,
        setSelectedPriority,
        sortBy,
        setSortBy,
        darkMode,
        setDarkMode,
        isAddModalOpen,
        setIsAddModalOpen,
        lostModalLeadId,
        setLostModalLeadId,
        toast,
        showToast,
        addLead,
        updateLead,
        deleteLead,
        moveStage,
        confirmLostReason,
        addActivity,
        toggleBANT,
        quickAddDemoLead: () => {},
        resetToDefaults: () => {},
        exportData,
        exportCsv,
        contacts,
        getLinkedLeads,
        sources,
        addSource,
        updateSource,
        deleteSource,
        auditEvents,
        clearAuditLog,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
}
