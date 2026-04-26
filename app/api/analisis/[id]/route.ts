import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
    }

    const hasil = await prisma.hasil.findUnique({
      where: { id },
      select: { uploadId: true }
    });

    if (!hasil) {
      return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 });
    }

    const uploadId = hasil.uploadId;

    // Delete Hasil first
    await prisma.hasil.delete({
      where: { id },
    });

    // Check if any other Hasil records are still using this uploadId
    const otherHasil = await prisma.hasil.findFirst({
      where: { uploadId }
    });

    // If no other Hasil uses this Upload, delete the Upload record too
    if (!otherHasil) {
      try {
        await prisma.upload.delete({
          where: { id: uploadId },
        });
      } catch (uploadError) {
        console.error('Failed to delete related upload:', uploadError);
        // We don't return error here because the main record (Hasil) is already deleted
      }
    }

    return NextResponse.json({ success: true, message: 'Data berhasil dihapus' });
  } catch (error: any) {
    console.error('Delete Error:', error);
    return NextResponse.json({ 
      error: 'Gagal menghapus data', 
      details: error.message 
    }, { status: 500 });
  }
}
