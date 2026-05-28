import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiBase } from '@/lib/auth/proxy-base';

// Catch-all proxy for all NON-AUTH requests
export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;
  const path = pathSegments.join('/');
  const url = new URL(request.url);
  const searchParams = url.searchParams.toString();
  const upstreamUrl = `${apiBase}/api/v2/${path}${searchParams ? `?${searchParams}` : ''}`;
  
  // Get the access token from cookie and refresh if needed
  const refreshToken = (await cookies()).get('nv-refresh')?.value;
  let accessToken = null;
  
  if (refreshToken) {
    try {
      const refreshResponse = await fetch(`${apiBase}/api/v2/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        accessToken = refreshData.accessToken;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
    }
  }
  
  // Forward the request to the upstream API
  const upstreamResponse = await fetch(upstreamUrl, {
    method: request.method,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
      ...Object.fromEntries(request.headers.entries()),
    },
    body: request.body,
  });
  
  // Stream response body through unchanged (preserves SSE)
  return new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: {
      'Content-Type': upstreamResponse.headers.get('Content-Type') || 'application/json',
    },
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return GET(request, { params });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return GET(request, { params });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return GET(request, { params });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return GET(request, { params });
}