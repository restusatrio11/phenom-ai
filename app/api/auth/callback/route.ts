import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import ssoClient from 'sso-sumut-client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/login?error=no_token', req.url));
  }

  const config = {
    encryptionKey: process.env.SSO_ENCRYPTION_KEY,
    iv: process.env.SSO_IV,
    jwtSecret: process.env.SSO_JWT_SECRET,
  };

  try {
    // Verify token using the client library
    const userData = ssoClient.verify(token, config);

    // If successful, create a session
    // In a real app, you might save this to a database or use a more secure session
    const cookieStore = await cookies();
    cookieStore.set('user_session', JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return NextResponse.redirect(new URL('/', req.url));
  } catch (error: any) {
    console.error('SSO Login Error:', error.message);
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, req.url));
  }
}
