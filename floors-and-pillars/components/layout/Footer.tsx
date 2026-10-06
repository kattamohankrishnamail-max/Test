import Link from "next/link";
import { footerNav, legalNav } from "@/content/pages/navigation";
import { site } from "@/site.config";
import { Container } from "../ui/Section";
import Wordmark from "./Wordmark";

/**
 * Footer in Oxblood. Minimal wordmark (version D, no seal) so the logo appears once per page.
 * The legal name appears only here, in the legal line.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-oxblood pb-24 text-limestone md:pb-0">
      <Container className="py-14">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          <div className="col-span-12 md:col-span-5">
            <Wordmark tone="light" minimal />
            <p className="mt-8 font-serif text-[1.7rem] font-medium leading-tight text-limestone">{site.contentLine}</p>
            <p className="mt-3 text-[0.95rem] text-on-dark-soft">{site.proposition}</p>
          </div>
          <nav aria-label="Footer" className="col-span-6 md:col-span-3 md:col-start-7">
            <p className="label !text-on-dark-soft">Index</p>
            <ul className="mt-3">
              {footerNav.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className="inline-flex min-h-11 items-center text-[0.95rem] text-limestone hover:underline">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="col-span-6 md:col-span-3">
            <p className="label !text-on-dark-soft">Contact</p>
            <address className="mt-4 space-y-2 text-[0.95rem] not-italic text-limestone">
              <p>{site.contact.phone}</p>
              <p>{site.contact.email}</p>
              <p>{site.contact.address}</p>
            </address>
          </div>
        </div>
        <dl className="mt-12 grid gap-x-6 gap-y-4 border-t border-bronze/50 pt-6 text-[0.85rem] text-on-dark-soft md:grid-cols-2">
          <div>
            <dt className="label !text-on-dark-soft">K-RERA agent registration</dt>
            <dd className="mt-1">{site.reraAgentNumber}</dd>
          </div>
          <div>
            <dt className="label !text-on-dark-soft">How we are paid</dt>
            <dd className="mt-1">{site.feeDisclosure}</dd>
          </div>
        </dl>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 text-[0.85rem] text-on-dark-soft">
          <p>
            © {year} {site.legalName}
          </p>
          {legalNav.map((i) => (
            <Link key={i.href} href={i.href} className="inline-flex min-h-11 items-center hover:text-limestone hover:underline">
              {i.label}
            </Link>
          ))}
        </div>
      </Container>
    </footer>
  );
}
