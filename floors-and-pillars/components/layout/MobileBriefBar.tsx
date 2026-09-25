"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

/** Sticky bottom CTA on small screens; hidden on the brief itself and the advisor desk. */
export default function MobileBriefBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/brief") || pathname.startsWith("/desk")) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-limestone/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
      <Link
        href="/brief"
        onClick={() => track("advisor_cta_click", { location: "mobile_bar" })}
        className="flex min-h-12 w-full items-center justify-center bg-ink text-[0.95rem] tracking-wide text-limestone"
      >
        Share your brief
      </Link>
    </div>
  );
}
