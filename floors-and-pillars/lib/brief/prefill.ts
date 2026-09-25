import { BUDGET_BANDS, CONFIGURATIONS, MAX_PRIORITIES, POSSESSION, PRIORITIES, PROPERTY_TYPES } from "@/content/options";
import { extractRequirements } from "@/lib/engine/extract";

/** sessionStorage key carrying the free-text description from the home teaser. */
export const DESCRIBE_KEY = "fp-brief-describe";
/** sessionStorage key holding the submitted brief (no contact details) for the thank-you page. */
export const SUBMITTED_KEY = "fp-brief-submitted";

export interface BriefDraft {
  propertyType?: string;
  configurations: string[];
  minSizeSqft?: string;
  possession?: string;
  budget?: string;
  areas: string[];
  priorities: string[];
  description?: string;
  home?: string;
}

const pick = (v: string | undefined, allowed: readonly { value: string }[]) => (v && allowed.some((a) => a.value === v) ? v : undefined);

/** Reads ?type=&budget=&priorities=a,b&home=slug&describe= into a safe draft. */
export function draftFromParams(params: Record<string, string | string[] | undefined>, marketSlugs: string[]): BriefDraft {
  const first = (k: string) => (Array.isArray(params[k]) ? params[k][0] : params[k]) as string | undefined;
  const list = (k: string) => {
    const v = params[k];
    return (Array.isArray(v) ? v : v ? [v] : []).flatMap((x) => x.split(",")).map((x) => x.trim()).filter(Boolean);
  };
  const priorities = list("priorities").filter((p) => PRIORITIES.some((x) => x.value === p)).slice(0, MAX_PRIORITIES);
  const home = first("home");
  return {
    propertyType: pick(first("type"), PROPERTY_TYPES),
    budget: pick(first("budget"), BUDGET_BANDS),
    configurations: list("config").filter((c) => CONFIGURATIONS.some((x) => x.value === c)),
    possession: pick(first("possession"), POSSESSION),
    areas: list("areas").filter((a) => a === "open" || marketSlugs.includes(a)),
    priorities,
    description: first("describe")?.slice(0, 2000),
    home: home && /^[a-z0-9-]+$/.test(home) ? home : undefined,
  };
}

/**
 * Uses the rule-based extractor to turn a free-text description into form selections.
 * Only fields the client hasn't already set are filled.
 */
export function draftFromText(text: string, markets: { slug: string; name: string; zone: string }[]): Partial<BriefDraft> {
  const r = extractRequirements(text);
  const out: Partial<BriefDraft> = {};
  if (r.propertyType !== "either") out.propertyType = r.propertyType;
  const cfg = new Set<string>();
  for (const b of r.bedrooms) cfg.add(b >= 5 ? "5+" : String(Math.floor(b)));
  if (r.bedroomsAtLeast && r.bedrooms.some((b) => b >= 5)) cfg.add("5+");
  const validCfg = [...cfg].filter((c) => CONFIGURATIONS.some((x) => x.value === c));
  if (validCfg.length) out.configurations = validCfg;
  if (r.minAreaSqft) out.minSizeSqft = String(r.minAreaSqft);
  if (r.possession) {
    out.possession = { ready: "ready", "12m": "12m", "1-2y": "1-3y", "1-3y": "1-3y", "2y+": "flexible", flexible: "flexible" }[r.possession];
  }
  const target = r.budgetMaxCr ?? r.budgetMinCr;
  if (target !== null) {
    const band = BUDGET_BANDS.find((b) => target > b.min - 0.001 && (b.max === null || target <= b.max));
    if (band) out.budget = band.value;
  }
  // Map recognised places to our micro-market list by name or zone.
  const areas = new Set<string>();
  for (const place of r.locations) {
    const p = place.toLowerCase();
    for (const m of markets) {
      const name = m.name.toLowerCase();
      if (name.includes(p) || p.includes(name.split(" ")[0]) || (p.endsWith("bengaluru") && p.startsWith(m.zone.toLowerCase()))) areas.add(m.slug);
    }
  }
  if (areas.size) out.areas = [...areas];
  const pr = PRIORITIES.filter((p) => r.lifestyle.includes(p.lifestyle)).map((p) => p.value);
  // "design" and "architecture" share an engine tag; keep the first.
  const uniq = [...new Set(pr)].filter((v, i, a) => !(v === "architecture" && a.includes("design")));
  if (uniq.length) out.priorities = uniq.slice(0, MAX_PRIORITIES);
  return out;
}
