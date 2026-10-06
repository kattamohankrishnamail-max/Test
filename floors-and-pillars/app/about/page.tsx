import { ClosingCta } from "@/components/home/Sections";
import ContentImage from "@/components/ui/ContentImage";
import { Container, Section, SheetHead } from "@/components/ui/Section";
import { aboutPage as copy } from "@/content/pages/other";
import { getAdvisors } from "@/lib/content/load";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ ...copy.meta, path: "/about" });

export default async function AboutPage() {
  const advisors = await getAdvisors();
  return (
    <>
      <Container className="border-b border-ink pb-14 pt-10 sm:pt-14">
        <p className="label">About</p>
        <h1 className="display-xl mt-6">{copy.title}</h1>
        <div className="mt-10 grid grid-cols-12 gap-x-6 border-t border-ink pt-6">
          <p className="col-span-12 font-serif text-[2.1rem] leading-tight text-ink md:col-span-9 lg:col-span-8">{copy.name}</p>
        </div>
      </Container>

      <Section tone="paper" labelledBy="approach-title">
        <SheetHead n="01" id="approach-title" title={copy.approachTitle} />
        <ol className="mt-12 border-t border-ink">
          {copy.principles.map((p, i) => (
            <li key={p.name} className="grid grid-cols-12 items-baseline gap-x-6 border-b border-line py-6">
              <span className="numeral col-span-2 text-[2.6rem] leading-none">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="display-sm col-span-10 sm:col-span-4">{p.name}</h3>
              <p className="col-span-10 col-start-3 mt-1 text-ink-soft sm:col-span-6 sm:col-start-auto">{p.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section labelledBy="advisors-title">
        <SheetHead n="02" id="advisors-title" title={copy.advisorsTitle} />
        <ul className="mt-12 border-t border-ink">
          {advisors.map((a) => (
            <li key={a.slug} className="grid grid-cols-12 gap-x-6 gap-y-4 border-b border-line py-8">
              <div className="col-span-5 sm:col-span-3 lg:col-span-2">
                <ContentImage image={a.photo} ratio="4/5" sizes="200px" />
              </div>
              <div className="col-span-12 min-w-0 break-words sm:col-span-9 lg:col-span-7">
                <h3 className="display-sm">{a.name}</h3>
                <p className="text-[0.92rem] text-stone">{a.role}</p>
                <p className="measure mt-4 text-ink-soft">{a.bio}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>
      <ClosingCta title={copy.cta.title} cta={copy.cta.label} location="about_end" />
    </>
  );
}
