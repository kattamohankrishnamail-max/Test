import { Container } from "@/components/ui/Section";
import { legalBanner } from "@/content/pages/other";

export default function LegalPage({ title, sections }: { title: string; sections: { heading: string; body: string }[] }) {
  return (
    <Container className="py-16 sm:py-24">
      <p role="note" className="mb-10 inline-block border border-bronze-deep px-4 py-2 text-[0.9rem] text-bronze-deep">
        {legalBanner}
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
