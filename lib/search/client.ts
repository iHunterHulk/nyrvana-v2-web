import { apiFetch } from '../auth/client';

export interface SearchRouted {
  results: unknown[];
  adapter: string;
  op: string;
}
export interface SearchNoRoute {
  results: [];
  reason: 'no-route';
}
export type SearchResponse = SearchRouted | SearchNoRoute;

export async function search(query: string, signal?: AbortSignal): Promise<SearchResponse> {
  const res = await apiFetch('/search', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query }),
    signal,
  });
  if (!res.ok) throw new Error(`search http ${res.status}`);
  return await res.json();
}