const demoData = {
  accounts: [
    {
      id: "ACC-001",
      name: "Project Cedar - Prestige Lakeside Habitat 4BHK",
      aliases: ["project cedar", "cedar", "prestige lakeside"],
      owner: "Aarav",
      stage: "pre-closing",
      opportunityId: "OPP-101",
      useCase: "premium apartment purchase",
      competitor: "another channel partner",
      risk: "price negotiation and payment-plan comparison",
      summary: "Whitefield 4BHK family is close to booking, but they are comparing the firm's quoted value against another seller offering a slightly lower price.",
      nextStep: "Walk them through pricing logic, project strengths, and payment-plan options",
    },
    {
      id: "ACC-002",
      name: "Project Elan - Adarsh Palm Retreat Villa",
      aliases: ["project elan", "elan", "adarsh palm retreat"],
      owner: "Meera",
      stage: "under construction",
      opportunityId: "OPP-102",
      useCase: "villa purchase in an under-construction community",
      competitor: "none",
      risk: "construction timeline pressure and handover anxiety",
      summary: "Sarjapur villa booking is done and the buyer is now closely watching construction progress, builder updates, and expected handover timing.",
      nextStep: "Send project-progress update and reassure on delivery milestones",
    },
    {
      id: "ACC-003",
      name: "Project Mira - Birla Alokya Villament",
      aliases: ["project mira", "mira", "birla alokya"],
      owner: "Ishita",
      stage: "initial discussions",
      opportunityId: "OPP-103",
      useCase: "villament purchase with remote coordination support",
      competitor: "another brokerage / direct builder sales team",
      risk: "trust, remote coordination, and builder credibility concern",
      summary: "NRI buyer has started discussions for a villament purchase and wants confidence that the firm can manage site updates, paperwork, and booking support with minimal supervision.",
      nextStep: "Share remote buying process and sample update format",
    },
  ],
  opportunities: [
    {
      id: "OPP-101",
      accountId: "ACC-001",
      name: "Prestige Lakeside Habitat 4BHK purchase",
      amount: "INR 2.4Cr",
      decisionCriteria: "price confidence, community quality, payment-plan comfort",
      winProbability: "72%",
    },
    {
      id: "OPP-102",
      accountId: "ACC-002",
      name: "Adarsh Palm Retreat villa purchase",
      amount: "INR 4.8Cr",
      decisionCriteria: "handover confidence, builder credibility, update discipline",
      winProbability: "100%",
    },
    {
      id: "OPP-103",
      accountId: "ACC-003",
      name: "Birla Alokya villament purchase",
      amount: "INR 2.1Cr",
      decisionCriteria: "remote buying trust, documentation support, communication discipline",
      winProbability: "38%",
    },
  ],
  calls: [
    {
      id: "CALL-001",
      accountId: "ACC-001",
      date: "2026-03-18",
      summary: "Project Cedar buyers liked the apartment and community, but asked why the quoted price sits above two other nearby options.",
      painPoints: "price comparison without like-for-like project parity",
      objections: "price, location, amenities",
      nextStep: "Share value comparison and explain the pricing delta",
    },
    {
      id: "CALL-002",
      accountId: "ACC-001",
      date: "2026-03-28",
      summary: "Client asked whether there is flexibility in the payment plan or inventory option to reduce the immediate booking burden.",
      painPoints: "commercial pressure on payment terms",
      objections: "payment plan, booking pressure",
      nextStep: "Offer calibrated payment-plan options",
    },
    {
      id: "CALL-003",
      accountId: "ACC-002",
      date: "2026-03-22",
      summary: "Project Elan buyer is worried that handover could slip because the project is still under active construction and builder updates are uneven.",
      painPoints: "handover anxiety during construction",
      objections: "timeline, possession",
      nextStep: "Send revised milestone chart and latest builder update",
    },
    {
      id: "CALL-004",
      accountId: "ACC-002",
      date: "2026-03-31",
      summary: "Villa buyer asked who is personally accountable if the builder timeline shifts or promised milestones slip.",
      painPoints: "builder trust and escalation fear",
      objections: "trust, possession, timeline",
      nextStep: "Reassure on update cadence and escalation path",
    },
    {
      id: "CALL-005",
      accountId: "ACC-003",
      date: "2026-03-20",
      summary: "Project Mira buyer asked how the firm handles remote site visits, documentation support, and construction-stage updates.",
      painPoints: "remote buying visibility",
      objections: "remote coordination, trust",
      nextStep: "Share remote buying workflow and sample update cadence",
    },
  ],
  objections: [
    {
      id: "OBJ-001",
      accountId: "ACC-001",
      category: "price_quote",
      text: "Why is your quoted price higher than the other two 4BHK options we are considering?",
      strategy: "Explain the pricing in a like-for-like way, show project and community differences, and anchor on long-term value plus support.",
      resolution: "open",
    },
    {
      id: "OBJ-002",
      accountId: "ACC-001",
      category: "payment_plan",
      text: "Can we reduce the immediate cost burden through a different payment structure or unit choice?",
      strategy: "Offer clear payment-plan options and inventory alternatives without hiding total commercial reality.",
      resolution: "open",
    },
    {
      id: "OBJ-003",
      accountId: "ACC-002",
      category: "timeline_delivery",
      text: "If the builder timeline shifts, how do we know whether handover will still stay on track?",
      strategy: "Show milestone sequencing, dependencies, and how the firm escalates risks early rather than waiting for the client to ask.",
      resolution: "open",
    },
    {
      id: "OBJ-004",
      accountId: "ACC-002",
      category: "trust_accountability",
      text: "Who is actually responsible if the builder timeline changes or promised updates stop coming?",
      strategy: "Lead with named accountability, update protocol, and documented escalation paths.",
      resolution: "open",
    },
    {
      id: "OBJ-005",
      accountId: "ACC-003",
      category: "remote_execution",
      text: "We are not in Bengaluru full-time. How will we stay confident about site visits, paperwork, and project updates?",
      strategy: "Explain remote coordination, weekly updates, documentation support, and milestone-based communication.",
      resolution: "partially resolved",
    },
  ],
  assets: [
    {
      id: "MSG-001",
      topic: "pricing",
      title: "Price and project value narrative",
      message: "Never defend price in the abstract. Walk the client through project quality, builder credibility, location strength, amenities, and long-term value.",
      proofPoints: [
        "Like-for-like comparison matters more than headline asking price",
        "Premium buyers pay for reduced uncertainty, not just square footage",
        "Clear guidance protects both confidence and speed to booking",
      ],
    },
    {
      id: "MSG-002",
      topic: "project_quality",
      title: "Project and builder reassurance",
      message: "Use construction quality, builder track record, milestone visibility, and documentation support as the core reassurance when clients worry reality may not match the promise.",
      proofPoints: [
        "Site-level visibility reduces decision anxiety",
        "Project quality must be made tangible",
        "Regular updates protect trust through the sales cycle",
      ],
    },
    {
      id: "MSG-003",
      topic: "timeline",
      title: "Possession and timeline confidence framing",
      message: "Do not promise perfect certainty. Show milestone clarity, dependency management, and proactive communication when construction or possession timelines face pressure.",
      proofPoints: [
        "Clients trust bad news earlier more than good news later",
        "Milestone visibility reduces anxiety",
        "Execution discipline is a selling point, not just an ops habit",
      ],
    },
    {
      id: "MSG-004",
      topic: "trust",
      title: "Named accountability story",
      message: "The firm should sound informed, responsive, and accountable. Named ownership is the trust bridge between an attractive project pitch and a confident buyer decision.",
      proofPoints: [
        "Premium clients fear disappearing accountability after signing",
        "Founder or partner visibility matters",
        "Trust is built through consistency, specificity, and ownership",
      ],
    },
  ],
  funnelEvents: [
    { accountId: "ACC-001", date: "2026-03-28", move: "quote shared -> pre-closing", reason: "Client shortlisted the firm but wants price and project clarity" },
    { accountId: "ACC-002", date: "2026-03-31", move: "signed -> under construction", reason: "Execution live, now focused on timeline confidence" },
    { accountId: "ACC-003", date: "2026-03-20", move: "lead generated -> initial discussions", reason: "NRI buyer entered structured discovery with the firm" },
  ],
  battlecards: [
    {
      competitor: "Livspace",
      talkTrack: "Differentiate the firm on design specificity, named accountability, and boutique execution discipline rather than platform scale.",
    },
    {
      competitor: "local boutique + contractor combo",
      talkTrack: "Differentiate the firm on structured process, commercial clarity, project confidence, and proactive communication across the buying journey.",
    },
  ],
  scenarios: [
    {
      title: "Price objection",
      description: "Buyer says this 4BHK option is priced above another nearby project.",
      prompt: "How should I handle the pricing objection for Project Cedar?",
    },
    {
      title: "Possession anxiety",
      description: "Villa buyer is nervous that construction delays may impact handover.",
      prompt: "Give me a response for Project Elan on the possession timeline concern.",
    },
    {
      title: "NRI reassurance",
      description: "Remote buyer needs confidence in site updates and documentation support.",
      prompt: "How do I reassure Project Mira about remote coordination and updates?",
    },
    {
      title: "Builder trust",
      description: "Buyer wants stronger confidence in builder quality and project credibility.",
      prompt: "What should I say when a client worries the actual project quality may not match the promise?",
    },
  ],
};

seedInteriorPortfolioVolume(demoData);

const chatLog = document.getElementById("chat-log");
const datasetStats = document.getElementById("dataset-stats");
const funnelStats = document.getElementById("funnel-stats");
const projectBriefs = document.getElementById("project-briefs");
const chatForm = document.getElementById("chat-form");
const questionInput = document.getElementById("question-input");
const clearChatButton = document.getElementById("clear-chat");
const messageTemplate = document.getElementById("message-template");
const detailOverlay = document.getElementById("detail-overlay");
const detailTitle = document.getElementById("detail-title");
const detailEyebrow = document.getElementById("detail-eyebrow");
const detailSummary = document.getElementById("detail-summary");
const detailContent = document.getElementById("detail-content");
const closeDetailButton = document.getElementById("close-detail");

let messageCount = 0;

initialize();

function initialize() {
  renderStats();
  renderFunnelStats();
  renderProjectBriefs();
  addMessage(
    "agent",
    "System",
    [
      "<p>This local MVP uses dummy sales memory to simulate a residential real estate copilot workflow.</p>",
      "<p>Use it as a structural prototype for pricing, possession, project trust, documentation, and payment-plan objections.</p>",
      "<div class=\"source-row\"><span class=\"source-chip\">Source hierarchy on</span><span class=\"source-chip\">Dummy data only</span><span class=\"source-chip\">Local retrieval</span></div>",
    ].join("")
  );

  chatForm.addEventListener("submit", onSubmit);
  clearChatButton.addEventListener("click", resetChat);
  closeDetailButton.addEventListener("click", closeDetailPanel);
  detailOverlay.addEventListener("click", onDetailOverlayClick);
  document.addEventListener("keydown", onKeyDown);
}

function renderStats() {
  const stats = [
    ["Property opportunities", demoData.accounts.length, () => openProjectsPanel("all")],
    ["Open + active pipeline", demoData.opportunities.length, () => openProjectsPanel("pipeline")],
    ["Calls", demoData.calls.length, openCallsPanel],
    ["Objections", demoData.objections.length, openObjectionsPanel],
    ["Approved assets", demoData.assets.length, openAssetsPanel],
    ["Typical value band", "INR 80L-7Cr", openValueBandPanel],
  ];

  stats.forEach(([label, value, onClick]) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "stat-button";
    button.innerHTML = `<span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong>`;
    button.addEventListener("click", onClick);
    li.appendChild(button);
    datasetStats.appendChild(li);
  });
}

function renderFunnelStats() {
  funnelStats.innerHTML = "";

  const orderedStages = [
    "lead generated",
    "initial discussions",
    "site visit scheduled",
    "concept presentation",
    "quote shared",
    "pre-closing",
    "under construction",
    "handover completed",
  ];

  orderedStages.forEach((stage) => {
    const count = demoData.accounts.filter((item) => item.stage === stage).length;
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "stat-button";
    button.innerHTML = `<span>${escapeHtml(stage)}</span><strong>${count}</strong>`;
    button.addEventListener("click", () => openProjectsPanel(stage));
    li.appendChild(button);
    funnelStats.appendChild(li);
  });
}

function renderProjectBriefs() {
  projectBriefs.innerHTML = "";

  const featuredAccountIds = ["ACC-001", "ACC-002", "ACC-003"];
  featuredAccountIds.forEach((accountId) => {
    const account = demoData.accounts.find((item) => item.id === accountId);
    const opportunity = demoData.opportunities.find((item) => item.id === account.opportunityId);
    const latestCall = demoData.calls
      .filter((item) => item.accountId === accountId)
      .sort(sortByDateDesc)[0];
    const objectionCount = demoData.objections.filter((item) => item.accountId === accountId).length;

    const card = document.createElement("article");
    card.className = "brief-card";
    card.tabIndex = 0;
    card.innerHTML = `
      <h3>${escapeHtml(account.name)}</h3>
      <div class="brief-meta">
        <span>Dummy Name</span>
        <span>Stage: ${escapeHtml(account.stage)}</span>
        <span>Objections: ${objectionCount}</span>
      </div>
      <p><strong>Project context:</strong> ${escapeHtml(account.summary)}</p>
      <p><strong>Opportunity type:</strong> ${escapeHtml(account.useCase)}</p>
      <p><strong>Latest call:</strong> ${escapeHtml(latestCall ? latestCall.summary : "No calls logged yet.")}</p>
      <p><strong>Current next step:</strong> ${escapeHtml(account.nextStep)}</p>
      <p><strong>Opportunity:</strong> ${escapeHtml(opportunity ? `${opportunity.name} • ${opportunity.amount}` : "Not linked")}</p>
    `;
    card.addEventListener("click", () => openProjectDetail(account.id));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProjectDetail(account.id);
      }
    });
    projectBriefs.appendChild(card);
  });
}

function onSubmit(event) {
  event.preventDefault();
  const question = questionInput.value.trim();

  if (!question) {
    return;
  }

  addMessage("user", "You", `<p>${escapeHtml(question)}</p>`);
  const answer = answerQuestion(question);
  addMessage("agent", "IIOS Copilot", answer);
  questionInput.value = "";
}

function resetChat() {
  chatLog.innerHTML = "";
  messageCount = 0;
  addMessage(
    "agent",
    "System",
    [
      "<p>This local MVP uses dummy sales memory to simulate a residential real estate copilot workflow.</p>",
      "<p>Use it as a structural prototype for pricing, possession, project trust, documentation, and payment-plan objections.</p>",
      "<div class=\"source-row\"><span class=\"source-chip\">Source hierarchy on</span><span class=\"source-chip\">Dummy data only</span><span class=\"source-chip\">Local retrieval</span></div>",
    ].join("")
  );
}

function onDetailOverlayClick(event) {
  const target = event.target;
  if (target instanceof HTMLElement && target.dataset.closeDetail === "true") {
    closeDetailPanel();
  }
}

function onKeyDown(event) {
  if (event.key === "Escape" && !detailOverlay.classList.contains("hidden")) {
    closeDetailPanel();
  }
}

function openDetailPanel({ eyebrow, title, summary, itemsHtml }) {
  detailEyebrow.textContent = eyebrow;
  detailTitle.textContent = title;
  detailSummary.textContent = summary;
  detailContent.innerHTML = itemsHtml;
  detailOverlay.classList.remove("hidden");
  detailOverlay.setAttribute("aria-hidden", "false");
}

function closeDetailPanel() {
  detailOverlay.classList.add("hidden");
  detailOverlay.setAttribute("aria-hidden", "true");
}

function openProjectsPanel(filterStage) {
  let projects = demoData.accounts.slice();
  let title = "All Property Opportunities";
  let summary = "Every dummy opportunity in the sandbox with its current stage, amount, latest call, and next step.";

  if (filterStage === "pipeline") {
    projects = projects.filter((item) => item.stage !== "handover completed");
    title = "Open And Active Pipeline";
    summary = "Projects that are still in the active sales or execution pipeline.";
  } else if (filterStage !== "all") {
    projects = projects.filter((item) => item.stage === filterStage);
    title = toTitleCase(filterStage);
    summary = `Projects currently sitting in the "${filterStage}" stage.`;
  }

  const itemsHtml = projects
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((project) => renderProjectCard(project.id))
    .join("");

  openDetailPanel({
    eyebrow: "Project Drilldown",
    title,
    summary,
    itemsHtml,
  });
}

function openProjectDetail(accountId) {
  const project = demoData.accounts.find((item) => item.id === accountId);
  if (!project) {
    return;
  }

  openDetailPanel({
    eyebrow: "Project Detail",
    title: project.name,
    summary: "Dummy project detail used inside the demo. This mirrors the type of structured record the future copilot would read from the operating system.",
    itemsHtml: renderProjectCard(project.id, true),
  });
}

function openCallsPanel() {
  const itemsHtml = demoData.calls
    .slice()
    .sort(sortByDateDesc)
    .map((call) => {
      const account = demoData.accounts.find((item) => item.id === call.accountId);
      return `
        <article class="detail-item">
          <h3>${escapeHtml(account ? account.name : call.id)}</h3>
          <div class="detail-tags">
            <span>${escapeHtml(call.date)}</span>
            <span>${escapeHtml(call.objections)}</span>
          </div>
          <p><strong>Call summary:</strong> ${escapeHtml(call.summary)}</p>
          <p><strong>Pain points:</strong> ${escapeHtml(call.painPoints)}</p>
          <p><strong>Next step:</strong> ${escapeHtml(call.nextStep)}</p>
        </article>
      `;
    })
    .join("");

  openDetailPanel({
    eyebrow: "Call Log",
    title: "All Logged Calls",
    summary: "Recent dummy call notes across the entire real estate pipeline.",
    itemsHtml,
  });
}

function openObjectionsPanel() {
  const itemsHtml = demoData.objections
    .slice()
    .map((objection) => {
      const account = demoData.accounts.find((item) => item.id === objection.accountId);
      return `
        <article class="detail-item">
          <h3>${escapeHtml(account ? account.name : objection.id)}</h3>
          <div class="detail-tags">
            <span>${escapeHtml(objection.category)}</span>
            <span>${escapeHtml(objection.resolution)}</span>
          </div>
          <p><strong>Objection:</strong> ${escapeHtml(objection.text)}</p>
          <p><strong>Recommended handling:</strong> ${escapeHtml(objection.strategy)}</p>
        </article>
      `;
    })
    .join("");

  openDetailPanel({
    eyebrow: "Objection Library",
    title: "All Logged Objections",
    summary: "Structured objection records used by the demo to build grounded answers.",
    itemsHtml,
  });
}

function openAssetsPanel() {
  const itemsHtml = demoData.assets
    .slice()
    .map((asset) => `
      <article class="detail-item">
        <h3>${escapeHtml(asset.title)}</h3>
        <div class="detail-tags">
          <span>${escapeHtml(asset.topic)}</span>
          <span>${escapeHtml(asset.id)}</span>
        </div>
        <p><strong>Message:</strong> ${escapeHtml(asset.message)}</p>
        <p><strong>Proof points:</strong> ${escapeHtml(asset.proofPoints.join(" | "))}</p>
      </article>
    `)
    .join("");

  openDetailPanel({
    eyebrow: "Approved Messaging",
    title: "Brand And Sales Assets",
    summary: "Dummy messaging assets that simulate brand-approved responses and objection frameworks.",
    itemsHtml,
  });
}

function openValueBandPanel() {
  const itemsHtml = `
    <article class="detail-item">
      <h3>Typical Project Value Band</h3>
      <div class="detail-tags">
        <span>INR 20L-50L</span>
        <span>Residential real estate</span>
      </div>
      <p><strong>What this means:</strong> The sandbox is designed around a generic real-estate sales range covering premium apartments, villas, and villaments.</p>
      <p><strong>Used across the dataset:</strong> Open leads, active negotiations, under-construction opportunities, and closed deals all stay within this range.</p>
    </article>
  `;

  openDetailPanel({
    eyebrow: "Commercial Context",
    title: "Value Band",
    summary: "A quick explainer for the commercial band used in this demo.",
    itemsHtml,
  });
}

function renderProjectCard(accountId, expanded = false) {
  const project = demoData.accounts.find((item) => item.id === accountId);
  const opportunity = demoData.opportunities.find((item) => item.id === project?.opportunityId);
  const latestCall = demoData.calls
    .filter((item) => item.accountId === accountId)
    .sort(sortByDateDesc)[0];
  const objections = demoData.objections.filter((item) => item.accountId === accountId);

  if (!project) {
    return "";
  }

  return `
    <article class="detail-item">
      <h3>${escapeHtml(project.name)}</h3>
      <div class="detail-tags">
        <span>${escapeHtml(project.stage)}</span>
        <span>${escapeHtml(opportunity ? opportunity.amount : "Amount not set")}</span>
        <span>${escapeHtml(project.owner)}</span>
      </div>
      <p><strong>Project type:</strong> ${escapeHtml(project.useCase)}</p>
      <p><strong>Current context:</strong> ${escapeHtml(project.summary)}</p>
      <p><strong>Current risk:</strong> ${escapeHtml(project.risk)}</p>
      <p><strong>Latest call:</strong> ${escapeHtml(latestCall ? latestCall.summary : "No call logged yet.")}</p>
      <p><strong>Next step:</strong> ${escapeHtml(project.nextStep)}</p>
      ${
        expanded
          ? `<p><strong>Objections on record:</strong> ${escapeHtml(objections.map((item) => item.category).join(", ") || "None")}</p>
             <p><strong>Decision criteria:</strong> ${escapeHtml(opportunity ? opportunity.decisionCriteria : "Not set")}</p>`
          : ""
      }
    </article>
  `;
}

function addMessage(role, label, html) {
  const fragment = messageTemplate.content.cloneNode(true);
  const message = fragment.querySelector(".message");
  const meta = fragment.querySelector(".message-meta");
  const body = fragment.querySelector(".message-body");

  messageCount += 1;
  message.classList.add(role);
  meta.textContent = `${label} · message ${messageCount}`;
  body.innerHTML = html;
  chatLog.appendChild(fragment);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function answerQuestion(question) {
  const normalized = question.toLowerCase();
  const match = findAccount(normalized);
  const account = match.account;
  const type = detectType(normalized);

  if (match.ambiguous.length > 0) {
    return [
      "<p>I found more than one possible project match, so I am not going to answer against the wrong project.</p>",
      `<p><strong>Possible matches:</strong> ${escapeHtml(match.ambiguous.map((item) => item.name).join(" | "))}</p>`,
      "<p>Please use the exact project name shown in the dashboard cards or click the project card first and ask from there.</p>",
    ].join("");
  }

  if (!account) {
    return `<p>I could not confidently match that to one of the seeded dummy property opportunities. Try the exact project name, development name, or pick a project from the dashboard first.</p>`;
  }

  const opportunity = demoData.opportunities.find((item) => item.id === account.opportunityId);
  const calls = demoData.calls.filter((item) => item.accountId === account.id).sort(sortByDateDesc);
  const objections = selectObjections(account.id, normalized);
  const assets = selectAssets(type, normalized);
  const battlecard = demoData.battlecards.find((item) => item.competitor === account.competitor);
  const funnel = demoData.funnelEvents.filter((item) => item.accountId === account.id).sort(sortByDateDesc);

  return buildResponse({ type, account, opportunity, calls, objections, assets, battlecard, funnel });
}

function findAccount(normalized) {
  const stopTokens = new Set([
    "project",
    "the",
    "and",
    "for",
    "with",
    "client",
    "quote",
    "high",
    "is",
    "feeling",
    "a",
    "an",
    "of",
    "in",
  ]);

  const scored = demoData.accounts
    .map((item) => {
      const full = item.name.toLowerCase();
      const aliases = (item.aliases || []).map((alias) => alias.toLowerCase());
      const opportunity = demoData.opportunities.find((op) => op.id === item.opportunityId);
      const projectText = `${full} ${aliases.join(" ")} ${item.useCase.toLowerCase()} ${item.summary.toLowerCase()} ${(opportunity?.name || "").toLowerCase()}`;
      const tokens = Array.from(
        new Set(
          projectText
            .split(/[^a-z0-9]+/)
            .filter((token) => token.length >= 3 && !stopTokens.has(token))
        )
      );

      let score = 0;

      if (normalized.includes(full)) {
        score += 100;
      }

      aliases.forEach((alias) => {
        if (alias && normalized.includes(alias)) {
          score += 45;
        }
      });

      tokens.forEach((token) => {
        if (normalized.includes(token)) {
          score += 8;
        }
      });

      const exactProjectCode = full.match(/^project\s+([a-z0-9]+)/);
      if (exactProjectCode && normalized.includes(`project ${exactProjectCode[1]}`)) {
        score += 35;
      }

      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score);

  if (scored.length === 0) {
    return { account: null, ambiguous: [] };
  }

  const top = scored[0];
  const second = scored[1];

  if (!second || top.score >= second.score + 20) {
    return { account: top.item, ambiguous: [] };
  }

  const ambiguous = scored
    .filter((entry) => entry.score >= top.score - 12)
    .slice(0, 4)
    .map((entry) => entry.item);

  return { account: null, ambiguous };
}

function detectType(normalized) {
  if (normalized.includes("timeline") || normalized.includes("handover") || normalized.includes("delivery") || normalized.includes("possession")) {
    return "timeline";
  }
  if (normalized.includes("legal") || normalized.includes("document") || normalized.includes("paperwork") || normalized.includes("approval")) {
    return "documentation";
  }
  if (normalized.includes("summary") || normalized.includes("summarize") || normalized.includes("next call")) {
    return "prep";
  }
  if (normalized.includes("remote") || normalized.includes("nri")) {
    return "remote";
  }
  if (normalized.includes("already tried") || normalized.includes("different")) {
    return "trust";
  }
  if (normalized.includes("price") || normalized.includes("pricing") || normalized.includes("quote") || normalized.includes("cost")) {
    return "pricing";
  }
  if (normalized.includes("builder") || normalized.includes("quality") || normalized.includes("amenities") || normalized.includes("project")) {
    return "project_trust";
  }
  return "general";
}

function selectObjections(accountId, normalized) {
  const all = demoData.objections.filter((item) => item.accountId === accountId);

  if (normalized.includes("timeline") || normalized.includes("handover") || normalized.includes("delivery") || normalized.includes("possession")) {
    return all.filter((item) => item.category === "timeline_delivery" || item.category === "post_handover_support");
  }
  if (normalized.includes("price") || normalized.includes("pricing") || normalized.includes("quote") || normalized.includes("cost")) {
    return all.filter((item) => item.category === "price_quote" || item.category === "payment_plan");
  }
  if (normalized.includes("legal") || normalized.includes("document") || normalized.includes("paperwork") || normalized.includes("approval")) {
    return all.filter((item) => item.category === "documentation" || item.category === "trust_accountability");
  }
  if (normalized.includes("builder") || normalized.includes("quality") || normalized.includes("amenities") || normalized.includes("project")) {
    return all.filter((item) => item.category === "trust_accountability");
  }
  if (normalized.includes("remote") || normalized.includes("nri")) {
    return all.filter((item) => item.category === "remote_execution" || item.category === "trust_accountability");
  }
  if (normalized.includes("already tried") || normalized.includes("different") || normalized.includes("trust")) {
    return all.filter((item) => item.category === "trust_accountability");
  }

  return all;
}

function selectAssets(type, normalized) {
  if (type === "timeline") {
    return demoData.assets.filter((item) => item.topic === "timeline" || item.topic === "post_handover");
  }
  if (type === "pricing") {
    return demoData.assets.filter((item) => item.topic === "pricing");
  }
  if (type === "trust") {
    return demoData.assets.filter((item) => item.topic === "trust" || item.topic === "adoption");
  }
  if (type === "project_trust") {
    return demoData.assets.filter((item) => item.topic === "project_quality" || item.topic === "trust");
  }
  if (type === "documentation") {
    return demoData.assets.filter((item) => item.topic === "trust" || item.topic === "remote_execution");
  }
  if (type === "remote") {
    return demoData.assets.filter((item) => item.topic === "remote_execution" || item.topic === "trust");
  }
  if (type === "prep") {
    return demoData.assets.filter((item) => item.topic === "pricing" || item.topic === "adoption");
  }
  return demoData.assets.slice(0, 2);
}

function buildResponse({ type, account, opportunity, calls, objections, assets, battlecard, funnel }) {
  const direct = buildDirectAnswer(type, account, opportunity, objections, assets);
  const talkTrack = buildTalkTrack(type, account, objections, assets, battlecard);
  const why = buildWhy(calls, objections, assets, funnel);
  const next = buildNextStep(type, account, opportunity);
  const confidence = buildConfidence(calls, objections, assets);
  const sources = buildSources(account, opportunity, calls, objections, assets, battlecard);

  return [
    `<h3>Direct answer</h3><p>${escapeHtml(direct)}</p>`,
    `<h3>Suggested talk track</h3><p>${escapeHtml(talkTrack)}</p>`,
    `<h3>Why this response fits</h3>${why}`,
    `<h3>Recommended next step</h3><p>${escapeHtml(next)}</p>`,
    `<h3>Confidence and gaps</h3><p>${escapeHtml(confidence)}</p>`,
    `<h3>Sources used</h3>${sources}`,
  ].join("");
}

function buildDirectAnswer(type, account, opportunity, objections, assets) {
  if (type === "timeline") {
    return `For ${account.name}, handle the possession concern with milestone clarity, dependency visibility, and proactive communication. Do not promise zero risk; show how the firm manages and communicates it.`;
  }

  if (type === "remote") {
    return `For ${account.name}, reassure the client through process: remote coordination, weekly updates, documentation support, and named accountability from first visit through booking or handover.`;
  }

  if (type === "documentation") {
    return `For ${account.name}, reduce anxiety by explaining the paperwork flow clearly: approvals, booking steps, legal checkpoints, and who owns each part of the process.`;
  }

  if (type === "prep") {
    return `${account.name} is interested, but the deal is shaped by ${account.risk}. Go into the next call ready to address the top blocker, anchor on approved messaging, and make the next rollout step feel small and practical.`;
  }

  if (type === "trust") {
    return `With ${account.name}, the winning move is to position the MVP as a smaller operating loop rather than another broad knowledge initiative. Tie the value to daily utility, not to a future vision alone.`;
  }

  if (type === "pricing") {
    return `For ${account.name}, do not defend the asking price in the abstract. Reframe the conversation around project quality, builder credibility, location strength, and the commercial structure being offered.`;
  }

  if (type === "project_trust") {
    return `For ${account.name}, reassure the client by making the project tangible: builder reputation, current construction status, amenities, documentation discipline, and realistic possession visibility.`;
  }

  const asset = assets[0];
  return asset
    ? `The strongest answer for ${account.name} is the one grounded in ${asset.title.toLowerCase()} and the latest account history.`
    : `${account.name} has usable context, but the answer would be stronger with more structured records.`;
}

function buildTalkTrack(type, account, objections, assets, battlecard) {
  if (type === "timeline") {
    return "We would rather be specific than casually optimistic. The way we manage possession expectations is through milestone sequencing, early flagging of dependencies, and proactive updates before you have to ask. If something affects the timeline, we will show you the likely impact and the recovery path clearly.";
  }

  if (type === "remote") {
    return "You do not need to be in Bengaluru every week for the buying process to stay controlled. We structure remote coordination, share progress updates on a defined cadence, and keep one named owner accountable for decisions and escalations. The point is not just remote convenience, but remote confidence.";
  }

  if (type === "documentation") {
    return "A lot of buyer anxiety comes from not knowing how paperwork, approvals, and next steps will actually move. We would walk you through the process clearly, flag what depends on the builder or legal team, and keep one owner accountable for updates so nothing feels vague.";
  }

  if (type === "prep") {
    return "From what you shared, the problem is not lack of information but lack of shared memory. We want to start with a narrow workflow that helps your team immediately on live calls: capture the summary, log the objection, update the opportunity, and make that usable in the very next conversation. If we can prove that loop quickly, the system earns the right to expand.";
  }

  if (type === "trust") {
    return "I would not ask your team to rebuild a giant knowledge base. We would start with one call summary, one objection log, and one opportunity update, then make those records useful right away for prep and objection handling. The difference is that this earns trust through daily utility before it asks for more process.";
  }

  if (type === "project_trust") {
    return "The way we protect buyer confidence is by not relying on brochure language alone. We make the opportunity tangible through project specifics, current status, builder context, and a clear update rhythm. That is how we reduce the gap between the promise and what the buyer believes.";
  }

  const objection = objections[0];
  const asset = assets[0];
  const competitorLine = battlecard ? `${battlecard.talkTrack} ` : "";
  return `The real question behind "${objection ? objection.text : "this objection"}" is whether the price feels justified for the outcome and confidence being promised. ${asset ? asset.message : "Lead with the approved value narrative."} ${competitorLine}I would anchor first on like-for-like project quality, location strength, builder credibility, and delivery confidence rather than trying to win the conversation on price alone.`;
}

function buildWhy(calls, objections, assets, funnel) {
  const bullets = [];

  if (calls[0]) {
    bullets.push(`Latest call context: ${calls[0].date} - ${calls[0].summary}`);
  }
  if (objections.length) {
    bullets.push(`Relevant objection records found: ${objections.length}. Top pattern: ${objections[0].category}.`);
  }
  if (assets.length) {
    bullets.push(`Approved messaging used: ${assets.map((item) => item.title).join(", ")}.`);
  }
  if (funnel[0]) {
    bullets.push(`Recent funnel movement: ${funnel[0].move} because ${funnel[0].reason}.`);
  }

  return `<ul>${bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function buildNextStep(type, account, opportunity) {
  if (type === "timeline") {
    return "Send the client a milestone-wise update with the current dependency, expected impact, and the action the firm is taking to hold the possession schedule.";
  }
  if (type === "remote") {
    return "Share one real sample of the remote update rhythm so the client can see exactly how site visits, paperwork coordination, and progress communication will work.";
  }
  if (type === "documentation") {
    return "Send a short, buyer-friendly step map showing booking, paperwork, approvals, and the next milestone so the process feels concrete.";
  }
  if (type === "trust") {
    return "Run a live demo around one real account so the buyer sees immediate utility instead of another abstract system promise.";
  }
  if (type === "prep") {
    return `Use the call to secure alignment on "${account.nextStep}" and tie it to ${opportunity.decisionCriteria}.`;
  }
  return `Before the next interaction, package the answer around "${account.nextStep}" and connect it to the buyer's decision criteria.`;
}

function buildConfidence(calls, objections, assets) {
  if (calls.length && objections.length && assets.length) {
    return "Confidence: high. This answer is backed by recent call context, structured objection records, and approved messaging. Main gap: this demo does not include real transcripts, analytics, or live retrieval from Google Workspace.";
  }
  if (calls.length && assets.length) {
    return "Confidence: medium. There is useful account context and approved messaging, but the objection history is still thin.";
  }
  return "Confidence: low. The records are too shallow to treat this as a trusted production answer.";
}

function buildSources(account, opportunity, calls, objections, assets, battlecard) {
  const items = [
    `Account: ${account.name}`,
    `Opportunity: ${opportunity.name}`,
    ...calls.slice(0, 2).map((item) => `Call: ${item.id}`),
    ...objections.slice(0, 2).map((item) => `Objection: ${item.id}`),
    ...assets.map((item) => `Asset: ${item.title}`),
    battlecard ? `Battlecard: ${battlecard.competitor}` : null,
  ].filter(Boolean);

  return `<div class="source-row">${items.map((item) => `<span class="source-chip">${escapeHtml(item)}</span>`).join("")}</div>`;
}

function sortByDateDesc(a, b) {
  const left = new Date(a.date).getTime();
  const right = new Date(b.date).getTime();
  return right - left;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toTitleCase(value) {
  return value.replace(/\b\w/g, (match) => match.toUpperCase());
}

function seedExpandedDataset(store) {
  const accountSeeds = [
    {
      id: "ACC-004",
      opportunityId: "OPP-104",
      name: "BluePeak Analytics",
      aliases: ["bluepeak"],
      owner: "Kavya",
      stage: "evaluation",
      useCase: "enterprise objection library and call prep",
      competitor: "RevSense",
      risk: "timeline pressure and integration anxiety",
      summary: "Positive discovery, but the buyer worries implementation could slow the quarter.",
      nextStep: "Share implementation timeline and references",
      amount: "INR 18L",
      decisionCriteria: "deployment speed, integration confidence, rep adoption",
      calls: [
        ["2026-03-12", "BluePeak wants faster prep before CIO-led calls.", "reps lose time across notes and decks", "timeline", "Show rollout map"],
        ["2026-03-21", "Buyer asked how quickly the first usable workflow can go live.", "implementation speed matters more than feature depth", "timeline, implementation", "Share phased launch plan"],
        ["2026-03-29", "Technical lead asked if CRM and sheets can coexist during rollout.", "team wants low change risk", "integration", "Provide coexistence plan"],
      ],
      objections: [
        ["timeline", "How quickly can we get value without a long rollout?", "Show a phased deployment with one workflow live in week one."],
        ["integration", "Will this disrupt the systems reps already use?", "Position the MVP as a layer on top of existing systems, not a forced rip-and-replace."],
      ],
      funnel: ["discovery -> evaluation", "Timeline concerns surfaced after positive use-case fit"],
    },
    {
      id: "ACC-005",
      opportunityId: "OPP-105",
      name: "Crestline Capital",
      aliases: ["crestline"],
      owner: "Rohan",
      stage: "negotiation",
      useCase: "deal memory for high-value enterprise cycles",
      competitor: "PitchPilot",
      risk: "procurement pushback on price and ROI proof",
      summary: "Champion is strong, but procurement wants quantified value evidence.",
      nextStep: "Send ROI narrative and enterprise case studies",
      amount: "INR 31L",
      decisionCriteria: "ROI proof, procurement comfort, exec-ready messaging",
      calls: [
        ["2026-03-10", "Crestline wants a repeatable way to prep for CFO objections.", "manual research is too slow", "price", "Share enterprise value story"],
        ["2026-03-19", "Procurement asked for proof that this pays back faster than headcount.", "hard ROI asks", "price, ROI", "Send comparable wins"],
        ["2026-03-30", "Champion asked for approved messaging to use internally.", "internal selling support needed", "trust", "Provide exec summary"],
      ],
      objections: [
        ["price", "Why not add more sales operations headcount instead?", "Contrast one-time human effort with compounding institutional memory and wider team leverage."],
        ["trust", "Can you give us proof this works beyond one champion user?", "Use case studies and adoption metrics tied to team-wide workflows."],
      ],
      funnel: ["proposal -> negotiation", "Champion aligned but procurement demanded ROI proof"],
    },
    {
      id: "ACC-006",
      opportunityId: "OPP-106",
      name: "DeltaForge Manufacturing",
      aliases: ["deltaforge", "delta forge"],
      owner: "Ananya",
      stage: "proposal",
      useCase: "objection handling for distributed field sales",
      competitor: "status quo",
      risk: "low digital maturity and fear of process burden",
      summary: "Operationally messy today, but leadership sees the need for a repeatable system.",
      nextStep: "Show minimal capture workflow and manager dashboard",
      amount: "INR 12L",
      decisionCriteria: "ease of use, manager visibility, fast adoption",
      calls: [
        ["2026-03-11", "Field sales managers want one place to see deal blockers.", "sales context is fragmented", "adoption", "Show dashboard concept"],
        ["2026-03-23", "Ops manager worried reps will not update another tool.", "adoption risk high", "adoption", "Pitch capture-light rollout"],
        ["2026-03-28", "Founder asked how little process is needed to make this useful.", "needs low-friction entry", "trust", "Frame smallest useful loop"],
      ],
      objections: [
        ["adoption", "Our reps barely update the CRM. Why would this be different?", "Tie the system to a tiny capture loop and visible daily value for managers."],
        ["trust", "This sounds like more process for a team already stretched thin.", "Stress that the MVP supports only a few repeated questions, not broad documentation."],
      ],
      funnel: ["evaluation -> proposal", "Manager buy-in improved after dashboard story"],
    },
    {
      id: "ACC-007",
      opportunityId: "OPP-107",
      name: "EverGrid Energy",
      aliases: ["evergrid"],
      owner: "Farah",
      stage: "security review",
      useCase: "regulated sales knowledge search",
      competitor: "RevSense",
      risk: "security review and auditability requirements",
      summary: "Sales wants the solution, but governance review is strict.",
      nextStep: "Map access controls and audit trail story",
      amount: "INR 27L",
      decisionCriteria: "auditability, role-based access, evidence-backed output",
      calls: [
        ["2026-03-08", "EverGrid liked the idea of surfaced answers with citations.", "compliance needs traceability", "security", "Send governance note"],
        ["2026-03-18", "Security lead asked how restricted folders would be handled.", "permissioning is central", "security", "Document access model"],
        ["2026-03-27", "Legal requested a clear line between stored data and generated answers.", "wants explicit governance language", "security, trust", "Prepare FAQ response"],
      ],
      objections: [
        ["security", "How do we know sensitive notes will not surface to the wrong team?", "Explain that visibility should follow source permissions and segmented collections."],
        ["security", "Can we audit which sources informed an answer?", "Lead with citations, logs, and governed retrieval boundaries."],
      ],
      funnel: ["evaluation -> security review", "Governance review opened after strong business support"],
    },
    {
      id: "ACC-008",
      opportunityId: "OPP-108",
      name: "FalconBridge Logistics",
      aliases: ["falconbridge", "falcon bridge"],
      owner: "Nihar",
      stage: "discovery",
      useCase: "call prep for regional sales managers",
      competitor: "PitchPilot",
      risk: "unclear internal owner and weak urgency",
      summary: "Use case is relevant but urgency is not yet strong.",
      nextStep: "Sharpen cost of current inefficiency and get executive sponsor",
      amount: "INR 11L",
      decisionCriteria: "manager adoption, urgency, visible call quality gains",
      calls: [
        ["2026-03-06", "Regional managers said each territory handles objections differently.", "no consistent playbook", "trust", "Map current pain"],
        ["2026-03-17", "Team wants examples of improved call prep.", "needs concrete before/after", "trust", "Show example summaries"],
        ["2026-03-26", "Budget owner has not joined yet.", "sponsor missing", "price", "Secure exec attendee"],
      ],
      objections: [
        ["trust", "This feels nice to have, not urgent.", "Quantify wasted prep time and inconsistent objection handling across regions."],
        ["price", "We need stronger proof before involving budget owners.", "Use a narrow pilot ask and tie value to saved manager time and win-rate lift."],
      ],
      funnel: ["discovery -> discovery", "Still needs a clear executive sponsor"],
    },
    {
      id: "ACC-009",
      opportunityId: "OPP-109",
      name: "GreenArc Infra",
      aliases: ["greenarc", "green arc"],
      owner: "Siya",
      stage: "evaluation",
      useCase: "competitive objection handling",
      competitor: "PitchPilot",
      risk: "competitor pressure and need for clearer differentiation",
      summary: "Buyer sees value but is comparing lightweight alternatives.",
      nextStep: "Run competitor comparison anchored on memory depth",
      amount: "INR 16L",
      decisionCriteria: "differentiation, team utility, rollout pace",
      calls: [
        ["2026-03-09", "GreenArc asked how this differs from prompt coaching tools.", "competitor comparison front and center", "competitor", "Send comparison note"],
        ["2026-03-20", "Manager wants to know if rep answers actually improve over time.", "compounding value is resonating", "trust", "Show learning loop"],
        ["2026-03-30", "Procurement asked for scoping clarity.", "needs tighter package", "price", "Refine package"],
      ],
      objections: [
        ["competitor", "Why not use a lighter prompt assistant instead?", "Differentiate on reusable institutional memory, not one-off prompt suggestions."],
        ["price", "Are we paying more for capability the team will not use?", "Frame rollout around one high-frequency workflow and measurable adoption."],
      ],
      funnel: ["discovery -> evaluation", "Buyer requested a clearer competitive comparison"],
    },
    {
      id: "ACC-010",
      opportunityId: "OPP-110",
      name: "HarborOne Realty",
      aliases: ["harborone", "harbor one"],
      owner: "Aarav",
      stage: "proposal",
      useCase: "real-estate presales memory",
      competitor: "status quo",
      risk: "founder wants proof the team will actually capture notes",
      summary: "Strong fit, but founder is skeptical about rep discipline.",
      nextStep: "Demo capture-light workflow using a real live deal",
      amount: "INR 13L",
      decisionCriteria: "founder adoption, low-friction capture, visibility",
      calls: [
        ["2026-03-12", "HarborOne loses deal notes across WhatsApp and spreadsheets.", "memory leak across team", "adoption", "Show capture flow"],
        ["2026-03-22", "Founder asked what happens if only 60 percent of calls get logged.", "partial adoption concern", "adoption", "Present realistic rollout"],
        ["2026-03-29", "Manager wants a dashboard of open objections by account.", "value visibility desired", "trust", "Share dashboard mockup"],
      ],
      objections: [
        ["adoption", "If the team only partly uses this, does the value collapse?", "Set expectation that the first win comes from a narrow workflow with manager visibility."],
        ["trust", "How do we know this becomes a habit and not a side project?", "Anchor on dashboard visibility and a strict 24-hour logging discipline for key events."],
      ],
      funnel: ["evaluation -> proposal", "Founder moved forward after seeing a realistic phased rollout"],
    },
    {
      id: "ACC-011",
      opportunityId: "OPP-111",
      name: "IonWave Robotics",
      aliases: ["ionwave", "ion wave"],
      owner: "Meera",
      stage: "evaluation",
      useCase: "technical objection memory for enterprise sales",
      competitor: "RevSense",
      risk: "feature-gap and integration concerns",
      summary: "Technical team likes the concept but wants stronger integration confidence.",
      nextStep: "Package integration answers and technical proof points",
      amount: "INR 21L",
      decisionCriteria: "integration, technical credibility, evidence",
      calls: [
        ["2026-03-14", "IonWave wants better reuse of technical objection answers.", "engineers repeat the same clarifications", "integration", "Map technical FAQ"],
        ["2026-03-24", "Prospect asked whether answers can cite approved technical docs.", "citation need is strong", "security, trust", "Show citation model"],
        ["2026-03-30", "SE lead asked for examples of objections resolved faster.", "needs practical proof", "timeline", "Share case examples"],
      ],
      objections: [
        ["integration", "Will this handle technical objection nuance without hallucinating?", "Lead with approved source citations, exact context retrieval, and constrained answer generation."],
        ["timeline", "How long until our team trusts the answers enough to use them live?", "Frame trust as earned through narrow use cases, citations, and feedback loops."],
      ],
      funnel: ["discovery -> evaluation", "Technical validation is now the key gate"],
    },
    {
      id: "ACC-012",
      opportunityId: "OPP-112",
      name: "Juniper Health",
      aliases: ["juniper health", "juniper"],
      owner: "Ishita",
      stage: "security review",
      useCase: "regulated objection intelligence",
      competitor: "status quo",
      risk: "privacy and access controls",
      summary: "The commercial team is ready, but compliance has tight data-boundary questions.",
      nextStep: "Answer privacy model and retention logic",
      amount: "INR 26L",
      decisionCriteria: "privacy, audit trail, governance",
      calls: [
        ["2026-03-13", "Juniper wants faster reuse of prior objection responses.", "knowledge buried in email and notes", "security", "Share architecture summary"],
        ["2026-03-25", "Compliance asked whether medical-adjacent commercial notes can be segmented.", "segmentation needed", "security", "Explain segmented collections"],
        ["2026-03-31", "Buyer asked for a retention model.", "needs governance detail", "security, trust", "Draft policy answer"],
      ],
      objections: [
        ["security", "Can different business units have different visibility rules?", "Yes, design around source permissions and scoped retrieval boundaries."],
        ["trust", "Will the system show where an answer came from every time?", "Citations and source traces should be a default part of the answer experience."],
      ],
      funnel: ["evaluation -> security review", "Compliance review opened after business approval"],
    },
    {
      id: "ACC-013",
      opportunityId: "OPP-113",
      name: "KiteStone Ventures",
      aliases: ["kitestone", "kite stone"],
      owner: "Kavya",
      stage: "negotiation",
      useCase: "investment-sales knowledge memory",
      competitor: "PitchPilot",
      risk: "price and value differentiation",
      summary: "Late stage, but finance lead is challenging value versus lightweight alternatives.",
      nextStep: "Send negotiation note with procurement-ready ROI framing",
      amount: "INR 34L",
      decisionCriteria: "ROI, procurement confidence, executive clarity",
      calls: [
        ["2026-03-07", "KiteStone wants founder-safe messaging for enterprise objections.", "internal consistency matters", "price", "Share enterprise narrative"],
        ["2026-03-18", "Finance asked why this costs more than a narrow coaching tool.", "value differentiation required", "price, competitor", "Send comparison sheet"],
        ["2026-03-29", "Champion wants a final exec summary.", "needs decision memo", "trust", "Prepare summary note"],
      ],
      objections: [
        ["price", "Why is this priced above lighter alternatives?", "Lead with the breadth of institutional memory captured and the downstream leverage across the team."],
        ["competitor", "What are we really getting beyond prompt suggestions?", "Differentiate on reusable context, source grounding, and compounding knowledge."],
      ],
      funnel: ["proposal -> negotiation", "Finance review is the final obstacle"],
    },
    {
      id: "ACC-014",
      opportunityId: "OPP-114",
      name: "LatticeGrid Telecom",
      aliases: ["latticegrid", "lattice grid"],
      owner: "Rohan",
      stage: "evaluation",
      useCase: "distributed sales objection retrieval",
      competitor: "RevSense",
      risk: "complex sales team and concern about answer consistency",
      summary: "They want a single standard answer layer across regional sales teams.",
      nextStep: "Show how brand-approved messaging can override stale call lore",
      amount: "INR 22L",
      decisionCriteria: "consistency, governance, team-wide quality",
      calls: [
        ["2026-03-09", "LatticeGrid wants regional teams aligned on enterprise responses.", "message inconsistency across teams", "trust", "Show standardization angle"],
        ["2026-03-19", "Leader asked if outdated rep habits would contaminate answers.", "source hierarchy matters", "trust, security", "Explain source priority"],
        ["2026-03-30", "Ops wants better visibility into repeated objections.", "needs analytics eventually", "adoption", "Show dashboard thought"],
      ],
      objections: [
        ["trust", "How do we stop stale rep habits from becoming the answer layer?", "Make source hierarchy explicit: approved GTM outranks anecdotal rep behavior."],
        ["adoption", "Can managers see what objections are repeating across teams?", "Yes, capture structured objection rows and surface them in one dashboard."],
      ],
      funnel: ["discovery -> evaluation", "Standardization use case is now well understood"],
    },
    {
      id: "ACC-015",
      opportunityId: "OPP-115",
      name: "Meridian Foods",
      aliases: ["meridian foods", "meridian"],
      owner: "Ananya",
      stage: "proposal",
      useCase: "objection handling for channel sales",
      competitor: "status quo",
      risk: "channel partners may not follow process",
      summary: "Internal team likes it, but rollout beyond direct sales is uncertain.",
      nextStep: "Scope pilot to internal sales before partner rollout",
      amount: "INR 15L",
      decisionCriteria: "internal adoption first, repeatability, clear pilot scope",
      calls: [
        ["2026-03-10", "Meridian wants consistency across direct and partner channels.", "messaging differs too much", "adoption", "Scope internal-first pilot"],
        ["2026-03-20", "Buyer asked how partners would eventually access approved responses.", "future scope question", "trust", "Keep phase one narrow"],
        ["2026-03-30", "Sales head likes the objection library idea.", "value is clear internally", "adoption", "Draft pilot proposal"],
      ],
      objections: [
        ["adoption", "What if partners do not contribute data?", "Keep phase one focused on internal team memory and only expand once the core loop works."],
        ["trust", "Will the MVP still be useful if rollout starts narrower than the full org?", "Yes, narrow scope is a feature, not a weakness, at this stage."],
      ],
      funnel: ["evaluation -> proposal", "Team is aligned on an internal-first pilot"],
    },
    {
      id: "ACC-016",
      opportunityId: "OPP-116",
      name: "NorthSpring Ventures",
      aliases: ["northspring", "north spring"],
      owner: "Farah",
      stage: "discovery",
      useCase: "investment memos for sales calls",
      competitor: "PitchPilot",
      risk: "unclear budget and low urgency",
      summary: "Interesting use case, but budget owner is not active yet.",
      nextStep: "Quantify prep-time waste and involve budget owner",
      amount: "INR 10L",
      decisionCriteria: "urgency, budget alignment, call quality improvement",
      calls: [
        ["2026-03-15", "NorthSpring wants tighter prep before partner meetings.", "prep quality varies", "trust", "Show example call brief"],
        ["2026-03-26", "Lead said the value is clear but not urgent yet.", "urgency gap", "price", "Quantify current cost"],
        ["2026-03-31", "Budget owner still absent.", "sponsor missing", "price", "Secure stakeholder"],
      ],
      objections: [
        ["trust", "This makes sense, but why now?", "Quantify how much prep inefficiency and message inconsistency cost today."],
        ["price", "We should revisit once budgets reset.", "Offer a smaller proof-of-value pilot tied to one high-value workflow."],
      ],
      funnel: ["discovery -> discovery", "Budget owner not yet engaged"],
    },
    {
      id: "ACC-017",
      opportunityId: "OPP-117",
      name: "OrbitStack Commerce",
      aliases: ["orbitstack", "orbit stack"],
      owner: "Nihar",
      stage: "security review",
      useCase: "sales memory with brand governance",
      competitor: "RevSense",
      risk: "brand governance and permissioning",
      summary: "Marketing and sales both like the idea, but governance owners want clarity.",
      nextStep: "Map brand governance plus access policy",
      amount: "INR 23L",
      decisionCriteria: "brand consistency, access control, source traceability",
      calls: [
        ["2026-03-11", "OrbitStack wants one answer layer across SDRs and AEs.", "brand drift is a problem", "trust", "Show source hierarchy"],
        ["2026-03-22", "Marketing asked whether approved messaging can supersede old call history.", "brand governance central", "trust", "Lead with approval hierarchy"],
        ["2026-03-30", "Security asked how sensitive enterprise notes can be segmented.", "permission boundaries required", "security", "Document access scopes"],
      ],
      objections: [
        ["trust", "Can brand-approved messaging override what reps used to say?", "Yes, the system should prioritize approved GTM and treat old call behavior as secondary evidence."],
        ["security", "Can we segment sensitive notes by team and role?", "Yes, if retrieval follows source permissions and scoped collections."],
      ],
      funnel: ["evaluation -> security review", "Governance and access are the final blockers"],
    },
    {
      id: "ACC-018",
      opportunityId: "OPP-118",
      name: "Pinnacle Habitat",
      aliases: ["pinnacle habitat", "pinnacle"],
      owner: "Siya",
      stage: "proposal",
      useCase: "real estate presales and funnel memory",
      competitor: "status quo",
      risk: "team discipline and founder skepticism",
      summary: "Strong fit, but founder wants proof that the system will not become a dead archive.",
      nextStep: "Show the smallest operational loop with reporting",
      amount: "INR 14L",
      decisionCriteria: "habit formation, live utility, founder visibility",
      calls: [
        ["2026-03-12", "Pinnacle has the same problem as many real-estate teams: deal memory leaks fast.", "no shared account memory", "adoption", "Show operating loop"],
        ["2026-03-21", "Founder asked how this differs from a shared drive and disciplined notes.", "needs differentiation", "trust", "Emphasize retrieval and reuse"],
        ["2026-03-31", "Sales manager wants repeated objection visibility by project.", "dashboard demand", "adoption", "Show reporting concept"],
      ],
      objections: [
        ["trust", "Why is this better than just telling the team to save notes properly?", "Because the value comes from structured retrieval, cross-account patterning, and reusable answers, not storage alone."],
        ["adoption", "How do we keep the system alive after launch?", "Make manager-visible outputs and a strict small capture loop part of the rollout."],
      ],
      funnel: ["evaluation -> proposal", "Founder is closer to yes after seeing the operating loop"],
    },
  ];

  const categoryAssetMap = {
    price: {
      id: "MSG-005",
      topic: "pricing",
      title: "Procurement-ready ROI framing",
      message: "When price is the blocker, frame cost against avoided revenue leakage, manager time, and the compounding value of preserved sales memory.",
      proofPoints: [
        "One asset improves multiple reps and multiple future deals",
        "Institutional memory compounds while headcount remains linear",
        "Procurement responds better to payback framing than abstract productivity claims",
      ],
    },
    timeline: {
      id: "MSG-006",
      topic: "timeline",
      title: "Fastest path to first value",
      message: "Lead with the first useful workflow, not the final system. Show how value appears in days through one call summary, one objection log, and one dashboard view.",
      proofPoints: [
        "Week-one workflow is easier to buy than a multi-month transformation",
        "Visible early value reduces rollout anxiety",
        "Small launch scope creates trust",
      ],
    },
    integration: {
      id: "MSG-007",
      topic: "integration",
      title: "Works with the current stack",
      message: "Position the MVP as a layer that works with current tools and sources rather than a rip-and-replace program.",
      proofPoints: [
        "Lower switching risk",
        "Preserves current systems of record",
        "Supports phased adoption",
      ],
    },
    competitor: {
      id: "MSG-008",
      topic: "competitor",
      title: "Memory depth differentiation",
      message: "Differentiate the solution on reusable, source-backed institutional memory rather than one-off prompt assistance or static documentation.",
      proofPoints: [
        "Answers improve from accumulated records",
        "Cross-deal pattern recognition becomes possible",
        "Team quality rises even when individuals change",
      ],
    },
  };

  Object.values(categoryAssetMap).forEach((asset) => {
    if (!store.assets.some((existing) => existing.id === asset.id)) {
      store.assets.push(asset);
    }
  });

  const extraBattlecards = [
    {
      competitor: "status quo",
      talkTrack: "The alternative is not another tool. It is continued memory loss, repeated objections, and rep-specific knowledge that never compounds.",
    },
  ];

  extraBattlecards.forEach((card) => {
    if (!store.battlecards.some((existing) => existing.competitor === card.competitor)) {
      store.battlecards.push(card);
    }
  });

  accountSeeds.forEach((seed, index) => {
    store.accounts.push({
      id: seed.id,
      name: seed.name,
      aliases: seed.aliases,
      owner: seed.owner,
      stage: seed.stage,
      opportunityId: seed.opportunityId,
      useCase: seed.useCase,
      competitor: seed.competitor,
      risk: seed.risk,
      summary: seed.summary,
      nextStep: seed.nextStep,
    });

    store.opportunities.push({
      id: seed.opportunityId,
      accountId: seed.id,
      name: `${seed.name} expansion`,
      amount: seed.amount,
      decisionCriteria: seed.decisionCriteria,
      winProbability: ["35%", "45%", "55%", "65%", "75%"][index % 5],
    });

    seed.calls.forEach((call, callIndex) => {
      store.calls.push({
        id: `CALL-${seed.id.split("-")[1]}-${String(callIndex + 1).padStart(2, "0")}`,
        accountId: seed.id,
        date: call[0],
        summary: call[1],
        painPoints: call[2],
        objections: call[3],
        nextStep: call[4],
      });
    });

    seed.objections.forEach((objection, objectionIndex) => {
      store.objections.push({
        id: `OBJ-${seed.id.split("-")[1]}-${String(objectionIndex + 1).padStart(2, "0")}`,
        accountId: seed.id,
        category: objection[0],
        text: objection[1],
        strategy: objection[2],
        resolution: objectionIndex === 0 ? "open" : "partially resolved",
      });
    });

    store.funnelEvents.push({
      accountId: seed.id,
      date: seed.calls[seed.calls.length - 1][0],
      move: seed.funnel[0],
      reason: seed.funnel[1],
    });
  });
}

function seedInteriorPortfolioVolume(store) {
  const targetPerStage = 26;
  const stages = [
    "lead generated",
    "initial discussions",
    "site visit scheduled",
    "concept presentation",
    "quote shared",
    "pre-closing",
    "under construction",
    "handover completed",
  ];

  const stageBlueprint = {
    "lead generated": {
      previousStage: "lead generated",
      category: "price_quote",
      objection: "What is a realistic price range for a property like this in the current market?",
      strategy: "Anchor the conversation in project quality, location, builder credibility, and current market conditions rather than vague averages.",
      callSummary: "Lead entered the system through referral and is trying to understand realistic pricing and fit for a premium residential property.",
      painPoints: "price uncertainty and project comparison",
      nextStep: "Qualify budget, timeline, and preferred micro-market",
    },
    "initial discussions": {
      previousStage: "lead generated",
      category: "trust_accountability",
      objection: "Who stays accountable after this stage if we decide to move ahead?",
      strategy: "Lead with named ownership, communication cadence, and what support looks like through booking and post-booking coordination.",
      callSummary: "Client is in early discovery and is testing whether the firm feels trustworthy, thoughtful, and responsive enough to continue.",
      painPoints: "trust and fit evaluation",
      nextStep: "Deepen discovery and prepare for site visit",
    },
    "site visit scheduled": {
      previousStage: "initial discussions",
      category: "design_fit",
      objection: "How quickly will we get clarity after the site visit, and will it reflect what we actually need from the property?",
      strategy: "Set a clear follow-up timeline and explain the structured need-mapping process used during the visit.",
      callSummary: "Buyer agreed to a site visit and now wants confidence that the firm will understand the family’s real needs, commute, and upgrade priorities.",
      painPoints: "speed and fit understanding",
      nextStep: "Run site visit and capture buyer priorities",
    },
    "concept presentation": {
      previousStage: "site visit scheduled",
      category: "trust_accountability",
      objection: "How do we know the actual project quality and experience will match what is being presented here?",
      strategy: "Use site facts, current progress, builder context, and transparent comparisons to connect the presentation to reality.",
      callSummary: "Presentation has landed well, and the buyer is now testing how safely the firm can carry the project promise into a confident decision.",
      painPoints: "promise-to-reality confidence",
      nextStep: "Refine the shortlist and align it to budget",
    },
    "quote shared": {
      previousStage: "concept presentation",
      category: "price_quote",
      objection: "Why is this property priced above another option that looks similar on paper?",
      strategy: "Use transparent comparisons on location, builder, inventory quality, project progress, and commercial structure rather than defending price alone.",
      callSummary: "The buyer has the first formal commercial proposal in hand and is now comparing pricing and value across nearby options.",
      painPoints: "value comparison and quote shock",
      nextStep: "Walk client through the commercial comparison line by line",
    },
    "pre-closing": {
      previousStage: "quote shared",
      category: "payment_plan",
      objection: "How will payment milestones and booking steps be handled once we say yes?",
      strategy: "Show commercial clarity, payment structure, and milestone logic before asking for closure.",
      callSummary: "Client prefers the firm overall and is now working through the final commercial and trust questions before booking.",
      painPoints: "final commercial comfort",
      nextStep: "Close on price, payment plan, and booking date",
    },
    "under construction": {
      previousStage: "pre-closing",
      category: "timeline_delivery",
      objection: "How are you managing timeline risk now that the project is live on site?",
      strategy: "Use milestone updates, dependency communication, and proactive issue flagging to maintain trust.",
      callSummary: "Project is active on site and the client is focused on possession clarity, quality checks, and builder accountability.",
      painPoints: "site coordination and possession confidence",
      nextStep: "Send milestone update and next documentation checkpoint",
    },
    "handover completed": {
      previousStage: "under construction",
      category: "post_handover_support",
      objection: "What support do we get after possession if small issues appear?",
      strategy: "Frame after-sales support and issue resolution as part of the premium service promise, not an afterthought.",
      callSummary: "Project is complete and the conversation has shifted to after-sales support, issue resolution, and referral readiness.",
      painPoints: "aftercare and retention",
      nextStep: "Complete post-possession check-in and referral ask",
    },
  };

  const localities = ["Whitefield", "Sarjapur Road", "Varthur", "Hebbal", "Yelahanka", "Bellandur", "Electronic City", "Jakkur"];
  const developments = [
    "Prestige Lakeside Habitat",
    "Brigade Cornerstone Utopia",
    "Assetz Marq",
    "Prestige Waterford",
    "Sobha Neopolis",
    "Godrej Park Retreat",
    "Birla Alokya",
    "Total Environment In That Quiet Earth",
    "Adarsh Palm Retreat",
    "Prestige City",
    "Birla Trimaya",
    "Godrej Woodscapes",
    "Brigade Calista",
    "Sobha Dream Gardens",
    "Assetz 63 Degree East",
    "Prestige Elm Park",
  ];
  const unitTypes = ["2BHK", "3BHK", "3.5BHK", "4BHK", "Villa", "Villament"];
  const projectCodes = ["Cedar", "Elan", "Mira", "Solace", "Aster", "Haven", "Meadow", "Terra", "Vale", "Niva", "Noor", "Opal", "Rune", "Aura", "Oak", "Drift", "Bloom", "Ember", "Sienna", "Verve", "Aurum", "Luna", "Sage", "Iris", "Trove", "Linea"];
  const owners = ["Aarav", "Meera", "Ishita", "Kavya", "Rohan", "Ananya", "Farah", "Nihar", "Siya"];
  const competitors = ["Livspace", "Bonito", "Carafina", "The KariGhars", "local boutique", "local contractor"];
  const amountPool = ["INR 20L", "INR 22L", "INR 24L", "INR 26L", "INR 28L", "INR 30L", "INR 32L", "INR 35L", "INR 38L", "INR 42L", "INR 45L", "INR 48L", "INR 50L"];
  const decisionCriteriaMap = {
    "lead generated": "budget fit, micro-market fit, project quality",
    "initial discussions": "trust, responsiveness, project fit",
    "site visit scheduled": "consultation quality, property fit, speed",
    "concept presentation": "project confidence, practicality, builder quality",
    "quote shared": "price clarity, payment comfort, value comparison",
    "pre-closing": "commercial clarity, accountability, schedule confidence",
    "under construction": "timeline visibility, builder quality, client communication",
    "handover completed": "after-sales support, issue response, referral confidence",
  };

  let nextAccountNumber = Math.max(...store.accounts.map((item) => Number(item.id.split("-")[1]))) + 1;
  let nextOpportunityNumber = Math.max(...store.opportunities.map((item) => Number(item.id.split("-")[1]))) + 1;

  stages.forEach((stage, stageIndex) => {
    const currentCount = store.accounts.filter((item) => item.stage === stage).length;
    const needed = Math.max(0, targetPerStage - currentCount);

    for (let i = 0; i < needed; i += 1) {
      const sequence = nextAccountNumber + i;
      const accountId = `ACC-${String(sequence).padStart(3, "0")}`;
      const opportunityId = `OPP-${String(nextOpportunityNumber + i).padStart(3, "0")}`;
      const projectCode = projectCodes[(sequence + stageIndex) % projectCodes.length];
      const development = developments[(sequence + stageIndex) % developments.length];
      const unitType = unitTypes[(sequence + stageIndex) % unitTypes.length];
      const locality = localities[(sequence + stageIndex) % localities.length];
      const owner = owners[(sequence + stageIndex) % owners.length];
      const competitor = competitors[(sequence + stageIndex) % competitors.length];
      const blueprint = stageBlueprint[stage];
      const projectName = `Project ${projectCode} - ${development} ${unitType}`;
      const amount = amountPool[(sequence + stageIndex) % amountPool.length];
      const date = `2026-03-${String(((sequence + stageIndex) % 25) + 1).padStart(2, "0")}`;

      store.accounts.push({
        id: accountId,
        name: projectName,
        aliases: [projectCode.toLowerCase(), development.toLowerCase()],
        owner,
        stage,
        opportunityId,
        useCase: `${unitType} residential opportunity in ${locality}`,
        competitor,
        risk: blueprint.painPoints,
        summary: `${development} ${unitType} project in ${locality}. ${blueprint.callSummary}`,
        nextStep: blueprint.nextStep,
      });

      store.opportunities.push({
        id: opportunityId,
        accountId,
        name: `${development} • ${unitType} opportunity`,
        amount,
        decisionCriteria: decisionCriteriaMap[stage],
        winProbability: stage === "handover completed" ? "100%" : ["28%", "36%", "44%", "52%", "61%", "72%", "100%"][(sequence + stageIndex) % 7],
      });

      store.calls.push({
        id: `CALL-${String(sequence).padStart(3, "0")}-01`,
        accountId,
        date,
        summary: blueprint.callSummary,
        painPoints: blueprint.painPoints,
        objections: blueprint.category,
        nextStep: blueprint.nextStep,
      });

      store.objections.push({
        id: `OBJ-${String(sequence).padStart(3, "0")}-01`,
        accountId,
        category: blueprint.category,
        text: blueprint.objection,
        strategy: blueprint.strategy,
        resolution: stage === "handover completed" ? "resolved" : "open",
      });

      store.funnelEvents.push({
        accountId,
        date,
        move: `${blueprint.previousStage} -> ${stage}`,
        reason: blueprint.nextStep,
      });
    }

    nextAccountNumber += needed;
    nextOpportunityNumber += needed;
  });
}
