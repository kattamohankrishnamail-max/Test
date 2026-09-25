import assert from "node:assert/strict";
import { test } from "node:test";
import { isBot } from "@/lib/brief/honeypot";
import { draftFromParams, draftFromText } from "@/lib/brief/prefill";
import { rateLimit } from "@/lib/brief/rate-limit";
import { BriefSchema, StepHome, StepPriorities, formDataToInput, normalisePhone } from "@/lib/brief/schema";
import { briefToRequirements, homeToProperty } from "@/lib/engine/adapters";
import { scoreProperty } from "@/lib/engine/match";
import type { HomeMeta, Market } from "@/lib/content/schemas";

const markets: Market[] = [
  { slug: "whitefield", name: "Whitefield", zone: "East", summary: "" },
  { slug: "north-bengaluru", name: "North Bengaluru & Devanahalli", zone: "North", summary: "" },
  { slug: "central-bengaluru", name: "Central Bengaluru", zone: "Central", summary: "" },
];

const valid = {
  propertyType: "apartment",
  configurations: ["4"],
  minSizeSqft: "",
  possession: "12m",
  budget: "5-7.5",
  areas: ["whitefield"],
  priorities: ["space", "greenery"],
  notes: "",
  name: "Asha Rao",
  phone: "98450 12345",
  email: "asha@example.com",
  basedIn: "bengaluru",
  contactPref: "call",
  consent: true,
};

test("phone numbers: Indian without prefix and international with + are accepted", () => {
  assert.equal(normalisePhone("98450 12345"), "+919845012345");
  assert.equal(normalisePhone("+44 7911 123456"), "+447911123456");
  assert.equal(normalisePhone("12345"), null);
});

test("brief schema accepts a complete brief and rejects missing consent", () => {
  assert.ok(BriefSchema.safeParse(valid).success);
  const r = BriefSchema.safeParse({ ...valid, consent: undefined });
  assert.ok(!r.success);
});

test("priorities are capped at three", () => {
  const r = StepPriorities.safeParse({ priorities: ["space", "design", "privacy", "schools"] });
  assert.ok(!r.success);
});

test("optional size accepts blank and rejects implausible values", () => {
  assert.equal(StepHome.parse({ ...valid, minSizeSqft: "" }).minSizeSqft, null);
  assert.ok(!StepHome.safeParse({ ...valid, minSizeSqft: "50" }).success);
});

test("native form posts map to the schema shape", () => {
  const fd = new URLSearchParams();
  for (const [k, v] of Object.entries(valid)) {
    if (Array.isArray(v)) v.forEach((x) => fd.append(k, x));
    else fd.set(k, String(v === true ? "on" : v));
  }
  assert.ok(BriefSchema.safeParse(formDataToInput(fd)).success);
});

test("honeypot and rate limit", () => {
  assert.equal(isBot(""), false);
  assert.equal(isBot("http://spam"), true);
  const t = Date.now();
  for (let i = 0; i < 5; i++) assert.ok(rateLimit("test-ip", t + i).ok);
  assert.equal(rateLimit("test-ip", t + 10).ok, false);
  assert.ok(rateLimit("test-ip", t + 11 * 60 * 1000).ok);
});

test("query-param prefill only keeps known values", () => {
  const d = draftFromParams({ type: "villa", budget: "10+", priorities: "privacy,space,design,schools", areas: "whitefield,nowhere", home: "Bad Slug!" }, ["whitefield"]);
  assert.equal(d.propertyType, "villa");
  assert.equal(d.budget, "10+");
  assert.deepEqual(d.priorities, ["privacy", "space", "design"]);
  assert.deepEqual(d.areas, ["whitefield"]);
  assert.equal(d.home, undefined);
});

test("free text pre-fills structured fields", () => {
  const d = draftFromText("A 5 BHK villa in North Bengaluru, ready to move, quiet and green, around 9 crore", markets);
  assert.equal(d.propertyType, "villa");
  assert.deepEqual(d.configurations, ["5+"]);
  assert.equal(d.possession, "ready");
  assert.equal(d.budget, "7.5-10");
  assert.ok(d.areas?.includes("north-bengaluru"));
  assert.ok(d.priorities?.includes("greenery"));
});

test("thank-you matching ranks the fitting home first", () => {
  const base: HomeMeta = {
    slug: "a",
    name: "Home A",
    type: "apartment",
    microMarket: "whitefield",
    developer: "Dev",
    configurations: ["3 BHK", "4 BHK"],
    priceBand: "5-7.5",
    possession: "Dec 2026",
    summary: "",
    whyWeLikeIt: ["x"],
    considerIf: "",
    whatToWeigh: ["y"],
    similar: [],
    featured: false,
    draft: false,
    images: [{ src: "placeholder:x", alt: "xxx" }],
    commute: [],
    schools: [],
    hospitals: [],
    tags: ["large-format", "green"],
  };
  const villa: HomeMeta = { ...base, slug: "b", type: "villa", microMarket: "north-bengaluru", priceBand: "10+", configurations: ["5 BHK"] };
  const req = briefToRequirements({ ...valid, possession: "1-3y" }, markets);
  const now = new Date("2026-09-25");
  const a = scoreProperty(homeToProperty(base, markets[0], now), req, now);
  const b = scoreProperty(homeToProperty(villa, markets[1], now), req, now);
  assert.ok(a.score > b.score);
  assert.ok(a.score >= 75);
});
