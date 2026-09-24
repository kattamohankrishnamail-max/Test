import type { Property, Requirements } from "./types.ts";

/**
 * Browser-side data access for the discovery page. The Next.js app talks to its API
 * routes; the standalone HTML build swaps this module for standalone/client-api.ts.
 */

export async function loadProperties(): Promise<Property[]> {
  const res = await fetch("/api/properties");
  const body = await res.json();
  return body.properties ?? [];
}

/** Returns AI/server-extracted requirements, or null to keep the local rule-based result. */
export async function extractBrief(text: string): Promise<Requirements | null> {
  const res = await fetch("/api/extract", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text }),
  }).catch(() => null);
  const body = res?.ok ? await res.json().catch(() => null) : null;
  return body?.requirements ?? null;
}

export interface EnquiryInput {
  name: string;
  phone: string;
  email: string;
  message: string;
  brief: string;
  propertyIds: string[];
  propertyNames: string[];
}

/** Resolves to an error message, or null on success. */
export async function sendEnquiry(input: EnquiryInput): Promise<string | null> {
  const res = await fetch("/api/enquiry", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  }).catch(() => null);
  if (res?.ok) return null;
  const body = await res?.json().catch(() => null);
  return body?.error ?? "We couldn't send that just now. Please try again.";
}
