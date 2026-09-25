import parsePhone from "libphonenumber-js/min";
import { z } from "zod";
import {
  BASED_IN,
  BEST_TIMES,
  BUDGET_BANDS,
  CONFIGURATIONS,
  CONTACT_PREFS,
  MAX_PRIORITIES,
  POSSESSION,
  PRIORITIES,
  PROPERTY_TYPES,
} from "@/content/options";

/** Shared by the browser (per-step validation) and the API route (final validation). */

const values = <T extends readonly { value: string }[]>(xs: T) => xs.map((x) => x.value) as [T[number]["value"], ...T[number]["value"][]];

/** Validates Indian numbers without a prefix and international numbers with +country code. */
export function normalisePhone(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const parsed = parsePhone(trimmed, "IN");
  return parsed?.isValid() ? parsed.number : null;
}

export const StepHome = z.object({
  propertyType: z.enum(values(PROPERTY_TYPES), { error: "Choose a home type." }),
  configurations: z.array(z.enum(values(CONFIGURATIONS))).min(1, "Choose at least one configuration."),
  minSizeSqft: z
    .union([z.literal(""), z.coerce.number().int().min(500, "Enter a size in sq ft, e.g. 3000.").max(30000, "That seems too large — please check.")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? null : v)),
  possession: z.enum(values(POSSESSION), { error: "Choose a possession timeline." }),
});

export const StepBudget = z.object({
  budget: z.enum(values(BUDGET_BANDS), { error: "Choose a budget band." }),
  areas: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(1, "Choose at least one area, or “Open to suggestions”."),
});

export const StepPriorities = z.object({
  priorities: z
    .array(z.enum(PRIORITIES.map((p) => p.value) as [string, ...string[]]))
    .min(1, "Choose at least one priority.")
    .max(MAX_PRIORITIES, `Choose up to ${MAX_PRIORITIES}.`),
  notes: z.string().trim().max(2000, "Please keep this under 2,000 characters.").optional().default(""),
});

export const StepYou = z.object({
  name: z.string().trim().min(2, "Please tell us your name.").max(120),
  phone: z
    .string()
    .trim()
    .min(1, "Please share a phone number.")
    .refine((v) => normalisePhone(v) !== null, "Enter a valid number — include the country code (e.g. +44) if outside India."),
  email: z.string().trim().email("Enter a valid email address.").max(160),
  basedIn: z.enum(values(BASED_IN), { error: "Tell us where you're based." }),
  contactPref: z.enum(values(CONTACT_PREFS), { error: "Choose how we should contact you." }),
  bestTime: z.enum(values(BEST_TIMES)).optional(),
  consent: z.literal(true, { error: "Please agree so we can contact you about your brief." }),
});

export const BriefSchema = StepHome.extend(StepBudget.shape)
  .extend(StepPriorities.shape)
  .extend(StepYou.shape)
  .extend({
    description: z.string().trim().max(2000).optional().default(""),
    home: z.string().regex(/^[a-z0-9-]+$/).optional(),
  });

export type Brief = z.infer<typeof BriefSchema>;
export const STEPS = [StepHome, StepBudget, StepPriorities, StepYou] as const;
export const STEP_TITLES = ["The home", "Budget & location", "What matters most", "You"] as const;

/** Converts form data (native POST or FormData from JS) into the shape the schema expects. */
export function formDataToInput(fd: FormData | URLSearchParams) {
  const all = (k: string) => fd.getAll(k).map(String).filter(Boolean);
  const one = (k: string) => {
    const v = fd.get(k);
    return typeof v === "string" && v !== "" ? v : undefined;
  };
  return {
    propertyType: one("propertyType"),
    configurations: all("configurations"),
    minSizeSqft: one("minSizeSqft") ?? "",
    possession: one("possession"),
    budget: one("budget"),
    areas: all("areas"),
    priorities: all("priorities"),
    notes: one("notes") ?? "",
    name: one("name") ?? "",
    phone: one("phone") ?? "",
    email: one("email") ?? "",
    basedIn: one("basedIn"),
    contactPref: one("contactPref"),
    bestTime: one("bestTime"),
    consent: fd.get("consent") === "on" || fd.get("consent") === "true" ? true : undefined,
    description: one("description") ?? "",
    home: one("home"),
  };
}

/** First error message per field, for inline display. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}
