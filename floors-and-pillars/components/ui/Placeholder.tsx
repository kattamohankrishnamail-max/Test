/**
 * Neutral image placeholder: a limestone block at the right aspect ratio with a visible caption.
 * Swap for next/image once real photography exists (see README → Images).
 */
export default function Placeholder({
  label,
  ratio = "4/3",
  className = "",
  tone = "light",
}: {
  label: string;
  ratio?: string;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      role="img"
      aria-label={`Image placeholder: ${label}`}
      className={`relative flex w-full items-end overflow-hidden ${tone === "dark" ? "bg-[#2b2925]" : "bg-limestone-deep"} ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <span className={`m-4 text-xs tracking-wide ${tone === "dark" ? "text-limestone/80" : "text-stone"}`}>[[PLACEHOLDER: {label}]]</span>
    </div>
  );
}
