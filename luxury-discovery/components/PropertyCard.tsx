"use client";

import { areaText, locationText, or, priceText } from "@/lib/format";
import type { Match } from "@/lib/types";
import PropertyVisual from "./PropertyVisual";
import { CheckIcon, HeartIcon } from "./ui";

export function typeLabel(m: Match["property"]) {
  return m.productLabel ?? (m.typeGroups.includes("villa") ? "Villa" : "Apartment");
}

export default function PropertyCard({
  match,
  index,
  shortlisted,
  onDetails,
  onShortlist,
  onAdvisor,
}: {
  match: Match;
  index: number;
  shortlisted: boolean;
  onDetails: () => void;
  onShortlist: () => void;
  onAdvisor: () => void;
}) {
  const p = match.property;
  const facts: [string, string][] = [
    ["Type", typeLabel(p)],
    ["Configuration", or(p.configurationLabel)],
    ["Area", areaText(p)],
    ["Price", priceText(p)],
    ["Possession", or(p.possessionLabel)],
  ];

  return (
    <article
      className="rise group flex flex-col overflow-hidden rounded-[28px] border border-line/80 bg-paper shadow-[0_1px_0_rgba(0,0,0,0.02)] transition-shadow duration-500 hover:shadow-[0_24px_60px_-30px_rgba(29,27,24,0.35)]"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <button type="button" onClick={onDetails} className="relative block aspect-[16/10] overflow-hidden text-left" aria-label={`View details for ${p.projectName}`}>
        <div className="h-full w-full transition-transform duration-[1200ms] ease-[var(--ease-lux)] group-hover:scale-[1.03]">
          <PropertyVisual property={p} />
        </div>
        <span className="absolute left-5 top-5 rounded-full bg-paper/95 px-3.5 py-1.5 text-xs font-medium tracking-wide text-ink backdrop-blur">
          {match.score}% match
        </span>
      </button>

      <div className="flex flex-1 flex-col p-7">
        <p className="eyebrow">{locationText(p)}</p>
        <h3 className="mt-2 font-serif text-[1.75rem] leading-tight text-ink">{p.projectName}</h3>
        <p className="mt-1 text-sm text-stone">{or(p.developer)}</p>

        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-y border-line/80 py-5 text-sm">
          {facts.map(([k, v]) => (
            <div key={k} className={k === "Price" ? "col-span-2" : ""}>
              <dt className="text-[0.7rem] uppercase tracking-[0.16em] text-stone">{k}</dt>
              <dd className={`mt-0.5 ${v === "Not specified" ? "text-stone italic" : "text-ink"}`}>{v}</dd>
            </div>
          ))}
        </dl>

        {match.reasons.length > 0 && (
          <div className="mt-6">
            <p className="font-serif text-lg italic text-ink">Why this fits you</p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
              {match.reasons.map((r) => (
                <li key={r} className="flex gap-2.5">
                  <CheckIcon className="mt-1 text-brass" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {match.gaps.length > 0 && (
          <p className="mt-4 rounded-2xl bg-brass-soft/60 px-4 py-3 text-xs leading-relaxed text-ink-soft">
            <span className="font-medium text-ink">Worth knowing: </span>
            {match.gaps.slice(0, 2).join("; ")}.
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-7">
          <button type="button" onClick={onDetails} className="rounded-full border border-ink/80 px-5 py-2.5 text-sm text-ink transition hover:bg-ink hover:text-paper">
            View details
          </button>
          <button
            type="button"
            onClick={onShortlist}
            aria-pressed={shortlisted}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm transition ${shortlisted ? "bg-brass-soft text-brass" : "text-ink-soft hover:text-ink"}`}
          >
            <HeartIcon filled={shortlisted} />
            {shortlisted ? "Shortlisted" : "Shortlist"}
          </button>
          <button type="button" onClick={onAdvisor} className="ml-auto text-sm text-ink-soft underline-offset-4 transition hover:text-ink hover:underline">
            Talk to an advisor
          </button>
        </div>
      </div>
    </article>
  );
}
