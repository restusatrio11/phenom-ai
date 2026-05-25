'use client';

import { 
  Database, 
  Search, 
  Cpu, 
  FileText, 
  ArrowRight,
  Activity,
  Zap,
  Globe,
  Lock
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DataFlowGraph() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { name: 'Data Ingestion', icon: Database, color: 'blue', desc: 'Parsing .xlsx files' },
    { name: 'Node Scraping', icon: Search, color: 'amber', desc: 'Fetching news articles' },
    { name: 'LLM Synthesis', icon: Cpu, color: 'emerald', desc: 'AI logical reasoning' },
    { name: 'Intelligence Report', icon: FileText, color: 'indigo', desc: 'Generating findings' },
  ];

  return (
    <div className="w-full py-10 relative">
      {/* Dynamic Connector Line */}
      <div className="absolute top-[108px] left-[15%] right-[15%] h-[2px] bg-white/5 -z-0 hidden lg:block overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent w-[30%] animate-[shimmer_3s_infinite] transition-all duration-700"
          style={{ marginLeft: `${activeStep * 25}%` }}
        />
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-6 relative">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col lg:row items-center gap-6 group relative z-10">
            <div className={`flex flex-col items-center gap-6 p-10 rounded-[40px] border transition-all duration-700 w-72 lg:w-64 ${
              activeStep === i 
              ? 'bg-[#020617]/80 border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.15)] scale-110' 
              : 'bg-white/5 border-white/5 opacity-40 grayscale group-hover:opacity-60 transition-all'
            }`}>
              <div className={`p-5 rounded-[24px] relative ${
                activeStep === i ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/40' : 'bg-slate-800 text-slate-500'
              }`}>
                {activeStep === i && (
                  <div className="absolute inset-0 bg-emerald-400 rounded-[24px] animate-ping opacity-20" />
                )}
                <step.icon className="w-8 h-8 relative z-10" />
              </div>
              <div className="text-center space-y-2">
                <span className={`block text-[10px] font-black uppercase tracking-[0.3em] ${activeStep === i ? 'text-emerald-400' : 'text-slate-600'}`}>
                  Phase 0{i + 1}
                </span>
                <h4 className="text-base font-black text-white tracking-tight">{step.name}</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{step.desc}</p>
              </div>
            </div>
            
            {i < steps.length - 1 && (
              <div className="flex flex-col items-center justify-center">
                <ArrowRight className={`w-6 h-6 transition-all duration-700 hidden lg:block ${
                  activeStep === i ? 'text-emerald-500 translate-x-2' : 'text-slate-800'
                }`} />
                <div className={`w-[2px] h-12 transition-colors duration-700 lg:hidden ${
                   activeStep === i ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-slate-800'
                }`} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function NodeActivityLogs({ logs }: { logs: any[] }) {
  return (
    <div className="space-y-4 font-mono">
      {logs.map((log, i) => (
        <div key={i} className="flex items-start gap-6 p-5 rounded-2xl bg-white/5 border border-white/5 group hover:bg-slate-900 transition-all duration-500 hover:border-emerald-500/20 relative overflow-hidden">
          <div className="absolute left-0 top-0 w-1 h-full bg-emerald-500/0 group-hover:bg-emerald-500 transition-all" />
          <div className="mt-1.5 relative">
            <div className={`w-2.5 h-2.5 rounded-full ${log.status === 'success' ? 'bg-emerald-500' : 'bg-amber-500'} shadow-[0_0_8px_rgba(16,185,129,0.4)]`} />
            <div className={`absolute inset-0 rounded-full ${log.status === 'success' ? 'bg-emerald-500' : 'bg-amber-500'} animate-ping opacity-20`} />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 group-hover:text-slate-400 transition-colors">{log.timestamp}</span>
              <span className="text-[9px] font-black px-3 py-1 bg-slate-800 text-slate-400 rounded-lg uppercase tracking-widest border border-white/5 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all">{log.node}</span>
            </div>
            <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors leading-relaxed">
              {log.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SystemStats() {
  return (
    <div className="grid grid-cols-2 gap-5 relative z-10">
      {[
        { label: 'Uptime', value: '99.98%', icon: Activity, color: 'emerald' },
        { label: 'Latency', value: '450ms', icon: Zap, color: 'amber' },
        { label: 'Nodes', value: '12 Active', icon: Globe, color: 'blue' },
        { label: 'Security', value: 'AES-256', icon: Lock, color: 'indigo' },
      ].map((s, i) => (
        <div key={i} className="p-6 bg-[#020617]/40 backdrop-blur-xl border border-white/5 rounded-3xl shadow-xl hover:border-emerald-500/20 transition-all group cursor-default">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
            <s.icon className={`w-5 h-5 text-emerald-400`} />
          </div>
          <span className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">{s.label}</span>
          <span className="text-xl font-black text-white tracking-tighter">{s.value}</span>
        </div>
      ))}
    </div>
  );
}
