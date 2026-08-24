import type { Lead } from '../../src/types';

export interface LeadRow {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  stage: string;
  priority: string;
  source: string;
  deal_value: string | number;
  notes: string;
  interest_type: string | null;
  bant: Lead['bant'];
  activities: Lead['activities'];
  quotations: Lead['quotations'];
  invoices: Lead['invoices'];
  lost_reason: string | null;
  next_follow_up_date: string | null;
  assigned_to: string;
  created_at: string;
  updated_at: string;
}

export function rowToLead(row: LeadRow): Lead {
  return {
    id: row.id,
    name: row.name,
    company: row.company,
    phone: row.phone,
    email: row.email,
    stage: row.stage as Lead['stage'],
    priority: row.priority as Lead['priority'],
    source: row.source,
    dealValue: Number(row.deal_value) || 0,
    notes: row.notes,
    bant: row.bant,
    activities: row.activities,
    quotations: row.quotations,
    invoices: row.invoices,
    lostReason: row.lost_reason || undefined,
    nextFollowUpDate: row.next_follow_up_date || undefined,
    assignedTo: row.assigned_to,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
