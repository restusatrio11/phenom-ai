'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeleteButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus riwayat analisis ini?')) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/analisis/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Gagal menghapus');
      }

      router.refresh(); // Refresh the page to show updated list
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat menghapus data.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors disabled:opacity-50"
      title="Hapus Riwayat"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
