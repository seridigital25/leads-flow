import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../_lib/db.js';
import { rowToLead, type LeadRow } from '../_lib/leadMapper.js';
import { requireOwner } from '../_lib/auth.js';

const VALID_STAGES = new Set(['new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost']);
const VALID_PRIORITIES = new Set(['urgent', 'high', 'medium', 'low']);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireOwner(req, res)) return;

  const { id } = req.query;
  const leadId = typeof id === 'string' ? id : '';
  if (!leadId) {
    res.status(400).json({ error: 'Missing lead id' });
    return;
  }

  if (req.method === 'DELETE') {
    await sql`DELETE FROM leads WHERE id = ${leadId}`;
    res.status(204).end();
    return;
  }

  if (req.method === 'PATCH') {
    const existingRows = (await sql`SELECT * FROM leads WHERE id = ${leadId}`) as LeadRow[];
    const existing = existingRows[0];
    if (!existing) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }

    const body = (req.body ?? {}) as Record<string, unknown>;
    const next = {
      name: typeof body.name === 'string' ? body.name.slice(0, 200) : existing.name,
      company: typeof body.company === 'string' ? body.company.slice(0, 200) : existing.company,
      phone: typeof body.phone === 'string' ? body.phone.slice(0, 50) : existing.phone,
      email: typeof body.email === 'string' ? body.email.slice(0, 200) : existing.email,
      stage: typeof body.stage === 'string' && VALID_STAGES.has(body.stage) ? body.stage : existing.stage,
      priority: typeof body.priority === 'string' && VALID_PRIORITIES.has(body.priority) ? body.priority : existing.priority,
      source: typeof body.source === 'string' ? body.source.slice(0, 100) : existing.source,
      dealValue: body.dealValue !== undefined ? Number(body.dealValue) || 0 : Number(existing.deal_value) || 0,
      notes: typeof body.notes === 'string' ? body.notes.slice(0, 2000) : existing.notes,
      bant: body.bant !== undefined ? body.bant : existing.bant,
      activities: body.activities !== undefined ? body.activities : existing.activities,
      quotations: body.quotations !== undefined ? body.quotations : existing.quotations,
      invoices: body.invoices !== undefined ? body.invoices : existing.invoices,
      lostReason: body.lostReason !== undefined ? (body.lostReason as string | null) : existing.lost_reason,
      nextFollowUpDate: body.nextFollowUpDate !== undefined ? (body.nextFollowUpDate as string | null) : existing.next_follow_up_date,
      assignedTo: typeof body.assignedTo === 'string' ? body.assignedTo.slice(0, 100) : existing.assigned_to,
    };

    const now = new Date().toISOString();
    const rows = (await sql`
      UPDATE leads SET
        name = ${next.name},
        company = ${next.company},
        phone = ${next.phone},
        email = ${next.email},
        stage = ${next.stage},
        priority = ${next.priority},
        source = ${next.source},
        deal_value = ${next.dealValue},
        notes = ${next.notes},
        bant = ${JSON.stringify(next.bant)},
        activities = ${JSON.stringify(next.activities)},
        quotations = ${JSON.stringify(next.quotations)},
        invoices = ${JSON.stringify(next.invoices)},
        lost_reason = ${next.lostReason},
        next_follow_up_date = ${next.nextFollowUpDate},
        assigned_to = ${next.assignedTo},
        updated_at = ${now}
      WHERE id = ${leadId}
      RETURNING *
    `) as LeadRow[];

    res.status(200).json(rowToLead(rows[0]));
    return;
  }

  res.setHeader('Allow', 'PATCH, DELETE');
  res.status(405).json({ error: 'Method not allowed' });
}
