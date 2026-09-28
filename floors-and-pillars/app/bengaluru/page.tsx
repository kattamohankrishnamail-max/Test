import { ClosingCta, MarketIndex } from "@/components/home/Sections";
import PageHead from "@/components/ui/PageHead";
import { Container } from "@/components/ui/Section";
import { bengaluruPage as copy } from "@/content/pages/other";
import { getGuides, getMarkets } from "@/lib/content/load";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ ...copy.meta, path: "/bengaluru" });

export default async function BengaluruPage() {
  const guides = await getGuides();
  return (
    <>
      <PageHead label="Bengaluru" title={copy.title} lede={copy.intro} />
      <Container className="pb-20">
        <section aria-labelledby="markets-title">
          <h2 id="markets-title" className="sr-only">
            {copy.indexTitle}
          </h2>
          <MarketIndex markets={getMarkets()} guideSlugs={guides.map((g) => g.meta.slug)} />
        </section>
      </Container>
      <ClosingCta location="bengaluru_hub" />
    </>
  );
}
