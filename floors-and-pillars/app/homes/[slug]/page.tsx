import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import HomeCard from "@/components/homes/HomeCard";
import TrackView from "@/components/homes/TrackView";
import ButtonLink from "@/components/ui/ButtonLink";
import ContentImage from "@/components/ui/ContentImage";
import { Container, Rule } from "@/components/ui/Section";
import { homeDetail as copy } from "@/content/pages/homes";
import { getHome, getHomes, getMarkets, marketName, sections } from "@/lib/content/load";
import { priceFrom, sizeRange, typeLabel } from "@/lib/content/format";
import { Mdx } from "@/lib/content/mdx";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getHomes()).map((h) => ({ slug: h.meta.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const home = await getHome((await params).slug);
  if (!home) return {};
  return pageMetadata({ title: home.meta.name, description: home.meta.summary, path: `/homes/${home.meta.slug}` });
}

function Block({ id, title, children, className = "" }: { id: string; title: string; children: ReactNode; className?: string }) {
  return (
    <section aria-labelledby={id} className={`grid gap-8 border-t border-line py-14 lg:grid-cols-[1fr_2.2fr] lg:gap-16 ${className}`}>
      <h2 id={id} className="display-md">
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}

const TBC = () => <p className="italic text-stone">{copy.notSpecified}</p>;

export default async function HomeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const home = await getHome((await params).slug);
  if (!home) notFound();
  const h = home.meta;
  const body = sections(home.body);
  const s = copy.sections;
  const markets = getMarkets();
  const names = Object.fromEntries(markets.map((m) => [m.slug, m.name]));
  const similar = (await getHomes()).filter((x) => h.similar.includes(x.meta.slug)).slice(0, 3);
  const glance: [string, string | null][] = [
    [copy.glance.configuration, h.configurations.join(", ")],
    [copy.glance.size, sizeRange(h)],
    [copy.glance.price, priceFrom(h)],
    [copy.glance.possession, h.possession],
    [copy.glance.developer, h.developer],
    [copy.glance.rera, h.reraId ?? null],
  ];

  return (
    <article>
      <TrackView event="home_view" props={{ slug: h.slug }} />
      <Container className="pt-14 sm:pt-20">
        <p className="eyebrow">
          {marketName(h.microMarket)} · {typeLabel(h.type)}
        </p>
        <h1 className="display-xl mt-5 max-w-4xl">{h.name}</h1>
        <p className="lede mt-6">{h.summary}</p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <ButtonLink href={`/brief?home=${h.slug}`} event="advisor_cta_click" eventProps={{ location: "home_detail_top", home: h.slug }}>
            {copy.cta}
          </ButtonLink>
        </div>
      </Container>

      <Container className="mt-14">
        <ContentImage image={h.images[0]} ratio="16/9" sizes="100vw" priority />
        {h.images[0].caption && <p className="mt-3 text-[0.88rem] text-stone">{h.images[0].caption}</p>}
      </Container>

      <Container className="py-10">
        <Block id="residence" title={s.residence}>
          {body[s.residence] ? <Mdx source={body[s.residence]} /> : <TBC />}
        </Block>

        <Block id="glance" title={s.glance}>
          <dl className="grid gap-x-10 sm:grid-cols-2">
            {glance.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 border-b border-line py-4">
                <dt className="text-stone">{k}</dt>
                <dd className={`text-right ${v ? "text-ink" : "italic text-stone"}`}>{v ?? copy.notSpecified}</dd>
              </div>
            ))}
          </dl>
        </Block>

        <Block id="stands-out" title={s.standsOut}>
          {body[s.standsOut] && <Mdx source={body[s.standsOut]} />}
          <ul className="mt-6 space-y-3 text-ink-soft">
            {h.whyWeLikeIt.map((w) => (
              <li key={w} className="flex gap-3">
                <span aria-hidden className="mt-[0.8em] h-px w-4 shrink-0 bg-bronze" />
                {w}
              </li>
            ))}
          </ul>
        </Block>

        <Block id="lifestyle" title={s.lifestyle}>
          {body[s.lifestyle] ? <Mdx source={body[s.lifestyle]} /> : <TBC />}
        </Block>

        <Block id="location" title={s.location}>
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="text-[0.95rem] font-medium text-ink">{copy.location.commute}</h3>
              {h.commute.length ? (
                <table className="mt-3 w-full text-left text-[0.95rem]">
                  <caption className="sr-only">{copy.location.commute}</caption>
                  <tbody>
                    {h.commute.map((c) => (
                      <tr key={c.to} className="border-b border-line">
                        <th scope="row" className="py-3 pr-4 font-normal text-ink-soft">
                          {c.to}
                        </th>
                        <td className="py-3 text-right text-ink">{c.peakTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <TBC />
              )}
            </div>
            <div className="space-y-8">
              {(
                [
                  [copy.location.schools, h.schools],
                  [copy.location.hospitals, h.hospitals],
                ] as const
              ).map(([label, list]) => (
                <div key={label}>
                  <h3 className="text-[0.95rem] font-medium text-ink">{label}</h3>
                  {list.length ? (
                    <ul className="mt-3 space-y-1 text-ink-soft">
                      {list.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  ) : (
                    <TBC />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Block>

        <Block id="developer" title={s.developer}>
          <p className="font-medium text-ink">{h.developer}</p>
          {h.developerTrackRecord ? <p className="measure mt-3 text-ink-soft">{h.developerTrackRecord}</p> : <TBC />}
        </Block>

        <Block id="numbers" title={s.numbers}>
          {h.numbers ? (
            <dl className="grid gap-6 sm:grid-cols-3">
              {(
                [
                  [copy.numbers.psf, h.numbers.psfBand],
                  [copy.numbers.market, h.numbers.marketPsfRange],
                  [copy.numbers.maintenance, h.numbers.maintenance],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="border-t border-bronze/60 pt-4">
                  <dt className="eyebrow">{k}</dt>
                  <dd className="mt-2 text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <TBC />
          )}
        </Block>

        <section aria-labelledby="weigh" className="my-6 border-l-2 border-verdigris bg-white px-6 py-10 sm:px-12">
          <p className="eyebrow !text-verdigris">Our honest view</p>
          <h2 id="weigh" className="display-md mt-3">
            {s.weigh}
          </h2>
          <p className="measure mt-3 text-ink-soft">{copy.weighIntro}</p>
          <ul className="mt-8 space-y-4">
            {h.whatToWeigh.map((w) => (
              <li key={w} className="flex gap-4 text-ink">
                <span aria-hidden className="mt-[0.35em] font-serif text-xl leading-none text-verdigris">
                  —
                </span>
                {w}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-ink-soft">
            <span className="font-medium text-ink">Consider it if </span>
            {h.considerIf}
          </p>
        </section>

        {similar.length > 0 && (
          <section aria-labelledby="similar" className="border-t border-line py-16">
            <h2 id="similar" className="display-md">
              {s.similar}
            </h2>
            <ul className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {similar.map((x) => (
                <li key={x.meta.slug}>
                  <HomeCard home={x.meta} market={names[x.meta.microMarket]} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <Rule />
        <div className="flex flex-col items-start gap-6 py-16 sm:flex-row sm:items-center sm:justify-between">
          <p className="display-md max-w-xl">{copy.cta}.</p>
          <ButtonLink href={`/brief?home=${h.slug}`} event="advisor_cta_click" eventProps={{ location: "home_detail_end", home: h.slug }}>
            {copy.cta}
          </ButtonLink>
        </div>
        <p className="pb-16 text-[0.88rem] text-stone">{copy.note}</p>
      </Container>
    </article>
  );
}
