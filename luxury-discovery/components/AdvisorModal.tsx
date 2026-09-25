"use client";

import { useEffect, useState } from "react";
import { sendEnquiry } from "@/lib/client-api";
import type { Property } from "@/lib/types";
import { Button, CloseButton } from "./ui";

export default function AdvisorModal({
  properties,
  brief,
  onClose,
}: {
  properties: Property[];
  brief: string;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setState("sending");
    const err = await sendEnquiry({
      ...form,
      brief,
      propertyIds: properties.map((p) => p.id),
      propertyNames: properties.map((p) => p.projectName),
    });
    if (err) {
      setError(err);
      setState("idle");
      return;
    }
    setState("sent");
  };

  const input =
    "w-full border-b border-line bg-transparent py-3 text-ink placeholder:text-stone/70 focus:border-ink focus:outline-none";

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <button type="button" aria-label="Close" onClick={onClose} className="fade absolute inset-0 bg-ink/45 backdrop-blur-[2px]" />
      <div role="dialog" aria-modal="true" aria-label="Talk to an advisor" className="rise relative w-full max-w-lg rounded-t-[28px] bg-ivory p-8 sm:rounded-[28px] sm:p-10">
        <div className="absolute right-5 top-5">
          <CloseButton onClick={onClose} />
        </div>
        {state === "sent" ? (
          <div className="py-8 text-center">
            <p className="font-serif text-4xl">Thank you.</p>
            <p className="mx-auto mt-4 max-w-sm text-ink-soft">
              A private advisor will be in touch shortly to talk through {properties.length ? "your shortlist" : "your brief"}.
            </p>
            <Button className="mt-8" onClick={onClose}>
              Continue exploring
            </Button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <p className="eyebrow">Private advisory</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight">Talk to an advisor</h2>
            <p className="mt-3 text-sm text-ink-soft">
              {properties.length
                ? `We'll arrange a conversation about ${properties.length === 1 ? properties[0].projectName : `your ${properties.length} shortlisted homes`}.`
                : "Share how to reach you and we'll arrange a conversation."}
            </p>
            {properties.length > 1 && (
              <ul className="mt-4 space-y-1 text-sm text-stone">
                {properties.map((p) => (
                  <li key={p.id}>· {p.projectName}</li>
                ))}
              </ul>
            )}
            <div className="mt-6 space-y-2">
              <input className={input} placeholder="Your name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className={input} placeholder="Phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input className={input} placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <textarea
                className={`${input} resize-none`}
                rows={2}
                placeholder="Anything we should know? (optional)"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
            {error && <p className="mt-4 text-sm text-[#9a3b2e]">{error}</p>}
            <Button type="submit" className="mt-8 w-full" disabled={state === "sending"}>
              {state === "sending" ? "Sending…" : "Request a conversation"}
            </Button>
            <p className="mt-4 text-center text-xs text-stone">No obligation. Your details are shared only with our advisory team.</p>
          </form>
        )}
      </div>
    </div>
  );
}
