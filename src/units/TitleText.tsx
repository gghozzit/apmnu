import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS, GOLD_GRADIENT } from "../theme";

type Props = {
  readonly line1: string;
  readonly line2: string;
  readonly line3: string;
  readonly speed?: number;
};

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const Line: React.FC<{
  readonly text: string;
  readonly f: number;
  readonly from: number;
  readonly to: number;
  readonly sweepX: number;
  readonly size: number;
  readonly weight: number;
  readonly spacing: string;
}> = ({ text, f, from, to, sweepX, size, weight, spacing }) => {
  return (
    <div style={{ overflow: "hidden", padding: "0.12em 0.3em" }}>
      <div
        style={{
          display: "inline-block",
          fontFamily: FONTS.title,
          fontWeight: weight,
          fontSize: size,
          lineHeight: 1.15,
          letterSpacing: spacing,
          paddingLeft: spacing,
          whiteSpace: "nowrap",
          color: "transparent",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          backgroundRepeat: "no-repeat",
          backgroundImage: `linear-gradient(100deg, transparent 42%, rgba(255,250,225,0.95) 50%, transparent 58%), ${GOLD_GRADIENT}`,
          backgroundSize: "250% 100%, 100% 100%",
          backgroundPosition: `${sweepX}% 0, 0 0`,
          opacity: interpolate(f, [from, to], [0, 1], clamp),
          translate: interpolate(f, [from, to], ["0px 70%", "0px 0%"], {
            ...clamp,
            easing: Easing.bezier(0.22, 1, 0.36, 1),
          }),
        }}
      >
        {text}
      </div>
    </div>
  );
};

const TitleTextInner: React.FC<Props> = ({ line1, line2, line3, speed = 1 }) => {
  const frame = useCurrentFrame();
  const f = frame * speed;

  const textSweep = interpolate(f, [65, 130], [100, 0], clamp);
  const rule = interpolate(f, [40, 80], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        filter: "drop-shadow(0 4px 14px rgba(0,25,15,0.45))",
      }}
    >
      <Line text={line1} f={f} from={0} to={40} sweepX={textSweep} size={58} weight={500} spacing="0.22em" />
      <div style={{ height: 14 }} />
      <Line text={line2} f={f} from={15} to={65} sweepX={textSweep} size={92} weight={700} spacing="0.06em" />
      <div style={{ height: 22 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        <div
          style={{
            width: 220,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${COLORS.champagne})`,
            scale: `${rule} 1`,
            transformOrigin: "right center",
          }}
        />
        <Line text={line3} f={f} from={35} to={75} sweepX={textSweep} size={66} weight={500} spacing="0.5em" />
        <div
          style={{
            width: 220,
            height: 2,
            background: `linear-gradient(270deg, transparent, ${COLORS.champagne})`,
            scale: `${rule} 1`,
            transformOrigin: "left center",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const TitleText = Interactive.create({
  Component: TitleTextInner,
  layout: "absolute-fill",
  componentName: "TitleText",
  schema: {
    line1: { type: "string", default: "", description: "Line 1" },
    line2: { type: "string", default: "", description: "Line 2" },
    line3: { type: "string", default: "", description: "Line 3" },
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
