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
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#f8faf9]">
      {/* Animated Grid Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(16, 185, 129, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 185, 129, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Background Gradient Pulse */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-100/40 rounded-full blur-[120px] animate-pulse z-0" />

      <div className="w-full max-w-[450px] relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="bg-white/90 backdrop-blur-md border-[1.5px] border-dashed border-emerald-200/80 rounded-[24px] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border-spacing-4">
          
          {/* Header Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-emerald-100 shadow-xl shadow-emerald-500/10">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-emerald-700 mb-1">
              Phenom AI
            </h1>
            <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">
              Universal Phenomenon Analysis System
            </p>
          </div>

          {errorMsg && (
            <div className="mb-8 p-4 bg-red-50 border border-dashed border-red-200 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
              <CircleAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-red-600 font-medium leading-relaxed">{errorMsg}</p>
            </div>
          )}

          {/* Tab Switcher */}
          <div className="flex border-b border-slate-100 mb-8">
            <button 
              onClick={() => setActiveTab('sso')}
              className={`flex-1 pb-3 text-xs font-bold transition-all ${activeTab === 'sso' ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}
            >
              SSO BPS OTP
            </button>
            <button 
              onClick={() => setActiveTab('ordinary')}
              className={`flex-1 pb-3 text-xs font-bold transition-all ${activeTab === 'ordinary' ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}
            >
              AKUN BIASA
            </button>
          </div>

          {activeTab === 'sso' ? (
            <div className="space-y-6">
              <div className="text-center px-4 mb-2">
                <Smartphone className="w-10 h-10 text-emerald-200 mx-auto mb-4" />
                <p className="text-xs text-slate-500 leading-relaxed">
                  Gunakan otentikasi Single Sign-On (SSO) BPS Sumatera Utara untuk akses cepat melalui sistem OTP.
                </p>
              </div>
              <button 
                onClick={handleSSOLogin}
                disabled={loading}
                className="w-full relative group overflow-hidden bg-[#065f46] hover:bg-[#064e3b] text-white py-4 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/10 active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                Authorize via SSO
              </button>
            </div>
          ) : (
            <form onSubmit={handleOrdinaryLogin} className="space-y-10">
              <div className="space-y-8">
                <div className="relative group">
                  <div className="flex items-center gap-3 text-slate-500 mb-1 group-focus-within:text-emerald-600 transition-colors">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Email / Investigator ID</span>
                  </div>
                  <input 
                    type="email" 
                    placeholder="nama@email.com"
                    className="w-full bg-transparent border-b border-slate-200 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-400 font-medium text-slate-800"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="relative group">
                  <div className="flex items-center gap-3 text-slate-500 mb-1 group-focus-within:text-emerald-600 transition-colors">
                    <Key className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Password / Access Key</span>
                  </div>
                  <input 
                    type="password" 
                    placeholder="••••••••••••"
                    className="w-full bg-transparent border-b border-slate-200 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-400 font-medium tracking-widest text-slate-800"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full relative group overflow-hidden bg-[#065f46] hover:bg-[#064e3b] text-white py-4 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/10 active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                Authorize Access
              </button>
            </form>
          )}

          <div className="mt-10 pt-6 border-t border-dashed border-slate-100 flex items-center justify-between">
            <button className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-emerald-600 transition-colors">
              <RefreshCcw className="w-3.5 h-3.5" />
              RESET CREDENTIALS
            </button>
            <button className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-emerald-600 transition-colors">
              <HelpCircle className="w-3.5 h-3.5" />
              SYSTEM SUPPORT
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-[10px] text-slate-400 font-bold tracking-[0.3em] opacity-40">
          PROPRIETARY SYSTEM • RESTRICTED ACCESS
        </p>
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
