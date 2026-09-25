import { ClosingCta } from "@/components/home/Sections";
import HomesGrid from "@/components/homes/HomesGrid";
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
      <Container className="py-16 sm:py-24">
        <p className="eyebrow">The collection</p>
        <h1 className="display-xl mt-5 max-w-3xl">{copy.title}</h1>
        <p className="lede mt-6">{copy.intro}</p>
        <div className="mt-14">
          <HomesGrid homes={homes.map((h) => h.meta)} marketNames={marketNames} />
        </div>
      </Container>
      <ClosingCta title={copy.endCta.title} cta={copy.endCta.label} location="homes_end" />
    </>
  );
}
