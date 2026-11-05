import { AbsoluteFill, Easing, Img, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../../theme";
import { diamond, starPolygon, starburst } from "../../elegant/geometry";

type Props = {
  readonly photo: string;
  readonly photoWidth: number;
  readonly photoHeight: number;
  readonly centerX: number;
  readonly centerY: number;
  readonly maxWidth: number;
  readonly maxHeight: number;
  /** Corner radius of the photo. */
  readonly radius: number;
  /** Width of the soft fade at the photo edges. */
  readonly feather: number;
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
const backOut = Easing.bezier(0.34, 1.5, 0.64, 1);

const numberField = (description: string, def: number) =>
  ({
    type: "number",
    default: def,
    step: 1,
    description,
    keyframable: false,
    hiddenFromList: false,
  }) as const;

/** Rounded-rectangle outline starting at the top centre, so the stroke draws out symmetrically. */
const roundedRect = (cx: number, cy: number, w: number, h: number, r: number) => {
  const x1 = cx - w / 2;
  const x2 = cx + w / 2;
  const y1 = cy - h / 2;
  const y2 = cy + h / 2;
  return `M${cx} ${y1} H${x2 - r} A${r} ${r} 0 0 1 ${x2} ${y1 + r} V${y2 - r} A${r} ${r} 0 0 1 ${x2 - r} ${y2} H${x1 + r} A${r} ${r} 0 0 1 ${x1} ${y2 - r} V${y1 + r} A${r} ${r} 0 0 1 ${x1 + r} ${y1} Z`;
};

/** Small pointed arch (mihrab crown) sitting on the top edge of the frame. */
const crown = (cx: number, base: number, half: number, rise: number) =>
  `M${cx - half} ${base} C${cx - half * 0.55} ${base - rise * 0.15} ${cx - half * 0.2} ${base - rise * 0.6} ${cx} ${base - rise} C${cx + half * 0.2} ${base - rise * 0.6} ${cx + half * 0.55} ${base - rise * 0.15} ${cx + half} ${base}`;

const SoftPortraitInner: React.FC<Props> = ({
  photo,
  photoWidth,
  photoHeight,
  centerX,
  centerY,
  maxWidth,
  maxHeight,
  radius,
  feather,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = Math.min(maxWidth / photoWidth, maxHeight / photoHeight);
  const w = Math.round(photoWidth * scale);
  const h = Math.round(photoHeight * scale);
  const cx = centerX;
  const cy = centerY;
  const outerGap = 18;
  const innerGap = 8;
  const outerR = radius + outerGap;
  const top = cy - h / 2 - outerGap;
  const bottom = cy + h / 2 + outerGap;
  const ringR = Math.hypot(w, h) / 2 + 52;

  const drawn = interpolate(frame, [0, 1.2 * fps], [1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const innerDrawn = interpolate(frame, [0.15 * fps, 1.35 * fps], [1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const reveal = interpolate(frame, [0.3 * fps, 1.5 * fps], [-25, 100], { ...clamp, easing: easeOut });
  const accents = interpolate(frame, [0.9 * fps, 1.4 * fps], [0, 1], { ...clamp, easing: backOut });
  const base = interpolate(frame, [0.7 * fps, 1.4 * fps], [0, 1], { ...clamp, easing: easeOut });
  const ring = interpolate(frame, [0.2 * fps, 1.6 * fps], [0, 1], { ...clamp, easing: easeOut });
  const travel = interpolate(frame, [2.4 * fps, 4.6 * fps], [0.04, -0.96], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const travelOpacity = interpolate(frame, [2.4 * fps, 2.8 * fps, 4.2 * fps, 4.6 * fps], [0, 1, 1, 0], clamp);
  const pulse = 0.8 + 0.2 * Math.sin(frame / 16);

  // Feathered edges on all four sides, intersected with a bottom-up reveal wipe.
  const edgeX = `linear-gradient(to right, transparent 0px, #000 ${feather}px, #000 calc(100% - ${feather}px), transparent 100%)`;
  const edgeY = `linear-gradient(to bottom, transparent 0px, #000 ${feather}px, #000 calc(100% - ${feather}px), transparent 100%)`;
  const wipe = `linear-gradient(to top, #000 ${reveal}%, transparent ${reveal + 25}%)`;

  const corner = (sx: number, sy: number) => {
    const ox = cx + sx * (w / 2 + outerGap - outerR * (1 - Math.SQRT1_2));
    const oy = cy + sy * (h / 2 + outerGap - outerR * (1 - Math.SQRT1_2));
    return { x: ox + sx * 7, y: oy + sy * 7 };
  };

  return (
    <AbsoluteFill style={{ translate: interpolate(frame, [0, 10 * fps], ["0px 8px", "0px -8px"], clamp) }}>
      <div
        style={{
          position: "absolute",
          left: cx - ringR - 80,
          top: cy - ringR - 80,
          width: (ringR + 80) * 2,
          height: (ringR + 80) * 2,
          background: "radial-gradient(circle, rgba(242,215,122,0.22) 0%, rgba(22,180,112,0.14) 38%, rgba(0,0,0,0) 68%)",
          opacity: interpolate(frame, [0, 1.2 * fps], [0, 1], clamp) * pulse,
        }}
      />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: ring }}>
        <g transform={`rotate(${frame * 0.12} ${cx} ${cy})`}>
          <circle cx={cx} cy={cy} r={ringR} fill="none" stroke={COLORS.gold} strokeWidth={1} strokeDasharray="2 12" opacity={0.45} />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <path key={i} d={diamond(cx + ringR * Math.cos(a), cy + ringR * Math.sin(a), 4)} fill={COLORS.champagne} opacity={0.55} />;
          })}
        </g>
        <g transform={`rotate(${-frame * 0.07} ${cx} ${cy})`}>
          <circle cx={cx} cy={cy} r={ringR + 22} fill="none" stroke={COLORS.gold} strokeWidth={0.8} strokeDasharray="60 18 4 18" opacity={0.3} />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          left: cx - w / 2,
          top: cy - h / 2,
          width: w,
          height: h,
          borderRadius: radius,
          overflow: "hidden",
          WebkitMaskImage: `${edgeX}, ${edgeY}, ${wipe}`,
          maskImage: `${edgeX}, ${edgeY}, ${wipe}`,
          WebkitMaskComposite: "source-in, source-in",
          maskComposite: "intersect",
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
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: radius,
            boxShadow: `inset 0 0 ${feather * 1.6}px rgba(3,69,47,0.55)`,
          }}
        />
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path
          d={roundedRect(cx, cy, w + outerGap * 2, h + outerGap * 2, outerR)}
          pathLength={1}
          fill="none"
          stroke={COLORS.gold}
          strokeWidth={2.4}
          strokeDasharray="1 1"
          strokeDashoffset={drawn}
        />
        <path
          d={roundedRect(cx, cy, w + innerGap * 2, h + innerGap * 2, radius + innerGap)}
          pathLength={1}
          fill="none"
          stroke={COLORS.champagne}
          strokeWidth={1}
          strokeDasharray="1 1"
          strokeDashoffset={innerDrawn}
          opacity={0.6}
        />
        <path
          d={roundedRect(cx, cy, w + outerGap * 2, h + outerGap * 2, outerR)}
          pathLength={1}
          fill="none"
          stroke={COLORS.ivory}
          strokeWidth={3.4}
          strokeLinecap="round"
          strokeDasharray="0.06 0.94"
          strokeDashoffset={travel}
          opacity={travelOpacity}
        />
        {[
          [-1, -1],
          [1, -1],
          [-1, 1],
          [1, 1],
        ].map(([sx, sy]) => {
          const p = corner(sx, sy);
          return (
            <g key={`${sx}${sy}`} transform={`translate(${p.x} ${p.y}) scale(${accents})`}>
              <path d={starburst(0, 0, 9, 3, 4)} fill={COLORS.champagne} />
            </g>
          );
        })}
        <g opacity={accents}>
          <path d={crown(cx, top, 74, 56)} fill={COLORS.deep} stroke={COLORS.gold} strokeWidth={2} />
          <path d={crown(cx, top, 56, 40)} fill="none" stroke={COLORS.champagne} strokeWidth={0.9} opacity={0.7} />
        </g>
        <g transform={`translate(${cx} ${top - 22}) scale(${accents}) rotate(${frame * 0.4})`}>
          <path d={starPolygon(0, 0, 14, 8, 3)} fill="none" stroke={COLORS.champagne} strokeWidth={1.1} />
          <path d={starburst(0, 0, 4.5, 2, 8)} fill={COLORS.champagne} />
        </g>
        <line
          x1={cx - (w / 2 + outerGap + 40) * base}
          y1={bottom + 16}
          x2={cx + (w / 2 + outerGap + 40) * base}
          y2={bottom + 16}
          stroke={COLORS.gold}
          strokeWidth={1.2}
        />
        <path d={diamond(cx, bottom + 16, 6)} fill={COLORS.champagne} opacity={base} />
      </svg>
    </AbsoluteFill>
  );
};

/** Photo with rounded, feathered edges inside a double gold frame, mihrab crown and slow orbit ring. */
export const SoftPortrait = Interactive.create({
  Component: SoftPortraitInner,
  layout: "absolute-fill",
  componentName: "BumperSoftPortrait",
  schema: {
    photo: { type: "string", default: "", description: "Photo path inside public/" },
    centerX: numberField("Centre X", 470),
    centerY: numberField("Centre Y", 560),
    maxWidth: numberField("Max photo width", 420),
    maxHeight: numberField("Max photo height", 540),
    radius: numberField("Corner radius", 36),
    feather: numberField("Edge softness", 30),
  },
});
