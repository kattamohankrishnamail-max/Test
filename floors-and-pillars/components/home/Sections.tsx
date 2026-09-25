import Link from "next/link";
import HomeCard from "@/components/homes/HomeCard";
import ButtonLink from "@/components/ui/ButtonLink";
import ContentImage from "@/components/ui/ContentImage";
import Placeholder from "@/components/ui/Placeholder";
import Reveal from "@/components/ui/Reveal";
import { Container, Eyebrow, Rule, Section } from "@/components/ui/Section";
import { home } from "@/content/pages/home";
import type { Advisor, ArticleMeta, HomeMeta, Market } from "@/lib/content/load";
import { site } from "@/site.config";
import BriefTeaser from "./BriefTeaser";

export function Hero() {
  const h = home.hero;
  return (
    <section aria-labelledby="hero-title" className="relative">
      <div className="grid lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-[1.05fr_1fr]">
        <Container className="flex flex-col justify-center py-16 sm:py-24 lg:py-20 lg:pr-16">
          <Eyebrow>{h.eyebrow}</Eyebrow>
          <h1 id="hero-title" className="display-xl mt-6 max-w-[14ch]">
            {h.title}
          </h1>
          <p className="mt-8 font-serif text-[1.6rem] leading-snug text-ink">{h.sub}</p>
          <p className="lede mt-4">{h.support}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <ButtonLink href={h.primary.href} event="advisor_cta_click" eventProps={{ location: "hero" }}>
              {h.primary.label}
            </ButtonLink>
            <ButtonLink href={h.secondary.href} variant="text">
              {h.secondary.label} →
            </ButtonLink>
          </div>
        </Container>
        <div className="relative min-h-[46svh] lg:min-h-0">
          <Placeholder label={h.image.replace(/^placeholder:/, "")} ratio="auto" className="absolute inset-0 h-full" />
        </div>
      </div>
    </section>
  );
}

export function Teaser() {
  return (
    <Section tone="deep" labelledBy="teaser-title">
      <Reveal>
        <BriefTeaser />
      </Reveal>
    </Section>
  );
}

export function Philosophy() {
  return (
    <Section labelledBy="philosophy-title">
      <Reveal className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <h2 id="philosophy-title" className="display-lg">
          {home.philosophy.title}
        </h2>
        <p className="lede self-end">{home.philosophy.body}</p>
      </Reveal>
    </Section>
  );
}

export function HowWeAdvise() {
  const h = home.how;
  return (
    <Section tone="white" labelledBy="how-title">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 id="how-title" className="display-lg">
          {h.title}
        </h2>
        <ButtonLink href={h.link.href} variant="text">
          {h.link.label} →
        </ButtonLink>
      </div>
      <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {h.steps.map((s, i) => (
          <li key={s.name}>
            <Reveal delay={i * 90}>
              <Rule />
              <p className="mt-6 font-serif text-[2.4rem] leading-none text-bronze" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="display-sm mt-4">{s.name}</h3>
              <p className="mt-2 text-ink-soft">{s.text}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function FeaturedHomes({ homes, marketNames }: { homes: HomeMeta[]; marketNames: Record<string, string> }) {
  if (!homes.length) return null;
  return (
    <Section labelledBy="homes-title">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow>{home.homes.eyebrow}</Eyebrow>
          <h2 id="homes-title" className="display-lg mt-4">
            {home.homes.title}
          </h2>
        </div>
        <ButtonLink href={home.homes.link.href} variant="text">
          {home.homes.link.label} →
        </ButtonLink>
      </div>
      <ul className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {homes.map((h, i) => (
          <li key={h.slug}>
            <Reveal delay={i * 90} className="h-full">
              <HomeCard home={h} market={marketNames[h.microMarket]} />
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function WhatYouReceive() {
  return (
    <Section tone="ink" labelledBy="receive-title">
      <h2 id="receive-title" className="display-lg text-limestone">
        {home.receive.title}
      </h2>
      <ul className="mt-14 grid gap-px bg-limestone/15 md:grid-cols-3">
        {home.receive.items.map((item, i) => (
          <li key={item.name} className="bg-ink p-8 md:p-10">
            <Reveal delay={i * 90}>
              <h3 className="display-sm text-limestone">{item.name}</h3>
              <p className="mt-4 text-limestone/80">{item.text}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function BengaluruUnderstood({ markets, guideSlugs }: { markets: Market[]; guideSlugs: string[] }) {
  const b = home.bengaluru;
  return (
    <Section labelledBy="bengaluru-title">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div>
          <h2 id="bengaluru-title" className="display-lg">
            {b.title}
          </h2>
          <p className="lede mt-6">{b.body}</p>
          <div className="mt-8">
            <ButtonLink href={b.link.href} variant="text">
              {b.link.label} →
            </ButtonLink>
          </div>
        </div>
        <MarketIndex markets={markets} guideSlugs={guideSlugs} />
      </div>
    </Section>
  );
}

/** Stylised micro-market list; markets without a published guide are shown but not linked. */
export function MarketIndex({ markets, guideSlugs }: { markets: Market[]; guideSlugs: string[] }) {
  return (
    <ul className="border-t border-line">
      {markets.map((m) => {
        const has = guideSlugs.includes(m.slug);
        const inner = (
          <>
            <span className="font-serif text-[1.55rem] leading-tight text-ink">{m.name}</span>
            <span className="text-[0.8rem] uppercase tracking-[0.14em] text-stone">{has ? `${m.zone} →` : "Guide in preparation"}</span>
          </>
        );
        return (
          <li key={m.slug} className="border-b border-line">
            {has ? (
              <Link href={`/bengaluru/${m.slug}`} className="flex min-h-16 items-center justify-between gap-4 py-3 transition-colors hover:text-verdigris">
                {inner}
              </Link>
            ) : (
              <div className="flex min-h-16 items-center justify-between gap-4 py-3">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function JournalTeaser({ articles }: { articles: ArticleMeta[] }) {
  if (!articles.length) return null;
  return (
    <Section tone="white" labelledBy="journal-title">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 id="journal-title" className="display-lg">
          {home.journal.title}
        </h2>
        <ButtonLink href={home.journal.link.href} variant="text">
          {home.journal.link.label} →
        </ButtonLink>
      </div>
      <ul className="mt-12 grid gap-10 md:grid-cols-3">
        {articles.map((a) => (
          <li key={a.slug} className="border-t border-bronze/60 pt-6">
            <h3 className="display-sm">
              <Link href={`/journal/${a.slug}`} className="hover:text-verdigris">
                {a.title}
              </Link>
            </h3>
            <p className="mt-3 text-ink-soft">{a.dek}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function TrustStrip({ advisors }: { advisors: Advisor[] }) {
  return (
    <Section tone="deep" labelledBy="trust-title">
      <h2 id="trust-title" className="display-md">
        {home.trust.title}
      </h2>
      <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {advisors.map((a) => (
          <li key={a.slug} className="flex items-center gap-5">
            <div className="w-20 shrink-0">
              <ContentImage image={a.photo} ratio="1/1" sizes="80px" />
            </div>
            <div>
              <p className="font-medium text-ink">{a.name}</p>
              <p className="text-[0.9rem] text-stone">{a.role}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-10 space-y-1 border-t border-line pt-6 text-[0.9rem] text-ink-soft">
        <p>K-RERA agent registration: {site.reraAgentNumber}</p>
        <p>{site.feeDisclosure}</p>
      </div>
    </Section>
  );
}

export function ClosingCta({ title = home.closing.title, cta = home.closing.cta, href = "/brief", location = "closing" }) {
  return (
    <section aria-labelledby="closing-title" className="bg-verdigris py-24 text-white sm:py-32">
      <Container className="flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
        <h2 id="closing-title" className="display-lg max-w-2xl text-white">
          {title}
        </h2>
        <ButtonLink href={href} variant="light" event="advisor_cta_click" eventProps={{ location }}>
          {cta}
        </ButtonLink>
      </Container>
    </section>
  );
}
