import assert from "node:assert/strict";
import { test } from "node:test";
import { extractBudget, extractRequirements } from "../lib/extract.ts";
import { matchProperties } from "../lib/match.ts";
import { normaliseWorkbook, parseConfiguration, parsePossession } from "../lib/normalize.ts";

// Synthetic sheet with a title block and non-standard headers, to exercise detection + mapping.
const sheet = {
  name: "Inventory",
  rows: [
    ["Demo inventory"],
    [],
    ["Property Name", "Builder", "Type", "Region", "Locality", "BHK", "Size (sq ft)", "Price min (₹ Cr)", "Price max (₹ Cr)", "Completion", "Status", "Availability", "Notes"],
    ["Alpha Towers", "Dev A", "Apartment", "East", "Whitefield", "3 & 4 BHK", "2,400–3,600", "4.2", "6.1", "Dec 2027", "Core", "", "Lake-facing towers with a 40,000 sq ft clubhouse."],
    ["Beta Villas", "Dev B", "Villa", "North", "Devanahalli", "4 & 5 BHK villas", "4,500–6,000", "9", "14", "Ready", "Core", "", "Gated villa enclave near the airport."],
    ["Gamma Heights", "Dev C", "Apartment", "South", "Kanakapura Road", "3 BHK", "1,900–2,100", "3.1", "3.6", "Jun 2030", "Core", "", ""],
    ["Delta Sold", "Dev D", "Apartment", "East", "Whitefield", "4 BHK", "3,000", "5", "5.5", "Dec 2028", "Core", "Sold out", ""],
    ["Epsilon Hidden", "Dev E", "Apartment", "East", "Whitefield", "4 BHK", "3,000", "5", "5.5", "Dec 2028", "Excluded", "", ""],
  ],
};
const NOW = new Date("2026-09-24");
const ds = normaliseWorkbook([{ name: "Read Me", rows: [["About"], ["x"]] }, sheet], "demo.xlsx", NOW);

test("detects header row and maps loose column names", () => {
  assert.equal(ds.meta.mapping.sheetName, "Inventory");
  assert.equal(ds.properties.length, 5);
  const a = ds.properties[0];
  assert.equal(a.projectName, "Alpha Towers");
  assert.equal(a.developer, "Dev A");
  assert.deepEqual(a.bedroomOptions, [3, 4]);
  assert.equal(a.areaMax, 3600);
  assert.equal(a.priceMinCr, 4.2);
  assert.deepEqual(ds.properties[1].typeGroups, ["villa"]);
  assert.equal(ds.properties[1].isReady, true);
});

test("parses configuration and possession formats", () => {
  assert.deepEqual(parseConfiguration("3–5 BHK + penthouses").options, [3, 4, 5]);
  assert.equal(parseConfiguration("3–5 BHK + penthouses").penthouse, true);
  assert.deepEqual(parseConfiguration("4, 4.5 & 5 BHK (G+2)").options, [4, 4.5, 5]);
  assert.equal(parsePossession("2030–32", NOW).month, 2032 * 12 + 11);
  assert.equal(parsePossession("Delivered Nov-2025", NOW).ready, true);
});

test("extracts the spec's example brief", () => {
  const r = extractRequirements(
    "I'm looking for a 4 BHK apartment around ₹5 crore in East Bengaluru, preferably something spacious and low density, for my family.",
  );
  assert.equal(r.propertyType, "apartment");
  assert.deepEqual(r.bedrooms, [4]);
  assert.equal(r.budgetMaxCr, 5);
  assert.deepEqual(r.locations, ["East Bengaluru"]);
  assert.ok(r.lifestyle.includes("large-homes") && r.lifestyle.includes("low-density"));
  assert.ok(r.notes.includes("family"));
});

test("reads budget ranges and lakh units", () => {
  assert.deepEqual(extractBudget("between 5 and 8 crore"), { min: 5, max: 8 });
  assert.deepEqual(extractBudget("₹10-15 Cr"), { min: 10, max: 15 });
  assert.deepEqual(extractBudget("under 450 lakh"), { min: null, max: 4.5 });
  assert.deepEqual(extractBudget("a 4 BHK"), { min: null, max: null });
});

test("ranks by fit and hides sold-out / excluded homes", () => {
  const r = extractRequirements("4 BHK apartment in Whitefield around 6 crore, green");
  const out = matchProperties(ds.properties, r, NOW);
  const ids = [...out.exact, ...out.alternatives].map((m) => m.property.projectName);
  assert.equal(ids[0], "Alpha Towers");
  assert.ok(!ids.includes("Delta Sold") && !ids.includes("Epsilon Hidden"));
  assert.ok(out.exact[0].reasons.some((x) => /4 BHK/.test(x)));
});

test("no exact match falls back to explained alternatives", () => {
  const r = extractRequirements("6 BHK villa in Koramangala under 3 crore, ready to move");
  const out = matchProperties(ds.properties, r, NOW);
  assert.equal(out.exact.length, 0);
  assert.ok(out.alternatives.length > 0);
  assert.match(out.summary, /couldn't find an exact match/);
  assert.ok(out.explanation);
});
