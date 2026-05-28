import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiBase } from '@/lib/auth/proxy-base';

export async function POST() {
  try {
    // Get refresh token from cookie
    const refreshToken = (await cookies()).get('nv-refresh')?.value;
    
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token' },
        { status: 401 }
      );
    }
    
    // Call upstream refresh endpoint
    const upstreamResponse = await fetch(`${apiBase}/api/v2/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
    
    if (upstreamResponse.ok) {
      const data = await upstreamResponse.json();
      
      // Rotate the cookie with new refresh token
      (await cookies()).set('nv-refresh', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
      
      // Return new access token
      return NextResponse.json({ accessToken: data.accessToken });
    } else {
      // Clear cookie on failure
      (await cookies()).delete('nv-refresh');
      return NextResponse.json(
        { error: 'Refresh failed' },
        { status: upstreamResponse.status }
      );
    }
  } catch (error) {
    console.error('Refresh error:', error);
    // Clear cookie on error
    (await cookies()).delete('nv-refresh');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}