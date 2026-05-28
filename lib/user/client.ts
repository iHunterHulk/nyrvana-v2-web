import { apiFetch } from '../auth/client';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export async function getCurrentUser(): Promise<User> {
  try {
    const res = await apiFetch('/auth/me');
    if (!res.ok) throw new Error(`me http ${res.status}`);
    return await res.json();
  } catch (error) {
    // If endpoint doesn't exist, return fallback user
    return { id: 'unknown', email: 'unknown', role: 'user' };
  }
}