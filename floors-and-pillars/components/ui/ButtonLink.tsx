"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { track, type AnalyticsEvent, type AnalyticsProps } from "@/lib/analytics";

/* Flat, square buttons. State changes are instant (no hover animation). */
const styles = {
  primary: "bg-oxblood text-limestone hover:bg-ink",
  secondary: "border border-oxblood text-oxblood hover:bg-oxblood hover:text-limestone",
  light: "bg-limestone text-oxblood hover:bg-paper",
  text: "px-0 text-ink underline decoration-1 underline-offset-[0.3em] hover:decoration-2",
};

export default function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  event,
  eventProps,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof styles;
  className?: string;
  event?: AnalyticsEvent;
  eventProps?: AnalyticsProps;
}) {
  const base =
    variant === "text"
      ? "inline-flex min-h-11 items-center text-[0.95rem]"
      : "inline-flex min-h-12 items-center justify-center px-7 text-[0.78rem] font-medium uppercase tracking-[0.16em]";
  return (
    <Link href={href} className={`${base} ${styles[variant]} ${className}`} onClick={() => event && track(event, eventProps)}>
      {children}
    </Link>
  );
}
