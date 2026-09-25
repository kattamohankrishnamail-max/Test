/**
 * Loose column mapping: the sheet does not need exact headers. Each canonical field
 * lists header synonyms; a header maps to the field whose synonym it equals, or failing
 * that, contains. First match wins, and each column feeds at most one field.
 */
export type Field =
  | "projectName"
  | "developer"
  | "productLabel"
  | "archetype"
  | "zone"
  | "microMarket"
  | "location"
  | "configuration"
  | "bedrooms"
  | "unitType"
  | "area"
  | "areaMin"
  | "areaMax"
  | "price"
  | "priceMin"
  | "priceMax"
  | "priceTag"
  | "possession"
  | "status"
  | "salesSignal"
  | "amenities"
  | "density"
  | "landAcres"
  | "units"
  | "rera"
  | "latitude"
  | "longitude"
  | "airportDistance"
  | "keyDistances"
  | "description"
  | "usp"
  | "projectUrl"
  | "imageUrl"
  | "launch";

export const FIELD_SYNONYMS: Record<Field, string[]> = {
  projectName: ["project name", "project", "property name", "name", "development"],
  developer: ["developer", "builder", "developer name", "brand"],
  productLabel: ["property type", "product", "type", "product type", "asset type"],
  archetype: ["positioning archetype", "archetype", "positioning", "segment", "category"],
  zone: ["zone", "region", "corridor", "direction"],
  microMarket: ["micro market", "micromarket", "sub locality", "locality", "area name", "neighbourhood", "neighborhood"],
  location: ["location", "address", "city area"],
  configuration: ["configuration", "configurations", "config", "bhk"],
  bedrooms: ["bedrooms", "beds", "no of bedrooms"],
  unitType: ["unit type", "unit types"],
  area: ["area", "area range", "size", "sqft", "super built up area", "saleable area", "carpet area", "built up area"],
  areaMin: ["min area", "area min", "minimum area", "entry unit area", "min size"],
  areaMax: ["max area", "area max", "maximum area", "max size"],
  price: ["price", "price range", "price detail", "ticket size", "cost"],
  priceMin: ["min price", "price min", "starting price", "price from", "entry price"],
  priceMax: ["max price", "price max", "price to", "top price"],
  priceTag: ["price tag", "price status", "price verified"],
  possession: ["possession", "possession date", "completion", "handover", "delivery"],
  status: ["status", "inclusion status", "project status", "stage"],
  salesSignal: ["sales signal", "availability", "inventory status"],
  amenities: ["amenities", "features", "facilities"],
  density: ["density", "units per acre", "units acre"],
  landAcres: ["land acres", "land", "acres", "land area", "project size"],
  units: ["units", "total units", "no of units", "unit count"],
  rera: ["rera", "k rera no", "rera no", "rera number", "rera id"],
  latitude: ["latitude", "lat"],
  longitude: ["longitude", "lng", "long", "lon"],
  airportDistance: ["distance from airport", "airport distance", "distance to airport", "airport km"],
  keyDistances: ["distance from key locations", "key distances", "connectivity", "nearby"],
  description: ["description", "notes", "notes learning", "summary", "overview", "about"],
  usp: ["usp", "highlights", "key highlights", "unique selling point"],
  projectUrl: ["project url", "url", "website", "link"],
  imageUrl: ["image url", "image", "photo", "photo url", "picture", "thumbnail"],
  launch: ["launch", "launch date", "launched"],
};

export function normaliseHeader(h: string): string {
  return h
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export interface HeaderMapping {
  byField: Partial<Record<Field, number>>;
  /** Unit hint read from the raw header, e.g. "(₹ Cr)". */
  priceUnit: Partial<Record<"price" | "priceMin" | "priceMax", "cr" | "lakh" | "rupee">>;
  unmapped: string[];
  score: number;
}

function unitFromHeader(raw: string): "cr" | "lakh" | "rupee" | undefined {
  const s = raw.toLowerCase();
  if (/\bcr\b|crore/.test(s)) return "cr";
  if (/lakh|lac\b|\bl\b/.test(s)) return "lakh";
  if (/inr|rupee|rs\b/.test(s) && !/cr|lakh/.test(s)) return "rupee";
  return undefined;
}

export function mapHeaders(headers: string[]): HeaderMapping {
  const norm = headers.map(normaliseHeader);
  const used = new Set<number>();
  const byField: Partial<Record<Field, number>> = {};
  const fields = Object.keys(FIELD_SYNONYMS) as Field[];

  // Pass 1: exact synonym matches (in synonym priority order).
  for (const field of fields) {
    for (const syn of FIELD_SYNONYMS[field]) {
      const idx = norm.findIndex((h, i) => !used.has(i) && h === syn);
      if (idx >= 0) {
        byField[field] = idx;
        used.add(idx);
        break;
      }
    }
  }
  // Pass 2: header contains a multi-word synonym (avoids "type" grabbing "unit type").
  for (const field of fields) {
    if (byField[field] !== undefined) continue;
    for (const syn of FIELD_SYNONYMS[field]) {
      if (syn.length < 4) continue;
      const idx = norm.findIndex((h, i) => !used.has(i) && h.length > 0 && (` ${h} `).includes(` ${syn} `));
      if (idx >= 0) {
        byField[field] = idx;
        used.add(idx);
        break;
      }
    }
  }

  const priceUnit: HeaderMapping["priceUnit"] = {};
  for (const f of ["price", "priceMin", "priceMax"] as const) {
    const idx = byField[f];
    if (idx !== undefined) priceUnit[f] = unitFromHeader(headers[idx]);
  }

  const unmapped = headers.filter((h, i) => !used.has(i) && h.trim() !== "");
  const score = Object.keys(byField).length + (byField.projectName !== undefined ? 5 : 0);
  return { byField, priceUnit, unmapped, score };
}

/**
 * Picks the sheet + header row that best matches our schema. Workbooks often have a
 * title block or a "Read Me" tab before the real table, so every sheet's first rows are tried.
 */
export function detectTable(sheets: { name: string; rows: string[][] }[]) {
  let best: { sheetName: string; headerRow: number; mapping: HeaderMapping; rows: string[][] } | null = null;
  for (const sheet of sheets) {
    const scan = Math.min(sheet.rows.length, 15);
    for (let r = 0; r < scan; r++) {
      const headers = sheet.rows[r].map((c) => c ?? "");
      if (headers.filter((h) => h.trim()).length < 3) continue;
      const mapping = mapHeaders(headers);
      if (mapping.byField.projectName === undefined) continue;
      // Prefer tables with more data rows when header scores tie.
      const dataRows = sheet.rows.length - r - 1;
      const score = mapping.score * 1000 + Math.min(dataRows, 999);
      const bestScore = best ? best.mapping.score * 1000 + Math.min(best.rows.length, 999) : -1;
      if (score > bestScore) {
        best = { sheetName: sheet.name, headerRow: r, mapping, rows: sheet.rows.slice(r + 1) };
      }
    }
  }
  return best;
}
