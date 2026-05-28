import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiBase } from '@/lib/auth/proxy-base';

export async function POST(request: Request) {
  try {
    // Get refresh token from cookie
    const refreshToken = (await cookies()).get('nv-refresh')?.value;
    
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token' },
        { status: 401 }
      );
    }
    
    // Get access token from Authorization header
    const authHeader = request.headers.get('authorization');
    const accessToken = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;
    
    // Call upstream logout endpoint
    await fetch(`${apiBase}/api/v2/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ refreshToken }),
    });
    
    // Clear the refresh token cookie
    (await cookies()).delete('nv-refresh');
    
    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear the cookie even if upstream fails
    (await cookies()).delete('nv-refresh');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}