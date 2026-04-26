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
function cleanQuery(query: string): string {
  return query
    .replace(/(cari|temukan|tampilkan|jelaskan|analisis|mengapa|apa|bagaimana|fenomena|data|statistik|berita)/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Scrapes web data (news) relevant to a query and region using Google News RSS.
 * Falls back to multiple variations to ensure results are found.
 */
export async function scrapeWebData(query: string, region: string): Promise<WebDataItem[]> {
  const cleaned = cleanQuery(query);
  
  // Define regional aliases for better coverage
  const regionAliases: Record<string, string[]> = {
    "DI Yogyakarta": ["Yogyakarta", "Jogja"],
    "DKI Jakarta": ["Jakarta"],
    "Kepulauan Bangka Belitung": ["Bangka Belitung", "Babel"],
    "Kepulauan Riau": ["Kepri"],
  };

  const currentRegionAliases = regionAliases[region] || [];
  
  // Build a list of candidate queries to try in order
  const searchCandidates: string[] = [];

  // 1. Cleaned Query + Original Region
  searchCandidates.push(`${cleaned} ${region}`);

  // 2. Cleaned Query + Region Aliases
  for (const alias of currentRegionAliases) {
    searchCandidates.push(`${cleaned} ${alias}`);
  }

  // 3. Handling synonyms for "triwulan"
  if (cleaned.toLowerCase().includes('triwulan')) {
    const kuartalQuery = cleaned.replace(/triwulan/gi, 'kuartal');
    searchCandidates.push(`${kuartalQuery} ${region}`);
    for (const alias of currentRegionAliases) {
      searchCandidates.push(`${kuartalQuery} ${alias}`);
    }
  }

  // 4. Raw Query (original fallback)
  searchCandidates.push(query);

  // 5. Broad search (Cleaned query only, no region)
  searchCandidates.push(cleaned);

  // Use a Set to ensure unique queries and maintain order
  const uniqueQueries = Array.from(new Set(searchCandidates));

  for (const fullQuery of uniqueQueries) {
    const encodedQuery = encodeURIComponent(fullQuery);
    const rssUrl = `https://news.google.com/rss/search?q=${encodedQuery}&hl=id&gl=ID&ceid=ID:id`;

    try {
      console.log(`[Scraper] Attempting query: "${fullQuery}"`);
      const response = await fetch(rssUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/rss+xml, application/xml, text/xml',
        },
        cache: 'no-store',
      });

      if (!response.ok) continue;

      const xml = await response.text();
      const $ = cheerio.load(xml, { xmlMode: true });
      const results: WebDataItem[] = [];

      $('item').each((i, el) => {
        if (i >= 15) return false;
        const title = $(el).find('title').first().text().trim();
        const rawLink = $(el).find('link').text().trim() || $(el).find('guid').text().trim();
        const description = $(el).find('description').text().replace(/<[^>]*>/g, '').trim();
        const sourceName = $(el).find('source').text().trim();
        const pubDate = $(el).find('pubDate').text().trim();

        if (title && rawLink) {
          results.push({
            title,
            url: rawLink,
            snippet: description.substring(0, 400),
            source: sourceName || 'Sumber Berita',
            publishedAt: pubDate,
          });
        }
      });

      if (results.length > 0) {
        console.log(`[Scraper] Successfully found ${results.length} articles for: "${fullQuery}"`);
        return results;
      }
    } catch (error) {
      console.error(`[Scraper] Error searching "${fullQuery}":`, error);
    }
  }

  return [];
}
