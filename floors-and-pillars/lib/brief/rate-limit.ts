/**
 * In-memory sliding-window rate limit. Good enough for a single server or for local
 * development. On serverless hosts (e.g. Vercel) each instance keeps its own window,
 * so swap `check` for a shared store (Redis, KV, etc.) before relying on it at scale.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX = 5;
const hits = new Map<string, number[]>();

export function rateLimit(key: string, now = Date.now()): { ok: boolean; retryAfterSec: number } {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX) {
    hits.set(key, recent);
    return { ok: false, retryAfterSec: Math.ceil((WINDOW_MS - (now - recent[0])) / 1000) };
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  return { ok: true, retryAfterSec: 0 };
}

export function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "local").trim();
}
