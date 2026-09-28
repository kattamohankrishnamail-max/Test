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
  ink: "bg-ink text-limestone",
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

/** Sheet header: number in the left margin, title spanning the rest, a rule above. */
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
  const rule = tone === "light" ? "border-limestone/60" : "border-ink";
  return (
    <div className={`grid grid-cols-12 gap-x-6 border-t pt-5 ${rule}`}>
      <p className={`col-span-12 mb-4 text-[0.78rem] font-semibold tracking-[0.16em] sm:col-span-2 sm:mb-0 ${tone === "light" ? "text-limestone/75" : "text-stone"}`}>
        {n ? `SHEET ${n}` : ""}
      </p>
      <h2 id={id} className={`display-lg col-span-12 sm:col-span-10 lg:col-span-7 ${tone === "light" ? "text-limestone" : ""}`}>
        {title}
      </h2>
      {aside && <div className="col-span-12 mt-6 sm:col-span-10 sm:col-start-3 lg:col-span-3 lg:col-start-10 lg:mt-2 lg:text-right">{aside}</div>}
    </div>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

export function Rule({ className = "", strong = false }: { className?: string; strong?: boolean }) {
  return <hr className={`${strong ? "rule-strong" : "rule"} ${className}`} />;
}
