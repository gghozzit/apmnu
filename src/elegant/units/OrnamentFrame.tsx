import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../../theme";
import { diamond, starPolygon, starburst } from "../geometry";

type Props = {
  readonly speed?: number;
};

const CX = 960;
const X2 = 1660;
const Y1 = 280;
const Y2 = 800;
const APEX = Y1 - 72;
const R = 28;

// Right half: pointed arch at the top centre, scalloped corners, small point at the bottom centre.
const OUTER = `M${CX} ${APEX} C${CX + 34} ${APEX + 46} ${CX + 112} ${Y1 - 4} ${CX + 160} ${Y1} H${X2 - R} A${R} ${R} 0 0 0 ${X2} ${Y1 + R} V${Y2 - R} A${R} ${R} 0 0 0 ${X2 - R} ${Y2} H${CX + 64} L${CX} ${Y2 + 24}`;
const INNER = `M${CX} ${APEX + 22} C${CX + 30} ${APEX + 60} ${CX + 100} ${Y1 + 12} ${CX + 150} ${Y1 + 14} H${X2 - 14 - 18} A18 18 0 0 0 ${X2 - 14} ${Y1 + 14 + 18} V${Y2 - 14 - 18} A18 18 0 0 0 ${X2 - 14 - 18} ${Y2 - 14} H${CX}`;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const OrnamentFrameInner: React.FC<Props> = ({ speed = 1 }) => {
  const frame = useCurrentFrame();
  const f = frame * speed;

  const drawn = interpolate(f, [0, 60], [1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const innerDrawn = interpolate(f, [10, 70], [1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const medallionDraw = interpolate(f, [30, 70], [1, 0], clamp);
  const medallionScale = interpolate(f, [40, 72], [0.5, 1], {
    ...clamp,
    easing: Easing.bezier(0.34, 1.4, 0.64, 1),
  });
  const pulse = 0.75 + 0.25 * Math.sin(Math.max(0, f - 72) / 14);
  const flourish = interpolate(f, [50, 85], [0, 1], { ...clamp, easing: Easing.bezier(0.22, 1, 0.36, 1) });
  const sweepX = interpolate(f, [70, 125], [CX - 80, X2 + 120], clamp);
  const sweepOpacity = interpolate(f, [70, 80, 112, 125], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="of-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={COLORS.champagne} />
            <stop offset="0.5" stopColor={COLORS.gold} />
            <stop offset="1" stopColor={COLORS.champagne} />
          </linearGradient>
          <linearGradient id="of-sweep" gradientUnits="userSpaceOnUse" x1={sweepX - 200} x2={sweepX + 200} y1={0} y2={0}>
            <stop offset="0" stopColor="rgba(255,246,227,0)" />
            <stop offset="0.5" stopColor="rgba(255,246,227,1)" />
            <stop offset="1" stopColor="rgba(255,246,227,0)" />
          </linearGradient>
          <radialGradient id="of-glow">
            <stop offset="0" stopColor="rgba(242,215,122,0.55)" />
            <stop offset="1" stopColor="rgba(242,215,122,0)" />
          </radialGradient>
        </defs>

        {[false, true].map((mirror) => (
          <g key={String(mirror)} transform={mirror ? "translate(1920 0) scale(-1 1)" : undefined}>
            <path d={OUTER} pathLength={1} fill="none" stroke="url(#of-gold)" strokeWidth={2.6} strokeDasharray="1 1" strokeDashoffset={drawn} />
            <path d={INNER} pathLength={1} fill="none" stroke="url(#of-gold)" strokeWidth={1.1} strokeDasharray="1 1" strokeDashoffset={innerDrawn} opacity={0.75} />
            <path d={OUTER} pathLength={1} fill="none" stroke="url(#of-sweep)" strokeWidth={4} strokeDasharray="1 1" strokeDashoffset={drawn} opacity={sweepOpacity} />
            <g opacity={flourish}>
              <line x1={X2 + 26} y1={540} x2={X2 + 26 + 190 * flourish} y2={540} stroke="url(#of-gold)" strokeWidth={1.4} />
              <path d={diamond(X2 + 26, 540, 6)} fill={COLORS.champagne} />
              <path d={starburst(X2 + 30 + 190 * flourish, 540, 7, 2.6, 4)} fill={COLORS.champagne} />
            </g>
            <path d={starburst(X2 + 6, Y1 - 6, 8, 2.8, 4)} fill={COLORS.champagne} opacity={flourish} />
            <path d={starburst(X2 + 6, Y2 + 6, 8, 2.8, 4)} fill={COLORS.champagne} opacity={flourish} />
          </g>
        ))}

        <circle cx={CX} cy={APEX - 4} r={70} fill="url(#of-glow)" opacity={(1 - medallionDraw) * pulse} />
        <g transform={`translate(${CX} ${APEX - 4}) scale(${medallionScale}) translate(${-CX} ${-(APEX - 4)})`}>
          <circle cx={CX} cy={APEX - 4} r={30} fill={COLORS.deep} stroke={COLORS.champagne} strokeWidth={1.6} pathLength={1} strokeDasharray="1 1" strokeDashoffset={medallionDraw} />
          <path d={starPolygon(CX, APEX - 4, 24, 8, 3)} fill="none" stroke={COLORS.champagne} strokeWidth={1.3} pathLength={1} strokeDasharray="1 1" strokeDashoffset={medallionDraw} />
          <path d={starburst(CX, APEX - 4, 7, 3, 8)} fill={COLORS.champagne} opacity={1 - medallionDraw} />
        </g>
        <path d={diamond(CX, Y2 + 24, 7)} fill={COLORS.champagne} opacity={flourish} />
      </svg>
    </AbsoluteFill>
  );
};

export const OrnamentFrame = Interactive.create({
  Component: OrnamentFrameInner,
  layout: "absolute-fill",
  componentName: "ElegantOrnamentFrame",
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
