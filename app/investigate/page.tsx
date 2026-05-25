import UploadForm from "@/app/UploadForm";

export default function InvestigatePage() {
  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden">
      {/* Background Decor */}
      <div 
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(16, 185, 129, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 185, 129, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />

      <div className="relative z-10 p-8 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-transparent rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500/80">
                Core Investigation Unit
              </span>
            </div>
            <h1 className="text-5xl font-extrabold text-white tracking-tighter">
              Luncurkan <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Investigasi</span>
            </h1>
            <p className="text-slate-400 font-medium max-w-2xl leading-relaxed">
              Mulai analisis mendalam dengan mengorelasikan data statistik internal dan fenomena real-time dari seluruh jaringan digital.
            </p>
          </div>

          <div className="shrink-0">
            <div className="bg-slate-900/50 backdrop-blur-md border border-emerald-500/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Status Enkripsi</div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute inset-0 opacity-75" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500 relative" />
                </div>
                <span className="text-sm font-bold text-emerald-400 tracking-tight">Terminal Aktif</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative group">
          {/* Decorative Border Glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-[32px] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
          
          <div className="relative bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[32px] p-2 shadow-2xl">
            <div className="bg-[#0f172a]/30 rounded-[28px] p-8 md:p-16 border border-emerald-500/5">
              <div className="max-w-3xl mx-auto">
                <UploadForm />
              </div>
            </div>
          </div>
        </div>

        {/* System Footer Info */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5 pt-8 px-4">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Latency</span>
              <span className="text-xs font-bold text-slate-400">~240ms</span>
            </div>
            <div className="w-px h-8 bg-white/5" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Security</span>
              <span className="text-xs font-bold text-slate-400">SSL-Encrypted</span>
            </div>
          </div>
          
          <p className="text-[10px] text-slate-600 font-bold tracking-[0.2em] uppercase">
            Phenom AI Protocol v4.0.1
          </p>
        </div>
      </div>
    </div>
  );
}

