import type { Property } from "./types.ts";

export const NS = "Not specified";

const crNum = (n: number) => String(Number(n.toFixed(2)));

export function formatCr(n: number): string {
  return `₹${crNum(n)} Cr`;
}

export function formatCrRange(lo: number, hi: number): string {
  return lo === hi ? formatCr(lo) : `₹${crNum(lo)}–${crNum(hi)} Cr`;
}

export function formatSqft(n: number): string {
  return `${Math.round(n).toLocaleString("en-IN")} sq ft`;
}

export function priceText(p: Property): string {
  if (p.priceMinCr === null && p.priceMaxCr === null) return p.priceLabel ?? NS;
  const lo = p.priceMinCr ?? p.priceMaxCr!;
  const hi = p.priceMaxCr ?? lo;
  return formatCrRange(lo, hi);
}

export function areaText(p: Property): string {
  if (p.areaLabel) return /sq/i.test(p.areaLabel) ? p.areaLabel : `${p.areaLabel} sq ft`;
  if (p.areaMin === null) return NS;
  return p.areaMin === p.areaMax ? formatSqft(p.areaMin) : `${formatSqft(p.areaMin)} – ${formatSqft(p.areaMax!)}`;
}

export const or = (v: string | null | undefined) => (v && v.trim() ? v : NS);

export function locationText(p: Property): string {
  const parts = [p.microMarket, p.zone ? `${p.zone} Bengaluru` : null].filter(Boolean);
  return parts.length ? parts.join(" · ") : or(p.location);
}
