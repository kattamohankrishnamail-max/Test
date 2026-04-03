# Sales Objection Handling Agent - Complete Architecture & Implementation Plan

## Executive Summary

**What:** A conversational AI agent that helps sales and presales teams instantly handle objections by searching previous conversations, accessing marketing GTM materials, and providing data-driven response strategies.

**Why:** Sales reps currently waste 15-20 min per call searching Google Sheets/Workspace for handling strategies, case studies, and competitive positioning. This agent consolidates all data into a single conversational interface with evidence-backed responses.

**Outcome:** MVP in 3-4 weeks that enables reps to ask "How do I handle price objections from enterprise prospects?" and receive immediate, on-brand, evidence-backed answers with relevant case studies and success rates.

---

## Context & Problem Statement

**Current State:**
- Sales/presales teams store data across multiple Google Sheets (calls, objections, deals, GTM materials, brand guidelines)
- Reps manually search sheets during calls or between meetings
- No systematic way to leverage historical patterns or successful strategies
- Knowledge silos: what works for one rep may be unknown to others

**Solution:** Unified AI agent that:
- Searches all previous sales conversations and call remarks
- Accesses marketing GTM material and brand guidelines
- Correlates objections with funnel stage, deal value, and resolution rates
- Provides context-aware handling strategies with evidence (success rates, case studies, competitor positioning)
- Learns from interactions to improve recommendations

---

## Architecture Overview

### 1. Data Layer (Google Sheets Structure)

**Master Workspace Organization** (6 primary areas):

```
Sales Calls Repository
├─ Call Log: CallID, Date, SalesRep, Prospect, Duration, Status, Transcript
├─ Call Remarks: CallID, RemarkType, Content, Context, CreatedBy, DateCreated
└─ Call Metadata: CallID, ObjectionsMentioned, KeyPoints, NextSteps, SentimentScore

Objections Database
├─ Objection Catalog: ObjectionID, Category, ObjectionText, Frequency, LastSeen
├─ Objection Handling: ObjectionID, HandlingStrategy, SuccessRate, SampleResponses
└─ Objection Mappings: ObjectionID, RelatedObjections, SimilarCases, ResolutionRate

Sales Funnel
├─ Funnel Stages: StageID, StageName, Description, ExpectedDuration, ConversionMetrics
├─ Deal Tracking: DealID, CompanyName, Stage, Value, ObjectionsFaced, LastUpdated
└─ Stage Progression: DealID, FromStage, ToStage, BlockedByObjection, ResolutionDate

Marketing & GTM Materials
├─ GTM Strategy: AssetID, Category, Title, Content, TargetAudience, Version
├─ Case Studies: CaseID, Industry, Challenge, Solution, Result, ObjectionAddressed
├─ Competitor Analysis: CompetitorID, CompetitorName, Strength, Weakness, Counter
└─ Product Value Props: ValueID, Feature, Benefit, ObjectionItAddresses, EvidenceLinks

Brand Guidelines
├─ Brand Standards: GuidelineID, Category, Rule, Context, ApprovedExamples
├─ Message Framework: MessageID, Persona, MessageCore, KeyValues, ObjectionCategory
└─ Tone & Language: ToneID, ToneType, Dos, Donts, ExampleResponses

Agent Knowledge Base
├─ FAQ: FAQID, Question, Answer, RelatedObjection, Confidence
├─ Quick References: ReferenceID, Topic, Content, LastUpdated, UsageCount
└─ Performance Metrics: MetricID, Date, AgentInteraction, SuccessRate, CommonObjections
```

**Key Design Principle:** All tables linked via IDs for relationship queries without complex joins. Time-series data includes CreatedBy/DateCreated for auditability.

---

### 2. Agent Architecture

**Core Components:**

1. **Agent Orchestrator** - Conversation flow, state management, turn-taking
2. **Context Retrieval Module** - Multi-stage pipeline pulling data from all domains
3. **Memory Manager** - Short-term conversation history + long-term interaction learning
4. **Tool Executor** - 12 core tools for data access
5. **Semantic Router** - Classifies user intent and determines required data sources
6. **Response Builder** - Formats responses with citations and confidence levels

**Memory Structure:**
- **Short-term:** Current conversation history, active objection, user profile
- **Long-term:** Successful patterns, user interaction history, personalized preferences
- **Working:** Retrieved data cache (TTL: 30 min), computed context windows, tool results

---

### 3. Data Retrieval Pipeline (5-Stage)

```
User Query → Intent Classification → Structured Data Retrieval → 
Semantic Context Matching → Cross-Domain Enrichment → 
Context Window Assembly → LLM Invocation
```

**Stage 1: Intent Classification**
- Extract entities (objection, product, competitor, deal reference)
- Classify retrieval mode (lookup vs. semantic search vs. comparison)
- Identify domain: product, competitor, brand, strategy

**Stage 2: Structured Data Retrieval**
- Direct lookups for specific entities
- Filter by metadata (category, date range, sales rep)
- Fetch from primary sheets in parallel

**Stage 3: Semantic Context Matching**
- Embed user query using OpenAI/Claude embeddings
- Vector similarity search via Pinecone/Weaviate
- Retrieve top-K similar objections with handling strategies

**Stage 4: Cross-Domain Enrichment**
- For each matched objection: pull competitor angles, value props, case studies, brand guidelines
- For recent calls: extract objection patterns, handling outcomes
- Surface success patterns and frequency data

**Stage 5: Context Assembly**
- Rank retrieved items by relevance + recency
- Build <4k token context window
- Flag confidence levels for each data source

---

### 4. Integration Layer (Google Sheets + Caching)

**Google Sheets Integration:**
- **Auth:** Service Account (backend automation) or OAuth 2.0 (user delegation)
- **API Client:** googleapis library with connection pooling, rate limiting, exponential backoff
- **Data Sync Strategy:**
  - Real-time: Call Remarks, recent deal status (on-demand fetch)
  - Cached: Objection Catalog (daily), Handling Strategies (weekly), GTM Materials (weekly)
  - Background: Pre-compute embeddings nightly, build search indices

**Cache Architecture:**
- Redis for session data, recent query results (TTL: 30 min), rate limiting
- LRU eviction policy, support for distributed multi-instance setup

**Storage Layers:**
1. Google Sheets (Source of Truth)
2. PostgreSQL (Working Database) - normalized schema, full-text search, pgvector for embeddings
3. Pinecone/Weaviate (Vector Store) - semantic similarity, real-time indexing
4. Redis (Cache) - sub-millisecond lookups

---

### 5. Processing Flow (10-Step)

1. **Query Ingestion** - Normalize, extract entities, load user context
2. **Intent Classification** - Determine required domains, detect confidence
3. **Multi-Domain Retrieval** (parallel branches):
   - Objection handling + strategies
   - Deal context + patterns
   - Product value positioning
   - Competitive intelligence
   - Marketing collateral
4. **Context Assembly** - Merge, rank by relevance/recency, score confidence
5. **Prompt Construction** - System prompt + context block + history + query
6. **LLM Invocation** - Claude 3.5 Sonnet (temp: 0.7, max: 2000 tokens)
7. **Response Generation** - [Summary] + [Strategy] + [Evidence] + [Next actions]
8. **Enhancement** - Fact-check vs. brand guidelines, verify claims, add confidence badges
9. **Logging** - Interaction, effectiveness metrics, pattern extraction
10. **Learning** - Update metrics, flag confidence drops, trigger updates

---

### 6. Tech Stack

**Core:**
- **Agent Framework:** Anthropic SDK (Claude API) + custom orchestration
- **Language:** TypeScript (Node.js) or Python 3.11+
- **Web Framework:** Express.js or FastAPI
- **Vector Search:** Pinecone (managed) or Weaviate
- **Database:** PostgreSQL with pgvector extension
- **Cache:** Redis (managed: AWS ElastiCache/Google Cloud Memorystore)
- **Message Queue:** Bull (Redis-backed) or Cloud Tasks

**Libraries:**
- `@anthropic-ai/sdk` - Claude API client
- `googleapis` - Google Sheets API
- `@pinecone-database/pinecone` - Vector search
- `redis`/`ioredis` - Caching
- `zod` - Schema validation
- `winston`/`pino` - Structured logging
- `jest` - Testing

**Deployment:**
- Docker (multi-stage builds)
- Kubernetes or Cloud Run (auto-scaling, 2-10 replicas)
- Load balancer with sticky sessions, rate limiting (100 req/min per user)

---

## Implementation Phases

| Phase | Duration | Focus |
|-------|----------|-------|
| **Phase 1: Foundation** | Weeks 1-3 | Google Sheets integration, basic retrieval, single LLM call |
| **Phase 2: Enhancement** | Weeks 4-6 | Vector search, multi-domain retrieval, caching, conversation history |
| **Phase 3: Intelligence** | Weeks 7-9 | Semantic routing, objection similarity, deal context, feedback loops |
| **Phase 4: Scale** | Weeks 10+ | Multi-user OAuth, analytics, fine-tuning, HA setup |

---

## MVP Scope (Phase 1)

For initial MVP, focus on:
1. ✅ Google Sheets structure setup (define 6 sheet areas)
2. ✅ Service Account authentication
3. ✅ Basic multi-domain data retrieval (calls, objections, strategies, case studies)
4. ✅ Simple ranking/context assembly (no vector search yet)
5. ✅ Single-turn Claude API calls with context
6. ✅ Basic logging to track questions + responses
7. ✅ Simple web interface (input → response)

**Out of scope for MVP:**
- Vector embeddings (use keyword matching instead)
- Long-form conversation memory
- Multi-user OAuth
- Analytics dashboards
- Fine-tuned models

---

## Critical Files to Create

```
/src
  /agent
    - orchestrator.ts          # Core agent orchestration
  /integration
    - google-sheets-client.ts  # Google Sheets API + caching
  /retrieval
    - multi-stage-pipeline.ts  # Context retrieval engine
  /tools
    - index.ts                 # 12 core tool definitions
  /memory
    - session-manager.ts       # Conversation history
  /models
    - schemas.ts               # Zod schemas for all sheet data
  /api
    - routes.ts                # Express/FastAPI endpoints
  /config
    - constants.ts             # Sheet IDs, API keys, rate limits
```

---

## Verification & Testing

**End-to-End Testing:**
1. Set up test Google Sheets with sample data (5 calls, 10 objections, 3 case studies)
2. Query: "How do I handle 'too expensive' objection in enterprise deals?"
3. Verify response includes:
   - Objection handling strategy with success rate
   - Relevant case studies (industry-matched)
   - Product value props addressing cost
   - Brand-aligned messaging
   - Call patterns from similar deals
4. Check logs captured question + response
5. Measure response latency (target: <3 seconds)

**Coverage Checklist:**
- [ ] Google Sheets auth working, data loads correctly
- [ ] All 5 retrieval branches executing in parallel
- [ ] Context ranking produces relevant top results
- [ ] Claude responses are actionable and on-brand
- [ ] Logging captures effectiveness metrics
- [ ] Caching reduces cold query latency by >50%

---

## Security & Governance

- **Auth:** Service Account with spreadsheet.readonly scope
- **Data:** TLS 1.3 transit, AES-256 at rest, secrets via AWS Secrets Manager
- **Access Control:** Admin (all sheets), Sales Manager (team's calls), Sales Rep (own calls), Analyst (analytics only)
- **Compliance:** Audit logging, data retention policies, GDPR anonymization support

---

## Success Metrics

- Objection resolution success rate >75%
- Average response latency <3 seconds
- Cache hit ratio >70%
- User satisfaction score >4.2/5
- Deal progression improvement >10% (measured post-deployment)

---

# DETAILED SCHEMA & DATA STRUCTURES

## 1. Google Sheets Master Workspace Layout

### Sheet 1: Sales Calls Repository

**1a. Call Log**
```
| CallID | Date | SalesRep | Prospect | Company | Industry | Duration | Status | TranscriptLink | Notes |
|--------|------|----------|----------|---------|----------|----------|--------|-----------------|-------|
| CALL-001 | 2024-03-15 | John Smith | Jane Doe | Acme Corp | SaaS | 45 | Won | [Link] | Strong budget alignment |
| CALL-002 | 2024-03-15 | Sarah Lee | Bob Johnson | TechCo | Finance | 30 | Lost | [Link] | Price sensitive |
```

**1b. Call Remarks**
```
| CallID | RemarkType | Content | Context | CreatedBy | DateCreated | Timestamp |
|--------|-----------|---------|---------|-----------|------------|-----------|
| CALL-001 | Objection | "Budget concerns" | Enterprise deal, $500K | John Smith | 2024-03-15 | 09:15 |
| CALL-001 | Resolution | "Showed ROI over 18 months" | Tied to discount offer | John Smith | 2024-03-15 | 09:22 |
| CALL-002 | Objection | "Too expensive vs competitor X" | SMB segment | Sarah Lee | 2024-03-15 | 14:30 |
```

**1c. Call Metadata**
```
| CallID | ObjectionsMentioned | KeyPoints | NextSteps | SentimentScore | ProspectStatus |
|--------|-------------------|-----------|-----------|---|---|
| CALL-001 | Budget concerns, Timeline | ROI highlighted, Legal approval blocked | Send contract | 0.85 | Hot |
| CALL-002 | Price, Feature gap | Competitor positioning strong | Competitive analysis | 0.45 | Warm |
```

### Sheet 2: Objections Database

**2a. Objection Catalog**
```
| ObjectionID | Category | ObjectionText | Frequency | LastSeen | SuccessfulHandlings | AverageResolutionTime |
|------------|----------|---------------|-----------|----------|---------------------|----------------------|
| OBJ-001 | Price | "Too expensive" | 45 | 2024-03-20 | 34 | 3.2 days |
| OBJ-002 | Timeline | "Don't have time to evaluate" | 23 | 2024-03-19 | 12 | 5.1 days |
| OBJ-003 | Capability | "Missing feature X" | 18 | 2024-03-18 | 8 | 2.5 days |
```

**2b. Objection Handling**
```
| ObjectionID | Category | HandlingStrategy | SuccessRate | SampleResponses | ApproachType | RelatedValueProp |
|------------|----------|-----------------|------------|-----------------|--------------|-----------------|
| OBJ-001 | Price | "Lead with ROI, then TCO breakdown, offer flexible payment" | 0.76 | [Multi-option responses] | ROI-focused | VP-003 |
| OBJ-002 | Timeline | "Propose quick demo + async evaluation option" | 0.52 | [3 sample responses] | Friction-reduction | VP-004 |
```

### Sheet 3: Sales Funnel

**3a. Funnel Stages**
```
| StageID | StageName | Description | ExpectedDuration | ConversionMetrics | PrimaryObjections |
|---------|-----------|-------------|------------------|-------------------|------------------|
| STAGE-1 | Awareness | Initial outreach | 2 weeks | 15% → Stage 2 | Not applicable |
| STAGE-2 | Engagement | Demo/discovery | 3 weeks | 45% → Stage 3 | Feature gaps, timeline |
| STAGE-3 | Evaluation | Trial/POC | 4 weeks | 30% → Stage 4 | Price, competitive positioning |
| STAGE-4 | Negotiation | Contract discussion | 2 weeks | 65% → Stage 5 | Terms, implementation, SLAs |
```

### Sheet 4: Marketing & GTM Materials

**4a. Case Studies**
```
| CaseID | ClientName | Industry | Segment | Challenge | Solution | Result | ObjectionAddressed | MetricsIncluded |
|--------|-----------|----------|---------|-----------|----------|--------|-------------------|-----------------|
| CASE-001 | Global Mfg Inc | Manufacturing | Enterprise | Legacy integration | Custom connectors | 40% cost reduction | OBJ-001 (Price) | ROI, TCO, timeline |
| CASE-002 | FinServe Corp | Finance | Mid-market | Timeline concerns | Rapid deployment | 50% faster go-live | OBJ-002 (Timeline) | Speed metrics |
```

### Sheet 5: Brand Guidelines

**5a. Message Framework**
```
| MessageID | Persona | MessageCore | KeyValues | ObjectionCategory | DeliveryTone |
|---|---|---|---|---|---|
| MSG-001 | C-suite/CFO | "Drive bottom-line impact" | ROI, speed, risk mitigation | Price, timeline | Executive, data-driven |
| MSG-002 | IT/Technical | "Seamless integration, minimal disruption" | Reliability, compatibility, support | Technical gaps | Technical, reassuring |
```

### Sheet 6: Agent Knowledge Base

**6a. FAQ**
```
| FAQID | Question | Answer | RelatedObjection | SourceConfidence |
|---|---|---|---|---|
| FAQ-001 | What's the typical ROI timeline? | "Most customers see ROI in 12-18 months..." | OBJ-001 | 0.95 |
| FAQ-002 | How long does implementation take? | "Standard implementation is 4-6 weeks..." | OBJ-002 | 0.92 |
```

---

# IMPLEMENTATION ARCHITECTURE - DETAILED

## Component Breakdown

### 1. Agent Orchestrator (`/src/agent/orchestrator.ts`)

**Responsibilities:**
- Multi-turn conversation management with session persistence
- Intent classification and routing
- Tool invocation sequencing
- Response synthesis from tool outputs
- Error recovery and graceful degradation

### 2. Google Sheets Client (`/src/integration/google-sheets-client.ts`)

**Responsibilities:**
- OAuth 2.0 / Service Account authentication
- Read operations with caching
- Rate limiting and connection pooling
- Error handling with exponential backoff
- Data schema validation

### 3. Retrieval Pipeline (`/src/retrieval/multi-stage-pipeline.ts`)

**Responsibilities:**
- 5-stage context retrieval orchestration
- Parallel branch execution
- Context ranking and deduplication
- Confidence scoring
- Token window optimization

### 4. Tool Definitions (`/src/tools/index.ts`)

**12 Core Tools:**
1. SearchCallTranscripts
2. SearchObjections
3. GetHandlingStrategy
4. GetSimilarCases
5. GetDealStatus
6. GetCompetitorAnalysis
7. GetCaseStudies
8. GetBrandGuidelines
9. GetProductValueProps
10. SearchFAQ
11. GetDealProgression
12. LogInteraction

### 5. Memory Manager (`/src/memory/session-manager.ts`)

**Responsibilities:**
- Conversation history (sliding window: last 10 turns)
- Session state (current objection, active deal context)
- User profile (preferences, role, team)
- Cache management with TTL

### 6. Response Builder (`/src/response/formatter.ts`)

**Responsibilities:**
- Format LLM output with citations
- Add confidence badges
- Create action items
- Ensure brand compliance
- Optimize for readability

---

# CRITICAL SUCCESS FACTORS

## Pre-Implementation Checklist

- [ ] **Google Sheets Access**: Confirm service account has read access to all sheet IDs
- [ ] **Data Quality**: Audit existing sheets for missing fields, inconsistent formats
- [ ] **Test Data Setup**: Create test Google Sheet with 5 calls, 10 objections, 3 case studies
- [ ] **API Keys**: Generate Anthropic API key, store in Secrets Manager
- [ ] **Environment**: Set up Node.js 20+ / Python 3.11+, Docker, postgres locally for dev

## Go-Live Checklist

- [ ] All 12 tools tested against real Google Sheets data
- [ ] Conversation history persists across sessions
- [ ] Response latency <3 seconds (p95)
- [ ] Cache hit ratio >70% on repeated queries
- [ ] Claude responses pass brand compliance audit
- [ ] Logging captures all key metrics
- [ ] Error handling: graceful degradation if Google Sheets unavailable
- [ ] Rate limiting working (100 req/min per user)
- [ ] Documentation: API docs, deployment guide, user guide

---

# NEXT STEPS

1. **Approve this architecture** ✓
2. **Set up Google Sheets structure** with test data
3. **Initialize Node.js/Python project** with core dependencies
4. **Implement GoogleSheetsClient** with authentication & basic read operations
5. **Build Orchestrator skeleton** with single-tool execution
6. **Create 12 tool definitions** with schema validation
7. **Implement Retrieval Pipeline** (5-stage) without vector search
8. **Connect to Claude API** for single-turn responses
9. **Build response formatter** with citations
10. **Create simple web UI** (HTML form + fetch API)
11. **Deploy locally & test** with sample queries
12. **Iterate based on user feedback**

Ready to start implementation? We can begin with step 2 (Google Sheets structure) or jump to step 3 (project initialization) based on your preference.
