import { Lead } from '../types';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: 'include',
    headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
    ...init,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || `Request failed (${res.status})`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const ownerApi = {
  checkSession: () => request<{ authenticated: boolean }>('/api/owner/session'),
  login: (password: string) =>
    request<{ authenticated: boolean }>('/api/owner/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),
  logout: () => request<{ authenticated: boolean }>('/api/owner/logout', { method: 'POST' }),

  listLeads: () => request<Lead[]>('/api/leads'),
  createLead: (data: Partial<Lead>) =>
    request<Lead>('/api/leads', { method: 'POST', body: JSON.stringify(data) }),
  updateLead: (id: string, updates: Partial<Lead>) =>
    request<Lead>(`/api/leads/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
  deleteLead: (id: string) => request<void>(`/api/leads/${id}`, { method: 'DELETE' }),
};
