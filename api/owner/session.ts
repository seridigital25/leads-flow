import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isOwnerAuthenticated } from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  res.status(200).json({ authenticated: isOwnerAuthenticated(req) });
}
