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
        fixed left-0 top-0 h-screen bg-white border-r border-slate-100 z-50 flex flex-col shadow-[20px_0_60px_rgba(0,0,0,0.01)]
        transition-all duration-500 ease-in-out
        ${isCollapsed ? 'w-24' : 'w-72'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Toggle Button for Desktop */}
        <button 
          onClick={onToggle}
          className="hidden lg:flex absolute -right-4 top-10 w-8 h-8 bg-white border border-slate-100 rounded-full items-center justify-center shadow-lg hover:bg-slate-50 transition-all z-50 text-slate-400 hover:text-slate-900"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <div className={`transition-all duration-500 flex-1 overflow-y-auto custom-scrollbar ${isCollapsed ? 'p-6' : 'p-10'}`}>
          <div className={`flex items-center gap-4 transition-all duration-500 ${isCollapsed ? 'justify-center mb-10' : 'mb-14'}`}>
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-2xl shadow-emerald-200 shrink-0">
              <img src="/logo.png" alt="Phenom Logo" className="w-full h-full object-cover" />
            </div>
            {!isCollapsed && (
              <div className="animate-in fade-in duration-700">
                <h1 className="text-xl font-black text-slate-900 leading-none tracking-tight">PHENOM</h1>
                <p className="text-[10px] font-bold text-emerald-600/50 tracking-[0.2em] uppercase mt-1.5">Intelligence Suite</p>
              </div>
            )}
          </div>

          <nav className="space-y-8">
            {navGroups.map((group, gIndex) => (
              <div key={gIndex} className="space-y-4">
                {!isCollapsed && (
                  <div className="px-6">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">{group.title}</span>
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
                        ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
                        : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 transition-transform duration-500 group-hover:scale-110 shrink-0 ${pathname === item.href ? 'text-emerald-600' : 'text-slate-300'}`} />
                      {!isCollapsed && <span className="animate-in fade-in duration-500">{item.name}</span>}
                      {pathname === item.href && !isCollapsed && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
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
            className={`flex items-center gap-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all group ${
              isCollapsed ? 'justify-center px-0' : 'px-6'
            }`}
          >
            <Settings className="w-5 h-5 text-slate-300 group-hover:rotate-45 transition-transform duration-700 shrink-0" />
            {!isCollapsed && <span className="animate-in fade-in duration-500">Pengaturan</span>}
          </Link>
          <Link 
            href="/investigate"
            onClick={() => setIsMobileOpen(false)}
            className={`w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold transition-all duration-500 flex items-center justify-center gap-4 shadow-2xl shadow-slate-200 hover:shadow-emerald-200 ${
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
