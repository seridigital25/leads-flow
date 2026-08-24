import jwt from 'jsonwebtoken';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const COOKIE_NAME = 'leadflow_owner_session';
const SESSION_DAYS = 7;

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return secret;
}

function isProd(): boolean {
  return process.env.VERCEL_ENV === 'production';
}

export function issueSessionCookie(res: VercelResponse): void {
  const token = jwt.sign({ role: 'owner' }, getSecret(), { expiresIn: `${SESSION_DAYS}d` });
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${isProd() ? '; Secure' : ''}`
  );
}

export function clearSessionCookie(res: VercelResponse): void {
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${isProd() ? '; Secure' : ''}`
  );
}

function parseCookies(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  header.split(';').forEach((pair) => {
    const idx = pair.indexOf('=');
    if (idx === -1) return;
    const key = pair.slice(0, idx).trim();
    const value = pair.slice(idx + 1).trim();
    out[key] = decodeURIComponent(value);
  });
  return out;
}

export function isOwnerAuthenticated(req: VercelRequest): boolean {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[COOKIE_NAME];
  if (!token) return false;
  try {
    const payload = jwt.verify(token, getSecret());
    return typeof payload === 'object' && payload !== null && (payload as { role?: string }).role === 'owner';
  } catch {
    return false;
  }
}

export function requireOwner(req: VercelRequest, res: VercelResponse): boolean {
  if (!isOwnerAuthenticated(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}
