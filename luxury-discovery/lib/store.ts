import { promises as fs } from "node:fs";
import path from "node:path";
import type { Dataset } from "./types.ts";

/**
 * Minimal persistence for the POC: the normalised dataset and enquiries live as JSON
 * files under ./data (git-ignored). If the filesystem is read-only (e.g. serverless),
 * we fall back to process memory so the demo still works for the life of the instance.
 */
const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
const DATASET_FILE = path.join(DATA_DIR, "properties.json");
const ENQUIRIES_FILE = path.join(DATA_DIR, "enquiries.json");

const memory: { dataset: Dataset | null; enquiries: Enquiry[] | null } = { dataset: null, enquiries: null };

export interface Enquiry {
  id: string;
  createdAt: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string | null;
  propertyIds: string[];
  propertyNames: string[];
  brief: string | null;
}

async function readJson<T>(file: string): Promise<T | null> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    return null;
  }
}

async function writeJson(file: string, data: unknown): Promise<boolean> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(file, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export async function loadDataset(): Promise<Dataset | null> {
  if (memory.dataset) return memory.dataset;
  memory.dataset = await readJson<Dataset>(DATASET_FILE);
  return memory.dataset;
}

export async function saveDataset(ds: Dataset): Promise<{ persisted: boolean }> {
  memory.dataset = ds;
  return { persisted: await writeJson(DATASET_FILE, ds) };
}

export async function clearDataset(): Promise<void> {
  memory.dataset = null;
  await fs.rm(DATASET_FILE, { force: true }).catch(() => {});
}

export async function loadEnquiries(): Promise<Enquiry[]> {
  if (memory.enquiries) return memory.enquiries;
  memory.enquiries = (await readJson<Enquiry[]>(ENQUIRIES_FILE)) ?? [];
  return memory.enquiries;
}

export async function addEnquiry(e: Enquiry): Promise<void> {
  const all = await loadEnquiries();
  all.unshift(e);
  await writeJson(ENQUIRIES_FILE, all);
}
