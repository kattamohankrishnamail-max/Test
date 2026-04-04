# IIOS Sales Intelligence Agent MVP Spec

## Purpose

Build a Google-native sales intelligence system that captures institutional memory and lets a sales or presales user ask questions like:

- What is the best response to this pricing objection?
- What happened in previous conversations with this account?
- What messaging is approved by brand and GTM for this use case?
- What similar deals were won or lost, and why?
- What should I say next in tomorrow's call?

This should follow the same IIOS operating logic from the reference documents:

1. Capture
2. Structure
3. Intelligence

The moat is not the model. The moat is the disciplined capture of sales knowledge in a structured, queryable system.

## Current Domain Context

The active working context for this project is now:

- company: Entrust Designs
- industry: premium residential interiors
- geography: Bengaluru, India
- primary users: Entrust salespeople and founders handling customer objections
- common customer types: apartment buyers, villament buyers, villa buyers, NRI buyers, renovation clients

The system should no longer be interpreted as a generic B2B SaaS sales copilot.

It should be interpreted as an **Entrust premium interiors sales copilot**.

## Product Goal

Create an internal sales copilot that:

- searches previous sales calls, remarks, updates, and objection history
- uses approved marketing, GTM, and brand material as the canonical messaging layer
- reads funnel and pipeline context before answering
- returns grounded, source-backed answers with clear next-step recommendations

## MVP Positioning

This is not an autonomous SDR or fully automated agent.

This is a grounded internal copilot for presales and objection handling.

For MVP, the system should be:

- read-first
- citation-first
- Google-native
- lightweight for a team of 2-5
- usable without engineering-heavy infrastructure

## Primary Users

- founder
- presales lead
- sales manager
- account executive

## Highest-Value MVP Use Cases

1. Objection handling
   Example: "How should I handle the pricing objection for a Whitefield 3BHK client?"
2. Account memory recall
   Example: "Summarize everything we know about this apartment project and buyer."
3. Deal risk review
   Example: "Why is this client likely to stall before paying the advance?"
4. Message preparation
   Example: "Give me a brand-approved talk track for the next concept presentation call."
5. Similar-case retrieval
   Example: "Show similar villa or apartment cases where this objection came up and how it was handled."

## Entrust-Specific Objection Types

The first production taxonomy should include:

- pricing / quote objection
- BOQ scope objection
- materials cost objection
- delivery timeline objection
- trust / accountability objection
- remote execution objection
- design fit objection
- quality assurance objection
- competitor comparison objection
- change-order concern
- post-handover support concern

## Operating Principles

### 1. Structured capture beats clever prompting

If objection context, call notes, and stage updates are not captured cleanly, the agent will produce generic answers.

### 2. Approved messaging outranks anecdotal memory

When sales-call history conflicts with current brand or GTM positioning, the answer should prioritize the approved source and clearly note the tension.

### 3. Every answer must be grounded

The agent should return:

- direct answer
- evidence used
- suggested talk track
- recommended next step
- confidence level
- missing context if any

### 4. Human-in-the-loop for action

MVP should answer and recommend. It should not update CRM, send messages, or trigger workflows automatically.

## Architecture Overview

### Layer 1: Capture

Input systems:

- Google Forms
- Google Sheets
- Google Docs
- Google Drive folders
- optionally manually uploaded transcripts or summaries from call tools

Captured data types:

- new lead / account intake
- call summary
- objection log
- opportunity update
- competitor mention
- customer insight / persona update
- approved marketing asset

### Layer 2: Structure

System of record:

- one Google Drive root for sales knowledge
- one Google Sheets workbook as the operational database
- standardized Google Docs templates for notes and summaries

### Layer 3: Intelligence

Agent functions:

- classify question type
- retrieve relevant structured rows from Sheets
- retrieve relevant documents and excerpts from Drive/Docs
- synthesize answer using approved messaging first
- cite sources and highlight uncertainty

## Recommended Google Workspace Setup

### Drive Root

`IIOS-SALES-INTELLIGENCE/`

Subfolders:

- `01-ACCOUNTS/`
- `02-OPPORTUNITIES/`
- `03-CALL-NOTES/`
- `04-OBJECTION-LIBRARY/`
- `05-MARKETING-GTM-BRAND/`
- `06-COMPETITOR-BATTLECARDS/`
- `07-PLAYBOOKS-AND-SOPS/`
- `08-AGENT-OUTPUTS/`
- `09-ARCHIVE/`

### Folder Rules

- one folder per account
- one folder per opportunity under the account if needed
- consistent names
- no free-form dumping of files
- every uploaded asset should have a type, date, and owner

### Naming Convention

Account:

`ACC-[NUMBER]-[COMPANY]`

Opportunity:

`OPP-[NUMBER]-[ACCOUNT]-[USECASE]-[YYYY-MM]`

Call note:

`CALL-[ACCOUNT]-[YYYY-MM-DD]-[STAGE]`

Objection note:

`OBJ-[ACCOUNT]-[CATEGORY]-[YYYY-MM-DD]`

Marketing asset:

`MSG-[TOPIC]-[VERSION]-[YYYY-MM-DD]`

## Master Workbook Design

Workbook name:

`IIOS_Sales_Intelligence_Master`

### Sheet 01: Accounts_Master

One row per company/account.

Columns:

- `account_id`
- `account_name`
- `segment`
- `industry`
- `region`
- `account_owner`
- `source_channel`
- `icp_fit`
- `priority_tier`
- `current_stage`
- `current_opportunity_id`
- `primary_use_case`
- `main_competitor`
- `decision_process`
- `budget_sensitivity`
- `risk_level`
- `last_interaction_date`
- `last_summary`
- `next_planned_action`
- `drive_folder_link`

### Sheet 02: Contacts_Master

One row per contact.

Columns:

- `contact_id`
- `account_id`
- `full_name`
- `title`
- `function`
- `seniority`
- `influence_level`
- `email`
- `phone`
- `whatsapp`
- `persona_type`
- `key_priorities`
- `top_concerns`
- `relationship_score`
- `last_contact_date`
- `notes`

### Sheet 03: Opportunities_Master

One row per opportunity.

Columns:

- `opportunity_id`
- `account_id`
- `opportunity_name`
- `owner`
- `stage`
- `pipeline_status`
- `amount`
- `weighted_amount`
- `close_target_date`
- `use_case`
- `product_scope`
- `main_pain_point`
- `competitor`
- `decision_criteria`
- `procurement_status`
- `security_status`
- `champion_contact_id`
- `next_step`
- `next_step_due_date`
- `win_probability`
- `risk_flags`
- `last_stage_change_date`

### Sheet 04: Call_Notes

One row per sales interaction.

Columns:

- `call_id`
- `account_id`
- `opportunity_id`
- `call_date`
- `call_type`
- `participants`
- `internal_owner`
- `meeting_stage`
- `summary`
- `customer_goals`
- `customer_pain_points`
- `objections_raised`
- `competitors_mentioned`
- `pricing_discussed`
- `timeline_discussed`
- `decision_process_update`
- `sentiment`
- `next_steps`
- `followup_owner`
- `transcript_link`
- `full_notes_doc_link`

### Sheet 05: Objections_Library

One row per objection instance.

Columns:

- `objection_id`
- `call_id`
- `account_id`
- `opportunity_id`
- `objection_category`
- `objection_subcategory`
- `exact_objection_text`
- `who_raised_it`
- `severity`
- `stage_when_raised`
- `recommended_response`
- `actual_response_used`
- `response_quality`
- `resolved_status`
- `resolution_notes`
- `repeat_pattern`
- `linked_marketing_asset`

Suggested categories:

- price
- ROI
- trust
- competitor
- implementation
- integration
- security
- timing
- authority
- feature gap

### Sheet 06: Funnel_History

One row per opportunity event.

Columns:

- `event_id`
- `opportunity_id`
- `account_id`
- `event_date`
- `event_type`
- `previous_stage`
- `new_stage`
- `change_reason`
- `amount_change`
- `risk_change`
- `owner_note`

### Sheet 07: Marketing_GTM_Brand_KB

This is the approved messaging registry.

One row per messaging asset or canonical answer source.

Columns:

- `asset_id`
- `asset_type`
- `title`
- `topic`
- `persona`
- `use_case`
- `industry`
- `stage`
- `competitor_relevance`
- `approved_message`
- `proof_points`
- `dos`
- `donts`
- `owner`
- `approval_status`
- `version`
- `last_updated`
- `doc_link`

### Sheet 08: Competitor_Battlecards

One row per competitor or competitor-topic record.

Columns:

- `battlecard_id`
- `competitor_name`
- `topic`
- `positioning_summary`
- `our_advantage`
- `known_weakness`
- `avoid_claims`
- `approved_talk_track`
- `evidence_link`
- `last_updated`

### Sheet 09: Answer_Log

Used to improve prompts and trust.

Columns:

- `answer_id`
- `question_date`
- `asked_by`
- `question_text`
- `question_type`
- `account_id`
- `opportunity_id`
- `answer_summary`
- `confidence`
- `sources_used`
- `feedback_rating`
- `followup_needed`

## Capture Layer: Forms

For MVP, build five Google Forms.

### Form 1: New Account / Lead Intake

Fields:

- company name
- website
- industry
- segment
- region
- source channel
- primary contact
- primary use case
- estimated deal size
- owner
- first notes

### Form 2: Sales Call Capture

This is the most important form.

Fields:

- account
- opportunity
- date
- participants
- stage
- summary
- top pain points
- objections raised
- competitor mentioned
- pricing discussed
- decision process update
- next step
- follow-up owner
- transcript/doc link

### Form 3: Objection Capture

If the objection matters, it gets its own row.

Fields:

- account
- opportunity
- call reference
- objection category
- exact objection
- who raised it
- severity
- actual response used
- was it resolved
- notes

### Form 4: Opportunity Update

Fields:

- opportunity
- date
- previous stage
- new stage
- amount change
- new risk level
- why this changed
- next step

### Form 5: Marketing / GTM Asset Intake

Fields:

- title
- asset type
- topic
- persona
- use case
- approved message
- proof points
- dos
- donts
- owner
- version
- doc link

## Doc Templates

Create standardized Google Docs templates for:

- call summary
- account brief
- opportunity brief
- objection deep-dive
- competitor note

### Call Summary Template

Sections:

- meeting context
- participants
- business situation
- key pain points
- objections raised
- language customer used
- competitor mentions
- buying signals
- risks
- agreed next step
- internal recommendation

The phrase "language customer used" matters. These exact phrasings are useful later for retrieval and objection handling.

## Retrieval Design

The agent should use both structured retrieval and document retrieval.

### Structured Retrieval

Used for:

- account context
- stage
- owner
- amount
- last interactions
- historical objection counts
- funnel movement

Primary sources:

- Accounts_Master
- Opportunities_Master
- Funnel_History
- Objections_Library

### Document Retrieval

Used for:

- detailed call notes
- transcripts
- brand messaging
- battlecards
- playbooks
- positioning docs

Primary sources:

- Call note docs
- marketing docs
- battlecards
- approved talk tracks

## Query Routing Logic

Every user question should first be classified into one of these types:

- `objection_handling`
- `account_summary`
- `deal_risk`
- `call_prep`
- `competitor_response`
- `next_best_action`
- `messaging_lookup`
- `funnel_analysis`

### Routing Rules

If `objection_handling`:

- retrieve latest account and opportunity state
- retrieve all prior objections for this account
- retrieve similar objections from won/lost deals
- retrieve approved messaging and battlecards

If `account_summary`:

- retrieve account row
- retrieve latest 5 calls
- retrieve open opportunity
- retrieve last 3 funnel events

If `competitor_response`:

- retrieve competitor battlecard
- retrieve calls where competitor was mentioned
- retrieve approved claims and avoid-claims

If `call_prep`:

- retrieve account summary
- retrieve previous objections
- retrieve stakeholder notes
- retrieve next-step context

## Answer Format

For MVP, every answer should use this structure:

### 1. Direct Answer

One short paragraph with the actual answer.

### 2. Suggested Talk Track

Three to five sentences the rep can adapt directly.

### 3. Why This Is The Best Response

- approved messaging used
- relevant past interactions
- similar past deals if available

### 4. Recommended Next Step

One tactical action for the rep.

### 5. Confidence and Gaps

- confidence: high / medium / low
- what context is missing

### 6. Sources

- sheet rows or document names used

## Prompt Architecture

Use a two-stage prompt design.

### Prompt A: Query Understanding

Responsibilities:

- detect question type
- identify account/opportunity/entities
- decide which sources are required
- convert broad questions into a retrieval plan

Expected output:

- `question_type`
- `account_name`
- `opportunity_name`
- `required_structured_sources`
- `required_document_sources`
- `answer_mode`

### Prompt B: Grounded Answer Generation

System instruction goals:

- prioritize approved brand and GTM material
- do not invent facts
- clearly distinguish evidence from inference
- use past sales-call history only when relevant
- mention uncertainty explicitly
- give concise, practical sales guidance

Core rules:

- if no evidence exists, say so
- if there is a conflict between old call behavior and current approved messaging, favor current approved messaging
- avoid generic advice unless source data is thin
- never present speculation as account fact

## Suggested MVP Tech Path

### Option A: Fastest Non-Engineering MVP

- Google Forms
- Google Sheets
- Google Drive
- Claude / ChatGPT used manually with uploaded docs and exported data

Best for:

- validating capture habit
- proving use cases
- zero engineering start

Limitation:

- manual retrieval
- not scalable

### Option B: Lightweight MVP App

- Google Sheets API
- Google Drive API
- small backend for retrieval
- chat UI
- LLM for synthesis

Best for:

- internal team adoption
- repeatable workflows
- better user experience

Recommended direction:

Start with Option A for 1-2 weeks to validate data shape, then build Option B.

## Alignment With External Architecture Notes

The additional architecture references provided alongside this spec strengthen the implementation model in three ways:

### 1. Retrieval should be explicitly multi-stage

The backend should eventually follow this sequence:

1. intent classification
2. structured retrieval
3. semantic matching
4. cross-domain enrichment
5. context assembly and ranking

For MVP, only stages 1, 2, 4, and 5 are required.

### 2. A tool model should shape the backend

The future service should expose a small set of retrieval functions rather than one giant query function.

Recommended Phase 1 tool set:

- `SearchCallNotes`
- `SearchObjections`
- `GetHandlingStrategy`
- `GetDealStatus`
- `GetBrandGuidelines`
- `GetCaseStudies`
- `LogInteraction`

### 3. Storage should evolve in layers

Use this progression:

- Phase 1: Google Sheets and Drive as source of truth
- Phase 2: add Postgres as working store
- Phase 2: add Redis for cache and session state
- Phase 2 or 3: add vector search for semantic retrieval

This preserves the Google-native operating model while still leaving room for scale.

## Converting The Demo Into Phase 1 Code

The current local demo already proves:

- the answer format
- the dummy data model
- the source hierarchy
- the user workflow

The next engineering step should be to replace the local data in the demo with a real retrieval backend.

Recommended code modules:

- `src/agent/orchestrator.ts`
- `src/integration/google-sheets-client.ts`
- `src/retrieval/pipeline.ts`
- `src/tools/index.ts`
- `src/response/formatter.ts`
- `src/api/routes.ts`

The frontend can remain lightweight while the backend matures.

## MVP Build Sequence

### Week 1

- finalize workbook schema
- create Drive root and naming rules
- build the five forms
- create doc templates

### Week 2

- backfill last 10-20 meaningful sales interactions
- backfill approved messaging assets
- standardize 3-5 competitor battlecards

### Week 3

- test manual agent workflow on real questions
- identify missing fields and bad capture habits
- refine objection categories and summary templates

### Week 4

- build lightweight retrieval layer
- create internal chat interface
- log answers and user feedback

## Success Criteria For MVP

By the end of MVP, the system should reliably answer:

- what happened with this account recently
- what objections have come up before
- what approved message we should use
- what similar past cases suggest
- what the rep should say next

### Operational KPIs

- percent of calls captured within 24 hours
- percent of opportunities with complete next-step data
- percent of objections logged as structured records
- number of approved messaging assets available
- weekly active usage of the copilot
- user-rated usefulness of answers

## Failure Modes To Watch

### 1. Low capture compliance

If reps do not log calls or objections, the agent becomes shallow.

### 2. Unapproved marketing sprawl

If outdated decks and ad hoc claims are mixed with approved messaging, answers become inconsistent.

### 3. No clear source hierarchy

The system must know that approved GTM material outranks anecdotal rep memory.

### 4. Overbuilding too early

Do not build CRM write-back, auto-emailing, or fully autonomous workflows before answer quality is trusted.

## Recommended Initial Source Hierarchy

When answering, source trust should be:

1. approved marketing / GTM / brand material
2. current opportunity and funnel data
3. latest call notes for the same account
4. similar past deals
5. general sales heuristics

## Concrete First MVP Questions To Support

The first version should be optimized for just these five:

1. "Summarize this account for my next call."
2. "How do I handle this objection?"
3. "What changed in this opportunity recently?"
4. "What approved messaging should I use for this use case?"
5. "What should I do next to move this deal forward?"

## Recommendation

The first implementation milestone should not be the chat interface.

It should be:

"We have one clean workbook, five working capture forms, a usable Drive structure, and two weeks of disciplined sales memory."

Once that exists, building the agent becomes much easier and much more defensible.

## Next Deliverables

After this spec, the next most useful assets would be:

1. the exact Google Sheets tab templates with sample rows
2. the exact Google Forms field definitions
3. the system prompt and answer template for the agent
4. a lightweight MVP app architecture
