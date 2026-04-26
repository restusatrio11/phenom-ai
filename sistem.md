# Rancangan Lengkap Sistem Analisis Fenomena Pertanian

## Deskripsi Umum
Sistem ini adalah aplikasi web berbasis **Next.js (App Router)** yang di-deploy di **Vercel**.  
Pengguna:
- mengunggah data Excel (misalnya data statistik pertanian BPS),
- memilih daerah di Sumatera Utara,
- mengetik prompt seperti `fenomena pertanian di Medan`,
- lalu sistem mencari fenomena dari internet (media sosial, Google, blog, dll.).

Sistem akan:
- membandingkan data Excel dengan data dinamis internet,
- menggunakan **OpenRouter** dengan model `nvidia/nemotron-3-super-120b-a12b:free`,
- menghasilkan ringkasan berupa:
  - **Judul [Tanggal]**
  - **Keterangan**
  - **Alasan / justifikasi**
  - **Sumber**
  - **Tingkat akurasi** (persentase).

---

## Arsitektur Teknologi

- **Frontend & Backend**: Next.js (App Router) + Vercel AI SDK.
- **Database**: Neon Postgres (serverless, terhubung ke Vercel). [web:45][web:53]  
- **Model AI**: `nvidia/nemotron-3-super-120b-a12b:free` via OpenRouter provider di Vercel AI SDK. [web:46][web:50]  
- **Deployment**: Vercel (gratis tier untuk prototipe). [web:39]  

---

## Struktur Project
app/
├── page.tsx # Halaman utama: upload Excel + prompt
├── api/
│ ├── upload/route.ts # Upload & parse Excel → simpan ke Neon
│ └── scan/route.ts # Jalankan analisis fenomena + LLM → simpan hasil
├── analisis/
│ └── [slug]/page.tsx # Tampilkan hasil (judul, keterangan, akurasi, dll.)
│ └── loading.tsx
lib/
├── db.ts # Koneksi Neon Postgres
├── excel.ts # Parse xlsx ke JSON
├── scraper.ts # Scraping Google, Twitter, dll.
├── llm.ts # Integrasi OpenRouter + pemrosesan accuration
prisma/schema.prisma # Skema database (Upload, Hasil, Region)

text

Untuk koneksi:
- Hubungkan Neon ke Vercel via Vercel Marketplace → dapatkan `DATABASE_URL`. [web:45]  
- Gunakan driver serverless Neon di `prisma/schema.prisma` dan `lib/db.ts`. [web:53]  

---

## Skema Database (Prisma)

```prisma
model Region {
  id      String   @id @default(cuid())
  label   String   // "Medan", "Deli Serdang", "Simalungun", dst
  code    String   // opsional kode kabupaten
}

model Upload {
  id        String   @id @default(cuid())
  excelData JsonB    // rows: [{ lokasi: "Medan", komoditas: "padi", ... }]
  prompt    String   // prompt yang diketik user
  region    String   // relasi region (misal "Medan")
  createdAt DateTime @default(now())
}

model Hasil {
  id        String   @id @default(cuid())
  uploadId  String
  summary   JsonB    // array: { judul: "", keterangan: "", alasan: "", sumber: "", waktu: "" }
  akurasi   Float    // 0.0 – 1.0 (misal 0.83 → 83%)
  upload    Upload   @relation(fields: [uploadId], references: [id])
}
```

---

## Flow Pengguna

1. **Pilih daerah**
   - User klik tombol/selector daerah di Sumatera Utara (dropdown).  
   - Data `Region` diambil dari database Neon (tabel `Region`).

2. **Upload Excel**
   - User upload file Excel via form di `page.tsx`.  
   - Server Action: `Upload` → `xlsx` → parse → simpan sebagai `Upload` di Neon dengan:
     - `region` (daerah terpilih),
     - `prompt` (default kosong / bisa diisi lewat API),
     - `excelData` (JSONB).

3. **Input prompt**
   - User mengetik misalnya:  
     `cari fenomena pertanian di Medan terkait harga beras dan hasil panen`.

4. **Scan + LLM**
   - Route `/api/scan`:
     - Ambil `Upload` dari Neon berdasarkan `region` dan timestamp terbaru.
     - Scraping dinamis:
       - Google / SerpAPI: `pertanian Medan harga beras 2026`. [web:40]  
       - Twitter/X (via snscrape proxy atau Apify actor). [web:20][web:40]  
     - Gabung data Excel + data web → kirim ke LLM OpenRouter.

5. **LLM: Format output + akurasi**
   - Gunakan provider `@openrouter/ai-sdk-provider` di Vercel AI SDK. [web:46][web:50]  
   - Prompt contoh:
     ```text
     Data Excel: [excel_json]
     Fenomena internet: [posts + news]

     Tugas:
     - Bandingkan data Excel (statistik) dan fenomena internet.
     - Identifikasi 3–5 fenomena utama.
     - Untuk setiap fenomena, keluarkan:
       - Judul [Tanggal]
       - Keterangan
       - Alasan
       - Sumber (URL)
     - Beri skor akurasi antara 0.0–1.0 berdasarkan konsistensi data Excel dan fenomena.
     - Output dalam format JSON:
       { fenomena: [ { judul, keterangan, alasan, sumber, waktu, akurasi } ], ... }
     ```

6. **Simpan hasil ke Neon**
   - Simpan `jsonb` hasil LLM ke `Hasil.summary`.
   - Tampilkan di frontend `/analisis/[slug]` sebagai:
     - **Judul [tanggal]**  
     - **Keterangan**  
     - **Alasan**  
     - **Sumber** (link)  
     - **Tingkat akurasi** dalam persentase (misal: `82%` ↔ progress ring/lingkaran).

---

## Implementasi Tombol “Select Daerah Sesumatera Utara”

- Buat tabel `Region` di Neon:
  - `id`, `label: "Medan" | "Deli Serdang" | "Simalungun" | ...`  
- Frontend:
  - Dropdown `<select>` di `page.tsx`:
    ```tsx
    <select name="region" defaultValue="Medan">
      <option value="Medan">Medan</option>
      <option value="Deli Serdang">Deli Serdang</option>
      ...
    </select>
    ```
  - Saat submit:
    - Kirim `region` bersama `file` dan `prompt` ke `POST /api/upload` → simpan di `Upload.region`.

---

## Penambahan Tingkat Akurasi

- **Dari LLM**:  
  - Model `nemotron-3-super-120b` menghitung skor akurasi (0.0–1.0) berdasarkan:
    - seberapa konsisten data Excel dengan tren internet,
    - seberapa banyak sumber yang relevan dan kredibel.
  - LLM kembalikan `akurasi` per fenomena dan/atau akurasi global.

- **Di frontend**:
  - Tampilkan:
    - `Tingkat akurasi: 82%`
    - Bisa pakai komponen circular progress / ring progress (shadcn / UI library).

- **Di backend**:
  - Field `akurasi` di `Hasil` (FLOAT) bisa:
    - diambil langsung dari LLM,
    - atau di-compute rata-rata akurasi per fenomena jika LLM kembalikan array.

---

## Contoh Output di UI

Format yang diinginkan:
Judul [Tanggal]
Keterangan: ...
Alasan: ...
Sumber: [URL]
Tingkat akurasi: 82%

text

Contoh:
Penurunan Hasil Panen Padi Medan [15/04/2026 – 23/04/2026]
Keterangan: Fenomena menurunnya hasil panen padi di Medan yang banyak dibahas di media sosial dan berita lokal.
Alasan: Data BPS menunjukkan penurunan 10% dari tahun ke tahun, sedangkan warganet soroti hama dan kenaikan biaya input.
Sumber: https://twitter.com/..., https://news.google/...
Tingkat akurasi: 84%

text

---

## Deployment di Vercel

1. **Setup env vars** di Vercel:
   - `DATABASE_URL` (string koneksi Neon) [web:45][web:52]  
   - `OPENROUTER_API_KEY`  
   - (opsional) `SERPAPI_KEY` / `TWITTER_PROXY_URL` untuk scraping.

2. **Deploy**:
   - `git push` ke repo GitHub → Vercel auto-deploy. [web:39]  
   - Gunakan `Vercel AI SDK` + `@openrouter/ai-sdk-provider` agar API `/api/scan` bisa stream output ke UI. [web:46][web:54]  

3. **Optimasi**:
   - Gunakan `revalidate` (ISR) untuk halaman hasil (`/analisis/[slug]`) supaya tidak selalu hit scraping tiap request. [web:39]  
   - Untuk scanning harian, bisa pakai GitHub Actions yang menjalankan cron-like call ke `/api/scan` di Vercel. [web:37]  

---

## Rancangan File yang Siap Dibuat

- `rancangan_sistem.md` (file ini)  
- `prisma/schema.prisma` (skema `Region`, `Upload`, `Hasil`)  
- `app/page.tsx` (form + upload + region select)  
- `app/api/upload/route.ts` (parses Excel → simpan ke Neon)  
- `app/api/scan/route.ts` (scrape → LLM → simpan hasil + akurasi)  
- `app/analisis/[slug]/page.tsx` (tampilkan hasil dengan format Judul [Tanggal] + akurasi)  

Jika kamu mau, bisa saya lanjutkan berikutnya dengan:
- contoh implementasi kode `upload/route.ts` + `scan/route.ts`,
- atau contoh prompt lengkap untuk LLM format `judul [tanggal] + akurasi` yang siap pakai di OpenRouter.