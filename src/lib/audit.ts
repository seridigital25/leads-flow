import { AuditAction, AuditEvent } from '../types';

const AUDIT_STORAGE_KEY = 'leadflow_crm_audit_events_v1';
const MAX_AUDIT_EVENTS = 500;

/**
 * Read all audit events from localStorage (demo) — newest first.
 */
export function readAuditEvents(): AuditEvent[] {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AuditEvent[]) : [];
  } catch (e) {
    console.error('Error reading audit events', e);
    return [];
  }
}

/**
 * Persist audit events to localStorage (demo) — kept newest-first, capped.
 */
function writeAuditEvents(events: AuditEvent[]): void {
  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(events.slice(0, MAX_AUDIT_EVENTS)));
  } catch (e) {
    console.error('Error saving audit events', e);
  }
}

/**
 * Log a single audit action. Events are stored newest-first and capped
 * at MAX_AUDIT_EVENTS entries.
 */
export function logAuditEvent(event: {
  action: AuditAction;
  actor: string;
  targetId?: string;
  targetName?: string;
  details?: string;
}): AuditEvent {
  const full: AuditEvent = {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    ...event,
  };

  const events = readAuditEvents();
  writeAuditEvents([full, ...events]);
  return full;
}

/**
 * Clear the audit log (owner action from the Audit page).
 */
export function clearAuditStorage(): void {
  localStorage.removeItem(AUDIT_STORAGE_KEY);
}

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  lead_created: 'Lead created',
  lead_updated: 'Lead updated',
  lead_deleted: 'Lead deleted',
  lead_stage_changed: 'Stage changed',
  lead_lost: 'Lead marked lost',
  export_csv: 'CSV export',
  export_json: 'JSON export',
  demo_reset: 'Demo data reset',
};
