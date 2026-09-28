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
    <header className="sticky top-0 z-40 border-b border-ink bg-limestone">
      <Container className="flex h-16 items-stretch justify-between gap-6">
        <Link href="/" className="flex min-h-11 items-center" aria-label="Floors & Pillars, home">
          <Wordmark />
        </Link>

        <nav aria-label="Primary" className="hidden lg:flex">
          <ul className="flex items-stretch">
            {primaryNav.map((item) => (
              <li key={item.href} className="flex border-l border-line last:border-r">
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`flex items-center px-6 text-[0.86rem] ${isActive(item.href) ? "bg-ink text-limestone" : "text-ink hover:bg-paper"}`}
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
            className="hidden min-h-11 items-center bg-ink px-5 text-[0.86rem] font-medium text-limestone hover:bg-verdigris sm:inline-flex"
          >
            Talk to an Advisor
          </Link>
          <button
            type="button"
            className="inline-flex h-11 min-w-11 items-center justify-center px-2 text-[0.8rem] font-semibold tracking-[0.14em] lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "CLOSE" : "MENU"}
          </button>
        </div>
      </Container>

      {open && (
        <nav id="mobile-nav" aria-label="Primary" className="border-t border-ink bg-limestone lg:hidden">
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
                    <span className="font-serif text-[2rem] leading-none text-ink">{item.label}</span>
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
