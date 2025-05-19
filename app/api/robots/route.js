import { fetch } from "@/api/api";
import fs from "fs";
import path from "path";

/**
 * API ruta za generisanje robots fajla
 * Ako fajl postoji u /tmp, koristi postojeći sadržaj.
 * Ako ne postoji, preuzima podatke sa API-ja, kreira fajl i vraća njegov sadržaj.
 */

export async function GET(req) {
  const outputPath = path.join("/tmp", "robots");

  // Provera da li robots fajl već postoji
  if (fs.existsSync(outputPath)) {
    console.log("robots exists, loading content...");
    const fileContent = fs.readFileSync(outputPath, "utf-8");

    return new Response(fileContent.trim(), {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  console.log("robots does not exist, downloading data...");
  const { headers } = req;
  const protocol = headers.get("x-forwarded-proto") || "http";
  const host = headers.get("host") || "localhost:3000";

  // Dohvatanje podataka za robots
  const response = await fetch(`/robots`);
  const robotsData = response?.payload;

  if (!response.success) {
    console.error("No robot files found.");
    throw new Error("No robot files found");
  }

  const link =
    robotsData?.sitemap_link ||
    `${protocol}://${host}/sitemap/index.xml`;
  const file_content = robotsData?.file_content || "User-agent: *\nDisallow:";

  // Kreiranje sadržaja robots
  const robotsContent = `${file_content}\n\nSitemap: ${link}`;

  console.log("robots content:", robotsContent);

  // Kreiranje fajla u /tmp direktorijumu
  fs.writeFileSync(outputPath, robotsContent, "utf-8");

  // Provera da li je fajl uspešno upisan
  if (fs.existsSync(outputPath)) {
    console.log("robots successfully created.");
    const fileContent = fs.readFileSync(outputPath, "utf-8");
    console.log("Sadržaj /tmp/robots:", fileContent);
  } else {
    console.error("Failed to create robots.");
  }

  return new Response(robotsContent.trim(), {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
