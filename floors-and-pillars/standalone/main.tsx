/**
 * Single-file demo shell. Pages are pre-rendered HTML captured from the production build;
 * the interactive parts are mounted over them as React "islands" with the same components
 * the site uses. Briefs and messages stay in this browser (localStorage).
 */
import { createRoot, type Root } from "react-dom/client";
import BriefForm from "@/components/brief/BriefForm";
import CollectionMatches from "@/components/brief/CollectionMatches";
import BriefTeaser from "@/components/home/BriefTeaser";
import HomesGrid from "@/components/homes/HomesGrid";
import ContactForm from "@/components/layout/ContactForm";
import Header from "@/components/layout/Header";
import MobileBriefBar from "@/components/layout/MobileBriefBar";
import { thankYouPage } from "@/content/pages/brief";
import { draftFromParams } from "@/lib/brief/prefill";
import type { HomeMeta, Market } from "@/lib/content/schemas";
import data from "./.generated/data.json";
import { currentUrl, navigate, subscribe } from "./router";

declare global {
  interface Window {
    __FP_PAGES__: Record<string, { title: string; html: string }>;
  }
}

const homes = data.homes as HomeMeta[];
const markets = data.markets as Market[];
const marketNames = Object.fromEntries(markets.map((m) => [m.slug, m.name]));
const DEMO_KEY = "fp-demo-submissions";

// ── Stand-in API: keep submissions in this browser ─────────────────────────────
const realFetch = window.fetch.bind(window);
window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (url === "/api/brief" || url === "/api/contact") {
    const body = JSON.parse(String(init?.body ?? "{}"));
    if (body.website) return Response.json({ ok: true }); // honeypot
    if (url === "/api/contact") {
      const errors: Record<string, string> = {};
      if (!String(body.name ?? "").trim()) errors.name = "Please tell us your name.";
      if (!String(body.phone ?? "").trim()) errors.phone = "Enter a valid phone number.";
      if (!String(body.message ?? "").trim()) errors.message = "Please add a short message.";
      if (Object.keys(errors).length) return Response.json({ errors }, { status: 422 });
    }
    try {
      const all = JSON.parse(localStorage.getItem(DEMO_KEY) ?? "[]");
      all.unshift({ kind: url.slice(5), receivedAt: new Date().toISOString(), ...body });
      localStorage.setItem(DEMO_KEY, JSON.stringify(all));
    } catch {
      /* demo only */
    }
    console.info(`[demo] ${url} received`, body);
    return Response.json({ ok: true });
  }
  return realFetch(input, init);
};

// ── Page rendering ───────────────────────────────────────────────────────────
const main = document.getElementById("main")!;
let islands: Root[] = [];

function mount(el: Element | null | undefined, node: React.ReactNode) {
  if (!el) return;
  el.replaceChildren();
  const root = createRoot(el);
  root.render(node);
  islands.push(root);
}

function reveal() {
  const els = main.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) return els.forEach((e) => e.classList.add("is-visible"));
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("is-visible"), io.unobserve(e.target))),
    { rootMargin: "0px 0px -8% 0px" },
  );
  els.forEach((e) => io.observe(e));
}

function render() {
  const { path, search } = currentUrl();
  const page = window.__FP_PAGES__[path] ?? window.__FP_PAGES__["/404"];
  islands.forEach((r) => r.unmount());
  islands = [];
  main.innerHTML = page.html;
  document.title = page.title;
  window.scrollTo(0, 0);

  if (path === "/") {
    mount(main.querySelector('form[aria-labelledby="teaser-title"]')?.parentElement, <BriefTeaser />);
  }
  if (path === "/brief") {
    const params = Object.fromEntries(new URLSearchParams(search));
    const draft = draftFromParams(params, markets.map((m) => m.slug));
    const home = homes.find((h) => h.slug === draft.home);
    mount(
      main.querySelector('form[action="/api/brief"]')?.parentElement,
      <BriefForm initial={{ ...draft, home: home?.slug }} markets={markets} homeName={home?.name} />,
    );
  }
  if (path === "/brief/thank-you") {
    const anchor = main.querySelector('section[aria-labelledby="next-title"]');
    if (anchor) {
      const slot = document.createElement("div");
      anchor.after(slot);
      mount(slot, <CollectionMatches homes={homes} markets={markets} title={thankYouPage.matchesTitle} intro={thankYouPage.matchesIntro} />);
    }
  }
  if (path === "/homes") {
    mount(main.querySelector("ul.grid")?.parentElement, <HomesGrid homes={homes} marketNames={marketNames} />);
  }
  if (path === "/contact") {
    mount(main.querySelector('form[aria-labelledby="contact-form-title"]')?.parentElement, <ContactForm />);
  }
  reveal();
}

// Internal links inside the pre-rendered pages ("/homes") become hash routes.
document.addEventListener("click", (e) => {
  const a = (e.target as Element).closest?.("a");
  if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
  const href = a.getAttribute("href") ?? "";
  if (href.startsWith("/") && !href.startsWith("//")) {
    e.preventDefault();
    navigate(href);
  } else if (href.startsWith("#") && !href.startsWith("#/")) {
    e.preventDefault();
    document.getElementById(href.slice(1))?.focus?.();
    document.getElementById(href.slice(1))?.scrollIntoView();
  }
});

createRoot(document.getElementById("fp-header")!).render(<Header />);
createRoot(document.getElementById("fp-mobilebar")!).render(<MobileBriefBar />);
subscribe(render);
render();
