import { adminRequired, isAdmin } from "@/lib/admin-auth";
import { datasetStats } from "@/lib/stats";
import { loadDataset, loadEnquiries } from "@/lib/store";
import { llmEnabled } from "@/lib/llm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdmin(req)) return Response.json({ error: "Admin passcode required.", passcodeRequired: true }, { status: 401 });
  const ds = await loadDataset();
  return Response.json({
    passcodeRequired: adminRequired(),
    aiExtraction: llmEnabled(),
    dataset: ds ? { meta: ds.meta, stats: datasetStats(ds) } : null,
    enquiries: await loadEnquiries(),
  });
}
