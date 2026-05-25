'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, Search, Loader2, MapPin, ChevronRight } from 'lucide-react';
import { INDONESIA_REGIONS } from '@/lib/regions-data';
import { useLoading } from '@/context/LoadingContext';
import { useToast } from '@/context/ToastContext';
import SearchableSelect from '@/components/ui/SearchableSelect';
import NewsExportButton from '@/components/NewsExportButton';

export default function UploadForm() {
  const router = useRouter();
  const { setIsLoading } = useLoading();
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  
  // Regional State
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>(''); // ID
  const [selectedProvinceName, setSelectedProvinceName] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>(''); // ID
  const [selectedCityName, setSelectedCityName] = useState<string>('');

  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Sync global loading state
  useEffect(() => {
    setIsLoading(loading);
    return () => setIsLoading(false);
  }, [loading, setIsLoading]);

  // Fetch Provinces on Mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch('/api/regions');
        const data = await res.json();
        if (data.success) {
          setProvinces(data.data);
        }
      } catch (err) {
        console.error("Gagal mengambil data provinsi:", err);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch Cities when Province changes
  useEffect(() => {
    if (!selectedProvince) {
      setCities([]);
      setSelectedCity('');
      setSelectedCityName('');
      return;
    }

    const fetchCities = async () => {
      try {
        const res = await fetch(`/api/regions?provinceId=${selectedProvince}`);
        const data = await res.json();
        if (data.success) {
          setCities(data.data);
        }
      } catch (err) {
        console.error("Gagal mengambil data kota:", err);
      }
    };
    fetchCities();
  }, [selectedProvince]);

  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Input, 2: Review News
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [webData, setWebData] = useState<any[]>([]);

  const handleStartScraping = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return setError("Silakan masukkan prompt analisis.");
    if (!selectedProvinceName) return setError("Silakan pilih provinsi.");

    setLoading(true);
    setError('');

    try {
      let currentUploadId = uploadId;
      
      // If we don't have an uploadId yet, we need to upload first
      if (!currentUploadId) {
        const formData = new FormData();
        if (file) formData.append('file', file);
        const combinedRegion = selectedCityName ? `${selectedCityName}, ${selectedProvinceName}` : selectedProvinceName;
        formData.append('region', combinedRegion);
        formData.append('prompt', prompt);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const uData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uData.error || "Gagal mengunggah data.");
        
        currentUploadId = uData.uploadId;
        setUploadId(currentUploadId);
      }

      // 2. Scrape News
      const newsRes = await fetch('/api/scan/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId: currentUploadId }),
      });
      const nData = await newsRes.json();
      if (!newsRes.ok) throw new Error(nData.error || "Gagal mencari berita.");

      setWebData(nData.webData);
      setStep(2);
      setLoading(false);
      
      if (nData.webData.length > 0) {
        showToast(`${nData.webData.length} sumber berita berhasil dipindai.`, "success");
      } else {
        showToast("Tidak ditemukan berita spesifik. Anda bisa mencoba lagi atau lanjut dengan data statistik.", "info");
      }
    } catch (err: any) {
      setError(err.message);
      showToast(err.message, "error");
      setLoading(false);
    }
  };

  const handleStartAnalysis = async () => {
    if (!uploadId) return setError("Sesi upload tidak ditemukan. Silakan ulangi.");
    if (webData.length === 0) {
      showToast("Tidak ada berita yang terpilih. AI akan mencoba menganalisis dengan data statistik saja.", "info");
    }
    
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
      <div className="p-6 lg:p-12 max-w-5xl mx-auto space-y-10 lg:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[32px] shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Data Found</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-4">Validasi Sumber Inteligensi</h2>
            <p className="text-slate-400 font-medium text-base">Terdeteksi {webData.length} entitas berita yang relevan dengan parameter investigasi Anda.</p>
          </div>
          <div className="flex items-center gap-3">
            <NewsExportButton data={webData} region={selectedCityName || selectedProvinceName} />
            <button 
              onClick={() => setStep(1)}
              className="px-6 py-3 text-[10px] font-black text-slate-400 hover:text-emerald-400 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 uppercase tracking-widest"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar relative z-10">
          {webData.length > 0 ? webData.map((item, i) => (
            <a 
              key={i} 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-emerald-500/30 hover:bg-white/10 transition-all group cursor-pointer relative overflow-hidden"
            >
              {item.relevanceScore && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-tighter border-b border-l border-emerald-500/20 rounded-bl-xl">
                  Match: {Math.round(item.relevanceScore * 100)}%
                </div>
              )}
              <div className="flex justify-between items-start gap-4 mb-4">
                <h3 className="font-bold text-slate-200 text-sm lg:text-base leading-snug group-hover:text-emerald-400 transition-colors line-clamp-2 pr-12">{item.title}</h3>
                <span className="text-[9px] px-3 py-1 bg-emerald-500/10 text-emerald-400 font-black uppercase rounded-full shrink-0 border border-emerald-500/20">{item.source}</span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-medium mb-3">{item.snippet}</p>
              {item.relevanceReason && (
                <div className="flex items-start gap-2 text-[9px] text-slate-500 italic bg-white/5 p-2 rounded-lg">
                  <span className="text-emerald-500">AI:</span>
                  <span>{item.relevanceReason}</span>
                </div>
              )}
            </a>
          )) : (
            <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/5">
                <Search className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-white font-bold text-xl mb-2">Entitas Berita Tidak Terdeteksi</p>
              <p className="text-sm text-slate-500 max-w-[320px] mx-auto mb-8">Kami tidak menemukan berita spesifik di wilayah ini. Anda dapat mencoba mencari ulang atau melanjutkan analisis menggunakan basis data internal AI.</p>
              <button 
                onClick={() => handleStartScraping()}
                disabled={loading}
                className="px-8 py-3 bg-white/5 hover:bg-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-emerald-500/20 transition-all flex items-center gap-3 mx-auto"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Cari Ulang Sekarang
              </button>
            </div>
          )}
        </div>

        <div className="pt-8 border-t border-white/5 relative z-10">
          <button 
            onClick={handleStartAnalysis}
            disabled={loading}
            className="w-full relative group overflow-hidden bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 lg:py-6 px-10 rounded-2xl transition-all duration-300 shadow-xl shadow-emerald-900/20 active:scale-95 disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
            <div className="flex justify-center items-center gap-4">
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin text-white" />
                  <span className="uppercase tracking-[0.2em] text-xs">Menjalankan Neural Analysis...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span className="uppercase tracking-[0.2em] text-xs">Luncurkan Analisis Phenom AI</span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 lg:space-y-16 animate-in fade-in duration-1000">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Configuration Phase</span>
        </div>
        <h2 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Parameter <span className="text-emerald-500">Node</span>
        </h2>
        <p className="text-slate-400 font-medium text-lg max-w-2xl leading-relaxed">
          Tentukan koordinat wilayah dan lampirkan data pendukung untuk memulai sinkronisasi intelijen.
        </p>
      </div>

      <form onSubmit={handleStartScraping} className="space-y-10 lg:space-y-12">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-5 rounded-2xl text-sm font-bold flex items-center gap-4 animate-in slide-in-from-top-4">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <SearchableSelect 
            label="Provinsi Target"
            icon={<MapPin className="w-4 h-4 text-emerald-500" />}
            options={provinces.map(p => p.name)}
            value={selectedProvinceName}
            onChange={(val) => {
              const prov = provinces.find(p => p.name === val);
              setSelectedProvince(prov?.id || '');
              setSelectedProvinceName(val);
              setSelectedCity('');
              setSelectedCityName('');
            }}
            disabled={loading}
            placeholder="-- Pilih Wilayah Strategis --"
            searchPlaceholder="Cari provinsi..."
          />

          <SearchableSelect 
            label="Kota/Kabupaten"
            icon={<Search className="w-4 h-4 text-emerald-500" />}
            options={cities.map(c => c.name)}
            value={selectedCityName}
            onChange={(val) => {
              const city = cities.find(c => c.name === val);
              setSelectedCity(city?.id || '');
              setSelectedCityName(val);
            }}
            disabled={loading || !selectedProvince}
            placeholder={selectedProvince ? "-- Seluruh Wilayah --" : "-- Tentukan Provinsi --"}
            searchPlaceholder="Cari kota/kabupaten..."
          />
        </div>


        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-1">Unggah Data Statistik (.xlsx)</label>
          <div className="relative group overflow-hidden bg-slate-800/20 border border-dashed border-white/10 rounded-3xl p-10 text-center hover:border-emerald-500/30 transition-all cursor-pointer hover:bg-emerald-500/5">
            <input 
              type="file" 
              accept=".xlsx" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={loading}
            />
            <div className="relative z-10 space-y-4">
              <div className="w-20 h-20 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 border border-white/5">
                <UploadCloud className="h-10 w-10 text-slate-600 group-hover:text-emerald-500 transition-colors" />
              </div>
              {file ? (
                <div>
                  <p className="text-lg font-bold text-emerald-400">{file.name}</p>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Data Terkunci</p>
                </div>
              ) : (
                <>
                  <p className="text-lg text-slate-300 font-bold">Seret berkas Excel ke area ini</p>
                  <p className="text-xs text-slate-500 font-medium tracking-wide">Mendukung format .xlsx hingga 10MB</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-1">Fokus Investigasi <span className="text-emerald-500">*</span></label>
          <div className="relative group">
            <textarea 
              className="w-full bg-slate-800/40 border border-white/5 rounded-3xl px-8 py-7 text-white font-medium text-lg focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/40 transition-all min-h-[180px] resize-none placeholder:text-slate-700 leading-relaxed"
              placeholder="Gambarkan fenomena atau anomali yang ingin Anda selidiki secara mendalam..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full relative group overflow-hidden bg-emerald-600 hover:bg-emerald-500 text-white font-black py-6 px-10 rounded-2xl transition-all duration-500 disabled:opacity-50 shadow-2xl shadow-emerald-900/20 active:scale-95"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
          <div className="flex items-center justify-center gap-5">
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-white" />
                <span className="text-xs uppercase tracking-[0.4em]">Inisialisasi Pemindaian Berita...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span className="text-xs uppercase tracking-[0.4em]">Jalankan Pemindaian Fenomena</span>
              </>
            )}
          </div>
        </button>
      </form>
    </div>
  );
}

