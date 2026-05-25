import { 
  Settings, 
  Info, 
  Code2, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Terminal, 
  Heart,
  Globe,
  Zap
} from 'lucide-react';

export default function SettingsPage() {
  const techStack = [
    { name: 'Framework', value: 'Next.js 16 (App Router)', icon: Globe },
    { name: 'Engine Database', value: 'Prisma + PostgreSQL (Neon)', icon: Database },
    { name: 'AI Architecture', value: 'OpenRouter Intelligence Node', icon: Cpu },
    { name: 'Logic Layer', value: 'TypeScript + Zod Validation', icon: Code2 },
    { name: 'Styling', value: 'Tailwind CSS (Premium Investigator Theme)', icon: Zap },
  ];

  return (
    <div className="p-4 lg:p-10 max-w-[1200px] mx-auto animate-in fade-in duration-1000 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-slate-900 border border-white/5 rounded-xl shadow-2xl">
            <Settings className="w-5 h-5 text-emerald-400" />
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/60">System Configuration</span>
        </div>
        <h1 className="text-3xl md:text-6xl font-black text-white tracking-tighter leading-none">Pengaturan <span className="text-slate-500 font-light">&</span> Info</h1>
        <p className="text-slate-400 font-medium max-w-2xl text-base leading-relaxed">
          Informasi teknis mengenai arsitektur sistem Phenom AI dan identitas pengembang platform dalam ekosistem intelijen.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* About Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[40px] p-10 lg:p-14 shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
            <div className="relative z-10 space-y-10">
              <div className="space-y-5">
                <h2 className="text-3xl font-black text-white flex items-center gap-5 tracking-tight">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                    <Info className="w-8 h-8 text-emerald-400" />
                  </div>
                  Tentang Phenom AI
                </h2>
                <p className="text-slate-400 font-medium leading-relaxed text-lg italic">
                  "Phenom AI adalah platform intelijen data yang dirancang khusus untuk mendeteksi, 
                  menganalisis, dan memvalidasi fenomena sosial-ekonomi di Indonesia melalui penggabungan 
                  pemindaian dokumen statistik dan analisis narasi real-time."
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {techStack.map((tech, i) => (
                  <div key={i} className="flex items-center gap-5 p-6 bg-white/5 rounded-[24px] border border-white/5 group/item hover:border-emerald-500/30 transition-all shadow-xl hover:bg-emerald-500/5">
                    <div className="w-12 h-12 rounded-[18px] bg-slate-800 border border-white/5 flex items-center justify-center text-slate-500 group-hover/item:text-emerald-400 group-hover/item:border-emerald-500/20 shadow-lg transition-all">
                      <tech.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{tech.name}</span>
                      <span className="text-sm font-extrabold text-slate-200 group-hover/item:text-white transition-colors">{tech.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-[#020617] border border-emerald-500/20 rounded-[40px] p-10 lg:p-14 shadow-[0_0_60px_rgba(16,185,129,0.1)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
              <Terminal className="w-48 h-48 text-white" />
            </div>
            <div className="relative z-10 space-y-6">
              <h3 className="text-2xl font-black text-white flex items-center gap-4 tracking-tight">
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
                Integritas Sistem
              </h3>
              <p className="text-slate-400 text-base leading-relaxed font-medium">
                Sistem ini menggunakan algoritma verifikasi tiga lapis untuk memastikan data yang disajikan 
                bukan merupakan halusinasi AI. Setiap temuan wajib didukung oleh setidaknya dua sumber berita 
                valid atau satu data statistik resmi dari dataset yang diunggah untuk menjaga standar akurasi yang ketat.
              </p>
            </div>
          </div>
        </div>

        {/* Developer Section */}
        <div className="space-y-10">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[40px] p-10 shadow-2xl flex flex-col items-center text-center space-y-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
            
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="w-36 h-32 rounded-[40px] bg-slate-800 border-4 border-emerald-500/40 flex items-center justify-center shadow-2xl relative z-10 rotate-3 group-hover:rotate-0 transition-transform duration-700 overflow-hidden">
                 <img src="/logo.png" alt="Developer Logo" className="w-full h-full object-cover opacity-80" />
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Project Architect</span>
              <h3 className="text-2xl font-black text-white tracking-tight">Restu Satrio Pinanggih</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[200px]">
                Lead Developer of Phenom AI Intelligence Suite
              </p>
            </div>

            <div className="flex items-center gap-5 relative z-10">
              {[1, 2].map((i) => (
                <div key={i} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all cursor-pointer shadow-lg active:scale-90">
                  <Globe className="w-5 h-5" />
                </div>
              ))}
            </div>
            
            <div className="pt-8 w-full border-t border-white/5 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] relative z-10">
              Built with Passion for Data Integrity
            </div>
          </div>

          <div className="bg-emerald-600 border border-emerald-400/20 rounded-[40px] p-10 text-white shadow-[0_20px_50px_rgba(16,185,129,0.3)] text-center space-y-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_3s_infinite] pointer-events-none" />
            <h4 className="text-xs font-black uppercase tracking-[0.3em] opacity-80">Versi Sistem</h4>
            <div className="text-5xl font-black tracking-tighter">v1.2.4<span className="text-emerald-300"> PRO</span></div>
            <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.4em] mt-4">Production Build 2026.04</p>
          </div>
        </div>
      </div>
    </div>
  );
}
