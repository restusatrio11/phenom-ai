import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import AccuracyRing from '@/components/AccuracyRing';
import AccuracyDetail from '@/components/AccuracyDetail';
import ExportButton from '@/components/ExportButton';
import { ExternalLink, Info, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default async function AnalisisResultPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: hasilId } = await params;

  const hasil = await prisma.hasil.findUnique({
    where: { id: hasilId },
    include: { upload: true },
  });

  if (!hasil) {
    notFound();
  }

  // Robust data extraction for both old and new data formats
  const summaryData = hasil.summary as any;
  const fenomenaList = Array.isArray(summaryData) 
    ? summaryData 
    : (summaryData?.fenomena || []);

  const globalJustification = summaryData?.justifikasi_global_akurasi || "";

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-1 bg-primary rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70">Analysis Report</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 text-slate-900 tracking-tight">
            Hasil Analisis Fenomena
          </h1>
          <p className="text-slate-500 font-medium">
            Wilayah Investigasi: <span className="text-primary font-bold px-2 py-1 bg-emerald-50 rounded-lg">{hasil.upload.region}</span>
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <ExportButton data={fenomenaList} region={hasil.upload.region} />
          <div className="h-10 w-[1px] bg-slate-100 mx-2" />
          <div className="flex items-center gap-3 pr-4">
            <div className="text-right">
              <span className="block text-[9px] text-slate-400 uppercase tracking-widest font-bold">Akurasi Global</span>
              <div className="flex items-center justify-end">
                <span className="block text-lg font-black text-slate-800">{Math.round(hasil.akurasi * 100)}%</span>
                <AccuracyDetail justification={globalJustification} label="Metodologi Global" />
              </div>
            </div>
            <AccuracyRing accuracy={hasil.akurasi} />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {fenomenaList.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
            <div className="mb-6">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-10 h-10 text-slate-300" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Data fenomena tidak ditemukan</h2>
              <p className="text-slate-500 max-w-sm mx-auto text-sm leading-relaxed">
                Maaf, sistem tidak dapat menemukan pola fenomena yang signifikan dari data yang Anda berikan.
              </p>
            </div>
            <Link href="/" className="inline-flex items-center gap-2 bg-primary hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-emerald-200">
              Coba Pindai Ulang
            </Link>
          </div>
        ) : (
          fenomenaList.map((item: any, index: number) => (
            <div 
              key={index} 
              className="group bg-white border border-slate-200 rounded-2xl p-8 md:p-10 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 hover:border-primary/20 transition-all duration-500 fade-in-up" 
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex-1">
                  <div className="mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wider mb-4">
                      Temuan Utama #{index + 1}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-[1.1] group-hover:text-primary transition-colors">
                      {item.poin_penyebab}
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div className="relative pl-6 border-l-2 border-blue-100 hover:border-blue-400 transition-colors">
                      <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-blue-400" />
                      <div className="flex items-center gap-2 mb-3 text-blue-600">
                        <Info className="w-4 h-4" />
                        <h3 className="font-bold text-xs uppercase tracking-[0.1em]">Deskripsi Mendalam</h3>
                      </div>
                      <p className="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-line">
                        {item.deskripsi || "Deskripsi belum tersedia."}
                      </p>
                    </div>

                    <div className="relative pl-6 border-l-2 border-emerald-100 hover:border-emerald-400 transition-colors">
                      <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-emerald-400" />
                      <div className="flex items-center gap-2 mb-3 text-emerald-600">
                        <BarChart3 className="w-4 h-4" />
                        <h3 className="font-bold text-xs uppercase tracking-[0.1em]">Bukti & Data Statistik</h3>
                      </div>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(Array.isArray(item.keterangan) ? item.keterangan : [item.keterangan]).map((k: string, i: number) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            {k}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-3">Referensi Berita & Dokumen:</h4>
                        <div className="flex flex-wrap items-center gap-2">
                          {Array.isArray(item.sumber) && item.sumber.length > 0 ? (
                            item.sumber.map((s: any, i: number) => (
                              <a 
                                key={i} 
                                href={s.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-2 text-[11px] bg-white hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-xl transition-all border border-slate-200 shadow-sm active:scale-95"
                              >
                                <ExternalLink className="w-3 h-3 text-primary" />
                                {s.nama}
                              </a>
                            ))
                          ) : (
                            <span className="text-slate-400 text-xs italic bg-slate-50 px-3 py-1 rounded-lg border border-dashed border-slate-200">
                              Data rahasia/internal atau sumber tidak tersedia secara publik
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="lg:w-40 flex flex-col items-center justify-center bg-slate-50/50 p-8 rounded-2xl border border-slate-100 shrink-0">
                  <div className="text-center mb-4">
                    <span className="block text-[9px] text-slate-400 uppercase tracking-widest font-black leading-tight">Keakuratan<br/>Temuan</span>
                  </div>
                  <div className="relative group/ring">
                    <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-xl group-hover/ring:bg-emerald-500/20 transition-all duration-700" />
                    <AccuracyRing accuracy={item.akurasi} />
                  </div>
                  <div className="mt-4 text-center flex items-center justify-center">
                    <span className={`text-lg font-black ${item.akurasi >= 0.75 ? 'text-emerald-600' : 'text-yellow-600'}`}>
                      {Math.round(item.akurasi * 100)}%
                    </span>
                    <AccuracyDetail justification={item.justifikasi_akurasi} evaluasi={item.evaluasi} label="Justifikasi Temuan" />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-16 text-center">
        <Link href="/" className="inline-flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-900 font-black py-4 px-10 rounded-2xl transition-all border-2 border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-emerald-900/10 hover:border-primary/30 active:scale-95">
          <BarChart3 className="w-5 h-5 text-primary" />
          Lakukan Analisis Fenomena Baru
        </Link>
      </div>
    </div>
  );
}
