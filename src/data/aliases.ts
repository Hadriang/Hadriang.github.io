import type { HardwareSlot } from "../types";

interface FamilyRule {
  slot: HardwareSlot;
  match: RegExp;
  family: string;
}

const familyRules: FamilyRule[] = [
  { slot: "mouse", match: /logitech g pro x superlight 2c/i, family: "Logitech G Pro X Superlight 2c" },
  { slot: "mouse", match: /logitech g pro x superlight 2/i, family: "Logitech G Pro X Superlight 2" },
  { slot: "mouse", match: /logitech g pro x superlight/i, family: "Logitech G Pro X Superlight" },
  { slot: "mouse", match: /logitech g pro x2 superstrike/i, family: "Logitech G Pro X2 SUPERSTRIKE" },
  { slot: "mouse", match: /razer viper v4 pro/i, family: "Razer Viper V4 Pro" },
  { slot: "mouse", match: /razer viper v3 pro/i, family: "Razer Viper V3 Pro" },
  { slot: "mouse", match: /razer deathadder v4 pro/i, family: "Razer DeathAdder V4 Pro" },
  { slot: "mouse", match: /razer deathadder v3/i, family: "Razer DeathAdder V3" },
  { slot: "mouse", match: /zowie ec2/i, family: "ZOWIE EC2" },
  { slot: "mouse", match: /zowie ec1/i, family: "ZOWIE EC1" },
  { slot: "mouse", match: /zowie za13/i, family: "ZOWIE ZA13" },
  { slot: "mouse", match: /vaxee xe/i, family: "VAXEE XE" },
  { slot: "mouse", match: /vaxee outset ax/i, family: "VAXEE OUTSET AX" },
  { slot: "mouse", match: /vaxee zygen np-01s|vaxee np-01s/i, family: "VAXEE NP-01S" },

  { slot: "monitor", match: /zowie xl2586/i, family: "ZOWIE XL2586" },
  { slot: "monitor", match: /zowie xl2566/i, family: "ZOWIE XL2566" },
  { slot: "monitor", match: /zowie xl2546/i, family: "ZOWIE XL2546" },
  { slot: "monitor", match: /alienware aw2523/i, family: "Alienware AW2523" },

  { slot: "keyboard", match: /wooting 80he/i, family: "Wooting 80HE" },
  { slot: "keyboard", match: /wooting 60he/i, family: "Wooting 60HE" },
  { slot: "keyboard", match: /razer huntsman v3 pro tkl/i, family: "Razer Huntsman V3 Pro TKL" },
  { slot: "keyboard", match: /asus rog falchion ace hfx/i, family: "ASUS ROG Falchion Ace HFX" },
  { slot: "keyboard", match: /asus rog falchion ace 75 he/i, family: "ASUS ROG Falchion Ace 75 HE" },
  { slot: "keyboard", match: /steelseries apex pro tkl/i, family: "SteelSeries Apex Pro TKL" },

  { slot: "headset", match: /hyperx cloud ii/i, family: "HyperX Cloud II" },
  { slot: "headset", match: /hyperx cloud iii/i, family: "HyperX Cloud III" },
  { slot: "headset", match: /razer blackshark v3 pro/i, family: "Razer BlackShark V3 Pro" },
  { slot: "headset", match: /razer blackshark v2 pro/i, family: "Razer BlackShark V2 Pro" },
  { slot: "headset", match: /steelseries arctis nova pro/i, family: "SteelSeries Arctis Nova Pro" },
  { slot: "headset", match: /logitech g pro x 2|logitech g pro x2/i, family: "Logitech G PRO X 2 Headset" },

  { slot: "mousepad", match: /artisan ninja fx zero|artisan fx zero/i, family: "Artisan Ninja FX Zero" },
  { slot: "mousepad", match: /artisan type-99/i, family: "Artisan Type-99" },
  { slot: "mousepad", match: /zowie g-sr/i, family: "ZOWIE G-SR" },
  { slot: "mousepad", match: /razer gigantus v2/i, family: "Razer Gigantus V2" },
  { slot: "mousepad", match: /x-raypad aqua control/i, family: "X-raypad Aqua Control" },
  { slot: "mousepad", match: /steelseries qck/i, family: "SteelSeries QcK" },

  { slot: "chair", match: /secretlab titan/i, family: "Secretlab Titan Evo" },
  { slot: "chair", match: /razer iskur v2/i, family: "Razer Iskur V2" },
  { slot: "chair", match: /blacklyte kraken pro/i, family: "Blacklyte Kraken Pro" },
  { slot: "chair", match: /noblechairs hero/i, family: "noblechairs HERO" }
];

export function getGroupedName(slot: HardwareSlot, exactName: string): string {
  const rule = familyRules.find((candidate) => candidate.slot === slot && candidate.match.test(exactName));
  return rule?.family ?? exactName;
}
