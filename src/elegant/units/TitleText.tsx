import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS, GOLD_GRADIENT } from "../../theme";
import { diamond } from "../geometry";

type Props = {
  readonly line1: string;
  readonly line2: string;
  readonly line3: string;
  readonly speed?: number;
  /** Line 3 font size in px. */
  readonly line3Size?: number;
  /** Line 3 letter spacing in em. */
  readonly line3Spacing?: number;
  /** Length in px of the rule on each side of line 3. */
  readonly ruleWidth?: number;
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.22, 1, 0.36, 1);

/** Main title line: letters rise in one by one, then a soft light passes across. */
const LetterLine: React.FC<{ readonly text: string; readonly f: number }> = ({ text, f }) => {
  const chars = [...text];
  const sweep = interpolate(f, [80, 128], [-25, 125], clamp);
  const letterStyle: React.CSSProperties = {
    fontFamily: FONTS.title,
    fontWeight: 700,
    fontSize: 96,
    lineHeight: 1.15,
    letterSpacing: "0.05em",
    whiteSpace: "pre",
  };

  return (
    <div style={{ position: "relative", padding: "0.1em 0.2em" }}>
      <div style={{ display: "flex" }}>
        {chars.map((ch, i) => {
          const start = 12 + i * 2;
          return (
            <span
              key={i}
              style={{
                ...letterStyle,
                display: "inline-block",
                color: "transparent",
                backgroundImage: GOLD_GRADIENT,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                opacity: interpolate(f, [start, start + 16], [0, 1], clamp),
                translate: interpolate(f, [start, start + 20], ["0px 38px", "0px 0px"], { ...clamp, easing: easeOut }),
                filter: `blur(${interpolate(f, [start, start + 16], [6, 0], clamp)}px)`,
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "0.1em 0.2em",
          display: "flex",
          WebkitMaskImage: `linear-gradient(100deg, transparent ${sweep - 14}%, #000 ${sweep}%, transparent ${sweep + 14}%)`,
          maskImage: `linear-gradient(100deg, transparent ${sweep - 14}%, #000 ${sweep}%, transparent ${sweep + 14}%)`,
        }}
      >
        {chars.map((ch, i) => (
          <span key={i} style={{ ...letterStyle, display: "inline-block", color: "rgba(255,250,232,0.92)" }}>
            {ch}
          </span>
        ))}
      </div>
    </div>
  );
};

const TitleTextInner: React.FC<Props> = ({ line1, line2, line3, speed = 1, line3Size = 58, line3Spacing = 0.55, ruleWidth = 240 }) => {
  const frame = useCurrentFrame();
  const f = frame * speed;
  const rule = interpolate(f, [50, 85], [0, 1], { ...clamp, easing: easeOut });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        filter: "drop-shadow(0 6px 18px rgba(0,25,15,0.5))",
      }}
    >
      <div
        style={{
          fontFamily: FONTS.title,
          fontWeight: 500,
          fontSize: 42,
          lineHeight: 1.2,
          color: COLORS.champagne,
          letterSpacing: `${interpolate(f, [0, 45], [0.7, 0.32], { ...clamp, easing: easeOut })}em`,
          paddingLeft: "0.32em",
          opacity: interpolate(f, [0, 30], [0, 1], clamp),
          filter: `blur(${interpolate(f, [0, 30], [6, 0], clamp)}px)`,
          whiteSpace: "nowrap",
        }}
      >
        {line1}
      </div>
      <div style={{ height: 12 }} />
      <LetterLine text={line2} f={f} />
      <div style={{ height: 20 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
        <svg width={ruleWidth} height={16} style={{ overflow: "visible" }}>
          <line x1={ruleWidth} y1={8} x2={ruleWidth - (ruleWidth - 20) * rule} y2={8} stroke={COLORS.champagne} strokeWidth={1.4} opacity={0.85} />
          <path d={diamond(ruleWidth - (ruleWidth - 14) * rule, 8, 5)} fill={COLORS.champagne} opacity={rule} />
        </svg>
        <div
          style={{
            fontFamily: FONTS.title,
            fontWeight: 500,
            fontSize: line3Size,
            lineHeight: 1.2,
            letterSpacing: `${line3Spacing}em`,
            paddingLeft: `${line3Spacing}em`,
            whiteSpace: "nowrap",
            color: "transparent",
            backgroundImage: GOLD_GRADIENT,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            opacity: interpolate(f, [40, 70], [0, 1], clamp),
            translate: interpolate(f, [40, 72], ["0px 24px", "0px 0px"], { ...clamp, easing: easeOut }),
          }}
        >
          {line3}
        </div>
        <svg width={ruleWidth} height={16} style={{ overflow: "visible" }}>
          <line x1={0} y1={8} x2={(ruleWidth - 20) * rule} y2={8} stroke={COLORS.champagne} strokeWidth={1.4} opacity={0.85} />
          <path d={diamond((ruleWidth - 14) * rule, 8, 5)} fill={COLORS.champagne} opacity={rule} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

export const TitleText = Interactive.create({
  Component: TitleTextInner,
  layout: "absolute-fill",
  componentName: "ElegantTitleText",
  schema: {
    line1: { type: "string", default: "", description: "Line 1" },
    line2: { type: "string", default: "", description: "Line 2" },
    line3: { type: "string", default: "", description: "Line 3" },
    line3Size: { type: "number", default: 58, min: 10, step: 1, description: "Line 3 size", keyframable: false, hiddenFromList: false },
    line3Spacing: { type: "number", default: 0.55, min: 0, step: 0.01, description: "Line 3 letter spacing (em)", keyframable: false, hiddenFromList: false },
    ruleWidth: { type: "number", default: 240, min: 40, step: 5, description: "Side rule length", keyframable: false, hiddenFromList: false },
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
