"use client";

import { useEffect, useState } from "react";
import { APARTMENT_BUDGETS, LIFESTYLE_CHOICES, LOCATION_CHOICES, POSSESSION_CHOICES, VILLA_BUDGETS } from "@/lib/config";
import { canonicalPlace } from "@/lib/locations";
import type { Requirements } from "@/lib/types";
import { Chip, Field } from "./ui";

/** Text-backed numeric input so partial entries like "5." survive re-renders. */
function NumberInput({
  value,
  onValue,
  className,
  placeholder,
}: {
  value: number | null;
  onValue: (n: number | null) => void;
  className: string;
  placeholder: string;
}) {
  const [text, setText] = useState(value?.toString() ?? "");
  useEffect(() => {
    const parsed = text.trim() ? Number(text.replace(/,/g, "")) : null;
    if (parsed !== value) setText(value === null ? "" : value.toLocaleString("en-IN", { useGrouping: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <input
      className={className}
      inputMode="decimal"
      placeholder={placeholder}
      value={text}
      onChange={(e) => {
        const v = e.target.value.replace(/[^\d.,]/g, "");
        setText(v);
        const n = Number(v.replace(/,/g, ""));
        onValue(v.trim() && Number.isFinite(n) && n > 0 ? n : null);
      }}
    />
  );
}

const toggle = <T,>(xs: T[], x: T) => (xs.includes(x) ? xs.filter((y) => y !== x) : [...xs, x]);

export default function BriefForm({ value, onChange }: { value: Requirements; onChange: (r: Requirements) => void }) {
  const [otherLocation, setOtherLocation] = useState("");
  const set = (patch: Partial<Requirements>) => onChange({ ...value, ...patch });
  const t = value.propertyType;

  const budgets =
    t === "villa" ? VILLA_BUDGETS : t === "apartment" ? APARTMENT_BUDGETS : [...APARTMENT_BUDGETS.slice(0, 3), ...VILLA_BUDGETS.slice(1)];
  const configs: { label: string; bedrooms: number[]; atLeast?: boolean; penthouse?: boolean }[] =
    t === "villa"
      ? [{ label: "4 BHK", bedrooms: [4] }, { label: "5 BHK", bedrooms: [5] }, { label: "6 BHK+", bedrooms: [6], atLeast: true }]
      : t === "apartment"
        ? [{ label: "3 BHK", bedrooms: [3] }, { label: "4 BHK", bedrooms: [4] }, { label: "5 BHK", bedrooms: [5] }, { label: "Penthouse", bedrooms: [], penthouse: true }]
        : [
            { label: "3 BHK", bedrooms: [3] },
            { label: "4 BHK", bedrooms: [4] },
            { label: "5 BHK", bedrooms: [5] },
            { label: "6 BHK+", bedrooms: [6], atLeast: true },
            { label: "Penthouse", bedrooms: [], penthouse: true },
          ];

  const budgetActive = (b: { min: number; max: number | null }) => value.budgetMinCr === b.min && value.budgetMaxCr === b.max;
  const extraLocations = value.locations.filter((l) => !LOCATION_CHOICES.includes(l));

  const addOther = () => {
    const v = otherLocation.trim();
    if (!v) return;
    set({ locations: [...new Set([...value.locations, canonicalPlace(v)])] });
    setOtherLocation("");
  };

  const inputCls =
    "w-full rounded-full border border-line bg-paper/70 px-5 py-2.5 text-sm text-ink placeholder:text-stone/70 focus:border-ink focus:outline-none";

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <Field label="Property type">
        <div className="flex flex-wrap gap-2">
          {(["apartment", "villa", "either"] as const).map((pt) => (
            <Chip key={pt} active={t === pt} onClick={() => set({ propertyType: pt, bedrooms: [], penthouse: false })}>
              {pt === "either" ? "Either" : pt[0].toUpperCase() + pt.slice(1)}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label="Configuration">
        <div className="flex flex-wrap gap-2">
          {configs.map((c) => {
            const active = c.penthouse ? value.penthouse : c.bedrooms.every((b) => value.bedrooms.includes(b)) && c.bedrooms.length > 0;
            return (
              <Chip
                key={c.label}
                active={active}
                onClick={() =>
                  c.penthouse
                    ? set({ penthouse: !value.penthouse })
                    : set({ bedrooms: active ? value.bedrooms.filter((b) => !c.bedrooms.includes(b)) : [...new Set([...value.bedrooms, ...c.bedrooms])], bedroomsAtLeast: !!c.atLeast })
                }
              >
                {c.label}
              </Chip>
            );
          })}
        </div>
      </Field>

      <Field label="Preferred locations" hint="Select any">
        <div className="flex flex-wrap gap-2">
          {LOCATION_CHOICES.map((l) => (
            <Chip key={l} active={value.locations.includes(l)} onClick={() => set({ locations: toggle(value.locations, l) })}>
              {l}
            </Chip>
          ))}
          {extraLocations.map((l) => (
            <Chip key={l} active onClick={() => set({ locations: toggle(value.locations, l) })}>
              {l} ×
            </Chip>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className={inputCls}
            placeholder="Other — e.g. Jakkur, Bannerghatta Road"
            value={otherLocation}
            onChange={(e) => setOtherLocation(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addOther())}
          />
          <button type="button" onClick={addOther} className="rounded-full border border-line px-4 text-sm text-ink-soft hover:border-ink hover:text-ink">
            Add
          </button>
        </div>
      </Field>

      <Field label="Budget">
        <div className="flex flex-wrap gap-2">
          {budgets.map((b) => (
            <Chip
              key={b.label}
              active={budgetActive(b)}
              onClick={() => set(budgetActive(b) ? { budgetMinCr: null, budgetMaxCr: null } : { budgetMinCr: b.min, budgetMaxCr: b.max })}
            >
              {b.label}
            </Chip>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-stone">
          <NumberInput className={inputCls} placeholder="Min ₹ Cr" value={value.budgetMinCr} onValue={(n) => set({ budgetMinCr: n })} />
          <span>to</span>
          <NumberInput className={inputCls} placeholder="Max ₹ Cr" value={value.budgetMaxCr} onValue={(n) => set({ budgetMaxCr: n })} />
        </div>
      </Field>

      <Field label="Size" hint="Minimum, in sq ft">
        <NumberInput className={inputCls} placeholder="e.g. 3500" value={value.minAreaSqft} onValue={(n) => set({ minAreaSqft: n })} />
      </Field>

      <Field label="Possession">
        <div className="flex flex-wrap gap-2">
          {POSSESSION_CHOICES.map((p) => (
            <Chip key={p.value} active={value.possession === p.value} onClick={() => set({ possession: value.possession === p.value ? null : p.value })}>
              {p.label}
            </Chip>
          ))}
        </div>
      </Field>

      <div className="md:col-span-2">
        <Field label="What matters to you">
          <div className="flex flex-wrap gap-2">
            {LIFESTYLE_CHOICES.map((l) => (
              <Chip key={l.value} active={value.lifestyle.includes(l.value)} onClick={() => set({ lifestyle: toggle(value.lifestyle, l.value) })}>
                {l.label}
              </Chip>
            ))}
          </div>
        </Field>
      </div>
    </div>
  );
}
