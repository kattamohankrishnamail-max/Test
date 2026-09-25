/**
 * Hash router for the single-file demo: "#/homes/home-a?x=y" ↔ "/homes/home-a?x=y".
 * Hashes that don't start with "#/" (e.g. "#main") are left to the browser.
 */
const listeners = new Set<() => void>();

export function currentUrl(): { path: string; search: string } {
  const h = window.location.hash;
  if (!h.startsWith("#/")) return { path: "/", search: "" };
  const raw = h.slice(1);
  const q = raw.indexOf("?");
  const path = (q === -1 ? raw : raw.slice(0, q)).replace(/\/+$/, "") || "/";
  return { path, search: q === -1 ? "" : raw.slice(q) };
}

export function toHash(href: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(href)) return href;
  return `#${href.startsWith("/") ? href : `/${href}`}`;
}

export function navigate(href: string) {
  window.location.hash = toHash(href).slice(1);
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

window.addEventListener("hashchange", () => {
  if (window.location.hash && !window.location.hash.startsWith("#/")) return;
  listeners.forEach((fn) => fn());
});
