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
    <Container className="grid grid-cols-12 gap-x-6 gap-y-14 pb-20 pt-10 sm:pt-14">
      <div className="col-span-12 lg:col-span-6">
        <p className="label">Contact</p>
        <h1 className="display-xl mt-6">{copy.title}</h1>
        <p className="lede mt-8 border-t border-ink pt-5">{copy.intro}</p>
        <div className="mt-8">
          <ButtonLink href="/brief" event="advisor_cta_click" eventProps={{ location: "contact" }}>
            {copy.briefLink}
          </ButtonLink>
        </div>
        <dl className="mt-12 border-t border-ink">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[7rem_1fr] gap-4 border-b border-line py-4">
              <dt className="text-stone">{k}</dt>
              <dd className="break-words text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="col-span-12 lg:col-span-5 lg:col-start-8">
        <ContactForm initialState={sp.sent ? "sent" : sp.error ? "error" : undefined} />
      </div>
    </Container>
  );
}
