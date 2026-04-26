import { prisma } from '@/lib/db';
import RiwayatTable from '@/components/RiwayatTable';
import { History } from 'lucide-react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function RiwayatPage() {
  const riwayat = await prisma.hasil.findMany({
    orderBy: { upload: { createdAt: 'desc' } },
    include: { upload: true },
  });

  // Map the data to include what the client component needs
  const formattedRiwayat = riwayat.map(item => ({
    id: item.id,
    uploadId: item.uploadId,
    data: item.summary as any,
    akurasi: item.akurasi,
    upload: {
      id: item.upload.id,
      region: item.upload.region,
      prompt: item.upload.prompt,
      createdAt: item.upload.createdAt.toISOString(),
    }
  }));

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg shrink-0">
              <History className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-500" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Riwayat Analisis</h1>
          </div>
          <p className="text-slate-400 max-w-2xl">
            Pantau dan kelola seluruh hasil pemindaian fenomena yang telah dilakukan sebelumnya. 
            Gunakan fitur pencarian untuk menemukan data spesifik dengan cepat.
          </p>
        </div>
      </div>

      <RiwayatTable data={formattedRiwayat} />
    </div>
  );
}

