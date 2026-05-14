import { describe, expect, it } from "vitest";
import { aggregateHardware, summarizeHardware } from "../src/lib/aggregate";
import type { GameSnapshot } from "../src/types";

const snapshot: GameSnapshot = {
  metadata: {
    gameSlug: "cs2",
    gameName: "CS2",
    sourceUrl: "https://prosettings.net/lists/cs2/",
    scrapedAt: "2026-05-13T12:00:00.000Z",
    rowCount: 4,
    columns: [],
    sourceNotice: "test"
  },
  players: [
    {
      id: "1",
      team: "Alpha",
      player: "Player A",
      gear: { mouse: { name: "Razer Viper V3 Pro Black" } },
      settings: { dpi: "800" }
    },
    {
      id: "2",
      team: "Bravo",
      player: "Player B",
      gear: { mouse: { name: "Razer Viper V3 Pro White" } },
      settings: { dpi: "400" }
    },
    {
      id: "3",
      team: "Charlie",
      player: "Player C",
      gear: { mouse: { name: "Logitech G Pro X Superlight 2 Black" } },
      settings: { dpi: "800" }
    },
    {
      id: "4",
      team: "Delta",
      player: "Player D",
      gear: {},
      settings: {}
    }
  ]
};

describe("aggregateHardware", () => {
  it("ranks exact products by known-player usage", () => {
    const result = aggregateHardware(snapshot, "mouse", "exact");

    expect(result.summary.totalPlayers).toBe(4);
    expect(result.summary.knownPlayers).toBe(3);
    expect(result.summary.unknownPlayers).toBe(1);
    expect(result.summary.modelCount).toBe(2);
    expect(result.summary.exactModelCount).toBe(3);
    expect(result.summary.collapsedModelCount).toBe(1);
    expect(result.rankings.map((ranking) => ranking.name)).toEqual([
      "Logitech G Pro X Superlight 2 Black",
      "Razer Viper V3 Pro Black",
      "Razer Viper V3 Pro White"
    ]);
    expect(result.rankings[0].percent).toBeCloseTo(33.333, 2);
  });

  it("groups products through the manual alias rules", () => {
    const result = aggregateHardware(snapshot, "mouse", "grouped");

    expect(result.summary.modelCount).toBe(2);
    expect(result.summary.exactModelCount).toBe(3);
    expect(result.summary.collapsedModelCount).toBe(1);
    expect(result.rankings[0]).toMatchObject({
      name: "Razer Viper V3 Pro",
      count: 2,
      rank: 1
    });
    expect(result.rankings[0].exactNames).toEqual(["Razer Viper V3 Pro Black", "Razer Viper V3 Pro White"]);
  });

  it("filters by product, player, or team search", () => {
    const byProduct = aggregateHardware(snapshot, "mouse", "grouped", "viper");
    const byPlayer = aggregateHardware(snapshot, "mouse", "exact", "player c");
    const byTeam = aggregateHardware(snapshot, "mouse", "exact", "bravo");

    expect(byProduct.rankings).toHaveLength(1);
    expect(byPlayer.rankings[0].name).toBe("Logitech G Pro X Superlight 2 Black");
    expect(byTeam.rankings[0].name).toBe("Razer Viper V3 Pro White");
  });

  it("keeps model count grouped and independent from search filters", () => {
    const unfiltered = aggregateHardware(snapshot, "mouse", "exact");
    const filtered = aggregateHardware(snapshot, "mouse", "exact", "superlight");
    const summary = summarizeHardware(snapshot, "mouse");

    expect(summary).toMatchObject({
      totalPlayers: 4,
      knownPlayers: 3,
      unknownPlayers: 1,
      modelCount: 2,
      exactModelCount: 3,
      collapsedModelCount: 1
    });
    expect(unfiltered.summary.modelCount).toBe(2);
    expect(unfiltered.summary.exactModelCount).toBe(3);
    expect(unfiltered.summary.collapsedModelCount).toBe(1);
    expect(filtered.summary.modelCount).toBe(2);
    expect(filtered.summary.exactModelCount).toBe(3);
    expect(filtered.summary.collapsedModelCount).toBe(1);
    expect(filtered.rankings).toHaveLength(1);
  });

  it("orders used-by players by the CS2 HLTV team ranking snapshot", () => {
    const rankedSnapshot: GameSnapshot = {
      ...snapshot,
      metadata: { ...snapshot.metadata, rowCount: 9 },
      players: [
        player("1", "Falcons Esports", "Falcons first", "Shared Mouse"),
        player("2", "Zeta Team", "Zeta player", "Shared Mouse"),
        player("3", "Team Vitality", "Vitality first", "Shared Mouse"),
        player("4", "Natus Vincere", "NAVI player", "Shared Mouse"),
        player("5", "Alpha Team", "Alpha player", "Shared Mouse"),
        player("6", "FURIA", "FURIA player", "Shared Mouse"),
        player("7", "Falcons Esports", "Falcons second", "Shared Mouse"),
        player("8", "Team Vitality", "Vitality second", "Shared Mouse"),
        player("9", "Team Spirit", "Spirit player", "Other Mouse")
      ]
    };

    const result = aggregateHardware(rankedSnapshot, "mouse", "exact");
    const sharedMouse = result.rankings.find((ranking) => ranking.name === "Shared Mouse");

    expect(result.rankings.map((ranking) => [ranking.name, ranking.count])).toEqual([
      ["Shared Mouse", 8],
      ["Other Mouse", 1]
    ]);
    expect(sharedMouse?.players.map((usage) => usage.player.player)).toEqual([
      "Vitality first",
      "Vitality second",
      "NAVI player",
      "FURIA player",
      "Falcons first",
      "Falcons second",
      "Alpha player",
      "Zeta player"
    ]);
  });
});

function player(id: string, team: string, name: string, mouse: string): GameSnapshot["players"][number] {
  return {
    id,
    team,
    player: name,
    gear: { mouse: { name: mouse } },
    settings: {}
  };
}
