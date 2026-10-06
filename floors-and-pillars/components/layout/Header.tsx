"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { primaryNav } from "@/content/pages/navigation";
import { track } from "@/lib/analytics";
import { Container } from "../ui/Section";
import Wordmark from "./Wordmark";

/** Header carries the Horizontal logo (version B): the one appearance of the logo on each page. */
export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-limestone">
      <Container className="flex h-20 items-center justify-between gap-6">
        <Link href="/" className="flex min-h-11 items-center" aria-label="Floors & Pillars, home">
          <Wordmark showTagline={false} className="sm:hidden" />
          <Wordmark className="max-sm:hidden" />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center border-b text-[0.85rem] tracking-[0.1em] ${
                    isActive(item.href) ? "border-oxblood text-oxblood" : "border-transparent text-ink hover:border-bronze"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/brief"
            onClick={() => track("advisor_cta_click", { location: "header" })}
            className="hidden min-h-11 items-center bg-oxblood px-5 text-[0.78rem] font-medium uppercase tracking-[0.16em] text-limestone hover:bg-ink sm:inline-flex"
          >
            Talk to an Advisor
          </Link>
          <button
            type="button"
            className="inline-flex h-11 min-w-11 items-center justify-center px-2 text-[0.75rem] font-medium tracking-[0.2em] text-oxblood lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "CLOSE" : "MENU"}
          </button>
        </div>
      </Container>

      {open && (
        <nav id="mobile-nav" aria-label="Primary" className="border-t border-line bg-limestone lg:hidden">
          <Container className="pb-6">
            <ol>
              {primaryNav.map((item, i) => (
                <li key={item.href} className="border-b border-line">
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className="flex min-h-14 items-baseline gap-5 py-3"
                  >
                    <span className="numeral w-6 text-[1.1rem]">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-serif text-[2rem] font-medium leading-none text-ink">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </Container>
        </nav>
      )}
    </header>
  );
}
