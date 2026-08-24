import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { SAMPLE_LEADS, STAGES, MAX_MOCKUP_LEADS } from '../data/initialLeads';
import { Lead, LeadContextType, SortOption, ViewMode, StageId, PriorityId, Activity, BANT, Stats, ToastState } from '../types';

const STORAGE_KEY = 'leadflow_crm_leads_en_my_v3_15';
const VIEW_KEY = 'leadflow_crm_view_v1';
const DARK_KEY = 'leadflow_crm_dark_v1';

const LeadContext = createContext<LeadContextType | null>(null);

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
    const saved = localStorage.getItem(VIEW_KEY);
    if (saved === 'kanban' || saved === 'table' || saved === 'analytics') {
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
    setLeads(prev => prev.map(l => {
      if (l.id === id) {
        return { ...l, ...updates, updatedAt: new Date().toISOString() };
      }
      return l;
    }));
  };

  const moveStage = (leadId: string, newStage: StageId | string) => {
    if (newStage === 'lost') {
      setLostModalLeadId(leadId);
      return;
    }

    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const stageObj = STAGES.find(s => s.id === newStage);
        const stageLabel = stageObj ? stageObj.label : newStage;
        
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

    const stageObj = STAGES.find(s => s.id === newStage);
    showToast(`Stage updated to ${stageObj?.label || newStage}`);
  };

  const confirmLostReason = (leadId: string, reason: string) => {
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
    setLeads(prev => prev.filter(l => l.id !== leadId));
    if (selectedLeadId === leadId) setSelectedLeadId(null);
    showToast('Lead record deleted.');
  };

  const resetToDefaults = () => {
    setLeads(SAMPLE_LEADS);
    localStorage.removeItem(STORAGE_KEY);
    setSelectedLeadId(null);
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
    showToast('Leads exported to JSON format.');
  };

  // Filtered & Sorted Leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = lead.name?.toLowerCase().includes(q);
        const matchesCompany = lead.company?.toLowerCase().includes(q);
        const matchesPhone = lead.phone?.toLowerCase().includes(q);
        const matchesNotes = lead.notes?.toLowerCase().includes(q);
        if (!matchesName && !matchesCompany && !matchesPhone && !matchesNotes) {
          return false;
        }
      }

      // Source Filter
      if (selectedSource !== 'all' && lead.source !== selectedSource) {
        return false;
      }

      // Priority Filter
      if (selectedPriority !== 'all' && lead.priority !== selectedPriority) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'value_desc') {
        return (b.dealValue || 0) - (a.dealValue || 0);
      }
      if (sortBy === 'value_asc') {
        return (a.dealValue || 0) - (b.dealValue || 0);
      }
      if (sortBy === 'followup') {
        if (!a.nextFollowUpDate) return 1;
        if (!b.nextFollowUpDate) return -1;
        return new Date(a.nextFollowUpDate).getTime() - new Date(b.nextFollowUpDate).getTime();
      }
      if (sortBy === 'name_asc') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [leads, searchQuery, selectedSource, selectedPriority, sortBy]);

  // Statistics Calculation
  const stats: Stats = useMemo(() => {
    const totalLeads = leads.length;
    const activeLeads = leads.filter(l => l.stage !== 'won' && l.stage !== 'lost');
    const wonLeads = leads.filter(l => l.stage === 'won');
    const lostLeads = leads.filter(l => l.stage === 'lost');

    const activePipelineValue = activeLeads.reduce((sum, l) => sum + (Number(l.dealValue) || 0), 0);
    const wonRevenue = wonLeads.reduce((sum, l) => sum + (Number(l.dealValue) || 0), 0);
    const lostRevenue = lostLeads.reduce((sum, l) => sum + (Number(l.dealValue) || 0), 0);

    const closedCount = wonLeads.length + lostLeads.length;
    const winRate = closedCount > 0 ? Math.round((wonLeads.length / closedCount) * 100) : 0;
    const avgDealSize = totalLeads > 0 ? Math.round((activePipelineValue + wonRevenue) / totalLeads) : 0;

    const todayStr = new Date().toISOString().split('T')[0];
    const followUpsDueCount = leads.filter(
      l => l.nextFollowUpDate && l.nextFollowUpDate <= todayStr && l.stage !== 'won' && l.stage !== 'lost'
    ).length;

    return {
      totalLeads,
      activePipelineValue,
      wonRevenue,
      lostRevenue,
      winRate,
      avgDealSize,
      followUpsDueCount
    };
  }, [leads]);

  return (
    <LeadContext.Provider
      value={{
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
        exportData
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
