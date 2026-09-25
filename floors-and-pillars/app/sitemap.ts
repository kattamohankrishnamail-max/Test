import type { MetadataRoute } from "next";
import { getArticles, getGuides, getHomes } from "@/lib/content/load";
import { absoluteUrl } from "@/lib/seo";

/** Published content only — drafts are excluded by the loaders in production. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [homes, guides, articles] = await Promise.all([getHomes(), getGuides(), getArticles()]);
  const staticPaths = ["/", "/brief", "/homes", "/advisory", "/bengaluru", "/journal", "/about", "/contact", "/privacy", "/terms"];
  return [
    ...staticPaths.map((p) => ({ url: absoluteUrl(p), changeFrequency: "monthly" as const, priority: p === "/" ? 1 : p === "/brief" ? 0.9 : 0.6 })),
    ...homes.map((h) => ({ url: absoluteUrl(`/homes/${h.meta.slug}`), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...guides.map((g) => ({ url: absoluteUrl(`/bengaluru/${g.meta.slug}`), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...articles.map((a) => ({ url: absoluteUrl(`/journal/${a.meta.slug}`), lastModified: a.meta.date, changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
