# Claude Design Prompt — Single Copy-Pastable MVP Brief

Paste everything inside the code block below into claude.ai (or Claude Code) to generate the full
single-file demo MVP of the Real Estate Sales Objection Handling Agent.

---

```
Build me a single self-contained HTML file (inline CSS + inline vanilla JavaScript, no external libraries, no CDN links, no build step) that is a fully clickable, demo-able MVP of a product I am building. It must open by double-clicking the file and work fully offline with realistic mock data. Everything below is the complete product spec — implement all of it in one file.

=== PRODUCT ===
Name: DealDesk — Real Estate Sales Objection Intelligence
One-liner: An AI copilot that listens to what your buyers actually object to, searches every past call, deal, and case study, and hands the agent a proven, evidence-backed rebuttal in under 3 seconds.
Who it is for: Solo real estate agents and small brokerages. This is a personal product, not an enterprise tool — the tone should be sharp, practical, and confident, never corporate.
The problem: Agents burn 15-20 minutes per call digging through spreadsheets for what worked last time. Knowledge dies with whoever closed the deal.
The promise: Type the objection, get the play — with the success rate, the comparable deal, the exact words to say, and the next step.

=== THE SIX DATA DOMAINS (mock all of these with realistic seeded data) ===
1. Properties — 8 listings: address, price, beds, baths, sqft, property type (single-family, condo, multi-family, commercial, land), days on market, status (active / pending / sold), listing agent.
   Use real-feeling addresses across Austin TX, e.g. 123 Oak St 78701 $450k 3bd/2ba 2200sqft, 456 Maple Dr 78702 $625k 4bd/3ba 3100sqft, 789 Pine Rd 78703 $650k, plus five more spread from $310k to $1.4M.
2. Call Transcripts — 12 past sales calls: call id, agent name, client name, linked property, duration in minutes, date within the last 90 days, a 2-3 sentence transcript excerpt in believable spoken language, agent remarks, objection type raised, resolved true/false.
3. Objections Library — 10 objection types, each with: id, type, plain-English description, category, handling strategy (2 sentences), success rate as a percent between 52% and 88%, three verbatim sample lines an agent can actually say, average days to resolve, and how many times it has been logged.
   The ten types: Price Too High, Location Concerns, Financing & Affordability, Property Condition, Market Timing, Competing Offers, Contract Terms, Contingency Worries, Inspection Findings, Commission Pushback.
4. Deals Pipeline — 10 live deals moving through 8 stages: Lead, Prospect, Viewing Scheduled, Offer Phase, Negotiation, Inspection, Appraisal, Closing. Each deal: id, client, property, current stage, days in stage, offer price vs list price, open objections, expected close date, agent notes.
5. Market & Competitive Intel — comparable-sales analysis per neighborhood (avg price per sqft, avg days on market, avg price reduction percent), three competing brokerages with their average list price and days on market, and five value propositions mapped to objection types.
6. Brand & Messaging — tone rules (professional but human, never pushy), three messaging frameworks tuned to different buyer personas (First-Time Buyer, Investor, Move-Up Family), and explicit do / don't language examples.

=== THE TWELVE TOOLS (show these firing live in the UI) ===
SearchCallTranscripts, SearchObjections, GetHandlingStrategy, GetSimilarCases, GetDealStatus, GetCompetitorAnalysis, GetCaseStudies, GetBrandGuidelines, GetValueProps, SearchFAQ, GetDealProgression, LogInteraction.
When a query runs, visibly light up only the 3-5 tools that are actually relevant to that query, each with a fake-but-plausible latency between 40ms and 320ms, and show them completing in parallel.

=== THE RETRIEVAL PIPELINE (animate these five stages in sequence) ===
Stage 1 Intent Classification — decide which of the ten objection types the query maps to, show the confidence.
Stage 2 Structured Retrieval — fan out in parallel across transcripts, objections, and deals.
Stage 3 Semantic Matching — surface the closest past cases and the brand tone rules.
Stage 4 Cross-Domain Enrichment — pull comparable sales and competitive positioning.
Stage 5 Context Assembly — rank and merge everything into the final answer.
Each stage should appear as a row that goes from pending, to running with a subtle pulse, to done with a checkmark and its elapsed milliseconds. The whole run should take about 1.6 to 2.6 seconds of simulated time so the user actually watches it happen.

=== SCREENS (build all five, switchable from a left sidebar) ===

SCREEN 1 — ASK (the default, the hero of the product)
A chat interface. Big input at the bottom. Above it, six one-click starter chips:
"Buyer says the price is too high", "They're worried about the school district", "Client can't get financing approved", "Competing offer came in $20k over", "Inspection found foundation issues", "They want me to cut commission".
When the user sends anything, run the five-stage pipeline animation with the tool cards firing, then stream in the answer character-by-character or line-by-line so it feels alive.
Every answer is structured exactly like this:
  THE PLAY — the one-sentence strategy, stated with conviction.
  WHY IT WORKS — 2-3 bullets of reasoning grounded in the data.
  SAY THIS — a verbatim, quotable script in a distinct callout block the user can copy with one click.
  THE EVIDENCE — success rate as a progress bar, the count of similar past deals, and 2-3 cited sources each linking to a real record in the mock data.
  NEXT STEPS — a numbered 3-step action list.
Footer of every answer: a confidence percentage between 71 and 94, a data-freshness label, the number of sources, and total response time in ms. Add thumbs-up / thumbs-down feedback buttons that visibly register and update a running helpfulness stat.
Support multi-turn: follow-up questions should reference the previous turn, and the header should show a live turn counter.

SCREEN 2 — OBJECTION LIBRARY
All ten objection types as cards in a responsive grid, sortable by success rate, frequency, or alphabetically, and filterable by category. Each card shows the type, the success-rate ring or bar, times logged, and average days to resolve. Clicking a card opens a detail panel with the full handling strategy, all three verbatim scripts each with a copy button, the linked past deals, and a small bar chart of how the success rate trends across the four deal stages where it most often appears.

SCREEN 3 — PIPELINE
The eight stages as a horizontal kanban board with the ten deals as draggable cards. Each card shows client, property, offer vs list price, days in stage, and colored dots for its open objections. Above the board: total pipeline value, weighted forecast, and average days-to-close. Clicking a deal opens a slide-over panel with its full objection history, the agent notes, and a "Get the play for this deal" button that jumps to the Ask screen pre-loaded with that deal's most pressing objection.

SCREEN 4 — INTEL
Comparable sales table per neighborhood with price per sqft, days on market, and price reduction. A competitive positioning section for the three rival brokerages. The five value propositions each mapped to the objections they neutralize. Include at least one clean chart drawn with inline SVG or canvas — no chart libraries.

SCREEN 5 — INSIGHTS
The learning loop made visible. Total queries this session, average response time, average confidence, helpfulness rate from the thumbs feedback, the top five most-asked objections as a horizontal bar chart, and a recent-activity log of every query the user has run in this session with its confidence and timing. All of this must update live as the user uses the product.

=== DESIGN DIRECTION ===
Modern, dense-with-information but never cluttered. Think a well-made professional tool, not a marketing page.
Dark theme by default with a working light-mode toggle in the top bar that persists the choice; both themes must be fully legible with proper contrast.
A confident accent color used sparingly for actions, success-rate fills, and the active nav item — pick one and stay disciplined about it.
Rounded corners, soft depth, generous whitespace, a clear type scale. Numbers and metrics should feel tabular and precise.
Real micro-interactions: hover states on every clickable thing, smooth panel transitions, the pipeline stages pulsing while they run, the answer streaming in, copy buttons that flash confirmation.
Fully responsive — the sidebar collapses to icons under 1024px and the whole thing stays usable on a phone.
Respect prefers-reduced-motion by cutting the animations down to instant.
Keyboard: Enter sends, Cmd/Ctrl+K focuses the input, Escape closes any open panel.

=== NON-NEGOTIABLES ===
Everything in ONE .html file. No fetch, no XHR, no external fonts, no CDN, no npm. All data is a JavaScript object literal at the top of the script, clearly commented so I can swap in my real Google Sheets export later.
Nothing may be a dead link or a fake button — every control does something real against the mock data.
The mock data must be internally consistent: a deal's objection must exist in the objection library, a cited call must exist in the transcripts, a referenced property must exist in the listings.
Make the very first thing I see impressive without me typing anything — the Ask screen should already show one worked example answer so the value lands in three seconds.
```

---

## Repository Links

- Repo: https://github.com/kattamohankrishnamail-max/Test
- Branch: https://github.com/kattamohankrishnamail-max/Test/tree/claude/sales-objection-agent-6aYUZ
- Commits: https://github.com/kattamohankrishnamail-max/Test/commits/claude/sales-objection-agent-6aYUZ
- Architecture: https://github.com/kattamohankrishnamail-max/Test/blob/claude/sales-objection-agent-6aYUZ/ARCHITECTURE.md
- System diagrams: https://github.com/kattamohankrishnamail-max/Test/blob/claude/sales-objection-agent-6aYUZ/SYSTEM_DIAGRAM.md
- MVP implementation guide: https://github.com/kattamohankrishnamail-max/Test/blob/claude/sales-objection-agent-6aYUZ/MVP_IMPLEMENTATION.md
- Existing demo prototype: https://github.com/kattamohankrishnamail-max/Test/blob/claude/sales-objection-agent-6aYUZ/demo.html
- Seed data: https://github.com/kattamohankrishnamail-max/Test/blob/claude/sales-objection-agent-6aYUZ/test-data.json
