/** Writes standalone/.generated/data.json: the content the demo's interactive parts need. */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { HomeSchema, MarketSchema } from "../lib/content/schemas.ts";

const root = path.resolve(import.meta.dirname, "..");
const homesDir = path.join(root, "content/homes");
const homes = readdirSync(homesDir)
  .filter((f) => f.endsWith(".mdx"))
  .sort()
  .map((f) => HomeSchema.parse(matter(readFileSync(path.join(homesDir, f), "utf8")).data))
  .filter((h) => !h.draft);
const markets = z.array(MarketSchema).parse(JSON.parse(readFileSync(path.join(root, "content/markets.json"), "utf8")));
mkdirSync(path.join(root, "standalone/.generated"), { recursive: true });
writeFileSync(path.join(root, "standalone/.generated/data.json"), JSON.stringify({ homes, markets }));
console.log(`standalone data: ${homes.length} homes, ${markets.length} markets`);
