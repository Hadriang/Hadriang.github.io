import { load, type Cheerio, type CheerioAPI } from "cheerio";
import type { Element } from "domhandler";
import type { GameSnapshot, HardwareSlot, PlayerRecord } from "../src/types";

export interface ProSettingsGameConfig {
  slug: string;
  name: string;
  sourceUrl: string;
}

export const proSettingsGames: Record<string, ProSettingsGameConfig> = {
  cs2: {
    slug: "cs2",
    name: "CS2",
    sourceUrl: "https://prosettings.net/lists/cs2/"
  },
  valorant: {
    slug: "valorant",
    name: "VALORANT",
    sourceUrl: "https://prosettings.net/lists/valorant/"
  },
  "apex-legends": {
    slug: "apex-legends",
    name: "Apex Legends",
    sourceUrl: "https://prosettings.net/lists/apex-legends/"
  },
  fortnite: {
    slug: "fortnite",
    name: "Fortnite",
    sourceUrl: "https://prosettings.net/lists/fortnite/"
  }
};

const hardwareHeaders: Record<string, HardwareSlot> = {
  mouse: "mouse",
  monitor: "monitor",
  chair: "chair",
  mousepad: "mousepad",
  keyboard: "keyboard",
  headset: "headset"
};

const ignoredHeaders = new Set(["gpu"]);
const baseHeaders = new Set(["team", "player", "role", ...Object.keys(hardwareHeaders), ...ignoredHeaders]);

export function parseProSettingsTable(
  html: string,
  config: ProSettingsGameConfig,
  scrapedAt = new Date().toISOString()
): GameSnapshot {
  const $ = load(html);
  const table = $("#pro-list-table");

  if (table.length === 0) {
    throw new Error(`Could not find #pro-list-table for ${config.slug}`);
  }

  const columns = table
    .find("thead th")
    .toArray()
    .map((header) => cleanText($(header).text()))
    .filter((header) => Boolean(header) && !ignoredHeaders.has(normalizeHeader(header)));

  const rawHeaders = table.find("thead th").toArray().map((header) => cleanText($(header).text()));
  const players: PlayerRecord[] = [];

  table.find("tbody tr").each((index, row) => {
    const cells = $(row).find("td").toArray();
    const byHeader = new Map<string, Cheerio<Element>>();

    rawHeaders.forEach((header, headerIndex) => {
      if (!header) {
        return;
      }

      const cell = cells[headerIndex];
      if (cell) {
        byHeader.set(normalizeHeader(header), $(cell));
      }
    });

    const playerCell = byHeader.get("player");
    const player = getCellText($, playerCell);
    const team = getCellText($, byHeader.get("team"));

    if (!player) {
      return;
    }

    const gear: PlayerRecord["gear"] = {};
    for (const [header, slot] of Object.entries(hardwareHeaders)) {
      const gearName = getCellText($, byHeader.get(header));
      if (gearName) {
        gear[slot] = { name: gearName };
      }
    }

    const settings: PlayerRecord["settings"] = {};
    for (const header of rawHeaders) {
      const normalized = normalizeHeader(header);
      if (!normalized || baseHeaders.has(normalized)) {
        continue;
      }

      settings[normalized] = getCellText($, byHeader.get(normalized)) || null;
    }

    players.push({
      id: `${config.slug}-${slugify(player)}-${index + 1}`,
      team,
      player,
      role: getCellText($, byHeader.get("role")) || undefined,
      country: getCountry(playerCell),
      gear,
      settings
    });
  });

  return {
    metadata: {
      gameSlug: config.slug,
      gameName: config.name,
      sourceUrl: config.sourceUrl,
      scrapedAt,
      rowCount: players.length,
      columns,
      sourceNotice:
        "Data snapshot parsed from the public ProSettings list page. Source product images and source affiliate links are not copied."
    },
    players
  };
}

function getCellText($: CheerioAPI, cell?: Cheerio<Element>): string {
  if (!cell || cell.length === 0) {
    return "";
  }

  const firstLinkText = cleanText(cell.find("a").first().text());
  if (firstLinkText) {
    return firstLinkText;
  }

  return cleanText(cell.text());
}

function getCountry(playerCell?: Cheerio<Element>): string | undefined {
  const alt = playerCell?.find("img[alt]").first().attr("alt");
  if (!alt) {
    return undefined;
  }

  const cleaned = cleanText(alt.replace(/^Image:\s*/i, ""));
  return cleaned || undefined;
}

function cleanText(value: string): string {
  return value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeHeader(header: string): string {
  const normalized = cleanText(header).toLowerCase();
  if (normalized === "hz") {
    return "hz";
  }
  if (normalized === "dpi") {
    return "dpi";
  }
  if (normalized === "edpi") {
    return "edpi";
  }

  return normalized.replace(/[^a-z0-9]+([a-z0-9])/g, (_, char: string) => char.toUpperCase());
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
