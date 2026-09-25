import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { DeliveredBrief } from "@/lib/brief/deliver";
import type { Dataset } from "@/lib/engine/types";

/** Desk data lives in ./data (git-ignored). Falls back to memory on read-only hosts. */
const DIR = path.join(process.cwd(), "data");
const DATASET = path.join(DIR, "desk-properties.json");
let memory: Dataset | null = null;

export async function loadDataset(): Promise<Dataset | null> {
  if (memory) return memory;
  try {
    memory = JSON.parse(await fs.readFile(DATASET, "utf8"));
  } catch {
    memory = null;
  }
  return memory;
}

export async function saveDataset(ds: Dataset): Promise<boolean> {
  memory = ds;
  try {
    await fs.mkdir(DIR, { recursive: true });
    await fs.writeFile(DATASET, JSON.stringify(ds));
    return true;
  } catch {
    return false;
  }
}

/** Briefs written by the `file` delivery adapter (BRIEF_DELIVERY=file). */
export async function loadBriefs(): Promise<DeliveredBrief[]> {
  try {
    return JSON.parse(await fs.readFile(path.join(DIR, "briefs.json"), "utf8"));
  } catch {
    return [];
  }
}
