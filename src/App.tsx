import { LeadProvider } from './context/LeadContext';
import Landing from './pages/Landing';
import Owner from './pages/Owner';
import CRMShell from './components/CRMShell';

export default function App() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';

  if (pathname.startsWith('/owner')) {
    return <Owner />;
  }

  if (pathname.startsWith('/demo')) {
    return (
      <LeadProvider>
        <CRMShell />
      </LeadProvider>
    );
  }

  return <Landing />;
}
