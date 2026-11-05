import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "./theme";

const WIDTH = 1920;
const HEIGHT = 1080;

const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  x: random(`px-${i}`) * WIDTH,
  y: random(`py-${i}`) * HEIGHT,
  size: 2 + random(`ps-${i}`) * 2.5,
  speed: 6 + random(`pv-${i}`) * 14,
  phase: random(`pp-${i}`) * Math.PI * 2,
}));

const GLINTS = [
  { x: 140, y: 150 },
  { x: 1790, y: 130 },
  { x: 260, y: 930 },
  { x: 1700, y: 910 },
  { x: 90, y: 560 },
  { x: 1840, y: 520 },
  { x: 960, y: 70 },
];

const GeometricPattern: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = frame * 0.12;
  const c = 80;
  const R = 46;
  const s = R * Math.SQRT1_2;

  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      style={{
        position: "absolute",
        inset: 0,
        opacity: interpolate(frame, [30, 130], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <defs>
        <pattern
          id="islamic"
          width={160}
          height={160}
          patternUnits="userSpaceOnUse"
          patternTransform={`translate(${drift} ${drift})`}
        >
          <g fill="none" stroke={COLORS.gold} strokeWidth={1.2} opacity={0.55}>
            <polygon points={`${c},${c - R} ${c + R},${c} ${c},${c + R} ${c - R},${c}`} />
            <polygon points={`${c - s},${c - s} ${c + s},${c - s} ${c + s},${c + s} ${c - s},${c + s}`} />
            <path d={`M${c + R} ${c}H160M0 ${c}H${c - R}M${c} ${c - R}V0M${c} ${c + R}V160`} />
            {[0, 160].flatMap((x) =>
              [0, 160].map((y) => (
                <polygon
                  key={`${x}-${y}`}
                  points={`${x},${y - 14} ${x + 14},${y} ${x},${y + 14} ${x - 14},${y}`}
                />
              )),
            )}
          </g>
        </pattern>
        <radialGradient id="edgeFade" cx="50%" cy="50%" r="75%">
          <stop offset="0.38" stopColor="#000" />
          <stop offset="0.95" stopColor="#fff" />
        </radialGradient>
        <mask id="edgeMask">
          <rect width={WIDTH} height={HEIGHT} fill="url(#edgeFade)" />
        </mask>
      </defs>
      <rect width={WIDTH} height={HEIGHT} fill="url(#islamic)" mask="url(#edgeMask)" />
    </svg>
  );
};

const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const appear = interpolate(frame, [20, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: appear }}>
      {PARTICLES.map((p, i) => {
        const y = (((p.y - t * p.speed) % HEIGHT) + HEIGHT) % HEIGHT;
        const x = p.x + Math.sin(frame / 60 + p.phase) * 10;
        const twinkle = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(frame / 20 + p.phase));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: COLORS.champagne,
              opacity: twinkle,
              boxShadow: `0 0 ${p.size * 3}px rgba(242,215,122,0.6)`,
            }}
          />
        );
      })}
      {GLINTS.map((g, i) => {
        const pulse = 0.5 + 0.5 * Math.sin(frame / 28 + i * 1.7);
        return (
          <svg
            key={i}
            width={28}
            height={28}
            viewBox="-14 -14 28 28"
            style={{
              position: "absolute",
              left: g.x - 14,
              top: g.y - 14,
              opacity: 0.15 + 0.5 * pulse,
              scale: 0.5 + 0.5 * pulse,
            }}
          >
            <path
              d="M0 -12 Q0 0 12 0 Q0 0 0 12 Q0 0 -12 0 Q0 0 0 -12Z"
              fill={COLORS.champagne}
            />
          </svg>
        );
      })}
    </AbsoluteFill>
  );
};

const Glow: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 55% 55% at 50% 47%, rgba(16,170,106,0.55) 0%, rgba(8,122,75,0) 100%)",
        opacity: interpolate(frame, [20, 100], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    />
  );
};

const PatternLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        scale: interpolate(frame, [0, durationInFrames], [1, 1.05], {
          output: "perceptual-scale",
        }),
      }}
    >
      <GeometricPattern />
    </AbsoluteFill>
  );
};

export const Background: React.FC = () => {
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 80% at 50% 45%, ${COLORS.emerald} 0%, ${COLORS.forest} 50%, ${COLORS.deep} 100%)`,
        }}
      />
      <Glow />
      <PatternLayer />
      <Particles />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 75% 75% at 50% 50%, rgba(0,20,12,0) 55%, rgba(0,20,12,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
