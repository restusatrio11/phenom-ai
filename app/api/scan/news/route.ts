import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { scrapeWebData } from '@/lib/scraper';
import { filterRelevantNews } from '@/lib/llm';

export async function POST(req: NextRequest) {
  try {
    const { uploadId } = await req.json();

    if (!uploadId) {
      return NextResponse.json({ error: 'uploadId is required.' }, { status: 400 });
    }

    const uploadRecord = await prisma.upload.findUnique({
      where: { id: uploadId },
    });

    if (!uploadRecord) {
      return NextResponse.json({ error: 'Upload record not found.' }, { status: 404 });
    }

    const query = uploadRecord.prompt || 'fenomena sosial ekonomi';
    const rawWebData = await scrapeWebData(query, uploadRecord.region);
    
    // Filtering with AI to improve accuracy
    const webData = await filterRelevantNews(rawWebData, query, uploadRecord.region);

    return NextResponse.json({ success: true, webData });
  } catch (error: any) {
    console.error('Scrape News Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
