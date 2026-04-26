import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

async function checkAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get('user_session');
  if (!session) return null;
  const sessionUser = JSON.parse(session.value);
  
  // Verify with DB to handle stale sessions
  const dbUser = await prisma.user.findUnique({
    where: { id: sessionUser.id }
  });

  if (!dbUser || dbUser.role !== 'ADMIN') return null;
  return dbUser;
}

export async function GET(req: NextRequest) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { email, password, nama_lengkap, role } = await req.json();
  
  try {
    const user = await prisma.user.create({
      data: { email, password, nama_lengkap, role }
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
  }
}
