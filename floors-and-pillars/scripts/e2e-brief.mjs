// End-to-end check of the brief, against a running server:
//   BASE_URL=http://localhost:3000 npm run test:e2e
// Covers: home reader → prefilled brief, the 3-priority cap, step validation,
// JS submission → thank-you with collection matches, no-JS submission → 303, honeypot.
import assert from "node:assert/strict";
import { chromium } from "playwright";

const B = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const pageErrors = [];
const step = (msg) => console.log(`✓ ${msg}`);

try {
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  p.on("pageerror", (e) => pageErrors.push(e.message));
  await p.goto(B + "/", { waitUntil: "networkidle" });
  await p.fill("#reader-text", "A 5 BHK villa in North Bengaluru, ready to move, quiet and green, around 9 crore");
  const reading = await p.locator("#reader table").innerText();
  for (const v of ["Villa", "5+ BHK", "Ready to move", "North Bengaluru"]) assert.ok(reading.includes(v), `reader should show ${v}`);
  step("home-page reader reads the brief live");
  await p.getByRole("button", { name: "Continue with this brief" }).click();
  await p.waitForURL(/\/brief/);
  await p.waitForSelector("text=We've filled in what we understood");
  const checked = await p.$$eval("input:checked", (els) => els.map((e) => `${e.name}=${e.value}`));
  for (const v of ["propertyType=villa", "budget=7.5-10", "configurations=5+", "possession=ready", "areas=north-bengaluru"]) assert.ok(checked.includes(v), `expected ${v}`);
  step("reader text pre-fills the brief");

  await p.getByRole("button", { name: "Continue" }).click();
  await p.waitForTimeout(250);
  await p.getByRole("button", { name: "Continue" }).click();
  await p.waitForTimeout(250);
  for (const t of ["Space"]) await p.locator("label", { hasText: new RegExp(`^${t}$`) }).click();
  assert.equal(await p.locator("input[name=priorities][value=schools]").isDisabled(), true, "fourth priority should be disabled");
  step("brief caps priorities at three");
  for (let i = 0; i < 1; i++) {
    await p.getByRole("button", { name: "Continue" }).click();
    await p.waitForTimeout(250);
  }
  await p.getByRole("button", { name: "Curate my shortlist" }).click();
  await p.waitForSelector("#name-error");
  step("empty contact step shows inline errors");
  await p.fill("#name", "E2E Client");
  await p.fill("#email", "e2e@example.com");
  await p.fill("#phone", "+44 7911 123456");
  await p.locator("label", { hasText: "Outside India" }).click();
  await p.locator("label", { hasText: /^WhatsApp$/ }).click();
  await p.locator("input[name=consent]").check();
  await p.getByRole("button", { name: "Curate my shortlist" }).click();
  await p.waitForURL(/\/brief\/thank-you/, { timeout: 15000 });
  await p.waitForSelector("#matches-title", { timeout: 5000 });
  step("JS submission reaches thank-you with collection matches");

  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const q = await ctx.newPage();
  await q.goto(B + "/brief?type=apartment&budget=5-7.5&priorities=space,design", { waitUntil: "load" });
  assert.equal(await q.locator("section[data-step]:visible").count(), 4, "all steps visible without JS");
  await q.locator("label", { hasText: /^4 BHK$/ }).click();
  await q.locator("label", { hasText: /^Within 12 months$/ }).click();
  await q.locator("label", { hasText: /^Whitefield$/ }).click();
  await q.fill("#name", "No Script");
  await q.fill("#email", "nojs@example.com");
  await q.fill("#phone", "98450 12345");
  await q.locator("label", { hasText: /^Bengaluru$/ }).click();
  await q.locator("label", { hasText: /^Call$/ }).click();
  await q.locator("input[name=consent]").check();
  await q.getByRole("button", { name: "Curate my shortlist" }).click();
  await q.waitForURL(/\/brief\/thank-you/);
  step("no-JS submission redirects to thank-you");

  const r = await fetch(B + "/api/brief", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ website: "http://spam" }) });
  assert.equal(r.status, 200);
  step("honeypot submissions are accepted silently");

  assert.deepEqual(pageErrors, [], "no page errors");
  console.log("\nBrief end-to-end: passed");
} catch (e) {
  console.error(`\n✗ ${e.message}`);
  process.exitCode = 1;
} finally {
  await browser.close();
}
