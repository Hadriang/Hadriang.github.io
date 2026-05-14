import type { PlayerRecord } from "../types";

export const cs2TeamRankingSnapshot = {
  label: "HLTV team ranking snapshot, May 11 2026",
  sourceUrl: "https://www.hltv.org/ranking/teams/2026/may/11/10278",
  date: "2026-05-11",
  teams: [
    "Vitality",
    "Natus Vincere",
    "FURIA",
    "Falcons",
    "Spirit",
    "Aurora",
    "PARIVISION",
    "The MongolZ",
    "Astralis",
    "FUT",
    "MOUZ",
    "G2",
    "FaZe",
    "GamerLegion",
    "3DMAX",
    "9z",
    "B8",
    "Legacy",
    "Monte",
    "HEROIC",
    "M80",
    "BetBoom",
    "TYLOO",
    "Liquid",
    "Alliance",
    "MIBR",
    "NRG",
    "Gentle Mates",
    "EYEBALLERS",
    "BIG",
    "SINNERS",
    "paiN",
    "HOTU",
    "Ninjas in Pyjamas",
    "Passion UA",
    "BESTIA",
    "FOKUS",
    "Sashi",
    "Inner Circle",
    "magic",
    "Wildcard",
    "fnatic",
    "Gaimin Gladiators",
    "Walczaki",
    "BC.Game",
    "Lynn Vision",
    "Tricked",
    "Fisher College",
    "ShindeN",
    "Sharks"
  ]
} as const;

interface RankedUsage {
  player: Pick<PlayerRecord, "team">;
  sourceIndex: number;
}

const teamAliases: Record<string, string> = {
  "Team Vitality": "Vitality",
  "Natus Vincere": "Natus Vincere",
  FURIA: "FURIA",
  "Falcons Esports": "Falcons",
  "Team Spirit": "Spirit",
  Aurora: "Aurora",
  PARIVISION: "PARIVISION",
  "The Mongolz": "The MongolZ",
  "FUT Esports": "FUT",
  "G2 Esports": "G2",
  "FaZe Clan": "FaZe",
  "9z Team": "9z",
  "B8 Esports": "B8",
  "BetBoom Team": "BetBoom",
  TyLoo: "TYLOO",
  "Team Liquid": "Liquid",
  "paiN Gaming": "paiN",
  "SINNERS Esports": "SINNERS",
  "Fokus Clan": "FOKUS",
  "Inner Circle Esports": "Inner Circle",
  "Wildcard Gaming": "Wildcard",
  Fnatic: "fnatic",
  "Tricked Esport": "Tricked"
};

const canonicalByKey = new Map<string, string>(cs2TeamRankingSnapshot.teams.map((team) => [teamKey(team), team]));
const aliasByKey = new Map<string, string>(Object.entries(teamAliases).map(([alias, canonical]) => [teamKey(alias), canonical]));
const rankByTeam = new Map<string, number>(cs2TeamRankingSnapshot.teams.map((team, index) => [team, index + 1]));

export function getCs2CanonicalTeamName(team: string): string {
  const key = teamKey(team);
  return aliasByKey.get(key) ?? canonicalByKey.get(key) ?? team.trim();
}

export function getCs2TeamRank(team: string): number | undefined {
  return rankByTeam.get(getCs2CanonicalTeamName(team));
}

export function compareByCs2TeamRanking(a: RankedUsage, b: RankedUsage): number {
  const aInfo = getTeamSortInfo(a.player.team);
  const bInfo = getTeamSortInfo(b.player.team);

  if (aInfo.canonicalName === bInfo.canonicalName) {
    return a.sourceIndex - b.sourceIndex;
  }

  if (aInfo.rank !== undefined && bInfo.rank !== undefined) {
    return aInfo.rank - bInfo.rank;
  }

  if (aInfo.rank !== undefined) {
    return -1;
  }

  if (bInfo.rank !== undefined) {
    return 1;
  }

  return aInfo.sortName.localeCompare(bInfo.sortName) || a.sourceIndex - b.sourceIndex;
}

function getTeamSortInfo(team: string): { canonicalName: string; rank?: number; sortName: string } {
  const canonicalName = getCs2CanonicalTeamName(team);
  return {
    canonicalName,
    rank: rankByTeam.get(canonicalName),
    sortName: canonicalName.toLowerCase()
  };
}

function teamKey(value: string): string {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();
}
