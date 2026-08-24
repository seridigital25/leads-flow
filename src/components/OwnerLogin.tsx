import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import BrandLogo from './common/BrandLogo';
import { ownerApi } from '../lib/ownerApi';

export default function OwnerLogin({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await ownerApi.login(password);
      onLoginSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-5">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <BrandLogo size="lg" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xl"
        >
          <h1 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">Owner Login</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Akses peribadi untuk urus leads sebenar LeadFlow CRM.
          </p>

          <label htmlFor="owner-password" className="sr-only">
            Password
          </label>
          <div className="mt-5 relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              id="owner-password"
              type="password"
              autoComplete="current-password"
              autoFocus
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full min-h-[44px] pl-9 pr-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {error && <p className="mt-3 text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-bold text-sm transition-colors cursor-pointer"
          >
            {submitting ? 'Checking…' : 'Log In'}
            {!submitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
