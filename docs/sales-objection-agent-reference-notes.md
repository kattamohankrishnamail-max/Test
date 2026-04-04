# Sales Objection Agent Reference Notes

These notes summarize the external architecture sections provided by the user and connect them to the current IIOS sales intelligence MVP work in this workspace.

## What These Additional Sections Add

The new material sharpens five areas:

1. A clearer 5-stage retrieval pipeline
2. A stronger module breakdown for implementation
3. A useful 12-tool mental model for future backend design
4. Better performance framing for a real productized version
5. A more explicit multi-layer storage path beyond the Google-native MVP

## Best Takeaways To Adopt Immediately

### 1. Treat the MVP as an orchestrated retrieval system

The agent should not behave like a generic chatbot.

It should follow a predictable path:

1. classify the question
2. identify entities and intent
3. retrieve from the right domains in parallel
4. assemble ranked context
5. generate an answer with evidence and confidence

### 2. Keep the source hierarchy explicit

For the IIOS use case, source priority should remain:

1. approved marketing / GTM / brand material
2. current deal and funnel state
3. latest account-specific call notes
4. similar past cases and objection patterns
5. general heuristics

This is more important than model sophistication.

### 3. The 12-tool model is a good backend decomposition

Even if the demo does not implement literal tools yet, the future codebase can map well to the following functions:

- search calls
- search objections
- get handling strategy
- get similar cases
- get deal status
- get competitor analysis
- get case studies
- get brand guidelines
- get product value props
- search FAQ
- get deal progression
- log interaction

### 4. The real system should have phased storage, not just Sheets

The reference architecture suggests:

- Google Sheets / Workspace as source of truth
- PostgreSQL as working relational store
- Redis for session and query cache
- vector database for semantic search in phase 2+

This is a strong direction after the Google-native validation stage.

### 5. Response structure should stay operational

The best response shape remains:

- direct answer
- recommended strategy / talk track
- supporting evidence
- next steps
- confidence and freshness
- citations / sources

## What To Keep From The Current IIOS Plan

The IIOS framing should still anchor the build:

- Capture -> Structure -> Intelligence
- the moat is the capture habit, not the model
- Google-native first is correct for MVP
- read-only copilot first is correct
- narrow workflow coverage is better than premature breadth

## Reconciled Implementation View

The strongest practical path now looks like this:

### Phase 0: Demo

- static local UI
- dummy data
- simulated retrieval and source-backed answer composition

### Phase 1: Google-native MVP

- Google Sheets as operational database
- Google Drive / Docs as document store
- backend service with 5 to 8 essential retrieval tools
- LLM synthesis with citations
- answer log and feedback capture

### Phase 2: Retrieval enhancement

- PostgreSQL working store
- Redis cache
- embeddings and semantic matching
- richer conversation memory

### Phase 3: Multi-user productionization

- role-based access
- analytics
- hardened deployment
- broader source integrations

## Recommended Essential Tool Set For Real Phase 1

Do not build all 12 tools first.

Start with these 7:

1. `SearchCallNotes`
2. `SearchObjections`
3. `GetHandlingStrategy`
4. `GetDealStatus`
5. `GetBrandGuidelines`
6. `GetCaseStudies`
7. `LogInteraction`

Then add:

8. `GetCompetitorAnalysis`
9. `GetDealProgression`
10. `SearchFAQ`

## Suggested Tech Decision

For this workspace and the likely MVP pace, I would lean toward:

- TypeScript
- small Express or Fastify backend
- simple static frontend first
- Google Sheets API + Drive API
- SQLite or Postgres later depending on how quickly data volume grows

If speed of prototyping matters more than type-safe backend structure, FastAPI is also reasonable, but the current documentation shape maps cleanly to TypeScript modules.

## Practical Conclusion

These new sections are useful and worth keeping as reference, but they should not force us to overbuild the first milestone.

The immediate job is still:

- prove the workflow
- validate the data schema
- validate the answer format
- validate that reps find the copilot useful

Only then should we invest in the full multi-layer retrieval stack.
