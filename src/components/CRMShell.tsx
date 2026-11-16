import { useEffect, useState, lazy, Suspense } from 'react';
import { useLeads } from '../context/LeadContext';
import Navbar from './layout/Navbar';
import MetricsBar from './layout/MetricsBar';
import FilterToolbar from './layout/FilterToolbar';
import KanbanBoard from './kanban/KanbanBoard';
import LeadsTableView from './table/LeadsTableView';
import LeadDetailDrawer from './drawer/LeadDetailDrawer';
import AddLeadModal from './modals/AddLeadModal';
import LostReasonModal from './modals/LostReasonModal';
import Toast from './common/Toast';
import PocContactBanner from './common/PocContactBanner';
import RequestDemoModal from './modals/RequestDemoModal';
import PrivacyBanner from './PrivacyBanner';

// Heavy views loaded on demand — only fetched when the user opens the tab
const AnalyticsView = lazy(() => import('./analytics/AnalyticsView'));
const Reports = lazy(() => import('../pages/Reports'));
const Contacts = lazy(() => import('../pages/Contacts'));
const LeadSources = lazy(() => import('../pages/LeadSources'));
const AuditLog = lazy(() => import('../pages/AuditLog'));
const PrivacyNotice = lazy(() => import('../pages/PrivacyNotice'));

function ViewFallback() {
  return (
    <div className="flex-1 flex items-center justify-center text-zinc-400 dark:text-zinc-500 text-sm font-semibold">
      Loading view…
    </div>
  );
}


export default function CRMShell() {
  const { mode, loading, viewMode, selectedLead, setViewMode } = useLeads();
  const brandSuffix = mode === 'owner' ? 'LeadFlow Owner CRM' : 'LeadFlow CRM Malaysia';
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  useEffect(() => {
    if (selectedLead) {
      document.title = `${selectedLead.name} (${selectedLead.company}) — ${brandSuffix}`;
    } else if (viewMode === 'kanban') {
      document.title = `Kanban Sales Pipeline — ${brandSuffix}`;
    } else if (viewMode === 'table') {
      document.title = `Lead Table View — ${brandSuffix}`;
    } else if (viewMode === 'analytics') {
      document.title = `Funnel & Analytics — ${brandSuffix}`;
    } else if (viewMode === 'reports') {
      document.title = `Reports & Summary — ${brandSuffix}`;
    } else if (viewMode === 'contacts') {
      document.title = `Contacts — ${brandSuffix}`;
    } else if (viewMode === 'sources') {
      document.title = `Lead Sources — ${brandSuffix}`;
    } else if (viewMode === 'audit') {
      document.title = `Audit Trail — ${brandSuffix}`;
    } else if (viewMode === 'privacy') {
      document.title = `Privacy Notice — ${brandSuffix}`;
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
      {viewMode !== 'contacts' && viewMode !== 'sources' && viewMode !== 'audit' && <MetricsBar />}

      {/* Filter and Search Bar (Active on Kanban and Table views) */}
      {(viewMode === 'kanban' || viewMode === 'table') && <FilterToolbar />}

      {/* Dynamic View Panel */}
      <main className="flex-1 flex flex-col overflow-hidden relative" role="main" aria-label="CRM Workspace">
        {viewMode === 'kanban' && <KanbanBoard />}
        {viewMode === 'table' && <LeadsTableView />}
        {viewMode === 'analytics' && (
          <Suspense fallback={<ViewFallback />}>
            <AnalyticsView />
          </Suspense>
        )}
        {viewMode === 'reports' && (
          <Suspense fallback={<ViewFallback />}>
            <Reports />
          </Suspense>
        )}
        {viewMode === 'contacts' && (
          <Suspense fallback={<ViewFallback />}>
            <Contacts />
          </Suspense>
        )}
        {viewMode === 'sources' && (
          <Suspense fallback={<ViewFallback />}>
            <LeadSources />
          </Suspense>
        )}
        {viewMode === 'audit' && (
          <Suspense fallback={<ViewFallback />}>
            <AuditLog />
          </Suspense>
        )}
        {viewMode === 'privacy' && (
          <Suspense fallback={<ViewFallback />}>
            <PrivacyNotice />
          </Suspense>
        )}
      </main>

      {/* Slide-over Drawer for Lead Inspection */}
      <LeadDetailDrawer />

      {/* Modals */}
      <AddLeadModal />
      <LostReasonModal />

      {/* Privacy re-consent banner (banner-first, dismissible — not a hard gate) */}
      <PrivacyBanner onViewNotice={() => setViewMode('privacy')} />

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
