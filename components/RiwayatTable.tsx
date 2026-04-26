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
      {/* Search and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="relative flex-1 max-w-lg">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1 bg-slate-50 rounded-lg">
            <Search className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Cari daerah, topik, atau ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-white border border-slate-200 rounded-xl py-3.5 lg:py-4 pl-12 lg:pl-14 pr-6 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 bg-white hover:bg-red-50 text-red-500 border border-red-100 px-4 lg:px-6 py-3.5 lg:py-4 rounded-xl text-[10px] lg:text-xs font-black uppercase tracking-widest transition-all animate-in fade-in zoom-in-95 shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              Hapus Terpilih ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/40">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px] lg:min-w-0">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[9px] lg:text-[10px] tracking-[0.2em] font-black uppercase">
                <th className="py-4 lg:py-6 px-4 lg:px-8 w-14 text-center">
                  <button 
                    onClick={toggleSelectAll}
                    className="text-slate-300 hover:text-primary transition-colors"
                  >
                    {selectedIds.length === paginatedData.length && paginatedData.length > 0 ? (
                      <CheckSquare className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                    ) : (
                      <Square className="w-5 h-5 lg:w-6 lg:h-6" />
                    )}
                  </button>
                </th>
                <th className="py-4 lg:py-6 px-4">Waktu Pemindaian</th>
                <th className="py-4 lg:py-6 px-4">Wilayah (Region)</th>
                <th className="py-4 lg:py-6 px-4">Topik Investigasi</th>
                <th className="py-4 lg:py-6 px-4">Akurasi</th>
                <th className="py-4 lg:py-6 px-4 lg:px-8 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 lg:py-24 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 lg:w-10 lg:h-10 opacity-20" />
                      </div>
                      <p className="text-lg lg:text-xl font-black text-slate-800">Data tidak ditemukan</p>
                      <p className="text-xs lg:text-sm font-medium">Coba gunakan kata kunci pencarian yang berbeda.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => {
                  const akurasiValue = item.akurasi ? Math.round(item.akurasi * 100) : (item.data?.globalAkurasi ? Math.round(item.data.globalAkurasi * 100) : 0);
                  const akurasiColor = akurasiValue >= 80 ? 'text-emerald-600' : akurasiValue >= 50 ? 'text-yellow-600' : 'text-red-600';
                  const isSelected = selectedIds.includes(item.id);

                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-slate-50/80 transition-all group ${isSelected ? 'bg-emerald-50/30' : ''}`}
                    >
                      <td className="py-4 lg:py-6 px-4 lg:px-8 text-center">
                        <button 
                          onClick={() => toggleSelect(item.id)}
                          className={`${isSelected ? 'text-primary' : 'text-slate-200'} hover:text-primary transition-colors`}
                        >
                          {isSelected ? <CheckSquare className="w-5 h-5 lg:w-6 lg:h-6" /> : <Square className="w-5 h-5 lg:w-6 lg:h-6" />}
                        </button>
                      </td>
                      <td className="py-4 lg:py-6 px-4 text-xs lg:text-sm font-bold text-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-white transition-colors">
                            <Calendar className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-slate-400" />
                          </div>
                          <span className="whitespace-nowrap">
                            {new Date(item.upload.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                            <span className="ml-2 text-slate-400 font-medium">
                              {new Date(item.upload.createdAt).toLocaleTimeString('id-ID', {
                                hour: '2-digit', minute: '2-digit'
                              })}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="py-4 lg:py-6 px-4 text-xs lg:text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="font-black text-slate-800">{item.upload.region}</span>
                        </div>
                      </td>
                      <td className="py-4 lg:py-6 px-4 text-xs lg:text-sm text-slate-500 font-medium max-w-[200px] lg:max-w-[300px] truncate" title={item.upload.prompt || '-'}>
                        {item.upload.prompt || '-'}
                      </td>
                      <td className="py-4 lg:py-6 px-4 text-xs lg:text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-12 lg:w-16 h-1.5 lg:h-2 bg-slate-100 rounded-full overflow-hidden hidden sm:block shadow-inner">
                            <div 
                              className={`h-full ${akurasiValue >= 80 ? 'bg-emerald-500' : akurasiValue >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${akurasiValue}%` }}
                            />
                          </div>
                          <span className={`font-black ${akurasiColor}`}>{akurasiValue}%</span>
                        </div>
                      </td>
                      <td className="py-4 lg:py-6 px-4 lg:px-8 text-right">
                        <div className="flex items-center justify-end gap-2 lg:gap-3 lg:opacity-0 lg:group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                          <button
                            onClick={() => handleDeleteSingle(item.id)}
                            disabled={isDeleting}
                            className="inline-flex items-center justify-center w-9 h-9 lg:w-10 lg:h-10 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50 border border-transparent hover:border-red-100"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <Link 
                            href={`/analisis/${item.id}`}
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-700 hover:text-white transition-all bg-white hover:bg-slate-900 px-4 lg:px-6 py-2 lg:py-3 rounded-xl border border-slate-200 hover:border-slate-900 shadow-sm active:scale-95 whitespace-nowrap"
                          >
                            Detail
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
          <div className="px-8 py-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50/30">
            <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest">
              Data <span className="text-slate-800">{startIndex + 1}</span> - <span className="text-slate-800">{Math.min(startIndex + itemsPerPage, filteredData.length)}</span> / {filteredData.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary disabled:opacity-30 disabled:hover:text-slate-400 transition-all shadow-sm active:scale-95"
              >
                <ChevronsLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary disabled:opacity-30 disabled:hover:text-slate-400 transition-all shadow-sm active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center px-6">
                <span className="text-xs font-black text-slate-800">
                  {currentPage} <span className="mx-1 opacity-20">/</span> {totalPages}
                </span>
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary disabled:opacity-30 disabled:hover:text-slate-400 transition-all shadow-sm active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary disabled:opacity-30 disabled:hover:text-slate-400 transition-all shadow-sm active:scale-95"
              >
                <ChevronsRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
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
