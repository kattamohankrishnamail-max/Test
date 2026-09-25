// Screenshots every route at 390px and 1440px into ./screenshots and audits 360/390/768/1024/1440px for:
// horizontal scroll, tap targets under 44×44px (inline text links in prose are exempt, per WCAG 2.5.8),
// and exactly one <h1>. Run against a running server:
//   BASE_URL=http://localhost:3000 npm run screenshots
// Set CHROMIUM_PATH if Playwright's bundled browser isn't installed.
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const ROUTES = [
  "/", "/brief", "/brief/thank-you", "/homes", "/homes/home-a", "/advisory", "/bengaluru", "/bengaluru/central-bengaluru",
  "/journal", "/journal/what-5-cr-buys-you", "/about", "/contact", "/privacy", "/terms", "/this-page-does-not-exist",
];
const SHOT_WIDTHS = [390, 1440];
const AUDIT_WIDTHS = [360, 390, 768, 1024, 1440];

mkdirSync("screenshots", { recursive: true });
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const problems = [];

for (const route of ROUTES) {
  for (const width of AUDIT_WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const res = await page.goto(BASE + route, { waitUntil: "networkidle" });
    if (!res || (res.status() >= 400 && !route.includes("does-not-exist"))) {
      problems.push(`${route} @${width}: HTTP ${res?.status()}`);
      await page.close();
      continue;
    }
    // Reveal-on-scroll content should be visible in full-page captures.
    await page.evaluate(() => document.querySelectorAll(".reveal").forEach((e) => e.classList.add("is-visible")));
    const audit = await page.evaluate(() => {
      const overflow = document.documentElement.scrollWidth - window.innerWidth;
      const h1 = document.querySelectorAll("h1").length;
      const small = [];
      for (const el of document.querySelectorAll("a, button, summary, input:not([type=hidden]):not(.sr-only), select, textarea, label:has(> input.sr-only)")) {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        const style = getComputedStyle(el);
        if (style.visibility === "hidden" || el.closest("[aria-hidden=true]") || el.classList.contains("sr-only")) continue; // sr-only: skip link (44px when focused)
        const inlineText = el.tagName === "A" && style.display === "inline" && el.closest("p, li, dd, .prose-fp");
        if (inlineText) continue;
        if (el.matches("input[type=checkbox]") && el.closest("label")) continue; // the label is the target
        if (r.height < 44 || r.width < 24) small.push(`${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
      }
      return { overflow, h1, small };
    });
    if (audit.overflow > 0) problems.push(`${route} @${width}: horizontal scroll ${audit.overflow}px`);
    if (audit.h1 !== 1) problems.push(`${route} @${width}: ${audit.h1} <h1> elements`);
    if (width <= 390) for (const s of audit.small) problems.push(`${route} @${width}: small tap target ${s}`);
    if (errors.length) problems.push(`${route} @${width}: page errors ${errors.join("; ")}`);
    if (SHOT_WIDTHS.includes(width)) {
      const name = route === "/" ? "home" : route.slice(1).replace(/\//g, "__");
      await page.screenshot({ path: `screenshots/${name}@${width}.png`, fullPage: true });
    }
    await page.close();
  }
}
await browser.close();
const unique = [...new Set(problems)];
console.log(unique.length ? `Issues (${unique.length}):\n  ${unique.join("\n  ")}` : "No layout, tap-target or heading issues found.");
process.exitCode = unique.length ? 1 : 0;
