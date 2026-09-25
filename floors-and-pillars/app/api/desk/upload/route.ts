import { deskAuthorised } from "@/lib/desk/auth";
import { saveDataset } from "@/lib/desk/store";
import { readWorkbook } from "@/lib/engine/excel";
import { normaliseWorkbook } from "@/lib/engine/normalize";
import { datasetStats } from "@/lib/engine/stats";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!deskAuthorised(req)) return Response.json({ error: "Passcode required." }, { status: 401 });
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File) || !/\.xlsx$/i.test(file.name)) return Response.json({ error: "Attach an .xlsx workbook." }, { status: 400 });
  if (file.size > 10 * 1024 * 1024) return Response.json({ error: "File is larger than 10 MB." }, { status: 413 });
  try {
    const ds = normaliseWorkbook(await readWorkbook(await file.arrayBuffer()), file.name);
    if (!ds.properties.length) return Response.json({ error: "No property rows found." }, { status: 422 });
    const persisted = await saveDataset(ds);
    return Response.json({ stats: datasetStats(ds), meta: ds.meta, persisted });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Could not read the workbook." }, { status: 422 });
  }
}
