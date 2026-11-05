import { AbsoluteFill, Easing, Img, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONTS } from "../../theme";
import { diamond, scallopedHalf, starPolygon, starburst } from "../geometry";

export type ProfileItem = {
  readonly role: string;
  readonly detail: string;
  /** Text between role and detail, exactly as written in the source slide. */
  readonly separator?: string;
  readonly emphasis?: string;
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
const backOut = Easing.bezier(0.34, 1.5, 0.64, 1);

const NAME_GRADIENT = "linear-gradient(180deg, #FFF8E8 0%, #F8E7A8 58%, #E6C25E 100%)";

const numberField = (description: string, def: number) =>
  ({
    type: "number",
    default: def,
    step: 1,
    description,
    keyframable: false,
    hiddenFromList: false,
  }) as const;

/* ------------------------------------------------------------------ */
/* Event rail: event name at the top, ornamental rule at the bottom    */
/* ------------------------------------------------------------------ */

const EventRailInner: React.FC<{ readonly label: string; readonly ruleWidth?: number }> = ({ label, ruleWidth = 170 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grow = interpolate(frame, [0, 1.2 * fps], [0, 1], { ...clamp, easing: easeOut });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 34,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 18,
          opacity: interpolate(frame, [0, 0.8 * fps], [0, 1], clamp),
        }}
      >
        <svg width={ruleWidth} height={12} style={{ overflow: "visible" }}>
          <line x1={ruleWidth} y1={6} x2={ruleWidth - (ruleWidth - 10) * grow} y2={6} stroke={COLORS.gold} strokeWidth={1} />
          <path d={diamond(ruleWidth - (ruleWidth - 6) * grow, 6, 4)} fill={COLORS.champagne} />
        </svg>
        <div
          style={{
            fontFamily: FONTS.title,
            fontWeight: 500,
            fontSize: 18,
            letterSpacing: "0.34em",
            paddingLeft: "0.34em",
            color: COLORS.champagne,
            opacity: 0.88,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
        <svg width={ruleWidth} height={12} style={{ overflow: "visible" }}>
          <line x1={0} y1={6} x2={(ruleWidth - 10) * grow} y2={6} stroke={COLORS.gold} strokeWidth={1} />
          <path d={diamond((ruleWidth - 6) * grow, 6, 4)} fill={COLORS.champagne} />
        </svg>
      </div>
      <svg width={1920} height={30} style={{ position: "absolute", left: 0, top: 1028 }}>
        <line x1={960 - 420 * grow} y1={10} x2={960 + 420 * grow} y2={10} stroke={COLORS.gold} strokeWidth={1} opacity={0.6} />
        <path d={starburst(960, 10, 9, 3.2, 4)} fill={COLORS.champagne} opacity={grow} />
      </svg>
    </AbsoluteFill>
  );
};

export const EventRail = Interactive.create({
  Component: EventRailInner,
  layout: "absolute-fill",
  componentName: "ElegantEventRail",
  schema: {
    label: { type: "string", default: "", description: "Event label" },
    ruleWidth: { type: "number", default: 170, min: 20, step: 5, description: "Side rule length", keyframable: false, hiddenFromList: false },
  },
});

/* ------------------------------------------------------------------ */
/* Arch portrait: photo inside a mihrab-style pointed arch             */
/* ------------------------------------------------------------------ */

type ArchPortraitProps = {
  readonly photo: string;
  readonly photoWidth: number;
  readonly photoHeight: number;
  readonly centerX: number;
  readonly maxWidth: number;
  readonly maxHeight: number;
};

const archHalf = (cx: number, right: number, bottom: number, spring: number, apex: number) => {
  const half = right - cx;
  const rise = spring - apex;
  return `M${cx} ${bottom} H${right} V${spring} C${right} ${spring - rise * 0.55} ${cx + half * 0.35} ${apex + rise * 0.12} ${cx} ${apex}`;
};

const ArchPortraitInner: React.FC<ArchPortraitProps> = ({
  photo,
  photoWidth,
  photoHeight,
  centerX,
  maxWidth,
  maxHeight,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = Math.min(maxWidth / photoWidth, maxHeight / photoHeight);
  const w = Math.round(photoWidth * scale);
  const h = Math.round(photoHeight * scale);
  const half = w / 2 + 34;
  const rise = half * 0.72;
  const total = rise + 16 + h + 30;
  const apex = 545 - total / 2;
  const spring = apex + rise;
  const photoTop = spring + 16;
  const bottom = photoTop + h + 30;
  const cx = centerX;

  const drawn = interpolate(frame, [0, 1.6 * fps], [1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const innerDrawn = interpolate(frame, [0.2 * fps, 1.8 * fps], [1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const base = interpolate(frame, [0.8 * fps, 1.6 * fps], [0, 1], { ...clamp, easing: easeOut });
  const star = interpolate(frame, [1.2 * fps, 1.9 * fps], [0, 1], { ...clamp, easing: backOut });
  const reveal = interpolate(frame, [0.5 * fps, 2.1 * fps], [-20, 100], { ...clamp, easing: easeOut });
  const travel = interpolate(frame, [3 * fps, 5.2 * fps], [0.06, -0.94], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const travelOpacity = interpolate(frame, [3 * fps, 3.4 * fps, 4.8 * fps, 5.2 * fps], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        translate: interpolate(frame, [0, 14 * fps], ["0px 10px", "0px -10px"], clamp),
      }}
    >
      <div
        style={{
          position: "absolute",
          left: cx - half - 140,
          top: apex - 60,
          width: (half + 140) * 2,
          height: bottom - apex + 140,
          background: "radial-gradient(ellipse at 50% 45%, rgba(242,215,122,0.2) 0%, rgba(22,180,112,0.12) 35%, rgba(0,0,0,0) 70%)",
          opacity: interpolate(frame, [0, 1.2 * fps], [0, 1], clamp),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: cx - w / 2,
          top: photoTop,
          width: w,
          height: h,
          overflow: "hidden",
          boxShadow: "0 28px 60px rgba(0,18,10,0.6)",
          WebkitMaskImage: `linear-gradient(to top, #000 ${reveal}%, transparent ${reveal + 20}%)`,
          maskImage: `linear-gradient(to top, #000 ${reveal}%, transparent ${reveal + 20}%)`,
        }}
      >
        <Img
          src={staticFile(photo)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            scale: interpolate(frame, [0, 9 * fps], [1.05, 1], { ...clamp, output: "perceptual-scale" }),
          }}
        />
        <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 0 1px rgba(242,215,122,0.55)" }} />
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {[false, true].map((mirror) => (
          <g key={String(mirror)} transform={mirror ? `translate(${cx * 2} 0) scale(-1 1)` : undefined}>
            <path d={archHalf(cx, cx + half, bottom, spring, apex)} pathLength={1} fill="none" stroke={COLORS.gold} strokeWidth={2.6} strokeDasharray="1 1" strokeDashoffset={drawn} />
            <path d={archHalf(cx, cx + half - 12, bottom - 12, spring + 6, apex + 18)} pathLength={1} fill="none" stroke={COLORS.champagne} strokeWidth={1} strokeDasharray="1 1" strokeDashoffset={innerDrawn} opacity={0.7} />
            <path
              d={archHalf(cx, cx + half, bottom, spring, apex)}
              pathLength={1}
              fill="none"
              stroke={COLORS.ivory}
              strokeWidth={3.5}
              strokeLinecap="round"
              strokeDasharray="0.06 0.94"
              strokeDashoffset={travel}
              opacity={travelOpacity}
            />
          </g>
        ))}
        <line x1={cx - (half + 46) * base} y1={bottom + 12} x2={cx + (half + 46) * base} y2={bottom + 12} stroke={COLORS.gold} strokeWidth={1.2} />
        <path d={diamond(cx, bottom + 12, 6)} fill={COLORS.champagne} opacity={base} />
        <g transform={`translate(${cx} ${apex + rise * 0.48}) scale(${star})`}>
          <path d={starPolygon(0, 0, 17, 8, 3)} fill="none" stroke={COLORS.champagne} strokeWidth={1.2} />
          <path d={starburst(0, 0, 5, 2.2, 8)} fill={COLORS.champagne} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const ArchPortrait = Interactive.create({
  Component: ArchPortraitInner,
  layout: "absolute-fill",
  componentName: "ElegantArchPortrait",
  schema: {
    photo: { type: "string", default: "", description: "Photo path inside public/" },
    centerX: numberField("Centre X", 470),
    maxWidth: numberField("Max photo width", 420),
    maxHeight: numberField("Max photo height", 540),
  },
});

/* ------------------------------------------------------------------ */
/* Panel frame: translucent plate with a scalloped double gold border   */
/* ------------------------------------------------------------------ */

type PanelFrameProps = {
  readonly left: number;
  readonly top: number;
  readonly boxWidth: number;
  readonly boxHeight: number;
};

const PanelFrameInner: React.FC<PanelFrameProps> = ({ left, top, boxWidth, boxHeight }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = boxWidth;
  const h = boxHeight;
  const drawn = interpolate(frame, [0, 1.5 * fps], [1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const accents = interpolate(frame, [1.1 * fps, 1.6 * fps], [0, 1], { ...clamp, easing: backOut });
  const sweepX = interpolate(frame, [2.4 * fps, 3.8 * fps], [w / 2 - 100, w + 200], clamp);
  const sweepOpacity = interpolate(frame, [2.4 * fps, 2.7 * fps, 3.5 * fps, 3.8 * fps], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: left + 6,
          top: top + 6,
          width: w - 12,
          height: h - 12,
          background: "linear-gradient(140deg, rgba(8,122,75,0.42) 0%, rgba(7,91,60,0.62) 40%, rgba(3,69,47,0.82) 100%)",
          backdropFilter: "blur(5px)",
          boxShadow: "0 40px 90px rgba(0,18,10,0.5)",
          clipPath: "inset(0 round 18px)",
          opacity: interpolate(frame, [0.3 * fps, 1.2 * fps], [0, 1], clamp),
        }}
      />
      <svg
        width={w + 40}
        height={h + 40}
        viewBox={`-20 -20 ${w + 40} ${h + 40}`}
        style={{ position: "absolute", left: left - 20, top: top - 20, overflow: "visible" }}
      >
        <defs>
          <linearGradient id={`pf-sweep-${left}-${top}`} gradientUnits="userSpaceOnUse" x1={sweepX - 160} x2={sweepX + 160} y1={0} y2={0}>
            <stop offset="0" stopColor="rgba(255,246,227,0)" />
            <stop offset="0.5" stopColor="rgba(255,246,227,1)" />
            <stop offset="1" stopColor="rgba(255,246,227,0)" />
          </linearGradient>
        </defs>
        {[false, true].map((mirror) => (
          <g key={String(mirror)} transform={mirror ? `translate(${w} 0) scale(-1 1)` : undefined}>
            <path d={scallopedHalf(w / 2, w, 0, h, 22)} pathLength={1} fill="none" stroke={COLORS.gold} strokeWidth={1.8} strokeDasharray="1 1" strokeDashoffset={drawn} />
            <path d={scallopedHalf(w / 2, w - 10, 10, h - 10, 14)} pathLength={1} fill="none" stroke={COLORS.champagne} strokeWidth={0.9} strokeDasharray="1 1" strokeDashoffset={drawn} opacity={0.6} />
            <path d={scallopedHalf(w / 2, w, 0, h, 22)} pathLength={1} fill="none" stroke={`url(#pf-sweep-${left}-${top})`} strokeWidth={3} strokeDasharray="1 1" strokeDashoffset={drawn} opacity={sweepOpacity} />
            <path d={starburst(w + 2, -2, 9, 3, 4)} fill={COLORS.champagne} opacity={accents} />
            <path d={starburst(w + 2, h + 2, 9, 3, 4)} fill={COLORS.champagne} opacity={accents} />
          </g>
        ))}
        <path d={diamond(w / 2, 0, 8)} fill={COLORS.champagne} opacity={accents} />
        <path d={diamond(w / 2, h, 6)} fill={COLORS.champagne} opacity={accents} />
      </svg>
    </AbsoluteFill>
  );
};

export const PanelFrame = Interactive.create({
  Component: PanelFrameInner,
  layout: "absolute-fill",
  componentName: "ElegantPanelFrame",
  schema: {
    left: numberField("Left", 800),
    top: numberField("Top", 140),
    boxWidth: numberField("Width", 980),
    boxHeight: numberField("Height", 800),
  },
});

/* ------------------------------------------------------------------ */
/* Name block: name with metallic light pass, then an ornamental rule  */
/* ------------------------------------------------------------------ */

type NameBlockProps = {
  readonly personName: string;
  readonly left: number;
  readonly top: number;
  readonly textWidth: number;
  readonly size: number;
};

const NameBlockInner: React.FC<NameBlockProps> = ({ personName, left, top, textWidth, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sweep = interpolate(frame, [1.4 * fps, 2.6 * fps], [100, 0], clamp);
  const rule = interpolate(frame, [0.7 * fps, 1.5 * fps], [0, 1], { ...clamp, easing: easeOut });
  const starPop = interpolate(frame, [0.6 * fps, 1.0 * fps], [0, 1], { ...clamp, easing: backOut });

  return (
    <div style={{ position: "absolute", left, top, width: textWidth }}>
      <div style={{ overflow: "hidden", paddingBottom: "0.08em" }}>
        <div
          style={{
            fontFamily: FONTS.name,
            fontWeight: 700,
            fontSize: size,
            lineHeight: 1.18,
            textWrap: "balance",
            color: "transparent",
            backgroundImage: `linear-gradient(100deg, rgba(255,255,255,0) 40%, rgba(255,255,250,0.95) 50%, rgba(255,255,255,0) 60%), ${NAME_GRADIENT}`,
            backgroundSize: "250% 100%, 100% 100%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: `${sweep}% 0, 0 0`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            filter: "drop-shadow(0 3px 10px rgba(0,20,12,0.45))",
            letterSpacing: `${interpolate(frame, [0, 1.2 * fps], [0.03, 0], { ...clamp, easing: easeOut })}em`,
            opacity: interpolate(frame, [0, 0.5 * fps], [0, 1], clamp),
            translate: interpolate(frame, [0, 0.9 * fps], ["0px 60%", "0px 0%"], { ...clamp, easing: easeOut }),
          }}
        >
          {personName}
        </div>
      </div>
      <svg width={420} height={20} style={{ display: "block", marginTop: 18, overflow: "visible" }}>
        <g transform={`translate(10 10) scale(${starPop})`}>
          <path d={starburst(0, 0, 10, 3.6, 4)} fill={COLORS.champagne} />
        </g>
        <line x1={28} y1={10} x2={28 + 380 * rule} y2={10} stroke={COLORS.gold} strokeWidth={1.6} />
        <path d={diamond(32 + 380 * rule, 10, 4)} fill={COLORS.champagne} opacity={rule} />
      </svg>
    </div>
  );
};

export const NameBlock = Interactive.create({
  Component: NameBlockInner,
  layout: "absolute-fill",
  componentName: "ElegantNameBlock",
  schema: {
    personName: { type: "string", default: "", description: "Name" },
    left: numberField("Left", 860),
    top: numberField("Top", 190),
    textWidth: numberField("Width", 860),
    size: numberField("Font size", 54),
  },
});

/* ------------------------------------------------------------------ */
/* Roles list: numbered rows wipe in one after another                 */
/* ------------------------------------------------------------------ */

type RolesListProps = {
  readonly items: readonly ProfileItem[];
  readonly left: number;
  readonly top: number;
  readonly textWidth: number;
  readonly fontSize: number;
  readonly gap: number;
  /** Frames between rows appearing. */
  readonly stagger: number;
};

const RolesListInner: React.FC<RolesListProps> = ({ items, left, top, textWidth, fontSize, gap, stagger }) => {
  const frame = useCurrentFrame();
  const badge = Math.round(fontSize * 1.45);

  return (
    <div style={{ position: "absolute", left, top, width: textWidth, display: "flex", flexDirection: "column", gap }}>
      {items.map((item, i) => {
        const start = i * stagger;
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: Math.round(fontSize * 0.75),
              fontFamily: FONTS.body,
              fontSize,
              lineHeight: 1.42,
              opacity: interpolate(frame, [start, start + 10], [0, 1], clamp),
            }}
          >
            <div
              style={{
                flex: "0 0 auto",
                width: badge,
                height: badge,
                marginTop: (fontSize * 1.42 - badge) / 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                scale: interpolate(frame, [start, start + 12], [0.3, 1], { ...clamp, easing: backOut }),
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: "14%",
                  rotate: "45deg",
                  border: `1.4px solid ${COLORS.gold}`,
                  background: "rgba(3,69,47,0.6)",
                }}
              />
              <span
                style={{
                  position: "relative",
                  fontFamily: FONTS.title,
                  fontWeight: 700,
                  fontSize: Math.round(fontSize * 0.62),
                  color: COLORS.champagne,
                  lineHeight: 1,
                }}
              >
                {i + 1}
              </span>
            </div>
            <div
              style={{
                clipPath: `inset(-10% ${interpolate(frame, [start + 2, start + 20], [100, 0], { ...clamp, easing: easeOut })}% -10% 0)`,
                translate: interpolate(frame, [start + 2, start + 20], ["14px 0px", "0px 0px"], { ...clamp, easing: easeOut }),
              }}
            >
              <span style={{ fontWeight: 600, color: COLORS.ivory }}>{item.role}</span>
              <span style={{ color: COLORS.champagne }}>{item.separator ?? " — "}</span>
              <span style={{ color: COLORS.champagne, whiteSpace: item.detail.length <= 24 ? "nowrap" : "normal" }}>
                {item.detail}
              </span>
              {item.emphasis ? <span style={{ fontWeight: 700, color: COLORS.champagne }}> {item.emphasis}</span> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const RolesList = Interactive.create({
  Component: RolesListInner,
  layout: "absolute-fill",
  componentName: "ElegantRolesList",
  schema: {
    left: numberField("Left", 860),
    top: numberField("Top", 370),
    textWidth: numberField("Width", 860),
    fontSize: numberField("Font size", 24),
    gap: numberField("Row gap", 12),
    stagger: numberField("Frames between rows", 12),
  },
});

/* ------------------------------------------------------------------ */
/* Summary: anchored to the bottom of the panel                        */
/* ------------------------------------------------------------------ */

type SummaryProps = {
  readonly text: string;
  readonly left: number;
  readonly bottom: number;
  readonly textWidth: number;
  readonly fontSize: number;
};

const SummaryInner: React.FC<SummaryProps> = ({ text, left, bottom, textWidth, fontSize }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const label = "Profile:";
  const hasLabel = text.startsWith(label);

  return (
    <div style={{ position: "absolute", left, bottom, width: textWidth }}>
      <div
        style={{
          height: 1,
          marginBottom: 16,
          background: "linear-gradient(90deg, rgba(216,173,54,0.85), rgba(216,173,54,0))",
          scale: `${interpolate(frame, [0, 0.7 * fps], [0, 1], { ...clamp, easing: easeOut })} 1`,
          transformOrigin: "left center",
        }}
      />
      <div
        style={{
          fontFamily: FONTS.body,
          fontWeight: 500,
          fontSize,
          lineHeight: 1.45,
          color: COLORS.warmWhite,
          opacity: interpolate(frame, [0.3 * fps, 1.1 * fps], [0, 1], clamp),
          translate: interpolate(frame, [0.3 * fps, 1.1 * fps], ["0px 14px", "0px 0px"], { ...clamp, easing: easeOut }),
        }}
      >
        {hasLabel ? <span style={{ fontWeight: 700, color: COLORS.champagne }}>{label}</span> : null}
        {hasLabel ? text.slice(label.length) : text}
      </div>
    </div>
  );
};

export const Summary = Interactive.create({
  Component: SummaryInner,
  layout: "absolute-fill",
  componentName: "ElegantSummary",
  schema: {
    text: { type: "string", default: "", description: "Profile summary" },
    left: numberField("Left", 860),
    bottom: numberField("Bottom", 180),
    textWidth: numberField("Width", 860),
    fontSize: numberField("Font size", 24),
  },
});
