import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { SAMPLE_LEADS, STAGES, MAX_MOCKUP_LEADS, DEFAULT_SOURCES } from '../data/initialLeads';
import { Lead, LeadContextType, SortOption, ViewMode, StageId, PriorityId, Activity, BANT, ToastState, Contact, LeadSource, AuditEvent } from '../types';
import { filterAndSortLeads, computeStats } from '../lib/leadSelectors';
import { trackLeadCreated, trackStageChanged, trackExport } from '../lib/analytics';
import { logAuditEvent, readAuditEvents, clearAuditStorage } from '../lib/audit';
import { downloadLeadsCsv } from '../lib/exportCsv';

const STORAGE_KEY = 'leadflow_crm_leads_en_my_v3_15';
const SOURCES_KEY = 'leadflow_crm_sources_v1';
export const VIEW_KEY = 'leadflow_crm_view_v1';
export const DARK_KEY = 'leadflow_crm_dark_v1';

const VALID_VIEW_MODES: ViewMode[] = ['kanban', 'table', 'analytics', 'reports', 'contacts', 'sources', 'audit', 'privacy'];

export const LeadContext = createContext<LeadContextType | null>(null);

/** Build contacts by de-duplicating leads on email (or normalized phone). */
function buildContactsFromLeads(leads: Lead[]): Contact[] {
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

/** Load lead sources from localStorage, falling back to the built-in defaults. */
function loadInitialSources(): LeadSource[] {
  try {
    const saved = localStorage.getItem(SOURCES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as LeadSource[];
    }
  } catch (e) {
    console.error('Error loading sources from storage', e);
  }
  return DEFAULT_SOURCES;
}

const RANDOM_DEMO_NAMES = [
  { name: 'Khairul Aming Enterprise', rep: 'Khairul', phone: '012-888 9921', company: 'Sambal Nyet Factory Kota Bharu', source: 'TikTok Ads', value: 45000, note: 'Inquired about warehouse CRM and bulk shipping SMS/WhatsApp notifications.' },
  { name: 'Puan Sri Zaleha', rep: 'Zaleha', phone: '013-777 1234', company: 'Zaleha Modest Fashion Bangi', source: 'Meta Ads', value: 12000, note: 'Inbound from Meta Ads: Needs wholesale product catalog integration.' },
  { name: 'Dr. Jeffrey Cheah', rep: 'Jeffrey', phone: '019-333 8877', company: 'Vanguard Medical Hub Subang', source: 'Website Form', value: 65000, note: 'Multi-clinic patient recall & appointment reminders portal.' },
  { name: 'Syed Mokhtar', rep: 'Syed', phone: '017-222 9988', company: 'Tradewinds Freight Solutions Shah Alam', source: 'Direct WhatsApp', value: 38000, note: 'Requested formal quotation for custom B2B sales pipeline module.' },
];

export function LeadProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, MAX_MOCKUP_LEADS);
        }
      }
    } catch (e) {
      console.error('Error loading leads from storage', e);
    }
    return SAMPLE_LEADS;
  });

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem(VIEW_KEY) as ViewMode | null;
    if (saved && VALID_VIEW_MODES.includes(saved)) {
      return saved;
    }
    return 'kanban';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(DARK_KEY);
    if (saved !== null) {
      return saved === 'true';
    }
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [lostModalLeadId, setLostModalLeadId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [sources, setSources] = useState<LeadSource[]>(loadInitialSources);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(readAuditEvents);

  const isLimitReached = leads.length >= MAX_MOCKUP_LEADS;

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    } catch (e) {
      console.error('Error saving leads to storage', e);
    }
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem(SOURCES_KEY, JSON.stringify(sources));
    } catch (e) {
      console.error('Error saving sources to storage', e);
    }
  }, [sources]);

  useEffect(() => {
    localStorage.setItem(VIEW_KEY, viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem(DARK_KEY, String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const selectedLead = useMemo(() => {
    if (!selectedLeadId) return null;
    return leads.find(l => l.id === selectedLeadId) || null;
  }, [leads, selectedLeadId]);

  // Contacts are derived from leads (auto-created whenever a lead is created)
  const contacts = useMemo(() => buildContactsFromLeads(leads), [leads]);

  const getLinkedLeads = (contactId: string): Lead[] => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return [];
    return leads.filter(l => contact.linkedLeadIds.includes(l.id));
  };

  /** Log an audit event and refresh the in-context list. */
  const logAndSet = (event: Parameters<typeof logAuditEvent>[0]) => {
    const created = logAuditEvent(event);
    setAuditEvents(readAuditEvents());
    return created;
  };

  // Actions
  const addLead = (newLeadData: Partial<Lead>): Lead | null => {
    if (leads.length >= MAX_MOCKUP_LEADS) {
      showToast(`Mockup limit reached: Demo is limited to a maximum of ${MAX_MOCKUP_LEADS} leads. Delete an existing lead to create a new one.`, 'error');
      return null;
    }

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: newLeadData.name || 'New Prospect',
      company: newLeadData.company || 'Direct Client',
      phone: newLeadData.phone || '',
      email: newLeadData.email || '',
      dealValue: Number(newLeadData.dealValue) || 0,
      stage: (newLeadData.stage as StageId) || 'new',
      priority: (newLeadData.priority as PriorityId) || 'medium',
      source: newLeadData.source || 'Website Form',
      assignedTo: newLeadData.assignedTo || 'Aiman (Sales Lead)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nextFollowUpDate: newLeadData.nextFollowUpDate || new Date().toISOString().split('T')[0],
      notes: newLeadData.notes || '',
      bant: newLeadData.bant || {
        budget: false,
        authority: false,
        need: true,
        timeline: false
      },
      quotations: [],
      invoices: [],
      activities: [
        {
          id: `act-${Date.now()}`,
          type: 'note',
          author: 'System',
          content: `Lead created via ${newLeadData.source || 'Manual Entry'}.`,
          timestamp: new Date().toISOString()
        }
      ],
      lostReason: undefined
    };

    setLeads(prev => [newLead, ...prev]);
    trackLeadCreated({ mode: 'demo', source: newLead.source, stage: newLead.stage, dealValue: newLead.dealValue });
    logAndSet({
      action: 'lead_created',
      actor: 'You (Demo)',
      targetId: newLead.id,
      targetName: newLead.name,
      details: `Lead created via ${newLead.source}. Contact auto-linked.`,
    });
    showToast(`Lead "${newLead.name}" added successfully! (${leads.length + 1}/${MAX_MOCKUP_LEADS})`);
    return newLead;
  };

  const quickAddDemoLead = () => {
    if (leads.length >= MAX_MOCKUP_LEADS) {
      showToast(`Mockup limit reached (${MAX_MOCKUP_LEADS}/${MAX_MOCKUP_LEADS} leads). Delete an existing lead to simulate new ones.`, 'error');
      return;
    }

    const template = RANDOM_DEMO_NAMES[Math.floor(Math.random() * RANDOM_DEMO_NAMES.length)];
    const randomId = `lead-demo-${Date.now()}`;
    const newLead: Lead = {
      id: randomId,
      name: template.name,
      company: template.company,
      phone: template.phone,
      email: `${template.rep.toLowerCase()}@${template.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.my`,
      dealValue: template.value,
      stage: 'new',
      priority: 'urgent',
      source: template.source,
      assignedTo: 'Aiman (Sales Lead)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nextFollowUpDate: new Date().toISOString().split('T')[0],
      notes: template.note,
      bant: {
        budget: true,
        authority: true,
        need: true,
        timeline: true
      },
      quotations: [],
      invoices: [],
      activities: [
        {
          id: `act-${Date.now()}`,
          type: 'note',
          author: 'System',
          content: `⚡ Webhook Inbound Triggered from ${template.source}! Inbound inquiry received.`,
          timestamp: new Date().toISOString()
        }
      ],
      lostReason: undefined
    };

    setLeads(prev => [newLead, ...prev]);
    showToast(`⚡ New lead received from ${template.source}: "${template.name}"! (${leads.length + 1}/${MAX_MOCKUP_LEADS})`, 'info');
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    const before = leads.find(l => l.id === id);
    setLeads(prev => prev.map(l => {
      if (l.id === id) {
        return { ...l, ...updates, updatedAt: new Date().toISOString() };
      }
      return l;
    }));
    if (before && (updates.name !== undefined || updates.company !== undefined || updates.phone !== undefined || updates.email !== undefined || updates.source !== undefined)) {
      logAndSet({
        action: 'lead_updated',
        actor: 'You (Demo)',
        targetId: id,
        targetName: updates.name || before.name,
        details: `Lead details updated (contact info / source).`,
      });
    }
  };

  const moveStage = (leadId: string, newStage: StageId | string) => {
    if (newStage === 'lost') {
      setLostModalLeadId(leadId);
      return;
    }

    const leadBefore = leads.find(l => l.id === leadId);
    const stageObj = STAGES.find(s => s.id === newStage);
    const stageLabel = stageObj ? stageObj.label : newStage;

    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        if (l.stage !== newStage) {
          trackStageChanged({ mode: 'demo', from: l.stage, to: newStage as string, dealValue: l.dealValue });
        }

        const newActivity: Activity = {
          id: `act-${Date.now()}`,
          type: 'note',
          author: 'You',
          content: `Stage updated to "${stageLabel}".`,
          timestamp: new Date().toISOString()
        };

        return {
          ...l,
          stage: newStage as StageId,
          lostReason: undefined,
          updatedAt: new Date().toISOString(),
          activities: [newActivity, ...(l.activities || [])]
        };
      }
      return l;
    }));

    if (leadBefore && leadBefore.stage !== newStage) {
      logAndSet({
        action: 'lead_stage_changed',
        actor: 'You (Demo)',
        targetId: leadId,
        targetName: leadBefore.name,
        details: `Stage moved from "${leadBefore.stage}" to "${newStage}".`,
      });
    }

    showToast(`Stage updated to ${stageObj?.label || newStage}`);
  };

  const confirmLostReason = (leadId: string, reason: string) => {
    const leadBefore = leads.find(l => l.id === leadId);
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const newActivity: Activity = {
          id: `act-${Date.now()}`,
          type: 'note',
          author: 'You',
          content: `Lead marked Closed Lost. Reason: ${reason}.`,
          timestamp: new Date().toISOString()
        };

        return {
          ...l,
          stage: 'lost',
          lostReason: reason,
          updatedAt: new Date().toISOString(),
          activities: [newActivity, ...(l.activities || [])]
        };
      }
      return l;
    }));

    trackStageChanged({ mode: 'demo', from: leadBefore?.stage || 'new', to: 'lost', dealValue: leadBefore?.dealValue });
    logAndSet({
      action: 'lead_lost',
      actor: 'You (Demo)',
      targetId: leadId,
      targetName: leadBefore?.name,
      details: `Marked Closed Lost. Reason: ${reason}.`,
    });
    setLostModalLeadId(null);
    showToast('Lead marked as Closed Lost.');
  };

  const addActivity = (leadId: string, { type, content, author = 'You' }: Omit<Activity, 'id' | 'timestamp'>) => {
    if (!content.trim()) return;

    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const newAct: Activity = {
          id: `act-${Date.now()}`,
          type,
          author,
          content,
          timestamp: new Date().toISOString()
        };

        const updates: Partial<Lead> = {
          activities: [newAct, ...(l.activities || [])],
          updatedAt: new Date().toISOString()
        };

        if (type === 'call' || type === 'whatsapp' || type === 'meeting') {
          if (l.stage === 'new') {
            updates.stage = 'contacted';
          }
        }

        return { ...l, ...updates };
      }
      return l;
    }));

    showToast('Activity logged successfully');
  };

  const toggleBANT = (leadId: string, criteriaKey: keyof BANT) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const currentBant = l.bant || { budget: false, authority: false, need: false, timeline: false };
        return {
          ...l,
          updatedAt: new Date().toISOString(),
          bant: {
            ...currentBant,
            [criteriaKey]: !currentBant[criteriaKey]
          }
        };
      }
      return l;
    }));
  };

  const deleteLead = (leadId: string) => {
    const removed = leads.find(l => l.id === leadId);
    setLeads(prev => prev.filter(l => l.id !== leadId));
    if (selectedLeadId === leadId) setSelectedLeadId(null);
    logAndSet({
      action: 'lead_deleted',
      actor: 'You (Demo)',
      targetId: leadId,
      targetName: removed?.name,
      details: `Lead record deleted.`,
    });
    showToast('Lead record deleted.');
  };

  const resetToDefaults = () => {
    setLeads(SAMPLE_LEADS);
    localStorage.removeItem(STORAGE_KEY);
    setSelectedLeadId(null);
    logAndSet({
      action: 'demo_reset',
      actor: 'You (Demo)',
      details: `Demo data reset to ${SAMPLE_LEADS.length} initial leads.`,
    });
    showToast(`Demo data reset to ${SAMPLE_LEADS.length} initial leads.`);
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(leads, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `leadflow-crm-export-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    trackExport({ format: 'json', mode: 'demo', count: leads.length });
    logAndSet({
      action: 'export_json',
      actor: 'You (Demo)',
      details: `Exported ${leads.length} leads to JSON.`,
    });
    showToast('Leads exported to JSON format.');
  };

  const exportCsv = () => {
    downloadLeadsCsv(filteredLeads, 'Demo User');
    trackExport({ format: 'csv', mode: 'demo', count: filteredLeads.length });
    setAuditEvents(readAuditEvents()); // downloadLeadsCsv logs the event itself
    showToast(`Exported ${filteredLeads.length} leads to CSV.`);
  };

  // ── Lead Sources Management ──
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
    setSources(prev => [...prev, newSource]);
    showToast(`Lead source "${newSource.name}" added.`);
    return newSource;
  };

  const updateSource = (id: string, updates: Partial<LeadSource>) => {
    setSources(prev => prev.map(s => (s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s)));
  };

  const deleteSource = (id: string) => {
    const removed = sources.find(s => s.id === id);
    setSources(prev => prev.filter(s => s.id !== id));
    showToast(`Lead source "${removed?.name || id}" deleted.`);
  };

  const clearAuditLog = () => {
    clearAuditStorage();
    setAuditEvents([]);
    showToast('Audit log cleared.');
  };

  // Filtered & Sorted Leads
  const filteredLeads = useMemo(
    () => filterAndSortLeads(leads, { searchQuery, selectedSource, selectedPriority, sortBy }),
    [leads, searchQuery, selectedSource, selectedPriority, sortBy]
  );

  // Statistics Calculation
  const stats = useMemo(() => computeStats(leads), [leads]);

  return (
    <LeadContext.Provider
      value={{
        mode: 'demo',
        leads,
        maxLeads: MAX_MOCKUP_LEADS,
        isLimitReached,
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
        quickAddDemoLead,
        resetToDefaults,
        exportData,
        exportCsv,
        contacts,
        getLinkedLeads,
        sources,
        addSource,
        updateSource,
        deleteSource,
        auditEvents,
        clearAuditLog
      }}
    >
      {children}
    </LeadContext.Provider>
  );
}

export function useLeads(): LeadContextType {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
}
