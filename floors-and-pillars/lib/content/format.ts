import { BUDGET_BANDS } from "@/content/options";
import type { HomeMeta } from "./schemas";

const cr = (n: number) => `₹${Number(n.toFixed(2))} Cr`;

export function priceFrom(h: HomeMeta) {
  if (h.priceFromCr) return `from ${cr(h.priceFromCr)}`;
  return BUDGET_BANDS.find((b) => b.value === h.priceBand)?.label ?? "";
}

export function sizeRange(h: HomeMeta) {
  if (!h.sizeRangeSqft) return null;
  const [a, b] = h.sizeRangeSqft;
  const f = (n: number) => n.toLocaleString("en-IN");
  return a === b ? `${f(a)} sq ft` : `${f(a)}–${f(b)} sq ft`;
}

export function scale(h: HomeMeta) {
  if (h.units && h.landAcres) return `${h.units.toLocaleString("en-IN")} homes on ${h.landAcres} acres`;
  if (h.units) return `${h.units.toLocaleString("en-IN")} homes`;
  if (h.landAcres) return `${h.landAcres}-acre site`;
  return null;
}

export const typeLabel = (t: HomeMeta["type"]) => (t === "villa" ? "Villa" : "Apartment");
