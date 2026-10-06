import { ClosingCta } from "@/components/home/Sections";
import { Container, Section, SheetHead } from "@/components/ui/Section";
import { advisory as copy } from "@/content/pages/advisory";
import { JsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { site } from "@/site.config";

export const metadata = pageMetadata({ ...copy.meta, path: "/advisory" });

export default function AdvisoryPage() {
  const cols = copy.journeyColumns;
  return (
    <>
      <Container className="border-b border-ink pb-14 pt-10 sm:pt-14">
        <p className="label">Advisory</p>
        <h1 className="display-xl mt-6 max-w-5xl">{copy.title}</h1>
        <div className="mt-10 grid grid-cols-12 gap-x-6 border-t border-ink pt-6">
          <p className="lede col-span-12 md:col-span-8 lg:col-span-6">{copy.intro}</p>
        </div>
      </Container>

      <Section labelledBy="journey-title">
        <SheetHead n="01" id="journey-title" title={copy.journeyTitle} />
        <table className="mt-12 w-full border-t border-ink text-left">
          <thead className="max-md:sr-only">
            <tr className="border-b border-ink">
              <th scope="col" className="label w-14 py-2 font-medium">No.</th>
              <th scope="col" className="label w-44 py-2 font-medium">{cols.stage}</th>
              <th scope="col" className="label py-2 pr-6 font-medium">{cols.happens}</th>
              <th scope="col" className="label py-2 font-medium">{cols.receive}</th>
            </tr>
          </thead>
          <tbody>
            {copy.journey.map((j, i) => (
              <tr key={j.stage} className="border-b border-line max-md:grid max-md:grid-cols-[2.5rem_1fr] max-md:py-4">
                <td className="numeral py-5 align-baseline text-[1.3rem] max-md:py-0">{String(i + 1).padStart(2, "0")}</td>
                <th scope="row" className="display-sm py-5 pr-6 align-baseline font-normal max-md:py-0">{j.stage}</th>
                <td className="py-5 pr-6 align-baseline text-ink-soft max-md:col-start-2 max-md:pt-2 max-md:pb-0">
                  <span className="label mr-2 md:hidden">{cols.happens}.</span>
                  {j.happens}
                </td>
                <td className="py-5 align-baseline text-ink max-md:col-start-2 max-md:pt-2 max-md:pb-0">
                  <span className="label mr-2 md:hidden">{cols.receive}.</span>
                  {j.receive}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section tone="paper" labelledBy="receive-title">
        <SheetHead n="02" id="receive-title" title={copy.receiveTitle} />
        <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-12">
          <dl className="col-span-12 border-t border-ink lg:col-span-5">
            {copy.receive.map((r, i) => (
              <div key={r.name} className="border-b border-line py-5 pl-10">
                <dt className="display-sm -indent-10">
                  <span className="numeral inline-block w-10 indent-0 text-[1.3rem]">{String.fromCharCode(65 + i)}</span>
                  {r.name}
                </dt>
                <dd className="mt-2 text-ink-soft">{r.text}</dd>
              </div>
            ))}
          </dl>
          <figure className="col-span-12 lg:col-span-6 lg:col-start-7">
            {/* A specimen sheet: title block across the top, fields below, as a printed note would be. */}
            <div className="border border-ink bg-limestone">
              <div className="grid grid-cols-3 border-b border-ink text-[0.78rem]">
                <p className="col-span-2 border-r border-ink p-3">
                  <span className="label block">Document</span>
                  <span className="mt-1 block text-ink">Property Note</span>
                </p>
                <p className="p-3">
                  <span className="label block">Ref.</span>
                  <span className="mt-1 block text-ink">PN-000</span>
                </p>
              </div>
              <div className="p-6 sm:p-8">
                <p className="display-md">{copy.noteMock.home}</p>
                <dl className="mt-6 border-t border-ink">
                  {copy.noteMock.sections.map((sct, i) => (
                    <div key={sct.heading} className="border-b border-line py-3 pl-8">
                      <dt className="-indent-8 text-[0.9rem] font-medium text-ink">
                        <span className="numeral inline-block w-8 indent-0 font-normal">{i + 1}</span>
                        {sct.heading}
                      </dt>
                      <dd className="mt-1 text-[0.92rem] text-ink-soft">{sct.body}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <figcaption className="mt-3 text-[0.85rem] text-stone">Fig. 2 · {copy.noteMock.caption}</figcaption>
          </figure>
        </div>
      </Section>

      <section aria-labelledby="standard-title" className="bg-oxblood py-20 text-limestone sm:py-28">
        <Container>
          <div className="grid grid-cols-12 gap-x-6 border-t border-bronze-light pt-5">
            <p id="standard-title" className="col-span-12 text-[0.78rem] font-medium tracking-[0.16em] text-on-dark-soft sm:col-span-2">
              {copy.standard.eyebrow.toUpperCase()}
            </p>
            <p className="display-lg col-span-12 mt-4 text-limestone sm:col-span-10 sm:mt-0 lg:col-span-9">{copy.standard.quote}</p>
          </div>
        </Container>
      </section>

      <Section labelledBy="paid-title">
        <SheetHead n="03" id="paid-title" title={copy.paidTitle} />
        <div className="mt-8 grid grid-cols-12 gap-x-6">
          <div className="measure col-span-12 space-y-3 text-ink-soft sm:col-span-10 sm:col-start-3 lg:col-span-7 lg:col-start-3">
            {/* Driven by site.config.ts (feeModelDetail / feeDisclosure). */}
            <p className="text-[1.15rem] text-ink">{site.feeModelDetail}</p>
            <p>{site.feeDisclosure}</p>
          </div>
        </div>
      </Section>

      <Section tone="paper" labelledBy="audience-title">
        <SheetHead n="04" id="audience-title" title={copy.audienceTitle} />
        <table className="mt-12 w-full border-t border-ink text-left">
          <thead className="max-md:sr-only">
            <tr className="border-b border-ink">
              <th scope="col" className="label py-2 font-medium md:w-2/5">{copy.audienceColumns.who}</th>
              <th scope="col" className="label py-2 font-medium">{copy.audienceColumns.ask}</th>
            </tr>
          </thead>
          <tbody>
            {copy.audience.map((a) => (
              <tr key={a.who} className="border-b border-line max-md:flex max-md:flex-col max-md:py-4">
                <th scope="row" className="display-sm py-5 pr-6 align-baseline font-normal max-md:py-0">{a.who}</th>
                <td className="py-5 align-baseline text-ink-soft max-md:pt-1 max-md:pb-0">{a.ask}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section labelledBy="faq-title">
        <SheetHead n="05" id="faq-title" title={copy.faqTitle} />
        <div className="mt-12 border-t border-ink">
          {copy.faq.map((f, i) => (
            <details key={f.q} className="group border-b border-line">
              <summary className="grid min-h-16 cursor-pointer list-none grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-2 py-4 text-[1.05rem] text-ink [&::-webkit-details-marker]:hidden">
                <span className="numeral">{String(i + 1).padStart(2, "0")}</span>
                <span>{f.q}</span>
                <span aria-hidden className="text-[0.75rem] font-medium tracking-[0.14em] text-stone">
                  <span className="group-open:hidden">OPEN</span>
                  <span className="hidden group-open:inline">CLOSE</span>
                </span>
              </summary>
              <p className="measure pb-6 pl-[2.5rem] text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <ClosingCta title={copy.cta.title} cta={copy.cta.label} location="advisory_end" />
      <JsonLd data={faqJsonLd(copy.faq)} />
    </>
  );
}
