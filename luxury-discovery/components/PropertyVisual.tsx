"use client";

import { useState } from "react";
import type { Property } from "@/lib/types";

/** Tonal palette per zone, so placeholder panels feel considered rather than empty. */
const TONES: Record<string, [string, string]> = {
  east: ["#3c4a42", "#a79b86"],
  north: ["#39424d", "#b3a78f"],
  south: ["#4b3f36", "#c2ae90"],
  "south-east": ["#44403a", "#b9a58a"],
  west: ["#3e3a45", "#aa9f93"],
  central: ["#2d2a26", "#a88a5f"],
};

/**
 * Shows the sheet's image URL when one exists. Otherwise an abstract, clearly
 * non-photographic panel — we never substitute stock photography for a real project.
 */
export default function PropertyVisual({ property, className = "" }: { property: Property; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (property.imageUrl && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={property.imageUrl}
        alt={property.projectName}
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  const [dark, light] = TONES[(property.zone ?? "").toLowerCase()] ?? ["#3a3631", "#b0a28c"];
  const initials = property.projectName
    .replace(/\(.*?\)/g, "")
    .split(/[\s–-]+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
  const isVilla = property.typeGroups.includes("villa") && !property.typeGroups.includes("apartment");
  return (
    <div
      className={`relative flex h-full w-full items-end overflow-hidden ${className}`}
      style={{ background: `linear-gradient(155deg, ${dark} 0%, ${dark} 45%, ${light} 140%)` }}
      aria-hidden
    >
      <svg className="absolute inset-0 h-full w-full opacity-[0.16]" viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice">
        {isVilla ? (
          <g fill="none" stroke="#fff" strokeWidth="1">
            <path d="M40 240h320M70 240V170l70-45 70 45v70M210 240v-55h110v55M240 185v-25h50v25" />
            <path d="M95 240v-40h30v40M250 240v-30h30v30" />
          </g>
        ) : (
          <g fill="none" stroke="#fff" strokeWidth="1">
            <path d="M30 260h340" />
            <path d="M110 260V70h70v190M200 260V30h80v230M300 260V120h50v140" />
            {Array.from({ length: 14 }).map((_, i) => (
              <path key={i} d={`M205 ${50 + i * 15}h70`} />
            ))}
            {Array.from({ length: 11 }).map((_, i) => (
              <path key={`b${i}`} d={`M115 ${85 + i * 15}h60`} />
            ))}
          </g>
        )}
      </svg>
      <span className="absolute right-6 top-4 font-serif text-6xl font-medium text-white/15">{initials}</span>
    </div>
  );
}
