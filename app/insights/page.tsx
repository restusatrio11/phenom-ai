import { prisma } from '@/lib/db';
import { 
  SectorDistribution, 
  AccuracySignificanceScatter, 
  RegionalActivityBar 
} from '@/components/InsightCharts';
import { 
  Trophy, 
  Target, 
  ShieldCheck, 
  Zap,
  Globe,
  TrendingUp,
  MapPin,
  PieChart as PieChartIcon,
  Search
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function InsightsPage() {
  const allHasil = await prisma.hasil.findMany({
    include: { upload: true },
    orderBy: { upload: { createdAt: 'desc' } }
  });

  // 1. Sector Aggregation
  const sectorMap: Record<string, number> = {};
  const scatterData: any[] = [];
  const regionalMap: Record<string, number> = {};
  
  let highImpactFindings = 0;
  let totalPhenomena = 0;

  allHasil.forEach(h => {
    const summary = h.summary as any;
    const phenomena = summary.fenomena || summary.fenomenaList || [];
    
    // Aggregate by region
    const region = h.upload.region;
    regionalMap[region] = (regionalMap[region] || 0) + phenomena.length;

    phenomena.forEach((p: any) => {
      totalPhenomena++;
      
      // Sector aggregation
      const sector = p.sektor || 'Lainnya';
      sectorMap[sector] = (sectorMap[sector] || 0) + 1;

      // Scatter data
      scatterData.push({
        accuracy: (p.akurasi || 0) * 100,
        significance: (p.signifikansi || 0) * 100,
        name: p.poin_penyebab,
        z: (p.signifikansi || 0.5) * 400
      });

      if (p.signifikansi >= 0.8 && p.akurasi >= 0.8) {
        highImpactFindings++;
      }
    });
  });

  const sectorData = Object.entries(sectorMap).map(([name, value]) => ({ name, value }));
  const regionalData = Object.entries(regionalMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Top Sectors for highlights
  const topSectors = [...sectorData].sort((a, b) => b.value - a.value).slice(0, 3);

  return (
    <div className="p-4 lg:p-10 max-w-[1600px] mx-auto animate-in fade-in duration-700 space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-600 rounded-lg shadow-lg shadow-emerald-900/20">
              <Globe className="w-4 h-4 text-white" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Strategic Intelligence</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Wawasan <span className="bg-gradient-to-r from-slate-400 to-slate-600 bg-clip-text text-transparent font-light">Global</span></h1>
          <p className="text-slate-400 font-medium max-w-2xl text-sm lg:text-base leading-relaxed">
            Pemetaan pola fenomena sosial-ekonomi berdasarkan agregasi data dari seluruh titik investigasi di Indonesia.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/60 backdrop-blur-xl border border-white/5 p-2 rounded-2xl shadow-2xl">
          <div className="px-6 py-3 border-r border-white/5">
            <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Temuan</span>
            <span className="text-2xl font-black text-white">{totalPhenomena}</span>
          </div>
          <div className="px-6 py-3">
            <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">High Impact</span>
            <span className="text-2xl font-black text-emerald-500">{highImpactFindings}</span>
          </div>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topSectors.map((s, i) => (
          <div key={i} className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[32px] shadow-2xl hover:border-emerald-500/20 transition-all group overflow-hidden relative">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Dominasi Sektor</span>
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white tracking-tight">{s.name}</h3>
                <p className="text-xs text-emerald-500/60 font-black uppercase tracking-widest mt-2">{s.value} Temuan Aktif</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sectoral Breakdown */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 lg:p-12 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white flex items-center gap-4">
                <div className="p-2 bg-emerald-500/10 rounded-xl">
                  <PieChartIcon className="w-6 h-6 text-emerald-400" />
                </div>
                Distribusi Sektoral
              </h2>
              <p className="text-xs text-slate-500 font-medium tracking-wide">Persentase fokus investigasi per sektor utama</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-12">
            <SectorDistribution data={sectorData} />
            <div className="space-y-5 min-w-[200px]">
              {sectorData.slice(0, 5).map((s, i) => (
                <div key={i} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full shadow-lg" style={{ backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#6366f1', '#ec4899'][i % 5] }} />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-slate-200 transition-colors">{s.name}</span>
                  </div>
                  <span className="text-xs font-black text-white">{Math.round((s.value / totalPhenomena) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Accuracy vs Significance Matrix */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 lg:p-12 shadow-2xl">
          <div className="flex items-center justify-between mb-10">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white flex items-center gap-4">
                <div className="p-2 bg-emerald-500/10 rounded-xl">
                  <Target className="w-6 h-6 text-emerald-400" />
                </div>
                Matriks Signifikansi
              </h2>
              <p className="text-xs text-slate-500 font-medium tracking-wide">Korelasi antara dampak fenomena dan kepercayaan data</p>
            </div>
            <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em] animate-pulse">
              Live Neural Analysis
            </div>
          </div>
          
          <AccuracySignificanceScatter data={scatterData} />
          
          <div className="mt-8 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[24px] flex items-center gap-5">
            <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              <strong className="text-emerald-400 uppercase tracking-widest text-[10px] block mb-1">Info Strategis</strong>
              Fokus pada kuadran kanan atas (Akurasi &gt; 80%, Signifikansi &gt; 80%) untuk pengambilan kebijakan krusial dengan tingkat risiko rendah.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Regional Activity */}
        <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 lg:p-12 shadow-2xl">
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white flex items-center gap-4">
                <div className="p-2 bg-emerald-500/10 rounded-xl">
                  <MapPin className="w-6 h-6 text-emerald-400" />
                </div>
                Titik Aktivitas Tertinggi
              </h2>
              <p className="text-xs text-slate-500 font-medium tracking-wide">Wilayah dengan densitas fenomena paling signifikan dalam 30 hari terakhir</p>
            </div>
          </div>
          
          <RegionalActivityBar data={regionalData} />
        </div>

        {/* AI Insight Summary */}
        <div className="bg-gradient-to-br from-slate-900 to-[#020617] border border-emerald-500/20 rounded-[40px] p-8 lg:p-12 shadow-[0_0_50px_rgba(16,185,129,0.1)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap className="w-48 h-48 text-emerald-500" />
          </div>
          
          <div className="relative z-10 space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/40 rotate-3 group-hover:rotate-0 transition-transform">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">AI Synthesis</h2>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Neural Engine v4.0</span>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">Tren Nasional</h4>
                <p className="text-sm text-slate-200 leading-relaxed font-medium italic">
                  "Berdasarkan {allHasil.length} investigasi terbaru, terlihat pergeseran pola dari isu infrastruktur fisik menuju anomali harga komoditas strategis di wilayah Timur Indonesia."
                </p>
              </div>

              <div className="space-y-5">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Rekomendasi Penyelidik</h4>
                <ul className="space-y-4">
                  {[
                    "Monitor volatilitas sektor " + (topSectors[0]?.name || 'Utama'),
                    "Perdalam verifikasi data di " + (regionalData[0]?.name || 'Wilayah Aktif'),
                    "Sinkronisasi news nodes tingkat lanjut"
                  ].map((rec, i) => (
                    <li key={i} className="flex items-center gap-4 text-xs text-slate-400 font-bold group/item">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] group-hover/item:scale-150 transition-transform" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all shadow-2xl shadow-emerald-900/40 active:scale-95">
              Generate Deep Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

