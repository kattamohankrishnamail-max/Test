import Seal from "@/components/brand/Seal";
import { site } from "@/site.config";

/**
 * Logo version B (Horizontal): seal left, wordmark and tagline right. Used once per page, in the
 * header. `minimal` gives version D (wordmark and tagline, no seal) for footers and running heads.
 * The wordmark is set in Cormorant Garamond, the brand's own face; never re-set it in another.
 */
export default function Wordmark({
  tone = "ink",
  minimal = false,
  showTagline = true,
  className = "",
}: {
  tone?: "ink" | "light";
  minimal?: boolean;
  showTagline?: boolean;
  className?: string;
}) {
  const light = tone === "light";
  return (
    <span className={`flex items-center gap-3.5 ${className}`}>
      {!minimal && <Seal size={40} tone={light ? "bronze" : "oxblood"} />}
      <span className="flex flex-col">
        <span className={`font-serif text-[1.05rem] font-medium uppercase leading-none tracking-[0.28em] ${light ? "text-limestone" : "text-oxblood"}`}>
          Floors &amp; Pillars
        </span>
        {showTagline && (
          <span className={`tagline mt-1 text-[0.95rem] leading-none ${light ? "text-on-dark-soft" : "text-bronze-deep"}`}>{site.tagline}</span>
        )}
      </span>
    </span>
  );
}
