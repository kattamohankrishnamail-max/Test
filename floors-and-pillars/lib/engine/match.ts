import { HIDDEN_STATUSES, MATCHING, SOLD_OUT_SIGNALS, WEIGHTS } from "./config.ts";
import { formatCr, formatCrRange, formatSqft } from "./format.ts";
import { locationFit } from "./locations.ts";
import type { Criterion, CriterionResult, Lifestyle, Match, MatchResult, Property, Requirements } from "./types.ts";

/**
 * Transparent, rule-based matching. Every reason string is built from a value in the
 * uploaded sheet (or quotes it); nothing about a property is inferred beyond that.
 */

export function isSoldOut(p: Property): boolean {
  return !!p.salesSignal && SOLD_OUT_SIGNALS.some((re) => re.test(p.salesSignal!.trim()));
}

export function isClientVisible(p: Property): boolean {
  if (p.status && HIDDEN_STATUSES.some((re) => re.test(p.status!))) return false;
  if (isSoldOut(p)) return false;
  return true;
}

const monthNow = (now: Date) => now.getFullYear() * 12 + now.getMonth();

function budgetFit(p: Property, r: Requirements): Omit<CriterionResult, "criterion"> | null {
  if (r.budgetMinCr === null && r.budgetMaxCr === null) return null;
  const lo = p.priceMinCr ?? p.priceMaxCr;
  const hi = p.priceMaxCr ?? p.priceMinCr;
  if (lo === null || hi === null) {
    return { score: MATCHING.unknownScore, reason: null, gap: "pricing is not specified in our database" };
  }
  const bMin = r.budgetMinCr ?? 0;
  const bMax = r.budgetMaxCr ?? Infinity;
  const range = formatCrRange(lo, hi);

  if (lo <= bMax && hi >= bMin) {
    // Price range overlaps the budget. When the client wants one of the larger
    // configurations, the overlap may only be at the entry end: estimate where that
    // configuration sits in the range (linear by bedroom count) and flag it.
    const want = r.bedrooms.length ? Math.min(...r.bedrooms) : null;
    const opts = p.bedroomOptions;
    if (want !== null && opts.length > 1 && lo < hi && hi > bMax) {
      const bLo = Math.min(...opts);
      const bHi = Math.max(...opts);
      const pos = Math.min(1, Math.max(0, (want - bLo) / (bHi - bLo || 1)));
      const est = lo + pos * (hi - lo);
      if (est > bMax * 1.1) {
        const over = est / bMax - 1;
        return {
          score: Math.max(0.5, 1 - over / MATCHING.budgetOverTolerance),
          reason: `Entry pricing from ${formatCr(lo)} is within your budget`,
          gap: `${want} BHK homes here likely sit higher in the ${range} range`,
        };
      }
    }
    if (hi <= bMax) return { score: 1, reason: `Priced ${range}, within your budget`, gap: null };
    return { score: 1, reason: `Starts at ${formatCr(lo)}, within your budget`, gap: null };
  }
  if (lo > bMax) {
    const over = lo / bMax - 1;
    const score = Math.max(0, 1 - over / MATCHING.budgetOverTolerance);
    const pct = Math.round(over * 100);
    return {
      score,
      reason: score >= 0.7 ? `Starts at ${formatCr(lo)}, a modest stretch on your budget` : null,
      gap: `starts at ${formatCr(lo)}, about ${pct}% above your budget`,
    };
  }
  const under = 1 - hi / bMin;
  const score = Math.max(0, 1 - under / MATCHING.budgetUnderTolerance);
  return {
    score,
    reason: score >= 0.7 ? `Priced ${range}, comfortably below your ceiling` : null,
    gap: `priced ${range}, below the range you're considering`,
  };
}

function configurationFit(p: Property, r: Requirements): Omit<CriterionResult, "criterion"> | null {
  if (!r.bedrooms.length && !r.penthouse) return null;
  if (r.penthouse && p.hasPenthouse) {
    return { score: 1, reason: `Penthouse residences listed (${p.configurationLabel})`, gap: null };
  }
  if (!r.bedrooms.length) {
    return { score: 0.3, reason: null, gap: `no penthouse listed (${p.configurationLabel ?? "configuration not specified"})` };
  }
  if (!p.bedroomOptions.length) {
    return { score: MATCHING.unknownScore, reason: null, gap: "configuration is not specified in our database" };
  }
  const opts = p.bedroomOptions;
  const label = p.configurationLabel ?? opts.join(", ") + " BHK";
  let best = 0;
  let bestReason: string | null = null;
  for (const n of r.bedrooms) {
    const hit = r.bedroomsAtLeast
      ? opts.some((o) => o >= n) || p.bedroomsOpenEnded
      : opts.some((o) => Math.floor(o) === n) || (p.bedroomsOpenEnded && Math.max(...opts) <= n);
    if (hit) {
      return { score: 1, reason: `${n} BHK${r.bedroomsAtLeast ? "+" : ""} matching your requirement (offers ${label})`, gap: null };
    }
    const d = Math.min(...opts.map((o) => o - n).map(Math.abs));
    const larger = opts.some((o) => o > n);
    const s = d <= 0.5 ? 0.8 : d <= 1 ? (larger ? 0.6 : 0.35) : 0;
    if (s > best) {
      best = s;
      bestReason = s >= 0.6 ? `Offers ${label} — close to your ${n} BHK brief` : null;
    }
  }
  return {
    score: best,
    reason: bestReason,
    gap: `offers ${label} rather than ${r.bedrooms.join(" / ")} BHK`,
  };
}

function sizeFit(p: Property, r: Requirements): Omit<CriterionResult, "criterion"> | null {
  if (!r.minAreaSqft) return null;
  if (p.areaMax === null) return { score: MATCHING.unknownScore, reason: null, gap: "size is not specified in our database" };
  if (p.areaMin !== null && p.areaMin >= r.minAreaSqft) {
    return { score: 1, reason: `${formatSqft(p.areaMin)}+ residences`, gap: null };
  }
  if (p.areaMax >= r.minAreaSqft) {
    return { score: 1, reason: `Residences up to ${formatSqft(p.areaMax)}`, gap: null };
  }
  const ratio = p.areaMax / r.minAreaSqft;
  return {
    score: Math.max(0, (ratio - 0.7) / 0.3),
    reason: null,
    gap: `largest homes are about ${formatSqft(p.areaMax)}, below your ${formatSqft(r.minAreaSqft)}`,
  };
}

function possessionFit(p: Property, r: Requirements, now: Date): Omit<CriterionResult, "criterion"> | null {
  if (!r.possession || r.possession === "flexible") return null;
  if (p.possessionMonth === null) {
    return { score: MATCHING.unknownScore, reason: null, gap: "possession timing is not specified in our database" };
  }
  const n = monthNow(now);
  const months = { ready: 0, "12m": 12, "1-2y": 24, "1-3y": 36, "2y+": Infinity }[r.possession];
  const deadline = n + months;
  if (p.isReady) {
    const label = p.possessionLabel && !/^ready$/i.test(p.possessionLabel) ? ` (${p.possessionLabel})` : "";
    return { score: 1, reason: `Ready to move in${label}`, gap: null };
  }
  if (p.possessionMonth <= deadline) {
    return { score: 1, reason: `Possession ${p.possessionLabel} — within your timeline`, gap: null };
  }
  const late = p.possessionMonth - deadline;
  return {
    score: late <= 6 ? 0.6 : late <= 12 ? 0.35 : 0.1,
    reason: null,
    gap: `possession ${p.possessionLabel}, later than your timeline`,
  };
}

/** Quotes the sheet: returns the clause around a keyword from the notes/amenities/USP text. */
function quote(p: Property, re: RegExp): string | null {
  for (const text of [p.usp, p.amenities, p.description]) {
    if (!text) continue;
    const clauses = text.split(/(?<=[.;])\s+/);
    const hit = clauses.find((c) => re.test(c));
    if (hit) {
      const c = hit.replace(/[.;]\s*$/, "").trim();
      return c.length > 90 ? `${c.slice(0, 87).trim()}…` : c;
    }
  }
  return null;
}

const AIRPORT_CORRIDOR = /devanahalli|yelahanka|hebbal|bagalur|jakkur|sadahalli|aerospace|ivc r|airport r|tharahunise|rajanukunte|chikkajala|shettigere|bellary/i;
const OFFICE_CORRIDOR = /whitefield|itpl|\borr\b|bellandur|marathahalli|sarjapur|electronic city|manyata|thanisandra|hebbal|koramangala|\bhsr\b|panathur|varthur/i;

function lifestyleEvidence(p: Property, pref: Lifestyle): string | null {
  const arch = p.archetype ?? "";
  const place = `${p.microMarket ?? ""} ${p.location ?? ""}`;
  switch (pref) {
    case "large-homes":
      if (p.areaMax !== null && p.areaMax >= MATCHING.largeHomeSqft) return `Large-format homes up to ${formatSqft(p.areaMax)}`;
      if (/large-format|sky/i.test(arch)) return `${arch} positioning`;
      return null;
    case "low-density":
      if (p.unitsPerAcre !== null && p.unitsPerAcre <= MATCHING.lowDensityUnitsPerAcre)
        return `Low-density — about ${Math.round(p.unitsPerAcre)} homes per acre`;
      if (/boutique|low-density|villa/i.test(arch)) return `Low-density ${arch.toLowerCase()} development`;
      return null;
    case "private-villa":
      return p.typeGroups.includes("villa") ? `Private ${(p.productLabel ?? "villa").toLowerCase()} format` : null;
    case "premium-amenities": {
      const q = quote(p, /clubhouse|club house|pool|spa\b|amenit|concierge|gym/i);
      return q ? `“${q}”` : null;
    }
    case "golf": {
      const q = quote(p, /golf|\bkga\b/i) ?? (/golf|\bkga\b/i.test(place) ? p.microMarket : null);
      return q ? `Golf-course proximity: ${q}` : null;
    }
    case "green": {
      if (/nature/i.test(arch)) return `${arch} project`;
      const q = quote(p, /lake|park|open space|green|forest|nature|garden|tree/i) ?? (/lake|park/i.test(place) ? p.microMarket : null);
      return q ? `Green setting: ${q}` : null;
    }
    case "central":
      if ((p.zone ?? "").toLowerCase() === "central" || /central/i.test(arch)) return `Central address in ${p.microMarket ?? p.zone}`;
      return null;
    case "airport":
      if (p.airportDistanceKm !== null && p.airportDistanceKm <= MATCHING.airportDistanceKm) return `${p.airportDistanceKm} km from the airport`;
      return AIRPORT_CORRIDOR.test(place) ? `${p.microMarket} — on the airport corridor` : null;
    case "schools": {
      const q = quote(p, /school/i);
      return q ? `“${q}”` : null;
    }
    case "privacy":
      if (p.typeGroups.includes("villa") && !p.typeGroups.includes("apartment")) return `Private ${(p.productLabel ?? "villa").toLowerCase()} living`;
      if (p.units !== null && p.units <= 120) return `An intimate development of ${p.units} homes`;
      if (/boutique/i.test(arch)) return `${arch} project`;
      return null;
    case "community":
      if (/township/i.test(arch)) return `${arch} — a larger community setting`;
      if (p.units !== null && p.units >= 400) return `A community of ${p.units.toLocaleString("en-IN")} homes`;
      return null;
    case "design": {
      if (/design/i.test(arch)) return `${arch} project`;
      const q = quote(p, /design|architect/i);
      return q ? `“${q}”` : null;
    }
    case "investment":
      if (p.salesSignal && /sold|apprecia|pre-launch/i.test(p.salesSignal)) return `Sales traction: ${p.salesSignal}`;
      {
        const q = quote(p, /apprecia|sold out|sell-out/i);
        return q ? `“${q}”` : null;
      }
    case "rental":
      return OFFICE_CORRIDOR.test(place) ? `${p.microMarket} — close to major office corridors` : null;
  }
}

function lifestyleFit(p: Property, r: Requirements): Omit<CriterionResult, "criterion"> & { reasons: string[] } | null {
  if (!r.lifestyle.length) return null;
  const hits = r.lifestyle.map((l) => lifestyleEvidence(p, l)).filter((x): x is string => !!x);
  const score = hits.length / r.lifestyle.length;
  return {
    score,
    reason: hits[0] ?? null,
    reasons: hits,
    gap: score < 0.5 ? "meets fewer of your lifestyle priorities" : null,
  };
}

export function scoreProperty(p: Property, r: Requirements, now = new Date()): Match {
  const results: CriterionResult[] = [];
  const add = (criterion: Criterion, res: Omit<CriterionResult, "criterion"> | null) => {
    if (res) results.push({ criterion, score: res.score, reason: res.reason, gap: res.gap });
  };
  add("budget", budgetFit(p, r));
  add("location", locationFit(p, r.locations));
  add("configuration", configurationFit(p, r));
  add("size", sizeFit(p, r));
  add("possession", possessionFit(p, r, now));
  const life = lifestyleFit(p, r);
  add("lifestyle", life);

  const totalW = results.reduce((s, c) => s + WEIGHTS[c.criterion], 0);
  const score = totalW ? (results.reduce((s, c) => s + WEIGHTS[c.criterion] * c.score, 0) / totalW) * 100 : 50;

  // Strongest reasons first, weighted by how much each criterion counts.
  const ranked = results
    .filter((c) => c.reason && c.score >= 0.6)
    .sort((a, b) => WEIGHTS[b.criterion] * b.score - WEIGHTS[a.criterion] * a.score);
  const reasons: string[] = [];
  for (const c of ranked) {
    if (c.criterion === "lifestyle" && life) reasons.push(...life.reasons.slice(0, 2));
    else reasons.push(c.reason!);
  }
  const typeOk = r.propertyType === "either" || p.typeGroups.includes(r.propertyType);
  const floorsOk = results.every((c) => {
    const floor = MATCHING.exactFloors[c.criterion];
    return floor === undefined || c.score >= floor;
  });

  return {
    property: p,
    score: Math.round(score),
    criteria: results,
    reasons: reasons.slice(0, 4),
    gaps: results.filter((c) => c.gap && c.score < 0.75).map((c) => c.gap!),
    exact: typeOk && floorsOk && score >= MATCHING.exactThreshold,
  };
}

const completeness = (p: Property) =>
  [p.priceMinCr, p.areaMax, p.possessionMonth, p.bedroomOptions.length || null, p.developer].filter((x) => x !== null).length;

function byFit(a: Match, b: Match) {
  return (
    b.score - a.score ||
    Number(b.property.priceVerified === true) - Number(a.property.priceVerified === true) ||
    completeness(b.property) - completeness(a.property)
  );
}

const MATCH_PHRASE: Record<Criterion, string> = {
  budget: "budget",
  location: "preferred locations",
  configuration: "configuration",
  size: "size",
  possession: "timeline",
  lifestyle: "lifestyle priorities",
};
const GAP_PHRASE: Record<Criterion, string> = {
  budget: "sit outside your preferred budget",
  location: "are outside your preferred locations",
  configuration: "offer a slightly different configuration",
  size: "are slightly below your preferred size",
  possession: "complete later than your preferred timeline",
  lifestyle: "meet fewer of your lifestyle priorities",
};

function explain(alts: Match[]): string | null {
  if (!alts.length) return null;
  const criteria = [...new Set(alts.flatMap((m) => m.criteria.map((c) => c.criterion)))];
  const avg = (c: Criterion) => {
    const xs = alts.map((m) => m.criteria.find((x) => x.criterion === c)?.score).filter((x): x is number => x !== undefined);
    return xs.reduce((s, x) => s + x, 0) / (xs.length || 1);
  };
  const fits = criteria.filter((c) => avg(c) >= 0.8).map((c) => MATCH_PHRASE[c]);
  const misses = criteria.filter((c) => avg(c) < 0.7).sort((a, b) => avg(a) - avg(b)).map((c) => GAP_PHRASE[c]);
  const join = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);
  if (fits.length && misses.length) return `These homes fit your ${join(fits)}, but most ${join(misses.slice(0, 2))}.`;
  if (misses.length) return `The closest homes in our collection ${join(misses.slice(0, 2))}.`;
  return "Each is a close fit on most of your brief — the notes on every home show where it differs.";
}

export function matchProperties(all: Property[], r: Requirements, now = new Date()): MatchResult {
  const visible = all.filter(isClientVisible);
  const scored = visible.map((p) => scoreProperty(p, r, now)).sort(byFit);
  const typeOk = (m: Match) => r.propertyType === "either" || m.property.typeGroups.includes(r.propertyType);

  const exactAll = scored.filter((m) => m.exact);
  const exact = exactAll.slice(0, MATCHING.maxResults);

  let alternatives: Match[] = [];
  if (exact.length < MATCHING.minAlternatives) {
    const want = exact.length ? MATCHING.minAlternatives - exact.length + 1 : 4;
    const pool = scored.filter((m) => !m.exact && typeOk(m));
    alternatives = (pool.length ? pool : scored.filter((m) => !m.exact)).slice(0, want);
  }

  const n = (k: number) => (k === 1 ? "1 home" : `${k} homes`);
  let summary: string;
  if (exactAll.length > exact.length) {
    summary = `We found ${n(exactAll.length)} that match your brief. Here are the ${exact.length} strongest.`;
  } else if (exact.length) {
    summary = `We found ${n(exact.length)} that ${exact.length === 1 ? "matches" : "match"} your brief.`;
  } else if (alternatives.length) {
    summary = `We couldn't find an exact match, but we found ${n(alternatives.length)} that come close.`;
  } else {
    summary = "We couldn't find homes in our current collection for this brief.";
  }
  return { exact, alternatives, summary, explanation: explain(alternatives) };
}
