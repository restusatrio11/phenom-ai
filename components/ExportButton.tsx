'use client';

import * as XLSX from 'xlsx';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  data: any[];
  region: string;
}

export default function ExportButton({ data, region }: ExportButtonProps) {
  const exportToExcel = () => {
    const worksheetData = data.map((item, fIndex) => ({
      'No': fIndex + 1,
      'Judul Fenomena': item.poin_penyebab,
      'Deskripsi': item.deskripsi,
      'Alasan & Data Terukur': Array.isArray(item.keterangan) ? item.keterangan.join(' | ') : item.keterangan,
      'Akurasi': `${Math.round(item.akurasi * 100)}%`,
      'Daftar Sumber': item.sumber?.map((s: any) => s.nama).join(', ') || '',
      'Link Sumber': item.sumber?.map((s: any) => s.url).join(' \n ') || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    
    // Set column widths
    const wscols = [
      { wch: 5 },  // No
      { wch: 40 }, // Judul
      { wch: 80 }, // Deskripsi
      { wch: 60 }, // Alasan
      { wch: 10 }, // Akurasi
      { wch: 30 }, // Daftar Sumber
      { wch: 100 }, // Link Sumber
    ];
    worksheet['!cols'] = wscols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Analisis Fenomena');

    XLSX.writeFile(workbook, `Analisis_PhenomAI_${region.replace(/\s/g, '_')}.xlsx`);
  };

  return (
    <button 
      onClick={exportToExcel}
      className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all font-semibold shadow-xl shadow-emerald-900/30 hover:scale-105 active:scale-95"
    >
      <Download className="w-5 h-5" />
      Simpan Laporan Excel
    </button>
  );
}
