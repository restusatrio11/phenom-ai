import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('user_session');
  const isPublic = request.nextUrl.pathname === '/login' || request.nextUrl.pathname.startsWith('/api/auth');

  if (!session && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/riwayat', '/analisis/:path*'],
};
