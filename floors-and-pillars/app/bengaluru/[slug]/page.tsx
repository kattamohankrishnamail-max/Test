import { notFound } from "next/navigation";
import { ClosingCta } from "@/components/home/Sections";
import HomeCard from "@/components/homes/HomeCard";
import ContentImage from "@/components/ui/ContentImage";
import { Container } from "@/components/ui/Section";
import { bengaluruPage as copy } from "@/content/pages/other";
import { getGuide, getGuides, getHomes, getMarkets } from "@/lib/content/load";
import { Mdx } from "@/lib/content/mdx";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getGuides()).map((g) => ({ slug: g.meta.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const g = await getGuide((await params).slug);
  return g ? pageMetadata({ title: `${g.meta.name} — a guide`, description: g.meta.dek, path: `/bengaluru/${g.meta.slug}` }) : {};
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 text-ink-soft">
      {items.map((x) => (
        <li key={x} className="flex gap-3">
          <span aria-hidden className="mt-[0.8em] h-px w-4 shrink-0 bg-bronze" />
          {x}
        </li>
      ))}
    </ul>
  );
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const guide = await getGuide((await params).slug);
  if (!guide) notFound();
  const g = guide.meta;
  const G = copy.guide;
  const homes = (await getHomes()).filter((h) => h.meta.microMarket === g.slug);
  const market = getMarkets().find((m) => m.slug === g.slug);

  const block = (id: string, title: string, content: React.ReactNode) => (
    <section aria-labelledby={id} className="grid gap-6 border-t border-line py-12 lg:grid-cols-[1fr_2.2fr] lg:gap-16">
      <h2 id={id} className="display-md">
        {title}
      </h2>
      <div className="measure">{content}</div>
    </section>
  );

  return (
    <>
      <Container className="py-16 sm:py-24">
        <p className="eyebrow">Bengaluru · {market?.zone ?? "Guide"}</p>
        <h1 className="display-xl mt-5">{g.name}</h1>
        <p className="lede mt-6">{g.dek}</p>
        {g.image && (
          <div className="mt-12">
            <ContentImage image={g.image} ratio="21/9" sizes="100vw" priority />
          </div>
        )}
        <div className="mt-12">
          <Mdx source={guide.body} />
        </div>
        <div className="mt-12">
          {block("suits", G.whoItSuits, <List items={g.whoItSuits} />)}
          {block("character", G.character, <p className="text-ink-soft">{g.character}</p>)}
          {g.priceBands.length > 0 &&
            block(
              "bands",
              G.priceBands,
              <dl>
                {g.priceBands.map((b) => (
                  <div key={b.configuration} className="flex justify-between gap-6 border-b border-line py-3">
                    <dt className="text-stone">{b.configuration}</dt>
                    <dd className="text-right text-ink">{b.band}</dd>
                  </div>
                ))}
              </dl>,
            )}
          {g.notableDevelopments.length > 0 && block("notable", G.notable, <List items={g.notableDevelopments} />)}
          {g.infrastructure.length > 0 && block("infra", G.infrastructure, <List items={g.infrastructure} />)}
          {g.drawbacks.length > 0 &&
            block(
              "drawbacks",
              G.drawbacks,
              <div className="border-l-2 border-verdigris bg-white px-6 py-5">
                <List items={g.drawbacks} />
              </div>,
            )}
        </div>
        <section aria-labelledby="watching" className="border-t border-line py-12">
          <h2 id="watching" className="display-md">
            {G.homes}
          </h2>
          {homes.length ? (
            <ul className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {homes.map((h) => (
                <li key={h.meta.slug}>
                  <HomeCard home={h.meta} market={g.name} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-ink-soft">{G.noHomes}</p>
          )}
        </section>
      </Container>
      <ClosingCta title={G.cta} cta="Share your brief" href={`/brief?areas=${g.slug}`} location="guide_end" />
    </>
  );
}
