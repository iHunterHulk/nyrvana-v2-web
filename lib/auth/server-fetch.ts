import { cookies } from 'next/headers';
import { apiBase } from '@/lib/auth/proxy-base';

// Server-side fetch helper for Server Components
export async function serverFetch(path: string, init?: RequestInit) {
  // Get refresh token from cookie
  const refreshToken = (await cookies()).get('nv-refresh')?.value;
  
  if (!refreshToken) {
    throw new Error('No refresh token found');
  }
  
  // Check if we have a cached access token for this refresh token
  const tokenCache = (globalThis as any)[Symbol.for('nv.access-token')] || new Map();
  let accessToken = tokenCache.get(refreshToken);
  
  // If no cached access token, refresh it
  if (!accessToken) {
    try {
      const refreshResponse = await fetch(`${apiBase}/api/v2/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      
      if (!refreshResponse.ok) {
        throw new Error('Failed to refresh access token');
      }
      
      const refreshData = await refreshResponse.json();
      accessToken = refreshData.accessToken;
      
      // Cache the access token for this refresh token
      tokenCache.set(refreshToken, accessToken);
      (globalThis as any)[Symbol.for('nv.access-token')] = tokenCache;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }
  
  // Make the actual request with the access token
  const url = path.startsWith('/') ? `${apiBase}/api/v2${path}` : `${apiBase}/api/v2/${path}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      ...init?.headers,
    },
  });
  
  return response;
}