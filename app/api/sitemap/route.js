import fs from "fs";
import path from "path";
import { fetch } from "@/api/api";
import { buildSitemapFile } from "@/app/api/sitemap/buildSitemapFile";

function extractSitemapPath(pathname) {
  return pathname.replace(/^\/sitemap\//, "");
}

/**
 * API ruta za dinamičko serviranje sitemap fajlova na osnovu query parametra `slug`.
 * Omogućava crawler-ima pristup sitemap fajlovima u /tmp direktorijumu.
 *
 * @param {Request} req - HTTP zahtev sa query parametrom `slug`.
 * @param {Headers} req.headers - HTTP zaglavlja koja sadrže informacije o protokolu i hostu.
 * @returns {Promise<Response>} - XML sadržaj sitemap fajla ili JSON poruka o grešci.
 * 
 * @throws {Error} Ako nema dostupnih sitemap fajlova ili dođe do greške u procesu.

 */

export async function GET(req) {
  const { pathname } = new URL(req.url);
  console.log("pathname", pathname);
  const urlKey = extractSitemapPath(pathname);
  console.log("urlKey", urlKey);

  const outputPath = path.join("/tmp/sitemap", urlKey);
  // Provera da li sitemap fajl već postoji
  if (fs.existsSync(outputPath)) {
    console.log("robots.txt exists, loading content...");
    const fileContent = fs.readFileSync(outputPath, "utf-8");

    console.log("/TMP fileContent", fileContent);
    if (fileContent) {
      return new Response(fileContent, {
        status: 200,
        headers: {
          "Content-Type": "application/xml",
        },
      });
    }
  }

  // Dohvatanje liste fajlova za sitemap
  const keyListResponse = await fetch(`/sitemap/key-list`);
  const keyList = keyListResponse?.payload;

  const sitemapData = await buildSitemapFile(keyList);

  const currentData = sitemapData.find((d) => d.key === urlKey);

  sitemapData.forEach(({ key, content }) => {
    // Formiranje putanje do fajla u `/tmp` direktorijumu
    const outputPath = path.join("/tmp/sitemap", key);
    // Kreiranje potrebnih direktorijuma ukoliko ne postoje
    const outputDir = path.dirname(outputPath);
    fs.mkdirSync(outputDir, { recursive: true });

    // Zapisivanje XML sadržaja u fajl
    fs.writeFileSync(outputPath, content, "utf-8");
  });

  return new Response(currentData?.content, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
