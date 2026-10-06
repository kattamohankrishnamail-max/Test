/**
 * Neutral image placeholder: a flat limestone block at the right proportion, captioned like
 * a figure in a drawing set. Swap for real photography via ContentImage (see README → Images).
 */
export default function Placeholder({
  label,
  ratio = "4/3",
  className = "",
  figure,
}: {
  label: string;
  ratio?: string;
  className?: string;
  /** e.g. "Fig. 1" */
  figure?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`Image placeholder: ${label}`}
      className={`relative flex w-full flex-col justify-between border border-line bg-limestone-deep ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <svg aria-hidden className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <line x1="0" y1="0" x2="100" y2="100" stroke="var(--line)" strokeWidth="0.25" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="var(--line)" strokeWidth="0.25" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="relative m-3 self-start bg-limestone-deep px-1 text-[0.72rem] font-medium tracking-[0.14em] text-stone">{figure ?? ""}</span>
      <span className="relative m-3 self-start bg-limestone-deep px-1 text-[0.8rem] text-stone">[[PLACEHOLDER: {label}]]</span>
    </div>
  );
}
