'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, 
  Calendar, 
  Search, 
  Trash2, 
  ChevronLeft, 
  ChevronsLeft, 
  ChevronsRight,
  CheckSquare,
  Square
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import Modal from '@/components/ui/Modal';

interface RiwayatItem {
  id: string;
  uploadId: string;
  data: any;
  akurasi: number;
  upload: {
    id: string;
    region: string;
    prompt: string;
    createdAt: string;
  };
}

export default function RiwayatTable({ data }: { data: RiwayatItem[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'danger' | 'info';
  } | null>(null);

  const itemsPerPage = 10;

  // Filter logic
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const searchStr = `${item.upload.region} ${item.upload.prompt} ${item.id}`.toLowerCase();
      return searchStr.includes(searchTerm.toLowerCase());
    });
  }, [data, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Selection logic
  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedData.length && paginatedData.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedData.map(item => item.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    
    setModalConfig({
      title: 'Hapus Massal',
      message: `Apakah Anda yakin ingin menghapus ${selectedIds.length} data terpilih? Tindakan ini tidak dapat dibatalkan.`,
      type: 'danger',
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          const res = await fetch('/api/analisis/bulk-delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: selectedIds }),
          });

          if (!res.ok) throw new Error('Gagal menghapus data');
          
          showToast(`${selectedIds.length} data berhasil dihapus`, 'success');
          setSelectedIds([]);
          router.refresh();
        } catch (error) {
          console.error(error);
          showToast('Terjadi kesalahan saat menghapus data.', 'error');
        } finally {
          setIsDeleting(false);
        }
      }
    });
    setModalOpen(true);
  };

  const handleDeleteSingle = (id: string) => {
    setModalConfig({
      title: 'Hapus Riwayat',
      message: 'Apakah Anda yakin ingin menghapus riwayat analisis ini?',
      type: 'danger',
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          const res = await fetch(`/api/analisis/${id}`, {
            method: 'DELETE',
          });

          if (!res.ok) throw new Error('Gagal menghapus');
          
          showToast('Riwayat berhasil dihapus', 'success');
          router.refresh();
        } catch (error) {
          console.error(error);
          showToast('Gagal menghapus data.', 'error');
        } finally {
          setIsDeleting(false);
        }
      }
    });
    setModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 px-2">
        <div className="relative flex-1 max-w-lg group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 p-1 bg-white/5 rounded-lg transition-colors group-focus-within:bg-emerald-500/10">
            <Search className="w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Cari daerah, topik, atau ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl py-4 pl-16 pr-6 text-sm font-bold text-slate-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/40 transition-all shadow-2xl placeholder:text-slate-600"
          />
        </div>

        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="flex items-center gap-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all animate-in zoom-in-95 active:scale-95 shadow-lg shadow-red-900/10"
            >
              <Trash2 className="w-4 h-4" />
              Hapus Terpilih ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-[32px] blur opacity-20 group-hover:opacity-30 transition duration-1000" />
        <div className="relative bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-white/5 border-b border-white/5 text-slate-500 text-[10px] tracking-[0.25em] font-black uppercase">
                  <th className="py-6 px-8 w-20 text-center">
                    <button 
                      onClick={toggleSelectAll}
                      className="transition-all hover:scale-110 active:scale-90"
                    >
                      {selectedIds.length === paginatedData.length && paginatedData.length > 0 ? (
                        <CheckSquare className="w-6 h-6 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                      ) : (
                        <Square className="w-6 h-6 text-slate-700 hover:text-slate-500" />
                      )}
                    </button>
                  </th>
                  <th className="py-6 px-4">Waktu Pemindaian</th>
                  <th className="py-6 px-4">Wilayah</th>
                  <th className="py-6 px-4">Topik Investigasi</th>
                  <th className="py-6 px-4">Confidence</th>
                  <th className="py-6 px-8 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-6 text-slate-600">
                        <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center mb-2 border border-white/5 rotate-3">
                          <Search className="w-10 h-10 opacity-30" />
                        </div>
                        <div>
                          <p className="text-xl font-black text-white mb-2">Data Tidak Ditemukan</p>
                          <p className="text-sm font-medium text-slate-500">Coba gunakan parameter pencarian yang berbeda.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item) => {
                    const akurasiValue = item.akurasi ? Math.round(item.akurasi * 100) : (item.data?.globalAkurasi ? Math.round(item.data.globalAkurasi * 100) : 0);
                    const akurasiColor = akurasiValue >= 80 ? 'text-emerald-400' : akurasiValue >= 50 ? 'text-amber-400' : 'text-rose-400';
                    const isSelected = selectedIds.includes(item.id);

                    return (
                      <tr 
                        key={item.id} 
                        className={`hover:bg-white/5 transition-all group ${isSelected ? 'bg-emerald-500/5' : ''}`}
                      >
                        <td className="py-6 px-8 text-center">
                          <button 
                            onClick={() => toggleSelect(item.id)}
                            className={`transition-all hover:scale-110 active:scale-90 ${isSelected ? 'text-emerald-400' : 'text-slate-800 hover:text-slate-600'}`}
                          >
                            {isSelected ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
                          </button>
                        </td>
                        <td className="py-6 px-4">
                          <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-slate-800 rounded-xl border border-white/5 group-hover:border-emerald-500/30 transition-colors">
                              <Calendar className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-200">
                                {new Date(item.upload.createdAt).toLocaleDateString('id-ID', {
                                  day: 'numeric', month: 'short', year: 'numeric'
                                })}
                              </span>
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                {new Date(item.upload.createdAt).toLocaleTimeString('id-ID', {
                                  hour: '2-digit', minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                            <span className="text-sm font-black text-slate-100">{item.upload.region}</span>
                          </div>
                        </td>
                        <td className="py-6 px-4">
                          <p className="text-sm font-medium text-slate-400 truncate max-w-[240px] italic" title={item.upload.prompt || '-'}>
                            "{item.upload.prompt || '-'}"
                          </p>
                        </td>
                        <td className="py-6 px-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block border border-white/5">
                              <div 
                                className={`h-full transition-all duration-1000 ${akurasiValue >= 80 ? 'bg-emerald-500' : akurasiValue >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                style={{ width: `${akurasiValue}%` }}
                              />
                            </div>
                            <span className={`text-xs font-black tracking-tighter ${akurasiColor}`}>{akurasiValue}%</span>
                          </div>
                        </td>
                        <td className="py-6 px-8 text-right">
                          <div className="flex items-center justify-end gap-3 lg:opacity-0 lg:group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                            <button
                              onClick={() => handleDeleteSingle(item.id)}
                              disabled={isDeleting}
                              className="w-10 h-10 rounded-xl bg-slate-800 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/20 transition-all disabled:opacity-50 active:scale-90"
                            >
                              <Trash2 className="w-4 h-4 mx-auto" />
                            </button>
                            <Link 
                              href={`/analisis/${item.id}`}
                              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 hover:text-white transition-all bg-emerald-500/5 hover:bg-emerald-600 px-6 py-3 rounded-xl border border-emerald-500/20 hover:border-emerald-600 shadow-xl active:scale-95 whitespace-nowrap"
                            >
                              Open Node
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-10 py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8 bg-white/5 relative z-10">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">
                Page <span className="text-emerald-400">{currentPage}</span> of <span className="text-slate-300">{totalPages}</span>
                <span className="mx-4 text-slate-800">|</span>
                Total <span className="text-slate-300">{filteredData.length}</span> Records
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-3 bg-slate-800 border border-white/5 rounded-xl text-slate-500 hover:text-emerald-400 disabled:opacity-20 transition-all active:scale-90"
                >
                  <ChevronsLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-3 bg-slate-800 border border-white/5 rounded-xl text-slate-500 hover:text-emerald-400 disabled:opacity-20 transition-all active:scale-90"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="w-12 h-12 flex items-center justify-center bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <span className="text-xs font-black text-emerald-400">{currentPage}</span>
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-3 bg-slate-800 border border-white/5 rounded-xl text-slate-500 hover:text-emerald-400 disabled:opacity-20 transition-all active:scale-90"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-3 bg-slate-800 border border-white/5 rounded-xl text-slate-500 hover:text-emerald-400 disabled:opacity-20 transition-all active:scale-90"
                >
                  <ChevronsRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={modalConfig?.onConfirm}
        title={modalConfig?.title || ''}
        message={modalConfig?.message || ''}
        type={modalConfig?.type}
        confirmText="Ya, Hapus"
      />
    </div>
  );
}
