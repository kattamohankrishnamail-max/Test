import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>;
}

export function Section({
  children,
  className = "",
  tone = "limestone",
  id,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  tone?: "limestone" | "white" | "ink" | "deep";
  id?: string;
  labelledBy?: string;
}) {
  const bg = { limestone: "bg-limestone", white: "bg-white", ink: "bg-ink text-limestone", deep: "bg-limestone-deep" }[tone];
  return (
    <section id={id} aria-labelledby={labelledBy} className={`${bg} py-20 sm:py-28 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

export function Rule({ className = "" }: { className?: string }) {
  return <hr className={`rule ${className}`} />;
}
