import type { Criterion, Lifestyle, Possession } from "./types.ts";

/**
 * Match-score weights. They are normalised over the criteria the client actually
 * specified, so leaving e.g. size blank doesn't drag every score down.
 */
export const WEIGHTS: Record<Criterion, number> = {
  budget: 30,
  location: 25,
  configuration: 15,
  size: 10,
  possession: 10,
  lifestyle: 10,
};

export const MATCHING = {
  /** Minimum score (0–100) for a home to count as an exact match. */
  exactThreshold: 75,
  /** Hard floors on individual criteria for an exact match (0–1). */
  exactFloors: { budget: 0.7, location: 0.5, configuration: 0.5, size: 0.5, possession: 0.6 } as Partial<Record<Criterion, number>>,
  maxResults: 6,
  minAlternatives: 3,
  /** Budget stretch: a price this far above the ceiling scores zero (0.3 = 30%). */
  budgetOverTolerance: 0.3,
  /** Homes priced far below the brief are a positioning mismatch; this far below scores zero. */
  budgetUnderTolerance: 0.6,
  /** Units per acre at or below which a project reads as low-density. */
  lowDensityUnitsPerAcre: 40,
  largeHomeSqft: 3500,
  airportDistanceKm: 25,
  /** Score given to a criterion when the sheet has no data for it. */
  unknownScore: 0.4,
};

/** Rows whose status column matches any of these are hidden from clients. */
export const HIDDEN_STATUSES = [/^excluded/i];

/** Sales-signal text that means nothing is left to sell. */
export const SOLD_OUT_SIGNALS = [/^sold out/i, /^100% sold/i, /^all configurations sold out/i];

/** Columns never shown on the client-facing detail view (internal research metadata). */
export const INTERNAL_COLUMN_PATTERNS = [
  /^id$/i,
  /source/i,
  /variance/i,
  /basis/i,
  /inclusion/i,
  /tier/i,
  /gdv|revenue/i,
  /\btag\b/i,
  /implied/i,
  /band/i,
  /avg ticket/i,
];

export const APARTMENT_BUDGETS: { label: string; min: number; max: number | null }[] = [
  { label: "₹3–5 Cr", min: 3, max: 5 },
  { label: "₹5–8 Cr", min: 5, max: 8 },
  { label: "₹8–12 Cr", min: 8, max: 12 },
  { label: "₹12 Cr+", min: 12, max: null },
];

export const VILLA_BUDGETS: { label: string; min: number; max: number | null }[] = [
  { label: "₹6–10 Cr", min: 6, max: 10 },
  { label: "₹10–15 Cr", min: 10, max: 15 },
  { label: "₹15–25 Cr", min: 15, max: 25 },
  { label: "₹25 Cr+", min: 25, max: null },
];

export const LOCATION_CHOICES = [
  "Whitefield",
  "Sarjapur",
  "Koramangala",
  "HSR",
  "Indiranagar",
  "Hebbal",
  "North Bengaluru",
  "ORR",
  "Devanahalli",
];

export const POSSESSION_CHOICES: { value: Possession; label: string }[] = [
  { value: "ready", label: "Ready to move" },
  { value: "12m", label: "Within 12 months" },
  { value: "1-2y", label: "1–2 years" },
  { value: "2y+", label: "2+ years" },
  { value: "flexible", label: "Flexible" },
];

export const LIFESTYLE_CHOICES: { value: Lifestyle; label: string }[] = [
  { value: "large-homes", label: "Large homes" },
  { value: "low-density", label: "Low-density development" },
  { value: "private-villa", label: "Private villa" },
  { value: "premium-amenities", label: "Premium amenities" },
  { value: "golf", label: "Golf proximity" },
  { value: "green", label: "Green surroundings" },
  { value: "central", label: "Central location" },
  { value: "airport", label: "Airport access" },
  { value: "schools", label: "International schools" },
  { value: "privacy", label: "Privacy" },
  { value: "community", label: "Community" },
  { value: "design", label: "Design & architecture" },
  { value: "investment", label: "Investment potential" },
  { value: "rental", label: "Rental potential" },
];
