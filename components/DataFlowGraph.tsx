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
    <div className="w-full py-10">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4 relative">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col lg:flex-row items-center gap-4 lg:gap-10 group relative z-10">
            <div className={`flex flex-col items-center gap-4 p-8 rounded-[32px] border-2 transition-all duration-700 ${
              activeStep === i 
              ? 'bg-white border-emerald-500 shadow-2xl shadow-emerald-500/20 scale-110' 
              : 'bg-slate-50/50 border-slate-100 opacity-60'
            }`}>
              <div className={`p-4 rounded-2xl ${
                activeStep === i ? 'bg-emerald-500 text-white animate-pulse' : 'bg-white text-slate-400'
              }`}>
                <step.icon className="w-8 h-8" />
              </div>
              <div className="text-center">
                <span className={`block text-[10px] font-black uppercase tracking-widest ${activeStep === i ? 'text-emerald-600' : 'text-slate-400'}`}>
                  Step {i + 1}
                </span>
                <h4 className="text-sm font-black text-slate-900 mt-1">{step.name}</h4>
                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">{step.desc}</p>
              </div>
            </div>
            
            {i < steps.length - 1 && (
              <div className="flex flex-col lg:row items-center justify-center">
                <ArrowRight className={`w-6 h-6 transition-colors duration-700 hidden lg:block ${
                  activeStep === i ? 'text-emerald-500 translate-x-2' : 'text-slate-200'
                }`} />
                <div className="w-[2px] h-10 bg-slate-100 lg:hidden" />
              </div>
            )}
          </div>
        ))}

        {/* Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-50 -translate-y-1/2 -z-0 hidden lg:block" />
      </div>
    </div>
  );
}

export function NodeActivityLogs({ logs }: { logs: any[] }) {
  return (
    <div className="space-y-4 font-mono">
      {logs.map((log, i) => (
        <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/5 border border-slate-100 group hover:bg-slate-900 hover:text-emerald-400 transition-all duration-300">
          <div className="mt-1">
            <div className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest opacity-40">{log.timestamp}</span>
              <span className="text-[8px] font-bold px-2 py-0.5 bg-white/10 rounded-full uppercase tracking-tighter">{log.node}</span>
            </div>
            <p className="text-xs font-bold leading-relaxed">{log.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SystemStats() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {[
        { label: 'Uptime', value: '99.98%', icon: Activity, color: 'emerald' },
        { label: 'Latency', value: '450ms', icon: Zap, color: 'amber' },
        { label: 'Nodes', value: '12 Active', icon: Globe, color: 'blue' },
        { label: 'Security', value: 'AES-256', icon: Lock, color: 'indigo' },
      ].map((s, i) => (
        <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-lg transition-all group">
          <s.icon className={`w-5 h-5 text-${s.color}-500 mb-4 group-hover:scale-110 transition-transform`} />
          <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</span>
          <span className="text-xl font-black text-slate-900 tracking-tight">{s.value}</span>
        </div>
      ))}
    </div>
  );
}
