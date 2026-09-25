import { canonicalPlace, findPlacesInText } from "./locations.ts";
import { emptyRequirements, type Lifestyle, type Possession, type Requirements } from "./types.ts";

/**
 * Rule-based requirement extraction. Deterministic and instant; the optional LLM
 * extractor (lib/llm.ts) only refines what this produces.
 */

const LIFESTYLE_CUES: [RegExp, Lifestyle, string][] = [
  [/spacious|large|big|expansive|roomy|generous/i, "large-homes", "spacious"],
  [/low[- ]?density|fewer (units|neighbou?rs)|not crowded|boutique/i, "low-density", "low density"],
  [/private villa|independent (house|villa)|own (garden|plot)/i, "private-villa", "private villa"],
  [/amenit|clubhouse|pool|gym|spa\b|concierge/i, "premium-amenities", "amenities"],
  [/golf/i, "golf", "golf"],
  [/green|nature|trees|lake|park|garden|leafy/i, "green", "green"],
  [/quiet|peaceful|calm|serene|tranquil/i, "privacy", "quiet"],
  [/central|heart of the city|cbd|city cent/i, "central", "central"],
  [/airport/i, "airport", "airport access"],
  [/school|kids|children/i, "schools", "schools"],
  [/privacy|private|secluded/i, "privacy", "privacy"],
  [/community|neighbou?rhood feel|social|township/i, "community", "community"],
  [/design|architect|aesthetic/i, "design", "design"],
  [/invest|apprecia|capital gain|returns/i, "investment", "investment"],
  [/rental|rent out|yield|lease/i, "rental", "rental"],
];

const NOTE_CUES: [RegExp, string][] = [
  [/family|families/i, "family"],
  [/retire/i, "retirement"],
  [/nri|abroad|overseas/i, "NRI buyer"],
  [/pet|dog/i, "pets"],
  [/work from home|wfh|home office|study/i, "home office"],
  [/parents|elderly|senior/i, "multi-generational"],
];

const NUM = String.raw`(\d+(?:\.\d+)?)`;
const UNIT = String.raw`\s*(cr(?:ore)?s?|c\b|lakhs?|lacs?|l\b|mn|million)?`;

function toCr(n: number, unit: string | undefined): number {
  const u = (unit ?? "").toLowerCase();
  if (/^l/.test(u)) return n / 100;
  if (/^(mn|million)/.test(u)) return n / 10; // ₹1 mn = 0.1 Cr
  if (!u && n >= 100000) return n / 1e7; // raw rupees
  return n;
}

export function extractBudget(text: string): { min: number | null; max: number | null } {
  const t = text.toLowerCase().replace(/₹|rs\.?|inr/g, " ").replace(/,/g, "");
  // Range: "5-8 Cr", "between 5 and 8 crore", "5 to 8 cr"
  const range = t.match(new RegExp(`${NUM}${UNIT}\\s*(?:-|–|to|and)\\s*${NUM}${UNIT}`));
  if (range && (range[2] || range[4])) {
    const unit = range[4] ?? range[2];
    const a = toCr(parseFloat(range[1]), range[2] ?? unit);
    const b = toCr(parseFloat(range[3]), unit);
    return { min: Math.min(a, b), max: Math.max(a, b) };
  }
  const single = t.match(new RegExp(`(under|below|upto|up to|max(?:imum)?|within|around|about|approx(?:imately)?|~|at least|minimum|min|above|over|from|starting)?\\s*${NUM}${UNIT}`, "g"));
  for (const chunk of single ?? []) {
    const m = chunk.match(new RegExp(`(under|below|upto|up to|max(?:imum)?|within|around|about|approx(?:imately)?|~|at least|minimum|min|above|over|from|starting)?\\s*${NUM}${UNIT}`));
    if (!m || !m[3]) continue; // require a money unit so "4 BHK" isn't read as a budget
    const v = toCr(parseFloat(m[2]), m[3]);
    if (v < 0.5 || v > 500) continue;
    const q = (m[1] ?? "").toLowerCase();
    if (/at least|minimum|min|above|over|from|starting/.test(q)) return { min: v, max: null };
    // "around ₹5 Cr" and a bare figure are both read as a ceiling; scoring allows a stretch above it.
    return { min: null, max: v };
  }
  return { min: null, max: null };
}

function extractPossession(t: string): Possession | null {
  // Timelines first: "ready within a year" means 12 months, not ready to move.
  if (/within (a|one|1) year|within 12 months|next 12 months|this year/i.test(t)) return "12m";
  if (/ready[- ]to[- ]move|ready possession|immediate|move in (now|soon|immediately)|\bready\b/i.test(t)) return "ready";
  if (/1\s*[-–to]+\s*2 years|next year|within (two|2) years|in a year or two/i.test(t)) return "1-2y";
  if (/(2|two)\+? years|under[- ]construction (is )?(fine|ok)|can wait|no rush|don'?t mind waiting/i.test(t)) return "2y+";
  if (/flexible (on )?(timing|possession)|any possession/i.test(t)) return "flexible";
  return null;
}

export function extractRequirements(text: string): Requirements {
  const r = emptyRequirements();
  const t = text.trim();
  if (!t) return r;

  const wantsVilla = /villa|row ?house|independent house|bungalow|townhouse/i.test(t);
  const wantsApt = /apartment|flat|condo|penthouse|high[- ]rise|tower|sky ?residence/i.test(t);
  r.propertyType = wantsVilla && !wantsApt ? "villa" : wantsApt && !wantsVilla ? "apartment" : "either";
  if (/villa or (an )?apartment|apartment or (a )?villa|either/i.test(t)) r.propertyType = "either";

  const bhk = [...t.matchAll(/(\d(?:\.5)?)\s*(\+)?\s*(?:bhk|bed(?:room)?s?|br\b)/gi)];
  for (const m of bhk) {
    const n = parseFloat(m[1]);
    if (n >= 1 && n <= 10 && !r.bedrooms.includes(n)) r.bedrooms.push(n);
    if (m[2]) r.bedroomsAtLeast = true;
  }
  if (/(\d)\s*(?:or|\/)\s*(\d)\s*bhk/i.test(t)) {
    const m = t.match(/(\d)\s*(?:or|\/)\s*(\d)\s*bhk/i)!;
    for (const n of [m[1], m[2]].map(Number)) if (!r.bedrooms.includes(n)) r.bedrooms.push(n);
  }
  if (/penthouse/i.test(t)) r.penthouse = true;

  const budget = extractBudget(t);
  r.budgetMinCr = budget.min;
  r.budgetMaxCr = budget.max;

  const area = t.replace(/,/g, "").match(/(\d{3,5})\s*\+?\s*(?:sq\.?\s*ft|sqft|square feet|sft)/i);
  if (area) r.minAreaSqft = parseInt(area[1], 10);

  r.locations = findPlacesInText(t).map(canonicalPlace);
  r.possession = extractPossession(t);

  const lifestyle = new Set<Lifestyle>();
  const notes = new Set<string>();
  for (const [re, tag, word] of LIFESTYLE_CUES) {
    if (re.test(t)) {
      // "airport" inside a place name ("Old Airport Rd") isn't a lifestyle cue.
      if (tag === "airport" && /old airport/i.test(t) && !/airport (access|connectivity|proximity)|near(?: the)? airport|close to (the )?airport/i.test(t)) continue;
      lifestyle.add(tag);
      notes.add(word);
    }
  }
  if (r.propertyType === "villa" && /private|independent/i.test(t)) lifestyle.add("private-villa");
  for (const [re, word] of NOTE_CUES) if (re.test(t)) notes.add(word);
  r.lifestyle = [...lifestyle];
  r.notes = [...notes];
  return r;
}

/**
 * Structured inputs the client picked explicitly win over what we read from text;
 * list fields are unioned.
 */
export function mergeRequirements(fromText: Requirements, explicit: Requirements): Requirements {
  const uniq = <T,>(a: T[]) => [...new Set(a)];
  const budget = explicit.budgetMinCr !== null || explicit.budgetMaxCr !== null ? explicit : fromText;
  return {
    propertyType: explicit.propertyType !== "either" ? explicit.propertyType : fromText.propertyType,
    locations: uniq([...explicit.locations, ...fromText.locations].map(canonicalPlace)),
    budgetMinCr: budget.budgetMinCr,
    budgetMaxCr: budget.budgetMaxCr,
    bedrooms: explicit.bedrooms.length ? explicit.bedrooms : fromText.bedrooms,
    bedroomsAtLeast: explicit.bedrooms.length ? explicit.bedroomsAtLeast : fromText.bedroomsAtLeast,
    penthouse: explicit.penthouse || fromText.penthouse,
    minAreaSqft: explicit.minAreaSqft ?? fromText.minAreaSqft,
    possession: explicit.possession ?? fromText.possession,
    lifestyle: uniq([...explicit.lifestyle, ...fromText.lifestyle]),
    notes: uniq([...explicit.notes, ...fromText.notes]),
  };
}

/** Shape from the spec, for display/debug ("how we read your brief"). Budgets in rupees. */
export function toSpecJson(r: Requirements) {
  return {
    property_type: r.propertyType,
    configuration: r.bedrooms.length ? r.bedrooms.map((b) => `${b} BHK${r.bedroomsAtLeast ? "+" : ""}`).join(" / ") : null,
    budget_min: r.budgetMinCr !== null ? Math.round(r.budgetMinCr * 1e7) : null,
    budget_max: r.budgetMaxCr !== null ? Math.round(r.budgetMaxCr * 1e7) : null,
    location: r.locations,
    min_area_sqft: r.minAreaSqft,
    possession: r.possession,
    preferences: r.notes.length ? r.notes : r.lifestyle,
  };
}
