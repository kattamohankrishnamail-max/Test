# Sales Objection Agent - System Architecture Diagrams

## High-Level Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    SALES REP USER                               │
│              "How do I handle price objections                  │
│               in enterprise deals?"                             │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  WEB/API INTERFACE                              │
│           (HTML form + Express/FastAPI routes)                 │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                AGENT ORCHESTRATOR                               │
│    ├─ Parse & normalize query                                   │
│    ├─ Extract entities (objection, stage, segment)              │
│    └─ Route to retrieval pipeline                               │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│            MULTI-STAGE RETRIEVAL PIPELINE                       │
│                                                                  │
│  Stage 1: Intent Classification                                │
│  └─ Extract: objection_id=OBJ-001, segment=enterprise          │
│                                                                  │
│  Stage 2: Structured Data Retrieval (Parallel 5 Branches)      │
│  ├─► Branch 1: SearchObjections() + GetHandlingStrategy()      │
│  ├─► Branch 2: SearchDeals(stage=enterprise) + Patterns        │
│  ├─► Branch 3: GetProductValueProps() + Evidence               │
│  ├─► Branch 4: GetCompetitorAnalysis() + Differentiation       │
│  └─► Branch 5: GetCaseStudies() + GetBrandGuidelines()         │
│                                                                  │
│  Stage 3: Semantic Context Matching (Phase 2: vectors)         │
│  └─ Find similar objections, cross-reference cases             │
│                                                                  │
│  Stage 4: Cross-Domain Enrichment                              │
│  └─ Link objections to value props, case studies, messaging    │
│                                                                  │
│  Stage 5: Context Assembly & Ranking                           │
│  └─ Merge, rank by relevance/recency, score confidence         │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
         ┌────────────────────────────┐
         │ GOOGLE SHEETS              │
         │ ├─ Sales Calls Repository  │
         │ ├─ Objections Database     │
         │ ├─ Sales Funnel            │
         │ ├─ Marketing & GTM         │
         │ ├─ Brand Guidelines        │
         │ └─ Knowledge Base           │
         └────────────────────────────┘
                      │
         ┌────────────────────────────┐
         │ CACHING LAYERS             │
         │ ├─ Redis (Session cache)   │
         │ ├─ PostgreSQL (Working DB) │
         │ └─ Pinecone (Vector index) │
         └────────────────────────────┘
                      │
           ┌──────────────────────────┐
           │ Retrieved Context Window │
           │  - Objection strategy    │
           │  - Similar deals (3)     │
           │  - Case studies (2)      │
           │  - Brand messaging       │
           │  - Competitor analysis   │
           │  - Confidence: 82%       │
           └──────────────────────────┘
                      │
                      ▼
    ┌────────────────────────────────────┐
    │    PROMPT CONSTRUCTION             │
    │  System Prompt (role, constraints) │
    │  + Context Window (ranked data)    │
    │  + Conversation History (last 10)  │
    │  + User Query (original question)  │
    └──────────────┬─────────────────────┘
                   │
                   ▼
    ┌────────────────────────────────────┐
    │  LLM INVOCATION                    │
    │  Claude 3.5 Sonnet                 │
    │  - Temperature: 0.7                │
    │  - Max tokens: 2000                │
    │  - Tools available: lookup, search │
    └──────────────┬─────────────────────┘
                   │
                   ▼
    ┌────────────────────────────────────┐
    │  RESPONSE ENHANCEMENT              │
    │  ├─ Format with citations          │
    │  ├─ Validate vs brand guidelines   │
    │  ├─ Add confidence badges          │
    │  ├─ Create action items            │
    │  └─ Optimize readability           │
    └──────────────┬─────────────────────┘
                   │
                   ▼
    ┌────────────────────────────────────┐
    │  FORMATTED RESPONSE                │
    │                                    │
    │  ## Price Objection Strategy       │
    │                                    │
    │  ### Recommended Approach          │
    │  1. Lead with ROI...               │
    │  2. Offer flexible terms...        │
    │                                    │
    │  ### Supporting Evidence           │
    │  - Success rate: 76%               │
    │  - Case Study: Global Mfg Inc      │
    │                                    │
    │  ### Next Steps                    │
    │  - Share ROI calculator            │
    │  - Follow up in 2 days             │
    │                                    │
    │  Confidence: 82% | Age: Real-time  │
    └──────────────┬─────────────────────┘
                   │
                   ▼
    ┌────────────────────────────────────┐
    │  LOGGING & LEARNING                │
    │  ├─ Store interaction              │
    │  ├─ Track effectiveness            │
    │  ├─ Extract patterns               │
    │  ├─ Update metrics                 │
    │  └─ Flag anomalies                 │
    └──────────────┬─────────────────────┘
                   │
                   ▼
    ┌────────────────────────────────────┐
    │    USER RECEIVES RESPONSE          │
    │    (Display in web UI)             │
    └────────────────────────────────────┘
```

---

## Data Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    GOOGLE SHEETS                                 │
│              (Single Source of Truth)                            │
│                                                                  │
│  ┌─ Sales Calls Repository              ┌─ Objections Database  │
│  │  ├─ Call Log                          │  ├─ Catalog            │
│  │  ├─ Call Remarks                      │  ├─ Handling Strategies│
│  │  └─ Call Metadata                     │  └─ Mappings           │
│  │                                       │                        │
│  └─────────────────────────────────────┐ │  ┌─ Sales Funnel     │
│                                         │ │  │  ├─ Stages         │
│  ┌─ Marketing & GTM                    │ │  │  ├─ Deals          │
│  │  ├─ GTM Strategy                    │ │  │  └─ Progression    │
│  │  ├─ Case Studies                    │ │  │                    │
│  │  ├─ Competitor Analysis             │ │  └──────────────────┘│
│  │  └─ Product Value Props             │ │                       │
│  │                                     │ │  ┌─ Brand Guidelines │
│  └─────────────────────────────────────┤ │  │  ├─ Standards     │
│                                         │ │  │  ├─ Messages      │
│  ┌─ Agent Knowledge Base               │ │  │  └─ Tone/Language │
│  │  ├─ FAQ                              │ │  │                    │
│  │  ├─ Quick References                │ │  └──────────────────┘│
│  │  └─ Performance Metrics             │ │                       │
│  └─────────────────────────────────────┘ └──────────────────────┘
└──────────────────────────────────────────────────────────────────┘
              │              │              │
     (Nightly Sync)   (On-demand)    (Weekly Sync)
              │              │              │
              ▼              ▼              ▼
┌──────────────────────────────────────────────────────────────────┐
│              MULTI-LAYER STORAGE SYSTEM                          │
│                                                                  │
│  Layer 1: PostgreSQL (Normalized Working Database)              │
│  ├─ Relational schema with foreign keys                         │
│  ├─ Full-text search indices                                    │
│  ├─ pgvector for stored embeddings                              │
│  └─ Optimized for complex queries                               │
│                                                                  │
│  Layer 2: Redis (Session & Query Cache)                         │
│  ├─ LRU eviction, TTL: 30 minutes                                │
│  ├─ Session state (conversation history)                        │
│  ├─ Recent query results                                        │
│  ├─ Rate limiting buckets                                       │
│  └─ Sub-millisecond lookup performance                          │
│                                                                  │
│  Layer 3: Pinecone/Weaviate (Vector Database)                  │
│  ├─ Semantic similarity search                                  │
│  ├─ Objection embeddings                                        │
│  ├─ GTM material embeddings                                     │
│  ├─ Real-time indexing                                          │
│  └─ Top-K similarity retrieval                                  │
│                                                                  │
│  Layer 4: Local Cache (in-memory)                               │
│  ├─ Pre-computed indices                                        │
│  ├─ Frequent queries                                            │
│  └─ Reference data (brands, competitors)                        │
└──────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                       AGENT SYSTEM                                  │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  AGENT ORCHESTRATOR (orchestrator.ts)                        │  │
│  │  ├─ handleUserQuery(userId, query)                           │  │
│  │  ├─ classifyIntent(query)                                    │  │
│  │  ├─ orchestrateRetrieval(intent)                             │  │
│  │  ├─ synthesizeResponse(context, history)                     │  │
│  │  └─ logInteraction(query, response, feedback)                │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                            │                                        │
│     ┌──────────────────────┼──────────────────────┐               │
│     │                      │                      │               │
│     ▼                      ▼                      ▼               │
│  ┌───────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │ INTENT        │  │ RETRIEVAL        │  │ MEMORY           │  │
│  │ CLASSIFIER    │  │ PIPELINE         │  │ MANAGER          │  │
│  │               │  │                  │  │                  │  │
│  │ Extracts:     │  │ 5-stage flow:    │  │ Maintains:       │  │
│  │ - entities    │  │ 1. Classification│  │ - Session state  │  │
│  │ - intent      │  │ 2. Structured R. │  │ - History (10)   │  │
│  │ - domain      │  │ 3. Semantic M.   │  │ - Cache/TTL      │  │
│  │ - confidence  │  │ 4. Enrichment    │  │ - User profile   │  │
│  │               │  │ 5. Assembly      │  │                  │  │
│  └───────────────┘  └──────────────────┘  └──────────────────┘  │
│                            │                                        │
│     ┌──────────────────────┼──────────────────────┐               │
│     │                      │                      │               │
│     ▼                      ▼                      ▼               │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │ GOOGLE SHEETS    │  │ TOOL EXECUTOR    │  │ RESPONSE         │ │
│  │ CLIENT           │  │                  │  │ BUILDER          │ │
│  │                  │  │ Invokes:         │  │                  │ │
│  │ - authenticate() │  │ 1. SearchCalls() │  │ - Format output  │ │
│  │ - fetchRange()   │  │ 2. SearchObj()   │  │ - Add citations  │ │
│  │ - searchRows()   │  │ 3. GetStrategy() │  │ - Validate brand │ │
│  │ - batchFetch()   │  │ 4. GetCases()    │  │ - Add confidence │ │
│  │ - getCachedData()│  │ 5. GetDealStatus │  │ - Action items   │ │
│  │ - setCachedData()│  │ 6. GetCompAnalys │  │ - Optimize UX    │ │
│  │                  │  │ 7. GetBrandGuid  │  │                  │ │
│  │ Rate limiting    │  │ 8. GetValueProps │  │ Output format:   │ │
│  │ Connection pool  │  │ 9. SearchFAQ()   │  │ - Markdown       │ │
│  │ Exponential      │  │ 10. GetDealProg  │  │ - Structured     │ │
│  │ backoff          │  │ 11. LogInteract  │  │ - Confidence     │ │
│  │                  │  │ 12. [Custom]     │  │                  │ │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘ │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

## 12 Core Tools Interaction Map

```
User Query: "How do I handle price objections in enterprise deals?"
                           │
                           ▼
          ┌────────────────────────────────┐
          │ Intent: objection_handling      │
          │ Segment: enterprise             │
          │ Domain: objection + strategy    │
          └────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │ Tool 2       │ │ Tool 3       │ │ Tool 4       │
    │ SearchObj    │ │ GetStrategy  │ │ GetSimilar   │
    │ ("price")    │ │ (OBJ-001)    │ │ Cases        │
    │              │ │              │ │ (OBJ-001)    │
    │ Returns:     │ │ Returns:     │ │ Returns:     │
    │ OBJ-001,012  │ │ Strategy     │ │ Case-001,003 │
    │ OBJ-010      │ │ Success: 76% │ │ ROI: 40%     │
    │              │ │ Timeline: 3d │ │ Speed: 50%   │
    └──────────────┘ └──────────────┘ └──────────────┘
           │               │               │
           │               │               │
      ┌────┴───────────────┴───────────────┴─────┐
      │                                           │
      ▼                                           ▼
  ┌──────────────┐                        ┌──────────────┐
  │ Tool 5       │                        │ Tool 6       │
  │ GetDealStatus│                        │ GetCompAnalys│
  │              │                        │              │
  │ Returns:     │                        │ Returns:     │
  │ Stage: Eval  │                        │ Comp X: Low  │
  │ Objects: 2   │                        │ Strength: $  │
  │ Value: $150K │                        │ Our: Flex    │
  └──────────────┘                        └──────────────┘
      │                                           │
      └────────────────┬────────────────────────┘
                       │
      ┌────────────────┼───────────────────────┐
      │                │                       │
      ▼                ▼                       ▼
  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
  │ Tool 7       │ │ Tool 8       │ │ Tool 9       │
  │ GetCaseStud  │ │ GetBrand     │ │ GetValueProp │
  │              │ │ Guidelines   │ │              │
  │ Returns:     │ │              │ │ Returns:     │
  │ Pub Case-1,3 │ │ Returns:     │ │ Feature: Flex│
  │ ROI highlight│ │ Message core │ │ Benefit: $   │
  │              │ │ Tone: Data   │ │ Evidence: $-35│
  └──────────────┘ └──────────────┘ └──────────────┘
      │                │                       │
      └────────────────┼───────────────────────┘
                       │
                       ▼
          ┌────────────────────────────┐
          │ Context Window Assembled:  │
          │ - Strategies               │
          │ - Success rates (76%)      │
          │ - Similar deals (3)        │
          │ - Case studies (2)         │
          │ - Brand messaging          │
          │ - Competitor positioning   │
          │ - Value propositions       │
          │ Confidence: 82%            │
          └────────────────────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │ Claude LLM Response  │
            │ (Formatted & Cited)  │
            └──────────────────────┘
                       │
                       ▼
          ┌────────────────────────────┐
          │ Tool 12: LogInteraction    │
          │                            │
          │ Stores:                    │
          │ - Query + Response         │
          │ - Timestamp                │
          │ - Tools used               │
          │ - User feedback            │
          │ - Effectiveness rating     │
          │                            │
          │ Updates:                   │
          │ - Success metrics          │
          │ - Pattern extraction       │
          │ - Model retraining signals │
          └────────────────────────────┘
```

---

## Request/Response Timeline

```
Time    Action                          Duration  Status
────────────────────────────────────────────────────────────
0ms     User submits query             

5ms     Query preprocessing            +5ms      ✓ Parse, normalize
10ms    Intent classification          +5ms      ✓ Extract entities
20ms    Retrieval pipeline START       +10ms     ✓ Parallel branches:
        
        ├─ Branch 1: Objections        +400ms    ✓ SearchObj + Strategy
        ├─ Branch 2: Deals             +350ms    ✓ SearchDeals + Patterns
        ├─ Branch 3: Product           +300ms    ✓ GetValueProps
        ├─ Branch 4: Competitor        +280ms    ✓ GetCompAnalysis
        └─ Branch 5: GTM               +380ms    ✓ GetCaseStudies + Brand
        
420ms   Context assembly               +120ms    ✓ Merge, rank, deduplicate
540ms   Prompt construction            +50ms     ✓ Build full prompt
590ms   LLM Invocation (Claude)        +1500ms   ✓ Stream response
2090ms  Response formatting            +100ms    ✓ Citations, confidence
2190ms  Logging & Analytics            +50ms     ✓ Store interaction
2240ms  Response sent to user          TOTAL: 2.24s
────────────────────────────────────────────────────────────

Target Performance:
- p95 latency: < 3 seconds
- p99 latency: < 5 seconds
- Median: 2.2-2.4s
```

---

## State Machine: User Interaction Flow

```
                    ┌─────────────────┐
                    │   START         │
                    │ (New Session)   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ WAIT_FOR_QUERY  │
                    │ Create session  │
                    │ Load user role  │
                    └────────┬────────┘
                             │ User enters query
                             ▼
                    ┌─────────────────┐
        ┌──────────►│ PROCESSING      │
        │           │ - Parse query   │
        │           │ - Classify      │
        │           │ - Retrieve data │
        │           │ - Build context │
        │           │ - Call LLM      │
        │           │ - Format result │
        │           └────────┬────────┘
        │                    │ Response ready
        │                    ▼
        │           ┌─────────────────┐
        │           │ DISPLAYING      │
        │           │ - Render result │
        │           │ - Show metadata │
        │           │ - Log metrics   │
        │           └────────┬────────┘
        │                    │ Display complete
        │                    ▼
        │           ┌─────────────────┐
        │           │ READY_FOR_NEXT  │
        │           │ Continue / Exit │
        │           └────────┬────────┘
        │                    │
        │ Next question      │ User provides feedback
        └────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ FEEDBACK        │
                    │ - Rate response │
                    │ - Mark helpful  │
                    │ - Add notes     │
                    │ - Log feedback  │
                    └────────┬────────┘
                             │ Feedback recorded
                             ▼
                    ┌─────────────────┐
                    │ END SESSION     │
                    │ Save history    │
                    │ Archive logs    │
                    └─────────────────┘
```

---

## Phase-Based Rollout

```
Phase 1: Foundation (Weeks 1-3)
─────────────────────────────────
✓ Google Sheets integration (keywords, no vectors)
✓ Basic orchestrator (single intent class)
✓ 5-6 essential tools (SearchObj, GetStrategy, GetCases, etc)
✓ Simple ranking (frequency + recency)
✓ Claude API calls with context
✓ Basic logging
✓ Simple web UI

Phase 2: Enhancement (Weeks 4-6)
─────────────────────────────────
✓ Vector embeddings (Pinecone/Weaviate)
✓ Semantic search (top-K similarity)
✓ Conversation history (Redis)
✓ Advanced ranking (relevance scores)
✓ Multi-branch parallel retrieval
✓ Caching layer (memory + Redis)
✓ Logging analytics

Phase 3: Intelligence (Weeks 7-9)
──────────────────────────────────
✓ Advanced intent classification
✓ Cross-domain objection linking
✓ Deal stage context awareness
✓ Feedback loops
✓ Learning from interactions
✓ Confidence scoring
✓ Response grading

Phase 4: Scale (Weeks 10+)
──────────────────────────
✓ Multi-user OAuth
✓ Role-based access control
✓ Advanced analytics
✓ Fine-tuning on use cases
✓ HA/failover setup
✓ Performance optimization
✓ Production deployment
```

This architecture provides everything needed to build a high-performance, scalable sales objection handling agent!
