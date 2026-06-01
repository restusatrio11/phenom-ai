'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Shield, 
  Mail, 
  User as UserIcon,
  ShieldAlert,
  Loader2,
  Plus,
  X
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function UserManagementPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nama_lengkap: '',
    role: 'PEGAWAI'
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
    } catch (e) {}
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        showToast("Personil baru berhasil didaftarkan.", "success");
        setIsAdding(false);
        setFormData({ email: '', password: '', nama_lengkap: '', role: 'PEGAWAI' });
        fetchUsers();
      } else {
        const error = await res.json();
        showToast(error.error || 'Gagal menambah user', "error");
      }
    } catch (e) {
      showToast("Kesalahan jaringan atau server.", "error");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast("Personil telah dihapus dari sistem.", "success");
        fetchUsers();
      } else {
        showToast("Gagal menghapus personil.", "error");
      }
    } catch (e) {
      showToast("Kesalahan jaringan atau server.", "error");
    }
  };

  return (
    <div className="p-4 lg:p-10 max-w-[1400px] mx-auto animate-in fade-in duration-1000 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-slate-900 border border-white/5 rounded-xl shadow-2xl">
              <Users className="w-5 h-5 text-emerald-400" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/60">Personnel Control</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none">Manajemen <span className="text-slate-500 font-light">User</span></h1>
          <p className="text-slate-400 font-medium max-w-2xl text-sm lg:text-base leading-relaxed">
            Kelola akses personil dan pembagian peran (Role-Based Access Control) dalam ekosistem Phenom AI.
          </p>
        </div>

        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-xl shadow-emerald-900/20 active:scale-95 uppercase text-[10px] tracking-widest"
        >
          <UserPlus className="w-4 h-4" />
          Daftarkan Personil
        </button>
      </div>

      {/* User Table Container */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-[40px] blur opacity-20 group-hover:opacity-30 transition duration-1000" />
        <div className="relative bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white/5 border-b border-white/5 text-slate-500 text-[10px] tracking-[0.25em] font-black uppercase">
                  <th className="px-10 py-7">Identitas Personil</th>
                  <th className="px-10 py-7">Kontak Email</th>
                  <th className="px-10 py-7">Peran Sistem</th>
                  <th className="px-10 py-7 text-right">Otoritas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-10 py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Sinkronisasi Data Personil...</span>
                      </div>
                    </td>
                  </tr>
                ) : users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-all group">
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-[18px] bg-slate-800 border border-white/5 flex items-center justify-center text-slate-500 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all shadow-lg">
                          <UserIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="block text-sm font-extrabold text-white tracking-tight">{user.nama_lengkap}</span>
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Node ID: {user.id.substring(0, 8)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-200 transition-colors">
                        <Mail className="w-4 h-4 text-slate-600" />
                        <span className="text-sm font-medium">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl border ${
                        user.role === 'ADMIN' 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                      }`}>
                        {user.role === 'ADMIN' ? <Shield className="w-4 h-4 shadow-[0_0_10px_rgba(16,185,129,0.3)]" /> : <ShieldAlert className="w-4 h-4" />}
                        <span className="text-[10px] font-black uppercase tracking-widest">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-10 py-7 text-right">
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="w-10 h-10 rounded-xl bg-slate-800 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/20 transition-all active:scale-90"
                      >
                        <Trash2 className="w-4 h-4 mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#0f172a] w-full max-w-lg rounded-[40px] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-500 relative">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="p-10 lg:p-14 space-y-10 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h2 className="text-3xl font-extrabold text-white tracking-tighter">Personil Baru</h2>
                  <p className="text-[10px] text-emerald-500/60 font-black uppercase tracking-[0.4em]">Initialize system access</p>
                </div>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="p-4 bg-white/5 text-slate-500 hover:text-white rounded-[20px] border border-white/5 transition-all active:scale-90"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddUser} className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Identitas Lengkap</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Contoh: Restu Satrio"
                      className="w-full bg-white/5 border border-white/5 rounded-[20px] px-8 py-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/40 transition-all placeholder:text-slate-700"
                      value={formData.nama_lengkap}
                      onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Email Kredensial</label>
                    <input 
                      required
                      type="email" 
                      placeholder="operator@phenom.ai"
                      className="w-full bg-white/5 border border-white/5 rounded-[20px] px-8 py-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/40 transition-all placeholder:text-slate-700"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Sandi Akses</label>
                    <input 
                      required
                      type="password" 
                      placeholder="••••••••••••"
                      className="w-full bg-white/5 border border-white/5 rounded-[20px] px-8 py-5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/40 transition-all placeholder:text-slate-700 tracking-widest"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Peran Operasional</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['PEGAWAI', 'ADMIN'].map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setFormData({...formData, role})}
                          className={`py-5 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all border ${
                            formData.role === role 
                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl shadow-emerald-900/40' 
                            : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300 hover:border-white/20'
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-6 rounded-[24px] transition-all shadow-[0_20px_50px_rgba(16,185,129,0.2)] uppercase text-[11px] tracking-[0.4em] active:scale-95"
                  >
                    Otorisasi & Daftarkan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
