'use client';

import * as XLSX from 'xlsx';
import { Download } from 'lucide-react';

interface NewsExportButtonProps {
  data: any[];
  region: string;
}

export default function NewsExportButton({ data, region }: NewsExportButtonProps) {
  const exportToExcel = () => {
    const worksheetData = data.map((item, index) => ({
      'No': index + 1,
      'Judul Berita': item.title,
      'Sumber': item.source,
      'Snippet': item.snippet,
      'URL': item.url,
      'Tanggal Terbit': item.publishedAt || '-',
      'Skor Relevansi': item.relevanceScore ? `${Math.round(item.relevanceScore * 100)}%` : '-',
      'Alasan Relevansi': item.relevanceReason || '-'
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    
    // Set column widths
    const wscols = [
      { wch: 5 },   // No
      { wch: 50 },  // Judul
      { wch: 20 },  // Sumber
      { wch: 80 },  // Snippet
      { wch: 50 },  // URL
      { wch: 25 },  // Tanggal
      { wch: 15 },  // Skor
      { wch: 50 },  // Alasan
    ];
    worksheet['!cols'] = wscols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Berita');

    XLSX.writeFile(workbook, `Sumber_Berita_PhenomAI_${region.replace(/\s/g, '_')}.xlsx`);
  };

  return (
    <button 
      onClick={exportToExcel}
      className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all font-semibold border border-white/10 hover:border-emerald-500/30 text-xs uppercase tracking-widest shadow-xl"
    >
      <Download className="w-4 h-4 text-emerald-500" />
      Export Berita (.xlsx)
    </button>
  );
}
