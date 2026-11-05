import { AbsoluteFill, Easing, Img, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONTS } from "../theme";

export type ProfileItem = {
  readonly role: string;
  readonly detail: string;
  /** Text between role and detail, exactly as written in the source slide. */
  readonly separator?: string;
  readonly emphasis?: string;
};

type Layout = {
  readonly colLeft: number;
  readonly colWidth: number;
  readonly maxHeight: number;
  readonly panelLeft: number;
  readonly panelWidth: number;
  readonly font: number;
  readonly gap: number;
  readonly nameSize: number;
  readonly padding: string;
  readonly numberWidth: number;
};

const NORMAL: Layout = {
  colLeft: 150,
  colWidth: 560,
  maxHeight: 620,
  panelLeft: 790,
  panelWidth: 1000,
  font: 26,
  gap: 13,
  nameSize: 56,
  padding: "52px 58px",
  numberWidth: 44,
};

const COMPACT: Layout = {
  colLeft: 80,
  colWidth: 540,
  maxHeight: 640,
  panelLeft: 700,
  panelWidth: 1130,
  font: 21,
  gap: 8,
  nameSize: 52,
  padding: "38px 52px",
  numberWidth: 46,
};

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const easeOut = Easing.bezier(0.22, 1, 0.36, 1);

const PAD = 18;

const chamfer = (w: number, h: number, c: number) =>
  `M${c} 0 H${w - c} L${w} ${c} V${h - c} L${w - c} ${h} H${c} L0 ${h - c} V${c}Z`;

type Rect = { left: number; top: number; width: number; height: number };

const portraitRect = (
  photoWidth: number,
  photoHeight: number,
  layout: Layout,
): Rect => {
  const scale = Math.min(layout.colWidth / photoWidth, layout.maxHeight / photoHeight);
  const width = Math.round(photoWidth * scale);
  const height = Math.round(photoHeight * scale);
  return {
    left: layout.colLeft + Math.round((layout.colWidth - width) / 2),
    top: Math.round(540 - height / 2),
    width,
    height,
  };
};

/* ------------------------------------------------------------------ */
/* Event label                                                         */
/* ------------------------------------------------------------------ */

const EventLabelInner: React.FC<{ readonly label: string }> = ({ label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        position: "absolute",
        top: 40,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: FONTS.title,
        fontWeight: 500,
        fontSize: 20,
        letterSpacing: "0.32em",
        color: COLORS.champagne,
        opacity: interpolate(frame, [0, 1 * fps], [0, 0.8], clamp),
      }}
    >
      {label}
    </div>
  );
};

export const EventLabel = Interactive.create({
  Component: EventLabelInner,
  layout: "absolute-fill",
  componentName: "EventLabel",
  schema: {
    label: { type: "string", default: "", description: "Label" },
  },
});

/* ------------------------------------------------------------------ */
/* Portrait                                                            */
/* ------------------------------------------------------------------ */

type PortraitProps = {
  readonly photo: string;
  readonly photoWidth: number;
  readonly photoHeight: number;
  readonly compact?: boolean;
};

const PortraitFrame: React.FC<{ readonly rect: Rect }> = ({ rect }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = rect.width + PAD * 2;
  const h = rect.height + PAD * 2;
  const drawn = interpolate(frame, [0.5 * fps, 1.9 * fps], [1, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const travel = interpolate(frame, [3.5 * fps, 6.5 * fps], [0, -1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const travelOpacity = interpolate(
    frame,
    [3.5 * fps, 4.1 * fps, 5.9 * fps, 6.5 * fps],
    [0, 1, 1, 0],
    clamp,
  );

  return (
    <svg
      width={w + 40}
      height={h + 40}
      viewBox={`-20 -20 ${w + 40} ${h + 40}`}
      style={{ position: "absolute", left: rect.left - PAD - 20, top: rect.top - PAD - 20 }}
    >
      <path d={chamfer(w, h, 26)} pathLength={1} fill="none" stroke={COLORS.gold} strokeWidth={3} strokeDasharray="1 1" strokeDashoffset={drawn} />
      <g transform="translate(10 10)" opacity={0.75}>
        <path d={chamfer(w - 20, h - 20, 18)} pathLength={1} fill="none" stroke={COLORS.champagne} strokeWidth={1.2} strokeDasharray="1 1" strokeDashoffset={drawn} />
      </g>
      <path
        d={chamfer(w, h, 26)}
        pathLength={1}
        fill="none"
        stroke={COLORS.ivory}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray="0.08 0.92"
        strokeDashoffset={travel}
        opacity={travelOpacity}
      />
      {[
        [0, 26],
        [w, 26],
        [0, h - 26],
        [w, h - 26],
      ].map(([x, y], i) => (
        <path
          key={i}
          d={`M${x} ${y - 7} L${x + 7} ${y} L${x} ${y + 7} L${x - 7} ${y}Z`}
          fill={COLORS.champagne}
          opacity={interpolate(frame, [1.7 * fps, 2.2 * fps], [0, 1], clamp)}
        />
      ))}
    </svg>
  );
};

const PortraitInner: React.FC<PortraitProps> = ({ photo, photoWidth, photoHeight, compact }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rect = portraitRect(photoWidth, photoHeight, compact ? COMPACT : NORMAL);
  const reveal = interpolate(frame, [0, 1.7 * fps], [0, 1], {
    ...clamp,
    easing: easeOut,
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: rect.left - 80,
          top: rect.top - 80,
          width: rect.width + 160,
          height: rect.height + 160,
          background: "radial-gradient(ellipse at center, rgba(242,215,122,0.18) 0%, rgba(242,215,122,0) 70%)",
          opacity: reveal,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,20,12,0.55)",
          opacity: reveal,
          clipPath: `inset(0 0 ${(1 - reveal) * 100}% 0)`,
        }}
      >
        <Img
          src={staticFile(photo)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            scale: interpolate(frame, [0, 8 * fps], [1.04, 1], {
              ...clamp,
              output: "perceptual-scale",
            }),
          }}
        />
      </div>
      <PortraitFrame rect={rect} />
    </AbsoluteFill>
  );
};

export const Portrait = Interactive.create({
  Component: PortraitInner,
  layout: "absolute-fill",
  componentName: "Portrait",
  schema: {
    photo: { type: "string", default: "", description: "Photo path inside public/" },
  },
});

/* ------------------------------------------------------------------ */
/* Details panel                                                       */
/* ------------------------------------------------------------------ */

type DetailsPanelProps = {
  readonly personName: string;
  readonly items: readonly ProfileItem[];
  readonly summary: string;
  /** Frames between list items appearing. */
  readonly stagger?: number;
  readonly compact?: boolean;
};

const Reveal: React.FC<{
  readonly start: number;
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({ start, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        ...style,
        opacity: interpolate(frame, [start, start + 0.6 * fps], [0, 1], clamp),
        translate: interpolate(frame, [start, start + 0.6 * fps], ["0px 22px", "0px 0px"], {
          ...clamp,
          easing: easeOut,
        }),
      }}
    >
      {children}
    </div>
  );
};

const SummaryText: React.FC<{ readonly text: string; readonly font: number }> = ({ text, font }) => {
  const label = "Profile:";
  const hasLabel = text.startsWith(label);
  return (
    <div
      style={{
        fontFamily: FONTS.body,
        fontWeight: 500,
        fontSize: font,
        lineHeight: 1.4,
        color: COLORS.champagne,
      }}
    >
      {hasLabel ? <span style={{ fontWeight: 700 }}>{label}</span> : null}
      {hasLabel ? text.slice(label.length) : text}
    </div>
  );
};

const DetailsPanelInner: React.FC<DetailsPanelProps> = ({
  personName,
  items,
  summary,
  stagger = 14,
  compact,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const layout = compact ? COMPACT : NORMAL;
  const divider = interpolate(frame, [1.4 * fps, 2.3 * fps], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const itemsStart = 2.1 * fps;
  const summaryStart = itemsStart + items.length * stagger + 0.3 * fps;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: layout.panelLeft,
          top: "50%",
          width: layout.panelWidth,
          boxSizing: "border-box",
          padding: layout.padding,
          translate: "0 -50%",
          background: "linear-gradient(135deg, rgba(7,91,60,0.62), rgba(3,69,47,0.78))",
          border: "1px solid rgba(216,173,54,0.5)",
          boxShadow: "0 30px 80px rgba(0,20,12,0.45)",
          opacity: interpolate(frame, [0, 1 * fps], [0, 1], clamp),
        }}
      >
        <Reveal start={0.5 * fps}>
          <div
            style={{
              fontFamily: FONTS.name,
              fontWeight: 700,
              fontSize: layout.nameSize,
              lineHeight: 1.22,
              color: COLORS.ivory,
              textWrap: "balance",
            }}
          >
            {personName}
          </div>
        </Reveal>

        <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "22px 0 24px" }}>
          <div
            style={{
              height: 2,
              width: 340,
              background: `linear-gradient(90deg, ${COLORS.gold}, rgba(216,173,54,0))`,
              scale: `${divider} 1`,
              transformOrigin: "left center",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              rotate: "45deg",
              backgroundColor: COLORS.champagne,
              opacity: divider,
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: layout.gap }}>
          {items.map((item, i) => (
            <Reveal key={i} start={itemsStart + i * stagger}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `${layout.numberWidth}px 1fr`,
                  fontFamily: FONTS.body,
                  fontSize: layout.font,
                  lineHeight: 1.36,
                  color: COLORS.warmWhite,
                }}
              >
                <div style={{ color: COLORS.champagne, fontWeight: 600 }}>{i + 1}.</div>
                <div>
                  <span style={{ fontWeight: 600, color: COLORS.ivory }}>{item.role}</span>
                  <span style={{ color: COLORS.champagne }}>{item.separator ?? " — "}</span>
                  <span
                    style={{
                      color: COLORS.champagne,
                      whiteSpace: item.detail.length <= 24 ? "nowrap" : "normal",
                    }}
                  >
                    {item.detail}
                  </span>
                  {item.emphasis ? (
                    <span style={{ fontWeight: 700, color: COLORS.champagne }}> {item.emphasis}</span>
                  ) : null}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal start={summaryStart} style={{ marginTop: 24 }}>
          <div
            style={{
              height: 1,
              marginBottom: 18,
              background: "linear-gradient(90deg, rgba(216,173,54,0.7), rgba(216,173,54,0))",
            }}
          />
          <SummaryText text={summary} font={layout.font} />
        </Reveal>
      </div>
    </AbsoluteFill>
  );
};

export const DetailsPanel = Interactive.create({
  Component: DetailsPanelInner,
  layout: "absolute-fill",
  componentName: "DetailsPanel",
  schema: {
    personName: { type: "string", default: "", description: "Name" },
    summary: { type: "string", default: "", description: "Profile summary" },
    stagger: {
      type: "number",
      default: 14,
      min: 1,
      step: 1,
      integer: true,
      description: "Frames between list items",
      keyframable: false,
      hiddenFromList: false,
    },
  },
});
