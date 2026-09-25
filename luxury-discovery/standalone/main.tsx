import { useState } from "react";
import { createRoot } from "react-dom/client";
import Discovery from "../components/Discovery.tsx";
import { Button, CloseButton } from "../components/ui.tsx";
import { BRAND } from "../lib/brand.ts";
import { readWorkbook } from "../lib/excel.ts";
import { normaliseWorkbook } from "../lib/normalize.ts";
import { datasetStats } from "../lib/stats.ts";
import type { Dataset } from "../lib/types.ts";
import { getDataset, getEnquiries, setDataset } from "./client-api.ts";

async function parseFile(file: File): Promise<Dataset> {
  if (!/\.xlsx$/i.test(file.name)) throw new Error("Please choose an .xlsx workbook.");
  const ds = normaliseWorkbook(await readWorkbook(await file.arrayBuffer()), file.name);
  if (!ds.properties.length) throw new Error("No property rows found in the workbook.");
  return ds;
}

function UploadScreen({ onLoaded }: { onLoaded: (ds: Dataset) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handle = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      onLoaded(await parseFile(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read the workbook.");
    }
    setBusy(false);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
      <p className="font-serif text-2xl">{BRAND.name}</p>
      <p className="eyebrow mt-1">{BRAND.tagline}</p>
      <h1 className="mt-16 font-serif text-5xl leading-tight">Load your property database</h1>
      <p className="mt-4 text-ink-soft">
        Choose the Excel workbook (.xlsx) with your inventory. It's read inside this page on your computer — nothing is uploaded anywhere. You only
        need to do this once; the page remembers it.
      </p>
      <label
        onDragOver={(e) => (e.preventDefault(), setDragging(true))}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handle(e.dataTransfer.files[0]);
        }}
        className={`mt-10 flex cursor-pointer flex-col items-center rounded-[28px] border border-dashed px-6 py-16 text-center transition ${
          dragging ? "border-ink bg-paper" : "border-stone/50 bg-paper/50 hover:border-ink"
        }`}
      >
        <span className="font-serif text-2xl">{busy ? "Reading workbook…" : "Choose Excel file"}</span>
        <span className="mt-2 text-sm text-stone">or drop it here</span>
        <input type="file" accept=".xlsx" className="sr-only" disabled={busy} onChange={(e) => handle(e.target.files?.[0])} />
      </label>
      {error && <p className="mt-4 text-sm text-[#9a3b2e]">{error}</p>}
    </div>
  );
}

function DataPanel({ ds, onReplace, onClose }: { ds: Dataset; onReplace: (ds: Dataset) => void; onClose: () => void }) {
  const stats = datasetStats(ds);
  const enquiries = getEnquiries();
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <button type="button" aria-label="Close" onClick={onClose} className="fade absolute inset-0 bg-ink/40" />
      <aside className="slide-in relative h-full w-full max-w-md overflow-y-auto bg-ivory p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="eyebrow">Property database</p>
            <p className="mt-2 font-serif text-5xl">{stats.total}</p>
            <p className="text-sm text-stone">properties loaded</p>
          </div>
          <CloseButton onClick={onClose} />
        </div>
        <p className="mt-4 break-all text-xs text-stone">
          {ds.meta.fileName} · sheet “{ds.meta.mapping.sheetName}” · loaded {new Date(ds.meta.uploadedAt).toLocaleString("en-IN")}
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
          {[
            ["Apartments", stats.apartments],
            ["Villas & row houses", stats.villas],
            ["Shown to clients", stats.visible],
            ["Hidden (sold out / excluded)", stats.soldOut + stats.hiddenByStatus],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-stone">{k}</dt>
              <dd className="font-serif text-2xl">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="eyebrow mt-8">Locations</p>
        <ul className="mt-2 space-y-1 text-sm">
          {stats.byZone.map(([z, n]) => (
            <li key={z} className="flex justify-between border-b border-line/70 pb-1">
              <span>{z}</span>
              <span className="text-stone">{n}</span>
            </li>
          ))}
        </ul>
        <label className="mt-8 inline-flex cursor-pointer rounded-full border border-ink/80 px-5 py-2.5 text-sm hover:bg-ink hover:text-paper">
          Replace Excel file
          <input
            type="file"
            accept=".xlsx"
            className="sr-only"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              try {
                onReplace(await parseFile(f));
              } catch (err) {
                setError(err instanceof Error ? err.message : "Could not read the workbook.");
              }
            }}
          />
        </label>
        {error && <p className="mt-3 text-sm text-[#9a3b2e]">{error}</p>}
        <p className="eyebrow mt-10">Advisor enquiries (this browser)</p>
        {enquiries.length === 0 ? (
          <p className="mt-2 text-sm text-stone">None yet.</p>
        ) : (
          <ul className="mt-3 space-y-3 text-sm">
            {enquiries.map((q) => (
              <li key={q.createdAt} className="rounded-2xl border border-line bg-paper p-4">
                <p className="font-medium">{q.name}</p>
                <p className="text-ink-soft">{[q.phone, q.email].filter(Boolean).join(" · ")}</p>
                {q.propertyNames.length > 0 && <p className="mt-1">Homes: {q.propertyNames.join(", ")}</p>}
                {q.brief && <p className="mt-1 italic text-ink-soft">“{q.brief}”</p>}
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}

function App() {
  const [ds, setDs] = useState<Dataset | null>(getDataset);
  const [panel, setPanel] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const load = (next: Dataset) => {
    const stored = setDataset(next);
    setNotice(stored ? null : "This browser wouldn't save the database, so you'll need to load it again next time you open the page.");
    setDs(next);
    setPanel(false);
  };

  if (!ds) return <UploadScreen onLoaded={load} />;
  return (
    <>
      {/* Re-mount on a new file so the page re-reads the collection. */}
      <Discovery key={ds.meta.uploadedAt} />
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-6 pb-10 text-xs text-stone sm:px-10">
        <span>
          {ds.meta.fileName} · {ds.properties.length} properties
        </span>
        <Button variant="ghost" className="!px-0 !py-0 text-xs" onClick={() => setPanel(true)}>
          Manage database & enquiries
        </Button>
        {notice && <span className="text-[#9a3b2e]">{notice}</span>}
      </div>
      {panel && <DataPanel ds={ds} onReplace={load} onClose={() => setPanel(false)} />}
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
