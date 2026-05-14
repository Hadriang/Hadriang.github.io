import { getGroupedName } from "../data/aliases";
import { compareByCs2TeamRanking } from "./teamRankings";
import type { GameSnapshot, HardwareSlot, PlayerRecord, RankingMode } from "../types";

export interface HardwareUsage {
  player: PlayerRecord;
  exactName: string;
  sourceIndex: number;
}

export interface HardwareRanking {
  rank: number;
  name: string;
  count: number;
  percent: number;
  exactNames: string[];
  players: HardwareUsage[];
}

export interface HardwareSummary {
  totalPlayers: number;
  knownPlayers: number;
  unknownPlayers: number;
  modelCount: number;
  exactModelCount: number;
  collapsedModelCount: number;
  topProduct?: string;
}

export interface HardwareAggregation {
  rankings: HardwareRanking[];
  summary: HardwareSummary;
}

export type SortKey = "count" | "name";

export function normalizeProductName(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function summarizeHardware(snapshot: GameSnapshot, slot: HardwareSlot): HardwareSummary {
  const groupedModels = new Set<string>();
  const exactModels = new Set<string>();
  let knownPlayers = 0;

  for (const player of snapshot.players) {
    const exactName = normalizeProductName(player.gear[slot]?.name ?? "");

    if (!exactName) {
      continue;
    }

    knownPlayers += 1;
    exactModels.add(exactName);
    groupedModels.add(normalizeProductName(getGroupedName(slot, exactName)));
  }

  const exactModelCount = exactModels.size;
  const modelCount = groupedModels.size;

  return {
    totalPlayers: snapshot.players.length,
    knownPlayers,
    unknownPlayers: snapshot.players.length - knownPlayers,
    modelCount,
    exactModelCount,
    collapsedModelCount: Math.max(exactModelCount - modelCount, 0)
  };
}

export function aggregateHardware(
  snapshot: GameSnapshot,
  slot: HardwareSlot,
  mode: RankingMode,
  search = "",
  sort: SortKey = "count"
): HardwareAggregation {
  const summary = summarizeHardware(snapshot, slot);
  const groups = new Map<string, HardwareUsage[]>();
  const query = search.trim().toLowerCase();

  for (const [sourceIndex, player] of snapshot.players.entries()) {
    const exactName = normalizeProductName(player.gear[slot]?.name ?? "");
    if (!exactName) {
      continue;
    }

    const groupedName = mode === "grouped" ? getGroupedName(slot, exactName) : exactName;
    const bucketName = normalizeProductName(groupedName);

    if (query && !matchesSearch(player, bucketName, exactName, query)) {
      continue;
    }

    const existing = groups.get(bucketName) ?? [];
    existing.push({ player, exactName, sourceIndex });
    groups.set(bucketName, existing);
  }

  const rankings = Array.from(groups.entries())
    .map(([name, players]) => ({
      rank: 0,
      name,
      count: players.length,
      percent: summary.knownPlayers === 0 ? 0 : (players.length / summary.knownPlayers) * 100,
      exactNames: Array.from(new Set(players.map((usage) => usage.exactName))).sort((a, b) => a.localeCompare(b)),
      players: sortPlayers(snapshot, players)
    }))
    .sort((a, b) => {
      if (sort === "name") {
        return a.name.localeCompare(b.name);
      }

      return b.count - a.count || a.name.localeCompare(b.name);
    })
    .map((ranking, index) => ({ ...ranking, rank: index + 1 }));

  return {
    rankings,
    summary: {
      ...summary,
      topProduct: rankings[0]?.name
    }
  };
}

function sortPlayers(snapshot: GameSnapshot, players: HardwareUsage[]): HardwareUsage[] {
  if (snapshot.metadata.gameSlug === "cs2") {
    return [...players].sort(compareByCs2TeamRanking);
  }

  return [...players].sort((a, b) => a.sourceIndex - b.sourceIndex);
}

function matchesSearch(player: PlayerRecord, groupName: string, exactName: string, query: string): boolean {
  return [groupName, exactName, player.player, player.team, player.country ?? "", player.role ?? ""]
    .some((value) => value.toLowerCase().includes(query));
}
