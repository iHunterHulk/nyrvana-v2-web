import type { ReactNode } from 'react';

export type BlockSize = 'sm' | 'md' | 'lg' | 'xl';

export interface BlockManifest {
  id: string;
  adapterId: string;
  op: string;
  title: string;
  description: string;
  defaultSize: BlockSize;
  refreshIntervalMs?: number;
}

export interface ServerFetchCtx {
  // Wraps lib/auth/server-fetch.ts; pre-bound Authorization.
  // For PR 6 just type it as a function; later PRs flesh out.
  fetch: (path: string, init?: RequestInit) => Promise<Response>;
}

export interface BlockProps<TData> {
  data: TData;
  refresh: () => Promise<void>;
  size: BlockSize;
}

export type BlockComponent<TData> = (props: BlockProps<TData>) => ReactNode;
export type BlockLoading = () => ReactNode;
export type BlockError = (props: { error: Error; refresh: () => Promise<void> }) => ReactNode;

export interface Block<TData> {
  manifest: BlockManifest;
  Component: BlockComponent<TData>;
  Loading: BlockLoading;
  Error: BlockError;
  fetcher: (ctx: ServerFetchCtx) => Promise<TData>;
}