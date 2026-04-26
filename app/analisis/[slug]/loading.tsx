import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="w-16 h-16 animate-spin text-primary mb-6" />
      <h2 className="text-2xl font-bold text-slate-200 mb-2">Memuat Hasil Analisis...</h2>
      <p className="text-slate-400">Sedang mengambil data dan menghitung tingkat akurasi fenomena.</p>
    </div>
  );
}
