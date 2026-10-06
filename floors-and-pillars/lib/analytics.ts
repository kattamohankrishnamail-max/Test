/**
 * Provider-agnostic analytics. Nothing is sent anywhere until a handler is registered
 * with `setAnalyticsHandler` (e.g. in a client component that loads your vendor's SDK).
 */
export type AnalyticsEvent =
  | "brief_start"
  | "brief_step_complete"
  | "brief_submit"
  | "home_view"
  | "advisor_cta_click"
  | "whatsapp_click";

export type AnalyticsProps = Record<string, string | number | boolean | null | undefined>;
type Handler = (event: AnalyticsEvent, props: AnalyticsProps) => void;

let handler: Handler | null = null;

export function setAnalyticsHandler(h: Handler | null) {
  handler = h;
}

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}) {
  if (typeof window === "undefined") return;
  try {
    handler?.(event, props);
    window.dispatchEvent(new CustomEvent("fp:analytics", { detail: { event, props } }));
    if (process.env.NODE_ENV === "development") console.debug("[track]", event, props);
  } catch {
    /* analytics must never break the page */
  }
}
