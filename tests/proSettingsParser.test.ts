import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { parseProSettingsTable, proSettingsGames } from "../scripts/proSettingsParser";

describe("parseProSettingsTable", () => {
  it("extracts normalized player records from the ProSettings table", async () => {
    const html = await readFile("tests/fixtures/prosettings-cs2-snippet.html", "utf8");
    const snapshot = parseProSettingsTable(html, proSettingsGames.cs2, "2026-05-13T12:00:00.000Z");

    expect(snapshot.metadata.rowCount).toBe(3);
    expect(snapshot.metadata.columns).toContain("Mouse");
    expect(snapshot.players[0]).toMatchObject({
      team: "Team Vitality",
      player: "ZywOo",
      role: "Sniper",
      country: "France",
      gear: {
        mouse: { name: "Pulsar ZywOo The Chosen Mouse White" },
        monitor: { name: "ZOWIE XL2586X+" }
      },
      settings: {
        dpi: "400",
        hz: "1000",
        sens: "2",
        edpi: "800.00",
        zoomSens: "1",
        aspectRatio: "4:3",
        scalingMode: "Stretched"
      }
    });
    expect(snapshot.metadata.columns).not.toContain("GPU");
    expect(JSON.stringify(snapshot.players[0].gear)).not.toContain("RTX 5080");
    expect(snapshot.players[2].gear.mouse).toBeUndefined();
    expect(JSON.stringify(snapshot.players[0])).not.toContain("amzn.to");
  });

  it("throws when the expected source table is missing", () => {
    expect(() => parseProSettingsTable("<main>No table</main>", proSettingsGames.cs2)).toThrow("#pro-list-table");
  });
});
