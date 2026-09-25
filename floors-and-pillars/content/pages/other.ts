export const bengaluruPage = {
  meta: { title: "Bengaluru, understood", description: "How we think about Bengaluru's residential markets — by how people live, not only by price." },
  title: "Bengaluru, understood.",
  intro:
    "Price per square foot tells you very little about a neighbourhood. We know the city by how people live in it — the school run, the commute, the weekend, the quiet streets and the ones that never are.",
  indexTitle: "Micro-markets",
  guide: {
    whoItSuits: "Who it suits",
    character: "The character of the place",
    priceBands: "Price bands by configuration",
    notable: "Notable developments",
    infrastructure: "Infrastructure to watch",
    drawbacks: "Honest drawbacks",
    homes: "Homes we're watching here",
    noHomes: "Nothing in our collection here at the moment. Share a brief and we'll look for you.",
    cta: "Looking in this part of the city? Tell us what you need.",
  },
};

export const journalPage = {
  meta: { title: "Journal", description: "Notes on buying well in Bengaluru, from the Floors & Pillars advisors." },
  title: "Journal.",
  intro: "Notes on buying well in Bengaluru — what to look for, what to question, and what the brochures leave out.",
  empty: "The first articles are in preparation.",
  minRead: (n: number) => `${n} min read`,
  by: "By",
  related: "Related reading",
  softCta: "If this sounds like the home you're after,",
  softCtaLink: "tell us what you're looking for.",
};

export const aboutPage = {
  meta: { title: "About", description: "Why Floors & Pillars, how we approach advisory, and the people you'll speak to." },
  title: "Why Floors & Pillars.",
  name: "Floors for the homes we live in. Pillars for what holds them up: foundation, permanence, trust.",
  approachTitle: "Our approach",
  principles: [
    { name: "Curation over inventory", text: "We would rather show you four homes worth your weekend than forty that aren't." },
    { name: "Honesty over enthusiasm", text: "Every home has trade-offs. We tell you what they are before you visit, not after you've paid." },
    { name: "Your brief, not our mandates", text: "What we recommend starts with what you asked for." },
  ],
  advisorsTitle: "The people you'll speak to",
  cta: { title: "Start with a conversation.", label: "Talk to an Advisor" },
};

export const contactPage = {
  meta: { title: "Contact", description: "Reach Floors & Pillars by phone, WhatsApp or email, or share your brief." },
  title: "Contact.",
  intro: "The most useful way to start is to share your brief — it lets an advisor come prepared. If you'd rather simply talk, reach us below.",
  briefLink: "Share your brief",
  details: { phone: "Phone", whatsapp: "WhatsApp", email: "Email", address: "Office", hours: "Hours" },
  form: {
    title: "Send a short message",
    name: "Name",
    phone: "Phone",
    message: "Message",
    submit: "Send message",
    sending: "Sending…",
    sent: "Thank you — we'll be in touch.",
    error: "We couldn't send that just now. Please try again, or share your brief instead.",
  },
};

export const legalBanner = "Draft, pending legal review.";
