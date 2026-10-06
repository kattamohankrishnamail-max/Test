export type TypeGroup = "apartment" | "villa";

/** A property row after column mapping + parsing. Every field is derived from the uploaded sheet. */
export interface Property {
  id: string;
  projectName: string;
  developer: string | null;
  /** Product label exactly as it appears in the sheet (e.g. "Row house"). */
  productLabel: string | null;
  typeGroups: TypeGroup[];
  archetype: string | null;
  zone: string | null;
  microMarket: string | null;
  location: string | null;
  configurationLabel: string | null;
  bedroomOptions: number[];
  bedroomsOpenEnded: boolean;
  hasPenthouse: boolean;
  areaLabel: string | null;
  areaMin: number | null;
  areaMax: number | null;
  priceLabel: string | null;
  /** Prices are held in ₹ crore. */
  priceMinCr: number | null;
  priceMaxCr: number | null;
  priceVerified: boolean | null;
  possessionLabel: string | null;
  /** Possession as a month index (year*12 + month0), null when unknown. */
  possessionMonth: number | null;
  isReady: boolean;
  status: string | null;
  salesSignal: string | null;
  units: number | null;
  landAcres: number | null;
  unitsPerAcre: number | null;
  rera: string | null;
  amenities: string | null;
  description: string | null;
  usp: string | null;
  projectUrl: string | null;
  imageUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  airportDistanceKm: number | null;
  launch: string | null;
  /** Every original column → value, for the detail view. */
  raw: Record<string, string>;
}

export interface ColumnMappingReport {
  sheetName: string;
  headerRow: number;
  mapped: { field: string; column: string }[];
  unmapped: string[];
}

export interface DatasetMeta {
  fileName: string;
  uploadedAt: string;
  totalRows: number;
  mapping: ColumnMappingReport;
  warnings: string[];
}

export interface Dataset {
  meta: DatasetMeta;
  properties: Property[];
}

export type Possession = "ready" | "12m" | "1-2y" | "1-3y" | "2y+" | "flexible";

export type Lifestyle =
  | "large-homes"
  | "low-density"
  | "private-villa"
  | "premium-amenities"
  | "golf"
  | "green"
  | "central"
  | "airport"
  | "schools"
  | "privacy"
  | "community"
  | "design"
  | "investment"
  | "rental";

export type PropertyTypePref = "apartment" | "villa" | "either";

/** Structured client brief. Budgets are in ₹ crore internally. */
export interface Requirements {
  propertyType: PropertyTypePref;
  locations: string[];
  budgetMinCr: number | null;
  budgetMaxCr: number | null;
  /** Bedroom counts requested; 6 with bedroomsAtLeast=true means "6 BHK+". */
  bedrooms: number[];
  bedroomsAtLeast: boolean;
  penthouse: boolean;
  minAreaSqft: number | null;
  possession: Possession | null;
  lifestyle: Lifestyle[];
  /** Free-text preference words kept from the brief (e.g. "family", "quiet"). */
  notes: string[];
}

export const emptyRequirements = (): Requirements => ({
  propertyType: "either",
  locations: [],
  budgetMinCr: null,
  budgetMaxCr: null,
  bedrooms: [],
  bedroomsAtLeast: false,
  penthouse: false,
  minAreaSqft: null,
  possession: null,
  lifestyle: [],
  notes: [],
});

export type Criterion = "budget" | "location" | "configuration" | "size" | "possession" | "lifestyle";

export interface CriterionResult {
  criterion: Criterion;
  score: number; // 0..1
  reason: string | null; // positive reason shown under "Why this fits you"
  gap: string | null; // what falls short, for near matches
}

export interface Match {
  property: Property;
  score: number; // 0..100
  criteria: CriterionResult[];
  reasons: string[];
  gaps: string[];
  exact: boolean;
}

export interface MatchResult {
  exact: Match[];
  alternatives: Match[];
  summary: string;
  explanation: string | null;
}
