import React, { useState } from 'react';
import {
  PRIVACY_NOTICE_VERSION,
  PRIVACY_NOTICE_LAST_UPDATED,
  PRIVACY_NOTICE_SECTIONS,
  getConsentTimestamp,
  recordConsent,
  getStoredNoticeVersion,
} from '../lib/privacy';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../lib/utils';

export default function PrivacyNotice({ onAcknowledge }: { onAcknowledge?: () => void }) {
  const [consentedAt, setConsentedAt] = useState<string | null>(getConsentTimestamp());
  const [consentedVersion, setConsentedVersion] = useState<string | null>(getStoredNoticeVersion());
  const [justAcknowledged, setJustAcknowledged] = useState(false);

  const isCurrent = consentedVersion === PRIVACY_NOTICE_VERSION && consentedAt;

  const handleAcknowledge = () => {
    recordConsent();
    setConsentedAt(new Date().toISOString());
    setConsentedVersion(PRIVACY_NOTICE_VERSION);
    setJustAcknowledged(true);
    onAcknowledge?.();
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-zinc-100/60 dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs p-5">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 shrink-0">
              <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">Privacy Notice</h2>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Version {PRIVACY_NOTICE_VERSION} · Last updated {PRIVACY_NOTICE_LAST_UPDATED}
              </p>
              {isCurrent ? (
                <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>You acknowledged this version on {formatDate(consentedAt)}</span>
                </div>
              ) : (
                <p className="mt-2 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                  {consentedAt
                    ? `You acknowledged v${consentedVersion} on ${formatDate(consentedAt)} — this version is newer.`
                    : 'You have not acknowledged this notice yet.'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs divide-y divide-zinc-100 dark:divide-zinc-800/60">
          {PRIVACY_NOTICE_SECTIONS.map((section) => (
            <div key={section.title} className="p-4 sm:p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">
                {section.title}
              </h3>
              <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">{section.body}</p>
            </div>
          ))}
        </div>

        {/* Acknowledge */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Acknowledging records a timestamp in your browser preferences. It is not required to use the CRM.
          </p>
          <button
            onClick={handleAcknowledge}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-md transition-colors shadow-xs cursor-pointer shrink-0 ${
              isCurrent && justAcknowledged
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200'
            }`}
          >
            {isCurrent ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            <span>{isCurrent ? 'Acknowledged' : 'Acknowledge Notice'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
