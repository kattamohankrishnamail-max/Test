import Link from "next/link";
import ContentImage from "@/components/ui/ContentImage";
import { priceFrom, typeLabel } from "@/lib/content/format";
import type { HomeMeta } from "@/lib/content/schemas";

/**
 * A register entry: one home per row, figure on the left and notes on the right,
 * numbered like an entry in a drawing schedule.
 */
export default function HomeCard({
  home,
  market,
  index,
  headingLevel = "h3",
}: {
  home: HomeMeta;
  /** Micro-market display name. */
  market: string;
  /** Position in the list, shown as "No. 01". */
  index?: number;
  headingLevel?: "h2" | "h3";
}) {
  const H = headingLevel;
  const no = index !== undefined ? `No. ${String(index + 1).padStart(2, "0")}` : null;
  return (
    <article className="grid grid-cols-12 gap-x-6 gap-y-6 border-t border-ink py-8">
      <div className="col-span-12 md:col-span-5">
        <Link href={`/homes/${home.slug}`} tabIndex={-1} aria-hidden>
          <ContentImage image={home.images[0]} ratio="4/3" figure={no ?? undefined} />
        </Link>
      </div>
      <div className="col-span-12 md:col-span-7">
        <dl className="flex flex-wrap gap-x-8 gap-y-1 text-[0.82rem]">
          {[
            ["Area", market],
            ["Type", typeLabel(home.type)],
            ["Plan", home.configurations.join(", ")],
            ["Price", priceFrom(home)],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <dt className="label !text-[0.68rem]">{k}</dt>
              <dd className="text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <H className="display-md mt-4">
          <Link href={`/homes/${home.slug}`} className="hover:underline hover:decoration-1 hover:underline-offset-4">
            {home.name}
          </Link>
        </H>
        <p className="measure mt-3 text-ink-soft">{home.summary}</p>
        <div className="mt-6 grid gap-6 border-t border-line pt-5 lg:grid-cols-2">
          <div>
            <p className="label">Why we like it</p>
            <ol className="mt-2 space-y-1.5 text-[0.95rem] text-ink">
              {home.whyWeLikeIt.slice(0, 3).map((w, i) => (
                <li key={w} className="grid grid-cols-[1.6rem_1fr]">
                  <span className="numeral">{["i", "ii", "iii"][i]}</span>
                  <span>{w}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="label">Consider it if</p>
            <p className="mt-2 text-[0.95rem] text-ink">{home.considerIf.replace(/^consider it if\s*/i, "")}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
