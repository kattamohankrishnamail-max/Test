"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BUDGET_BANDS, PRIORITIES } from "@/content/options";
import type { DeliveredBrief } from "@/lib/brief/deliver";
import type { Market } from "@/lib/content/schemas";
import { briefToRequirements } from "@/lib/engine/adapters";
import { extractRequirements, mergeRequirements, toSpecJson } from "@/lib/engine/extract";
import { areaText, locationText, or, priceText } from "@/lib/engine/format";
import { matchProperties } from "@/lib/engine/match";
import type { DatasetMeta, Match, Property, Requirements } from "@/lib/engine/types";

interface DeskData {
  dataset: { meta: DatasetMeta; stats: { total: number; visible: number; apartments: number; villas: number }; properties: Property[] } | null;
  briefs: DeliveredBrief[];
  delivery: string;
}

const PASS_KEY = "fp-desk-passcode";

function briefLabel(b: DeliveredBrief) {
  const band = BUDGET_BANDS.find((x) => x.value === b.budget)?.label ?? b.budget;
  return `${b.name} · ${b.propertyType} · ${b.configurations.join("/")} BHK · ${band}`;
}

function requirementsFor(b: DeliveredBrief, markets: Market[]): Requirements {
  const structured = briefToRequirements(b, markets);
  const text = [b.description, b.notes].filter(Boolean).join(". ");
  return text ? mergeRequirements(extractRequirements(text), structured) : structured;
}

function shortlistText(matches: Match[], who: string) {
  return [
    `Shortlist — first cut for ${who}`,
    "",
    ...matches.map((m, i) =>
      [
        `${i + 1}. ${m.property.projectName} (${or(m.property.developer)}) — ${m.score}% fit`,
        `   ${locationText(m.property)} · ${or(m.property.configurationLabel)} · ${areaText(m.property)} · ${priceText(m.property)} · Possession ${or(m.property.possessionLabel)}`,
        ...m.reasons.map((r) => `   + ${r}`),
        ...m.gaps.map((g) => `   – ${g}`),
      ].join("\n"),
    ),
    "",
    "All details from our property database; verify pricing and availability before sharing.",
  ].join("\n");
}

export default function DeskApp({ needsPasscode, markets }: { needsPasscode: boolean; markets: Market[] }) {
  const [passcode, setPasscode] = useState("");
  const [locked, setLocked] = useState(needsPasscode);
  const [data, setData] = useState<DeskData | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | "manual" | null>(null);
  const [manual, setManual] = useState("");
  const [copied, setCopied] = useState(false);

  const headers = useCallback((code: string): HeadersInit => (code ? { "x-desk-passcode": code } : {}), []);

  const load = useCallback(
    async (code: string) => {
      const res = await fetch("/api/desk/data", { headers: headers(code) });
      if (res.status === 401) {
        setLocked(true);
        return;
      }
      setLocked(false);
      setData(await res.json());
    },
    [headers],
  );

  useEffect(() => {
    let saved = "";
    try {
      saved = sessionStorage.getItem(PASS_KEY) ?? "";
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- restore passcode once on mount
    setPasscode(saved);
    load(saved);
  }, [load]);

  const upload = async (file: File) => {
    setMessage("Reading workbook…");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/desk/upload", { method: "POST", body: fd, headers: headers(passcode) }).catch(() => null);
    const body = await res?.json().catch(() => null);
    if (!res?.ok) return setMessage(body?.error ?? "Upload failed.");
    setMessage(`Loaded ${body.stats.total} properties (${body.stats.visible} active) from ${file.name}.${body.persisted ? "" : " Held in memory only."}`);
    load(passcode);
  };

  const brief = data?.briefs.find((b) => b.id === selected) ?? null;
  const requirements = useMemo<Requirements | null>(() => {
    if (selected === "manual") return manual.trim() ? extractRequirements(manual) : null;
    return brief ? requirementsFor(brief, markets) : null;
  }, [selected, manual, brief, markets]);

  const result = useMemo(
    () => (requirements && data?.dataset ? matchProperties(data.dataset.properties, requirements) : null),
    [requirements, data],
  );
  const shortlist = result ? [...result.exact, ...result.alternatives] : [];

  if (locked) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          try {
            sessionStorage.setItem(PASS_KEY, passcode);
          } catch {
            /* ignore */
          }
          load(passcode);
        }}
        className="max-w-sm space-y-4"
      >
        <label htmlFor="desk-pass" className="block font-medium">
          Desk passcode
        </label>
        <input id="desk-pass" type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} className="min-h-12 w-full border border-line bg-white px-4" />
        <button className="min-h-12 bg-ink px-6 text-limestone">Open desk</button>
      </form>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[22rem_1fr]">
      <aside className="space-y-8">
        <section className="bg-white p-6">
          <h2 className="font-medium">Property database</h2>
          {data?.dataset ? (
            <p className="mt-2 text-[0.92rem] text-ink-soft">
              {data.dataset.meta.fileName}: {data.dataset.stats.total} rows, {data.dataset.stats.visible} active ({data.dataset.stats.apartments} apartments,{" "}
              {data.dataset.stats.villas} villas).
            </p>
          ) : (
            <p className="mt-2 text-[0.92rem] text-stone">None loaded yet.</p>
          )}
          <label className="mt-4 inline-flex min-h-11 cursor-pointer items-center border border-ink px-4 text-[0.92rem] hover:bg-ink hover:text-limestone">
            {data?.dataset ? "Replace .xlsx" : "Upload .xlsx"}
            <input type="file" accept=".xlsx" className="sr-only" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          </label>
          {message && (
            <p role="status" className="mt-3 text-[0.88rem] text-verdigris">
              {message}
            </p>
          )}
        </section>

        <section className="bg-white p-6">
          <h2 className="font-medium">Briefs</h2>
          {data && data.briefs.length === 0 && (
            <p className="mt-2 text-[0.88rem] text-stone">
              No stored briefs. Set <code>BRIEF_DELIVERY=file</code> to keep website briefs here (currently: {data.delivery}).
            </p>
          )}
          <ul className="mt-3 space-y-1">
            {data?.briefs.map((b) => (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => setSelected(b.id)}
                  aria-pressed={selected === b.id}
                  className={`w-full px-3 py-2 text-left text-[0.9rem] ${selected === b.id ? "bg-ink text-limestone" : "hover:bg-limestone"}`}
                >
                  {briefLabel(b)}
                  <span className="block text-[0.78rem] opacity-70">{new Date(b.receivedAt).toLocaleString("en-IN")}</span>
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => setSelected("manual")}
                aria-pressed={selected === "manual"}
                className={`w-full px-3 py-2 text-left text-[0.9rem] ${selected === "manual" ? "bg-ink text-limestone" : "hover:bg-limestone"}`}
              >
                Type or paste a brief…
              </button>
            </li>
          </ul>
        </section>
      </aside>

      <section aria-live="polite">
        {selected === "manual" && (
          <textarea
            aria-label="Brief text"
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            rows={4}
            placeholder="e.g. 4 BHK apartment around ₹6 Cr in East Bengaluru, low density, ready within a year"
            className="mb-8 w-full border border-line bg-white px-4 py-3"
          />
        )}
        {brief && (
          <div className="mb-8 bg-white p-6 text-[0.92rem] text-ink-soft">
            <p className="font-medium text-ink">{brief.name}</p>
            <p>
              {brief.phone} · {brief.email} · prefers {brief.contactPref}
              {brief.bestTime ? ` (${brief.bestTime})` : ""} · based {brief.basedIn}
            </p>
            <p className="mt-2">
              Areas: {brief.areaNames.join(", ") || "Open to suggestions"} · Priorities:{" "}
              {brief.priorities.map((p) => PRIORITIES.find((x) => x.value === p)?.label ?? p).join(", ")}
            </p>
            {brief.homeName && <p>Asked about: {brief.homeName}</p>}
            {brief.description && <p className="mt-2 italic">“{brief.description}”</p>}
            {brief.notes && <p className="mt-2">Notes: {brief.notes}</p>}
          </div>
        )}
        {requirements && (
          <details className="mb-8 text-[0.85rem] text-stone">
            <summary className="cursor-pointer">How the engine read this brief</summary>
            <pre className="mt-2 overflow-x-auto bg-white p-4">{JSON.stringify(toSpecJson(requirements), null, 2)}</pre>
          </details>
        )}
        {!data?.dataset && <p className="text-stone">Upload the property database to see matches.</p>}
        {result && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="display-sm">{result.summary}</h2>
              {shortlist.length > 0 && (
                <button
                  type="button"
                  className="min-h-11 border border-ink px-4 text-[0.9rem] hover:bg-ink hover:text-limestone"
                  onClick={async () => {
                    await navigator.clipboard.writeText(shortlistText(shortlist, brief?.name ?? "client"));
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  {copied ? "Copied" : "Copy as text"}
                </button>
              )}
            </div>
            {result.explanation && <p className="mt-2 text-ink-soft">{result.explanation}</p>}
            <ol className="mt-6 space-y-4">
              {shortlist.map((m) => (
                <li key={m.property.id} className="bg-white p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <p className="display-sm">{m.property.projectName}</p>
                    <span className="text-[0.9rem] text-verdigris">
                      {m.score}% fit{m.exact ? "" : " · near match"}
                    </span>
                  </div>
                  <p className="text-[0.9rem] text-stone">
                    {or(m.property.developer)} · {locationText(m.property)}
                  </p>
                  <p className="mt-2 text-[0.9rem] text-ink">
                    {or(m.property.configurationLabel)} · {areaText(m.property)} · {priceText(m.property)} · Possession {or(m.property.possessionLabel)}
                  </p>
                  <ul className="mt-3 space-y-1 text-[0.9rem] text-ink-soft">
                    {m.reasons.map((r) => (
                      <li key={r}>+ {r}</li>
                    ))}
                    {m.gaps.map((g) => (
                      <li key={g} className="text-[#8a3a2b]">
                        – {g}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </>
        )}
      </section>
    </div>
  );
}
