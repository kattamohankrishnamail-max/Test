import { AMP_PATH, F_PATH, P_PATH, SEAL_SIZE } from "./seal-paths";

/**
 * The FP seal (logo version C). Double hairline frame, F and P in one colour, italic "&".
 * Below 32px the guideline calls for the cut without the ampersand and a single-line frame.
 *
 * Colourways (Brand Guidelines §02): Rose Bronze on Oxblood (premium), Oxblood on Warm Stone
 * (primary), Warm Stone on Oxblood.
 */
type Tone = "bronze" | "oxblood" | "stone";
const COLOURS: Record<Tone, { mark: string; amp: string }> = {
  bronze: { mark: "var(--bronze-light)", amp: "var(--limestone)" },
  oxblood: { mark: "var(--oxblood)", amp: "var(--oxblood)" },
  stone: { mark: "var(--limestone)", amp: "var(--limestone)" },
};

export default function Seal({ size = 48, tone = "oxblood", title }: { size?: number; tone?: Tone; title?: string }) {
  const minimal = size < 32;
  const c = COLOURS[tone];
  const S = SEAL_SIZE;
  return (
    <svg
      viewBox={`0 0 ${S} ${S}`}
      width={size}
      height={size}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className="shrink-0"
    >
      <rect x="0.7" y="0.7" width={S - 1.4} height={S - 1.4} fill="none" stroke={c.mark} strokeWidth={minimal ? 3 : 1.4} />
      {!minimal && <rect x="4.7" y="4.7" width={S - 9.4} height={S - 9.4} fill="none" stroke={c.mark} strokeWidth="0.6" />}
      <path d={F_PATH} fill={c.mark} />
      <path d={P_PATH} fill={c.mark} />
      {!minimal && <path d={AMP_PATH} fill={c.amp} />}
    </svg>
  );
}
