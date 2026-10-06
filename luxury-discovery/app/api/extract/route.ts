import { extractRequirements } from "@/lib/extract";
import { extractWithClaude, llmEnabled } from "@/lib/llm";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.slice(0, 4000) : "";
  const rules = extractRequirements(text);
  if (!text.trim() || !llmEnabled()) return Response.json({ requirements: rules, source: "rules" });
  const ai = await extractWithClaude(text, rules);
  return Response.json(ai ? { requirements: ai, source: "ai" } : { requirements: rules, source: "rules" });
}
