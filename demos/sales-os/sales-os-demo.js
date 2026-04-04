const leadData = [
  {
    id: "LEAD-001",
    name: "Ananya Rao",
    phone: "+91 98XXXX1201",
    project: "Prestige Lakeside Habitat 4BHK",
    budget: "INR 2.1Cr-2.4Cr",
    source: "Referral",
    status: "site visit done",
    leadScore: 93,
    conversionProbability: "78%",
    lastContactDate: "2026-04-02",
    assignedTo: "Meera",
    engagementScore: 88,
    riskIndicators: ["Comparing 2 final options", "Wants fast decision support"],
    actionNow: "Call today",
    nextAction: "Call tonight and push for token confirmation after site revisit.",
    actionWhy: "High intent, strong fit, and the buying window is active right now.",
    script: {
      opening: "Hi Ananya, I wanted to quickly help you compare the two options clearly so your decision feels easy, not rushed.",
      pitch: "For your family, this project is strongest on lake-facing inventory, community quality, and fit for your target move timeline.",
      objection: "If price feels high versus the other option, let us compare location value, builder delivery confidence, and resale strength rather than sticker price alone.",
      closing: "If this still feels like the right fit, let us lock the next step today so you do not lose momentum or inventory choice.",
    },
    scoreReason: "Referral lead, budget matches project, site visit completed, active response pattern in the last 3 days.",
    notes: "Husband wants one more discussion on payment split; wife is ready to move faster.",
  },
  {
    id: "LEAD-002",
    name: "Rohit Bansal",
    phone: "+91 98XXXX1202",
    project: "Adarsh Palm Retreat Villa",
    budget: "INR 4.5Cr-5Cr",
    source: "Channel Partner",
    status: "negotiation",
    leadScore: 91,
    conversionProbability: "75%",
    lastContactDate: "2026-04-03",
    assignedTo: "Aarav",
    engagementScore: 84,
    riskIndicators: ["Possession delay concern", "Needs stronger timeline confidence"],
    actionNow: "Call today",
    nextAction: "Send milestone update and follow up with possession-risk clarification.",
    actionWhy: "The buyer is engaged but needs confidence on construction timing before moving ahead.",
    script: {
      opening: "Hi Rohit, I wanted to address the possession concern directly so you have clarity before making the booking call.",
      pitch: "This villa remains one of the strongest options in your shortlist because of layout quality, gated-community value, and the long-term upside of the location.",
      objection: "Where buyers hesitate on timeline, we should look at the latest milestone update, builder track record, and what risk is normal versus what is actually concerning.",
      closing: "If the timeline now feels manageable, the smartest move is to keep this one alive while we structure the commercial next step.",
    },
    scoreReason: "High budget fit, direct negotiation stage, recent interaction today, strong site engagement.",
    notes: "Asks highly detailed questions and expects data-backed answers.",
  },
  {
    id: "LEAD-003",
    name: "Sonal Kapoor",
    phone: "+91 98XXXX1203",
    project: "Birla Alokya Villament",
    budget: "INR 1.9Cr-2.3Cr",
    source: "NRI Referral",
    status: "initial discussions",
    leadScore: 89,
    conversionProbability: "69%",
    lastContactDate: "2026-04-01",
    assignedTo: "Ishita",
    engagementScore: 81,
    riskIndicators: ["Remote buyer", "Needs trust on paperwork and updates"],
    actionNow: "Call today",
    nextAction: "Send a remote-buyer process note and schedule a guided video walkthrough.",
    actionWhy: "NRI buyers convert well when trust and process are made explicit early.",
    script: {
      opening: "Hi Sonal, I know remote buying only works when the process feels very clear, so I wanted to simplify that for you today.",
      pitch: "For an NRI buyer, this project stands out because the product is strong and the buying journey can be managed in a structured, low-friction way.",
      objection: "If your hesitation is around distance and control, we can solve that through clear site updates, documentation support, and milestone-based check-ins.",
      closing: "If that helps, let us lock the next walkthrough and keep your evaluation moving while inventory is still available.",
    },
    scoreReason: "High-quality referral, remote buyer urgency, good budget fit, but still early in the funnel.",
    notes: "Based in Dubai; prefers communication in evening IST.",
  },
  {
    id: "LEAD-004",
    name: "Kiran Shetty",
    phone: "+91 98XXXX1204",
    project: "Sobha Neopolis 3BHK",
    budget: "INR 1.6Cr-1.9Cr",
    source: "Website",
    status: "quote shared",
    leadScore: 86,
    conversionProbability: "63%",
    lastContactDate: "2026-04-02",
    assignedTo: "Farah",
    engagementScore: 74,
    riskIndicators: ["Price-sensitive", "Comparing payment plans"],
    actionNow: "Follow up today",
    nextAction: "Offer a cleaner payment-plan comparison and close the open commercial question.",
    actionWhy: "The lead is warm, but commercial clarity is now the key blocker.",
    script: {
      opening: "Hi Kiran, I wanted to simplify the price and payment-plan comparison rather than leave you to decode multiple offers yourself.",
      pitch: "In your shortlist, this one balances brand, community quality, and livability especially well for your budget range.",
      objection: "If the issue is payment pressure, let us compare the actual cash-flow comfort of each option instead of just the headline property price.",
      closing: "If the numbers feel workable after that, we should move this to a shortlist decision quickly.",
    },
    scoreReason: "Good budget fit, quote is already out, but price sensitivity lowers certainty.",
    notes: "Father is involved in decision and wants numbers clearly laid out.",
  },
  {
    id: "LEAD-005",
    name: "Megha Iyer",
    phone: "+91 98XXXX1205",
    project: "Godrej Park Retreat 4BHK",
    budget: "INR 2.2Cr-2.8Cr",
    source: "Referral",
    status: "shortlisted",
    leadScore: 84,
    conversionProbability: "61%",
    lastContactDate: "2026-03-31",
    assignedTo: "Rohan",
    engagementScore: 72,
    riskIndicators: ["Needs husband alignment", "Slight inactivity after strong interest"],
    actionNow: "Call today",
    nextAction: "Re-engage with one concise comparison summary and push for final shortlist call.",
    actionWhy: "This lead was active recently but risks cooling if no one drives the next step.",
    script: {
      opening: "Hi Megha, I wanted to make the shortlist decision easier by pulling the comparison into one simple view.",
      pitch: "This project remains strong because it fits both your budget and the family-upgrade profile you described earlier.",
      objection: "If the hesitation is whether it is truly the best option, let us compare not just the unit but the full project proposition and long-term livability.",
      closing: "Would it help if we did one focused decision call instead of continuing with scattered messages?",
    },
    scoreReason: "Referral lead with good fit, but recency dropped slightly so the lead could cool.",
    notes: "Needs a sharper summary, not more brochures.",
  },
  {
    id: "LEAD-006",
    name: "Deepak Nair",
    phone: "+91 98XXXX1206",
    project: "Prestige City 3BHK",
    budget: "INR 1.25Cr-1.45Cr",
    source: "Google Ads",
    status: "new lead",
    leadScore: 78,
    conversionProbability: "48%",
    lastContactDate: "2026-04-03",
    assignedTo: "Aarav",
    engagementScore: 69,
    riskIndicators: ["Fresh inbound", "No site visit yet"],
    actionNow: "Call within SLA",
    nextAction: "Call within 2 hours and qualify budget, possession timeline, and urgency.",
    actionWhy: "Fresh leads convert best when first contact is fast and structured.",
    script: {
      opening: "Hi Deepak, thanks for your enquiry. I wanted to quickly understand what matters most in your home search before I suggest options.",
      pitch: "If we map your budget, timeline, and family needs cleanly, I can help narrow options much faster.",
      objection: "If you are early in the search, that is fine. We can still save time by ruling out poor-fit projects immediately.",
      closing: "Can I ask you 4 quick questions so I can guide you properly?",
    },
    scoreReason: "Strong recency, unknown fit, no meaningful engagement yet.",
    notes: "Needs first structured discovery call.",
  },
  {
    id: "LEAD-007",
    name: "Arjun Vora",
    phone: "+91 98XXXX1207",
    project: "Brigade Cornerstone Utopia 3BHK",
    budget: "INR 1.35Cr-1.6Cr",
    source: "Broker Referral",
    status: "site visit scheduled",
    leadScore: 82,
    conversionProbability: "57%",
    lastContactDate: "2026-04-02",
    assignedTo: "Meera",
    engagementScore: 76,
    riskIndicators: ["Needs decision support after visit", "Compares heavily online"],
    actionNow: "Prepare visit",
    nextAction: "Send a pre-visit summary and 3 points to notice during the walkthrough.",
    actionWhy: "A better site visit usually lifts conversion and trust.",
    script: {
      opening: "Hi Arjun, before the visit I wanted to make sure you know exactly what to evaluate so the walkthrough is genuinely useful.",
      pitch: "This helps you compare projects on factors that really matter later, not just first impressions.",
      objection: "If every project is beginning to look similar online, the site visit is where we can separate what only markets well from what truly fits.",
      closing: "I will send a short checklist so tomorrow's visit gives you real clarity.",
    },
    scoreReason: "Visit scheduled, fair budget fit, healthy response pattern.",
    notes: "Wants sharp, non-salesy communication.",
  },
  {
    id: "LEAD-008",
    name: "Priya Menon",
    phone: "+91 98XXXX1208",
    project: "Assetz Marq 3.5BHK",
    budget: "INR 1.8Cr-2Cr",
    source: "Instagram",
    status: "contacted",
    leadScore: 73,
    conversionProbability: "42%",
    lastContactDate: "2026-03-30",
    assignedTo: "Ishita",
    engagementScore: 58,
    riskIndicators: ["Slow responses", "Still in browsing mode"],
    actionNow: "Nurture",
    nextAction: "Send a concise comparison message, not a heavy follow-up call.",
    actionWhy: "The lead is still exploring, so over-pushing may reduce response.",
    script: {
      opening: "Hi Priya, sharing one quick note that might help you compare this project with the others you're reviewing.",
      pitch: "What stands out here is the balance of product quality and the surrounding micro-market trajectory.",
      objection: "If you are still early, you do not need to decide immediately. The goal is just to build a sharper shortlist.",
      closing: "If helpful, I can send a 2-minute summary instead of taking more of your time right now.",
    },
    scoreReason: "Moderate fit, weaker recency, no strong buying signal yet.",
    notes: "Prefers text to calls in the first stage.",
  },
  {
    id: "LEAD-009",
    name: "Vishal Khanna",
    phone: "+91 98XXXX1209",
    project: "Birla Trimaya 4BHK",
    budget: "INR 2.4Cr-2.8Cr",
    source: "Existing Database",
    status: "re-engagement",
    leadScore: 71,
    conversionProbability: "39%",
    lastContactDate: "2026-03-26",
    assignedTo: "Farah",
    engagementScore: 54,
    riskIndicators: ["Went cold for 8 days", "Budget shifted upward recently"],
    actionNow: "Re-engage",
    nextAction: "Call with a fresh angle tied to upgraded inventory options.",
    actionWhy: "The lead may have reopened if newer inventory better fits the revised budget.",
    script: {
      opening: "Hi Vishal, reaching out because there may now be inventory that fits the budget shift you mentioned last week.",
      pitch: "That changes the conversation from compromise to better-fit options.",
      objection: "If you had paused because earlier units did not feel worth it, it may be worth revisiting now with the updated shortlist.",
      closing: "If you have 10 minutes today, I can help you quickly validate whether it is worth reopening this project.",
    },
    scoreReason: "Some fit improvement, but cold recency keeps score down.",
    notes: "Good reopening candidate, not a sure hot lead.",
  },
  {
    id: "LEAD-010",
    name: "Ritika Shah",
    phone: "+91 98XXXX1210",
    project: "Total Environment In That Quiet Earth",
    budget: "INR 3.2Cr-4Cr",
    source: "Referral",
    status: "negotiation",
    leadScore: 88,
    conversionProbability: "67%",
    lastContactDate: "2026-04-02",
    assignedTo: "Rohan",
    engagementScore: 83,
    riskIndicators: ["Decision-maker spouse not fully aligned"],
    actionNow: "Call today",
    nextAction: "Run a joint decision call and address the one unresolved concern directly.",
    actionWhy: "The deal is mature, but alignment is incomplete.",
    script: {
      opening: "Hi Ritika, I think we are now at the stage where one clean decision conversation can remove the last bit of friction.",
      pitch: "This project still looks strong because the product quality and long-term residential feel align with exactly what you described wanting.",
      objection: "If the hesitation is family alignment rather than fit, we should address that openly instead of letting the decision drift.",
      closing: "Can we lock one focused call with both decision-makers and move this to closure?",
    },
    scoreReason: "High-quality referral, strong fit, advanced stage, active engagement.",
    notes: "Very close if joint alignment happens.",
  },
  {
    id: "LEAD-011",
    name: "Naveen Hegde",
    phone: "+91 98XXXX1211",
    project: "Prestige Elm Park 4BHK",
    budget: "INR 2.6Cr-3Cr",
    source: "Website",
    status: "contacted",
    leadScore: 67,
    conversionProbability: "34%",
    lastContactDate: "2026-03-28",
    assignedTo: "Aarav",
    engagementScore: 47,
    riskIndicators: ["Response delay", "Still comparing many projects"],
    actionNow: "Nurture",
    nextAction: "Send a localized comparison note instead of scheduling another call immediately.",
    actionWhy: "The lead is active but not concentrated enough for aggressive follow-up.",
    script: {
      opening: "Hi Naveen, I know you are still evaluating multiple options, so I wanted to keep this simple and useful.",
      pitch: "Rather than adding another sales call, I can send a quick comparison focused on why buyers shortlist this project in this micro-market.",
      objection: "If everything is blending together, narrowing by location quality and project maturity is usually the fastest filter.",
      closing: "I will send a brief note, and if it sharpens the shortlist we can speak after that.",
    },
    scoreReason: "Acceptable fit but weak engagement and older contact gap.",
    notes: "Not cold, but low urgency.",
  },
  {
    id: "LEAD-012",
    name: "Madhuri Kulkarni",
    phone: "+91 98XXXX1212",
    project: "Godrej Woodscapes 4BHK",
    budget: "INR 2.3Cr-2.7Cr",
    source: "Past Client Referral",
    status: "shortlisted",
    leadScore: 85,
    conversionProbability: "60%",
    lastContactDate: "2026-04-03",
    assignedTo: "Meera",
    engagementScore: 79,
    riskIndicators: ["Needs more confidence on project quality"],
    actionNow: "Call today",
    nextAction: "Use social proof and current progress details to remove the quality hesitation.",
    actionWhy: "High-trust source and active engagement make this a strong near-term opportunity.",
    script: {
      opening: "Hi Madhuri, since this came through a trusted referral, I wanted to make sure your final doubts are answered very clearly.",
      pitch: "This project remains strong because it combines brand strength with a product profile that fits your family-upgrade need well.",
      objection: "If the hesitation is quality confidence, let us ground that in facts: builder reputation, current status, and what recent buyers have validated.",
      closing: "If that gives you enough comfort, we should move this toward a final decision while inventory is still favorable.",
    },
    scoreReason: "Referral strength plus recency lifts the score materially.",
    notes: "This can move quickly with one good call.",
  },
  {
    id: "LEAD-013",
    name: "Sandeep Jain",
    phone: "+91 98XXXX1213",
    project: "Assetz 63 Degree East 2BHK",
    budget: "INR 95L-1.15Cr",
    source: "Broker Referral",
    status: "new lead",
    leadScore: 74,
    conversionProbability: "43%",
    lastContactDate: "2026-04-03",
    assignedTo: "Farah",
    engagementScore: 62,
    riskIndicators: ["Budget-sensitive", "Needs quick qualification"],
    actionNow: "Call within SLA",
    nextAction: "Qualify budget flexibility and home-vs-investment intent on first call.",
    actionWhy: "Good referral quality, but budget pressure could quickly disqualify.",
    script: {
      opening: "Hi Sandeep, wanted to quickly understand whether this search is more for end-use or investment so I can guide you properly.",
      pitch: "That usually changes which projects make sense and where your budget stretches best.",
      objection: "If you are concerned about stretching too much, we can narrow the shortlist quickly instead of wasting time on poor-fit inventory.",
      closing: "Let me ask 3 short questions so I can point you to the strongest fit.",
    },
    scoreReason: "Fresh lead and referral support, but budget may be tight.",
    notes: "Needs qualification before ranking higher.",
  },
  {
    id: "LEAD-014",
    name: "Akash Bedi",
    phone: "+91 98XXXX1214",
    project: "Sobha Dream Gardens 3BHK",
    budget: "INR 1.4Cr-1.7Cr",
    source: "Walk-in",
    status: "site visit scheduled",
    leadScore: 80,
    conversionProbability: "52%",
    lastContactDate: "2026-04-01",
    assignedTo: "Rohan",
    engagementScore: 70,
    riskIndicators: ["Wants fast answers", "Comparing commute trade-offs"],
    actionNow: "Prepare visit",
    nextAction: "Send commute- and lifestyle-focused site-visit prep note.",
    actionWhy: "Better pre-visit framing increases the chance the visit converts into a real shortlist.",
    script: {
      opening: "Hi Akash, before tomorrow's visit I wanted to frame what to look at so the decision becomes easier.",
      pitch: "For you, the real test is not just unit size, but how the community and commute actually fit your week-to-week life.",
      objection: "If commute is the hesitation, we should evaluate it honestly now rather than force a project that will become annoying later.",
      closing: "I will send a short checklist so tomorrow gives you sharper clarity.",
    },
    scoreReason: "Visit booked and decent fit, but not yet deep in the funnel.",
    notes: "Quick mover if the visit lands well.",
  },
  {
    id: "LEAD-015",
    name: "Neha Deshpande",
    phone: "+91 98XXXX1215",
    project: "Brigade Calista 3BHK",
    budget: "INR 1.5Cr-1.9Cr",
    source: "Referral",
    status: "quote shared",
    leadScore: 83,
    conversionProbability: "58%",
    lastContactDate: "2026-04-02",
    assignedTo: "Ishita",
    engagementScore: 77,
    riskIndicators: ["Comparing floor plans carefully"],
    actionNow: "Follow up today",
    nextAction: "Use a decision note focused on layout quality and price-to-value.",
    actionWhy: "The lead is serious, but the decision is being delayed by analysis, not disinterest.",
    script: {
      opening: "Hi Neha, I think the fastest way to make this decision easier is to compare the floor-plan strengths directly instead of revisiting everything again.",
      pitch: "If the home needs to work for your family over several years, layout quality matters as much as the commercials.",
      objection: "Where two projects feel close, practical daily livability is often the real differentiator.",
      closing: "If helpful, I can send a one-page comparison and then talk through it briefly.",
    },
    scoreReason: "Referral and quote stage both help, but the buyer is still analytical.",
    notes: "Needs simplification, not pressure.",
  },
  {
    id: "LEAD-016",
    name: "Harish Bhat",
    phone: "+91 98XXXX1216",
    project: "Birla Trimaya 3BHK",
    budget: "INR 1.7Cr-2Cr",
    source: "Google Ads",
    status: "no response risk",
    leadScore: 58,
    conversionProbability: "24%",
    lastContactDate: "2026-03-24",
    assignedTo: "Aarav",
    engagementScore: 31,
    riskIndicators: ["No response for 10 days", "Weak source quality"],
    actionNow: "Last attempt",
    nextAction: "Send a final short re-engagement message before downgrading priority.",
    actionWhy: "Enough time has passed that this should not keep stealing attention from stronger leads.",
    script: {
      opening: "Hi Harish, sending one quick note in case this search is still active.",
      pitch: "If timing has changed, no problem. If you are still evaluating, I can give you a cleaner shortlist in one message.",
      objection: "I know you may still be exploring, so I will keep this brief rather than keep chasing.",
      closing: "If useful, reply with your current budget and timeline and I will simplify the options.",
    },
    scoreReason: "Low recency and weak engagement materially reduce conversion probability.",
    notes: "Candidate for downgrading if no reply.",
  },
  {
    id: "LEAD-017",
    name: "Gautam Suri",
    phone: "+91 98XXXX1217",
    project: "Prestige Waterford 4BHK",
    budget: "INR 2.8Cr-3.2Cr",
    source: "Referral",
    status: "manager attention needed",
    leadScore: 87,
    conversionProbability: "64%",
    lastContactDate: "2026-04-01",
    assignedTo: "Rohan",
    engagementScore: 82,
    riskIndicators: ["Needs senior reassurance", "High-ticket buyer"],
    actionNow: "Escalate",
    nextAction: "Manager should join the next call to reinforce trust and speed closure.",
    actionWhy: "This is a high-value buyer whose concern is confidence, not interest.",
    script: {
      opening: "Hi Gautam, I thought it would help if we handle the remaining questions with a more senior lens so the decision feels simpler.",
      pitch: "At this level, the goal is not just finding a good property, but choosing one you can feel fully confident defending as the right decision.",
      objection: "If your hesitation is trust rather than fit, bringing more senior clarity now is the right move.",
      closing: "Let us do one short call with the manager included and close out the remaining doubts.",
    },
    scoreReason: "High ticket, strong referral, but decision requires senior trust support.",
    notes: "Do not let this stall at rep level.",
  },
  {
    id: "LEAD-018",
    name: "Lakshmi Narayan",
    phone: "+91 98XXXX1218",
    project: "Prestige City Villa",
    budget: "INR 4.1Cr-4.8Cr",
    source: "Past Database",
    status: "re-engagement",
    leadScore: 76,
    conversionProbability: "46%",
    lastContactDate: "2026-03-29",
    assignedTo: "Meera",
    engagementScore: 63,
    riskIndicators: ["Old lead reopened", "Needs updated builder confidence"],
    actionNow: "Re-engage",
    nextAction: "Re-open with updated project progress and villa inventory context.",
    actionWhy: "The lead is warm enough to revisit if there is genuinely new information.",
    script: {
      opening: "Hi Lakshmi, reaching out because this may now be a more relevant option than when we last spoke.",
      pitch: "Project movement and available inventory have changed enough that it is worth a fresh look.",
      objection: "If you had paused because the timing or confidence was not right earlier, the context may now be different.",
      closing: "If you want, I can give you a short updated view before you decide whether to revisit seriously.",
    },
    scoreReason: "Re-opened lead with decent fit, but still needs validation.",
    notes: "Could move up quickly if responsiveness improves.",
  },
  {
    id: "LEAD-019",
    name: "Mrunal Patil",
    phone: "+91 98XXXX1219",
    project: "Total Environment Down by the Water 3BHK",
    budget: "INR 2.9Cr-3.4Cr",
    source: "Referral",
    status: "shortlisted",
    leadScore: 86,
    conversionProbability: "62%",
    lastContactDate: "2026-04-02",
    assignedTo: "Farah",
    engagementScore: 80,
    riskIndicators: ["Needs one stronger reason to choose now"],
    actionNow: "Call today",
    nextAction: "Use urgency carefully around shortlist quality and timing, not pressure tactics.",
    actionWhy: "High-fit referral lead with healthy engagement and near-decision behavior.",
    script: {
      opening: "Hi Mrunal, I think you are now at the stage where one clear reason-to-choose can move this from shortlist to decision.",
      pitch: "This remains a standout option because the project character, product quality, and buyer profile fit what you have consistently described wanting.",
      objection: "If your hesitation is simply choosing between two good options, we should compare what you will still feel good about 3 years from now, not just what feels easiest today.",
      closing: "If this is one of your top two, let us use one short call to make the decision cleaner.",
    },
    scoreReason: "Referral, shortlist stage, strong engagement, good budget fit.",
    notes: "High-quality lead that should not drift.",
  },
  {
    id: "LEAD-020",
    name: "Preeti Anand",
    phone: "+91 98XXXX1220",
    project: "Godrej Woodscapes 3BHK",
    budget: "INR 1.85Cr-2.1Cr",
    source: "Referral",
    status: "missed follow-up",
    leadScore: 79,
    conversionProbability: "49%",
    lastContactDate: "2026-03-27",
    assignedTo: "Ishita",
    engagementScore: 66,
    riskIndicators: ["Good fit but follow-up gap", "Manager should intervene if not contacted today"],
    actionNow: "Recover today",
    nextAction: "Repair the follow-up gap with a direct, useful callback instead of a generic apology message.",
    actionWhy: "This lead is still salvageable, but delay is now the main risk.",
    script: {
      opening: "Hi Preeti, I wanted to reconnect properly because I do not want the follow-up gap to create more confusion than clarity.",
      pitch: "You were evaluating a genuinely strong-fit option, so it makes sense to bring the conversation back to the useful next step rather than restart from zero.",
      objection: "If the delay made the process feel less serious, let us correct that now with a clearer and more decisive update.",
      closing: "If you still have interest, I would like to get you a sharper next-step recommendation today.",
    },
    scoreReason: "Fit is decent, but missed follow-up reduces confidence and urgency.",
    notes: "Important recovery case for manager dashboard.",
  },
];

const state = {
  status: "all",
  owner: "all",
};

const topLeadsEl = document.getElementById("top-leads");
const managerStatsEl = document.getElementById("manager-stats");
const repRankingEl = document.getElementById("rep-ranking");
const filterBarEl = document.getElementById("filter-bar");
const filterSummaryEl = document.getElementById("filter-summary");
const leadTableBodyEl = document.getElementById("lead-table-body");
const detailOverlayEl = document.getElementById("detail-overlay");
const detailPanelEl = document.getElementById("detail-panel");
const detailCloseEl = document.getElementById("detail-close");
const detailEyebrowEl = document.getElementById("detail-eyebrow");
const detailTitleEl = document.getElementById("detail-title");
const detailSubtitleEl = document.getElementById("detail-subtitle");
const detailSummaryGridEl = document.getElementById("detail-summary-grid");
const detailInsightsEl = document.getElementById("detail-insights");
const detailActionEl = document.getElementById("detail-action");
const detailScriptEl = document.getElementById("detail-script");

const statuses = ["all", ...new Set(leadData.map((lead) => lead.status))];

initialize();

function initialize() {
  renderTopLeads();
  renderManagerStats();
  renderRepRanking();
  renderFilters();
  renderLeadTable();
  detailCloseEl.addEventListener("click", closeDetailPanel);
  detailOverlayEl.addEventListener("click", closeDetailPanel);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDetailPanel();
    }
  });
}

function renderTopLeads() {
  const topLeads = [...leadData]
    .sort((a, b) => b.leadScore - a.leadScore)
    .slice(0, 5);

  topLeadsEl.innerHTML = topLeads.map((lead) => `
    <article class="top-lead-item" data-lead-id="${lead.id}">
      <div class="lead-name-row">
        <strong>${escapeHtml(lead.name)}</strong>
        <span class="score-badge">${lead.leadScore}</span>
      </div>
      <div class="top-lead-meta">${escapeHtml(lead.project)}</div>
      <div class="top-lead-meta">${escapeHtml(lead.actionNow)} • ${escapeHtml(lead.assignedTo)}</div>
    </article>
  `).join("");

  topLeadsEl.querySelectorAll("[data-lead-id]").forEach((item) => {
    item.addEventListener("click", () => openLeadDetail(item.dataset.leadId));
  });
}

function renderManagerStats() {
  const totalLeads = leadData.length;
  const hotLeads = leadData.filter((lead) => lead.leadScore >= 85).length;
  const missedFollowUps = leadData.filter((lead) => ["missed follow-up", "no response risk"].includes(lead.status)).length;
  const avgEngagement = Math.round(leadData.reduce((sum, lead) => sum + lead.engagementScore, 0) / totalLeads);

  const metrics = [
    { label: "Total leads", value: totalLeads, sub: "Current sample stack" },
    { label: "High priority", value: hotLeads, sub: "Lead score 85+" },
    { label: "Missed follow-ups", value: missedFollowUps, sub: "Needs manager recovery" },
    { label: "Avg engagement", value: `${avgEngagement}%`, sub: "Across active leads" },
  ];

  managerStatsEl.innerHTML = metrics.map((metric) => `
    <article class="metric-card">
      <div class="metric-head">
        <strong>${metric.label}</strong>
      </div>
      <div class="metric-value">${metric.value}</div>
      <div class="metric-sub">${metric.sub}</div>
    </article>
  `).join("");
}

function renderRepRanking() {
  const repStats = buildRepStats();

  repRankingEl.innerHTML = repStats.map((rep, index) => `
    <article class="rep-card ${state.owner === rep.name ? "active" : ""}" data-owner="${rep.name}">
      <div class="rep-head">
        <strong>${escapeHtml(rep.name)}</strong>
        <span class="rank-badge">#${index + 1}</span>
      </div>
      <div class="rep-sub">${rep.assigned} leads • ${rep.effectiveness}% effectiveness</div>
      <div class="rep-metrics">
        <div class="rep-metric">
          <div class="rep-metric-label">Hot leads</div>
          <div class="rep-metric-value">${rep.hotLeads}</div>
        </div>
        <div class="rep-metric">
          <div class="rep-metric-label">Avg score</div>
          <div class="rep-metric-value">${rep.avgScore}</div>
        </div>
        <div class="rep-metric">
          <div class="rep-metric-label">Engagement</div>
          <div class="rep-metric-value">${rep.avgEngagement}%</div>
        </div>
      </div>
    </article>
  `).join("");

  repRankingEl.querySelectorAll("[data-owner]").forEach((card) => {
    card.addEventListener("click", () => {
      const owner = card.dataset.owner;
      state.owner = state.owner === owner ? "all" : owner;
      renderRepRanking();
      renderLeadTable();
      renderFilters();
    });
  });
}

function renderFilters() {
  const chips = statuses.map((status) => {
    const active = state.status === status;
    const label = status === "all" ? "All leads" : toTitleCase(status);
    return `<button class="filter-chip ${active ? "active" : ""}" type="button" data-status="${status}">${escapeHtml(label)}</button>`;
  });

  if (state.owner !== "all") {
    chips.push(`<button class="filter-chip active" type="button" data-clear-owner="true">Rep: ${escapeHtml(state.owner)}</button>`);
  }

  filterBarEl.innerHTML = chips.join("");

  filterBarEl.querySelectorAll("[data-status]").forEach((button) => {
    button.addEventListener("click", () => {
      state.status = button.dataset.status;
      renderFilters();
      renderLeadTable();
    });
  });

  const clearOwnerBtn = filterBarEl.querySelector("[data-clear-owner]");
  if (clearOwnerBtn) {
    clearOwnerBtn.addEventListener("click", () => {
      state.owner = "all";
      renderFilters();
      renderRepRanking();
      renderLeadTable();
    });
  }
}

function renderLeadTable() {
  const leads = getFilteredLeads();
  filterSummaryEl.textContent = `${leads.length} lead${leads.length === 1 ? "" : "s"} shown`;

  leadTableBodyEl.innerHTML = leads.map((lead) => `
    <tr class="lead-row" data-lead-id="${lead.id}">
      <td>
        <div class="lead-title">${escapeHtml(lead.name)}</div>
        <div class="lead-subtitle">${escapeHtml(lead.phone)} • ${escapeHtml(lead.source)}</div>
      </td>
      <td>
        <div class="lead-title">${escapeHtml(lead.project)}</div>
        <div class="lead-subtitle">${escapeHtml(lead.budget)}</div>
      </td>
      <td>
        <span class="status-badge">${escapeHtml(toTitleCase(lead.status))}</span>
        <div class="tiny-note">Last contact ${escapeHtml(lead.lastContactDate)}</div>
      </td>
      <td>
        <span class="score-badge">${lead.leadScore}</span>
        <div class="tiny-note">${escapeHtml(lead.conversionProbability)} likely</div>
      </td>
      <td>
        <div class="lead-title">${lead.engagementScore}%</div>
        <div class="tiny-note">${escapeHtml(lead.scoreReason)}</div>
      </td>
      <td>
        <div class="lead-title">${escapeHtml(lead.assignedTo)}</div>
      </td>
      <td>
        <span class="action-badge">${escapeHtml(lead.actionNow)}</span>
        <div class="tiny-note">${escapeHtml(lead.nextAction)}</div>
      </td>
    </tr>
  `).join("");

  leadTableBodyEl.querySelectorAll("[data-lead-id]").forEach((row) => {
    row.addEventListener("click", () => openLeadDetail(row.dataset.leadId));
  });
}

function getFilteredLeads() {
  return [...leadData]
    .filter((lead) => state.status === "all" || lead.status === state.status)
    .filter((lead) => state.owner === "all" || lead.assignedTo === state.owner)
    .sort((a, b) => b.leadScore - a.leadScore);
}

function buildRepStats() {
  const grouped = new Map();

  leadData.forEach((lead) => {
    if (!grouped.has(lead.assignedTo)) {
      grouped.set(lead.assignedTo, []);
    }
    grouped.get(lead.assignedTo).push(lead);
  });

  return [...grouped.entries()].map(([name, leads]) => {
    const avgScore = Math.round(leads.reduce((sum, lead) => sum + lead.leadScore, 0) / leads.length);
    const avgEngagement = Math.round(leads.reduce((sum, lead) => sum + lead.engagementScore, 0) / leads.length);
    const hotLeads = leads.filter((lead) => lead.leadScore >= 85).length;
    const effectiveness = Math.round((avgScore * 0.45) + (avgEngagement * 0.25) + ((hotLeads / leads.length) * 30));

    return {
      name,
      assigned: leads.length,
      avgScore,
      avgEngagement,
      hotLeads,
      effectiveness,
    };
  }).sort((a, b) => b.effectiveness - a.effectiveness);
}

function openLeadDetail(leadId) {
  const lead = leadData.find((item) => item.id === leadId);
  if (!lead) {
    return;
  }

  detailEyebrowEl.textContent = `${lead.id} • ${toTitleCase(lead.status)}`;
  detailTitleEl.textContent = lead.name;
  detailSubtitleEl.textContent = `${lead.project} • ${lead.budget} • Assigned to ${lead.assignedTo}`;

  const summaryItems = [
    ["Lead score", `${lead.leadScore}/100`],
    ["Conversion probability", lead.conversionProbability],
    ["Engagement", `${lead.engagementScore}%`],
    ["Last contact", lead.lastContactDate],
    ["Lead source", lead.source],
    ["Action now", lead.actionNow],
  ];

  detailSummaryGridEl.innerHTML = summaryItems.map(([label, value]) => `
    <div class="summary-card">
      <div class="summary-label">${escapeHtml(label)}</div>
      <div class="summary-value">${escapeHtml(value)}</div>
    </div>
  `).join("");

  detailInsightsEl.innerHTML = `
    <p><strong>Why this lead ranks here:</strong> ${escapeHtml(lead.scoreReason)}</p>
    <p><strong>Notes from the team:</strong> ${escapeHtml(lead.notes)}</p>
    <ul>
      ${lead.riskIndicators.map((risk) => `<li>${escapeHtml(risk)}</li>`).join("")}
    </ul>
  `;

  detailActionEl.innerHTML = `
    <p><strong>Next action:</strong> ${escapeHtml(lead.nextAction)}</p>
    <p><strong>Why now:</strong> ${escapeHtml(lead.actionWhy)}</p>
  `;

  detailScriptEl.innerHTML = `
    <ul>
      <li><strong>Opening line:</strong> ${escapeHtml(lead.script.opening)}</li>
      <li><strong>Pitch angle:</strong> ${escapeHtml(lead.script.pitch)}</li>
      <li><strong>Objection handling:</strong> ${escapeHtml(lead.script.objection)}</li>
      <li><strong>Closing line:</strong> ${escapeHtml(lead.script.closing)}</li>
    </ul>
  `;

  detailOverlayEl.classList.remove("hidden");
  detailPanelEl.classList.remove("hidden");
  detailPanelEl.setAttribute("aria-hidden", "false");
}

function closeDetailPanel() {
  detailOverlayEl.classList.add("hidden");
  detailPanelEl.classList.add("hidden");
  detailPanelEl.setAttribute("aria-hidden", "true");
}

function toTitleCase(value) {
  return value.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
