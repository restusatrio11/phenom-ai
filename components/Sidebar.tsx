'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutGrid,
  Search, 
  Database, 
  BarChart3,
  Clock,
  Terminal,
  Settings, 
  Plus, 
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ 
  user, 
  isCollapsed = false, 
  onToggle 
}: { 
  user: any; 
  isCollapsed?: boolean; 
  onToggle?: () => void 
}) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!user || pathname === '/login') return null;

  const isPegawai = user.role === 'PEGAWAI';

  const navGroups = [
    {
      title: 'Operasional',
      items: [
        { name: 'Dashboard', icon: LayoutGrid, href: '/' },
        { name: 'Investigasi', icon: Search, href: '/investigate' },
        { name: 'Riwayat', icon: Clock, href: '/riwayat' },
      ]
    },
    ...(!isPegawai ? [
      {
        title: 'Intelijen',
        items: [
          { name: 'Wawasan', icon: BarChart3, href: '/insights' },
          { name: 'Aliran Data', icon: Database, href: '/data-stream' },
        ]
      },
      {
        title: 'Sistem',
        items: [
          { name: 'Log Sistem', icon: Terminal, href: '/logs' },
          { name: 'Manajemen User', icon: Settings, href: '/users' },
        ]
      }
    ] : [])
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-6 left-6 z-[60] p-4 bg-white border border-slate-100 rounded-xl shadow-xl text-slate-900 active:scale-90 transition-all"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[50] animate-in fade-in duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed left-0 top-0 h-screen bg-slate-900/40 backdrop-blur-2xl border-r border-white/5 z-50 flex flex-col shadow-2xl
        transition-all duration-500 ease-in-out
        ${isCollapsed ? 'w-24' : 'w-72'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Toggle Button for Desktop */}
        <button 
          onClick={onToggle}
          className="hidden lg:flex absolute -right-4 top-10 w-8 h-8 bg-slate-800 border border-white/10 rounded-full items-center justify-center shadow-lg hover:bg-slate-700 transition-all z-50 text-slate-400 hover:text-emerald-400"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <div className={`transition-all duration-500 flex-1 overflow-y-auto custom-scrollbar ${isCollapsed ? 'p-6' : 'p-10'}`}>
          <div className={`flex items-center gap-4 transition-all duration-500 ${isCollapsed ? 'justify-center mb-10' : 'mb-14'}`}>
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-emerald-500/20 shadow-2xl shrink-0">
                <img src="/logo.png" alt="Phenom Logo" className="w-full h-full object-cover" />
              </div>
            </div>
            {!isCollapsed && (
              <div className="animate-in fade-in duration-700">
                <h1 className="text-xl font-black text-white leading-none tracking-tight">PHENOM</h1>
                <p className="text-[10px] font-bold text-emerald-500/60 tracking-[0.2em] uppercase mt-1.5">Intelligence Suite</p>
              </div>
            )}
          </div>

          <nav className="space-y-8">
            {navGroups.map((group, gIndex) => (
              <div key={gIndex} className="space-y-4">
                {!isCollapsed && (
                  <div className="px-6">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">{group.title}</span>
                  </div>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <Link 
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-5 py-4 text-[11px] font-bold uppercase tracking-widest transition-all relative rounded-xl group ${
                        isCollapsed ? 'justify-center px-0' : 'px-6'
                      } ${
                        pathname === item.href 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 shadow-lg shadow-emerald-900/10' 
                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 transition-transform duration-500 group-hover:scale-110 shrink-0 ${pathname === item.href ? 'text-emerald-400' : 'text-slate-600'}`} />
                      {!isCollapsed && <span className="animate-in fade-in duration-500">{item.name}</span>}
                      {pathname === item.href && !isCollapsed && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className={`mt-auto transition-all duration-500 ${isCollapsed ? 'p-6' : 'p-10'} space-y-8`}>
          <Link 
            href="/pengaturan"
            onClick={() => setIsMobileOpen(false)}
            className={`flex items-center gap-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-emerald-400 transition-all group ${
              isCollapsed ? 'justify-center px-0' : 'px-6'
            }`}
          >
            <Settings className="w-5 h-5 text-slate-600 group-hover:rotate-45 transition-transform duration-700 shrink-0" />
            {!isCollapsed && <span className="animate-in fade-in duration-500">Pengaturan</span>}
          </Link>
          <Link 
            href="/investigate"
            onClick={() => setIsMobileOpen(false)}
            className={`w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all duration-500 flex items-center justify-center gap-4 shadow-xl shadow-emerald-900/20 ${
              isCollapsed ? 'h-12 w-12 mx-auto rounded-xl p-0' : 'py-5 px-6 rounded-xl text-[10px] uppercase tracking-[0.3em]'
            }`}
          >
            <Plus className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="animate-in fade-in duration-500">Analisis Baru</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
