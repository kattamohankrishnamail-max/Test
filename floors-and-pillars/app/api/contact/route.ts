import { z } from "zod";
import { deliverMessage, newBriefMeta } from "@/lib/brief/deliver";
import { HONEYPOT_FIELD, isBot } from "@/lib/brief/honeypot";
import { clientKey, rateLimit } from "@/lib/brief/rate-limit";
import { fieldErrors, normalisePhone } from "@/lib/brief/schema";

export const runtime = "nodejs";

const ContactSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name.").max(120),
  phone: z.string().trim().refine((v) => normalisePhone(v) !== null, "Enter a valid phone number."),
  message: z.string().trim().min(2, "Please add a short message.").max(2000),
});

export async function POST(req: Request) {
  const isJson = (req.headers.get("content-type") ?? "").includes("application/json");
  const redirect = (p: string) => Response.redirect(new URL(p, req.url), 303);
  const input = isJson ? await req.json().catch(() => ({})) : Object.fromEntries((await req.formData().catch(() => new FormData())).entries());

  if (isBot(input[HONEYPOT_FIELD])) return isJson ? Response.json({ ok: true }) : redirect("/contact?sent=1");
  if (!rateLimit(`contact:${clientKey(req)}`).ok) {
    return isJson ? Response.json({ error: "Too many messages — please try again shortly." }, { status: 429 }) : redirect("/contact?error=1");
  }
  const parsed = ContactSchema.safeParse(input);
  if (!parsed.success) {
    return isJson ? Response.json({ errors: fieldErrors(parsed.error) }, { status: 422 }) : redirect("/contact?error=1");
  }
  try {
    await deliverMessage({ ...newBriefMeta(), ...parsed.data, phone: normalisePhone(parsed.data.phone)! });
  } catch (e) {
    console.error("[contact] delivery failed", e);
    return isJson ? Response.json({ error: "delivery" }, { status: 502 }) : redirect("/contact?error=1");
  }
  return isJson ? Response.json({ ok: true }) : redirect("/contact?sent=1");
}
