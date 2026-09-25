"use client";

import { useState, useSyncExternalStore } from "react";
import { BUDGET_BANDS } from "@/content/options";
import { homesPage as copy } from "@/content/pages/homes";
import type { HomeMeta } from "@/lib/content/schemas";
import HomeCard from "./HomeCard";

const subscribe = () => () => {};

/** Two simple chip filters (type, budget). No sorting, no counts. Filters appear only with JS. */
export default function HomesGrid({ homes, marketNames }: { homes: HomeMeta[]; marketNames: Record<string, string> }) {
  const enhanced = useSyncExternalStore(subscribe, () => true, () => false);
  const [type, setType] = useState<"all" | "apartment" | "villa">("all");
  const [band, setBand] = useState<string>("all");
  const shown = homes.filter((h) => (type === "all" || h.type === type) && (band === "all" || h.priceBand === band));

  const chip = (active: boolean) =>
    `inline-flex min-h-11 items-center border px-4 text-[0.92rem] transition-colors ${
      active ? "border-ink bg-ink text-limestone" : "border-line bg-white text-ink-soft hover:border-stone"
    }`;

  return (
    <>
      {enhanced && (
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8" role="group" aria-label="Filter the collection">
          <div className="flex flex-wrap gap-2">
            {(["all", "apartment", "villa"] as const).map((t) => (
              <button key={t} type="button" aria-pressed={type === t} className={chip(type === t)} onClick={() => setType(t)}>
                {t === "all" ? copy.filterAll : t === "apartment" ? "Apartments" : "Villas"}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {[{ value: "all", label: "Any budget" }, ...BUDGET_BANDS].map((b) => (
              <button key={b.value} type="button" aria-pressed={band === b.value} className={chip(band === b.value)} onClick={() => setBand(b.value)}>
                {b.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {shown.length ? (
        <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((h) => (
            <li key={h.slug}>
              <HomeCard home={h} market={marketNames[h.microMarket]} headingLevel="h2" />
            </li>
          ))}
        </ul>
      ) : (
        <p className="lede" role="status">
          {copy.empty}
        </p>
      )}
    </>
  );
}
