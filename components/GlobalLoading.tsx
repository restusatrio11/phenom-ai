'use client';

import { useLoading } from '@/context/LoadingContext';

export default function GlobalLoading() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900 animate-in fade-in duration-500">
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      >
        <source src="/video loading.mp4" type="video/mp4" />
      </video>
      
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/20 animate-pulse border-2 border-emerald-500/30 bg-slate-800">
          <img src="/logo.png" alt="Phenom Logo" className="w-full h-full object-cover" />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-2xl md:text-3xl font-black text-white tracking-widest uppercase animate-in slide-in-from-bottom-4 duration-700">
            Menganalisis Menggunakan Phenom
          </h3>
          <div className="flex items-center justify-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] animate-pulse">
            Harap Ditunggu
          </p>
        </div>
      </div>
    </div>
  );
}
