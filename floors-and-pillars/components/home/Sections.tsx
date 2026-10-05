import Link from "next/link";
import HomeCard from "@/components/homes/HomeCard";
import ButtonLink from "@/components/ui/ButtonLink";
import ContentImage from "@/components/ui/ContentImage";
import Placeholder from "@/components/ui/Placeholder";
import { Container, Section, SheetHead } from "@/components/ui/Section";
import { home } from "@/content/pages/home";
import type { Advisor, ArticleMeta, HomeMeta, Market } from "@/lib/content/load";
import { site } from "@/site.config";
import BriefReader from "./BriefReader";

export function Hero() {
  const h = home.hero;
  return (
    <section aria-labelledby="hero-title" className="bg-oxblood text-limestone">
      <Container className="grid grid-cols-12 gap-x-6 gap-y-10 py-14 sm:py-20 lg:min-h-[78svh] lg:items-center">
        <div className="col-span-12 lg:col-span-5">
          <p className="label !text-on-dark-soft">{h.sheet}</p>
          <h1 id="hero-title" className="display-xl tagline mt-6 text-limestone">
            {h.title}
          </h1>
          <hr className="intro-1 mt-8 w-16 border-0 border-t border-bronze-light" />
          <p className="intro-1 mt-8 font-serif text-[1.65rem] font-medium leading-snug text-limestone">{h.sub}</p>
          <p className="intro-2 mt-4 max-w-[46ch] text-[1.05rem] leading-relaxed text-on-dark-soft">{h.support}</p>
          <div className="intro-3 mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
            <ButtonLink href={h.primary.href} variant="light" event="advisor_cta_click" eventProps={{ location: "hero" }}>
              {h.primary.label}
            </ButtonLink>
            <Link href={h.secondary.href} className="inline-flex min-h-11 items-center text-[0.78rem] font-medium uppercase tracking-[0.18em] text-limestone underline decoration-bronze-light underline-offset-[0.5em] hover:decoration-limestone">
              {h.secondary.label}
            </Link>
          </div>
        </div>
        <figure className="col-span-12 lg:col-span-7">
          <Placeholder label={h.image.replace(/^placeholder:/, "")} ratio="4/3" figure={h.caption} />
        </figure>
      </Container>
    </section>
  );
}

export function Reader({ markets }: { markets: Market[] }) {
  const r = home.reader;
  return (
    <Section id="reader" labelledBy="reader-title">
      <SheetHead n={r.sheet} id="reader-title" title={r.title} />
      <div className="mt-8 grid grid-cols-12 gap-x-6">
        <p className="lede col-span-12 sm:col-span-10 sm:col-start-3 lg:col-span-6 lg:col-start-3">{r.body}</p>
      </div>
      <div className="mt-12" data-island="reader">
        <BriefReader markets={markets} />
      </div>
    </Section>
  );
}

export function Philosophy() {
  const p = home.philosophy;
  return (
    <Section tone="deep" labelledBy="philosophy-title">
      <SheetHead n={p.sheet} id="philosophy-title" title={p.title} />
      <div className="mt-8 grid grid-cols-12 gap-x-6">
        <p className="lede col-span-12 sm:col-span-10 sm:col-start-3 lg:col-span-6 lg:col-start-3">{p.body}</p>
      </div>
    </Section>
  );
}

export function Method() {
  const m = home.method;
  return (
    <Section id="method" labelledBy="method-title">
      <SheetHead n={m.sheet} id="method-title" title={m.title} aside={<ButtonLink href={m.link.href} variant="text">{m.link.label}</ButtonLink>} />
      <ol className="mt-12 border-t border-ink">
        {m.steps.map((s, i) => (
          <li key={s.name} className="grid grid-cols-12 items-baseline gap-x-6 border-b border-line py-6">
            <span className="numeral col-span-2 text-[2.6rem] leading-none sm:col-span-2">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="display-sm col-span-10 sm:col-span-4 lg:col-span-3">{s.name}</h3>
            <p className="col-span-10 col-start-3 mt-1 text-ink-soft sm:col-span-6 sm:col-start-auto lg:col-span-5">{s.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function FeaturedHomes({ homes, marketNames }: { homes: HomeMeta[]; marketNames: Record<string, string> }) {
  if (!homes.length) return null;
  const c = home.homes;
  return (
    <Section id="collection" tone="paper" labelledBy="homes-title">
      <SheetHead n={c.sheet} id="homes-title" title={c.title} aside={<ButtonLink href={c.link.href} variant="text">{c.link.label}</ButtonLink>} />
      <ol className="mt-12 border-b border-ink">
        {homes.map((h, i) => (
          <li key={h.slug}>
            <HomeCard home={h} market={marketNames[h.microMarket]} index={i} />
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function WhatYouReceive() {
  const r = home.receive;
  return (
    <Section tone="ink" labelledBy="receive-title">
      <SheetHead n={r.sheet} id="receive-title" title={r.title} tone="light" />
      <table className="mt-12 w-full border-t border-bronze-light text-left">
        <thead className="sr-only">
          <tr>
            <th scope="col">{r.columns.doc}</th>
            <th scope="col">{r.columns.holds}</th>
          </tr>
        </thead>
        <tbody>
          {r.items.map((item, i) => (
            <tr key={item.name} className="border-b border-bronze/50 max-sm:flex max-sm:flex-col max-sm:py-5">
              <th scope="row" className="py-6 pr-6 align-baseline font-normal sm:w-1/2 max-sm:py-0">
                <span className="mr-5 font-serif text-[1.4rem] text-on-dark-soft">{String.fromCharCode(65 + i)}</span>
                <span className="font-serif text-[2rem] leading-tight text-limestone">{item.name}</span>
              </th>
              <td className="py-6 align-baseline text-on-dark-soft max-sm:pt-2 max-sm:pb-0">{item.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}

export function BengaluruUnderstood({ markets, guideSlugs }: { markets: Market[]; guideSlugs: string[] }) {
  const b = home.bengaluru;
  return (
    <Section id="city" labelledBy="bengaluru-title">
      <SheetHead n={b.sheet} id="bengaluru-title" title={b.title} aside={<ButtonLink href={b.link.href} variant="text">{b.link.label}</ButtonLink>} />
      <div className="mt-8 grid grid-cols-12 gap-x-6">
        <p className="lede col-span-12 sm:col-span-10 sm:col-start-3 lg:col-span-6 lg:col-start-3">{b.body}</p>
      </div>
      <div className="mt-12">
        <MarketIndex markets={markets} guideSlugs={guideSlugs} />
      </div>
    </Section>
  );
}

/** Micro-market schedule: name, zone, guide status. Markets without a published guide aren't linked. */
export function MarketIndex({ markets, guideSlugs }: { markets: Market[]; guideSlugs: string[] }) {
  return (
    <table className="w-full border-t border-ink text-left">
      <thead>
        <tr className="border-b border-ink">
          <th scope="col" className="label w-12 py-2 font-medium">No.</th>
          <th scope="col" className="label py-2 font-medium">Micro-market</th>
          <th scope="col" className="label hidden py-2 font-medium sm:table-cell">Zone</th>
          <th scope="col" className="label py-2 text-right font-medium">Guide</th>
        </tr>
      </thead>
      <tbody>
        {markets.map((m, i) => {
          const has = guideSlugs.includes(m.slug);
          return (
            <tr key={m.slug} className="border-b border-line">
              <td className="numeral py-3 align-baseline">{String(i + 1).padStart(2, "0")}</td>
              <td className="py-3 align-baseline">
                {has ? (
                  <Link href={`/bengaluru/${m.slug}`} className="inline-flex min-h-11 items-center font-serif text-[1.55rem] leading-tight text-ink underline decoration-1 underline-offset-4 hover:decoration-2">
                    {m.name}
                  </Link>
                ) : (
                  <span className="font-serif text-[1.55rem] leading-tight text-ink">{m.name}</span>
                )}
              </td>
              <td className="hidden py-3 align-baseline text-ink-soft sm:table-cell">{m.zone}</td>
              <td className="py-3 text-right align-baseline text-[0.85rem] text-stone">{has ? "Read the guide" : "In preparation"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function JournalTeaser({ articles }: { articles: ArticleMeta[] }) {
  if (!articles.length) return null;
  const j = home.journal;
  return (
    <Section tone="paper" labelledBy="journal-title">
      <SheetHead n={j.sheet} id="journal-title" title={j.title} aside={<ButtonLink href={j.link.href} variant="text">{j.link.label}</ButtonLink>} />
      <ol className="mt-12 border-t border-ink">
        {articles.map((a) => (
          <li key={a.slug} className="grid grid-cols-12 gap-x-6 border-b border-line py-6">
            <p className="col-span-12 text-[0.85rem] text-stone sm:col-span-2">
              <time dateTime={a.date}>{a.date.slice(0, 7).split("-").reverse().join(" / ")}</time>
            </p>
            <h3 className="display-sm col-span-12 mt-1 sm:col-span-5 sm:mt-0">
              <Link href={`/journal/${a.slug}`} className="hover:underline hover:decoration-1 hover:underline-offset-4">
                {a.title}
              </Link>
            </h3>
            <p className="col-span-12 mt-2 text-ink-soft sm:col-span-5 sm:mt-0">{a.dek}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function TrustStrip({ advisors }: { advisors: Advisor[] }) {
  return (
    <Section labelledBy="trust-title">
      <SheetHead n={home.trust.sheet} id="trust-title" title={home.trust.title} />
      <ul className="mt-12 border-t border-ink">
        {advisors.map((a) => (
          <li key={a.slug} className="grid grid-cols-12 items-center gap-x-6 border-b border-line py-5">
            <div className="col-span-3 sm:col-span-2">
              <ContentImage image={a.photo} ratio="1/1" sizes="120px" />
            </div>
            <p className="display-sm col-span-9 sm:col-span-5">{a.name}</p>
            <p className="col-span-9 col-start-4 text-ink-soft sm:col-span-5 sm:col-start-auto">{a.role}</p>
          </li>
        ))}
      </ul>
      <dl className="mt-8 grid gap-x-6 gap-y-4 text-[0.9rem] sm:grid-cols-2">
        <div>
          <dt className="label">K-RERA agent registration</dt>
          <dd className="mt-1 text-ink">{site.reraAgentNumber}</dd>
        </div>
        <div>
          <dt className="label">How we are paid</dt>
          <dd className="mt-1 text-ink">{site.feeDisclosure}</dd>
        </div>
      </dl>
    </Section>
  );
}

export function ClosingCta({ title = home.closing.title, cta = home.closing.cta, href = "/brief", location = "closing" }) {
  return (
    <section aria-labelledby="closing-title" className="bg-limestone-deep py-20 sm:py-28">
      <Container>
        <div className="grid grid-cols-12 gap-x-6 gap-y-8 border-t border-bronze/60 pt-6">
          <h2 id="closing-title" className="display-lg col-span-12 text-oxblood lg:col-span-8">
            {title}
          </h2>
          <div className="col-span-12 lg:col-span-4 lg:self-end lg:text-right">
            <ButtonLink href={href} event="advisor_cta_click" eventProps={{ location }}>
              {cta}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
