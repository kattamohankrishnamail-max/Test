"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

/** Sticky bottom CTA on small screens; hidden on the brief itself and the advisor desk. */
export default function MobileBriefBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/brief") || pathname.startsWith("/desk")) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink bg-limestone pb-[env(safe-area-inset-bottom)] md:hidden">
      <Link
        href="/brief"
        onClick={() => track("advisor_cta_click", { location: "mobile_bar" })}
        className="flex min-h-14 w-full items-center justify-between bg-ink px-5 text-[0.95rem] font-medium text-limestone"
      >
        <span>Share your brief</span>
        <span className="text-[0.72rem] font-semibold tracking-[0.16em] text-limestone/80">FOUR SHORT STEPS</span>
      </Link>
    </div>
  );
}
