import { env } from 'process';

export const apiBase = env.NYRVANA_API_BASE ?? 'http://localhost:3002';