import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'IDs tidak valid' }, { status: 400 });
    }

    // Get the uploadIds of the records we are about to delete
    const hasilRecords = await prisma.hasil.findMany({
      where: { id: { in: ids } },
      select: { uploadId: true },
    });

    const uniqueUploadIds = Array.from(new Set(hasilRecords.map(h => h.uploadId)));

    // Delete the selected Hasil records
    await prisma.hasil.deleteMany({
      where: { id: { in: ids } },
    });

    // For each unique uploadId, check if there are any remaining Hasil records
    for (const uploadId of uniqueUploadIds) {
      const remainingHasil = await prisma.hasil.findFirst({
        where: { uploadId }
      });

      // If no more Hasil records use this Upload, delete it
      if (!remainingHasil) {
        try {
          await prisma.upload.delete({
            where: { id: uploadId }
          });
        } catch (err) {
          console.error(`Failed to delete orphan upload ${uploadId}:`, err);
        }
      }
    }

    return NextResponse.json({ success: true, message: `${ids.length} data berhasil dihapus` });
  } catch (error: any) {
    console.error('Bulk Delete Error:', error);
    return NextResponse.json({ 
      error: 'Gagal menghapus data secara massal',
      details: error.message
    }, { status: 500 });
  }
}
