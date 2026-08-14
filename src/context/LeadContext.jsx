import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { SAMPLE_LEADS, STAGES, SOURCES, PRIORITIES, MAX_MOCKUP_LEADS } from '../data/initialLeads';

const STORAGE_KEY = 'leadflow_crm_leads_en_my_v3_15';
const VIEW_KEY = 'leadflow_crm_view_v1';
const DARK_KEY = 'leadflow_crm_dark_v1';

const LeadContext = createContext(null);

const RANDOM_DEMO_NAMES = [
  { name: 'Khairul Aming Enterprise', rep: 'Khairul', phone: '012-888 9921', company: 'Sambal Nyet Factory Kota Bharu', source: 'TikTok Ads', value: 45000, note: 'Inquired about warehouse CRM and bulk shipping SMS/WhatsApp notifications.' },
  { name: 'Puan Sri Zaleha', rep: 'Zaleha', phone: '013-777 1234', company: 'Zaleha Modest Fashion Bangi', source: 'Meta Ads', value: 12000, note: 'Inbound from Meta Ads: Needs wholesale product catalog integration.' },
  { name: 'Dr. Jeffrey Cheah', rep: 'Jeffrey', phone: '019-333 8877', company: 'Vanguard Medical Hub Subang', source: 'Website Form', value: 65000, note: 'Multi-clinic patient recall & appointment reminders portal.' },
  { name: 'Syed Mokhtar', rep: 'Syed', phone: '017-222 9988', company: 'Tradewinds Freight Solutions Shah Alam', source: 'Direct WhatsApp', value: 38000, note: 'Requested formal quotation for custom B2B sales pipeline module.' },
];

export function LeadProvider({ children }) {
  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If stored array is larger than max limit from previous session, trim it
          return parsed.slice(0, MAX_MOCKUP_LEADS);
        }
      }
    } catch (e) {
      console.error('Error loading leads from storage', e);
    }
    return SAMPLE_LEADS;
  });

  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem(VIEW_KEY) || 'kanban';
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem(DARK_KEY);
    if (saved !== null) {
      return saved === 'true';
    }
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLostModalOpen, setIsLostModalOpen] = useState(false);
  const [leadPendingLost, setLeadPendingLost] = useState(null);
  const [toast, setToast] = useState(null);

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

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const selectedLead = useMemo(() => {
    if (!selectedLeadId) return null;
    return leads.find(l => l.id === selectedLeadId) || null;
  }, [leads, selectedLeadId]);

  // Actions
  const addLead = (newLeadData) => {
    if (leads.length >= MAX_MOCKUP_LEADS) {
      showToast(`Mockup limit reached: Demo is limited to a maximum of ${MAX_MOCKUP_LEADS} leads. Delete an existing lead to create a new one.`, 'error');
      return null;
    }

    const newLead = {
      id: `lead-${Date.now()}`,
      name: newLeadData.name,
      company: newLeadData.company || 'Individual / Direct Client',
      phone: newLeadData.phone,
      email: newLeadData.email || '',
      dealValue: Number(newLeadData.dealValue) || 0,
      stage: newLeadData.stage || 'new',
      priority: newLeadData.priority || 'medium',
      source: newLeadData.source || 'Website Form',
      assignedTo: newLeadData.assignedTo || 'Aiman (Sales Lead)',
      createdAt: new Date().toISOString(),
      lastContactedAt: null,
      nextFollowUpDate: newLeadData.nextFollowUpDate || new Date().toISOString().split('T')[0],
      tags: newLeadData.tags && newLeadData.tags.length > 0 ? newLeadData.tags : ['Inbound'],
      notes: newLeadData.notes || '',
      bant: {
        budget: false,
        authority: false,
        need: true,
        timeline: false,
        notes: ''
      },
      activities: [
        {
          id: `act-${Date.now()}`,
          type: 'note',
          author: 'System',
          content: `Lead created via ${newLeadData.source || 'Manual Entry'}.`,
          timestamp: new Date().toISOString()
        }
      ],
      lostReason: null
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
    const newLead = {
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
      lastContactedAt: null,
      nextFollowUpDate: new Date().toISOString().split('T')[0],
      tags: ['⚡ Live Inbound Ads', template.source],
      notes: template.note,
      bant: {
        budget: true,
        authority: true,
        need: true,
        timeline: true,
        notes: 'High-intent inbound lead from campaign!'
      },
      activities: [
        {
          id: `act-${Date.now()}`,
          type: 'note',
          author: 'System',
          content: `⚡ Webhook Inbound Triggered from ${template.source}! Inbound form submitted.`,
          timestamp: new Date().toISOString()
        }
      ],
      lostReason: null
    };

    setLeads(prev => [newLead, ...prev]);
    showToast(`⚡ New lead received from ${template.source}: "${template.name}"! (${leads.length + 1}/${MAX_MOCKUP_LEADS})`, 'info');
  };

  const updateLead = (id, updates) => {
    setLeads(prev => prev.map(l => {
      if (l.id === id) {
        return { ...l, ...updates };
      }
      return l;
    }));
  };

  const moveStage = (leadId, newStage, lostReason = null) => {
    if (newStage === 'lost' && !lostReason) {
      setLeadPendingLost(leadId);
      setIsLostModalOpen(true);
      return;
    }

    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const stageObj = STAGES.find(s => s.id === newStage);
        const stageLabel = stageObj ? stageObj.label : newStage;
        
        const newActivity = {
          id: `act-${Date.now()}`,
          type: 'stage_change',
          author: 'You',
          content: `Stage updated to "${stageLabel}"${lostReason ? ` (Reason: ${lostReason})` : ''}.`,
          timestamp: new Date().toISOString()
        };

        return {
          ...l,
          stage: newStage,
          lostReason: newStage === 'lost' ? (lostReason || l.lostReason) : null,
          activities: [newActivity, ...(l.activities || [])]
        };
      }
      return l;
    }));

    const stageObj = STAGES.find(s => s.id === newStage);
    showToast(`Stage updated to ${stageObj?.label || newStage}`);
  };

  const addActivity = (leadId, { type, content, author = 'You' }) => {
    if (!content.trim()) return;

    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const newAct = {
          id: `act-${Date.now()}`,
          type,
          author,
          content,
          timestamp: new Date().toISOString()
        };

        const updates = {
          activities: [newAct, ...(l.activities || [])],
        };

        if (type === 'call' || type === 'whatsapp' || type === 'meeting') {
          updates.lastContactedAt = new Date().toISOString();
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

  const toggleBANT = (leadId, field) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const currentBant = l.bant || { budget: false, authority: false, need: false, timeline: false };
        return {
          ...l,
          bant: {
            ...currentBant,
            [field]: !currentBant[field]
          }
        };
      }
      return l;
    }));
  };

  const deleteLead = (leadId) => {
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
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = lead.name?.toLowerCase().includes(q);
        const matchesCompany = lead.company?.toLowerCase().includes(q);
        const matchesPhone = lead.phone?.toLowerCase().includes(q);
        const matchesNotes = lead.notes?.toLowerCase().includes(q);
        const matchesTags = lead.tags?.some(t => t.toLowerCase().includes(q));
        if (!matchesName && !matchesCompany && !matchesPhone && !matchesNotes && !matchesTags) {
          return false;
        }
      }

      // Stage
      if (stageFilter !== 'all' && lead.stage !== stageFilter) {
        return false;
      }

      // Source
      if (sourceFilter !== 'all' && lead.source !== sourceFilter) {
        return false;
      }

      // Priority
      if (priorityFilter !== 'all' && lead.priority !== priorityFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'deal-desc') {
        return (b.dealValue || 0) - (a.dealValue || 0);
      }
      if (sortBy === 'deal-asc') {
        return (a.dealValue || 0) - (b.dealValue || 0);
      }
      if (sortBy === 'followup') {
        if (!a.nextFollowUpDate) return 1;
        if (!b.nextFollowUpDate) return -1;
        return new Date(a.nextFollowUpDate) - new Date(b.nextFollowUpDate);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [leads, searchQuery, stageFilter, sourceFilter, priorityFilter, sortBy]);

  // High-Level Statistics
  const stats = useMemo(() => {
    const total = leads.length;
    const activeLeads = leads.filter(l => l.stage !== 'won' && l.stage !== 'lost');
    const wonLeads = leads.filter(l => l.stage === 'won');
    const lostLeads = leads.filter(l => l.stage === 'lost');
    
    const activePipelineValue = activeLeads.reduce((sum, l) => sum + (Number(l.dealValue) || 0), 0);
    const wonValue = wonLeads.reduce((sum, l) => sum + (Number(l.dealValue) || 0), 0);
    
    const closedCount = wonLeads.length + lostLeads.length;
    const winRate = closedCount > 0 ? Math.round((wonLeads.length / closedCount) * 100) : 0;

    const todayStr = new Date().toISOString().split('T')[0];
    const dueTodayCount = leads.filter(l => l.nextFollowUpDate === todayStr && l.stage !== 'won' && l.stage !== 'lost').length;
    const overdueCount = leads.filter(l => l.nextFollowUpDate && l.nextFollowUpDate < todayStr && l.stage !== 'won' && l.stage !== 'lost').length;

    // Stage counts & values
    const stageSummary = {};
    STAGES.forEach(s => {
      const stageLeads = leads.filter(l => l.stage === s.id);
      stageSummary[s.id] = {
        count: stageLeads.length,
        value: stageLeads.reduce((acc, curr) => acc + (Number(curr.dealValue) || 0), 0)
      };
    });

    // Sources breakdown
    const sourceBreakdown = {};
    SOURCES.forEach(src => {
      const srcLeads = leads.filter(l => l.source === src);
      sourceBreakdown[src] = {
        count: srcLeads.length,
        value: srcLeads.reduce((acc, curr) => acc + (Number(curr.dealValue) || 0), 0),
        wonCount: srcLeads.filter(l => l.stage === 'won').length
      };
    });

    return {
      total,
      activeCount: activeLeads.length,
      activePipelineValue,
      wonCount: wonLeads.length,
      wonValue,
      lostCount: lostLeads.length,
      winRate,
      dueTodayCount,
      overdueCount,
      stageSummary,
      sourceBreakdown,
    };
  }, [leads]);

  return (
    <LeadContext.Provider
      value={{
        leads,
        filteredLeads,
        stats,
        maxLeads: MAX_MOCKUP_LEADS,
        isLimitReached,
        viewMode,
        setViewMode,
        darkMode,
        setDarkMode,
        searchQuery,
        setSearchQuery,
        stageFilter,
        setStageFilter,
        sourceFilter,
        setSourceFilter,
        priorityFilter,
        setPriorityFilter,
        sortBy,
        setSortBy,
        selectedLeadId,
        setSelectedLeadId,
        selectedLead,
        isAddModalOpen,
        setIsAddModalOpen,
        isLostModalOpen,
        setIsLostModalOpen,
        leadPendingLost,
        setLeadPendingLost,
        toast,
        showToast,
        addLead,
        quickAddDemoLead,
        updateLead,
        moveStage,
        addActivity,
        toggleBANT,
        deleteLead,
        resetToDefaults,
        exportData
      }}
    >
      {children}
    </LeadContext.Provider>
  );
}

export function useLeads() {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
}
