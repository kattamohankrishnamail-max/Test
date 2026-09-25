import { createHmac, randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Brief } from "./schema";

/**
 * Pluggable brief delivery. Choose with BRIEF_DELIVERY:
 *   console (default) · webhook · email · file
 * Add a provider by writing a `Deliverer` and registering it below — no vendor is hard-coded.
 */

export interface DeliveredBrief extends Brief {
  id: string;
  receivedAt: string;
  homeName?: string;
  areaNames: string[];
}

type Deliverer = (brief: DeliveredBrief) => Promise<void>;

const consoleDeliverer: Deliverer = async (brief) => {
  console.info("[brief] received\n" + JSON.stringify(brief, null, 2));
};

/** POSTs JSON to BRIEF_WEBHOOK_URL (Zapier, Make, n8n, a CRM endpoint, Slack workflow…). */
const webhookDeliverer: Deliverer = async (brief) => {
  const url = process.env.BRIEF_WEBHOOK_URL;
  if (!url) throw new Error("BRIEF_DELIVERY=webhook but BRIEF_WEBHOOK_URL is not set");
  const body = JSON.stringify({ type: "brief", brief });
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (process.env.BRIEF_WEBHOOK_SECRET) {
    headers["x-brief-signature"] = createHmac("sha256", process.env.BRIEF_WEBHOOK_SECRET).update(body).digest("hex");
  }
  const res = await fetch(url, { method: "POST", headers, body, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
};

/**
 * Email stub. To connect a provider:
 *   1. install its SDK or use fetch against its HTTP API,
 *   2. read credentials from env (never commit them),
 *   3. send `formatBriefText(brief)` to your advisory inbox,
 *   4. set BRIEF_DELIVERY=email.
 */
const emailDeliverer: Deliverer = async () => {
  throw new Error("Email delivery is not configured. See lib/brief/deliver.ts (emailDeliverer).");
};

/** Appends to data/briefs.json so the advisor desk can open briefs. Self-hosted / dev only. */
const fileDeliverer: Deliverer = async (brief) => {
  const dir = path.join(process.cwd(), "data");
  const file = path.join(dir, "briefs.json");
  await fs.mkdir(dir, { recursive: true });
  let all: DeliveredBrief[] = [];
  try {
    all = JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    /* first brief */
  }
  all.unshift(brief);
  await fs.writeFile(file, JSON.stringify(all, null, 2));
};

const REGISTRY: Record<string, Deliverer> = {
  console: consoleDeliverer,
  webhook: webhookDeliverer,
  email: emailDeliverer,
  file: fileDeliverer,
};

export function newBriefMeta() {
  return { id: randomUUID(), receivedAt: new Date().toISOString() };
}

export async function deliver(brief: DeliveredBrief): Promise<void> {
  const mode = process.env.BRIEF_DELIVERY || "console";
  const fn = REGISTRY[mode];
  if (!fn) throw new Error(`Unknown BRIEF_DELIVERY "${mode}"`);
  await fn(brief);
}

/** Plain-text rendering for email or chat providers. */
export function formatBriefText(b: DeliveredBrief): string {
  return [
    `New brief ${b.id} — ${b.receivedAt}`,
    b.homeName ? `Asking about: ${b.homeName}` : null,
    `Name: ${b.name}`,
    `Phone: ${b.phone} · Email: ${b.email}`,
    `Based in: ${b.basedIn} · Prefers: ${b.contactPref}${b.bestTime ? ` (${b.bestTime})` : ""}`,
    `Home: ${b.propertyType}, ${b.configurations.join("/")} BHK${b.minSizeSqft ? `, ${b.minSizeSqft}+ sq ft` : ""}, possession ${b.possession}`,
    `Budget: ${b.budget} Cr · Areas: ${b.areaNames.join(", ") || "Open to suggestions"}`,
    `Priorities: ${b.priorities.join(", ")}`,
    b.notes ? `Notes: ${b.notes}` : null,
    b.description ? `In their words: ${b.description}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export interface ContactMessage {
  id: string;
  receivedAt: string;
  name: string;
  phone: string;
  message: string;
}

/** Short contact-page messages use the same BRIEF_DELIVERY channel. */
export async function deliverMessage(msg: ContactMessage): Promise<void> {
  const mode = process.env.BRIEF_DELIVERY || "console";
  if (mode === "console") {
    console.info("[contact] received\n" + JSON.stringify(msg, null, 2));
  } else if (mode === "webhook") {
    const url = process.env.BRIEF_WEBHOOK_URL;
    if (!url) throw new Error("BRIEF_WEBHOOK_URL is not set");
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "contact", message: msg }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  } else if (mode === "file") {
    const file = path.join(process.cwd(), "data", "messages.json");
    await fs.mkdir(path.dirname(file), { recursive: true });
    let all: ContactMessage[] = [];
    try {
      all = JSON.parse(await fs.readFile(file, "utf8"));
    } catch {
      /* first message */
    }
    await fs.writeFile(file, JSON.stringify([msg, ...all], null, 2));
  } else {
    throw new Error(`Contact delivery via "${mode}" is not configured. See lib/brief/deliver.ts.`);
  }
}
