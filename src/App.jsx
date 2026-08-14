import React from 'react';
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

function CRMContent() {
  const { viewMode } = useLeads();

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Top Navbar */}
      <Navbar />

      {/* KPI Metrics Summary Bar */}
      <MetricsBar />

      {/* Filter and Search Bar (Active on Kanban and Table views) */}
      {viewMode !== 'analytics' && <FilterToolbar />}

      {/* Dynamic View Panel */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {viewMode === 'kanban' && <KanbanBoard />}
        {viewMode === 'table' && <LeadsTableView />}
        {viewMode === 'analytics' && <AnalyticsView />}
      </main>

      {/* Slide-over Drawer for Lead Inspection */}
      <LeadDetailDrawer />

      {/* Modals */}
      <AddLeadModal />
      <LostReasonModal />

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
