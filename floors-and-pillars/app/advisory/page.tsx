import { ClosingCta } from "@/components/home/Sections";
import Reveal from "@/components/ui/Reveal";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { advisory as copy } from "@/content/pages/advisory";
import { JsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { site } from "@/site.config";

export const metadata = pageMetadata({ ...copy.meta, path: "/advisory" });

export default function AdvisoryPage() {
  return (
    <>
      <Container className="py-16 sm:py-24">
        <Eyebrow>Advisory</Eyebrow>
        <h1 className="display-xl mt-5 max-w-3xl">{copy.title}</h1>
        <p className="lede mt-6">{copy.intro}</p>
      </Container>

      <Section tone="white" labelledBy="journey-title">
        <h2 id="journey-title" className="display-lg">
          {copy.journeyTitle}
        </h2>
        <ol className="mt-14">
          {copy.journey.map((j, i) => (
            <li key={j.stage} className="relative grid gap-4 border-l border-bronze/50 pb-12 pl-8 last:pb-0 md:grid-cols-[12rem_1fr_1fr] md:gap-10 md:pl-12">
              <span aria-hidden className="absolute -left-[5px] top-2 h-[9px] w-[9px] rounded-full bg-bronze" />
              <h3 className="display-sm">
                <span className="mr-3 text-bronze">{String(i + 1).padStart(2, "0")}</span>
                {j.stage}
              </h3>
              <div>
                <p className="text-[0.78rem] font-medium uppercase tracking-[0.14em] text-stone">What happens</p>
                <p className="mt-1 text-ink-soft">{j.happens}</p>
              </div>
              <div>
                <p className="text-[0.78rem] font-medium uppercase tracking-[0.14em] text-stone">What you receive</p>
                <p className="mt-1 text-ink-soft">{j.receive}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section labelledBy="receive-title">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <h2 id="receive-title" className="display-lg">
              {copy.receiveTitle}
            </h2>
            <dl className="mt-10 space-y-8">
              {copy.receive.map((r) => (
                <div key={r.name} className="border-t border-line pt-5">
                  <dt className="display-sm">{r.name}</dt>
                  <dd className="mt-2 text-ink-soft">{r.text}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Reveal>
            <figure className="bg-white p-8 shadow-[0_30px_60px_-40px_rgba(28,27,24,0.35)] sm:p-12">
              <p className="eyebrow">Property Note</p>
              <p className="display-md mt-3">{copy.noteMock.home}</p>
              <div className="mt-8 space-y-6">
                {copy.noteMock.sections.map((sct) => (
                  <div key={sct.heading} className="border-t border-line pt-4">
                    <p className="text-[0.85rem] font-medium uppercase tracking-[0.12em] text-ink">{sct.heading}</p>
                    <p className="mt-2 text-[0.95rem] text-ink-soft">{sct.body}</p>
                  </div>
                ))}
              </div>
              <figcaption className="mt-8 text-[0.85rem] text-stone">{copy.noteMock.caption}</figcaption>
            </figure>
          </Reveal>
        </div>
      </Section>

      <Section tone="ink" labelledBy="standard-title">
        <p id="standard-title" className="eyebrow !text-limestone/70">
          {copy.standard.eyebrow}
        </p>
        <blockquote className="display-lg mt-6 max-w-4xl text-limestone">{copy.standard.quote}</blockquote>
      </Section>

      <Section labelledBy="paid-title">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <h2 id="paid-title" className="display-lg">
            {copy.paidTitle}
          </h2>
          <div className="measure space-y-4 text-ink-soft">
            {/* Driven by site.config.ts (feeModelDetail / feeDisclosure). */}
            <p className="text-[1.1rem] text-ink">{site.feeModelDetail}</p>
            <p>{site.feeDisclosure}</p>
          </div>
        </div>
      </Section>

      <Section tone="white" labelledBy="audience-title">
        <h2 id="audience-title" className="display-lg">
          {copy.audienceTitle}
        </h2>
        <ul className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {copy.audience.map((a) => (
            <li key={a.who} className="border-t border-bronze/50 pt-5">
              <h3 className="display-sm">{a.who}</h3>
              <p className="mt-2 font-serif text-[1.25rem] italic leading-snug text-ink-soft">{a.ask}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="faq-title">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <h2 id="faq-title" className="display-lg">
            {copy.faqTitle}
          </h2>
          <div className="border-t border-line">
            {copy.faq.map((f) => (
              <details key={f.q} className="group border-b border-line">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 text-[1.05rem] text-ink [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className="font-serif text-2xl text-bronze transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="measure pb-6 text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      <ClosingCta title={copy.cta.title} cta={copy.cta.label} location="advisory_end" />
      <JsonLd data={faqJsonLd(copy.faq)} />
    </>
  );
}
