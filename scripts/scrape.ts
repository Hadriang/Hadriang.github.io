import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseProSettingsTable, proSettingsGames } from "./proSettingsParser";
import { compareSnapshots, formatSnapshotChangeReport } from "./snapshotDiff";
import type { GameSnapshot } from "../src/types";

const requestedSlugs = process.argv.slice(2);
const slugs = requestedSlugs.length > 0 ? requestedSlugs : Object.keys(proSettingsGames);
const publicOutputDir = path.resolve("public/data");

await mkdir(publicOutputDir, { recursive: true });

for (const slug of slugs) {
  const config = proSettingsGames[slug];
  if (!config) {
    throw new Error(`Unknown game slug: ${slug}`);
  }

  console.log(`Fetching ${config.sourceUrl}`);
  const response = await fetch(config.sourceUrl, {
    headers: {
      "user-agent": "HardwareStatsLocalSnapshot/0.1 (+https://prosettings.net/lists/)"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${config.sourceUrl}: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const snapshot = parseProSettingsTable(html, config);
  const outputPath = path.join(publicOutputDir, `${slug}.json`);
  const previousSnapshot = await readExistingSnapshot(outputPath);
  const report = compareSnapshots(previousSnapshot, snapshot);
  const serializedSnapshot = `${JSON.stringify(snapshot, null, 2)}\n`;

  await writeFile(outputPath, serializedSnapshot, "utf8");
  console.log(`Wrote ${outputPath} (${snapshot.metadata.rowCount} rows)`);
  console.log("");
  console.log(formatSnapshotChangeReport(report));
}

async function readExistingSnapshot(filePath: string): Promise<GameSnapshot | undefined> {
  try {
    return JSON.parse(await readFile(filePath, "utf8")) as GameSnapshot;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return undefined;
    }

    throw error;
  }
}
