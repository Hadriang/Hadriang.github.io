import { describe, expect, it } from "vitest";
import { getBrandForProduct } from "../src/lib/brands";

describe("getBrandForProduct", () => {
  it("maps known product names to local brand logo metadata", () => {
    expect(getBrandForProduct("Logitech G Pro X Superlight 2")).toMatchObject({
      name: "Logitech G",
      logoSrc: "/brand-logos/logitech-g.svg"
    });
    expect(getBrandForProduct("Logitech G300S")).toMatchObject({
      name: "Logitech G",
      logoSrc: "/brand-logos/logitech-g.svg"
    });
    expect(getBrandForProduct("Razer Viper V3 Pro")).toMatchObject({
      name: "Razer",
      logoSrc: "/brand-logos/razer.svg"
    });
    expect(getBrandForProduct("ZOWIE EC2-CW")).toMatchObject({
      name: "ZOWIE",
      logoSrc: "/brand-logos/zowie.svg"
    });
    expect(getBrandForProduct("Lamzu Maya X")).toMatchObject({
      name: "LAMZU",
      logoSrc: "/brand-logos/lamzu.png"
    });
    expect(getBrandForProduct("WLMouse BEAST X")).toMatchObject({
      name: "WLMouse",
      logoSrc: "/brand-logos/wlmouse.svg"
    });
  });

  it("keeps unsupported brands visible with initials fallback", () => {
    expect(getBrandForProduct("Mystery Maker Pro Pad")).toEqual({
      name: "Mystery",
      initials: "MM"
    });
  });
});
