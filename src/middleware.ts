import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('gd_session')?.value;

  // 1. Protect Student Dashboard
  if (pathname.startsWith('/dashboard/eleve')) {
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
    if (!session || (session.role !== 'superadmin' && session.role !== 'formateur')) {
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

  // 3. Redirect already logged-in users away from /mon-compte if they visit it without explicit params
  if (pathname === '/mon-compte' && !request.nextUrl.searchParams.get('logout')) {
    const session = await verifySession(token);
    if (session) {
      if (session.role === 'superadmin' || session.role === 'formateur') {
        return NextResponse.redirect(new URL('/dashboard/admin', request.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard/eleve', request.url));
      }
    }
  }

  // 4. Protect Direct Downloads from Hotlinking & Theft
  if (pathname.startsWith('/downloads/') && pathname.endsWith('.pdf')) {
    const session = await verifySession(token);
    if (!session) {
      const redirectUrl = new URL('/mon-compte', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/eleve/:path*',
    '/dashboard/eleve',
    '/dashboard/admin/:path*',
    '/dashboard/admin',
    '/mon-compte',
    '/downloads/:path*'
  ]
};
