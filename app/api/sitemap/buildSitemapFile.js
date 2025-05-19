const { fetch } = require("../../../api/api");

/**
 * Dekodira Base64 string u XML sadržaj.
 *
 * @param {string} base64Content - Base64 kodirani string.
 * @returns {string} - Dekodirani XML string.
 */
const decodeBase64ToXml = (base64Content) => {
  const base64Data = base64Content.split(",")[1];
  return Buffer.from(base64Data, "base64").toString("utf-8");
};

/**
 * buildSitemapFile - Glavna funkcija za generisanje sitemap fajlova
 *
 * Ova funkcija:
 * 1. Briše stare sitemap fajlove.
 * 2. Iterira kroz svaki fajl i preuzima njegov sadržaj.
 * 3. Generiše nove fajlove u `/tmp` direktorijumu.
 *
 * @async
 * @param {Array<{path: string}>} fileList - Lista fajlova za generisanje sitemap-a.
 * @returns {Promise<Response>} - HTTP odgovor koji ukazuje na uspešnost generisanja sitemap-a.
 *
 * @throws {Error} Ako dođe do greške tokom generisanja sitemap fajlova.
 */
const buildSitemapFile = async (keyList) => {
  const sitemapData = [];

  // Iteracija kroz fajlove i dohvatanje njihovog sadržaja
  for (const file of keyList) {
    console.log(`Generated file: ${file.path}`);

    try {
      const fetchResponse = await fetch(`/sitemap`, { path: file.path });
      const base64Content = fetchResponse?.payload?.file_base64;
      if (!base64Content) {
        console.warn(`No content found for file: ${file.path}`);
        continue;
      }

      const xmlContent = decodeBase64ToXml(base64Content);

      sitemapData.push({ key: file.key, path: file.path, content: xmlContent });
    } catch (fetchError) {
      console.error(
        `Error fetching content for file: ${file.path}`,
        fetchError,
      );
      continue;
    }
  }

  // Provera da li ima prikupljenih podataka za zapisivanje
  if (sitemapData.length === 0) {
    throw new Error("No valid sitemap data fetched");
  }
  return sitemapData;
};

module.exports = { buildSitemapFile };
