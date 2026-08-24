import React, { useState, useEffect, useMemo, ReactNode } from 'react';
import { STAGES } from '../data/initialLeads';
import { Lead, LeadContextType, SortOption, ViewMode, Activity, BANT, ToastState } from '../types';
import { filterAndSortLeads, computeStats } from '../lib/leadSelectors';
import { ownerApi } from '../lib/ownerApi';
import { LeadContext, VIEW_KEY, DARK_KEY } from './LeadContext';

export function OwnerLeadProvider({ children, onSignedOut }: { children: ReactNode; onSignedOut: () => void }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem(VIEW_KEY);
    return saved === 'kanban' || saved === 'table' || saved === 'analytics' ? saved : 'kanban';
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

    ownerApi
      .createLead(newLeadData)
      .then((created) => {
        setLeads((prev) => prev.map((l) => (l.id === tempId ? created : l)));
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
    patchLead(id, updates);
  };

  const moveStage: LeadContextType['moveStage'] = (leadId, newStage) => {
    if (newStage === 'lost') {
      setLostModalLeadId(leadId);
      return;
    }

    const lead = leads.find((l) => l.id === leadId);
    const stageObj = STAGES.find((s) => s.id === newStage);
    const stageLabel = stageObj ? stageObj.label : newStage;
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
      .then(() => showToast('Lead record deleted.'))
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
    showToast('Leads exported to JSON format.');
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
      }}
    >
      {children}
    </LeadContext.Provider>
  );
}
