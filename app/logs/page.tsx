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
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-slate-900 border border-white/5 rounded-xl shadow-2xl">
              <Terminal className="w-5 h-5 text-emerald-400" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/60">System Kernel Logs</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none">Pencatatan <span className="text-slate-500 font-light">Sistem</span></h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Filter kernel events..."
              className="w-full bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-xs font-bold text-slate-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/40 transition-all shadow-2xl"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setLogs([])}
            className="p-4 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl hover:text-rose-400 hover:border-rose-500/20 transition-all active:scale-95"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Terminal View */}
      <div className="flex-1 bg-[#020617]/60 backdrop-blur-2xl rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden flex flex-col relative group">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
        
        <div className="flex items-center justify-between px-10 py-5 border-b border-white/5 bg-white/5 relative z-10">
          <div className="flex items-center gap-5">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/30" />
              <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/30" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">phenom-kernel-node.01</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Encrypted Session</span>
            </div>
            <Shield className="w-4 h-4 text-slate-700" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-10 font-mono space-y-4 custom-scrollbar relative z-10">
          {filteredLogs.map((log, i) => (
            <div key={i} className="flex items-start gap-8 group animate-in slide-in-from-left-4 duration-500 hover:bg-white/5 p-2 -m-2 rounded-xl transition-colors">
              <span className="text-[11px] text-slate-600 shrink-0 select-none font-bold">[{log.time}]</span>
              <div className="flex items-start gap-5">
                {log.type === 'info' && <span className="text-[9px] px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-md uppercase font-black tracking-tighter border border-blue-500/20">INF</span>}
                {log.type === 'warning' && <span className="text-[9px] px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-md uppercase font-black tracking-tighter border border-amber-500/20">WRN</span>}
                {log.type === 'success' && <span className="text-[9px] px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-md uppercase font-black tracking-tighter border border-emerald-500/20">OK</span>}
                {log.type === 'error' && <span className="text-[9px] px-2.5 py-1 bg-rose-500/10 text-rose-400 rounded-md uppercase font-black tracking-tighter border border-rose-500/20">ERR</span>}
                
                <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-100 transition-colors font-medium">
                  {log.msg}
                </p>
              </div>
            </div>
          ))}
          <div ref={logEndRef} />
          {filteredLogs.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-20 py-40">
              <Terminal className="w-20 h-20 mb-6 text-slate-500" />
              <p className="text-sm font-black uppercase tracking-[0.5em] text-slate-500">Listening for events...</p>
            </div>
          )}
        </div>

        <div className="px-10 py-4 bg-white/5 border-t border-white/5 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Link</span>
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{filteredLogs.length} Events Logged</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Buffer Status</span>
            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
              <div className="w-3/4 h-full bg-emerald-500/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

