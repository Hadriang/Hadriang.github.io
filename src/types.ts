export type HardwareSlot =
  | "mouse"
  | "keyboard"
  | "monitor"
  | "headset"
  | "mousepad"
  | "chair";

export type RankingMode = "exact" | "grouped";

export interface GearItem {
  name: string;
}

export interface PlayerRecord {
  id: string;
  team: string;
  player: string;
  role?: string;
  country?: string;
  gear: Partial<Record<HardwareSlot, GearItem>>;
  settings: Record<string, string | null>;
}

export interface SnapshotMetadata {
  gameSlug: string;
  gameName: string;
  sourceUrl: string;
  scrapedAt: string;
  rowCount: number;
  columns: string[];
  sourceNotice: string;
}

export interface GameSnapshot {
  metadata: SnapshotMetadata;
  players: PlayerRecord[];
}

export interface HardwareCategory {
  slot: HardwareSlot;
  label: string;
  route: string;
}
