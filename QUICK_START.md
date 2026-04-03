# Sales Objection Agent - Quick Start Guide

## What You Have

A complete architectural blueprint for a sales objection handling agent that:
- Searches all previous sales conversations
- Accesses marketing GTM materials and brand guidelines
- Provides evidence-backed objection handling strategies
- Delivers results in <3 seconds

## At a Glance

**Data Sources:** 6 Google Sheets areas
- Sales Calls (transcripts, remarks, metadata)
- Objections (catalog, strategies, mappings)
- Sales Funnel (stages, deals, progression)
- Marketing (GTM, case studies, competitor analysis)
- Brand (guidelines, messages, tone)
- Knowledge (FAQ, quick refs, metrics)

**Agent Components:** 6 core modules
- Orchestrator (conversation management)
- GoogleSheetsClient (data integration)
- RetrievalPipeline (5-stage context gathering)
- Tools (12 core data access functions)
- MemoryManager (conversation history)
- ResponseBuilder (formatting & citations)

**Processing Flow:** 10 steps
Query → Intent Classification → Data Retrieval (parallel 5 branches) → Context Assembly → LLM Invocation → Response Enhancement → Logging

**Tech Stack:**
- Backend: Node.js/Python + Express/FastAPI
- Data: Google Sheets (source) → PostgreSQL (working) → Pinecone/Weaviate (vectors) → Redis (cache)
- LLM: Claude 3.5 Sonnet via Anthropic SDK
- Deploy: Docker + Kubernetes/Cloud Run

## MVP Timeline

**Phase 1 (Weeks 1-3): Foundation**
- Google Sheets integration
- Basic multi-domain retrieval (keyword matching, no vectors)
- Single-turn Claude API calls
- Simple web UI

**Phase 2 (Weeks 4-6): Enhancement**
- Vector embeddings & semantic search
- Conversation history
- Multi-domain retrieval with ranking
- Caching layer

**Phase 3 (Weeks 7-9): Intelligence**
- Intent classification/routing
- Advanced objection similarity
- Deal context awareness
- Feedback loops

**Phase 4 (Weeks 10+): Scale**
- Multi-user OAuth
- Analytics
- Fine-tuning
- Production setup

## The 12 Tools

1. **SearchCallTranscripts** - Find calls by keyword, date, or sales rep
2. **SearchObjections** - Find objection patterns and frequency data
3. **GetHandlingStrategy** - Retrieve proven handling tactics with success rates
4. **GetSimilarCases** - Find case studies matching objection type
5. **GetDealStatus** - Check deal stage and objections faced
6. **GetCompetitorAnalysis** - Get competitive positioning against objections
7. **GetCaseStudies** - Retrieve published case studies by category
8. **GetBrandGuidelines** - Get approved messaging and tone guidelines
9. **GetProductValueProps** - Get product features addressing objections
10. **SearchFAQ** - Find common Q&A about pricing, timeline, etc
11. **GetDealProgression** - See how similar deals progressed through stages
12. **LogInteraction** - Store effectiveness metrics for learning

## Example Flow

**User Asks:** "How do I handle price objections in enterprise deals?"

**Agent Does:**
1. Classifies intent: objection handling strategy for enterprise segment
2. Retrieves data in parallel:
   - Find OBJ-001 (price) handling strategies → success rate 76%
   - Search deals at enterprise stage with price objections → 3 similar deals
   - Get ROI case studies addressing price → 2 case studies
   - Pull brand messaging for CFO persona → "lead with ROI"
   - Get product value props → flexible pricing, 18-month ROI
3. Assembles context window with ranked results
4. Constructs prompt with context + brand guidelines
5. Calls Claude Sonnet for response
6. Formats response with citations and confidence badges
7. Logs interaction for learning

**Agent Responds:**
```
## How to Handle Price Objections in Enterprise Deals

### Strategy
Lead with ROI, then offer flexible terms

### Supporting Evidence
- Success Rate: 76% of enterprise price objections resolved
- Similar Cases: 3 deals in negotiation stage
- Case Study: Global Manufacturing Inc (40% cost reduction, 6-month payoff)

### Sample Response
"Let me show you how similar companies justified this investment..."

### Next Steps
- Share ROI calculator
- Offer flexible payment terms
- Schedule follow-up in 2 days

**Confidence: 82% | Data Age: Real-time + 1-3 days**
```

## Key Files to Create

```
src/
├── agent/
│   └── orchestrator.ts           # Main agent loop
├── integration/
│   └── google-sheets-client.ts   # Google Sheets API wrapper
├── retrieval/
│   └── multi-stage-pipeline.ts   # 5-stage retrieval
├── tools/
│   └── index.ts                  # 12 tool definitions
├── memory/
│   └── session-manager.ts        # Conversation history
├── models/
│   └── schemas.ts                # Data validation
├── response/
│   └── formatter.ts              # Response formatting
├── api/
│   └── routes.ts                 # HTTP endpoints
├── config/
│   └── constants.ts              # Sheet IDs, API keys
└── index.ts                       # Server entrypoint
```

## Getting Started

1. **Read ARCHITECTURE.md** for complete design details
2. **Set up Google Sheets** with 6 sheet areas (see schema section)
3. **Generate test data** (5 calls, 10 objections, 3 case studies)
4. **Initialize project** with Node.js/Python
5. **Create GoogleSheetsClient** for data access
6. **Build Orchestrator** for agent orchestration
7. **Implement Tools** for data retrieval
8. **Connect Claude API** for LLM calls
9. **Deploy & test** with sample queries

## Success Criteria

- Response latency <3 seconds
- Cache hit ratio >70%
- Objection resolution success >75%
- User satisfaction >4.2/5
- On-brand responses validated

## Next: Which step should we start with?

- **Step 2:** Set up Google Sheets structure with sample data
- **Step 3:** Initialize Node.js/Python project with dependencies
- **Step 4:** Implement GoogleSheetsClient with auth

Pick one, and let's start building!
