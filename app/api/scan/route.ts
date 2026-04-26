import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { scrapeWebData } from '@/lib/scraper'; // Added scraper
import { analyzePhenomena } from '@/lib/llm';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uploadId } = body;

    if (!uploadId) {
      return NextResponse.json({ error: 'uploadId is required.' }, { status: 400 });
    }

    // 1. Fetch the Upload record from Neon DB
    const uploadRecord = await prisma.upload.findUnique({
      where: { id: uploadId },
    });

    if (!uploadRecord) {
      return NextResponse.json({ error: 'Upload record not found.' }, { status: 404 });
    }

    // 2. Perform Web Scraping based on Region and Prompt
    // If prompt is empty, just use "fenomena pertanian"
    const query = uploadRecord.prompt ? uploadRecord.prompt : `fenomena pertanian`;
    const webData = await scrapeWebData(query, uploadRecord.region);

    // 3. Call OpenRouter LLM via Vercel AI SDK
    const llmResult = await analyzePhenomena(uploadRecord.excelData, webData, uploadRecord.prompt, uploadRecord.region);

    // 4. Save results to Database
    const hasilRecord = await prisma.hasil.create({
      data: {
        uploadId: uploadRecord.id,
        summary: llmResult.fenomena as any,
        akurasi: llmResult.globalAkurasi,
      },
    });

    return NextResponse.json({ 
      success: true, 
      hasilId: hasilRecord.id,
      slug: hasilRecord.id // Using hasilId as the unique slug for the result page
    });

  } catch (error: any) {
    console.error('Scan Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
