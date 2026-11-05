import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../../theme";
import { starburst } from "../../elegant/geometry";

/** x: pivot on the top edge; cord: length to the lantern cap; size: scale; depth: parallax / dimming. */
const LANTERNS = [
  { x: 96, cord: 150, size: 1, depth: 1, period: 4.6, phase: 0 },
  { x: 196, cord: 70, size: 0.68, depth: 0.7, period: 3.9, phase: 1.3 },
  { x: 1864, cord: 150, size: 0.92, depth: 1, period: 4.3, phase: 2.1 },
  { x: 1724, cord: 20, size: 0.55, depth: 0.65, period: 3.6, phase: 0.6 },
];

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** A fanous lantern drawn around its hanging point at (0, 0), body below. */
const Fanous: React.FC<{ readonly glow: number; readonly id: string }> = ({ glow, id }) => (
  <g>
    <defs>
      <radialGradient id={`lantern-light-${id}`} cx="50%" cy="55%" r="55%">
        <stop offset="0" stopColor="#FFF1C4" stopOpacity={0.95 * glow} />
        <stop offset="0.45" stopColor={COLORS.champagne} stopOpacity={0.55 * glow} />
        <stop offset="1" stopColor={COLORS.gold} stopOpacity={0.08} />
      </radialGradient>
      <radialGradient id={`lantern-halo-${id}`}>
        <stop offset="0" stopColor="rgba(242,215,122,0.45)" />
        <stop offset="1" stopColor="rgba(242,215,122,0)" />
      </radialGradient>
    </defs>
    <circle cx={0} cy={78} r={95} fill={`url(#lantern-halo-${id})`} opacity={glow} />
    <g fill="none" stroke={COLORS.gold} strokeWidth={1.6} strokeLinejoin="round">
      <circle cx={0} cy={4} r={4} />
      <path d="M0 8 V14" />
      <path d="M-10 26 C-10 16 10 16 10 26 Z" fill={COLORS.deep} />
      <path d="M-22 34 L-10 26 H10 L22 34 Z" fill={COLORS.deep} />
      <path d="M-22 34 L-26 112 L-14 126 H14 L26 112 L22 34 Z" fill={`url(#lantern-light-${id})`} />
      <path d="M-11 104 V60 C-11 48 0 42 0 42 C0 42 11 48 11 60 V104 Z" stroke={COLORS.champagne} strokeWidth={1} />
      <path d="M-22 34 L-26 112 M22 34 L26 112 M0 34 V42 M0 104 V126" strokeWidth={1} opacity={0.8} />
      <path d="M-14 126 L-6 140 H6 L14 126" fill={COLORS.deep} />
      <path d="M0 140 V152" />
    </g>
    <path d={starburst(0, 156, 5, 1.8, 4)} fill={COLORS.champagne} />
    <path d={starburst(0, 80, 5, 2, 8)} fill="#FFF6E3" opacity={0.6 + 0.4 * glow} />
  </g>
);

const LanternsInner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const drop = interpolate(frame, [0, 1.6 * fps], [-260, 0], { ...clamp, easing: Easing.bezier(0.22, 1, 0.36, 1) });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {LANTERNS.map((l, i) => {
          // The swing settles from a wider arc after the drop-in.
          const settle = interpolate(frame, [0, 2 * fps], [2.2, 1], clamp);
          const angle = Math.sin((t / l.period) * Math.PI * 2 + l.phase) * 3.2 * settle;
          const flicker = 0.78 + 0.12 * Math.sin(t * 7.3 + l.phase * 3) + 0.1 * Math.sin(t * 13.1 + l.phase);
          return (
            <g
              key={i}
              transform={`translate(${l.x} ${drop * (0.6 + 0.4 * l.depth)}) rotate(${angle})`}
              opacity={0.55 + 0.45 * l.depth}
            >
              <line x1={0} y1={0} x2={0} y2={l.cord} stroke={COLORS.gold} strokeWidth={1} opacity={0.7} />
              <g transform={`translate(0 ${l.cord}) scale(${l.size})`}>
                <Fanous glow={flicker} id={String(i)} />
              </g>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

/** Fanous lanterns hanging from the top edges, swinging gently with flickering candle light. */
export const Lanterns = Interactive.create({
  Component: LanternsInner,
  layout: "absolute-fill",
  componentName: "BumperLanterns",
});
