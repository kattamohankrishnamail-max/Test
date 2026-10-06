import { INTERNAL_COLUMN_PATTERNS } from "./config.ts";
import { isClientVisible, isSoldOut } from "./match.ts";
import type { Dataset, Property } from "./types.ts";

export function datasetStats(ds: Dataset) {
  const visible = ds.properties.filter(isClientVisible);
  const count = (xs: string[]) =>
    Object.entries(xs.reduce<Record<string, number>>((acc, x) => ((acc[x] = (acc[x] ?? 0) + 1), acc), {})).sort(
      (a, b) => b[1] - a[1],
    );
  return {
    total: ds.properties.length,
    visible: visible.length,
    hiddenByStatus: ds.properties.filter((p) => !isClientVisible(p) && !isSoldOut(p)).length,
    soldOut: ds.properties.filter(isSoldOut).length,
    apartments: visible.filter((p) => p.typeGroups.includes("apartment")).length,
    villas: visible.filter((p) => p.typeGroups.includes("villa")).length,
    byProduct: count(visible.map((p) => p.productLabel ?? "Not specified")),
    byZone: count(visible.map((p) => (p.zone ? `${p.zone} Bengaluru` : "Not specified"))),
  };
}

/** Client payload: visible rows only, internal research columns removed. */
export function publicProperties(ds: Dataset): Property[] {
  return ds.properties.filter(isClientVisible).map((p) => ({
    ...p,
    raw: Object.fromEntries(Object.entries(p.raw).filter(([k]) => !INTERNAL_COLUMN_PATTERNS.some((re) => re.test(k)))),
  }));
}
