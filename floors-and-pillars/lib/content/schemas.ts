import { z } from "zod";

const placeholderOr = z.string().min(1);

export const ImageSchema = z.object({
  /** A path under /public, or "placeholder:<description>" to render a neutral block. */
  src: z.string().min(1),
  alt: z.string().min(3, "Every image needs meaningful alt text"),
  caption: z.string().optional(),
});
export type Image = z.infer<typeof ImageSchema>;

export const PRICE_BANDS = ["3-5", "5-7.5", "7.5-10", "10+"] as const;

export const HomeSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: placeholderOr,
  type: z.enum(["apartment", "villa"]),
  microMarket: z.string(), // slug in content/markets.json
  developer: placeholderOr,
  configurations: z.array(z.string()).min(1),
  sizeRangeSqft: z.tuple([z.number().positive(), z.number().positive()]).optional(),
  priceFromCr: z.number().positive().optional(),
  priceBand: z.enum(PRICE_BANDS),
  possession: placeholderOr,
  reraId: z.string().optional(),
  summary: placeholderOr,
  whyWeLikeIt: z.array(z.string()).min(1).max(4),
  considerIf: placeholderOr,
  whatToWeigh: z.array(z.string()).min(1),
  similar: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  images: z.array(ImageSchema).min(1),
  // Structured detail sections (§5.4). All optional so a home can be published progressively.
  commute: z.array(z.object({ to: z.string(), peakTime: z.string() })).default([]),
  schools: z.array(z.string()).default([]),
  hospitals: z.array(z.string()).default([]),
  developerTrackRecord: z.string().optional(),
  numbers: z
    .object({ psfBand: z.string(), marketPsfRange: z.string(), maintenance: z.string() })
    .optional(),
  /** Short notes used by the matching engine, e.g. "low-density", "large-format". */
  tags: z.array(z.string()).default([]),
});
export type HomeMeta = z.infer<typeof HomeSchema>;

export const MarketSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  zone: z.string(),
  summary: z.string(),
});
export type Market = z.infer<typeof MarketSchema>;

export const GuideSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  dek: z.string(),
  whoItSuits: z.array(z.string()).min(1),
  character: z.string(),
  priceBands: z.array(z.object({ configuration: z.string(), band: z.string() })).default([]),
  notableDevelopments: z.array(z.string()).default([]),
  infrastructure: z.array(z.string()).default([]),
  drawbacks: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  image: ImageSchema.optional(),
});
export type GuideMeta = z.infer<typeof GuideSchema>;

export const ArticleSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  dek: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  author: z.string(), // advisor slug
  related: z.object({ homes: z.array(z.string()).default([]), guides: z.array(z.string()).default([]) }).default({ homes: [], guides: [] }),
  draft: z.boolean().default(false),
});
export type ArticleMeta = z.infer<typeof ArticleSchema>;

export const AdvisorSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  role: z.string(),
  bio: z.string(),
  photo: ImageSchema,
  order: z.number().default(0),
});
export type Advisor = z.infer<typeof AdvisorSchema>;
