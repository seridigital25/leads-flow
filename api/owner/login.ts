import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { issueSessionCookie } from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const hash = process.env.OWNER_PASSWORD_HASH;
  if (!hash) {
    res.status(500).json({ error: 'Owner login is not configured' });
    return;
  }

  const body = (req.body ?? {}) as Record<string, unknown>;
  const password = typeof body.password === 'string' ? body.password : '';

  if (!password || !bcrypt.compareSync(password, hash)) {
    res.status(401).json({ error: 'Invalid password' });
    return;
  }

  issueSessionCookie(res);
  res.status(200).json({ authenticated: true });
}
