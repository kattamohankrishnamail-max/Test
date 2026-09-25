import type { Metadata } from "next";
import { isPlaceholder, site } from "@/site.config";

export function absoluteUrl(path = "/") {
  return new URL(path, site.url).toString();
}

/** Per-page metadata with canonical URL and Open Graph. */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  noindex?: boolean;
}): Metadata {
  const fullTitle = path === "/" ? `${site.name} — ${title}` : `${title} · ${site.name}`;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: { title: fullTitle, description, url: absoluteUrl(path), siteName: site.name, type, locale: "en_IN" },
    twitter: { card: "summary", title: fullTitle, description },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}

/** Drops keys whose values are still placeholders, so structured data never publishes them. */
function real<T extends Record<string, unknown>>(o: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(o).filter(([, v]) => v !== undefined && !(typeof v === "string" && isPlaceholder(v))),
  ) as Partial<T>;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["RealEstateAgent", "Organization"],
    name: site.name,
    description: site.description,
    url: site.url,
    areaServed: { "@type": "City", name: "Bengaluru" },
    ...real({ telephone: site.contact.phone, email: site.contact.email }),
    ...(isPlaceholder(site.contact.address)
      ? {}
      : { address: { "@type": "PostalAddress", streetAddress: site.contact.address, addressLocality: "Bengaluru", addressCountry: "IN" } }),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items
      .filter((i) => !isPlaceholder(i.a))
      .map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
}

export function articleJsonLd(a: { title: string; dek: string; date: string; author: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.dek,
    datePublished: a.date,
    url: absoluteUrl(a.path),
    publisher: { "@type": "Organization", name: site.name },
    ...(isPlaceholder(a.author) ? {} : { author: { "@type": "Person", name: a.author } }),
  };
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
