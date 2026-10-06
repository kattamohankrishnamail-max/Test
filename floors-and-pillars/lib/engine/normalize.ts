import { detectTable, type Field } from "./columns.ts";
import type { Dataset, Property, TypeGroup } from "./types.ts";

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const EMPTY = /^(—|–|-|n\/?a|n\/d|na|nil|none|null|tbd|tba|not available|\s*)$/i;

export function clean(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).replace(/\s+/g, " ").trim();
  return EMPTY.test(s) ? null : s;
}

function numbersIn(s: string): number[] {
  return (s.match(/\d[\d,]*(?:\.\d+)?/g) ?? []).map((n) => parseFloat(n.replace(/,/g, ""))).filter((n) => !isNaN(n));
}

export function parseNumber(v: string | null): number | null {
  if (!v) return null;
  const n = numbersIn(v);
  return n.length ? n[0] : null;
}

/** "1,768–3,264", "2,800+", "~4,690 avg", "3,500" → min/max sq ft. */
export function parseArea(v: string | null): { min: number | null; max: number | null } {
  if (!v) return { min: null, max: null };
  const s = v.replace(/\(.*?\)/g, " ").replace(/≈.*$/, "");
  const nums = numbersIn(s).filter((n) => n >= 200 && n <= 100000);
  if (!nums.length) return { min: null, max: null };
  return { min: Math.min(...nums), max: Math.max(...nums) };
}

type PriceUnit = "cr" | "lakh" | "rupee" | undefined;

function toCrore(n: number, unit: PriceUnit, text: string): number {
  const t = text.toLowerCase();
  if (unit === "cr" || /\bcr\b|crore/.test(t)) return n;
  if (unit === "lakh" || /lakh|lac|\bl\b/.test(t)) return n / 100;
  if (unit === "rupee" || n >= 100000) return n / 1e7;
  // Bare small numbers in a luxury sheet are almost certainly crore.
  return n < 500 ? n : n / 100;
}

/** "4.30–8.41 Cr", "₹ 3.5 Cr onwards", "50000000", "450 L" → crore min/max. */
export function parsePrice(v: string | null, unit?: PriceUnit): { min: number | null; max: number | null } {
  if (!v) return { min: null, max: null };
  // Only read the leading figure(s), before commentary in brackets or after ";".
  const head = v.split(/[;(]/)[0];
  const nums = numbersIn(head)
    .map((n) => toCrore(n, unit, head))
    .filter((n) => n > 0.05 && n < 1000);
  if (!nums.length) return { min: null, max: null };
  return { min: Math.min(...nums), max: Math.max(...nums) };
}

/** Configuration text → bedroom options. "3, 3.5 & 4 BHK", "3–5 BHK + penthouses", "3 to 8 BHK", "4 BHK+". */
export function parseConfiguration(v: string | null): { options: number[]; openEnded: boolean; penthouse: boolean } {
  if (!v) return { options: [], openEnded: false, penthouse: false };
  const s = v
    .toLowerCase()
    .replace(/g\s*\+\s*\d+/g, " ") // floor counts like G+2
    .replace(/\d[\d,]*\s*sq\.?\s*ft/g, " ");
  const penthouse = /penthouse|sky ?villa|sky residence/.test(s);
  const options = new Set<number>();
  const rangeRe = /(\d(?:\.\d)?)\s*(?:–|—|-|to)\s*(\d(?:\.\d)?)/g;
  let m: RegExpExecArray | null;
  let stripped = s;
  while ((m = rangeRe.exec(s))) {
    const a = parseFloat(m[1]);
    const b = parseFloat(m[2]);
    if (a <= b && b <= 12) {
      for (let x = Math.ceil(a); x <= Math.floor(b); x++) options.add(x);
      options.add(a);
      options.add(b);
    }
    stripped = stripped.replace(m[0], " ");
  }
  for (const n of numbersIn(stripped)) if (n >= 1 && n <= 12) options.add(n);
  if (!/bhk|bed|br\b/.test(s) && options.size && !/villa|house|bungalow/.test(s)) {
    // Numbers without a bedroom unit are not trustworthy.
    return { options: [], openEnded: false, penthouse };
  }
  const openEnded = /\d\s*bhk\s*\+|\d\+\s*bhk|and larger|& above|and above/.test(s);
  return { options: [...options].sort((a, b) => a - b), openEnded, penthouse };
}

/** Possession text → month index. "Dec 2031", "2030–32", "End-2029", "Ready", "Delivered Nov-2025". */
export function parsePossession(v: string | null, now = new Date()): { month: number | null; ready: boolean } {
  if (!v) return { month: null, ready: false };
  const s = v.toLowerCase();
  if (/ready|delivered|completed|\boc\b/.test(s)) {
    return { month: now.getFullYear() * 12 + now.getMonth(), ready: true };
  }
  let year: number | null = null;
  const range = s.match(/(20\d\d)\s*[–—-]\s*(\d{2,4})/);
  if (range) {
    const end = range[2].length === 2 ? 2000 + parseInt(range[2], 10) : parseInt(range[2], 10);
    year = end;
  } else {
    const y = s.match(/20\d\d/);
    if (y) year = parseInt(y[0], 10);
  }
  if (year === null) return { month: null, ready: false };
  const mi = MONTHS.findIndex((mm) => s.includes(mm));
  const month = year * 12 + (mi >= 0 ? mi : 11); // year-only → assume December (conservative)
  return { month, ready: month <= now.getFullYear() * 12 + now.getMonth() };
}

export function typeGroupsFor(label: string | null, configuration: string | null): TypeGroup[] {
  const s = `${label ?? ""} ${configuration ?? ""}`.toLowerCase();
  const groups = new Set<TypeGroup>();
  if (/villament/.test(s)) {
    groups.add("apartment");
    groups.add("villa");
  }
  if (/villa|row ?house|bungalow|independent|plot|townhouse/.test(label?.toLowerCase() ?? "")) groups.add("villa");
  if (/apartment|flat|condo|residence|tower|penthouse/.test(label?.toLowerCase() ?? "")) groups.add("apartment");
  if (!groups.size) {
    if (/villa|row ?house|bungalow/.test(s)) groups.add("villa");
    else groups.add("apartment");
  }
  return [...groups];
}

function isUrl(v: string | null): string | null {
  return v && /^https?:\/\/\S+$/i.test(v) ? v : null;
}

export interface SheetInput {
  name: string;
  rows: string[][];
}

/** Turns raw sheet matrices into normalised properties. Pure — no I/O. */
export function normaliseWorkbook(sheets: SheetInput[], fileName: string, now = new Date()): Dataset {
  const table = detectTable(sheets);
  if (!table) {
    throw new Error(
      "Couldn't find a property table. The sheet needs a header row with at least a project/property name column.",
    );
  }
  const { mapping } = table;
  const headers = sheets.find((s) => s.name === table.sheetName)!.rows[table.headerRow];
  const get = (row: string[], f: Field): string | null => {
    const idx = mapping.byField[f];
    return idx === undefined ? null : clean(row[idx]);
  };

  const warnings: string[] = [];
  const properties: Property[] = [];
  const seen = new Map<string, number>();

  table.rows.forEach((row) => {
    const projectName = get(row, "projectName");
    if (!projectName) return;

    const configurationLabel = get(row, "configuration") ?? get(row, "unitType") ?? get(row, "bedrooms");
    const cfg = parseConfiguration(configurationLabel);

    const areaLabel = get(row, "area");
    let area = parseArea(areaLabel);
    if (area.min === null) {
      const lo = parseNumber(get(row, "areaMin"));
      const hi = parseNumber(get(row, "areaMax"));
      area = { min: lo ?? hi, max: hi ?? lo };
    }

    const priceLabel = get(row, "price");
    let priceMin = parseNumber(get(row, "priceMin"));
    let priceMax = parseNumber(get(row, "priceMax"));
    if (priceMin !== null) priceMin = toCrore(priceMin, mapping.priceUnit.priceMin, get(row, "priceMin")!);
    if (priceMax !== null) priceMax = toCrore(priceMax, mapping.priceUnit.priceMax, get(row, "priceMax")!);
    if (priceMin === null && priceMax === null) {
      const p = parsePrice(priceLabel, mapping.priceUnit.price);
      priceMin = p.min;
      priceMax = p.max;
    }
    if (priceMin !== null && priceMax === null) priceMax = priceMin;
    if (priceMin !== null && priceMax !== null && priceMin > priceMax) [priceMin, priceMax] = [priceMax, priceMin];

    const possessionLabel = get(row, "possession");
    const poss = parsePossession(possessionLabel, now);

    const units = parseNumber(get(row, "units"));
    const landAcres = parseNumber(get(row, "landAcres"));
    let unitsPerAcre = parseNumber(get(row, "density"));
    if (unitsPerAcre === null && units && landAcres) unitsPerAcre = units / landAcres;

    const productLabel = get(row, "productLabel");
    const zone = get(row, "zone");
    const microMarket = get(row, "microMarket");
    const location = get(row, "location");
    const priceTag = get(row, "priceTag");

    const raw: Record<string, string> = {};
    headers.forEach((h, idx) => {
      const val = clean(row[idx]);
      if (h && val) raw[h] = val;
    });

    const baseId = projectName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const n = (seen.get(baseId) ?? 0) + 1;
    seen.set(baseId, n);

    properties.push({
      id: n > 1 ? `${baseId}-${n}` : baseId,
      projectName,
      developer: get(row, "developer"),
      productLabel,
      typeGroups: typeGroupsFor(productLabel, configurationLabel),
      archetype: get(row, "archetype"),
      zone,
      microMarket,
      location: location ?? ([microMarket, zone ? `${zone} Bengaluru` : null].filter(Boolean).join(", ") || null),
      configurationLabel,
      bedroomOptions: cfg.options,
      bedroomsOpenEnded: cfg.openEnded,
      hasPenthouse: cfg.penthouse,
      areaLabel,
      areaMin: area.min,
      areaMax: area.max,
      priceLabel,
      priceMinCr: priceMin,
      priceMaxCr: priceMax,
      priceVerified: priceTag ? /verified|confirmed|yes/i.test(priceTag) : null,
      possessionLabel,
      possessionMonth: poss.month,
      isReady: poss.ready,
      status: get(row, "status"),
      salesSignal: get(row, "salesSignal"),
      units,
      landAcres,
      unitsPerAcre,
      rera: get(row, "rera"),
      amenities: get(row, "amenities"),
      description: get(row, "description"),
      usp: get(row, "usp"),
      projectUrl: isUrl(get(row, "projectUrl")),
      imageUrl: isUrl(get(row, "imageUrl")),
      latitude: parseNumber(get(row, "latitude")),
      longitude: parseNumber(get(row, "longitude")),
      airportDistanceKm: parseNumber(get(row, "airportDistance")),
      launch: get(row, "launch"),
      raw,
    });
  });

  const missing = (["priceMin", "price", "configuration", "possession", "area"] as Field[]).filter(
    (f) => mapping.byField[f] === undefined,
  );
  if (mapping.byField.price === undefined && mapping.byField.priceMin === undefined) {
    warnings.push("No price column found — budget matching will treat every price as 'Not specified'.");
  }
  if (missing.includes("configuration")) warnings.push("No configuration/BHK column found.");
  if (missing.includes("possession")) warnings.push("No possession column found.");
  if (mapping.byField.area === undefined && mapping.byField.areaMin === undefined) warnings.push("No area/size column found.");
  const noPrice = properties.filter((p) => p.priceMinCr === null && p.priceMaxCr === null).length;
  if (noPrice) warnings.push(`${noPrice} properties have no usable price.`);

  return {
    meta: {
      fileName,
      uploadedAt: new Date().toISOString(),
      totalRows: properties.length,
      mapping: {
        sheetName: table.sheetName,
        headerRow: table.headerRow + 1,
        mapped: (Object.entries(mapping.byField) as [Field, number][]).map(([field, idx]) => ({
          field,
          column: headers[idx],
        })),
        unmapped: mapping.unmapped,
      },
      warnings,
    },
    properties,
  };
}
