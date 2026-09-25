"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BRAND } from "@/lib/brand";
import { extractBrief, loadProperties } from "@/lib/client-api";
import { LIFESTYLE_CHOICES, POSSESSION_CHOICES } from "@/lib/config";
import { extractRequirements, mergeRequirements } from "@/lib/extract";
import { formatCr } from "@/lib/format";
import { matchProperties, scoreProperty } from "@/lib/match";
import { emptyRequirements, type Match, type MatchResult, type Property, type Requirements } from "@/lib/types";
import AdvisorModal from "./AdvisorModal";
import BriefForm from "./BriefForm";
import PropertyCard from "./PropertyCard";
import PropertyDetail from "./PropertyDetail";
import ShortlistPanel from "./ShortlistPanel";
import { Button, HeartIcon } from "./ui";

const EXAMPLES = [
  "I'm looking for a 4 BHK apartment around ₹5 crore in East Bengaluru, preferably something spacious and low density, for my family.",
  "Looking for a large 4 BHK for my family. Prefer something quiet and green, but I need reasonable access to Whitefield.",
  "A private villa in North Bengaluru with good airport access, ₹8–15 Cr, 5 BHK.",
];

const SHORTLIST_KEY = "rd-shortlist";

function briefChips(r: Requirements): string[] {
  const chips: string[] = [];
  if (r.propertyType !== "either") chips.push(r.propertyType === "villa" ? "Villa" : "Apartment");
  if (r.bedrooms.length) chips.push(`${r.bedrooms.join(" / ")} BHK${r.bedroomsAtLeast ? "+" : ""}`);
  if (r.penthouse) chips.push("Penthouse");
  if (r.budgetMinCr !== null && r.budgetMaxCr !== null) chips.push(`${formatCr(r.budgetMinCr)} – ${formatCr(r.budgetMaxCr)}`);
  else if (r.budgetMaxCr !== null) chips.push(`Up to ${formatCr(r.budgetMaxCr)}`);
  else if (r.budgetMinCr !== null) chips.push(`${formatCr(r.budgetMinCr)}+`);
  chips.push(...r.locations);
  if (r.minAreaSqft) chips.push(`${r.minAreaSqft.toLocaleString("en-IN")}+ sq ft`);
  if (r.possession) chips.push(POSSESSION_CHOICES.find((p) => p.value === r.possession)!.label);
  chips.push(...r.lifestyle.map((l) => LIFESTYLE_CHOICES.find((c) => c.value === l)!.label));
  const covered = /spacious|low density|green|quiet|privacy|amenities|golf|central|airport|schools|community|design|investment|rental|private villa/;
  chips.push(...r.notes.filter((n) => !covered.test(n)).map((n) => n[0].toUpperCase() + n.slice(1)));
  return chips;
}

export default function Discovery() {
  const [properties, setProperties] = useState<Property[] | null>(null);
  const [text, setText] = useState("");
  const [explicit, setExplicit] = useState<Requirements>(emptyRequirements);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState<Requirements | null>(null);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [detail, setDetail] = useState<Match | null>(null);
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [shortlistOpen, setShortlistOpen] = useState(false);
  const [advisorFor, setAdvisorFor] = useState<Property[] | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProperties()
      .then(setProperties)
      .catch(() => setProperties([]));
    try {
      setShortlist(JSON.parse(localStorage.getItem(SHORTLIST_KEY) ?? "[]"));
    } catch {
      /* private mode — shortlist just won't persist */
    }
  }, []);

  const saveShortlist = (ids: string[]) => {
    setShortlist(ids);
    try {
      localStorage.setItem(SHORTLIST_KEY, JSON.stringify(ids));
    } catch {
      /* ignore */
    }
  };
  const toggleShortlist = (id: string) => saveShortlist(shortlist.includes(id) ? shortlist.filter((x) => x !== id) : [...shortlist, id]);

  const byId = useMemo(() => new Map((properties ?? []).map((p) => [p.id, p])), [properties]);
  const shortlisted = shortlist.map((id) => byId.get(id)).filter((p): p is Property => !!p);

  const hasInput = text.trim().length > 0 || JSON.stringify(explicit) !== JSON.stringify(emptyRequirements());

  const curate = async () => {
    if (!properties || !hasInput) return;
    setLoading(true);
    const started = Date.now();
    let fromText = extractRequirements(text);
    if (text.trim()) {
      fromText = (await extractBrief(text)) ?? fromText;
    }
    const merged = mergeRequirements(fromText, explicit);
    const out = matchProperties(properties, merged);
    // A brief, deliberate pause reads as curation rather than a filter.
    await new Promise((r) => setTimeout(r, Math.max(0, 900 - (Date.now() - started))));
    setBrief(merged);
    setResult(out);
    setLoading(false);
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const openProperty = useCallback(
    (p: Property) => {
      setShortlistOpen(false);
      setDetail(brief ? scoreProperty(p, brief) : { property: p, score: 0, criteria: [], reasons: [], gaps: [], exact: false });
    },
    [brief],
  );

  const refine = () => {
    if (brief) setExplicit(brief);
    setShowDetails(true);
    document.getElementById("brief")?.scrollIntoView({ behavior: "smooth" });
  };

  const noData = properties !== null && properties.length === 0;

  const cards = (list: Match[], offset = 0) => (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {list.map((m, i) => (
        <PropertyCard
          key={m.property.id}
          match={m}
          index={i + offset}
          shortlisted={shortlist.includes(m.property.id)}
          onDetails={() => setDetail(m)}
          onShortlist={() => toggleShortlist(m.property.id)}
          onAdvisor={() => setAdvisorFor([m.property])}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7 sm:px-10">
        <a href="#" onClick={(e) => (e.preventDefault(), window.scrollTo({ top: 0, behavior: "smooth" }))} className="leading-none">
          <span className="font-serif text-2xl tracking-wide">{BRAND.name}</span>
          <span className="mt-1 block text-[0.62rem] uppercase tracking-[0.24em] text-stone">{BRAND.tagline}</span>
        </a>
        <button
          type="button"
          onClick={() => setShortlistOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-ink-soft transition hover:border-ink hover:text-ink"
        >
          <HeartIcon filled={shortlisted.length > 0} className={shortlisted.length ? "text-brass" : ""} />
          Shortlist{shortlisted.length ? ` · ${shortlisted.length}` : ""}
        </button>
      </header>

      <main>
        <section id="brief" className="mx-auto max-w-4xl px-6 pb-20 pt-12 sm:px-10 sm:pt-20">
          <p className="eyebrow rise">{BRAND.name} · Private residences</p>
          <h1 className="rise mt-6 font-serif text-5xl leading-[1.02] tracking-tight sm:text-7xl" style={{ animationDelay: "80ms" }}>
            Find a Home That
            <br />
            <em className="font-normal text-brass">Fits Your Life.</em>
          </h1>
          <p className="rise mt-6 max-w-xl text-lg leading-relaxed text-ink-soft" style={{ animationDelay: "160ms" }}>
            Tell us what you&apos;re looking for. We&apos;ll curate the right luxury apartments and villas in Bengaluru.
          </p>

          <div className="rise mt-12 rounded-[32px] border border-line bg-paper p-6 shadow-[0_30px_80px_-50px_rgba(29,27,24,0.4)] sm:p-10" style={{ animationDelay: "240ms" }}>
            <label htmlFor="brief-text" className="font-serif text-2xl italic text-ink sm:text-3xl">
              Tell us about the home you&apos;re looking for…
            </label>
            <textarea
              id="brief-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => (e.metaKey || e.ctrlKey) && e.key === "Enter" && curate()}
              rows={4}
              placeholder="The size of home, where you'd like to be, the budget you have in mind, and anything that matters to your family."
              className="mt-5 w-full resize-none border-0 border-b border-line bg-transparent pb-4 text-lg leading-relaxed text-ink placeholder:text-stone/60 focus:border-ink focus:outline-none"
            />
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone">
              <span>Try:</span>
              {EXAMPLES.map((ex, i) => (
                <button key={i} type="button" onClick={() => setText(ex)} className="text-left italic underline-offset-4 hover:text-ink hover:underline">
                  {["“4 BHK around ₹5 Cr, East Bengaluru”", "“Quiet and green, near Whitefield”", "“Villa with airport access”"][i]}
                </button>
              ))}
            </div>

            <div className="mt-8 border-t border-line pt-6">
              <button
                type="button"
                onClick={() => setShowDetails((s) => !s)}
                aria-expanded={showDetails}
                className="flex w-full items-center justify-between text-left text-sm text-ink-soft hover:text-ink"
              >
                <span>
                  Refine with a few details <span className="text-stone">(optional)</span>
                </span>
                <span className={`text-xl transition-transform duration-500 ${showDetails ? "rotate-45" : ""}`}>+</span>
              </button>
              {showDetails && (
                <div className="fade mt-8">
                  <BriefForm value={explicit} onChange={setExplicit} />
                </div>
              )}
            </div>

            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-stone">
                {properties === null ? "Loading our collection…" : noData ? "Our collection is being updated." : `Curated from ${properties.length} residences in our collection.`}
              </p>
              <Button onClick={curate} disabled={!hasInput || loading || !properties?.length}>
                {loading ? "Curating your shortlist…" : "Curate my shortlist"}
              </Button>
            </div>
          </div>

          {noData && (
            <p className="mt-6 text-center text-sm text-stone">
              No property database is loaded yet.{" "}
              <a href="/admin" className="text-brass underline underline-offset-4">
                Upload one in the admin area
              </a>
              .
            </p>
          )}
        </section>

        <div ref={resultsRef} className="scroll-mt-6">
          {result && brief && (
            <section className="border-t border-line bg-paper/40">
              <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10">
                <div className="fade max-w-3xl">
                  <p className="eyebrow">Your brief, as we understood it</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {briefChips(brief).map((c) => (
                      <span key={c} className="rounded-full border border-line bg-paper px-3.5 py-1.5 text-sm text-ink-soft">
                        {c}
                      </span>
                    ))}
                    <button type="button" onClick={refine} className="px-2 text-sm text-brass underline underline-offset-4">
                      Refine
                    </button>
                  </div>
                  <h2 className="mt-12 font-serif text-4xl leading-tight sm:text-5xl">{result.summary}</h2>
                  {result.explanation && !result.exact.length && <p className="mt-4 text-lg leading-relaxed text-ink-soft">{result.explanation}</p>}
                </div>

                {result.exact.length > 0 && <div className="mt-14">{cards(result.exact)}</div>}

                {result.alternatives.length > 0 && (
                  <div className={result.exact.length ? "mt-24" : "mt-14"}>
                    {result.exact.length > 0 && (
                      <div className="mb-10 max-w-3xl">
                        <p className="eyebrow">Also worth considering</p>
                        <p className="mt-3 font-serif text-3xl">Close to your brief</p>
                        {result.explanation && <p className="mt-3 text-ink-soft">{result.explanation}</p>}
                      </div>
                    )}
                    {cards(result.alternatives, result.exact.length)}
                  </div>
                )}

                <div className="mt-24 flex flex-col items-start justify-between gap-6 rounded-[28px] bg-forest px-8 py-10 text-paper sm:flex-row sm:items-center sm:px-12">
                  <div>
                    <p className="font-serif text-3xl">Prefer to talk it through?</p>
                    <p className="mt-2 max-w-lg text-sm text-paper/70">
                      A private advisor can walk you through these homes, arrange site visits and share what isn&apos;t on paper.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAdvisorFor(shortlisted)}
                    className="rounded-full bg-paper px-6 py-3 text-sm text-ink transition hover:bg-brass-soft"
                  >
                    Talk to an advisor
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="mx-auto max-w-7xl px-6 py-12 text-xs text-stone sm:px-10">
        <p>
          Every property detail shown comes from our curated database. Where information isn&apos;t recorded, we say so — we never invent prices,
          amenities or possession dates.
        </p>
      </footer>

      {detail && (
        <PropertyDetail
          match={detail}
          shortlisted={shortlist.includes(detail.property.id)}
          onClose={() => setDetail(null)}
          onShortlist={() => toggleShortlist(detail.property.id)}
          onAdvisor={() => setAdvisorFor([detail.property])}
        />
      )}
      {shortlistOpen && (
        <ShortlistPanel
          properties={shortlisted}
          onClose={() => setShortlistOpen(false)}
          onOpen={openProperty}
          onRemove={(id) => toggleShortlist(id)}
          onAdvisor={() => setAdvisorFor(shortlisted)}
        />
      )}
      {advisorFor && <AdvisorModal properties={advisorFor} brief={text} onClose={() => setAdvisorFor(null)} />}
    </div>
  );
}
