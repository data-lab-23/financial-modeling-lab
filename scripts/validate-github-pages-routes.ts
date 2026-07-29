import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import path from "node:path";

const representativeRoutes = ["about", "model-design", "valuation"];

async function main() {
  for (const route of representativeRoutes) {
    const indexFile = path.join("out", route, "index.html");
    await assert.doesNotReject(
      access(indexFile),
      `GitHub Pages must emit ${indexFile} so both /${route} and /${route}/ resolve`,
    );
  }

  console.log("GitHub Pages route validation passed.");
}

void main();
