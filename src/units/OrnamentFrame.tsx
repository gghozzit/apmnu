import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

type Props = {
  readonly speed?: number;
};

const X1 = 180;
const X2 = 1740;
const Y1 = 250;
const Y2 = 830;
const CUT = 36;
const CX = 960;

const halfPath = (inset: number, cut: number) =>
  `M${CX} ${Y1 + inset} H${X2 - inset - cut} L${X2 - inset} ${Y1 + inset + cut} V${Y2 - inset - cut} L${X2 - inset - cut} ${Y2 - inset} H${CX}`;

const OUTER = halfPath(0, CUT);
const INNER = halfPath(16, CUT - 10);

const diamond = (x: number, y: number, r: number) =>
  `M${x} ${y - r} L${x + r} ${y} L${x} ${y + r} L${x - r} ${y}Z`;

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const OrnamentFrameInner: React.FC<Props> = ({ speed = 1 }) => {
  const frame = useCurrentFrame();
  const f = frame * speed;

  const drawn = interpolate(f, [0, 60], [1, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const sweepX = interpolate(f, [125, 185], [960, 1800], clamp);
  const sweepOpacity = interpolate(f, [125, 135, 175, 190], [0, 1, 1, 0], clamp);
  const ornamentOpacity = interpolate(f, [40, 65], [0, 1], clamp);

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="goldStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={COLORS.champagne} />
            <stop offset="0.5" stopColor={COLORS.gold} />
            <stop offset="1" stopColor={COLORS.champagne} />
          </linearGradient>
          <linearGradient
            id="sweepStroke"
            gradientUnits="userSpaceOnUse"
            x1={sweepX - 220}
            x2={sweepX + 220}
            y1={0}
            y2={0}
          >
            <stop offset="0" stopColor="rgba(255,246,227,0)" />
            <stop offset="0.5" stopColor="rgba(255,246,227,0.95)" />
            <stop offset="1" stopColor="rgba(255,246,227,0)" />
          </linearGradient>
        </defs>
        {[false, true].map((mirror) => (
          <g key={String(mirror)} transform={mirror ? "translate(1920 0) scale(-1 1)" : undefined}>
            <path d={OUTER} pathLength={1} fill="none" stroke="url(#goldStroke)" strokeWidth={3} strokeDasharray="1 1" strokeDashoffset={drawn} />
            <path d={INNER} pathLength={1} fill="none" stroke="url(#goldStroke)" strokeWidth={1.4} strokeDasharray="1 1" strokeDashoffset={drawn} opacity={0.8} />
            <path d={OUTER} pathLength={1} fill="none" stroke="url(#sweepStroke)" strokeWidth={4} strokeDasharray="1 1" strokeDashoffset={drawn} opacity={sweepOpacity} />
          </g>
        ))}
        <g fill={COLORS.champagne} opacity={ornamentOpacity}>
          <path d={diamond(CX, Y1, 13)} />
          <path d={diamond(CX, Y2, 13)} />
          <path d={diamond(X1 + 6, Y1 + CUT / 2, 6)} />
          <path d={diamond(X2 - 6, Y1 + CUT / 2, 6)} />
          <path d={diamond(X1 + 6, Y2 - CUT / 2, 6)} />
          <path d={diamond(X2 - 6, Y2 - CUT / 2, 6)} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const OrnamentFrame = Interactive.create({
  Component: OrnamentFrameInner,
  layout: "absolute-fill",
  componentName: "OrnamentFrame",
  schema: {
    speed: {
      type: "number",
      default: 1,
      min: 0.1,
      step: 0.1,
      description: "Reveal speed",
      keyframable: false,
      hiddenFromList: false,
    },
  },
});
