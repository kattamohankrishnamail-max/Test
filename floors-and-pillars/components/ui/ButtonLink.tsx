"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { track, type AnalyticsEvent, type AnalyticsProps } from "@/lib/analytics";

const styles = {
  primary: "bg-ink text-limestone hover:bg-verdigris",
  secondary: "border border-ink text-ink hover:bg-ink hover:text-limestone",
  light: "bg-limestone text-ink hover:bg-white",
  text: "text-bronze-deep underline underline-offset-[0.3em] decoration-1 hover:text-verdigris px-0",
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
      ? "inline-flex min-h-11 items-center gap-2 text-[0.95rem]"
      : "inline-flex min-h-12 items-center justify-center gap-2 px-7 text-[0.95rem] tracking-wide transition-colors duration-300";
  return (
    <Link href={href} className={`${base} ${styles[variant]} ${className}`} onClick={() => event && track(event, eventProps)}>
      {children}
    </Link>
  );
}
