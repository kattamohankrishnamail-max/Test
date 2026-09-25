"use client";

import { useSyncExternalStore } from "react";
import HomeCard from "@/components/homes/HomeCard";
import { SUBMITTED_KEY } from "@/lib/brief/prefill";
import type { HomeMeta, Market } from "@/lib/content/schemas";
import { briefToRequirements, homeToProperty, type SubmittedBrief } from "@/lib/engine/adapters";
import { scoreProperty } from "@/lib/engine/match";

const MIN_SCORE = 60;

function readBrief(): string | null {
  try {
    return sessionStorage.getItem(SUBMITTED_KEY);
  } catch {
    return null;
  }
}

/**
 * Scores the curated collection against the brief just submitted (kept in sessionStorage,
 * requirements only). Renders nothing without JavaScript or when nothing fits well.
 */
export default function CollectionMatches({
  homes,
  markets,
  title,
  intro,
}: {
  homes: HomeMeta[];
  markets: Market[];
  title: string;
  intro: string;
}) {
  const raw = useSyncExternalStore(
    () => () => {},
    readBrief,
    () => null,
  );
  if (!raw) return null;
  let brief: SubmittedBrief;
  try {
    brief = JSON.parse(raw);
  } catch {
    return null;
  }
  const req = briefToRequirements(brief, markets);
  const matches = homes
    .map((h) => ({ h, m: scoreProperty(homeToProperty(h, markets.find((x) => x.slug === h.microMarket)), req) }))
    .filter(({ h, m }) => m.score >= MIN_SCORE && (req.propertyType === "either" || h.type === req.propertyType))
    .sort((a, b) => b.m.score - a.m.score)
    .slice(0, 3);
  if (!matches.length) return null;
  const names = Object.fromEntries(markets.map((m) => [m.slug, m.name]));
  return (
    <section aria-labelledby="matches-title" className="mt-24">
      <h2 id="matches-title" className="display-md">
        {title}
      </h2>
      <p className="lede mt-3">{intro}</p>
      <ul className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {matches.map(({ h }) => (
          <li key={h.slug}>
            <HomeCard home={h} market={names[h.microMarket]} />
          </li>
        ))}
      </ul>
    </section>
  );
}
