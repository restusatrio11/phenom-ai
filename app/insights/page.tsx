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
            <span className="p-1.5 bg-emerald-500 rounded-lg">
              <Globe className="w-4 h-4 text-white" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Strategic Intelligence</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Wawasan <span className="text-slate-400 font-light">Global</span></h1>
          <p className="text-slate-500 font-medium max-w-2xl text-sm lg:text-base">
            Pemetaan pola fenomena sosial-ekonomi berdasarkan agregasi data dari seluruh titik investigasi di Indonesia.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white border border-slate-100 p-2 rounded-2xl shadow-sm">
          <div className="px-4 py-2 border-r border-slate-100">
            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Temuan</span>
            <span className="text-lg font-black text-slate-900">{totalPhenomena}</span>
          </div>
          <div className="px-4 py-2">
            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">High Impact</span>
            <span className="text-lg font-black text-emerald-600">{highImpactFindings}</span>
          </div>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topSectors.map((s, i) => (
          <div key={i} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Dominasi Sektor</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">{s.name}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{s.value} Temuan Aktif</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sectoral Breakdown */}
        <div className="bg-white border border-slate-100 rounded-[32px] p-8 lg:p-10 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <PieChartIcon className="w-5 h-5 text-emerald-500" />
                Distribusi Sektoral
              </h2>
              <p className="text-xs text-slate-400 font-medium">Persentase fokus investigasi per sektor utama</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-10">
            <SectorDistribution data={sectorData} />
            <div className="space-y-4 min-w-[200px]">
              {sectorData.slice(0, 5).map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#6366f1', '#ec4899'][i % 5] }} />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{s.name}</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-900">{Math.round((s.value / totalPhenomena) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Accuracy vs Significance Matrix */}
        <div className="bg-white border border-slate-100 rounded-[32px] p-8 lg:p-10 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <Target className="w-5 h-5 text-emerald-500" />
                Matriks Signifikansi
              </h2>
              <p className="text-xs text-slate-400 font-medium">Korelasi antara dampak fenomena dan kepercayaan data</p>
            </div>
            <div className="px-3 py-1.5 bg-slate-50 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Live Analysis
            </div>
          </div>
          
          <AccuracySignificanceScatter data={scatterData} />
          
          <div className="mt-6 p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center gap-4">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-[10px] text-emerald-800 font-medium leading-relaxed">
              <strong>Info Strategis:</strong> Fokus pada kuadran kanan atas (Akurasi &gt; 80%, Signifikansi &gt; 80%) untuk pengambilan kebijakan krusial.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Regional Activity */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[32px] p-8 lg:p-10 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-500" />
                Titik Aktivitas Tertinggi
              </h2>
              <p className="text-xs text-slate-400 font-medium">Wilayah dengan densitas fenomena paling signifikan</p>
            </div>
          </div>
          
          <RegionalActivityBar data={regionalData} />
        </div>

        {/* AI Insight Summary */}
        <div className="bg-slate-900 rounded-[32px] p-8 lg:p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap className="w-40 h-40 text-white" />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Search className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-black text-white">AI Synthesis</h2>
            </div>
            
            <div className="space-y-6">
              <div className="p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3">Tren Nasional</h4>
                <p className="text-sm text-slate-300 leading-relaxed font-medium italic">
                  "Berdasarkan {allHasil.length} investigasi terbaru, terlihat pergeseran pola dari isu infrastruktur fisik menuju anomali harga komoditas strategis di wilayah Timur Indonesia."
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Rekomendasi Penyelidik</h4>
                <ul className="space-y-3">
                  {[
                    "Monitor volatilitas sektor " + (topSectors[0]?.name || 'Utama'),
                    "Perdalam verifikasi data di " + (regionalData[0]?.name || 'Wilayah Aktif'),
                    "Gunakan news nodes tambahan untuk validasi"
                  ].map((rec, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs text-slate-400 font-bold">
                      <div className="w-1 h-1 rounded-full bg-emerald-500" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl shadow-emerald-900/20">
              Generate Deep Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
