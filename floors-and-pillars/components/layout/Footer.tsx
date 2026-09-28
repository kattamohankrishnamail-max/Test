import Link from "next/link";
import { footerNav, legalNav } from "@/content/pages/navigation";
import { site } from "@/site.config";
import { Container } from "../ui/Section";
import Wordmark from "./Wordmark";

/** Footer set as a title block, the way a drawing sheet closes. */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-ink bg-limestone pb-24 md:pb-0">
      <Container>
        <div className="grid grid-cols-12 border-x border-ink max-sm:border-x-0">
          <div className="col-span-12 border-b border-ink p-6 md:col-span-5 md:border-r lg:p-8">
            <Wordmark />
            <p className="mt-6 font-serif text-[1.9rem] leading-tight text-ink">We don&apos;t show you everything. We show you what&apos;s worth considering.</p>
            <p className="mt-4 text-[0.95rem] text-ink-soft">{site.proposition}</p>
          </div>
          <nav aria-label="Footer" className="col-span-12 border-b border-ink p-6 sm:col-span-6 md:col-span-3 md:border-r lg:p-8">
            <p className="label">Index</p>
            <ul className="mt-3">
              {footerNav.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className="inline-flex min-h-11 items-center text-[0.95rem] text-ink hover:underline">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="col-span-12 border-b border-ink p-6 sm:col-span-6 md:col-span-4 lg:p-8">
            <p className="label">Contact</p>
            <address className="mt-4 space-y-2 text-[0.95rem] not-italic text-ink">
              <p>{site.contact.phone}</p>
              <p>{site.contact.email}</p>
              <p>{site.contact.address}</p>
            </address>
          </div>
          <dl className="col-span-12 grid grid-cols-12 text-[0.85rem] text-ink-soft">
            <div className="col-span-12 border-b border-ink p-4 md:col-span-5 md:border-r lg:px-8">
              <dt className="label">K-RERA agent registration</dt>
              <dd className="mt-1">{site.reraAgentNumber}</dd>
            </div>
            <div className="col-span-12 border-b border-ink p-4 md:col-span-7 lg:px-8">
              <dt className="label">How we are paid</dt>
              <dd className="mt-1">{site.feeDisclosure}</dd>
            </div>
          </dl>
          <div className="col-span-12 flex flex-wrap items-center gap-x-6 px-4 py-2 text-[0.85rem] text-ink-soft lg:px-8">
            <p>© {year} {site.name}</p>
            {legalNav.map((i) => (
              <Link key={i.href} href={i.href} className="inline-flex min-h-11 items-center hover:underline">
                {i.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
