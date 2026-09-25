import {
  BengaluruUnderstood,
  ClosingCta,
  FeaturedHomes,
  Hero,
  HowWeAdvise,
  JournalTeaser,
  Philosophy,
  Teaser,
  TrustStrip,
  WhatYouReceive,
} from "@/components/home/Sections";
import { home } from "@/content/pages/home";
import { getAdvisors, getArticles, getGuides, getHomes, getMarkets } from "@/lib/content/load";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ ...home.meta, path: "/" });

export default async function HomePage() {
  const [homes, guides, articles, advisors] = await Promise.all([getHomes(), getGuides(), getArticles(), getAdvisors()]);
  const markets = getMarkets();
  const marketNames = Object.fromEntries(markets.map((m) => [m.slug, m.name]));
  const featured = homes.filter((h) => h.meta.featured).slice(0, 3);
  return (
    <>
      <Hero />
      <Teaser />
      <Philosophy />
      <HowWeAdvise />
      <FeaturedHomes homes={(featured.length ? featured : homes.slice(0, 3)).map((h) => h.meta)} marketNames={marketNames} />
      <WhatYouReceive />
      <BengaluruUnderstood markets={markets} guideSlugs={guides.map((g) => g.meta.slug)} />
      <JournalTeaser articles={articles.slice(0, 3).map((a) => a.meta)} />
      <TrustStrip advisors={advisors} />
      <ClosingCta />
    </>
  );
}
