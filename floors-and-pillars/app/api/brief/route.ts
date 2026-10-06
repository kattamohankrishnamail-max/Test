import { briefPage } from "@/content/pages/brief";
import { OPEN_TO_SUGGESTIONS } from "@/content/options";
import { getHome, getMarkets } from "@/lib/content/load";
import { deliver, newBriefMeta } from "@/lib/brief/deliver";
import { HONEYPOT_FIELD, isBot } from "@/lib/brief/honeypot";
import { clientKey, rateLimit } from "@/lib/brief/rate-limit";
import { BriefSchema, fieldErrors, formDataToInput, normalisePhone } from "@/lib/brief/schema";

export const runtime = "nodejs";

/**
 * Accepts the brief as JSON (enhanced form) or as a native form POST (no JavaScript).
 * JSON callers get { ok } / { errors }; native posts get a 303 redirect.
 */
export async function POST(req: Request) {
  const isJson = (req.headers.get("content-type") ?? "").includes("application/json");
  const redirect = (path: string) => Response.redirect(new URL(path, req.url), 303);

  let fd: FormData | URLSearchParams;
  try {
    if (isJson) {
      const body = (await req.json()) as Record<string, unknown>;
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(body ?? {})) {
        if (Array.isArray(v)) v.forEach((x) => params.append(k, String(x)));
        else if (v !== undefined && v !== null) params.set(k, String(v));
      }
      fd = params;
    } else {
      fd = await req.formData();
    }
  } catch {
    return isJson ? Response.json({ error: "Invalid request." }, { status: 400 }) : redirect("/brief?error=invalid");
  }

  // Bots fill the hidden field: respond as if accepted, deliver nothing.
  if (isBot(fd.get(HONEYPOT_FIELD))) {
    return isJson ? Response.json({ ok: true }) : redirect("/brief/thank-you");
  }

  const limit = rateLimit(clientKey(req));
  if (!limit.ok) {
    return isJson
      ? Response.json({ error: briefPage.rateLimited }, { status: 429, headers: { "retry-after": String(limit.retryAfterSec) } })
      : redirect("/brief?error=rate");
  }

  const parsed = BriefSchema.safeParse(formDataToInput(fd));
  if (!parsed.success) {
    return isJson ? Response.json({ errors: fieldErrors(parsed.error) }, { status: 422 }) : redirect("/brief?error=invalid");
  }
  const brief = parsed.data;

  const markets = getMarkets();
  const validAreas = brief.areas.filter((a) => a === OPEN_TO_SUGGESTIONS || markets.some((m) => m.slug === a));
  if (!validAreas.length) {
    return isJson ? Response.json({ errors: { areas: "Choose at least one area." } }, { status: 422 }) : redirect("/brief?error=invalid");
  }
  const home = brief.home ? await getHome(brief.home) : null;

  try {
    await deliver({
      ...brief,
      ...newBriefMeta(),
      phone: normalisePhone(brief.phone) ?? brief.phone,
      areas: validAreas,
      home: home ? brief.home : undefined,
      homeName: home?.meta.name,
      areaNames: validAreas.filter((a) => a !== OPEN_TO_SUGGESTIONS).map((a) => markets.find((m) => m.slug === a)!.name),
    });
  } catch (e) {
    console.error("[brief] delivery failed", e);
    return isJson ? Response.json({ error: briefPage.serverError }, { status: 502 }) : redirect("/brief?error=delivery");
  }

  return isJson ? Response.json({ ok: true }) : redirect("/brief/thank-you");
}
