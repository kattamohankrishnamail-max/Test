import { BUDGET_BANDS, CONFIGURATIONS, PRIORITIES } from "@/content/options";
import type { HomeMeta, Market } from "@/lib/content/schemas";
import { parseConfiguration, parsePossession } from "./normalize";
import { emptyRequirements, type Property, type Requirements } from "./types";

/** Maps a curated home (content) onto the engine's Property shape. */
export function homeToProperty(h: HomeMeta, market: Market | undefined, now = new Date()): Property {
  const band = BUDGET_BANDS.find((b) => b.value === h.priceBand)!;
  const cfg = parseConfiguration(h.configurations.join(", "));
  const poss = parsePossession(h.possession.includes("[[") ? null : h.possession, now);
  const priceMin = h.priceFromCr ?? band.min;
  return {
    id: h.slug,
    projectName: h.name,
    developer: h.developer,
    productLabel: h.type === "villa" ? "Villa" : "Apartment",
    typeGroups: [h.type],
    archetype: h.tags.join(" "),
    zone: market?.zone ?? null,
    microMarket: market?.name ?? h.microMarket,
    location: market?.name ?? null,
    configurationLabel: h.configurations.join(", "),
    bedroomOptions: cfg.options,
    bedroomsOpenEnded: cfg.openEnded,
    hasPenthouse: cfg.penthouse,
    areaLabel: null,
    areaMin: h.sizeRangeSqft?.[0] ?? null,
    areaMax: h.sizeRangeSqft?.[1] ?? null,
    priceLabel: null,
    priceMinCr: priceMin,
    priceMaxCr: band.max ?? priceMin,
    priceVerified: null,
    possessionLabel: h.possession,
    possessionMonth: poss.month,
    isReady: poss.ready,
    status: null,
    salesSignal: null,
    units: null,
    landAcres: null,
    unitsPerAcre: null,
    rera: h.reraId ?? null,
    amenities: h.tags.includes("amenities") ? "Lifestyle amenities" : null,
    description: [h.summary, ...h.whyWeLikeIt].join(". "),
    usp: null,
    projectUrl: null,
    imageUrl: null,
    latitude: null,
    longitude: null,
    airportDistanceKm: null,
    launch: null,
    raw: {},
  };
}

export interface SubmittedBrief {
  propertyType?: string;
  configurations?: string[];
  minSizeSqft?: string;
  possession?: string;
  budget?: string;
  areas?: string[];
  priorities?: string[];
}

/** Maps a submitted brief onto engine Requirements. */
export function briefToRequirements(b: SubmittedBrief, markets: Market[]): Requirements {
  const r = emptyRequirements();
  if (b.propertyType === "apartment" || b.propertyType === "villa") r.propertyType = b.propertyType;
  const band = BUDGET_BANDS.find((x) => x.value === b.budget);
  if (band) {
    r.budgetMinCr = band.min;
    r.budgetMaxCr = band.max;
  }
  const cfgs = (b.configurations ?? []).filter((c) => CONFIGURATIONS.some((x) => x.value === c));
  r.bedrooms = cfgs.map((c) => (c === "5+" ? 5 : Number(c)));
  r.bedroomsAtLeast = cfgs.length === 1 && cfgs[0] === "5+";
  const size = Number(b.minSizeSqft);
  if (size > 0) r.minAreaSqft = size;
  if (b.possession === "ready" || b.possession === "12m" || b.possession === "1-3y") r.possession = b.possession;
  r.locations = (b.areas ?? []).map((a) => markets.find((m) => m.slug === a)?.name).filter((x): x is string => !!x);
  r.lifestyle = [...new Set((b.priorities ?? []).map((p) => PRIORITIES.find((x) => x.value === p)?.lifestyle).filter((x) => !!x))] as Requirements["lifestyle"];
  return r;
}
