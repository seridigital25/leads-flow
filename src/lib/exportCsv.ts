import { Lead } from '../types';
import { logAuditEvent } from './audit';

/**
 * Escape a single CSV cell per RFC 4180:
 * - Wrap in double quotes if it contains commas, quotes, newlines, or leading/trailing spaces.
 * - Double up any embedded double quotes.
 */
export function escapeCsvCell(value: string | number | null | undefined): string {
  const str = value === null || value === undefined ? '' : String(value);
  if (/[",\r\n]/.test(str) || str !== str.trim()) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export const CSV_COLUMNS = [
  'name',
  'phone',
  'email',
  'organization',
  'stage',
  'priority',
  'estimated_value',
  'source',
  'created_at',
  'next_follow_up',
] as const;

/**
 * Build a full CSV document (with header row) from a list of leads.
 */
export function leadsToCsv(leads: Lead[]): string {
  const header = CSV_COLUMNS.join(',');
  const rows = leads.map((lead) => {
    const cells = [
      lead.name,
      lead.phone,
      lead.email,
      lead.company,
      lead.stage,
      lead.priority,
      lead.dealValue,
      lead.source,
      lead.createdAt,
      lead.nextFollowUpDate ?? '',
    ];
    return cells.map(escapeCsvCell).join(',');
  });
  return [header, ...rows].join('\r\n');
}

/**
 * Generate the export filename: leadflow-export-YYYY-MM-DD.csv
 */
export function csvFilename(): string {
  const today = new Date().toISOString().split('T')[0];
  return `leadflow-export-${today}.csv`;
}

/**
 * Trigger a browser download of the CSV file and log an audit event.
 * Returns the generated CSV content (useful for tests / verification).
 */
export function downloadLeadsCsv(leads: Lead[], actor: string): string {
  const csv = leadsToCsv(leads);
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.setAttribute('href', url);
  anchor.setAttribute('download', csvFilename());
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);

  logAuditEvent({
    action: 'export_csv',
    actor,
    details: `Exported ${leads.length} leads to CSV (${csvFilename()}).`,
  });

  return csv;
}
