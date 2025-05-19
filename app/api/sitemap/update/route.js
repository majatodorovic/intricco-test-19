import { buildSitemapFile } from "@/app/api/sitemap/buildSitemapFile";
import fs from "fs";
import path from "path";

/**
 * API ruta za zakazano osvežavanje sitemap fajlova
 *
 * @param {Request} req - HTTP zahtev koji sadrži informacije o autorizaciji cron secret.
 * @returns {Promise<Response>} - JSON odgovor o statusu osvežavanja sitemap-a.
 */

export async function POST(req) {
  const body = await req.json();

  const clientIP = req.headers.get("x-forwarded-for");

  console.log("body", body);

  // Provera IP adrese
  if (clientIP !== process.env.SERVER_IP) {
    console.log("Unauthorized");
    return new Response("Unauthorized", { status: 403 });
  }

  const sitemapData = await buildSitemapFile(body);

  //Brisanje starog sadrzaja iz sitemap foldera
  fs.rmSync("/tmp/sitemap", { recursive: true, force: true });

  sitemapData.forEach(({ key, content }) => {
    // Formiranje putanje do fajla u `/tmp` direktorijumu
    const outputPath = path.join("/tmp/sitemap", key);
    // Kreiranje potrebnih direktorijuma ukoliko ne postoje
    const outputDir = path.dirname(outputPath);
    fs.mkdirSync(outputDir, { recursive: true });

    // Zapisivanje XML sadržaja u fajl
    fs.writeFileSync(outputPath, content, "utf-8");
  });

  return new Response("Success update", {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
