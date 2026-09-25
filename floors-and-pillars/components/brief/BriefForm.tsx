"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import {
  BASED_IN,
  BEST_TIMES,
  BUDGET_BANDS,
  CONFIGURATIONS,
  CONTACT_PREFS,
  MAX_PRIORITIES,
  OPEN_TO_SUGGESTIONS,
  POSSESSION,
  PRIORITIES,
  PROPERTY_TYPES,
} from "@/content/options";
import { briefPage as copy } from "@/content/pages/brief";
import { track } from "@/lib/analytics";
import { HONEYPOT_FIELD } from "@/lib/brief/honeypot";
import { DESCRIBE_KEY, SUBMITTED_KEY, draftFromText, type BriefDraft } from "@/lib/brief/prefill";
import { STEP_TITLES } from "@/lib/brief/steps";

// Zod + phone metadata are sizeable; load them on first interaction, not with the page.
const loadSchema = () => import("@/lib/brief/schema");

interface Values {
  propertyType: string;
  configurations: string[];
  minSizeSqft: string;
  possession: string;
  budget: string;
  areas: string[];
  priorities: string[];
  notes: string;
  name: string;
  phone: string;
  email: string;
  basedIn: string;
  contactPref: string;
  bestTime: string;
  consent: boolean;
  description: string;
}

/** Which step each field lives on, to jump back to server-side errors. */
const FIELD_STEP: Record<string, number> = {
  propertyType: 0,
  configurations: 0,
  minSizeSqft: 0,
  possession: 0,
  budget: 1,
  areas: 1,
  priorities: 2,
  notes: 2,
  name: 3,
  phone: 3,
  email: 3,
  basedIn: 3,
  contactPref: 3,
  bestTime: 3,
  consent: 3,
};

const subscribe = () => () => {};

export default function BriefForm({
  initial,
  markets,
  homeName,
  errorCode,
}: {
  initial: BriefDraft;
  markets: { slug: string; name: string; zone: string }[];
  homeName?: string;
  errorCode?: string;
}) {
  const router = useRouter();
  // true once hydrated: the form upgrades from one long page to four steps.
  const enhanced = useSyncExternalStore(subscribe, () => true, () => false);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [banner, setBanner] = useState<string | null>(
    errorCode === "rate" ? copy.rateLimited : errorCode === "delivery" ? copy.serverError : errorCode ? copy.errorSummary : null,
  );
  const [prefillNote, setPrefillNote] = useState<string | null>(null);
  const started = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [v, setV] = useState<Values>({
    propertyType: initial.propertyType ?? "",
    configurations: initial.configurations,
    minSizeSqft: initial.minSizeSqft ?? "",
    possession: initial.possession ?? "",
    budget: initial.budget ?? "",
    areas: initial.areas,
    priorities: initial.priorities,
    notes: "",
    name: "",
    phone: "",
    email: "",
    basedIn: "",
    contactPref: "",
    bestTime: "",
    consent: false,
    description: initial.description ?? "",
  });

  const set = (patch: Partial<Values>) => {
    if (!started.current) {
      started.current = true;
      track("brief_start", { source: "brief_page" });
      void loadSchema();
    }
    setV((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => {
      const next = { ...prev };
      for (const k of Object.keys(patch)) delete next[k];
      return next;
    });
  };

  const applyText = (text: string, onlyEmpty: boolean) => {
    const found = draftFromText(text, markets);
    setV((prev) => {
      const next = { ...prev };
      const fill = <K extends keyof Values>(k: K, val: Values[K] | undefined) => {
        if (val === undefined) return;
        const empty = Array.isArray(prev[k]) ? (prev[k] as unknown[]).length === 0 : !prev[k];
        if (!onlyEmpty || empty) next[k] = val;
      };
      fill("propertyType", found.propertyType);
      fill("configurations", found.configurations);
      fill("minSizeSqft", found.minSizeSqft);
      fill("possession", found.possession);
      fill("budget", found.budget);
      fill("areas", found.areas);
      fill("priorities", found.priorities);
      return next;
    });
    setPrefillNote(Object.keys(found).length ? copy.describe.applied : copy.describe.nothing);
  };

  // Pick up a description typed into the home-page teaser.
  useEffect(() => {
    let text: string | null = null;
    try {
      text = sessionStorage.getItem(DESCRIBE_KEY);
      sessionStorage.removeItem(DESCRIBE_KEY);
    } catch {
      /* storage unavailable */
    }
    const fromUrl = initial.description;
    const source = text ?? fromUrl;
    if (source) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from sessionStorage
      setV((prev) => ({ ...prev, description: source }));
      applyText(source, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stepValues = (shapeKeys: string[]) => {
    const all = { ...v, consent: v.consent ? true : undefined, bestTime: v.bestTime || undefined } as Record<string, unknown>;
    // Empty text fields stay "" so their own messages show; empty choices become undefined.
    const TEXT = new Set(["minSizeSqft", "name", "phone", "email", "notes"]);
    return Object.fromEntries(shapeKeys.map((k) => [k, all[k] === "" && !TEXT.has(k) ? undefined : all[k]]));
  };

  const validateStep = async (i: number) => {
    const { STEPS, fieldErrors } = await loadSchema();
    const r = STEPS[i].safeParse(stepValues(Object.keys(STEPS[i].shape)));
    if (r.success) return true;
    setErrors(fieldErrors(r.error));
    requestAnimationFrame(() => {
      const first = formRef.current?.querySelector<HTMLElement>(`[data-step="${i}"] [aria-invalid="true"]`);
      first?.focus();
    });
    return false;
  };

  const goTo = (i: number) => {
    setStep(i);
    requestAnimationFrame(() => {
      document.getElementById(`step-${i}-title`)?.focus();
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const next = async () => {
    if (!(await validateStep(step))) return;
    track("brief_step_complete", { step: step + 1, name: STEP_TITLES[step] });
    goTo(step + 1);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!enhanced) return; // native POST
    e.preventDefault();
    const form = e.currentTarget; // capture before any await: currentTarget is cleared after dispatch
    setBanner(null);
    for (let i = 0; i < STEP_TITLES.length; i++) {
      if (!(await validateStep(i))) {
        if (i !== step) goTo(i);
        return;
      }
    }
    setStatus("sending");
    const fd = new FormData(form);
    const payload = {
      ...v,
      consent: v.consent,
      bestTime: v.bestTime || undefined,
      home: initial.home,
      [HONEYPOT_FIELD]: fd.get(HONEYPOT_FIELD) ?? "",
    };
    const res = await fetch("/api/brief", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => null);
    const body = res ? await res.json().catch(() => null) : null;
    if (!res?.ok) {
      setStatus("idle");
      if (body?.errors) {
        setErrors(body.errors);
        const firstStep = Math.min(...Object.keys(body.errors).map((k) => FIELD_STEP[k] ?? 3));
        setBanner(copy.errorSummary);
        goTo(firstStep);
      } else {
        setBanner(body?.error ?? copy.serverError);
      }
      return;
    }
    track("brief_submit", { propertyType: v.propertyType, budget: v.budget, home: initial.home ?? null });
    try {
      // Only the home requirements travel to the thank-you page — never contact details.
      const { propertyType, configurations, minSizeSqft, possession, budget, areas, priorities } = v;
      sessionStorage.setItem(
        SUBMITTED_KEY,
        JSON.stringify({ propertyType, configurations, minSizeSqft, possession, budget, areas, priorities }),
      );
    } catch {
      /* matches simply won't show */
    }
    router.push("/brief/thank-you");
  };

  const L = copy.labels;
  const visible = (i: number) => !enhanced || step === i;
  const err = (k: string) => errors[k];

  return (
    <form
      ref={formRef}
      method="post"
      action="/api/brief"
      noValidate={enhanced}
      onSubmit={submit}
      className="scroll-mt-28"
      aria-describedby={banner ? "brief-banner" : undefined}
    >
      {homeName && (
        <p className="mb-8 border-l-2 border-bronze pl-4 text-ink-soft">
          {copy.enquiringAbout} <span className="font-medium text-ink">{homeName}</span>
        </p>
      )}
      {initial.home && <input type="hidden" name="home" value={initial.home} />}

      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      {banner && (
        <p id="brief-banner" role="alert" className="mb-8 border border-error bg-white px-5 py-4 text-[0.95rem] text-error">
          {banner}
        </p>
      )}

      {/* Free text → pre-fill */}
      <div className="mb-12 bg-white p-6 sm:p-8">
        <label htmlFor="description" className="display-sm block">
          {copy.describe.label}
        </label>
        <p id="description-hint" className="mt-1 text-[0.92rem] text-stone">
          {copy.describe.hint}
        </p>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={v.description}
          onChange={(e) => set({ description: e.target.value })}
          placeholder={copy.describe.placeholder}
          aria-describedby="description-hint"
          className="mt-4 w-full resize-y border border-line bg-limestone/40 px-4 py-3 text-ink placeholder:text-stone focus:border-ink focus:outline-none"
        />
        {enhanced && (
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => v.description.trim() && applyText(v.description, false)}
              disabled={!v.description.trim()}
              className="inline-flex min-h-11 items-center border border-ink px-5 text-[0.92rem] text-ink transition-colors hover:bg-ink hover:text-limestone disabled:cursor-not-allowed disabled:opacity-40"
            >
              {copy.describe.button}
            </button>
            {prefillNote && (
              <p role="status" className="text-[0.92rem] text-verdigris">
                {prefillNote}
              </p>
            )}
          </div>
        )}
      </div>

      <p className="mb-6 text-[0.9rem] text-stone">{copy.requiredNote}</p>
      {enhanced && (
        <ol className="mb-10 grid grid-cols-4 gap-2" aria-label="Progress">
          {STEP_TITLES.map((t, i) => (
            <li key={t} aria-current={i === step ? "step" : undefined}>
              <span className={`block h-0.5 ${i <= step ? "bg-ink" : "bg-line"}`} />
              <span className={`mt-2 hidden text-[0.8rem] sm:block ${i === step ? "text-ink" : "text-stone"}`}>
                {i + 1}. {t}
              </span>
            </li>
          ))}
          <li className="col-span-4 text-[0.85rem] text-stone sm:hidden">
            Step {step + 1} of 4 · {STEP_TITLES[step]}
          </li>
        </ol>
      )}

      {/* Step 1 */}
      <StepShell i={0} visible={visible(0)} title={STEP_TITLES[0]}>
        <Choice label={L.propertyType} name="propertyType" type="radio" options={PROPERTY_TYPES} value={v.propertyType} onChange={(x) => set({ propertyType: x as string })} error={err("propertyType")} required />
        <Choice label={L.configurations} name="configurations" type="checkbox" options={CONFIGURATIONS} value={v.configurations} onChange={(x) => set({ configurations: x as string[] })} error={err("configurations")} required />
        <TextField label={L.minSizeSqft} hint={L.minSizeHint} name="minSizeSqft" inputMode="numeric" value={v.minSizeSqft} onChange={(x) => set({ minSizeSqft: x.replace(/[^\d]/g, "") })} error={err("minSizeSqft")} />
        <Choice label={L.possession} name="possession" type="radio" options={POSSESSION} value={v.possession} onChange={(x) => set({ possession: x as string })} error={err("possession")} required />
      </StepShell>

      {/* Step 2 */}
      <StepShell i={1} visible={visible(1)} title={STEP_TITLES[1]}>
        <Choice label={L.budget} name="budget" type="radio" options={BUDGET_BANDS} value={v.budget} onChange={(x) => set({ budget: x as string })} error={err("budget")} required />
        <Choice
          label={L.areas}
          hint={L.areasHint}
          name="areas"
          type="checkbox"
          options={[...markets.map((m) => ({ value: m.slug, label: m.name })), { value: OPEN_TO_SUGGESTIONS, label: L.openToSuggestions }]}
          value={v.areas}
          onChange={(x) => set({ areas: x as string[] })}
          error={err("areas")}
          required
        />
      </StepShell>

      {/* Step 3 */}
      <StepShell i={2} visible={visible(2)} title={STEP_TITLES[2]}>
        <Choice
          label={L.priorities}
          hint={`${L.prioritiesHint} · ${v.priorities.length}/${MAX_PRIORITIES}`}
          name="priorities"
          type="checkbox"
          options={PRIORITIES}
          value={v.priorities}
          max={MAX_PRIORITIES}
          onChange={(x) => set({ priorities: x as string[] })}
          error={err("priorities")}
          required
        />
        <div>
          <label htmlFor="notes" className="text-[0.95rem] font-medium text-ink">
            {L.notes}
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            value={v.notes}
            onChange={(e) => set({ notes: e.target.value })}
            aria-invalid={!!err("notes")}
            aria-describedby={err("notes") ? "notes-error" : undefined}
            className="mt-3 w-full resize-y border border-line bg-white px-4 py-3 text-ink focus:border-ink focus:outline-none"
          />
          <FieldError id="notes-error" error={err("notes")} />
        </div>
      </StepShell>

      {/* Step 4 */}
      <StepShell i={3} visible={visible(3)} title={STEP_TITLES[3]}>
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField label={L.name} name="name" autoComplete="name" value={v.name} onChange={(x) => set({ name: x })} error={err("name")} required />
          <TextField label={L.email} name="email" type="email" autoComplete="email" value={v.email} onChange={(x) => set({ email: x })} error={err("email")} required />
          <div className="sm:col-span-2">
            <TextField label={L.phone} hint={L.phoneHint} name="phone" type="tel" autoComplete="tel" value={v.phone} onChange={(x) => set({ phone: x })} error={err("phone")} required />
          </div>
        </div>
        <Choice label={L.basedIn} name="basedIn" type="radio" options={BASED_IN} value={v.basedIn} onChange={(x) => set({ basedIn: x as string })} error={err("basedIn")} required />
        <Choice label={L.contactPref} name="contactPref" type="radio" options={CONTACT_PREFS} value={v.contactPref} onChange={(x) => set({ contactPref: x as string })} error={err("contactPref")} required />
        <Choice label={L.bestTime} name="bestTime" type="radio" options={BEST_TIMES} value={v.bestTime} onChange={(x) => set({ bestTime: x as string })} error={err("bestTime")} />
        <div>
          <label className="flex min-h-11 cursor-pointer items-start gap-3 text-[0.95rem] text-ink-soft">
            <input
              type="checkbox"
              name="consent"
              checked={v.consent}
              onChange={(e) => set({ consent: e.target.checked })}
              aria-invalid={!!err("consent")}
              aria-describedby={err("consent") ? "consent-error" : undefined}
              required
              className="mt-1 h-5 w-5 shrink-0 accent-[var(--verdigris)]"
            />
            <span>
              {L.consent}{" "}
              <Link href="/privacy" className="link" target="_blank">
                {L.privacyLink}
              </Link>
              .
            </span>
          </label>
          <FieldError id="consent-error" error={err("consent")} />
        </div>
      </StepShell>

      <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-line pt-8">
        {enhanced && step > 0 && (
          <button type="button" onClick={() => goTo(step - 1)} className="inline-flex min-h-12 items-center px-2 text-[0.95rem] text-ink-soft underline-offset-4 hover:text-ink hover:underline">
            ← {copy.back}
          </button>
        )}
        {enhanced && step < STEP_TITLES.length - 1 ? (
          <button type="button" onClick={next} className="ml-auto inline-flex min-h-12 items-center bg-ink px-8 text-[0.95rem] tracking-wide text-limestone hover:bg-verdigris">
            {copy.continue}
          </button>
        ) : (
          <button
            type="submit"
            disabled={status === "sending"}
            className="ml-auto inline-flex min-h-12 items-center bg-ink px-8 text-[0.95rem] tracking-wide text-limestone hover:bg-verdigris disabled:opacity-60"
          >
            {status === "sending" ? copy.submitting : copy.submit}
          </button>
        )}
      </div>
    </form>
  );
}

function StepShell({
  i,
  visible,
  title,
  children,
}: {
  i: number;
  visible: boolean;
  title: string;
  children: ReactNode;
}) {
  return (
    <section data-step={i} hidden={!visible} aria-labelledby={`step-${i}-title`} className="mb-14 space-y-10">
      <h2
        id={`step-${i}-title`}
        tabIndex={-1}
        className="display-md focus:outline-none"
      >
        <span className="mr-3 font-serif text-bronze">{String(i + 1).padStart(2, "0")}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="mt-2 text-[0.9rem] text-error">
      {error}
    </p>
  );
}

function Choice({
  label,
  hint,
  name,
  type,
  options,
  value,
  onChange,
  error,
  required,
  max,
}: {
  label: string;
  hint?: string;
  name: string;
  type: "radio" | "checkbox";
  options: readonly { value: string; label: string }[];
  value: string | string[];
  onChange: (v: string | string[]) => void;
  error?: string;
  required?: boolean;
  max?: number;
}) {
  const selected = Array.isArray(value) ? value : value ? [value] : [];
  const errorId = `${name}-error`;
  return (
    <fieldset
      aria-describedby={error ? errorId : hint ? `${name}-hint` : undefined}
      {...(type === "radio" ? { role: "radiogroup", "aria-required": required || undefined } : {})}
    >
      <legend className="text-[0.95rem] font-medium text-ink">
        {label}
        {!required && <span className="ml-2 font-normal text-stone">(optional)</span>}
      </legend>
      {hint && (
        <p id={`${name}-hint`} className="mt-1 text-[0.88rem] text-stone">
          {hint}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const checked = selected.includes(o.value);
          const disabled = type === "checkbox" && !!max && !checked && selected.length >= max;
          return (
            <label
              key={o.value}
              className={`inline-flex min-h-11 cursor-pointer items-center border px-4 text-[0.95rem] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-verdigris ${
                checked ? "border-ink bg-ink text-limestone" : error ? "border-error bg-white text-ink-soft" : "border-line bg-white text-ink-soft hover:border-stone"
              } ${disabled ? "cursor-not-allowed opacity-45" : ""}`}
            >
              <input
                type={type}
                name={name}
                value={o.value}
                checked={checked}
                disabled={disabled}
                aria-invalid={!!error}
                onChange={() => {
                  if (type === "radio") onChange(o.value);
                  else onChange(checked ? selected.filter((x) => x !== o.value) : [...selected, o.value]);
                }}
                className="sr-only"
              />
              {o.label}
            </label>
          );
        })}
      </div>
      <FieldError id={errorId} error={error} />
    </fieldset>
  );
}

function TextField({
  label,
  hint,
  name,
  value,
  onChange,
  error,
  type = "text",
  inputMode,
  autoComplete,
  required,
}: {
  label: string;
  hint?: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  inputMode?: "numeric" | "tel" | "email" | "text";
  autoComplete?: string;
  required?: boolean;
}) {
  const describedBy = [hint ? `${name}-hint` : null, error ? `${name}-error` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={name} className="text-[0.95rem] font-medium text-ink">
        {label}
        {!required && <span className="ml-2 font-normal text-stone">(optional)</span>}
      </label>
      {hint && (
        <p id={`${name}-hint`} className="mt-1 text-[0.88rem] text-stone">
          {hint}
        </p>
      )}
      <input
        id={name}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={`mt-3 min-h-12 w-full border bg-white px-4 text-ink focus:border-ink focus:outline-none ${error ? "border-error" : "border-line"}`}
      />
      <FieldError id={`${name}-error`} error={error} />
    </div>
  );
}
