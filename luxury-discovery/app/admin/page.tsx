"use client";

import { useCallback, useEffect, useState } from "react";
import { BRAND } from "@/lib/brand";
import { Button } from "@/components/ui";
import type { DatasetMeta } from "@/lib/types";
import type { Enquiry } from "@/lib/store";

interface Stats {
  total: number;
  visible: number;
  hiddenByStatus: number;
  soldOut: number;
  apartments: number;
  villas: number;
  byProduct: [string, number][];
  byZone: [string, number][];
}

interface AdminData {
  passcodeRequired: boolean;
  aiExtraction: boolean;
  dataset: { meta: DatasetMeta; stats: Stats } | null;
  enquiries: Enquiry[];
}

const PASS_KEY = "rd-admin-passcode";

export default function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [needsPasscode, setNeedsPasscode] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [dragging, setDragging] = useState(false);

  const headers = useCallback((code: string) => (code ? { "x-admin-passcode": code } : undefined), []);

  const load = useCallback(
    async (code: string) => {
      const res = await fetch("/api/admin", { headers: headers(code) });
      if (res.status === 401) {
        setNeedsPasscode(true);
        return;
      }
      setNeedsPasscode(false);
      setData(await res.json());
    },
    [headers],
  );

  useEffect(() => {
    let saved = "";
    try {
      saved = sessionStorage.getItem(PASS_KEY) ?? "";
    } catch {
      /* ignore */
    }
    setPasscode(saved);
    load(saved);
  }, [load]);

  const upload = async (file: File) => {
    setUploading(true);
    setMessage(null);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/properties", { method: "POST", body: form, headers: headers(passcode) }).catch(() => null);
    const body = await res?.json().catch(() => null);
    setUploading(false);
    if (!res?.ok) {
      setMessage({ kind: "error", text: body?.error ?? "Upload failed." });
      return;
    }
    setMessage({
      kind: "ok",
      text: `Loaded ${body.stats.total} properties from “${file.name}”.${body.persisted ? "" : " (Held in memory only — the server filesystem is read-only.)"}`,
    });
    load(passcode);
  };

  const unlock = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      sessionStorage.setItem(PASS_KEY, passcode);
    } catch {
      /* ignore */
    }
    load(passcode);
  };

  const ds = data?.dataset;

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-6 py-10 sm:px-10">
      <header className="flex items-center justify-between">
        <a href="/" className="font-serif text-2xl">
          {BRAND.name}
        </a>
        <span className="eyebrow">Admin · Demo</span>
      </header>

      {needsPasscode ? (
        <form onSubmit={unlock} className="mx-auto mt-24 max-w-sm text-center">
          <h1 className="font-serif text-4xl">Admin access</h1>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Passcode"
            className="mt-8 w-full rounded-full border border-line bg-paper px-5 py-3 focus:border-ink focus:outline-none"
          />
          <Button type="submit" className="mt-4 w-full">
            Continue
          </Button>
        </form>
      ) : (
        <>
          <section className="mt-14">
            <h1 className="font-serif text-5xl">Property database</h1>
            <p className="mt-3 max-w-2xl text-ink-soft">
              Upload an Excel workbook (.xlsx) of your inventory. Column names don&apos;t need to be exact — we map common headers like
              “Project”, “Micro-market”, “Configuration”, “Price min (₹ Cr)” automatically. Uploading again replaces the current database.
            </p>

            <label
              onDragOver={(e) => (e.preventDefault(), setDragging(true))}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const f = e.dataTransfer.files[0];
                if (f) upload(f);
              }}
              className={`mt-8 flex cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed px-6 py-14 text-center transition ${
                dragging ? "border-ink bg-paper" : "border-stone/50 bg-paper/50 hover:border-ink"
              }`}
            >
              <span className="font-serif text-2xl">{uploading ? "Reading workbook…" : ds ? "Replace property database" : "Upload property database"}</span>
              <span className="mt-2 text-sm text-stone">Drop an .xlsx file here, or click to choose</span>
              <input
                type="file"
                accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className="sr-only"
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) upload(f);
                  e.target.value = "";
                }}
              />
            </label>
            {message && (
              <p className={`mt-4 text-sm ${message.kind === "ok" ? "text-forest" : "text-[#9a3b2e]"}`} role="status">
                {message.text}
              </p>
            )}
          </section>

          {ds && (
            <section className="mt-16 grid gap-10 md:grid-cols-[1.1fr_1fr]">
              <div className="rounded-[28px] border border-line bg-paper p-8">
                <p className="eyebrow">Current database</p>
                <p className="mt-2 break-all text-sm text-ink-soft">
                  {ds.meta.fileName} · sheet “{ds.meta.mapping.sheetName}” · uploaded {new Date(ds.meta.uploadedAt).toLocaleString("en-IN")}
                </p>
                <p className="mt-8 font-serif text-6xl">{ds.stats.total}</p>
                <p className="text-sm text-stone">properties loaded</p>
                <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
                  <Stat label="Apartments" value={ds.stats.apartments} />
                  <Stat label="Villas & row houses" value={ds.stats.villas} />
                  <Stat label="Shown to clients" value={ds.stats.visible} />
                  <Stat label="Hidden (sold out / excluded)" value={ds.stats.soldOut + ds.stats.hiddenByStatus} />
                </dl>
                <p className="eyebrow mt-10">Locations</p>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {ds.stats.byZone.map(([z, n]) => (
                    <li key={z} className="flex justify-between border-b border-line/70 pb-1.5">
                      <span>{z}</span>
                      <span className="text-stone">{n}</span>
                    </li>
                  ))}
                </ul>
                <p className="eyebrow mt-10">Requirement extraction</p>
                <p className="mt-2 text-sm text-ink-soft">
                  {data?.aiExtraction ? "Rule-based + Claude (ANTHROPIC_API_KEY set)" : "Rule-based (set ANTHROPIC_API_KEY to add AI extraction)"}
                </p>
              </div>

              <div className="space-y-8">
                <div className="rounded-[28px] border border-line bg-paper p-8">
                  <p className="eyebrow">Column mapping</p>
                  <ul className="mt-4 space-y-1.5 text-sm">
                    {ds.meta.mapping.mapped.map((m) => (
                      <li key={m.field} className="flex justify-between gap-4">
                        <span className="text-stone">{m.field}</span>
                        <span className="text-right">{m.column}</span>
                      </li>
                    ))}
                  </ul>
                  {ds.meta.mapping.unmapped.length > 0 && (
                    <p className="mt-5 text-xs leading-relaxed text-stone">
                      Not used for matching: {ds.meta.mapping.unmapped.join(", ")}
                    </p>
                  )}
                </div>
                {ds.meta.warnings.length > 0 && (
                  <div className="rounded-[28px] bg-brass-soft/60 p-8 text-sm">
                    <p className="eyebrow">Data notes</p>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-ink-soft">
                      {ds.meta.warnings.map((w) => (
                        <li key={w}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          <section className="mt-16 pb-20">
            <h2 className="font-serif text-3xl">Advisor enquiries</h2>
            {!data?.enquiries.length ? (
              <p className="mt-3 text-sm text-stone">No enquiries yet.</p>
            ) : (
              <ul className="mt-6 space-y-4">
                {data.enquiries.map((e) => (
                  <li key={e.id} className="rounded-2xl border border-line bg-paper p-6 text-sm">
                    <div className="flex flex-wrap justify-between gap-2">
                      <span className="font-medium">{e.name}</span>
                      <span className="text-stone">{new Date(e.createdAt).toLocaleString("en-IN")}</span>
                    </div>
                    <p className="mt-1 text-ink-soft">{[e.phone, e.email].filter(Boolean).join(" · ")}</p>
                    {e.propertyNames.length > 0 && <p className="mt-3">Homes: {e.propertyNames.join(", ")}</p>}
                    {e.brief && <p className="mt-2 italic text-ink-soft">“{e.brief}”</p>}
                    {e.message && <p className="mt-2 text-ink-soft">{e.message}</p>}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-stone">{label}</dt>
      <dd className="font-serif text-3xl">{value}</dd>
    </div>
  );
}
