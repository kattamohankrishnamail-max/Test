import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { z } from "zod";
import markets from "@/content/markets.json";
import {
  AdvisorSchema,
  ArticleSchema,
  GuideSchema,
  HomeSchema,
  MarketSchema,
  type Advisor,
  type ArticleMeta,
  type GuideMeta,
  type HomeMeta,
  type Market,
} from "./schemas";

/**
 * File-based content. Everything is read at build time (static generation) and validated
 * with Zod — invalid content fails the build with the file name and field.
 * Swap these functions for CMS fetchers later; pages only depend on the return types.
 */

const ROOT = path.join(process.cwd(), "content");

/** Drafts show in development (or with SHOW_DRAFTS=1) and never in production builds. */
export const showDrafts = () => process.env.NODE_ENV !== "production" || process.env.SHOW_DRAFTS === "1";

export interface Doc<T> {
  meta: T;
  body: string;
  file: string;
}

async function readDir<T>(dir: string, schema: z.ZodType<T>, ext = ".mdx"): Promise<Doc<T>[]> {
  const folder = path.join(ROOT, dir);
  const files = (await fs.readdir(folder)).filter((f) => f.endsWith(ext)).sort();
  return Promise.all(
    files.map(async (f) => {
      const file = path.join(folder, f);
      const raw = await fs.readFile(file, "utf8");
      const { data, content } = ext === ".json" ? { data: JSON.parse(raw), content: "" } : matter(raw);
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        throw new Error(`Invalid content in content/${dir}/${f}:\n${z.prettifyError(parsed.error)}`);
      }
      return { meta: parsed.data, body: content, file: `content/${dir}/${f}` };
    }),
  );
}

const published = <T extends { draft?: boolean }>(docs: Doc<T>[]) => docs.filter((d) => showDrafts() || !d.meta.draft);

export const getMarkets = cache((): Market[] => z.array(MarketSchema).parse(markets));

export const getHomes = cache(async () => {
  const docs = await readDir("homes", HomeSchema);
  const slugs = new Set(getMarkets().map((m) => m.slug));
  for (const d of docs) {
    if (!slugs.has(d.meta.microMarket)) throw new Error(`${d.file}: unknown microMarket "${d.meta.microMarket}"`);
  }
  const list = published(docs);
  if (list.length > 12) throw new Error("The collection is capped at 12 homes — mark some as draft.");
  return list;
});

export async function getHome(slug: string) {
  return (await getHomes()).find((h) => h.meta.slug === slug) ?? null;
}

export const getGuides = cache(async () => published(await readDir("bengaluru", GuideSchema)));
/** All guides including drafts — used only for names in the brief's area list. */
export const getAllGuides = cache(async () => readDir("bengaluru", GuideSchema));

export async function getGuide(slug: string) {
  return (await getGuides()).find((g) => g.meta.slug === slug) ?? null;
}

export const getArticles = cache(async () =>
  published(await readDir("journal", ArticleSchema)).sort((a, b) => b.meta.date.localeCompare(a.meta.date)),
);

export async function getArticle(slug: string) {
  return (await getArticles()).find((a) => a.meta.slug === slug) ?? null;
}

export const getAdvisors = cache(async (): Promise<Advisor[]> =>
  (await readDir("advisors", AdvisorSchema, ".json")).map((d) => d.meta).sort((a, b) => a.order - b.order),
);

export async function getAdvisor(slug: string) {
  return (await getAdvisors()).find((a) => a.slug === slug) ?? null;
}

export function marketName(slug: string) {
  return getMarkets().find((m) => m.slug === slug)?.name ?? slug;
}

export function readingMinutes(body: string) {
  return Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 220));
}

/** Splits an MDX body into sections keyed by their "## Heading". */
export function sections(body: string): Record<string, string> {
  const out: Record<string, string> = {};
  const parts = body.split(/^##\s+/m);
  if (parts[0].trim()) out._intro = parts[0].trim();
  for (const part of parts.slice(1)) {
    const nl = part.indexOf("\n");
    const title = (nl === -1 ? part : part.slice(0, nl)).trim();
    out[title] = nl === -1 ? "" : part.slice(nl + 1).trim();
  }
  return out;
}

export type { Advisor, ArticleMeta, GuideMeta, HomeMeta, Market };
