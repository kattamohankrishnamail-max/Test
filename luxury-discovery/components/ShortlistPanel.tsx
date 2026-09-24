"use client";

import { useEffect } from "react";
import { locationText, priceText } from "@/lib/format";
import type { Property } from "@/lib/types";
import PropertyVisual from "./PropertyVisual";
import { Button, CloseButton } from "./ui";

export default function ShortlistPanel({
  properties,
  onClose,
  onOpen,
  onRemove,
  onAdvisor,
}: {
  properties: Property[];
  onClose: () => void;
  onOpen: (p: Property) => void;
  onRemove: (id: string) => void;
  onAdvisor: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close shortlist" onClick={onClose} className="fade absolute inset-0 bg-ink/40 backdrop-blur-[2px]" />
      <aside role="dialog" aria-modal="true" aria-label="Your shortlist" className="slide-in relative flex h-full w-full max-w-md flex-col bg-ivory">
        <div className="flex items-center justify-between px-8 pb-6 pt-8">
          <div>
            <p className="eyebrow">Your shortlist</p>
            <h2 className="mt-2 font-serif text-3xl">
              {properties.length ? `${properties.length} ${properties.length === 1 ? "home" : "homes"}` : "Nothing saved yet"}
            </h2>
          </div>
          <CloseButton onClick={onClose} />
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-8">
          {properties.length === 0 && (
            <p className="text-sm leading-relaxed text-ink-soft">Tap “Shortlist” on any home to keep it here while you explore.</p>
          )}
          {properties.map((p) => (
            <div key={p.id} className="flex gap-4 rounded-2xl border border-line bg-paper p-3">
              <button type="button" onClick={() => onOpen(p)} className="h-20 w-24 shrink-0 overflow-hidden rounded-xl" aria-label={`Open ${p.projectName}`}>
                <PropertyVisual property={p} />
              </button>
              <div className="min-w-0 flex-1 py-1">
                <button type="button" onClick={() => onOpen(p)} className="block truncate text-left font-serif text-lg leading-tight hover:underline">
                  {p.projectName}
                </button>
                <p className="truncate text-xs text-stone">{locationText(p)}</p>
                <p className="mt-1 text-xs text-ink-soft">{priceText(p)}</p>
              </div>
              <button type="button" onClick={() => onRemove(p.id)} className="self-start px-1 text-xs text-stone hover:text-ink" aria-label={`Remove ${p.projectName}`}>
                Remove
              </button>
            </div>
          ))}
        </div>
        {properties.length > 0 && (
          <div className="border-t border-line p-8">
            <Button className="w-full" onClick={onAdvisor}>
              Discuss my shortlist with an advisor
            </Button>
          </div>
        )}
      </aside>
    </div>
  );
}
