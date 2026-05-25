'use client';

import { useState } from 'react';
import { User, LogOut, ChevronDown, Shield } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface UserNavProps {
  user: any;
}

export default function UserNav({ user }: UserNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        showToast("Berhasil keluar.", "info");
        window.location.href = '/login';
      }
    } catch (err) {
      console.error(err);
      showToast("Gagal logout.", "error");
    }
  };

  if (!user) {
    return (
      <a 
        href="/login" 
        className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold px-5 py-2 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
      >
        Masuk
      </a>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 pl-4 pr-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/5 hover:border-emerald-500/30 transition-all group shadow-2xl shadow-emerald-900/10"
      >
        <div className="flex flex-col items-end hidden sm:flex">
          <span className="text-xs font-bold text-slate-200 leading-none mb-1 group-hover:text-emerald-400 transition-colors">{user.nama_lengkap || user.username}</span>
          <div className="flex items-center gap-1.5">
            <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md border ${
              user.role === 'ADMIN' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-white/5'
            }`}>
              {user.role}
            </span>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500 blur opacity-20 group-hover:opacity-40 transition-opacity" />
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40">
            <User className="w-5 h-5" />
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-4 w-64 bg-[#020617]/80 backdrop-blur-2xl border border-white/5 rounded-[24px] shadow-[0_0_50px_rgba(0,0,0,0.5)] z-50 p-3 animate-in fade-in slide-in-from-top-4 duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="px-4 py-4 mb-2 relative z-10">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-3">Operator ID</p>
              <div className="flex items-center gap-3 text-emerald-400">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-extrabold tracking-tight">{user.role === 'ADMIN' ? 'Level 01: Admin' : 'Authorized Personnel'}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 font-medium truncate opacity-60">{user.email}</p>
            </div>
            <div className="h-px bg-white/5 mx-2 mb-2" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all active:scale-95 group/logout"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Keluar Sesi
            </button>
          </div>
        </>
      )}
    </div>
  );
}
