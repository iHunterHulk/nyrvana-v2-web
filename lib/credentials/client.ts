import { apiFetch } from '../auth/client';

export async function getCredentials(adapter: string): Promise<Record<string, unknown> | null> {
  const res = await apiFetch(`/credentials/${adapter}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`credentials get http ${res.status}`);
  return await res.json();
}

export async function setCredentials(adapter: string, body: Record<string, unknown>): Promise<void> {
  const res = await apiFetch(`/credentials/${adapter}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`credentials put http ${res.status}`);
}

export async function deleteCredentials(adapter: string): Promise<void> {
  const res = await apiFetch(`/credentials/${adapter}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 404) throw new Error(`credentials delete http ${res.status}`);
}