import { useEffect, useState } from 'react';
import { OwnerLeadProvider } from '../context/OwnerLeadContext';
import CRMShell from '../components/CRMShell';
import OwnerLogin from '../components/OwnerLogin';
import { ownerApi } from '../lib/ownerApi';

export default function Owner() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    document.title = 'Owner Login — LeadFlow CRM';
    ownerApi
      .checkSession()
      .then((res) => setAuthenticated(res.authenticated))
      .catch(() => setAuthenticated(false))
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 text-sm font-semibold">
        Checking session…
      </div>
    );
  }

  if (!authenticated) {
    return <OwnerLogin onLoginSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <OwnerLeadProvider onSignedOut={() => setAuthenticated(false)}>
      <CRMShell />
    </OwnerLeadProvider>
  );
}
