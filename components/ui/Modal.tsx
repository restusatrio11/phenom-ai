'use client';

import React, { useEffect } from 'react';
import { X, AlertTriangle, Shield } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type?: 'danger' | 'info';
  confirmText?: string;
  cancelText?: string;
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'info',
  confirmText = 'Konfirmasi',
  cancelText = 'Batal'
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-[#020617]/90 backdrop-blur-3xl border border-white/10 rounded-[32px] shadow-[0_0_80px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="p-8 relative z-10">
          <div className="flex items-center gap-5 mb-6">
            <div className={`
              p-4 rounded-2xl border
              ${type === 'danger' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}
            `}>
              {type === 'danger' ? <AlertTriangle className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">{title}</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">System Confirmation</p>
            </div>
          </div>
          
          <p className="text-slate-400 leading-relaxed font-medium">
            {message}
          </p>
        </div>
        
        <div className="flex items-center justify-end gap-4 px-8 py-6 bg-white/5 border-t border-white/5 relative z-10">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            className={`
              px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-2xl
              ${type === 'danger' 
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'}
            `}
          >
            {confirmText}
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
