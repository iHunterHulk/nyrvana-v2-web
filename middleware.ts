import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware to protect routes
export function middleware(request: NextRequest) {
  // Skip middleware for auth routes, Next.js internals, and API routes
  if (
    request.nextUrl.pathname.startsWith('/auth/') ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/api/')
  ) {
    return NextResponse.next();
  }

  // Check for refresh token cookie
  const refreshToken = request.cookies.get('nv-refresh');
  
  // If no refresh token, redirect to login
  if (!refreshToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Continue with the request
  return NextResponse.next();
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};