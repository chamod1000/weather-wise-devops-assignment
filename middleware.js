import { NextResponse } from 'next/server';
import * as jose from 'jose';

// Use Jose library for Edge Runtime compatibility
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin')) {
    // Allow access to admin login page without authentication
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    const token = request.cookies.get('token')?.value;

    if (!token) {
      console.log('[Middleware] No token found for:', pathname);
      // Redirect to admin login if no token
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      // Use jose library for Edge Runtime compatibility
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jose.jwtVerify(token, secret);
      
      console.log('[Middleware] Token decoded:', { role: payload.role, email: payload.email, pathname });
      
      // Check if user has admin role in token
      if (payload.role !== 'admin') {
        console.log('[Middleware] User is not admin, redirecting');
        // Redirect non-admin users to admin login
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }

      // Allow admin users to proceed
      return NextResponse.next();
    } catch (error) {
      console.log('[Middleware] Token verification failed:', error.message, 'for pathname:', pathname);
      // Invalid token, redirect to admin login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
