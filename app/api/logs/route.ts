import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

async function checkAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get('user_session');
  if (!session) return null;
  const sessionUser = JSON.parse(session.value);
  
  const dbUser = await prisma.user.findUnique({
    where: { id: sessionUser.id }
  });

  if (!dbUser || dbUser.role !== 'ADMIN') return null;
  return dbUser;
}

export async function GET(req: NextRequest) {
  try {
    const admin = await checkAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const logs = await prisma.activityLog.findMany({
      include: { user: true },
      orderBy: { timestamp: 'desc' },
      take: 100
    });

    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
