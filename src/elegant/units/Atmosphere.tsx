import { AbsoluteFill, Interactive, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../../theme";
import { starPolygon } from "../geometry";

const W = 1920;
const H = 1080;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const DUST = Array.from({ length: 34 }, (_, i) => ({
  x: random(`dust-x-${i}`) * W,
  y: random(`dust-y-${i}`) * H,
  size: 1.5 + random(`dust-s-${i}`) * 2.5,
  speed: 5 + random(`dust-v-${i}`) * 12,
  phase: random(`dust-p-${i}`) * Math.PI * 2,
}));

const BOKEH = Array.from({ length: 9 }, (_, i) => ({
  x: random(`bokeh-x-${i}`) * W,
  y: random(`bokeh-y-${i}`) * H,
  r: 40 + random(`bokeh-r-${i}`) * 80,
  speed: 3 + random(`bokeh-v-${i}`) * 5,
  phase: random(`bokeh-p-${i}`) * Math.PI * 2,
  alpha: 0.05 + random(`bokeh-a-${i}`) * 0.07,
}));

const CORNERS = [
  [0, 0],
  [W, 0],
  [0, H],
  [W, H],
] as const;

const Pattern: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = frame * 0.1;
  const c = 80;
  const R = 46;
  const s = R * Math.SQRT1_2;

  return (
    <svg
      width={W}
      height={H}
      style={{
        position: "absolute",
        inset: 0,
        opacity: interpolate(frame, [20, 110], [0, 0.85], clamp),
      }}
    >
      <defs>
        <pattern id="elegant-tile" width={160} height={160} patternUnits="userSpaceOnUse" patternTransform={`translate(${drift} ${drift * 0.6})`}>
          <g fill="none" stroke={COLORS.gold} strokeWidth={1.1} opacity={0.5}>
            <polygon points={`${c},${c - R} ${c + R},${c} ${c},${c + R} ${c - R},${c}`} />
            <polygon points={`${c - s},${c - s} ${c + s},${c - s} ${c + s},${c + s} ${c - s},${c + s}`} />
            <circle cx={c} cy={c} r={R * 0.38} />
            <path d={`M${c + R} ${c}H160M0 ${c}H${c - R}M${c} ${c - R}V0M${c} ${c + R}V160`} />
            {[0, 160].flatMap((x) =>
              [0, 160].map((y) => (
                <polygon key={`${x}-${y}`} points={`${x},${y - 14} ${x + 14},${y} ${x},${y + 14} ${x - 14},${y}`} />
              )),
            )}
          </g>
        </pattern>
        <radialGradient id="elegant-edge" cx="50%" cy="50%" r="75%">
          <stop offset="0.42" stopColor="#000" />
          <stop offset="0.98" stopColor="#fff" />
        </radialGradient>
        <mask id="elegant-edge-mask">
          <rect width={W} height={H} fill="url(#elegant-edge)" />
        </mask>
      </defs>
      <rect width={W} height={H} fill="url(#elegant-tile)" mask="url(#elegant-edge-mask)" />
    </svg>
  );
};

const CornerRosettes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drawn = interpolate(frame, [0.5 * fps, 3.5 * fps], [1, 0], clamp);
  const drift = Math.sin(frame / 160) * 6;
  const r = 300;

  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, translate: `${drift}px ${-drift}px` }}>
      {CORNERS.map(([x, y]) => (
        <g key={`${x}-${y}`} fill="none" stroke={COLORS.gold} strokeWidth={1.2} opacity={0.32}>
          <path d={starPolygon(x, y, r, 8, 3)} pathLength={1} strokeDasharray="1 1" strokeDashoffset={drawn} />
          <path d={starPolygon(x, y, r, 8, 3, -Math.PI / 2 + Math.PI / 8)} pathLength={1} strokeDasharray="1 1" strokeDashoffset={drawn} />
          <circle cx={x} cy={y} r={r * 1.06} pathLength={1} strokeDasharray="1 1" strokeDashoffset={drawn} />
          <circle cx={x} cy={y} r={r * 0.42} pathLength={1} strokeDasharray="1 1" strokeDashoffset={drawn} />
          <path d={starPolygon(x, y, r * 0.42, 8, 3)} pathLength={1} strokeDasharray="1 1" strokeDashoffset={drawn} />
        </g>
      ))}
    </svg>
  );
};

const LightShafts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = interpolate(frame, [0.5 * fps, 3 * fps], [0, 1], clamp);
  const breathe = 0.7 + 0.3 * Math.sin(frame / 90);

  return (
    <AbsoluteFill style={{ opacity: appear * breathe }}>
      {[
        { left: 520, rotate: "24deg", shift: Math.sin(frame / 140) * 30 },
        { left: 1100, rotate: "-22deg", shift: Math.cos(frame / 150) * 30 },
      ].map((shaft, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: shaft.left,
            top: -300,
            width: 360,
            height: 1700,
            background: "linear-gradient(180deg, rgba(242,215,122,0.13) 0%, rgba(242,215,122,0.04) 55%, rgba(242,215,122,0) 100%)",
            filter: "blur(40px)",
            rotate: shaft.rotate,
            translate: `${shaft.shift}px 0px`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill style={{ opacity: interpolate(frame, [20, 90], [0, 1], clamp) }}>
      {BOKEH.map((b, i) => (
        <div
          key={`b${i}`}
          style={{
            position: "absolute",
            left: b.x + Math.sin(t / 3 + b.phase) * 40 - b.r,
            top: ((((b.y - t * b.speed) % H) + H) % H) - b.r,
            width: b.r * 2,
            height: b.r * 2,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(242,215,122,${b.alpha}) 0%, rgba(242,215,122,0) 70%)`,
          }}
        />
      ))}
      {DUST.map((p, i) => (
        <div
          key={`d${i}`}
          style={{
            position: "absolute",
            left: p.x + Math.sin(frame / 60 + p.phase) * 10,
            top: (((p.y - t * p.speed) % H) + H) % H,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: COLORS.champagne,
            opacity: 0.2 + 0.4 * (0.5 + 0.5 * Math.sin(frame / 18 + p.phase)),
            boxShadow: `0 0 ${p.size * 3}px rgba(242,215,122,0.6)`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

const AtmosphereInner: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 85% 85% at 50% 45%, ${COLORS.emerald} 0%, ${COLORS.forest} 48%, ${COLORS.deep} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 50% 50% at 50% 46%, rgba(22,180,112,0.5) 0%, rgba(8,122,75,0) 100%)",
          opacity: interpolate(frame, [20, 100], [0, 1], clamp),
        }}
      />
      <LightShafts />
      <Pattern />
      <CornerRosettes />
      <Particles />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 72% 72% at 50% 50%, rgba(0,18,10,0) 52%, rgba(0,18,10,0.62) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

export const Atmosphere = Interactive.create({
  Component: AtmosphereInner,
  layout: "absolute-fill",
  componentName: "ElegantAtmosphere",
});
