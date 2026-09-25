# Launch checklist

Every placeholder that must be replaced before launch, grouped by owner. `LAUNCH_MODE=production npm run content:check` fails until all of them are gone. It lists each remaining placeholder by file and line.

## 1. Business decisions

| Item | Where |
|---|---|
| Fee model: how Floors & Pillars is paid (full disclosure for /advisory) | `site.config.ts` → `feeModelDetail` |
| One-line fee disclosure (footer and trust strip) | `site.config.ts` → `feeDisclosure` |
| Whether "independent" may be used: set `true` only if the fee model genuinely supports it | `site.config.ts` → `isIndependentFeeModel` (currently `false`) |
| Response-time promise on the thank-you page (e.g. "48 hours") | `site.config.ts` → `responseTime` |
| FAQ answers that depend on the business model: cost; whether you only show homes you're paid on; NRI remote support; resale; typical timeline | `content/pages/advisory.ts` → `faq` |
| Property Note sample text | `content/pages/advisory.ts` → `noteMock` |
| Brief delivery channel for production (webhook URL or email provider) | Env: `BRIEF_DELIVERY`, `BRIEF_WEBHOOK_URL` / `lib/brief/deliver.ts` |
| Whether the advisor desk goes online, and where | Env: `DESK_PASSCODE`; see README → Advisor desk |

## 2. Compliance

| Item | Where |
|---|---|
| K-RERA agent registration number | `site.config.ts` → `reraAgentNumber` |
| RERA ID for each published home | `content/homes/*.mdx` → `reraId` |
| Privacy notice: written or reviewed by counsel (DPDP Act 2023 consent, retention, rights, grievance officer) | `content/pages/legal.ts` → `privacy` |
| Terms of use: written or reviewed by counsel, including the RERA advertising position | `content/pages/legal.ts` → `terms` |
| Remove the "Draft, pending legal review" banner once approved | `content/pages/other.ts` → `legalBanner` and `components/layout/LegalPage.tsx` |
| Consent wording on the brief form, checked against the final privacy notice | `content/pages/brief.ts` → `labels.consent` |

## 3. Contact details

| Item | Where |
|---|---|
| Phone, WhatsApp, email, office address, hours | `site.config.ts` → `contact` |
| Social links (optional) | `site.config.ts` → `social` |

## 4. Content

| Item | Where |
|---|---|
| **Homes A, B, C:** replace with real homes. Name, developer, configurations, sizes, `priceFromCr`, possession, summary, why we like it, consider-it-if, what to weigh, commute times, schools, hospitals, developer track record, the numbers, and the three body sections. Every figure needs a source. | `content/homes/home-a.mdx`, `home-b.mdx`, `home-c.mdx` |
| Micro-market one-line summaries (8) | `content/markets.json` |
| **Guides:** Central Bengaluru and Sarjapur Road. Dek, who it suits, character, price bands, notable developments, infrastructure (with sources), drawbacks. Then set `draft: false`. | `content/bengaluru/*.mdx` |
| **Articles:** "What ₹5 Cr buys you across Bengaluru", "How to assess a ₹10 Cr villa", "What actually makes a luxury apartment luxurious?". Dek and body, then set `draft: false` and a real `date`. | `content/journal/*.mdx` |
| **Advisor profiles:** real names, roles, short bios | `content/advisors/*.json` |

## 5. Assets

| Item | Where |
|---|---|
| Final logo (SVG) replacing the typographic wordmark | `components/layout/Wordmark.tsx` |
| Favicon | `app/icon.svg` |
| Home-page hero photograph | `content/pages/home.ts` → `hero.image` |
| Home photography (facade and interiors) with alt text | `content/homes/*.mdx` → `images` |
| Guide photography | `content/bengaluru/*.mdx` → `image` |
| Advisor portraits (real people, no stock) | `content/advisors/*.json` → `photo` |
| Open Graph share image (optional; not yet added) | `app/opengraph-image.*` (Next.js file convention) |

## 6. Before going live

- [ ] `LAUNCH_MODE=production npm run content:check` passes
- [ ] `npm run lint`, `npm run typecheck`, `npm test` and `npm run build` pass
- [ ] `NEXT_PUBLIC_SITE_URL` is set to the live domain
- [ ] A test brief submitted on the live site reaches the chosen delivery channel
- [ ] `npm run test:e2e` and `npm run screenshots` run against a preview deployment
- [ ] Lighthouse (mobile) scores ≥ 90 on the home page, /brief and a home detail page, using real photography
