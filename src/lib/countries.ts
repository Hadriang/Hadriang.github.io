export interface CountryDisplay {
  label: string;
  code?: string;
  flag: string;
}

const countryCodes: Record<string, string> = {
  albania: "AL",
  argentina: "AR",
  armenia: "AM",
  australia: "AU",
  austria: "AT",
  belarus: "BY",
  belgium: "BE",
  "bosnia and herzegovina": "BA",
  brazil: "BR",
  bulgaria: "BG",
  canada: "CA",
  chile: "CL",
  china: "CN",
  croatia: "HR",
  czechia: "CZ",
  denmark: "DK",
  egypt: "EG",
  estonia: "EE",
  finland: "FI",
  france: "FR",
  germany: "DE",
  greece: "GR",
  guatemala: "GT",
  "hong kong sar china": "HK",
  hungary: "HU",
  india: "IN",
  indonesia: "ID",
  iraq: "IQ",
  ireland: "IE",
  israel: "IL",
  jordan: "JO",
  kazakhstan: "KZ",
  kosovo: "XK",
  latvia: "LV",
  lebanon: "LB",
  lithuania: "LT",
  luxembourg: "LU",
  malaysia: "MY",
  mexico: "MX",
  mongolia: "MN",
  montenegro: "ME",
  netherlands: "NL",
  "new zealand": "NZ",
  "north macedonia": "MK",
  norway: "NO",
  palestine: "PS",
  poland: "PL",
  portugal: "PT",
  romania: "RO",
  russia: "RU",
  serbia: "RS",
  slovakia: "SK",
  "south africa": "ZA",
  spain: "ES",
  sweden: "SE",
  switzerland: "CH",
  taiwan: "TW",
  turkey: "TR",
  ukraine: "UA",
  "united kingdom": "GB",
  "united states": "US",
  uruguay: "UY"
};

export function getCountryDisplay(country?: string | null): CountryDisplay | undefined {
  const label = country?.trim();
  if (!label) {
    return undefined;
  }

  const code = countryCodes[toCountryKey(label)];
  if (!code) {
    return { label, flag: label };
  }

  return {
    label,
    code,
    flag: countryCodeToFlag(code)
  };
}

export function countryCodeToFlag(countryCode: string): string {
  const code = countryCode.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) {
    return countryCode;
  }

  return String.fromCodePoint(...[...code].map((letter) => letter.charCodeAt(0) + 127397));
}

function toCountryKey(country: string): string {
  return country.toLowerCase().replace(/&/g, "and").replace(/\s+/g, " ").trim();
}
