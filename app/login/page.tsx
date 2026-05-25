'use client';

import { useState, useEffect, Suspense } from 'react';
import { 
  LogIn, 
  Key, 
  Briefcase,
  RefreshCcw,
  HelpCircle,
  Loader2,
  Target,
  CircleAlert,
  Smartphone
} from 'lucide-react';
import { getLoginUrl } from '@/lib/sso';
import { useToast } from '@/context/ToastContext';
import { useSearchParams } from 'next/navigation';

function LoginContent() {
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  
  const [activeTab, setActiveTab] = useState<'sso' | 'ordinary'>('sso');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const err = searchParams.get('error');
    if (err) {
      setErrorMsg(decodeURIComponent(err));
      showToast("Otorisasi Gagal. Silakan coba lagi.", "error");
    }
  }, [searchParams, showToast]);

  const SSO_SERVER_URL = "https://otp-dev.bps.web.id"; 

  const handleSSOLogin = () => {
    setLoading(true);
    try {
      const currentUrl = window.location.origin + "/api/auth/callback";
      const loginUrl = getLoginUrl(SSO_SERVER_URL, currentUrl);
      window.location.href = loginUrl;
    } catch (err) {
      console.error(err);
      showToast("Gagal menginisialisasi SSO.", "error");
      setLoading(false);
    }
  };

  const handleOrdinaryLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal masuk');
      }

      showToast(`Otorisasi Berhasil. Selamat datang, ${data.user.nama_lengkap}!`, "success");
      window.location.href = "/";
    } catch (err: any) {
      setErrorMsg(err.message);
      showToast(err.message, "error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#020617]">
      {/* Animated Grid Background */}
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(16, 185, 129, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 185, 129, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Background Gradient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse z-0" />

      <div className="w-full max-w-[460px] relative z-10 animate-in fade-in zoom-in duration-1000">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-emerald-500/20 rounded-[32px] p-10 shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden">
          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none" />
          
          {/* Header Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative w-24 h-24 rounded-3xl overflow-hidden border-2 border-emerald-500/30 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <img src="/logo.png" alt="Phenom AI Logo" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent mb-2">
              Phenom AI
            </h1>
            <p className="text-[10px] font-black text-emerald-500 tracking-[0.4em] uppercase">
              Sistem Analisis Fenomena Universal
            </p>
          </div>

          {errorMsg && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-4">
              <CircleAlert className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-xs text-red-200 font-medium leading-relaxed">{errorMsg}</p>
            </div>
          )}

          {/* Tab Switcher - Segmented Control Style */}
          <div className="flex p-1 bg-slate-800/50 rounded-2xl mb-10 border border-slate-700/50">
            <button 
              onClick={() => setActiveTab('sso')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'sso' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Smartphone className="w-4 h-4" />
              SSO BPS Sumut
            </button>
            <button 
              onClick={() => setActiveTab('ordinary')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'ordinary' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Briefcase className="w-4 h-4" />
              Akun Internal
            </button>
          </div>

          {activeTab === 'sso' ? (
            <div className="space-y-8">
              <div className="text-center px-6">
                <p className="text-sm text-slate-300 leading-relaxed">
                  Akses instan menggunakan akun Single Sign-On BPS Sumatera Utara.
                </p>
              </div>
              <button 
                onClick={handleSSOLogin}
                disabled={loading}
                className="w-full group relative py-4 px-6 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-2xl font-bold text-base transition-all duration-300 shadow-xl shadow-emerald-900/20 active:scale-[0.98] disabled:opacity-50"
              >
                <div className="flex items-center justify-center gap-3">
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <LogIn className="w-6 h-6" />}
                  <span>Masuk via SSO BPS</span>
                </div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleOrdinaryLogin} className="space-y-8">
              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-500">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <input 
                    type="email" 
                    placeholder="ID Investigator / Email"
                    className="w-full bg-transparent border-b border-slate-700 pl-8 py-3 text-base focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600 text-white font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-500">
                    <Key className="w-5 h-5" />
                  </div>
                  <input 
                    type="password" 
                    placeholder="Kata Sandi Akses"
                    className="w-full bg-transparent border-b border-slate-700 pl-8 py-3 text-base focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600 text-white font-medium tracking-widest"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900" />
                  <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">Ingat saya</span>
                </label>
                <button type="button" className="text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors">
                  Lupa Sandi?
                </button>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full group relative py-4 px-6 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-2xl font-bold text-base transition-all duration-300 shadow-xl shadow-emerald-900/20 active:scale-[0.98] disabled:opacity-50"
              >
                <div className="flex items-center justify-center gap-3">
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <LogIn className="w-6 h-6" />}
                  <span>Akses Dashboard</span>
                </div>
              </button>
            </form>
          )}

          <div className="mt-12 pt-8 border-t border-slate-800 flex items-center justify-center gap-10">
            <button className="flex items-center gap-2 text-[11px] font-bold text-slate-500 hover:text-emerald-400 transition-all group">
              <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              RESET KREDENSIAL
            </button>
            <button className="flex items-center gap-2 text-[11px] font-bold text-slate-500 hover:text-emerald-400 transition-all group">
              <HelpCircle className="w-4 h-4" />
              BANTUAN SISTEM
            </button>
          </div>
        </div>

        <div className="text-center mt-10 space-y-2">
          <p className="text-[10px] text-slate-500 font-black tracking-[0.5em] uppercase opacity-50">
            PROPRIETARY SYSTEM • RESTRICTED ACCESS
          </p>
          <div className="flex justify-center items-center gap-2 text-[10px] text-slate-600 font-bold">
            <span>© 2026 Phenom AI Team</span>
            <span className="w-1 h-1 rounded-full bg-slate-800" />
            <span>Sumatera Utara</span>
          </div>
        </div>
      </div>


      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f8faf9]">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
