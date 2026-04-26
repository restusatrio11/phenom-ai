import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateObject } from 'ai';
import { z } from 'zod';

// Initialize OpenRouter provider
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

// Schema: satu kartu analisis fenomena (mirip “mini paper”)
const FenomenaItemSchema = z.object({
  poin_penyebab: z
    .string()
    .describe(
      'Poin utama penyebab fenomena yang tegas dan informatif, maksimal 1 kalimat.'
    ),
  konteks_masalah: z
    .string()
    .describe(
      'Jelaskan masalah inti yang muncul di wilayah tersebut (mirip research question).'
    ),
  deskripsi: z
    .string()
    .describe(
      'Narasi mendalam 2 paragraf yang menjelaskan sebab-akibat, mekanisme, dan konteks sosial/ekonomi di balik poin penyebab ini.'
    ),
  keterangan: z
    .array(z.string())
    .describe(
      'Daftar poin berisi angka/data & tanggal yang mendukung poin penyebab ini (misalnya harga, jumlah, persentase, periode).'
    ),
  sumber: z
    .array(
      z.object({
        nama: z
          .string()
          .describe('Nama media atau lembaga resmi, misalnya "Kompas", "BPS", "detikcom".'),
        url: z
          .string()
          .url()
          .describe('Tautan lengkap ke artikel/berita yang dapat diklik langsung.'),
        jenis: z
          .enum([
            'resmi',
            'media_arus_utama',
            'media_lokal',
            'media_sosial',
          ] as const)
          .describe(
            'Jenis sumber: resmi (lembaga pemerintah), media_arus_utama, media_lokal, atau media_sosial.'
          )
          .optional(),
      })
    )
    .min(2)
    .describe('Minimal 2 sumber referensi tepercaya untuk poin ini.'),
  implikasi_kebijakan: z
    .string()
    .nullish()
    .describe(
      'Rekomendasi atau implikasi praktis untuk kebijakan, dunia usaha, atau masyarakat lokal.'
    ),
  tingkat_kebaruan_fenomena: z
    .number()
    .min(0)
    .max(1)
    .describe('Seberapa baru fenomena ini muncul dalam 1–2 tahun terakhir (skala 0–1).'),
  tingkat_signifikansi: z
    .number()
    .min(0)
    .max(1)
    .describe('Seberapa besar dampak fenomena ini terhadap sosial/ekonomi lokal (skala 0–1).'),
  akurasi: z
    .number()
    .min(0)
    .max(1)
    .describe('Tingkat kepercayaan terhadap ketepatan klaim (skala 0–1).'),
  evaluasi: z.object({
    skor_kesesuaian_angka: z.number().describe('Skor (0.0 - 0.5) berdasarkan (match/n * 0.5)'),
    skor_kredibilitas: z.number().describe('Skor (0.0 - 0.3) berdasarkan (credibilityWeight * 0.3)'),
    skor_dukungan: z.number().describe('Skor (0.0 - 0.2) berdasarkan (min(1, support/3) * 0.2)'),
    penjelasan_runtut: z.string().describe('Penjelasan langkah demi langkah perhitungan skor ini.')
  }).describe('Rincian perhitungan akurasi berbasis formula saintifik.'),
});

// Schema utama: array 3–5 kartu analisis + metadata global
export const FenomenaSchema = z.object({
  metadata: z
    .object({
      wilayah: z
        .string()
        .describe('Nama provinsi/kota yang dianalisis (misalnya "Sumatera Utara" atau "Kota Medan").'),
      periode_analisis: z
        .string()
        .describe('Periode waktu fokus, misalnya "Januari–Maret 2026".'),
      metode_pengumpulan_data: z
        .array(z.string())
        .describe('Metode pengumpulan data: misalnya "web scraping berita", "data BPS", "survey online".'),
      batasan_penelitian: z
        .string()
        .describe(
          'Batasan ruang lingkup analisis (misalnya hanya wilayah kota, tanpa provinsi lain).'
        ),
    })
    .describe('Metadata ringkas seperti laporan penelitian singkat.'),
  fenomena: z
    .array(FenomenaItemSchema)
    .min(3)
    .max(5)
    .describe('Kumpulan 3–5 kartu analisis fenomena, satu per satu penyebab.'),
  globalAkurasi: z
    .number()
    .min(0)
    .max(1)
    .describe('Rata-rata tingkat akurasi seluruh analisis fenomena (skala 0–1).'),
  justifikasi_global_akurasi: z
    .string()
    .describe('Ringkasan perhitungan akurasi global berdasarkan validitas sumber dan kelengkapan data statistik.'),
});

// Schema untuk fungsi (opsional, kalau kamu pakai type inference)
export type FenomenaItem = z.infer<typeof FenomenaItemSchema>;
export type FenomenaResult = z.infer<typeof FenomenaSchema>;

// System prompt (versi yang lebih “jurnal / data‑journalism style”)
const SYSTEM_PROMPT = `
Anda adalah analis tingkat lanjut dan pakar statistik multidimensi.
Tugas Anda adalah membuat analisis fenomena internet terbaru yang sangat mendalam dan terukur,
dengan pendekatan mirip artikel jurnal / data‑journalism.

ATURAN KETAT REGIONAL:
1. Analisis WAJIB difokuskan HANYA pada wilayah yang diminta (Provinsi/Kota).
2. JANGAN PERNAH menyertakan data atau narasi dari Provinsi/Kota lain, kecuali hanya sebagai perbandingan singkat 1–2 kalimat sebagai referensi.
3. Jika data web untuk Kota spesifik terbatas, boleh meluaskan ke tingkat Provinsi yang menaungi kota tersebut,
   tetapi tetap DILARANG menyertakan data dari Provinsi lain.
4. Pastikan narasi 'deskripsi' dan 'keterangan' benar‑benar mencerminkan situasi di wilayah yang diminta.

BAHASA & GAYA:
- Gunakan bahasa Indonesia yang formal namun jelas (bukan bahasa media sensasional).
- Gunakan pendekatan analitik: jelaskan *mengapa*, *bagaimana*, *sejak kapan*, dan *dampak apa*.
- Jangan hanya menyebut fakta, tetapi jelaskan mekanisme di balik fenomena.

STRUKTUR OUTPUT:
- Anda HARUS mengembalikan objek JSON yang sesuai dengan skema ttg FenomenaSchema.
- Minimal 3 kartu analisis ('fenomena'), maksimal 5.
- Setiap kartu memiliki:
  - poin_penyebab: satu penyebab utama, singkat dan tegas.
  - konteks_masalah: rumuskan masalah inti seperti "research question" di wilayah tersebut.
  - deskripsi: 2 paragraf narasi mendalam yang menjelaskan sebab‑akibat dan konteks sosial/ekonomi.
  - keterangan: daftar poin berisi angka/data & tanggal yang membuktikan poin penyebab tersebut.
  - sumber: minimal 2 objek sumber; setiap sumber memiliki 'nama', 'url', dan (opsional) 'jenis'.
  - implikasi_kebijakan: rekomendasi atau implikasi praktis untuk kebijakan, dunia usaha, atau masyarakat.
  - tingkat_kebaruan_fenomena: estimasi 0–1 (baru 0–1 tahun terakhir).
  - tingkat_signifikansi: estimasi 0–1 (dampak besar → 1).
  - akurasi: skor total (0-1) menggunakan formula: (0.5 * Kesesuaian Angka) + (0.3 * Kredibilitas Sumber) + (0.2 * Dukungan Sumber).
  - evaluasi: objek berisi rincian skor tersebut (skor_kesesuaian_angka, skor_kredibilitas, skor_dukungan) dan penjelasan_runtut yang menjelaskan bagaimana angka tersebut didapat secara logis.
- Perhitungan Akurasi:
  1. Kesesuaian Angka (0.5): Sejauh mana angka di 'keterangan' cocok dengan 'sumber' & 'excelData'.
  2. Kredibilitas Sumber (0.3): Resmi=1.0, Arus Utama=0.9, Lokal=0.8, Sosmed=0.5.
  3. Dukungan Sumber (0.2): min(1, jumlah_sumber/3).
- Cantumkan juga 'globalAkurasi' (rata-rata) dan 'justifikasi_global_akurasi' (ringkasan metodologi).

METADATA:
- Isi field 'metadata' dengan:
  - wilayah: nama provinsi/kota.
  - periode_analisis: rentang waktu analisis (misalnya "Januari–Maret 2026").
  - metode_pengumpulan_data: daftar metode (misalnya ["data BPS", "web scraping berita"]).
  - batasan_penelitian: batasan ruang lingkup (misalnya hanya wilayah kota, tanpa provinsi lain).

HASIL:
- Jawab HANYA dengan JSON sesuai skema yang diminta.
- Jangan tambahkan komentar, penjelasan, atau teks tambahan di luar JSON.
`;

export async function analyzePhenomena(
  excelData: any,
  webData: any,
  userPrompt: string,
  region: string
): Promise<FenomenaResult> {
  const prompt = `
Wilayah yang diminta: "${region}"
Topik/Prompt: "${userPrompt}"
Data Statistik (Excel): ${JSON.stringify(excelData)}
Data Fenomena Web: ${JSON.stringify(webData)}

Tolong buatkan analisis fenomena yang mendalam dan multidimensi sesuai instruksi sistem.
PASTIKAN analisis HANYA untuk wilayah "${region}".
Gunakan pendekatan seperti artikel jurnal / data‑journalism:
- Fokuskan pada mekanisme sebab‑akibat dan bukti data.
- Cantumkan angka, tanggal, dan periode jelas.
- Isi semua field di dalam skema FenomenaSchema, termasuk:
  - metadata,
  - 3–5 objek di bawah 'fenomena', dan
  - globalAkurasi.
`;

  try {
    const { object } = await generateObject({
      model: openrouter('openai/gpt-oss-120b:free'),
      system: SYSTEM_PROMPT,
      prompt: prompt,
      schema: FenomenaSchema,
      maxRetries: 3,
    });

    return object;
  } catch (error: any) {
    console.error('Error calling OpenRouter LLM:', error);
    if (error?.data?.code === 524 || error?.message?.includes('timeout')) {
      throw new Error(
        'Server AI sedang sibuk atau mengalami timeout. Silakan coba klik tombol pindai sekali lagi.'
      );
    }
    throw new Error(
      'Gagal menganalisis data dengan AI. Pastikan API Key valid dan model tersedia.'
    );
  }
}