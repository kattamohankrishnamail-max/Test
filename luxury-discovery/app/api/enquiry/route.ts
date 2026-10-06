import { addEnquiry } from "@/lib/store";

export const runtime = "nodejs";

const str = (v: unknown, max: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = str(body?.name, 120);
  const phone = str(body?.phone, 40);
  const email = str(body?.email, 160);
  if (!name || (!phone && !email)) {
    return Response.json({ error: "Please share your name and a phone number or email." }, { status: 400 });
  }
  const ids = Array.isArray(body?.propertyIds) ? body.propertyIds.filter((x: unknown) => typeof x === "string").slice(0, 20) : [];
  const names = Array.isArray(body?.propertyNames) ? body.propertyNames.filter((x: unknown) => typeof x === "string").slice(0, 20) : [];
  await addEnquiry({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name,
    phone,
    email,
    message: str(body?.message, 2000),
    propertyIds: ids,
    propertyNames: names,
    brief: str(body?.brief, 2000),
  });
  return Response.json({ ok: true });
}
