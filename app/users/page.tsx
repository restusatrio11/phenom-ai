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
    <div className="p-4 lg:p-10 max-w-[1400px] mx-auto animate-in fade-in duration-700 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500 rounded-lg">
              <Users className="w-4 h-4 text-white" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Personnel Control</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Manajemen <span className="text-slate-400">User</span></h1>
          <p className="text-slate-500 font-medium max-w-2xl text-sm lg:text-base">
            Kelola akses personil dan pembagian peran (Role-Based Access Control) dalam sistem Phenom AI.
          </p>
        </div>

        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-3 bg-slate-900 hover:bg-emerald-600 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-xl shadow-slate-200 hover:shadow-emerald-200 uppercase text-[10px] tracking-widest active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          Tambah Personil Baru
        </button>
      </div>

      {/* User Table */}
      <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identitas Personil</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kontak Email</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Peran Sistem</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-4" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sinkronisasi Data Personil...</span>
                  </td>
                </tr>
              ) : users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-sm font-black text-slate-900">{user.nama_lengkap}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {user.id.substring(0, 8)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-4 h-4 text-slate-300" />
                      <span className="text-sm font-medium">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                      user.role === 'ADMIN' 
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                      : 'bg-blue-50 border-blue-100 text-blue-700'
                    }`}>
                      {user.role === 'ADMIN' ? <Shield className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                      <span className="text-[10px] font-black uppercase tracking-widest">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-900">Personil Baru</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Daftarkan akses sistem baru</p>
                </div>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddUser} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Contoh: Budi Santoso"
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                      value={formData.nama_lengkap}
                      onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Resmi</label>
                    <input 
                      required
                      type="email" 
                      placeholder="budi@phenom.ai"
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kata Sandi Sementara</label>
                    <input 
                      required
                      type="password" 
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Peran Akses</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['PEGAWAI', 'ADMIN'].map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setFormData({...formData, role})}
                          className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                            formData.role === role 
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                            : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-200'
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-black py-5 rounded-2xl transition-all shadow-2xl shadow-slate-200 uppercase text-[10px] tracking-[0.2em]"
                  >
                    Konfirmasi & Daftarkan
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
