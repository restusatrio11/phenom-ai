import { prisma } from '@/lib/db';
import UploadForm from './UploadForm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

import { 
  TrendingUp, 
  Users, 
  Activity, 
  Map as MapIcon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Info
} from 'lucide-react';

export default async function Home() {
  const [totalUploads, avgAkurasi, totalUsers, allHasil] = await Promise.all([
    prisma.upload.count(),
    prisma.hasil.aggregate({ _avg: { akurasi: true } }),
    prisma.user.count(),
    prisma.hasil.findMany({
      include: { upload: true },
      orderBy: { upload: { createdAt: 'desc' } }
    })
  ]);

  // Calculate total anomalies (count of findings in JSON)
  let totalAnomalies = 0;
  allHasil.forEach(h => {
    try {
      const data = h.summary as any;
      const findings = data.fenomenaList || data.findings || [];
      totalAnomalies += findings.length;
    } catch (e) {}
  });

  // Calculate trends (last 12 weeks)
  const now = new Date();
  const trendData = Array(12).fill(0).map((_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (11 - i) * 7);
    return { label: `W${12 - (11 - i)}`, count: 0, date: d };
  });

  // Populate trend data
  const twelveWeeksAgo = new Date();
  twelveWeeksAgo.setDate(now.getDate() - 12 * 7);
  
  const recentUploads = await prisma.upload.findMany({
    where: { createdAt: { gte: twelveWeeksAgo } }
  });

  recentUploads.forEach(u => {
    const uDate = u.createdAt.getTime();
    // Find the closest week (rounding down)
    for (let i = 0; i < 12; i++) {
      const weekDate = trendData[i].date.getTime();
      const nextWeekDate = i < 11 ? trendData[i+1].date.getTime() : now.getTime() + 1;
      if (uDate >= weekDate && uDate < nextWeekDate) {
        trendData[i].count++;
        break;
      }
    }
  });

  // Normalize heights for the chart (max height 100%)
  const maxCount = Math.max(...trendData.map(d => d.count), 1);
  const normalizedTrend = trendData.map(d => ({
    ...d,
    height: Math.max(8, (d.count / maxCount) * 100)
  }));

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto animate-in fade-in duration-1000">
      {/* Dashboard Header - Minimalist & Elegant */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 mb-10 lg:mb-16">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-[2px] w-12 bg-emerald-500/30" />
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-emerald-600/60">Intelligence Overview</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Insight <span className="text-emerald-500/80 font-medium">Dashboard</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-xl text-base lg:text-lg leading-relaxed">
            Analisis multidimensi fenomena sosial dan ekonomi di seluruh wilayah Indonesia melalui lensa kecerdasan buatan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 lg:gap-6">
          <div className="bg-white/50 backdrop-blur-md border border-slate-200/60 rounded-2xl px-6 py-4 flex items-center gap-5 shadow-sm hover:shadow-md transition-all group">
            <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-all duration-500 group-hover:rotate-6">
              <Clock className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Data Terkini</span>
              <span className="text-sm font-bold text-slate-800 tracking-tight">24 Jam Terakhir</span>
            </div>
          </div>
          <button className="bg-slate-900 text-white px-8 lg:px-10 py-4 lg:py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-emerald-600 hover:shadow-emerald-200 transition-all active:scale-95 flex items-center gap-4 group">
            <TrendingUp className="w-5 h-5 group-hover:translate-y-[-2px] transition-transform" />
            Export Strategis
          </button>
        </div>
      </div>

        {/* Stats Grid - High Contrast & Depth */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-10 lg:mb-16">
        {[
          { label: 'Total Investigasi', value: totalUploads.toLocaleString('id-ID'), color: 'emerald', icon: Activity },
          { label: 'Temuan Fenomena', value: totalAnomalies.toLocaleString('id-ID'), color: 'amber', icon: AlertTriangle },
          { label: 'Akurasi Analitik', value: `${Math.round((avgAkurasi._avg.akurasi || 0) * 100)}%`, color: 'blue', icon: CheckCircle2 },
          { label: 'Penyelidik Aktif', value: totalUsers.toLocaleString('id-ID'), color: 'indigo', icon: Users },
        ].map((stat, i) => (
          <div key={i} className="group relative bg-white border border-slate-100 p-6 lg:p-10 rounded-2xl lg:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_rgba(16,185,129,0.08)] transition-all duration-700 hover:-translate-y-2 overflow-hidden">
            <div className={`absolute -right-4 -bottom-4 w-32 h-32 bg-${stat.color}-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000`} />
            
            <div className="flex items-center justify-between mb-8 lg:mb-10">
              <div className={`p-4 lg:p-5 rounded-xl lg:rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:rotate-12 transition-all duration-500`}>
                <stat.icon className="w-6 h-6 lg:w-7 lg:h-7" />
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            </div>
            
            <div className="space-y-1">
              <div className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</div>
              <div className="text-[10px] lg:text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Chart Area - Cleaner & More Scientific */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-100 rounded-2xl lg:rounded-3xl p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.03)] h-full flex flex-col overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 lg:mb-12 gap-6">
              <div className="space-y-1">
                <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">Evolusi Investigasi</h2>
                <p className="text-xs lg:text-sm text-slate-400 font-medium">Monitoring volume aktivitas 12 minggu terakhir</p>
              </div>
              <div className="flex p-1.5 bg-slate-50 rounded-xl border border-slate-100/50">
                <button className="px-4 lg:px-6 py-2 lg:py-2.5 bg-white text-emerald-600 text-[10px] font-black uppercase rounded-lg shadow-sm tracking-widest">Volume</button>
                <button className="px-4 lg:px-6 py-2 lg:py-2.5 text-slate-400 text-[10px] font-black uppercase hover:text-slate-700 tracking-widest transition-colors">Efisiensi</button>
              </div>
            </div>

            <div className="flex-1 w-full flex items-end gap-2 lg:gap-4 px-2 min-h-[250px]">
              {normalizedTrend.map((item, i) => (
                <div key={i} className="flex-1 group relative h-full flex flex-col justify-end">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100 z-20">
                    <div className="bg-slate-900 text-[9px] text-white font-black px-3 py-2 rounded-lg whitespace-nowrap shadow-2xl tracking-widest">
                      {item.count} LAPORAN
                    </div>
                    <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1" />
                  </div>
                  
                  <div className="relative flex-1 flex flex-col justify-end">
                    <div 
                      className="w-full bg-slate-100 group-hover:bg-emerald-500 rounded-t-lg transition-all duration-700 relative overflow-hidden" 
                      style={{ height: `${item.height}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="mt-4 text-[8px] lg:text-[9px] font-black text-slate-300 group-hover:text-slate-900 text-center uppercase tracking-widest transition-colors">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts Column - Refined & Human */}
        <div>
          <div className="bg-white border border-slate-100 rounded-2xl lg:rounded-3xl p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.03)] h-full">
            <div className="flex items-center justify-between mb-10 lg:mb-12">
              <h3 className="font-black text-slate-900 text-[10px] lg:text-xs uppercase tracking-[0.4em]">Temuan Terbaru</h3>
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                <div className="w-1 h-1 rounded-full bg-emerald-500/40" />
                <div className="w-1 h-1 rounded-full bg-emerald-500/10" />
              </div>
            </div>

            <div className="space-y-6 lg:space-y-8">
              {allHasil.slice(0, 5).map((h, i) => {
                const data = h.summary as any;
                const topFinding = data.fenomenaList?.[0] || data.findings?.[0] || { poin_penyebab: 'Investigasi Terverifikasi' };
                const timeAgo = Math.floor((now.getTime() - h.upload.createdAt.getTime()) / (1000 * 60));
                const timeStr = timeAgo < 60 ? `${timeAgo}m lalu` : `${Math.floor(timeAgo/60)}j lalu`;

                return (
                  <div key={i} className="group relative flex items-start gap-5 lg:gap-6 p-2 rounded-2xl hover:bg-slate-50/50 transition-all duration-500 cursor-pointer">
                    <div className={`w-12 h-12 lg:w-14 lg:h-14 shrink-0 rounded-xl lg:rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${
                      h.akurasi >= 0.8 ? 'bg-emerald-50 text-emerald-600' : 
                      h.akurasi >= 0.5 ? 'bg-amber-50 text-amber-600' : 
                      'bg-rose-50 text-rose-600'
                    }`}>
                      {h.akurasi >= 0.8 ? <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6" /> : <AlertTriangle className="w-5 h-5 lg:w-6 lg:h-6" />}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs lg:text-sm font-bold text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {topFinding.poin_penyebab}
                      </h4>
                      <div className="flex items-center gap-2 lg:gap-3">
                        <span className="text-[9px] lg:text-[10px] text-emerald-600/60 font-black uppercase tracking-widest">{h.upload.region}</span>
                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className="text-[9px] lg:text-[10px] text-slate-300 font-bold uppercase tracking-tighter">{timeStr}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {allHasil.length === 0 && (
                <div className="text-center py-10 lg:py-20">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6">
                    <Activity className="w-5 h-5 lg:w-6 lg:h-6 text-slate-200" />
                  </div>
                  <p className="text-[9px] lg:text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Belum Ada Data</p>
                </div>
              )}
            </div>

            <div className="mt-10 lg:mt-16">
              <Link href="/riwayat" className="block w-full text-center py-4 lg:py-5 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-emerald-600 rounded-xl lg:rounded-2xl transition-all">
                Buka Arsip Lengkap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
