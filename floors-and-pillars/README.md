# Floors & Pillars — website v1

The website for Floors & Pillars, a residential advisory in Bengaluru. The site has one job: help a qualified visitor **share their brief**.

Built with Next.js 16 (App Router), TypeScript (strict), Tailwind CSS 4, and MDX/JSON content validated with Zod. All content pages are statically generated.

## Run it

```bash
cd floors-and-pillars
npm install
cp .env.example .env.local   # optional; defaults work for development
npm run dev                  # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run dev` | Development server. Draft content is visible. |
| `npm run build` / `npm start` | Production build and server. Drafts are excluded. |
| `npm run lint` | ESLint using `eslint-config-next` (Next 16 removed `next lint`). |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Unit tests: brief schema, phone numbers, prefill, rate limit, matching engine. |
| `npm run content:check` | Content validation, placeholder report, banned-word lint and colour contrast. See *Launch gate* below. |
| `npm run test:e2e` | Browser test of the brief, with and without JavaScript. Needs a running server: `BASE_URL=http://localhost:3000 npm run test:e2e`. |
| `npm run screenshots` | Screenshots every route at 390px and 1440px into `screenshots/`. Also checks 360–1440px for horizontal scroll, tap targets under 44px and the number of `<h1>` elements. Needs a running server and `BASE_URL`. |

The Playwright scripts use Playwright's own Chromium. If that isn't installed, set `CHROMIUM_PATH` to a local Chromium or Chrome.

## Single-file demo

`dist/floors-and-pillars.html` is the whole site as one file you can double-click. There's no install and no server. It includes draft guides and articles.

- Briefs and contact messages are kept in that browser's `localStorage`, not sent anywhere.
- The advisor desk isn't included, because it needs a server.

To rebuild it after changes:

```bash
SHOW_DRAFTS=1 npm run build && SHOW_DRAFTS=1 npm start     # terminal 1
BASE_URL=http://localhost:3000 npm run build:html          # terminal 2
```

The script captures every page from the production build, re-mounts the interactive parts (brief, teaser, filters, menu, contact form) from the same components, and inlines the fonts.

## Where things live

```
site.config.ts          Brand name, contact details, RERA number, fee copy, response time, isIndependentFeeModel
content/
  homes/*.mdx           The collection (maximum 12 published)
  bengaluru/*.mdx       Micro-market guides
  journal/*.mdx         Articles
  advisors/*.json       Advisor profiles
  markets.json          The micro-market list (brief areas, Bengaluru index)
  options.ts            Budget bands, configurations, possession, priorities, contact preferences
  pages/*.ts            Page copy (home, brief, advisory, homes, other pages, legal)
lib/content/            Zod schemas, loaders, MDX rendering
lib/brief/              Brief schema, prefill, delivery adapters, honeypot, rate limit
lib/engine/             Matching engine (from the discovery POC) and content adapters
lib/analytics.ts        track(event, props), provider-agnostic
lib/seo.tsx             Metadata, canonical URLs, JSON-LD
```

Pages in `app/` read from `content/` and never hold copy themselves. Anyone comfortable editing text files can change the site without touching components.

## Adding content

Every content file is validated when the site builds. A missing or wrong field fails the build, with the file name and the field in the error.

### A home
1. Copy `content/homes/home-a.mdx` to `content/homes/<slug>.mdx`. The slug must use lowercase letters and hyphens.
2. Fill in the frontmatter:
   - `type`: `apartment` or `villa`.
   - `microMarket`: a slug from `content/markets.json`.
   - `priceBand`: one of `3-5`, `5-7.5`, `7.5-10`, `10+`.
   - `priceFromCr`: optional. When set, cards show "from ₹X Cr".
   - `whyWeLikeIt`: up to 4 points.
   - `whatToWeigh`: at least one honest trade-off.
   - `similar`: other home slugs.
   - `tags`: optional hints for thank-you page matching, e.g. `low-density`, `large-format`, `green`, `design`, `central`, `amenities`.
3. Images: put files in `public/homes/<slug>/` and reference them as `/homes/<slug>/facade.jpg`. `alt` is required. Until real photos exist, `src: "placeholder:facade photo"` renders a neutral block.
4. Body: keep the `## The Residence`, `## Why It Stands Out` and `## The Lifestyle` headings. The other detail sections (At a Glance, Location, The Developer, The Numbers, What to Weigh) come from frontmatter.
5. Set `featured: true` to show the home on the home page (first three are used). Set `draft: true` to hide it in production.

The collection is capped at 12 published homes. The build fails above that.

### A Bengaluru guide
Copy `content/bengaluru/central-bengaluru.mdx`. The file's `slug` must match a slug in `content/markets.json`, which is how the index links to it. Set `draft: false` to publish. Homes whose `microMarket` matches the guide appear under "Homes we're watching here".

### A journal article
Copy any file in `content/journal/`. Required fields:
- `date`: in `YYYY-MM-DD` format.
- `author`: an advisor slug.
- `related.homes` / `related.guides`: slugs.

Use `<PullQuote>…</PullQuote>` inside the body for pull quotes. Reading time is calculated automatically.

### An advisor
Add `content/advisors/<slug>.json` with `name`, `role`, `bio`, `photo` (`src` and `alt`) and `order`. Real people and real photographs only.

## Fee model, RERA and contact details

Everything lives in `site.config.ts`:

- `feeDisclosure`: the one-line disclosure shown in the footer and trust strip.
- `feeModelDetail`: the "How we're paid" block on /advisory.
- `isIndependentFeeModel`: leave this `false` unless the fee model genuinely supports the word. While it is `false`, `content:check` fails if "independent" appears anywhere in the site's copy.
- `reraAgentNumber`, `responseTime`, and `contact.*` (phone, WhatsApp, email, address, hours).

Structured data (JSON-LD) leaves out any contact field that is still a placeholder. The WhatsApp link becomes clickable once a real number is set.

## Brief delivery

The brief is handled by `app/api/brief/route.ts`, which runs these checks in order:

1. Honeypot.
2. Rate limit: 5 briefs per IP per 10 minutes.
3. Zod validation.
4. Phone normalisation to E.164 format.
5. `deliver()` in `lib/brief/deliver.ts`.

Choose how briefs are delivered with `BRIEF_DELIVERY`:

| Value | Behaviour |
|---|---|
| `console` (default) | Logs the brief to the server console. |
| `webhook` | POSTs `{ type: "brief", brief }` as JSON to `BRIEF_WEBHOOK_URL`. If `BRIEF_WEBHOOK_SECRET` is set, it also sends an `x-brief-signature` header (HMAC-SHA256 of the body). Works with Zapier, Make, n8n, a CRM or your own endpoint. |
| `email` | A stub. `emailDeliverer` in `deliver.ts` lists the four steps to connect a provider. `formatBriefText()` gives you a plain-text body. |
| `file` | Appends to `data/briefs.json` (git-ignored) so the advisor desk can open briefs. For development or self-hosting only; serverless hosts don't keep files. |

To add a provider, write a `Deliverer` function and register it in `REGISTRY`. No vendor is hard-coded. Contact-page messages go through the same channel.

**Rate limiting is per server instance.** On Vercel each instance keeps its own count. Swap `lib/brief/rate-limit.ts` for a shared store before relying on it at volume.

## Advisor desk (`/desk`)

The desk is an internal page. An advisor uploads the property workbook (`.xlsx`) and then either opens a stored brief or pastes one in. It returns a ranked first cut of homes, each with its reasons and gaps, and can be copied as text.

- It is `noindex`, blocked in `robots.txt`, and absent from the sitemap.
- With `DESK_PASSCODE` set, the desk asks for the passcode.
- Without it, the desk is open in development and returns 404 in production.
- The uploaded workbook is stored in `data/` and is never committed.

The matching engine is the one from `luxury-discovery/`, copied into `lib/engine/`. The public site uses it in two places:

- **Brief pre-fill.** The "Describe it in your own words" box fills in the form fields for the client to confirm.
- **Thank-you page.** "While you wait: from our collection" scores only the curated homes, using the requirements kept in `sessionStorage`. Contact details are never stored.

## Analytics

`track(event, props)` in `lib/analytics.ts` fires these events:

- `brief_start`
- `brief_step_complete`
- `brief_submit`
- `home_view`
- `advisor_cta_click`
- `whatsapp_click`

No vendor is connected. To connect one, call `setAnalyticsHandler((event, props) => vendor.track(event, props))` from a client component in the layout, or listen for the `fp:analytics` window event.

## Launch gate

`npm run content:check` does the following:

- Validates every content file.
- Lists every `[[PLACEHOLDER` and every `placeholder:` image, by file.
- Fails on banned voice words: *best deals, prime, world-class, ultra-luxury, hurry, exclusive offer, dream home*.
- Fails on "independent" while `isIndependentFeeModel` is false.
- Warns when "luxury" appears more than twice in one file.
- Checks every brand colour pair against WCAG AA. Bronze #9C6B3E on limestone is 3.96:1, so bronze is reserved for large text and decoration; links use `--bronze-deep` #7E5530 (5.62:1).

Run it with `LAUNCH_MODE=production` and it also **fails while any placeholder remains**, so the site can't go live with them. Make that part of your production deploy, for example as the Vercel build command:

```
LAUNCH_MODE=production npm run content:check && npm run build
```

`LAUNCH_CHECKLIST.md` lists every placeholder, grouped by owner.

## Deploying to Vercel

1. Set the project root directory to `floors-and-pillars`.
2. Set the environment variables from `.env.example`:
   - `NEXT_PUBLIC_SITE_URL` is required for canonical URLs and the sitemap.
   - Set `BRIEF_DELIVERY` to `webhook` or `email`. The `file` adapter can't be used on Vercel.
3. Set `DESK_PASSCODE` only if you want the desk online. The desk needs `data/` to persist, so for real use it belongs on a host with a filesystem, or behind a storage adapter.

## Images

Photography placeholders render as limestone blocks with a visible `[[PLACEHOLDER: …]]` caption. When real photographs arrive, put them in `public/` and change the `src`. `ContentImage` switches to `next/image` automatically.

## Wordmark

`components/layout/Wordmark.tsx` is a typographic placeholder. Replace its markup with the final SVG logo, and keep an accessible name ("Floors & Pillars"). `app/icon.svg` is a placeholder favicon.
