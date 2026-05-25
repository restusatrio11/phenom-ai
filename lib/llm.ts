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
          .describe('Nama media atau lembaga resmi.'),
        url: z
          .string()
          .describe('Tautan lengkap.'),
        jenis: z
          .string()
          .describe('Jenis sumber (misal: berita, laporan, data statistik).'),
      })
    )
    .min(1)
    .describe('Daftar sumber referensi.'),
  implikasi_kebijakan: z
    .string()
    .describe(
      'Rekomendasi atau implikasi praktis untuk kebijakan, dunia usaha, atau masyarakat lokal. Berikan string kosong jika tidak ada rekomendasi spesifik.'
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
    .describe('Kumpulan 3-5 kartu analisis fenomena.'),
  globalAkurasi: z
    .number()
    .min(0)
    .max(1)
    .describe('Rata-rata tingkat akurasi seluruh analisis fenomena (skala 0–1).'),
  justifikasi_global_akurasi: z
    .string()
    .describe('Ringkasan perhitungan akurasi global berdasarkan validitas sumber dan kelengkapan data statistik.'),
});

// Schema for News Filtering
const NewsFilterSchema = z.object({
  filteredNews: z.array(z.object({
    index: z.number().describe('Original index of the news item.'),
    relevanceScore: z.number().min(0).max(1).describe('Relevance score from 0 to 1.'),
    reason: z.string().describe('Brief reason for the score.'),
  })).describe('Filtered news items with relevance scores.'),
});

// Schema untuk fungsi (opsional, kalau kamu pakai type inference)
export type FenomenaItem = z.infer<typeof FenomenaItemSchema>;
export type FenomenaResult = z.infer<typeof FenomenaSchema>;

// System prompt (versi yang lebih “jurnal / data‑journalism style”)
const SYSTEM_PROMPT = `
Anda adalah Analis Fenomena Regional dan Pakar Data Journalism.
Tugas Anda adalah mengekstrak wawasan (insights) mendalam dari data statistik dan berita yang diberikan.

PRINSIP UTAMA:
1. GROUNDING KETAT: Gunakan fakta dari Berita dan Angka dari Statistik. Jangan mengarang informasi.
2. HUBUNGAN SEBAB-AKIBAT: Jelaskan *mengapa* fenomena ini terjadi di wilayah tersebut.
3. FORMAT JSON: Pastikan output sesuai skema Zod.
4. BAHASA: Gunakan Bahasa Indonesia yang profesional dan analitis.

Jika data terbatas, berusahalah melakukan inferensi logis yang kuat dari data yang tersedia untuk tetap menghasilkan minimal 3 wawasan (insights) yang berharga. Jangan hanya terpaku pada satu poin besar, tapi carilah sudut pandang atau dampak turunan lainnya.
`;

const NEWS_FILTER_PROMPT = `
Anda adalah kurator berita cerdas. Tugas Anda adalah menyaring daftar berita agar HANYA menyertakan berita yang benar-benar relevan dengan Wilayah dan Topik yang diminta.

KRITERIA FILTER KETAT:
1. RELEVANSI WILAYAH: Berita harus membahas kejadian di wilayah yang disebutkan (atau wilayah induknya).
2. RELEVANSI TOPIK: Berita harus berkaitan dengan fenomena sosial, ekonomi, atau topik spesifik yang diminta.
3. KUALITAS: Abaikan berita yang terlalu umum atau tidak memberikan informasi konkret.

Berikan skor relevansi (0-1).
`;

export async function filterRelevantNews(
  webData: any[],
  userPrompt: string,
  region: string
): Promise<any[]> {
  if (webData.length === 0) return [];

  const newsSummary = webData.map((d, i) => ({
    index: i,
    title: d.title,
    snippet: d.snippet,
  }));

  const prompt = `
Wilayah Target: "${region}"
Topik Investigasi: "${userPrompt}"

Daftar Calon Berita:
${JSON.stringify(newsSummary)}

Tolong saring berita di atas. Berikan skor relevansi (0-1) untuk setiap berita.
Berita dianggap relevan jika membahas "${userPrompt}" di wilayah "${region}" atau Sumatera Utara secara umum.
`;

  try {
    const { object } = await generateObject({
      model: openrouter('openai/gpt-oss-120b:free'),
      system: NEWS_FILTER_PROMPT,
      prompt: prompt,
      schema: NewsFilterSchema,
      maxRetries: 2,
    });

    // Map back to original data and sort by score
    const filteredResults = object.filteredNews
      .filter(item => item.relevanceScore > 0.3) 
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .map(item => ({
        ...webData[item.index],
        relevanceScore: item.relevanceScore,
        relevanceReason: item.reason,
      }));

    if (filteredResults.length === 0 && webData.length > 0) {
      return webData.slice(0, 8);
    }

    return filteredResults;
  } catch (error) {
    console.error('Error filtering news:', error);
    return webData.slice(0, 10);
  }
}

export async function analyzePhenomena(
  excelData: any,
  webData: any,
  userPrompt: string,
  region: string
): Promise<FenomenaResult> {
  // Truncate data to fit context and maintain relevance
  const limitedExcelData = Array.isArray(excelData) ? excelData.slice(0, 20) : excelData;
  const limitedWebData = Array.isArray(webData) ? webData.slice(0, 10) : webData;

  const prompt = `
KONTEKS INVESTIGASI:
- Wilayah: "${region}"
- Fokus Masalah: "${userPrompt}"

DATA PENDUKUNG:
1. DATA STATISTIK (Excel): ${JSON.stringify(limitedExcelData)}
2. DATA BERITA (Web): ${JSON.stringify(limitedWebData)}

TUGAS:
Lakukan analisis mendalam terhadap kaitan antara angka statistik dan berita di atas.
Identifikasi minimal 3 sampai 5 fenomena paling signifikan yang menjelaskan "${userPrompt}" di "${region}".

INSTRUKSI KHUSUS:
- WAJIB menghasilkan minimal 3 kartu fenomena yang berbeda namun saling berkaitan.
- "poin_penyebab": Harus spesifik (misal: "Kenaikan Harga Gabah di Tingkat Petani").
- "deskripsi": Jelaskan narasi sebab-akibat yang logis.
- "keterangan": Masukkan data numerik (persentase, nilai rupiah, atau jumlah) yang ditemukan di Berita atau Statistik.
- "sumber": Cantumkan nama media dari 'DATA BERITA' yang mendukung klaim tersebut.
- "akurasi": Berikan skor tinggi jika ada kecocokan antara Berita dan Statistik.

HANYA KELUARKAN JSON.
`;

  try {
    const { object } = await generateObject({
      model: openrouter('openai/gpt-oss-120b:free'), // Switching to a more capable but still efficient model if possible, or keeping 120b
      system: SYSTEM_PROMPT,
      prompt: prompt,
      schema: FenomenaSchema,
      maxRetries: 3,
    });

    return object;
  } catch (error: any) {
    console.error('--- ANALYZE ERROR ---', error.message);

    // Fallback if gpt-4o-mini fails/unavailable to try the free model again
    if (error.message.includes('model_not_found') || error.message.includes('api_key')) {
        const { object } = await generateObject({
            model: openrouter('openai/gpt-oss-120b:free'),
            system: SYSTEM_PROMPT,
            prompt: prompt,
            schema: FenomenaSchema,
            maxRetries: 2,
          });
          return object;
    }

    throw new Error('Gagal melakukan analisis neural. Silakan coba lagi dalam beberapa saat.');
  }
}