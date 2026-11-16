import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib/db.js';
import { requireOwner } from './_lib/auth.js';
import type { AuditEvent } from '../src/types';

interface AuditRow {
  id: string;
  action: string;
  actor: string;
  target_id: string | null;
  target_name: string | null;
  details: string | null;
  created_at: string | Date;
}

function rowToEvent(row: AuditRow): AuditEvent {
  return {
    id: row.id,
    action: row.action as AuditEvent['action'],
    actor: row.actor,
    targetId: row.target_id ?? undefined,
    targetName: row.target_name ?? undefined,
    details: row.details ?? undefined,
    timestamp: new Date(row.created_at).toISOString(),
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireOwner(req, res)) return;

  if (req.method === 'GET') {
    const rows = (await sql`SELECT * FROM audit_events ORDER BY created_at DESC LIMIT 500`) as AuditRow[];
    res.status(200).json(rows.map(rowToEvent));
    return;
  }

  if (req.method === 'POST') {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const id = typeof body.id === 'string' && body.id.trim() ? body.id.trim().slice(0, 100) : `audit-${Date.now()}`;
    const action = typeof body.action === 'string' ? body.action.trim().slice(0, 50) : '';
    const actor = typeof body.actor === 'string' ? body.actor.trim().slice(0, 100) : 'unknown';
    const targetId = typeof body.targetId === 'string' ? body.targetId.slice(0, 100) : null;
    const targetName = typeof body.targetName === 'string' ? body.targetName.slice(0, 200) : null;
    const details = typeof body.details === 'string' ? body.details.slice(0, 1000) : null;
    const timestamp = typeof body.timestamp === 'string' && !isNaN(Date.parse(body.timestamp)) ? body.timestamp : new Date().toISOString();

    if (!action) {
      res.status(400).json({ error: 'action is required' });
      return;
    }

    const rows = (await sql`
      INSERT INTO audit_events (id, action, actor, target_id, target_name, details, created_at)
      VALUES (${id}, ${action}, ${actor}, ${targetId}, ${targetName}, ${details}, ${timestamp})
      ON CONFLICT (id) DO NOTHING
      RETURNING *
    `) as AuditRow[];

    if (rows.length === 0) {
      // Already stored (idempotent retry) — return the canonical stored row.
      const existing = (await sql`SELECT * FROM audit_events WHERE id = ${id}`) as AuditRow[];
      res.status(200).json(rowToEvent(existing[0]));
      return;
    }

    res.status(201).json(rowToEvent(rows[0]));
    return;
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).json({ error: 'Method not allowed' });
}
