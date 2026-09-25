"use client";

import { useState, useSyncExternalStore } from "react";
import { contactPage } from "@/content/pages/other";
import { HONEYPOT_FIELD } from "@/lib/brief/honeypot";

const subscribe = () => () => {};

export default function ContactForm({ initialState }: { initialState?: "sent" | "error" }) {
  const copy = contactPage.form;
  const enhanced = useSyncExternalStore(subscribe, () => true, () => false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(initialState ?? "idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!enhanced) return;
    e.preventDefault();
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) }).catch(() => null);
    const body = res ? await res.json().catch(() => null) : null;
    if (res?.ok) return setState("sent");
    setErrors(body?.errors ?? {});
    setState(body?.errors ? "idle" : "error");
  };

  if (state === "sent") {
    return (
      <p role="status" className="display-sm bg-white p-8">
        {copy.sent}
      </p>
    );
  }

  const field = (name: "name" | "phone" | "message", label: string, type = "text") => (
    <div>
      <label htmlFor={`c-${name}`} className="text-[0.95rem] font-medium text-ink">
        {label}
      </label>
      {name === "message" ? (
        <textarea id={`c-${name}`} name={name} rows={4} required aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `c-${name}-e` : undefined} className="mt-2 w-full border border-line bg-white px-4 py-3 focus:border-ink focus:outline-none" />
      ) : (
        <input id={`c-${name}`} name={name} type={type} required autoComplete={name === "name" ? "name" : "tel"} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `c-${name}-e` : undefined} className="mt-2 min-h-12 w-full border border-line bg-white px-4 focus:border-ink focus:outline-none" />
      )}
      {errors[name] && (
        <p id={`c-${name}-e`} className="mt-2 text-[0.9rem] text-[#8a3a2b]">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <form method="post" action="/api/contact" onSubmit={submit} noValidate={enhanced} className="space-y-6" aria-labelledby="contact-form-title">
      <h2 id="contact-form-title" className="display-md">
        {copy.title}
      </h2>
      <div aria-hidden="true" className="absolute left-[-10000px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      {field("name", copy.name)}
      {field("phone", copy.phone, "tel")}
      {field("message", copy.message)}
      {state === "error" && (
        <p role="alert" className="text-[0.95rem] text-[#8a3a2b]">
          {copy.error}
        </p>
      )}
      <button type="submit" disabled={state === "sending"} className="inline-flex min-h-12 items-center bg-ink px-8 text-limestone hover:bg-verdigris disabled:opacity-60">
        {state === "sending" ? copy.sending : copy.submit}
      </button>
    </form>
  );
}
