import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('gd_session')?.value;

  // 1. Protect Student Dashboard & Formations
  if (pathname.startsWith('/dashboard/eleve') || pathname.startsWith('/formation/')) {
    const session = await verifySession(token);
    if (!session) {
      const redirectUrl = new URL('/mon-compte', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(redirectUrl);
      response.cookies.delete('gd_session');
      return response;
    }
  }

  // 2. Protect Admin Dashboard
  if (pathname.startsWith('/dashboard/admin')) {
    const session = await verifySession(token);
    if (!session || session.role !== 'superadmin') {
      const redirectUrl = new URL('/mon-compte', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      redirectUrl.searchParams.set('admin', 'true');
      const response = NextResponse.redirect(redirectUrl);
      if (!session) {
        response.cookies.delete('gd_session');
      }
      return response;
    }
  }

  // 3. Protect Trainer Dashboard
  if (pathname.startsWith('/dashboard/formateur')) {
    const session = await verifySession(token);
    if (!session || (session.role !== 'superadmin' && session.role !== 'formateur')) {
      const redirectUrl = new URL('/mon-compte', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(redirectUrl);
      if (!session) {
        response.cookies.delete('gd_session');
      }
      return response;
    }
  }

  // 4. Redirect already logged-in users away from /mon-compte if they visit it without explicit params
  if (pathname === '/mon-compte' && !request.nextUrl.searchParams.get('logout')) {
    const session = await verifySession(token);
    if (session) {
      const redirect = request.nextUrl.searchParams.get('redirect');
      if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
        return NextResponse.redirect(new URL(redirect, request.url));
      }
      if (session.role === 'superadmin') {
        return NextResponse.redirect(new URL('/dashboard/admin', request.url));
      } else if (session.role === 'formateur') {
        return NextResponse.redirect(new URL('/dashboard/formateur', request.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard/eleve', request.url));
      }
    }
  }

  // 5. Route every direct PDF request through the ownership-checked API.
  if (pathname.startsWith('/downloads/') && pathname.endsWith('.pdf')) {
    if (!token) {
      const loginUrl = new URL('/mon-compte', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const secureDownloadUrl = new URL('/api/download', request.url);
    secureDownloadUrl.searchParams.set('file', pathname.split('/').pop() || '');
    return NextResponse.redirect(secureDownloadUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/eleve/:path*',
    '/dashboard/eleve',
    '/formation/:path*',
    '/dashboard/admin/:path*',
    '/dashboard/admin',
    '/dashboard/formateur/:path*',
    '/dashboard/formateur',
    '/mon-compte',
    '/downloads/:path*'
  ]
};
