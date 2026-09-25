// Builds dist/floors-and-pillars.html — the whole site as one file you can double-click.
//
//   SHOW_DRAFTS=1 npm run build && SHOW_DRAFTS=1 npm start      (in one terminal)
//   BASE_URL=http://localhost:3000 npm run build:html           (in another)
//
// Every route is captured from the running production server, so pages are exactly what
// the site renders. Interactive parts (brief, teaser, filters, menu, contact form) are
// re-mounted from the same components; fonts and styles are inlined. The advisor desk is
// left out — it needs a server.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.env.BASE_URL ?? "http://localhost:3000";

const staticRoutes = ["/", "/brief", "/brief/thank-you", "/homes", "/advisory", "/bengaluru", "/journal", "/about", "/contact", "/privacy", "/terms"];
const slugs = (dir) => readdirSync(path.join(root, "content", dir)).filter((f) => f.endsWith(".mdx")).map((f) => f.replace(/\.mdx$/, ""));
const routes = [
  ...staticRoutes,
  ...slugs("homes").map((s) => `/homes/${s}`),
  ...slugs("bengaluru").map((s) => `/bengaluru/${s}`),
  ...slugs("journal").map((s) => `/journal/${s}`),
];

// ── 1. Capture pages ─────────────────────────────────────────────────────────
const pages = {};
let firstHtml = "";
for (const route of [...routes, "/404"]) {
  const url = route === "/404" ? `${BASE}/__not-found__` : BASE + route;
  const res = await fetch(url);
  if (!res.ok && route !== "/404") {
    console.warn(`skip ${route}: HTTP ${res.status} (drafts need SHOW_DRAFTS=1 on the server)`);
    continue;
  }
  const html = await res.text();
  if (!firstHtml) firstHtml = html;
  const main = html.match(/<main id="main">([\s\S]*?)<\/main>/)?.[1];
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "Floors & Pillars";
  if (!main) throw new Error(`No <main> found for ${route}`);
  pages[route] = { title: title.replace(/&amp;/g, "&"), html: main.replace(/<script[\s\S]*?<\/script>/g, "") };
}
const footer = firstHtml.match(/<footer[\s\S]*?<\/footer>/)?.[0] ?? "";

// ── 2. Styles and fonts (Latin + Latin-extended subsets, inlined) ────────────
const cssHref = firstHtml.match(/<link rel="stylesheet" href="([^"]+\.css)"/)?.[1];
let css = await (await fetch(BASE + cssHref)).text();
css = css.replace(/@font-face\{[^}]*\}/g, (rule) => {
  if (!rule.includes("url(")) return rule; // metric fallbacks
  if (!/unicode-range:U\+(\?\?|100-2BA)/.test(rule)) return "";
  return rule;
});
const fontUrls = [...new Set([...css.matchAll(/url\(([^)]+\.woff2)\)/g)].map((m) => m[1]))];
for (const u of fontUrls) {
  const file = path.join(root, ".next/static/media", path.basename(u));
  const b64 = readFileSync(file).toString("base64");
  css = css.split(`url(${u})`).join(`url(data:font/woff2;base64,${b64})`);
}
const fontVars = firstHtml.match(/<html[^>]*class="([^"]*)"/)?.[1] ?? "";

// ── 3. Interactive bundle ────────────────────────────────────────────────────
execFileSync(process.execPath, ["--experimental-strip-types", "--no-warnings", path.join(root, "scripts/standalone-data.ts")], { stdio: "inherit" });
const shims = {
  name: "next-shims",
  setup(build) {
    const map = { "next/link": "standalone/shims/next-link.tsx", "next/navigation": "standalone/shims/next-navigation.ts", "next/image": "standalone/shims/next-image.tsx" };
    build.onResolve({ filter: /^next\/(link|navigation|image)$/ }, (args) => ({ path: path.join(root, map[args.path]) }));
  },
};
const js = await esbuild.build({
  entryPoints: [path.join(root, "standalone/main.tsx")],
  bundle: true,
  write: false,
  minify: true,
  format: "iife",
  target: "es2020",
  jsx: "automatic",
  tsconfig: path.join(root, "tsconfig.json"),
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [shims],
  logLevel: "warning",
});
const script = js.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");

// ── 4. Assemble ──────────────────────────────────────────────────────────────
const pagesJson = JSON.stringify(pages).replace(/</g, "\\u003c");
const html = `<!doctype html>
<html lang="en-IN" class="${fontVars}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>Floors &amp; Pillars</title>
<style>${css}</style>
</head>
<body class="min-h-screen">
<a href="#main" class="sr-only z-50 bg-ink px-5 text-limestone focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:inline-flex focus:min-h-12 focus:items-center">Skip to content</a>
<div id="fp-header"></div>
<main id="main" tabindex="-1"></main>
${footer}
<div id="fp-mobilebar"></div>
<p style="position:fixed;right:12px;bottom:12px;z-index:20;margin:0;padding:6px 10px;font:12px/1.3 system-ui,sans-serif;background:#1c1b18;color:#f3eee4;opacity:.85" class="hidden md:block">Demo file · briefs stay in this browser</p>
<script>window.__FP_PAGES__=${pagesJson};</script>
<script>${script}</script>
</body>
</html>
`;
mkdirSync(path.join(root, "dist"), { recursive: true });
writeFileSync(path.join(root, "dist/floors-and-pillars.html"), html);
console.log(`dist/floors-and-pillars.html — ${Object.keys(pages).length} pages, ${(html.length / 1024).toFixed(0)} KB`);
