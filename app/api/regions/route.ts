import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const regions = await prisma.region.findMany({
      orderBy: { label: 'asc' },
    });
    return NextResponse.json({ success: true, data: regions });
  } catch (error) {
    console.error('Fetch Regions Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
