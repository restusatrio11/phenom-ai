import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Akun tidak ditemukan' }, { status: 401 });
    }

    // Check password (In production, use bcrypt.compare)
    if (user.password !== password) {
      return NextResponse.json({ error: 'Kata sandi salah' }, { status: 401 });
    }

    // Success - Create session
    const userData = {
      id: user.id,
      email: user.email,
      nama_lengkap: user.nama_lengkap,
      role: user.role,
    };

    const cookieStore = await cookies();
    cookieStore.set('user_session', JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    // Record Activity Log
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        details: `User logged in from ${req.headers.get('user-agent') || 'Unknown'}`
      }
    });

    return NextResponse.json({ success: true, user: userData });
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
