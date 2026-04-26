# Documentation: Phenom AI - Sistem Analisis Fenomena Universal

Phenom AI adalah platform analisis cerdas yang mengorelasikan data statistik internal (dari file Excel) dengan fenomena nyata yang sedang terjadi di internet secara real-time. Sistem ini dirancang untuk memberikan wawasan mendalam mengenai penyebab (root cause) dari fluktuasi data di wilayah tertentu di Indonesia.

---

## 1. Alur Bisnis (Multi-Step Workflow)

Sistem ini mengikuti proses 3 langkah yang terstruktur untuk memastikan akurasi dan transparansi data:

### Langkah 01: Input & Scraping
*   **Aksi**: Pengguna memilih wilayah (Provinsi & Kota/Kabupaten) menggunakan dropdown cascading.
*   **Data**: Pengguna dapat mengunggah file Excel (.xlsx) yang berisi data statistik sektoral (opsional).
*   **Prompt**: Pengguna memberikan instruksi spesifik (misal: "Analisis penurunan produksi ternak sapi").
*   **Proses**: Sistem melakukan scraping berita real-time menggunakan Google News RSS berdasarkan kombinasi wilayah dan prompt.

### Langkah 02: Review Sumber (Transparent Data)
*   **Tampilan**: Sistem menampilkan daftar artikel berita yang ditemukan.
*   **Interaksi**: Setiap artikel dapat diklik untuk membuka sumber aslinya di tab baru.
*   **Validasi**: Pengguna dapat melihat sumber data apa saja yang akan digunakan oleh AI untuk analisis di langkah berikutnya.

### Langkah 03: Analisis Phenom (AI Core)
*   **Proses**: Pengguna menekan tombol "Mulai Analisis Phenom AI".
*   **Output**: AI menghasilkan laporan terstruktur dalam bentuk kartu-kartu fenomena.
*   **Struktur Output**:
    1.  **Poin Penyebab**: Judul tegas yang mengidentifikasi pemicu utama.
    2.  **Deskripsi Fenomena**: Narasi mendalam dalam 2 paragraf.
    3.  **Alasan & Data Terukur**: Poin-poin berisi angka, persentase, dan tanggal spesifik.
    4.  **Sumber Referensi**: Link langsung ke artikel pendukung.
    5.  **Skor Akurasi**: Tingkat kepercayaan data per fenomena.

---

## 2. Fitur Unggulan

*   **Cascading Region Selection**: Database lengkap provinsi dan kabupaten di seluruh Indonesia untuk pencarian yang sangat spesifik.
*   **Strict Regional Filtering**: Prompt AI yang dikunci untuk hanya membahas wilayah yang dipilih, mencegah "hallucination" data dari wilayah lain.
*   **Real-time News Integration**: Menggunakan Google News RSS untuk mendapatkan data terbaru detik ini, bukan data statis dari training model AI.
*   **Premium UI/UX**: Menggunakan tema Dark Mode dengan aksen Emerald/Primary, Glassmorphism, dan animasi transisi yang halus.

---

## 3. Spesifikasi Teknis

*   **Frontend**: Next.js 15+ (App Router), React 19, Tailwind CSS 4.
*   **Backend**: Next.js API Routes, Prisma ORM.
*   **Database**: PostgreSQL (Neon Serverless).
*   **AI Engine**: OpenRouter (Model: NVIDIA Nemotron-3 Super 120B) via Vercel AI SDK.
*   **Iconography**: Lucide React.
*   **Authentication**: SSO Sumut (OTP) & Traditional Account Session.

---

## 4. Panduan Desain (UI/UX Branding)

Untuk membuat interface yang terlihat "Human-Crafted" dan premium:
*   **Typography**: Gunakan font Sans yang bersih (seperti Inter atau Outfit) dengan tracking yang ketat untuk heading.
*   **Color Palette**: 
    *   Background: Dark Navy/Slate (`#020617`).
    *   Primary: Emerald/Mint (`#10b981`).
    *   Accents: Blue-400, Slate-800 for borders.
*   **Visual Elements**: 
    *   Gunakan `backdrop-blur` pada header dan kartu.
    *   Gunakan gradient subtle pada teks judul.
    *   Progress Ring untuk indikator akurasi.
    *   Dashed borders untuk zona drop file.

---

*Dibuat untuk keperluan pengembangan frontend tingkat lanjut.*
