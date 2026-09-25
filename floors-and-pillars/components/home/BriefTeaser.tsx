"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BUDGET_BANDS, MAX_PRIORITIES, PRIORITIES, PROPERTY_TYPES } from "@/content/options";
import { home } from "@/content/pages/home";
import { track } from "@/lib/analytics";
import { DESCRIBE_KEY } from "@/lib/brief/prefill";

/**
 * Compact brief. A native GET form to /brief, so it works without JavaScript; with JS the
 * free-text description travels via sessionStorage rather than the URL.
 */
export default function BriefTeaser() {
  const router = useRouter();
  const [priorities, setPriorities] = useState<string[]>([]);
  const [describe, setDescribe] = useState("");

  const toggle = (v: string) =>
    setPriorities((p) => (p.includes(v) ? p.filter((x) => x !== v) : p.length < MAX_PRIORITIES ? [...p, v] : p));

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    for (const key of ["type", "budget"]) {
      const v = data.get(key);
      if (typeof v === "string" && v) params.set(key, v);
    }
    if (priorities.length) params.set("priorities", priorities.join(","));
    try {
      if (describe.trim()) sessionStorage.setItem(DESCRIBE_KEY, describe.trim());
    } catch {
      if (describe.trim()) params.set("describe", describe.trim());
    }
    track("brief_start", { source: "home_teaser" });
    router.push(`/brief${params.size ? `?${params}` : ""}`);
  };

  const chip =
    "inline-flex min-h-11 cursor-pointer items-center border border-line bg-white px-4 text-[0.92rem] text-ink-soft transition-colors has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-limestone has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-verdigris";

  return (
    <form action="/brief" method="get" onSubmit={submit} className="bg-white p-6 sm:p-10" aria-labelledby="teaser-title">
      <p className="eyebrow">{home.teaser.eyebrow}</p>
      <h2 id="teaser-title" className="display-md mt-3">
        {home.teaser.title}
      </h2>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <fieldset>
          <legend className="text-[0.85rem] font-medium text-ink">Home type</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {PROPERTY_TYPES.map((t) => (
              <label key={t.value} className={chip}>
                <input type="radio" name="type" value={t.value} className="sr-only" />
                {t.label}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-[0.85rem] font-medium text-ink">Budget</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {BUDGET_BANDS.map((b) => (
              <label key={b.value} className={chip}>
                <input type="radio" name="budget" value={b.value} className="sr-only" />
                {b.label}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="lg:col-span-2">
          <legend className="text-[0.85rem] font-medium text-ink">
            What matters most <span className="font-normal text-stone">— choose up to three</span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {PRIORITIES.map((p) => {
              const checked = priorities.includes(p.value);
              const disabled = !checked && priorities.length >= MAX_PRIORITIES;
              return (
                <label key={p.value} className={`${chip} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}>
                  <input
                    type="checkbox"
                    name="priorities"
                    value={p.value}
                    className="sr-only"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => toggle(p.value)}
                  />
                  {p.label}
                </label>
              );
            })}
          </div>
        </fieldset>
        <div className="lg:col-span-2">
          <label htmlFor="teaser-describe" className="text-[0.85rem] font-medium text-ink">
            {home.teaser.describeLabel} <span className="font-normal text-stone">(optional)</span>
          </label>
          <textarea
            id="teaser-describe"
            name="describe"
            rows={2}
            value={describe}
            onChange={(e) => setDescribe(e.target.value)}
            placeholder={home.teaser.describePlaceholder}
            className="mt-3 w-full resize-none border border-line bg-limestone/40 px-4 py-3 text-[0.98rem] text-ink placeholder:text-stone focus:border-ink focus:outline-none"
          />
        </div>
      </div>

      <button type="submit" className="mt-8 inline-flex min-h-12 items-center bg-ink px-8 text-[0.95rem] tracking-wide text-limestone transition-colors hover:bg-verdigris">
        {home.teaser.cta}
      </button>
    </form>
  );
}
