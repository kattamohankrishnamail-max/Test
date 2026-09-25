import ContactForm from "@/components/layout/ContactForm";
import WhatsAppLink from "@/components/layout/WhatsAppLink";
import ButtonLink from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Section";
import { contactPage as copy } from "@/content/pages/other";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/site.config";

export const metadata = pageMetadata({ ...copy.meta, path: "/contact" });

export default async function ContactPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const d = copy.details;
  const rows: [string, React.ReactNode][] = [
    [d.phone, site.contact.phone],
    [d.whatsapp, <WhatsAppLink key="wa" number={site.contact.whatsapp} />],
    [d.email, site.contact.email],
    [d.address, site.contact.address],
    [d.hours, site.contact.hours],
  ];
  return (
    <Container className="grid gap-16 py-16 sm:py-24 lg:grid-cols-2 lg:gap-24">
      <div>
        <p className="eyebrow">Contact</p>
        <h1 className="display-xl mt-5">{copy.title}</h1>
        <p className="lede mt-6">{copy.intro}</p>
        <div className="mt-8">
          <ButtonLink href="/brief" event="advisor_cta_click" eventProps={{ location: "contact" }}>
            {copy.briefLink}
          </ButtonLink>
        </div>
        <dl className="mt-14 border-t border-line">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[7rem_1fr] gap-4 border-b border-line py-4">
              <dt className="text-stone">{k}</dt>
              <dd className="break-words text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div>
        <ContactForm initialState={sp.sent ? "sent" : sp.error ? "error" : undefined} />
      </div>
    </Container>
  );
}
