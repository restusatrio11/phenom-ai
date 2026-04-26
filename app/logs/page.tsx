'use client';

import { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, AlertCircle, CheckCircle2, Search, Trash2 } from 'lucide-react';

const INITIAL_LOGS = [
  { type: 'info', msg: 'System initialized successfully', time: '05:12:01' },
  { type: 'success', msg: 'Database connection established: PostgreSQL', time: '05:12:02' },
  { type: 'info', msg: 'Phenom Engine Node-01 ready for operation', time: '05:12:03' },
  { type: 'warning', msg: 'API limit reaching 80% capacity on secondary node', time: '05:13:45' },
];

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const logEndRef = useRef<HTMLDivElement>(null);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs');
      const data = await res.json();
      if (Array.isArray(data)) {
        setLogs(data.map(l => ({
          type: l.action === 'LOGIN' ? 'success' : 'info',
          msg: `${l.user.nama_lengkap} (${l.user.role}): ${l.action} - ${l.details || ''}`,
          time: new Date(l.timestamp).toLocaleTimeString('id-ID')
        })));
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const filteredLogs = logs.filter(l => l.msg.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="p-4 lg:p-10 max-w-[1600px] mx-auto animate-in fade-in duration-700 h-screen flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-slate-900 rounded-lg">
              <Terminal className="w-4 h-4 text-emerald-500" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">System Kernel Logs</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Log <span className="text-slate-400">Sistem</span></h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search kernel events..."
              className="w-full bg-white border border-slate-100 rounded-xl pl-12 pr-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/40 transition-all shadow-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setLogs([])}
            className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:text-rose-500 transition-all"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Terminal View */}
      <div className="flex-1 bg-[#0f172a] rounded-[32px] shadow-2xl border border-slate-800 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
            </div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">phenom-os v0.1.0 (root)</span>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-3 h-3 text-emerald-500/50" />
            <span className="text-[9px] font-black text-emerald-500/50 uppercase tracking-widest">Secured</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 font-mono space-y-3 custom-scrollbar">
          {filteredLogs.map((log, i) => (
            <div key={i} className="flex items-start gap-6 group animate-in slide-in-from-left-2 duration-300">
              <span className="text-[10px] text-slate-600 shrink-0 select-none">[{log.time}]</span>
              <div className="flex items-start gap-4">
                {log.type === 'info' && <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded uppercase font-black tracking-tighter">INF</span>}
                {log.type === 'warning' && <span className="text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded uppercase font-black tracking-tighter">WRN</span>}
                {log.type === 'success' && <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded uppercase font-black tracking-tighter">OK</span>}
                {log.type === 'error' && <span className="text-[10px] px-2 py-0.5 bg-rose-500/10 text-rose-400 rounded uppercase font-black tracking-tighter">ERR</span>}
                
                <p className="text-xs text-slate-300 leading-relaxed group-hover:text-white transition-colors">
                  {log.msg}
                </p>
              </div>
            </div>
          ))}
          <div ref={logEndRef} />
        </div>

        <div className="px-8 py-3 bg-white/5 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active</span>
            </div>
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{filteredLogs.length} Events Logged</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-1 bg-emerald-500/20 rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-emerald-500 animate-[loading_2s_infinite]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
