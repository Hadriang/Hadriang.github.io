import type { GameSnapshot, HardwareSlot, PlayerRecord } from "../src/types";

const gearSlots: HardwareSlot[] = ["mouse", "keyboard", "monitor", "headset", "mousepad", "chair"];

export interface SnapshotChangeReport {
  beforeRows: number;
  afterRows: number;
  rowDelta: number;
  addedPlayers: string[];
  removedPlayers: string[];
  updatedPlayers: string[];
  changedGearFields: number;
  changedSettingsFields: number;
}

export function compareSnapshots(before: GameSnapshot | undefined, after: GameSnapshot): SnapshotChangeReport {
  const beforeRows = before?.metadata.rowCount ?? 0;
  const afterRows = after.metadata.rowCount;

  if (!before) {
    return {
      beforeRows,
      afterRows,
      rowDelta: afterRows,
      addedPlayers: after.players.map(formatPlayer),
      removedPlayers: [],
      updatedPlayers: [],
      changedGearFields: 0,
      changedSettingsFields: 0
    };
  }

  const beforePlayers = mapPlayers(before.players);
  const afterPlayers = mapPlayers(after.players);
  const addedPlayers: string[] = [];
  const removedPlayers: string[] = [];
  const updatedPlayers: string[] = [];
  let changedGearFields = 0;
  let changedSettingsFields = 0;

  for (const [key, player] of afterPlayers) {
    const previous = beforePlayers.get(key);
    if (!previous) {
      addedPlayers.push(formatPlayer(player));
      continue;
    }

    const playerChanges = countPlayerChanges(previous, player);
    changedGearFields += playerChanges.gear;
    changedSettingsFields += playerChanges.settings;

    if (playerChanges.total > 0) {
      updatedPlayers.push(formatPlayer(player));
    }
  }

  for (const [key, player] of beforePlayers) {
    if (!afterPlayers.has(key)) {
      removedPlayers.push(formatPlayer(player));
    }
  }

  return {
    beforeRows,
    afterRows,
    rowDelta: afterRows - beforeRows,
    addedPlayers,
    removedPlayers,
    updatedPlayers,
    changedGearFields,
    changedSettingsFields
  };
}

export function formatSnapshotChangeReport(report: SnapshotChangeReport): string {
  const lines = [
    "Scrape change report",
    `Rows: ${report.beforeRows} -> ${report.afterRows} (${formatSigned(report.rowDelta)})`,
    `Players added: ${report.addedPlayers.length}`,
    `Players removed: ${report.removedPlayers.length}`,
    `Players updated: ${report.updatedPlayers.length}`,
    `Gear fields changed: ${report.changedGearFields}`,
    `Settings fields changed: ${report.changedSettingsFields}`
  ];

  appendSample(lines, "Added", report.addedPlayers);
  appendSample(lines, "Removed", report.removedPlayers);
  appendSample(lines, "Updated", report.updatedPlayers);

  return lines.join("\n");
}

function countPlayerChanges(before: PlayerRecord, after: PlayerRecord): { gear: number; settings: number; total: number } {
  let gear = 0;
  let settings = 0;
  let profile = 0;

  if (before.team !== after.team) {
    profile += 1;
  }
  if ((before.role ?? "") !== (after.role ?? "")) {
    profile += 1;
  }
  if ((before.country ?? "") !== (after.country ?? "")) {
    profile += 1;
  }

  for (const slot of gearSlots) {
    if ((before.gear[slot]?.name ?? "") !== (after.gear[slot]?.name ?? "")) {
      gear += 1;
    }
  }

  const settingKeys = new Set([...Object.keys(before.settings), ...Object.keys(after.settings)]);
  for (const key of settingKeys) {
    if ((before.settings[key] ?? "") !== (after.settings[key] ?? "")) {
      settings += 1;
    }
  }

  return { gear, settings, total: profile + gear + settings };
}

function mapPlayers(players: PlayerRecord[]): Map<string, PlayerRecord> {
  const counts = new Map<string, number>();
  const mapped = new Map<string, PlayerRecord>();

  for (const player of players) {
    const baseKey = `${normalize(player.team)}::${normalize(player.player)}`;
    const occurrence = counts.get(baseKey) ?? 0;
    counts.set(baseKey, occurrence + 1);
    mapped.set(`${baseKey}::${occurrence}`, player);
  }

  return mapped;
}

function appendSample(lines: string[], label: string, players: string[]): void {
  if (players.length === 0) {
    return;
  }

  lines.push(`${label} sample: ${players.slice(0, 5).join(", ")}${players.length > 5 ? ", ..." : ""}`);
}

function formatPlayer(player: PlayerRecord): string {
  return `${player.player} (${player.team || "No team"})`;
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function formatSigned(value: number): string {
  return value > 0 ? `+${value}` : value.toString();
}
