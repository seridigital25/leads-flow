import React, { useEffect } from 'react';
import { LeadProvider, useLeads } from './context/LeadContext';
import Navbar from './components/layout/Navbar';
import MetricsBar from './components/layout/MetricsBar';
import FilterToolbar from './components/layout/FilterToolbar';
import KanbanBoard from './components/kanban/KanbanBoard';
import LeadsTableView from './components/table/LeadsTableView';
import AnalyticsView from './components/analytics/AnalyticsView';
import LeadDetailDrawer from './components/drawer/LeadDetailDrawer';
import AddLeadModal from './components/modals/AddLeadModal';
import LostReasonModal from './components/modals/LostReasonModal';
import Toast from './components/common/Toast';
import PocContactBanner from './components/common/PocContactBanner';

function CRMContent() {
  const { viewMode, selectedLead } = useLeads();

  // Dynamic SEO Title & Headings based on Active View
  useEffect(() => {
    if (selectedLead) {
      document.title = `${selectedLead.name} (${selectedLead.company}) — LeadFlow CRM Malaysia`;
    } else if (viewMode === 'kanban') {
      document.title = 'Kanban Sales Pipeline — LeadFlow CRM Malaysia (RM Edition)';
    } else if (viewMode === 'table') {
      document.title = 'Senarai & Penapisan Prospek Iklan — LeadFlow CRM Malaysia';
    } else if (viewMode === 'analytics') {
      document.title = 'Analisis Funnel Jualan & Saluran Iklan — LeadFlow CRM Malaysia';
    }
  }, [viewMode, selectedLead]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Semantic Accessible Heading for SEO & Screen Readers */}
      <h1 className="sr-only">
        LeadFlow CRM Malaysia — Sistem Pengurusan Prospek &amp; WhatsApp Sales Pipeline
      </h1>

      {/* Top Navbar */}
      <Navbar />

      {/* KPI Metrics Summary Bar */}
      <MetricsBar />

      {/* Filter and Search Bar (Active on Kanban and Table views) */}
      {viewMode !== 'analytics' && <FilterToolbar />}

      {/* Dynamic View Panel */}
      <main className="flex-1 flex flex-col overflow-hidden relative" role="main" aria-label="Ruang Kerja CRM">
        {viewMode === 'kanban' && <KanbanBoard />}
        {viewMode === 'table' && <LeadsTableView />}
        {viewMode === 'analytics' && <AnalyticsView />}
      </main>

      {/* Slide-over Drawer for Lead Inspection */}
      <LeadDetailDrawer />

      {/* Modals */}
      <AddLeadModal />
      <LostReasonModal />

      {/* Floating POC Contact Developer Banner */}
      <PocContactBanner />

      {/* Toast Notification Container */}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <LeadProvider>
      <CRMContent />
    </LeadProvider>
  );
}
