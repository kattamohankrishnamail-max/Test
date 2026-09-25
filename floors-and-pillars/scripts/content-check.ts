/**
 * Pre-launch content gate.
 *   npm run content:check                      → report (fails only on errors below)
 *   LAUNCH_MODE=production npm run content:check → also fails if any [[PLACEHOLDER remains
 *
 * Errors: invalid content files, banned voice words, "independent" while the fee model
 * flag is false, and brand colour pairs that miss WCAG AA.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { AdvisorSchema, ArticleSchema, GuideSchema, HomeSchema, MarketSchema } from "../lib/content/schemas.ts";
import { site } from "../site.config.ts";

const root = path.resolve(import.meta.dirname, "..");
const production = process.env.LAUNCH_MODE === "production";
const errors: string[] = [];
const warnings: string[] = [];

function walk(dir: string, exts: string[]): string[] {
  const abs = path.join(root, dir);
  try {
    statSync(abs);
  } catch {
    return [];
  }
  return readdirSync(abs, { withFileTypes: true }).flatMap((e) => {
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) return walk(rel, exts);
    return exts.some((x) => e.name.endsWith(x)) ? [rel] : [];
  });
}

// ── 1. Schema validation ──────────────────────────────────────────────────────
const schemaDirs: [string, z.ZodType, string][] = [
  ["content/homes", HomeSchema, ".mdx"],
  ["content/bengaluru", GuideSchema, ".mdx"],
  ["content/journal", ArticleSchema, ".mdx"],
  ["content/advisors", AdvisorSchema, ".json"],
];
for (const [dir, schema, ext] of schemaDirs) {
  for (const file of walk(dir, [ext])) {
    const raw = readFileSync(path.join(root, file), "utf8");
    const data = ext === ".json" ? JSON.parse(raw) : matter(raw).data;
    const r = schema.safeParse(data);
    if (!r.success) errors.push(`${file}: invalid content\n${z.prettifyError(r.error)}`);
  }
}
const marketsResult = z.array(MarketSchema).safeParse(JSON.parse(readFileSync(path.join(root, "content/markets.json"), "utf8")));
if (!marketsResult.success) errors.push(`content/markets.json: invalid\n${z.prettifyError(marketsResult.error)}`);

// ── 2. Placeholders ───────────────────────────────────────────────────────────
const TEMPLATE_FILES = new Set(["components/ui/Placeholder.tsx"]); // renders placeholders supplied by content
const scanned = [
  ...walk("content", [".mdx", ".json", ".ts"]),
  ...walk("app", [".tsx", ".ts"]),
  ...walk("components", [".tsx", ".ts"]),
  "site.config.ts",
].filter((f) => !TEMPLATE_FILES.has(f));

const placeholders: { file: string; line: number; text: string }[] = [];
for (const file of scanned) {
  readFileSync(path.join(root, file), "utf8")
    .split("\n")
    .forEach((line, i) => {
      for (const m of line.matchAll(/\[\[PLACEHOLDER:?\s*([^\]]*)\]\]/g)) {
        placeholders.push({ file, line: i + 1, text: m[1].trim() || "(unspecified)" });
      }
      // Image sources still pointing at a neutral block (photography to supply).
      for (const m of line.matchAll(/["']placeholder:([^"']+)["']/g)) {
        placeholders.push({ file, line: i + 1, text: `image: ${m[1].trim()}` });
      }
    });
}

// ── 3. Voice: banned words, "independent" gate ────────────────────────────────
const BANNED = ["best deals", "prime", "world-class", "world class", "ultra-luxury", "ultra luxury", "hurry", "exclusive offer", "dream home"];
const copyFiles = scanned.filter((f) => f !== "site.config.ts");
for (const file of copyFiles) {
  const text = readFileSync(path.join(root, file), "utf8");
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    for (const w of BANNED) {
      if (new RegExp(`\\b${w.replace(/[-\s]/g, "[-\\s]")}\\b`, "i").test(line)) errors.push(`${file}:${i + 1} banned word "${w}"`);
    }
    if (!site.isIndependentFeeModel && /\bindependent(ly)?\b/i.test(line)) {
      errors.push(`${file}:${i + 1} uses "independent" but site.config isIndependentFeeModel is false`);
    }
  });
  const luxury = (text.match(/\bluxur(y|ious)\b/gi) ?? []).length;
  if (luxury > 2) warnings.push(`${file}: "luxury" appears ${luxury} times — use sparingly`);
}
for (const [k, v] of Object.entries(site)) {
  if (typeof v === "string" && !site.isIndependentFeeModel && /\bindependent\b/i.test(v)) errors.push(`site.config.ts ${k}: uses "independent"`);
}

// ── 4. Colour contrast (WCAG 2.1) ─────────────────────────────────────────────
const css = readFileSync(path.join(root, "app/globals.css"), "utf8");
const token = (name: string) => {
  const m = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`Colour token --${name} not found in globals.css`);
  return m[1];
};
const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
// [foreground, background, minimum] — 4.5 for body text, 3 for large text / UI only.
const PAIRS: [string, string, number][] = [
  ["ink", "limestone", 4.5],
  ["ink-soft", "limestone", 4.5],
  ["stone", "limestone", 4.5],
  ["stone", "white", 4.5],
  ["stone", "limestone-deep", 4.5],
  ["bronze-deep", "limestone", 4.5],
  ["bronze-deep", "white", 4.5],
  ["verdigris", "limestone", 4.5],
  ["limestone", "ink", 4.5],
  ["limestone", "verdigris", 4.5],
  ["white", "verdigris", 4.5],
  ["ink", "limestone-deep", 4.5],
  ["error", "white", 4.5],
  ["error", "limestone", 4.5],
  ["bronze", "limestone", 3], // large text / decoration only
];
const contrast: string[] = [];
for (const [fg, bg, min] of PAIRS) {
  const r = ratio(token(fg), token(bg));
  const ok = r >= min;
  contrast.push(`${ok ? "✓" : "✗"} ${fg} on ${bg}: ${r.toFixed(2)}:1 (needs ${min})`);
  if (!ok) errors.push(`Contrast: ${fg} on ${bg} is ${r.toFixed(2)}:1, needs ${min}`);
}

// ── Report ────────────────────────────────────────────────────────────────────
const byFile = new Map<string, typeof placeholders>();
for (const p of placeholders) byFile.set(p.file, [...(byFile.get(p.file) ?? []), p]);
console.log(`\nPlaceholders: ${placeholders.length} in ${byFile.size} files${production ? " (LAUNCH_MODE=production)" : ""}`);
for (const [file, list] of byFile) {
  console.log(`  ${file} (${list.length})`);
  for (const p of list) console.log(`    L${p.line}: ${p.text}`);
}
console.log("\nContrast:");
for (const c of contrast) console.log(`  ${c}`);
if (warnings.length) {
  console.log("\nWarnings:");
  for (const w of warnings) console.log(`  ! ${w}`);
}
if (production && placeholders.length) errors.push(`${placeholders.length} placeholders remain — replace them before launch.`);
if (errors.length) {
  console.error("\nErrors:");
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log(`\nContent check passed${production ? "" : " (development mode — placeholders allowed)"}.`);
