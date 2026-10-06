import type { Property } from "./types.ts";

/**
 * Location vocabulary used to interpret the client's brief. This is search vocabulary,
 * not property data: it only decides which rows of the sheet a phrase like "ORR" or
 * "East Bengaluru" should point at. Zone fallbacks are used when the sheet has no row
 * in that exact micro-market.
 */
export interface Place {
  name: string;
  /** Matched against the property's micro-market / location text. */
  patterns: RegExp[];
  /** Broad zone(s) for corridor-level fallback. Matched against the property's zone column. */
  zones: string[];
  /** A zone-level place ("East Bengaluru") rather than a neighbourhood. */
  isZone?: boolean;
}

export const PLACES: Place[] = [
  { name: "East Bengaluru", patterns: [], zones: ["east"], isZone: true },
  { name: "North Bengaluru", patterns: [/north bengaluru/i], zones: ["north"], isZone: true },
  { name: "South Bengaluru", patterns: [], zones: ["south"], isZone: true },
  { name: "South-East Bengaluru", patterns: [], zones: ["south-east", "south east"], isZone: true },
  { name: "West Bengaluru", patterns: [], zones: ["west"], isZone: true },
  { name: "Central Bengaluru", patterns: [], zones: ["central"], isZone: true },
  { name: "Whitefield", patterns: [/whitefield/i, /itpl/i, /varthur/i, /seegehalli/i, /soukya/i], zones: ["east"] },
  { name: "Sarjapur", patterns: [/sarjapur/i, /kodathi/i, /mullur/i, /muthanallur/i, /rayasandra/i, /gunjur/i], zones: ["east", "south-east"] },
  { name: "Koramangala", patterns: [/koramangala/i], zones: ["south-east", "central"] },
  { name: "HSR", patterns: [/\bhsr\b/i], zones: ["south-east"] },
  { name: "Indiranagar", patterns: [/indiranagar/i, /\bhal\b/i, /old airport r/i, /kodihalli/i], zones: ["central", "east"] },
  { name: "Hebbal", patterns: [/hebbal/i, /sahakar nagar/i], zones: ["north"] },
  { name: "ORR", patterns: [/\borr\b/i, /outer ring/i, /bellandur/i, /marathahalli/i, /panathur/i, /kadubeesanahalli/i], zones: ["east", "south-east"] },
  { name: "Devanahalli", patterns: [/devanahalli/i, /ivc r/i, /sadahalli/i, /aerospace/i, /shettigere/i, /bagalur/i], zones: ["north"] },
  { name: "Yelahanka", patterns: [/yelahanka/i, /jakkur/i, /tharahunise/i, /rajanukunte/i], zones: ["north"] },
  { name: "Thanisandra", patterns: [/thanisandra/i, /manyata/i, /hennur/i], zones: ["north"] },
  { name: "Bannerghatta Road", patterns: [/bannerghatta/i, /kothnur/i], zones: ["south"] },
  { name: "Electronic City", patterns: [/electronic city/i, /hosur r/i, /kudlu/i, /singasandra/i], zones: ["south-east"] },
  { name: "Old Madras Road", patterns: [/old madras/i, /budigere/i, /hoskote/i, /kannamangala/i], zones: ["east"] },
  { name: "Richmond Road", patterns: [/richmond/i], zones: ["central"] },
  { name: "Kanakapura Road", patterns: [/kanakapura/i, /banashankari/i, /basavanagudi/i], zones: ["south"] },
];

const ZONE_WORDS: Record<string, string> = {
  east: "East Bengaluru",
  north: "North Bengaluru",
  south: "South Bengaluru",
  "south east": "South-East Bengaluru",
  "south-east": "South-East Bengaluru",
  southeast: "South-East Bengaluru",
  west: "West Bengaluru",
  central: "Central Bengaluru",
};

/** Canonical place name for a free-text location, or the trimmed input if unknown. */
export function canonicalPlace(input: string): string {
  const s = input.trim();
  const z = s.toLowerCase().replace(/\s*(bengaluru|bangalore|blr)\s*$/, "").trim();
  if (ZONE_WORDS[z]) return ZONE_WORDS[z];
  const place = PLACES.find((p) => p.name.toLowerCase() === s.toLowerCase() || p.patterns.some((re) => re.test(s)));
  return place ? place.name : s;
}

/** Finds place mentions inside a sentence ("…reasonable access to Whitefield"). */
export function findPlacesInText(text: string): string[] {
  const found = new Set<string>();
  const zoneRe = /\b(north|south[- ]?east|south|east|west|central)(?:ern)?\s+(bengaluru|bangalore|blr)\b/gi;
  let m: RegExpExecArray | null;
  while ((m = zoneRe.exec(text))) found.add(canonicalPlace(`${m[1]} Bengaluru`));
  for (const p of PLACES) {
    if (p.isZone) continue;
    if (new RegExp(`\\b${p.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text) || p.patterns.some((re) => re.test(text))) {
      found.add(p.name);
    }
  }
  return [...found];
}

const zoneOf = (p: Property) => (p.zone ?? "").toLowerCase().trim();
const placeText = (p: Property) => `${p.microMarket ?? ""} ${p.location ?? ""}`;

export interface LocationFit {
  score: number;
  reason: string | null;
  gap: string | null;
}

/** 1.0 for the named neighbourhood/zone, 0.6 for the same broad corridor, else 0. */
export function locationFit(property: Property, wanted: string[]): LocationFit | null {
  if (!wanted.length) return null;
  const where = property.microMarket ?? property.location ?? property.zone ?? "this location";
  let corridor: string | null = null;

  for (const w of wanted) {
    const place = PLACES.find((p) => p.name === canonicalPlace(w));
    if (!place) {
      // Unknown free-text location: plain substring match against the sheet.
      if (placeText(property).toLowerCase().includes(w.toLowerCase().trim())) {
        return { score: 1, reason: `${where} — in your preferred area`, gap: null };
      }
      continue;
    }
    if (place.isZone) {
      if (place.zones.includes(zoneOf(property)) || place.patterns.some((re) => re.test(placeText(property)))) {
        return { score: 1, reason: `Located in ${where}, within your preferred ${place.name} corridor`, gap: null };
      }
      continue;
    }
    if (place.patterns.some((re) => re.test(placeText(property)))) {
      return { score: 1, reason: `${where} — in your preferred ${place.name} area`, gap: null };
    }
    if (!corridor && place.zones.includes(zoneOf(property))) corridor = place.name;
  }

  if (corridor) {
    return {
      score: 0.6,
      reason: `${where} — same ${property.zone} Bengaluru corridor as ${corridor}`,
      gap: `in ${where} rather than ${corridor} itself`,
    };
  }
  return { score: 0, reason: null, gap: `outside your preferred locations (${where})` };
}
