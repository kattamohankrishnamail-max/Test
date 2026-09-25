"use client";

import { useEffect } from "react";
import { areaText, locationText, NS, or, priceText } from "@/lib/format";
import type { Match } from "@/lib/types";
import { typeLabel } from "./PropertyCard";
import PropertyVisual from "./PropertyVisual";
import { Button, CheckIcon, CloseButton, HeartIcon } from "./ui";

export default function PropertyDetail({
  match,
  shortlisted,
  onClose,
  onShortlist,
  onAdvisor,
}: {
  match: Match;
  shortlisted: boolean;
  onClose: () => void;
  onShortlist: () => void;
  onAdvisor: () => void;
}) {
  const p = match.property;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const priceNote = p.priceVerified === true ? "As listed" : p.priceVerified === false ? "Indicative" : null;
  const facts: [string, string][] = [
    ["Property type", typeLabel(p)],
    ["Configuration", or(p.configurationLabel)],
    ["Area", areaText(p)],
    ["Price", priceText(p) + (priceNote && priceText(p) !== NS ? ` · ${priceNote}` : "")],
    ["Possession", or(p.possessionLabel)],
    ["Location", locationText(p)],
    ["Positioning", or(p.archetype)],
    ["Homes in project", p.units !== null ? p.units.toLocaleString("en-IN") : NS],
    ["Land", p.landAcres !== null ? `${p.landAcres} acres` : NS],
    ["Density", p.unitsPerAcre !== null ? `${Math.round(p.unitsPerAcre)} homes per acre` : NS],
    ["Availability", or(p.salesSignal)],
    ["Launch", or(p.launch)],
    ["RERA", or(p.rera)],
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close details" onClick={onClose} className="fade absolute inset-0 bg-ink/40 backdrop-blur-[2px]" />
      <aside role="dialog" aria-modal="true" aria-label={p.projectName} className="slide-in relative h-full w-full max-w-2xl overflow-y-auto bg-ivory">
        <div className="relative h-72 sm:h-80">
          <PropertyVisual property={p} />
          <div className="absolute right-5 top-5">
            <CloseButton onClick={onClose} />
          </div>
        </div>

        <div className="px-6 pb-16 pt-10 sm:px-12">
          <p className="eyebrow">{locationText(p)}</p>
          <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">{p.projectName}</h2>
          <p className="mt-2 text-stone">{or(p.developer)}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={onAdvisor}>Talk to an advisor</Button>
            <Button variant="outline" onClick={onShortlist} aria-pressed={shortlisted}>
              <HeartIcon filled={shortlisted} /> {shortlisted ? "Shortlisted" : "Add to shortlist"}
            </Button>
          </div>

          <section className="mt-12 rounded-[24px] border border-line bg-paper p-7">
            <div className="flex items-baseline justify-between">
              <p className="font-serif text-2xl italic">Why this fits you</p>
              <span className="text-sm text-brass">{match.score}% match</span>
            </div>
            {match.reasons.length ? (
              <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-ink-soft">
                {match.reasons.map((r) => (
                  <li key={r} className="flex gap-2.5">
                    <CheckIcon className="mt-1 text-brass" />
                    {r}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-stone">Add a few preferences to your brief and we'll explain the fit.</p>
            )}
            {match.gaps.length > 0 && (
              <div className="mt-5 border-t border-line pt-4 text-sm text-ink-soft">
                <p className="eyebrow mb-2">Worth knowing</p>
                <ul className="list-disc space-y-1 pl-5">
                  {match.gaps.map((g) => (
                    <li key={g} className="first-letter:uppercase">
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section className="mt-12">
            <p className="eyebrow">The residence</p>
            <dl className="mt-5 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
              {facts.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 border-b border-line py-3.5 text-sm">
                  <dt className="text-stone">{k}</dt>
                  <dd className={`text-right ${v === NS ? "italic text-stone" : "text-ink"}`}>{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          {(p.description || p.usp || p.amenities) && (
            <section className="mt-12 space-y-6">
              {p.usp && <Block title="Highlights" text={p.usp} />}
              {p.amenities && <Block title="Amenities" text={p.amenities} />}
              {p.description && <Block title="Notes" text={p.description} />}
            </section>
          )}

          {p.projectUrl && (
            <a href={p.projectUrl} target="_blank" rel="noopener noreferrer" className="mt-10 inline-block text-sm text-brass underline underline-offset-4">
              Project website ↗
            </a>
          )}

          <details className="mt-12 border-t border-line pt-6 text-sm">
            <summary className="cursor-pointer text-stone hover:text-ink">All recorded details</summary>
            <dl className="mt-4 space-y-2">
              {Object.entries(p.raw).map(([k, v]) => (
                <div key={k} className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-4">
                  <dt className="text-stone">{k}</dt>
                  <dd className="break-words text-ink-soft">{v}</dd>
                </div>
              ))}
            </dl>
          </details>

          <p className="mt-10 text-xs leading-relaxed text-stone">
            Every detail on this page comes from our property database. Where something isn't recorded, it's marked "Not specified" — please confirm
            pricing, availability and possession with your advisor.
          </p>
        </div>
      </aside>
    </div>
  );
}

function Block({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <p className="mt-2 font-serif text-xl leading-relaxed text-ink-soft">{text}</p>
    </div>
  );
}
