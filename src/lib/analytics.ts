/**
 * Centralized analytics tracking (Plausible — privacy-friendly, cookieless).
 *
 * - Pageview tracking is initialized in src/main.tsx via initAnalytics().
 * - Custom events are dispatched via track* helpers below from contexts/components.
 * - No-op when disabled so local/dev usage never sends data.
 */
import Plausible from 'plausible-tracker';

const SITE_URL = 'https://myleads-flow.vercel.app';

// Only track on the production deployment. Local/dev stays silent.
const enabled =
  typeof window !== 'undefined' &&
  window.location.hostname === 'myleads-flow.vercel.app';

export const plausible = Plausible({
  domain: 'myleads-flow.vercel.app',
  apiHost: 'https://plausible.io',
  trackLocalhost: false,
});

let initialized = false;

/** Call once at app startup (src/main.tsx) to enable automatic pageview tracking. */
export function initAnalytics(): void {
  if (!enabled || initialized) return;
  plausible.trackPageview({ url: SITE_URL });
  initialized = true;
}

/** Generic event wrapper — always safe to call, no-ops when analytics is disabled. */
function track(eventName: string, props?: Record<string, string | number | boolean>): void {
  if (!enabled) return;
  try {
    plausible.trackEvent(eventName, { props: props ?? {} });
  } catch {
    // Analytics must never break app functionality.
  }
}

// ---------------------------------------------------------------------------
// Domain events (Fasa 3 spec)
// ---------------------------------------------------------------------------

/** Fired when a lead is created (demo mode or owner mode). */
export function trackLeadCreated(props: {
  mode: 'demo' | 'owner';
  source?: string;
  stage?: string;
  dealValue?: number;
}): void {
  track('lead_created', {
    mode: props.mode,
    source: props.source || 'unknown',
    stage: props.stage || 'new',
    deal_value: props.dealValue ?? 0,
  });
}

/** Fired when a lead moves between pipeline stages (incl. closed lost). */
export function trackStageChanged(props: {
  mode: 'demo' | 'owner';
  from: string;
  to: string;
  dealValue?: number;
}): void {
  track('stage_changed', {
    mode: props.mode,
    from_stage: props.from,
    to_stage: props.to,
    deal_value: props.dealValue ?? 0,
  });
}

/** Fired when the user exports data (CSV or JSON). */
export function trackExport(props: {
  format: 'csv' | 'json';
  mode: 'demo' | 'owner';
  count: number;
}): void {
  track('export_csv', {
    format: props.format,
    mode: props.mode,
    row_count: props.count,
  });
}

/** Fired when the Request Demo modal is opened or successfully submitted. */
export function trackDemoRequested(props: {
  action: 'opened' | 'submitted';
  interestType?: string;
}): void {
  track('demo_requested', {
    action: props.action,
    interest_type: props.interestType || 'try_demo',
  });
}
