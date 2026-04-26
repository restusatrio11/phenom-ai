'use client';

import { useState } from 'react';
import { Info, X } from 'lucide-react';

interface AccuracyDetailProps {
  justification?: string;
  evaluasi?: {
    skor_kesesuaian_angka: number;
    skor_kredibilitas: number;
    skor_dukungan: number;
    penjelasan_runtut: string;
  };
  label?: string;
}

export default function AccuracyDetail({ justification, evaluasi, label = "Metodologi Akurasi" }: AccuracyDetailProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Fallback for older data that doesn't have justification or evaluasi
  const displayJustification = evaluasi?.penjelasan_runtut || justification || 
    "Perhitungan akurasi didasarkan pada validitas sumber referensi, konsistensi data statistik dengan temuan lapangan, dan tingkat kebaruan informasi yang dikumpulkan oleh mesin Phenom AI.";

  return (
    <div className="relative inline-block ml-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-emerald-500 transition-all active:scale-90"
        title="Lihat detail perhitungan"
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 bottom-full mb-4 w-72 md:w-96 bg-slate-900 text-white rounded-2xl p-6 shadow-2xl z-[70] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">{label}</span>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {evaluasi && (
              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Kesesuaian Angka (0.5)</span>
                  <span className="font-bold text-emerald-400">+{evaluasi.skor_kesesuaian_angka.toFixed(2)}</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${(evaluasi.skor_kesesuaian_angka / 0.5) * 100}%` }} />
                </div>
                
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Kredibilitas Sumber (0.3)</span>
                  <span className="font-bold text-emerald-400">+{evaluasi.skor_kredibilitas.toFixed(2)}</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${(evaluasi.skor_kredibilitas / 0.3) * 100}%` }} />
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Dukungan Data (0.2)</span>
                  <span className="font-bold text-emerald-400">+{evaluasi.skor_dukungan.toFixed(2)}</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${(evaluasi.skor_dukungan / 0.2) * 100}%` }} />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <span className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">Penjelasan Runtut</span>
              <p className="text-xs leading-relaxed font-medium text-slate-300 italic">
                "{displayJustification}"
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest italic">Source-Based Accuracy Logic</span>
              </div>
              <span className="text-[10px] font-black text-emerald-400">
                TOTAL: {((evaluasi ? (evaluasi.skor_kesesuaian_angka + evaluasi.skor_kredibilitas + evaluasi.skor_dukungan) : 0) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="absolute top-full right-4 w-3 h-3 bg-slate-900 rotate-45 -mt-1.5" />
          </div>
        </>
      )}
    </div>
  );
}
