import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LeadProvider } from './context/LeadContext';

// Route-level code splitting: each page is loaded on demand
const Landing = lazy(() => import('./pages/Landing'));
const Owner = lazy(() => import('./pages/Owner'));
const CRMShell = lazy(() => import('./components/CRMShell'));
const QuotationPrintPage = lazy(() => import('./pages/Print/QuotationPrintPage'));

function RouteFallback() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 text-sm font-semibold">
      Loading…
    </div>
  );
}

export default function App() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';

  return (
    <Suspense fallback={<RouteFallback />}>
      <BrowserRouter>
        <Routes>
          <Route path="/owner" element={<Owner />} />
          <Route path="/print/quotation/:id" element={<QuotationPrintPage />} />
          <Route path="/print/invoice/:id" element={<QuotationPrintPage />} />
          <Route path="/demo" element={
            <LeadProvider>
              <CRMShell />
            </LeadProvider>
          } />
          <Route path="/" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}
