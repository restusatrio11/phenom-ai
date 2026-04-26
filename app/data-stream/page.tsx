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
    <div className="p-4 lg:p-10 max-w-[1600px] mx-auto animate-in fade-in duration-700 space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-slate-900 rounded-lg">
              <Activity className="w-4 h-4 text-emerald-500" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Infrastructure Monitoring</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Aliran <span className="text-emerald-500">Data</span></h1>
          <p className="text-slate-500 font-medium max-w-2xl text-sm lg:text-base">
            Pemantauan arsitektur pipa data Phenom AI dari proses parsing hingga sintesis intelijen akhir.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center">
                <Server className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
          <div className="space-y-1">
            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Engine Status</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-slate-900 uppercase">Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Visualization */}
      <div className="bg-white border border-slate-100 rounded-[40px] p-8 lg:p-16 shadow-sm overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
          <Cpu className="w-64 h-64 text-slate-900" />
        </div>
        <div className="relative z-10 text-center space-y-2 mb-10">
          <h2 className="text-2xl font-black text-slate-900">Visualisasi Pipa Data</h2>
          <p className="text-sm text-slate-400 font-medium uppercase tracking-widest">End-to-End Intelligence Pipeline</p>
        </div>
        <DataFlowGraph />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Activity Monitor */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[32px] p-8 lg:p-10 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <Terminal className="w-5 h-5 text-emerald-500" />
                Aktivitas Node Terbaru
              </h2>
              <p className="text-xs text-slate-400 font-medium">Log aktivitas operasional mesin Phenom secara kronologis</p>
            </div>
            <button className="p-3 hover:bg-slate-50 rounded-xl transition-all">
              <RefreshCw className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          
          <div className="flex-1 max-h-[500px] overflow-y-auto no-scrollbar pr-2">
            <NodeActivityLogs logs={simulatedLogs} />
          </div>
        </div>

        {/* System Health & Inventory */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[32px] p-8 lg:p-10 shadow-2xl space-y-8">
            <h3 className="text-lg font-black text-white flex items-center gap-3">
              <HardDrive className="w-5 h-5 text-emerald-500" />
              Status Sistem
            </h3>
            <SystemStats />
          </div>

          <div className="bg-white border border-slate-100 rounded-[32px] p-8 lg:p-10 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
              <Database className="w-5 h-5 text-blue-500" />
              Inventori Dataset
            </h3>
            <div className="space-y-4">
              {recentUploads.slice(0, 4).map((u, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                  <div className="space-y-1">
                    <span className="block text-[10px] font-black text-slate-900 uppercase tracking-tight line-clamp-1">{u.region}</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{u.createdAt.toLocaleDateString()}</span>
                  </div>
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-500 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest rounded-2xl transition-all">
              Buka Katalog Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
