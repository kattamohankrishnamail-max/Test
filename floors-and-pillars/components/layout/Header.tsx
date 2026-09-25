"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { primaryNav } from "@/content/pages/navigation";
import { track } from "@/lib/analytics";
import { Container } from "../ui/Section";
import Wordmark from "./Wordmark";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-limestone/95 backdrop-blur supports-[backdrop-filter]:bg-limestone/85">
      <Container className="flex h-18 items-center justify-between gap-6 py-4">
        <Link href="/" className="flex min-h-11 items-center" aria-label="Floors & Pillars — home">
          <Wordmark />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center text-[0.92rem] transition-colors hover:text-ink ${
                    isActive(item.href) ? "text-ink underline decoration-bronze underline-offset-8" : "text-ink-soft"
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
            className="hidden min-h-11 items-center bg-ink px-5 text-[0.9rem] tracking-wide text-limestone transition-colors hover:bg-verdigris sm:inline-flex"
          >
            Talk to an Advisor
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
              {open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M3 8h18M3 16h18" />}
            </svg>
          </button>
        </div>
      </Container>

      {open && (
        <nav id="mobile-nav" aria-label="Primary" className="border-t border-line bg-limestone lg:hidden">
          <Container className="py-4">
            <ul>
              {primaryNav.map((item) => (
                <li key={item.href} className="border-b border-line/70 last:border-0">
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className="flex min-h-13 items-center font-serif text-2xl text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-4">
                <Link
                  href="/brief"
                  onClick={() => {
                    setOpen(false);
                    track("advisor_cta_click", { location: "mobile_menu" });
                  }}
                  className="flex min-h-12 items-center justify-center bg-ink text-limestone"
                >
                  Talk to an Advisor
                </Link>
              </li>
            </ul>
          </Container>
        </nav>
      )}
    </header>
  );
}
