/**
 * Placeholder wordmark. Replace the inner markup with the final SVG logo when it's ready;
 * give it an accessible name of "Floors & Pillars" (e.g. <title> or aria-label on the <svg>).
 */
export default function Wordmark({ className = "", tone = "ink" }: { className?: string; tone?: "ink" | "light" }) {
  return (
    <span
      className={`font-serif text-[1.15rem] font-medium uppercase tracking-[0.28em] ${tone === "light" ? "text-limestone" : "text-ink"} ${className}`}
    >
      Floors <span className={tone === "light" ? "text-limestone" : "text-bronze"}>&amp;</span> Pillars
    </span>
  );
}
