import * as cheerio from 'cheerio';

export interface WebDataItem {
  title: string;
  url: string;
  snippet: string;
  source: string;
  publishedAt?: string;
}

/**
 * Cleans the query from conversational noise words.
 */
/**
 * Cleans the query from conversational noise but preserves key topical terms.
 * Extracts core keywords to improve search relevance.
 */
function cleanQuery(query: string): string {
  // 1. Convert to lowercase
  let cleaned = query.toLowerCase();

  // 2. Remove common conversational prefixes/noise (Indonesian & English)
  const noisePatterns = [
    /gambarkan fenomena/gi,
    /jelaskan mengenai/gi,
    /analisis tentang/gi,
    /tolong cari/gi,
    /tampilkan data/gi,
    /informasi terkait/gi,
    /berita tentang/gi,
    /statistik mengenai/gi,
    /saya ingin tahu/gi,
    /apa penyebab/gi,
    /mengapa terjadi/gi,
    /bagaimana kondisi/gi,
    /di wilayah/gi,
    /pada tahun/gi,
    /seperti/gi,
    /yaitu/gi,
    /adalah/gi
  ];

  noisePatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });

  // 3. Remove standalone filler words
  const fillers = [
    'tolong', 'cari', 'temukan', 'tampilkan', 'jelaskan', 'analisis', 'mengapa', 'apa', 
    'bagaimana', 'siapa', 'kapan', 'dimana', 'fenomena', 'data', 'statistik', 'berita', 
    'artikel', 'tentang', 'mengenai', 'saya', 'ingin', 'tahu', 'informasi', 'terkait',
    'yang', 'dan', 'di', 'ke', 'dari', 'untuk', 'dengan', 'pada', 'adalah', 'seperti',
    'naik', 'turun', 'lonjakan', 'ketimbang', 'dibanding', 'versus', 'vs', 'perbandingan',
    'triwulan', 'kuartal', 'q1', 'q2', 'q3', 'q4', 'januari', 'februari', 'maret'
  ];
  
  const fillerRegex = new RegExp(`\\b(${fillers.join('|')})\\b`, 'gi');
  cleaned = cleaned.replace(fillerRegex, '');

  // 4. Clean up whitespace
  return cleaned.replace(/\s+/g, ' ').trim();
}

/**
 * Scrapes web data (news) relevant to a query and region using Google News RSS.
 */
export async function scrapeWebData(query: string, region: string): Promise<WebDataItem[]> {
  const cleaned = cleanQuery(query) || query;
  
  // Extract core keywords (first 2-3 words of cleaned query usually contain the subject)
  const coreKeywords = cleaned.split(' ').slice(0, 3).join(' ');

  const searchCandidates: string[] = [];

  // Extract pure region name
  const regionParts = region.split(',');
  const pureRegion = regionParts[0].trim();
  const province = regionParts.length > 1 ? regionParts[1].trim() : 'Sumatera Utara';

  // 1. Keywords + Region
  searchCandidates.push(`${cleaned} ${pureRegion}`);

  // 2. Core Keywords + Region (Broader)
  if (coreKeywords !== cleaned) {
    searchCandidates.push(`${coreKeywords} ${pureRegion}`);
  }

  // 3. Keywords + Province
  if (pureRegion.toLowerCase() !== province.toLowerCase()) {
    searchCandidates.push(`${cleaned} ${province}`);
  }

  // 4. Broadest Fallback: Just Core Keywords + "Sumatera Utara"
  searchCandidates.push(`${coreKeywords} Sumatera Utara`);

  const uniqueQueries = Array.from(new Set(searchCandidates)).slice(0, 4);

  let allResults: WebDataItem[] = [];

  console.log(`[Scraper] Query Asli: "${query}"`);
  console.log(`[Scraper] Keywords Terdeteksi: "${cleaned}"`);
  console.log(`[Scraper] Menjalankan ${uniqueQueries.length} variasi pencarian...`);

  for (const fullQuery of uniqueQueries) {
    const encodedQuery = encodeURIComponent(fullQuery);
    const rssUrl = `https://news.google.com/rss/search?q=${encodedQuery}&hl=id&gl=ID&ceid=ID:id`;

    try {
      console.log(`[Scraper] Mencoba: "${fullQuery}"`);
      const response = await fetch(rssUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'application/xml, text/xml, */*',
        },
      });

      if (!response.ok) {
        console.warn(`[Scraper] HTTP ${response.status} untuk "${fullQuery}"`);
        continue;
      }

      const xml = await response.text();
      const $ = cheerio.load(xml, { xmlMode: true });
      const currentQueryResults: WebDataItem[] = [];

      $('item').each((i, el) => {
        if (i >= 8) return false; 
        const title = $(el).find('title').first().text().trim();
        const rawLink = $(el).find('link').text().trim();
        const description = $(el).find('description').text().replace(/<[^>]*>/g, '').trim();
        const sourceName = $(el).find('source').text().trim();
        const pubDate = $(el).find('pubDate').text().trim();

        if (title && rawLink) {
          currentQueryResults.push({
            title,
            url: rawLink,
            snippet: description.substring(0, 300),
            source: sourceName || 'Berita Lokal',
            publishedAt: pubDate,
          });
        }
      });

      if (currentQueryResults.length > 0) {
        console.log(`[Scraper] Mendapatkan ${currentQueryResults.length} hasil dari "${fullQuery}"`);
        allResults = [...allResults, ...currentQueryResults];
        // If we found enough results from specific queries, we can stop
        if (allResults.length >= 10) break;
      }
    } catch (error) {
      console.error(`[Scraper] Gagal pada "${fullQuery}":`, error);
    }
  }

  const uniqueResults = Array.from(new Map(allResults.map(item => [item.url, item])).values());
  console.log(`[Scraper] Selesai. Total unik: ${uniqueResults.length}`);
  
  return uniqueResults.slice(0, 20); 
}



