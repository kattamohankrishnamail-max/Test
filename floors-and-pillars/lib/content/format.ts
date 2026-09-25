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

export const typeLabel = (t: HomeMeta["type"]) => (t === "villa" ? "Villa" : "Apartment");
