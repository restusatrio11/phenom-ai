'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: string[] | Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  label?: string;
  icon?: React.ReactNode;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "-- Pilih --",
  searchPlaceholder = "Cari...",
  disabled = false,
  label,
  icon
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options to { value, label } format
  const normalizedOptions = useMemo(() => {
    return options.map(opt => {
      if (typeof opt === 'string') {
        return { value: opt, label: opt };
      }
      return opt;
    });
  }, [options]);

  const filteredOptions = useMemo(() => {
    return normalizedOptions.filter(opt =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [normalizedOptions, searchTerm]);

  const selectedOption = normalizedOptions.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`space-y-3 ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`} ref={containerRef}>
      {label && (
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 px-1">
          {icon}
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-slate-800/40 backdrop-blur-xl border border-white/5 rounded-2xl px-6 py-5 text-white font-bold text-sm flex items-center justify-between transition-all shadow-xl hover:border-emerald-500/30 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 ${isOpen ? 'border-emerald-500/40 ring-4 ring-emerald-500/10' : ''}`}
        >
          <span className={selectedOption ? 'text-white' : 'text-slate-500'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-[100] w-full mt-3 bg-[#0f172a] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Search Input */}
            <div className="p-3 border-b border-white/5 bg-white/5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  autoFocus
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-200 focus:outline-none focus:border-emerald-500/40 transition-all"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Options List */}
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full px-5 py-3.5 text-left text-xs font-bold transition-all flex items-center justify-between group
                      ${value === opt.value ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                    `}
                  >
                    <span className="truncate">{opt.label}</span>
                    {value === opt.value && <Check className="w-4 h-4" />}
                    {value !== opt.value && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/0 group-hover:bg-emerald-500/40 transition-all" />}
                  </button>
                ))
              ) : (
                <div className="px-5 py-8 text-center">
                  <p className="text-xs font-black text-slate-600 uppercase tracking-widest">Tidak ada hasil</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
