import { ClosingCta } from "@/components/home/Sections";
import ContentImage from "@/components/ui/ContentImage";
import { Container, Section } from "@/components/ui/Section";
import { aboutPage as copy } from "@/content/pages/other";
import { getAdvisors } from "@/lib/content/load";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ ...copy.meta, path: "/about" });

export default async function AboutPage() {
  const advisors = await getAdvisors();
  return (
    <>
      <Container className="py-16 sm:py-24">
        <p className="eyebrow">About</p>
        <h1 className="display-xl mt-5">{copy.title}</h1>
        <p className="mt-10 max-w-3xl font-serif text-[2rem] leading-snug text-ink">{copy.name}</p>
      </Container>

      <Section tone="white" labelledBy="approach-title">
        <h2 id="approach-title" className="display-lg">
          {copy.approachTitle}
        </h2>
        <ul className="mt-12 grid gap-10 md:grid-cols-3">
          {copy.principles.map((p, i) => (
            <li key={p.name} className="border-t border-bronze/60 pt-6">
              <p aria-hidden className="font-serif text-[2.2rem] leading-none text-bronze">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="display-sm mt-4">{p.name}</h3>
              <p className="mt-2 text-ink-soft">{p.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="advisors-title">
        <h2 id="advisors-title" className="display-lg">
          {copy.advisorsTitle}
        </h2>
        <ul className="mt-12 grid gap-12 md:grid-cols-2">
          {advisors.map((a) => (
            <li key={a.slug} className="grid gap-6 sm:grid-cols-[10rem_1fr]">
              <ContentImage image={a.photo} ratio="4/5" sizes="160px" />
              <div>
                <h3 className="display-sm">{a.name}</h3>
                <p className="text-[0.92rem] text-stone">{a.role}</p>
                <p className="mt-4 text-ink-soft">{a.bio}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>
      <ClosingCta title={copy.cta.title} cta={copy.cta.label} location="about_end" />
    </>
  );
}
