export interface BrandInfo {
  name: string;
  initials: string;
  logoSrc?: string;
}

interface BrandRule extends BrandInfo {
  patterns: RegExp[];
}

const brandRules: BrandRule[] = [
  {
    name: "Logitech G",
    initials: "G",
    logoSrc: "/brand-logos/logitech-g.svg",
    patterns: [/\blogitech\s+g\b/i, /\blogitech\s+g[0-9]/i, /\bg\s+pro\b/i, /\bg640\b/i, /\bg740\b/i, /\bg915\b/i, /\bg715\b/i, /\bg713\b/i]
  },
  {
    name: "Razer",
    initials: "RZ",
    logoSrc: "/brand-logos/razer.svg",
    patterns: [/\brazer\b/i, /\bviper\b/i, /\bdeathadder\b/i, /\bhuntsman\b/i, /\bblackshark\b/i]
  },
  {
    name: "ZOWIE",
    initials: "ZW",
    logoSrc: "/brand-logos/zowie.svg",
    patterns: [/\bzowie\b/i, /\bbenq\b/i, /\bec[0-9]\b/i, /\bxl(25|24|27)[0-9a-z]*\b/i]
  },
  {
    name: "Wooting",
    initials: "WO",
    patterns: [/\bwooting\b/i]
  },
  {
    name: "HyperX",
    initials: "HX",
    logoSrc: "/brand-logos/hyperx.svg",
    patterns: [/\bhyperx\b/i]
  },
  {
    name: "SteelSeries",
    initials: "SS",
    logoSrc: "/brand-logos/steelseries.svg",
    patterns: [/\bsteelseries\b/i, /\bapex pro\b/i, /\bqck\b/i, /\barctis\b/i]
  },
  {
    name: "ASUS ROG",
    initials: "ROG",
    logoSrc: "/brand-logos/rog.svg",
    patterns: [/\basus\s+rog\b/i, /\brog\b/i, /\bswift\b/i]
  },
  {
    name: "ASUS",
    initials: "AS",
    logoSrc: "/brand-logos/asus.svg",
    patterns: [/\basus\b/i]
  },
  {
    name: "Corsair",
    initials: "CR",
    logoSrc: "/brand-logos/corsair.svg",
    patterns: [/\bcorsair\b/i, /\bk70\b/i, /\bhs80\b/i]
  },
  {
    name: "Alienware",
    initials: "AW",
    logoSrc: "/brand-logos/alienware.svg",
    patterns: [/\balienware\b/i, /\baw25[0-9a-z]*\b/i]
  },
  {
    name: "Acer",
    initials: "AC",
    logoSrc: "/brand-logos/acer.svg",
    patterns: [/\bacer\b/i, /\bpredator\b/i]
  },
  {
    name: "Sennheiser",
    initials: "SN",
    logoSrc: "/brand-logos/sennheiser.svg",
    patterns: [/\bsennheiser\b/i, /\bgame zero\b/i, /\bgame one\b/i]
  },
  { name: "Artisan", initials: "AR", patterns: [/\bartisan\b/i] },
  { name: "VAXEE", initials: "VX", patterns: [/\bvaxee\b/i, /\bxe\b/i, /\bpa black\b/i, /\boutset\b/i, /\bnp-01/i] },
  {
    name: "Pulsar",
    initials: "PU",
    logoSrc: "/brand-logos/pulsar.svg",
    patterns: [/\bpulsar\b/i, /\bes fs-1\b/i, /\bxlite\b/i, /\bx2[hn]?\b/i, /\bjv-x\b/i]
  },
  { name: "Secretlab", initials: "SL", patterns: [/\bsecretlab\b/i, /\btitan evo\b/i] },
  { name: "AOC", initials: "AO", patterns: [/\baoc\b/i, /\bagon\b/i] },
  { name: "beyerdynamic", initials: "BD", patterns: [/\bbeyerdynamic\b/i, /\bdt\s?770\b/i, /\bdt\s?990\b/i] },
  {
    name: "Finalmouse",
    initials: "FM",
    logoSrc: "/brand-logos/finalmouse.png",
    patterns: [/\bfinalmouse\b/i, /\bstarlight\b/i, /\bultralightx\b/i]
  },
  {
    name: "LAMZU",
    initials: "LZ",
    logoSrc: "/brand-logos/lamzu.png",
    patterns: [/\blamzu\b/i, /\batlantis\b/i, /\bmaya\b/i, /\binca\b/i]
  },
  {
    name: "Endgame Gear",
    initials: "EG",
    logoSrc: "/brand-logos/endgame-gear.svg",
    patterns: [/\bendgame gear\b/i, /\bop1w?\b/i, /\bxm2\b/i]
  },
  {
    name: "CHERRY XTRFY",
    initials: "XF",
    logoSrc: "/brand-logos/cherry-xtrfy.png",
    patterns: [/\bxtrfy\b/i, /\bcherry\b/i, /\bm8 wireless\b/i]
  },
  {
    name: "Ninjutso",
    initials: "NJ",
    logoSrc: "/brand-logos/ninjutso.png",
    patterns: [/\bninjutso\b/i, /\bsora\b/i]
  },
  {
    name: "WLMouse",
    initials: "WL",
    logoSrc: "/brand-logos/wlmouse.svg",
    patterns: [/\bwlmouse\b/i, /\bwl mouse\b/i, /\bbeast x\b/i, /\bhuan ma-gic\b/i]
  },
  {
    name: "HITSCAN",
    initials: "HS",
    logoSrc: "/brand-logos/hitscan.svg",
    patterns: [/\bhitscan\b/i, /\bhyperlight\b/i]
  },
  {
    name: "ATK",
    initials: "ATK",
    logoSrc: "/brand-logos/atk.png",
    patterns: [/\batk\b/i, /\bblazing sky\b/i]
  },
  {
    name: "Sprime",
    initials: "SP",
    logoSrc: "/brand-logos/sprime.png",
    patterns: [/\bsprime\b/i, /\bpm1\b/i]
  },
  {
    name: "Glorious",
    initials: "GL",
    logoSrc: "/brand-logos/glorious.svg",
    patterns: [/\bglorious\b/i, /\bmodel o\b/i, /\bmodel d\b/i]
  },
  {
    name: "NZXT",
    initials: "NZ",
    logoSrc: "/brand-logos/nzxt.svg",
    patterns: [/\bnzxt\b/i]
  },
  {
    name: "Fnatic",
    initials: "FN",
    logoSrc: "/brand-logos/fnatic.png",
    patterns: [/\bfnatic\b/i]
  },
  {
    name: "Dark Project",
    initials: "DP",
    logoSrc: "/brand-logos/dark-project.svg",
    patterns: [/\bdark project\b/i]
  },
  { name: "Fallen Gear", initials: "FG", patterns: [/\bfallen gear\b/i, /\blobo\b/i, /\bpantera\b/i] },
  { name: "Waizowl", initials: "WZ", patterns: [/\bwaizowl\b/i, /\bogm cloud\b/i] },
  { name: "TEEVolution", initials: "TV", patterns: [/\bteevolution\b/i, /\bterra\b/i] },
  { name: "Rampage", initials: "RP", patterns: [/\brampage\b/i] },
  { name: "Varmilo", initials: "VM", patterns: [/\bvarmilo\b/i] },
  { name: "Rode", initials: "RD", patterns: [/\brode\b/i, /\bnt-usb\b/i] },
  { name: "Shure", initials: "SH", patterns: [/\bshure\b/i, /\bsm7b\b/i] },
  { name: "Elgato", initials: "EG", patterns: [/\belgato\b/i, /\bwave\b/i] },
  { name: "Noblechairs", initials: "NC", patterns: [/\bnoblechairs\b/i] },
  { name: "DXRacer", initials: "DX", patterns: [/\bdxracer\b/i] },
  { name: "ANDASEAT", initials: "AS", patterns: [/\bandaseat\b/i] }
];

export function getBrandForProduct(productName: string): BrandInfo {
  const normalized = productName.trim();
  const brand = brandRules.find((rule) => rule.patterns.some((pattern) => pattern.test(normalized)));

  if (brand) {
    return {
      name: brand.name,
      initials: brand.initials,
      logoSrc: brand.logoSrc
    };
  }

  return {
    name: firstLikelyBrandWord(normalized),
    initials: initialsFromName(normalized)
  };
}

function firstLikelyBrandWord(value: string): string {
  const [firstWord = "Unknown"] = value.split(/\s+/).filter(Boolean);
  return firstWord.replace(/[^\w-]/g, "") || "Unknown";
}

function initialsFromName(value: string): string {
  const words = value
    .split(/\s+/)
    .map((word) => word.replace(/[^\w-]/g, ""))
    .filter(Boolean);

  if (words.length === 0) {
    return "?";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
