# Real Estate AI Sales OS
## Canva-Ready Deck Outline

Use this as a direct slide-writing document for Canva. Each section below is one slide.

---

## Slide 1 - Title
**Title**
Real Estate AI Sales OS

**Subtitle**
Lead Prioritization, Follow-up Intelligence, and Sales Guidance for Residential Real Estate Teams

**Footer**
Standalone SaaS concept for developers, channel partners, and broker teams

**Visual direction**
- premium, warm, modern
- residential cityscape or sales dashboard background
- subtle teal and sand palette

---

## Slide 2 - The Problem
**Title**
Why Sales Teams Need This

**Body**
- Sales reps handle too many leads without a clear priority order
- Follow-ups are inconsistent and good leads cool off
- Managers do not get a clean daily view of who needs intervention
- Scripts and objection handling depend too much on individual instinct
- Existing tools act like CRMs, not decision engines

**Closing line**
The real problem is not lead volume. It is decision quality and execution speed.

---

## Slide 3 - Product Definition
**Title**
What This Product Is

**Body**
An AI-powered Sales OS for real estate teams that helps:
- prioritize leads
- guide sales conversations
- improve conversion rates

**Not this**
- not a CRM
- not a marketing tool
- not just a reporting dashboard

**This**
A decision and execution engine for sales teams.

---

## Slide 4 - Wedge MVP
**Title**
Wedge MVP: Lead Prioritization + Follow-up Copilot

**Body**
The first version focuses on one narrow, valuable workflow:
- who should the rep call today
- what is the probability this lead converts
- what is the best next action
- what should the rep say on the call

**Goal**
Increase conversion per lead without increasing lead volume.

---

## Slide 5 - Screen 1
**Title**
Screen 1: Lead Dashboard

**Body**
Core elements:
- all leads listed in one ranked view
- sorted by lead score
- each lead shows name, project, budget, last contact, score, status, assigned rep, and action tag
- top section highlights the top 5 leads to call today

**What this screen solves**
Removes guesswork from daily lead selection.

**Visual note**
Use a dashboard screenshot from:
`demos/sales-os/sales-os-demo.html`

---

## Slide 6 - Screen 2
**Title**
Screen 2: Lead Detail View

**Body**
Sections:
- summary: project, budget, source, rep, last contact
- AI insights: score reasoning, conversion probability, risk indicators
- next best action: one clear recommendation with a why-now explanation
- call script: opening line, pitch angle, objection handling, closing line

**What this screen solves**
Turns a lead record into an actionable sales conversation.

---

## Slide 7 - Screen 3
**Title**
Screen 3: Manager Dashboard

**Body**
Manager view shows:
- total leads
- high-priority leads
- missed follow-ups
- average engagement
- rep-wise effectiveness ranking

**What this screen solves**
Lets managers identify where intervention, coaching, or escalation is needed.

---

## Slide 8 - Screen 4
**Title**
Screen 4: Sales Agent Ranking

**Body**
Every rep gets a live performance card showing:
- assigned lead count
- hot leads owned
- average lead score
- engagement quality
- effectiveness score

**Why it matters**
This creates accountability and surfaces coaching opportunities without waiting for end-of-month review cycles.

---

## Slide 9 - Workflow 1
**Title**
Daily Sales Rep Workflow

**Body**
1. Rep opens dashboard
2. System surfaces top leads for the day
3. Rep opens a lead detail card
4. Rep sees next best action and talk track
5. Rep calls or follows up immediately
6. Manager can monitor missed follow-ups and stalled leads

**Key principle**
The tool must be faster than the rep’s current process.

---

## Slide 10 - Workflow 2
**Title**
Lead Intelligence Workflow

**Body**
Input data:
- budget
- project
- source
- last contact date
- stage or status
- notes
- engagement behavior

Processing:
- lead scoring logic
- engagement scoring
- next best action generation
- script generation

Output:
- ranked lead
- action priority
- rep guidance

---

## Slide 11 - Workflow 3
**Title**
Manager Intervention Workflow

**Body**
1. Manager reviews high-priority leads
2. System flags missed follow-ups, cooling leads, and escalation candidates
3. Manager filters by rep
4. Manager joins selected deals or redirects rep focus
5. Team re-engages at-risk leads faster

**Outcome**
Fewer good leads are lost because of delayed execution.

---

## Slide 12 - Product Architecture
**Title**
High-Level Product Architecture

**Body**
Layers:
- Data layer
- Scoring layer
- Guidance layer
- App layer
- Admin and analytics layer

**Structure**
- data connectors ingest lead and project information
- scoring logic ranks leads and engagement
- guidance engine generates action and scripts
- app UI serves reps and managers
- analytics layer tracks usage and effectiveness

---

## Slide 13 - Canonical Schema
**Title**
Core Schema

**Body**
Primary objects:
- tenants
- users
- projects
- inventory units
- leads
- opportunities
- calls
- objections
- stage history
- documents
- playbooks
- answer logs

**Scoring tables**
- lead_scores
- engagement_scores
- sales_agent_metrics
- objection_outcomes

**Note**
This creates one consistent model even when customer data comes from messy sheets or CRM exports.

---

## Slide 14 - Lead Scoring Logic
**Title**
Lead Ranking and Engagement Logic

**Body**
Lead score considers:
- budget fit
- project fit
- source quality
- recency
- stage progress
- site visit completion
- follow-up responsiveness

Engagement score considers:
- reply speed
- meetings attended
- site visit behavior
- quote requests
- inactivity period

**Result**
Every lead gets a clear priority profile, not just a static record.

---

## Slide 15 - AI Guidance Layer
**Title**
What the AI Generates

**Body**
For each lead, the system generates:
- conversion probability
- risk indicators
- single best next action
- a natural call script
- objection handling angle
- manager escalation cue if needed

**Key principle**
Rules plus AI, not AI alone.

---

## Slide 16 - Customer Onboarding
**Title**
How a Real Estate Company Starts

**Body**
1. Create workspace
2. Connect Google Sheets, CSV, or CRM exports
3. Map fields into the canonical schema
4. Define funnel stages and objection categories
5. Upload project docs, pricing sheets, and scripts
6. Launch rep dashboard and manager dashboard

**Outcome**
Every tenant gets its own company-specific sales copilot.

---

## Slide 17 - MVP Feature List
**Title**
What the MVP Includes

**Body**
- lead dashboard
- top 5 call queue
- lead detail view
- manager snapshot
- rep effectiveness ranking
- rule-backed lead score
- engagement score
- next best action
- call script generation
- basic filters

**Out of scope initially**
- deep CRM write-back
- advanced analytics
- full workflow automation
- predictive ML models

---

## Slide 18 - Build Phases
**Title**
What We Build First vs Later

**Build first**
- lead ranking
- engagement score
- lead detail drawer
- manager dashboard
- rep ranking
- rule plus prompt logic

**Build next**
- Google Sheets ingestion
- tenant onboarding
- per-company prompt tuning
- objection libraries

**Build later**
- CRM sync
- advanced analytics
- WhatsApp integration
- automated coaching

---

## Slide 19 - Pricing Model
**Title**
SaaS Pricing Model

**Body**
Recommended structure:
- one-time onboarding fee
- monthly platform fee
- per-seat pricing
- optional AI usage overage

**Packaging**
- Starter
- Growth
- Enterprise

**Commercial logic**
Charge for setup because data mapping is real work.
Charge recurring because the product becomes part of daily sales execution.

---

## Slide 20 - Why This Wins
**Title**
Why This Product Can Matter

**Body**
- improves sales discipline without forcing CRM-heavy behavior
- helps new reps perform faster
- reduces dependence on instinct and memory
- gives managers real intervention visibility
- creates a compounding intelligence layer over time

**Closing line**
This is not another sales dashboard. It is an execution engine for converting better with the same lead base.

---

## Optional Appendix Slide - Demo Paths
**Title**
Prototype References

**Body**
- Entrust interiors demo:
  `demos/entrust-interiors/index.html`
- Generic real-estate demo:
  `demos/generic-real-estate/generic-real-estate-demo.html`
- Sales OS wedge demo:
  `demos/sales-os/sales-os-demo.html`

---

## Optional Canva Build Notes
**Typography**
- Heading: elegant serif
- Body: clean sans serif

**Color palette**
- deep teal
- sand
- off-white
- muted gold

**Layout guidance**
- one clear headline per slide
- 3 to 5 bullets maximum
- use mock dashboards, cards, and flow diagrams
- keep the tone operator-focused, not overly technical
