# Demo Workspace

This workspace now has three separate demo prototypes, each grouped into its own folder under `demos/`.

## Folder Structure

- `demos/entrust-interiors/`
  - `index.html`
  - `styles.css`
  - `app.js`
- `demos/generic-real-estate/`
  - `generic-real-estate-demo.html`
  - `styles-real-estate.css`
  - `app-real-estate.js`
- `demos/sales-os/`
  - `sales-os-demo.html`
  - `sales-os-demo.css`
  - `sales-os-demo.js`
- `docs/`
  - supporting notes and context files
- `iios-sales-agent-mvp-spec.md`
  - product and data blueprint

## Open These Demos

- Entrust interiors demo:
  - `demos/entrust-interiors/index.html`
- Generic residential real-estate demo:
  - `demos/generic-real-estate/generic-real-estate-demo.html`
- Standalone Real Estate AI Sales OS demo:
  - `demos/sales-os/sales-os-demo.html`

## Sales OS Demo

The standalone Sales OS demo is built around the narrower product wedge:

- lead prioritization
- follow-up guidance
- next best action
- call script generation
- manager view
- sales-agent effectiveness ranking

It includes:

- top 5 leads to call today
- clickable lead dashboard
- AI-style lead score and engagement score
- rep-wise effectiveness cards
- detailed lead drawer with script and risk signals

## Domain Context

This project should now be understood as:

- company: Entrust Designs
- use case: internal sales and presales copilot
- domain: premium residential interiors
- location: Bengaluru, India
- objection themes: quote, BOQ, materials, timelines, trust, accountability, remote execution

## Seeded Dataset

The demo now includes a larger interiors-only sandbox with:

- 200+ premium interiors projects
- funnel stages from `lead generated` to `handover completed`
- quote values in the `INR 20L-50L` range
- project types like `3BHK`, `4BHK`, `villa`, and `villament`
- objections across quote, BOQ, materials, timeline, trust, change orders, remote execution, and post-handover support

Featured dummy projects include:

- Project Cedar - Prestige Lakeside Habitat 4BHK
- Project Elan - Adarsh Palm Retreat Villa
- Project Mira - Birla Alokya Villament

## Example Questions

- `How should I handle a pricing objection for a premium apartment client in Whitefield?`
- `How do I explain why our BOQ is higher than a cheaper competitor quote?`
- `What should I say when a client worries the final materials will not match the render?`
- `How do I reassure an NRI villa client about remote execution and updates?`

## Note On The Current Sandbox

The current demo data is still synthetic and partially mixed from earlier generic prototypes.

The working product direction, spec, and context are now Entrust-specific. A future pass can fully reseed the entire dummy dataset around premium apartment and villa projects.

## Upgrade Path

1. Replace dummy data with Google Sheets / Drive reads.
2. Add a backend retrieval service.
3. Connect an LLM with grounded prompts and citations.
4. Add answer logs and feedback collection.
