"use client";

import { track } from "@/lib/analytics";

/** Renders a wa.me link once a real number is configured; plain text while it's a placeholder. */
export default function WhatsAppLink({ number }: { number: string }) {
  const digits = number.replace(/[^\d]/g, "");
  if (number.includes("[[") || digits.length < 8) return <span>{number}</span>;
  return (
    <a href={`https://wa.me/${digits}`} className="link" target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { location: "contact" })}>
      {number}
    </a>
  );
}
