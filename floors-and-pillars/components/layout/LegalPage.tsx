import { Container } from "@/components/ui/Section";
import { legalBanner } from "@/content/pages/other";

export default function LegalPage({ title, sections }: { title: string; sections: { heading: string; body: string }[] }) {
  return (
    <Container className="pb-20 pt-10 sm:pt-14">
      <p role="note" className="mb-10 inline-block bg-oxblood px-4 py-2 text-[0.78rem] font-medium tracking-[0.14em] text-limestone">
        {legalBanner.toUpperCase()}
      </p>
      <h1 className="display-xl">{title}</h1>
      <div className="prose-fp mt-12">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            <p>{s.body}</p>
          </section>
        ))}
      </div>
    </Container>
  );
}
