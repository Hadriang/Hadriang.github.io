import { describe, expect, it } from "vitest";
import { compareSnapshots } from "../scripts/snapshotDiff";
import type { GameSnapshot } from "../src/types";

describe("compareSnapshots", () => {
  it("reports row, player, gear, and settings changes", () => {
    const before = snapshot([
      player("1", "Team Vitality", "ZywOo", "Mouse A", "400"),
      player("2", "Natus Vincere", "b1t", "Mouse B", "800"),
      player("3", "FURIA", "KSCERATO", "Mouse C", "800")
    ]);
    const after = snapshot([
      player("1", "Team Vitality", "ZywOo", "Mouse A", "400"),
      player("2", "Natus Vincere", "b1t", "Mouse X", "800"),
      player("4", "Falcons Esports", "m0NESY", "Mouse D", "400")
    ]);

    const report = compareSnapshots(before, after);

    expect(report).toMatchObject({
      beforeRows: 3,
      afterRows: 3,
      rowDelta: 0,
      addedPlayers: ["m0NESY (Falcons Esports)"],
      removedPlayers: ["KSCERATO (FURIA)"],
      updatedPlayers: ["b1t (Natus Vincere)"],
      changedGearFields: 1,
      changedSettingsFields: 0
    });
  });

  it("treats a missing previous snapshot as all added rows", () => {
    const report = compareSnapshots(undefined, snapshot([player("1", "Team Vitality", "ZywOo", "Mouse A", "400")]));

    expect(report.beforeRows).toBe(0);
    expect(report.afterRows).toBe(1);
    expect(report.addedPlayers).toEqual(["ZywOo (Team Vitality)"]);
  });
});

function snapshot(players: GameSnapshot["players"]): GameSnapshot {
  return {
    metadata: {
      gameSlug: "cs2",
      gameName: "CS2",
      sourceUrl: "https://prosettings.net/lists/cs2/",
      scrapedAt: "2026-05-13T12:00:00.000Z",
      rowCount: players.length,
      columns: [],
      sourceNotice: "test"
    },
    players
  };
}

function player(id: string, team: string, name: string, mouse: string, dpi: string): GameSnapshot["players"][number] {
  return {
    id,
    team,
    player: name,
    gear: { mouse: { name: mouse } },
    settings: { dpi }
  };
}
