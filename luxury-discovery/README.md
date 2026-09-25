# Luxury Property Discovery — Bengaluru (POC)

A client-facing concierge page. The client describes the home they want, the system reads the brief, searches the uploaded Excel database, and returns a short, ranked shortlist, with a plain-language reason for every match.

```
Client brief → requirement extraction → Excel database → matching engine → curated shortlist → advisor
```

## Quickest: single HTML file (no install)

Open `dist/luxury-discovery.html` by double-clicking it. Choose the Excel workbook when asked. It is read inside the browser, never uploaded anywhere, and remembered for next time. Everything works offline except the web fonts. This version uses only the rule-based brief reader, and advisor enquiries are saved in that browser. To rebuild it after code changes, run `npm run build:html`.

## Run the full app

```bash
cd luxury-discovery
npm install
npm run dev            # http://localhost:3000
```

1. Open **/admin** and upload the property workbook (`.xlsx`).
2. Open **/** and describe a home, or use one of the "Try" examples.

Optional environment variables (`.env.local`):

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Adds Claude-based requirement extraction on top of the rule-based parser. Matching never uses AI. |
| `ANTHROPIC_MODEL` | Override the extraction model (default `claude-opus-5`). |
| `ADMIN_PASSCODE` | Protects `/admin` and upload/delete endpoints. **Set this before exposing the app publicly.** |
| `DATA_DIR` | Where the parsed database and enquiries are stored (default `./data`, git-ignored). |

## What's where

| Area | File |
|---|---|
| Brand name | `lib/brand.ts` |
| Match weights, thresholds, budget bands, hidden statuses | `lib/config.ts` |
| Column mapping (header synonyms, header-row / sheet detection) | `lib/columns.ts` |
| Excel → normalised properties (price, area, BHK, possession parsing) | `lib/normalize.ts`, `lib/excel.ts` |
| Rule-based brief extraction | `lib/extract.ts` |
| Optional Claude extraction | `lib/llm.ts`, `app/api/extract` |
| Location vocabulary (e.g. "ORR" or "East Bengaluru" → rows) | `lib/locations.ts` |
| Matching + reasons + no-match explanation | `lib/match.ts` |
| Discovery UI | `components/Discovery.tsx` and siblings |
| Standalone HTML build (local data instead of API routes) | `standalone/`, `scripts/build-standalone.mjs` |
| Admin (upload, stats, column mapping, enquiries) | `app/admin/page.tsx` |

## Matching

Each home is scored from 0 to 100 as a weighted average. Only the criteria the client actually specified count toward the average, so an empty size field doesn't pull every score down.

| Criterion | Weight | Full marks when |
|---|---|---|
| Budget | 30 | Price range overlaps the budget. Scores fall to zero at 30% above the ceiling. |
| Location | 25 | Named micro-market or zone. A home in the same broad corridor scores 60%. |
| Configuration | 15 | Requested BHK is offered. Near configurations get partial credit. |
| Size | 10 | Largest unit ≥ requested minimum |
| Possession | 10 | Handover within the requested timeline |
| Lifestyle | 10 | Share of the selected priorities that have supporting evidence in the sheet |

A home counts as an **exact match** only if it scores at least 75 and clears a minimum on each criterion that has one: budget, location, configuration, size and possession. If fewer than 3 homes qualify, the closest alternatives are shown, with an explanation of what they fit and where they fall short.

Ties are broken by price verification and data completeness. Results are never sorted by price.

## Data rules

- Every attribute shown comes from the uploaded sheet. Missing values display as **Not specified**.
- Lifestyle reasons either quote the sheet ("Lake-facing towers with a 40,000 sq ft clubhouse") or restate a sheet value (units per acre, area, archetype).
- The only statement that goes beyond a single cell is a budget caveat. When a client asks for a project's larger configuration, the card says those homes *likely* sit toward the top of the listed price range.
- Rows with status "Excluded", and fully sold-out projects, are hidden from clients. Admin shows how many were hidden.
- Internal research columns (sources, variance, tiers, bands) are never sent to the browser.
- Projects with no image URL get an abstract placeholder panel. The app never substitutes stock photography.

## Tests

```bash
npm test        # engine tests on a synthetic sheet
npm run build   # typecheck + production build
```

## Not in scope

Finance, feasibility, CRM, dashboards, a database, and authentication beyond the admin passcode are all out of scope. The parsed dataset and enquiries are stored as JSON files under `data/`. On a read-only host they are kept in memory for the life of the process instead.
