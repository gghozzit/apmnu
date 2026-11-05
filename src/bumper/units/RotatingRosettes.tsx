import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../../theme";
import { starPolygon } from "../../elegant/geometry";

const W = 1920;
const H = 1080;
const CORNERS = [
  [0, 0, 1],
  [W, 0, -1],
  [0, H, -1],
  [W, H, 1],
] as const;

const RotatingRosettesInner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drawn = interpolate(frame, [0.2 * fps, 2.2 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const r = 180;

  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {CORNERS.map(([x, y, dir]) => (
          <g key={`${x}-${y}`} transform={`rotate(${frame * 0.09 * dir} ${x} ${y})`} fill="none" stroke={COLORS.champagne} strokeWidth={1} opacity={0.28}>
            <path d={starPolygon(x, y, r, 12, 5)} pathLength={1} strokeDasharray="1 1" strokeDashoffset={drawn} />
            <path d={starPolygon(x, y, r * 0.55, 12, 5, -Math.PI / 2 + Math.PI / 12)} pathLength={1} strokeDasharray="1 1" strokeDashoffset={drawn} />
            <circle cx={x} cy={y} r={r * 0.2} pathLength={1} strokeDasharray="1 1" strokeDashoffset={drawn} />
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

/** Twelve-point rosettes turning slowly in each corner, layered over the static corner stars. */
export const RotatingRosettes = Interactive.create({
  Component: RotatingRosettesInner,
  layout: "absolute-fill",
  componentName: "BumperRotatingRosettes",
});
