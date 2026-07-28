import { existsSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { buildAdsTxt, publisherIdFromClient } from "../src/lib/ads-txt";

const outputPath = path.resolve("public/ads.txt");
const publisherId = process.env.ADSENSE_PUBLISHER_ID?.trim()
  || publisherIdFromClient(process.env.NEXT_PUBLIC_ADSENSE_CLIENT);
const content = buildAdsTxt(publisherId);

if (!content) {
  if (existsSync(outputPath)) rmSync(outputPath);
  console.log("ads.txt skipped: AdSense publisher ID is not configured");
  process.exit(0);
}

writeFileSync(outputPath, content, "utf8");
console.log(`ads.txt generated for pub-${publisherId}`);
