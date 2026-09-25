/**
 * Choice lists used across the brief form, filters and matching. Edit labels freely;
 * keep `value`s stable because they appear in URLs and in delivered briefs.
 */
import type { Lifestyle } from "@/lib/engine/types";

export const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "either", label: "Open to both" },
] as const;

export const CONFIGURATIONS = [
  { value: "3", label: "3 BHK" },
  { value: "4", label: "4 BHK" },
  { value: "5+", label: "5+ BHK" },
] as const;

export const POSSESSION = [
  { value: "ready", label: "Ready to move" },
  { value: "12m", label: "Within 12 months" },
  { value: "1-3y", label: "1–3 years" },
  { value: "flexible", label: "Flexible" },
] as const;

export const BUDGET_BANDS = [
  { value: "3-5", label: "₹3–5 Cr", min: 3, max: 5 },
  { value: "5-7.5", label: "₹5–7.5 Cr", min: 5, max: 7.5 },
  { value: "7.5-10", label: "₹7.5–10 Cr", min: 7.5, max: 10 },
  { value: "10+", label: "₹10 Cr+", min: 10, max: null },
] as const;

/** Up to three may be chosen. `lifestyle` maps each priority onto the matching engine. */
export const PRIORITIES: readonly { value: string; label: string; lifestyle: Lifestyle }[] = [
  { value: "privacy", label: "Privacy", lifestyle: "privacy" },
  { value: "space", label: "Space", lifestyle: "large-homes" },
  { value: "design", label: "Design", lifestyle: "design" },
  { value: "community", label: "Community", lifestyle: "community" },
  { value: "central", label: "Central location", lifestyle: "central" },
  { value: "schools", label: "Schools", lifestyle: "schools" },
  { value: "airport", label: "Airport access", lifestyle: "airport" },
  { value: "greenery", label: "Greenery", lifestyle: "green" },
  { value: "architecture", label: "Architecture", lifestyle: "design" },
  { value: "value", label: "Long-term value", lifestyle: "investment" },
  { value: "amenities", label: "Lifestyle amenities", lifestyle: "premium-amenities" },
];

export const MAX_PRIORITIES = 3;

export const BASED_IN = [
  { value: "bengaluru", label: "Bengaluru" },
  { value: "india", label: "Elsewhere in India" },
  { value: "abroad", label: "Outside India" },
] as const;

export const CONTACT_PREFS = [
  { value: "call", label: "Call" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
] as const;

export const BEST_TIMES = [
  { value: "morning", label: "Morning (9–12)" },
  { value: "afternoon", label: "Afternoon (12–4)" },
  { value: "evening", label: "Evening (4–8)" },
  { value: "any", label: "Any time" },
] as const;

export const OPEN_TO_SUGGESTIONS = "open";
