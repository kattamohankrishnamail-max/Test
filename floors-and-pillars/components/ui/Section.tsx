import type { ReactNode } from "react";

export function Container({ children, className = "", ...rest }: { children: ReactNode; className?: string; "data-island"?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-12 ${className}`} {...rest}>
      {children}
    </div>
  );
}

const TONES = {
  limestone: "bg-limestone",
  paper: "bg-paper",
  deep: "bg-limestone-deep",
  ink: "bg-oxblood text-limestone",
};

/**
 * A "sheet" of the drawing set: a heavy top rule, the sheet number in the margin column,
 * and content on a 12-column grid.
 */
export function Section({
  children,
  className = "",
  tone = "limestone",
  id,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  tone?: keyof typeof TONES;
  id?: string;
  labelledBy?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`${TONES[tone]} scroll-mt-20 py-16 sm:py-24 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

/** Section head in the brand-guideline style: bronze numeral, Cormorant title, a fine bronze rule above. */
export function SheetHead({
  n,
  title,
  id,
  aside,
  tone = "ink",
}: {
  n?: string;
  title: ReactNode;
  id: string;
  aside?: ReactNode;
  tone?: "ink" | "light";
}) {
  const light = tone === "light";
  return (
    <div className={`grid grid-cols-12 gap-x-6 border-t pt-6 ${light ? "border-bronze-light/70" : "border-bronze/60"}`}>
      <h2 id={id} className={`display-lg col-span-12 lg:col-span-8 ${light ? "text-limestone" : "text-ink"}`}>
        {n && <span className={`mr-4 align-baseline text-[0.6em] ${light ? "text-bronze-light" : "text-bronze-deep"}`}>{n}</span>}
        {title}
      </h2>
      {aside && <div className="col-span-12 mt-5 lg:col-span-4 lg:mt-3 lg:text-right">{aside}</div>}
    </div>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

export function Rule({ className = "", strong = false }: { className?: string; strong?: boolean }) {
  return <hr className={`${strong ? "rule-strong" : "rule"} ${className}`} />;
}
