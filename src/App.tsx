import { lazy, Suspense } from 'react';
import { LeadProvider } from './context/LeadContext';

// Route-level code splitting: each page is loaded on demand
const Landing = lazy(() => import('./pages/Landing'));
const Owner = lazy(() => import('./pages/Owner'));
const CRMShell = lazy(() => import('./components/CRMShell'));

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
      {pathname.startsWith('/owner') && <Owner />}

      {pathname.startsWith('/demo') && (
        <LeadProvider>
          <CRMShell />
        </LeadProvider>
      )}

      {!pathname.startsWith('/owner') && !pathname.startsWith('/demo') && <Landing />}
    </Suspense>
  );
}
