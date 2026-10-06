import { deskAuthorised } from "@/lib/desk/auth";
import { loadBriefs, loadDataset } from "@/lib/desk/store";
import { datasetStats } from "@/lib/engine/stats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!deskAuthorised(req)) return Response.json({ error: "Passcode required." }, { status: 401 });
  const ds = await loadDataset();
  return Response.json({
    dataset: ds ? { meta: ds.meta, stats: datasetStats(ds), properties: ds.properties } : null,
    briefs: await loadBriefs(),
    delivery: process.env.BRIEF_DELIVERY || "console",
  });
}
