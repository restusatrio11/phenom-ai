import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { parseExcelToJSON } from '@/lib/excel';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const file = formData.get('file') as File | null;
    const region = formData.get('region') as string | null;
    const prompt = formData.get('prompt') as string | null;

    if (!prompt || !region) {
      return NextResponse.json({ error: 'Prompt and Region are required.' }, { status: 400 });
    }

    let excelData: any = {};
    if (file && typeof file === 'object' && file.size > 0) {
      // Convert File to Buffer for the parser
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      excelData = await parseExcelToJSON(buffer);
    }

    // Save to Database
    const uploadRecord = await prisma.upload.create({
      data: {
        region,
        prompt: prompt || '',
        excelData: excelData as any,
      },
    });

    // Record Activity Log
    try {
      const cookieStore = await cookies();
      const session = cookieStore.get('user_session');
      if (session) {
        const user = JSON.parse(session.value);
        await prisma.activityLog.create({
          data: {
            userId: user.id,
            action: 'ANALYSIS_START',
            details: `Started analysis for region: ${region}`
          }
        });
      }
    } catch (e) {}

    return NextResponse.json({ 
      success: true, 
      uploadId: uploadRecord.id 
    });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
