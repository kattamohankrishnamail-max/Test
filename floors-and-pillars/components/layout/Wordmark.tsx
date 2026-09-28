/**
 * Placeholder wordmark. Replace the inner markup with the final SVG logo when it's ready;
 * give it an accessible name of "Floors & Pillars" (e.g. <title> or aria-label on the <svg>).
 */
export default function Wordmark({ className = "", tone = "ink" }: { className?: string; tone?: "ink" | "light" }) {
  return (
    <span className={`flex items-center gap-3 ${tone === "light" ? "text-limestone" : "text-ink"} ${className}`}>
      <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 3h20M2 21h20M6 3v18M18 3v18" />
      </svg>
      <span className="text-[0.82rem] font-semibold uppercase tracking-[0.3em]">Floors &amp; Pillars</span>
    </span>
  );
}
