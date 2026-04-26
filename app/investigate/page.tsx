import UploadForm from "@/app/UploadForm";

export default function InvestigatePage() {
  return (
    <div className="p-8 max-w-[1200px] mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-1 bg-primary rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70">Terminal Entry</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
            Investigasi Sistem
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl">
            Luncurkan investigasi baru dengan mengunggah data atau memasukkan prompt pencarian fenomena.
          </p>
        </div>

        <div className="shrink-0">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-right">Tingkat Keamanan</div>
          <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3 flex items-center gap-3 min-w-[200px] shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-black text-slate-800 tracking-tight">Akses Terklasifikasi</span>
          </div>
        </div>
      </div>

      <div className="bg-white border-[1.5px] border-dashed border-emerald-200 rounded-2xl p-1 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
        <div className="bg-[#fcfdfc] rounded-xl p-12 border border-emerald-50/50">
          <div className="max-w-3xl mx-auto">
            <UploadForm />
          </div>
        </div>
      </div>
    </div>
  );
}
