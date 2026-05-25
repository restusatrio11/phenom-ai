import { prisma } from '@/lib/db';
import DataFlowGraph, { NodeActivityLogs, SystemStats } from '@/components/DataFlowGraph';
import { 
  Database, 
  Terminal, 
  Server, 
  Activity,
  Cpu,
  RefreshCw,
  Search,
  HardDrive
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DataStreamPage() {
  const recentUploads = await prisma.upload.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  // Generate simulated logs based on actual data
  const simulatedLogs = recentUploads.flatMap(u => [
    {
      timestamp: u.createdAt.toLocaleTimeString('id-ID'),
      node: 'Ingestion-Node-01',
      status: 'success',
      message: `Parsed dataset: ${u.region} (ID: ${u.id.substring(0, 8)})`
    },
    {
      timestamp: new Date(u.createdAt.getTime() + 2000).toLocaleTimeString('id-ID'),
      node: 'Scraper-Node-04',
      status: 'success',
      message: `Scanned 12 news sources for context in ${u.region}`
    },
    {
      timestamp: new Date(u.createdAt.getTime() + 5000).toLocaleTimeString('id-ID'),
      node: 'AI-Logic-Node-07',
      status: 'success',
      message: `Synthesized 5 phenomena findings for prompt: "${u.prompt.substring(0, 30)}..."`
    }
  ]).slice(0, 15);

  return (
    <div className="p-4 lg:p-10 max-w-[1600px] mx-auto animate-in fade-in duration-1000 space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-slate-900 border border-white/5 rounded-xl shadow-2xl">
              <Activity className="w-5 h-5 text-emerald-400" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/60">Infrastructure Monitoring</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none">Aliran <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Data</span></h1>
          <p className="text-slate-400 font-medium max-w-2xl text-sm lg:text-base leading-relaxed">
            Pemantauan arsitektur pipa data Phenom AI dari proses parsing hingga sintesis intelijen akhir dalam lingkungan terenkripsi.
          </p>
        </div>

        <div className="flex items-center gap-6 bg-slate-900/40 backdrop-blur-xl border border-white/5 p-4 rounded-3xl shadow-2xl">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-4 border-[#020617] bg-slate-800 flex items-center justify-center shadow-lg">
                <Server className="w-4 h-4 text-slate-500" />
              </div>
            ))}
          </div>
          <div className="space-y-1 pr-2">
            <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Engine Status</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Visualization */}
      <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[40px] p-8 lg:p-16 shadow-2xl overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
          <Cpu className="w-64 h-64 text-emerald-500" />
        </div>
        <div className="relative z-10 text-center space-y-3 mb-16">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Visualisasi Pipa Data</h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-emerald-500/30" />
            <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.4em]">End-to-End Intelligence Pipeline</p>
            <div className="h-px w-8 bg-emerald-500/30" />
          </div>
        </div>
        <DataFlowGraph />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Activity Monitor */}
        <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 lg:p-12 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white flex items-center gap-4">
                <div className="p-2 bg-emerald-500/10 rounded-xl">
                  <Terminal className="w-6 h-6 text-emerald-400" />
                </div>
                Aktivitas Node Terbaru
              </h2>
              <p className="text-xs text-slate-500 font-medium tracking-wide">Log aktivitas operasional mesin Phenom secara kronologis</p>
            </div>
            <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 active:scale-95 group">
              <RefreshCw className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 group-hover:rotate-180 transition-all duration-700" />
            </button>
          </div>
          
          <div className="flex-1 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            <NodeActivityLogs logs={simulatedLogs} />
          </div>
        </div>

        {/* System Health & Inventory */}
        <div className="space-y-10">
          <div className="bg-gradient-to-br from-slate-900 to-[#020617] border border-emerald-500/20 rounded-[40px] p-8 lg:p-10 shadow-[0_0_50px_rgba(16,185,129,0.1)] space-y-10 relative overflow-hidden group">
             <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
               <HardDrive className="w-40 h-40 text-white" />
             </div>
             <h3 className="text-xl font-black text-white flex items-center gap-4 relative z-10">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              Status Vital Sistem
            </h3>
            <SystemStats />
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 lg:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            <h3 className="text-xl font-black text-white mb-8 flex items-center gap-4">
              <Database className="w-6 h-6 text-blue-400" />
              Inventori Dataset
            </h3>
            <div className="space-y-5">
              {recentUploads.slice(0, 4).map((u, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-[24px] border border-white/5 group hover:border-blue-500/30 hover:bg-white/10 transition-all cursor-default">
                  <div className="space-y-1.5">
                    <span className="block text-[11px] font-black text-slate-200 uppercase tracking-wider line-clamp-1">{u.region}</span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">{u.createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-blue-400 border border-white/5 shadow-lg group-hover:scale-110 group-hover:text-blue-300 transition-all">
                    <Search className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-5 border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/5 text-[10px] font-black text-slate-500 hover:text-blue-400 uppercase tracking-[0.3em] rounded-2xl transition-all active:scale-95">
              Buka Katalog Data Lengkap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

