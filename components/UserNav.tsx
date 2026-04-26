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
        className="flex items-center gap-3 p-1.5 pl-4 pr-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group shadow-2xl shadow-slate-900/20"
      >
        <div className="flex flex-col items-end hidden sm:flex">
          <span className="text-xs font-bold text-slate-200 leading-none mb-0.5">{user.nama_lengkap || user.username}</span>
          <div className="flex items-center gap-1.5">
            <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
              user.role === 'ADMIN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
            }`}>
              {user.role}
            </span>
          </div>
        </div>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
          <User className="w-5 h-5" />
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-3 py-2 mb-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Identitas Sistem</p>
              <div className="flex items-center gap-2 text-emerald-400">
                <Shield className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">{user.role === 'ADMIN' ? 'Administrator' : 'Personil Terverifikasi'}</span>
              </div>
              <p className="text-[9px] text-slate-500 mt-1 truncate">{user.email}</p>
            </div>
            <div className="h-px bg-slate-800 mx-2 mb-2" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Keluar Sesi
            </button>
          </div>
        </>
      )}
    </div>
  );
}
