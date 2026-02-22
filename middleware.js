import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin')) {
    // Allow access to admin login page without authentication
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    const token = request.cookies.get('token')?.value;

    if (!token) {
      // Redirect to admin login if no token
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Check if user has admin role in token
      if (decoded.role !== 'admin') {
        // Redirect non-admin users to admin login
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }

      // Allow admin users to proceed
      return NextResponse.next();
    } catch (error) {
      // Invalid token, redirect to admin login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
