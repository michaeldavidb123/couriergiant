import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAdminTokenValid } from '@/lib/admin-token';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const raw = request.cookies.get('couriergiant_admin_token')?.value;
  const token = raw ? decodeURIComponent(raw) : undefined;
  const validToken = isAdminTokenValid(token);
  const isLogin = pathname === '/admin/login';

  if (pathname.startsWith('/admin') && !isLogin && !validToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (isLogin && validToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
