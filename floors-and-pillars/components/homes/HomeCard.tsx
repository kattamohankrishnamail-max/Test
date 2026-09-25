import Link from "next/link";
import ContentImage from "@/components/ui/ContentImage";
import { priceFrom } from "@/lib/content/format";
import type { HomeMeta } from "@/lib/content/schemas";

export default function HomeCard({
  home,
  market,
  headingLevel = "h3",
}: {
  home: HomeMeta;
  /** Micro-market display name. */
  market: string;
  headingLevel?: "h2" | "h3";
}) {
  const H = headingLevel;
  return (
    <article className="group flex h-full flex-col bg-white">
      <Link href={`/homes/${home.slug}`} className="block" tabIndex={-1} aria-hidden>
        <ContentImage image={home.images[0]} ratio="4/3" />
      </Link>
      <div className="flex flex-1 flex-col p-7">
        <p className="eyebrow">
          {market} · {home.configurations.join(", ")} · {priceFrom(home)}
        </p>
        <H className="display-sm mt-3">
          <Link href={`/homes/${home.slug}`} className="hover:text-verdigris focus-visible:underline">
            {home.name}
          </Link>
        </H>
        <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-soft">{home.summary}</p>
        <div className="mt-6 border-t border-line pt-5">
          <p className="text-[0.8rem] font-medium uppercase tracking-[0.14em] text-ink">Why we like it</p>
          <ul className="mt-3 space-y-2 text-[0.95rem] text-ink-soft">
            {home.whyWeLikeIt.slice(0, 3).map((w) => (
              <li key={w} className="flex gap-3">
                <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-bronze" />
                {w}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-6 text-[0.95rem] text-ink-soft">
          <span className="font-medium text-ink">Consider it if </span>
          {home.considerIf.replace(/^consider it if\s*/i, "")}
        </p>
      </div>
    </article>
  );
}
