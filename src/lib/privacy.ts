import React from 'react';

export const PRIVACY_NOTICE_VERSION = '1.0.0';
export const PRIVACY_VERSION_KEY = 'leadflow_privacy_notice_version';
export const PRIVACY_CONSENT_KEY = 'leadflow_privacy_consent_timestamp';

export const PRIVACY_NOTICE_LAST_UPDATED = '16 November 2026';

export const PRIVACY_NOTICE_SECTIONS: { title: string; body: string }[] = [
  {
    title: 'What we collect',
    body: 'LeadFlow CRM stores the lead information you enter: name, phone number, email address, company, deal value, notes, and activity history. In demo mode this stays in your browser (localStorage). In owner mode it is stored in our Neon Postgres database.',
  },
  {
    title: 'How we use it',
    body: 'Your data is used only to run your sales pipeline: tracking deals, follow-ups, quotations, and invoices. We do not sell or share your data with third parties. Analytics (Plausible) is cookieless and aggregates page views and feature usage only — never lead contents.',
  },
  {
    title: 'Where it is stored',
    body: 'Demo data never leaves your browser. Owner data is stored in a single-tenant Neon Postgres database protected by owner-only authentication. Exports (CSV/JSON) are generated locally in your browser.',
  },
  {
    title: 'Your rights',
    body: 'You can export all lead data at any time (CSV/JSON export), and delete individual leads or the entire dataset. Contact the developer to request full data deletion from the owner database.',
  },
  {
    title: 'Changes to this notice',
    body: 'When this notice is updated you will see a re-consent banner. You can dismiss it and keep working — consenting again simply records the updated timestamp.',
  },
];

export function getStoredNoticeVersion(): string | null {
  try {
    return localStorage.getItem(PRIVACY_VERSION_KEY);
  } catch {
    return null;
  }
}

export function getConsentTimestamp(): string | null {
  try {
    return localStorage.getItem(PRIVACY_CONSENT_KEY);
  } catch {
    return null;
  }
}

/** True when the current notice version has never been consented to (or no consent recorded yet). */
export function needsReconsent(): boolean {
  return getStoredNoticeVersion() !== PRIVACY_NOTICE_VERSION;
}

/** Record consent to the current notice version. */
export function recordConsent(): void {
  try {
    localStorage.setItem(PRIVACY_VERSION_KEY, PRIVACY_NOTICE_VERSION);
    localStorage.setItem(PRIVACY_CONSENT_KEY, new Date().toISOString());
  } catch (e) {
    console.error('Error saving privacy consent', e);
  }
}
