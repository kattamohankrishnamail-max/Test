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
  return g ? pageMetadata({ title: `${g.meta.name}: a guide`, description: g.meta.dek, path: `/bengaluru/${g.meta.slug}` }) : {};
}

function List({ items }: { items: string[] }) {
  return (
    <ol className="border-t border-line text-ink">
      {items.map((x, i) => (
        <li key={x} className="grid grid-cols-[2.5rem_1fr] border-b border-line py-3">
          <span className="numeral">{String(i + 1).padStart(2, "0")}</span>
          {x}
        </li>
      ))}
    </ol>
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
    <section aria-labelledby={id} className="grid grid-cols-12 gap-x-6 gap-y-6 border-t border-ink py-10">
      <h2 id={id} className="display-md col-span-12 lg:col-span-4">
        {title}
      </h2>
      <div className="measure col-span-12 lg:col-span-8">{content}</div>
    </section>
  );

  return (
    <>
      <Container className="pb-16 pt-10 sm:pt-14">
        <p className="label">Bengaluru · {market?.zone ?? "Guide"}</p>
        <h1 className="display-xl mt-6">{g.name}</h1>
        <div className="mt-10 grid grid-cols-12 gap-x-6 border-t border-ink pt-6">
          <p className="lede col-span-12 md:col-span-8 lg:col-span-6">{g.dek}</p>
        </div>
        {g.image && (
          <figure className="mt-10">
            <ContentImage image={g.image} ratio="21/9" sizes="100vw" priority figure="Fig. 1" className="max-sm:!aspect-[4/3]" />
          </figure>
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
              <div className="bg-ink px-6 py-5 text-limestone [&_li]:border-limestone/25 [&_ol]:border-limestone/40 [&_.numeral]:text-limestone/60 [&_ol]:text-limestone">
                <List items={g.drawbacks} />
              </div>,
            )}
        </div>
        <section aria-labelledby="watching" className="border-t border-ink py-10">
          <h2 id="watching" className="display-md">
            {G.homes}
          </h2>
          {homes.length ? (
            <ol className="mt-8 border-b border-ink">
              {homes.map((h, i) => (
                <li key={h.meta.slug}>
                  <HomeCard home={h.meta} market={g.name} index={i} />
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 text-ink-soft">{G.noHomes}</p>
          )}
        </section>
      </Container>
      <ClosingCta title={G.cta} cta="Share your brief" href={`/brief?areas=${g.slug}`} location="guide_end" />
    </>
  );
}
