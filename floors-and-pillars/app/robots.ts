import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/desk", "/api/", "/brief/thank-you"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
