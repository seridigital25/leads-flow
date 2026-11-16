import React, { useEffect, useState } from 'react';
import { needsReconsent, recordConsent, PRIVACY_NOTICE_VERSION } from '../lib/privacy';
import { ShieldCheck, X } from 'lucide-react';

/**
 * Re-consent banner shown when the privacy notice has been updated (or never
 * consented to). Banner-first, not a hard gate: the owner can dismiss it and
 * keep working.
 */
export default function PrivacyBanner({ onViewNotice }: { onViewNotice?: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show only when consent is missing or outdated.
    setVisible(needsReconsent());
  }, []);

  if (!visible) return null;

  const handleAccept = () => {
    recordConsent();
    setVisible(false);
  };

  const handleDismiss = () => {
    // Banner-first, not a hard gate — dismiss without recording consent.
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Privacy notice update"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-fade-in"
    >
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 shrink-0">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Privacy notice updated</h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
              Our privacy notice (v{PRIVACY_NOTICE_VERSION}) has been published. Review it and acknowledge to stop seeing
              this banner — or dismiss and keep working.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleAccept}
                className="px-3 py-1.5 text-xs font-semibold rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer shadow-xs"
              >
                Review &amp; Acknowledge
              </button>
              {onViewNotice && (
                <button
                  onClick={() => {
                    onViewNotice();
                    handleAccept();
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
                >
                  Read notice
                </button>
              )}
              <button
                onClick={handleDismiss}
                title="Dismiss — you can keep working; this banner is not a blocker"
                className="ml-auto p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
