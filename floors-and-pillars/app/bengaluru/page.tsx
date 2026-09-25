import { MarketIndex } from "@/components/home/Sections";
import { ClosingCta } from "@/components/home/Sections";
import { Container } from "@/components/ui/Section";
import { bengaluruPage as copy } from "@/content/pages/other";
import { getGuides, getMarkets } from "@/lib/content/load";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ ...copy.meta, path: "/bengaluru" });

export default async function BengaluruPage() {
  const guides = await getGuides();
  return (
    <>
      <Container className="grid gap-14 py-16 sm:py-24 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <div>
          <p className="eyebrow">Bengaluru</p>
          <h1 className="display-xl mt-5">{copy.title}</h1>
          <p className="lede mt-6">{copy.intro}</p>
        </div>
        <section aria-labelledby="markets-title">
          <h2 id="markets-title" className="eyebrow mb-4">
            {copy.indexTitle}
          </h2>
          <MarketIndex markets={getMarkets()} guideSlugs={guides.map((g) => g.meta.slug)} />
        </section>
      </Container>
      <ClosingCta location="bengaluru_hub" />
    </>
  );
}
