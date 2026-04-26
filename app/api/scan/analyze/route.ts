import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { analyzePhenomena } from '@/lib/llm';

export async function POST(req: NextRequest) {
  try {
    const { uploadId, webData } = await req.json();

    if (!uploadId || !webData) {
      return NextResponse.json({ error: 'uploadId and webData are required.' }, { status: 400 });
    }

    const uploadRecord = await prisma.upload.findUnique({
      where: { id: uploadId },
    });

    if (!uploadRecord) {
      return NextResponse.json({ error: 'Upload record not found.' }, { status: 404 });
    }

    const llmResult = await analyzePhenomena(
      uploadRecord.excelData, 
      webData, 
      uploadRecord.prompt, 
      uploadRecord.region
    );

    const hasilRecord = await prisma.hasil.create({
      data: {
        uploadId: uploadRecord.id,
        summary: llmResult.fenomena as any,
        akurasi: llmResult.globalAkurasi,
      },
    });

    return NextResponse.json({ 
      success: true, 
      slug: hasilRecord.id 
    });

  } catch (error: any) {
    console.error('Analyze Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
