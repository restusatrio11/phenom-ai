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
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-lg shadow-emerald-900/10 shrink-0">
              <History className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">Arsip <span className="text-emerald-500">Investigasi</span></h1>
          </div>
          <p className="text-slate-400 max-w-2xl font-medium leading-relaxed">
            Pantau dan kelola seluruh hasil pemindaian fenomena yang telah dilakukan sebelumnya dalam basis data intelijen terenkripsi.
          </p>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-[32px] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
        <div className="relative bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[32px] p-1 shadow-2xl">
          <RiwayatTable data={formattedRiwayat} />
        </div>
      </div>
    </div>
  );
}


