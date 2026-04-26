'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, Search, Loader2, MapPin, ChevronRight } from 'lucide-react';
import { INDONESIA_REGIONS } from '@/lib/regions-data';
import { useLoading } from '@/context/LoadingContext';
import { useToast } from '@/context/ToastContext';

export default function UploadForm() {
  const router = useRouter();
  const { setIsLoading } = useLoading();
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [province, setProvince] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Sync global loading state
  useEffect(() => {
    setIsLoading(loading);
    return () => setIsLoading(false);
  }, [loading, setIsLoading]);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Input, 2: Review News
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [webData, setWebData] = useState<any[]>([]);

  const provinces = useMemo(() => Object.keys(INDONESIA_REGIONS).sort(), []);
  const cities = useMemo(() => {
    if (!province) return [];
    return INDONESIA_REGIONS[province].sort();
  }, [province]);

  const handleStartScraping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return setError("Silakan masukkan prompt analisis.");
    if (!province) return setError("Silakan pilih provinsi.");

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      if (file) formData.append('file', file);
      const combinedRegion = city ? `${city}, ${province}` : province;
      formData.append('region', combinedRegion);
      formData.append('prompt', prompt);

      // 1. Upload
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const uData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uData.error || "Gagal mengunggah data.");
      
      setUploadId(uData.uploadId);

      // 2. Scrape News
      const newsRes = await fetch('/api/scan/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId: uData.uploadId }),
      });
      const nData = await newsRes.json();
      if (!newsRes.ok) throw new Error(nData.error || "Gagal mencari berita.");

      setWebData(nData.webData);
      setStep(2);
      setLoading(false);
      showToast(`${nData.webData.length} sumber berita berhasil dipindai.`, "success");
    } catch (err: any) {
      setError(err.message);
      showToast(err.message, "error");
      setLoading(false);
    }
  };

  const handleStartAnalysis = async () => {
    if (!uploadId || webData.length === 0) return;
    
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/scan/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId, webData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menganalisis fenomena.");

      showToast("Analisis Kecerdasan Buatan selesai.", "success");
      router.push(`/analisis/${data.slug}`);
    } catch (err: any) {
      setError(err.message);
      showToast(err.message, "error");
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="p-6 lg:p-12 max-w-5xl mx-auto space-y-10 lg:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white border border-slate-100 rounded-2xl lg:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.03)] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-4">Validasi Sumber Data</h2>
            <p className="text-slate-400 font-medium text-base lg:text-lg">Kami menemukan {webData.length} sumber berita terkini terkait fenomena tersebut.</p>
          </div>
          <button 
            onClick={() => setStep(1)}
            className="px-6 py-3 text-xs font-bold text-slate-400 hover:text-primary bg-slate-50 hover:bg-emerald-50 rounded-xl transition-all border border-slate-100 shrink-0"
          >
            Ganti Input
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {webData.length > 0 ? webData.map((item, i) => (
            <a 
              key={i} 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block p-6 bg-white border border-slate-200 rounded-2xl hover:border-primary/40 hover:shadow-xl hover:shadow-emerald-900/5 transition-all group cursor-pointer"
            >
              <div className="flex justify-between items-start gap-4 mb-4">
                <h3 className="font-bold text-slate-800 text-sm lg:text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
                <span className="text-[9px] px-3 py-1 bg-emerald-50 text-emerald-700 font-black uppercase rounded-full shrink-0 border border-emerald-100">{item.source}</span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">{item.snippet}</p>
            </a>
          )) : (
            <div className="text-center py-20 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
              <Search className="w-16 h-16 mx-auto mb-4 text-slate-200" />
              <p className="text-slate-800 font-bold">Tidak ada berita spesifik ditemukan</p>
              <p className="text-xs text-slate-500 mt-1 max-w-[200px] mx-auto">AI akan tetap menganalisis menggunakan data internal sistem.</p>
            </div>
          )}
        </div>

        <div className="pt-8 border-t border-slate-100">
          <button 
            onClick={handleStartAnalysis}
            disabled={loading}
            className="w-full relative group overflow-hidden bg-primary hover:bg-emerald-600 text-white font-black py-4 lg:py-6 px-6 lg:px-10 rounded-[20px] lg:rounded-[24px] transition-all flex justify-center items-center gap-4 shadow-2xl shadow-emerald-200 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Mengkoneksikan Data...
              </>
            ) : (
              <>
                <div className="p-2 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                  <Search className="w-5 h-5" />
                </div>
                <span className="text-xs lg:text-sm uppercase tracking-widest">Mulai Analisis Kecerdasan Buatan</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-12 max-w-5xl mx-auto space-y-10 lg:space-y-16 relative">
      <div className="space-y-4">
        <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Mulai <span className="text-primary">Investigasi</span> Baru
        </h2>
        <p className="text-slate-400 font-medium text-base lg:text-xl max-w-2xl leading-relaxed">
          Konfigurasikan wilayah dan parameter untuk memicu pemindaian intelijen tingkat lanjut.
        </p>
      </div>

      <form onSubmit={handleStartScraping} className="space-y-10">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-5 rounded-[24px] text-sm font-bold flex items-center gap-4 animate-in slide-in-from-top-4 duration-500">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          <div className="space-y-4">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
              <MapPin className="w-4 h-4 text-primary" />
              Provinsi Target
            </label>
            <div className="relative group">
              <select 
                className="w-full bg-white border border-slate-100 rounded-[20px] lg:rounded-[24px] px-5 lg:px-6 py-4 lg:py-5 text-slate-800 font-bold text-sm focus:outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary/40 transition-all appearance-none cursor-pointer shadow-sm hover:border-slate-300"
                value={province}
                onChange={(e) => {
                  setProvince(e.target.value);
                  setCity('');
                }}
                disabled={loading}
              >
                <option value="">-- Pilih Wilayah Strategis --</option>
                {provinces.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover:text-primary transition-colors">
                <ChevronRight className="w-5 h-5 rotate-90" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
              <Search className="w-4 h-4 text-primary" />
              Kota/Kabupaten <span className="text-[10px] font-medium opacity-40 lowercase">(opsional)</span>
            </label>
            <div className="relative group">
              <select 
                className="w-full bg-white border border-slate-100 rounded-[20px] lg:rounded-[24px] px-5 lg:px-6 py-4 lg:py-5 text-slate-800 font-bold text-sm focus:outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary/40 transition-all appearance-none cursor-pointer disabled:opacity-50 shadow-sm hover:border-slate-300"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={loading || !province}
              >
                <option value="">{province ? "-- Seluruh Wilayah --" : "-- Tentukan Provinsi --"}</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover:text-primary transition-colors">
                <ChevronRight className="w-5 h-5 rotate-90" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Lampiran Data Statistik <span className="text-[10px] font-medium opacity-40 lowercase">(Excel .xlsx)</span></label>
          <div className="relative group overflow-hidden bg-white border border-slate-100 rounded-2xl lg:rounded-3xl p-8 lg:p-12 text-center hover:border-primary/30 transition-all cursor-pointer hover:bg-emerald-50/20 shadow-sm">
            <input 
              type="file" 
              accept=".xlsx" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={loading}
            />
            <div className="relative z-10">
              <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 shadow-sm border border-slate-100">
                <UploadCloud className="h-10 w-10 text-slate-300 group-hover:text-primary transition-colors" />
              </div>
              {file ? (
                <div className="space-y-2">
                  <p className="text-lg font-black text-slate-900">{file.name}</p>
                  <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest">Siap Diunggah</p>
                </div>
              ) : (
                <>
                  <p className="text-lg text-slate-800 font-black">Klik atau seret file Excel ke sini</p>
                  <p className="text-xs text-slate-400 mt-2 font-medium">Format standard .xlsx (Max 10MB)</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Fokus Investigasi <span className="text-rose-500">*</span></label>
          <div className="relative group">
            <textarea 
              className="w-full bg-white border border-slate-100 rounded-[24px] lg:rounded-[32px] px-6 lg:px-8 py-5 lg:py-7 text-slate-800 font-medium text-base lg:text-lg focus:outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary/40 transition-all min-h-[160px] lg:min-h-[180px] resize-none shadow-sm placeholder:text-slate-200 leading-relaxed"
              placeholder="Gambarkan fenomena yang sedang Anda amati secara mendalam..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
            />
            <div className="absolute right-6 bottom-6 p-3 bg-slate-50 rounded-xl opacity-40 group-focus-within:opacity-100 transition-opacity">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full relative group overflow-hidden bg-slate-900 hover:bg-emerald-600 text-white font-black py-5 lg:py-6 px-8 lg:px-10 rounded-[24px] lg:rounded-[32px] transition-all duration-500 disabled:opacity-50 shadow-2xl shadow-slate-200 active:scale-95"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-4">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
              <span className="text-xs uppercase tracking-[0.3em]">Mengkoneksikan Node...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-5">
              <div className="p-2 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <span className="text-xs lg:text-sm uppercase tracking-[0.3em]">Mulai Penyelidikan Inteligensi</span>
            </div>
          )}
        </button>
      </form>
    </div>
  );
}
