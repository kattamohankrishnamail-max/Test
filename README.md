# Sales Objection Handling Agent

A conversational AI agent that helps sales and presales teams instantly handle objections by searching previous conversations, accessing marketing GTM materials, and providing data-driven response strategies.

## Problem Statement

Sales reps currently waste **15-20 minutes per call** searching across Google Sheets/Workspace for:
- Previous objection handling approaches
- Relevant case studies and success metrics
- Competitive positioning
- Brand-aligned messaging
- Deal progression patterns

**Knowledge silos** mean what works for one rep is unknown to others.

## Solution

A unified AI agent that:
✅ Searches all previous sales conversations and call remarks  
✅ Accesses marketing GTM material and brand guidelines  
✅ Correlates objections with funnel stage, deal value, and resolution rates  
✅ Provides context-aware handling strategies with evidence  
✅ Learns from interactions to improve recommendations  
✅ Delivers results in **<3 seconds**

## Example Interaction

**Sales Rep:** "How do I handle price objections in enterprise deals?"

**Agent Response:**
```
## How to Handle Price Objections in Enterprise Deals

### Strategy
Lead with ROI analysis, then offer flexible payment terms

### Supporting Evidence
- Success Rate: 76% of enterprise price objections resolved
- Similar Cases: 3 active deals at negotiation stage
- Case Study: Global Manufacturing Inc (40% cost reduction, 6-month payoff)

### Sample Response
"Let me show you how similar companies in your industry justified this investment..."

### Next Steps
1. Share ROI calculator tool (avg 18-month payoff)
2. Propose flexible payment terms aligned with their procurement cycle
3. Schedule follow-up call in 2 days

**Confidence: 82% | Data Freshness: Real-time + 1-3 days | Similar Cases: 23**
```

## Architecture Highlights

### Data Sources (6 Google Sheets Areas)
- **Sales Calls:** Transcripts, remarks, metadata (45+ historical calls)
- **Objections:** Catalog with success rates, handling strategies, mappings
- **Sales Funnel:** Stages, deals, progression tracking
- **Marketing:** GTM materials, case studies, competitor analysis
- **Brand:** Guidelines, messaging frameworks, tone/language rules
- **Knowledge Base:** FAQ, quick references, performance metrics

### Core Components (6 Modules)
1. **Agent Orchestrator** — Conversation management, intent routing
2. **GoogleSheetsClient** — Data integration with caching
3. **RetrievalPipeline** — 5-stage context gathering (parallel branches)
4. **ToolExecutor** — 12 core data access functions
5. **MemoryManager** — Session state, conversation history (10 turns)
6. **ResponseBuilder** — Formatting, citations, confidence scoring

### Processing Flow (10 Steps)
```
User Query → Intent Classification → Multi-Domain Data Retrieval (5 parallel branches)
→ Context Assembly & Ranking → Prompt Construction → LLM Invocation (Claude 3.5 Sonnet)
→ Response Enhancement → Validation → Logging & Learning → User Response
```

### Tech Stack
- **Agent Framework:** Anthropic SDK (Claude API) + custom orchestration
- **Backend:** Node.js/Python + Express/FastAPI
- **Data Layers:** Google Sheets → PostgreSQL → Redis (cache) → Pinecone (vectors)
- **Performance:** p95 response latency < 3 seconds, cache hit ratio > 70%
- **Deployment:** Docker + Kubernetes/Cloud Run (auto-scaling)

## The 12 Core Tools

1. **SearchCallTranscripts** — Find calls by keyword, date, sales rep
2. **SearchObjections** — Find objection patterns and frequency data
3. **GetHandlingStrategy** — Retrieve proven tactics with success rates
4. **GetSimilarCases** — Find case studies matching objection type
5. **GetDealStatus** — Check deal stage and objections faced
6. **GetCompetitorAnalysis** — Get competitive positioning insights
7. **GetCaseStudies** — Retrieve published case studies by category
8. **GetBrandGuidelines** — Get approved messaging and tone guidelines
9. **GetProductValueProps** — Get product features addressing objections
10. **SearchFAQ** — Find common Q&A about pricing, timeline, features
11. **GetDealProgression** — See how similar deals moved through stages
12. **LogInteraction** — Store effectiveness metrics for learning

## Implementation Timeline

| Phase | Duration | Focus | Status |
|-------|----------|-------|--------|
| **Phase 1: Foundation** | Weeks 1-3 | Google Sheets integration, basic retrieval, Claude API | 📋 Ready to start |
| **Phase 2: Enhancement** | Weeks 4-6 | Vector search, multi-domain retrieval, caching | Planned |
| **Phase 3: Intelligence** | Weeks 7-9 | Advanced routing, deal context, feedback loops | Planned |
| **Phase 4: Scale** | Weeks 10+ | Multi-user OAuth, analytics, fine-tuning, HA | Planned |

## Success Metrics

- ✅ Objection resolution success rate > 75%
- ✅ Average response latency < 3 seconds
- ✅ Cache hit ratio > 70%
- ✅ User satisfaction score > 4.2/5
- ✅ Deal progression improvement > 10% (post-deployment)

## Documentation

### 📘 [QUICK_START.md](./QUICK_START.md)
Executive summary with quick reference, MVP overview, and getting started checklist.
**Start here if you want a 5-minute overview.**

### 📗 [ARCHITECTURE.md](./ARCHITECTURE.md)
Complete technical specification with:
- Detailed Google Sheets schema (6 sheet areas with sample data)
- Agent architecture and components
- 5-stage retrieval pipeline design
- 12 core tool definitions
- Tech stack recommendations
- Phase-based implementation plan

### 📊 [SYSTEM_DIAGRAM.md](./SYSTEM_DIAGRAM.md)
Visual architecture diagrams including:
- High-level data flow (10-step process)
- Multi-layer storage architecture
- Component interaction maps
- Request/response timeline with performance targets
- State machine for user interactions
- Phase-based rollout visualization

## Next Steps

### Option 1: Learn the Architecture
1. Read [QUICK_START.md](./QUICK_START.md) (5 min)
2. Review [SYSTEM_DIAGRAM.md](./SYSTEM_DIAGRAM.md) (10 min)
3. Deep dive into [ARCHITECTURE.md](./ARCHITECTURE.md) (20 min)

### Option 2: Start Building Phase 1
1. Set up Google Sheets with 6 sheet areas and test data
2. Initialize Node.js/Python project with dependencies
3. Implement GoogleSheetsClient for data access
4. Build Orchestrator skeleton
5. Create 12 tool definitions
6. Connect to Claude API
7. Deploy locally and test

### Option 3: Request Custom Planning
Discuss specific requirements, tech preferences, timeline, and team size to refine the plan.

## Key Decisions to Make

1. **Tech Stack**
   - Node.js + Express or Python + FastAPI?
   - PostgreSQL or different database?
   - Pinecone or Weaviate for vectors? (Phase 2)

2. **Deployment**
   - Local development only, or cloud-ready?
   - Kubernetes or Cloud Run/App Engine?
   - AWS, GCP, or Azure?

3. **Data**
   - When to add vector embeddings? (Phase 2 or earlier?)
   - Multi-user OAuth from start, or Phase 4?
   - Real-time updates or scheduled syncs?

4. **MVP Scope**
   - Start with 5 tools or all 12?
   - Single-turn or multi-turn conversation from start?
   - Analytics from day 1 or later?

## Success Criteria (Go-Live Checklist)

- [ ] All 12 tools tested against real Google Sheets data
- [ ] Response latency p95 < 3 seconds
- [ ] Cache hit ratio > 70%
- [ ] Claude responses pass brand compliance audit
- [ ] Conversation history persists across sessions
- [ ] Logging captures all key metrics
- [ ] Graceful error handling (degradation if Sheets unavailable)
- [ ] Rate limiting enforced (100 req/min per user)
- [ ] Complete documentation (API, deployment, user guide)

## Repository Structure

```
.
├── README.md                    # This file
├── QUICK_START.md               # 5-minute overview
├── ARCHITECTURE.md              # Complete technical specification
├── SYSTEM_DIAGRAM.md            # Visual diagrams and flows
├── src/                         # Implementation (phase 1+)
│   ├── agent/
│   │   └── orchestrator.ts
│   ├── integration/
│   │   └── google-sheets-client.ts
│   ├── retrieval/
│   │   └── multi-stage-pipeline.ts
│   ├── tools/
│   │   └── index.ts
│   ├── memory/
│   │   └── session-manager.ts
│   ├── models/
│   │   └── schemas.ts
│   ├── response/
│   │   └── formatter.ts
│   ├── api/
│   │   └── routes.ts
│   ├── config/
│   │   └── constants.ts
│   └── index.ts
├── tests/                       # Unit/integration tests
├── docs/                        # Additional documentation
├── Dockerfile                   # Container configuration
├── docker-compose.yml           # Local development setup
├── package.json                 # Dependencies
└── .env.example                 # Environment template
```

## Getting Help

- **Architecture Questions:** See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Visual Understanding:** See [SYSTEM_DIAGRAM.md](./SYSTEM_DIAGRAM.md)
- **Quick Overview:** See [QUICK_START.md](./QUICK_START.md)
- **Implementation Issues:** Check component-specific documentation in `src/`

## License

TBD

## Contact

TBD

---

**Ready to build?** Choose your starting point above and let's get started! 🚀