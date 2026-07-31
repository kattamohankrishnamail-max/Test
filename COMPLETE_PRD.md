# Complete Product Requirements Document (PRD)
## DealDesk — End-to-End Sales Intelligence & CRM Platform

**Version:** 2.0  
**Status:** Ready for Implementation  
**Last Updated:** 2024-01-31  
**Owner:** Personal Project  
**Audience:** Founders, Product, Engineering, Design

---

## Executive Summary

**What it is:**  
DealDesk is a personal CRM + sales intelligence platform for solo agents and small brokerages. It tracks every lead, deal, objection, and outcome. It learns which strategies work, which reps perform best, and which deals need intervention. It's a unified system of record for the entire sales lifecycle — not just handling objections, but managing the entire funnel with AI-powered insights and real-time coaching.

**Who it's for:**  
- Solo real estate agents (the primary user)
- Small brokerage teams (2-15 agents)
- Brokers managing their own books
- Admin assistants coordinating follow-ups

**The promise:**  
One system. Know your pipeline. Know what works. Know who needs help. Close faster.

**Scope:**  
Phase 1 focuses on lead-to-close. Phase 2 adds post-sale nurturing and feedback loops. Phase 3 adds team performance dashboards and predictive analytics.

---

## Problem Statement

### Current State
- **Leads scattered:** Email, texts, spreadsheets, Zillow, MLS, personal calls — no unified inbox
- **Pipeline invisible:** Doesn't know which deals are hot, which are stalled, which are at risk
- **Knowledge loss:** What worked for Deal A is forgotten by Deal B. Top performers hoard their playbooks
- **Objection waste:** Every objection triggers a 15-minute dig through past calls, spreadsheets, and email
- **Effort invisible:** No data on who's actually working, how hard, or whether it's effective
- **Follow-ups fall through:** Leads go cold because reminders live in a notebook or a mental backlog
- **No learning:** Every quarter feels like year one. No data on what changed, what worked, why some deals close

### Quantified Pain
- **15-20 min per call:** Wasted on searching for strategies that have been used before
- **3-4 deals at risk:** Sitting in pipeline with unaddressed objections, no visibility to broker/team
- **40% follow-up failure:** Leads marked for follow-up never get touched (no systematic reminders)
- **~30% of reps:** Are outliers in performance with no way to know why or teach it to others

---

## Product Vision

### One System for the Entire Sales Lifecycle

```
LEAD CAPTURE → QUALIFICATION → VIEWING → OFFER → NEGOTIATION → INSPECTION → APPRAISAL → CLOSE → FOLLOW-UP
     ↓              ↓            ↓        ↓          ↓             ↓           ↓          ↓         ↓
  Source Track    Lead Score   Showing  Comp       Objection     Issues      Value      Docs    Feedback
  Auto-Nurture    Next Action  Data     Analysis   Handling      Worklist    Confirm    Delivery Loop
```

Every stage has data, every stage has next-step guidance, every stage is visible to all authorized users.

### Core Principles
1. **Single source of truth** — All data in one place, accessible to all (within permissions)
2. **Real-time visibility** — Deals don't disappear; you see which are stalled, which are hot
3. **Effort = Results** — Track activity, measure outcomes, learn what actually works
4. **Evidence-backed guidance** — Every recommendation grounded in your own data
5. **Personal responsibility** — Clear ownership, clear deadlines, clear accountability
6. **Actionable not pretty** — Dense with information, optimized for decisions not impressions

---

## Complete Data Model

### Domain 1: PEOPLE & RELATIONSHIPS
**Leads, Clients, Contacts, Relationships**

| Entity | Fields | Purpose |
|--------|--------|---------|
| **Lead** | id, name, email, phone, source, status (new/contacted/qualified/disqualified/converted), created_date, last_contact, lead_score, tags, notes | Initial prospect capture; auto-nurture routing; source attribution |
| **Contact** | id, person_id, title, role, phone, email, address, preferred_contact, vip_flag, relationship_notes | Support buyer's team (spouse, partner, family, CPA, lawyer) |
| **Client** | id, lead_id, name, email, phone, profile (buyer/seller/investor), status (active/closed/inactive), lifetime_value, referral_source, csat_score, communication_prefs | Closed lead; ongoing relationship |
| **Agent** (team) | id, name, email, phone, role (agent/broker/admin), commission_split, specialization, active, hire_date, performance_tier | User account; performance attribution |
| **Brokerage** (org) | id, name, address, phone, logo, brand_colors, brand_tone, commission_rules, mls_codes, default_forms | Single brokerage settings; brand normalization |

**Key Insights from Domain 1:**
- Track lead source ROI (which source drives the most valuable deals?)
- Segment clients by profile (buyer vs seller vs investor behaves differently)
- Identify power users to learn from

---

### Domain 2: PROPERTIES & INVENTORY
**Listings, Inventory, Comparables**

| Entity | Fields | Purpose |
|--------|--------|---------|
| **Property** | id, address, city, zip, beds, baths, sqft, lot_size, price_current, price_original, list_date, status (active/pending/sold), property_type (sfh/condo/mf/commercial/land), condition (excellent/good/fair/needs_work), hoa_fee, tax_assessment, parking_spaces, year_built, days_on_market, listing_agent_id, seller_id | Core inventory; shows up everywhere |
| **Comparable** | id, subject_property_id, comp_property_id, comp_date, price_per_sqft, adjustment_reason, reconciled_value | Valuation support; price objection data |
| **Valuation** | id, property_id, appraiser, appraisal_value, appraisal_date, method (market/cost/income), assumptions, risk_flags | Appraisal results; deal risk early warning |
| **Photos & Media** | id, property_id, type (exterior/interior/floor_plan/video), url, caption, taken_date, agent_notes | Marketing support; agent reference |

**Key Insights from Domain 2:**
- Track velocity — which properties move fast? Why?
- Price objections anchored to comps
- Days on market as deal-risk indicator

---

### Domain 3: DEALS & PIPELINE
**The entire funnel, stage by stage**

| Entity | Fields | Purpose |
|--------|--------|---------|
| **Deal** | id, client_id, property_id, deal_type (buy/sell/lease), stage (lead/prospect/viewing/offer/neg/inspection/appraisal/close/closed), stage_entry_date, expected_close_date, days_in_stage, list_price, offer_price, sold_price, earnest_money, inspection_date, appraisal_date, closing_date, contingencies (financing/appraisal/inspection), assigned_agent_id, co_agent_id, broker_notes, client_notes, deal_value, commission_total, agent_commission, status_health (green/yellow/red) | Single source of truth for every deal; funnel visibility |
| **DealEvent** | id, deal_id, event_type (showing/call/email/offer_received/counteroffer/inspection_scheduled/issue_found/appraisal_complete), event_date, duration_minutes, notes, contact_method, next_event_planned, next_event_date | Audit trail; activity proof |
| **DealObjection** | id, deal_id, objection_type_id, first_raised_date, current_status (open/resolved/escalated), priority (low/medium/high), assigned_to_agent_id, handling_strategy_used, resolution_notes, days_open, impact_on_timeline, linked_past_cases (comma-separated deal ids that faced same issue) | Every objection tied to the deal; resolution tracking |
| **DealRisk** | id, deal_id, risk_category (buyer_financial/appraisal/inspection/market_shift/agent_availability/client_motivation), risk_level (1-10), identified_date, mitigation_action, target_resolution_date, status (open/mitigated/realized) | Early warning system; broker intervention |
| **Contingency** | id, deal_id, type (financing/appraisal/inspection/title/hoa_approval), status (active/waived/failed/satisfied), deadline, satisfied_date, reason_if_failed, remediation_notes | Roadmap to close; blockers made explicit |

**Key Insights from Domain 3:**
- Which stages take longest? Where deals stall?
- Deal health at a glance
- Objection → resolution time analysis
- Commission tracking and forecasting

---

### Domain 4: ACTIVITY & EFFORT
**Every action, every hour, every agent**

| Entity | Fields | Purpose |
|--------|--------|---------|
| **Activity** | id, agent_id, activity_type (call/email/sms/meeting/showing/listing_pitch/open_house/mailing/social), deal_id (nullable), contact_id, duration_minutes, date, time, notes, outcome (positive/neutral/negative/no_response), next_action_type, next_action_date, logged_by_agent_or_auto | Activity audit; effort attribution |
| **Call** | id, activity_id, call_type (inbound/outbound), duration_minutes, transcript (if recorded), recording_url, objection_raised (nullable), resolution (yes/no/partial), sentiment (positive/neutral/negative), key_outcome, post_call_action | Voice activity detail |
| **Email** | id, activity_id, subject, body_preview, recipient, opened (yes/no), clicked (yes/no), attachments, templates_used, sent_date | Email campaign attribution |
| **Showing** | id, activity_id, client_id, property_id, showing_date, showing_time, duration_minutes, attendees, feedback_from_agent, feedback_from_client, showing_fee, next_step_client_indicated | Conversion tracking |
| **AgentDayActivity** | id, agent_id, activity_date, total_calls, total_emails, total_meetings, total_showings, total_leads_contacted, total_follow_ups, hours_logged, deals_progressed, deals_closed_this_day, commission_earned_this_day | Daily scorecard; effort aggregation |

**Key Insights from Domain 4:**
- Who's actually working? How hard?
- Activity correlation with outcomes (calls → closings?)
- Time spent per deal stage
- Effort score per agent

---

### Domain 5: OBJECTIONS & STRATEGIES
**The playbook; grows over time**

| Entity | Fields | Purpose |
|--------|--------|---------|
| **ObjectionType** | id, type (price/location/financing/condition/timing/competition/terms/contingency/inspection/commission), description, category (pricing/property/market/process/personal), severity (low/medium/high) | Standardized objection taxonomy |
| **ObjectionHandlingStrategy** | id, objection_type_id, strategy_name, strategy_description, handling_approach (2-3 sentences), key_points (bullet list), required_data_to_reference, success_rate (%), avg_resolution_days, times_used_total, times_successful, sample_scripts (3 verbatim lines), alternative_strategies, references_past_cases (deal ids), created_by_agent_id, created_date, last_used_date | Playbook entry; evidence-backed |
| **ObjectionOutcome** | id, objection_id, resolution_strategy_id, resolved_yes_no, resolution_date, resolution_notes, days_to_resolution, deal_progressed_after (yes/no), follow_up_needed (yes/no), impact_on_price (delta), agent_sentiment (confident/uncertain/uncertain_but_resolved), client_sentiment (satisfied/neutral/dissatisfied) | Track what actually worked |
| **ObjectionFeedback** | id, objection_id, user_rating (1-5 stars), user_comment, was_strategy_effective (yes/no/partially), would_use_again (yes/no) | Learning loop |

**Key Insights from Domain 5:**
- Real success rates for each strategy
- Which strategies work for which agent?
- Which objections are most common per deal stage?
- Which strategies save the most deals?

---

### Domain 6: LEADS & NURTURING
**Lead capture through qualification**

| Entity | Fields | Purpose |
|--------|--------|---------|
| **LeadSource** | id, source_type (website/zillow/realtor/referral/sphere/open_house/farming/past_client/social/other), source_name, cost_per_lead, monthly_volume, quality_score (1-10), conversion_rate, avg_deal_value, roi_estimate | Lead source ROI; budget allocation |
| **LeadScore** | id, lead_id, score (0-100), components (source_fit/engagement/demographic/intent), last_calculated, created_date | Prioritization; routing |
| **LeadNurtureSequence** | id, lead_id, sequence_type (buyer/seller/sphere/past_client), current_step (1-12), step_date, contact_method (email/sms/call/direct_mail), message_content, send_status (sent/opened/clicked/responded), next_step_date, assigned_agent_id, opted_out (yes/no) | Automated follow-up; retention |
| **LeadQualification** | id, lead_id, qualified_yes_no, qualified_date, qualification_notes, decision_timeline, budget_approved, motivation_level (1-10), ready_to_view (yes/no/maybe), assigned_agent_at_qualification | Gate to deal creation |

**Key Insights from Domain 6:**
- Lead quality by source
- Nurture sequence open/click rates
- Qualification-to-deal conversion rate
- Cost per qualified lead

---

### Domain 7: COMMUNICATIONS & TEMPLATES
**Messaging, brand consistency, history**

| Entity | Fields | Purpose |
|--------|--------|---------|
| **MessageTemplate** | id, template_type (price_objection/location_objection/financing_pitch/follow_up/listing_intro/offer_prep), category, template_name, body (with {variables}), success_rate_using_template, created_by, created_date, usage_count, tags | Quick responses; brand consistency |
| **BrandGuideline** | id, category (tone/language/format/visual/offer_structure), rule, do_example, dont_example, applies_to (all_agents/agent_type/deal_type), created_by_broker, last_updated | Enforce brand voice |
| **CommunicationLog** | id, agent_id, contact_id, deal_id (nullable), method (call/email/sms/in_person), message_content_or_transcript, sent_date, time, received_confirmation (yes/no), recipient_response, follow_up_needed_by_date, follow_up_completed (yes/no), follow_up_date | Audit trail; follow-up enforcement |

**Key Insights from Domain 7:**
- Template effectiveness
- Brand consistency score
- Follow-up compliance rate

---

### Domain 8: PERFORMANCE & METRICS
**Agent scoring, team performance, forecasting**

| Entity | Fields | Purpose |
|--------|--------|---------|
| **AgentMonthlyScore** | id, agent_id, month, year, leads_generated, leads_converted, deals_closed, commission_earned, activity_score (calls+emails+meetings normalized), objection_resolution_rate, client_satisfaction, pipeline_value, forecast_value, effort_rank, deals_at_risk_count, performance_tier (top/strong/developing/needs_improvement), trend_vs_last_month, trend_vs_ytd, notes_from_broker | Monthly scorecard |
| **AgentCareerStats** | id, agent_id, total_deals_closed, total_commission_earned, ytd_deals, ytd_commission, avg_deal_value, avg_days_to_close, specialization (buyer/seller/investor/commercial), hire_date, career_rank, promotion_eligible (yes/no) | Career view |
| **DealPipeline** | id, agent_id, month, year, stage_name, stage_count, stage_value, stage_weighted_forecast (count * avg_deal * conversion_rate), days_to_close_avg, at_risk_count, at_risk_value | Funnel health per agent |
| **ForecastAccuracy** | id, agent_id, forecast_period (month/quarter), forecasted_value, actual_value, variance_percent, accuracy_trend | Forecast reliability |
| **PeerComparison** | id, period, agent_id, metric_type (closings/commission/activity/satisfaction), agent_value, team_avg, team_rank, comparison_notes | Competitive benchmarking |

**Key Insights from Domain 8:**
- Who's performing? Why?
- What changed month-to-month?
- Who needs coaching?
- Team trends

---

### Domain 9: FEEDBACK & LEARNING
**Post-sale voice, referral capture, learning loop**

| Entity | Fields | Purpose |
|--------|--------|---------|
| **PostSaleFeedback** | id, client_id, deal_id, survey_type (nps/csat/detailed), survey_date, response_date, responded (yes/no), nps_score (0-10), nps_sentiment (promoter/passive/detractor), csat_score (1-5), key_feedback_text, specific_compliments, specific_complaints, would_refer (yes/no), refer_condition, improvement_suggestions | Voice of customer |
| **Referral** | id, referring_client_id, referred_lead_id, referral_date, referral_status (pending/contacted/converted/declined), referral_source_context (agent_requested/client_volunteered), commission_if_closed, referral_fee_paid (yes/no) | Referral tracking; incentive proof |
| **ClientNurture** | id, client_id, status (active/stale/won_back), last_contact_date, contact_frequency_monthly, nurture_content_type (market_update/open_house/new_listing/community_news), sent_date, opened (yes/no), next_nurture_scheduled | Post-sale engagement |
| **LessonLearned** | id, deal_id, objection_id (nullable), agent_id, lesson_category (strategy/process/communication/timing), description, actionable_takeaway, applicable_to (single_agent/team/all), created_date, upvotes_from_peers, adoption_level | Institutional learning |

**Key Insights from Domain 9:**
- NPS and satisfaction trends
- Referral loop health
- Client retention rate
- What the team is learning

---

### Domain 10: CONFIGURATION & SETTINGS
**System personalization**

| Entity | Fields | Purpose |
|--------|--------|---------|
| **BrokerageSettings** | id, brokerage_id, default_commission_split, mls_sync_enabled, mls_code_list, calendar_integration (google/outlook), email_integration (gmail/outlook/other), lead_routing_rules, form_templates_approved, compliance_rules | System-wide config |
| **UserPreferences** | id, agent_id, calendar_sync (yes/no), email_digest_frequency (daily/weekly/none), notification_prefs (push/email/sms), theme (dark/light), reports_to_generate (list), default_view_on_login | Personal config |
| **CustomField** | id, brokerage_id, entity_type (deal/lead/property/contact), field_name, field_type (text/number/date/dropdown), required (yes/no), visibility (all_agents/broker_only) | Flexibility |

---

## Complete Feature Set

### SECTION A: LEAD MANAGEMENT

#### A1. Lead Capture
- **Multi-source inbox:** Zillow API, MLS webhook, web form, email forward, manual entry
- **Auto-routing:** Lead score determines which agent gets it
- **Duplicate detection:** Phone/email matching to prevent doubles
- **Auto-enrichment:** Zillow/public data fills in profile (estimated home value, owner info)

#### A2. Lead Qualification
- **Lead scoring:** Explicit qualification model (source fit + engagement + timeline + budget)
- **Qualification worksheet:** Agent walks through questions; system scores readiness
- **Disqualification:** Option to flag as "not a fit" with reason; nurture for future
- **Auto-nurture for unqualified:** Stays in sequence; re-scores periodically

#### A3. Lead Communication
- **CRM template library:** Pre-written outreach for every scenario
- **Auto-follow-up reminders:** Follow-up date set; system reminds agent 24h before
- **Email tracking:** Open/click visible in lead record
- **Two-way sync:** Emails about a lead in Gmail/Outlook auto-link to record
- **SMS option:** Opt-in SMS sends; click-to-call convenience

#### A4. Lead-to-Deal Conversion
- **One-click deal creation:** "Convert lead" button pre-populates deal record with lead data
- **Assignment:** Agent assigned at conversion
- **Handoff clarity:** Deal moves to pipeline; lead archive triggered

---

### SECTION B: PROPERTY & MARKET DATA

#### B1. Property Records
- **MLS sync:** Auto-pull active listings; daily update of price, status, days on market
- **Manual upload:** Agent uploads off-market properties or pocket listings
- **Property details:** Full suite (beds, baths, sqft, parking, appliances, condition notes, hoa)
- **Photo library:** In-app image upload; storage; reference by agent
- **Valuation data:** Zillow Zestimate, tax assessment, recent comps, price per sqft

#### B2. Comparable Sales
- **Auto-comps:** System suggests comps for any property based on similar beds/baths/sqft/location
- **Manual add:** Agent can add custom comps
- **Comp table:** Side-by-side pricing, days on market, adjustments
- **Export:** One-click CMA ready for client presentation

#### B3. Market Intelligence
- **Neighborhood trends:** Price per sqft 90-day trend, DOM, inventory, YoY change
- **Competitive positioning:** See who your competitors are listing similar properties for
- **Seasonal data:** Historical patterns (e.g., summer is faster than winter)
- **Broker visibility:** All agents see same market data; reduces price argument

---

### SECTION C: DEAL & PIPELINE MANAGEMENT

#### C1. Deal Creation & Setup
- **From lead or scratch:** Deal record captures client, property, deal type, listing agent, co-agent
- **Funnel stages:** 8 stages (Lead → Prospect → Viewing → Offer → Negotiation → Inspection → Appraisal → Closing)
- **Timeline forecasting:** Expected close date set; system flags if days-in-stage exceed typical
- **Stage triggers:** Actions required to advance stage (e.g., "appraisal complete" to move past appraisal stage)

#### C2. Pipeline Visibility
- **Kanban board:** Horizontal view of all deals by stage; drag to update
- **Pipeline metrics:** Total value, weighted forecast (value × probability by stage), deal count per stage
- **Deal cards:** Show client, property, offer vs list, days in stage, health status (green/yellow/red)
- **Filtering & sorting:** By agent, by status, by stage, by risk level
- **Broker dashboard:** See all agents' pipelines; spot issues (stalled deals, high-risk deals)

#### C3. Deal Progression
- **Event logging:** Every significant moment auto-recorded or agent-logged (showing scheduled, offer submitted, inspection scheduled, etc.)
- **Timeline view:** Deal history as vertical timeline; audit trail
- **Contingency tracking:** Each contingency listed with deadline and status
- **Commission forecasting:** System calculates expected commission and shows in pipeline value

#### C4. Deal Risk Management
- **Risk scoring:** System flags deals as Yellow or Red based on:
  - Days in stage exceeding norm
  - Multiple open objections
  - Appraisal risk (if value < offer price)
  - Buyer financing not approved 30 days before close
  - Inspection issues unresolved
- **Risk actions:** Manual or automatic alerts to agent and broker
- **Intervention toolkit:** Broker can jump in, reassign, or escalate

#### C5. Deal Closing
- **Closing checklist:** Pre-built per deal type (buyer vs seller)
- **Document tracking:** Who needs to sign what; deadline; status
- **Final walkthrough:** Checklist for day-of inspection
- **Close notification:** Agent marks "closed"; deal removed from active pipeline
- **Commission calculation:** Auto-calculates based on deal terms and agent split

---

### SECTION D: OBJECTION HANDLING & PLAYBOOK

#### D1. Real-Time Objection Detection
- **Guided entry:** Agent hears objection → clicks "Log Objection" → selects type from dropdown
- **Objection form:** Type, date raised, priority, who raised it, initial response
- **Auto-suggestion:** System suggests handling strategies based on past success

#### D2. Objection Playbook
- **Strategy library:** 10+ core objection types, each with:
  - Description of objection
  - Root causes (why buyers really care)
  - Proven handling approach
  - Success rate from your data
  - 3 verbatim scripts to say
  - Evidence (comparable sales, case studies, expert points)
  - Common follow-up questions
- **Peer strategies:** See what other agents have tried for same objection
- **Add custom strategies:** Agent documents new approach; system tracks success rate

#### D3. In-Deal Objection Tracking
- **Objection attached to deal:** Every deal can have multiple open objections
- **Objection lifecycle:** Raised → Strategy assigned → Agent attempts → Resolution notes → Resolved/Escalated
- **Risk flag:** Unresolved objections after 7 days auto-flag as risk
- **Next action:** System suggests follow-up action if objection not resolved

#### D4. Objection Analytics
- **Success rate per strategy:** System tracks: strategy used → did it resolve the objection → did deal close?
- **Time to resolution:** How long does each objection type take, on average?
- **Objection frequency:** Which objections come up most? In which stage?
- **Agent performance:** Which agents resolve objections fastest?

---

### SECTION E: ACTIVITY & EFFORT TRACKING

#### E1. Activity Logging
- **Auto-logging:** Calendar integration (Google/Outlook) pulls meetings; system asks for context
- **Manual logging:** Agent logs call, email, showing, or other activity with duration and outcome
- **Mobile logging:** Quick-add from phone (call ended; tap "Log Call"; pick client; pick outcome)
- **Bulk logging:** Copy previous week's actuals to this week as template

#### E2. Call Integration
- **Call recording (optional):** If agent uses call recording tool, transcript auto-attaches
- **Transcript search:** AI-powered full-text search across all call transcripts (Phase 2)
- **Objection auto-extraction:** System flags objections mentioned in transcript (Phase 2)

#### E3. Daily & Weekly Scorecards
- **Daily:** Calls, emails, meetings, showings, follow-ups completed; deals progressed
- **Weekly:** Calls, emails, meetings total; leads contacted; conversion activity
- **Color-coded:** Green = above average; Yellow = at average; Red = below average
- **Peer comparison:** See how your activity stacks vs. team average

#### E4. Effort Score
- **Composite score:** Weighted average of activity quantity + deal progression + objection resolution
- **Visible to broker:** Broker sees who's working hardest
- **Gamification (optional):** Leaderboard of top effort scorers
- **Activity trend:** Graph of effort month-over-month (detecting burnout or slack)

---

### SECTION F: AGENT & TEAM PERFORMANCE

#### F1. Individual Agent Dashboard
- **At a glance:** YTD closings, YTD commission, pipeline value, this month's trend
- **Activity scoreboard:** Calls, emails, showings this week vs. last week
- **Personal pipeline:** My deals by stage, my risk deals, my follow-ups due
- **Objection history:** My most common objections; my resolution rate
- **Commission tracker:** How much I've made YTD; projected commission if I close current pipeline
- **Development areas:** Broker feedback, areas for coaching

#### F2. Broker / Team Dashboard
- **All-agent view:** Grid of all agents with key metrics (closings YTD, pipeline value, activity level)
- **Funnel health:** Total team pipeline by stage; team weighted forecast
- **Risk alerts:** Deals at risk; objections stalled; agents below activity baseline
- **Performance rankings:** Closings, commission, activity, satisfaction scores
- **Forecasting:** Team revenue forecast for month/quarter based on pipeline
- **Peer comparison:** How is my team performing vs. market benchmark (if available)

#### F3. Agent Scoring & Tiers
- **Tier 1 (Top):** Top 20% of agents by commission or closings; marked for advancement
- **Tier 2 (Strong):** Mid 50%; performing well; growth potential
- **Tier 3 (Developing):** Lower 25%; needs coaching; performance improvement plan optional
- **Scoring components:** Closings, activity, objection resolution rate, client satisfaction
- **Monthly review:** Auto-generated performance review for broker to discuss with agent

#### F4. Peer Learning
- **Top performer playbooks:** When top agent uses a strategy, system flags it and makes it visible to others
- **Lesson learned log:** Agents post what they learned from a deal; peers upvote; most-upvoted bubble to top
- **Strategy voting:** Objection handling strategy library — agents rate effectiveness; system weighs ratings
- **Coaching records:** Broker logs coaching sessions; notes attached to agent record

---

### SECTION G: LEAD NURTURING & FOLLOW-UP

#### G1. Auto-Nurture Sequences
- **Buyer nurture:** 12-touch sequence for unqualified buyers (weekly market update, new listing alert, open house invite, community news)
- **Seller nurture:** 8-touch sequence for future sellers (home value estimate, market trend, testimonial, listing process guide)
- **Sphere nurture:** 12-touch sequence for past clients (market update, new community news, referral offer, appreciation card)
- **Frequency:** Agent/broker configures; default weekly
- **Opt-out:** Contact can unsubscribe at any time; system honors

#### G2. Follow-Up Enforcement
- **Follow-up reminder:** Agent sets "follow up 3 days" on a lead; system reminds 24 hours before
- **Desktop popup:** When logged in, top bar shows "Follow-ups Due Today" with count
- **Mobile notification:** Optional push notification for follow-ups due
- **Compliance tracking:** Broker sees which agents are missing follow-up deadlines; trend over time
- **Escalation:** After 3 missed follow-ups, option to reassign lead or flag as oversight

#### G3. Engagement Tracking
- **Email open/click:** If using integrated email, system tracks opens and clicks
- **Website visit:** Pixel tracking (optional) shows if contact visited property listing
- **Calendar acceptance:** If sending calendar invites, tracks accepted vs. declined
- **Engagement score:** Combines opens, clicks, calendar accepts to show readiness

#### G4. Re-engagement Campaigns
- **Stale leads:** Leads inactive 60+ days get moved to "stale" status; automated re-engagement sequence
- **Win-back:** Past client inactive 12+ months; system triggers appreciation call + market update
- **Re-qualification:** System periodically bumps stale leads for manual re-qualification

---

### SECTION H: FEEDBACK & LEARNING

#### H1. Post-Sale Feedback
- **NPS Survey:** 1-10 question sent 1 week after closing; captures sentiment and referral intent
- **CSAT Survey:** 5-question detailed feedback on specific aspects (communication, responsiveness, knowledge, process, value)
- **Open feedback:** Free-text box for specific compliments or complaints
- **Incentive option:** Referral discount or thank-you gift option

#### H2. Referral Capture
- **Referral prompt:** "Would you refer us? Who do you know?" asks for names/contacts
- **Referral link:** Client gets unique referral link; any lead clicking it auto-credits the referrer
- **Referral tracking:** Every referred lead tagged; conversion from referral is visible
- **Incentive program:** Broker sets referral fee or discount; system tracks payout eligibility

#### H3. Satisfaction Trends
- **NPS over time:** Rolling 12-month NPS score; broken down by agent
- **CSAT by dimension:** Avg satisfaction by communication, knowledge, responsiveness; identifies gaps
- **Detractor follow-up:** If NPS < 6, broker gets alert; option to send recovery email
- **Segment satisfaction:** Satisfaction by buyer vs. seller vs. investor; by property type

#### H4. Learning Loop
- **Lesson logging:** Agent or broker can attach a "Lesson Learned" to any deal; system categorizes (process/communication/strategy/timing)
- **Peer visibility:** Team can search and upvote most-useful lessons
- **Adoption tracking:** System tracks if other agents are using the lesson; adoption rate visible
- **Quarterly review:** Broker reviews most-upvoted lessons; considers for standard process change

---

### SECTION I: REPORTING & ANALYTICS

#### I1. Agent Reports (run by agent or broker)
- **Monthly summary:** Leads, conversions, closings, commission, activity count, satisfaction score
- **Pipeline report:** Active deals by stage, at-risk deals, forecast vs. actual close
- **Objection report:** Most common objections, resolution rate, time to resolution
- **Activity report:** Calls, emails, showings, follow-ups by week
- **Commission report:** Deals closed this period, commission earned, YTD total
- **Comparison report:** Agent's metrics vs. team average and vs. prior month

#### I2. Team Reports (run by broker)
- **Team summary:** Total closings, total commission, total activity, team size, attrition
- **Funnel health:** Stage-by-stage breakdown, days per stage, velocity
- **Risk dashboard:** Deals flagged yellow or red; objections open > 7 days; agents below activity baseline
- **Performance ranking:** Leaderboard of agents by closings, commission, activity, satisfaction
- **Forecast accuracy:** Previous quarter's forecast vs. actual; accuracy by agent
- **Trend analysis:** Month-over-month change in key metrics; spot improvements or regressions

#### I3. Executive Reports (broker-facing)
- **Revenue summary:** YTD commission vs. plan; projection for full year
- **Top performers:** Top 5 agents by commission; top 5 by closings; top 5 by satisfaction
- **At-risk deals:** Deals most likely to slip or fail; value at risk
- **Resource needs:** Agents with more leads than capacity; leads in queue for ramp-up agent
- **Market positioning:** How is my brokerage performing vs. market (if market data available)

#### I4. Export & Share
- **PDF export:** Any report can export to PDF for email or client presentation
- **Scheduled delivery:** Broker can schedule reports to email on recurring basis (weekly, monthly)
- **White-label option:** Reports can be branded with brokerage logo and colors
- **Data download:** Raw data export to CSV for power users or accountants

---

### SECTION J: INTEGRATIONS & AUTOMATIONS

#### J1. Calendar Integration
- **Google Calendar / Outlook:** Auto-sync; agent's calendar events visible in CRM
- **Context:** Agent meeting = system asks what it was about; attaches to lead or deal
- **Reminders:** Follow-up reminders on calendar; sync back to Google/Outlook

#### J2. Email Integration
- **Gmail / Outlook:** BCC or integration; emails about a lead/deal auto-attach to record
- **Template access:** Agent can insert templates from template library while composing email
- **Read receipts:** System tracks if lead opened email; clicking link also signals engagement

#### J3. MLS Integration
- **Auto-sync:** System pulls active listings from MLS daily; updates status, price, DOM
- **Listing status:** When agent lists property, system auto-imports into Properties
- **Sold data:** Sold comps auto-update with final price and days on market

#### J4. Calling Integration (Phase 2)
- **Click-to-call:** Click lead/contact phone number; route through VoIP service
- **Call recording:** Recording auto-saved to deal or lead record
- **Transcript:** AI transcript available for search

#### J5. Document Integration (Phase 2)
- **DocuSign / eSignature:** Agent initiates signing; status tracked in deal
- **Document checklist:** Per-deal closing checklist; mark complete as docs are signed

#### J6. Automation Workflows
- **Lead routing:** New lead scored; auto-assigned to agent based on specialization/capacity
- **Follow-up reminder:** Scheduled follow-up; auto-send email 24h before to agent
- **Risk escalation:** Deal flagged yellow; auto-notify broker; if red, auto-alert agent and broker
- **Stale lead re-engagement:** Lead inactive 60 days; auto-send re-engagement email sequence
- **Post-close survey:** Deal closed; auto-send NPS survey 1 week later
- **Commission report:** Monthly; auto-generate and email to agent and accounting

---

## User Interfaces

### UI-1: ASK SCREEN (Objection Handler)
**Primary feature; default landing page**

```
┌─────────────────────────────────────────────────────────────────┐
│ DealDesk | Turn 47 | Helpful: 89%                        🔆 ⚙️  │
├─────────────────────────────────────────────────────────────────┤
│ Objection Analysis & Playbook                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  [Previous context hidden; scroll for history]                  │
│                                                                   │
│  AGENT: "Client is concerned the price is 8% above comparables" │
│                                                                   │
│  ════════════════════════════════════════════════════════════    │
│  PIPELINE RUNNING (1.8 seconds)                                  │
│  ✓ Stage 1: Intent classified as PRICE_TOO_HIGH (89% confidence)│
│  ✓ Stage 2: Retrieved 4 past calls, 3 objections, 2 similar deals
│  ⟳ Stage 3: Matching strategies [━━━━━━━━━ 60%]                │
│  ⋯ Stage 4: Enriching with comps and brand guidance...          │
│  ⋯ Stage 5: Assembling response...                              │
│                                                                   │
│  Tools firing:                                                   │
│  ✓ SearchCallTranscripts (240ms)                                │
│  ✓ GetHandlingStrategy (180ms)                                  │
│  ✓ GetSimilarCases (290ms)                                      │
│  ⟳ GetCompetitorAnalysis (120ms)                                │
│                                                                   │
│  ════════════════════════════════════════════════════════════    │
│                                                                   │
│  [RESPONSE STREAMING]                                            │
│                                                                   │
│  THE PLAY                                                        │
│  Lead with comp analysis. Highlight value-adds. Offer flexibility.
│                                                                   │
│  WHY IT WORKS                                                    │
│  • 76% success rate when you show comps first (your data)        │
│  • Buyers care about value, not just price—shift conversation    │
│  • Flexibility (terms, timing) often matters as much as price    │
│                                                                   │
│  SAY THIS                                                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ "I understand the concern. Here's what I'm seeing in the  │ │
│  │ market. We're actually 8% BELOW the average for this      │ │
│  │ neighborhood based on recent sales. Let me show you...    │ │
│  │ And if price is the primary concern, let's talk about     │ │
│  │ closing costs or closing timeline — those move quickly."  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                           [COPY]                                 │
│                                                                   │
│  THE EVIDENCE                                                    │
│  Success rate: ████████░░ 76% (last 12 months)                 │
│  Similar deals closed: 18                                        │
│  Sources:                                                        │
│  • Call CALL-00478 (Price objection resolved in 2 days)         │
│  • Case: 456 Maple Dr — Negotiated from list to $615k           │
│  • Comps in 78702: Average $498 / sqft vs this $485 / sqft      │
│                                                                   │
│  NEXT STEPS                                                      │
│  1. Share the comp analysis (pull CMA one-click)                │
│  2. Ask: "Is price the primary concern, or are there other      │
│     factors?" (Listen for other objections)                     │
│  3. If price is real concern: "Can we explore flexible terms    │
│     instead?" — offer closing cost credit or extended timeline  │
│                                                                   │
│  ────────────────────────────────────────────────────────────── │
│  Confidence: 82% | Data Freshness: Real-time | 4 Sources       │
│  Response Time: 1,847ms | Feedback: 👍 (helpful) 👎 (not)      │
│                                                                   │
│  Quick Start Examples:                                           │
│  [Competing offer] [Financing issue] [Timing concern]            │
│  [Property condition] [Location concerns] [Add custom...]        │
│                                                                   │
│  ════════════════════════════════════════════════════════════    │
│                                                                   │
│  Your question:                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Client also asking about appraisal gap risk — what if      ││
│  │ appraisal comes in $50k low?                               ││
│  │                              [Ask]  [Use template] [Log]  ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Key features:**
- Starter chips for quick common questions
- Multi-turn conversation history
- Visible pipeline animation (5 stages, real-time tool firing)
- Streaming response with structured sections
- Confidence + data freshness + source citation
- Copy-to-clipboard for scripts
- Feedback (thumbs up/down) updates helpfulness stat
- Turn counter at top

---

### UI-2: PIPELINE BOARD (Funnel Visibility)
**Kanban-style deal tracking**

```
┌─────────────────────────────────────────────────────────────────┐
│ DealDesk | Pipeline | Filter: All | Sort: By Stage              │
├─────────────────────────────────────────────────────────────────┤
│ Pipeline Value: $2.3M | Weighted Forecast: $1.8M | At Risk: $340K
├──────────────┬──────────────┬──────────────┬──────────────────────┤
│ LEAD (4)     │ PROSPECT (3) │ VIEWING (6)  │ OFFER (2) | NEG (1)  │
│ $480K        │ $750K        │ $920K        │ $210K | $85K         │
├──────────────┼──────────────┼──────────────┼──────────────────────┤
│              │              │              │                       │
│ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐ ┌──────┐│
│ │ John Doe │ │ │ Jane Doe │ │ │Sarah Lee │ │ │Mike Typo │ │DEAL-1││
│ │456 Maple │ │ │123 Oak   │ │ │789 Pine  │ │ │OfficeBlk│ │(2 hr)││
│ │$625k Cond│ │ │$450k 3bd │ │ │$320k 2bd │ │ │$850k Com│ │      ││
│ │1d in Lead│ │ │3d in Pros│ │ │1d in View│ │ │Offered  │ │      ││
│ │ 🔴◀ 2 obj│ │ │          │ │ │ 2 showings   │ │$820k    │ │      ││
│ │[Follow]  │ │ │[View >]  │ │ │ ◀ 1 objection│ │4% delta │ │      ││
│ └──────────┘ │ └──────────┘ │ │ 🔴          │ │[View >] │ │[View]││
│              │              │ │[View >]    │ │         │ │      ││
│ ┌──────────┐ │ ┌──────────┐ │ └──────────┘ │ └──────────┘ └──────┘│
│ │ Lisa Park│ │ │Bob Smith │ │              │ ┌──────────┐         │
│ │2050-2080 │ │ │ Farm Plot│ │ ┌──────────┐ │ │DEAL-2    │         │
│ │$310k Land│ │ │$125k Land│ │ │Tony Quinn│ │ │(3 days)  │         │
│ │14d in Ld │ │ │5d in Pros│ │ │Investor  │ │ │Land Deal │         │
│ │ 🟢       │ │ │ 🟢       │ │ │$275k 2bd │ │ │$130k Ask │         │
│ │[Follow]  │ │ │[Follow]  │ │ │9d in View│ │ │$125k Bid │         │
│ └──────────┘ │ └──────────┘ │ │ 🟢       │ │ │-3.7%    │         │
│              │              │ │[View >]  │ │ │[View >] │         │
│ ┌──────────┐ │              │ └──────────┘ │ └──────────┘         │
│ │ Fred Liu │ │              │              │                       │
│ │Unlisted  │ │              │ ┌──────────┐ │                       │
│ │$110k TBD │ │              │ │ Amy Wang │ │                       │
│ │New Lead  │ │              │ │Corp Lease│ │                       │
│ │ 🟢       │ │              │ │$450k 5br │ │                       │
│ │[Follow]  │ │              │ │14d in View│ │                       │
│ └──────────┘ │              │ │ 🟡 3 objs│ │                       │
│              │              │ │[View >]  │ │                       │
│              │              │ └──────────┘ │                       │
│              │              │              │                       │
│              │              │ ┌──────────┐ │                       │
│              │              │ │ David Kim│ │                       │
│              │              │ │Office 2K │ │                       │
│              │              │ │$1.2M Cmrl│ │                       │
│              │              │ │2d in View│ │                       │
│              │              │ │ 🟢 Buyer │ │                       │
│              │              │ │[View >]  │ │                       │
│              │              │ └──────────┘ │                       │
├──────────────┴──────────────┴──────────────┴──────────────────────┤
│ ⌛ INSPECTION (2) | ⚠️  APPRAISAL (1) | ✅ CLOSING (2) | ✓ CLOSED│
│ $240K | $180K | $520K |                                           │
└─────────────────────────────────────────────────────────────────┘
```

**Key features:**
- Horizontal kanban; 8 stages visible
- Card shows client, property, price, days in stage, health indicator
- Color dots show objections (red = unresolved, yellow = open)
- Drag card to move between stages
- Click card for details panel
- Top metrics: pipeline value, weighted forecast, at-risk value

---

### UI-3: AGENT PERFORMANCE DASHBOARD
**Individual scorecard + comparison**

```
┌─────────────────────────────────────────────────────────────────┐
│ DealDesk | Performance | Agent: Sarah Chen | November 2024      │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────┬─────────┬──────────┬────────────┬──────────────────┐│
│ │ CLOSINGS│ COMM YTD│ PIPELINE │ AVG EFFORT │ SATISFACTION     ││
│ │   12    │ $247K   │ $1.8M    │    94%     │ 4.6 / 5.0       ││
│ │ +33%vs  │ +8%     │ +22%     │ Top 5%     │ +12%             ││
│ │LY       │ LY      │ vs Oct   │            │ vs team avg     ││
│ └─────────┴─────────┴──────────┴────────────┴──────────────────┘│
│                                                                   │
│ THIS WEEK'S ACTIVITY                                             │
│ ┌─────────────┬─────────────┬─────────────┬──────────────────┐ │
│ │ CALLS       │ EMAILS      │ SHOWINGS    │ FOLLOW-UPS       │ │
│ │    18       │     24      │     6       │      12          │ │
│ │ ◀ vs last 17│ ◀ vs last 22│ ◀ vs last 7 │ ◀ vs last 8     │ │
│ └─────────────┴─────────────┴─────────────┴──────────────────┘ │
│                                                                   │
│ YTD CLOSINGS & COMMISSION                                        │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec Forecast  │ │
│ │ ▯  ▯  ▯▯ ▯▯ ▯▯ ▯▯▯▯ ▯▯ ▯▯▯▯ ▯▯▯ ▯▯▯▯ ▯▯▯  ~▯▯▯          │ │
│ │  1  2   3  4  2   5  4  5   6   3   12  YTD Goal: 40     │ │
│ │ Deals Closed each month ▲ Commission earned ↑ Pace track ║ │
│ └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│ PIPELINE FORECAST                                                │
│ Stage              Count  Value  Est. Prob  Weighted Forecast    │
│ Lead               2      $240K     20%         $48K              │
│ Prospect           1      $450K     50%         $225K             │
│ Viewing            3      $820K     60%         $492K             │
│ Offer              1      $210K     80%         $168K             │
│ Negotiation        1      $85K      90%         $76.5K            │
│ ──────────────────────────────────────────────────────────────   │
│ FORECAST TOTAL                                  $1,009.5K        │
│ Current forecast assumes all deals close on scheduled timeline.  │
│ (Yellow-flagged deals: 2, at risk: $140K)                       │
│                                                                   │
│ OBJECTION HANDLING                                               │
│ ┌──────────────────┬──────────┬──────────┬──────────────────────┐│
│ │ OBJECTION TYPE   │ RESOLVES │ SUCCESS  │ DAYS TO RESOLVE      ││
│ │ Price Too High   │ 6 / 8    │   75%    │ Avg 3.2 days         ││
│ │ Location         │ 3 / 4    │   75%    │ Avg 5.1 days         ││
│ │ Financing        │ 8 / 8    │  100%    │ Avg 4.3 days         ││
│ │ Timing           │ 2 / 3    │   67%    │ Avg 6.8 days         ││
│ │ Inspection       │ 1 / 1    │  100%    │ Avg 9.2 days         ││
│ └──────────────────┴──────────┴──────────┴──────────────────────┘│
│                                                                   │
│ TEAM COMPARISON (November)                                       │
│ ┌──────────────┬────────┬────────┬────────┬──────────┬──────────┐│
│ │ AGENT        │ CLOSE  │ COMMIS │ ACTV   │ EFFORT % │ SAT      ││
│ │ Sarah Chen ★ │  12    │ $247K  │  94%   │   +12%   │ 4.6      ││
│ │ Mike Wong    │  10    │ $186K  │  88%   │   +3%    │ 4.2      ││
│ │ Lisa Park    │   8    │ $148K  │  81%   │   -8%    │ 4.4      ││
│ │ Bob Smith    │   7    │ $124K  │  76%   │  -15%    │ 3.9      ││
│ │ Team Average │  9.25  │$176K   │  85%   │   0%     │ 4.3      ││
│ └──────────────┴────────┴────────┴────────┴──────────┴──────────┘│
│                                                                   │
│ COACHING NOTES (from Broker)                                     │
│ "Sarah, strong month. Your objection resolution rate on pricing  │
│ is solid, and I'm seeing you close deals ~2 days faster than team│
│ average. Keep the momentum. Thought: your financing resolution   │
│ is 100% — consider documenting that strategy for the team."      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Key features:**
- YTD + monthly trends
- Activity scorecard vs. team
- Pipeline forecast with probability weighting
- Objection resolution rates broken down
- Peer comparison table
- Broker coaching notes

---

### UI-4: OBJECTION LIBRARY
**Searchable, sortable playbook**

```
┌─────────────────────────────────────────────────────────────────┐
│ DealDesk | Objection Library | Sort: By Success Rate | Filter   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│ ┌───────────────────────────────────────────────────────────┐  │
│ │ 🔍 Search by objection type, strategy, or script...       │  │
│ │ 📊 Sort: [Success Rate ▼] [Frequency] [Alphabetical]     │  │
│ │ 🏷️  Filter by: [Pricing] [Property] [Process] [All ▼]   │  │
│ └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─────────────────────────────┬──────────┬────────┬──────────┐ │
│  │ OBJECTION                   │ SUCCESS  │ COUNT  │ DAYS AVG │ │
│  ├─────────────────────────────┼──────────┼────────┼──────────┤ │
│  │ 1. Financing & Affordability│ ████████░ 82%   │  45 used │ │
│  │ 2. Price Too High           │ ████████░ 76%   │  38 used │ │
│  │ 3. Competitor Offer         │ ███████░░ 74%   │  31 used │ │
│  │ 4. Property Condition       │ ██████░░░ 68%   │  28 used │ │
│  │ 5. Location Concerns        │ ██████░░░ 68%   │  24 used │ │
│  │ 6. Market Timing            │ ██████░░░ 63%   │  19 used │ │
│  │ 7. Contract Terms           │ █████░░░░ 58%   │  16 used │ │
│  │ 8. Commission Pushback      │ █████░░░░ 58%   │  15 used │ │
│  │ 9. Inspection Findings      │ ████░░░░░ 52%   │  12 used │ │
│  │ 10. Contingency Worries     │ ███░░░░░░ 48%   │   8 used │ │
│  └─────────────────────────────┴──────────┴────────┴──────────┘ │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ FINANCING & AFFORDABILITY                           [>]  │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Success Rate: ████████░░ 82% | Used 45 times | 4.3 days avg │  │
│  │                                                              │  │
│  │ Description: Buyer cannot secure financing or believes     │  │
│  │ monthly payment is too high. Often coupled with appraisal   │  │
│  │ concerns.                                                   │  │
│  │                                                              │  │
│  │ HANDLING APPROACH                                           │  │
│  │ Proactively connect buyer with pre-approved lender. Show    │  │
│  │ multiple loan options (conventional, FHA, VA). Calculate    │  │
│  │ exact payment with different down payments. Offer to cover  │  │
│  │ closing costs if needed.                                    │  │
│  │                                                              │  │
│  │ SAY THIS (3 Scripts)                                       │  │
│  │ ┌────────────────────────────────────────────────────────┐ │  │
│  │ │ 1. "I work with several lenders who specialize in your││  │
│  │ │    situation. Let me get you a quick pre-approval    ││  │
│  │ │    letter — it takes 24 hours and shows us options."││  │
│  │ │                                      [COPY]           ││  │
│  │ └────────────────────────────────────────────────────────┘ │  │
│  │ ┌────────────────────────────────────────────────────────┐ │  │
│  │ │ 2. "Your payment would be roughly $2,400 / month on ││  │
│  │ │    30-year conventional. But if we did an FHA loan  ││  │
│  │ │    with 3% down, you're looking at $2,150 / month.  ││  │
│  │ │    Let's model both and see what works."             ││  │
│  │ │                                      [COPY]           ││  │
│  │ └────────────────────────────────────────────────────────┘ │  │
│  │ ┌────────────────────────────────────────────────────────┐ │  │
│  │ │ 3. "Financing is rarely the deal-killer — it's about ││  │
│  │ │    structuring it right. I have a lender on speed  ││  │
│  │ │    dial. Call me and let's explore what's actually   ││  │
│  │ │    possible. You may be surprised."                  ││  │
│  │ │                                      [COPY]           ││  │
│  │ └────────────────────────────────────────────────────────┘ │  │
│  │                                                              │  │
│  │ WHY IT WORKS (Coached Insights)                            │  │
│  │ • Financing concerns are often about confidence, not fact  │  │
│  │ • Pre-approval letter removes abstract worry              │  │
│  │ • Showing multiple loan products expands perceived choice │  │
│  │ • Proactive connection signals you're problem-solver      │  │
│  │                                                              │  │
│  │ PAST DEALS USING THIS STRATEGY                            │  │
│  │ ✓ DEAL-00127: Sarah Chen | 123 Oak St | Resolved in 2 days │  │
│  │ ✓ DEAL-00089: Mike Wong | 456 Maple Dr | 3 days             │  │
│  │ ✓ DEAL-00041: Bob Smith | 789 Pine Rd | 6 days              │  │
│  │ + 14 more examples...                                       │  │
│  │                                                              │  │
│  │ SUCCESS RATE BY DEAL STAGE                                 │  │
│  │ Viewing:        ████████░░ 78% (18/23)                      │  │
│  │ Offer:          ██████████ 91% (10/11)                      │  │
│  │ Negotiation:    ████████░░ 83% (10/12)                      │  │
│  │ Inspection:     ███████░░░ 75% (6/8)                        │  │
│  │ (Objection more easily resolved early; harder after        │  │
│  │ appraisal/inspection complications)                        │  │
│  │                                                              │  │
│  │ ALTERNATIVES (If primary strategy fails)                   │  │
│  │ • Offer to cover closing costs ($5-10K incentive)         │  │
│  │ • Extend closing date to allow lender review              │  │
│  │ • Walk buyer through loan approval process step-by-step   │  │
│  │ • Escalate to co-lender for second opinion                │  │
│  │                                                              │  │
│  │ FEEDBACK FROM TEAM                                         │  │
│  │ ⭐⭐⭐⭐⭐ Sarah: "Financing pitch changed my close rate"   │  │
│  │ ⭐⭐⭐⭐   Mike: "Good starting point; I tweak for investor" │  │
│  │ ⭐⭐⭐     Bob: "Long-winded; I abbreviate it"               │  │
│  │                                                              │  │
│  │ [Close Panel]                                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Key features:**
- Searchable grid of 10 objection types
- Sort by success rate, frequency
- Click to expand full detail
- 3 copy-able scripts
- Related past deals
- Success rate by stage (bar chart)
- Peer feedback (star ratings + comments)

---

### UI-5: BROKER TEAM DASHBOARD
**All-agent view; intervention opportunities**

```
┌─────────────────────────────────────────────────────────────────┐
│ DealDesk | Team Dashboard | November 2024 | Export Report       │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────┬──────────────┬──────────────┬──────────────────┐│
│ │ TEAM CLOSINGS│ TEAM COMMISS │ TEAM PIPELINE│ FORECAST ACCURACY││
│ │     87      │  $1.67M YTD  │    $8.2M     │     92%          ││
│ │ +15% vs LY  │  +19% vs LY  │  +22% vs Oct │ +3 pts vs Oct    ││
│ └─────────────┴──────────────┴──────────────┴──────────────────┘│
│                                                                   │
│ PERFORMANCE LEADERBOARD                                          │
│ ┌────┬─────────────┬─────────┬──────────┬────────┬────────┬─────┐│
│ │ #  │ AGENT       │ CLOSINGS│ REVENUE │ EFFORT │ SAT    │ TREND││
│ ├────┼─────────────┼─────────┼──────────┼────────┼────────┼─────┤│
│ │ 1⭐│ Sarah Chen  │   12    │ $247K   │  94%   │ 4.6/5  │ ↑↑   ││
│ │ 2  │ Mike Wong   │   10    │ $186K   │  88%   │ 4.2/5  │ →    ││
│ │ 3  │ Lisa Park   │    8    │ $148K   │  81%   │ 4.4/5  │ ↓    ││
│ │ 4  │ Bob Smith   │    7    │ $124K   │  76%   │ 3.9/5  │ ↓↓   ││
│ │ 5  │ Amy Wang    │    6    │ $ 98K   │  72%   │ 4.1/5  │ ↑    ││
│ │ 6  │ Tony Quinn  │    5    │ $ 87K   │  68%   │ 3.7/5  │ ↓↓   ││
│ │ 7  │ Fred Liu    │    4    │ $ 68K   │  52%   │ 3.5/5  │ ↓↓↓  ││
│ │ 8  │ David Kim   │    3    │ $ 52K   │  41%   │ 3.2/5  │ ↓↓↓  ││
│ └────┴─────────────┴─────────┴──────────┴────────┴────────┴─────┘│
│                                                                   │
│ FUNNEL HEALTH & STAGE ANALYSIS                                   │
│ Pipeline by stage (Value / Deal Count / Avg Days In Stage)      │
│ ┌────────┬──────────┬──────────┬──────────┬────────────────────┐│
│ │ Stage  │ Value    │ Deals    │ Avg Days │ Note               ││
│ ├────────┼──────────┼──────────┼──────────┼────────────────────┤│
│ │ Lead   │ $480K    │   4      │  2.1     │ ✓ Healthy velocity││
│ │ Prosp. │ $750K    │   3      │  5.3     │ ✓ Normal          ││
│ │ View   │ $920K    │   6      │  8.7     │ ⚠️  Slowing (+2d) ││
│ │ Offer  │ $210K    │   2      │ 11.2     │ 🔴 Stalled (-4d) ││
│ │ Neg    │  $85K    │   1      │ 18.1     │ 🔴 DEAL-2 stuck  ││
│ │ Insp   │ $240K    │   2      │  6.2     │ ✓ Mostly clear    ││
│ │ Apr    │ $180K    │   1      │  3.5     │ ✓ Moving          ││
│ │ Close  │ $520K    │   2      │  2.0     │ ✓ On track        ││
│ └────────┴──────────┴──────────┴──────────┴────────────────────┘│
│                                                                   │
│ AT-RISK DEALS (Broker Alert)                                     │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │ 🔴 DEAL-2 (Mike Wong, Mike Typo / OfficeBlk / $850K)         ││
│ │    Status: OFFER phase, 2 hours in (should take 1-3 days)   ││
│ │    Objection: Appraisal risk flagged (value may < offer)    ││
│ │    Days stalled: 18 (way above 3-day norm for offer stage)  ││
│ │    Action: [Re-assign] [Add Notes] [Call Agent] [View Deal]  ││
│ │                                                               ││
│ │ 🟡 DEAL-5 (Bob Smith, Amy Wang / Investor / $275K)          ││
│ │    Status: VIEWING phase, 14 days in (above 8-day norm)     ││
│ │    Open objections: 3 (inspection findings, timing concern)  ││
│ │    Days to close: Forecast 45 days (above 30-day target)    ││
│ │    Action: [Follow-up suggestion] [Get Objection Play]       ││
│ │                                                               ││
│ │ 🟡 AGENT ALERT (Fred Liu)                                   ││
│ │    Effort score dropped 20% vs Oct; activity down 15%        ││
│ │    Pipeline at risk: $310K in viewing stage, no recent prog. ││
│ │    Action: [Schedule Coaching] [Check Personal Issues]       ││
│ └──────────────────────────────────────────────────────────────┘│
│                                                                   │
│ TEAM OBJECTION TRENDS                                            │
│ Most common objections across all active deals:                 │
│ 1. Price Too High         (5 open objections) — avg resolution 3d│
│ 2. Financing              (4 open) — avg resolution 4d           │
│ 3. Inspection Findings    (3 open) — avg resolution 9d          │
│ 4. Market Timing          (2 open) — avg resolution 7d          │
│ 5. Property Condition     (2 open) — avg resolution 6d          │
│ [View detailed objection library] [See team strategies]          │
│                                                                   │
│ FORECAST ACCURACY (October Actual vs Forecast)                  │
│ Forecast: $1,450K | Actual: $1,340K | Variance: -7.6% | Good   │
│ Agents trending +accurate: Sarah (+2%), Lisa (+1%)              │
│ Agents trending -accurate: Tony (-8%), Fred (-12%)              │
│                                                                   │
│ [📊 Export Report] [📧 Email to Team] [📋 Print]                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Key features:**
- All agents ranked; key metrics side-by-side
- Funnel velocity by stage; alerts if slowing
- At-risk deals highlighted with recommended actions
- Objection trends across all deals
- Forecast accuracy tracking
- Export/email capabilities

---

## Technical Stack

### Frontend
- **Framework:** React + TypeScript (Phase 2+) or vanilla JS (Phase 1 MVP)
- **UI Component Library:** Custom (no heavy dependencies)
- **State Management:** React Context or Redux (Phase 2+)
- **Charts:** Recharts or D3.js (Phase 2+)
- **Calendar integration:** Google Calendar API, Outlook API
- **Responsive design:** Mobile-first; breakpoints at 768px, 1024px

### Backend
- **Framework:** Node.js + Express or Python + FastAPI
- **Database:** PostgreSQL (primary)
- **Cache:** Redis (session, frequently-accessed data)
- **Vector DB:** Pinecone or Weaviate (Phase 2, semantic search)
- **Search:** Elasticsearch or PostgreSQL FTS (Phase 2)
- **Job Queue:** Bull or Celery (async tasks, emails, notifications)
- **File Storage:** AWS S3 or Google Cloud Storage (photos, documents)

### Integrations
- **MLS:** IDX, Matrix, Lone Wolf APIs (real-time listings)
- **Zillow API:** Home value estimates, comps
- **Email:** Gmail, Outlook APIs; SendGrid for transactional
- **Calendar:** Google Calendar, Outlook Calendar
- **Calling:** Twilio or Bandwidth (click-to-call, SMS)
- **eSignature:** DocuSign, HelloSign API (Phase 2)
- **LMS:** Docebo or Moodle for coaching content (Phase 3)
- **Analytics:** Mixpanel or Segment (behavioral tracking)

### Deployment
- **Hosting:** AWS EC2 / RDS, Google Cloud, or DigitalOcean
- **Containerization:** Docker + Docker Compose (local dev), Kubernetes (production scale)
- **CI/CD:** GitHub Actions, GitLab CI, or CircleCI
- **Monitoring:** Datadog, New Relic, or open-source (Prometheus + Grafana)
- **Logging:** ELK Stack or Datadog
- **CDN:** CloudFront or Cloudflare (static assets, API caching)

---

## Data Privacy & Compliance

### GDPR / CCPA
- User data collection & consent tracking
- Right to deletion (agent/client requests)
- Data portability (export to CSV)
- Privacy policy + terms of service templates
- Audit logs for data access

### Real Estate Specific
- MLS compliance (data use restrictions per MLS agreement)
- Fair Housing Act (no discriminatory segmentation)
- FIRPTA rules (if dealing with international sellers)
- State-specific licensing (agent license validation)

### Security
- HTTPS everywhere
- JWT + refresh token auth
- Rate limiting per endpoint
- Input validation & sanitization
- SQL injection prevention (parameterized queries)
- CORS policy
- Secrets management (environment variables, not hardcoded)
- Penetration testing (Phase 2+)

---

## Phase Rollout & Timeline

### Phase 1: Foundation (Weeks 1-4)
**Goal:** MVP with core objection handling, basic pipeline visibility, agent dashboard

**Deliverables:**
- User auth (email/password)
- Deal CRUD (create, read, update, delete)
- Objection library (search, view, use)
- Activity logging (manual)
- Agent dashboard (personal)
- CLI + web API (no UI yet)

**Resources:** 1 engineer, 1 product/design

**Success Criteria:**
- ✓ 5+ test agents using daily
- ✓ 50+ objection handling interactions logged
- ✓ Zero security vulnerabilities (OWASP top 10)
- ✓ Response time p95 < 2s

---

### Phase 2: Enrichment (Weeks 5-10)
**Goal:** Multi-source data, semantic search, advanced pipeline analytics

**Deliverables:**
- MLS integration (auto-sync listings)
- Vector search for transcripts & strategies
- Pipeline kanban board (UI)
- Broker team dashboard
- Email + calendar integration
- Real-time notifications
- Forecast accuracy tracking

**Resources:** 1 engineer, 1 product, 1 designer (UI)

**Success Criteria:**
- ✓ 200+ deals in system
- ✓ Pipeline velocity metrics driving decisions
- ✓ Team adoption 70%+ of agents using daily

---

### Phase 3: Intelligence (Weeks 11-16)
**Goal:** Predictive analytics, team coaching, advanced reporting

**Deliverables:**
- Deal prediction model (likelihood to close)
- Agent performance scoring + tier system
- Peer benchmarking
- Automated coaching recommendations
- Advanced reporting (CSV export, scheduled email)
- Lead scoring + routing automation

**Resources:** 1 ML engineer, 1 engineer, 1 product, 1 data analyst

**Success Criteria:**
- ✓ Prediction accuracy 75%+
- ✓ Objection handling guidance improves agent close rate by 8%+
- ✓ Broker saves 5+ hours/week on deal review

---

### Phase 4: Scale & Polish (Weeks 17+)
**Goal:** Multi-brokerage, white-label, advanced team features

**Deliverables:**
- Multi-brokerage support (SaaS)
- White-label branding + custom domains
- OAuth + SSO integration
- Advanced compliance (audit logs, data residency)
- Mobile app (iOS + Android)
- Marketplace of integrations (Docusign, loan origination, etc.)
- BI dashboards (power user reporting)

**Resources:** 2 engineers, 1 product, 1 designer, 1 data engineer, 1 DevOps

---

## Success Metrics & KPIs

### Product Health
- **DAU (Daily Active Users):** Target 70%+ of agents daily
- **Feature adoption:** 50%+ of team uses pipeline board by month 2
- **Objection handling volume:** 20+ objection queries per agent per week
- **Response satisfaction:** 4.0+ / 5.0 average rating on agent feedback

### Business Impact
- **Deal close rate improvement:** +8% vs. control (baseline without tool)
- **Days to close reduction:** -3 days average (target 30 vs. 33 today)
- **Revenue impact:** Top quartile agents earn +15% more with tool
- **Objection resolution time:** -40% (from 5 days to 3 days avg)

### Retention & Growth
- **Agent churn:** <5% monthly churn (vs. 15% baseline in RE)
- **Team growth:** Broker adds 2-3 agents per year using tool as hiring differentiator
- **Referral rate:** 30%+ of new brokerages come from word-of-mouth
- **NPS score:** 50+ (ideal for B2B SaaS)

### Operational
- **System uptime:** 99.9%
- **Page load time:** p95 < 2s
- **Support ticket resolution:** <24h
- **Data sync latency:** <15 min (MLS updates)

---

## Competitive Positioning

### vs. Traditional CRM (Salesforce, HubSpot, Pipedrive)
- ✅ **Real estate-native:** Purpose-built for RE workflows (not generic CRM)
- ✅ **Objection playbooks:** AI co-pilot for handling objections (not just tracking)
- ✅ **Effort visibility:** Activity scoring + team comparison (unique)
- ✅ **Simpler UX:** Shallow learning curve vs. Salesforce (complex for SMB)
- ❌ More limited integrations (will catch up in Phase 2)

### vs. Real Estate-Specific (Follow Up Boss, Inside Real Estate, Chime)
- ✅ **AI guidance:** Real-time objection handling (vs. just automation)
- ✅ **Data-driven:** Success rates based on actual performance data (vs. templates)
- ✅ **Broker insights:** Team dashboard for broker visibility (most don't have this)
- ✅ **Learning loop:** System improves as you use it (adaptive, not static)
- ❌ Newer product (less brand recognition)

### vs. AI Coaching (ChatGPT + prompting)
- ✅ **Context awareness:** Knows your past deals, your team, your success rates (vs. generic AI)
- ✅ **Data integration:** Pulls from your CRM, MLS, comps (ChatGPT doesn't)
- ✅ **Persistent memory:** Remembers past interactions; learns your style (vs. stateless)
- ✅ **Team adoption:** Easy to use for non-technical users (vs. prompt engineering)

---

## Financial Model (Outline)

### Pricing Strategy
- **SaaS Model:** $99-299 per agent per month (depending on tier)
  - Tier 1 (Solo): $99/mo — single agent, basic objection handling
  - Tier 2 (Team): $199/mo per agent — team pipeline, broker dashboard
  - Tier 3 (Enterprise): $299/mo per agent — advanced analytics, integrations, white-label
- **Free trial:** 14 days (full feature set)
- **Discount:** 15% annual commitment discount
- **Brokerage model:** Charge broker a fixed fee + per-agent fee (future)

### Revenue Projection (Year 1-3)
- **Year 1:** 50 agents across 5 brokerages → $59K ARR
- **Year 2:** 300 agents across 20 brokerages → $432K ARR
- **Year 3:** 1,000 agents across 50+ brokerages → $1.44M ARR

### CAC (Customer Acquisition Cost)
- **Channel:** Word-of-mouth, broker outreach, real estate events
- **Cost per agent:** ~$500 (sales time + marketing)
- **CAC payback period:** 6-8 months (acceptable for SaaS)

---

## Go-to-Market Strategy

### Phase 1: MVP Launch (Word-of-Mouth + Beta)
- **Target:** 50 beta agents (friends, local brokers, known users)
- **Feedback:** Weekly calls; quick iteration on UX
- **Testimonials:** Collect video testimonials, case studies
- **Launch:** Product Hunt, Reddit /r/realestate, Twitter

### Phase 2: Broker-First (Volume)
- **Target:** Broker as champion; offer free/discounted access if they evangelize
- **Case studies:** Document broker wins (deals closed faster, agents happier)
- **Events:** Real estate conferences, MLS events, broker associations
- **Partnerships:** Partner with brokerages that use same MLS platform

### Phase 3: Scaling (Content + Paid)
- **Content:** Blog on objection handling, sales process, team scaling
- **Paid ads:** Google Search, Facebook targeting real estate leads, LinkedIn (broker targeting)
- **Partnerships:** White-label deals with CRM companies, accounting software (for RE)

---

## Risk & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| MLS API changes break sync | Medium | High | Build abstraction layer; 2-week notice monitoring |
| Agents distrust AI suggestions | High | Medium | Emphasize "your data, your rules"; highlight success rates |
| Compliance headache (Fair Housing) | Medium | High | Legal review Phase 2; bias testing Phase 3 |
| Buyer/seller data privacy concerns | Medium | High | Clear privacy policy; GDPR/CCPA compliance Phase 1 |
| Competitive entry (big player) | Medium | High | Build moat via network effects + data; early market share |
| Integration complexity (MLS varies by region) | High | Medium | Start with 1-2 MLS platforms; expand iteratively |
| Agent adoption friction | High | Medium | Free trial, onboarding calls, ROI calculator, peer champions |

---

## Exit Strategy (Optional, Phase 4+)

**Potential acquirers:**
- Real estate software consolidators (Upland, CoreLogic, Move)
- CRM platforms expanding to real estate (Salesforce, HubSpot)
- Proptech VC-backed companies raising Series B+ (Opendoor, Zillow, Redfin)

**Exit valuation drivers:**
- ARR (Annual Recurring Revenue)
- Agent count / penetration in target market
- NPS score and retention rate
- Proprietary data / network effects
- Team experience + talent

---

## Conclusion

DealDesk is a personal, data-driven CRM for real estate agents. It tracks everything from lead capture to post-sale feedback, surfaces evidence-backed strategies for objection handling, and makes agent effort and performance visible to the entire team. It's designed for solo agents and small brokerages — a tool that gets smarter as you use it, and a platform that turns one agent's win into the entire team's playbook.

**The promise: Close faster. Know what works. Manage your entire business in one place.**

---

**Document Version:** 2.0  
**Last Updated:** 2024-01-31  
**Next Review:** 2024-02-28
