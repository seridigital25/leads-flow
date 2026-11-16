import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set. Run with: node --env-file=.env.local scripts/setup-db.mjs');
  process.exit(1);
}

const sql = neon(databaseUrl);

await sql`
  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    stage TEXT NOT NULL DEFAULT 'new',
    priority TEXT NOT NULL DEFAULT 'medium',
    source TEXT NOT NULL DEFAULT 'Request Demo Form',
    deal_value NUMERIC NOT NULL DEFAULT 0,
    notes TEXT NOT NULL DEFAULT '',
    interest_type TEXT,
    bant JSONB NOT NULL DEFAULT '{"budget":false,"authority":false,"need":true,"timeline":false}',
    activities JSONB NOT NULL DEFAULT '[]',
    quotations JSONB NOT NULL DEFAULT '[]',
    invoices JSONB NOT NULL DEFAULT '[]',
    lost_reason TEXT,
    next_follow_up_date DATE,
    assigned_to TEXT NOT NULL DEFAULT 'Sharil (Owner)',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

await sql`CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC)`;
await sql`CREATE INDEX IF NOT EXISTS leads_stage_idx ON leads (stage)`;

await sql`
  CREATE TABLE IF NOT EXISTS audit_events (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    actor TEXT NOT NULL DEFAULT 'unknown',
    target_id TEXT,
    target_name TEXT,
    details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

await sql`CREATE INDEX IF NOT EXISTS audit_events_created_at_idx ON audit_events (created_at DESC)`;

console.log('leads and audit_events tables ready.');
