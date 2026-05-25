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
    <div className="container mx-auto px-4 py-12 max-w-5xl animate-in fade-in duration-1000">
      <div className="mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-transparent rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500/80">Analysis Report</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tighter">
            Laporan <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Fenomena</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-sm font-medium uppercase tracking-widest">Wilayah Investigasi:</span>
            <span className="text-emerald-400 font-bold px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm shadow-lg shadow-emerald-900/10">{hasil.upload.region}</span>
          </div>
        </div>
        <div className="flex items-center gap-6 bg-slate-900/60 backdrop-blur-xl border border-white/5 p-3 rounded-[24px] shadow-2xl">
          <ExportButton data={fenomenaList} region={hasil.upload.region} />
          <div className="h-12 w-[1px] bg-white/5 mx-2" />
          <div className="flex items-center gap-5 pr-4">
            <div className="text-right">
              <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-black mb-1">Akurasi Global</span>
              <div className="flex items-center justify-end gap-1">
                <span className="block text-2xl font-black text-white">{Math.round(hasil.akurasi * 100)}%</span>
                <AccuracyDetail justification={globalJustification} label="Metodologi Global" />
              </div>
            </div>
            <div className="relative group/global">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-lg opacity-0 group-hover/global:opacity-100 transition-opacity" />
              <AccuracyRing accuracy={hasil.akurasi} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {fenomenaList.length === 0 ? (
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[40px] p-24 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/5 rotate-3">
                <BarChart3 className="w-12 h-12 text-slate-600" />
              </div>
              <h2 className="text-2xl font-black text-white mb-3 tracking-tight">Data fenomena tidak ditemukan</h2>
              <p className="text-slate-500 max-w-sm mx-auto text-base font-medium leading-relaxed mb-10">
                Maaf, unit inteligensi kami tidak dapat menemukan pola fenomena yang signifikan dari parameter yang Anda berikan.
              </p>
              <Link href="/" className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-xl shadow-emerald-900/20 active:scale-95 uppercase tracking-widest text-xs">
                Inisialisasi Ulang
              </Link>
            </div>
          </div>
        ) : (
          fenomenaList.map((item: any, index: number) => (
            <div 
              key={index} 
              className="group relative" 
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-[40px] blur opacity-0 group-hover:opacity-100 transition duration-1000" />
              <div className="relative bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl transition-all duration-500 hover:border-emerald-500/20 overflow-hidden">
                {/* Subtle Card Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <div className="flex flex-col lg:flex-row gap-12 relative z-10">
                  <div className="flex-1">
                    <div className="mb-10">
                      <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Temuan Inteligensi #{index + 1}
                      </div>
                      <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight group-hover:text-emerald-400 transition-colors">
                        {item.poin_penyebab}
                      </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-8">
                      <div className="relative pl-8 border-l border-white/10 hover:border-emerald-500/40 transition-colors py-1">
                        <div className="absolute -left-[3px] top-0 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                        <div className="flex items-center gap-3 mb-4 text-slate-400">
                          <Info className="w-4 h-4 text-emerald-500" />
                          <h3 className="font-black text-[10px] uppercase tracking-[0.3em]">Analisis Deskriptif</h3>
                        </div>
                        <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium whitespace-pre-line italic">
                          "{item.deskripsi || "Deskripsi belum tersedia."}"
                        </p>
                      </div>

                      <div className="relative pl-8 border-l border-white/10 hover:border-emerald-500/40 transition-colors py-1">
                        <div className="absolute -left-[3px] top-0 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                        <div className="flex items-center gap-3 mb-5 text-slate-400">
                          <BarChart3 className="w-4 h-4 text-emerald-500" />
                          <h3 className="font-black text-[10px] uppercase tracking-[0.3em]">Parameter & Bukti Statistik</h3>
                        </div>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(Array.isArray(item.keterangan) ? item.keterangan : [item.keterangan]).map((k: string, i: number) => (
                            <li key={i} className="flex items-start gap-4 text-xs md:text-sm text-slate-300 bg-white/5 p-4 rounded-[20px] border border-white/5 hover:bg-white/10 transition-colors">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 mt-1.5 shrink-0" />
                              <span className="font-medium">{k}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div>
                          <h4 className="text-[9px] text-slate-500 uppercase tracking-[0.4em] font-black mb-5 px-1">Verifikasi Node Sumber:</h4>
                          <div className="flex flex-wrap items-center gap-3">
                            {Array.isArray(item.sumber) && item.sumber.length > 0 ? (
                              item.sumber.map((s: any, i: number) => (
                                <a 
                                  key={i} 
                                  href={s.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="inline-flex items-center gap-3 text-[10px] bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-bold py-2.5 px-5 rounded-xl transition-all border border-white/5 shadow-xl active:scale-95 group/link"
                                >
                                  <ExternalLink className="w-3.5 h-3.5 text-emerald-500 group-hover/link:scale-110 transition-transform" />
                                  <span className="uppercase tracking-widest">{s.nama}</span>
                                </a>
                              ))
                            ) : (
                              <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-dashed border-white/10">
                                Protected Internal Data
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:w-48 flex flex-col items-center justify-center bg-slate-900/60 p-10 rounded-[32px] border border-white/5 shrink-0 shadow-inner">
                    <div className="text-center mb-6">
                      <span className="block text-[9px] text-slate-500 uppercase tracking-[0.3em] font-black leading-tight">Neural<br/>Confidence</span>
                    </div>
                    <div className="relative group/ring">
                      <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl opacity-40 group-hover/ring:opacity-70 transition-all duration-700" />
                      <AccuracyRing accuracy={item.akurasi} />
                    </div>
                    <div className="mt-6 text-center flex items-center justify-center gap-2">
                      <span className={`text-2xl font-black ${item.akurasi >= 0.75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {Math.round(item.akurasi * 100)}%
                      </span>
                      <AccuracyDetail justification={item.justifikasi_akurasi} evaluasi={item.evaluasi} label="Justifikasi Temuan" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-20 text-center">
        <Link href="/" className="inline-flex items-center gap-4 bg-slate-900/50 hover:bg-slate-900 text-white font-black py-5 px-12 rounded-2xl transition-all border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.3)] hover:border-emerald-500/30 hover:shadow-emerald-900/10 active:scale-95 group">
          <BarChart3 className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
          <span className="uppercase tracking-[0.3em] text-xs">Mulai Investigasi Baru</span>
        </Link>
      </div>
    </div>
  );
}

