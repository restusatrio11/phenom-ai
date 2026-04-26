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
    <div className="p-4 lg:p-10 max-w-[1200px] mx-auto animate-in fade-in duration-700 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-slate-900 rounded-lg">
            <Settings className="w-4 h-4 text-emerald-500" />
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">System Configuration</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">Pengaturan <span className="text-slate-400">&</span> Info</h1>
        <p className="text-slate-500 font-medium max-w-2xl text-base">
          Informasi teknis mengenai arsitektur sistem Phenom AI dan identitas pengembang platform.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* About Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-100 rounded-[40px] p-10 lg:p-14 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform duration-1000" />
            <div className="relative z-10 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4">
                  <Info className="w-8 h-8 text-emerald-500" />
                  Tentang Phenom AI
                </h2>
                <p className="text-slate-600 font-medium leading-relaxed text-lg">
                  Phenom AI adalah platform intelijen data yang dirancang khusus untuk mendeteksi, 
                  menganalisis, dan memvalidasi fenomena sosial-ekonomi di Indonesia. Dengan menggabungkan 
                  kekuatan pemindaian dokumen (XLSX) dan analisis berita real-time, sistem ini memberikan 
                  wawasan yang akurat dengan tingkat kepercayaan yang terukur secara ilmiah.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {techStack.map((tech, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 group/item hover:border-emerald-200 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover/item:text-emerald-500 shadow-sm transition-all">
                      <tech.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">{tech.name}</span>
                      <span className="text-sm font-bold text-slate-800">{tech.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[40px] p-10 lg:p-14 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <Terminal className="w-40 h-40 text-white" />
            </div>
            <div className="relative z-10 space-y-6">
              <h3 className="text-xl font-black text-white flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                Integritas Sistem
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Sistem ini menggunakan algoritma verifikasi tiga lapis untuk memastikan data yang disajikan 
                bukan merupakan halusinasi AI. Setiap temuan wajib didukung oleh setidaknya dua sumber berita 
                valid atau satu data statistik resmi dari dataset yang diunggah.
              </p>
            </div>
          </div>
        </div>

        {/* Developer Section */}
        <div className="space-y-8">
          <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center space-y-6 relative overflow-hidden">
            <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-emerald-50 flex items-center justify-center shadow-inner relative z-10">
               <Heart className="w-12 h-12 text-emerald-500 fill-emerald-500" />
            </div>
            <div className="space-y-2 relative z-10">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">Lead Developer</span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Restu Satrio Pinanggih</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
                Architect of Phenom AI Intelligence Suite
              </p>
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors cursor-pointer">
                <Globe className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer">
                <Globe className="w-5 h-5" />
              </div>
            </div>
            <div className="pt-6 w-full border-t border-slate-50 text-[10px] font-black text-slate-300 uppercase tracking-widest">
              Built with Passion for Data Integrity
            </div>
          </div>

          <div className="bg-emerald-600 rounded-[40px] p-8 text-white shadow-xl shadow-emerald-900/20 text-center space-y-4">
            <h4 className="text-sm font-black uppercase tracking-widest">Versi Sistem</h4>
            <div className="text-4xl font-black tracking-tighter">v1.2.4-PRO</div>
            <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Production Build 2026.04</p>
          </div>
        </div>
      </div>
    </div>
  );
}
