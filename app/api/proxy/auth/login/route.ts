import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiBase } from '@/lib/auth/proxy-base';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const upstreamResponse = await fetch(`${apiBase}/api/v2/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (upstreamResponse.ok) {
      const data = await upstreamResponse.json();
      const refreshToken = data.refreshToken;
      
      // Set refresh token cookie
      (await cookies()).set('nv-refresh', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
      
      // Return access token
      return NextResponse.json({ accessToken: data.accessToken });
    } else {
      // Return upstream error
      const errorData = await upstreamResponse.json();
      return NextResponse.json(
        { error: errorData.error },
        { status: upstreamResponse.status }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}