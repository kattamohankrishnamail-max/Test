"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { BUDGET_BANDS, CONFIGURATIONS, POSSESSION, PRIORITIES, PROPERTY_TYPES } from "@/content/options";
import { home } from "@/content/pages/home";
import { track } from "@/lib/analytics";
import { DESCRIBE_KEY, draftFromText } from "@/lib/brief/prefill";
import type { Market } from "@/lib/content/schemas";
import { extractRequirements } from "@/lib/engine/extract";

const label = <T extends { value: string; label: string }>(list: readonly T[], v?: string) => list.find((x) => x.value === v)?.label;
const cr = (n: number) => `₹${Number(n.toFixed(2))} Cr`;

/**
 * The product, working: the same rule-based reader that pre-fills the brief form, run live
 * in the browser as the visitor types. Nothing leaves the page until they continue.
 */
export default function BriefReader({ markets }: { markets: Market[] }) {
  const c = home.reader;
  const router = useRouter();
  const [text, setText] = useState("");
  const [started, setStarted] = useState(false);

  const rows = useMemo(() => {
    const t = text.trim();
    if (!t) return null;
    const r = extractRequirements(t);
    const d = draftFromText(t, markets);
    const budget =
      r.budgetMinCr !== null && r.budgetMaxCr !== null
        ? `${cr(r.budgetMinCr)} to ${cr(r.budgetMaxCr)}`
        : r.budgetMaxCr !== null
          ? `Around or under ${cr(r.budgetMaxCr)}`
          : r.budgetMinCr !== null
            ? `From ${cr(r.budgetMinCr)}`
            : undefined;
    const bandLabel = label(BUDGET_BANDS, d.budget);
    return [
      { key: c.rows.type, value: label(PROPERTY_TYPES, d.propertyType) },
      { key: c.rows.configuration, value: d.configurations?.map((v) => label(CONFIGURATIONS, v)).join(", ") || (r.penthouse ? "Penthouse" : undefined) },
      { key: c.rows.budget, value: budget && bandLabel ? `${budget} (band ${bandLabel})` : budget },
      { key: c.rows.areas, value: r.locations.length ? r.locations.join(", ") : undefined },
      { key: c.rows.timeline, value: label(POSSESSION, d.possession) },
      { key: c.rows.size, value: r.minAreaSqft ? `${r.minAreaSqft.toLocaleString("en-IN")} sq ft or more` : undefined },
      { key: c.rows.priorities, value: d.priorities?.map((v) => label(PRIORITIES, v)).join(", ") || undefined },
    ];
  }, [text, markets, c.rows]);

  const found = rows?.filter((r) => r.value).length ?? 0;

  const update = (v: string) => {
    if (!started && v.trim()) {
      setStarted(true);
      track("brief_start", { source: "home_reader" });
    }
    setText(v);
  };

  const continueToBrief = () => {
    try {
      sessionStorage.setItem(DESCRIBE_KEY, text.trim());
      router.push("/brief");
    } catch {
      router.push(`/brief?describe=${encodeURIComponent(text.trim())}`);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-x-6 gap-y-10">
      <div className="col-span-12 lg:col-span-6">
        <label htmlFor="reader-text" className="label">
          {c.label}
        </label>
        <textarea
          id="reader-text"
          rows={6}
          value={text}
          onChange={(e) => update(e.target.value)}
          placeholder={c.placeholder}
          className="mt-3 w-full resize-y border border-ink bg-paper p-5 font-serif text-[1.6rem] leading-snug text-ink placeholder:text-stone focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4"
        />
        <p className="label mt-6">{c.tryLabel}</p>
        <ul className="mt-2 border-t border-line">
          {c.examples.map((ex) => (
            <li key={ex} className="border-b border-line">
              <button type="button" onClick={() => update(ex)} className="min-h-11 w-full py-2 text-left text-[0.95rem] text-ink-soft hover:text-ink hover:underline">
                {ex}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="col-span-12 lg:col-span-6">
        <div className="flex items-baseline justify-between border-b border-ink pb-2">
          <p className="label">{c.readingTitle}</p>
          <p className="text-[0.82rem] text-stone" aria-live="polite">
            {rows ? `${found} of ${rows.length} read` : c.empty}
          </p>
        </div>
        <table className="w-full text-left">
          <caption className="sr-only">{c.readingTitle}</caption>
          <tbody>
            {(rows ?? Object.values(c.rows).map((key) => ({ key, value: undefined }))).map((r) => (
              <tr key={r.key} className="border-b border-line">
                <th scope="row" className="w-40 py-3 pr-4 align-top text-[0.82rem] font-semibold tracking-[0.04em] text-stone">
                  {r.key}
                </th>
                <td className={`py-3 align-top text-[1rem] ${r.value ? "text-ink" : "text-stone"}`}>{r.value ?? (rows ? c.notYet : "")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <button
            type="button"
            onClick={continueToBrief}
            disabled={!text.trim()}
            className="inline-flex min-h-12 items-center bg-ink px-7 text-[0.92rem] font-medium text-limestone hover:bg-verdigris disabled:cursor-not-allowed disabled:bg-stone"
          >
            {c.cta}
          </button>
          <p className="text-[0.88rem] text-stone">{c.note}</p>
        </div>
      </div>
    </div>
  );
}
