import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib/db.js';
import { rowToLead, type LeadRow } from './_lib/leadMapper.js';
import { isOwnerAuthenticated, requireOwner } from './_lib/auth.js';

const VALID_STAGES = new Set(['new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost']);
const VALID_PRIORITIES = new Set(['urgent', 'high', 'medium', 'low']);
const INTEREST_PRIORITY: Record<string, string> = {
  try_demo: 'medium',
  subscribe: 'high',
  custom_deal: 'urgent',
};
const INTEREST_LABEL: Record<string, string> = {
  try_demo: 'Nak cuba demo',
  subscribe: 'Nak subscribe pakej',
  custom_deal: 'Nak discuss custom deal',
};

function genId(): string {
  return `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    if (!requireOwner(req, res)) return;
    const rows = (await sql`SELECT * FROM leads ORDER BY created_at DESC`) as LeadRow[];
    res.status(200).json(rows.map(rowToLead));
    return;
  }

  if (req.method === 'POST') {
    const owner = isOwnerAuthenticated(req);
    const body = (req.body ?? {}) as Record<string, unknown>;

    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 200) : '';
    const company = typeof body.company === 'string' ? body.company.trim().slice(0, 200) : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim().slice(0, 50) : '';
    const email = typeof body.email === 'string' ? body.email.trim().slice(0, 200) : '';

    if (!name || (!phone && !email)) {
      res.status(400).json({ error: 'name and (phone or email) are required' });
      return;
    }

    const id = genId();
    const now = new Date().toISOString();

    if (owner) {
      // Trusted owner-created lead (e.g. manual "Add Lead" in the Owner CRM).
      const stage = typeof body.stage === 'string' && VALID_STAGES.has(body.stage) ? body.stage : 'new';
      const priority = typeof body.priority === 'string' && VALID_PRIORITIES.has(body.priority) ? body.priority : 'medium';
      const source = typeof body.source === 'string' && body.source.trim() ? body.source.trim().slice(0, 100) : 'Manual Entry';
      const dealValue = Number(body.dealValue) || 0;
      const notes = typeof body.notes === 'string' ? body.notes.slice(0, 2000) : '';
      const assignedTo = typeof body.assignedTo === 'string' && body.assignedTo.trim() ? body.assignedTo.trim().slice(0, 100) : 'Sharil (Owner)';
      const activities = [
        { id: `act-${Date.now()}`, type: 'note', author: 'System', content: `Lead created via ${source}.`, timestamp: now },
      ];

      const rows = (await sql`
        INSERT INTO leads (id, name, company, phone, email, stage, priority, source, deal_value, notes, assigned_to, activities, created_at, updated_at)
        VALUES (${id}, ${name}, ${company}, ${phone}, ${email}, ${stage}, ${priority}, ${source}, ${dealValue}, ${notes}, ${assignedTo}, ${JSON.stringify(activities)}, ${now}, ${now})
        RETURNING *
      `) as LeadRow[];

      res.status(201).json(rowToLead(rows[0]));
      return;
    }

    // Public Request Demo submission — server forces safe values, never trusts client for stage/value.
    const interestType = typeof body.interestType === 'string' && INTEREST_PRIORITY[body.interestType] ? body.interestType : 'try_demo';
    const message = typeof body.message === 'string' ? body.message.trim().slice(0, 1000) : '';
    const priority = INTEREST_PRIORITY[interestType];
    const notes = [`Minat: ${INTEREST_LABEL[interestType]}`, message].filter(Boolean).join('\n\n');
    const activities = [
      {
        id: `act-${Date.now()}`,
        type: 'note',
        author: 'System',
        content: `⚡ Request Demo form submitted (${INTEREST_LABEL[interestType]}).`,
        timestamp: now,
      },
    ];

    const rows = (await sql`
      INSERT INTO leads (id, name, company, phone, email, stage, priority, source, deal_value, notes, interest_type, assigned_to, activities, created_at, updated_at)
      VALUES (${id}, ${name}, ${company}, ${phone}, ${email}, 'new', ${priority}, 'Request Demo Form', 0, ${notes}, ${interestType}, 'Sharil (Owner)', ${JSON.stringify(activities)}, ${now}, ${now})
      RETURNING *
    `) as LeadRow[];

    res.status(201).json(rowToLead(rows[0]));
    return;
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).json({ error: 'Method not allowed' });
}
