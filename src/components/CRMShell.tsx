import { useEffect, useState } from 'react';
import { useLeads } from '../context/LeadContext';
import Navbar from './layout/Navbar';
import MetricsBar from './layout/MetricsBar';
import FilterToolbar from './layout/FilterToolbar';
import KanbanBoard from './kanban/KanbanBoard';
import LeadsTableView from './table/LeadsTableView';
import AnalyticsView from './analytics/AnalyticsView';
import LeadDetailDrawer from './drawer/LeadDetailDrawer';
import AddLeadModal from './modals/AddLeadModal';
import LostReasonModal from './modals/LostReasonModal';
import Toast from './common/Toast';
import PocContactBanner from './common/PocContactBanner';
import RequestDemoModal from './modals/RequestDemoModal';

export default function CRMShell() {
  const { mode, loading, viewMode, selectedLead } = useLeads();
  const brandSuffix = mode === 'owner' ? 'LeadFlow Owner CRM' : 'LeadFlow CRM Malaysia';
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  useEffect(() => {
    if (selectedLead) {
      document.title = `${selectedLead.name} (${selectedLead.company}) — ${brandSuffix}`;
    } else if (viewMode === 'kanban') {
      document.title = `Kanban Sales Pipeline — ${brandSuffix}`;
    } else if (viewMode === 'table') {
      document.title = `Senarai & Penapisan Prospek — ${brandSuffix}`;
    } else if (viewMode === 'analytics') {
      document.title = `Analisis Funnel Jualan — ${brandSuffix}`;
    }
  }, [viewMode, selectedLead, brandSuffix]);

  if (mode === 'owner' && loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 text-sm font-semibold">
        Loading your leads…
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Semantic Accessible Heading for SEO & Screen Readers */}
      <h1 className="sr-only">
        LeadFlow CRM Malaysia — Sistem Pengurusan Prospek &amp; WhatsApp Sales Pipeline
      </h1>

      {/* Top Navbar */}
      <Navbar onRequestDemo={mode === 'demo' ? () => setDemoModalOpen(true) : undefined} />

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

      {/* Floating POC Contact Developer Banner (demo mode only) */}
      {mode === 'demo' && <PocContactBanner onRequestDemo={() => setDemoModalOpen(true)} />}

      {/* Request Demo modal (demo mode only) */}
      {mode === 'demo' && (
        <RequestDemoModal open={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
      )}

      {/* Toast Notification Container */}
      <Toast />
    </div>
  );
}
