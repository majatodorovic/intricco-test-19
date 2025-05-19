import { fetch } from "@/api/api";
import fs from "fs";
import path from "path";

/**
 * API ruta za azuriranje robots fajla
 * Brise se robots iz /tmp direktorijuma
 * Preuzima se sadrzaj za robots fajl
 * robots fajl sa upunjenim sadrzajem se postavlja u /tmp direktorijum
 */

export async function POST(req) {
  // Provera IP adrese
  const clientIP = req.headers.get("x-forwarded-for");

  if (clientIP !== process.env.SERVER_IP) {
    console.log("Unauthorized");
    return new Response("Unauthorized", { status: 403 });
  }

  const outputPath = path.join("/tmp", "robots");
  if (fs.existsSync(outputPath)) {
    console.log("Robots exists in tmp dir");
    const fileContent = fs.readFileSync(outputPath, "utf-8");

    console.log(fileContent);

    fs.rmSync(outputPath, { recursive: true, force: true });
    if (fs.existsSync(outputPath)) {
      return new Response("Something went wrong!", {
        status: 500,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }
  }

  console.log("Robots does not exist in tmp dir, downloading data...");
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

  return new Response(robotsContent.trim(), {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
