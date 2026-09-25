import Link from "next/link";
import { footerNav, legalNav } from "@/content/pages/navigation";
import { site } from "@/site.config";
import { Container } from "../ui/Section";
import Wordmark from "./Wordmark";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink pb-28 pt-20 text-limestone md:pb-12">
      <Container>
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark tone="light" />
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-limestone/80">{site.proposition}</p>
            <p className="mt-2 max-w-sm font-serif text-xl italic text-limestone/90">
              We don&apos;t show you everything. We show you what&apos;s worth considering.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="eyebrow !text-limestone/70">Explore</p>
            <ul className="mt-4 space-y-1">
              {footerNav.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className="inline-flex min-h-11 items-center text-[0.95rem] text-limestone/90 hover:text-white hover:underline">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="eyebrow !text-limestone/70">Contact</p>
            <address className="mt-4 space-y-2 text-[0.95rem] not-italic leading-relaxed text-limestone/90">
              <p>{site.contact.phone}</p>
              <p>{site.contact.email}</p>
              <p>{site.contact.address}</p>
            </address>
          </div>
        </div>

        <div className="mt-16 space-y-3 border-t border-limestone/20 pt-8 text-[0.85rem] leading-relaxed text-limestone/75">
          <p>K-RERA agent registration: {site.reraAgentNumber}</p>
          <p>{site.feeDisclosure}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <p>© {year} {site.name}</p>
            {legalNav.map((i) => (
              <Link key={i.href} href={i.href} className="inline-flex min-h-11 items-center hover:text-white hover:underline">
                {i.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
