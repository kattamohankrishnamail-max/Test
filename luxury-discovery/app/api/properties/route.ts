import { isAdmin } from "@/lib/admin-auth";
import { readWorkbook } from "@/lib/excel";
import { normaliseWorkbook } from "@/lib/normalize";
import { datasetStats, publicProperties } from "@/lib/stats";
import { clearDataset, loadDataset, saveDataset } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 10 * 1024 * 1024;

export async function GET() {
  const ds = await loadDataset();
  if (!ds) return Response.json({ loaded: false, properties: [] });
  return Response.json({
    loaded: true,
    uploadedAt: ds.meta.uploadedAt,
    properties: publicProperties(ds),
  });
}

export async function POST(req: Request) {
  if (!isAdmin(req)) return Response.json({ error: "Admin passcode required." }, { status: 401 });
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return Response.json({ error: "Attach an .xlsx file as 'file'." }, { status: 400 });
  if (!/\.xlsx$/i.test(file.name)) return Response.json({ error: "Please upload an .xlsx workbook." }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ error: "File is larger than 10 MB." }, { status: 413 });

  try {
    const sheets = await readWorkbook(await file.arrayBuffer());
    const ds = normaliseWorkbook(sheets, file.name);
    if (!ds.properties.length) return Response.json({ error: "No property rows found in the workbook." }, { status: 422 });
    const { persisted } = await saveDataset(ds);
    return Response.json({ meta: ds.meta, stats: datasetStats(ds), persisted });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Could not read the workbook." }, { status: 422 });
  }
}

export async function DELETE(req: Request) {
  if (!isAdmin(req)) return Response.json({ error: "Admin passcode required." }, { status: 401 });
  await clearDataset();
  return Response.json({ ok: true });
}
