import { ClosingCta } from "@/components/home/Sections";
import HomesGrid from "@/components/homes/HomesGrid";
import PageHead from "@/components/ui/PageHead";
import { Container } from "@/components/ui/Section";
import { homesPage as copy } from "@/content/pages/homes";
import { getHomes, getMarkets } from "@/lib/content/load";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ ...copy.meta, path: "/homes" });

export default async function HomesPage() {
  const homes = await getHomes();
  const marketNames = Object.fromEntries(getMarkets().map((m) => [m.slug, m.name]));
  return (
    <>
      <PageHead label="The collection" title={copy.title} lede={copy.intro} />
      <Container className="pb-20" data-island="homes">
        <HomesGrid homes={homes.map((h) => h.meta)} marketNames={marketNames} />
      </Container>
      <ClosingCta title={copy.endCta.title} cta={copy.endCta.label} location="homes_end" />
    </>
  );
}
