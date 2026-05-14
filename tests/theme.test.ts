import { describe, expect, it } from "vitest";
import { getNextTheme, resolveInitialTheme } from "../src/lib/theme";

describe("theme helpers", () => {
  it("uses a saved theme before the system preference", () => {
    expect(resolveInitialTheme("light", true)).toBe("light");
    expect(resolveInitialTheme("dark", false)).toBe("dark");
  });

  it("falls back to the system preference when no saved theme exists", () => {
    expect(resolveInitialTheme(null, true)).toBe("dark");
    expect(resolveInitialTheme(undefined, false)).toBe("light");
  });

  it("toggles between light and dark", () => {
    expect(getNextTheme("dark")).toBe("light");
    expect(getNextTheme("light")).toBe("dark");
  });
});
