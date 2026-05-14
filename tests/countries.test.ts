import { describe, expect, it } from "vitest";
import { countryCodeToFlag, getCountryDisplay } from "../src/lib/countries";

describe("country helpers", () => {
  it("maps ProSettings country names to flag display data", () => {
    expect(getCountryDisplay("Brazil")).toEqual({
      label: "Brazil",
      code: "BR",
      flag: countryCodeToFlag("BR")
    });
    expect(getCountryDisplay("Bosnia & Herzegovina")?.code).toBe("BA");
    expect(getCountryDisplay("Hong Kong SAR China")?.code).toBe("HK");
  });

  it("falls back to country text when a country is unknown", () => {
    expect(getCountryDisplay("Atlantis")).toEqual({
      label: "Atlantis",
      flag: "Atlantis"
    });
  });
});
