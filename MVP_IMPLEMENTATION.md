# Real Estate Sales Objection Agent - MVP Implementation Guide

## Overview

This is a complete Phase 1 MVP implementation of a personal AI agent for handling real estate sales objections. The agent searches through previous conversations, analyzes objection patterns, and provides data-driven strategies with proven success rates.

## What's Included

### Core Components

1. **Agent Orchestrator** (`src/agent/orchestrator.ts`)
   - Manages the entire conversation flow
   - Coordinates between retrieval, LLM, and response formatting
   - Maintains session state

2. **Google Sheets Client** (`src/integration/google-sheets-client.ts`)
   - Data integration layer with caching
   - Mock data for MVP testing
   - Ready to connect to real Google Sheets API

3. **Tool Executor** (`src/tools/executor.ts`)
   - Implements all 12 core tools
   - SearchCallTranscripts, SearchObjections, GetHandlingStrategy, etc.
   - Each tool returns structured data

4. **Retrieval Pipeline** (`src/retrieval/multi-stage-pipeline.ts`)
   - 5-stage context gathering:
     1. Intent classification
     2. Structured retrieval (parallel)
     3. Semantic context matching
     4. Cross-domain enrichment
     5. Context assembly

5. **Session Manager** (`src/memory/session-manager.ts`)
   - Multi-turn conversation support
   - Conversation history (last 10 messages)
   - Session timeouts

6. **Response Formatter** (`src/response/formatter.ts`)
   - Confidence scoring (0-99%)
   - Citation extraction
   - Data freshness badges
   - CLI and markdown formatting

### User Interfaces

1. **CLI Interface** (`src/cli.ts`)
   - Interactive terminal mode
   - Real-time response formatting
   - Session management
   - Run: `npm run cli`

2. **Web API** (`src/api/routes.ts`)
   - Express.js REST API
   - `/api/query` - Process user queries
   - `/api/session/:id` - Get session info
   - `/api/sessions` - List all sessions
   - `/api/examples` - Get example queries

3. **Demo HTML** (`demo.html`)
   - Existing interactive web interface
   - Chat interface with visual feedback
   - 10-step processing visualization

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
```bash
cp .env.example .env
# Edit .env with your API keys
# ANTHROPIC_API_KEY=sk-ant-xxxxx
```

### 3. Run CLI Mode (No API Key Required for Mock)
```bash
npm run cli
```

Example queries to try:
- "How do I handle price objections?"
- "What works for location concerns?"
- "Show me similar deals we've won"
- "How should I respond to financing questions?"

### 4. Build TypeScript
```bash
npm run build
```

### 5. Run Web Server (Requires ANTHROPIC_API_KEY)
```bash
npm start
```

Then open http://localhost:3000

## Real Estate Specific Features

### Objection Types Handled
- **Price Objections**: Comp analysis, ROI calculations, flexible terms
- **Location Concerns**: Demographics, schools, commute data, development plans
- **Financing Questions**: Loan options, affordability, lender connections
- **Property Condition**: Inspection data, warranty info, repair estimates
- **Market Conditions**: Inventory, pricing trends, timing strategies
- **Timing Concerns**: Market timing, urgency factors, seasonality
- **Competition**: Competitive properties, bidding strategies
- **Contract Terms**: Contingencies, inspection periods, closing dates
- **Contingencies**: Financing, appraisal, inspection backup plans
- **Inspection Issues**: Repair prioritization, cost estimates, negotiations

### Data Architecture

**Google Sheets Schema (6 Areas):**

1. **Properties** - Active listings with price, beds, baths, sqft, status
2. **Sales Calls** - Call transcripts, remarks, objection types, resolution status
3. **Objections** - Objection patterns, handling strategies, success rates
4. **Deals** - Deal progression, stage tracking, expected close dates
5. **Marketing** - GTM strategies, case studies, competitor analysis, value props
6. **Brand** - Brand standards, messaging frameworks by persona, tone guidelines

### Processing Flow (10 Steps)

```
User Query
   ↓
1. Session Management (create/retrieve)
   ↓
2. Intent Classification (price, location, financing, etc.)
   ↓
3. Parallel Retrieval (calls, objections, deals)
   ↓
4. Semantic Matching (similar cases, brand context)
   ↓
5. Context Assembly (structured retrieval output)
   ↓
6. Prompt Construction (context + guidelines)
   ↓
7. Claude API Call (3.5 Sonnet)
   ↓
8. Response Enhancement (confidence, citations)
   ↓
9. Interaction Logging (analytics)
   ↓
10. Formatted Response (to user)
```

## API Examples

### Process a Query
```bash
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "sales-rep-001",
    "query": "How do I handle price objections in luxury homes?"
  }'
```

Response:
```json
{
  "success": true,
  "sessionId": "uuid-xxx",
  "response": "Here's a proven strategy for price objections in luxury homes...",
  "confidence": 0.85,
  "dataFreshness": "Real-time + 1-2 days",
  "sources": [
    "Case Study: 789 Pine Road - Objection resolved in 30 days",
    "Success Rate: 76% for price objections"
  ],
  "metadata": {
    "toolsUsed": ["SearchObjections", "GetSimilarCases"],
    "executionTime": 245
  }
}
```

### Get Session Info
```bash
curl http://localhost:3000/api/session/uuid-xxx
```

### List All Sessions
```bash
curl http://localhost:3000/api/sessions
```

### Get Example Queries
```bash
curl http://localhost:3000/api/examples
```

## Configuration

Edit `src/config/constants.ts`:

- **CLAUDE_MODEL**: Change model (default: claude-3-5-sonnet-20241022)
- **CLAUDE_MAX_TOKENS**: Response length limit
- **SESSION_TIMEOUT_MINUTES**: Session expiry
- **MAX_CONVERSATION_HISTORY**: Memory depth
- **REAL_ESTATE_DOMAINS**: Objection categories
- **REAL_ESTATE_FUNNEL_STAGES**: Deal stages

## Real Data Integration

### Option 1: Google Sheets API (Recommended)

1. Create Google Cloud project
2. Enable Sheets API
3. Create service account
4. Download private key JSON
5. Share spreadsheet with service account email
6. Update .env:
   ```
   GOOGLE_SHEETS_PRIVATE_KEY=...
   GOOGLE_SHEETS_CLIENT_EMAIL=...
   GOOGLE_SHEETS_PROJECT_ID=...
   SPREADSHEET_ID=...
   ```

### Option 2: CSV/JSON Import

Modify `GoogleSheetsClient` to load from local files:
```typescript
async getPropertyListings(): Promise<PropertyListing[]> {
  const csv = readFileSync('data/properties.csv', 'utf-8');
  return parseCSV(csv);
}
```

### Option 3: Database Connection

Replace mock data with PostgreSQL:
```typescript
async getPropertyListings(): Promise<PropertyListing[]> {
  const result = await this.db.query('SELECT * FROM properties');
  return result.rows;
}
```

## Testing the Agent

### CLI Mode
```bash
npm run cli
```

Try these queries:
1. "How do I respond to price objections?"
2. "Show me case studies for location concerns"
3. "What's the best strategy for financing questions?"
4. "Compare this property to competitors"
5. "Help me close DEAL-001"

### Web API Mode
```bash
npm start
```

Then use the included demo.html or curl examples above.

### Expected Results

The agent will:
- ✅ Classify intent (price, location, financing, etc.)
- ✅ Retrieve relevant historical calls
- ✅ Find similar case studies
- ✅ Extract handling strategies with success rates
- ✅ Provide specific talking points
- ✅ Suggest next steps
- ✅ Include confidence scores (0-99%)
- ✅ List supporting sources
- ✅ Show execution time (target <3s)

## Performance Targets

- **Response Latency**: p95 < 3 seconds (currently ~250-500ms with mock data)
- **Cache Hit Ratio**: >70% (5-minute cache for repeated queries)
- **Confidence Score**: 70-95% for data-backed responses
- **Tools Used**: 2-4 per query (parallel execution)

## Project Structure

```
src/
├── agent/
│   └── orchestrator.ts       # Main agent coordinator
├── api/
│   └── routes.ts             # Express routes
├── cli.ts                     # Terminal interface
├── config/
│   └── constants.ts           # Configuration
├── integration/
│   └── google-sheets-client.ts # Data layer
├── memory/
│   └── session-manager.ts     # Session state
├── models/
│   └── schemas.ts             # TypeScript types
├── response/
│   └── formatter.ts           # Response formatting
├── retrieval/
│   └── multi-stage-pipeline.ts # 5-stage retrieval
├── tools/
│   └── executor.ts            # Tool implementations
└── index.ts                   # Server entry point
```

## Next Steps (Phase 2+)

1. **Vector Search** (Phase 2)
   - Add Pinecone for semantic search
   - Vectorize call transcripts and strategies
   - Improved relevance ranking

2. **Advanced Routing** (Phase 3)
   - Deal-stage-aware responses
   - Agent performance tracking
   - A/B testing support

3. **Multi-User** (Phase 4)
   - OAuth integration
   - User-specific learning
   - Permission management

4. **Analytics** (Phase 4)
   - Success rate tracking
   - Objection trend analysis
   - Agent performance leaderboards

## Troubleshooting

### "ANTHROPIC_API_KEY not found"
- Set it in .env file
- For CLI with mock data, you can skip this

### "Session not found"
- Sessions timeout after 30 minutes
- Create a new session or extend timeout in constants.ts

### "Tool execution failed"
- Check Google Sheets API connection
- Verify spreadsheet ID in .env
- Ensure service account has access

### Slow responses
- Clear cache: Call `/refresh` endpoint
- Check network to Google Sheets
- Consider caching more data locally

## License

Personal Project - 2024

## Support

For issues or questions:
1. Check the 12 tool definitions in `src/tools/executor.ts`
2. Review sample queries in `/api/examples`
3. Check session logs with `/api/sessions`
