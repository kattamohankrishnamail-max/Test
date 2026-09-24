import type { EnquiryInput } from "../lib/client-api.ts";
import { publicProperties } from "../lib/stats.ts";
import type { Dataset, Property, Requirements } from "../lib/types.ts";

/**
 * Standalone (single HTML file) data access: everything stays in this browser.
 * The uploaded workbook is parsed in the page and kept in localStorage.
 */

const DATA_KEY = "rd-standalone-dataset";
const ENQUIRY_KEY = "rd-standalone-enquiries";

let current: Dataset | null = null;

export function getDataset(): Dataset | null {
  if (current) return current;
  try {
    const raw = localStorage.getItem(DATA_KEY);
    current = raw ? (JSON.parse(raw) as Dataset) : null;
  } catch {
    current = null;
  }
  return current;
}

/** Returns false when the browser refused to store it (the data still works until the tab closes). */
export function setDataset(ds: Dataset | null): boolean {
  current = ds;
  try {
    if (ds) localStorage.setItem(DATA_KEY, JSON.stringify(ds));
    else localStorage.removeItem(DATA_KEY);
    return true;
  } catch {
    return false;
  }
}

export async function loadProperties(): Promise<Property[]> {
  const ds = getDataset();
  return ds ? publicProperties(ds) : [];
}

/** No server here, so the rule-based extractor's result is used as-is. */
export async function extractBrief(_text: string): Promise<Requirements | null> {
  return null;
}

export interface LocalEnquiry extends EnquiryInput {
  createdAt: string;
}

export function getEnquiries(): LocalEnquiry[] {
  try {
    return JSON.parse(localStorage.getItem(ENQUIRY_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export async function sendEnquiry(input: EnquiryInput): Promise<string | null> {
  if (!input.name.trim() || (!input.phone.trim() && !input.email.trim())) {
    return "Please share your name and a phone number or email.";
  }
  try {
    localStorage.setItem(ENQUIRY_KEY, JSON.stringify([{ ...input, createdAt: new Date().toISOString() }, ...getEnquiries()]));
  } catch {
    /* demo only */
  }
  return null;
}
